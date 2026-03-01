import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import {
  FaArrowUp, FaArrowDown, FaWallet, FaChartLine, FaShoppingCart,
  FaHistory, FaSearch, FaCheckCircle, FaSync, FaExclamationTriangle,
  FaTimesCircle, FaShieldAlt, FaInfoCircle, FaTimes, FaHeartbeat
} from 'react-icons/fa';
import { stocks, marketIndices, assetClasses } from '../data/stockData';
import { api } from '../api';

/* ───────── styled-components ───────── */

const PageContainer = styled.div`
  min-height: 100vh;
  background: #ffffff;
`;

const HeaderSection = styled.section`
  padding: 2.5rem 1.5rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;

  @media (max-width: 480px) {
    padding: 1.75rem 1rem 1.25rem;
  }
`;

const HeaderInner = styled.div`
  max-width: 1300px;
  margin: 0 auto;
`;

const HeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const HeaderLeft = styled.div``;

const HeaderTitle = styled.h1`
  font-size: 2rem;
  font-weight: 800;
  color: #111;
  margin: 0 0 0.4rem 0;
  letter-spacing: -0.02em;
  span { color: #22c55e; }
`;

const HeaderSubtitle = styled.p`
  color: #333;
  font-size: 1.05rem;
  margin: 0;
  max-width: 540px;
  line-height: 1.65;
  font-weight: 450;
`;

const ModeBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  background: rgba(34,197,94,0.08);
  border: 1px solid rgba(34,197,94,0.15);
  color: #4ade80;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 0.3rem 0.7rem;
  border-radius: 20px;
  margin-top: 0.5rem;
`;

const IndicesRow = styled.div`
  display: flex;
  gap: 1.25rem;
  flex-wrap: wrap;
  align-items: center;
`;

const IndexChip = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
`;

const IndexName = styled.span`color: rgba(255,255,255,0.4); font-weight: 500;`;
const IndexVal = styled.span`color: white; font-weight: 700;`;
const IndexChg = styled.span`color: ${p => p.$pos ? '#4ade80' : '#f87171'}; font-weight: 600;`;

/* ── Portfolio bar ── */

const PortfolioBar = styled.div`
  max-width: 1300px;
  margin: 0 auto;
  padding: 1.25rem 1.5rem;
`;

const PortfolioCard = styled(motion.div)`
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 1.25rem 1.75rem;
  display: flex;
  align-items: center;
  gap: 2.5rem;
  flex-wrap: wrap;
  box-shadow: 0 2px 12px rgba(0,0,0,0.04);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 8px 24px rgba(34,197,94,0.08);
  }

  @media (max-width: 480px) {
    padding: 1rem 1.25rem;
    gap: 1.25rem;
  }
`;

const PortfolioStat = styled.div`min-width: 110px;`;
const StatLabel = styled.div`
  font-size: 0.65rem; color: #555;
  text-transform: uppercase; font-weight: 700;
  letter-spacing: 0.8px; margin-bottom: 0.15rem;
`;
const StatValue = styled.div`
  font-size: 1.25rem; font-weight: 800;
  color: ${p => p.$color || '#111'};
`;

const ResetBtn = styled.button`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1rem;
  background: rgba(239,68,68,0.1);
  border: 1px solid rgba(239,68,68,0.2);
  border-radius: 8px;
  color: #f87171;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  &:hover { background: rgba(239,68,68,0.2); }
`;

/* ── Main grid ── */

const MainContent = styled.div`
  max-width: 1300px;
  margin: 0 auto;
  padding: 0 1.5rem 2rem;
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 1.25rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  @media (max-width: 480px) {
    padding: 0 1rem 1.5rem;
    gap: 0.85rem;
  }
`;

const LeftCol = styled.div`display: flex; flex-direction: column; gap: 1.25rem;`;
const RightCol = styled.div`display: flex; flex-direction: column; gap: 1.25rem;`;

/* ── Generic card ── */

const Card = styled(motion.div)`
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0,0,0,0.04);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 6px 20px rgba(34,197,94,0.06);
  }
`;

