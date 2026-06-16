import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaBook, FaSearch, FaTimes, FaBolt, FaLightbulb, FaBuilding,
  FaGripVertical, FaPlus, FaHistory, FaRobot, FaSpinner,
  FaArrowRight, FaHeart, FaRegHeart, FaCheckCircle, FaCheck,
  FaChevronRight, FaChevronLeft, FaLayerGroup, FaFire,
  FaCopy, FaRegClock, FaStar, FaTrash, FaGraduationCap,
  FaChartLine, FaSync, FaTrophy, FaLock, FaBrain,
} from 'react-icons/fa';
import { api } from '../api';
import { useAuth } from '../AuthContext';

/* ── localStorage-backed state (XP / streak) ── */
function useLocalState(key, initial) {
  const [v, setV] = useState(() => {
    try { const r = localStorage.getItem(key); return r != null ? JSON.parse(r) : initial; } catch { return initial; }
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(v)); } catch {} }, [key, v]);
  return [v, setV];
}
const todayStr = () => new Date().toISOString().slice(0, 10);
const yesterStr = () => { const d = new Date(Date.now()-864e5); return d.toISOString().slice(0, 10); };

/* ═══════════════════════════════════════════════════════════════
   TERMS DATA — 130+ terms with category + difficulty level
═══════════════════════════════════════════════════════════════ */

const CATEGORIES = [
  { id: 'all',         label: 'All',         color: '#0f172a',  icon: '🔎' },
  { id: 'basics',      label: 'Basics',      color: '#0ea5e9',  icon: '📌' },
  { id: 'stocks',      label: 'Stocks',      color: '#16a34a',  icon: '📈' },
  { id: 'valuation',   label: 'Valuation',   color: '#7c3aed',  icon: '🔬' },
  { id: 'bonds',       label: 'Bonds',       color: '#d97706',  icon: '🏛️' },
  { id: 'portfolio',   label: 'Portfolio',   color: '#059669',  icon: '💼' },
  { id: 'macro',       label: 'Macro',       color: '#dc2626',  icon: '🌍' },
  { id: 'derivatives', label: 'Derivatives', color: '#0284c7',  icon: '⚙️' },
  { id: 'crypto',      label: 'Crypto',      color: '#f59e0b',  icon: '🔗' },
  { id: 'personal',    label: 'Personal Fin',color: '#db2777',  icon: '💰' },
];

