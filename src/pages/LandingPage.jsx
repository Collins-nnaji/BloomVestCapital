import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowRight, FaChartLine, FaGraduationCap, FaUserCircle } from 'react-icons/fa';

const shimmer = keyframes`
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
`;

const Page = styled.div`
  --landing-green: #15803d;
  --landing-green-soft: rgba(34, 197, 94, 0.12);
  --landing-ink: #0a0f1e;
  background:
    radial-gradient(ellipse 120% 80% at 50% -20%, rgba(34, 197, 94, 0.14), transparent 55%),
    radial-gradient(ellipse 70% 50% at 100% 40%, rgba(15, 23, 42, 0.06), transparent 50%),
    linear-gradient(180deg, #f0f4ef 0%, #f5f5f0 35%, #eef1ec 100%);
  min-height: calc(100vh - 64px);
  padding-top: 64px;
  font-family: 'Inter', sans-serif;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: radial-gradient(rgba(15, 23, 42, 0.045) 1px, transparent 1px);
    background-size: 24px 24px;
    mask-image: linear-gradient(180deg, black 0%, black 60%, transparent 100%);
    pointer-events: none;
  }
`;

const Shell = styled.div`
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: clamp(2rem, 5vw, 3.5rem) 1.5rem clamp(2.5rem, 8vw, 4.5rem);
`;

const Hero = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: clamp(2rem, 5vw, 3rem);
  align-items: center;
  margin-bottom: clamp(3rem, 8vw, 4.5rem);

  @media (min-width: 960px) {
    grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
    gap: 3rem;
  }
`;

const Badge = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.85rem;
  border-radius: 999px;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--landing-green);
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid rgba(34, 197, 94, 0.22);
  box-shadow: 0 4px 20px rgba(15, 23, 42, 0.06);
  margin-bottom: 1.25rem;
`;

const BadgeDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #22c55e;
  box-shadow: 0 0 10px rgba(34, 197, 94, 0.8);
