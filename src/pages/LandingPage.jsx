import React, { useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaChevronDown, FaArrowRight, FaShieldAlt, FaChartLine, FaBell, FaUsers } from 'react-icons/fa';
import LiveMarketRail from '../components/LiveMarketRail';
import IntelligenceShowcase from '../components/IntelligenceShowcase';
import useLiveMarketFeed from '../hooks/useLiveMarketFeed';

/* ── animations ────────────────────────────────── */
const shimmer = keyframes`
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;
const pulse = keyframes`0%,100%{opacity:.6;transform:translateY(0)}50%{opacity:1;transform:translateY(6px)}`;
const float = keyframes`0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}`;
const glowDrift = keyframes`
  0%   { transform: translate(0,0) scale(1); opacity:.7; }
  33%  { transform: translate(40px,-30px) scale(1.1); opacity:1; }
  66%  { transform: translate(-20px,20px) scale(.95); opacity:.8; }
  100% { transform: translate(0,0) scale(1); opacity:.7; }
`;

/* ── shared helpers ─────────────────────────────── */
const GradText = styled.span`
  background: ${p => p.$gradient || 'linear-gradient(135deg,#4ade80 0%,#34d399 100%)'};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

/* ── SECTION WRAPPER — exactly one screen each ─── */
const ScrollContainer = styled.div`
  --landing-vh: calc(100vh - 64px);
  --section-pad-y: clamp(1.25rem, 2.5vh, 2.5rem);
  --section-pad-x: clamp(1rem, 3vw, 3.5rem);
  scroll-snap-type: y mandatory;
  overflow-y: scroll;
  height: var(--landing-vh);
  scroll-behavior: smooth;
  &::-webkit-scrollbar { display: none; }

  @media (max-height: 750px) {
    --section-pad-y: clamp(0.75rem, 1.5vh, 1.25rem);
  }
`;

const Section = styled.section`
  position: relative;
  height: var(--landing-vh);
  min-height: var(--landing-vh);
  max-height: var(--landing-vh);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  scroll-snap-align: start;
  scroll-snap-stop: always;
  padding: var(--section-pad-y) var(--section-pad-x) calc(var(--section-pad-y) + 2.5rem);

  ${(p) =>
    p.$hero &&
    `
    padding: clamp(0.75rem, 2vh, 1.25rem) clamp(1rem, 2.5vw, 1.5rem) 1.75rem;
    justify-content: center;
  `}

  ${(p) =>
    p.$intel &&
    `
    @media (max-width: 768px) {
      padding: 0.65rem 0.65rem 1.5rem;
      justify-content: flex-start;
    }
  `}
`;

const SectionInner = styled.div`
  position: relative;
  z-index: 2;
  width: 100%;
  max-height: 100%;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  ${(p) =>
    p.$hero &&
    `
    justify-content: center;
    align-items: center;
    max-width: none;
    width: 100%;
  `}

  ${(p) =>
    p.$intel &&
    `
    @media (max-width: 768px) {
      justify-content: flex-start;
      padding-top: 0.15rem;
    }
  `}
`;

/* ── SECTION 1 — HERO ───────────────────────────── */
const HeroBg = styled.div`
  position: absolute;
  inset: 0;
  background: #070b14;
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 70% 55% at 50% 45%, rgba(34,197,94,.16), transparent 60%),
      radial-gradient(ellipse 40% 35% at 80% 20%, rgba(34,197,94,.1), transparent 50%);
  }
`;

const HeroSplit = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: clamp(1rem, 2vw, 1.5rem);
  width: fit-content;
  max-width: min(100%, 920px);
  margin: 0 auto;
  flex: 0 1 auto;
  min-height: 0;

  @media (max-width: 1100px) {
    flex-direction: column;
    width: 100%;
    max-width: 640px;
    gap: 1rem;
  }
`;

const HeroInner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  gap: clamp(0.55rem, 1.4vh, 1rem);
  flex: 0 1 auto;
  width: min(100%, 560px);
  min-width: 0;
  justify-content: center;

  @media (max-width: 1100px) {
    align-items: center;
    text-align: center;
    width: 100%;
    flex-shrink: 0;
  }
`;