// level: 1=beginner, 2=intermediate, 3=advanced
const TERMS = [
  // Basics
  { id: 'asset',            label: 'Asset',                category: 'basics',      level: 1 },
  { id: 'liability',        label: 'Liability',             category: 'basics',      level: 1 },
  { id: 'equity',           label: 'Equity',                category: 'basics',      level: 1 },
  { id: 'net-worth',        label: 'Net Worth',             category: 'basics',      level: 1 },
  { id: 'cash-flow',        label: 'Cash Flow',             category: 'basics',      level: 1 },
  { id: 'revenue',          label: 'Revenue',               category: 'basics',      level: 1 },
  { id: 'profit',           label: 'Profit',                category: 'basics',      level: 1 },
  { id: 'margin',           label: 'Profit Margin',         category: 'basics',      level: 1 },
  { id: 'compound-interest',label: 'Compound Interest',     category: 'basics',      level: 1 },
  { id: 'inflation',        label: 'Inflation',             category: 'basics',      level: 1 },
  { id: 'interest-rate',    label: 'Interest Rate',         category: 'basics',      level: 1 },
  { id: 'dividend',         label: 'Dividend',              category: 'basics',      level: 1 },
  { id: 'capital-gain',     label: 'Capital Gain',          category: 'basics',      level: 1 },
  { id: 'liquidity',        label: 'Liquidity',             category: 'basics',      level: 1 },
  { id: 'risk',             label: 'Risk',                  category: 'basics',      level: 1 },
  { id: 'return',           label: 'Return',                category: 'basics',      level: 1 },
  { id: 'time-value-money', label: 'Time Value of Money',   category: 'basics',      level: 2 },
  { id: 'opportunity-cost', label: 'Opportunity Cost',      category: 'basics',      level: 1 },
  { id: 'depreciation',     label: 'Depreciation',          category: 'basics',      level: 2 },
  // Stocks
  { id: 'stock',            label: 'Stock / Share',         category: 'stocks',      level: 1 },
  { id: 'ipo',              label: 'IPO',                   category: 'stocks',      level: 1 },
  { id: 'market-cap',       label: 'Market Cap',            category: 'stocks',      level: 1 },
  { id: 'eps',              label: 'EPS',                   category: 'stocks',      level: 1 },
  { id: 'stock-split',      label: 'Stock Split',           category: 'stocks',      level: 1 },
  { id: 'short-selling',    label: 'Short Selling',         category: 'stocks',      level: 2 },
  { id: 'earnings-call',    label: 'Earnings Call',         category: 'stocks',      level: 2 },
  { id: 'beta',             label: 'Beta',                  category: 'stocks',      level: 2 },
  { id: 'alpha',            label: 'Alpha',                 category: 'stocks',      level: 2 },
  { id: 'volatility',       label: 'Volatility',            category: 'stocks',      level: 2 },
  { id: 'float',            label: 'Float',                 category: 'stocks',      level: 2 },
  { id: 'bid-ask',          label: 'Bid/Ask Spread',        category: 'stocks',      level: 1 },
  { id: 'market-order',     label: 'Market Order',          category: 'stocks',      level: 1 },
  { id: 'limit-order',      label: 'Limit Order',           category: 'stocks',      level: 1 },
  { id: 'stock-buyback',    label: 'Stock Buyback',         category: 'stocks',      level: 2 },
  { id: 'blue-chip',        label: 'Blue Chip Stock',       category: 'stocks',      level: 1 },
  { id: 'growth-stock',     label: 'Growth Stock',          category: 'stocks',      level: 1 },
  { id: 'value-stock',      label: 'Value Stock',           category: 'stocks',      level: 1 },
  { id: 'dividend-yield',   label: 'Dividend Yield',        category: 'stocks',      level: 1 },
  { id: 'day-trading',      label: 'Day Trading',           category: 'stocks',      level: 2 },
  { id: 'swing-trading',    label: 'Swing Trading',         category: 'stocks',      level: 2 },
  { id: 'circuit-breaker',  label: 'Circuit Breaker',       category: 'stocks',      level: 2 },
  { id: 'penny-stock',      label: 'Penny Stock',           category: 'stocks',      level: 2 },
  // Valuation
  { id: 'pe-ratio',         label: 'P/E Ratio',             category: 'valuation',   level: 1 },
  { id: 'pb-ratio',         label: 'P/B Ratio',             category: 'valuation',   level: 2 },
  { id: 'ev-ebitda',        label: 'EV/EBITDA',             category: 'valuation',   level: 3 },
  { id: 'dcf',              label: 'DCF Analysis',          category: 'valuation',   level: 3 },
  { id: 'book-value',       label: 'Book Value',            category: 'valuation',   level: 2 },
  { id: 'intrinsic-value',  label: 'Intrinsic Value',       category: 'valuation',   level: 2 },
  { id: 'ebitda',           label: 'EBITDA',                category: 'valuation',   level: 2 },
  { id: 'free-cash-flow',   label: 'Free Cash Flow',        category: 'valuation',   level: 2 },
  { id: 'roe',              label: 'Return on Equity (ROE)',category: 'valuation',   level: 2 },
  { id: 'roa',              label: 'Return on Assets (ROA)',category: 'valuation',   level: 2 },
  { id: 'peg-ratio',        label: 'PEG Ratio',             category: 'valuation',   level: 3 },
  { id: 'wacc',             label: 'WACC',                  category: 'valuation',   level: 3 },
  { id: 'ps-ratio',         label: 'Price-to-Sales (P/S)',  category: 'valuation',   level: 2 },
  { id: 'npv',              label: 'Net Present Value (NPV)',category: 'valuation',  level: 2 },
  { id: 'irr',              label: 'Internal Rate of Return (IRR)',category: 'valuation', level: 3 },
  { id: 'moat',             label: 'Economic Moat',         category: 'valuation',   level: 2 },
  { id: 'de-ratio',         label: 'Debt-to-Equity Ratio',  category: 'valuation',   level: 2 },
  { id: 'gross-margin',     label: 'Gross Margin',          category: 'valuation',   level: 2 },
  // Bonds
  { id: 'bond',             label: 'Bond',                  category: 'bonds',       level: 1 },
  { id: 'yield',            label: 'Yield',                 category: 'bonds',       level: 1 },
  { id: 'coupon-rate',      label: 'Coupon Rate',           category: 'bonds',       level: 1 },
  { id: 'bond-rating',      label: 'Bond Rating',           category: 'bonds',       level: 2 },
  { id: 'treasury-bond',    label: 'Treasury Bond',         category: 'bonds',       level: 1 },
  { id: 'corporate-bond',   label: 'Corporate Bond',        category: 'bonds',       level: 2 },
  { id: 'duration',         label: 'Duration',              category: 'bonds',       level: 3 },
  { id: 'yield-curve',      label: 'Yield Curve',           category: 'bonds',       level: 2 },
  { id: 'inverted-yield',   label: 'Inverted Yield Curve',  category: 'bonds',       level: 2 },
  { id: 'junk-bond',        label: 'High-Yield / Junk Bond',category: 'bonds',       level: 2 },
  { id: 'callable-bond',    label: 'Callable Bond',         category: 'bonds',       level: 3 },
  { id: 'convertible-bond', label: 'Convertible Bond',      category: 'bonds',       level: 3 },
  { id: 'zero-coupon',      label: 'Zero-Coupon Bond',      category: 'bonds',       level: 2 },
  { id: 'tips',             label: 'TIPS',                  category: 'bonds',       level: 2 },
  // Portfolio
  { id: 'diversification',  label: 'Diversification',       category: 'portfolio',   level: 1 },
  { id: 'asset-allocation', label: 'Asset Allocation',      category: 'portfolio',   level: 1 },
  { id: 'rebalancing',      label: 'Rebalancing',           category: 'portfolio',   level: 2 },
  { id: 'index-fund',       label: 'Index Fund',            category: 'portfolio',   level: 1 },
  { id: 'etf',              label: 'ETF',                   category: 'portfolio',   level: 1 },
  { id: 'mutual-fund',      label: 'Mutual Fund',           category: 'portfolio',   level: 1 },
  { id: 'sharpe-ratio',     label: 'Sharpe Ratio',          category: 'portfolio',   level: 3 },
  { id: 'drawdown',         label: 'Drawdown',              category: 'portfolio',   level: 2 },
  { id: 'dca',              label: 'Dollar-Cost Averaging', category: 'portfolio',   level: 1 },
  { id: 'hedge',            label: 'Hedging',               category: 'portfolio',   level: 2 },
  { id: 'benchmark',        label: 'Benchmark',             category: 'portfolio',   level: 1 },
  { id: 'stop-loss',        label: 'Stop Loss',             category: 'portfolio',   level: 2 },
  { id: 'take-profit',      label: 'Take Profit',           category: 'portfolio',   level: 2 },
  { id: 'position-sizing',  label: 'Position Sizing',       category: 'portfolio',   level: 2 },
  { id: 'risk-reward',      label: 'Risk/Reward Ratio',     category: 'portfolio',   level: 2 },
  { id: 'buy-hold',         label: 'Buy & Hold',            category: 'portfolio',   level: 1 },
  { id: 'correlation',      label: 'Correlation',           category: 'portfolio',   level: 2 },
  { id: 'factor-investing', label: 'Factor Investing',      category: 'portfolio',   level: 3 },
  { id: 'sixty-forty',      label: '60/40 Portfolio',       category: 'portfolio',   level: 1 },
  // Macro
  { id: 'gdp',              label: 'GDP',                   category: 'macro',       level: 1 },
  { id: 'cpi',              label: 'CPI',                   category: 'macro',       level: 1 },
  { id: 'fed-funds',        label: 'Fed Funds Rate',        category: 'macro',       level: 1 },
  { id: 'qe',               label: 'Quantitative Easing',   category: 'macro',       level: 2 },
  { id: 'monetary-policy',  label: 'Monetary Policy',       category: 'macro',       level: 2 },
  { id: 'fiscal-policy',    label: 'Fiscal Policy',         category: 'macro',       level: 2 },
  { id: 'recession',        label: 'Recession',             category: 'macro',       level: 1 },
  { id: 'bull-market',      label: 'Bull Market',           category: 'macro',       level: 1 },
  { id: 'bear-market',      label: 'Bear Market',           category: 'macro',       level: 1 },
  { id: 'stagflation',      label: 'Stagflation',           category: 'macro',       level: 2 },
  { id: 'trade-deficit',    label: 'Trade Deficit',         category: 'macro',       level: 2 },
  { id: 'hawkish-dovish',   label: 'Hawkish vs Dovish',     category: 'macro',       level: 2 },
  { id: 'pmi',              label: 'PMI',                   category: 'macro',       level: 2 },
  { id: 'unemployment',     label: 'Unemployment Rate',     category: 'macro',       level: 1 },
  { id: 'exchange-rate',    label: 'Exchange Rate',         category: 'macro',       level: 1 },
  { id: 'debt-ceiling',     label: 'Debt Ceiling',          category: 'macro',       level: 2 },
  { id: 'market-cycle',     label: 'Market Cycle',          category: 'macro',       level: 2 },
  // Derivatives
  { id: 'option',           label: 'Option Contract',       category: 'derivatives', level: 2 },
  { id: 'call-option',      label: 'Call Option',           category: 'derivatives', level: 2 },
  { id: 'put-option',       label: 'Put Option',            category: 'derivatives', level: 2 },
  { id: 'strike-price',     label: 'Strike Price',          category: 'derivatives', level: 2 },
  { id: 'futures',          label: 'Futures Contract',      category: 'derivatives', level: 2 },
  { id: 'implied-vol',      label: 'Implied Volatility',    category: 'derivatives', level: 3 },
  { id: 'greeks',           label: 'The Greeks (Delta etc)',category: 'derivatives', level: 3 },
  { id: 'leverage',         label: 'Leverage',              category: 'derivatives', level: 2 },
  { id: 'covered-call',     label: 'Covered Call',          category: 'derivatives', level: 3 },
  { id: 'protective-put',   label: 'Protective Put',        category: 'derivatives', level: 3 },
  { id: 'theta-decay',      label: 'Theta Decay',           category: 'derivatives', level: 3 },
  { id: 'iron-condor',      label: 'Iron Condor',           category: 'derivatives', level: 3 },
  { id: 'straddle',         label: 'Straddle',              category: 'derivatives', level: 3 },
  // Crypto
  { id: 'blockchain',       label: 'Blockchain',            category: 'crypto',      level: 1 },
  { id: 'bitcoin',          label: 'Bitcoin',               category: 'crypto',      level: 1 },
  { id: 'altcoin',          label: 'Altcoin',               category: 'crypto',      level: 1 },
  { id: 'defi',             label: 'DeFi',                  category: 'crypto',      level: 2 },
  { id: 'nft',              label: 'NFT',                   category: 'crypto',      level: 1 },
  { id: 'staking',          label: 'Staking',               category: 'crypto',      level: 2 },
  { id: 'gas-fee',          label: 'Gas Fee',               category: 'crypto',      level: 1 },
  { id: 'wallet',           label: 'Crypto Wallet',         category: 'crypto',      level: 1 },
  { id: 'smart-contract',   label: 'Smart Contract',        category: 'crypto',      level: 2 },
  { id: 'proof-of-work',    label: 'Proof of Work',         category: 'crypto',      level: 3 },
  { id: 'proof-of-stake',   label: 'Proof of Stake',        category: 'crypto',      level: 3 },
  { id: 'dex',              label: 'DEX vs CEX',            category: 'crypto',      level: 2 },
  { id: 'tokenomics',       label: 'Tokenomics',            category: 'crypto',      level: 2 },
  { id: 'layer2',           label: 'Layer 2 Solutions',     category: 'crypto',      level: 3 },
  // Personal Finance
  { id: 'budget',           label: 'Budgeting',             category: 'personal',    level: 1 },
  { id: 'savings-rate',     label: 'Savings Rate',          category: 'personal',    level: 1 },
  { id: 'emergency-fund',   label: 'Emergency Fund',        category: 'personal',    level: 1 },
  { id: 'passive-income',   label: 'Passive Income',        category: 'personal',    level: 1 },
  { id: 'tax-loss-harvest', label: 'Tax-Loss Harvesting',   category: 'personal',    level: 2 },
  { id: 'roth-ira',         label: 'Roth IRA',              category: 'personal',    level: 1 },
  { id: 'isa',              label: 'ISA / Tax Wrapper',     category: 'personal',    level: 1 },
  { id: 'fire',             label: 'FIRE Movement',         category: 'personal',    level: 1 },
  { id: 'debt-snowball',    label: 'Debt Snowball',         category: 'personal',    level: 1 },
  { id: 'credit-score',     label: 'Credit Score',          category: 'personal',    level: 1 },
  { id: 'net-income',       label: 'Net Income',            category: 'personal',    level: 1 },
  { id: 'expense-ratio',    label: 'Expense Ratio',         category: 'personal',    level: 1 },
];

const CAT_MAP = Object.fromEntries(CATEGORIES.map(c => [c.id, c]));

const LEVEL_META = {
  1: { label: 'Beginner',     color: '#16a34a', bg: 'rgba(22,163,74,0.08)',   dot: '🟢' },
  2: { label: 'Intermediate', color: '#d97706', bg: 'rgba(217,119,6,0.08)',   dot: '🟡' },
  3: { label: 'Advanced',     color: '#dc2626', bg: 'rgba(220,38,38,0.08)',   dot: '🔴' },
};

const STUDY_SETS = [
  { id: 'investing-101', label: 'Investing 101',      emoji: '🎓', terms: ['stock','asset','dividend','compound-interest','diversification','etf','index-fund','dca'] },
  { id: 'stock-deep',    label: 'Stock Deep Dive',    emoji: '📊', terms: ['pe-ratio','eps','market-cap','earnings-call','stock-buyback','beta','alpha','roe'] },
  { id: 'value-invest',  label: 'Value Investing',    emoji: '💎', terms: ['intrinsic-value','pe-ratio','pb-ratio','dcf','book-value','free-cash-flow','moat'] },
  { id: 'options',       label: 'Options Basics',     emoji: '⚙️', terms: ['option','call-option','put-option','strike-price','implied-vol','covered-call','theta-decay'] },
  { id: 'macro-101',     label: 'Macro Fundamentals', emoji: '🌍', terms: ['gdp','cpi','inflation','fed-funds','recession','bull-market','bear-market','yield-curve'] },
  { id: 'personal-fin',  label: 'Personal Finance',   emoji: '💰', terms: ['budget','savings-rate','emergency-fund','compound-interest','roth-ira','fire','expense-ratio'] },
  { id: 'crypto-primer', label: 'Crypto Primer',      emoji: '₿',  terms: ['blockchain','bitcoin','defi','staking','smart-contract','gas-fee','tokenomics'] },
  { id: 'risk',          label: 'Risk Management',    emoji: '🛡️', terms: ['volatility','beta','drawdown','stop-loss','position-sizing','risk-reward','hedge','sharpe-ratio'] },
];

