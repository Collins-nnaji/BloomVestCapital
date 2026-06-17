import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FaArrowRight,
  FaArrowUp,
  FaArrowDown,
  FaExchangeAlt,
  FaBrain,
  FaNewspaper,
  FaMagic,
  FaFire,
  FaChartPie,
  FaBookOpen,
  FaRobot,
  FaChartLine,
  FaBolt,
  FaFilter,
  FaSyncAlt,
  FaPlus,
  FaUser,
  FaSignal,
  FaBook,
  FaCoins,
  FaSave,
} from 'react-icons/fa';

const IQ_TOOLS = [
  {
    tab: 'news',
    label: 'Headline Decoder',
    mobileLabel: 'Headlines',
    hint: 'Plain-English news',
    icon: FaNewspaper,
    eyebrow: 'BloomVest Intelligence',
    title: 'Headline Decoder',
    sub: 'Decode market headlines into plain-English insight.',
  },
  {
    tab: 'picks',
    label: 'Market Lab',
    mobileLabel: 'Market Lab',
    hint: 'AI case studies',
    icon: FaMagic,
    eyebrow: 'BloomVest Intelligence',
    title: 'Market Lab',
    sub: 'AI case studies across assets — built for learning, not stock picks.',
  },
  {
    tab: 'movers',
    label: 'Movers Scanner',
    mobileLabel: 'Movers',
    hint: 'Live catalysts',
    icon: FaFire,
    eyebrow: 'BloomVest Intelligence',
    title: 'Movers Scanner',
    sub: "Today's biggest movers and the catalysts behind them.",
  },
  {
    tab: 'allocation',
    label: 'Fund Allocation',
    mobileLabel: 'Allocate',
    hint: 'Model portfolios',
    icon: FaChartPie,
    eyebrow: 'BloomVest Intelligence',
    title: 'Fund Allocation',
    sub: 'Model how a hypothetical fund could be diversified.',
  },
  {
    tab: 'journal',
    label: 'Reflection Journal',
    mobileLabel: 'Journal',
    hint: 'Notes + AI review',
    icon: FaBookOpen,
    eyebrow: 'BloomVest Intelligence',
    title: 'Reflection Journal',
    sub: 'Capture your thinking and get AI reflection on your notes.',
  },
  {
    tab: 'copilot',
    label: 'Copilot',
    mobileLabel: 'Copilot',
    hint: 'Ask anything',
    icon: FaRobot,
    eyebrow: 'BloomVest Intelligence',
    title: 'Copilot',
    sub: 'Ask anything about markets, macro, and portfolio thinking.',
  },
];

const EXTRA_NAV = [
  { label: 'Signals', icon: FaSignal, to: '/signals' },
  { label: 'AI Tutor', icon: FaBook, to: '/glossary' },
];

const MOCK_HEADLINES = [
  {
    source: 'Reuters',
    title: 'Fed signals cautious path as inflation cools but stays above target',
    tickers: ['SPY', 'TLT'],
    sentiment: 'Cautious',
    insight:
      'Markets are pricing a slower pace of rate cuts. Growth stocks can be more volatile while defensive sectors and short-duration bonds often hold up better in this regime.',
  },
  {
    source: 'Bloomberg',
    title: 'Oil slips on demand worries; energy equities lag broader market',
    tickers: ['XLE', 'USO'],
    sentiment: 'Bearish',
    insight: null,
  },
  {
    source: 'CNBC',
    title: 'Mega-cap tech leads rally as AI spending forecasts beat estimates',
    tickers: ['NVDA', 'MSFT', 'GOOGL'],
    sentiment: 'Bullish',
    insight: null,
  },
  {
    source: 'FT',
    title: 'Emerging markets currencies steady as dollar index pulls back',
    tickers: ['USDNGN', 'EEM'],
    sentiment: 'Neutral',
    insight: null,
  },
];

const MOCK_PICKS = [
  { ticker: 'NVDA', name: 'NVIDIA Corp', level: 'Deep dive', sector: 'Technology', color: '#10b981', thesis: 'AI capex cycle still expanding' },
  { ticker: 'BABA', name: 'Alibaba Group', level: 'Discuss', sector: 'Consumer', color: '#f59e0b', thesis: 'China stimulus vs regulatory risk' },
  { ticker: 'GLD', name: 'SPDR Gold', level: 'Caution', sector: 'Commodities', color: '#ef4444', thesis: 'Real yields vs safe-haven demand' },
  { ticker: 'COIN', name: 'Coinbase', level: 'Deep dive', sector: 'Crypto', color: '#10b981', thesis: 'Volume recovery + ETF flows' },
  { ticker: 'JPM', name: 'JPMorgan', level: 'Discuss', sector: 'Financials', color: '#f59e0b', thesis: 'NIM peak vs credit quality' },
];

const MOCK_HOLDINGS = [
  { ticker: 'VOO', pct: 30, color: '#10b981', type: 'US Equity' },
  { ticker: 'VXUS', pct: 20, color: '#3b82f6', type: 'Intl Equity' },
  { ticker: 'BND', pct: 20, color: '#6366f1', type: 'Bonds' },
  { ticker: 'BTC', pct: 10, color: '#f59e0b', type: 'Crypto' },
  { ticker: 'VNQ', pct: 10, color: '#ec4899', type: 'REITs' },
  { ticker: 'CASH', pct: 10, color: '#94a3b8', type: 'Cash' },
];

const MOCK_SECTORS = [
  { name: 'Technology', pct: 28 },
  { name: 'Financials', pct: 18 },
  { name: 'Healthcare', pct: 14 },
  { name: 'Other', pct: 40 },
];

