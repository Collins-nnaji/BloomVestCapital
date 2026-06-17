import React, { useEffect, useMemo, useState } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FaArrowDown, FaArrowUp, FaSync, FaChartLine } from 'react-icons/fa';

const pulse = keyframes`0%,100%{opacity:1}50%{opacity:.35}`;
const spin = keyframes`from{transform:rotate(0deg)}to{transform:rotate(360deg)}`;

const Rail = styled.aside`
  width: 100%;
  max-width: 300px;
  display: flex;
  flex-direction: column;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.97);
  border: 1px solid rgba(226, 232, 240, 0.9);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  font-family: 'DM Sans', sans-serif;
  color: #0f172a;
  flex: 0 0 auto;
  height: auto;

  @media (max-width: 1100px) {
    max-width: 100%;
  }
`;

const RailHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.6rem 0.85rem;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
  flex-shrink: 0;
`;

const RailTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: 0.82rem;
  color: #0f172a;
`;

const LiveDot = styled.span`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #22c55e;
  animation: ${pulse} 1.8s ease-in-out infinite;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const TabRow = styled.div`
  display: flex;
  gap: 0.25rem;
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid #e2e8f0;
  background: #fff;
`;

const Tab = styled.button`
  flex: 1;
  padding: 0.4rem 0.5rem;
  border: none;
  border-radius: 8px;
  font-size: 0.72rem;
  font-weight: 700;
  font-family: 'Space Grotesk', sans-serif;
  cursor: pointer;
  background: ${(p) => (p.$active ? '#0f172a' : 'transparent')};
  color: ${(p) => (p.$active ? '#fff' : '#64748b')};
  transition: background 0.15s, color 0.15s;
  &:hover {
    background: ${(p) => (p.$active ? '#0f172a' : '#f1f5f9')};
  }
`;

const IconBtn = styled.button`
  width: 28px;
  height: 28px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: #fff;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.7rem;
  transition: color 0.15s, border-color 0.15s;
  &:hover {
    color: #0f172a;
    border-color: #cbd5e1;
  }
  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`;

const SpinIcon = styled(FaSync)`
  ${(p) =>
    p.$spinning &&
    css`
      animation: ${spin} 1s linear infinite;
    `}
`;

const TableHead = styled.div`
  display: grid;
  grid-template-columns: 1fr 72px 56px;
  gap: 0.25rem;
  padding: 0.35rem 1rem;
  font-size: 0.62rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #94a3b8;
  border-bottom: 1px solid #f1f5f9;
`;

const ScrollBody = styled.div`
  overflow-y: auto;
  flex: ${(p) => (p.$fitContent ? '0 0 auto' : '1')};
  min-height: ${(p) => (p.$fitContent ? 'unset' : '0')};
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }
`;

const GroupLabel = styled.div`
  padding: 0.5rem 1rem 0.25rem;
  font-size: 0.6rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #94a3b8;
  background: #fafbfc;
  border-bottom: 1px solid #f1f5f9;
  position: sticky;
  top: 0;
  z-index: 1;
`;

const Row = styled.button`
  display: grid;
  grid-template-columns: 1fr 72px 56px;
  gap: 0.25rem;
  width: 100%;
  padding: 0.55rem 1rem;
  border: none;
  border-bottom: 1px solid #f8fafc;
  background: ${(p) => (p.$selected ? 'rgba(34,197,94,0.06)' : '#fff')};
  cursor: pointer;
  text-align: left;
  transition: background 0.12s;
  &:hover {
    background: ${(p) => (p.$selected ? 'rgba(34,197,94,0.08)' : '#f8fafc')};
  }
`;

const SymCell = styled.div`
  display: flex;
  align-items: center;
  gap: 0.45rem;
  min-width: 0;
`;

const SymIcon = styled.div`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: ${(p) => p.$bg || '#e2e8f0'};
  color: ${(p) => p.$color || '#475569'};
  font-size: 0.55rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-family: 'Space Grotesk', sans-serif;
`;

const SymName = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: 0.78rem;
  color: #0f172a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PriceCell = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  color: #334155;
  text-align: right;
  font-variant-numeric: tabular-nums;
`;

const ChgCell = styled.div`
  font-size: 0.72rem;
  font-weight: 700;
  text-align: right;
  color: ${(p) => (p.$up ? '#16a34a' : p.$down ? '#dc2626' : '#64748b')};
  font-variant-numeric: tabular-nums;
`;

const DetailPanel = styled.div`
  border-top: 1px solid #e2e8f0;
  padding: ${(p) => (p.$fitContent ? '0.5rem 0.75rem 0.55rem' : '0.55rem 0.75rem')};
  background: linear-gradient(180deg, #f8fafc 0%, #fff 100%);
  flex-shrink: 0;
`;

const DetailTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: ${(p) => (p.$fitContent ? '0.35rem' : '0.65rem')};
`;

const DetailSym = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 800;
  font-size: 1.1rem;
  color: #0f172a;
`;

const DetailSub = styled.div`
  font-size: 0.68rem;
  color: #64748b;
  margin-top: 0.1rem;
`;

const DetailPrice = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 800;
  font-size: 1.1rem;
  color: #0f172a;
  font-variant-numeric: tabular-nums;
`;

const DetailChg = styled.div`
  font-size: 0.78rem;
  font-weight: 700;
  color: ${(p) => (p.$up ? '#16a34a' : p.$down ? '#dc2626' : '#64748b')};
  text-align: right;
`;

const Sparkline = styled.svg`
  width: 100%;
  height: ${(p) => (p.$compact ? '32px' : '48px')};
  margin: ${(p) => (p.$compact ? '0.25rem 0' : '0.5rem 0')};
  display: block;
`;

const InsightBox = styled.div`
  padding: ${(p) => (p.$compact ? '0.45rem 0.6rem' : '0.6rem 0.75rem')};
  border-radius: ${(p) => (p.$compact ? '8px' : '10px')};
  background: rgba(56, 189, 248, 0.08);
  border: 1px solid rgba(56, 189, 248, 0.2);
  font-size: ${(p) => (p.$compact ? '0.68rem' : '0.72rem')};
  line-height: 1.4;
  color: #334155;
  margin-top: ${(p) => (p.$compact ? '0.35rem' : '0.5rem')};
  display: -webkit-box;
  -webkit-line-clamp: ${(p) => (p.$compact ? 2 : 4)};
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const MoodBadge = styled.span`
  display: inline-block;
  padding: 0.15rem 0.5rem;
  border-radius: 100px;
  font-size: 0.62rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: ${(p) =>
    p.$mood === 'Risk-On'
      ? 'rgba(34,197,94,0.12)'
      : p.$mood === 'Risk-Off'
        ? 'rgba(239,68,68,0.1)'
        : 'rgba(99,102,241,0.1)'};
  color: ${(p) =>
    p.$mood === 'Risk-On' ? '#15803d' : p.$mood === 'Risk-Off' ? '#b91c1c' : '#4f46e5'};
`;

const FooterLink = styled.button`
  width: 100%;
  margin-top: ${(p) => (p.$compact ? '0.4rem' : '0.6rem')};
  padding: ${(p) => (p.$compact ? '0.45rem' : '0.55rem')};
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: #fff;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.72rem;
  font-weight: 700;
  color: #0f172a;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  transition: border-color 0.15s, background 0.15s;
  &:hover {
    border-color: #22c55e;
    background: rgba(34, 197, 94, 0.04);
  }
`;

const Skeleton = styled.div`
  height: ${(p) => p.$h || '36px'};
  margin: 0.35rem 1rem;
  border-radius: 8px;
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 200% 100%;
  animation: shimmer 1.2s infinite;
  @keyframes shimmer {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;

const Updated = styled.span`
  font-size: 0.62rem;
  color: #94a3b8;
