import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaArrowRight, FaChartLine, FaGraduationCap, FaBolt,
  FaRobot, FaNewspaper, FaBookOpen, FaShieldAlt,
} from 'react-icons/fa';

/* ════════ KEYFRAMES ════════ */
const shimmer = keyframes`
  0%   { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
`;
const pulse = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.65; transform: scale(0.92); }
`;
const floatA = keyframes`
  0%,100% { transform: translate(0,0) scale(1); }
  40%      { transform: translate(28px,-38px) scale(1.04); }
  70%      { transform: translate(-18px,18px) scale(0.97); }
`;
const floatB = keyframes`
  0%,100% { transform: translate(0,0) scale(1); }
  35%      { transform: translate(-36px,26px) scale(1.05); }
  70%      { transform: translate(22px,-18px) scale(0.96); }
`;
const floatC = keyframes`
  0%,100% { transform: translate(0,0); }
  50%      { transform: translate(12px,-26px); }
`;
const slideLeft = keyframes`
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
`;


/* ════════ PAGE ════════ */
const Page = styled.div`
  font-family: 'Inter', system-ui, sans-serif;
  background: #fafbfc;
  color: #0a0f1e;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
`;

/* ════════ ANIMATED BG ════════ */
const BgCanvas = styled.div`
  position: fixed; inset: 0; z-index: 0; pointer-events: none; overflow: hidden;
`;
const Orb = styled.div`
  position: absolute; border-radius: 50%; filter: blur(80px);
  opacity: ${p => p.$opacity || 0.15};
  background: ${p => p.$color};
  width: ${p => p.$size}px; height: ${p => p.$size}px;
  top: ${p => p.$top}; left: ${p => p.$left};
  animation: ${p => p.$anim === 'a' ? floatA : p.$anim === 'b' ? floatB : floatC}
    ${p => p.$dur || '18s'} ease-in-out infinite;
`;
const DotGrid = styled.div`
  position: fixed; inset: 0; z-index: 0; pointer-events: none;
  background-image: radial-gradient(rgba(15,23,42,0.032) 1px, transparent 1px);
  background-size: 28px 28px;
  mask-image: linear-gradient(180deg, rgba(0,0,0,0.5) 0%, transparent 85%);
`;

/* ════════ TICKER RIBBON ════════ */
const RibbonWrap = styled.div`
  position: relative; z-index: 10;
  border-bottom: 1px solid rgba(15,23,42,0.06);
  background: rgba(255,255,255,0.88);
  backdrop-filter: blur(16px);
  overflow: hidden; padding: 0.42rem 0;
  margin-top: 64px;
`;
const RibbonTrack = styled.div`
  display: flex; width: max-content;
  animation: ${slideLeft} 28s linear infinite;
`;
const RibbonItem = styled.div`
  display: flex; align-items: center; gap: 0.45rem;
  padding: 0 2rem; white-space: nowrap;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem; font-weight: 700; color: #0a0f1e;
  border-right: 1px solid rgba(15,23,42,0.06);
`;
const RibbonTicker = styled.span`color:#64748b;font-size:0.62rem;font-weight:600;`;
const RibbonChg = styled.span`color:${p => p.$pos ? '#10b981' : '#ef4444'};font-size:0.62rem;`;