const MOCK_NOTES = [
  { tag: 'idea', title: 'Rate-cut rotation thesis', preview: 'If cuts arrive sooner, small-caps and duration-sensitive assets may lead while mega-cap growth de-rates.', ai: 'Your thesis links macro to sector rotation — consider defining what would invalidate it.' },
  { tag: 'trade', title: 'Added VOO on pullback', preview: 'Bought at -3% from highs; stop at weekly support. Position size 8% of model fund.', ai: null },
  { tag: 'lesson', title: 'Patience during drawdowns', preview: 'Held through -8% without panic selling. Journaled emotions daily — helped avoid reactive trades.', ai: 'Strong discipline note. This is exactly the behaviour pros optimise for.' },
];

const COPILOT_PROMPTS = [
  'Explain P/E ratio simply',
  'What is dollar-cost averaging?',
  'How do rate cuts affect bonds?',
];

const TYPE_COLORS = {
  Breakout: { bg: 'rgba(99,102,241,0.1)', color: '#6366f1' },
  Catalyst: { bg: 'rgba(245,158,11,0.1)', color: '#d97706' },
  Momentum: { bg: 'rgba(16,185,129,0.1)', color: '#10b981' },
  Reversal: { bg: 'rgba(236,72,153,0.1)', color: '#ec4899' },
};

const SENTIMENT_STYLES = {
  Bullish: { bg: 'rgba(16,185,129,0.1)', color: '#059669' },
  Bearish: { bg: 'rgba(239,68,68,0.1)', color: '#dc2626' },
  Cautious: { bg: 'rgba(245,158,11,0.1)', color: '#d97706' },
  Neutral: { bg: 'rgba(100,116,139,0.1)', color: '#64748b' },
};

const MOBILE_BP = 768;

function useIsMobile(bp = MOBILE_BP) {
  const [mobile, setMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(`(max-width: ${bp}px)`).matches
  );

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${bp}px)`);
    const onChange = (e) => setMobile(e.matches);
    onChange(mq);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [bp]);

  return mobile;
}

const Wrap = styled.div`
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 1280px;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
`;

const Workspace = styled.div`
  display: flex;
  flex: 1;
  min-height: 0;
  max-height: 100%;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(226, 232, 240, 0.9);
  box-shadow: 0 32px 80px rgba(0, 0, 0, 0.35);
  background: #ffffff;

  @media (max-width: ${MOBILE_BP}px) {
    flex-direction: column;
    border-radius: 12px;
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.28);
  }
