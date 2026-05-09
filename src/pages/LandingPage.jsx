import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowRight, FaChartLine, FaGraduationCap, FaUserCircle, FaBolt } from 'react-icons/fa';

const shimmer = keyframes`
  0%   { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.5; }
`;

/* ── page shell ─────────────────────────────────────────────── */
const Page = styled.div`
  --g: #15803d;
  --g-soft: rgba(34,197,94,0.1);
  --ink: #0a0f1e;
  height: calc(100vh - 64px);
  padding-top: 64px;
  font-family: 'Inter', sans-serif;
  display: flex;
  flex-direction: column;
  background:
    radial-gradient(ellipse 110% 70% at 50% -10%, rgba(34,197,94,0.13), transparent 52%),
    linear-gradient(180deg, #f0f4ef 0%, #eef1ec 100%);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: radial-gradient(rgba(15,23,42,0.04) 1px, transparent 1px);
    background-size: 22px 22px;
    mask-image: linear-gradient(180deg, black 0%, transparent 80%);
    pointer-events: none;
  }

  @media (max-width: 768px) {
    height: auto;
    min-height: calc(100vh - 64px);
    overflow-y: auto;
  }
`;

const Shell = styled.div`
  position: relative;
  z-index: 1;
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 0 1.5rem;
  justify-content: center;
  gap: 1.75rem;

  @media (max-width: 768px) {
    padding: 1.5rem 1.25rem 2rem;
    justify-content: flex-start;
    gap: 1.5rem;
  }
`;

/* ── hero row ───────────────────────────────────────────────── */
const Hero = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 2rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }
`;

const HeroLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
`;

const Badge = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.28rem 0.75rem;
  border-radius: 999px;
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--g);
  background: rgba(255,255,255,0.88);
  border: 1px solid rgba(34,197,94,0.22);
  box-shadow: 0 2px 12px rgba(15,23,42,0.06);
  width: max-content;
`;

const BadgeDot = styled.span`
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #22c55e;
  animation: ${pulse} 2s ease infinite;
