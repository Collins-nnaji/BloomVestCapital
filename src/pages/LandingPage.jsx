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
    radial-gradient(ellipse 55% 45% at 25% 30%, rgba(21,128,61,0.35), transparent 60%),
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
  color: #22c55e;
  margin: 0 0 1.1rem;
`;

const Title = styled(motion.h1)`
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(2.4rem, 7vw, 4.5rem);
  font-weight: 800;
  margin: 0 0 1.2rem;
  letter-spacing: -0.03em;
  line-height: 1.06;
  background: linear-gradient(180deg, #fff 40%, #bbf7d0 100%);
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
  background: linear-gradient(135deg, #22c55e, #15803d);
  color: #1c1917;
  box-shadow: 0 8px 28px rgba(21,128,61,0.35);
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
    background: #22c55e;
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
  color: #15803d;
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

const ListWrap = styled.div`
  max-width: 760px;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const StreamRow = styled(motion.div)`
  display: flex;
  gap: 1.4rem;
  align-items: flex-start;
  padding: 1.8rem 0;
  border-bottom: 1.5px solid #e7e2db;
  &:last-child {
    border-bottom: none;
  }
`;

const RowIndex = styled.div`
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(21,128,61,0.1);
  color: #15803d;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
`;

const RowContent = styled.div`
  flex: 1;
`;

const StreamTitle = styled.h3`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.2rem;
  font-weight: 700;
  color: #1c1917;
  margin: 0 0 0.45rem;
  letter-spacing: -0.01em;
`;

const StreamDesc = styled.p`
  color: #57534e;
  font-size: 0.92rem;
  line-height: 1.65;
  margin: 0;
  font-family: 'Inter', sans-serif;
  max-width: 580px;
`;

const STREAMS = [
  {
    icon: FaSearchLocation,
    title: 'Property Sourcing',
    desc: 'We find undervalued and off-market deals, package the full analysis including price, renovation cost, and projected return, then connect them with investors ready to move.',
  },
  {
    icon: FaHammer,
    title: 'Buy, Refurbish & Sell',
    desc: 'We buy undervalued properties, transform them, and sell for profit. The change is visible, before and after, room by room, and the results speak for themselves.',
  },
  {
    icon: FaKey,
    title: 'Buy-to-Let Portfolio',
    desc: 'Single lets, HMOs, and serviced accommodation form long-term, income-generating property built to grow steadily over years, not months.',
  },
  {
    icon: FaHandshake,
    title: 'Joint Ventures',
    desc: 'We bring the deal and the expertise. You bring the capital. Together we structure a fair split and grow a shared portfolio.',
  },
  {
    icon: FaCity,
    title: 'Property Development',
    desc: 'Converting commercial buildings, building new homes, and developing blocks of flats represents the long-term, high-value end of what we do.',
  },
  {
    icon: FaCoins,
    title: 'Property Finance',
    desc: 'We help private and commercial buyers structure purchase finance, bridging, and investment funding at whatever stage the deal is at.',
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
  color: #fff;
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
            Your go-to partner for private and commercial property, covering purchase,
            finance, and investment. We source, refurbish, and grow property assets
            across the UK and Nigeria.
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
        <SectionTitle>How property blooms with us</SectionTitle>
        <SectionSub>
          Purchase, finance, or invest in private or commercial property. From zero-capital
          deal sourcing to long-term development, we build wealth through property at every stage.
        </SectionSub>
        <ListWrap>
          {STREAMS.map((s, i) => (
            <StreamRow
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <RowIndex><s.icon /></RowIndex>
              <RowContent>
                <StreamTitle>{s.title}</StreamTitle>
                <StreamDesc>{s.desc}</StreamDesc>
              </RowContent>
            </StreamRow>
          ))}
        </ListWrap>
      </Streams>

      <CloseSection>
        <CloseTitle>Found a property you'd like to discuss?</CloseTitle>
        <CloseSub>
          Whether you're investing, selling, or exploring a joint venture, talk to our team,
          or run the numbers yourself first.
        </CloseSub>
        <CtaRow style={{ marginBottom: 0 }}>
          <PrimaryCta to="/enquiry">Get in touch</PrimaryCta>
          <SecondaryCta to="/valuation">Try the valuation tool</SecondaryCta>
        </CtaRow>
      </CloseSection>
    </Page>
  );
}
