import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(18px); }
  to { opacity: 1; transform: translateY(0); }
`;

// ─── Layout ────────────────────────────────────────────────────────────────
const Page = styled.div`
  background: #f5f5f0;
  min-height: 100vh;
  padding-top: 64px;
  font-family: 'Inter', sans-serif;
`;

const Container = styled.div`
  max-width: 1320px;
  margin: 0 auto;
  padding: 0 2rem;
  @media (max-width: 768px) { padding: 0 1.25rem; }
`;

// ─── Hero ───────────────────────────────────────────────────────────────────
const Hero = styled.section`
  padding: 5rem 0 4rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
  @media (max-width: 960px) {
    grid-template-columns: 1fr;
    padding: 3.5rem 0 2.5rem;
  }
`;

const HeroLeft = styled.div`
  animation: ${fadeIn} 0.7s ease both;
`;

const Eyebrow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 1.5rem;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(15, 23, 42, 0.45);
`;

const EyebrowLine = styled.div`
  width: 2rem;
  height: 1.5px;
  background: rgba(15, 23, 42, 0.25);
`;

const HeroHeadline = styled.h1`
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(2.8rem, 5vw, 4.8rem);
  font-weight: 800;
  line-height: 1.04;
  color: #0a0f1e;
  margin: 0 0 1.5rem;
  letter-spacing: -0.025em;

  em {
    font-style: italic;
    color: #15803d;
  }

  @media (max-width: 480px) { font-size: clamp(2rem, 8vw, 2.6rem); margin-bottom: 1rem; }
`;

const HeroSub = styled.p`
  font-size: 1.1rem;
  line-height: 1.75;
  color: rgba(15, 23, 42, 0.62);
  max-width: 440px;
  margin: 0 0 2.25rem;
  @media (max-width: 480px) { font-size: 0.95rem; max-width: 100%; margin-bottom: 1.5rem; }
`;

const HeroCTAs = styled.div`
  display: flex;
  align-items: center;
  gap: 1.25rem;
  flex-wrap: wrap;
  @media (max-width: 480px) { flex-direction: column; align-items: stretch; gap: 0.75rem; }
`;

