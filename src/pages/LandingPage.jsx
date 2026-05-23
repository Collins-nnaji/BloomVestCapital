import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaArrowRight,
  FaBolt,
  FaGraduationCap,
  FaPlay,
  FaRobot,
  FaBrain,
  FaQuoteLeft,
} from 'react-icons/fa';
import {
  PLATFORM_LAYERS,
  AUDIENCES,
  PRODUCT_TAGLINE,
  PRODUCT_MISSION,
} from '../config/platform';

const shimmer = keyframes`
  0% { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
`;
const pulse = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.65; transform: scale(0.92); }
`;
const floatA = keyframes`
  0%, 100% { transform: translate(0, 0) scale(1); }
  40% { transform: translate(28px, -38px) scale(1.04); }
  70% { transform: translate(-18px, 18px) scale(0.97); }
`;
const floatB = keyframes`
  0%, 100% { transform: translate(0, 0) scale(1); }
  35% { transform: translate(-36px, 26px) scale(1.05); }
  70% { transform: translate(22px, -18px) scale(0.96); }
`;
const slideLeft = keyframes`
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
`;

const Page = styled.div`
  font-family: 'Inter', system-ui, sans-serif;
  background: #fafbfc;
  color: #0a0f1e;
  overflow-x: hidden;
`;

const BgCanvas = styled.div`
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
`;
const Orb = styled.div`
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: ${(p) => p.$opacity || 0.15};
  background: ${(p) => p.$color};
  width: ${(p) => p.$size}px;
  height: ${(p) => p.$size}px;
  top: ${(p) => p.$top};
  left: ${(p) => p.$left};
  animation: ${(p) => (p.$anim === 'a' ? floatA : floatB)} ${(p) => p.$dur || '18s'} ease-in-out infinite;
`;
const DotGrid = styled.div`
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background-image: radial-gradient(rgba(15, 23, 42, 0.032) 1px, transparent 1px);
  background-size: 28px 28px;
  mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.5) 0%, transparent 85%);
`;

const RibbonWrap = styled.div`
  position: relative;
  z-index: 10;
  border-bottom: 1px solid rgba(15, 23, 42, 0.06);
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(16px);
  overflow: hidden;
  padding: 0.42rem 0;
  margin-top: 64px;
`;
const RibbonTrack = styled.div`
  display: flex;
  width: max-content;
  animation: ${slideLeft} 28s linear infinite;
`;
const RibbonItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0 2rem;
  white-space: nowrap;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  font-weight: 700;
`;
const RibbonTicker = styled.span`
  color: #64748b;
  font-size: 0.62rem;
`;
const RibbonChg = styled.span`
  color: ${(p) => (p.$pos ? '#10b981' : '#ef4444')};
  font-size: 0.62rem;
`;

const Section = styled.section`
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: ${(p) => p.$pad || '3rem 2rem'};
`;

const HeroSection = styled(Section)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2.5rem;
  align-items: center;
  min-height: calc(100vh - 120px);
  padding-top: 1rem;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    min-height: 0;
    padding: 1.5rem 1.25rem 2rem;
  }
`;

const HeroBadge = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.4rem 1rem;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #15803d;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(34, 197, 94, 0.22);
  width: max-content;
`;
const PulseDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #22c55e;
  animation: ${pulse} 2s ease infinite;
