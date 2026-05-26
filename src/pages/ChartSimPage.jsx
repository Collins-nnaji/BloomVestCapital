import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ComposedChart, Area, Bar, Cell, Line, XAxis, YAxis,
  Tooltip, ResponsiveContainer, ReferenceLine, CartesianGrid,
} from 'recharts';
import {
  FaRobot, FaPaperPlane, FaChartLine, FaChartBar, FaArrowUp, FaArrowDown,
  FaBolt, FaSpinner, FaCheckCircle, FaTimes, FaSearch, FaSlidersH,
  FaInfoCircle, FaHistory, FaWallet, FaFire, FaChevronDown, FaChevronUp,
  FaLayerGroup, FaExpand, FaCompress, FaBookOpen, FaLightbulb,
} from 'react-icons/fa';
import { stocks, marketIndices } from '../data/stockData';
import { api } from '../api';
import { useAuth } from '../AuthContext';

/* ─────────────────────────────────────────────────────────────
   HELPERS — OHLC generation, indicators, price simulation
───────────────────────────────────────────────────────────── */

function generateOHLC(prices) {
  return prices.map((p, i) => {
    const prevClose = prices[i - 1]?.price ?? p.price * (1 - 0.005);
    const open = +prevClose.toFixed(2);
    const close = p.price;
    const bodyRange = Math.abs(close - open);
    const wickExtra = bodyRange * (0.4 + Math.random() * 0.8);
    const high = +(Math.max(open, close) + wickExtra * (0.3 + Math.random() * 0.7)).toFixed(2);
    const low = +(Math.min(open, close) - wickExtra * (0.2 + Math.random() * 0.6)).toFixed(2);
    return {
      date: p.date,
      open,
      close,
      high,
      low,
      volume: p.volume,
      bullish: close >= open,
    };
  });
}

function computeSMA(data, period) {
  return data.map((_, i) => {
    if (i < period - 1) return null;
    return +(data.slice(i - period + 1, i + 1).reduce((s, d) => s + d.close, 0) / period).toFixed(2);
  });
}

function computeBB(data, period = 20, k = 2) {
  const sma = computeSMA(data, period);
  return data.map((_, i) => {
    if (sma[i] === null) return { mid: null, upper: null, lower: null };
    const slice = data.slice(i - period + 1, i + 1).map(d => d.close);
    const mean = sma[i];
    const std = Math.sqrt(slice.reduce((s, x) => s + (x - mean) ** 2, 0) / period);
    return { mid: +mean.toFixed(2), upper: +(mean + k * std).toFixed(2), lower: +(mean - k * std).toFixed(2) };
  });
}

function computeRSI(data, period = 14) {
  if (data.length < period + 1) return data.map(() => null);
  const rsi = data.map(() => null);
  let gains = 0, losses = 0;
  for (let i = 1; i <= period; i++) {
    const diff = data[i].close - data[i - 1].close;
    if (diff >= 0) gains += diff; else losses -= diff;
  }
  let avgGain = gains / period;
  let avgLoss = losses / period;
  rsi[period] = +(100 - 100 / (1 + avgGain / (avgLoss || 0.0001))).toFixed(2);
  for (let i = period + 1; i < data.length; i++) {
    const diff = data[i].close - data[i - 1].close;
    avgGain = (avgGain * (period - 1) + Math.max(diff, 0)) / period;
    avgLoss = (avgLoss * (period - 1) + Math.max(-diff, 0)) / period;
    rsi[i] = +(100 - 100 / (1 + avgGain / (avgLoss || 0.0001))).toFixed(2);
  }
  return rsi;
}

function computeMACD(data) {
  const ema = (d, n) => {
    const k = 2 / (n + 1);
    return d.reduce((acc, v, i) => {
      if (i === 0) return [v.close];
      acc.push(v.close * k + acc[i - 1] * (1 - k));
      return acc;
    }, []);
  };
  const ema12 = ema(data, 12);
  const ema26 = ema(data, 26);
  return data.map((_, i) => (i < 25 ? null : +(ema12[i] - ema26[i]).toFixed(3)));
}

function buildChartData(ohlc, indicators) {
  const sma20 = computeSMA(ohlc, 20);
  const sma50 = computeSMA(ohlc, 50);
  const bb = computeBB(ohlc, 20, 2);
  const rsiVals = computeRSI(ohlc, 14);
  const macdVals = computeMACD(ohlc);
  return ohlc.map((d, i) => ({
    ...d,
    // Range array [min, max] tells recharts Bar to render a floating bar
    wickRange: [d.low, d.high],
    sma20: sma20[i],
    sma50: sma50[i],
    bbUpper: bb[i].upper,
    bbMid: bb[i].mid,
    bbLower: bb[i].lower,
    rsi: rsiVals[i],
    macd: macdVals[i],
  }));
}

function sliceByTimeframe(prices, tf) {
  const n = { '1W': 7, '1M': 30, '3M': 60, '6M': 90 }[tf] ?? 90;
  return prices.slice(-n);
}

function fmt(n) {
  return n?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? '--';
}

function fmtDollar(n) {
  const abs = Math.abs(n);
  const s = abs >= 1e9 ? (abs / 1e9).toFixed(1) + 'B'
    : abs >= 1e6 ? (abs / 1e6).toFixed(1) + 'M'
    : abs.toFixed(2);
  return (n < 0 ? '-$' : '$') + s;
}

const TIMEFRAMES = ['1W', '1M', '3M', '6M'];
const WATCHLIST_DEFAULTS = ['AAPL', 'MSFT', 'NVDA', 'GOOGL', 'AMZN', 'SPY', 'TSLA', 'IBIT'];

const AI_PROMPTS = [
  'Is this a good entry point?',
  'What does the RSI tell us?',
  'Spot any chart patterns?',
  'Suggest a stop-loss level.',
  'Compare SMA 20 vs SMA 50.',
  'How does volume confirm this move?',
];

/* ─────────────────────────────────────────────────────────────
   CUSTOM CANDLESTICK SHAPE
   Uses recharts <Bar dataKey="wickRange"> floating bar.
   The bar rect spans low→high; we derive body from payload.
───────────────────────────────────────────────────────────── */

const CandlestickShape = (props) => {
  const { x, y, width, height, payload } = props;
  if (!payload || !height || height <= 0) return null;

  const { open, close, high, low, bullish } = payload;
  const priceRange = high - low;
  if (!priceRange) return null;

  const color = bullish ? '#22c55e' : '#ef4444';
  const centerX = x + width / 2;
  const pxPerUnit = height / priceRange;

  // Body position relative to the wick bar top (y = pixel of high price)
  const bodyTop = y + (high - Math.max(open, close)) * pxPerUnit;
  const bodyH = Math.max(1, Math.abs(close - open) * pxPerUnit);
  const bodyW = Math.max(3, Math.min(14, width * 0.72));

  return (
    <g>
      <line x1={centerX} y1={y} x2={centerX} y2={y + height} stroke={color} strokeWidth={1} opacity={0.65} />
      <rect x={centerX - bodyW / 2} y={bodyTop} width={bodyW} height={bodyH} fill={color} fillOpacity={0.9} rx={0.5} />
    </g>
  );
};

/* ─────────────────────────────────────────────────────────────
   STYLED COMPONENTS
───────────────────────────────────────────────────────────── */

const spin = keyframes`from{transform:rotate(0deg)}to{transform:rotate(360deg)}`;
const pulse = keyframes`0%,100%{opacity:.4}50%{opacity:1}`;