const RailWrap = styled(motion.div)`
  flex: 0 0 auto;
  width: min(100%, 300px);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  align-self: center;

  @media (max-width: 1100px) {
    width: 100%;
    max-width: 400px;
  }
`;

const HeroEyebrow = styled(motion.p)`
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(0.75rem, 1.1vw, 0.88rem);
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #4ade80;
  margin: 0;
`;

const HeroHeadline = styled(motion.h1)`
  margin: 0;
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(2.4rem, 5.5vw, 4.75rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 0.92;
  text-transform: uppercase;
  color: #f8fafc;
  width: 100%;

  @media (max-width: 1280px) {
    font-size: clamp(2.1rem, 4.8vw, 4rem);
  }

  @media (max-height: 780px) {
    font-size: clamp(1.85rem, 4vw, 3.25rem);
  }
`;

const AnimWord = styled(motion.span)`
  display: inline-block;
  margin-right: 0.22em;
  background: linear-gradient(135deg,#f8fafc 0%,#4ade80 35%,#34d399 65%,#f8fafc 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${shimmer} 6s ease-in-out infinite;
`;

const HeroSub = styled(motion.p)`
  font-family: 'DM Sans', sans-serif;
  font-size: clamp(0.95rem, 1.6vw, 1.2rem);
  color: rgba(248,250,252,.65);
  max-width: 520px;
  line-height: 1.55;
  margin: 0;

  @media (max-height: 780px) {
    font-size: clamp(0.88rem, 1.4vw, 1.05rem);
  }
`;

const HeroGrowLine = styled(motion.h2)`
  margin: 0;
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(1.35rem, 2.8vw, 2.1rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.1;
  text-transform: uppercase;
  color: rgba(248, 250, 252, 0.9);
  width: 100%;

  @media (max-height: 780px) {
    font-size: clamp(1.15rem, 2.4vw, 1.65rem);
  }
`;

const HeroDisclaimer = styled(motion.p)`
  font-size: clamp(0.7rem, 1vw, 0.8rem);
  color: rgba(248, 250, 252, 0.32);
  font-family: 'DM Sans', sans-serif;
  margin: 0;
  max-width: 520px;
  line-height: 1.45;

  @media (max-width: 1100px) {
    text-align: center;
  }
`;

const HeroCta = styled(motion.div)`
  display: flex;
  gap: 0.65rem;
  flex-wrap: wrap;
  justify-content: flex-start;
  margin-top: 0.15rem;

  @media (max-width: 1100px) {
    justify-content: center;
  }
`;

const BtnPrimary = styled.button`
  padding: clamp(0.75rem, 1.4vh, 1rem) clamp(1.4rem, 2.2vw, 2rem);
  border-radius: 100px;
  border: none;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: #fff;
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: clamp(0.88rem, 1.2vw, 1.05rem);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: transform .18s, box-shadow .18s;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(34,197,94,.4);
  }
`;

const BtnGhost = styled.button`
  padding: clamp(0.75rem, 1.4vh, 1rem) clamp(1.4rem, 2.2vw, 2rem);
  border-radius: 100px;
  border: 1px solid rgba(248,250,252,.18);
  background: transparent;
  color: #f8fafc;
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: clamp(0.88rem, 1.2vw, 1.05rem);
  cursor: pointer;
  transition: border-color .18s, background .18s;
  &:hover {
    border-color: #4ade80;
    background: rgba(34,197,94,.07);
  }
`;

/* ── SECTION 2 — INTELLIGENCE ENGINE ─────────────── */
const SecIntelBg = styled.div`
  position: absolute;
  inset: 0;
  background: #070b14;
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 55% 45% at 50% 50%, rgba(99,102,241,.12), transparent 55%),
      radial-gradient(ellipse 35% 30% at 10% 20%, rgba(34,197,94,.08), transparent 50%);
  }
`;

/* ── SECTION 3 — ACCOUNT MANAGERS ──────────────── */
const Sec2Bg = styled.div`
  position: absolute;
  inset: 0;
  background: #070b14;
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 55% 45% at 20% 55%, rgba(34,197,94,.14), transparent 55%),
      radial-gradient(ellipse 40% 35% at 85% 25%, rgba(34,197,94,.08), transparent 50%);
  }
`;