`;

const MobileToolStrip = styled.div`
  display: none;

  @media (max-width: ${MOBILE_BP}px) {
    display: flex;
    gap: 0.35rem;
    padding: 0.5rem 0.65rem;
    overflow-x: auto;
    overflow-y: hidden;
    flex-shrink: 0;
    border-bottom: 1px solid #e2e8f0;
    background: #ffffff;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

const MobileToolPill = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  flex-shrink: 0;
  padding: 0.42rem 0.7rem;
  border-radius: 100px;
  border: 1px solid ${(p) => (p.$active ? '#10b981' : '#e2e8f0')};
  background: ${(p) => (p.$active ? 'rgba(16,185,129,0.12)' : '#fff')};
  color: ${(p) => (p.$active ? '#0f172a' : '#64748b')};
  font-family: 'Inter', sans-serif;
  font-size: 0.72rem;
  font-weight: ${(p) => (p.$active ? 700 : 600)};
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s, border-color 0.15s;

  svg {
    font-size: 0.72rem;
    color: ${(p) => (p.$active ? '#10b981' : '#94a3b8')};
  }
`;

const MiniSidebar = styled.aside`
  flex: 0 0 ${(p) => (p.$compact ? '220px' : '248px')};
  background: #ffffff;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;

  @media (max-width: ${MOBILE_BP}px) {
    display: none;
  }
`;

const SideHeader = styled.div`
  height: 52px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  padding: 0 1rem;
  border-bottom: 1px solid #f1f5f9;
  gap: 0.55rem;

`;

const BrandMark = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 9px;
  background: linear-gradient(135deg, #0f172a 0%, #1e3a2f 100%);
  color: #fff;
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 800;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const BrandName = styled.span`
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 800;
  font-size: 0.92rem;
  color: #0f172a;
  letter-spacing: -0.02em;

`;

const SideScroll = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 0.65rem 0.75rem;

  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 4px; }

`;

const SideGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.62rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #94a3b8;
  padding: 0.35rem 0.55rem 0.5rem;

`;

const SideList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.12rem;
  margin-left: 0.25rem;
  padding-left: 0.65rem;
  border-left: 1px solid #eef2f7;

`;

const SideItem = styled.button`
  display: flex;
  align-items: flex-start;
  gap: 0.65rem;
  padding: 0.58rem 0.65rem;
  border: none;
  border-radius: 10px;
  background: ${(p) => (p.$active ? 'rgba(16,185,129,0.12)' : 'transparent')};
  color: ${(p) => (p.$active ? '#0f172a' : '#475569')};
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  text-align: left;
  transition: background 0.15s, color 0.15s;
  width: 100%;
  position: relative;

  ${(p) =>
    p.$active &&
    `
    &::before {
      content: '';
      position: absolute;
      left: -0.66rem;
      top: 50%;
      transform: translateY(-50%);
      width: 3px;
      height: 60%;
      background: #10b981;
      border-radius: 0 3px 3px 0;
    }
  `}

  &:hover {
    background: ${(p) => (p.$active ? 'rgba(16,185,129,0.14)' : 'rgba(15,23,42,0.04)')};
    color: #0f172a;
  }

  svg.icon {
    flex-shrink: 0;
    font-size: 0.88rem;
    margin-top: 0.12rem;
    color: ${(p) => (p.$active ? '#10b981' : '#94a3b8')};
  }

`;

const SideItemText = styled.div`
  flex: 1;
  min-width: 0;
`;

const SideItemLabel = styled.div`
  font-size: 0.84rem;
  font-weight: ${(p) => (p.$active ? 600 : 500)};
  line-height: 1.25;
  letter-spacing: -0.01em;
`;

const SideItemHint = styled.div`
  font-size: 0.65rem;
  color: #94a3b8;
  margin-top: 0.1rem;
  line-height: 1.3;
`;

const SideDivider = styled.div`
  height: 1px;
  background: #f1f5f9;
  margin: 0.65rem 0.5rem;
`;

const SideExtra = styled.button`
  display: flex;
  align-items: center;
  gap: 0.65rem;
  width: 100%;
  padding: 0.5rem 0.65rem;
  border: none;
  border-radius: 10px;
  background: transparent;
  color: #64748b;
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  text-align: left;

  &:hover {
    background: rgba(15, 23, 42, 0.04);
    color: #0f172a;
  }

  svg { font-size: 0.85rem; color: #94a3b8; }

`;

const SideFooter = styled.div`
  flex-shrink: 0;
  padding: 0.65rem 0.75rem;
  border-top: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  gap: 0.55rem;
  color: #64748b;
  font-size: 0.78rem;

`;

const SideFooterIcon = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  font-size: 0.75rem;
`;

const Main = styled.div`
  flex: 1;
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  background: #e8ecf2;
  overflow: hidden;

  @media (max-width: ${MOBILE_BP}px) {
    width: 100%;
  }
`;

const ToolHeader = styled.div`
  padding: ${(p) => (p.$compact ? '0.85rem 1.1rem 0.55rem' : '1rem 1.35rem 0.65rem')};
  flex-shrink: 0;

  @media (max-width: ${MOBILE_BP}px) {
    padding: 0.65rem 0.75rem 0.45rem;
  }
`;

const ToolEyebrow = styled.p`
  margin: 0 0 0.2rem;
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #059669;
`;

const ToolTitle = styled.h2`
  margin: 0;
  font-family: 'Space Grotesk', sans-serif;
  font-size: ${(p) => (p.$compact ? 'clamp(1.05rem, 2vw, 1.4rem)' : 'clamp(1.2rem, 2.2vw, 1.65rem)')};
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.03em;
  line-height: 1.1;

  @media (max-width: ${MOBILE_BP}px) {
    font-size: clamp(1rem, 4.5vw, 1.25rem);
  }
`;

const ToolSub = styled.p`
  margin: 0.35rem 0 0;
  font-size: 0.78rem;
  color: #64748b;
  line-height: 1.45;

  @media (max-width: ${MOBILE_BP}px) {
    font-size: 0.72rem;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

const Disclaimer = styled.div`
  margin: 0 1rem 0.5rem;
  padding: 0.45rem 0.7rem;
  border-radius: 8px;
  background: rgba(34, 197, 94, 0.06);
  border: 1px solid rgba(34, 197, 94, 0.18);
  font-size: 0.68rem;
  color: #475569;
  line-height: 1.4;
  flex-shrink: 0;

  @media (max-width: ${MOBILE_BP}px) {
    margin: 0 0.65rem 0.4rem;
    font-size: 0.64rem;
    padding: 0.4rem 0.55rem;
  }
`;

const TabBody = styled.div`
  flex: 1;
  min-height: 0;
  margin: 0 0.85rem 0.85rem;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.05);

  @media (max-width: ${MOBILE_BP}px) {
    margin: 0 0.55rem 0.55rem;
    border-radius: 10px;
  }
`;

const SubToolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.55rem 0.85rem;
  border-bottom: 1px solid #f1f5f9;
  background: #fcfcfc;
  flex-wrap: wrap;
  flex-shrink: 0;

  @media (max-width: ${MOBILE_BP}px) {
    padding: 0.45rem 0.6rem;
    flex-wrap: nowrap;
    overflow-x: auto;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

const ToolbarLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  flex-wrap: wrap;

  @media (max-width: ${MOBILE_BP}px) {
    flex-wrap: nowrap;
    flex-shrink: 0;
  }
`;

const Chip = styled.span`
  font-size: 0.62rem;
  font-weight: 700;
  padding: 0.25rem 0.55rem;
  border-radius: 6px;
  background: ${(p) => (p.$active ? '#0f172a' : '#fff')};
  color: ${(p) => (p.$active ? '#fff' : '#64748b')};
  border: 1px solid ${(p) => (p.$active ? '#0f172a' : '#e2e8f0')};
  white-space: nowrap;
  flex-shrink: 0;
`;

const ToolbarBtn = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.65rem;
  font-weight: 700;
  color: #64748b;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  background: #fff;
  white-space: nowrap;
  flex-shrink: 0;
`;

const LayerScroll = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;

  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
`;

const SummaryBar = styled.div`
  display: grid;
  grid-template-columns: repeat(${(p) => p.$cols || 4}, 1fr);
  background: #fcfcfc;
  border-bottom: 1px solid #f1f5f9;

  @media (max-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const SumItem = styled.div`
  padding: 0.6rem 0.8rem;
  border-right: 1px solid #f1f5f9;
  &:last-child { border-right: none; }
`;

const SumLabel = styled.div`
  font-size: 0.55rem;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.08em;
`;

const SumValue = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 800;
  font-size: ${(p) => (p.$small ? '0.78rem' : '0.95rem')};
  color: ${(p) => p.$color || '#0f172a'};
  margin-top: 0.12rem;
  line-height: 1.3;
`;

const NewsItem = styled.div`
  padding: 0.7rem 0.9rem;
  border-bottom: 1px solid #f8fafc;

  @media (max-width: ${MOBILE_BP}px) {
    padding: 0.6rem 0.65rem;
  }
`;

const NewsTop = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const NewsSource = styled.span`
  font-size: 0.58rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #10b981;
  flex-shrink: 0;
  min-width: 52px;

  @media (max-width: ${MOBILE_BP}px) {
    min-width: 44px;
  }
`;

const NewsTitle = styled.div`
  flex: 1;
  font-size: 0.78rem;
  font-weight: 600;
  color: #0f172a;
  line-height: 1.4;
  min-width: 0;

  @media (max-width: ${MOBILE_BP}px) {
    font-size: 0.74rem;
    flex-basis: calc(100% - 52px);
  }
`;

const DecodeBtn = styled.span`
  font-size: 0.62rem;
  font-weight: 700;
  padding: 0.22rem 0.5rem;
  border-radius: 6px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  color: #64748b;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
`;

const TickerRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  margin-top: 0.4rem;
  padding-left: 58px;

  @media (max-width: ${MOBILE_BP}px) {
    padding-left: 0;
  }
`;

const TickerPill = styled.span`
  font-size: 0.58rem;
  font-weight: 700;
  padding: 0.12rem 0.4rem;
  border-radius: 100px;
  background: #f1f5f9;
  color: #475569;
`;

const SentimentPill = styled.span`
  font-size: 0.58rem;
  font-weight: 800;
  padding: 0.12rem 0.4rem;
  border-radius: 100px;
  background: ${(p) => p.$bg};
  color: ${(p) => p.$color};
`;

const InsightBox = styled.div`
  margin: 0.45rem 0 0 58px;
  padding: 0.6rem 0.7rem;
  border-radius: 8px;
  background: rgba(16, 185, 129, 0.06);
  border: 1px solid rgba(16, 185, 129, 0.15);
  font-size: 0.72rem;
  color: #475569;
  line-height: 1.5;

  @media (max-width: ${MOBILE_BP}px) {
    margin-left: 0;
    font-size: 0.68rem;
  }
`;

const PickRow = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 0.8fr auto;
  gap: 0.5rem;
  align-items: center;
  padding: 0.6rem 0.9rem;
  border-bottom: 1px solid #f8fafc;
  font-size: 0.74rem;

  @media (max-width: ${MOBILE_BP}px) {
    grid-template-columns: 1fr auto;
    grid-template-rows: auto auto;
    gap: 0.35rem 0.5rem;

    & > :nth-child(2) {
      grid-column: 1 / -1;
    }
  }
`;

const PickTicker = styled.span`
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 800;
  color: #0f172a;
`;

const PickName = styled.span`
  color: #94a3b8;
  font-size: 0.66rem;
  margin-left: 0.3rem;
`;

const PickThesis = styled.div`
  font-size: 0.66rem;
  color: #64748b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: ${MOBILE_BP}px) {
    white-space: normal;
    line-height: 1.35;
  }
`;

const LevelBadge = styled.span`
  font-size: 0.56rem;
  font-weight: 800;
  padding: 0.15rem 0.45rem;
  border-radius: 100px;
  background: ${(p) => p.$bg || '#f1f5f9'};
  color: ${(p) => p.$color || '#64748b'};
  text-transform: uppercase;
  letter-spacing: 0.04em;
  white-space: nowrap;
`;

const MoverPill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.22rem 0.55rem;
  border-radius: 100px;
  font-size: 0.64rem;
  font-weight: 700;
  background: ${(p) => (p.$up ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.07)')};
  color: ${(p) => (p.$up ? '#065f46' : '#7f1d1d')};
`;

const MoversStrip = styled.div`
  padding: 0.55rem 0.85rem;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
`;

const ThemeBox = styled.div`
  margin: 0.55rem 0.85rem 0;
  padding: 0.55rem 0.7rem;
  border-radius: 8px;
  background: #f8fafc;
  border-left: 3px solid #6366f1;
  font-size: 0.72rem;
  color: #475569;
  line-height: 1.45;
`;

const MoversGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  border-top: 1px solid #f1f5f9;

  @media (max-width: ${MOBILE_BP}px) {
    grid-template-columns: 1fr;
  }
`;

const CatalystRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0.55rem 0.85rem;
  border-bottom: 1px solid #f8fafc;
`;

const DirBadge = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 8px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(p) =>
    p.$dir === 'Up' ? 'rgba(16,185,129,0.1)' : p.$dir === 'Down' ? 'rgba(239,68,68,0.1)' : 'rgba(99,102,241,0.1)'};
  color: ${(p) => (p.$dir === 'Up' ? '#10b981' : p.$dir === 'Down' ? '#ef4444' : '#6366f1')};
  font-size: 0.7rem;
`;

const CatalystMeta = styled.div`flex: 1; min-width: 0;`;

const CatalystTicker = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 800;
  font-size: 0.8rem;
  color: #0f172a;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.25rem;
`;

const CatalystEvent = styled.div`
  font-size: 0.68rem;
  color: #64748b;
  line-height: 1.4;
  margin-top: 0.15rem;
`;

const Tag = styled.span`
  font-size: 0.54rem;
  font-weight: 800;
  padding: 0.1rem 0.38rem;
  border-radius: 100px;
  background: ${(p) => p.$bg || '#f1f5f9'};
  color: ${(p) => p.$color || '#64748b'};
`;

const DetailPane = styled.div`
  padding: 0.65rem 0.85rem;
  background: linear-gradient(180deg, #f8fafc 0%, #fff 100%);
  border-left: 1px solid #f1f5f9;

  @media (max-width: ${MOBILE_BP}px) {
    border-left: none;
    border-top: 1px solid #f1f5f9;
    padding: 0.6rem 0.65rem;
  }
`;

const DetailLabel = styled.div`
  font-size: 0.55rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #94a3b8;
  margin-bottom: 0.35rem;
`;

const AllocTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.65rem 0.85rem;
  border-bottom: 1px solid #f1f5f9;
  flex-wrap: wrap;

  @media (max-width: ${MOBILE_BP}px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
`;

const FundAmount = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 800;
  font-size: 1.1rem;
  color: #0f172a;

  @media (max-width: ${MOBILE_BP}px) {
    font-size: 1rem;
  }
`;

const AllocGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.1fr;
  gap: 0.85rem;
  padding: 0.75rem 0.85rem;

  @media (max-width: ${MOBILE_BP}px) {
    grid-template-columns: 1fr;
    padding: 0.6rem 0.65rem;
    gap: 0.65rem;
  }
`;

const PieVisual = styled.div`
  display: flex;
  height: 110px;
  border-radius: 10px;
  overflow: hidden;
`;

const PieSeg = styled.div`
  background: ${(p) => p.$color};
  flex: ${(p) => p.$pct};
`;

const HoldingList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`;

const HoldingRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 0.5rem;
  align-items: center;
  font-size: 0.72rem;
  padding: 0.38rem 0.5rem;
  border-radius: 8px;
  background: #f8fafc;
`;

const SectorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.4rem;
  padding: 0 0.85rem 0.75rem;

  @media (max-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const SectorChip = styled.div`
  padding: 0.45rem 0.5rem;
  border-radius: 8px;
  background: #f8fafc;
  border: 1px solid #f1f5f9;
  text-align: center;
`;

const SavedCard = styled.div`
  margin: 0 0.85rem 0.75rem;
  padding: 0.65rem 0.75rem;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: #fafbfc;
`;

const NoteCard = styled.div`
  margin: 0.55rem 0.85rem;
  padding: 0.65rem 0.75rem;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: #fafbfc;
`;

const NoteTag = styled.span`
  font-size: 0.54rem;
  font-weight: 800;
  text-transform: uppercase;
  padding: 0.12rem 0.4rem;
  border-radius: 100px;
  background: ${(p) => p.$bg};
  color: ${(p) => p.$color};
`;

const NoteTitle = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: 0.82rem;
  color: #0f172a;
  margin: 0.35rem 0 0.2rem;
`;

const NotePreview = styled.div`
  font-size: 0.72rem;
  color: #64748b;
  line-height: 1.45;
`;

const AiReflection = styled.div`
  margin-top: 0.45rem;
  padding: 0.5rem 0.6rem;
  border-radius: 8px;
  background: rgba(124, 58, 237, 0.06);
  border: 1px solid rgba(124, 58, 237, 0.12);
  font-size: 0.68rem;
  color: #5b21b6;
  line-height: 1.45;
`;

const ChatWrap = styled.div`
  padding: 0.75rem 0.85rem;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  min-height: 140px;
`;

const ChatBubble = styled.div`
  max-width: 90%;
  padding: 0.55rem 0.75rem;
  border-radius: 12px;
  font-size: 0.74rem;
  line-height: 1.5;
  background: ${(p) => (p.$user ? '#0f172a' : '#f1f5f9')};
  color: ${(p) => (p.$user ? '#f8fafc' : '#334155')};
  align-self: ${(p) => (p.$user ? 'flex-end' : 'flex-start')};
  border-bottom-right-radius: ${(p) => (p.$user ? '4px' : '12px')};
  border-bottom-left-radius: ${(p) => (p.$user ? '12px' : '4px')};
`;

const PromptRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  padding: 0 0.85rem 0.55rem;
`;

const PromptChip = styled.span`
  font-size: 0.64rem;
  font-weight: 600;
  padding: 0.3rem 0.55rem;
  border-radius: 100px;
  background: #fff;
  border: 1px solid #e2e8f0;
  color: #475569;
`;

const ChatInput = styled.div`
  margin: 0 0.85rem 0.75rem;
  padding: 0.55rem 0.75rem;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  font-size: 0.72rem;
  color: #94a3b8;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const PanelFooter = styled.div`
  padding: 0.55rem 0.85rem 0.7rem;
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;
  display: flex;
  justify-content: center;
  flex-shrink: 0;

  @media (max-width: ${MOBILE_BP}px) {
    padding: 0.5rem 0.65rem 0.6rem;
  }
`;

const CtaBtn = styled.button`
  padding: 0.55rem 1.25rem;
  border-radius: 100px;
  border: none;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: #fff;
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: 0.78rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  transition: transform 0.18s, box-shadow 0.18s;

  @media (max-width: ${MOBILE_BP}px) {
    width: 100%;
    font-size: 0.75rem;
    padding: 0.6rem 1rem;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(34, 197, 94, 0.35);
  }
`;

const Skeleton = styled.div`
  height: 52px;
  margin: 0.5rem 0.85rem;
  border-radius: 8px;
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 200% 100%;
  animation: shimmer 1.2s infinite;
  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;

const NOTE_TAGS = {
  idea: { bg: '#eff6ff', color: '#2563eb' },
  trade: { bg: '#dcfce7', color: '#15803d' },
  lesson: { bg: '#f3e8ff', color: '#7c3aed' },
};

function moodColor(mood) {
  if (mood === 'Risk-On') return '#10b981';
  if (mood === 'Risk-Off') return '#ef4444';
  return '#f59e0b';
}

function SubToolbarForTab({ tab }) {
  if (tab === 'news') {
    return (
      <SubToolbar>
        <ToolbarLeft>
          <Chip $active>All sources</Chip>
          <Chip>Macro</Chip>
          <Chip>Equities</Chip>
          <Chip>Crypto</Chip>
        </ToolbarLeft>
        <ToolbarBtn><FaSyncAlt /> Refresh</ToolbarBtn>
      </SubToolbar>
    );
  }
  if (tab === 'picks') {
    return (
      <SubToolbar>
        <ToolbarLeft>
          <Chip $active>All</Chip>
          <Chip>Deep dive</Chip>
          <Chip>Discuss</Chip>
          <Chip>Caution</Chip>
        </ToolbarLeft>
        <ToolbarBtn><FaFilter /> Preferences</ToolbarBtn>
      </SubToolbar>
    );
  }
  if (tab === 'movers') {
    return (
      <SubToolbar>
        <ToolbarLeft>
          <Chip $active>Gainers</Chip>
          <Chip>Losers</Chip>
          <Chip>Catalysts</Chip>
        </ToolbarLeft>
        <ToolbarBtn><FaSyncAlt /> Rescan</ToolbarBtn>
      </SubToolbar>
    );
  }
  if (tab === 'allocation') {
    return (
      <SubToolbar>
        <ToolbarLeft>
          <Chip $active>Moderate</Chip>
          <Chip>Conservative</Chip>
          <Chip>Aggressive</Chip>
        </ToolbarLeft>
        <ToolbarBtn><FaSave /> Save model</ToolbarBtn>
      </SubToolbar>
    );
  }
  if (tab === 'journal') {
    return (
      <SubToolbar>
        <ToolbarLeft>
          <Chip $active>All entries</Chip>
          <Chip>Ideas</Chip>
          <Chip>Trades</Chip>
          <Chip>Lessons</Chip>
        </ToolbarLeft>
        <ToolbarBtn><FaPlus /> New entry</ToolbarBtn>
      </SubToolbar>
    );
  }
  return null;
}

function LayerPreview({ tab, movers, loading, compact, isMobile }) {
  const catalysts = movers?.catalysts ?? [];
  const mood = movers?.marketMood;
  const featured = catalysts[0];
  const headlineLimit = isMobile ? 3 : MOCK_HEADLINES.length;
  const pickLimit = isMobile ? 4 : MOCK_PICKS.length;
  const noteLimit = isMobile ? 2 : MOCK_NOTES.length;
  const catalystLimit = isMobile ? 2 : (compact ? 3 : 4);
  const gainerLimit = isMobile ? 3 : (compact ? 4 : 5);
  const loserLimit = isMobile ? 2 : (compact ? 3 : 4);
  const showFeatured = featured && !isMobile;

  switch (tab) {
    case 'news':
      return (
        <>
          <SummaryBar $cols={4}>
            <SumItem><SumLabel>Headlines</SumLabel><SumValue>24</SumValue></SumItem>
            <SumItem><SumLabel>Decoded</SumLabel><SumValue $color="#10b981">6</SumValue></SumItem>
            <SumItem><SumLabel>Sources</SumLabel><SumValue>8</SumValue></SumItem>
            <SumItem><SumLabel>Sentiment</SumLabel><SumValue $small $color="#f59e0b">Mixed</SumValue></SumItem>
          </SummaryBar>
          {MOCK_HEADLINES.slice(0, headlineLimit).map((h) => {
            const sc = SENTIMENT_STYLES[h.sentiment] || SENTIMENT_STYLES.Neutral;
            return (
              <NewsItem key={h.title}>
                <NewsTop>
                  <NewsSource>{h.source}</NewsSource>
                  <NewsTitle>{h.title}</NewsTitle>
                  {!h.insight && (
                    <DecodeBtn><FaChartLine /> Decode</DecodeBtn>
                  )}
                </NewsTop>
                <TickerRow>
                  {h.tickers.map((t) => <TickerPill key={t}>{t}</TickerPill>)}
                  <SentimentPill $bg={sc.bg} $color={sc.color}>{h.sentiment}</SentimentPill>
                </TickerRow>
                {h.insight && <InsightBox>{h.insight}</InsightBox>}
              </NewsItem>
            );
          })}
        </>
      );

    case 'picks':
      return (
        <>
          <SummaryBar $cols={4}>
            <SumItem><SumLabel>Cases</SumLabel><SumValue>12</SumValue></SumItem>
            <SumItem><SumLabel>Deep dives</SumLabel><SumValue $color="#10b981">4</SumValue></SumItem>
            <SumItem><SumLabel>Discuss</SumLabel><SumValue $color="#f59e0b">5</SumValue></SumItem>
            <SumItem><SumLabel>Sectors</SumLabel><SumValue>6</SumValue></SumItem>
          </SummaryBar>
          {MOCK_PICKS.slice(0, pickLimit).map((p) => (
            <PickRow key={p.ticker}>
              <div>
                <PickTicker>{p.ticker}</PickTicker>
                <PickName>{p.name}</PickName>
              </div>
              <PickThesis>{p.thesis}</PickThesis>
              <LevelBadge $bg={`${p.color}18`} $color={p.color}>{p.level}</LevelBadge>
            </PickRow>
          ))}
        </>
      );

    case 'movers':
      return (
        <>
          <SummaryBar $cols={4}>
            <SumItem><SumLabel>Mood</SumLabel><SumValue $color={moodColor(mood)}>{mood || (loading ? '…' : '—')}</SumValue></SumItem>
            <SumItem><SumLabel>Catalysts</SumLabel><SumValue $color="#6366f1">{catalysts.length || '—'}</SumValue></SumItem>
            <SumItem><SumLabel>Gainers</SumLabel><SumValue $color="#10b981">{movers?.avMovers?.gainers?.length || '—'}</SumValue></SumItem>
            <SumItem><SumLabel>Losers</SumLabel><SumValue $color="#ef4444">{movers?.avMovers?.losers?.length || '—'}</SumValue></SumItem>
          </SummaryBar>
          {movers?.topTheme && (
            <ThemeBox>
              <strong>Top theme:</strong>{' '}
              {isMobile && movers.topTheme.length > 72
                ? `${movers.topTheme.slice(0, 72)}…`
                : movers.topTheme}
            </ThemeBox>
          )}
          {movers?.scanSummary && !isMobile && (
            <ThemeBox style={{ borderLeftColor: '#10b981', marginTop: movers?.topTheme ? '0.35rem' : '0.55rem' }}>
              {movers.scanSummary}
            </ThemeBox>
          )}
          {movers?.avMovers && (
            <MoversStrip>
              {movers.avMovers.gainers?.slice(0, gainerLimit).map((g) => (
                <MoverPill key={g.ticker} $up><FaArrowUp style={{ fontSize: '0.5rem' }} /> {g.ticker} {g.changePct}</MoverPill>
              ))}
              {movers.avMovers.losers?.slice(0, loserLimit).map((l) => (
                <MoverPill key={l.ticker} $up={false}><FaArrowDown style={{ fontSize: '0.5rem' }} /> {l.ticker} {l.changePct}</MoverPill>
              ))}
            </MoversStrip>
          )}
          {loading && catalysts.length === 0 ? (
            <><Skeleton /><Skeleton /><Skeleton /></>
          ) : catalysts.length > 0 ? (
            <MoversGrid>
              <div>
                {catalysts.slice(0, catalystLimit).map((c, i) => {
                  const DirIcon = c.direction === 'Up' ? FaArrowUp : c.direction === 'Down' ? FaArrowDown : FaExchangeAlt;
                  const typeStyle = TYPE_COLORS[c.movementType] || { bg: '#f1f5f9', color: '#64748b' };
                  return (
                    <CatalystRow key={c.ticker + i}>
                      <DirBadge $dir={c.direction}><DirIcon /></DirBadge>
                      <CatalystMeta>
                        <CatalystTicker>
                          {c.ticker}
                          <Tag $bg={typeStyle.bg} $color={typeStyle.color}>{c.movementType}</Tag>
                          {c.urgency && <Tag>{c.urgency}</Tag>}
                        </CatalystTicker>
                        <CatalystEvent>{c.triggerEvent}</CatalystEvent>
                      </CatalystMeta>
                    </CatalystRow>
                  );
                })}
              </div>
              {showFeatured && (
                <DetailPane>
                  <DetailLabel>Featured catalyst</DetailLabel>
                  <CatalystTicker style={{ fontSize: '0.95rem', marginBottom: '0.35rem' }}>
                    {featured.ticker}
                    {featured.name && <span style={{ fontWeight: 500, color: '#94a3b8', fontSize: '0.72rem', marginLeft: 6 }}>{featured.name}</span>}
                  </CatalystTicker>
                  <CatalystEvent style={{ WebkitLineClamp: 'unset', marginBottom: '0.5rem' }}>{featured.triggerEvent}</CatalystEvent>
                  {featured.technicalNote && (
                    <div style={{ fontSize: '0.68rem', color: '#64748b', marginBottom: '0.35rem' }}>
                      <strong>Technical:</strong> {featured.technicalNote}
                    </div>
                  )}
                  {featured.risk && (
                    <div style={{ fontSize: '0.68rem', color: '#64748b' }}>
                      <strong>Risk:</strong> {featured.risk}
                    </div>
                  )}
                </DetailPane>
              )}
            </MoversGrid>
          ) : (
            <div style={{ padding: '1.5rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.75rem' }}>
              Scanning markets for catalysts…
            </div>
          )}
        </>
      );

    case 'allocation':
      return (
        <>
          <AllocTop>
            <div>
              <SumLabel>Model fund size</SumLabel>
              <FundAmount><FaCoins style={{ fontSize: '0.85rem', marginRight: 6, color: '#10b981' }} />$50,000</FundAmount>
            </div>
            <ToolbarBtn><FaMagic style={{ marginRight: 4 }} /> Run allocation</ToolbarBtn>
          </AllocTop>
          <AllocGrid>
            <PieVisual>
              {MOCK_HOLDINGS.map((h) => (
                <PieSeg key={h.ticker} $color={h.color} $pct={h.pct} title={`${h.ticker} ${h.pct}%`} />
              ))}
            </PieVisual>
            <HoldingList>
              {MOCK_HOLDINGS.map((h) => (
                <HoldingRow key={h.ticker}>
                  <span style={{ fontWeight: 700, color: h.color }}>{h.ticker}</span>
                  <span style={{ color: '#94a3b8', fontSize: '0.64rem' }}>{h.type}</span>
                  <span style={{ color: '#64748b', fontWeight: 700 }}>{h.pct}%</span>
                </HoldingRow>
              ))}
            </HoldingList>
          </AllocGrid>
          <DetailLabel style={{ padding: '0 0.85rem' }}>Sector breakdown</DetailLabel>
          <SectorGrid>
            {MOCK_SECTORS.map((s) => (
              <SectorChip key={s.name}>
                <div style={{ fontSize: '0.62rem', color: '#94a3b8' }}>{s.name}</div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: '0.85rem' }}>{s.pct}%</div>
              </SectorChip>
            ))}
          </SectorGrid>
          <SavedCard>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#0f172a' }}>Balanced growth model</div>
            <div style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: 2 }}>6 holdings · saved to account</div>
            <div style={{ display: 'flex', gap: 4, marginTop: 6, flexWrap: 'wrap' }}>
              {MOCK_HOLDINGS.slice(0, 4).map((h) => (
                <Tag key={h.ticker} $bg={`${h.color}18`} $color={h.color}>{h.ticker} {h.pct}%</Tag>
              ))}
            </div>
          </SavedCard>
        </>
      );

    case 'journal':
      return (
        <>
          <SummaryBar $cols={4}>
            <SumItem><SumLabel>Entries</SumLabel><SumValue>14</SumValue></SumItem>
            <SumItem><SumLabel>Ideas</SumLabel><SumValue $color="#2563eb">5</SumValue></SumItem>
            <SumItem><SumLabel>Trades</SumLabel><SumValue $color="#15803d">6</SumValue></SumItem>
            <SumItem><SumLabel>AI reviews</SumLabel><SumValue $color="#7c3aed">8</SumValue></SumItem>
          </SummaryBar>
          {MOCK_NOTES.slice(0, noteLimit).map((n) => {
            const ts = NOTE_TAGS[n.tag] || NOTE_TAGS.idea;
            return (
              <NoteCard key={n.title}>
                <NoteTag $bg={ts.bg} $color={ts.color}>{n.tag}</NoteTag>
                <NoteTitle>{n.title}</NoteTitle>
                <NotePreview>{n.preview}</NotePreview>
                {n.ai && (
                  <AiReflection><FaRobot style={{ marginRight: 4 }} />{n.ai}</AiReflection>
                )}
              </NoteCard>
            );
          })}
        </>
      );

    case 'copilot':
      return (
        <>
          <ChatWrap>
            <ChatBubble $user>What does a hawkish Fed mean for my portfolio?</ChatBubble>
            <ChatBubble>
              A hawkish Fed signals rates may stay higher for longer. Growth stocks often face more pressure, while cash and short-duration bonds can look relatively attractive.
            </ChatBubble>
            {!isMobile && (
              <>
                <ChatBubble $user>Break that down by asset class in plain English.</ChatBubble>
                <ChatBubble>
                  <strong>Equities:</strong> growth &gt; value pressure. <strong>Bonds:</strong> short duration safer. <strong>Crypto:</strong> liquidity-sensitive. <strong>Cash:</strong> finally earns something meaningful.
                </ChatBubble>
              </>
            )}
          </ChatWrap>
          <PromptRow>
            {(isMobile ? COPILOT_PROMPTS.slice(0, 2) : COPILOT_PROMPTS).map((p) => (
              <PromptChip key={p}>{p}</PromptChip>
            ))}
          </PromptRow>
          <ChatInput>
            Ask Copilot anything…
            <FaBolt style={{ color: '#10b981' }} />
          </ChatInput>
        </>
      );

    default:
      return null;
  }
}

