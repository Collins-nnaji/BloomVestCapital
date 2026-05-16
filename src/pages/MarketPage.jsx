import React, { useState, useEffect, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaChartLine, FaBitcoin, FaExchangeAlt, FaSyncAlt,
  FaCaretUp, FaCaretDown, FaGlobeAfrica,
} from 'react-icons/fa';
import { api } from '../api';

/* ── animations ─────────────────────────────────── */
const spinAnim = keyframes`to { transform: rotate(360deg); }`;
const pulse    = keyframes`0%,100%{opacity:1}50%{opacity:.4}`;

/* ── layout ──────────────────────────────────────── */
const Page = styled.div`
  min-height: ${(p) => (p.$embedded ? 'auto' : '100vh')};
  background: #f8fafc;
  font-family: 'Inter', system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  padding-top: ${(p) => (p.$embedded ? 0 : '64px')};
  color: #0f172a;
`;

const EmbeddedToolbar = styled.div`
  max-width: 1320px;
  margin: 0 auto;
  padding: 0.75rem 1.5rem 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const Header = styled.div`
  padding: 1.25rem 1.5rem 0;
  max-width: 1320px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

const TitleGroup = styled.div``;

const Brand = styled.div`
  font-size: 0.7rem;
  font-weight: 700;
  color: #10b981;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  margin-bottom: 0.2rem;
`;

const PageTitle = styled.h1`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.4rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
`;

const Meta = styled.div`
  font-size: 0.72rem;
  color: #94a3b8;
  margin-top: 0.2rem;
  span { color: #64748b; font-weight: 600; }
`;

