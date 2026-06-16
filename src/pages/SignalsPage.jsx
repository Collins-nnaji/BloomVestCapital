import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowUp, FaArrowDown, FaMinus, FaBell, FaLock, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

/* ── animations ── */
const pulse = keyframes`0%,100%{opacity:1}50%{opacity:.4}`;

/* ── page shell ── */
const Page = styled.div`
  margin-top: 64px;
  min-height: calc(100vh - 64px);
  background: #e8ecf2;
  position: relative;
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 70% 45% at 50% 20%, rgba(251,191,36,.08), transparent 55%);
    pointer-events: none;
  }
`;

const Inner = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 2.5rem 1.25rem 5rem;
  position: relative;
`;

/* ── header ── */
const Header = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const Eyebrow = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #b45309;
  margin: 0 0 0.4rem;
`;

const PageTitle = styled.h1`
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(1.8rem, 5vw, 2.75rem);
  font-weight: 800;
  color: #0f172a;
  margin: 0;
  letter-spacing: -0.04em;
  line-height: 1.1;
`;

const HeaderSub = styled.p`
  color: #64748b;
  font-size: 0.82rem;
  margin: 0.4rem 0 0;
  font-family: 'Inter', sans-serif;
`;

const LiveBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.85rem;
  border-radius: 100px;
  background: rgba(34,197,94,.1);
  border: 1px solid rgba(34,197,94,.25);
  font-family: 'Inter', sans-serif;
  font-size: 0.72rem;
  font-weight: 700;
  color: #15803d;
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const LiveDot = styled.span`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #22c55e;
  animation: ${pulse} 1.4s ease-in-out infinite;
`;

/* ── filter bar ── */
const FilterBar = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1.75rem;
  align-items: center;
`;

const FilterLabel = styled.span`
  font-size: 0.72rem;
  color: #94a3b8;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
`;

const FilterPill = styled.button`
  padding: 0.45rem 1rem;
  border-radius: 100px;
  border: 1.5px solid ${p => p.$active ? (p.$color || '#d97706') : '#e2e8f0'};
  background: ${p => p.$active ? (p.$bg || 'rgba(251,191,36,.12)') : '#ffffff'};
  color: ${p => p.$active ? (p.$color || '#b45309') : '#64748b'};
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 0.78rem;
  letter-spacing: -0.011em;
  cursor: pointer;
  transition: all .18s;
  &:hover { border-color: ${p => p.$color || '#d97706'}; color: ${p => p.$color || '#b45309'}; }
`;

/* ── signal card ── */
const SignalCard = styled(motion.div)`
  border-radius: 18px;
  background: #ffffff;
  border: 1px solid ${p => p.$border || '#e2e8f0'};
  box-shadow: 0 1px 3px rgba(15,23,42,.04);
  overflow: hidden;
  margin-bottom: 1rem;
  cursor: ${p => p.$locked ? 'default' : 'pointer'};
  transition: border-color .2s, box-shadow .2s, transform .2s;
  &:hover {
    border-color: ${p => p.$locked ? '#e2e8f0' : (p.$accent || '#d97706')};
    box-shadow: ${p => p.$locked ? '0 1px 3px rgba(15,23,42,.04)' : '0 6px 20px rgba(15,23,42,.08)'};
  }
`;

const CardTop = styled.div`
  padding: 1.25rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  position: relative;
`;

const DirectionBadge = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: ${p => p.$bg};
  color: ${p => p.$color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  flex-shrink: 0;
`;

const CardMeta = styled.div`
  flex: 1;
  min-width: 0;
`;

const CardTitle = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 800;
  font-size: 1.05rem;
  color: #0f172a;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.2rem;
`;

const TagPill = styled.span`
  font-size: 0.65rem;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  padding: 0.15rem 0.5rem;
  border-radius: 100px;
  color: ${p => p.$color};
  background: ${p => p.$bg};
`;

const CardSub = styled.div`
  font-size: 0.78rem;
  color: #64748b;
  font-family: 'Inter', sans-serif;
`;

const CardRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
  flex-shrink: 0;
`;