export default function IntelligenceShowcase({ movers, loading, compact = false }) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('movers');
  const [paused, setPaused] = useState(false);
  const stripRef = useRef(null);
  const pillRefs = useRef({});

  const tool = IQ_TOOLS.find((t) => t.tab === activeTab) || IQ_TOOLS[0];

  const selectTab = (tab) => {
    setActiveTab(tab);
    setPaused(true);
  };

  const pause = () => setPaused(true);
  const resume = () => setPaused(false);

  useEffect(() => {
    if (paused) return undefined;
    const id = setInterval(() => {
      setActiveTab((prev) => {
        const idx = IQ_TOOLS.findIndex((t) => t.tab === prev);
        return IQ_TOOLS[(idx + 1) % IQ_TOOLS.length].tab;
      });
    }, 6000);
    return () => clearInterval(id);
  }, [paused]);

  useEffect(() => {
    if (!isMobile) return;
    const el = pillRefs.current[activeTab];
    if (el?.scrollIntoView) {
      el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [activeTab, isMobile]);

  const openHub = () => {
    navigate(activeTab === 'news' ? '/iq' : `/iq?tab=${activeTab}`);
  };

  return (
    <Wrap>
      <Workspace onTouchStart={pause}>
        <MobileToolStrip ref={stripRef}>
          {IQ_TOOLS.map((t) => {
            const Icon = t.icon;
            const active = activeTab === t.tab;
            return (
              <MobileToolPill
                key={t.tab}
                ref={(el) => { pillRefs.current[t.tab] = el; }}
                type="button"
                $active={active}
                onClick={() => selectTab(t.tab)}
              >
                <Icon />
                {t.mobileLabel || t.label}
              </MobileToolPill>
            );
          })}
        </MobileToolStrip>

        <MiniSidebar $compact={compact} onMouseEnter={pause} onMouseLeave={resume}>
          <SideHeader>
            <BrandMark>B</BrandMark>
            <BrandName>BloomVest</BrandName>
          </SideHeader>

          <SideScroll>
            <SideGroup>
              <FaBrain style={{ color: '#10b981', fontSize: '0.75rem' }} />
              Intelligence
            </SideGroup>
            <SideList>
              {IQ_TOOLS.map((t) => {
                const Icon = t.icon;
                const active = activeTab === t.tab;
                return (
                  <SideItem
                    key={t.tab}
                    type="button"
                    $active={active}
                    onClick={() => selectTab(t.tab)}
                    title={t.label}
                  >
                    <Icon className="icon" />
                    <SideItemText className="text">
                      <SideItemLabel $active={active}>{t.label}</SideItemLabel>
                      <SideItemHint>{t.hint}</SideItemHint>
                    </SideItemText>
                  </SideItem>
                );
              })}
            </SideList>

            <SideDivider />

            {EXTRA_NAV.map((item) => {
              const Icon = item.icon;
              return (
                <SideExtra key={item.label} type="button" onClick={() => navigate(item.to)}>
                  <Icon />
                  <span>{item.label}</span>
                </SideExtra>
              );
            })}
          </SideScroll>

          <SideFooter>
            <SideFooterIcon><FaUser /></SideFooterIcon>
            <span>My Profile</span>
          </SideFooter>
        </MiniSidebar>

        <Main onMouseEnter={pause} onMouseLeave={resume} onTouchStart={pause}>
          <ToolHeader $compact={compact}>
            <ToolEyebrow>{tool.eyebrow}</ToolEyebrow>
            <ToolTitle $compact={compact}>{tool.title}</ToolTitle>
            <ToolSub>{tool.sub}</ToolSub>
          </ToolHeader>

          <Disclaimer>
            For education only — not financial advice. Practice tools use hypothetical scenarios.
          </Disclaimer>

          <TabBody>
            <SubToolbarForTab tab={activeTab} />
            <LayerScroll>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.22 }}
                >
                  <LayerPreview
                    tab={activeTab}
                    movers={movers}
                    loading={loading}
                    compact={compact}
                    isMobile={isMobile}
                  />
                </motion.div>
              </AnimatePresence>
            </LayerScroll>
          </TabBody>
        </Main>
      </Workspace>

      <PanelFooter>
        <CtaBtn onClick={openHub}>
          Open Full Intelligence Hub <FaArrowRight />
        </CtaBtn>
      </PanelFooter>
    </Wrap>
  );
}