`;

const Title = styled(motion.h1)`
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(2.35rem, 4.8vw, 3.65rem);
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -0.035em;
  color: var(--landing-ink);
  margin: 0 0 1.25rem;

  span.highlight {
    background: linear-gradient(120deg, var(--landing-green) 0%, #0f766e 50%, var(--landing-green) 100%);
    background-size: 200% auto;
    animation: ${shimmer} 5s ease infinite;
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
`;

const Lead = styled(motion.p)`
  margin: 0 0 1.75rem;
  font-size: clamp(1.02rem, 2vw, 1.14rem);
  line-height: 1.72;
  color: rgba(15, 23, 42, 0.58);
  max-width: 34rem;
`;

const HeroActions = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
`;

const BtnPrimary = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.88rem 1.45rem;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.92rem;
  color: #fff;
  background: linear-gradient(135deg, #0f172a 0%, #14532d 100%);
  text-decoration: none;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 10px 34px rgba(15, 23, 42, 0.22);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 14px 40px rgba(21, 128, 61, 0.28);
  }

  svg {
    font-size: 0.85rem;
    opacity: 0.9;
  }
`;

const BtnGhost = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.88rem 1.25rem;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.92rem;
  color: var(--landing-ink);
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(15, 23, 42, 0.1);
  text-decoration: none;
  backdrop-filter: blur(10px);
  transition: border-color 0.2s ease, background 0.2s ease;

  &:hover {
    border-color: rgba(34, 197, 94, 0.35);
    background: rgba(255, 255, 255, 0.95);
  }
`;

const PreviewWrap = styled(motion.div)`
  perspective: 1200px;
`;

const PreviewCard = styled.div`
  border-radius: 20px;
  background: linear-gradient(155deg, rgba(255, 255, 255, 0.94) 0%, rgba(248, 250, 247, 0.88) 100%);
  border: 1px solid rgba(15, 23, 42, 0.08);
  box-shadow:
    0 24px 48px rgba(15, 23, 42, 0.1),
    0 0 0 1px rgba(255, 255, 255, 0.6) inset;
  overflow: hidden;
  transform: rotateY(-4deg) rotateX(3deg);
  transition: transform 0.35s ease;

  @media (max-width: 959px) {
    transform: none;
    max-width: 420px;
    margin: 0 auto;
  }

  &:hover {
    transform: rotateY(-2deg) rotateX(2deg) translateY(-4px);

    @media (max-width: 959px) {
      transform: translateY(-4px);
    }
  }
`;

const PreviewChrome = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.65rem 1rem;
  background: rgba(15, 23, 42, 0.04);
  border-bottom: 1px solid rgba(15, 23, 42, 0.06);
`;

const ChromeDot = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${(p) => p.$color};
`;

const PreviewTitle = styled.div`
  margin-left: auto;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: rgba(15, 23, 42, 0.38);
`;

const PreviewBody = styled.div`
  padding: 1.15rem 1.15rem 1.35rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ChatRow = styled.div`
  display: flex;
  gap: 0.65rem;
  align-items: flex-start;
`;

const ChatBubble = styled.div`
  flex: 1;
  padding: 0.65rem 0.85rem;
  border-radius: 12px;
  font-size: 0.78rem;
  line-height: 1.55;
  color: rgba(15, 23, 42, 0.72);
  background: ${(p) => (p.$user ? 'rgba(21, 128, 61, 0.12)' : '#fff')};
  border: 1px solid rgba(15, 23, 42, ${(p) => (p.$user ? '0.06' : '0.07')});
`;

const MiniMetrics = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
`;

const Metric = styled.div`
  padding: 0.55rem 0.6rem;
  border-radius: 10px;
  background: rgba(15, 23, 42, 0.03);
  border: 1px solid rgba(15, 23, 42, 0.06);
`;

const MetricLabel = styled.div`
  font-size: 0.58rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: rgba(15, 23, 42, 0.38);
  margin-bottom: 0.2rem;
`;

const MetricVal = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.92rem;
  font-weight: 800;
  color: var(--landing-ink);
`;

const SectionHead = styled(motion.div)`
  text-align: center;
  max-width: 560px;
  margin: 0 auto 2rem;
`;

const SectionEyebrow = styled.p`
  margin: 0 0 0.5rem;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(15, 23, 42, 0.38);
`;

const SectionTitle = styled.h2`
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(1.45rem, 3vw, 1.85rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--landing-ink);
  margin: 0;
`;

const Cards = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.1rem;

  @media (max-width: 820px) {
    grid-template-columns: 1fr;
    max-width: 440px;
    margin: 0 auto;
  }
`;

const Card = styled(Link)`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  padding: 1.5rem 1.45rem 1.35rem;
  background: rgba(255, 255, 255, 0.78);
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 18px;
  text-decoration: none;
  color: inherit;
  backdrop-filter: blur(12px);
  overflow: hidden;
  transition: border-color 0.22s ease, box-shadow 0.22s ease, transform 0.22s ease;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, transparent, rgba(34, 197, 94, 0.65), transparent);
    opacity: 0;
    transition: opacity 0.22s ease;
  }

  &:hover {
    border-color: rgba(34, 197, 94, 0.28);
    box-shadow: 0 20px 44px rgba(15, 23, 42, 0.09);
    transform: translateY(-4px);

    &::after {
      opacity: 1;
    }
  }
`;

const CardIcon = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  color: var(--landing-green);
  background: var(--landing-green-soft);
  margin-bottom: 1rem;
`;

const CardTitle = styled.span`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.08rem;
  font-weight: 700;
  color: var(--landing-ink);
  margin-bottom: 0.4rem;
`;

const CardDesc = styled.span`
  font-size: 0.86rem;
  line-height: 1.58;
  color: rgba(15, 23, 42, 0.54);
  margin-bottom: 1rem;
  flex: 1;
`;

const CardLink = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--landing-green);

  svg {
    transition: transform 0.2s ease;
  }

  ${Card}:hover & svg {
    transform: translateX(4px);
  }
`;

const Steps = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-top: clamp(2.5rem, 6vw, 3.25rem);
  padding: 1.35rem 1.25rem;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.55);
  border: 1px solid rgba(15, 23, 42, 0.07);

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const Step = styled.div`
  text-align: center;
  padding: 0.35rem;

  @media (min-width: 641px) {
    &:not(:last-child) {
      border-right: 1px solid rgba(15, 23, 42, 0.06);
    }
  }

  @media (max-width: 640px) {
    &:not(:last-child) {
      border-bottom: 1px solid rgba(15, 23, 42, 0.06);
      padding-bottom: 1rem;
    }
  }
`;

const StepNum = styled.div`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  color: var(--landing-green);
  margin-bottom: 0.35rem;
`;

const StepTitle = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--landing-ink);
  margin-bottom: 0.25rem;
`;

const StepBody = styled.div`
  font-size: 0.78rem;
  line-height: 1.5;
  color: rgba(15, 23, 42, 0.48);
  max-width: 220px;
  margin: 0 auto;
`;

const Disclaimer = styled(motion.footer)`
  margin-top: clamp(2.25rem, 5vw, 3rem);
  padding-top: 1.5rem;
  border-top: 1px solid rgba(15, 23, 42, 0.07);
  font-size: 0.78rem;
  line-height: 1.65;
  color: rgba(15, 23, 42, 0.42);
  text-align: center;
  max-width: 520px;
  margin-left: auto;
  margin-right: auto;
