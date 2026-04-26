import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
`;

// ─── Layout ─────────────────────────────────────────────────────────────────
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

// ─── Hero ────────────────────────────────────────────────────────────────────
const HeroSection = styled.section`
  padding: 5rem 0 4rem;
  animation: ${fadeIn} 0.7s ease both;
`;

const Eyebrow = styled.div`
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

const EyebrowLine = styled.div`
  width: 2rem;
  height: 1.5px;
  background: rgba(15, 23, 42, 0.25);
`;

const HeroGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem 4rem;
  align-items: start;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const HeroHeadline = styled.h1`
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(2.4rem, 4vw, 3.8rem);
  font-weight: 800;
  color: #0a0f1e;
  line-height: 1.06;
  letter-spacing: -0.025em;
  margin: 0;
`;

const HeroBody = styled.p`
  font-size: 1.05rem;
  line-height: 1.8;
  color: rgba(15, 23, 42, 0.62);
  margin: 0;
  align-self: center;
`;

// ─── Accordion Nav ───────────────────────────────────────────────────────────
const AccordionNav = styled.div`
  background: #dce8e0;
  border-radius: 12px;
  overflow: hidden;
  margin: 3.5rem 0;
`;

const AccordionItem = styled.button`
  display: grid;
  grid-template-columns: 2.5rem 1fr auto auto;
  align-items: center;
  gap: 1rem;
  width: 100%;
  padding: 1.25rem 1.75rem;
  background: ${p => p.$active ? 'rgba(15,23,42,0.06)' : 'transparent'};
  border: none;
  border-bottom: 1px solid rgba(15, 23, 42, 0.08);
  cursor: pointer;
  text-align: left;
  transition: background 0.2s;

  &:last-child { border-bottom: none; }
  &:hover { background: rgba(15, 23, 42, 0.05); }
`;

const AccNum = styled.span`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.72rem;
  font-weight: 700;
  color: rgba(15, 23, 42, 0.3);
`;

const AccTitle = styled.span`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.05rem;
  font-weight: 800;
  color: #0a0f1e;
`;

const AccSub = styled.span`
  font-size: 0.85rem;
  color: rgba(15, 23, 42, 0.45);
  @media (max-width: 640px) { display: none; }
`;

const AccArrow = styled.span`
  font-size: 1rem;
  color: rgba(15, 23, 42, 0.4);
  transition: transform 0.25s;
  transform: ${p => p.$open ? 'rotate(180deg)' : 'rotate(0deg)'};
`;

// ─── Service Detail ──────────────────────────────────────────────────────────
const ServiceDetail = styled.section`
  padding: 5rem 0;
  scroll-margin-top: 80px;
`;

const ServiceDetailInner = styled.div`
  display: grid;
  grid-template-columns: 4rem 1fr;
  gap: 0 2.5rem;
  margin-bottom: 3.5rem;
  @media (max-width: 768px) { grid-template-columns: 1fr; gap: 0.5rem; }
`;

const BigNum = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 5rem;
  font-weight: 800;
  color: #0a0f1e;
  line-height: 1;
  letter-spacing: -0.03em;
  @media (max-width: 768px) { font-size: 3rem; }
`;

const ServiceDetailRight = styled.div``;

const ServiceTagline = styled.div`
  font-size: 0.67rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(15, 23, 42, 0.4);
  margin-bottom: 0.5rem;
`;

const ServiceTitle = styled.h2`
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(1.8rem, 2.8vw, 2.6rem);
  font-weight: 800;
  color: #0a0f1e;
  letter-spacing: -0.025em;
  margin: 0 0 1rem;
`;

const ServiceDesc = styled.p`
  font-size: 1.05rem;
  line-height: 1.8;
  color: rgba(15, 23, 42, 0.62);
  margin: 0;
  max-width: 600px;
`;

const DividerLine = styled.div`
  height: 1px;
  background: rgba(15, 23, 42, 0.1);
  margin-bottom: 3rem;
`;

const ThreeColGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
  align-items: start;
  @media (max-width: 900px) { grid-template-columns: 1fr; }
`;

const ColBlock = styled.div`
  background: #dce8e0;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const ColBlockInner = styled.div`
  padding: 1.5rem;
  flex: 1;
`;

const ColLabel = styled.div`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #15803d;
  margin-bottom: 1.25rem;
`;

const FocusItem = styled.div`
  padding: 0.85rem 0;
  border-bottom: 1px solid rgba(15, 23, 42, 0.08);

  &:last-child { border-bottom: none; }
`;

const FocusTitle = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: 0.98rem;
  color: #0a0f1e;
  margin-bottom: 0.25rem;
`;

const FocusSub = styled.div`
  font-size: 0.85rem;
  color: rgba(15, 23, 42, 0.58);
  line-height: 1.55;
`;

const DeliverableItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  font-size: 0.88rem;
  color: rgba(15, 23, 42, 0.75);
  padding: 0.6rem 0;
  border-bottom: 1px solid rgba(15, 23, 42, 0.08);
  &:last-child { border-bottom: none; }
`;

const Arrow = styled.span`
  color: #22c55e;
  flex-shrink: 0;
  margin-top: 1px;
  font-size: 0.78rem;
`;

// ─── Engagement Card ─────────────────────────────────────────────────────────
const EngagementCard = styled.div`
  background: rgba(15, 23, 42, 0.06);
  border-radius: 8px;
  padding: 1.25rem;
  margin-top: 1rem;
`;

const EngCardLabel = styled.div`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.58rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(15, 23, 42, 0.4);
  margin-bottom: 0.85rem;
`;

const EngRow = styled.div`
  display: grid;
  grid-template-columns: 5.5rem 1fr;
  font-size: 0.8rem;
  padding: 0.45rem 0;
  border-bottom: 1px solid rgba(15, 23, 42, 0.07);

  &:last-of-type { border-bottom: none; }
`;

const EngKey = styled.span`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.72rem;
  color: rgba(15, 23, 42, 0.4);
`;

const EngVal = styled.span`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.72rem;
  font-weight: 700;
  color: #0a0f1e;
`;

const DiscussBtn = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.9rem 1.5rem;
  background: #0a0f1e;
  color: white;
  font-weight: 700;
  font-size: 0.84rem;
  text-decoration: none;
  transition: background 0.2s;
  &:hover { background: #15803d; }
`;

const WhoItsFor = styled.p`
  font-size: 0.9rem;
  line-height: 1.7;
  color: rgba(15, 23, 42, 0.68);
  margin: 0 0 0;
`;

// ─── Service Divider ─────────────────────────────────────────────────────────
const ServiceDivider = styled.div`
  height: 1px;
  background: rgba(15, 23, 42, 0.1);
  margin: 2rem 0 0;
`;

// ─── Data ─────────────────────────────────────────────────────────────────────
const SERVICES = [
  {
    id: 'capital',
    num: '01',
    tagline: 'CAPITAL · GROW YOUR MONEY & RAISE FINANCE',
    title: 'Investment & Fundraising',
    desc: 'Whether you want to grow a personal portfolio, raise money for your business, or structure finance for a big move — we help you access the right capital on the right terms.',
    accSub: 'Personal & business capital',
    focus: [
      { title: 'Personal investment strategies', sub: 'Portfolios, ISAs, and structured plans built around your risk appetite and timeline.' },
      { title: 'Business fundraising', sub: 'Pitch decks, investor intros, and round strategy for SMEs and growth companies.' },
      { title: 'Capital structuring', sub: 'Equity, debt, grants, and blended finance — whichever route fits your situation.' },
    ],
    deliverables: [
      'Investment plan or round strategy memo',
      'Investor-ready pitch deck (if raising)',
      'Financial model tailored to your stage',
      'Curated investor or lender introductions',
      'Term sheet review & negotiation guidance',
      'Ongoing advisory (retainer option)',
    ],
    who: 'Individuals wanting to invest smarter, business owners ready to raise their first or next round, and companies structuring larger finance deals.',
    engagement: { Length: '4–14 weeks', Format: 'Project or retainer', Team: 'Advisor + analyst', 'Starts at': '£5K' },
  },
  {
    id: 'insight',
    num: '02',
    tagline: 'INSIGHT · KNOW BEFORE YOU MOVE',
    title: 'Market Research & Intelligence',
    desc: 'Before you invest, expand, or launch — know what you\'re walking into. We give you clear, honest research so your decisions are grounded in evidence, not assumptions.',
    accSub: 'Research & market intelligence',
    focus: [
      { title: 'Opportunity & market sizing', sub: 'Is the market big enough? Is the timing right? We model it so you can decide with confidence.' },
      { title: 'Competitive landscape', sub: 'Who\'s already there, what they charge, and where the gaps are.' },
      { title: 'Market entry & expansion', sub: 'The risks, the regulations, and the partners you need before stepping in.' },
    ],
    deliverables: [
      'Clear market sizing with scenario analysis',
      'Competitor map and positioning gaps',
      'Sector expert interviews',
      'Market entry or expansion playbook',
      'AI-powered trend and sentiment scan',
      'Monthly intelligence updates (retainer)',
    ],
    who: 'Individuals researching where to invest, businesses validating a new product or market, and larger companies planning international expansion.',
    engagement: { Length: '2–8 weeks', Format: 'Project or retainer', Team: 'Analyst + AI layer', 'Starts at': '£3K' },
  },
  {
    id: 'execution',
    num: '03',
    tagline: 'EXECUTION · FROM PLAN TO RESULTS',
    title: 'Growth & Strategy',
    desc: 'Having money or insight isn\'t enough — you need a plan that actually gets executed. We build the strategy, set the targets, and stay in it until you\'re moving.',
    accSub: 'Strategy & execution',
    focus: [
      { title: 'Growth planning', sub: 'Where to focus, which markets to enter, and what to stop doing.' },
      { title: 'Revenue & pricing model', sub: 'Make sure your numbers stack up and your margins are real.' },
      { title: 'KPIs & accountability', sub: 'Clear targets, dashboards, and quarterly check-ins so progress is visible.' },
    ],
    deliverables: [
      'Growth strategy and 90-day action plan',
      'Revenue and pricing model',
      'KPI framework and performance dashboard',
      'Go-to-market or expansion playbook',
      'OKR setup with quarterly milestones',
      'Monthly advisory sessions (retainer)',
    ],
    who: 'Individuals managing a portfolio who want a clear plan, SMEs ready to scale, and larger companies entering new markets or restructuring for growth.',
    engagement: { Length: '6–16 weeks', Format: 'Project or retainer', Team: 'Strategist + analyst', 'Starts at': '£8K' },
  },
];