const CardHeader = styled.div`
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CardTitle = styled.h3`
  font-size: 0.85rem;
  font-weight: 700;
  color: #555;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0;
  svg { color: #22c55e; }
`;

const CardBody = styled.div`padding: 1.25rem;`;

/* ── Stock chart ── */

const ChartContainer = styled.div`height: 220px; margin: 0 -0.5rem;`;
const BigPrice = styled.div`font-size: 1.6rem; font-weight: 800; color: #111;`;
const BigChange = styled.div`font-size: 0.85rem; font-weight: 600; color: ${p => p.$pos ? '#22c55e' : '#dc2626'};`;

const MetricsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.6rem;
  margin: 1rem 0;
  @media (max-width: 500px) { grid-template-columns: repeat(2, 1fr); }
`;

const MetricBox = styled.div`
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 8px;
  padding: 0.6rem;
  text-align: center;
`;

const MetricLabel = styled.div`
  font-size: 0.6rem; color: rgba(255,255,255,0.3);
  text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px;
`;
const MetricValue = styled.div`font-size: 0.95rem; font-weight: 700; color: white;`;

/* ── Trade form ── */

const TradeForm = styled.div`
  background: rgba(34,197,94,0.04);
  border: 1px solid rgba(34,197,94,0.1);
  border-radius: 10px;
  padding: 1rem;
  margin-top: 0.75rem;
`;

const TradeRow = styled.div`display: flex; gap: 0.5rem; margin-bottom: 0.5rem;`;

const TradeInput = styled.input`
  flex: 1;
  padding: 0.6rem 0.8rem;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  background: rgba(255,255,255,0.04);
  color: white;
  outline: none;
  &:focus { border-color: #22c55e; }
`;

const TradeButton = styled.button`
  padding: 0.6rem 1.25rem;
  min-height: 44px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.85rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  &.buy { background: #22c55e; color: white; &:hover { background: #16a34a; } }
  &.sell { background: rgba(239,68,68,0.15); color: #f87171; border: 1px solid rgba(239,68,68,0.2); &:hover { background: rgba(239,68,68,0.25); } }
  &:disabled { opacity: 0.4; cursor: not-allowed; }

  @media (max-width: 480px) {
    padding: 0.7rem 1rem;
    font-size: 0.9rem;
    min-height: 48px;
  }
`;

const TradeCost = styled.div`
  text-align: right;
  font-size: 0.8rem;
  color: rgba(255,255,255,0.4);
  span { font-weight: 700; color: white; }
`;

/* ── Decision feedback ── */

const ratingColors = {
  good: { bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.2)', accent: '#22c55e', headerBg: 'rgba(34,197,94,0.12)' },
  caution: { bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)', accent: '#f59e0b', headerBg: 'rgba(245,158,11,0.12)' },
  risk: { bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.2)', accent: '#ef4444', headerBg: 'rgba(239,68,68,0.12)' },
};

const FeedbackCard = styled(motion.div)`
  border-radius: 12px;
  overflow: hidden;
  margin-top: 0.75rem;
  border: 1px solid ${p => ratingColors[p.$rating]?.border || 'rgba(255,255,255,0.06)'};
  background: ${p => ratingColors[p.$rating]?.bg || 'rgba(255,255,255,0.03)'};
`;

const FeedbackHeader = styled.div`
  padding: 0.75rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${p => ratingColors[p.$rating]?.headerBg || 'transparent'};
`;

const FeedbackTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 800;
  font-size: 1.05rem;
  color: ${p => ratingColors[p.$rating]?.accent || '#111'};
  letter-spacing: -0.01em;
`;

const DismissBtn = styled.button`
  background: none;
  border: none;
  color: rgba(255,255,255,0.3);
  cursor: pointer;
  padding: 0.2rem;
  display: flex;
  align-items: center;
  &:hover { color: rgba(255,255,255,0.6); }
`;

const FeedbackBody = styled.div`padding: 0.75rem 1rem;`;

const SignalItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  font-size: 1rem;
  font-weight: 500;
  color: #222;
  margin-bottom: 0.6rem;
  line-height: 1.55;
  &:last-child { margin-bottom: 0; }
`;

const SignalDot = styled.span`
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin-top: 6px;
  flex-shrink: 0;
  background: ${p =>
    p.$type === 'good' ? '#22c55e' :
    p.$type === 'caution' ? '#f59e0b' : '#ef4444'};
`;

/* ── Search / market list ── */

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
  margin-bottom: 0.75rem;
`;

const SearchInput = styled.input`
  border: none;
  background: none;
  outline: none;
  font-size: 0.85rem;
  color: white;
  width: 100%;
  &::placeholder { color: rgba(255,255,255,0.25); }
`;

const StockList = styled.div`max-height: 400px; overflow-y: auto;`;

const StockRow = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.6rem 0;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 6px;
  &:hover { background: rgba(34,197,94,0.06); padding: 0.6rem 0.5rem; }
  ${p => p.$active && `background: rgba(34,197,94,0.08); padding: 0.6rem 0.5rem; border-left: 3px solid #22c55e;`}
`;

const StockSymbol = styled.div`font-weight: 700; color: #111; font-size: 0.9rem;`;
const StockName = styled.div`color: #666; font-size: 0.75rem;`;
const PriceValue = styled.div`font-weight: 700; color: #111; font-size: 0.9rem;`;
const PriceChange = styled.div`
  font-size: 0.75rem; font-weight: 600;
  color: ${p => p.$pos ? '#22c55e' : '#dc2626'};
  display: flex; align-items: center; gap: 0.15rem; justify-content: flex-end;
`;

/* ── Holdings ── */

const HoldingRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.6rem 0;
  border-bottom: 1px solid rgba(255,255,255,0.03);
  cursor: pointer;
  &:last-child { border-bottom: none; }
`;

const HoldingSymbol = styled.div`font-weight: 700; color: white; font-size: 0.85rem;`;
const HoldingShares = styled.div`color: rgba(255,255,255,0.3); font-size: 0.75rem;`;
const HoldingTotal = styled.div`font-weight: 700; color: white; font-size: 0.85rem;`;
const HoldingPnl = styled.div`font-size: 0.75rem; font-weight: 600; color: ${p => p.$pos ? '#4ade80' : '#f87171'};`;

/* ── Transaction history ── */

const TransactionRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(255,255,255,0.03);
  font-size: 0.8rem;
  &:last-child { border-bottom: none; }
`;

const TxBadge = styled.span`
  font-weight: 700; font-size: 0.7rem; padding: 0.1rem 0.4rem; border-radius: 4px;
  color: ${p => p.$type === 'BUY' ? '#4ade80' : '#f87171'};
  background: ${p => p.$type === 'BUY' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)'};
`;

const DecisionBadge = styled.span`
  font-weight: 700; font-size: 0.65rem; padding: 0.1rem 0.4rem; border-radius: 4px;
  margin-left: 0.4rem;
  color: ${p =>
    p.$rating === 'good' ? '#22c55e' :
    p.$rating === 'caution' ? '#f59e0b' : '#ef4444'};
  background: ${p =>
    p.$rating === 'good' ? 'rgba(34,197,94,0.1)' :
    p.$rating === 'caution' ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)'};
`;

/* ── Portfolio Health ── */

const HealthScoreCircle = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  border: 3px solid ${p =>
    p.$score >= 75 ? '#22c55e' :
    p.$score >= 50 ? '#f59e0b' :
    p.$score >= 25 ? '#f97316' : '#ef4444'};
  background: ${p =>
    p.$score >= 75 ? 'rgba(34,197,94,0.06)' :
    p.$score >= 50 ? 'rgba(245,158,11,0.06)' :
    p.$score >= 25 ? 'rgba(249,115,22,0.06)' : 'rgba(239,68,68,0.06)'};
`;

const ScoreNum = styled.div`font-size: 1.6rem; font-weight: 800; color: #111; line-height: 1; letter-spacing: -0.02em;`;
const ScoreLabel = styled.div`font-size: 0.6rem; color: #555; text-transform: uppercase; font-weight: 700;`;

const BreakdownRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.4rem 0;
  border-bottom: 1px solid rgba(255,255,255,0.03);
  &:last-child { border-bottom: none; }
`;

const BreakdownLabel = styled.div`font-size: 0.78rem; color: rgba(255,255,255,0.5);`;
const BreakdownValue = styled.div`font-size: 0.78rem; font-weight: 700; color: white;`;

const HealthBar = styled.div`
  width: 100%;
  height: 4px;
  border-radius: 2px;
  background: rgba(255,255,255,0.06);
  margin-top: 0.2rem;
  overflow: hidden;
`;

const HealthBarFill = styled.div`
  height: 100%;
  border-radius: 2px;
  width: ${p => p.$pct}%;
  background: ${p =>
    p.$pct >= 75 ? '#22c55e' :
    p.$pct >= 50 ? '#f59e0b' : '#ef4444'};
  transition: width 0.5s;
`;

const HealthRating = styled.div`
  text-align: center;
  font-size: 1rem;
  font-weight: 800;
  margin-top: 0.85rem;
  letter-spacing: -0.01em;
  color: ${p =>
    p.$level === 'Excellent' ? '#22c55e' :
    p.$level === 'Good' ? '#15803d' :
    p.$level === 'Fair' ? '#f59e0b' : '#ef4444'};
`;

const HealthTip = styled.div`
  margin-top: 0.85rem;
  padding: 0.85rem 1rem;
  background: rgba(34,197,94,0.08);
  border: 1px solid rgba(34,197,94,0.2);
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 600;
  color: #111;
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  line-height: 1.5;
  border-left: 3px solid #22c55e;
  svg { flex-shrink: 0; color: #22c55e; margin-top: 3px; }
`;

/* ── Misc ── */

const EmptyState = styled.div`
  text-align: center; padding: 1.5rem;
  color: rgba(255,255,255,0.25); font-size: 0.85rem;
`;

const Notification = styled(motion.div)`
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background: #fff;
  border: 1px solid ${p => p.$type === 'success' ? 'rgba(34,197,94,0.4)' : 'rgba(239,68,68,0.4)'};
  color: #111;
  padding: 0.7rem 1.25rem;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 600;
  box-shadow: 0 8px 30px rgba(0,0,0,0.15);
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

/* ───────── helpers ───────── */

const INITIAL_BALANCE = 100000;

function rateDecision(stock, shares, holdings, balance, totalValue) {
  const signals = [];
  const cost = stock.price * shares;
  const positionPct = (cost / totalValue) * 100;

  if (positionPct > 40) {
    signals.push({ type: 'bad', text: `This single trade is ${positionPct.toFixed(0)}% of your portfolio — very concentrated` });
  } else if (positionPct > 25) {
    signals.push({ type: 'caution', text: `This position is ${positionPct.toFixed(0)}% of your portfolio — consider keeping positions under 25%` });
  } else {
    signals.push({ type: 'good', text: `Good position sizing at ${positionPct.toFixed(0)}% of portfolio` });
  }

  const existingHolding = holdings.find(h => h.symbol === stock.symbol);
  if (existingHolding) {
    const totalInStock = (existingHolding.shares * stock.price + cost) / totalValue * 100;
    if (totalInStock > 40) {
      signals.push({ type: 'bad', text: `You'll have ${totalInStock.toFixed(0)}% in ${stock.symbol} — over-concentrated` });
    }
  }

  const uniqueStocks = new Set([...holdings.map(h => h.symbol), stock.symbol]);
  if (uniqueStocks.size >= 5) {
    signals.push({ type: 'good', text: 'Well-diversified across ' + uniqueStocks.size + ' stocks' });
  } else if (uniqueStocks.size >= 3) {
    signals.push({ type: 'good', text: 'Building diversification with ' + uniqueStocks.size + ' stocks' });
  } else if (uniqueStocks.size === 1) {
    signals.push({ type: 'caution', text: 'Only 1 stock — consider diversifying across sectors' });
  }

  const sectors = new Set(
    [...holdings.map(h => stocks.find(s => s.symbol === h.symbol)?.sector), stock.sector].filter(Boolean)
  );
  if (sectors.size >= 3) {
    signals.push({ type: 'good', text: `Spread across ${sectors.size} sectors — great diversification` });
  } else if (sectors.size === 1) {
    signals.push({ type: 'caution', text: 'All investments in one sector — add another sector' });
  }

  if (stock.pe > 50) {
    signals.push({ type: 'caution', text: `${stock.symbol} has a high P/E of ${stock.pe} — priced for aggressive growth` });
  } else if (stock.pe < 20 && stock.dividend > 1) {
    signals.push({ type: 'good', text: `${stock.symbol} is a value pick with ${stock.dividend}% dividend yield` });
  }

  const cashAfter = balance - cost;
  const cashPct = (cashAfter / totalValue) * 100;
  if (cashPct < 5) {
    signals.push({ type: 'caution', text: 'Very low cash reserves — keep some for opportunities' });
  }

  const bads = signals.filter(s => s.type === 'bad').length;
  const cautions = signals.filter(s => s.type === 'caution').length;
  const rating = bads > 0 ? 'risk' : cautions >= 2 ? 'caution' : 'good';

  return { rating, signals };
}

function rateSellDecision(stock, shares, holding, balance, totalValue) {
  const signals = [];
  const proceeds = stock.price * shares;

  if (holding) {
    const pnl = (stock.price - holding.avgPrice) * shares;
    const pnlPct = ((stock.price - holding.avgPrice) / holding.avgPrice * 100).toFixed(1);
    if (pnl >= 0) {
      signals.push({ type: 'good', text: `Taking profit: +$${pnl.toFixed(2)} (${pnlPct}%) on this sale` });
    } else {
      signals.push({ type: 'caution', text: `Selling at a loss: -$${Math.abs(pnl).toFixed(2)} (${pnlPct}%) on this sale` });
    }
  }

  const cashAfter = balance + proceeds;
  const cashPct = (cashAfter / totalValue) * 100;
  if (cashPct > 80) {
    signals.push({ type: 'caution', text: `Cash will be ${cashPct.toFixed(0)}% of portfolio — consider reinvesting` });
  } else {
    signals.push({ type: 'good', text: `Healthy cash position at ${cashPct.toFixed(0)}% after sale` });
  }

  const cautions = signals.filter(s => s.type === 'caution').length;
  const rating = cautions >= 2 ? 'caution' : 'good';
  return { rating, signals };
}

function calcHealthScore(holdings, balance, totalValue) {
  const holdingsCount = holdings.length;
  const sectorSet = new Set(
    holdings.map(h => stocks.find(s => s.symbol === h.symbol)?.sector).filter(Boolean)
  );
  const sectorCount = sectorSet.size;

  const diversificationScore = Math.min(holdingsCount * 10, 30);
  const sectorScore = Math.min(sectorCount * 10, 30);

  let maxPositionPct = 0;
  holdings.forEach(h => {
    const st = stocks.find(s => s.symbol === h.symbol);
    if (st && totalValue > 0) {
      const pct = (st.price * h.shares) / totalValue * 100;
      if (pct > maxPositionPct) maxPositionPct = pct;
    }
  });
  const concentrationScore = maxPositionPct <= 30 ? 25 : maxPositionPct <= 50 ? 15 : 5;

  const cashPct = totalValue > 0 ? (balance / totalValue) * 100 : 100;
  const cashScore = (cashPct >= 5 && cashPct <= 40) ? 15 : cashPct > 40 ? 10 : 5;

  const total = diversificationScore + sectorScore + concentrationScore + cashScore;

  const allSectors = new Set(stocks.map(s => s.sector));
  const heldSectors = sectorSet;
  const missingSectors = [...allSectors].filter(s => !heldSectors.has(s));

  let level = 'Poor';
  if (total >= 80) level = 'Excellent';
  else if (total >= 60) level = 'Good';
  else if (total >= 40) level = 'Fair';

  let tip = '';
  if (holdingsCount === 0) {
    tip = 'Start trading to build your portfolio!';
  } else if (missingSectors.length > 0 && sectorCount < 3) {
    tip = `Add stocks from ${missingSectors[0]} for better diversification`;
  } else if (maxPositionPct > 30) {
    tip = 'Reduce your largest position to under 30% for better balance';
  } else if (cashPct > 60) {
    tip = 'Put some of that cash to work — diversify across sectors';
  } else if (total >= 80) {
    tip = 'Great portfolio balance! Keep monitoring your positions.';
  } else {
    tip = 'Add more stocks from different sectors to improve your score';
  }

  return {
    total,
    diversificationScore,
    sectorScore,
    concentrationScore,
    cashScore,
    level,
    tip,
  };
}

const ratingMeta = {
  good: { icon: <FaCheckCircle />, label: 'Good Decision' },
  caution: { icon: <FaExclamationTriangle />, label: 'Caution' },
  risk: { icon: <FaTimesCircle />, label: 'High Risk' },
};

/* ───────── component ───────── */

const DemoTrading = () => {
  const [balance, setBalance] = useState(INITIAL_BALANCE);
  const [holdings, setHoldings] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selectedStock, setSelectedStock] = useState(stocks[0]);
  const [tradeQuantity, setTradeQuantity] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [assetFilter, setAssetFilter] = useState('all');
  const [notification, setNotification] = useState(null);
  const [useLocal, setUseLocal] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const loadPortfolio = useCallback(async () => {
    try {
      const data = await api.getPortfolio();
      setBalance(data.balance);
      setHoldings(data.holdings);
      setTransactions(data.transactions);
    } catch {
      setUseLocal(true);
      const sb = localStorage.getItem('bloomvest_balance');
      const sh = localStorage.getItem('bloomvest_holdings');
      const st = localStorage.getItem('bloomvest_transactions');
      if (sb) setBalance(parseFloat(sb));
      if (sh) setHoldings(JSON.parse(sh));
      if (st) setTransactions(JSON.parse(st));
    }
  }, []);

  useEffect(() => { loadPortfolio(); }, [loadPortfolio]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const saveLocal = (b, h, t) => {
    localStorage.setItem('bloomvest_balance', b.toString());
    localStorage.setItem('bloomvest_holdings', JSON.stringify(h));
    localStorage.setItem('bloomvest_transactions', JSON.stringify(t));
  };

  const showFeedback = (result) => {
    setFeedback(result);
    const timer = setTimeout(() => setFeedback(null), 15000);
    return () => clearTimeout(timer);
  };

  const executeTrade = async (type) => {
    const qty = parseInt(tradeQuantity);
    if (!qty || qty <= 0) return;
    const totalCost = qty * selectedStock.price;

    if (!useLocal) {
      try {
        const data = await api.trade(type, selectedStock.symbol, qty, selectedStock.price);
        setBalance(data.balance);
        setHoldings(data.holdings);

        let decision;
        if (type === 'BUY') {
          decision = rateDecision(selectedStock, qty, holdings, balance, balance + portfolioValue);
        } else {
          const holding = holdings.find(h => h.symbol === selectedStock.symbol);
          decision = rateSellDecision(selectedStock, qty, holding, balance, balance + portfolioValue);
        }
        showFeedback(decision);

        const txEntry = {
          type, symbol: selectedStock.symbol, shares: qty,
          price: selectedStock.price, total: totalCost,
          date: new Date().toISOString(), decision: decision.rating,
        };
        setTransactions(prev => [txEntry, ...prev].slice(0, 50));
        showNotification(`${type === 'BUY' ? 'Bought' : 'Sold'} ${qty} shares of ${selectedStock.symbol} for $${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}`);
        loadPortfolio();
        setTradeQuantity('');
        return;
      } catch {
        setUseLocal(true);
      }
    }

    if (type === 'BUY') {
      if (balance < totalCost) { showNotification('Insufficient funds', 'error'); return; }
      const nb = balance - totalCost;
      const ei = holdings.findIndex(h => h.symbol === selectedStock.symbol);
      let nh = [...holdings];
      if (ei >= 0) {
        const o = nh[ei];
        const ts = o.shares + qty;
        nh[ei] = { ...o, shares: ts, avgPrice: (o.avgPrice * o.shares + totalCost) / ts };
      } else {
        nh.push({ symbol: selectedStock.symbol, shares: qty, avgPrice: selectedStock.price });
      }

      const decision = rateDecision(selectedStock, qty, holdings, balance, totalValue);
      showFeedback(decision);

      const nt = [{
        type: 'BUY', symbol: selectedStock.symbol, shares: qty,
        price: selectedStock.price, total: totalCost,
        date: new Date().toISOString(), decision: decision.rating,
      }, ...transactions].slice(0, 50);
      setBalance(nb); setHoldings(nh); setTransactions(nt); saveLocal(nb, nh, nt);
      showNotification(`Bought ${qty} shares of ${selectedStock.symbol} for $${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}`);
    } else {
      const ei = holdings.findIndex(h => h.symbol === selectedStock.symbol);
      if (ei < 0 || holdings[ei].shares < qty) { showNotification('Not enough shares', 'error'); return; }
      const nb = balance + totalCost;
      let nh = [...holdings];
      const holding = nh[ei];
      if (nh[ei].shares === qty) nh.splice(ei, 1);
      else nh[ei] = { ...nh[ei], shares: nh[ei].shares - qty };

      const decision = rateSellDecision(selectedStock, qty, holding, balance, totalValue);
      showFeedback(decision);

      const nt = [{
        type: 'SELL', symbol: selectedStock.symbol, shares: qty,
        price: selectedStock.price, total: totalCost,
        date: new Date().toISOString(), decision: decision.rating,
      }, ...transactions].slice(0, 50);
      setBalance(nb); setHoldings(nh); setTransactions(nt); saveLocal(nb, nh, nt);
      showNotification(`Sold ${qty} shares of ${selectedStock.symbol} for $${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}`);
    }
    setTradeQuantity('');
  };

  const resetPortfolio = async () => {
    try {
      if (!useLocal) await api.resetPortfolio();
    } catch { /* fallback below */ }
    setBalance(INITIAL_BALANCE);
    setHoldings([]);
    setTransactions([]);
    setFeedback(null);
    localStorage.removeItem('bloomvest_balance');
    localStorage.removeItem('bloomvest_holdings');
    localStorage.removeItem('bloomvest_transactions');
    showNotification('Portfolio reset to $100,000');
  };

  const portfolioValue = holdings.reduce((total, h) => {
    const stock = stocks.find(s => s.symbol === h.symbol);
    return total + (stock ? stock.price * h.shares : 0);
  }, 0);

  const totalValue = balance + portfolioValue;
  const totalPnl = totalValue - INITIAL_BALANCE;
  const totalPnlPercent = ((totalPnl / INITIAL_BALANCE) * 100).toFixed(2);

  const filteredStocks = stocks.filter(s => {
    const matchesSearch = s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (assetFilter === 'all') return matchesSearch;
    const ac = assetClasses.find(a => a.id === assetFilter);
    return matchesSearch && ac?.sectors?.includes(s.sector);
  });

  const currentHolding = holdings.find(h => h.symbol === selectedStock.symbol);
  const tradeCost = parseInt(tradeQuantity) > 0 ? parseInt(tradeQuantity) * selectedStock.price : 0;

  const health = calcHealthScore(holdings, balance, totalValue);

  return (
    <PageContainer>
      {/* ── Header ── */}
      <HeaderSection>
        <HeaderInner>
          <HeaderTop>
            <HeaderLeft>
              <HeaderTitle>Practice <span>Trading</span></HeaderTitle>
              <HeaderSubtitle>
                Your personal sandbox — trade freely, build skills at your own pace. No objectives, no pressure.
              </HeaderSubtitle>
              <ModeBadge>🎯 Self-Practice Mode</ModeBadge>
            </HeaderLeft>
            <IndicesRow>
              {marketIndices.map(idx => (
                <IndexChip key={idx.name}>
                  <IndexName>{idx.name}</IndexName>
                  <IndexVal>{idx.value.toLocaleString()}</IndexVal>
                  <IndexChg $pos={idx.changePercent >= 0}>
                    {idx.changePercent >= 0 ? '+' : ''}{idx.changePercent}%
                  </IndexChg>
                </IndexChip>
              ))}
            </IndicesRow>
          </HeaderTop>
        </HeaderInner>
      </HeaderSection>

      {/* ── Portfolio Stats ── */}
      <PortfolioBar>
        <PortfolioCard>
          <PortfolioStat>
            <StatLabel>Total Value</StatLabel>
            <StatValue>${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</StatValue>
          </PortfolioStat>
          <PortfolioStat>
            <StatLabel>Cash</StatLabel>
            <StatValue>${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</StatValue>
          </PortfolioStat>
          <PortfolioStat>
            <StatLabel>Invested</StatLabel>
            <StatValue>${portfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</StatValue>
          </PortfolioStat>
          <PortfolioStat>
            <StatLabel>P&L</StatLabel>
            <StatValue $color={totalPnl >= 0 ? '#4ade80' : '#f87171'}>
              {totalPnl >= 0 ? '+' : ''}{totalPnlPercent}%
            </StatValue>
          </PortfolioStat>
          <PortfolioStat>
            <StatLabel>Health Score</StatLabel>
            <StatValue $color={
              health.total >= 75 ? '#22c55e' :
              health.total >= 50 ? '#f59e0b' :
              health.total >= 25 ? '#f97316' : '#ef4444'
            }>
              {health.total}/100
            </StatValue>
          </PortfolioStat>
          <ResetBtn onClick={resetPortfolio}><FaSync /> Reset</ResetBtn>
        </PortfolioCard>
      </PortfolioBar>

      {/* ── Main Content ── */}
      <MainContent>
        <LeftCol>
          {/* Stock Chart Card */}
          <Card>
            <CardHeader>
              <CardTitle><FaChartLine /> {selectedStock.symbol} — {selectedStock.name}</CardTitle>
            </CardHeader>
            <CardBody>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>{selectedStock.sector}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <BigPrice>${selectedStock.price.toFixed(2)}</BigPrice>
                  <BigChange $pos={selectedStock.change >= 0}>
                    {selectedStock.change >= 0 ? '+' : ''}{selectedStock.change.toFixed(2)} ({selectedStock.changePercent >= 0 ? '+' : ''}{selectedStock.changePercent}%)
                  </BigChange>
                </div>
              </div>

              <ChartContainer>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={selectedStock.historicalPrices}>
                    <defs>
                      <linearGradient id="practiceGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.25)' }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                    <YAxis tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.25)' }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
                    <Tooltip
                      contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '0.8rem', color: 'white' }}
                      formatter={v => [`$${v.toFixed(2)}`, 'Price']}
                    />
                    <Area type="monotone" dataKey="price" stroke="#22c55e" strokeWidth={2} fill="url(#practiceGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>

              <MetricsRow>
                <MetricBox><MetricLabel>P/E Ratio</MetricLabel><MetricValue>{selectedStock.pe}</MetricValue></MetricBox>
                <MetricBox><MetricLabel>Div Yield</MetricLabel><MetricValue>{selectedStock.dividend}%</MetricValue></MetricBox>
                <MetricBox><MetricLabel>Mkt Cap</MetricLabel><MetricValue>{selectedStock.marketCap}</MetricValue></MetricBox>
                <MetricBox><MetricLabel>Shares Held</MetricLabel><MetricValue>{currentHolding ? currentHolding.shares : 0}</MetricValue></MetricBox>
              </MetricsRow>

              {/* Trade Form */}
              <TradeForm>
                <TradeRow>
                  <TradeInput
                    type="number"
                    placeholder="Quantity"
                    value={tradeQuantity}
                    onChange={e => setTradeQuantity(e.target.value)}
                    min="1"
                  />
                  <TradeButton className="buy" onClick={() => executeTrade('BUY')} disabled={!tradeQuantity || parseInt(tradeQuantity) <= 0}>
                    <FaShoppingCart /> Buy
                  </TradeButton>
                  <TradeButton className="sell" onClick={() => executeTrade('SELL')} disabled={!tradeQuantity || parseInt(tradeQuantity) <= 0}>
                    Sell
                  </TradeButton>
                </TradeRow>
                {tradeCost > 0 && (
                  <TradeCost>Total: <span>${tradeCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></TradeCost>
                )}
              </TradeForm>
            </CardBody>
          </Card>

          {/* Decision Feedback Card */}
          <AnimatePresence>
            {feedback && (
              <FeedbackCard
                $rating={feedback.rating}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <FeedbackHeader $rating={feedback.rating}>
                  <FeedbackTitle $rating={feedback.rating}>
                    {ratingMeta[feedback.rating].icon}
                    {ratingMeta[feedback.rating].label}
                  </FeedbackTitle>
                  <DismissBtn onClick={() => setFeedback(null)}><FaTimes /></DismissBtn>
                </FeedbackHeader>
                <FeedbackBody>
                  {feedback.signals.map((sig, i) => (
                    <SignalItem key={i}>
                      <SignalDot $type={sig.type} />
                      <span>{sig.text}</span>
                    </SignalItem>
                  ))}
                </FeedbackBody>
              </FeedbackCard>
            )}
          </AnimatePresence>

          {/* Transaction History */}
          <Card>
            <CardHeader><CardTitle><FaHistory /> Transaction History</CardTitle></CardHeader>
            <CardBody>
              {transactions.length === 0 ? (
                <EmptyState>No transactions yet — start trading!</EmptyState>
              ) : (
                transactions.slice(0, 10).map((tx, i) => (
                  <TransactionRow key={i}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <TxBadge $type={tx.type}>{tx.type}</TxBadge>
                      <span style={{ fontWeight: 700, color: 'white' }}>{tx.symbol}</span>
                      <span style={{ color: 'rgba(255,255,255,0.3)' }}>{tx.shares}×${tx.price.toFixed(2)}</span>
                      {tx.decision && (
                        <DecisionBadge $rating={tx.decision}>
                          {tx.decision === 'good' ? '✅ Good' : tx.decision === 'caution' ? '⚠️ Caution' : '❌ Risk'}
                        </DecisionBadge>
                      )}
                    </div>
                    <span style={{ fontWeight: 600, color: 'white' }}>
                      ${tx.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </TransactionRow>
                ))
              )}
            </CardBody>
          </Card>
        </LeftCol>

        <RightCol>
          {/* Market Card */}
          <Card>
            <CardHeader><CardTitle><FaSearch /> Market</CardTitle></CardHeader>
            <CardBody>
              <div style={{display:'flex',flexWrap:'wrap',gap:'0.3rem',marginBottom:'0.6rem'}}>
                {assetClasses.map(ac => (
                  <button key={ac.id} onClick={() => setAssetFilter(ac.id)}
                    style={{padding:'0.25rem 0.55rem',borderRadius:6,border: assetFilter === ac.id ? '1px solid rgba(34,197,94,0.4)' : '1px solid rgba(255,255,255,0.06)',
                      background: assetFilter === ac.id ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.02)',
                      color: assetFilter === ac.id ? '#4ade80' : 'rgba(255,255,255,0.4)',
                      fontSize:'0.68rem',fontWeight:600,cursor:'pointer',transition:'all 0.2s'}}>
                    {ac.icon} {ac.label}
                  </button>
                ))}
              </div>
              <SearchBar>
                <FaSearch style={{ color: 'rgba(255,255,255,0.2)' }} />
                <SearchInput placeholder="Search assets..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
              </SearchBar>
              <StockList>
                {filteredStocks.map(stock => (
                  <StockRow
                    key={stock.symbol}
                    onClick={() => setSelectedStock(stock)}
                    $active={selectedStock.symbol === stock.symbol}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <div>
                      <StockSymbol>{stock.symbol}</StockSymbol>
                      <StockName>{stock.name}</StockName>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <PriceValue>${stock.price.toFixed(2)}</PriceValue>
                      <PriceChange $pos={stock.change >= 0}>
                        {stock.change >= 0 ? <FaArrowUp /> : <FaArrowDown />}
                        {Math.abs(stock.changePercent)}%
                      </PriceChange>
                    </div>
                  </StockRow>
                ))}
              </StockList>
            </CardBody>
          </Card>

          {/* Holdings Card */}
          <Card>
            <CardHeader><CardTitle><FaWallet /> Holdings</CardTitle></CardHeader>
            <CardBody>
              {holdings.length === 0 ? (
                <EmptyState>No holdings yet</EmptyState>
              ) : (
                holdings.map(h => {
                  const stock = stocks.find(s => s.symbol === h.symbol);
                  const cv = stock ? stock.price * h.shares : 0;
                  const cb = h.avgPrice * h.shares;
                  const pnl = cv - cb;
                  return (
                    <HoldingRow key={h.symbol} onClick={() => { const s = stocks.find(st => st.symbol === h.symbol); if (s) setSelectedStock(s); }}>
                      <div>
                        <HoldingSymbol>{h.symbol}</HoldingSymbol>
                        <HoldingShares>{h.shares} @ ${h.avgPrice.toFixed(2)}</HoldingShares>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <HoldingTotal>${cv.toLocaleString(undefined, { minimumFractionDigits: 2 })}</HoldingTotal>
                        <HoldingPnl $pos={pnl >= 0}>{pnl >= 0 ? '+' : ''}${pnl.toFixed(2)}</HoldingPnl>
                      </div>
                    </HoldingRow>
                  );
                })
              )}
            </CardBody>
          </Card>

          {/* Portfolio Health Card */}
          <Card>
            <CardHeader><CardTitle><FaHeartbeat /> Portfolio Health</CardTitle></CardHeader>
            <CardBody>
              <HealthScoreCircle $score={health.total}>
                <ScoreNum>{health.total}</ScoreNum>
                <ScoreLabel>/ 100</ScoreLabel>
              </HealthScoreCircle>

              <BreakdownRow>
                <BreakdownLabel>Diversification</BreakdownLabel>
                <BreakdownValue>{health.diversificationScore}/30</BreakdownValue>
              </BreakdownRow>
              <HealthBar><HealthBarFill $pct={(health.diversificationScore / 30) * 100} /></HealthBar>

              <BreakdownRow>
                <BreakdownLabel>Sector Balance</BreakdownLabel>
                <BreakdownValue>{health.sectorScore}/30</BreakdownValue>
              </BreakdownRow>
              <HealthBar><HealthBarFill $pct={(health.sectorScore / 30) * 100} /></HealthBar>

              <BreakdownRow>
                <BreakdownLabel>Concentration</BreakdownLabel>
                <BreakdownValue>{health.concentrationScore}/25</BreakdownValue>
              </BreakdownRow>
              <HealthBar><HealthBarFill $pct={(health.concentrationScore / 25) * 100} /></HealthBar>

              <BreakdownRow>
                <BreakdownLabel>Cash Management</BreakdownLabel>
                <BreakdownValue>{health.cashScore}/15</BreakdownValue>
              </BreakdownRow>
              <HealthBar><HealthBarFill $pct={(health.cashScore / 15) * 100} /></HealthBar>

              <HealthRating $level={health.level}>{health.level}</HealthRating>

              <HealthTip>
                <FaInfoCircle />
                <span>{health.tip}</span>
              </HealthTip>
            </CardBody>
          </Card>
        </RightCol>
      </MainContent>

      {/* Notification toast */}
      <AnimatePresence>
        {notification && (
          <Notification
            $type={notification.type}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
          >
            {notification.type === 'success'
              ? <FaCheckCircle style={{ color: '#4ade80' }} />
              : <FaInfoCircle style={{ color: '#f87171' }} />}
            {notification.message}
          </Notification>
        )}
      </AnimatePresence>
    </PageContainer>
  );
};

export default DemoTrading;