const GlowOrb = styled.div`
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
  animation: ${glowDrift} ${p => p.$dur || '12s'} ease-in-out infinite;
  animation-delay: ${p => p.$delay || '0s'};
`;

const TwoCol = styled.div`
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(1.5rem, 3vw, 3.5rem);
  max-width: 1200px;
  width: 100%;
  max-height: 100%;
  align-items: center;
  min-height: 0;

  @media(max-width:900px){ grid-template-columns:1fr; gap:1.25rem; overflow-y:auto; }
`;

const SectionLabel = styled(motion.p)`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #16a34a;
  margin: 0 0 1rem;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  &::before {
    content: '';
    display: inline-block;
    width: 24px;
    height: 2px;
    background: currentColor;
    border-radius: 2px;
  }
`;

const BigHeadline = styled(motion.h2)`
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(1.75rem, 4.5vw, 4.5rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 0.97;
  text-transform: uppercase;
  color: #f8fafc;
  margin: 0 0 clamp(0.75rem, 1.5vh, 1.25rem);

  @media (max-width: 1280px) {
    font-size: clamp(1.5rem, 3.8vw, 3.25rem);
  }

  @media (max-height: 780px) {
    font-size: clamp(1.35rem, 3.2vw, 2.5rem);
    margin-bottom: 0.5rem;
  }
`;

const BodyText = styled(motion.p)`
  font-family: 'DM Sans', sans-serif;
  font-size: clamp(0.88rem, 1.4vw, 1.05rem);
  color: rgba(248,250,252,.6);
  line-height: 1.6;
  margin: 0 0 clamp(1rem, 2vh, 1.75rem);
  max-width: 480px;

  @media (max-height: 780px) {
    font-size: 0.82rem;
    margin-bottom: 0.75rem;
  }
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.65rem;

  @media (max-height: 780px) {
    gap: 0.45rem;
  }
`;

const StatCard = styled(motion.div)`
  padding: clamp(0.75rem, 1.5vh, 1.1rem);
  border-radius: 14px;
  background: rgba(255,255,255,.04);
  border: 1px solid rgba(255,255,255,.07);
  text-align: center;
`;

const StatNum = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(1.25rem, 2.5vw, 2rem);
  font-weight: 800;
  background: linear-gradient(135deg, #4ade80, #34d399);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${shimmer} 6s ease-in-out infinite;
  background-size: 200% auto;
`;

const StatLbl = styled.div`
  font-size: 0.75rem;
  color: rgba(248,250,252,.45);
  margin-top: 0.2rem;
  font-family: 'DM Sans', sans-serif;
`;

const FloatCard = styled(motion.div)`
  padding: clamp(1rem, 2vh, 1.5rem);
  border-radius: 20px;
  background: rgba(255,255,255,.05);
  border: 1px solid rgba(255,255,255,.09);
  backdrop-filter: blur(12px);
  animation: ${float} 6s ease-in-out infinite;
  max-height: 100%;
  overflow-y: auto;

  @media (max-height: 780px) {
    padding: 0.85rem 1rem;
    animation: none;
  }
`;

const FeatureRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 1rem;
  &:last-child { margin-bottom: 0; }

  @media (max-height: 780px) {
    margin-bottom: 0.65rem;
  }
`;

const FeatureIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: ${p => p.$bg || 'rgba(34,197,94,.15)'};
  color: ${p => p.$color || '#22c55e'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  flex-shrink: 0;
`;

const FeatureTxt = styled.div``;
const FeatureTitle = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  color: #f8fafc;
  font-size: 0.9rem;
  margin-bottom: 0.2rem;
`;
const FeatureDesc = styled.div`
  font-size: 0.8rem;
  color: rgba(248,250,252,.5);
  line-height: 1.5;
  font-family: 'DM Sans', sans-serif;
`;

/* ── SECTION 4 — STRATEGY CHOOSER ──────────────── */
const Sec3Bg = styled.div`
  position: absolute;
  inset: 0;
  background: #070b14;
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 60% 50% at 75% 40%, rgba(34,197,94,.12), transparent 55%),
      radial-gradient(ellipse 40% 35% at 15% 70%, rgba(34,197,94,.08), transparent 50%);
  }
`;

const StrategyGrid = styled.div`
  position: relative;
  z-index: 2;
  max-width: 1200px;
  width: 100%;
  max-height: 100%;
  min-height: 0;
  overflow-y: auto;
`;

const StrategyCards = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: clamp(0.75rem, 1.5vw, 1.25rem);
  margin-top: clamp(0.75rem, 1.5vh, 1.5rem);
  @media(max-width:900px){ grid-template-columns: 1fr; }
`;

const StratCard = styled(motion.div)`
  padding: clamp(1rem, 2vh, 1.5rem) clamp(0.9rem, 1.5vw, 1.25rem);
  border-radius: 18px;
  background: rgba(255,255,255,.04);
  border: 1px solid ${p => p.$border || 'rgba(255,255,255,.07)'};
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: border-color .2s, transform .2s, box-shadow .2s;
  &:hover {
    border-color: ${p => p.$accent || '#4ade80'};
    transform: translateY(-6px);
    box-shadow: 0 24px 60px rgba(0,0,0,.35);
  }
  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: ${p => p.$accent || '#4ade80'};
    border-radius: 3px 3px 0 0;
  }
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 80% 60% at 50% 0%, ${p => p.$glow || 'rgba(34,197,94,.06)'}, transparent 60%);
    pointer-events: none;
  }