/* ════════ MAIN LAYOUT ════════ */
const HeroSection = styled.section`
  position: relative; z-index: 1;
  max-width: 1280px; margin: 0 auto;
  padding: 0.65rem 2rem 1.35rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2.25rem;
  align-items: center;
  align-content: center;
  min-height: calc(100vh - 96px);

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    min-height: 0;
    align-content: start;
    padding: 1.5rem 1.25rem 1rem;
    gap: 1.5rem;
  }
`;
const HeroLeft = styled.div`
  display: flex; flex-direction: column; gap: 1.4rem;
`;
const HeroRight = styled.div`
  display: flex; flex-direction: column;
  @media (max-width: 900px) { display: none; }
`;
const HeroBadge = styled(motion.div)`
  display: inline-flex; align-items: center; gap: 0.45rem;
  padding: 0.4rem 1.05rem; border-radius: 999px;
  font-size: 0.8rem; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase;
  color: #15803d;
  background: rgba(255,255,255,0.88);
  border: 1px solid rgba(34,197,94,0.22);
  box-shadow: 0 3px 14px rgba(15,23,42,0.06), 0 0 0 3px rgba(34,197,94,0.05);
  width: max-content;
`;
const PulseDot = styled.span`
  width: 6px; height: 6px; border-radius: 50%;
  background: #22c55e; animation: ${pulse} 2s ease infinite; flex-shrink: 0;
`;
const HeroHeadline = styled(motion.h1)`
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(3.25rem, 7.4vw, 5.15rem);
  font-weight: 800; line-height: 1.02; letter-spacing: -0.04em;
  color: #0a0f1e; margin: 0;
  em {
    font-style: normal;
    background: linear-gradient(120deg, #15803d 0%, #0f766e 40%, #22c55e 80%, #15803d 100%);
    background-size: 200% auto;
    animation: ${shimmer} 4s linear infinite;
    -webkit-background-clip: text; background-clip: text; color: transparent;
  }
`;
const HeroSub = styled(motion.p)`
  font-size: 1.28rem; line-height: 1.55;
  color: rgba(15,23,42,0.52); margin: 0; max-width: 32em;
`;
const HeroActions = styled(motion.div)`
  display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center;
`;
const BtnPrimary = styled(Link)`
  display: inline-flex; align-items: center; gap: 0.5rem;
  padding: 0.95rem 1.72rem; border-radius: 11px;
  font-weight: 800; font-size: 1.05rem; color: #fff;
  background: linear-gradient(135deg, #0f172a 0%, #14532d 100%);
  text-decoration: none;
  box-shadow: 0 6px 22px rgba(15,23,42,0.2);
  transition: transform 0.18s, box-shadow 0.18s;
  svg { font-size: 0.78rem; transition: transform 0.18s; }
  &:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(21,128,61,0.3); svg:last-child { transform: translateX(3px); } }
`;
const BtnGhost = styled(Link)`
  display: inline-flex; align-items: center; gap: 0.45rem;
  padding: 0.95rem 1.5rem; border-radius: 11px;
  font-weight: 700; font-size: 1.05rem; color: #0a0f1e;
  background: rgba(255,255,255,0.75); border: 1px solid rgba(15,23,42,0.12);
  text-decoration: none; backdrop-filter: blur(10px);
  transition: border-color 0.18s, background 0.18s, transform 0.18s;
  &:hover { border-color: rgba(34,197,94,0.35); background: rgba(255,255,255,0.95); transform: translateY(-2px); }
`;
const HeroMeta = styled(motion.div)`
  display: flex; align-items: center; gap: 1.25rem; flex-wrap: wrap;
`;
const HeroMetaItem = styled.div`
  font-size: 0.88rem; color: rgba(15,23,42,0.44); font-weight: 600;
  display: flex; align-items: center; gap: 0.35rem;
  &:before { content:''; width:4px; height:4px; border-radius:50%; background:#10b981; display:block; }
`;

/* ════════ MODULES CARD ════════ */
const ModulesCard = styled(motion.div)`
  background: rgba(255,255,255,0.9);
  border: 1px solid rgba(15,23,42,0.07);
  border-radius: 20px;
  padding: 1.28rem 1.38rem 1.32rem;
  backdrop-filter: blur(14px);
  box-shadow: 0 8px 32px rgba(15,23,42,0.07);
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
`;
const ModulesLabel = styled.div`
  font-size: 0.66rem; font-weight: 800; text-transform: uppercase;
  letter-spacing: 0.12em; color: #15803d;
  display: flex; align-items: center; gap: 0.4rem; margin-bottom: 0.05rem;
  &:before { content:''; display:block; width:14px; height:2px; background:#15803d; border-radius:2px; }
`;
const ModulesTitle = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.52rem; font-weight: 800; color: #0a0f1e; letter-spacing: -0.02em;
  line-height: 1.2;
  margin-bottom: 0.2rem;
`;
const ModulesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
`;
const ModuleRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.8rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(15,23,42,0.04);
  &:last-child { border-bottom: none; padding-bottom: 0; }
`;
const ModuleIcon = styled.div`
  width: 40px; height: 40px; border-radius: 9px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.96rem;
  background: ${p => p.$bg || 'rgba(34,197,94,0.1)'};
  color: ${p => p.$co || '#15803d'};