/* Term of the Day — deterministic by calendar day */
function getTermOfDay() {
  const dayIdx = Math.floor(Date.now() / 86400000);
  return TERMS[dayIdx % TERMS.length];
}

/* ═══════════════════════════════════════════════════════════════
   AI RESPONSE PARSER
═══════════════════════════════════════════════════════════════ */
function parseAIResponse(raw) {
  const text = typeof raw === 'string' ? raw : raw?.reply || raw?.message || JSON.stringify(raw);
  try {
    const m = text.match(/\{[\s\S]*\}/);
    if (m) return JSON.parse(m[0]);
  } catch {/* fall through */}
  return { emoji: '📊', rawText: text, definition: text };
}

/* ═══════════════════════════════════════════════════════════════
   STYLED COMPONENTS
═══════════════════════════════════════════════════════════════ */

const shimmer = keyframes`
  0%   { background-position: -300% 0 }
  100% { background-position:  300% 0 }
`;

const fadeUp = keyframes`from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}`;

const Page = styled.div`
  min-height: 100vh;
  background: #e8ecf2;
`;

/* ── Top Header ── */
const Header = styled.div`
  background: linear-gradient(135deg, #0a0f1a 0%, #0f1f14 60%, #0a1a0d 100%);
  padding: calc(64px + 1.75rem) 1.5rem 1.5rem;
  position: relative;
  overflow: hidden;
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    pointer-events: none;
  }
`;

const HeaderTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.75rem;
  position: relative;
  z-index: 1;
`;

const PageTitle = styled.h1`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.6rem;
  font-weight: 800;
  color: #fff;
  margin: 0 0 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.55rem;
`;

const PageSub = styled.p`
  font-size: 0.82rem;
  color: rgba(255,255,255,0.55);
  margin: 0;
`;

const StatsRow = styled.div`
  display: flex;
  gap: 0.65rem;
  flex-wrap: wrap;
  margin-top: 1rem;
  position: relative;
  z-index: 1;
`;

const StatPill = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.85rem;
  border-radius: 99px;
  background: rgba(74,222,128,0.08);
  border: 1px solid rgba(74,222,128,0.2);
  font-size: 0.78rem;
  font-weight: 700;
  color: rgba(255,255,255,0.9);
`;

const ModeToggle = styled.div`
  display: flex;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(74,222,128,0.2);
  border-radius: 99px;
  padding: 3px;
  gap: 2px;
`;

const ModeBtn = styled.button`
  padding: 0.35rem 0.85rem;
  border-radius: 99px;
  border: none;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  background: ${p => p.$active ? '#15803d' : 'transparent'};
  color: ${p => p.$active ? '#fff' : 'rgba(255,255,255,0.55)'};
  display: flex;
  align-items: center;
  gap: 0.3rem;
`;

/* ── Daily Term ── */
const DailySection = styled.div`
  padding: 0 1.25rem;
  max-width: 1280px;
  margin: 1.1rem auto 0;
`;

const DailyCard = styled(motion.div)`
  background: linear-gradient(135deg, rgba(21,128,61,0.07), rgba(74,222,128,0.05));
  border: 1px solid rgba(21,128,61,0.2);
  border-radius: 16px;
  padding: 1rem 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  cursor: pointer;
  transition: box-shadow 0.2s;
  &:hover { box-shadow: 0 4px 20px rgba(21,128,61,0.15); }
`;

const DailyLabel = styled.span`
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #15803d;
  background: rgba(21,128,61,0.1);
  padding: 0.18rem 0.5rem;
  border-radius: 5px;
  white-space: nowrap;
`;

const DailyTerm = styled.span`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.05rem;
  font-weight: 800;
  color: #0f172a;
`;

const DailyDesc = styled.span`
  font-size: 0.8rem;
  color: #64748b;
  flex: 1;
`;

/* ── Study Sets ── */
const StudySetsSection = styled.div`
  padding: 0.85rem 1.25rem 0;
  max-width: 1280px;
  margin: 0 auto;
`;

const SetScroll = styled.div`
  display: flex;
  gap: 0.55rem;
  overflow-x: auto;
  padding-bottom: 0.35rem;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
`;

const SetChip = styled(motion.button)`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 0.95rem;
  border-radius: 10px;
  border: 1.5px solid #e2e8f0;
  background: #fff;
  font-size: 0.8rem;
  font-weight: 700;
  color: #1a2e1a;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
  &:hover { border-color: #15803d; color: #15803d; background: rgba(21,128,61,0.04); }
`;

/* ── Body Grid ── */
const Body = styled.div`
  max-width: 1280px;
  margin: 0.85rem auto 0;
  padding: 0 1.25rem 3rem;
  display: grid;
  grid-template-columns: 288px 1fr;
  gap: 1rem;
  align-items: start;
  @media (max-width: 800px) { grid-template-columns: 1fr; }
`;

/* ── Left Panel ── */
const LeftPanel = styled.div`
  background: #fff;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  position: sticky;
  top: 80px;
  box-shadow: 0 2px 12px rgba(15,23,42,0.05);
`;

const SearchWrap = styled.div`
  padding: 0.7rem 0.8rem 0.55rem;
  border-bottom: 1px solid #f1f5f9;
  position: relative;
`;

const SrchIcon = styled(FaSearch)`
  position: absolute;
  left: 1.4rem;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  font-size: 0.72rem;
  pointer-events: none;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.52rem 0.7rem 0.52rem 2rem;
  border: 1.5px solid #e2e8f0;
  border-radius: 9px;
  font-size: 0.82rem;
  background: #fafbfc;
  color: #0f172a;
  box-sizing: border-box;
  &:focus { outline: none; border-color: #15803d; background: #fff; }
  &::placeholder { color: #94a3b8; }
`;

const FilterRow = styled.div`
  display: flex;
  gap: 0.35rem;
  padding: 0.55rem 0.8rem;
  overflow-x: auto;
  border-bottom: 1px solid #f1f5f9;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
`;

const FilterBtn = styled.button`
  flex-shrink: 0;
  padding: 0.28rem 0.6rem;
  border-radius: 7px;
  border: 1.5px solid ${p => p.$active ? p.$color : '#e2e8f0'};
  background: ${p => p.$active ? p.$color + '14' : 'transparent'};
  color: ${p => p.$active ? p.$color : '#64748b'};
  font-size: 0.7rem;
  font-weight: 700;
  cursor: pointer;
  &:hover { border-color: ${p => p.$color}; color: ${p => p.$color}; }
`;

const LevelRow = styled.div`
  display: flex;
  gap: 0.3rem;
  padding: 0 0.8rem 0.5rem;
`;

const LvlBtn = styled.button`
  flex: 1;
  padding: 0.28rem 0.3rem;
  border-radius: 7px;
  border: 1.5px solid ${p => p.$active ? p.$color : '#e2e8f0'};
  background: ${p => p.$active ? p.$color + '10' : 'transparent'};
  font-size: 0.68rem;
  font-weight: 700;
  color: ${p => p.$active ? p.$color : '#94a3b8'};
  cursor: pointer;
  text-align: center;
`;

const TermsList = styled.div`
  max-height: calc(100vh - 380px);
  overflow-y: auto;
  padding: 0.35rem 0.45rem 0.6rem;
  scrollbar-width: thin;
  scrollbar-color: #e2e8f0 transparent;
  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 4px; }
`;

const TermRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.48rem 0.6rem;
  border-radius: 9px;
  cursor: grab;
  user-select: none;
  transition: all 0.12s;
  border: 1.5px solid transparent;
  opacity: ${p => p.$muted ? 0.38 : 1};
  &:hover { background: #f8fafc; border-color: #e2e8f0; }
  &:active { cursor: grabbing; }
  &.dragging { background: rgba(21,128,61,0.06); border-color: #15803d; }
`;

const GripIco = styled(FaGripVertical)`color:#cbd5e1;font-size:0.7rem;flex-shrink:0;`;
const CatDot  = styled.span`width:6px;height:6px;border-radius:50%;background:${p=>p.$c};flex-shrink:0;`;
const TLabel  = styled.span`font-size:0.8rem;font-weight:600;color:#0f172a;flex:1;`;
const LvlDot  = styled.span`font-size:0.6rem;flex-shrink:0;`;
const ABtn    = styled.button`
  width:18px;height:18px;border-radius:5px;border:1.5px solid #e2e8f0;
  background:#fff;color:#94a3b8;cursor:pointer;
  display:flex;align-items:center;justify-content:center;font-size:0.6rem;
  opacity:0;transition:all 0.12s;flex-shrink:0;
  ${TermRow}:hover & { opacity:1; }
  &:hover{border-color:#15803d;color:#15803d;}
`;
const BookmarkIco = styled.button`
  width:18px;height:18px;border:none;background:none;cursor:pointer;
  color:${p=>p.$on?'#f43f5e':'#cbd5e1'};font-size:0.65rem;
  display:flex;align-items:center;justify-content:center;flex-shrink:0;
  opacity:0;transition:all 0.12s;
  ${TermRow}:hover & { opacity:1; }
  &:hover{color:#f43f5e;}
`;

/* ── Right Panel ── */
const RightPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

/* ── Session Board ── */
const BoardCard = styled.div`
  background: #fff;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 12px rgba(15,23,42,0.05);
  overflow: hidden;
`;

const BoardHead = styled.div`
  padding: 0.8rem 1rem 0.7rem;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const BoardTitle = styled.span`
  font-weight: 800;
  font-size: 0.88rem;
  color: #0f172a;
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;

const BoardHint = styled.span`font-size:0.72rem;color:#94a3b8;font-weight:500;`;

const DropZone = styled.div`
  min-height: 82px;
  padding: 0.75rem 0.9rem;
  margin: 0.65rem 0.9rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  align-items: flex-start;
  align-content: flex-start;
  border: 2px dashed ${p => p.$over ? '#15803d' : '#e2e8f0'};
  border-radius: 12px;
  background: ${p => p.$over ? 'rgba(21,128,61,0.04)' : '#fafbfc'};
  transition: border-color 0.15s, background 0.15s;
`;

const DropPlaceholder = styled.div`
  width: 100%;
  text-align: center;
  color: #94a3b8;
  font-size: 0.78rem;
  padding: 0.85rem 0 0.4rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  pointer-events: none;
`;

const Chip = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.32rem 0.6rem;
  border-radius: 8px;
  background: ${p => p.$c + '12'};
  border: 1.5px solid ${p => p.$c + '28'};
  font-size: 0.78rem;
  font-weight: 700;
  color: ${p => p.$c};
`;

const ChipX = styled.button`
  background:none;border:none;color:${p=>p.$c};opacity:0.45;cursor:pointer;
  padding:0;display:flex;align-items:center;font-size:0.62rem;
  &:hover{opacity:1;}
`;

const ActionRow = styled.div`
  display: flex;
  gap: 0.55rem;
  padding: 0 0.9rem 0.9rem;
  flex-wrap: wrap;
`;

const ExplainBtn = styled(motion.button)`
  flex: 1;
  padding: 0.72rem 1.1rem;
  border: none;
  border-radius: 11px;
  background: ${p => p.$disabled
    ? '#e2e8f0'
    : 'linear-gradient(135deg, #15803d, #166534)'};
  color: ${p => p.$disabled ? '#94a3b8' : '#fff'};
  font-weight: 800;
  font-size: 0.88rem;
  cursor: ${p => p.$disabled ? 'default' : 'pointer'};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  transition: background 0.2s;
  min-width: 140px;
`;

const ClearBtn = styled.button`
  padding: 0.72rem 0.9rem;
  border: 1.5px solid #e2e8f0;
  border-radius: 11px;
  background: #fff;
  color: #94a3b8;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  &:hover { border-color: #dc2626; color: #dc2626; }
`;

/* ── Explanation Card ── */
const ExCard = styled(motion.div)`
  background: #fff;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 12px rgba(15,23,42,0.05);
  overflow: hidden;
`;

const ExHead = styled.div`
  padding: 1rem 1.1rem 0.85rem;
  background: linear-gradient(135deg, rgba(124,58,237,0.04), rgba(14,165,233,0.04));
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  gap: 0.7rem;
`;

const ExEmoji = styled.span`font-size:1.6rem;line-height:1;`;

const ExActions = styled.div`
  margin-left: auto;
  display: flex;
  gap: 0.4rem;
`;

const IconBtn = styled.button`
  padding: 0.35rem 0.6rem;
  border-radius: 7px;
  border: 1.5px solid #e2e8f0;
  background: #fff;
  color: #64748b;
  font-size: 0.72rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-weight: 600;
  transition: all 0.12s;
  &:hover { border-color: #15803d; color: #15803d; }
`;

const ExBody = styled.div`
  padding: 0.95rem 1.1rem;
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
`;

const Section = styled.div`display:flex;flex-direction:column;gap:0.38rem;`;

const SecLabel = styled.div`
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: ${p => p.$c || '#94a3b8'};
  display: flex;
  align-items: center;
  gap: 0.3rem;
`;

const SecText = styled.div`
  font-size: 0.87rem;
  color: #334155;
  line-height: 1.65;
`;

const CompanyList = styled.div`display:flex;flex-direction:column;gap:0.45rem;`;

const CompanyRow = styled.div`
  display: flex;
  gap: 0.55rem;
  align-items: flex-start;
  background: #f8fafc;
  border-radius: 9px;
  padding: 0.45rem 0.7rem;
`;

const CName = styled.span`
  font-weight: 800;
  font-size: 0.8rem;
  color: #0f172a;
  min-width: 75px;
  flex-shrink: 0;
`;

const CDetail = styled.span`font-size:0.78rem;color:#475569;line-height:1.5;`;

const TipBox = styled.div`
  display: flex;
  gap: 0.5rem;
  background: rgba(245,158,11,0.06);
  border: 1px solid rgba(245,158,11,0.18);
  border-radius: 10px;
  padding: 0.6rem 0.8rem;
  font-size: 0.82rem;
  color: #92400e;
  line-height: 1.55;
`;

const RelatedRow = styled.div`display:flex;flex-wrap:wrap;gap:0.38rem;`;

const RelChip = styled.button`
  padding: 0.25rem 0.6rem;
  border-radius: 7px;
  border: 1.5px solid #e2e8f0;
  background: #f8fafc;
  font-size: 0.74rem;
  font-weight: 600;
  color: #475569;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.22rem;
  transition: all 0.12s;
  &:hover { border-color: #15803d; color: #15803d; background: rgba(21,128,61,0.04); }
`;

const MarkLearnedBtn = styled(motion.button)`
  padding: 0.55rem 1.1rem;
  border: 1.5px solid #16a34a;
  border-radius: 9px;
  background: rgba(22,163,74,0.06);
  color: #15803d;
  font-weight: 700;
  font-size: 0.82rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  align-self: flex-start;
`;

/* ── Skeleton ── */
const Skel = styled.div`
  height: ${p=>p.$h||13}px;
  border-radius: 6px;
  width: ${p=>p.$w||'100%'};
  margin-bottom: ${p=>p.$mb||0}px;
  background: linear-gradient(90deg, #f1f5f9 25%, #e9eef4 50%, #f1f5f9 75%);
  background-size: 300% 100%;
  animation: ${shimmer} 1.6s ease-in-out infinite;
`;

/* ── History ── */
const HistCard = styled.div`
  background: #fff;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 12px rgba(15,23,42,0.05);
  overflow: hidden;
`;

const HistHead = styled.div`
  padding: 0.72rem 1rem 0.6rem;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const HistTitle = styled.span`
  font-weight: 700;
  font-size: 0.82rem;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 0.35rem;
`;

const HistRow = styled.button`
  width: 100%;
  text-align: left;
  padding: 0.52rem 1rem;
  border: none;
  background: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.79rem;
  font-weight: 600;
  color: #475569;
  border-bottom: 1px solid #f8fafc;
  transition: background 0.1s;
  &:hover { background: #f8fafc; color: #0f172a; }
  &:last-child { border-bottom: none; }
`;

const TimeLabel = styled.span`
  font-size: 0.68rem;
  color: #94a3b8;
  margin-left: auto;
  font-weight: 500;
  flex-shrink: 0;
`;

/* ── XP Ring ── */
const bounce = keyframes`0%,80%,100%{transform:scale(.5);opacity:.5}40%{transform:scale(1);opacity:1}`;
const ThinkDot = styled.span`
  width: 9px; height: 9px; border-radius: 50%; background: #27c46b; display: inline-block;
  animation: ${bounce} 1.1s ${p => p.$i * 0.15}s infinite ease-in-out;
`;

/* ── Quiz ── */
const QuizWrap = styled.div`
  margin-top: 1rem;
  background: #fafaf7;
  border: 1px solid #e8e6dd;
  border-radius: 12px;
  padding: 1.1rem 1.25rem;
`;
const QuizQ = styled.div`font-size: 0.87rem; font-weight: 700; color: #0a0f14; margin-bottom: 0.65rem;`;
const QuizGrid = styled.div`display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-bottom: 0.75rem;`;
const QuizOpt = styled.button`
  text-align: left;
  padding: 0.6rem 0.75rem;
  border-radius: 8px;
  border: 1.5px solid ${p => p.$bd || '#e8e6dd'};
  background: ${p => p.$bg || '#fff'};
  color: ${p => p.$fg || '#0a0f14'};
  font-size: 0.82rem;
  font-weight: 500;
  cursor: ${p => p.$done ? 'default' : 'pointer'};
  font-family: inherit;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.35rem;
  transition: border-color 0.12s;
  &:hover { border-color: ${p => p.$done ? 'inherit' : '#0e5148'}; }
`;

/* ── Progress view ── */
const ProgSection = styled.div`padding: 1.25rem;`;
const ProgCatRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.55rem 0;
  border-bottom: 1px solid #f1f5f9;
  &:last-child { border-bottom: none; }
`;
const XpBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  background: rgba(109,90,224,0.08);
  border: 1px solid rgba(109,90,224,0.2);
  border-radius: 99px;
  padding: 0.28rem 0.7rem;
  font-size: 0.75rem;
  font-weight: 800;
  color: #6d5ae0;
`;

/* ── Auth Gate ── */
const AuthGatePage = styled.div`
  min-height: 100vh;
  background: #0a0f1a;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1.5rem;
`;

const AuthGateCard = styled(motion.div)`
  background: #0f1a0f;
  border: 1px solid rgba(74,222,128,0.2);
  border-radius: 24px;
  padding: 3rem 2.5rem;
  text-align: center;
  max-width: 440px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0,0,0,0.4);
`;

const AuthGateLockIcon = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(21,128,61,0.12);
  border: 1.5px solid rgba(74,222,128,0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  font-size: 1.5rem;
  color: #4ade80;
`;

const AuthGateTitle = styled.h2`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.6rem;
  font-weight: 800;
  color: #fff;
  margin: 0 0 0.6rem;
`;

const AuthGateSub = styled.p`
  font-size: 0.92rem;
  color: rgba(255,255,255,0.55);
  margin: 0 0 2rem;
  line-height: 1.6;
`;

const AuthGateBtn = styled(motion.a)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.85rem 2rem;
  background: linear-gradient(135deg, #15803d, #166534);
  color: #fff;
  font-weight: 800;
  font-size: 0.95rem;
  border-radius: 12px;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: opacity 0.2s;
  &:hover { opacity: 0.9; }
`;

const AuthGateFeatures = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  margin-top: 1.75rem;
  text-align: left;
`;

const AuthFeatureRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.82rem;
  color: rgba(255,255,255,0.6);
`;

/* ── Flashcard Mode ── */
const FlashWrap = styled.div`
  max-width: 560px;
  margin: 0 auto;
`;

const FlashCard = styled(motion.div)`
  background: #fff;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 8px 40px rgba(15,23,42,0.1);
  min-height: 260px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  user-select: none;
  perspective: 1000px;
  margin-bottom: 1rem;
`;

const FlashTerm = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.6rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 0.5rem;
`;

const FlashHint = styled.div`
  font-size: 0.8rem;
  color: #94a3b8;
  margin-top: 1rem;
`;

const FlashDef = styled.div`
  font-size: 0.9rem;
  color: #334155;
  line-height: 1.65;
`;

const FlashNav = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const NavCircleBtn = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1.5px solid #e2e8f0;
  background: #fff;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.85rem;
  &:hover { border-color: #7c3aed; color: #7c3aed; }
  &:disabled { opacity: 0.3; cursor: default; }
`;

const FlashProgress = styled.div`
  font-size: 0.8rem;
  color: #94a3b8;
  font-weight: 600;
`;

const KnowBtns = styled.div`
  display: flex;
  gap: 0.6rem;
  justify-content: center;
  margin-top: 0.5rem;
`;

const KnowBtn = styled.button`
  padding: 0.55rem 1.25rem;
  border-radius: 10px;
  border: 1.5px solid ${p => p.$yes ? '#16a34a' : '#dc2626'};
  background: ${p => p.$yes ? 'rgba(22,163,74,0.07)' : 'rgba(220,38,38,0.07)'};
  color: ${p => p.$yes ? '#15803d' : '#b91c1c'};
  font-weight: 700;
  font-size: 0.82rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.35rem;
`;

/* ═══════════════════════════════════════════════════════════════
   SUB-COMPONENTS
═══════════════════════════════════════════════════════════════ */

function ExplanationDisplay({ data, termLabels, learnedIds, onMarkLearned, onAddRelated, onCopy, onQuizComplete }) {
  if (!data) return null;
  const title = termLabels.length > 1 ? termLabels.join(' vs ') : termLabels[0];
  const isMultiTerm = Array.isArray(termLabels) && termLabels.length > 1;
  const termId = !isMultiTerm
    ? TERMS.find(t => t.label === termLabels[0])?.id
    : null;
  const isLearned = termId && learnedIds.includes(termId);

  return (
    <ExCard initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <ExHead>
        <ExEmoji>{data.emoji || '📊'}</ExEmoji>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, fontSize: '1.02rem', color: '#0f172a' }}>{title}</div>
          <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: 2 }}>AI-generated · For learning only · Not financial advice</div>
        </div>
        <ExActions>
          <IconBtn onClick={onCopy} title="Copy explanation">
            <FaCopy /> Copy
          </IconBtn>
          {termId && !isLearned && (
            <MarkLearnedBtn
              onClick={() => onMarkLearned(termId)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              <FaGraduationCap /> Mark Learned
            </MarkLearnedBtn>
          )}
          {isLearned && (
            <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
              <FaCheckCircle /> Learned
            </span>
          )}
        </ExActions>
      </ExHead>

      <ExBody>
        {data.rawText && !data.definition ? (
          <SecText style={{ whiteSpace: 'pre-line' }}>{data.rawText}</SecText>
        ) : (
          <>
            {data.definition && (
              <Section>
                <SecLabel $c="#7c3aed"><FaBook /> Definition</SecLabel>
                <SecText>{data.definition}</SecText>
              </Section>
            )}
            {data.scenario && (
              <Section>
                <SecLabel $c="#16a34a"><FaChartLine /> Real-World Scenario</SecLabel>
                <SecText>{data.scenario}</SecText>
              </Section>
            )}
            {data.companies?.length > 0 && (
              <Section>
                <SecLabel $c="#0284c7"><FaBuilding /> Company Examples</SecLabel>
                <CompanyList>
                  {data.companies.map((c, i) => (
                    <CompanyRow key={i}>
                      <CName>{typeof c === 'string' ? c : c.name}</CName>
                      {typeof c === 'object' && c.example && <CDetail>{c.example}</CDetail>}
                    </CompanyRow>
                  ))}
                </CompanyList>
              </Section>
            )}
            {data.proTip && (
              <TipBox>
                <FaLightbulb style={{ color: '#f59e0b', flexShrink: 0, marginTop: 2 }} />
                <div><strong>Pro Tip:</strong> {data.proTip}</div>
              </TipBox>
            )}
            {data.relatedTerms?.length > 0 && (
              <Section>
                <SecLabel $c="#94a3b8"><FaArrowRight /> Learn Next</SecLabel>
                <RelatedRow>
                  {data.relatedTerms.map(t => (
                    <RelChip key={t} onClick={() => onAddRelated(t)}>
                      {t} <FaChevronRight style={{ fontSize: '0.58rem' }} />
                    </RelChip>
                  ))}
                </RelatedRow>
              </Section>
            )}
            {data.quiz?.length > 0 && (
              <QuizBlock quiz={data.quiz} terms={termLabels} onComplete={onQuizComplete} />
            )}
          </>
        )}
      </ExBody>
    </ExCard>
  );
}

function SkeletonCard() {
  return (
    <ExCard initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <ExHead>
        <div style={{ width: 44, height: 44, borderRadius: 10, background: '#f1f5f9' }} />
        <div style={{ flex: 1 }}>
          <Skel $h={15} $w="40%" $mb={6} />
          <Skel $h={9} $w="28%" />
        </div>
      </ExHead>
      <ExBody>
        {[['80%','65%','90%'], ['70%','88%'], ['55%','78%','60%']].map((ws, i) => (
          <Section key={i}>
            <Skel $h={8} $w="20%" $mb={7} />
            {ws.map((w, j) => <Skel key={j} $h={12} $w={w} $mb={5} />)}
          </Section>
        ))}
      </ExBody>
    </ExCard>
  );
}

/* ── AI Thinking Steps ── */
const THINK_STEPS = ['Reading the term…', 'Pulling real-world examples…', 'Writing your lesson…', 'Building your quiz…'];
function ThinkingState({ names }) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setStep(s => Math.min(s + 1, THINK_STEPS.length - 1)), 750);
    return () => clearInterval(t);
  }, []);
  return (
    <ExCard initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ padding: '2.5rem 1.5rem', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', gap: 6, marginBottom: 18 }}>
          {[0, 1, 2].map(i => <ThinkDot key={i} $i={i} />)}
        </div>
        <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0a0f14', marginBottom: 6 }}>Tutoring {names}</div>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.78rem', color: '#6b6960' }}>{THINK_STEPS[step]}</div>
      </div>
    </ExCard>
  );
}