const PriceTag = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 800;
  font-size: 1.1rem;
  color: ${p => p.$color || '#0f172a'};
`;

const ConfidenceBadge = styled.div`
  font-size: 0.68rem;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${p => p.$color};
  background: ${p => p.$bg};
  padding: 0.2rem 0.55rem;
  border-radius: 100px;
`;

const Chevron = styled.span`
  color: #cbd5e1;
  font-size: 0.8rem;
`;

const LockOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(248,250,252,.82);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #475569;
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  font-weight: 700;
`;

const UnlockLink = styled.span`
  color: #b45309;
  cursor: pointer;
`;

/* ── expanded detail ── */
const CardDetail = styled(motion.div)`
  padding: 0 1.5rem 1.5rem;
  border-top: 1px solid #f1f5f9;
  padding-top: 1.25rem;
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 0.85rem;
  margin-bottom: 1.25rem;
`;

const DetailItem = styled.div`
  background: #f8fafc;
  border: 1px solid #f1f5f9;
  border-radius: 12px;
  padding: 0.75rem 1rem;
`;

const DetailLabel = styled.div`
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.09em;
  color: #94a3b8;
  margin-bottom: 0.3rem;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
`;

const DetailValue = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 800;
  font-size: 0.95rem;
  color: ${p => p.$color || '#0f172a'};
`;

const Rationale = styled.div`
  font-size: 0.85rem;
  color: #475569;
  line-height: 1.65;
  font-family: 'Inter', sans-serif;
  border-left: 3px solid rgba(217,119,6,.35);
  padding-left: 0.85rem;
`;

/* ── status bar ── */
const StatusStrip = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1.5rem 1rem;
`;

const StatusDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${p => p.$color || '#94a3b8'};
  flex-shrink: 0;
`;

const StatusText = styled.span`
  font-size: 0.72rem;
  color: #94a3b8;
  font-family: 'Inter', sans-serif;
`;

/* ── stats strip ── */
const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatBox = styled(motion.div)`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 1.1rem 1.25rem;
  box-shadow: 0 1px 3px rgba(15,23,42,.04);
`;

const StatNum = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 800;
  font-size: 1.6rem;
  background: linear-gradient(135deg, #16a34a, #0284c7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const StatLbl = styled.div`
  font-size: 0.72rem;
  color: #64748b;
  font-family: 'Inter', sans-serif;
  margin-top: 0.15rem;
`;

/* ── upgrade banner ── */
const UpgradeBanner = styled(motion.div)`
  background: linear-gradient(135deg, rgba(251,191,36,.12), rgba(245,158,11,.05));
  border: 1px solid rgba(251,191,36,.3);
  border-radius: 20px;
  padding: 2rem;
  text-align: center;
  margin-top: 1rem;
`;

const BannerEyebrow = styled.p`
  color: #b45309;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 0.72rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  margin: 0 0 0.4rem;
`;

const BannerTitle = styled.h3`
  color: #0f172a;
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 800;
  font-size: clamp(1.2rem, 3vw, 1.6rem);
  margin: 0 0 0.6rem;
  letter-spacing: -0.03em;
`;

const BannerText = styled.p`
  color: #64748b;
  font-family: 'Inter', sans-serif;
  font-size: 0.88rem;
  margin: 0 auto 1.5rem;
  max-width: 480px;
  line-height: 1.6;
`;

const Disclaimer = styled.p`
  color: #94a3b8;
  font-size: 0.72rem;
  text-align: center;
  margin: 2rem 0 0;
  font-family: 'Inter', sans-serif;
  line-height: 1.6;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #94a3b8;
  font-family: 'Inter', sans-serif;
`;

/* ── nav button ── */
const BtnPrimary = styled.button`
  padding: 0.85rem 2rem;
  border-radius: 100px;
  border: none;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: #fff;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 0.9rem;
  letter-spacing: -0.011em;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  transition: transform .18s, box-shadow .18s;
  &:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(34,197,94,.35); }