`;
const ModuleText = styled.div`flex: 1; min-width: 0;`;
const ModuleTitle = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.1rem;
  font-weight: 800;
  color: #0a0f1e;
  line-height: 1.22;
`;
const ModuleDesc = styled.div`
  font-size: 0.98rem;
  line-height: 1.4;
  color: rgba(15,23,42,0.48);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;


/* ════════ DATA ════════ */
const TICKERS = [
  { sym:'SPY',  price:'541.82', chg:'+0.84%', pos:true  },
  { sym:'QQQ',  price:'461.20', chg:'-0.12%', pos:false },
  { sym:'NVDA', price:'878.35', chg:'+2.41%', pos:true  },
  { sym:'AAPL', price:'193.12', chg:'+0.55%', pos:true  },
  { sym:'TSLA', price:'178.90', chg:'-1.33%', pos:false },
  { sym:'BTC',  price:'67,241', chg:'+3.12%', pos:true  },
  { sym:'ETH',  price:'3,481',  chg:'+1.87%', pos:true  },
  { sym:'GLD',  price:'218.42', chg:'+0.22%', pos:true  },
  { sym:'META', price:'491.63', chg:'+1.05%', pos:true  },
  { sym:'MSFT', price:'415.80', chg:'-0.38%', pos:false },
];

/* ════════ COMPONENT ════════ */
export default function LandingPage() {
  return (
    <Page>
      <BgCanvas>
        <Orb $color="rgba(34,197,94,0.7)"  $size={480} $top="-10%" $left="-6%"  $anim="a" $dur="22s" $opacity={0.11} />
        <Orb $color="rgba(16,185,129,0.6)" $size={380} $top="30%"  $left="62%"  $anim="b" $dur="18s" $opacity={0.09} />
        <Orb $color="rgba(6,182,212,0.5)"  $size={320} $top="65%"  $left="-4%"  $anim="c" $dur="26s" $opacity={0.08} />
        <Orb $color="rgba(99,102,241,0.4)" $size={240} $top="72%"  $left="74%"  $anim="a" $dur="20s" $opacity={0.06} />
      </BgCanvas>
      <DotGrid />

      {/* ── ticker ribbon ── */}
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

      {/* ══════════════════════════════════════════════
          HERO — LEFT + RIGHT
      ══════════════════════════════════════════════ */}
      <HeroSection>

        {/* LEFT */}
        <HeroLeft>
          <HeroBadge initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} transition={{duration:0.5}}>
            <PulseDot /> Investment intelligence
          </HeroBadge>

          <HeroHeadline initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:0.65,delay:0.1,ease:[0.22,1,0.36,1]}}>
            Your personal<br /><em>investment intelligence</em><br />terminal.
          </HeroHeadline>

          <HeroSub initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:0.6,delay:0.2,ease:[0.22,1,0.36,1]}}>
            Real-time AI signals, live sentiment, document analysis, and structured
            learning — built for investors who take their money seriously.
          </HeroSub>

          <HeroActions initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{duration:0.55,delay:0.3}}>
            <BtnPrimary to="/signals"><FaBolt /> Open Intelligence <FaArrowRight /></BtnPrimary>
            <BtnGhost to="/learn">Browse Courses <FaArrowRight /></BtnGhost>
          </HeroActions>

          <HeroMeta initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.42,duration:0.5}}>
            <HeroMetaItem>Free to use</HeroMetaItem>
            <HeroMetaItem>17+ live data sources</HeroMetaItem>
            <HeroMetaItem>No subscription needed</HeroMetaItem>
          </HeroMeta>
        </HeroLeft>

        {/* RIGHT — modules card */}
        <HeroRight>
          <ModulesCard
            initial={{opacity:0,x:20}} animate={{opacity:1,x:0}}
            transition={{delay:0.35,duration:0.65,ease:[0.22,1,0.36,1]}}
          >
            <ModulesLabel>What's inside</ModulesLabel>
            <ModulesTitle>Seven investment intelligence modules</ModulesTitle>
            <ModulesList>
              {[
                { icon:<FaBolt/>,          bg:'rgba(34,197,94,0.1)',   co:'#15803d', title:'AI Deep Analysis',   desc:'8 batches — stocks, ETFs, crypto, commodities. Thesis, confidence, entry signal.' },
                { icon:<FaNewspaper/>,     bg:'rgba(59,130,246,0.1)',  co:'#2563eb', title:'Live News Feed',     desc:'180+ headlines from 17 sources with AI insight and sentiment scoring.' },
                { icon:<FaRobot/>,         bg:'rgba(245,158,11,0.1)', co:'#b45309', title:'Document Analyst',   desc:'Upload a PDF or paste any 10-K or transcript. Get signals and a verdict.' },
                { icon:<FaChartLine/>,     bg:'rgba(139,92,246,0.1)', co:'#7c3aed', title:'Watchlist + Quotes', desc:'Track tickers with live prices and an AI portfolio briefing.' },
                { icon:<FaGraduationCap/>, bg:'rgba(16,185,129,0.1)', co:'#059669', title:'Learn Academy',      desc:'Structured lessons and quizzes with a $100k practice portfolio.' },
                { icon:<FaShieldAlt/>,     bg:'rgba(239,68,68,0.1)',  co:'#dc2626', title:'Trading Journal',    desc:'Log trades, spot cognitive biases, extract lessons with AI.' },
                { icon:<FaBookOpen/>,      bg:'rgba(99,102,241,0.1)', co:'#4f46e5', title:'Scenario Simulator', desc:'Real-world decisions under pressure, then AI debrief.' },
              ].map(({ icon, bg, co, title, desc }) => (
                <ModuleRow key={title}>
                  <ModuleIcon $bg={bg} $co={co}>{icon}</ModuleIcon>
                  <ModuleText>
                    <ModuleTitle>{title}</ModuleTitle>
                    <ModuleDesc>{desc}</ModuleDesc>
                  </ModuleText>
                </ModuleRow>
              ))}
            </ModulesList>
          </ModulesCard>
        </HeroRight>

      </HeroSection>

    </Page>
  );
}