// ─── Component ───────────────────────────────────────────────────────────────
const MarketingServices = () => {
  const [openAcc, setOpenAcc] = useState(null);

  const toggle = (id) => setOpenAcc(openAcc === id ? null : id);

  return (
    <Page>
      <Container>
        {/* Hero */}
        <HeroSection>
          <Eyebrow>
            <span>00</span>
            <EyebrowLine />
            <span>SERVICES</span>
            <EyebrowLine />
            <span>CAPITAL · INSIGHT · GROWTH</span>
          </Eyebrow>

          <HeroGrid>
            <HeroHeadline>Whatever your goal, we have a service for it.</HeroHeadline>
            <HeroBody>
              Grow your personal wealth, fund your business, understand a market, or build a strategy
              that holds. Our three services work independently or together — one partner, one plan,
              accountable from start to finish.
            </HeroBody>
          </HeroGrid>
        </HeroSection>

        {/* Accordion Nav */}
        <AccordionNav>
          {SERVICES.map((s, i) => (
            <AccordionItem
              key={s.id}
              $active={openAcc === s.id}
              onClick={() => toggle(s.id)}
            >
              <AccNum>0{i + 1}</AccNum>
              <AccTitle>{s.title}</AccTitle>
              <AccSub>{s.accSub}</AccSub>
              <AccArrow $open={openAcc === s.id}>↓</AccArrow>
            </AccordionItem>
          ))}
        </AccordionNav>
      </Container>

      {/* Service Sections */}
      {SERVICES.map((s) => (
        <Container key={s.id} id={s.id}>
          <ServiceDetail>
            <ServiceDetailInner>
              <BigNum>{s.num}</BigNum>
              <ServiceDetailRight>
                <ServiceTagline>{s.tagline}</ServiceTagline>
                <ServiceTitle>{s.title}</ServiceTitle>
                <ServiceDesc>{s.desc}</ServiceDesc>
              </ServiceDetailRight>
            </ServiceDetailInner>

            <DividerLine />

            <ThreeColGrid>
              {/* Focus Areas */}
              <ColBlock>
                <ColBlockInner>
                  <ColLabel>FOCUS AREAS</ColLabel>
                  {s.focus.map((f) => (
                    <FocusItem key={f.title}>
                      <FocusTitle>{f.title}</FocusTitle>
                      <FocusSub>{f.sub}</FocusSub>
                    </FocusItem>
                  ))}
                </ColBlockInner>
              </ColBlock>

              {/* What You Get */}
              <ColBlock>
                <ColBlockInner>
                  <ColLabel>WHAT YOU GET</ColLabel>
                  {s.deliverables.map((d) => (
                    <DeliverableItem key={d}>
                      <Arrow>→</Arrow>
                      {d}
                    </DeliverableItem>
                  ))}
                </ColBlockInner>
              </ColBlock>

              {/* Who It's For */}
              <ColBlock>
                <ColBlockInner>
                  <ColLabel>WHO IT'S FOR</ColLabel>
                  <WhoItsFor>{s.who}</WhoItsFor>
                  <EngagementCard>
                    <EngCardLabel>TYPICAL ENGAGEMENT</EngCardLabel>
                    {Object.entries(s.engagement).map(([k, v]) => (
                      <EngRow key={k}>
                        <EngKey>{k}</EngKey>
                        <EngVal>{v}</EngVal>
                      </EngRow>
                    ))}
                  </EngagementCard>
                </ColBlockInner>
                <DiscussBtn to="/contact?tab=service">
                  Discuss this service <span>→</span>
                </DiscussBtn>
              </ColBlock>
            </ThreeColGrid>

            <ServiceDivider />
          </ServiceDetail>
        </Container>
      ))}
    </Page>
  );
};

export default MarketingServices;