const BtnPrimary = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.9rem 1.75rem;
  background: #0a0f1e;
  color: white;
  font-weight: 700;
  font-size: 0.95rem;
  border-radius: 10px;
  text-decoration: none;
  transition: all 0.2s ease;

  &::before {
    content: '●';
    color: #22c55e;
    font-size: 0.55rem;
  }

  &:hover { background: #15803d; transform: translateY(-1px); }
  @media (max-width: 480px) { width: 100%; padding: 0.85rem 1rem; }
`;

const BtnGhost = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.9rem 1.4rem;
  color: #0a0f1e;
  font-weight: 700;
  font-size: 0.95rem;
  text-decoration: none;
  border-bottom: 2px solid #0a0f1e;
  transition: all 0.2s ease;

  &:hover { color: #15803d; border-color: #15803d; }
  @media (max-width: 480px) { width: 100%; padding: 0.85rem 1rem; border: 1px solid rgba(15,23,42,0.2); border-radius: 10px; }
`;

// ─── Hero Right Card ────────────────────────────────────────────────────────
const HeroCard = styled.div`
  background: #dce8e0;
  border-radius: 12px;
  overflow: hidden;
  animation: ${fadeIn} 0.9s ease 0.15s both;
  @media (max-width: 960px) { margin-top: 1rem; }
`;

const HeroCardHeader = styled.div`
  padding: 1.4rem 1.5rem 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const HeroCardLabel = styled.div`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #15803d;
`;

const HeroCardSub = styled.div`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.62rem;
  font-weight: 600;
  color: rgba(15, 23, 42, 0.4);
`;

const HeroCardBody = styled.div`
  padding: 1.25rem 1.5rem;
`;

const OfferingRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(15, 23, 42, 0.08);

  &:last-child { border-bottom: none; }
`;

const OfferingIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: ${p => p.$bg};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  flex-shrink: 0;
`;

const OfferingText = styled.div`
  flex: 1;
`;

const OfferingTitle = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.92rem;
  font-weight: 800;
  color: #0a0f1e;
  margin-bottom: 0.2rem;
`;

const OfferingDesc = styled.div`
  font-size: 0.78rem;
  color: rgba(15, 23, 42, 0.55);
  line-height: 1.5;
`;

const OfferingTag = styled.span`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.58rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${p => p.$color};
  background: ${p => p.$bg};
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  flex-shrink: 0;
  align-self: center;
`;

const HeroCardCTA = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  background: #0a0f1e;
  color: white;
  font-weight: 700;
  font-size: 0.85rem;
  text-decoration: none;
  transition: background 0.2s;

  &:hover { background: #15803d; }
`;

// ─── Stats ──────────────────────────────────────────────────────────────────
const StatsBar = styled.div`
  border-top: 1px solid rgba(15, 23, 42, 0.1);
  padding: 2.5rem 0;
  display: flex;
  gap: 3.5rem;
  flex-wrap: wrap;
  @media (max-width: 640px) { gap: 2rem; }
  @media (max-width: 480px) { gap: 1.5rem; padding: 1.75rem 0; }
`;

const Stat = styled.div``;

const StatNum = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 2.2rem;
  font-weight: 800;
  color: #0a0f1e;
  line-height: 1;
  margin-bottom: 0.35rem;
  @media (max-width: 480px) { font-size: 1.7rem; }
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: rgba(15, 23, 42, 0.5);
`;

// ─── Section shared ──────────────────────────────────────────────────────────
const SectionEyebrow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(15, 23, 42, 0.45);
  margin-bottom: 1.75rem;
`;

const SectionNum = styled.span`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.68rem;
  color: rgba(15, 23, 42, 0.3);
`;

// ─── What We Do ─────────────────────────────────────────────────────────────
const WhatWeDo = styled.section`
  padding: 5.5rem 0;
`;

const WWDGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem 4rem;
  align-items: start;
  margin-bottom: 3.5rem;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const WWDHeadline = styled.h2`
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(2.2rem, 3.5vw, 3.2rem);
  font-weight: 800;
  color: #0a0f1e;
  line-height: 1.08;
  letter-spacing: -0.025em;
  margin: 0;
`;

const WWDBody = styled.p`
  font-size: 1.05rem;
  line-height: 1.8;
  color: rgba(15, 23, 42, 0.62);
  max-width: 480px;
  margin: 0;
  align-self: center;
`;

const DividerLine = styled.div`
  height: 1px;
  background: rgba(15, 23, 42, 0.1);
  margin-bottom: 3rem;
`;

const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
  @media (max-width: 768px) { grid-template-columns: 1fr; }
`;

const ServiceCard = styled(Link)`
  background: #dce8e0;
  border-radius: 12px;
  padding: 0;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(15, 23, 42, 0.1);
  }
`;

const ServiceCardNum = styled.div`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(15, 23, 42, 0.4);
  margin-bottom: 0.85rem;
`;

const ServiceCardBody = styled.div`
  padding: 1.6rem 1.6rem 1.4rem;
  flex: 1;
`;

const ServiceCardTitle = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.1rem;
  font-weight: 800;
  color: #0a0f1e;
  margin-bottom: 0.6rem;
  letter-spacing: -0.01em;
`;

const ServiceCardSub = styled.div`
  font-size: 0.88rem;
  color: rgba(15, 23, 42, 0.58);
  line-height: 1.65;
`;

const ServiceCardLink = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.9rem 1.6rem;
  background: #0a0f1e;
  color: white;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.01em;
  transition: background 0.2s;

  ${ServiceCard}:hover & { background: #15803d; }
`;

// ─── How We Work ────────────────────────────────────────────────────────────
const HowSection = styled.section`
  background: #ede8e0;
  padding: 5.5rem 0;
`;

const HowGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem 4rem;
  align-items: start;
  margin-bottom: 3rem;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const HowHeadline = styled.h2`
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(2rem, 3.2vw, 3rem);
  font-weight: 800;
  color: #0a0f1e;
  line-height: 1.08;
  letter-spacing: -0.025em;
  margin: 0;
`;

const HowBody = styled.p`
  font-size: 1.05rem;
  line-height: 1.8;
  color: rgba(15, 23, 42, 0.62);
  margin: 0;
  align-self: center;
`;

const StepsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;
  @media (max-width: 900px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 560px) { grid-template-columns: 1fr; }
`;

const StepCard = styled.div`
  background: #dce8e0;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const StepCardBody = styled.div`
  padding: 1.6rem 1.5rem 1.4rem;
  flex: 1;
`;

const StepNum = styled.div`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #15803d;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::after {
    content: '';
    display: block;
    flex: 1;
    height: 1px;
    background: rgba(15, 23, 42, 0.12);
  }
`;

const StepTitle = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.05rem;
  font-weight: 800;
  color: #0a0f1e;
  margin-bottom: 0.6rem;
  letter-spacing: -0.01em;
`;

const StepBody = styled.div`
  font-size: 0.88rem;
  line-height: 1.7;
  color: rgba(15, 23, 42, 0.6);
`;

// ─── Selected Work ───────────────────────────────────────────────────────────
const WorkSection = styled.section`
  padding: 5.5rem 0;
`;

const WorkHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 2.5rem;
  gap: 1rem;
  flex-wrap: wrap;
`;

const WorkHeadline = styled.h2`
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(2rem, 3.2vw, 3rem);
  font-weight: 800;
  color: #0a0f1e;
  letter-spacing: -0.025em;
  margin: 0;
`;

const SeeAll = styled(Link)`
  font-size: 0.88rem;
  font-weight: 700;
  color: rgba(15, 23, 42, 0.55);
  text-decoration: none;
  border-bottom: 1px solid rgba(15, 23, 42, 0.2);
  white-space: nowrap;
  align-self: flex-end;
  padding-bottom: 1px;
  transition: color 0.2s;
  &:hover { color: #15803d; border-color: #15803d; }
`;

const CasesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  @media (max-width: 900px) { grid-template-columns: 1fr; }
`;

const CaseCard = styled.div`
  background: #dce8e0;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const CaseCardInner = styled.div`
  padding: 1.6rem 1.6rem 1.4rem;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const CaseCardTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.1rem;
`;

const CaseTag = styled.span`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(15, 23, 42, 0.4);
`;

const CaseBadge = styled.span`
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${p => p.$color};
  display: flex;
  align-items: center;
  gap: 0.25rem;
  &::before { content: '●'; font-size: 0.45rem; }
`;

const CaseTitle = styled.h3`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.2rem;
  font-weight: 800;
  color: #0a0f1e;
  margin: 0 0 0.7rem;
  letter-spacing: -0.01em;
`;

const CaseBody = styled.p`
  font-size: 0.9rem;
  line-height: 1.7;
  color: rgba(15, 23, 42, 0.62);
  margin: 0 0 1rem;
  flex: 1;
`;

const CaseTags = styled.div`
  display: flex;
  gap: 0.45rem;
  flex-wrap: wrap;
`;

const CaseTagPill = styled.span`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.62rem;
  font-weight: 600;
  color: rgba(15, 23, 42, 0.55);
  background: rgba(15, 23, 42, 0.07);
  padding: 0.22rem 0.6rem;
  border-radius: 4px;
`;

const CaseCardBottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.95rem 1.6rem;
  background: #0a0f1e;
`;

const CaseMeta = styled.div`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.74rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.45);
`;

const CaseRead = styled(Link)`
  font-size: 0.8rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.75);
  text-decoration: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding-bottom: 1px;
  transition: color 0.2s, border-color 0.2s;
  &:hover { color: #22c55e; border-color: #22c55e; }
`;

// ─── Data ────────────────────────────────────────────────────────────────────
const offerings = [
  {
    icon: '📈',
    iconBg: 'rgba(34,197,94,0.12)',
    title: 'Grow your money',
    desc: 'Whether you\'re starting out or scaling up — we build strategies that compound.',
    tag: 'INDIVIDUALS',
    tagColor: '#15803d',
    tagBg: 'rgba(34,197,94,0.12)',
  },
  {
    icon: '🏢',
    iconBg: 'rgba(8,145,178,0.12)',
    title: 'Fund & expand your business',
    desc: 'SMEs ready to raise capital, enter new markets, or sharpen their numbers.',
    tag: 'SMEs',
    tagColor: '#0891b2',
    tagBg: 'rgba(8,145,178,0.12)',
  },
  {
    icon: '🌍',
    iconBg: 'rgba(245,158,11,0.12)',
    title: 'Scale into new markets',
    desc: 'Corporates and growth companies looking to expand regionally or globally.',
    tag: 'ENTERPRISE',
    tagColor: '#d97706',
    tagBg: 'rgba(245,158,11,0.12)',
  },
];

const cases = [
  {
    tag: 'INDIVIDUAL · PORTFOLIO',
    badge: 'GROWTH',
    badgeColor: '#22c55e',
    title: 'From savings to structured portfolio',
    body: 'Helped a first-time investor turn idle savings into a diversified portfolio — clear risk profile, automatic rebalancing, and a 10-year growth plan.',
    pills: ['Portfolio design', 'Risk profiling'],
    meta: '£180K deployed · 8 weeks',
  },
  {
    tag: 'SME · FUNDRAISE',
    badge: 'CAPITAL',
    badgeColor: '#0891b2',
    title: 'Series A close — £4.2M',
    body: 'Took a Lagos-based logistics SME from no investor deck to a closed round in 11 weeks. Investor narrative, model, and intro calls handled end to end.',
    pills: ['Pitch deck', 'Investor intros'],
    meta: '£4.2M closed · 11 weeks',
  },
  {
    tag: 'CORPORATE · EXPANSION',
    badge: 'INSIGHT',
    badgeColor: '#f59e0b',
    title: 'MENA market entry strategy',
    body: 'Built the market-sizing case and regulatory map for a European firm entering Gulf utilities. Two anchor partnerships identified and signed.',
    pills: ['Market research', 'Entry strategy'],
    meta: '2 LOIs signed · 6 weeks',
  },
];

// ─── Component ───────────────────────────────────────────────────────────────
const MarketingHomepage = () => (
  <Page>
    {/* ── Hero ── */}
    <Container>
      <Hero>
        <HeroLeft
          as={motion.div}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <Eyebrow>
            <span>00</span>
            <EyebrowLine />
            <span>BLOOMVEST</span>
            <EyebrowLine />
            <span>FOR INDIVIDUALS, SMES & GROWING COMPANIES</span>
          </Eyebrow>

          <HeroHeadline>
            Grow your finances,<br />
            raise capital, and{' '}
            <em>take smart risks.</em>
          </HeroHeadline>

          <HeroSub>
            Bloomvest pairs human advisory with AI-driven intelligence —
            so whether you're an individual investor, a small business, or a
            company expanding globally, you get a plan that actually works.
          </HeroSub>

          <HeroCTAs>
            <BtnPrimary to="/contact">Book a free call →</BtnPrimary>
            <BtnGhost to="/marketing-services">See what we do</BtnGhost>
          </HeroCTAs>
        </HeroLeft>

        {/* Who we work with card */}
        <HeroCard
          as={motion.div}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
        >
          <HeroCardHeader>
            <HeroCardLabel>WHO WE WORK WITH</HeroCardLabel>
            <HeroCardSub>BLOOMVEST CAPITAL</HeroCardSub>
          </HeroCardHeader>

          <HeroCardBody>
            {offerings.map((o) => (
              <OfferingRow key={o.title}>
                <OfferingIcon $bg={o.iconBg}>{o.icon}</OfferingIcon>
                <OfferingText>
                  <OfferingTitle>{o.title}</OfferingTitle>
                  <OfferingDesc>{o.desc}</OfferingDesc>
                </OfferingText>
                <OfferingTag $color={o.tagColor} $bg={o.tagBg}>{o.tag}</OfferingTag>
              </OfferingRow>
            ))}
          </HeroCardBody>

          <HeroCardCTA to="/marketing-services">
            Explore all services <span>→</span>
          </HeroCardCTA>
        </HeroCard>
      </Hero>

      {/* Stats */}
      <StatsBar
        as={motion.div}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <Stat><StatNum>£840M+</StatNum><StatLabel>Capital advised on</StatLabel></Stat>
        <Stat><StatNum>47</StatNum><StatLabel>Engagements closed</StatLabel></Stat>
        <Stat><StatNum>12</StatNum><StatLabel>Sectors covered</StatLabel></Stat>
      </StatsBar>
    </Container>

    {/* ── What We Do ── */}
    <WhatWeDo>
      <Container
        as={motion.div}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <SectionEyebrow>
          <SectionNum>01</SectionNum>
          <EyebrowLine />
          <span>WHAT WE DO</span>
        </SectionEyebrow>

        <WWDGrid>
          <WWDHeadline>One partner.<br />Every stage of growth.</WWDHeadline>
          <WWDBody>
            You don't need three different firms. Whether you're investing your first £10K,
            raising your first round, or expanding into a new continent — we cover it, and we
            connect the dots between capital, insight, and execution.
          </WWDBody>
        </WWDGrid>

        <DividerLine />

        <ServicesGrid>
          <ServiceCard to="/marketing-services#capital">
            <ServiceCardBody>
              <ServiceCardNum>01 / Capital</ServiceCardNum>
              <ServiceCardTitle>Investment & Fundraising</ServiceCardTitle>
              <ServiceCardSub>
                Personal investment strategies, business fundraising, and capital structuring —
                from your first ISA to a Series B close.
              </ServiceCardSub>
            </ServiceCardBody>
            <ServiceCardLink>Learn more <span>→</span></ServiceCardLink>
          </ServiceCard>

          <ServiceCard to="/marketing-services#insight">
            <ServiceCardBody>
              <ServiceCardNum>02 / Insight</ServiceCardNum>
              <ServiceCardTitle>Market Research & Intelligence</ServiceCardTitle>
              <ServiceCardSub>
                Clear, jargon-free research that shows you where the opportunities are and
                what risks to watch — before you commit.
              </ServiceCardSub>
            </ServiceCardBody>
            <ServiceCardLink>Learn more <span>→</span></ServiceCardLink>
          </ServiceCard>

          <ServiceCard to="/marketing-services#execution">
            <ServiceCardBody>
              <ServiceCardNum>03 / Execution</ServiceCardNum>
              <ServiceCardTitle>Growth & Strategy</ServiceCardTitle>
              <ServiceCardSub>
                Go-to-market plans, revenue model design, and KPI frameworks for businesses
                ready to move from planning to doing.
              </ServiceCardSub>
            </ServiceCardBody>
            <ServiceCardLink>Learn more <span>→</span></ServiceCardLink>
          </ServiceCard>
        </ServicesGrid>
      </Container>
    </WhatWeDo>

    {/* ── How We Work ── */}
    <HowSection>
      <Container
        as={motion.div}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <SectionEyebrow>
          <SectionNum>02</SectionNum>
          <EyebrowLine />
          <span>HOW WE WORK</span>
        </SectionEyebrow>

        <HowGrid>
          <HowHeadline>
            Simple steps.<br />Real results.
          </HowHeadline>
          <HowBody>
            No lengthy onboarding. No jargon. Just a clear process from your first call to
            the moment you're moving with confidence — whether that's a signed term sheet,
            a deployed portfolio, or a new market entry.
          </HowBody>
        </HowGrid>

        <StepsGrid>
          {[
            {
              n: '01',
              title: 'Tell us your goal',
              body: 'A free 30-minute call. You share what you want to achieve — grow money, raise capital, expand, or all three.',
            },
            {
              n: '02',
              title: 'We build the picture',
              body: 'Our team researches your market, models your numbers, and runs AI-powered intelligence scans so decisions are grounded in evidence.',
            },
            {
              n: '03',
              title: 'You get a clear plan',
              body: 'A concrete strategy — not a thick PDF. The path, the milestones, the risks to manage, and the moves to make next.',
            },
            {
              n: '04',
              title: 'We execute together',
              body: "We don't disappear after delivery. We stay in it — investor intros, negotiations, market entry, whatever it takes to close.",
            },
          ].map((s) => (
            <StepCard key={s.n}>
              <StepCardBody>
                <StepNum>{s.n}</StepNum>
                <StepTitle>{s.title}</StepTitle>
                <StepBody>{s.body}</StepBody>
              </StepCardBody>
            </StepCard>
          ))}
        </StepsGrid>
      </Container>
    </HowSection>

    {/* ── Selected Work ── */}
    <WorkSection>
      <Container
        as={motion.div}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <SectionEyebrow>
          <SectionNum>03</SectionNum>
          <EyebrowLine />
          <span>SELECTED WORK</span>
        </SectionEyebrow>

        <WorkHeader>
          <WorkHeadline>Results for people like you.</WorkHeadline>
          <SeeAll to="#">See all engagements →</SeeAll>
        </WorkHeader>

        <CasesGrid>
          {cases.map((c) => (
            <CaseCard key={c.title}>
              <CaseCardInner>
                <CaseCardTop>
                  <CaseTag>{c.tag}</CaseTag>
                  <CaseBadge $color={c.badgeColor}>{c.badge}</CaseBadge>
                </CaseCardTop>
                <CaseTitle>{c.title}</CaseTitle>
                <CaseBody>{c.body}</CaseBody>
                <CaseTags>
                  {c.pills.map((p) => <CaseTagPill key={p}>{p}</CaseTagPill>)}
                </CaseTags>
              </CaseCardInner>
              <CaseCardBottom>
                <CaseMeta>{c.meta}</CaseMeta>
                <CaseRead to="#">Read case →</CaseRead>
              </CaseCardBottom>
            </CaseCard>
          ))}
        </CasesGrid>
      </Container>
    </WorkSection>
  </Page>
);

export default MarketingHomepage;
