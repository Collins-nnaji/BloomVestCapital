import { useCallback, useEffect, useRef, useState } from 'react';
import { api, ensureApiBase } from '../api';

const CACHE_KEY = 'bv_landing_feed_v3';
const CACHE_TTL_MS = 5 * 60 * 1000;
const REFRESH_MS = 5 * 60 * 1000;

function cacheHasData(market, movers) {
  if (market?.crypto?.length || market?.us?.length || market?.ngx?.length) return true;
  if (market?.forex?.USDNGN) return true;
  if (movers?.avMovers?.gainers?.length || movers?.avMovers?.losers?.length) return true;
  if (movers?.catalysts?.length) return true;
  return false;
}

function readCache() {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { at, market, movers } = JSON.parse(raw);
    if (Date.now() - at > CACHE_TTL_MS) return null;
    if (!cacheHasData(market, movers)) return null;
    return { market, movers, cachedAt: at };
  } catch {
    return null;
  }
}

function writeCache(market, movers) {
  try {
    sessionStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ at: Date.now(), market, movers })
    );
  } catch {
    /* quota exceeded — skip */
  }
}

/**
 * Fetches market-data + movers once per session (5 min client + server cache).
 * No database writes — purely API reads with in-memory server caching.
 */
export default function useLiveMarketFeed() {
  const [market, setMarket] = useState(null);
  const [movers, setMovers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const fetching = useRef(false);

  const load = useCallback(async (force = false) => {
    if (fetching.current) return;
    if (!force) {
      const cached = readCache();
      if (cached) {
        setMarket(cached.market);
        setMovers(cached.movers);
        setLastUpdated(cached.cachedAt);
        setLoading(false);
        return;
      }
    }
    fetching.current = true;
    setLoading(true);
    try {
      await ensureApiBase();
      const [marketRes, moversRes] = await Promise.all([
        api.getMarketData().catch(() => null),
        api.getMovers().catch(() => null),
      ]);
      if (marketRes && !marketRes.error) setMarket(marketRes);
      if (moversRes && !moversRes.error) setMovers(moversRes);
      if (cacheHasData(marketRes, moversRes)) {
        writeCache(marketRes, moversRes);
      }
      setLastUpdated(Date.now());
      setError(null);
    } catch (e) {
      setError(e.message || 'Failed to load market data');
    } finally {
      setLoading(false);
      fetching.current = false;
    }
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') load(true);
    }, REFRESH_MS);
    const onVisible = () => {
      if (document.visibilityState === 'visible') {
        const cached = readCache();
        if (!cached) load(true);
      }
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [load]);

  return { market, movers, loading, error, lastUpdated, refresh: () => load(true) };
}