const RefreshBtn = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 0.9rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #ffffff;
  color: #64748b;
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s;

  &:hover { border-color: #cbd5e1; color: #0f172a; }
  svg.spin { animation: ${spinAnim} 0.85s linear infinite; }
`;

const Body = styled.div`
  max-width: 1320px;
  margin: 1.25rem auto 3rem;
  padding: 0 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

/* ── section ─────────────────────────────────────── */
const Section = styled.div``;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.9rem;
`;

const SectionIcon = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 7px;
  background: ${p => p.$bg || '#f1f5f9'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  color: ${p => p.$color || '#64748b'};
`;

const SectionTitle = styled.h2`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.88rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const SectionSub = styled.span`
  font-size: 0.72rem;
  color: #94a3b8;
  font-weight: 500;
`;

/* ── card grid ───────────────────────────────────── */
const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.75rem;
`;

const Card = styled(motion.div)`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1rem 1.1rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  transition: box-shadow 0.2s, border-color 0.2s;

  &:hover {
    box-shadow: 0 4px 16px rgba(0,0,0,0.06);
    border-color: #cbd5e1;
  }
`;

const CardTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

const Ticker = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.85rem;
  font-weight: 800;
  color: #0f172a;
`;

const CardName = styled.div`
  font-size: 0.7rem;
  color: #94a3b8;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Price = styled.div`
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.15rem;
  font-weight: 700;
  color: #0f172a;
  margin-top: 0.15rem;
`;

const Change = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  font-size: 0.78rem;
  font-weight: 700;
  color: ${p => p.$up ? '#16a34a' : '#dc2626'};
  background: ${p => p.$up ? 'rgba(22,163,74,0.08)' : 'rgba(220,38,38,0.08)'};
  padding: 0.15rem 0.45rem;
  border-radius: 5px;
`;

const CategoryBadge = styled.span`
  font-size: 0.62rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${p => p.$color || '#64748b'};
  background: ${p => p.$bg || '#f1f5f9'};
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
`;

/* ── forex grid ──────────────────────────────────── */
const ForexGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 0.75rem;
`;

const ForexCard = styled(motion.div)`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1rem 1.1rem;
  transition: box-shadow 0.2s, border-color 0.2s;

  &:hover {
    box-shadow: 0 4px 16px rgba(0,0,0,0.06);
    border-color: #cbd5e1;
  }
`;

const ForexPair = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.8rem;
  font-weight: 800;
  color: #64748b;
  margin-bottom: 0.35rem;
`;

const ForexRate = styled.div`
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.1rem;
  font-weight: 700;
  color: #0f172a;
`;

const ForexLabel = styled.div`
  font-size: 0.68rem;
  color: #94a3b8;
  margin-top: 0.15rem;
`;

/* ── skeleton ────────────────────────────────────── */
const Skeleton = styled.div`
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 200% 100%;
  animation: ${pulse} 1.5s ease infinite;
  border-radius: 8px;
  height: ${p => p.$h || '16px'};
  width: ${p => p.$w || '100%'};
`;

const SkeletonCard = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1rem 1.1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ErrorBox = styled.div`
  background: rgba(220,38,38,0.06);
  border: 1px solid rgba(220,38,38,0.15);
  border-radius: 10px;
  padding: 1rem 1.25rem;
  font-size: 0.82rem;
  color: #b91c1c;
  font-weight: 600;
`;

/* ── helpers ─────────────────────────────────────── */
function formatPrice(val, prefix = '$') {
  if (val == null || isNaN(val)) return '—';
  if (val >= 1000) return `${prefix}${val.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
  if (val >= 1)    return `${prefix}${val.toFixed(2)}`;
  return `${prefix}${val.toFixed(4)}`;
}

function formatChangePct(pct) {
  if (pct == null || isNaN(pct)) return null;
  return `${pct >= 0 ? '+' : ''}${pct.toFixed(2)}%`;
}

function shortSymbol(sym) {
  // Strip exchange suffixes like .LAG for display
  return sym.replace(/\.[A-Z]+$/, '');
}

const NGX_NAMES = {
  'DANGCEM.LAG': 'Dangote Cement',
  'MTNN.LAG':    'MTN Nigeria',
  'GTCO.LAG':    'GT Bank',
};

/* ── component ───────────────────────────────────── */
export default function MarketPage({ embedded = false }) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [lastFetched, setLastFetched] = useState(null);

  const load = useCallback(async (force = false) => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.getMarketData();
      setData(result);
      setLastFetched(new Date());
    } catch (e) {
      setError(e.message || 'Failed to load market data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const formatTime = (d) =>
    d ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—';

  const skeletonCards = (n) =>
    Array.from({ length: n }, (_, i) => (
      <SkeletonCard key={i}>
        <Skeleton $h="12px" $w="60px" />
        <Skeleton $h="10px" $w="80%" />
        <Skeleton $h="22px" $w="90px" style={{ marginTop: '0.3rem' }} />
        <Skeleton $h="18px" $w="55px" />
      </SkeletonCard>
    ));

  return (
    <Page $embedded={embedded}>
      {!embedded ? (
        <Header>
          <TitleGroup>
            <Brand>BloomVest Markets</Brand>
            <PageTitle>Live Market Data</PageTitle>
            <Meta>
              Africa-focused · NGX · Crypto · Forex
              {lastFetched && <> · Updated <span>{formatTime(lastFetched)}</span></>}
              {data?.cached && <> · <span style={{ color: '#f59e0b' }}>cached</span></>}
            </Meta>
          </TitleGroup>
          <RefreshBtn
            whileTap={{ scale: 0.96 }}
            onClick={() => load(true)}
            disabled={loading}
          >
            <FaSyncAlt className={loading ? 'spin' : ''} />
            {loading ? 'Loading…' : 'Refresh'}
          </RefreshBtn>
        </Header>
      ) : (
        <EmbeddedToolbar>
          <RefreshBtn
            whileTap={{ scale: 0.96 }}
            onClick={() => load(true)}
            disabled={loading}
          >
            <FaSyncAlt className={loading ? 'spin' : ''} />
            {loading ? 'Loading…' : 'Refresh markets'}
          </RefreshBtn>
        </EmbeddedToolbar>
      )}

      <Body>
        {error && <ErrorBox>{error}</ErrorBox>}

        {/* NGX Stocks */}
        <Section>
          <SectionHeader>
            <SectionIcon $bg="rgba(16,185,129,0.1)" $color="#10b981">
              <FaGlobeAfrica />
            </SectionIcon>
            <SectionTitle>NGX Stocks</SectionTitle>
            <SectionSub>Nigerian Exchange · Top listings</SectionSub>
          </SectionHeader>

          <CardGrid>
            <AnimatePresence mode="wait">
              {loading
                ? skeletonCards(3)
                : (data?.ngx?.length
                    ? data.ngx.map(q => (
                        <Card
                          key={q.symbol}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.25 }}
                        >
                          <CardTop>
                            <div>
                              <Ticker>{shortSymbol(q.symbol)}</Ticker>
                              <CardName>{NGX_NAMES[q.symbol] || q.symbol}</CardName>
                            </div>
                            <CategoryBadge $color="#065f46" $bg="rgba(16,185,129,0.1)">NGX</CategoryBadge>
                          </CardTop>
                          <Price>{formatPrice(q.price, '₦')}</Price>
                          {q.changePct != null && (
                            <Change $up={q.changePct >= 0}>
                              {q.changePct >= 0 ? <FaCaretUp /> : <FaCaretDown />}
                              {formatChangePct(q.changePct)}
                            </Change>
                          )}
                        </Card>
                      ))
                    : !error && (
                        <div style={{ color: '#94a3b8', fontSize: '0.82rem', padding: '0.5rem 0' }}>
                          NGX data unavailable — Alpha Vantage free tier may have reached its daily limit.
                        </div>
                      )
                  )
              }
            </AnimatePresence>
          </CardGrid>
        </Section>

        {/* US Stocks */}
        <Section>
          <SectionHeader>
            <SectionIcon $bg="rgba(99,102,241,0.1)" $color="#6366f1">
              <FaChartLine />
            </SectionIcon>
            <SectionTitle>US Stocks</SectionTitle>
            <SectionSub>NASDAQ / NYSE · Selected picks</SectionSub>
          </SectionHeader>

          <CardGrid>
            <AnimatePresence mode="wait">
              {loading
                ? skeletonCards(2)
                : (data?.us?.length
                    ? data.us.map(q => (
                        <Card
                          key={q.symbol}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.25 }}
                        >
                          <CardTop>
                            <div>
                              <Ticker>{shortSymbol(q.symbol)}</Ticker>
                              <CardName>{q.symbol}</CardName>
                            </div>
                            <CategoryBadge $color="#3730a3" $bg="rgba(99,102,241,0.1)">US</CategoryBadge>
                          </CardTop>
                          <Price>{formatPrice(q.price)}</Price>
                          {q.changePct != null && (
                            <Change $up={q.changePct >= 0}>
                              {q.changePct >= 0 ? <FaCaretUp /> : <FaCaretDown />}
                              {formatChangePct(q.changePct)}
                            </Change>
                          )}
                        </Card>
                      ))
                    : !error && (
                        <div style={{ color: '#94a3b8', fontSize: '0.82rem', padding: '0.5rem 0' }}>
                          US stock data unavailable — Alpha Vantage daily limit may be reached.
                        </div>
                      )
                  )
              }
            </AnimatePresence>
          </CardGrid>
        </Section>

        {/* Crypto */}
        <Section>
          <SectionHeader>
            <SectionIcon $bg="rgba(245,158,11,0.1)" $color="#f59e0b">
              <FaBitcoin />
            </SectionIcon>
            <SectionTitle>Crypto</SectionTitle>
            <SectionSub>CoinGecko · 24h change</SectionSub>
          </SectionHeader>

          <CardGrid>
            <AnimatePresence mode="wait">
              {loading
                ? skeletonCards(4)
                : (data?.crypto?.length
                    ? data.crypto.map(q => (
                        <Card
                          key={q.symbol}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.25 }}
                        >
                          <CardTop>
                            <div>
                              <Ticker>{q.symbol}</Ticker>
                              <CardName>{q.name}</CardName>
                            </div>
                            <CategoryBadge $color="#92400e" $bg="rgba(245,158,11,0.1)">CRYPTO</CategoryBadge>
                          </CardTop>
                          <Price>{formatPrice(q.price)}</Price>
                          {q.changePct != null && (
                            <Change $up={q.changePct >= 0}>
                              {q.changePct >= 0 ? <FaCaretUp /> : <FaCaretDown />}
                              {formatChangePct(q.changePct)}
                            </Change>
                          )}
                        </Card>
                      ))
                    : !error && (
                        <div style={{ color: '#94a3b8', fontSize: '0.82rem', padding: '0.5rem 0' }}>
                          Crypto data unavailable.
                        </div>
                      )
                  )
              }
            </AnimatePresence>
          </CardGrid>
        </Section>

        {/* Forex */}
        <Section>
          <SectionHeader>
            <SectionIcon $bg="rgba(59,130,246,0.1)" $color="#3b82f6">
              <FaExchangeAlt />
            </SectionIcon>
            <SectionTitle>Forex</SectionTitle>
            <SectionSub>USD base · African currencies</SectionSub>
          </SectionHeader>

          <ForexGrid>
            <AnimatePresence mode="wait">
              {loading
                ? skeletonCards(4)
                : (data?.forex
                    ? [
                        { pair: 'USD / NGN', rate: data.forex.USDNGN, label: 'Nigerian Naira' },
                        { pair: 'USD / GHS', rate: data.forex.USDGHS, label: 'Ghanaian Cedi' },
                        { pair: 'USD / KES', rate: data.forex.USDKES, label: 'Kenyan Shilling' },
                        { pair: 'USD / ZAR', rate: data.forex.USDZAR, label: 'South African Rand' },
                      ].map(({ pair, rate, label }) => (
                        <ForexCard
                          key={pair}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.25 }}
                        >
                          <ForexPair>{pair}</ForexPair>
                          <ForexRate>
                            {rate != null ? rate.toLocaleString(undefined, { maximumFractionDigits: 2 }) : '—'}
                          </ForexRate>
                          <ForexLabel>{label}</ForexLabel>
                        </ForexCard>
                      ))
                    : !error && (
                        <div style={{ color: '#94a3b8', fontSize: '0.82rem', padding: '0.5rem 0' }}>
                          Forex data unavailable.
                        </div>
                      )
                  )
              }
            </AnimatePresence>
          </ForexGrid>
        </Section>

        {/* Disclaimer */}
        <div style={{ fontSize: '0.68rem', color: '#94a3b8', lineHeight: 1.5 }}>
          Market data is sourced from Alpha Vantage, CoinGecko, and ExchangeRate-API. Data may be delayed
          or unavailable due to free-tier rate limits. This is not financial advice.
        </div>
      </Body>
    </Page>
  );
}