`;

const StratTag = styled.div`
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${p => p.$color || '#4ade80'};
  background: ${p => p.$bg || 'rgba(34,197,94,.1)'};
  padding: 0.25rem 0.65rem;
  border-radius: 100px;
  display: inline-block;
  margin-bottom: 1rem;
`;

const StratName = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 800;
  font-size: clamp(1.25rem, 2vw, 1.6rem);
  color: #f8fafc;
  margin-bottom: 0.6rem;
`;

const StratDesc = styled.div`
  font-size: 0.9rem;
  color: rgba(248,250,252,.5);
  line-height: 1.65;
  margin-bottom: 1.5rem;
  font-family: 'DM Sans', sans-serif;
`;

const StratMeta = styled.div`
  display: flex;
  gap: 1rem;
`;

const StratMetaItem = styled.div`
  text-align: center;
`;

const StratMetaNum = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 800;
  font-size: 1.1rem;
  color: ${p => p.$color || '#4ade80'};
`;

const StratMetaLbl = styled.div`
  font-size: 0.65rem;
  color: rgba(248,250,252,.35);
  text-transform: uppercase;
  letter-spacing: 0.08em;
`;

const IntelSectionHead = styled.div`
  text-align: center;
  margin-bottom: clamp(0.5rem, 1.5vh, 1rem);
  flex-shrink: 0;

  @media (max-height: 780px) {
    margin-bottom: 0.35rem;
  }

  @media (max-width: 768px) {
    margin-bottom: 0.4rem;
  }
`;

/* ── SCROLL ARROW ───────────────────────────────── */
const ScrollArrow = styled.button`
  position: absolute;
  bottom: clamp(0.75rem, 2vh, 1.5rem);
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  background: rgba(255,255,255,.07);
  border: 1px solid rgba(255,255,255,.12);
  border-radius: 50%;
  width: clamp(36px, 5vh, 44px);
  height: clamp(36px, 5vh, 44px);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(248,250,252,.6);
  font-size: 1rem;
  cursor: pointer;
  transition: background .18s, color .18s;
  animation: ${pulse} 2.5s ease-in-out infinite;
  &:hover {
    background: rgba(34,197,94,.15);
    color: #4ade80;
  }
`;

/* ── PROGRESS DOTS ──────────────────────────────── */
const Dots = styled.div`
  position: fixed;
  left: 1.5rem;
  top: 50%;
  transform: translateY(-50%);
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const Dot = styled.button`
  width: 8px;
  height: ${p => p.$active ? '24px' : '8px'};
  border-radius: 100px;
  background: ${p => p.$active ? '#4ade80' : 'rgba(255,255,255,.2)'};
  border: none;
  cursor: pointer;
  transition: all .3s;
  padding: 0;
`;