`;

const ICON_COLORS = {
  BTC: { bg: '#fef3c7', color: '#d97706' },
  ETH: { bg: '#ede9fe', color: '#7c3aed' },
  SOL: { bg: '#cffafe', color: '#0891b2' },
  BNB: { bg: '#fef9c3', color: '#ca8a04' },
  USDNGN: { bg: '#dcfce7', color: '#16a34a' },
};

function parsePct(val) {
  if (val == null) return null;
  if (typeof val === 'number') return val;
  const n = parseFloat(String(val).replace('%', ''));
  return Number.isFinite(n) ? n : null;
}

function fmtPrice(n, sym) {
  if (n == null || !Number.isFinite(Number(n))) return '—';
  const v = Number(n);
  if (sym === 'USDNGN' || v > 1000) return v.toLocaleString(undefined, { maximumFractionDigits: 2 });
  if (v < 1) return v.toFixed(4);
  return v.toFixed(2);
}

function fmtChg(pct) {
  const n = parsePct(pct);
  if (n == null) return '—';
  const sign = n > 0 ? '+' : '';
  return `${sign}${n.toFixed(2)}%`;
}

function buildSparkPoints(changePct, up) {
  const base = 24;
  const drift = up ? -6 : 6;
  return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => {
    const noise = Math.sin(i * 1.3) * 3 + Math.cos(i * 0.7) * 2;
    const trend = (i / 11) * drift;
    return base + trend + noise;
  });
}

function SparkChart({ changePct, $compact }) {
  const pct = parsePct(changePct) ?? 0;
  const up = pct >= 0;
  const pts = buildSparkPoints(pct, up);
  const w = 280;
  const h = $compact ? 32 : 48;
  const minY = Math.min(...pts);
  const maxY = Math.max(...pts);
  const range = maxY - minY || 1;
  const path = pts
    .map((y, i) => {
      const x = (i / (pts.length - 1)) * w;
      const py = h - ((y - minY) / range) * (h - 8) - 4;
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${py.toFixed(1)}`;
    })
    .join(' ');
  const color = up ? '#22c55e' : '#ef4444';
  return (
    <Sparkline viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" $compact={$compact}>
      <defs>
        <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${path} L${w},${h} L0,${h} Z`} fill="url(#sparkFill)" />
      <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Sparkline>
  );
}

function buildWatchlist(market, movers) {
  const groups = [];

  if (market?.crypto?.length) {
    groups.push({
      label: 'Crypto',
      rows: market.crypto.map((c) => ({
        id: c.symbol,
        symbol: c.symbol,
        name: c.name,
        price: c.price,
        changePct: c.changePct,
        group: 'crypto',
      })),
    });
  }

  if (market?.forex?.USDNGN) {
    groups.push({
      label: 'Forex',
      rows: [
        {
          id: 'USDNGN',
          symbol: 'USDNGN',
          name: 'US Dollar / Naira',
          price: market.forex.USDNGN,
          changePct: null,
          group: 'forex',
        },
      ],
    });
  }

  if (market?.us?.length) {
    groups.push({
      label: 'US Equities',
      rows: market.us.map((q) => ({
        id: q.symbol,
        symbol: q.symbol,
        name: q.symbol,
        price: q.price,
        changePct: q.changePct,
        group: 'us',
      })),
    });
  }

  if (market?.ngx?.length) {
    groups.push({
      label: 'NGX',
      rows: market.ngx.map((q) => ({
        id: q.symbol,
        symbol: q.symbol,
        name: q.symbol,
        price: q.price,
        changePct: q.changePct,
        group: 'ngx',
      })),
    });
  }

  const moversRows = buildMoversList(movers).flatMap((g) => g.rows);
  if (moversRows.length) {
    groups.push({ label: 'Top Movers', rows: moversRows });
  }

  if (!groups.length && movers?.catalysts?.length) {
    groups.push({
      label: 'AI Catalysts',
      rows: movers.catalysts.slice(0, 10).map((c, i) => ({
        id: `cat-${c.ticker}-${i}`,
        symbol: c.ticker,
        name: c.name || c.ticker,
        price: null,
        changePct: c.direction === 'Up' ? '+1.00%' : c.direction === 'Down' ? '-1.00%' : '0.00%',
        group: 'catalyst',
      })),
    });
  }

  return groups;
}

function buildMoversList(movers) {
  if (!movers?.avMovers) return [];
  const gainers = (movers.avMovers.gainers || []).map((g) => ({
    id: `g-${g.ticker}`,
    symbol: g.ticker,
    name: g.ticker,
    price: g.price,
    changePct: g.changePct,
    group: 'gainer',
  }));
  const losers = (movers.avMovers.losers || []).map((l) => ({
    id: `l-${l.ticker}`,
    symbol: l.ticker,
    name: l.ticker,
    price: l.price,
    changePct: l.changePct,
    group: 'loser',
  }));
  const out = [];
  if (gainers.length) out.push({ label: 'Top Gainers', rows: gainers });
  if (losers.length) out.push({ label: 'Top Losers', rows: losers });
  return out;
}

export default function LiveMarketRail({ market, movers, loading, lastUpdated, onRefresh, error, fitContent = false }) {
  const navigate = useNavigate();
  const [tab, setTab] = useState('markets');
  const [selected, setSelected] = useState(null);

  const watchlist = useMemo(() => buildWatchlist(market, movers), [market, movers]);
  const moversList = useMemo(() => buildMoversList(movers), [movers]);
  const groups = tab === 'markets' ? watchlist : moversList;

  const allRows = useMemo(
    () => groups.flatMap((g) => g.rows),
    [groups]
  );

  const hasData = allRows.length > 0;

  useEffect(() => {
    if (tab === 'markets' && watchlist.length === 0 && moversList.length > 0) {
      setTab('movers');
    }
  }, [tab, watchlist.length, moversList.length]);

  useEffect(() => {
    if (selected && !allRows.some((r) => r.id === selected.id)) {
      setSelected(null);
    }
  }, [allRows, selected]);

  const active = selected || allRows[0] || null;

  const catalyst = useMemo(() => {
    if (!movers?.catalysts?.length || !active) return null;
    return movers.catalysts.find(
      (c) => c.ticker?.toUpperCase() === active.symbol?.toUpperCase()
    );
  }, [movers, active]);

  const pct = active ? parsePct(active.changePct) : null;
  const up = pct != null && pct >= 0;
  const down = pct != null && pct < 0;

  const updatedLabel = lastUpdated
    ? new Date(lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : null;

  return (
    <Rail $fitContent={fitContent}>
      <RailHeader>
        <RailTitle>
          <LiveDot />
          Live Markets
          {movers?.marketMood && <MoodBadge $mood={movers.marketMood}>{movers.marketMood}</MoodBadge>}
        </RailTitle>
        <HeaderActions>
          {updatedLabel && <Updated>{updatedLabel}</Updated>}
          <IconBtn onClick={onRefresh} disabled={loading} aria-label="Refresh">
            <SpinIcon $spinning={loading} />
          </IconBtn>
        </HeaderActions>
      </RailHeader>

      <TabRow>
        <Tab $active={tab === 'markets'} onClick={() => setTab('markets')}>
          Watchlist
        </Tab>
        <Tab $active={tab === 'movers'} onClick={() => setTab('movers')}>
          Movers
        </Tab>
      </TabRow>

      <TableHead>
        <span>Symbol</span>
        <span style={{ textAlign: 'right' }}>Last</span>
        <span style={{ textAlign: 'right' }}>Chg%</span>
      </TableHead>

      <ScrollBody $fitContent={fitContent}>
        {loading && !hasData ? (
          <>
            <Skeleton $h="32px" />
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </>
        ) : !hasData ? (
          <div style={{ padding: '1.25rem 1rem', fontSize: '0.78rem', color: '#64748b', textAlign: 'center', lineHeight: 1.5 }}>
            {error ? (
              <>
                {error}
                <br />
                <button
                  type="button"
                  onClick={onRefresh}
                  style={{ marginTop: '0.5rem', background: 'none', border: 'none', color: '#0f172a', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Retry
                </button>
              </>
            ) : (
              'Fetching live market feed…'
            )}
          </div>
        ) : (
          groups.map((grp) => (
            <React.Fragment key={grp.label}>
              <GroupLabel>{grp.label}</GroupLabel>
              {grp.rows.map((row) => {
                const rowPct = parsePct(row.changePct);
                const rowUp = rowPct != null && rowPct >= 0;
                const rowDown = rowPct != null && rowPct < 0;
                const ic = ICON_COLORS[row.symbol] || { bg: '#f1f5f9', color: '#475569' };
                return (
                  <Row
                    key={row.id}
                    $selected={active?.id === row.id}
                    onClick={() => setSelected(row)}
                  >
                    <SymCell>
                      <SymIcon $bg={ic.bg} $color={ic.color}>
                        {row.symbol.slice(0, 2)}
                      </SymIcon>
                      <SymName>{row.symbol}</SymName>
                    </SymCell>
                    <PriceCell>{fmtPrice(row.price, row.symbol)}</PriceCell>
                    <ChgCell $up={rowUp} $down={rowDown}>
                      {rowPct != null ? (
                        <>
                          {rowUp ? <FaArrowUp style={{ fontSize: '0.55rem', marginRight: 2 }} /> : rowDown ? <FaArrowDown style={{ fontSize: '0.55rem', marginRight: 2 }} /> : null}
                          {fmtChg(row.changePct)}
                        </>
                      ) : (
                        '—'
                      )}
                    </ChgCell>
                  </Row>
                );
              })}
            </React.Fragment>
          ))
        )}
      </ScrollBody>

      {active && (
        <DetailPanel $fitContent={fitContent}>
          <DetailTop $fitContent={fitContent}>
            <div>
              <DetailSym>{active.symbol}</DetailSym>
              <DetailSub>{active.name}</DetailSub>
            </div>
            <div>
              <DetailPrice>{fmtPrice(active.price, active.symbol)}</DetailPrice>
              <DetailChg $up={up} $down={down}>
                {pct != null ? fmtChg(active.changePct) : 'Live quote'}
              </DetailChg>
            </div>
          </DetailTop>

          {pct != null && <SparkChart changePct={active.changePct} $compact={fitContent} />}

          {movers?.topTheme && (
            <InsightBox $compact={fitContent}>
              <strong style={{ color: '#0f172a' }}>Today&apos;s theme:</strong> {movers.topTheme}
              {!fitContent && catalyst && (
                <>
                  <br />
                  <br />
                  <strong>{catalyst.ticker}</strong> — {catalyst.triggerEvent}
                </>
              )}
            </InsightBox>
          )}

          <FooterLink $compact={fitContent} onClick={() => navigate('/iq?tab=movers')}>
            <FaChartLine /> Open full scanner
          </FooterLink>
        </DetailPanel>
      )}
    </Rail>
  );
}
