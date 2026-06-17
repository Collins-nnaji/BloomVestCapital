import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FaArrowRight,
  FaArrowUp,
  FaArrowDown,
  FaExchangeAlt,
  FaChevronDown,
  FaChevronUp,
  FaBrain,
} from 'react-icons/fa';

const Wrap = styled.div`
  position: relative;
  z-index: 2;
  max-width: 1320px;
  width: 100%;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
`;

const EnginePanel = styled.div`
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.97);
  border: 1px solid rgba(226, 232, 240, 0.9);
  box-shadow: 0 32px 80px rgba(0, 0, 0, 0.35);
  overflow: hidden;
  color: #0f172a;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  max-height: 100%;
`;

const PanelHeader = styled.div`
  padding: ${(p) => (p.$compact ? '0.75rem 1rem' : '1.25rem 1.5rem')};
  border-bottom: 1px solid #e2e8f0;
  background: linear-gradient(135deg, #f8fafc 0%, #fff 100%);
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
  flex-shrink: 0;
`;

const EngineTitle = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 800;
  font-size: ${(p) => (p.$compact ? 'clamp(0.95rem, 1.8vw, 1.2rem)' : 'clamp(1.25rem, 2.5vw, 1.65rem)')};
  color: #0f172a;
  letter-spacing: -0.02em;
`;

const EngineSub = styled.p`
  margin: 0.25rem 0 0;
  font-size: ${(p) => (p.$compact ? '0.72rem' : '0.82rem')};
  color: #64748b;
  max-width: 520px;
  line-height: 1.45;

  @media (max-height: 780px) {
    display: ${(p) => (p.$compact ? 'none' : 'block')};
  }
`;

const Eyebrow = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.65rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #10b981;
  margin-bottom: 0.35rem;
`;

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #f1f5f9;
  background: #fafbfc;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

const StatBox = styled.div`
  padding: 0.85rem 1rem;
  border-radius: 12px;
  background: ${(p) => p.$bg || '#fff'};
  border: 1px solid ${(p) => p.$border || '#e2e8f0'};
`;

const StatLabel = styled.div`
  font-size: 0.58rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #94a3b8;
  margin-bottom: 0.3rem;
`;

const StatValue = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 800;
  font-size: ${(p) => (p.$small ? '0.88rem' : '1.05rem')};
  color: ${(p) => p.$color || '#0f172a'};
  line-height: 1.35;
`;

const SummaryBox = styled.div`
  margin: ${(p) => (p.$compact ? '0.5rem 1rem 0' : '1rem 1.5rem 0')};
  padding: ${(p) => (p.$compact ? '0.55rem 0.75rem' : '0.9rem 1.1rem')};
  border-radius: 10px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-left: 3px solid #10b981;
  font-size: ${(p) => (p.$compact ? '0.75rem' : '0.84rem')};
  color: #475569;
  line-height: 1.5;
  flex-shrink: 0;
  display: -webkit-box;
  -webkit-line-clamp: ${(p) => (p.$compact ? 2 : 4)};
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const MoversStrip = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  padding: ${(p) => (p.$compact ? '0.5rem 1rem 0' : '0.85rem 1.5rem 0')};
  flex-shrink: 0;
`;

const MoverPill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.28rem 0.65rem;
  border-radius: 100px;
  font-size: 0.72rem;
  font-weight: 700;
  background: ${(p) => (p.$up ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.07)')};
  border: 1px solid ${(p) => (p.$up ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.15)')};
  color: ${(p) => (p.$up ? '#065f46' : '#7f1d1d')};
`;

const PanelBody = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }
`;

const CatalystGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(${(p) => p.$cols || 2}, 1fr);
  gap: ${(p) => (p.$compact ? '0.5rem' : '0.75rem')};
  padding: ${(p) => (p.$compact ? '0.65rem 1rem 0.75rem' : '1.25rem 1.5rem 1.5rem')};

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
`;

const CatalystCard = styled(motion.div)`
  border-radius: 14px;
  border: 1px solid ${(p) => (p.$open ? '#cbd5e1' : '#f1f5f9')};
  background: #fff;
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
  box-shadow: ${(p) => (p.$open ? '0 8px 24px rgba(0,0,0,0.06)' : 'none')};

  &:hover {
    border-color: #cbd5e1;
  }
`;

const CardTop = styled.div`
  padding: ${(p) => (p.$compact ? '0.6rem 0.75rem' : '0.9rem 1rem')};
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
`;