`;

const Title = styled(motion.h1)`
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(1.8rem, 3.2vw, 2.75rem);
  font-weight: 800;
  line-height: 1.08;
  letter-spacing: -0.03em;
  color: var(--ink);
  margin: 0;

  span.hl {
    background: linear-gradient(120deg, var(--g) 0%, #0f766e 50%, var(--g) 100%);
    background-size: 200% auto;
    animation: ${shimmer} 5s linear infinite;
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
`;

const Lead = styled(motion.p)`
  margin: 0;
  font-size: clamp(0.88rem, 1.4vw, 1rem);
  line-height: 1.65;
  color: rgba(15,23,42,0.54);
  max-width: 30rem;
`;

const Actions = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
  align-items: center;
  margin-top: 0.15rem;
`;

const BtnPrimary = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.72rem 1.3rem;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.88rem;
  color: #fff;
  background: linear-gradient(135deg, #0f172a 0%, #14532d 100%);
  text-decoration: none;
  border: 1px solid rgba(255,255,255,0.08);
  box-shadow: 0 6px 22px rgba(15,23,42,0.2);
  transition: transform 0.18s, box-shadow 0.18s;
  &:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(21,128,61,0.28); }
  svg { font-size: 0.78rem; }
`;

const BtnGhost = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.72rem 1.1rem;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.88rem;
  color: var(--ink);
  background: rgba(255,255,255,0.75);
  border: 1px solid rgba(15,23,42,0.1);
  text-decoration: none;
  backdrop-filter: blur(8px);
  transition: border-color 0.18s, background 0.18s;
  &:hover { border-color: rgba(34,197,94,0.35); background: rgba(255,255,255,0.95); }
`;

/* ── preview card (right side of hero) ─────────────────────── */
const PreviewCard = styled(motion.div)`
  width: 280px;
  flex-shrink: 0;
  border-radius: 16px;
  background: rgba(255,255,255,0.94);
  border: 1px solid rgba(15,23,42,0.08);
  box-shadow: 0 16px 40px rgba(15,23,42,0.1), 0 0 0 1px rgba(255,255,255,0.6) inset;
  overflow: hidden;
  transform: rotateY(-4deg) rotateX(2deg);
  transition: transform 0.3s;
  &:hover { transform: rotateY(-2deg) rotateX(1deg) translateY(-3px); }

  @media (max-width: 900px) { display: none; }
`;

const CardChrome = styled.div`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.5rem 0.85rem;
  background: rgba(15,23,42,0.04);
  border-bottom: 1px solid rgba(15,23,42,0.06);
`;
const CDot = styled.span`
  width: 8px; height: 8px; border-radius: 50%; background: ${p => p.$color};
`;
const CardLabel = styled.div`
  margin-left: auto;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.56rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: rgba(15,23,42,0.35);
`;

const CardBody = styled.div`
  padding: 0.9rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
`;

const Bubble = styled.div`
  padding: 0.55rem 0.75rem;
  border-radius: 10px;
  font-size: 0.72rem;
  line-height: 1.5;
  color: rgba(15,23,42,0.7);
  background: ${p => p.$user ? 'rgba(21,128,61,0.1)' : '#fff'};
  border: 1px solid rgba(15,23,42,${p => p.$user ? '0.06' : '0.07'});
`;

const MiniGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.4rem;
`;

const MiniMetric = styled.div`
  padding: 0.42rem 0.5rem;
  border-radius: 8px;
  background: rgba(15,23,42,0.03);
  border: 1px solid rgba(15,23,42,0.06);
`;
const ML = styled.div`font-size:0.52rem;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:rgba(15,23,42,0.38);margin-bottom:0.15rem;`;
const MV = styled.div`font-family:'Space Grotesk',sans-serif;font-size:0.82rem;font-weight:800;color:var(--ink);`;

/* ── feature cards row ──────────────────────────────────────── */
const Cards = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.85rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 0.65rem;
  }
`;

const Card = styled(Link)`
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
  padding: 1rem 1.1rem;
  background: rgba(255,255,255,0.82);
  border: 1px solid rgba(15,23,42,0.08);
  border-radius: 14px;
  text-decoration: none;
  color: inherit;
  backdrop-filter: blur(12px);
  position: relative;
  overflow: hidden;
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;

  &::after {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(34,197,94,0.6), transparent);
    opacity: 0;
    transition: opacity 0.2s;
  }

  &:hover {
    border-color: rgba(34,197,94,0.28);
    box-shadow: 0 10px 28px rgba(15,23,42,0.08);
    transform: translateY(-3px);
    &::after { opacity: 1; }
  }
`;

const CardIcon = styled.div`
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.95rem;
  color: var(--g);
  background: var(--g-soft);
`;

const CardText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  flex: 1;
`;

const CardTitle = styled.span`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.92rem;
  font-weight: 700;
  color: var(--ink);
`;

const CardDesc = styled.span`
  font-size: 0.78rem;
  line-height: 1.52;
  color: rgba(15,23,42,0.5);
`;

const CardArrow = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--g);
  margin-top: 0.3rem;
  svg { transition: transform 0.18s; }
  ${Card}:hover & svg { transform: translateX(3px); }
`;

/* ── steps bar ──────────────────────────────────────────────── */
const Steps = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0;
  padding: 0.9rem 1rem;
  border-radius: 12px;
  background: rgba(255,255,255,0.58);
  border: 1px solid rgba(15,23,42,0.07);

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    padding: 0.75rem;
  }
`;

const Step = styled.div`
  text-align: center;
  padding: 0.25rem 0.75rem;

  @media (min-width: 641px) {
    &:not(:last-child) { border-right: 1px solid rgba(15,23,42,0.07); }
  }
  @media (max-width: 640px) {
    text-align: left;
    &:not(:last-child) { border-bottom: 1px solid rgba(15,23,42,0.07); padding-bottom: 0.65rem; margin-bottom: 0.65rem; }
  }
`;

const StepNum = styled.div`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.58rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  color: var(--g);
  margin-bottom: 0.2rem;
`;

const StepTitle = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: 0.86rem;
  color: var(--ink);
  margin-bottom: 0.15rem;
`;

const StepBody = styled.div`
  font-size: 0.72rem;
  line-height: 1.48;
  color: rgba(15,23,42,0.46);
`;

/* ── disclaimer ─────────────────────────────────────────────── */
const Disclaimer = styled(motion.p)`
  margin: 0;
  font-size: 0.7rem;
  line-height: 1.55;
  color: rgba(15,23,42,0.38);
  text-align: center;
  padding-bottom: 0.5rem;
`;

/* ── animation variants ─────────────────────────────────────── */
const fadeUp = {
  hidden:  { opacity: 0, y: 14 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.055, duration: 0.48, ease: [0.22, 1, 0.36, 1] },
  }),
};