`;

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  }),
};

const LandingPage = () => (
  <Page>
    <Shell>
      <Hero>
        <div>
          <Badge variants={fadeUp} initial="hidden" animate="visible" custom={0}>
            <BadgeDot /> BloomVest Finance
          </Badge>
          <Title variants={fadeUp} initial="hidden" animate="visible" custom={1}>
            Build literacy, run scenarios, and chat with{' '}
            <span className="highlight">market intelligence</span>—without leaving one workspace.
          </Title>
          <Lead variants={fadeUp} initial="hidden" animate="visible" custom={2}>
            Practice ideas safely in Learn, then explore BloomVest Intelligence for AI-assisted context
            around signals and portfolios. Sign in to track progress across sessions.
          </Lead>
          <HeroActions variants={fadeUp} initial="hidden" animate="visible" custom={3}>
            <BtnPrimary to="/signals">
              Open Intelligence <FaArrowRight />
            </BtnPrimary>
            <BtnGhost to="/learn">Browse Learn</BtnGhost>
          </HeroActions>
        </div>

        <PreviewWrap
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={4}
        >
          <PreviewCard>
            <PreviewChrome>
              <ChromeDot $color="#ef4444" />
              <ChromeDot $color="#f59e0b" />
              <ChromeDot $color="#22c55e" />
              <PreviewTitle>BLOOMVEST · PREVIEW</PreviewTitle>
            </PreviewChrome>
            <PreviewBody>
              <ChatRow>
                <ChatBubble>
                  Summarize how rate cuts typically affect growth vs. value tilt over the next two quarters—
                  educational framing only.
                </ChatBubble>
              </ChatRow>
              <ChatRow>
                <ChatBubble $user>
                  Here’s a neutral, textbook-style overview you can pair with your own research…
                </ChatBubble>
              </ChatRow>
              <MiniMetrics>
                <Metric>
                  <MetricLabel>Lesson</MetricLabel>
                  <MetricVal>4 / 12</MetricVal>
                </Metric>
                <Metric>
                  <MetricLabel>Scenario</MetricLabel>
                  <MetricVal>Budget</MetricVal>
                </Metric>
                <Metric>
                  <MetricLabel>Focus</MetricLabel>
                  <MetricVal>Risk</MetricVal>
                </Metric>
              </MiniMetrics>
            </PreviewBody>
          </PreviewCard>
        </PreviewWrap>
      </Hero>

      <SectionHead
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5 }}
      >
        <SectionEyebrow>Three entry points</SectionEyebrow>
        <SectionTitle>Pick where you want to start—everything connects.</SectionTitle>
      </SectionHead>

      <Cards>
        <Card to="/signals">
          <CardIcon>
            <FaChartLine />
          </CardIcon>
          <CardTitle>BloomVest Intelligence</CardTitle>
          <CardDesc>
            Signals, workspace views, and conversational AI to stress-test assumptions—not to replace your
            judgment.
          </CardDesc>
          <CardLink>
            Launch workspace <FaArrowRight />
          </CardLink>
        </Card>
        <Card to="/learn">
          <CardIcon>
            <FaGraduationCap />
          </CardIcon>
          <CardTitle>Learn</CardTitle>
          <CardDesc>
            Structured lessons and scenarios so concepts stick before you risk real capital.
          </CardDesc>
          <CardLink>
            Start learning <FaArrowRight />
          </CardLink>
        </Card>
        <Card to="/auth">
          <CardIcon>
            <FaUserCircle />
          </CardIcon>
          <CardTitle>Your account</CardTitle>
          <CardDesc>
            Sign in to sync academy progress and keep your workspace preferences in one place.
          </CardDesc>
          <CardLink>
            Sign in <FaArrowRight />
          </CardLink>
        </Card>
      </Cards>

      <Steps
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5, delay: 0.08 }}
      >
        <Step>
          <StepNum>01</StepNum>
          <StepTitle>Ground yourself</StepTitle>
          <StepBody>Work through bite-sized lessons that explain mechanics before tactics.</StepBody>
        </Step>
        <Step>
          <StepNum>02</StepNum>
          <StepTitle>Practice safely</StepTitle>
          <StepBody>Use scenarios to rehearse decisions with hypothetical numbers.</StepBody>
        </Step>
        <Step>
          <StepNum>03</StepNum>
          <StepTitle>Go deeper</StepTitle>
          <StepBody>Open Intelligence when you want AI context layered on what you’ve learned.</StepBody>
        </Step>
      </Steps>

      <Disclaimer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
      >
        Educational content only; not personalized financial advice. Nothing here is an offer or
        recommendation to buy or sell securities. Do your own research or speak with a licensed
        professional before acting.
      </Disclaimer>
    </Shell>
  </Page>
);

export default LandingPage;