const DirBadge = styled.div`
  width: ${(p) => (p.$compact ? '30px' : '36px')};
  height: ${(p) => (p.$compact ? '30px' : '36px')};
  border-radius: 10px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(p) =>
    p.$dir === 'Up'
      ? 'rgba(16,185,129,0.1)'
      : p.$dir === 'Down'
        ? 'rgba(239,68,68,0.1)'
        : 'rgba(99,102,241,0.1)'};
  color: ${(p) => (p.$dir === 'Up' ? '#10b981' : p.$dir === 'Down' ? '#ef4444' : '#6366f1')};
`;

const CardMeta = styled.div`
  flex: 1;
  min-width: 0;
`;

const CardTicker = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 800;
  font-size: 0.95rem;
  color: #0f172a;
`;

const CardName = styled.div`
  font-size: 0.72rem;
  color: #94a3b8;
  margin-top: 0.1rem;
`;

const TagRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  margin-top: 0.4rem;
`;

const Tag = styled.span`
  font-size: 0.6rem;
  font-weight: 800;
  padding: 0.12rem 0.45rem;
  border-radius: 100px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  background: ${(p) => p.$bg || '#f1f5f9'};
  color: ${(p) => p.$color || '#64748b'};
`;

const CardEvent = styled.p`
  margin: 0;
  padding: 0 1rem 0.9rem;
  font-size: 0.8rem;
  color: #475569;
  line-height: 1.55;
  display: -webkit-box;
  -webkit-line-clamp: ${(p) => (p.$open ? 'unset' : 3)};
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const CardExpand = styled.div`
  padding: 0 1rem 0.9rem;
  border-top: 1px solid #f1f5f9;
  padding-top: 0.75rem;
  font-size: 0.75rem;
  color: #64748b;
  line-height: 1.55;
`;

const PanelFooter = styled.div`
  padding: ${(p) => (p.$compact ? '0.6rem 1rem 0.75rem' : '1rem 1.5rem 1.25rem')};
  border-top: 1px solid #f1f5f9;
  display: flex;
  justify-content: center;
  flex-shrink: 0;
`;

const CtaBtn = styled.button`
  padding: ${(p) => (p.$compact ? '0.55rem 1.25rem' : '0.75rem 1.75rem')};
  border-radius: 100px;
  border: none;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: #fff;
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: 0.88rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: transform 0.18s, box-shadow 0.18s;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(34, 197, 94, 0.35);
  }
`;

const Skeleton = styled.div`
  height: 100px;
  border-radius: 14px;
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 200% 100%;
  animation: shimmer 1.2s infinite;
  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;

const TYPE_COLORS = {
  Breakout: { bg: 'rgba(99,102,241,0.1)', color: '#6366f1' },
  Catalyst: { bg: 'rgba(245,158,11,0.1)', color: '#d97706' },
  Reversal: { bg: 'rgba(236,72,153,0.1)', color: '#ec4899' },
  Momentum: { bg: 'rgba(16,185,129,0.1)', color: '#10b981' },
  Squeeze: { bg: 'rgba(239,68,68,0.1)', color: '#ef4444' },
  'Event-Driven': { bg: 'rgba(59,130,246,0.1)', color: '#3b82f6' },
};

const URGENCY_COLORS = {
  High: { bg: 'rgba(239,68,68,0.08)', color: '#dc2626' },
  Medium: { bg: 'rgba(245,158,11,0.08)', color: '#d97706' },
  Watch: { bg: 'rgba(100,116,139,0.08)', color: '#64748b' },
};

function moodStyle(mood) {
  if (mood === 'Risk-On') return { bg: 'rgba(16,185,129,0.07)', border: 'rgba(16,185,129,0.2)', color: '#10b981' };
  if (mood === 'Risk-Off') return { bg: 'rgba(239,68,68,0.07)', border: 'rgba(239,68,68,0.2)', color: '#ef4444' };
  return { bg: 'rgba(245,158,11,0.07)', border: 'rgba(245,158,11,0.2)', color: '#f59e0b' };
}

