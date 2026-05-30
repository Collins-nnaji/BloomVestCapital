import React, { useState, useRef, useCallback, useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaBook, FaSearch, FaTimes, FaBolt, FaLightbulb,
  FaBuilding, FaStar, FaChevronRight, FaGripVertical,
  FaPlus, FaHistory, FaRobot, FaSpinner, FaChartLine,
  FaTrash, FaArrowRight,
} from 'react-icons/fa';
import { api } from '../api';

/* ═══════════════════════════════════════════════════════════════
   TERMS DATA
═══════════════════════════════════════════════════════════════ */

const CATEGORIES = [
  { id: 'all',         label: 'All',         color: '#0f172a' },
  { id: 'basics',      label: 'Basics',      color: '#0ea5e9' },
  { id: 'stocks',      label: 'Stocks',      color: '#16a34a' },
  { id: 'valuation',   label: 'Valuation',   color: '#7c3aed' },
  { id: 'bonds',       label: 'Bonds',       color: '#d97706' },
  { id: 'portfolio',   label: 'Portfolio',   color: '#059669' },
  { id: 'macro',       label: 'Macro',       color: '#dc2626' },
  { id: 'derivatives', label: 'Derivatives', color: '#0284c7' },
  { id: 'crypto',      label: 'Crypto',      color: '#f59e0b' },
];