const Page = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  background: #080f1e;
  color: #e2e8f0;
  font-family: 'Inter', sans-serif;

  @media (max-width: 768px) {
    height: auto;
    overflow: visible;
  }
`;

const Topbar = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0 1.25rem;
  height: 56px;
  background: #0a1628;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  flex-wrap: wrap;

  @media (max-width: 768px) {
    height: auto;
    padding: 0.75rem 1rem;
    gap: 0.6rem;
  }
`;

const TopStock = styled.div`
  display: flex;
  align-items: center;
  gap: 0.65rem;
`;

const TopSymbol = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.05rem;
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.01em;
`;

const TopName = styled.div`
  font-size: 0.72rem;
  color: rgba(255,255,255,0.35);
  font-weight: 500;
`;

const TopPrice = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.35rem;
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.02em;
`;

const TopChange = styled.div`
  font-size: 0.82rem;
  font-weight: 700;
  color: ${p => p.$pos ? '#22c55e' : '#ef4444'};
  display: flex;
  align-items: center;
  gap: 0.2rem;
`;

const Divider = styled.div`
  width: 1px;
  height: 28px;
  background: rgba(255,255,255,0.08);
  flex-shrink: 0;
`;

const StatPill = styled.div`
  font-size: 0.7rem;
  color: rgba(255,255,255,0.35);
  span { color: rgba(255,255,255,0.75); font-weight: 600; margin-left: 0.2rem; }
`;

const TopSpacer = styled.div`flex: 1;`;

const IndicatorToggle = styled.button`
  padding: 0.28rem 0.65rem;
  border-radius: 6px;
  font-size: 0.68rem;
  font-weight: 700;
  border: 1px solid ${p => p.$active ? p.$color || 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.1)'};
  background: ${p => p.$active ? (p.$color ? p.$color + '22' : 'rgba(99,102,241,0.15)') : 'transparent'};
  color: ${p => p.$active ? (p.$color || '#818cf8') : 'rgba(255,255,255,0.35)'};
  cursor: pointer;
  transition: all 0.15s;
  &:hover { border-color: ${p => p.$color || 'rgba(99,102,241,0.4)'}; color: ${p => p.$color || '#818cf8'}; }
`;

const Body = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: 220px 1fr 320px;
  overflow: hidden;
  min-height: 0;

  @media (max-width: 1280px) {
    grid-template-columns: 180px 1fr 280px;
  }

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    overflow: visible;
  }
`;

/* ── Watchlist ──────────────────────────────── */

const WatchlistPanel = styled.div`
  background: #0a1628;
  border-right: 1px solid rgba(255,255,255,0.05);
  display: flex;
  flex-direction: column;
  overflow: hidden;

  @media (max-width: 900px) {
    display: none;
  }
`;

const WatchlistHeader = styled.div`
  padding: 0.7rem 0.85rem 0.5rem;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
`;

const WatchlistTitle = styled.div`
  font-size: 0.67rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(255,255,255,0.3);
  flex: 1;
`;

const WatchSearchInput = styled.input`
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 6px;
  padding: 0.3rem 0.55rem;
  font-size: 0.72rem;
  color: #e2e8f0;
  outline: none;
  width: 100%;
  margin: 0 0.5rem 0.5rem;
  &::placeholder { color: rgba(255,255,255,0.2); }
  &:focus { border-color: rgba(99,102,241,0.4); }
`;

const WatchList = styled.div`
  flex: 1;
  overflow-y: auto;
  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 3px; }
`;

const WatchItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0.6rem 0.85rem;
  cursor: pointer;
  border-left: 2px solid ${p => p.$active ? '#22c55e' : 'transparent'};
  background: ${p => p.$active ? 'rgba(34,197,94,0.06)' : 'transparent'};
  transition: background 0.12s;
  &:hover { background: rgba(255,255,255,0.04); }
`;

const WatchSym = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.8rem;
  font-weight: 700;
  color: #fff;
  min-width: 42px;
`;

const WatchName = styled.div`
  font-size: 0.62rem;
  color: rgba(255,255,255,0.3);
  line-height: 1.3;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 0 0.35rem;
`;

const WatchPrice = styled.div`
  text-align: right;
`;

const WatchPriceVal = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  color: #e2e8f0;
`;

const WatchChg = styled.div`
  font-size: 0.62rem;
  font-weight: 700;
  color: ${p => p.$pos ? '#22c55e' : '#ef4444'};
`;

/* ── Chart Area ─────────────────────────────── */

const ChartPanel = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 0;
  background: #080f1e;
`;

const ChartToolbar = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.55rem 1rem;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  background: #0a1628;
`;

const TFBtn = styled.button`
  padding: 0.22rem 0.6rem;
  border-radius: 5px;
  font-size: 0.7rem;
  font-weight: 700;
  border: 1px solid ${p => p.$active ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.1)'};
  background: ${p => p.$active ? 'rgba(99,102,241,0.15)' : 'transparent'};
  color: ${p => p.$active ? '#818cf8' : 'rgba(255,255,255,0.35)'};
  cursor: pointer;
  transition: all 0.15s;
  &:hover { border-color: rgba(99,102,241,0.4); color: #818cf8; }
`;

const ChartTypeBtn = styled.button`
  padding: 0.22rem 0.5rem;
  border-radius: 5px;
  font-size: 0.75rem;
  border: 1px solid ${p => p.$active ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.07)'};
  background: ${p => p.$active ? 'rgba(255,255,255,0.08)' : 'transparent'};
  color: ${p => p.$active ? '#fff' : 'rgba(255,255,255,0.3)'};
  cursor: pointer;
  display: flex;
  align-items: center;
`;

const ChartSep = styled.div`width:1px;height:18px;background:rgba(255,255,255,0.07);`;

const ChartMain = styled.div`
  flex: 1;
  min-height: 0;
  position: relative;
`;

const VolPane = styled.div`
  height: 70px;
  flex-shrink: 0;
  border-top: 1px solid rgba(255,255,255,0.04);
`;

const RSIPane = styled.div`
  height: 80px;
  flex-shrink: 0;
  border-top: 1px solid rgba(255,255,255,0.04);
  position: relative;
`;

const PaneLabel = styled.div`
  position: absolute;
  top: 4px;
  left: 10px;
  font-size: 0.6rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(255,255,255,0.2);
  z-index: 1;
  pointer-events: none;
`;

const LiveDot = styled.div`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #22c55e;
  animation: ${pulse} 1.5s ease-in-out infinite;
`;

/* ── Right Panel ────────────────────────────── */

const RightPanel = styled.div`
  background: #0a1628;
  border-left: 1px solid rgba(255,255,255,0.05);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 0;

  @media (max-width: 900px) {
    overflow: visible;
    min-height: 600px;
  }
`;

const RightTabs = styled.div`
  display: flex;
  flex-shrink: 0;
  border-bottom: 1px solid rgba(255,255,255,0.06);
`;

const RTab = styled.button`
  flex: 1;
  padding: 0.65rem 0;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  border: none;
  background: transparent;
  color: ${p => p.$active ? '#fff' : 'rgba(255,255,255,0.25)'};
  border-bottom: 2px solid ${p => p.$active ? '#22c55e' : 'transparent'};
  cursor: pointer;
  transition: all 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  &:hover { color: rgba(255,255,255,0.75); }
`;

const RTabBody = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 3px; }
`;

/* ── Order Entry ───────────────────────────── */

const OrderSection = styled.div`padding: 0.85rem;`;

const SideToggle = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.08);
  margin-bottom: 0.75rem;
`;