export default function IntelligenceShowcase({ movers, loading, compact = false }) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(null);

  const catalysts = movers?.catalysts ?? [];
  const mood = movers?.marketMood;
  const ms = moodStyle(mood);
  const maxCards = compact ? 4 : 6;
  const gridCols = compact ? 2 : 2;

  return (
    <Wrap>
      <EnginePanel>
        <PanelHeader $compact={compact}>
          <div>
            <Eyebrow><FaBrain /> BloomVest Intelligence Engine</Eyebrow>
            <EngineTitle $compact={compact}>Movers Scanner — Live AI Analysis</EngineTitle>
            <EngineSub $compact={compact}>
              Real-time catalyst detection across equities, crypto, and macro — the same engine powering your Intelligence hub.
            </EngineSub>
          </div>
          {movers?.generatedAt && (
            <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 600 }}>
              Updated {new Date(movers.generatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          )}
        </PanelHeader>

        {movers && (
          <StatsRow style={{ gridTemplateColumns: '1fr 1fr', padding: compact ? '0.6rem 1rem' : undefined }}>
            <StatBox $bg={ms.bg} $border={ms.border}>
              <StatLabel>Market Mood</StatLabel>
              <StatValue $color={ms.color}>{mood || '—'}</StatValue>
            </StatBox>
            <StatBox>
              <StatLabel>Catalysts Found</StatLabel>
              <StatValue $color="#6366f1">{catalysts.length || '—'}</StatValue>
            </StatBox>
            <StatBox style={{ gridColumn: '1 / -1' }}>
              <StatLabel>Top Theme</StatLabel>
              <StatValue $small>{movers.topTheme || 'Scanning markets…'}</StatValue>
            </StatBox>
          </StatsRow>
        )}

        <PanelBody>
        {movers?.scanSummary && <SummaryBox $compact={compact}>{movers.scanSummary}</SummaryBox>}

        {movers?.avMovers && (movers.avMovers.gainers?.length > 0 || movers.avMovers.losers?.length > 0) && (
          <MoversStrip $compact={compact}>
            {movers.avMovers.gainers?.slice(0, compact ? 3 : 4).map((g) => (
              <MoverPill key={g.ticker} $up>
                <FaArrowUp style={{ fontSize: '0.55rem' }} /> {g.ticker} {g.changePct}
              </MoverPill>
            ))}
            {movers.avMovers.losers?.slice(0, compact ? 2 : 3).map((l) => (
              <MoverPill key={l.ticker} $up={false}>
                <FaArrowDown style={{ fontSize: '0.55rem' }} /> {l.ticker} {l.changePct}
              </MoverPill>
            ))}
          </MoversStrip>
        )}

        <CatalystGrid $compact={compact} $cols={gridCols}>
          {loading && catalysts.length === 0 ? (
            <>
              <Skeleton />
              <Skeleton />
              {!compact && <Skeleton />}
              {!compact && <Skeleton />}
            </>
          ) : catalysts.length > 0 ? (
            catalysts.slice(0, maxCards).map((c, i) => {
              const isOpen = expanded === i;
              const DirIcon = c.direction === 'Up' ? FaArrowUp : c.direction === 'Down' ? FaArrowDown : FaExchangeAlt;
              const typeStyle = TYPE_COLORS[c.movementType] || { bg: '#f1f5f9', color: '#64748b' };
              const urgStyle = URGENCY_COLORS[c.urgency] || URGENCY_COLORS.Medium;
              return (
                <CatalystCard
                  key={c.ticker + i}
                  $open={isOpen}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  viewport={{ once: true }}
                  onClick={() => setExpanded(isOpen ? null : i)}
                >
                  <CardTop $compact={compact}>
                    <DirBadge $dir={c.direction} $compact={compact}>
                      <DirIcon style={{ fontSize: '0.85rem' }} />
                    </DirBadge>
                    <CardMeta>
                      <CardTicker>{c.ticker}</CardTicker>
                      {c.name && <CardName>{c.name}</CardName>}
                      <TagRow>
                        <Tag $bg={typeStyle.bg} $color={typeStyle.color}>{c.movementType}</Tag>
                        <Tag $bg={urgStyle.bg} $color={urgStyle.color}>{c.urgency}</Tag>
                        <Tag>{c.magnitude} · {c.timeframe}</Tag>
                      </TagRow>
                    </CardMeta>
                    <span style={{ color: '#94a3b8', fontSize: '0.75rem', flexShrink: 0 }}>
                      {isOpen ? <FaChevronUp /> : <FaChevronDown />}
                    </span>
                  </CardTop>
                  <CardEvent $open={isOpen}>{c.triggerEvent}</CardEvent>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                      >
                        <CardExpand>
                          {c.technicalNote && <div><strong>Technical:</strong> {c.technicalNote}</div>}
                          {c.risk && <div style={{ marginTop: '0.4rem' }}><strong>Risk:</strong> {c.risk}</div>}
                          {c.nairaRelevance && <div style={{ marginTop: '0.4rem' }}><strong>NGN relevance:</strong> {c.nairaRelevance}</div>}
                        </CardExpand>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CatalystCard>
              );
            })
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', color: '#64748b', fontSize: '0.85rem' }}>
              Scanning markets for movement catalysts…
            </div>
          )}
        </CatalystGrid>
        </PanelBody>

        <PanelFooter $compact={compact}>
          <CtaBtn $compact={compact} onClick={() => navigate('/iq?tab=movers')}>
            Open Full Intelligence Hub <FaArrowRight />
          </CtaBtn>
        </PanelFooter>
      </EnginePanel>
    </Wrap>
  );
}