/* ── word animation variants ─────────────────────── */
const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
};
const wordVar = {
  hidden: { opacity: 0, y: 48, rotateX: -40 },
  show: { opacity: 1, y: 0, rotateX: 0, transition: { type: 'spring', stiffness: 120, damping: 14 } },
};

const STRATEGIES = [
  { tag: 'Conservative', tagColor: '#34d399', tagBg: 'rgba(34,197,94,.1)', accent: '#34d399', border: 'rgba(34,197,94,.18)', glow: 'rgba(34,197,94,.08)',
    name: 'Steady Growth', desc: 'Low-risk diversified portfolio of bonds and dividend stocks. Ideal for capital preservation with modest returns.', risk: 'Low', return: '6-10%', horizon: '3+ yrs' },
  { tag: 'Balanced', tagColor: '#4ade80', tagBg: 'rgba(34,197,94,.1)', accent: '#4ade80', border: 'rgba(34,197,94,.18)', glow: 'rgba(34,197,94,.08)',
    name: 'Core Portfolio', desc: 'Mix of growth equities and stable assets. Our most popular strategy — proven across multiple market cycles.', risk: 'Medium', return: '12-22%', horizon: '1+ yrs' },
  { tag: 'Aggressive', tagColor: '#22c55e', tagBg: 'rgba(34,197,94,.1)', accent: '#22c55e', border: 'rgba(34,197,94,.18)', glow: 'rgba(34,197,94,.08)',
    name: 'Alpha Seeker', desc: 'High-conviction positions in growth sectors and emerging markets. Maximum upside for experienced investors.', risk: 'High', return: '25-40%', horizon: '6+ mo' },
];

const SECTION_REFS = ['hero', 'intelligence', 'strategies', 'managers'];