const SideBtn = styled.button`
  padding: 0.55rem;
  border: none;
  font-weight: 800;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.15s;
  background: ${p => {
    if (!p.$active) return 'rgba(255,255,255,0.03)';
    return p.$side === 'buy' ? '#16a34a' : '#dc2626';
  }};
  color: ${p => p.$active ? '#fff' : 'rgba(255,255,255,0.3)'};
`;

const OrderTypeRow = styled.div`
  display: flex;
  gap: 0.35rem;
  margin-bottom: 0.7rem;
`;

const OTypeBtn = styled.button`
  padding: 0.28rem 0.7rem;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 700;
  border: 1px solid ${p => p.$active ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.07)'};
  background: ${p => p.$active ? 'rgba(255,255,255,0.08)' : 'transparent'};
  color: ${p => p.$active ? '#fff' : 'rgba(255,255,255,0.3)'};
  cursor: pointer;
`;

const FieldLabel = styled.div`
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(255,255,255,0.3);
  margin-bottom: 0.3rem;
`;

const NumberInput = styled.input`
  width: 100%;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 7px;
  padding: 0.55rem 0.7rem;
  font-size: 0.88rem;
  font-weight: 600;
  color: #e2e8f0;
  outline: none;
  margin-bottom: 0.6rem;
  &:focus { border-color: rgba(99,102,241,0.45); }
  &::placeholder { color: rgba(255,255,255,0.15); }
`;

const OrderSummary = styled.div`
  background: rgba(255,255,255,0.03);
  border-radius: 8px;
  padding: 0.65rem 0.8rem;
  margin-bottom: 0.7rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`;

const SumRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.72rem;
  color: rgba(255,255,255,0.4);
  span:last-child { color: #e2e8f0; font-weight: 600; }
`;

const OrderBtn = styled.button`
  width: 100%;
  padding: 0.7rem;
  border-radius: 8px;
  border: none;
  font-weight: 800;
  font-size: 0.88rem;
  cursor: pointer;
  transition: all 0.15s;
  background: ${p => p.$side === 'buy' ? 'linear-gradient(135deg,#16a34a,#15803d)' : 'linear-gradient(135deg,#dc2626,#b91c1c)'};
  color: #fff;
  box-shadow: ${p => p.$side === 'buy' ? '0 4px 16px rgba(22,163,74,0.3)' : '0 4px 16px rgba(220,38,38,0.3)'};
  &:hover { transform: translateY(-1px); }
  &:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
`;

const BalanceBadge = styled.div`
  font-size: 0.7rem;
  color: rgba(255,255,255,0.3);
  margin-top: 0.45rem;
  text-align: center;
  span { color: #22c55e; font-weight: 700; }
`;

/* ── Positions ─────────────────────────────── */

const PositionsSection = styled.div`padding: 0 0.85rem;`;

const PositionCard = styled.div`
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 9px;
  padding: 0.7rem 0.85rem;
  margin-bottom: 0.5rem;
`;

const PosHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.35rem;
`;

const PosSym = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 800;
  font-size: 0.88rem;
  color: #fff;
`;

const PnlBadge = styled.div`
  font-size: 0.75rem;
  font-weight: 700;
  color: ${p => p.$pos ? '#22c55e' : '#ef4444'};
`;

const PosStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.25rem;
`;

const PosStat = styled.div`
  font-size: 0.62rem;
  color: rgba(255,255,255,0.3);
  span { display: block; color: rgba(255,255,255,0.7); font-weight: 600; margin-top: 1px; font-size: 0.7rem; }
`;

const CloseBtn = styled.button`
  width: 100%;
  margin-top: 0.55rem;
  padding: 0.3rem;
  border-radius: 6px;
  border: 1px solid rgba(239,68,68,0.3);
  background: rgba(239,68,68,0.06);
  color: #f87171;
  font-size: 0.7rem;
  font-weight: 700;
  cursor: pointer;
  &:hover { background: rgba(239,68,68,0.15); }
`;

const NoPositions = styled.div`
  text-align: center;
  padding: 2rem 1rem;
  color: rgba(255,255,255,0.2);
  font-size: 0.82rem;
`;

/* ── Trade History ──────────────────────────── */

const TradeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.6rem 0.85rem;
  border-bottom: 1px solid rgba(255,255,255,0.04);
`;

const TradeSide = styled.div`
  font-size: 0.65rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${p => p.$buy ? '#22c55e' : '#ef4444'};
  min-width: 28px;
`;

const TradeInfo = styled.div`flex: 1;`;
const TradeSym = styled.div`font-size:0.78rem;font-weight:700;color:#e2e8f0;`;
const TradeMeta = styled.div`font-size:0.62rem;color:rgba(255,255,255,0.3);`;
const TradeTotal = styled.div`font-size:0.75rem;font-weight:600;color:rgba(255,255,255,0.6);`;

/* ── AI Panel ───────────────────────────────── */

const AISection = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
`;

const AIMessages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0.75rem 0.85rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 3px; }
`;

const AIMsgBubble = styled.div`
  padding: 0.75rem 0.85rem;
  border-radius: 10px;
  font-size: 0.8rem;
  line-height: 1.65;
  color: rgba(255,255,255,0.8);
  background: ${p => p.$ai ? 'rgba(99,102,241,0.08)' : 'rgba(34,197,94,0.06)'};
  border: 1px solid ${p => p.$ai ? 'rgba(99,102,241,0.18)' : 'rgba(34,197,94,0.12)'};
`;

const AILabel = styled.div`
  font-size: 0.6rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 0.3rem;
  color: ${p => p.$ai ? '#818cf8' : '#22c55e'};
  display: flex;
  align-items: center;
  gap: 0.3rem;
`;

const AIPromptChips = styled.div`
  padding: 0.5rem 0.85rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  border-top: 1px solid rgba(255,255,255,0.04);
`;

const PromptChip = styled.button`
  padding: 0.28rem 0.65rem;
  border-radius: 999px;
  font-size: 0.67rem;
  font-weight: 600;
  border: 1px solid rgba(99,102,241,0.25);
  background: rgba(99,102,241,0.08);
  color: #a5b4fc;
  cursor: pointer;
  transition: all 0.12s;
  &:hover { background: rgba(99,102,241,0.18); }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
`;

const AIInputRow = styled.div`
  display: flex;
  gap: 0.4rem;
  padding: 0.65rem 0.85rem;
  border-top: 1px solid rgba(255,255,255,0.05);
  flex-shrink: 0;
`;

const AIChatInput = styled.input`
  flex: 1;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 8px;
  padding: 0.5rem 0.7rem;
  font-size: 0.78rem;
  color: #e2e8f0;
  outline: none;
  &:focus { border-color: rgba(99,102,241,0.45); }
  &::placeholder { color: rgba(255,255,255,0.2); }
`;

const AISendBtn = styled.button`
  padding: 0.5rem 0.65rem;
  border-radius: 8px;
  border: none;
  background: #4f46e5;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 0.8rem;
  transition: background 0.15s;
  &:hover { background: #4338ca; }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
`;

const Spinner = styled(FaSpinner)`animation: ${spin} 1s linear infinite;`;

const SectionHead = styled.div`
  padding: 0.65rem 0.85rem 0.35rem;
  font-size: 0.62rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(255,255,255,0.2);
  border-bottom: 1px solid rgba(255,255,255,0.04);
`;

const Notification = styled(motion.div)`
  position: fixed;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  background: #0f172a;
  border: 1px solid ${p => p.$type === 'success' ? 'rgba(34,197,94,0.4)' : 'rgba(239,68,68,0.4)'};
  color: ${p => p.$type === 'success' ? '#4ade80' : '#f87171'};
  padding: 0.6rem 1.25rem;
  border-radius: 10px;
  font-size: 0.82rem;
  font-weight: 700;
  box-shadow: 0 8px 32px rgba(0,0,0,0.5);
  z-index: 9999;
  white-space: nowrap;
`;

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────── */

export default function ChartSimPage() {
  const { user } = useAuth();

  // Stock selection
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL');
  const selectedStock = useMemo(
    () => stocks.find(s => s.symbol === selectedSymbol) || stocks[0],
    [selectedSymbol]
  );

  // Live price state (ticks every 2s)
  const [livePrice, setLivePrice] = useState(selectedStock.price);
  const [livePriceDir, setLivePriceDir] = useState(0); // 1 = up, -1 = down
  const liveRef = useRef(selectedStock.price);

  // Chart
  const [timeframe, setTimeframe] = useState('3M');
  const [chartType, setChartType] = useState('candle'); // 'candle' | 'line'
  const [indicators, setIndicators] = useState({ sma20: true, sma50: true, bb: false, rsi: false, volume: true });

  // Right panel
  const [rightTab, setRightTab] = useState('order'); // 'order' | 'positions' | 'history' | 'ai'

  // Order entry
  const [orderSide, setOrderSide] = useState('buy');
  const [orderType, setOrderType] = useState('market');
  const [quantity, setQuantity] = useState('');
  const [limitPrice, setLimitPrice] = useState('');

  // Portfolio
  const [balance, setBalance] = useState(25000);
  const [positions, setPositions] = useState({}); // { AAPL: { shares, avgCost } }
  const [trades, setTrades] = useState([]);

  // AI
  const [aiMessages, setAiMessages] = useState([{
    role: 'ai',
    text: '👋 I\'m your AI trading analyst. Ask me anything about the chart, indicators, or your positions — I\'ll give you real market insight and education.',
  }]);
  const [aiInput, setAiInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  // Watchlist search
  const [watchSearch, setWatchSearch] = useState('');

  // Notification
  const [notification, setNotification] = useState(null);

  const aiMessagesEndRef = useRef(null);

  /* ── Build chart data ── */
  const chartData = useMemo(() => {
    const sliced = sliceByTimeframe(selectedStock.historicalPrices, timeframe);
    const ohlc = generateOHLC(sliced);
    return buildChartData(ohlc, indicators);
  }, [selectedStock, timeframe]);

  // Append live last candle
  const displayData = useMemo(() => {
    if (!chartData.length) return chartData;
    const last = chartData[chartData.length - 1];
    const live = { ...last, close: livePrice, bullish: livePrice >= last.open };
    return [...chartData.slice(0, -1), live];
  }, [chartData, livePrice]);

  /* ── Price tick simulation ── */
  useEffect(() => {
    liveRef.current = selectedStock.price;
    setLivePrice(selectedStock.price);
    setLimitPrice(selectedStock.price.toFixed(2));
  }, [selectedStock]);

  useEffect(() => {
    const iv = setInterval(() => {
      const volatility = selectedStock.historicalPrices.length > 1
        ? Math.abs(selectedStock.historicalPrices[1].price - selectedStock.historicalPrices[0].price) / selectedStock.price * 0.5
        : 0.003;
      const delta = liveRef.current * volatility * (Math.random() * 2 - 0.98);
      const next = Math.max(liveRef.current + delta, selectedStock.price * 0.7);
      setLivePriceDir(delta > 0 ? 1 : -1);
      liveRef.current = next;
      setLivePrice(+next.toFixed(2));
    }, 2000);
    return () => clearInterval(iv);
  }, [selectedStock]);

  /* ── AI scroll ── */
  useEffect(() => {
    aiMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiMessages]);

  /* ── Computed portfolio metrics ── */
  const portfolioValue = useMemo(() => {
    const stockMap = Object.fromEntries(stocks.map(s => [s.symbol, s.price]));
    const positionsValue = Object.entries(positions).reduce((sum, [sym, pos]) => {
      return sum + pos.shares * (stockMap[sym] || 0);
    }, 0);
    return balance + positionsValue;
  }, [positions, balance]);

  const totalPnl = useMemo(() => {
    const stockMap = Object.fromEntries(stocks.map(s => [s.symbol, s.price]));
    return Object.entries(positions).reduce((sum, [sym, pos]) => {
      return sum + pos.shares * ((stockMap[sym] || 0) - pos.avgCost);
    }, 0);
  }, [positions]);

  /* ── Chart Y-domain ── */
  const yDomain = useMemo(() => {
    if (!displayData.length) return ['auto', 'auto'];
    const prices = displayData.flatMap(d => [d.high ?? d.close, d.low ?? d.close]);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const pad = (max - min) * 0.08;
    return [+(min - pad).toFixed(2), +(max + pad).toFixed(2)];
  }, [displayData]);

  /* ── Handlers ── */
  const toggleIndicator = key => setIndicators(p => ({ ...p, [key]: !p[key] }));

  const showNotif = (text, type = 'success') => {
    setNotification({ text, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const submitOrder = () => {
    const qty = parseInt(quantity, 10);
    if (!qty || qty <= 0) { showNotif('Enter a valid quantity', 'error'); return; }
    const execPrice = orderType === 'market' ? livePrice : parseFloat(limitPrice);
    if (!execPrice || isNaN(execPrice)) { showNotif('Invalid limit price', 'error'); return; }
    const cost = qty * execPrice;

    if (orderSide === 'buy') {
      if (cost > balance) { showNotif('Insufficient balance', 'error'); return; }
      setBalance(b => +(b - cost).toFixed(2));
      setPositions(prev => {
        const existing = prev[selectedSymbol];
        if (!existing) return { ...prev, [selectedSymbol]: { shares: qty, avgCost: execPrice } };
        const totalShares = existing.shares + qty;
        const avgCost = (existing.shares * existing.avgCost + qty * execPrice) / totalShares;
        return { ...prev, [selectedSymbol]: { shares: totalShares, avgCost: +avgCost.toFixed(3) } };
      });
      showNotif(`Bought ${qty} shares of ${selectedSymbol} @ $${fmt(execPrice)}`);
    } else {
      const pos = positions[selectedSymbol];
      if (!pos || pos.shares < qty) { showNotif('Not enough shares to sell', 'error'); return; }
      const proceeds = qty * execPrice;
      setBalance(b => +(b + proceeds).toFixed(2));
      setPositions(prev => {
        const remaining = prev[selectedSymbol].shares - qty;
        if (remaining <= 0) {
          const next = { ...prev };
          delete next[selectedSymbol];
          return next;
        }
        return { ...prev, [selectedSymbol]: { ...prev[selectedSymbol], shares: remaining } };
      });
      showNotif(`Sold ${qty} shares of ${selectedSymbol} @ $${fmt(execPrice)}`);
    }

    setTrades(prev => [{
      id: Date.now(),
      side: orderSide,
      symbol: selectedSymbol,
      qty,
      price: execPrice,
      total: qty * execPrice,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    }, ...prev]);
    setQuantity('');
  };

  const closePosition = sym => {
    const pos = positions[sym];
    if (!pos) return;
    const currentPrice = sym === selectedSymbol ? livePrice : (stocks.find(s => s.symbol === sym)?.price || 0);
    const proceeds = pos.shares * currentPrice;
    setBalance(b => +(b + proceeds).toFixed(2));
    setTrades(prev => [{
      id: Date.now(),
      side: 'sell',
      symbol: sym,
      qty: pos.shares,
      price: currentPrice,
      total: proceeds,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    }, ...prev]);
    setPositions(prev => { const n = { ...prev }; delete n[sym]; return n; });
    showNotif(`Closed ${sym} position`);
  };

  const sendAIMessage = useCallback(async (text) => {
    const msg = text || aiInput;
    if (!msg.trim() || aiLoading) return;
    setAiInput('');
    setAiMessages(prev => [...prev, { role: 'user', text: msg }]);
    setAiLoading(true);

    const posEntry = positions[selectedSymbol];
    const positionContext = posEntry
      ? `User holds ${posEntry.shares} shares of ${selectedSymbol} at avg cost $${posEntry.avgCost}. Current P&L: ${fmtDollar(posEntry.shares * (livePrice - posEntry.avgCost))}.`
      : `User has no position in ${selectedSymbol}.`;
    const lastCandle = displayData[displayData.length - 1];
    const rsiVal = lastCandle?.rsi;
    const sma20Val = lastCandle?.sma20;
    const sma50Val = lastCandle?.sma50;
    const chartContext = `Chart: ${selectedSymbol} live @ $${fmt(livePrice)} (${timeframe} view). RSI: ${rsiVal ?? 'N/A'}. SMA20: ${sma20Val ?? 'N/A'}. SMA50: ${sma50Val ?? 'N/A'}. Trend: ${livePrice > (sma20Val ?? livePrice) ? 'Above SMA20 (bullish)' : 'Below SMA20 (bearish)'}. ${positionContext} User balance: $${fmt(balance)}.`;

    try {
      const res = await api.chat(msg, chartContext);
      setAiMessages(prev => [...prev, { role: 'ai', text: res.response || res.message || 'Analysis complete.' }]);
    } catch {
      // Fallback analysis if API fails
      const fallback = generateLocalAnalysis(msg, selectedStock, livePrice, rsiVal, sma20Val, sma50Val, posEntry);
      setAiMessages(prev => [...prev, { role: 'ai', text: fallback }]);
    } finally {
      setAiLoading(false);
    }
  }, [aiInput, aiLoading, selectedSymbol, selectedStock, livePrice, displayData, positions, balance, timeframe]);

  /* ── Watchlist filtering ── */
  const watchlistStocks = useMemo(() => {
    const search = watchSearch.toLowerCase();
    const priority = WATCHLIST_DEFAULTS.map(sym => stocks.find(s => s.symbol === sym)).filter(Boolean);
    const rest = stocks.filter(s => !WATCHLIST_DEFAULTS.includes(s.symbol));
    const all = [...priority, ...rest];
    return search ? all.filter(s => s.symbol.toLowerCase().includes(search) || s.name.toLowerCase().includes(search)) : all;
  }, [watchSearch]);

  /* ── Chart tooltip ── */
  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0]?.payload;
    if (!d) return null;
    return (
      <div style={{ background: '#0f1e35', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '0.6rem 0.85rem', fontSize: '0.72rem', color: 'rgba(255,255,255,0.8)' }}>
        <div style={{ fontWeight: 700, marginBottom: 4, color: '#fff' }}>{d.date}</div>
        <div>O: <span style={{ color: '#e2e8f0' }}>${fmt(d.open)}</span> &nbsp; H: <span style={{ color: '#22c55e' }}>${fmt(d.high)}</span></div>
        <div>L: <span style={{ color: '#ef4444' }}>${fmt(d.low)}</span> &nbsp; C: <span style={{ color: d.bullish ? '#22c55e' : '#ef4444' }}>${fmt(d.close)}</span></div>
        {d.sma20 && <div style={{ marginTop: 3 }}>SMA20: <span style={{ color: '#fbbf24' }}>${fmt(d.sma20)}</span> &nbsp; SMA50: <span style={{ color: '#60a5fa' }}>${fmt(d.sma50)}</span></div>}
        {d.rsi !== null && d.rsi !== undefined && <div style={{ marginTop: 3 }}>RSI: <span style={{ color: d.rsi > 70 ? '#ef4444' : d.rsi < 30 ? '#22c55e' : '#e2e8f0' }}>{d.rsi}</span></div>}
      </div>
    );
  };

  /* ── Misc ── */
  const priceChangeFromOpen = livePrice - (selectedStock.price - selectedStock.change);
  const priceChangePct = (priceChangeFromOpen / (selectedStock.price - selectedStock.change) * 100);
  const orderCost = (parseInt(quantity) || 0) * (orderType === 'market' ? livePrice : parseFloat(limitPrice) || livePrice);
  const currentPos = positions[selectedSymbol];

  return (
    <Page>
      {/* ── Topbar ── */}
      <Topbar>
        <TopStock>
          <div>
            <TopSymbol>{selectedStock.symbol}</TopSymbol>
            <TopName>{selectedStock.name}</TopName>
          </div>
          <div>
            <TopPrice>${fmt(livePrice)}</TopPrice>
            <TopChange $pos={priceChangeFromOpen >= 0}>
              {priceChangeFromOpen >= 0 ? <FaArrowUp /> : <FaArrowDown />}
              {fmtDollar(Math.abs(priceChangeFromOpen))} ({Math.abs(priceChangePct).toFixed(2)}%)
            </TopChange>
          </div>
        </TopStock>

        <Divider />

        <StatPill>Open <span>${fmt(selectedStock.price - selectedStock.change)}</span></StatPill>
        <StatPill>High <span>${fmt(Math.max(livePrice, selectedStock.price) * 1.003)}</span></StatPill>
        <StatPill>Low <span>${fmt(Math.min(livePrice, selectedStock.price) * 0.997)}</span></StatPill>
        <StatPill>Vol <span>{(selectedStock.historicalPrices.at(-1)?.volume / 1e6).toFixed(1)}M</span></StatPill>
        <StatPill>P/E <span>{selectedStock.pe || '–'}</span></StatPill>
        <StatPill>Div <span>{selectedStock.dividend ? `${selectedStock.dividend}%` : '–'}</span></StatPill>

        <Divider />

        <StatPill>Portfolio <span style={{ color: totalPnl >= 0 ? '#22c55e' : '#ef4444' }}>${portfolioValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span></StatPill>
        <StatPill>P&L <span style={{ color: totalPnl >= 0 ? '#22c55e' : '#ef4444' }}>{totalPnl >= 0 ? '+' : ''}{fmtDollar(totalPnl)}</span></StatPill>

        <TopSpacer />

        <LiveDot title="Live simulation" />

        <Divider />

        {[
          { key: 'sma20', label: 'SMA 20', color: '#fbbf24' },
          { key: 'sma50', label: 'SMA 50', color: '#60a5fa' },
          { key: 'bb', label: 'BB', color: '#a78bfa' },
          { key: 'rsi', label: 'RSI', color: '#34d399' },
          { key: 'volume', label: 'Vol', color: '#94a3b8' },
        ].map(ind => (
          <IndicatorToggle
            key={ind.key}
            $active={indicators[ind.key]}
            $color={ind.color}
            onClick={() => toggleIndicator(ind.key)}
          >
            {ind.label}
          </IndicatorToggle>
        ))}
      </Topbar>

      {/* ── Body ── */}
      <Body>
        {/* ── Watchlist ── */}
        <WatchlistPanel>
          <WatchlistHeader>
            <WatchlistTitle>Watchlist</WatchlistTitle>
          </WatchlistHeader>
          <WatchSearchInput
            placeholder="Search symbol…"
            value={watchSearch}
            onChange={e => setWatchSearch(e.target.value)}
          />
          <WatchList>
            {watchlistStocks.map(stock => (
              <WatchItem
                key={stock.symbol}
                $active={stock.symbol === selectedSymbol}
                onClick={() => setSelectedSymbol(stock.symbol)}
              >
                <WatchSym>{stock.symbol}</WatchSym>
                <WatchName>{stock.name}</WatchName>
                <WatchPrice>
                  <WatchPriceVal>${fmt(stock.price)}</WatchPriceVal>
                  <WatchChg $pos={stock.changePercent >= 0}>
                    {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                  </WatchChg>
                </WatchPrice>
              </WatchItem>
            ))}
          </WatchList>
        </WatchlistPanel>

        {/* ── Chart Panel ── */}
        <ChartPanel>
          <ChartToolbar>
            {TIMEFRAMES.map(tf => (
              <TFBtn key={tf} $active={timeframe === tf} onClick={() => setTimeframe(tf)}>{tf}</TFBtn>
            ))}
            <ChartSep />
            <ChartTypeBtn $active={chartType === 'candle'} onClick={() => setChartType('candle')}>
              <FaChartBar style={{ fontSize: '0.8rem' }} />
            </ChartTypeBtn>
            <ChartTypeBtn $active={chartType === 'line'} onClick={() => setChartType('line')}>
              <FaChartLine style={{ fontSize: '0.8rem' }} />
            </ChartTypeBtn>
          </ChartToolbar>

          {/* Main price chart */}
          <ChartMain>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={displayData} margin={{ top: 6, right: 52, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={livePrice >= displayData[0]?.close ? '#22c55e' : '#ef4444'} stopOpacity={0.12} />
                    <stop offset="100%" stopColor={livePrice >= displayData[0]?.close ? '#22c55e' : '#ef4444'} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="bbGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.06} />
                    <stop offset="100%" stopColor="#a78bfa" stopOpacity={0.06} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />

                <XAxis
                  dataKey="date"
                  tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }}
                  tickLine={false}
                  axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
                  interval={Math.floor(displayData.length / 6)}
                />
                <YAxis
                  domain={yDomain}
                  orientation="right"
                  tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={v => `$${v.toFixed(0)}`}
                  width={52}
                />

                <Tooltip content={<CustomTooltip />} />

                {/* Bollinger Bands */}
                {indicators.bb && (
                  <>
                    <Area type="monotone" dataKey="bbUpper" stroke="#a78bfa" strokeWidth={0.8} fill="url(#bbGrad)" dot={false} isAnimationActive={false} connectNulls />
                    <Area type="monotone" dataKey="bbLower" stroke="#a78bfa" strokeWidth={0.8} fill="transparent" dot={false} isAnimationActive={false} connectNulls />
                  </>
                )}

                {/* Price: candlestick or line */}
                {chartType === 'line' ? (
                  <Area
                    type="monotone"
                    dataKey="close"
                    stroke={livePrice >= displayData[0]?.close ? '#22c55e' : '#ef4444'}
                    strokeWidth={1.8}
                    fill="url(#priceGrad)"
                    dot={false}
                    isAnimationActive={false}
                  />
                ) : (
                  <Bar
                    dataKey="wickRange"
                    shape={<CandlestickShape />}
                    isAnimationActive={false}
                    maxBarSize={18}
                  >
                    {displayData.map((d, i) => (
                      <Cell key={i} fill={d.bullish ? '#22c55e' : '#ef4444'} />
                    ))}
                  </Bar>
                )}

                {/* SMA lines */}
                {indicators.sma20 && (
                  <Line type="monotone" dataKey="sma20" stroke="#fbbf24" strokeWidth={1.2} dot={false} isAnimationActive={false} connectNulls />
                )}
                {indicators.sma50 && (
                  <Line type="monotone" dataKey="sma50" stroke="#60a5fa" strokeWidth={1.2} dot={false} isAnimationActive={false} connectNulls />
                )}

                {/* Live price reference line */}
                <ReferenceLine y={livePrice} stroke="rgba(255,255,255,0.2)" strokeDasharray="4 4" label={{ value: `$${fmt(livePrice)}`, position: 'right', fill: '#fff', fontSize: 9, dx: 4 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartMain>

          {/* Volume pane */}
          {indicators.volume && (
            <VolPane>
              <PaneLabel>Volume</PaneLabel>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={displayData} margin={{ top: 4, right: 52, left: 0, bottom: 0 }}>
                  <XAxis dataKey="date" hide />
                  <YAxis orientation="right" tick={{ fill: 'rgba(255,255,255,0.18)', fontSize: 9 }} tickLine={false} axisLine={false} width={52} tickFormatter={v => (v / 1e6).toFixed(0) + 'M'} />
                  <Bar dataKey="volume" isAnimationActive={false}>
                    {displayData.map((d, i) => (
                      <Cell key={i} fill={d.bullish ? 'rgba(34,197,94,0.45)' : 'rgba(239,68,68,0.45)'} />
                    ))}
                  </Bar>
                </ComposedChart>
              </ResponsiveContainer>
            </VolPane>
          )}

          {/* RSI pane */}
          {indicators.rsi && (
            <RSIPane>
              <PaneLabel>RSI (14)</PaneLabel>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={displayData} margin={{ top: 4, right: 52, left: 0, bottom: 0 }}>
                  <XAxis dataKey="date" hide />
                  <YAxis domain={[0, 100]} orientation="right" tick={{ fill: 'rgba(255,255,255,0.18)', fontSize: 9 }} tickLine={false} axisLine={false} width={52} ticks={[30, 50, 70]} />
                  <ReferenceLine y={70} stroke="rgba(239,68,68,0.3)" strokeDasharray="3 3" />
                  <ReferenceLine y={30} stroke="rgba(34,197,94,0.3)" strokeDasharray="3 3" />
                  <Line type="monotone" dataKey="rsi" stroke="#34d399" strokeWidth={1.5} dot={false} isAnimationActive={false} connectNulls />
                </ComposedChart>
              </ResponsiveContainer>
            </RSIPane>
          )}
        </ChartPanel>

        {/* ── Right Panel ── */}
        <RightPanel>
          <RightTabs>
            <RTab $active={rightTab === 'order'} onClick={() => setRightTab('order')}>
              <FaBolt style={{ fontSize: '0.7rem' }} /> Order
            </RTab>
            <RTab $active={rightTab === 'positions'} onClick={() => setRightTab('positions')}>
              <FaWallet style={{ fontSize: '0.7rem' }} /> Positions
            </RTab>
            <RTab $active={rightTab === 'history'} onClick={() => setRightTab('history')}>
              <FaHistory style={{ fontSize: '0.7rem' }} /> History
            </RTab>
            <RTab $active={rightTab === 'ai'} onClick={() => setRightTab('ai')}>
              <FaRobot style={{ fontSize: '0.7rem' }} /> AI
            </RTab>
          </RightTabs>

          <RTabBody>
            {/* ── Order Tab ── */}
            {rightTab === 'order' && (
              <OrderSection>
                <SideToggle>
                  <SideBtn $active={orderSide === 'buy'} $side="buy" onClick={() => setOrderSide('buy')}>BUY</SideBtn>
                  <SideBtn $active={orderSide === 'sell'} $side="sell" onClick={() => setOrderSide('sell')}>SELL</SideBtn>
                </SideToggle>

                <OrderTypeRow>
                  {['market', 'limit'].map(t => (
                    <OTypeBtn key={t} $active={orderType === t} onClick={() => setOrderType(t)}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </OTypeBtn>
                  ))}
                </OrderTypeRow>

                <FieldLabel>Quantity (shares)</FieldLabel>
                <NumberInput
                  type="number"
                  min="1"
                  placeholder="0"
                  value={quantity}
                  onChange={e => setQuantity(e.target.value)}
                />

                {orderType === 'limit' && (
                  <>
                    <FieldLabel>Limit Price</FieldLabel>
                    <NumberInput
                      type="number"
                      step="0.01"
                      placeholder={fmt(livePrice)}
                      value={limitPrice}
                      onChange={e => setLimitPrice(e.target.value)}
                    />
                  </>
                )}

                <OrderSummary>
                  <SumRow><span>Market Price</span><span>${fmt(livePrice)}</span></SumRow>
                  <SumRow><span>Exec Price</span><span>{orderType === 'market' ? `$${fmt(livePrice)}` : `$${parseFloat(limitPrice || livePrice).toFixed(2)}`}</span></SumRow>
                  <SumRow><span>Est. Total</span><span style={{ color: orderSide === 'buy' ? '#f87171' : '#4ade80' }}>${quantity ? (orderCost).toFixed(2) : '0.00'}</span></SumRow>
                </OrderSummary>

                {currentPos && (
                  <div style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.18)', borderRadius: 8, padding: '0.55rem 0.7rem', marginBottom: '0.65rem', fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)' }}>
                    <span style={{ color: '#a5b4fc', fontWeight: 700 }}>Open position: </span>
                    {currentPos.shares} shares @ ${fmt(currentPos.avgCost)} · P&L:{' '}
                    <span style={{ color: currentPos.shares * (livePrice - currentPos.avgCost) >= 0 ? '#4ade80' : '#f87171', fontWeight: 700 }}>
                      {fmtDollar(currentPos.shares * (livePrice - currentPos.avgCost))}
                    </span>
                  </div>
                )}

                <OrderBtn
                  $side={orderSide}
                  disabled={!quantity || parseInt(quantity) <= 0}
                  onClick={submitOrder}
                >
                  {orderSide === 'buy' ? '▲ Place Buy Order' : '▼ Place Sell Order'}
                </OrderBtn>

                <BalanceBadge>
                  Cash: <span>${balance.toLocaleString('en-US', { maximumFractionDigits: 2 })}</span>
                </BalanceBadge>

                {/* Market indices strip */}
                <div style={{ marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.75rem' }}>
                  {marketIndices.map(idx => (
                    <div key={idx.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.28rem 0', fontSize: '0.7rem' }}>
                      <span style={{ color: 'rgba(255,255,255,0.35)' }}>{idx.name}</span>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ color: '#e2e8f0', fontWeight: 600 }}>{idx.value.toLocaleString()}</div>
                        <div style={{ color: idx.changePercent >= 0 ? '#22c55e' : '#ef4444', fontSize: '0.62rem' }}>
                          {idx.changePercent >= 0 ? '+' : ''}{idx.changePercent.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </OrderSection>
            )}

            {/* ── Positions Tab ── */}
            {rightTab === 'positions' && (
              <>
                <SectionHead>Open Positions</SectionHead>
                <PositionsSection>
                  {Object.keys(positions).length === 0 ? (
                    <NoPositions>No open positions.<br />Use the Order tab to start trading.</NoPositions>
                  ) : (
                    Object.entries(positions).map(([sym, pos]) => {
                      const stock = stocks.find(s => s.symbol === sym);
                      const currentPrice = sym === selectedSymbol ? livePrice : (stock?.price || 0);
                      const pnl = pos.shares * (currentPrice - pos.avgCost);
                      const pnlPct = ((currentPrice - pos.avgCost) / pos.avgCost * 100);
                      return (
                        <PositionCard key={sym} style={{ marginTop: '0.65rem' }}>
                          <PosHeader>
                            <div>
                              <PosSym>{sym}</PosSym>
                              <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>{stock?.name}</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <PnlBadge $pos={pnl >= 0}>{pnl >= 0 ? '+' : ''}{fmtDollar(pnl)}</PnlBadge>
                              <div style={{ fontSize: '0.62rem', color: pnl >= 0 ? '#22c55e' : '#ef4444' }}>{pnlPct.toFixed(2)}%</div>
                            </div>
                          </PosHeader>
                          <PosStats>
                            <PosStat>Shares<span>{pos.shares}</span></PosStat>
                            <PosStat>Avg Cost<span>${fmt(pos.avgCost)}</span></PosStat>
                            <PosStat>Market Val<span>${fmt(pos.shares * currentPrice)}</span></PosStat>
                          </PosStats>
                          <CloseBtn onClick={() => closePosition(sym)}>Close Position</CloseBtn>
                        </PositionCard>
                      );
                    })
                  )}

                  <div style={{ marginTop: '1rem', padding: '0.65rem', background: 'rgba(255,255,255,0.02)', borderRadius: 9, border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontSize: '0.62rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.25)', marginBottom: '0.55rem' }}>Account Summary</div>
                    {[
                      { label: 'Cash', value: `$${balance.toLocaleString('en-US', { maximumFractionDigits: 2 })}` },
                      { label: 'Portfolio Value', value: `$${portfolioValue.toLocaleString('en-US', { maximumFractionDigits: 2 })}` },
                      { label: 'Total P&L', value: fmtDollar(totalPnl), color: totalPnl >= 0 ? '#4ade80' : '#f87171' },
                      { label: 'Trades', value: trades.length },
                    ].map(row => (
                      <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', padding: '0.22rem 0', color: 'rgba(255,255,255,0.35)' }}>
                        <span>{row.label}</span>
                        <span style={{ color: row.color || '#e2e8f0', fontWeight: 600 }}>{row.value}</span>
                      </div>
                    ))}
                  </div>
                </PositionsSection>
              </>
            )}

            {/* ── History Tab ── */}
            {rightTab === 'history' && (
              <>
                <SectionHead>Trade History ({trades.length})</SectionHead>
                {trades.length === 0 ? (
                  <NoPositions>No trades yet.</NoPositions>
                ) : (
                  trades.map(t => (
                    <TradeRow key={t.id}>
                      <TradeSide $buy={t.side === 'buy'}>{t.side}</TradeSide>
                      <TradeInfo>
                        <TradeSym>{t.symbol}</TradeSym>
                        <TradeMeta>{t.qty} shares @ ${fmt(t.price)} · {t.time}</TradeMeta>
                      </TradeInfo>
                      <TradeTotal>${fmt(t.total)}</TradeTotal>
                    </TradeRow>
                  ))
                )}
              </>
            )}

            {/* ── AI Tab ── */}
            {rightTab === 'ai' && (
              <AISection>
                <SectionHead>AI Trading Analyst — {selectedStock.symbol}</SectionHead>
                <AIMessages>
                  {aiMessages.map((m, i) => (
                    <AIMsgBubble key={i} $ai={m.role === 'ai'}>
                      <AILabel $ai={m.role === 'ai'}>
                        {m.role === 'ai' ? <><FaRobot /> AI Analyst</> : <><FaChartLine /> You</>}
                      </AILabel>
                      {m.text}
                    </AIMsgBubble>
                  ))}
                  {aiLoading && (
                    <AIMsgBubble $ai>
                      <AILabel $ai><FaRobot /> AI Analyst</AILabel>
                      <Spinner style={{ marginRight: 6 }} /> Analysing chart…
                    </AIMsgBubble>
                  )}
                  <div ref={aiMessagesEndRef} />
                </AIMessages>

                <AIPromptChips>
                  {AI_PROMPTS.map(p => (
                    <PromptChip key={p} disabled={aiLoading} onClick={() => sendAIMessage(p)}>{p}</PromptChip>
                  ))}
                </AIPromptChips>

                <AIInputRow>
                  <AIChatInput
                    placeholder={`Ask about ${selectedStock.symbol}…`}
                    value={aiInput}
                    onChange={e => setAiInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendAIMessage()}
                    disabled={aiLoading}
                  />
                  <AISendBtn onClick={() => sendAIMessage()} disabled={!aiInput.trim() || aiLoading}>
                    <FaPaperPlane />
                  </AISendBtn>
                </AIInputRow>
              </AISection>
            )}
          </RTabBody>
        </RightPanel>
      </Body>

      {/* ── Notifications ── */}
      <AnimatePresence>
        {notification && (
          <Notification
            key="notif"
            $type={notification.type}
            initial={{ opacity: 0, y: 20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
          >
            {notification.type === 'success' ? <FaCheckCircle style={{ marginRight: 6 }} /> : <FaTimes style={{ marginRight: 6 }} />}
            {notification.text}
          </Notification>
        )}
      </AnimatePresence>
    </Page>
  );
}

/* ─────────────────────────────────────────────────────────────
   LOCAL AI FALLBACK — used when API is unavailable
───────────────────────────────────────────────────────────── */

function generateLocalAnalysis(question, stock, price, rsi, sma20, sma50, position) {
  const q = question.toLowerCase();
  const bullish = price > (sma20 || price);
  const trend = bullish ? 'bullish' : 'bearish';
  const rsiZone = rsi > 70 ? 'overbought (>70)' : rsi < 30 ? 'oversold (<30)' : 'neutral';

  if (q.includes('entry') || q.includes('buy') || q.includes('good')) {
    return `**${stock.symbol} Entry Analysis**\n\nCurrent price $${price.toFixed(2)} is ${bullish ? 'above' : 'below'} SMA20 ($${sma20 ?? 'N/A'}), suggesting a ${trend} short-term trend. RSI at ${rsi ?? 'N/A'} is ${rsiZone}.\n\n${rsi > 70 ? '⚠️ Momentum is stretched — consider waiting for a pullback toward the SMA20 before entering.' : rsi < 30 ? '✅ Oversold conditions may present a value entry. Confirm with volume before buying.' : '📊 Momentum is neutral — watch for a breakout above recent highs or a bounce off SMA20 as a trigger.'}\n\n${stock.description}`;
  }
  if (q.includes('rsi')) {
    return `**RSI Indicator — ${stock.symbol}**\n\nRSI (14-period) is currently at **${rsi ?? 'calculating…'}**.\n\n• **>70** = Overbought — price may reverse or consolidate\n• **30–70** = Neutral zone — trend continuation likely\n• **<30** = Oversold — potential reversal or bounce\n\nCurrent reading of ${rsi} is ${rsiZone}. ${rsi > 70 ? 'This doesn't guarantee a drop — momentum can stay overbought — but risk/reward for new longs diminishes.' : rsi < 30 ? 'Historically, oversold readings in quality assets like this often precede recoveries.' : 'No extreme reading — the RSI alone isn't signalling a trade here.'}`;
  }
  if (q.includes('sma') || q.includes('moving average')) {
    const cross = sma20 && sma50 ? (sma20 > sma50 ? '**Golden Cross** (SMA20 above SMA50) — short-term bullish momentum.' : '**Death Cross** (SMA20 below SMA50) — short-term bearish signal.') : '';
    return `**Moving Average Analysis — ${stock.symbol}**\n\nSMA20: $${sma20 ?? 'N/A'} | SMA50: $${sma50 ?? 'N/A'} | Price: $${price.toFixed(2)}\n\n${cross}\n\nThe SMA20 reacts faster to recent price action — it\'s used for short-term momentum. The SMA50 smooths out noise — it\'s a medium-term trend filter.\n\nPrice is ${price > (sma20 || price) ? 'above' : 'below'} SMA20: ${price > (sma20 || price) ? 'Trend is intact. Pullbacks to SMA20 are common buying opportunities in uptrends.' : 'Weakness confirmed. Watch for a reclaim of SMA20 as a recovery signal.'}`;
  }
  if (q.includes('pattern') || q.includes('chart')) {
    return `**Chart Pattern Analysis — ${stock.symbol}**\n\nOn the ${price > (sma50 || price) ? 'bullish side of SMA50' : 'bearish side of SMA50'}, ${stock.symbol} is showing:\n\n• Price action is ${bullish ? 'in an uptrend with higher highs' : 'in a downtrend with lower highs'}\n• Volume is ${Math.random() > 0.5 ? 'confirming the move (bullish divergence)' : 'slightly declining (watch for reversal signals)'}\n• ${sma20 && sma50 ? (sma20 > sma50 ? 'Short-term momentum is leading (SMA20 > SMA50)' : 'Short-term momentum lagging (SMA20 < SMA50)') : ''}\n\nKey levels to watch: Support near $${(price * 0.96).toFixed(2)} — Resistance near $${(price * 1.04).toFixed(2)}.`;
  }
  if (q.includes('stop') || q.includes('stop-loss')) {
    const sl = (price * (bullish ? 0.94 : 0.97)).toFixed(2);
    return `**Stop-Loss Recommendation — ${stock.symbol}**\n\nBased on current volatility and trend:\n\n• **Conservative stop**: $${(price * 0.97).toFixed(2)} (−3%) — tight, suits scalpers\n• **Standard stop**: $${sl} — below recent support / SMA20\n• **Wide stop**: $${(price * 0.90).toFixed(2)} (−10%) — for longer-term holds\n\nA stop below SMA50 ($${sma50 ?? 'N/A'}) is the technical default for trend trades.\n\n💡 Position size your trade so that the stop-loss hit = max 2% of your total portfolio. This is the professional risk discipline.`;
  }
  if (q.includes('volume')) {
    return `**Volume Analysis — ${stock.symbol}**\n\nVolume confirms or denies price moves:\n\n• **Rising price + rising volume** = strong trend, institutional participation\n• **Rising price + falling volume** = weak move, potential exhaustion\n• **Falling price + high volume** = distribution (selling pressure)\n• **Falling price + low volume** = normal pullback, trend likely intact\n\n${stock.symbol}'s recent volume suggests ${Math.random() > 0.5 ? 'healthy accumulation — the move has conviction behind it.' : 'mixed conviction — watch for a volume surge to confirm the next directional move.'}`;
  }
  // Default
  return `**${stock.symbol} Market Analysis**\n\n${stock.description}\n\nPrice: $${price.toFixed(2)} | Trend: ${trend.charAt(0).toUpperCase() + trend.slice(1)} | RSI: ${rsi ?? 'N/A'} (${rsiZone})\n\nThe stock is ${bullish ? 'trading above its 20-day average — short-term momentum favours bulls.' : 'below its 20-day average — short-term momentum favours bears.'} ${position ? `\n\nYou're holding ${position.shares} shares with a P&L of ${fmtDollar(position.shares * (price - position.avgCost))}. ${position.shares * (price - position.avgCost) > 0 ? 'Consider whether to trail your stop to lock in gains.' : 'Evaluate if the thesis still holds before adding more exposure.'}` : ''}\n\nAsk me something specific: entry points, stop-loss levels, indicator readings, or pattern recognition.`;
}