`;

/* ─────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────── */
const TODAY = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

const SIGNALS = [
  {
    id: 1, ticker: 'NVDA', name: 'NVIDIA Corp', type: 'LONG', market: 'Equities',
    entry: '$118.50', target: '$135.00', stop: '$112.00', rr: '2.8:1',
    confidence: 'High', tag: 'Hot', locked: false,
    status: 'Active', statusColor: '#16a34a',
    rationale: 'NVDA broke a 3-week consolidation on elevated volume following strong Q1 AI chip demand data. RSI(14) reset from overbought. Targeting the $135 resistance zone from February highs. Tight stop below the breakout candle.',
    time: '07:32 BST',
  },
  {
    id: 2, ticker: 'GLD', name: 'SPDR Gold ETF', type: 'LONG', market: 'Commodities',
    entry: '$228.10', target: '$242.00', stop: '$222.50', rr: '2.5:1',
    confidence: 'High', tag: null, locked: false,
    status: 'Active', statusColor: '#16a34a',
    rationale: 'Gold continues to benefit from dollar weakness and geopolitical risk premium. Technical: inverted head-and-shoulders on the daily. DXY rolling over. Central bank buying data from IMF confirms structural bid.',
    time: '07:45 BST',
  },
  {
    id: 3, ticker: 'TSLA', name: 'Tesla Inc', type: 'SHORT', market: 'Equities',
    entry: '$182.70', target: '$165.00', stop: '$190.00', rr: '2.4:1',
    confidence: 'Medium', tag: null, locked: false,
    status: 'Active', statusColor: '#16a34a',
    rationale: 'TSLA rejected at the 200-day MA for the third consecutive week. Delivery estimates revised down for Q2. Rising EV competition in Europe. Risk: short squeeze potential — keep position size modest.',
    time: '08:10 BST',
  },
  {
    id: 4, ticker: 'BTC/USD', name: 'Bitcoin', type: 'LONG', market: 'Crypto',
    entry: '$68,200', target: '$75,000', stop: '$65,500', rr: '2.5:1',
    confidence: 'Medium', tag: 'Premium', locked: true,
    status: 'Active', statusColor: '#16a34a',
    rationale: '',
    time: '06:00 BST',
  },
  {
    id: 5, ticker: 'SPY', name: 'S&P 500 ETF', type: 'NEUTRAL', market: 'Index',
    entry: '—', target: '—', stop: '—', rr: '—',
    confidence: 'Watch', tag: null, locked: false,
    status: 'Watch', statusColor: '#d97706',
    rationale: 'FOMC minutes due Wednesday. Holding off for directional clarity. Break above $535 = bullish; break below $520 = defensive positioning. No position until catalyst resolves.',
    time: '09:00 BST',
  },
  {
    id: 6, ticker: 'AAPL', name: 'Apple Inc', type: 'LONG', market: 'Equities',
    entry: '$192.40', target: '$205.00', stop: '$187.80', rr: '2.8:1',
    confidence: 'High', tag: 'Premium', locked: true,
    status: 'Active', statusColor: '#16a34a',
    rationale: '',
    time: '08:55 BST',
  },
  {
    id: 7, ticker: 'EURUSD', name: 'EUR/USD', type: 'SHORT', market: 'Forex',
    entry: '1.0845', target: '1.0720', stop: '1.0900', rr: '2.3:1',
    confidence: 'Medium', tag: 'Premium', locked: true,
    status: 'Active', statusColor: '#16a34a',
    rationale: '',
    time: '07:15 BST',
  },
  {
    id: 8, ticker: 'AMZN', name: 'Amazon', type: 'LONG', market: 'Equities',
    entry: '$188.90', target: '$210.00', stop: '$181.00', rr: '2.6:1',
    confidence: 'High', tag: null, locked: false,
    status: 'Closed', statusColor: '#0284c7',
    rationale: 'Position closed at $207.50 — just below target as momentum stalled on light volume. +9.8% gain. Excellent risk/reward realised.',
    time: 'Yesterday 14:30 BST',
  },
];

const MARKETS = ['All', 'Equities', 'Crypto', 'Commodities', 'Forex', 'Index'];
const DIRECTIONS = ['All', 'LONG', 'SHORT', 'NEUTRAL'];

function directionIcon(type) {
  if (type === 'LONG') return { Icon: FaArrowUp, color: '#16a34a', bg: 'rgba(34,197,94,.12)' };
  if (type === 'SHORT') return { Icon: FaArrowDown, color: '#dc2626', bg: 'rgba(239,68,68,.12)' };
  return { Icon: FaMinus, color: '#d97706', bg: 'rgba(251,191,36,.14)' };
}

function confidenceStyle(c) {
  if (c === 'High') return { color: '#16a34a', bg: 'rgba(34,197,94,.12)' };
  if (c === 'Medium') return { color: '#b45309', bg: 'rgba(251,191,36,.14)' };
  return { color: '#64748b', bg: 'rgba(148,163,184,.14)' };
}

export default function SignalsPage() {
  const navigate = useNavigate();
  const [marketFilter, setMarketFilter] = useState('All');
  const [dirFilter, setDirFilter] = useState('All');
  const [expanded, setExpanded] = useState(null);
  const [, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const filtered = SIGNALS.filter(s => {
    if (marketFilter !== 'All' && s.market !== marketFilter) return false;
    if (dirFilter !== 'All' && s.type !== dirFilter) return false;
    return true;
  });

  const activeCount = SIGNALS.filter(s => s.status === 'Active').length;

  return (
    <Page>
      <Inner>
        {/* HEADER */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Header>
            <div>
              <Eyebrow>BloomVest Account Managers</Eyebrow>
              <PageTitle>Daily Signals</PageTitle>
              <HeaderSub>{TODAY} — Published from 06:00 BST</HeaderSub>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <LiveBadge>
                <LiveDot /> Live
              </LiveBadge>
              <BtnPrimary onClick={() => navigate('/enquiry')} style={{ fontSize: '0.82rem', padding: '0.65rem 1.4rem' }}>
                <FaBell /> Get Alerts
              </BtnPrimary>
            </div>
          </Header>
        </motion.div>

        {/* STATS */}
        <StatsRow>
          {[
            { n: `${activeCount}`, l: 'Active Signals Today' },
            { n: '94%', l: 'Win Rate (30d)' },
            { n: '2.6:1', l: 'Avg Risk/Reward' },
            { n: '+£12,400', l: 'Model Portfolio (MTD)' },
          ].map(({ n, l }, i) => (
            <StatBox key={l} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
              <StatNum>{n}</StatNum>
              <StatLbl>{l}</StatLbl>
            </StatBox>
          ))}
        </StatsRow>

        {/* FILTERS */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <FilterBar>
            <FilterLabel>Market:</FilterLabel>
            {MARKETS.map(m => (
              <FilterPill key={m} $active={marketFilter === m} onClick={() => setMarketFilter(m)}>{m}</FilterPill>
            ))}
          </FilterBar>
          <FilterBar>
            <FilterLabel>Direction:</FilterLabel>
            {DIRECTIONS.map(d => (
              <FilterPill key={d} $active={dirFilter === d}
                $color={d === 'LONG' ? '#16a34a' : d === 'SHORT' ? '#dc2626' : '#b45309'}
                $bg={d === 'LONG' ? 'rgba(34,197,94,.1)' : d === 'SHORT' ? 'rgba(239,68,68,.1)' : 'rgba(251,191,36,.12)'}
                onClick={() => setDirFilter(d)}>{d}</FilterPill>
            ))}
          </FilterBar>
        </motion.div>

        {/* SIGNAL CARDS */}
        <AnimatePresence mode="popLayout">
          {filtered.map((s, i) => {
            const { Icon: DirIcon, color: dirColor, bg: dirBg } = directionIcon(s.type);
            const conf = confidenceStyle(s.confidence);
            const isOpen = expanded === s.id;

            return (
              <SignalCard key={s.id} $border={s.locked ? '#e2e8f0' : `rgba(${s.type === 'LONG' ? '34,197,94' : s.type === 'SHORT' ? '239,68,68' : '251,191,36'},.25)`}
                $accent={dirColor} $locked={s.locked}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                layout>

                <CardTop onClick={() => !s.locked && setExpanded(isOpen ? null : s.id)}>
                  <DirectionBadge $bg={dirBg} $color={dirColor}><DirIcon /></DirectionBadge>

                  <CardMeta>
                    <CardTitle>
                      {s.ticker}
                      {s.tag === 'Hot' && (
                        <TagPill $color="#ea580c" $bg="rgba(251,146,60,.14)">🔥 HOT</TagPill>
                      )}
                      {s.tag === 'Premium' && (
                        <TagPill $color="#b45309" $bg="rgba(251,191,36,.14)">★ PREMIUM</TagPill>
                      )}
                    </CardTitle>
                    <CardSub>{s.name} · {s.market} · {s.time}</CardSub>
                  </CardMeta>

                  <CardRight>
                    <PriceTag $color={dirColor}>{s.type}</PriceTag>
                    <ConfidenceBadge $color={conf.color} $bg={conf.bg}>{s.confidence}</ConfidenceBadge>
                    {!s.locked && (
                      <Chevron>{isOpen ? <FaChevronUp /> : <FaChevronDown />}</Chevron>
                    )}
                  </CardRight>

                  {s.locked && (
                    <LockOverlay>
                      <FaLock /> Premium — <UnlockLink onClick={() => navigate('/enquiry')}>Unlock with Account Manager</UnlockLink>
                    </LockOverlay>
                  )}
                </CardTop>

                <StatusStrip>
                  <StatusDot $color={s.statusColor} />
                  <StatusText>{s.status} · Entry: {s.entry} · Target: {s.target} · Stop: {s.stop} · R/R {s.rr}</StatusText>
                </StatusStrip>

                <AnimatePresence>
                  {isOpen && !s.locked && (
                    <CardDetail
                      key="detail"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}>

                      <DetailGrid>
                        <DetailItem>
                          <DetailLabel>Entry</DetailLabel>
                          <DetailValue>{s.entry}</DetailValue>
                        </DetailItem>
                        <DetailItem>
                          <DetailLabel>Target</DetailLabel>
                          <DetailValue $color="#16a34a">{s.target}</DetailValue>
                        </DetailItem>
                        <DetailItem>
                          <DetailLabel>Stop Loss</DetailLabel>
                          <DetailValue $color="#dc2626">{s.stop}</DetailValue>
                        </DetailItem>
                        <DetailItem>
                          <DetailLabel>Risk/Reward</DetailLabel>
                          <DetailValue $color="#b45309">{s.rr}</DetailValue>
                        </DetailItem>
                        <DetailItem>
                          <DetailLabel>Market</DetailLabel>
                          <DetailValue>{s.market}</DetailValue>
                        </DetailItem>
                        <DetailItem>
                          <DetailLabel>Status</DetailLabel>
                          <DetailValue $color={s.statusColor}>{s.status}</DetailValue>
                        </DetailItem>
                      </DetailGrid>

                      <Rationale>{s.rationale}</Rationale>
                    </CardDetail>
                  )}
                </AnimatePresence>
              </SignalCard>
            );
          })}
        </AnimatePresence>

        {filtered.length === 0 && (
          <EmptyState>No signals match the current filters.</EmptyState>
        )}

        {/* UPGRADE BANNER */}
        <UpgradeBanner initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <BannerEyebrow>★ Premium Signals</BannerEyebrow>
          <BannerTitle>Unlock All Signals + Dedicated Manager</BannerTitle>
          <BannerText>
            Get every premium signal, instant alerts, and a personal account manager who executes your strategy — not just signals you can act on.
          </BannerText>
          <BtnPrimary onClick={() => navigate('/enquiry')}>
            Get Full Access
          </BtnPrimary>
        </UpgradeBanner>

        <Disclaimer>
          For informational and educational purposes only. Not financial advice. Capital at risk. Past performance does not guarantee future results. BloomVest signals are not a solicitation to buy or sell any security.
        </Disclaimer>
      </Inner>
    </Page>
  );
}