/* ── component ──────────────────────────────────────────────── */
const LandingPage = () => (
  <Page>
    <Shell>

      {/* ── hero ── */}
      <Hero>
        <HeroLeft>
          <Badge variants={fadeUp} initial="hidden" animate="visible" custom={0}>
            <BadgeDot /> BloomVest Finance
          </Badge>

          <Title variants={fadeUp} initial="hidden" animate="visible" custom={1}>
            Learn markets, run scenarios,<br />
            and tap <span className="hl">AI intelligence</span>—<br />
            all in one workspace.
          </Title>

          <Lead variants={fadeUp} initial="hidden" animate="visible" custom={2}>
            Practice ideas safely in Learn, then open BloomVest Intelligence
            for AI-driven signals and market context. Sign in to sync progress.
          </Lead>

          <Actions variants={fadeUp} initial="hidden" animate="visible" custom={3}>
            <BtnPrimary to="/signals">
              <FaBolt /> Open Intelligence <FaArrowRight />
            </BtnPrimary>
            <BtnGhost to="/learn">Browse Learn</BtnGhost>
          </Actions>
        </HeroLeft>

        <PreviewCard
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={4}
        >
          <CardChrome>
            <CDot $color="#ef4444" /><CDot $color="#f59e0b" /><CDot $color="#22c55e" />
            <CardLabel>BLOOMVEST · LIVE</CardLabel>
          </CardChrome>
          <CardBody>
            <Bubble>Summarize how rate cuts affect growth vs. value over 2 quarters—educational framing only.</Bubble>
            <Bubble $user>Here's a neutral textbook-style overview to pair with your research…</Bubble>
            <MiniGrid>
              <MiniMetric><ML>Lesson</ML><MV>4/12</MV></MiniMetric>
              <MiniMetric><ML>Scenario</ML><MV>Budget</MV></MiniMetric>
              <MiniMetric><ML>Focus</ML><MV>Risk</MV></MiniMetric>
            </MiniGrid>
          </CardBody>
        </PreviewCard>
      </Hero>

      {/* ── feature cards ── */}
      <Cards
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.07, delayChildren: 0.25 } } }}
      >
        {[
          { to: '/signals', icon: <FaChartLine />, title: 'BloomVest Intelligence', desc: 'AI signals, deep analysis, and market context to stress-test your assumptions.' },
          { to: '/learn',   icon: <FaGraduationCap />, title: 'Learn',              desc: 'Structured lessons and live scenarios so concepts stick before you risk capital.' },
          { to: '/auth',    icon: <FaUserCircle />,    title: 'Your Account',       desc: 'Sign in to sync academy progress and keep workspace preferences in one place.' },
        ].map(({ to, icon, title, desc }) => (
          <Card key={to} to={to} as={motion(Link)} variants={fadeUp}>
            <CardIcon>{icon}</CardIcon>
            <CardText>
              <CardTitle>{title}</CardTitle>
              <CardDesc>{desc}</CardDesc>
              <CardArrow>Go <FaArrowRight /></CardArrow>
            </CardText>
          </Card>
        ))}
      </Cards>

      {/* ── steps ── */}
      <Steps
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.42, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        {[
          ['01', 'Ground yourself',  'Bite-sized lessons that explain mechanics before tactics.'],
          ['02', 'Practice safely',  'Rehearse decisions with scenarios and hypothetical numbers.'],
          ['03', 'Go deeper',        'Open Intelligence when you want AI context layered on top.'],
        ].map(([n, t, b]) => (
          <Step key={n}>
            <StepNum>{n}</StepNum>
            <StepTitle>{t}</StepTitle>
            <StepBody>{b}</StepBody>
          </Step>
        ))}
      </Steps>

      {/* ── disclaimer ── */}
      <Disclaimer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55, duration: 0.4 }}
      >
        Educational content only — not personalized financial advice. Do your own research or speak
        with a licensed professional before acting on anything you read here.
      </Disclaimer>

    </Shell>
  </Page>
);

export default LandingPage;
