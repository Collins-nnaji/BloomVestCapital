import React, { useState, useEffect, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaBolt, FaSyncAlt, FaCaretUp, FaCaretDown, FaGlobeAfrica,
  FaBitcoin, FaChartLine, FaFilter, FaClock,
} from 'react-icons/fa';
import { api } from '../api';
import { toStudyLevel, studyLevelStyle } from '../utils/learningLabels';

/* ── animations ─────────────────────────────────── */
const spinAnim = keyframes`to { transform: rotate(360deg); }`;
const pulse    = keyframes`0%,100%{opacity:1}50%{opacity:.4}`;
const shimmer  = keyframes`
  0%   { background-position: -200% center; }
  100% { background-position:  200% center; }
`;

/* ── layout ──────────────────────────────────────── */
const Page = styled.div`
  min-height: ${(p) => (p.$embedded ? 'auto' : '100vh')};
  background: #f8fafc;
  font-family: 'Inter', system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  padding-top: ${(p) => (p.$embedded ? 0 : '64px')};
  color: #0f172a;
`;

const Header = styled.div`
  padding: 1.25rem 1.5rem 0;
  max-width: 1320px;
  margin: 0 auto;
  display: flex;
  align-items: flex-start;
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

const PageSub = styled.p`
  font-size: 0.8rem;
  color: #64748b;
  margin: 0.25rem 0 0;
  max-width: 520px;
  line-height: 1.5;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-wrap: wrap;
`;

const GenerateBtn = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.55rem 1rem;
  background: #0f172a;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;

  &:disabled { opacity: 0.55; cursor: not-allowed; }
  svg.spin { animation: ${spinAnim} 0.85s linear infinite; }
`;

const CacheTag = styled.div`
  font-size: 0.7rem;
  color: #94a3b8;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 0.3rem 0.6rem;
  font-weight: 600;
`;

/* ── filter bar ──────────────────────────────────── */
const FilterBar = styled.div`
  max-width: 1320px;
  margin: 1rem auto 0;
  padding: 0 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-wrap: wrap;
`;

const FilterChip = styled.button`
  padding: 0.3rem 0.75rem;
  border-radius: 20px;
  border: 1px solid ${p => p.$active ? '#0f172a' : '#e2e8f0'};
  background: ${p => p.$active ? '#0f172a' : '#ffffff'};
  color: ${p => p.$active ? '#ffffff' : '#64748b'};
  font-size: 0.74rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s;

  &:hover { border-color: #0f172a; color: ${p => p.$active ? '#ffffff' : '#0f172a'}; }
`;

/* ── body ────────────────────────────────────────── */
const Body = styled.div`
  max-width: 1320px;
  margin: 1.25rem auto 3rem;
  padding: 0 1.5rem;
`;

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const IdeasCount = styled.div`
  font-size: 0.78rem;
  color: #64748b;
  font-weight: 600;
  span { color: #0f172a; font-weight: 800; }
`;

const GeneratedAt = styled.div`
  font-size: 0.7rem;
  color: #94a3b8;
  display: flex;
  align-items: center;
  gap: 0.3rem;
`;