const TERMS = [
  // Basics
  { id: 'asset',            label: 'Asset',               category: 'basics' },
  { id: 'liability',        label: 'Liability',            category: 'basics' },
  { id: 'equity',           label: 'Equity',               category: 'basics' },
  { id: 'net-worth',        label: 'Net Worth',            category: 'basics' },
  { id: 'cash-flow',        label: 'Cash Flow',            category: 'basics' },
  { id: 'revenue',          label: 'Revenue',              category: 'basics' },
  { id: 'profit',           label: 'Profit',               category: 'basics' },
  { id: 'margin',           label: 'Profit Margin',        category: 'basics' },
  { id: 'compound-interest',label: 'Compound Interest',    category: 'basics' },
  { id: 'inflation',        label: 'Inflation',            category: 'basics' },
  { id: 'interest-rate',    label: 'Interest Rate',        category: 'basics' },
  { id: 'dividend',         label: 'Dividend',             category: 'basics' },
  { id: 'capital-gain',     label: 'Capital Gain',         category: 'basics' },
  { id: 'liquidity',        label: 'Liquidity',            category: 'basics' },
  { id: 'risk',             label: 'Risk',                 category: 'basics' },
  // Stocks
  { id: 'stock',            label: 'Stock / Share',        category: 'stocks' },
  { id: 'ipo',              label: 'IPO',                  category: 'stocks' },
  { id: 'market-cap',       label: 'Market Cap',           category: 'stocks' },
  { id: 'eps',              label: 'EPS',                  category: 'stocks' },
  { id: 'stock-split',      label: 'Stock Split',          category: 'stocks' },
  { id: 'short-selling',    label: 'Short Selling',        category: 'stocks' },
  { id: 'earnings-call',    label: 'Earnings Call',        category: 'stocks' },
  { id: 'beta',             label: 'Beta',                 category: 'stocks' },
  { id: 'alpha',            label: 'Alpha',                category: 'stocks' },
  { id: 'volatility',       label: 'Volatility',           category: 'stocks' },
  { id: 'float',            label: 'Float',                category: 'stocks' },
  { id: 'bid-ask',          label: 'Bid/Ask Spread',       category: 'stocks' },
  { id: 'market-order',     label: 'Market Order',         category: 'stocks' },
  { id: 'limit-order',      label: 'Limit Order',          category: 'stocks' },
  // Valuation
  { id: 'pe-ratio',         label: 'P/E Ratio',            category: 'valuation' },
  { id: 'pb-ratio',         label: 'P/B Ratio',            category: 'valuation' },
  { id: 'ev-ebitda',        label: 'EV/EBITDA',            category: 'valuation' },
  { id: 'dcf',              label: 'DCF Analysis',         category: 'valuation' },
  { id: 'book-value',       label: 'Book Value',           category: 'valuation' },
  { id: 'intrinsic-value',  label: 'Intrinsic Value',      category: 'valuation' },
  { id: 'ebitda',           label: 'EBITDA',               category: 'valuation' },
  { id: 'free-cash-flow',   label: 'Free Cash Flow',       category: 'valuation' },
  { id: 'roe',              label: 'Return on Equity (ROE)',category: 'valuation' },
  { id: 'roa',              label: 'Return on Assets (ROA)',category: 'valuation' },
  { id: 'peg-ratio',        label: 'PEG Ratio',            category: 'valuation' },
  { id: 'wacc',             label: 'WACC',                 category: 'valuation' },
  // Bonds
  { id: 'bond',             label: 'Bond',                 category: 'bonds' },
  { id: 'yield',            label: 'Yield',                category: 'bonds' },
  { id: 'coupon-rate',      label: 'Coupon Rate',          category: 'bonds' },
  { id: 'bond-rating',      label: 'Bond Rating',          category: 'bonds' },
  { id: 'treasury-bond',    label: 'Treasury Bond',        category: 'bonds' },
  { id: 'corporate-bond',   label: 'Corporate Bond',       category: 'bonds' },
  { id: 'duration',         label: 'Duration',             category: 'bonds' },
  { id: 'yield-curve',      label: 'Yield Curve',          category: 'bonds' },
  { id: 'inverted-yield',   label: 'Inverted Yield Curve', category: 'bonds' },
  { id: 'junk-bond',        label: 'Junk Bond',            category: 'bonds' },
  // Portfolio
  { id: 'diversification',  label: 'Diversification',      category: 'portfolio' },
  { id: 'asset-allocation', label: 'Asset Allocation',     category: 'portfolio' },
  { id: 'rebalancing',      label: 'Rebalancing',          category: 'portfolio' },
  { id: 'index-fund',       label: 'Index Fund',           category: 'portfolio' },
  { id: 'etf',              label: 'ETF',                  category: 'portfolio' },
  { id: 'mutual-fund',      label: 'Mutual Fund',          category: 'portfolio' },
  { id: 'sharpe-ratio',     label: 'Sharpe Ratio',         category: 'portfolio' },
  { id: 'drawdown',         label: 'Drawdown',             category: 'portfolio' },
  { id: 'dca',              label: 'Dollar-Cost Averaging',category: 'portfolio' },
  { id: 'hedge',            label: 'Hedging',              category: 'portfolio' },
  { id: 'benchmark',        label: 'Benchmark',            category: 'portfolio' },
  // Macro
  { id: 'gdp',              label: 'GDP',                  category: 'macro' },
  { id: 'cpi',              label: 'CPI',                  category: 'macro' },
  { id: 'fed-funds',        label: 'Fed Funds Rate',       category: 'macro' },
  { id: 'qe',               label: 'Quantitative Easing',  category: 'macro' },
  { id: 'monetary-policy',  label: 'Monetary Policy',      category: 'macro' },
  { id: 'fiscal-policy',    label: 'Fiscal Policy',        category: 'macro' },
  { id: 'recession',        label: 'Recession',            category: 'macro' },
  { id: 'bull-market',      label: 'Bull Market',          category: 'macro' },
  { id: 'bear-market',      label: 'Bear Market',          category: 'macro' },
  { id: 'stagflation',      label: 'Stagflation',          category: 'macro' },
  { id: 'trade-deficit',    label: 'Trade Deficit',        category: 'macro' },
  { id: 'hawkish-dovish',   label: 'Hawkish vs Dovish',    category: 'macro' },
  // Derivatives
  { id: 'option',           label: 'Option Contract',      category: 'derivatives' },
  { id: 'call-option',      label: 'Call Option',          category: 'derivatives' },
  { id: 'put-option',       label: 'Put Option',           category: 'derivatives' },
  { id: 'strike-price',     label: 'Strike Price',         category: 'derivatives' },
  { id: 'futures',          label: 'Futures Contract',     category: 'derivatives' },
  { id: 'implied-vol',      label: 'Implied Volatility',   category: 'derivatives' },
  { id: 'greeks',           label: 'The Greeks (Delta/Gamma)', category: 'derivatives' },
  { id: 'leverage',         label: 'Leverage',             category: 'derivatives' },
  // Crypto
  { id: 'blockchain',       label: 'Blockchain',           category: 'crypto' },
  { id: 'bitcoin',          label: 'Bitcoin',              category: 'crypto' },
  { id: 'defi',             label: 'DeFi',                 category: 'crypto' },
  { id: 'nft',              label: 'NFT',                  category: 'crypto' },
  { id: 'staking',          label: 'Staking',              category: 'crypto' },
  { id: 'gas-fee',          label: 'Gas Fee',              category: 'crypto' },
  { id: 'wallet',           label: 'Crypto Wallet',        category: 'crypto' },
  { id: 'altcoin',          label: 'Altcoin',              category: 'crypto' },
  { id: 'market-cycle',     label: 'Market Cycle',         category: 'crypto' },
];