export default function LandingPage() {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [activeSection, setActiveSection] = useState(0);
  const { market, movers, loading, error, lastUpdated, refresh } = useLiveMarketFeed();

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const h = el.clientHeight;
      const idx = Math.round(el.scrollTop / h);
      setActiveSection(Math.min(idx, SECTION_REFS.length - 1));
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (i) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: i * el.clientHeight, behavior: 'smooth' });
  };

  const heroLines = [['LOOK FIRST'], ['THEN', 'LEAP']];

  return (
    <>
      <Dots>
        {SECTION_REFS.map((_, i) => (
          <Dot key={i} $active={activeSection === i} onClick={() => scrollTo(i)} />
        ))}
      </Dots>

      <ScrollContainer ref={scrollRef} style={{ marginTop: 64 }}>

        {/* ── SECTION 1: HERO + LIVE MARKET RAIL ── */}
        <Section $hero>
          <HeroBg />
          <SectionInner $hero>
          <HeroSplit>
            <HeroInner>
              <HeroEyebrow initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                Get Started Today
              </HeroEyebrow>

              <HeroHeadline
                as={motion.h1}
                variants={container}
                initial="hidden"
                animate="show"
              >
                {heroLines.map((line, li) => (
                  <React.Fragment key={li}>
                    {li > 0 && <br />}
                    {line.map((w, wi) => (
                      <React.Fragment key={w}>
                        {wi > 0 && ' '}
                        <AnimWord variants={wordVar}>{w}</AnimWord>
                      </React.Fragment>
                    ))}
                  </React.Fragment>
                ))}
              </HeroHeadline>

              <HeroGrowLine
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
              >
                READY TO <GradText $gradient="linear-gradient(135deg,#f8fafc 0%,#4ade80 40%,#34d399 100%)">GROW</GradText> YOUR WEALTH?
              </HeroGrowLine>

              <HeroSub initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
                Complete our 2-minute assessment. Tell us your goals, risk tolerance, and investment experience — we&apos;ll assign a dedicated account manager and propose your strategy within 24 hours.
              </HeroSub>

              <HeroCta initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
                <BtnPrimary onClick={() => navigate('/enquiry')}>
                  Start My Assessment <FaArrowRight />
                </BtnPrimary>
                <BtnGhost onClick={() => navigate('/signals')}>
                  See Today&apos;s Signals
                </BtnGhost>
              </HeroCta>

              <HeroDisclaimer
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.05 }}
              >
                Capital at risk. Past performance is not indicative of future results. For informational purposes only.
              </HeroDisclaimer>
            </HeroInner>

            <RailWrap
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <LiveMarketRail
                market={market}
                movers={movers}
                loading={loading}
                lastUpdated={lastUpdated}
                onRefresh={refresh}
                error={error}
                fitContent
              />
            </RailWrap>
          </HeroSplit>
          </SectionInner>
          <ScrollArrow onClick={() => scrollTo(1)} aria-label="Next section">
            <FaChevronDown />
          </ScrollArrow>
        </Section>

        {/* ── SECTION 2: INTELLIGENCE ENGINE ── */}
        <Section $intel>
          <SecIntelBg />
          <GlowOrb style={{ width: 500, height: 500, right: '-5%', top: '15%', background: 'rgba(99,102,241,.1)' }} $dur="15s" $delay="-2s" />
          <SectionInner $intel style={{ maxWidth: 1320 }}>
            <IntelSectionHead>
              <SectionLabel style={{ color: '#86efac', justifyContent: 'center', marginBottom: '0.5rem' }}>BloomVest IQ</SectionLabel>
              <BigHeadline style={{ textAlign: 'center', fontSize: 'clamp(1.15rem, 4.5vw, 2.75rem)', marginBottom: 0 }}>
                THE <GradText $gradient="linear-gradient(135deg,#f8fafc 0%,#86efac 40%,#34d399 100%)">INTELLIGENCE</GradText> ENGINE
              </BigHeadline>
            </IntelSectionHead>
            <IntelligenceShowcase movers={movers} loading={loading} compact />
          </SectionInner>
          <ScrollArrow onClick={() => scrollTo(2)} aria-label="Next section">
            <FaChevronDown />
          </ScrollArrow>
        </Section>

        {/* ── SECTION 3: STRATEGIES ── */}
        <Section>
          <Sec3Bg />
          <GlowOrb style={{ width: 400, height: 400, right: '-8%', top: '10%', background: 'rgba(34,197,94,.1)' }} $dur="13s" $delay="-2s" />
          <GlowOrb style={{ width: 280, height: 280, left: '5%', bottom: '10%', background: 'rgba(34,197,94,.08)' }} $dur="9s" $delay="-6s" />
          <SectionInner>
          <StrategyGrid>
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <SectionLabel style={{ color: '#4ade80' }}>Strategy Selection</SectionLabel>
              <BigHeadline>
                WE CHOOSE THE<br /><GradText $gradient="linear-gradient(135deg,#f8fafc 0%,#4ade80 40%,#34d399 100%)">RIGHT STRATEGY</GradText><br />FOR YOU
              </BigHeadline>
              <BodyText>
                After your risk profile assessment, our managers match you to the optimal strategy — and explain exactly what to expect in terms of returns and risk.
              </BodyText>
            </motion.div>

            <StrategyCards
              variants={{ show: { transition: { staggerChildren: 0.12 } } }}
              initial="hidden" whileInView="show" viewport={{ once: true }}>
              {STRATEGIES.map((s) => (
                <StratCard key={s.name} $accent={s.accent} $border={s.border} $glow={s.glow}
                  variants={{ hidden: { opacity: 0, y: 36 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 16 } } }}
                  whileHover={{ scale: 1.03 }}>
                  <StratTag $color={s.tagColor} $bg={s.tagBg}>{s.tag}</StratTag>
                  <StratName>{s.name}</StratName>
                  <StratDesc>{s.desc}</StratDesc>
                  <StratMeta>
                    <StratMetaItem>
                      <StratMetaNum $color={s.accent}>{s.risk}</StratMetaNum>
                      <StratMetaLbl>Risk</StratMetaLbl>
                    </StratMetaItem>
                    <StratMetaItem>
                      <StratMetaNum $color={s.accent}>{s.return}</StratMetaNum>
                      <StratMetaLbl>Target Return</StratMetaLbl>
                    </StratMetaItem>
                    <StratMetaItem>
                      <StratMetaNum $color={s.accent}>{s.horizon}</StratMetaNum>
                      <StratMetaLbl>Horizon</StratMetaLbl>
                    </StratMetaItem>
                  </StratMeta>
                </StratCard>
              ))}
            </StrategyCards>

            <motion.div style={{ textAlign: 'center', marginTop: 'clamp(0.75rem, 1.5vh, 1.25rem)' }}
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.4 }} viewport={{ once: true }}>
              <BtnPrimary onClick={() => navigate('/enquiry')} style={{ margin: '0 auto' }}>
                Take the Assessment <FaArrowRight />
              </BtnPrimary>
            </motion.div>
          </StrategyGrid>
          </SectionInner>
          <ScrollArrow onClick={() => scrollTo(3)} aria-label="Next section">
            <FaChevronDown />
          </ScrollArrow>
        </Section>

        {/* ── SECTION 4: ACCOUNT MANAGERS ── */}
        <Section>
          <Sec2Bg />
          <GlowOrb style={{ width: 500, height: 500, left: '-10%', top: '20%', background: 'rgba(34,197,94,.12)' }} $dur="14s" $delay="0s" />
          <GlowOrb style={{ width: 300, height: 300, right: '5%', bottom: '15%', background: 'rgba(34,197,94,.07)' }} $dur="10s" $delay="-4s" />
          <SectionInner>
          <TwoCol>
            <div>
              <SectionLabel style={{ color: '#4ade80' }} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                Our Account Managers
              </SectionLabel>
              <BigHeadline initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} viewport={{ once: true }}>
                WE TRADE.<br /><GradText $gradient="linear-gradient(135deg,#f8fafc 0%,#4ade80 40%,#34d399 100%)">YOU PROFIT.</GradText>
              </BigHeadline>
              <BodyText initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.2 }} viewport={{ once: true }}>
                Our certified account managers analyse markets daily, build personalised strategies, and execute with precision. You receive a full breakdown of every decision — risk, rationale, and expected returns.
              </BodyText>
              <StatGrid>
                {[['94%', 'Win Rate (2024)'], ['£12M+', 'Managed AUM'], ['340+', 'Active Clients'], ['4.9★', 'Client Rating']].map(([n, l], i) => (
                  <StatCard key={l} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} viewport={{ once: true }}>
                    <StatNum>{n}</StatNum>
                    <StatLbl>{l}</StatLbl>
                  </StatCard>
                ))}
              </StatGrid>
            </div>

            <FloatCard initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} viewport={{ once: true }}>
              {[
                { icon: FaShieldAlt, bg: 'rgba(34,197,94,.12)', color: '#4ade80', title: 'Risk-Managed', desc: 'Every position has a defined stop-loss and profit target before we enter.' },
                { icon: FaChartLine, bg: 'rgba(34,197,94,.12)', color: '#34d399', title: 'Transparent Returns', desc: 'Monthly performance reports with full P&L breakdown delivered to you.' },
                { icon: FaBell, bg: 'rgba(34,197,94,.12)', color: '#86efac', title: 'Live Alerts', desc: 'Instant notifications when we open, adjust or close a position in your account.' },
                { icon: FaUsers, bg: 'rgba(34,197,94,.12)', color: '#34d399', title: 'Dedicated Manager', desc: 'One point of contact who knows your goals and adjusts strategy accordingly.' },
              ].map(({ icon: Icon, bg, color, title, desc }) => (
                <FeatureRow key={title}>
                  <FeatureIcon $bg={bg} $color={color}><Icon /></FeatureIcon>
                  <FeatureTxt>
                    <FeatureTitle>{title}</FeatureTitle>
                    <FeatureDesc>{desc}</FeatureDesc>
                  </FeatureTxt>
                </FeatureRow>
              ))}
            </FloatCard>
          </TwoCol>
          </SectionInner>
        </Section>

      </ScrollContainer>
    </>
  );
}