/* ── card grid ───────────────────────────────────── */
const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
`;

/* ── idea card ───────────────────────────────────── */
const IdeaCard = styled(motion.div)`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 1.1rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  transition: box-shadow 0.2s, border-color 0.2s;
  border-left: 3px solid ${p => p.$actionColor || '#e2e8f0'};

  &:hover {
    box-shadow: 0 6px 20px rgba(0,0,0,0.07);
    border-color: #cbd5e1;
    border-left-color: ${p => p.$actionColor || '#cbd5e1'};
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.5rem;
`;

const TickerBlock = styled.div``;

const Ticker = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.1rem;
  font-weight: 800;
  color: #0f172a;
  line-height: 1;
`;

const CompanyName = styled.div`
  font-size: 0.72rem;
  color: #64748b;
  margin-top: 0.2rem;
  font-weight: 500;
`;

const BadgeGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.3rem;
`;

const ActionBadge = styled.span`
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0.2rem 0.55rem;
  border-radius: 6px;
  color: ${p => p.$color};
  background: ${p => p.$bg};
`;

const TypeBadge = styled.span`
  font-size: 0.65rem;
  font-weight: 700;
  color: #94a3b8;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 5px;
  padding: 0.1rem 0.4rem;
`;

const ConfidenceBar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ConfLabel = styled.div`
  font-size: 0.68rem;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  white-space: nowrap;
`;

const BarTrack = styled.div`
  flex: 1;
  height: 4px;
  background: #f1f5f9;
  border-radius: 2px;
  overflow: hidden;
`;

const BarFill = styled.div`
  height: 100%;
  width: ${p => p.$pct}%;
  background: ${p => p.$color};
  border-radius: 2px;
  transition: width 0.6s ease;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`;

const SectionLabel = styled.div`
  font-size: 0.68rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: #94a3b8;
`;

const SectionText = styled.div`
  font-size: 0.8rem;
  color: #334155;
  line-height: 1.55;
`;

const NairaBox = styled.div`
  background: rgba(16,185,129,0.06);
  border: 1px solid rgba(16,185,129,0.18);
  border-radius: 8px;
  padding: 0.6rem 0.8rem;
`;

const NairaLabel = styled.div`
  font-size: 0.65rem;
  font-weight: 800;
  color: #059669;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 0.2rem;
`;

const NairaText = styled.div`
  font-size: 0.78rem;
  color: #065f46;
  line-height: 1.5;
`;

const HorizonPill = styled.span`
  font-size: 0.68rem;
  font-weight: 700;
  color: #64748b;
  background: #f1f5f9;
  border-radius: 4px;
  padding: 0.15rem 0.45rem;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
`;

/* ── loading skeletons ───────────────────────────── */
const SkeletonCard = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 1.1rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const Skel = styled.div`
  background: linear-gradient(90deg, #f1f5f9 25%, #e8edf3 50%, #f1f5f9 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.4s ease infinite;
  border-radius: 6px;
  height: ${p => p.$h || '14px'};
  width: ${p => p.$w || '100%'};
`;

/* ── empty / error ───────────────────────────────── */
const ErrorBox = styled.div`
  background: rgba(220,38,38,0.06);
  border: 1px solid rgba(220,38,38,0.15);
  border-radius: 10px;
  padding: 1rem 1.25rem;
  font-size: 0.82rem;
  color: #b91c1c;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: #94a3b8;
  font-size: 0.85rem;
`;

const Disclaimer = styled.div`
  margin-top: 2rem;
  font-size: 0.67rem;
  color: #94a3b8;
  line-height: 1.55;
  border-top: 1px solid #f1f5f9;
  padding-top: 1rem;
`;

/* ── helpers ─────────────────────────────────────── */
function actionStyle(action) {
  const s = studyLevelStyle(toStudyLevel(action));
  return { color: s.color, bg: s.bg, barColor: s.barColor, barPct: s.barPct, leftColor: s.barColor };
}

const CONFIDENCE_MAP = { High: 90, Medium: 55, Low: 25 };
const CONFIDENCE_COLOR = { High: '#10b981', Medium: '#f59e0b', Low: '#ef4444' };

const ASSET_ICONS = {
  'NGX Stock': <FaGlobeAfrica />,
  'Crypto':    <FaBitcoin />,
  'ETF':       <FaChartLine />,
  'US Stock':  <FaChartLine />,
  'Commodity': <FaChartLine />,
};

const FILTER_OPTIONS = ['All', 'NGX Stock', 'US Stock', 'ETF', 'Crypto', 'Commodity'];

function formatTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/* ── component ───────────────────────────────────── */
export default function TradeIdeasPage({ embedded = false }) {
  const [ideas, setIdeas]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [filter, setFilter]         = useState('All');
  const [generatedAt, setGeneratedAt] = useState(null);
  const [cached, setCached]         = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getTradeIdeas();
      setIdeas(res.ideas || []);
      setGeneratedAt(res.generatedAt || null);
      setCached(res.cached || false);
    } catch (e) {
      setError(e.message || 'Failed to generate trade ideas');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = filter === 'All'
    ? ideas
    : ideas.filter(i => (i.assetType || '').toLowerCase().includes(filter.toLowerCase()));

  const skeletons = Array.from({ length: 6 }, (_, i) => (
    <SkeletonCard key={i}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <Skel $h="22px" $w="80px" />
          <Skel $h="12px" $w="120px" />
        </div>
        <Skel $h="24px" $w="70px" />
      </div>
      <Skel $h="4px" />
      <Skel $h="12px" $w="40%" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
        <Skel $h="12px" />
        <Skel $h="12px" />
        <Skel $h="12px" $w="80%" />
      </div>
      <Skel $h="60px" />
    </SkeletonCard>
  ));

  return (
    <Page $embedded={embedded}>
      {!embedded ? (
        <Header>
          <TitleGroup>
            <Brand>Bloomvest IQ · Regional Desk</Brand>
            <PageTitle>Africa market case studies</PageTitle>
            <PageSub>
              Educational case studies for NGX, US names on Nigerian apps, and crypto — from live headlines. Not buy/sell advice.
            </PageSub>
          </TitleGroup>

          <HeaderRight>
            {cached && <CacheTag>Cached · {formatTime(generatedAt)}</CacheTag>}
            <GenerateBtn
              whileTap={{ scale: 0.96 }}
              onClick={load}
              disabled={loading}
            >
              {loading
                ? <><FaSyncAlt className="spin" /> Generating…</>
                : <><FaBolt /> New case studies</>
              }
            </GenerateBtn>
          </HeaderRight>
        </Header>
      ) : (
        <Header style={{ paddingBottom: 0 }}>
          <TitleGroup>
            <PageSub style={{ margin: 0 }}>
              Africa-focused learning cases from live headlines.
              {cached && <> · Cached {formatTime(generatedAt)}</>}
            </PageSub>
          </TitleGroup>
          <HeaderRight>
            <GenerateBtn whileTap={{ scale: 0.96 }} onClick={load} disabled={loading}>
              {loading
                ? <><FaSyncAlt className="spin" /> Generating…</>
                : <><FaBolt /> New case studies</>
              }
            </GenerateBtn>
          </HeaderRight>
        </Header>
      )}

      <FilterBar>
        <FaFilter style={{ color: '#94a3b8', fontSize: '0.72rem' }} />
        {FILTER_OPTIONS.map(opt => (
          <FilterChip
            key={opt}
            $active={filter === opt}
            onClick={() => setFilter(opt)}
          >
            {opt}
          </FilterChip>
        ))}
      </FilterBar>

      <Body>
        {error && <ErrorBox>{error}</ErrorBox>}

        <MetaRow>
          <IdeasCount>
            Showing <span>{filtered.length}</span> case stud{filtered.length !== 1 ? 'ies' : 'y'}
            {filter !== 'All' && ` · ${filter}`}
          </IdeasCount>
          {generatedAt && !cached && (
            <GeneratedAt>
              <FaClock style={{ fontSize: '0.65rem' }} />
              Generated at {formatTime(generatedAt)}
            </GeneratedAt>
          )}
        </MetaRow>

        <CardGrid>
          <AnimatePresence mode="wait">
            {loading
              ? skeletons
              : filtered.length === 0
                ? (
                  <EmptyState style={{ gridColumn: '1 / -1' }}>
                    {ideas.length === 0
                      ? 'No ideas yet — click "Refresh Ideas" to generate.'
                      : `No ${filter} ideas in this batch.`
                    }
                  </EmptyState>
                )
                : filtered.map((idea, idx) => {
                    const level = toStudyLevel(idea.studyLevel || idea.action);
                    const style = actionStyle(level);
                    const confPct = CONFIDENCE_MAP[idea.confidence] || 50;
                    const confColor = CONFIDENCE_COLOR[idea.confidence] || '#f59e0b';

                    return (
                      <IdeaCard
                        key={`${idea.ticker}-${idx}`}
                        $actionColor={style.leftColor}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: idx * 0.04 }}
                      >
                        {/* Header */}
                        <CardHeader>
                          <TickerBlock>
                            <Ticker>{idea.ticker}</Ticker>
                            <CompanyName>{idea.company}</CompanyName>
                          </TickerBlock>
                          <BadgeGroup>
                            <ActionBadge $color={style.color} $bg={style.bg}>
                              {level}
                            </ActionBadge>
                            <TypeBadge>
                              {ASSET_ICONS[idea.assetType] || <FaChartLine />}{' '}
                              {idea.assetType}
                            </TypeBadge>
                          </BadgeGroup>
                        </CardHeader>

                        {/* Confidence bar */}
                        <ConfidenceBar>
                          <ConfLabel>Confidence</ConfLabel>
                          <BarTrack>
                            <BarFill $pct={confPct} $color={confColor} />
                          </BarTrack>
                          <ConfLabel style={{ color: confColor }}>{idea.confidence}</ConfLabel>
                        </ConfidenceBar>

                        {/* Thesis */}
                        <Section>
                          <SectionLabel>Thesis</SectionLabel>
                          <SectionText>{idea.thesis}</SectionText>
                        </Section>

                        {/* Catalyst + Risk */}
                        <Section>
                          <SectionLabel>Key Catalyst</SectionLabel>
                          <SectionText>{idea.catalyst}</SectionText>
                        </Section>
                        <Section>
                          <SectionLabel>Main Risk</SectionLabel>
                          <SectionText>{idea.risk}</SectionText>
                        </Section>

                        {/* Naira angle */}
                        {idea.nairaAngle && (
                          <NairaBox>
                            <NairaLabel>₦ Nigerian Investor Angle</NairaLabel>
                            <NairaText>{idea.nairaAngle}</NairaText>
                          </NairaBox>
                        )}

                        {/* Horizon */}
                        {idea.learnerQuestion && (
                          <Section>
                            <SectionLabel>Quiz yourself</SectionLabel>
                            <SectionText>{idea.learnerQuestion}</SectionText>
                          </Section>
                        )}

                        {idea.horizon && (
                          <HorizonPill>
                            <FaClock style={{ fontSize: '0.6rem' }} />
                            {idea.horizon}
                          </HorizonPill>
                        )}
                      </IdeaCard>
                    );
                  })
            }
          </AnimatePresence>
        </CardGrid>

        <Disclaimer>
          Case studies are generated from live public headlines for learning only — not buy/sell recommendations or personalised advice.
          Practice decisions in Bloomvest Academy scenarios with virtual money before applying concepts in real life.
        </Disclaimer>
      </Body>
    </Page>
  );
}
