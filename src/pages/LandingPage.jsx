import React from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FaSearchLocation, FaHammer, FaKey, FaHandshake, FaCity, FaCoins,
} from 'react-icons/fa';

const drift = keyframes`
  0%   { transform: translate(0, 0) scale(1); }
  50%  { transform: translate(-2%, 2%) scale(1.05); }
  100% { transform: translate(0, 0) scale(1); }
`;

const Page = styled.div`
  background: #1c1917;
`;

const Hero = styled.section`
  position: relative;
  min-height: 100vh;
  margin-top: -64px;
  padding-top: 64px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  overflow: hidden;
  color: #fff;
`;

const Glow = styled.div`
  position: absolute;
  inset: -10%;
  background:
    radial-gradient(ellipse 55% 45% at 25% 30%, rgba(184,137,63,0.35), transparent 60%),
    radial-gradient(ellipse 50% 40% at 80% 70%, rgba(77,124,95,0.28), transparent 60%);
  animation: ${drift} 18s ease-in-out infinite;
  pointer-events: none;
`;

const Grain = styled.div`
  position: absolute;
  inset: 0;
  background-image: linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
  background-size: 48px 48px;
  pointer-events: none;
`;

const HeroInner = styled.div`
  position: relative;
  z-index: 1;
  max-width: 880px;
  padding: 0 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Eyebrow = styled(motion.p)`
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #d4a857;
  margin: 0 0 1.1rem;