/* ── Quiz Component ── */
function QuizBlock({ quiz, terms, onComplete }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const score = quiz.reduce((s, q, i) => s + (answers[i] === q.answer ? 1 : 0), 0);
  const allAnswered = quiz.every((_, i) => answers[i] != null);

  return (
    <QuizWrap>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <FaBrain style={{ color: '#0e5148', fontSize: '0.85rem' }} />
        <span style={{ fontWeight: 800, fontSize: '0.88rem', color: '#0a0f14' }}>Quick Check</span>
        {submitted && (
          <span style={{ marginLeft: 'auto', fontSize: '0.75rem', fontWeight: 700,
            color: score === quiz.length ? '#15803d' : score >= quiz.length/2 ? '#d97706' : '#dc2626',
            background: score === quiz.length ? 'rgba(21,128,61,0.08)' : 'rgba(217,119,6,0.08)',
            border: '1px solid', borderRadius: 99, padding: '0.2rem 0.6rem' }}>
            {score}/{quiz.length} correct
          </span>
        )}
      </div>
      {quiz.map((q, qi) => (
        <div key={qi} style={{ marginBottom: '1rem' }}>
          <QuizQ>{qi + 1}. {q.prompt}</QuizQ>
          <QuizGrid>
            {q.options.map(opt => {
              const chosen  = answers[qi] === opt;
              const correct = opt === q.answer;
              let bd = '#e8e6dd', bg = '#fff', fg = '#0a0f14';
              if (submitted) {
                if (correct) { bd = '#c8e6d3'; bg = '#e8f6ee'; fg = '#0e7a45'; }
                else if (chosen) { bd = '#e6c8c8'; bg = '#f7e4e4'; fg = '#c44141'; }
              } else if (chosen) { bd = '#0e5148'; bg = '#e3ecea'; }
              return (
                <QuizOpt key={opt} $bd={bd} $bg={bg} $fg={fg} $done={submitted}
                  disabled={submitted} onClick={() => !submitted && setAnswers(a => ({ ...a, [qi]: opt }))}>
                  {opt}
                  {submitted && correct && <FaCheck style={{ fontSize: '0.65rem', flexShrink: 0 }} />}
                  {submitted && chosen && !correct && <FaTimes style={{ fontSize: '0.65rem', flexShrink: 0 }} />}
                </QuizOpt>
              );
            })}
          </QuizGrid>
        </div>
      ))}
      {!submitted ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <motion.button
            onClick={() => { setSubmitted(true); onComplete(score, quiz.length, terms); }}
            disabled={!allAnswered}
            style={{
              padding: '0.6rem 1.2rem', border: 'none', borderRadius: 9,
              background: allAnswered ? '#0e5148' : '#e8e6dd', color: allAnswered ? '#fff' : '#9ca3af',
              fontWeight: 700, fontSize: '0.84rem', cursor: allAnswered ? 'pointer' : 'default', fontFamily: 'inherit',
            }}
            whileHover={allAnswered ? { scale: 1.02 } : {}}
            whileTap={allAnswered ? { scale: 0.97 } : {}}
          >
            Submit answers
          </motion.button>
          {!allAnswered && <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Answer all {quiz.length} to submit</span>}
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          <XpBadge>+{score * 10} XP earned</XpBadge>
          {score === quiz.length && (
            <span style={{ fontSize: '0.8rem', color: '#15803d', fontWeight: 700 }}>
              Perfect score — terms marked as learned ✓
            </span>
          )}
        </div>
      )}
    </QuizWrap>
  );
}