`;

const HeroHeadline = styled(motion.h1)`
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(2.5rem, 6vw, 4.2rem);
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -0.04em;
  margin: 0;
  em {
    font-style: normal;
    background: linear-gradient(120deg, #15803d, #0f766e, #22c55e, #15803d);
    background-size: 200% auto;
    animation: ${shimmer} 4s linear infinite;
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
`;

const HeroSub = styled(motion.p)`
  font-size: 1.15rem;
  line-height: 1.6;
  color: rgba(15, 23, 42, 0.55);
  margin: 0;
  max-width: 32em;
`;

const Tagline = styled(motion.p)`
  font-size: 0.88rem;
  font-weight: 700;
  color: #64748b;
  margin: 0;
  letter-spacing: 0.02em;
`;

const HeroActions = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
`;

const BtnPrimary = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.9rem 1.5rem;
  border-radius: 11px;
  font-weight: 800;
  font-size: 1rem;
  color: #fff;
  background: linear-gradient(135deg, #0f172a, #14532d);
  text-decoration: none;
  box-shadow: 0 6px 22px rgba(15, 23, 42, 0.2);
  transition: transform 0.18s;
  &:hover {
    transform: translateY(-2px);
  }
`;

const BtnGhost = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.9rem 1.35rem;
  border-radius: 11px;
  font-weight: 700;
  color: #0a0f1e;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(15, 23, 42, 0.12);
  text-decoration: none;
  &:hover {
    border-color: rgba(34, 197, 94, 0.35);
  }
`;

const AudienceRow = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 0.5rem;
`;

const AudiencePill = styled.span`
  font-size: 0.72rem;
  font-weight: 600;
  padding: 0.35rem 0.7rem;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.04);
  color: rgba(15, 23, 42, 0.65);
  border: 1px solid rgba(15, 23, 42, 0.06);
`;

const LayerStack = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const LayerPreview = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(15, 23, 42, 0.07);
  border-radius: 12px;
  text-decoration: none;
  color: inherit;
  transition: border-color 0.15s, transform 0.15s, box-shadow 0.15s;
  &:hover {
    border-color: rgba(34, 197, 94, 0.35);
    transform: translateX(4px);
    box-shadow: 0 6px 20px rgba(15, 23, 42, 0.06);
  }
`;

const LayerNum = styled.span`
  font-size: 0.62rem;
  font-weight: 800;
  color: #94a3b8;
  width: 1.5rem;
`;

const LayerIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(p) => p.$bg};
  color: ${(p) => p.$color};
`;

const LayerText = styled.div`
  flex: 1;
  min-width: 0;
`;
const LayerName = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 800;
  font-size: 0.95rem;
`;
const LayerTag = styled.div`
  font-size: 0.75rem;
  color: rgba(15, 23, 42, 0.48);
`;

const SectionHead = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;
`;

const SectionEyebrow = styled.p`
  margin: 0 0 0.5rem;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #15803d;
`;

const SectionTitle = styled.h2`
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(1.75rem, 3.5vw, 2.5rem);
  font-weight: 800;
  margin: 0 0 0.65rem;
  letter-spacing: -0.03em;
`;

const SectionLead = styled.p`
  margin: 0 auto;
  max-width: 36rem;
  color: rgba(15, 23, 42, 0.55);
  line-height: 1.65;
  font-size: 1.02rem;
`;

const LayersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const LayerCard = styled(motion(Link))`
  display: flex;
  flex-direction: column;
  padding: 1.35rem;
  background: #fff;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 16px;
  text-decoration: none;
  color: inherit;
  min-height: 220px;
  transition: box-shadow 0.2s, border-color 0.2s, transform 0.2s;
  &:hover {
    border-color: rgba(34, 197, 94, 0.3);
    box-shadow: 0 12px 40px rgba(15, 23, 42, 0.08);
    transform: translateY(-3px);
  }
`;

const LayerBadge = styled.span`
  align-self: flex-start;
  font-size: 0.6rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 0.2rem 0.45rem;
  border-radius: 4px;
  background: rgba(245, 158, 11, 0.12);
  color: #b45309;
  margin-bottom: 0.5rem;
`;

const StepsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const StepCard = styled.div`
  padding: 1.5rem;
  background: #fff;
  border-radius: 16px;
  border: 1px solid rgba(15, 23, 42, 0.07);
  text-align: center;
`;

const StepNum = styled.div`
  width: 40px;
  height: 40px;
  margin: 0 auto 1rem;
  border-radius: 12px;
  background: linear-gradient(135deg, #15803d, #0f766e);
  color: #fff;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Space Grotesk', sans-serif;
`;

const IqDemo = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  align-items: stretch;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const IqQuestion = styled.div`
  padding: 1.5rem;
  background: linear-gradient(135deg, #0f172a, #1e293b);
  border-radius: 16px;
  color: #fff;
`;

const IqAnswer = styled.div`
  padding: 1.5rem;
  background: #fff;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 16px;
  font-size: 0.92rem;
  line-height: 1.6;
  color: rgba(15, 23, 42, 0.75);
  ul {
    margin: 0.5rem 0 0;
    padding-left: 1.2rem;
  }
  li {
    margin: 0.35rem 0;
  }
`;

const TestimonialsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Testimonial = styled.blockquote`
  margin: 0;
  padding: 1.35rem;
  background: #fff;
  border-radius: 14px;
  border: 1px solid rgba(15, 23, 42, 0.07);
  font-size: 0.9rem;
  line-height: 1.6;
  color: rgba(15, 23, 42, 0.72);
`;

const TestimonialAuthor = styled.footer`
  margin-top: 0.85rem;
  font-size: 0.8rem;
  font-weight: 700;
  color: #0f172a;
`;

const CtaBand = styled.section`
  position: relative;
  z-index: 1;
  margin: 2rem 2rem 4rem;
  max-width: 1160px;
  margin-left: auto;
  margin-right: auto;
  padding: 2.5rem 2rem;
  border-radius: 20px;
  background: linear-gradient(135deg, #0f172a 0%, #14532d 100%);
  color: #fff;
  text-align: center;
`;

const CtaTitle = styled.h2`
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(1.5rem, 3vw, 2.25rem);
  font-weight: 800;
  margin: 0 0 0.75rem;
`;

const CtaSub = styled.p`
  margin: 0 auto 1.5rem;
  max-width: 32rem;
  opacity: 0.85;
  line-height: 1.6;
`;

const CtaActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
  justify-content: center;
`;

const CtaPrimary = styled(Link)`
  padding: 0.85rem 1.5rem;
  border-radius: 10px;
  background: #fff;
  color: #0f172a;
  font-weight: 800;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
`;

const CtaGhost = styled(Link)`
  padding: 0.85rem 1.5rem;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.35);
  color: #fff;
  font-weight: 700;
  text-decoration: none;
`;

const Legal = styled.p`
  text-align: center;
  font-size: 0.78rem;
  color: rgba(15, 23, 42, 0.4);
  max-width: 40rem;
  margin: 0 auto 3rem;
  padding: 0 1.5rem;
  line-height: 1.55;
  position: relative;
  z-index: 1;
`;

const TICKERS = [
  { sym: 'SPY', price: '541.82', chg: '+0.84%', pos: true },
  { sym: 'QQQ', price: '461.20', chg: '-0.12%', pos: false },
  { sym: 'NVDA', price: '878.35', chg: '+2.41%', pos: true },
  { sym: 'NGX', price: '98,412', chg: '+0.31%', pos: true },
  { sym: 'BTC', price: '67,241', chg: '+3.12%', pos: true },
  { sym: 'AAPL', price: '193.12', chg: '+0.55%', pos: true },
];

const TESTIMONIALS = [
  {
    text: 'Academy scenarios let me blow up a virtual portfolio before I touched real money. The AI tutor explained every mistake.',
    author: 'Amara T. — Young professional',
  },
  {
    text: 'I finally understand why headlines move stocks. Bloomvest IQ breaks it down without telling me what to buy.',
    author: 'David L. — Aspiring investor',
  },
  {
    text: 'Academy feels like Duolingo for finance. Short lessons, quizzes, then straight into a scenario. Addictive in a good way.',
    author: 'Zoe K. — Student',
  },
];

export default function LandingPage() {
  return (
    <Page>
      <BgCanvas>
        <Orb $color="rgba(34,197,94,0.7)" $size={480} $top="-10%" $left="-6%" $anim="a" $dur="22s" $opacity={0.11} />
        <Orb $color="rgba(16,185,129,0.6)" $size={380} $top="30%" $left="62%" $anim="b" $dur="18s" $opacity={0.09} />
      </BgCanvas>
      <DotGrid />

      <RibbonWrap>
        <RibbonTrack>
          {[...TICKERS, ...TICKERS].map((t, i) => (
            <RibbonItem key={i}>
              <RibbonTicker>{t.sym}</RibbonTicker>
              {t.price}
              <RibbonChg $pos={t.pos}>{t.chg}</RibbonChg>
            </RibbonItem>
          ))}
        </RibbonTrack>
      </RibbonWrap>

      <HeroSection $pad="1rem 2rem 2rem">
        <div>
          <HeroBadge initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
            <PulseDot /> {PRODUCT_TAGLINE}
          </HeroBadge>
          <HeroHeadline
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
          >
            The operating system
            <br />
            <em>for financially ambitious people.</em>
          </HeroHeadline>
          <Tagline initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
            Not just traders — built for everyone building wealth literacy.
          </Tagline>
          <HeroSub initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            Learn with AI-guided courses and scenarios in Academy, decode headlines in Bloomvest IQ,
            and ask your Mentor anything — all in one platform.
          </HeroSub>
          <AudienceRow initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.28 }}>
            {AUDIENCES.map((a) => (
              <AudiencePill key={a}>{a}</AudiencePill>
            ))}
          </AudienceRow>
          <HeroActions initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
            <BtnPrimary to="/academy">
              <FaGraduationCap /> Start learning
            </BtnPrimary>
            <BtnGhost to="/academy?tab=scenarios">
              <FaPlay /> Practice scenarios
            </BtnGhost>
            <BtnGhost to="/mentor">
              <FaRobot /> Ask Mentor
            </BtnGhost>
          </HeroActions>
        </div>

        <LayerStack initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
          <div style={{ fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#15803d', marginBottom: '0.35rem' }}>
            Three pillars · one platform
          </div>
          {PLATFORM_LAYERS.map((layer) => {
            const Icon = layer.icon;
            return (
              <LayerPreview key={layer.id} to={layer.path}>
                <LayerNum>L{layer.layer}</LayerNum>
                <LayerIcon $bg={layer.bg} $color={layer.color}>
                  <Icon />
                </LayerIcon>
                <LayerText>
                  <LayerName>{layer.name}</LayerName>
                  <LayerTag>{layer.tagline} — {layer.description.slice(0, 52)}…</LayerTag>
                </LayerText>
                <FaArrowRight style={{ color: '#94a3b8', fontSize: '0.75rem' }} />
              </LayerPreview>
            );
          })}
        </LayerStack>
      </HeroSection>

      <Section>
        <SectionHead>
          <SectionEyebrow>The smartest product structure</SectionEyebrow>
          <SectionTitle>Three pillars. One learning platform.</SectionTitle>
          <SectionLead>
            Academy for courses and practice, IQ for market literacy, Mentor for questions — nothing tells you what to buy.
          </SectionLead>
        </SectionHead>
        <LayersGrid>
          {PLATFORM_LAYERS.map((layer, i) => {
            const Icon = layer.icon;
            return (
              <LayerCard
                key={layer.id}
                to={layer.path}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                {layer.comingSoon && <LayerBadge>Preview</LayerBadge>}
                <LayerIcon $bg={layer.bg} $color={layer.color} style={{ marginBottom: '0.75rem' }}>
                  <Icon />
                </LayerIcon>
                <LayerName style={{ fontSize: '1.1rem', marginBottom: '0.35rem' }}>
                  L{layer.layer} · {layer.name}
                </LayerName>
                <LayerTag style={{ flex: 1, marginBottom: '0.75rem' }}>{layer.description}</LayerTag>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '0.8rem', color: 'rgba(15,23,42,0.55)' }}>
                  {layer.features.map((f) => (
                    <li key={f} style={{ padding: '0.15rem 0' }}>
                      ✓ {f}
                    </li>
                  ))}
                </ul>
              </LayerCard>
            );
          })}
        </LayersGrid>
      </Section>

      <Section $pad="2rem 2rem 4rem" style={{ background: 'rgba(255,255,255,0.5)' }}>
        <SectionHead>
          <SectionEyebrow>How it works</SectionEyebrow>
          <SectionTitle>Learn → Practice → Understand</SectionTitle>
        </SectionHead>
        <StepsRow>
          <StepCard>
            <StepNum>1</StepNum>
            <LayerName>Academy</LayerName>
            <LayerTag>Interactive courses, quizzes, and AI-guided lessons that adapt to your pace.</LayerTag>
          </StepCard>
          <StepCard>
            <StepNum>2</StepNum>
            <LayerName>Bloomvest IQ</LayerName>
            <LayerTag>Headline Decoder and Market Lab — understand news and case studies in plain English.</LayerTag>
          </StepCard>
          <StepCard>
            <StepNum>3</StepNum>
            <LayerName>AI Mentor</LayerName>
            <LayerTag>Ask anything about money, markets, or concepts — educational only.</LayerTag>
          </StepCard>
        </StepsRow>
      </Section>

      <Section>
        <SectionHead>
          <SectionEyebrow>Bloomvest IQ</SectionEyebrow>
          <SectionTitle>Markets explained, not sold</SectionTitle>
          <SectionLead>Ask why something moved. Get context — earnings, valuation, sector rotation — without a buy list.</SectionLead>
        </SectionHead>
        <IqDemo>
          <IqQuestion>
            <div style={{ fontSize: '0.7rem', opacity: 0.7, marginBottom: '0.5rem' }}>Example question</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}>
              “Why did Nvidia drop today?”
            </div>
          </IqQuestion>
          <IqAnswer>
            <strong>Bloomvest IQ might explain:</strong>
            <ul>
              <li>Earnings expectations vs. what the company reported</li>
              <li>Valuation — when prices ran ahead of growth, pullbacks are common</li>
              <li>Broader AI sector rotation as investors rebalance</li>
              <li>Competitive pressure from peers and customers</li>
            </ul>
            <div style={{ marginTop: '1rem' }}>
              <BtnGhost as={Link} to="/iq" style={{ display: 'inline-flex', fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
                <FaBrain /> Explore Bloomvest IQ <FaArrowRight />
              </BtnGhost>
            </div>
          </IqAnswer>
        </IqDemo>
      </Section>

      <Section>
        <SectionHead>
          <SectionEyebrow>Loved by learners</SectionEyebrow>
          <SectionTitle>Built for ambitious people, not just traders</SectionTitle>
        </SectionHead>
        <TestimonialsGrid>
          {TESTIMONIALS.map((t) => (
            <Testimonial key={t.author}>
              <FaQuoteLeft style={{ color: '#22c55e', marginBottom: '0.5rem', opacity: 0.7 }} />
              {t.text}
              <TestimonialAuthor>— {t.author}</TestimonialAuthor>
            </Testimonial>
          ))}
        </TestimonialsGrid>
      </Section>

      <CtaBand>
        <CtaTitle>Ready to build real financial confidence?</CtaTitle>
        <CtaSub>Start free. No brokerage required. Educational platform — not financial advice.</CtaSub>
        <CtaActions>
          <CtaPrimary to="/academy">
            <FaGraduationCap /> Bloomvest Academy
          </CtaPrimary>
          <CtaGhost to="/iq">
            <FaBolt /> Bloomvest IQ
          </CtaGhost>
        </CtaActions>
      </CtaBand>

      <Legal>
        BloomVest is an educational platform. Content is for learning only and is not personalized investment, tax, or
        legal advice. Virtual trading uses simulated money. Always do your own research before real financial decisions.
      </Legal>
    </Page>
  );
}