const CAT_MAP = Object.fromEntries(CATEGORIES.map(c => [c.id, c]));

/* ═══════════════════════════════════════════════════════════════
   STYLED COMPONENTS
═══════════════════════════════════════════════════════════════ */

const pulse = keyframes`0%,100%{opacity:1}50%{opacity:0.45}`;

const Page = styled.div`
  min-height: 100vh;
  background: #f0f4f8;
  padding-bottom: 3rem;
`;

const Header = styled.div`
  background: #fff;
  border-bottom: 1px solid #e2e8f0;
  padding: 1.1rem 1.5rem 1rem;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const HeaderLeft = styled.div``;

const PageTitle = styled.h1`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.4rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 0.2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const PageSub = styled.p`
  font-size: 0.83rem;
  color: #64748b;
  margin: 0;
`;

const CountBadge = styled.span`
  font-size: 0.72rem;
  font-weight: 700;
  background: #f1f5f9;
  color: #64748b;
  padding: 0.2rem 0.55rem;
  border-radius: 99px;
  margin-left: 0.4rem;
`;

const Body = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 1.25rem 1.25rem 0;
  display: grid;
  grid-template-columns: 290px 1fr;
  gap: 1.1rem;
  align-items: start;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

/* ── Left Panel ── */

const LeftPanel = styled.div`
  background: #fff;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  position: sticky;
  top: 80px;
`;

const SearchWrap = styled.div`
  padding: 0.75rem 0.85rem 0.6rem;
  border-bottom: 1px solid #f1f5f9;
  position: relative;
`;

const SearchIcon = styled(FaSearch)`
  position: absolute;
  left: 1.45rem;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  font-size: 0.75rem;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.55rem 0.75rem 0.55rem 2rem;
  border: 1.5px solid #e2e8f0;
  border-radius: 9px;
  font-size: 0.83rem;
  background: #fafbfc;
  color: #0f172a;
  box-sizing: border-box;
  &:focus { outline: none; border-color: #0ea5e9; background: #fff; }
  &::placeholder { color: #94a3b8; }
`;

const CatTabs = styled.div`
  display: flex;
  gap: 0.35rem;
  padding: 0.6rem 0.85rem;
  overflow-x: auto;
  border-bottom: 1px solid #f1f5f9;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
`;

const CatTab = styled.button`
  flex-shrink: 0;
  padding: 0.3rem 0.65rem;
  border-radius: 7px;
  border: 1.5px solid ${p => p.$active ? p.$color : '#e2e8f0'};
  background: ${p => p.$active ? p.$color + '14' : 'transparent'};
  color: ${p => p.$active ? p.$color : '#64748b'};
  font-size: 0.72rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s;
  &:hover { border-color: ${p => p.$color}; color: ${p => p.$color}; }
`;

const TermsList = styled.div`
  max-height: calc(100vh - 300px);
  overflow-y: auto;
  padding: 0.4rem 0.5rem 0.75rem;
  scrollbar-width: thin;
  scrollbar-color: #e2e8f0 transparent;
  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 4px; }
`;

const TermItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.52rem 0.65rem;
  border-radius: 9px;
  cursor: grab;
  user-select: none;
  border: 1.5px solid transparent;
  transition: all 0.15s;
  &:hover {
    background: #f8fafc;
    border-color: #e2e8f0;
  }
  &:active { cursor: grabbing; }
  &.is-dragging {
    background: rgba(14, 165, 233, 0.06);
    border-color: #0ea5e9;
  }
`;

const GripIcon = styled(FaGripVertical)`
  color: #cbd5e1;
  font-size: 0.75rem;
  flex-shrink: 0;
`;

const TermLabel = styled.span`
  font-size: 0.82rem;
  font-weight: 600;
  color: #0f172a;
  flex: 1;