/* ── Progress View ── */
const CATS_FOR_PROGRESS = [
  { id: 'basics', label: 'Basics', icon: '📌' },
  { id: 'stocks', label: 'Stocks', icon: '📈' },
  { id: 'valuation', label: 'Valuation', icon: '🔬' },
  { id: 'bonds', label: 'Bonds', icon: '🏛️' },
  { id: 'portfolio', label: 'Portfolio', icon: '💼' },
  { id: 'macro', label: 'Macro', icon: '🌍' },
  { id: 'derivatives', label: 'Derivatives', icon: '⚙️' },
  { id: 'crypto', label: 'Crypto', icon: '🔗' },
  { id: 'personal', label: 'Personal Finance', icon: '💰' },
];

function ProgressView({ learnedIds, dbHistory, xp, streak, level }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* XP overview */}
      <BoardCard>
        <BoardHead>
          <BoardTitle><FaTrophy style={{ color: '#d97706' }} /> Your Progress</BoardTitle>
          <XpBadge>{xp} XP · Level {level}</XpBadge>
        </BoardHead>
        <ProgSection>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
            {[
              { label: 'Total XP', val: xp, color: '#6d5ae0', icon: '⭐' },
              { label: 'Level', val: level, color: '#d97706', icon: '🏆' },
              { label: 'Streak', val: `${streak}d`, color: '#dc2626', icon: '🔥' },
              { label: 'Learned', val: learnedIds.length, color: '#15803d', icon: '🎓' },
              { label: 'Sessions', val: dbHistory.length, color: '#0284c7', icon: '📚' },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '1.35rem', fontWeight: 800, color: s.color }}>{s.icon} {s.val}</div>
                <div style={{ fontSize: '0.7rem', color: '#6b6960', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{s.label}</div>
              </div>
            ))}
          </div>
          {/* Level progress */}
          <div style={{ marginBottom: '0.3rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#6b6960' }}>
            <span>Level {level} → {level + 1}</span>
            <span>{xp % 100}/100 XP</span>
          </div>
          <div style={{ height: 8, background: '#f1f5f9', borderRadius: 99, overflow: 'hidden' }}>
            <motion.div style={{ height: '100%', background: '#6d5ae0', borderRadius: 99 }}
              initial={{ width: 0 }} animate={{ width: `${xp % 100}%` }} transition={{ duration: 0.8 }} />
          </div>
        </ProgSection>
      </BoardCard>

      {/* Mastery by category */}
      <BoardCard>
        <BoardHead>
          <BoardTitle><FaLayerGroup style={{ color: '#15803d' }} /> Mastery by Category</BoardTitle>
        </BoardHead>
        <ProgSection style={{ paddingTop: '0.5rem' }}>
          {CATS_FOR_PROGRESS.map(cat => {
            const total   = TERMS.filter(t => t.category === cat.id).length;
            const learned = TERMS.filter(t => t.category === cat.id && learnedIds.includes(t.id)).length;
            const p = total > 0 ? Math.round((learned / total) * 100) : 0;
            return (
              <ProgCatRow key={cat.id}>
                <span style={{ fontSize: '1rem', width: 22 }}>{cat.icon}</span>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0a0f14', width: 110, flexShrink: 0 }}>{cat.label}</span>
                <div style={{ flex: 1, height: 7, background: '#f1f5f9', borderRadius: 99, overflow: 'hidden' }}>
                  <motion.div style={{ height: '100%', background: '#15803d', borderRadius: 99 }}
                    initial={{ width: 0 }} animate={{ width: `${p}%` }} transition={{ duration: 0.7 }} />
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6b6960', width: 55, textAlign: 'right' }}>
                  {learned}/{total}
                </span>
              </ProgCatRow>
            );
          })}
        </ProgSection>
      </BoardCard>

      {/* Session history */}
      {dbHistory.length > 0 && (
        <HistCard>
          <HistHead>
            <HistTitle><FaHistory /> All Sessions ({dbHistory.length})</HistTitle>
          </HistHead>
          {dbHistory.map(h => (
            <HistRow key={h.id}>
              <FaStar style={{ color: '#d97706', fontSize: '0.65rem', flexShrink: 0 }} />
              <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {h.term_labels || (Array.isArray(h.terms) ? h.terms.join(', ') : h.terms)}
              </span>
              <TimeLabel>{timeAgo(h.created_at)}</TimeLabel>
            </HistRow>
          ))}
        </HistCard>
      )}
    </div>
  );
}

function FlashcardMode({ terms, learnedIds, onMarkLearned }) {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState([]);
  const [unknown, setUnknown] = useState([]);

  const current = terms[idx];
  if (!current) return <div style={{ textAlign: 'center', color: '#94a3b8', padding: '3rem' }}>No terms in this set.</div>;

  const cat = CAT_MAP[current.category];
  const lm  = LEVEL_META[current.level];
  const isLearned = learnedIds.includes(current.id);

  const next = () => { setFlipped(false); setTimeout(() => setIdx(i => Math.min(i + 1, terms.length - 1)), 100); };
  const prev = () => { setFlipped(false); setTimeout(() => setIdx(i => Math.max(i - 1, 0)), 100); };

  const handleKnow = (yes) => {
    if (yes) {
      setKnown(k => [...k, current.id]);
      onMarkLearned(current.id);
    } else {
      setUnknown(u => [...u, current.id]);
    }
    if (idx < terms.length - 1) next();
  };

  return (
    <FlashWrap>
      <FlashNav>
        <NavCircleBtn onClick={prev} disabled={idx === 0}><FaChevronLeft /></NavCircleBtn>
        <FlashProgress>{idx + 1} / {terms.length} · ✅ {known.length} known · ❌ {unknown.length} unsure</FlashProgress>
        <NavCircleBtn onClick={next} disabled={idx === terms.length - 1}><FaChevronRight /></NavCircleBtn>
      </FlashNav>

      <AnimatePresence mode="wait">
        <FlashCard
          key={current.id + flipped}
          onClick={() => setFlipped(f => !f)}
          initial={{ opacity: 0, rotateY: flipped ? -90 : 90 }}
          animate={{ opacity: 1, rotateY: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {!flipped ? (
            <>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, background: cat?.color + '14', color: cat?.color, padding: '0.2rem 0.55rem', borderRadius: 6 }}>{cat?.label}</span>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, background: lm?.bg, color: lm?.color, padding: '0.2rem 0.55rem', borderRadius: 6 }}>{lm?.label}</span>
                {isLearned && <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#16a34a' }}>✓ Learned</span>}
              </div>
              <FlashTerm>{current.label}</FlashTerm>
              <FlashHint>Tap to reveal definition</FlashHint>
            </>
          ) : (
            <>
              <FlashTerm style={{ fontSize: '1rem', marginBottom: '1rem' }}>{current.label}</FlashTerm>
              <FlashDef>Tap the buttons below to mark how well you know this term. Or tap the card to flip back.</FlashDef>
            </>
          )}
        </FlashCard>
      </AnimatePresence>

      {flipped && (
        <KnowBtns>
          <KnowBtn onClick={() => handleKnow(false)}><FaTimes /> Not yet</KnowBtn>
          <KnowBtn $yes onClick={() => handleKnow(true)}><FaCheck /> Got it!</KnowBtn>
        </KnowBtns>
      )}
    </FlashWrap>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════ */

function timeAgo(iso) {
  const secs = Math.floor((Date.now() - new Date(iso)) / 1000);
  if (secs < 60)   return 'just now';
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400)return `${Math.floor(secs / 3600)}h ago`;
  return `${Math.floor(secs / 86400)}d ago`;
}