`;

const Title = styled(motion.h1)`
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(2.4rem, 7vw, 4.5rem);
  font-weight: 800;
  margin: 0 0 1.2rem;
  letter-spacing: -0.03em;
  line-height: 1.06;
  background: linear-gradient(180deg, #fff 40%, #e7d9bd 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`;

const Sub = styled(motion.p)`
  color: #d6d3d1;
  font-size: clamp(1rem, 1.6vw, 1.2rem);
  max-width: 620px;
  margin: 0 0 2.2rem;
  font-family: 'Inter', sans-serif;
  line-height: 1.65;
`;

const CtaRow = styled(motion.div)`
  display: flex;
  gap: 0.9rem;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 2.5rem;
`;

const Cta = styled(Link)`
  padding: 0.95rem 1.8rem;
  border-radius: 10px;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 0.95rem;
  text-decoration: none;
  transition: transform 0.18s, opacity 0.18s;
  &:hover { transform: translateY(-2px); }
`;

const PrimaryCta = styled(Cta)`
  background: linear-gradient(135deg, #d4a857, #b8893f);
  color: #1c1917;
  box-shadow: 0 8px 28px rgba(184,137,63,0.35);
`;

const SecondaryCta = styled(Cta)`
  background: rgba(255,255,255,0.06);
  color: #fff;
  border: 1.5px solid rgba(255,255,255,0.18);
  backdrop-filter: blur(6px);
`;

const MarketBadges = styled(motion.div)`
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const MarketBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.9rem;
  border-radius: 100px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.15);
  color: #e7e2db;
  font-family: 'Inter', sans-serif;
  font-size: 0.78rem;
  font-weight: 600;
`;

const ScrollHint = styled(motion.div)`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  width: 22px;
  height: 36px;
  border-radius: 100px;
  border: 2px solid rgba(255,255,255,0.35);
  z-index: 1;
  &::before {
    content: '';
    position: absolute;
    top: 6px;
    left: 50%;
    width: 4px;
    height: 8px;
    border-radius: 100px;
    background: #d4a857;
    transform: translateX(-50%);
    animation: scrollDot 1.6s ease-in-out infinite;
  }
  @keyframes scrollDot {
    0% { opacity: 1; top: 6px; }
    100% { opacity: 0; top: 18px; }
  }
`;

const Streams = styled.section`
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem 1.5rem;
  background: #faf8f5;
`;

const SectionEyebrow = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #b8893f;
  margin: 0 0 0.6rem;
  text-align: center;
`;

const SectionTitle = styled.h2`
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(1.8rem, 4vw, 2.6rem);
  font-weight: 800;
  color: #1c1917;
  margin: 0 0 0.75rem;
  text-align: center;
  letter-spacing: -0.02em;
`;

const SectionSub = styled.p`
  color: #57534e;
  font-size: 1rem;
  max-width: 560px;
  margin: 0 auto 3rem;
  text-align: center;
  font-family: 'Inter', sans-serif;
  line-height: 1.6;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 1.1rem;
  max-width: 1100px;
  width: 100%;
`;

const StreamCard = styled(motion.div)`
  background: #fff;
  border: 1.5px solid #e7e2db;
  border-radius: 18px;
  padding: 1.6rem 1.4rem;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
  &:hover {
    border-color: #d4a857;
    transform: translateY(-4px);
    box-shadow: 0 16px 32px rgba(28,25,23,0.08);
  }
`;

const IconWrap = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: rgba(184,137,63,0.12);
  color: #b8893f;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.15rem;
  margin-bottom: 0.3rem;
`;

const StreamTitle = styled.h3`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.08rem;
  font-weight: 700;
  color: #1c1917;
  margin: 0;
`;

const StreamDesc = styled.p`
  color: #57534e;
  font-size: 0.86rem;
  line-height: 1.55;
  margin: 0;
  font-family: 'Inter', sans-serif;
`;

const StreamMeta = styled.div`
  margin-top: auto;
  padding-top: 0.6rem;
  font-family: 'Inter', sans-serif;
  font-size: 0.74rem;
  font-weight: 700;
  color: #4d7c5f;
`;

const STREAMS = [
  {
    icon: FaSearchLocation,
    title: 'Property Sourcing',
    desc: 'We find undervalued and off-market deals, package the full analysis, and connect them with investors.',
    meta: 'From £2k–£8k per deal',
  },
  {
    icon: FaHammer,
    title: 'Buy, Refurbish & Sell',
    desc: 'We buy undervalued properties, transform them, and sell for profit — visibly, before-and-after.',
    meta: '£15k–£50k+ per flip',
  },
  {
    icon: FaKey,
    title: 'Buy-to-Let Portfolio',
    desc: 'Single lets, HMOs, and serviced accommodation — long-term income-generating property.',
    meta: '£300–£1,500+/month per property',
  },
  {
    icon: FaHandshake,
    title: 'Joint Ventures',
    desc: 'We bring the deal and the expertise. You bring the capital. We split the profit.',
    meta: 'Typically 50/50 or 60/40',
  },
  {
    icon: FaCity,
    title: 'Property Development',
    desc: 'Converting commercial buildings, building new homes, and developing blocks of flats.',
    meta: 'Long-term, high-value projects',
  },
  {
    icon: FaCoins,
    title: 'Property Finance',
    desc: 'Helping private and commercial buyers structure purchase finance, bridging, and investment funding.',
    meta: 'Purchase, bridging & investment finance',
  },
];

const CloseSection = styled.section`
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 4rem 1.5rem;
  background: #1c1917;
  color: #fff;
`;

const CloseTitle = styled.h2`
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(1.8rem, 4vw, 2.6rem);
  font-weight: 800;
  margin: 0 0 1rem;
  letter-spacing: -0.02em;
`;

const CloseSub = styled.p`
  color: #d6d3d1;
  max-width: 520px;
  margin: 0 0 2rem;
  font-family: 'Inter', sans-serif;
  line-height: 1.6;
`;

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

export default function LandingPage() {
  return (
    <Page>
      <Hero>
        <Glow />
        <Grain />
        <HeroInner>
          <Eyebrow {...fadeUp} animate="animate" initial="initial" transition={{ duration: 0.6 }}>
            Bloomvest Property
          </Eyebrow>
          <Title {...fadeUp} animate="animate" initial="initial" transition={{ duration: 0.7, delay: 0.1 }}>
            We take undervalued properties and unlock their true potential.
          </Title>
          <Sub {...fadeUp} animate="animate" initial="initial" transition={{ duration: 0.7, delay: 0.22 }}>
            Your go-to partner for private and commercial property — purchase, finance,
            and investment — sourcing, refurbishing, and growing property assets across
            the UK and Nigeria.
          </Sub>
          <CtaRow {...fadeUp} animate="animate" initial="initial" transition={{ duration: 0.7, delay: 0.34 }}>
            <PrimaryCta to="/enquiry">Enquire as an investor</PrimaryCta>
            <SecondaryCta to="/enquiry">I have a property to sell</SecondaryCta>
          </CtaRow>
          <MarketBadges {...fadeUp} animate="animate" initial="initial" transition={{ duration: 0.7, delay: 0.45 }}>
            <MarketBadge>🇬🇧 United Kingdom</MarketBadge>
            <MarketBadge>🇳🇬 Nigeria</MarketBadge>
            <MarketBadge>Private Property</MarketBadge>
            <MarketBadge>Commercial Property</MarketBadge>
          </MarketBadges>
        </HeroInner>
        <ScrollHint />
      </Hero>

      <Streams>
        <SectionEyebrow>What we do</SectionEyebrow>
        <SectionTitle>Five ways property blooms with us</SectionTitle>
        <SectionSub>
          Purchase, finance, or invest — private or commercial. From zero-capital deal
          sourcing to long-term development, we build wealth through property at every stage.
        </SectionSub>
        <Grid>
          {STREAMS.map((s, i) => (
            <StreamCard
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <IconWrap><s.icon /></IconWrap>
              <StreamTitle>{s.title}</StreamTitle>
              <StreamDesc>{s.desc}</StreamDesc>
              <StreamMeta>{s.meta}</StreamMeta>
            </StreamCard>
          ))}
        </Grid>
      </Streams>

      <CloseSection>
        <CloseTitle>Found a property you'd like to discuss?</CloseTitle>
        <CloseSub>
          Whether you're investing, selling, or exploring a joint venture — talk to our team.
        </CloseSub>
        <PrimaryCta to="/enquiry">Get in touch</PrimaryCta>
      </CloseSection>
    </Page>
  );
}