`;

const CatDot = styled.span`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: ${p => p.$color};
  flex-shrink: 0;
`;

const AddBtn = styled.button`
  width: 20px;
  height: 20px;
  border-radius: 6px;
  border: 1.5px solid #e2e8f0;
  background: #fff;
  color: #94a3b8;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.65rem;
  opacity: 0;
  transition: all 0.15s;
  flex-shrink: 0;
  ${TermItem}:hover & { opacity: 1; }
  &:hover { border-color: #0ea5e9; color: #0ea5e9; background: rgba(14,165,233,0.06); }
`;

const EmptyMsg = styled.div`
  text-align: center;
  color: #94a3b8;
  font-size: 0.8rem;
  padding: 1.5rem 1rem;
`;

/* ── Right Panel ── */

const RightPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SessionCard = styled.div`
  background: #fff;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
`;

const SessionHead = styled.div`
  padding: 0.85rem 1.1rem 0.75rem;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SessionTitle = styled.span`
  font-weight: 800;
  font-size: 0.9rem;
  color: #0f172a;
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;

const SessionHint = styled.span`
  font-size: 0.75rem;
  color: #94a3b8;
  font-weight: 500;
`;

const DropZone = styled.div`
  min-height: 90px;
  padding: 0.85rem 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: flex-start;
  align-content: flex-start;
  border: 2px dashed ${p => p.$over ? '#0ea5e9' : '#e2e8f0'};
  border-radius: 12px;
  margin: 0.75rem 1rem;
  background: ${p => p.$over ? 'rgba(14,165,233,0.04)' : '#fafbfc'};
  transition: border-color 0.15s, background 0.15s;
  cursor: ${p => p.$over ? 'copy' : 'default'};
`;

const DropPlaceholder = styled.div`
  width: 100%;
  text-align: center;
  color: #94a3b8;
  font-size: 0.8rem;
  padding: 1rem 0 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  pointer-events: none;
`;

const TermChip = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.38rem 0.65rem;
  border-radius: 8px;
  background: ${p => p.$color + '12'};
  border: 1.5px solid ${p => p.$color + '30'};
  font-size: 0.8rem;
  font-weight: 700;
  color: ${p => p.$color};
  cursor: default;
`;

const ChipRemove = styled.button`
  background: none;
  border: none;
  color: ${p => p.$color};
  opacity: 0.5;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  font-size: 0.7rem;
  &:hover { opacity: 1; }
`;

const ActionRow = styled.div`
  display: flex;
  gap: 0.6rem;
  padding: 0 1rem 1rem;
  flex-wrap: wrap;
`;

const ExplainBtn = styled(motion.button)`
  flex: 1;
  padding: 0.75rem 1.25rem;
  border: none;
  border-radius: 11px;
  background: linear-gradient(135deg, #15803d, #0f766e);
  color: #fff;
  font-weight: 800;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  min-width: 160px;
  &:disabled { opacity: 0.5; cursor: default; }
`;

const ClearAllBtn = styled.button`
  padding: 0.75rem 1rem;
  border: 1.5px solid #e2e8f0;
  border-radius: 11px;
  background: #fff;
  color: #94a3b8;
  font-weight: 600;
  font-size: 0.82rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  &:hover { border-color: #dc2626; color: #dc2626; }
`;

/* ── Explanation Card ── */

const ExplainCard = styled(motion.div)`
  background: #fff;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
`;

const ExplainHeader = styled.div`
  padding: 0.9rem 1.1rem 0.8rem;
  background: linear-gradient(135deg, rgba(15,118,110,0.05), rgba(34,197,94,0.04));
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  gap: 0.65rem;
`;

const TermEmoji = styled.span`
  font-size: 1.5rem;
  line-height: 1;
`;

const ExplainTitleRow = styled.div``;

const ExplainTitle = styled.h2`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.05rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 0.15rem;
`;

const ExplainMeta = styled.div`
  font-size: 0.72rem;
  color: #94a3b8;
  font-weight: 500;
`;

const ExplainBody = styled.div`
  padding: 1rem 1.1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const SectionLabel = styled.div`
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: ${p => p.$color || '#94a3b8'};
  display: flex;
  align-items: center;
  gap: 0.35rem;
`;

const SectionText = styled.div`
  font-size: 0.88rem;
  color: #334155;
  line-height: 1.65;
`;

const CompanyList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const CompanyRow = styled.div`
  display: flex;
  gap: 0.6rem;
  align-items: flex-start;
  background: #f8fafc;
  border-radius: 9px;
  padding: 0.5rem 0.75rem;
`;

const CompanyName = styled.span`
  font-weight: 800;
  font-size: 0.82rem;
  color: #0f172a;
  min-width: 80px;
  flex-shrink: 0;
`;

const CompanyDetail = styled.span`
  font-size: 0.8rem;
  color: #475569;
  line-height: 1.5;
`;

const ProTipBox = styled.div`
  display: flex;
  gap: 0.55rem;
  background: rgba(245, 158, 11, 0.06);
  border: 1px solid rgba(245, 158, 11, 0.18);
  border-radius: 10px;
  padding: 0.65rem 0.85rem;
  font-size: 0.83rem;
  color: #92400e;
  line-height: 1.55;
`;

const RelatedChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
`;

const RelatedChip = styled.button`
  padding: 0.28rem 0.65rem;
  border-radius: 7px;
  border: 1.5px solid #e2e8f0;
  background: #f8fafc;
  font-size: 0.75rem;
  font-weight: 600;
  color: #475569;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  transition: all 0.15s;
  &:hover { border-color: #0ea5e9; color: #0369a1; background: rgba(14,165,233,0.06); }
`;

/* ── Loading skeleton ── */

const SkeletonLine = styled.div`
  height: ${p => p.$h || 14}px;
  border-radius: 6px;
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 200% 100%;
  animation: ${pulse} 1.4s ease-in-out infinite;
  width: ${p => p.$w || '100%'};
  margin-bottom: ${p => p.$mb || 0}px;
`;

/* ── History ── */

const HistoryCard = styled.div`
  background: #fff;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
`;

const HistoryHead = styled.div`
  padding: 0.7rem 1rem 0.6rem;
  border-bottom: 1px solid #f1f5f9;
  font-weight: 700;
  font-size: 0.82rem;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;

const HistoryRow = styled.button`
  width: 100%;
  text-align: left;
  padding: 0.55rem 1rem;
  border: none;
  background: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: #475569;
  border-bottom: 1px solid #f8fafc;
  transition: background 0.12s;
  &:hover { background: #f8fafc; color: #0f172a; }
  &:last-child { border-bottom: none; }
`;

/* ═══════════════════════════════════════════════════════════════
   AI RESPONSE PARSER
═══════════════════════════════════════════════════════════════ */

function parseAIResponse(text) {
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
  } catch {/* fall through */}

  // Fallback: extract sections from markdown
  const get = (label) => {
    const re = new RegExp(`(?:#{1,3}\\s*${label}[:\n]|\\*{0,2}${label}\\*{0,2}[:\n])([\\s\\S]*?)(?=#{1,3}\\s|\\*{0,2}[A-Z][a-z]+\\*{0,2}:|$)`, 'i');
    const m = text.match(re);
    return m ? m[1].trim() : null;
  };

  return {
    emoji: '📊',
    definition: get('definition') || get('Definition') || text.slice(0, 300),
    scenario:   get('scenario') || get('Scenario') || get('Example') || '',
    companies:  [],
    proTip:     get('pro tip') || get('Pro Tip') || get('tip') || '',
    relatedTerms: [],
    rawText: text,
  };
}

/* ═══════════════════════════════════════════════════════════════
   EXPLANATION DISPLAY
═══════════════════════════════════════════════════════════════ */

function ExplanationDisplay({ data, termLabels, onAddRelated }) {
  if (!data) return null;

  const isRaw = !data.definition && data.rawText;
  const termTitle = termLabels.length > 1
    ? termLabels.join(' vs ')
    : termLabels[0];

  return (
    <ExplainCard
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <ExplainHeader>
        <TermEmoji>{data.emoji || '📊'}</TermEmoji>
        <ExplainTitleRow>
          <ExplainTitle>{termTitle}</ExplainTitle>
          <ExplainMeta>AI-generated explanation · For learning only</ExplainMeta>
        </ExplainTitleRow>
      </ExplainHeader>

      <ExplainBody>
        {isRaw ? (
          <SectionText style={{ whiteSpace: 'pre-line' }}>{data.rawText}</SectionText>
        ) : (
          <>
            {data.definition && (
              <Section>
                <SectionLabel $color="#0ea5e9"><FaBook /> Definition</SectionLabel>
                <SectionText>{data.definition}</SectionText>
              </Section>
            )}

            {data.scenario && (
              <Section>
                <SectionLabel $color="#16a34a"><FaChartLine /> Real-World Scenario</SectionLabel>
                <SectionText>{data.scenario}</SectionText>
              </Section>
            )}

            {data.companies?.length > 0 && (
              <Section>
                <SectionLabel $color="#7c3aed"><FaBuilding /> Company Examples</SectionLabel>
                <CompanyList>
                  {data.companies.map((c, i) => (
                    <CompanyRow key={i}>
                      <CompanyName>{typeof c === 'string' ? c : c.name}</CompanyName>
                      {typeof c === 'object' && c.example && (
                        <CompanyDetail>{c.example}</CompanyDetail>
                      )}
                    </CompanyRow>
                  ))}
                </CompanyList>
              </Section>
            )}

            {data.proTip && (
              <ProTipBox>
                <FaLightbulb style={{ color: '#f59e0b', flexShrink: 0, marginTop: 2 }} />
                <div><strong>Pro Tip:</strong> {data.proTip}</div>
              </ProTipBox>
            )}

            {data.relatedTerms?.length > 0 && (
              <Section>
                <SectionLabel $color="#94a3b8"><FaArrowRight /> Learn Next</SectionLabel>
                <RelatedChips>
                  {data.relatedTerms.map(t => (
                    <RelatedChip key={t} onClick={() => onAddRelated(t)}>
                      {t} <FaChevronRight style={{ fontSize: '0.6rem' }} />
                    </RelatedChip>
                  ))}
                </RelatedChips>
              </Section>
            )}
          </>
        )}
      </ExplainBody>
    </ExplainCard>
  );
}

/* ═══════════════════════════════════════════════════════════════
   LOADING SKELETON
═══════════════════════════════════════════════════════════════ */

function ExplainSkeleton() {
  return (
    <ExplainCard
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <ExplainHeader>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: '#f1f5f9' }} />
        <div style={{ flex: 1 }}>
          <SkeletonLine $h={16} $w="45%" $mb={6} />
          <SkeletonLine $h={10} $w="30%" />
        </div>
      </ExplainHeader>
      <ExplainBody>
        {[['80%', '60%', '90%'], ['70%', '85%'], ['55%', '75%', '65%']].map((lines, i) => (
          <Section key={i}>
            <SkeletonLine $h={9} $w="22%" $mb={8} />
            {lines.map((w, j) => <SkeletonLine key={j} $h={13} $w={w} $mb={5} />)}
          </Section>
        ))}
      </ExplainBody>
    </ExplainCard>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════ */

export default function GlossaryPage() {
  const [search,     setSearch]     = useState('');
  const [activeCat,  setActiveCat]  = useState('all');
  const [session,    setSession]    = useState([]);   // term ids in drop zone
  const [isOver,     setIsOver]     = useState(false);
  const [dragId,     setDragId]     = useState(null);
  const [loading,    setLoading]    = useState(false);
  const [result,     setResult]     = useState(null); // parsed AI response
  const [resultTerms,setResultTerms]= useState([]);   // term labels used
  const [history,    setHistory]    = useState([]);   // [{labels, data}]
  const [error,      setError]      = useState(null);
  const dragOverRef = useRef(false);

  /* Filtered terms */
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return TERMS.filter(t =>
      (activeCat === 'all' || t.category === activeCat) &&
      (!q || t.label.toLowerCase().includes(q))
    );
  }, [search, activeCat]);

  /* Drag handlers */
  const onDragStart = useCallback((e, id) => {
    e.dataTransfer.setData('termId', id);
    e.dataTransfer.effectAllowed = 'copy';
    setDragId(id);
  }, []);

  const onDragEnd = useCallback(() => setDragId(null), []);

  const onDropZoneDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    if (!dragOverRef.current) { dragOverRef.current = true; setIsOver(true); }
  }, []);

  const onDropZoneDragLeave = useCallback(() => {
    dragOverRef.current = false;
    setIsOver(false);
  }, []);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    dragOverRef.current = false;
    setIsOver(false);
    const id = e.dataTransfer.getData('termId');
    if (id && !session.includes(id)) {
      setSession(s => [...s, id]);
    }
  }, [session]);

  const addToSession = useCallback((id) => {
    if (!session.includes(id)) setSession(s => [...s, id]);
  }, [session]);

  const removeFromSession = useCallback((id) => {
    setSession(s => s.filter(x => x !== id));
  }, []);

  /* Add by label (for related terms) */
  const addRelated = useCallback((label) => {
    const term = TERMS.find(t => t.label.toLowerCase() === label.toLowerCase());
    if (term && !session.includes(term.id)) {
      setSession(s => [...s, term.id]);
    } else if (!term) {
      // Try fuzzy match
      const fuzzy = TERMS.find(t => t.label.toLowerCase().includes(label.toLowerCase()));
      if (fuzzy && !session.includes(fuzzy.id)) setSession(s => [...s, fuzzy.id]);
    }
  }, [session]);

  /* Explain */
  const explain = useCallback(async () => {
    if (!session.length) return;
    const termObjs = session.map(id => TERMS.find(t => t.id === id)).filter(Boolean);
    const labels   = termObjs.map(t => t.label);

    setLoading(true);
    setResult(null);
    setError(null);

    const isMulti = labels.length > 1;
    const prompt = isMulti
      ? `You are a financial education AI. Compare and explain these financial terms for a beginner investor: ${labels.join(', ')}.
Return ONLY a valid JSON object with exactly these fields:
{
  "emoji": "a fitting emoji",
  "definition": "How these terms relate and their key differences — 3-4 sentences",
  "scenario": "A single scenario showing all these terms in context, with real numbers",
  "companies": [{"name": "CompanyName", "example": "How this specific company illustrates these concepts"}],
  "proTip": "One advanced insight connecting these terms that beginners miss",
  "relatedTerms": ["term1", "term2", "term3"]
}`
      : `You are a financial education AI. Explain the term "${labels[0]}" to a beginner investor in plain English.
Return ONLY a valid JSON object with exactly these fields:
{
  "emoji": "a fitting emoji for this concept",
  "definition": "2-3 sentence plain English definition",
  "scenario": "A concrete real-world scenario with actual numbers showing this in action",
  "companies": [{"name": "CompanyName", "example": "How this term applies specifically to this company"}],
  "proTip": "One insight most beginners miss about this term",
  "relatedTerms": ["term1", "term2", "term3"]
}
Only output the JSON. No extra text.`;

    try {
      const raw = await api.chat(prompt);
      const parsed = parseAIResponse(typeof raw === 'string' ? raw : raw?.message || JSON.stringify(raw));
      setResult(parsed);
      setResultTerms(labels);
      setHistory(h => [{ labels, data: parsed, id: Date.now() }, ...h.slice(0, 9)]);
    } catch (err) {
      setError("Couldn't reach the AI. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, [session]);

  const sessionTermObjs = session.map(id => TERMS.find(t => t.id === id)).filter(Boolean);

  return (
    <Page>
      <Header>
        <HeaderLeft>
          <PageTitle>
            <FaBook style={{ color: '#7c3aed' }} />
            Financial Glossary
            <CountBadge>{TERMS.length} terms</CountBadge>
          </PageTitle>
          <PageSub>Drag terms into the learning board → click Explain for an AI lesson with scenarios &amp; company examples</PageSub>
        </HeaderLeft>
      </Header>

      <Body>
        {/* ── Left: Terms List ── */}
        <LeftPanel>
          <SearchWrap>
            <SearchIcon />
            <SearchInput
              placeholder="Search terms…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </SearchWrap>

          <CatTabs>
            {CATEGORIES.map(c => (
              <CatTab
                key={c.id}
                $active={activeCat === c.id}
                $color={c.color}
                onClick={() => setActiveCat(c.id)}
              >
                {c.label}
              </CatTab>
            ))}
          </CatTabs>

          <TermsList>
            {filtered.length === 0 && (
              <EmptyMsg>No terms match "{search}"</EmptyMsg>
            )}
            {filtered.map(term => {
              const cat   = CAT_MAP[term.category];
              const added = session.includes(term.id);
              return (
                <TermItem
                  key={term.id}
                  draggable
                  onDragStart={e => onDragStart(e, term.id)}
                  onDragEnd={onDragEnd}
                  className={dragId === term.id ? 'is-dragging' : ''}
                  style={{ opacity: added ? 0.45 : 1 }}
                >
                  <GripIcon />
                  <CatDot $color={cat?.color || '#94a3b8'} />
                  <TermLabel>{term.label}</TermLabel>
                  {!added && (
                    <AddBtn onClick={() => addToSession(term.id)} title="Add to board">
                      <FaPlus />
                    </AddBtn>
                  )}
                  {added && (
                    <span style={{ fontSize: '0.65rem', color: '#22c55e', fontWeight: 700 }}>✓</span>
                  )}
                </TermItem>
              );
            })}
          </TermsList>
        </LeftPanel>

        {/* ── Right: Session + Explanation ── */}
        <RightPanel>
          <SessionCard>
            <SessionHead>
              <SessionTitle><FaBolt style={{ color: '#f59e0b' }} /> Learning Board</SessionTitle>
              <SessionHint>
                {session.length === 0 ? 'Drag terms here or click +' : `${session.length} term${session.length > 1 ? 's' : ''} selected`}
              </SessionHint>
            </SessionHead>

            <DropZone
              $over={isOver}
              onDragOver={onDropZoneDragOver}
              onDragLeave={onDropZoneDragLeave}
              onDrop={onDrop}
            >
              {session.length === 0 ? (
                <DropPlaceholder>
                  <FaGripVertical style={{ fontSize: '1.5rem', opacity: 0.25 }} />
                  <span>Drop terms here to start a lesson</span>
                  <span style={{ fontSize: '0.72rem' }}>Drag from the list, or click the + button</span>
                </DropPlaceholder>
              ) : (
                <AnimatePresence>
                  {sessionTermObjs.map(t => {
                    const cat = CAT_MAP[t.category];
                    return (
                      <TermChip
                        key={t.id}
                        $color={cat?.color || '#64748b'}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                      >
                        {t.label}
                        <ChipRemove $color={cat?.color || '#64748b'} onClick={() => removeFromSession(t.id)}>
                          <FaTimes />
                        </ChipRemove>
                      </TermChip>
                    );
                  })}
                </AnimatePresence>
              )}
            </DropZone>

            <ActionRow>
              <ExplainBtn
                onClick={explain}
                disabled={session.length === 0 || loading}
                whileHover={session.length && !loading ? { scale: 1.01 } : {}}
                whileTap={session.length && !loading ? { scale: 0.98 } : {}}
              >
                {loading
                  ? <><FaSpinner style={{ animation: 'spin 1s linear infinite' }} /> Generating lesson…</>
                  : session.length > 1
                    ? <><FaRobot /> Compare &amp; Explain {session.length} Terms</>
                    : <><FaRobot /> Explain This Term</>
                }
              </ExplainBtn>
              {session.length > 0 && (
                <ClearAllBtn onClick={() => { setSession([]); setResult(null); }}>
                  <FaTrash /> Clear
                </ClearAllBtn>
              )}
            </ActionRow>
          </SessionCard>

          {/* Explanation */}
          <AnimatePresence mode="wait">
            {loading && <ExplainSkeleton key="skeleton" />}
            {!loading && error && (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 14,
                  padding: '1rem 1.25rem', color: '#dc2626', fontSize: '0.85rem',
                }}
              >
                {error}
              </motion.div>
            )}
            {!loading && result && (
              <ExplanationDisplay
                key={resultTerms.join('+')}
                data={result}
                termLabels={resultTerms}
                onAddRelated={addRelated}
              />
            )}
          </AnimatePresence>

          {/* History */}
          {history.length > 0 && (
            <HistoryCard>
              <HistoryHead><FaHistory /> Recently Explained</HistoryHead>
              {history.map(h => (
                <HistoryRow
                  key={h.id}
                  onClick={() => {
                    setResult(h.data);
                    setResultTerms(h.labels);
                    const ids = h.labels.map(lbl => TERMS.find(t => t.label === lbl)?.id).filter(Boolean);
                    setSession(ids);
                  }}
                >
                  <FaStar style={{ color: '#f59e0b', fontSize: '0.7rem', flexShrink: 0 }} />
                  {h.labels.join(' + ')}
                  <FaChevronRight style={{ marginLeft: 'auto', opacity: 0.3, fontSize: '0.65rem' }} />
                </HistoryRow>
              ))}
            </HistoryCard>
          )}
        </RightPanel>
      </Body>
    </Page>
  );
}