export default function GlossaryPage() {
  const { user } = useAuth();

  /* XP / streak (localStorage) */
  const [xp,     setXp]     = useLocalState('bv_xp', 0);
  const [streak, setStreak] = useLocalState('bv_streak', { count: 0, last: '' });
  const level = Math.floor(xp / 100) + 1;
  const today = todayStr();
  const yest  = yesterStr();
  const streakCount = (streak.last === today || streak.last === yest) ? streak.count : 0;

  const addXp = useCallback((n) => setXp(x => x + n), [setXp]);
  const touchStreak = useCallback(() => setStreak(s => {
    if (s.last === today) return s;
    if (s.last === yest)  return { count: s.count + 1, last: today };
    return { count: 1, last: today };
  }), [setStreak, today, yest]);

  const [mode,       setMode]      = useState('learn');   // 'learn' | 'flashcard' | 'progress'
  const [search,     setSearch]    = useState('');
  const [activeCat,  setActiveCat] = useState('all');
  const [activeLevel,setActiveLevel]= useState(0);        // 0 = all
  const [session,    setSession]   = useState([]);
  const [isOver,     setIsOver]    = useState(false);
  const [loading,    setLoading]   = useState(false);
  const [result,     setResult]    = useState(null);
  const [resultTerms,setResultTerms]=useState([]);
  const [error,      setError]     = useState(null);
  const [copied,     setCopied]    = useState(false);
  // DB state
  const [dbHistory,  setDbHistory] = useState([]);
  const [bookmarks,  setBookmarks] = useState([]);   // term ids
  const [learnedIds, setLearnedIds]= useState([]);
  const [flashSet,   setFlashSet]  = useState(null);  // array of TERMS for flashcard mode
  const dragOverRef = useRef(false);

  /* Load DB data on mount */
  useEffect(() => {
    Promise.allSettled([
      api.getGlossaryHistory().then(d => setDbHistory(d.items || [])).catch(() => {}),
      api.getGlossaryBookmarks().then(d => setBookmarks((d.bookmarks || []).map(b => b.term_id))).catch(() => {}),
      api.getGlossaryLearned().then(d => setLearnedIds(d.learnedIds || [])).catch(() => {}),
    ]);
  }, []);

  /* Filtered terms */
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return TERMS.filter(t =>
      (activeCat === 'all' || t.category === activeCat) &&
      (activeLevel === 0    || t.level === activeLevel) &&
      (!q || t.label.toLowerCase().includes(q))
    );
  }, [search, activeCat, activeLevel]);

  /* Stats */
  const learnedCount = learnedIds.length;
  const totalTerms   = TERMS.length;
  const bookmarkCount = bookmarks.length;

  /* Term of Day */
  const termOfDay = useMemo(getTermOfDay, []);

  /* Drag */
  const onDragStart = useCallback((e, id) => {
    e.dataTransfer.setData('termId', id);
    e.dataTransfer.effectAllowed = 'copy';
  }, []);

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    if (!dragOverRef.current) { dragOverRef.current = true; setIsOver(true); }
  }, []);

  const onDragLeave = useCallback(() => { dragOverRef.current = false; setIsOver(false); }, []);

  const onDrop = useCallback((e) => {
    e.preventDefault(); dragOverRef.current = false; setIsOver(false);
    const id = e.dataTransfer.getData('termId');
    if (id && !session.includes(id)) setSession(s => [...s, id]);
  }, [session]);

  const addTerm = useCallback((id) => {
    if (!session.includes(id)) setSession(s => [...s, id]);
  }, [session]);

  const removeTerm = useCallback((id) => setSession(s => s.filter(x => x !== id)), []);

  const addRelated = useCallback((label) => {
    const t = TERMS.find(x => x.label.toLowerCase() === label.toLowerCase())
           || TERMS.find(x => x.label.toLowerCase().includes(label.toLowerCase()));
    if (t && !session.includes(t.id)) setSession(s => [...s, t.id]);
  }, [session]);

  /* Bookmarks */
  const toggleBookmark = useCallback(async (term) => {
    const isOn = bookmarks.includes(term.id);
    setBookmarks(b => isOn ? b.filter(x => x !== term.id) : [...b, term.id]);
    if (isOn) {
      await api.deleteGlossaryBookmark(term.id).catch(() => {});
    } else {
      await api.saveGlossaryBookmark(term.id, term.label, term.category).catch(() => {});
    }
  }, [bookmarks]);

  /* Mark learned */
  const markLearned = useCallback(async (termId) => {
    if (!learnedIds.includes(termId)) {
      setLearnedIds(l => [...l, termId]);
      addXp(15); touchStreak();
      await api.markGlossaryLearned(termId).catch(() => {});
    }
  }, [learnedIds, addXp, touchStreak]);

  /* Quiz complete */
  const handleQuizComplete = useCallback((score, total, terms) => {
    addXp(score * 10); touchStreak();
    if (terms.length === 1 && score === total) {
      const t = TERMS.find(x => x.label === terms[0]);
      if (t) markLearned(t.id);
    }
  }, [addXp, touchStreak, markLearned]);

  /* Explain */
  const explain = useCallback(async () => {
    if (!session.length) return;
    const termObjs = session.map(id => TERMS.find(t => t.id === id)).filter(Boolean);
    const labels   = termObjs.map(t => t.label);
    setLoading(true); setResult(null); setError(null);

    const isMulti = labels.length > 1;
    const quizInstr = `,"quiz":[{"prompt":"Question 1?","options":["A","B","C","D"],"answer":"A"},{"prompt":"Question 2?","options":["A","B","C","D"],"answer":"C"}]`;
    const prompt = isMulti
      ? `You are a financial education AI. Compare and explain these financial terms for a beginner: ${labels.join(', ')}.
Return ONLY valid JSON:
{"emoji":"fitting emoji","definition":"How these terms relate and differ — 3-4 sentences","scenario":"One scenario with real numbers showing all terms in context","companies":[{"name":"Company","example":"How they illustrate these concepts"}],"proTip":"One insight connecting these terms that beginners miss","relatedTerms":["term1","term2","term3"]${quizInstr}}`
      : `You are a financial education AI. Explain "${labels[0]}" to a beginner investor in plain English.
Return ONLY valid JSON:
{"emoji":"fitting emoji","definition":"2-3 sentence plain English definition","scenario":"Concrete scenario with actual numbers","companies":[{"name":"Company","example":"How this term applies to them specifically"}],"proTip":"One insight most beginners miss","relatedTerms":["term1","term2","term3"]${quizInstr}}
Only output the JSON. No other text.`;

    try {
      const raw    = await api.chat(prompt);
      const parsed = parseAIResponse(raw);
      setResult(parsed);
      setResultTerms(labels);
      addXp(5); touchStreak();
      // save to DB in background
      api.saveGlossaryHistory(
        session,
        parsed,
        labels.join(', ')
      ).then(() => {
        api.getGlossaryHistory().then(d => setDbHistory(d.items || [])).catch(() => {});
      }).catch(() => {});
    } catch {
      setError("Couldn't reach the AI. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, [session]);

  const handleCopy = useCallback(() => {
    if (!result) return;
    const text = [
      resultTerms.join(' / '),
      result.definition,
      result.scenario ? `\nScenario: ${result.scenario}` : '',
      result.proTip   ? `\nPro Tip: ${result.proTip}`    : '',
    ].join('\n');
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }, [result, resultTerms]);

  /* Load study set into session / flashcard */
  const loadSet = useCallback((set) => {
    const ids = set.terms.filter(id => TERMS.find(t => t.id === id));
    if (mode === 'flashcard') {
      setFlashSet(ids.map(id => TERMS.find(t => t.id === id)).filter(Boolean));
    } else {
      setSession(ids);
    }
  }, [mode]);

  /* Restore from DB history */
  const restoreHistory = useCallback((item) => {
    try {
      const parsed = typeof item.ai_response === 'string' ? JSON.parse(item.ai_response) : item.ai_response;
      setResult(parsed);
      setResultTerms((item.term_labels || '').split(', '));
      const ids = (item.terms || []).filter(id => TERMS.find(t => t.id === id));
      setSession(ids);
    } catch {/* ignore */}
  }, []);

  const deleteHistory = useCallback(async (e, id) => {
    e.stopPropagation();
    setDbHistory(h => h.filter(x => x.id !== id));
    await api.deleteGlossaryHistory(id).catch(() => {});
  }, []);

  const sessionTermObjs = session.map(id => TERMS.find(t => t.id === id)).filter(Boolean);

  const flashTerms = flashSet
    || (activeCat !== 'all'
      ? TERMS.filter(t => t.category === activeCat)
      : TERMS.filter(t => t.level === (activeLevel || 1)));

  if (!user) {
    return (
      <AuthGatePage>
        <AuthGateCard
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <AuthGateLockIcon><FaLock /></AuthGateLockIcon>
          <AuthGateTitle>Sign in to access AI Tutor</AuthGateTitle>
          <AuthGateSub>
            Get AI-powered lessons on any financial term — drag, drop, and learn with real-world scenarios and company examples.
          </AuthGateSub>
          <AuthGateBtn href="/auth" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
            <FaRobot /> Sign in to start learning
          </AuthGateBtn>
          <AuthGateFeatures>
            {[
              '130+ financial terms with AI explanations',
              'Real-world scenarios & company examples',
              'Flashcard mode & study sets',
              'Track your learning progress',
            ].map(f => (
              <AuthFeatureRow key={f}>
                <FaCheck style={{ color: '#4ade80', flexShrink: 0, fontSize: '0.7rem' }} />
                {f}
              </AuthFeatureRow>
            ))}
          </AuthGateFeatures>
        </AuthGateCard>
      </AuthGatePage>
    );
  }

  return (
    <Page>
      {/* ── Header ── */}
      <Header>
        <HeaderTop>
          <div>
            <PageTitle><FaRobot /> Financial AI Tutor</PageTitle>
            <PageSub>Learn every financial term — drag to your board, get AI-powered lessons with real examples</PageSub>
          </div>
          <ModeToggle>
            <ModeBtn $active={mode === 'learn'}     onClick={() => setMode('learn')}><FaBook /> Learn</ModeBtn>
            <ModeBtn $active={mode === 'flashcard'} onClick={() => setMode('flashcard')}><FaSync /> Cards</ModeBtn>
            <ModeBtn $active={mode === 'progress'}  onClick={() => setMode('progress')}><FaTrophy /> Progress</ModeBtn>
          </ModeToggle>
        </HeaderTop>
        <StatsRow>
          <StatPill><FaGraduationCap style={{ color: '#4ade80' }} /> {learnedCount}/{totalTerms} Learned</StatPill>
          <StatPill><FaFire style={{ color: '#fb923c' }} /> {streakCount}d Streak</StatPill>
          <StatPill><FaTrophy style={{ color: '#fbbf24' }} /> Lvl {level} · {xp} XP</StatPill>
          <StatPill><FaHistory style={{ color: '#7dd3fc' }} /> {dbHistory.length} Sessions</StatPill>
        </StatsRow>
      </Header>

      {/* ── Term of the Day ── */}
      <DailySection>
        <DailyCard
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => { addTerm(termOfDay.id); setMode('learn'); }}
        >
          <span style={{ fontSize: '1.3rem' }}>{CAT_MAP[termOfDay.category]?.icon}</span>
          <DailyLabel>⭐ Term of the Day</DailyLabel>
          <DailyTerm>{termOfDay.label}</DailyTerm>
          <DailyDesc>{LEVEL_META[termOfDay.level]?.dot} {LEVEL_META[termOfDay.level]?.label} · {CAT_MAP[termOfDay.category]?.label}</DailyDesc>
          <span style={{ marginLeft: 'auto', fontSize: '0.8rem', fontWeight: 700, color: '#15803d', display: 'flex', alignItems: 'center', gap: 4 }}>
            Add &amp; Learn <FaArrowRight />
          </span>
        </DailyCard>
      </DailySection>

      {/* ── Study Sets ── */}
      <StudySetsSection>
        <div style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '0.45rem' }}>
          STUDY SETS
        </div>
        <SetScroll>
          {STUDY_SETS.map(s => (
            <SetChip
              key={s.id}
              onClick={() => loadSet(s)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              {s.emoji} {s.label}
              <span style={{ background: '#f1f5f9', borderRadius: 5, padding: '0.1rem 0.4rem', fontSize: '0.67rem', color: '#64748b', fontWeight: 700 }}>
                {s.terms.length}
              </span>
            </SetChip>
          ))}
        </SetScroll>
      </StudySetsSection>

      {/* ── Progress view (full width) ── */}
      {mode === 'progress' && (
        <div style={{ maxWidth: 1280, margin: '1rem auto', padding: '0 1.25rem 3rem' }}>
          <ProgressView learnedIds={learnedIds} dbHistory={dbHistory} xp={xp} streak={streakCount} level={level} />
        </div>
      )}

      {/* ── Body ── */}
      {mode !== 'progress' && <Body>
        {/* Left: Term List */}
        <LeftPanel>
          <SearchWrap>
            <SrchIcon />
            <SearchInput
              placeholder={`Search ${TERMS.length} terms…`}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </SearchWrap>

          <FilterRow>
            {CATEGORIES.map(c => (
              <FilterBtn
                key={c.id}
                $active={activeCat === c.id}
                $color={c.color}
                onClick={() => setActiveCat(c.id)}
              >
                {c.icon} {c.label}
              </FilterBtn>
            ))}
          </FilterRow>

          <LevelRow>
            {[[0, 'All levels', '#64748b'], [1, '🟢 Beginner', '#16a34a'], [2, '🟡 Intermediate', '#d97706'], [3, '🔴 Advanced', '#dc2626']].map(([lvl, lbl, col]) => (
              <LvlBtn key={lvl} $active={activeLevel === lvl} $color={col} onClick={() => setActiveLevel(lvl)}>
                {lbl}
              </LvlBtn>
            ))}
          </LevelRow>

          <TermsList>
            {filtered.length === 0 && <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.8rem', padding: '1.25rem 1rem' }}>No terms match your filters</div>}
            {filtered.map(term => {
              const cat   = CAT_MAP[term.category];
              const added = session.includes(term.id);
              const bked  = bookmarks.includes(term.id);
              const lrnd  = learnedIds.includes(term.id);
              return (
                <TermRow
                  key={term.id}
                  draggable
                  onDragStart={e => onDragStart(e, term.id)}
                  $muted={added}
                >
                  <GripIco />
                  <CatDot $c={cat?.color || '#94a3b8'} />
                  <TLabel>{term.label}</TLabel>
                  {lrnd && <span style={{ fontSize: '0.6rem', color: '#16a34a' }}>✓</span>}
                  <LvlDot title={LEVEL_META[term.level]?.label}>{LEVEL_META[term.level]?.dot}</LvlDot>
                  <BookmarkIco $on={bked} onClick={e => { e.stopPropagation(); toggleBookmark(term); }}>
                    {bked ? <FaHeart /> : <FaRegHeart />}
                  </BookmarkIco>
                  {!added && (
                    <ABtn onClick={() => addTerm(term.id)} title="Add to board">
                      <FaPlus />
                    </ABtn>
                  )}
                </TermRow>
              );
            })}
          </TermsList>
        </LeftPanel>

        {/* Right */}
        <RightPanel>
          {mode === 'flashcard' ? (
            <BoardCard>
              <BoardHead>
                <BoardTitle><FaSync style={{ color: '#7c3aed' }} /> Flashcard Mode</BoardTitle>
                <BoardHint>{flashTerms.length} cards</BoardHint>
              </BoardHead>
              <div style={{ padding: '1.25rem 1rem' }}>
                <FlashcardMode
                  terms={flashTerms}
                  learnedIds={learnedIds}
                  onMarkLearned={markLearned}
                />
              </div>
            </BoardCard>
          ) : (
            <>
              {/* Board */}
              <BoardCard>
                <BoardHead>
                  <BoardTitle><FaBolt style={{ color: '#f59e0b' }} /> Learning Board</BoardTitle>
                  <BoardHint>
                    {session.length === 0 ? 'Drag terms here · click + · or load a study set' : `${session.length} term${session.length > 1 ? 's' : ''} — ${session.length > 1 ? 'AI will compare them' : 'AI will explain it'}`}
                  </BoardHint>
                </BoardHead>

                <DropZone $over={isOver} onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}>
                  {session.length === 0 ? (
                    <DropPlaceholder>
                      <FaLayerGroup style={{ fontSize: '1.3rem', opacity: 0.22 }} />
                      <span>Drop financial terms here</span>
                      <span style={{ fontSize: '0.7rem' }}>Drag from the list · click + · or pick a study set above</span>
                    </DropPlaceholder>
                  ) : (
                    <AnimatePresence>
                      {sessionTermObjs.map(t => {
                        const c = CAT_MAP[t.category]?.color || '#64748b';
                        return (
                          <Chip key={t.id} $c={c} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.7 }} transition={{ duration: 0.18 }}>
                            {t.label}
                            <ChipX $c={c} onClick={() => removeTerm(t.id)}><FaTimes /></ChipX>
                          </Chip>
                        );
                      })}
                    </AnimatePresence>
                  )}
                </DropZone>

                <ActionRow>
                  <ExplainBtn
                    $disabled={session.length === 0 || loading}
                    onClick={session.length && !loading ? explain : undefined}
                    whileHover={session.length && !loading ? { scale: 1.01 } : {}}
                    whileTap={session.length && !loading ? { scale: 0.97 } : {}}
                  >
                    {loading
                      ? <><FaSpinner style={{ animation: 'spin 1s linear infinite' }} /> Generating…</>
                      : session.length > 1
                        ? <><FaRobot /> Compare {session.length} Terms</>
                        : <><FaRobot /> Get AI Lesson</>
                    }
                  </ExplainBtn>
                  {session.length > 0 && (
                    <ClearBtn onClick={() => { setSession([]); setResult(null); }}>
                      <FaTrash /> Clear
                    </ClearBtn>
                  )}
                </ActionRow>
              </BoardCard>

              {/* Explanation */}
              <AnimatePresence mode="wait">
                {loading && <ThinkingState key="think" names={session.map(id => TERMS.find(t=>t.id===id)?.label).filter(Boolean).join(' + ') || '…'} />}
                {!loading && error && (
                  <motion.div key="err" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 14, padding: '1rem 1.25rem', color: '#dc2626', fontSize: '0.85rem' }}>
                    {error}
                  </motion.div>
                )}
                {!loading && result && (
                  <ExplanationDisplay
                    key={resultTerms.join('+')}
                    data={result}
                    termLabels={resultTerms}
                    learnedIds={learnedIds}
                    onMarkLearned={markLearned}
                    onAddRelated={addRelated}
                    onCopy={handleCopy}
                    onQuizComplete={handleQuizComplete}
                  />
                )}
              </AnimatePresence>
              {copied && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', background: '#0f172a', color: '#fff', padding: '0.55rem 1rem', borderRadius: 10, fontSize: '0.82rem', fontWeight: 700, zIndex: 9999 }}>
                  ✅ Copied to clipboard
                </motion.div>
              )}
            </>
          )}

          {/* DB History */}
          {dbHistory.length > 0 && (
            <HistCard>
              <HistHead>
                <HistTitle><FaHistory /> Session History</HistTitle>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{dbHistory.length} saved</span>
              </HistHead>
              {dbHistory.slice(0, 12).map(h => (
                <HistRow key={h.id} onClick={() => restoreHistory(h)}>
                  <FaStar style={{ color: '#f59e0b', fontSize: '0.65rem', flexShrink: 0 }} />
                  <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {h.term_labels || (Array.isArray(h.terms) ? h.terms.join(', ') : h.terms)}
                  </span>
                  <TimeLabel>{timeAgo(h.created_at)}</TimeLabel>
                  <button
                    onClick={e => deleteHistory(e, h.id)}
                    style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', fontSize: '0.65rem', padding: '0 0 0 0.35rem' }}
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </HistRow>
              ))}
            </HistCard>
          )}
        </RightPanel>
      </Body>}
    </Page>
  );
}
