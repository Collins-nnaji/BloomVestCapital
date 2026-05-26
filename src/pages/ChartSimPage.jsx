import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ComposedChart, Bar, Line, XAxis, YAxis,
  Tooltip, ResponsiveContainer, ReferenceLine, ReferenceArea, CartesianGrid,
} from 'recharts';
import {
  FaRobot, FaPaperPlane, FaChartLine, FaChartBar, FaArrowUp, FaArrowDown,
  FaBolt, FaSpinner, FaCheckCircle, FaTimes, FaBrain,
  FaHistory, FaWallet, FaFire, FaLightbulb,
  FaBullseye, FaExclamationTriangle, FaStar,
  FaSearch, FaShieldAlt, FaGraduationCap, FaBook,
  FaPlay, FaCheck, FaTrophy, FaArrowRight, FaArrowLeft,
  FaChevronRight, FaChevronLeft,
} from 'react-icons/fa';
import { stocks, marketIndices } from '../data/stockData';
import { api } from '../api';
import { useAuth } from '../AuthContext';

/* ═══════════════════════════════════════════════════════════════
   TUTORIAL DATA GENERATION (seeded — consistent across reloads)
═══════════════════════════════════════════════════════════════ */

function seededRNG(seed) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(1664525, s) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function generateTutData() {
  const rng = seededRNG(42);
  const phases = [
    { count: 12, drift: 0.003, vol: 0.012 },   // 0-11: gentle uptrend
    { count: 15, drift: -0.007, vol: 0.018 },   // 12-26: downtrend
    { count: 17, drift: 0.009, vol: 0.015 },    // 27-43: strong uptrend
    { count: 10, drift: 0.0, vol: 0.008 },      // 44-53: consolidation
    { count: 6,  drift: 0.005, vol: 0.012 },    // 54-59: mild uptrend
  ];
  const candles = [];
  let price = 100;
  let idx = 0;
  for (const ph of phases) {
    for (let i = 0; i < ph.count; i++) {
      const change = ph.drift + (rng() - 0.5) * 2 * ph.vol;
      const open = +price.toFixed(2);
      price = +(price * (1 + change)).toFixed(2);
      const close = price;
      const range = Math.abs(close - open);
      const wickFactor = 0.3 + rng() * 0.5;
      const high = +(Math.max(open, close) + range * wickFactor * (0.4 + rng() * 0.6)).toFixed(2);
      const low = +(Math.min(open, close) - range * wickFactor * (0.3 + rng() * 0.5)).toFixed(2);
      const volume = Math.round(500000 + rng() * 1500000);
      candles.push({ idx, open, close, high, low, volume, bullish: close >= open });
      idx++;
    }
  }
  return candles;
}

function tutSMA(data, period) {
  return data.map((_, i) =>
    i < period - 1
      ? null
      : +(data.slice(i - period + 1, i + 1).reduce((s, d) => s + d.close, 0) / period).toFixed(2)
  );
}

function tutRSI(data, period = 14) {
  if (data.length < period + 1) return data.map(() => null);
  const out = data.map(() => null);
  let g = 0, l = 0;
  for (let i = 1; i <= period; i++) {
    const d = data[i].close - data[i - 1].close;
    if (d >= 0) g += d; else l -= d;
  }
  let ag = g / period, al = l / period;
  out[period] = +(100 - 100 / (1 + ag / (al || 0.0001))).toFixed(2);
  for (let i = period + 1; i < data.length; i++) {
    const d = data[i].close - data[i - 1].close;
    ag = (ag * (period - 1) + Math.max(d, 0)) / period;
    al = (al * (period - 1) + Math.max(-d, 0)) / period;
    out[i] = +(100 - 100 / (1 + ag / (al || 0.0001))).toFixed(2);
  }
  return out;
}

const RAW_TUT = generateTutData();
const T_SMA20 = tutSMA(RAW_TUT, 20);
const T_SMA50 = tutSMA(RAW_TUT, 50);
const T_RSI   = tutRSI(RAW_TUT, 14);
const TDATA   = RAW_TUT.map((d, i) => ({
  ...d,
  wickRange: [d.low, d.high],
  sma20: T_SMA20[i],
  sma50: T_SMA50[i],
  rsi:   T_RSI[i],
}));
const T_SUPPORT    = +(Math.min(...RAW_TUT.slice(12, 28).map(d => d.low)) + 0.5).toFixed(2);
const T_RESISTANCE = +(Math.max(...RAW_TUT.slice(0, 13).map(d => d.high)) - 0.5).toFixed(2);

/* ═══════════════════════════════════════════════════════════════
   LESSON DEFINITIONS
═══════════════════════════════════════════════════════════════ */

const LESSONS = [
  {
    id: 'candle',
    title: 'What is a Candlestick?',
    type: 'single',
    emoji: '🕯️',
    intro: 'Every bar on a chart is a candlestick. It packs four pieces of price data into one visual: Open, High, Low, and Close.',
    tip: 'Green candles = price went UP. Red candles = price went DOWN.',
    quiz: {
      q: 'The body of a candlestick shows the range between…',
      options: ['High and Low', 'Open and Close', 'Open and High', 'Close and Low'],
      correct: 1,
      explanation: 'The body spans from Open to Close. The thin wicks extend to the High and Low.',
    },
  },
  {
    id: 'direction',
    title: 'Reading Direction',
    type: 'direction',
    range: [18, 30],
    emoji: '📈',
    intro: "Each candle's color tells you the direction of price movement for that period. Green (bullish) means buyers won. Red (bearish) means sellers won.",
    tip: 'Look at several candles in a row to spot momentum.',
    quiz: {
      q: 'A red (bearish) candle means the Close price was…',
      options: ['Higher than Open', 'Lower than Open', 'Equal to Open', 'Higher than High'],
      correct: 1,
      explanation: 'Red/bearish means sellers pushed price down — the Close ended below the Open.',
    },
  },
  {
    id: 'trend',
    title: 'Spotting Trends',
    type: 'trend',
    range: [0, 59],
    emoji: '🌊',
    intro: 'A trend is a sustained directional move. Uptrends make higher highs and higher lows. Downtrends make lower highs and lower lows.',
    tip: 'The highlighted zones show a real downtrend (bars 12–26) followed by an uptrend (bars 27–43).',
    quiz: {
      q: 'An uptrend is characterized by…',
      options: ['Lower highs and lower lows', 'Flat price action', 'Higher highs and higher lows', 'Random candle colors'],
      correct: 2,
      explanation: 'In an uptrend each rally reaches a new high and each dip finds a higher floor.',
    },
  },
  {
    id: 'ma',
    title: 'Moving Averages',
    type: 'ma',
    range: [0, 59],
    emoji: '〰️',
    intro: "A Moving Average (MA) smooths price noise by averaging recent closes. SMA20 tracks the last 20 bars; SMA50 the last 50. When SMA20 crosses above SMA50 it's called a Golden Cross — a bullish signal.",
    tip: 'Price above both MAs = strong uptrend. Price below both = downtrend.',
    quiz: {
      q: 'When SMA20 crosses ABOVE SMA50 it is called…',
      options: ['Death Cross', 'Bearish Divergence', 'Golden Cross', 'Resistance Breakout'],
      correct: 2,
      explanation: 'The Golden Cross signals that short-term momentum has turned bullish relative to the medium term.',
    },
  },
  {
    id: 'rsi',
    title: 'RSI — Momentum Meter',
    type: 'rsi',
    range: [20, 59],
    showRSI: true,
    emoji: '⚡',
    intro: 'RSI (Relative Strength Index) measures momentum on a 0–100 scale. Above 70 = overbought (pullback risk). Below 30 = oversold (bounce potential). Around 50 = neutral.',
    tip: 'RSI extremes are buy/sell signals when confirmed by price action.',
    quiz: {
      q: 'An RSI reading above 70 suggests the asset is…',
      options: ['Oversold — likely to rise', 'Overbought — pullback risk', 'In a perfect uptrend', 'At support'],
      correct: 1,
      explanation: 'RSI > 70 means the recent gains have been very fast. A pullback or pause is statistically more likely.',
    },
  },
];

/* ═══════════════════════════════════════════════════════════════
   ADVANCED MODE — ANALYTICS ENGINE
═══════════════════════════════════════════════════════════════ */

function computeSMA(data, period, key = 'close') {
  return data.map((_, i) =>
    i < period - 1 ? null : +(data.slice(i - period + 1, i + 1).reduce((s, d) => s + d[key], 0) / period).toFixed(2)
  );
}

function computeRSI(data, period = 14) {
  if (data.length < period + 1) return data.map(() => null);
  const out = data.map(() => null);
  let g = 0, l = 0;
  for (let i = 1; i <= period; i++) {
    const d = data[i].close - data[i - 1].close;
    if (d >= 0) g += d; else l -= d;
  }
  let ag = g / period, al = l / period;
  out[period] = +(100 - 100 / (1 + ag / (al || 0.0001))).toFixed(2);
  for (let i = period + 1; i < data.length; i++) {
    const d = data[i].close - data[i - 1].close;
    ag = (ag * (period - 1) + Math.max(d, 0)) / period;
    al = (al * (period - 1) + Math.max(-d, 0)) / period;
    out[i] = +(100 - 100 / (1 + ag / (al || 0.0001))).toFixed(2);
  }
  return out;
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

function generateOHLC(prices) {
  return prices.map((p, i) => {
    const prevClose = prices[i - 1]?.price ?? p.price * 0.995;
    const open = +prevClose.toFixed(2);
    const close = p.price;
    const range = Math.abs(close - open);
    const wick = range * (0.4 + Math.random() * 0.8);
    const high = +(Math.max(open, close) + wick * (0.3 + Math.random() * 0.7)).toFixed(2);
    const low  = +(Math.min(open, close) - wick * (0.2 + Math.random() * 0.6)).toFixed(2);
    return { date: p.date, open, close, high, low, volume: p.volume, bullish: close >= open };
  });
}

function buildChartData(ohlc) {
  const sma20  = computeSMA(ohlc, 20);
  const sma50  = computeSMA(ohlc, 50);
  const bb     = computeBB(ohlc, 20, 2);
  const rsiVals = computeRSI(ohlc, 14);
  return ohlc.map((d, i) => ({
    ...d,
    wickRange: [d.low, d.high],
    sma20: sma20[i], sma50: sma50[i],
    bbUpper: bb[i].upper, bbMid: bb[i].mid, bbLower: bb[i].lower,
    rsi: rsiVals[i],
  }));
}

function sliceByTF(prices, tf) {
  return prices.slice(-({ '1W': 7, '1M': 30, '3M': 60, '6M': 90 }[tf] ?? 90));
}

function computeAISignal(chartData, livePrice) {
  if (!chartData.length) return null;
  const last = chartData[chartData.length - 1];
  const { rsi, sma20, sma50, bbUpper, bbLower } = last;
  const recent5  = chartData.slice(-5).map(d => d.close);
  const recent10 = chartData.slice(-10).map(d => d.close);
  const trendUp5  = recent5[recent5.length - 1]  > recent5[0];
  const trendUp10 = recent10[recent10.length - 1] > recent10[0];
  const factors = [];
  let bull = 0, bear = 0;
  if (rsi !== null) {
    if (rsi < 30)      { bull += 3; factors.push({ label: 'RSI Oversold',  type: 'bull', detail: `RSI ${rsi} — historically strong reversal zone` }); }
    else if (rsi > 70) { bear += 3; factors.push({ label: 'RSI Overbought', type: 'bear', detail: `RSI ${rsi} — momentum stretched, pullback risk` }); }
    else if (rsi > 55) { bull += 1; factors.push({ label: 'RSI Bullish',   type: 'bull', detail: `RSI ${rsi} — above midline, momentum positive` }); }
    else if (rsi < 45) { bear += 1; factors.push({ label: 'RSI Bearish',   type: 'bear', detail: `RSI ${rsi} — below midline, weak momentum` }); }
  }
  if (sma20 && sma50) {
    if (sma20 > sma50) { bull += 2; factors.push({ label: 'Golden Cross', type: 'bull', detail: 'SMA20 above SMA50 — medium-term uptrend confirmed' }); }
    else               { bear += 2; factors.push({ label: 'Death Cross',  type: 'bear', detail: 'SMA20 below SMA50 — medium-term downtrend active' }); }
  }
  if (sma20) {
    if (livePrice > sma20) { bull += 1; factors.push({ label: 'Price > SMA20', type: 'bull', detail: 'Trading above short-term average' }); }
    else                   { bear += 1; factors.push({ label: 'Price < SMA20', type: 'bear', detail: 'Below short-term average' }); }
  }
  if (sma50) {
    if (livePrice > sma50) { bull += 1; factors.push({ label: 'Price > SMA50', type: 'bull', detail: 'Above medium-term average — trend intact' }); }
    else                   { bear += 1; factors.push({ label: 'Price < SMA50', type: 'bear', detail: 'Below medium-term average — caution warranted' }); }
  }
  if (trendUp5)  { bull += 1; factors.push({ label: '5-bar Uptrend',   type: 'bull', detail: 'Recent 5 candles trending higher' }); }
  else           { bear += 1; factors.push({ label: '5-bar Downtrend', type: 'bear', detail: 'Recent 5 candles trending lower' }); }
  if (trendUp10) { bull += 1; } else { bear += 1; }
  if (bbUpper && bbLower) {
    const bbWidth = bbUpper - bbLower;
    const midBB   = (bbUpper + bbLower) / 2;
    if (livePrice > midBB + bbWidth * 0.3)  { bull += 1; factors.push({ label: 'BB Upper Half', type: 'bull', detail: 'Price in upper Bollinger Band — bullish bias' }); }
    else if (livePrice < midBB - bbWidth * 0.3) { bear += 1; factors.push({ label: 'BB Lower Half', type: 'bear', detail: 'Price in lower Bollinger Band — bearish bias' }); }
    if (livePrice >= bbUpper * 0.998) { bear += 1; factors.push({ label: 'BB Resistance', type: 'bear', detail: 'Touching upper band — mean reversion possible' }); }
    if (livePrice <= bbLower * 1.002) { bull += 2; factors.push({ label: 'BB Oversold',   type: 'bull', detail: 'Touching lower band — bounce probability elevated' }); }
  }
  const total     = bull + bear;
  const bullRatio = total > 0 ? bull / total : 0.5;
  let signal, confidence, color, bg;
  if (bullRatio >= 0.62)      { signal = 'BUY';  confidence = Math.min(98, Math.round(50 + (bullRatio - 0.5) * 200)); color = '#16a34a'; bg = 'rgba(22,163,74,0.08)'; }
  else if (bullRatio <= 0.38) { signal = 'SELL'; confidence = Math.min(98, Math.round(50 + (0.5 - bullRatio) * 200)); color = '#dc2626'; bg = 'rgba(220,38,38,0.08)'; }
  else                        { signal = 'HOLD'; confidence = Math.round(50 + Math.abs(bullRatio - 0.5) * 50); color = '#d97706'; bg = 'rgba(217,119,6,0.08)'; }
  return { signal, confidence, color, bg, factors: factors.slice(0, 5), bull, bear };
}

function detectPatterns(chartData) {
  const patterns = [];
  if (chartData.length < 15) return patterns;
  const n = chartData.length;
  const closes = chartData.map(d => d.close);
  const highs  = chartData.map(d => d.high);
  const lows   = chartData.map(d => d.low);
  const last3  = chartData.slice(-3);
  if (last3[0].bullish && !last3[1].bullish && last3[2].bullish &&
      last3[2].close > last3[0].open && last3[1].close < last3[0].close)
    patterns.push({ name: 'Morning Star', type: 'bull', desc: 'Three-candle bullish reversal pattern' });
  if (!last3[0].bullish && last3[1].bullish && !last3[2].bullish &&
      last3[2].close < last3[0].open && last3[1].close > last3[0].close)
    patterns.push({ name: 'Evening Star', type: 'bear', desc: 'Three-candle bearish reversal pattern' });
  const last2 = chartData.slice(-2);
  if (!last2[0].bullish && last2[1].bullish &&
      last2[1].close > last2[0].open && last2[1].open < last2[0].close)
    patterns.push({ name: 'Bullish Engulf', type: 'bull', desc: 'Strong bullish reversal — buyers took full control' });
  if (last2[0].bullish && !last2[1].bullish &&
      last2[1].close < last2[0].open && last2[1].open > last2[0].close)
    patterns.push({ name: 'Bearish Engulf', type: 'bear', desc: 'Strong bearish reversal — sellers took full control' });
  const recentHigh = Math.max(...highs.slice(-20));
  const recentLow  = Math.min(...lows.slice(-20));
  if (closes[n - 1] > recentHigh * 0.998)
    patterns.push({ name: '52-bar High Break', type: 'bull', desc: 'Breaking out to new highs — momentum building' });
  if (closes[n - 1] < recentLow * 1.002)
    patterns.push({ name: '52-bar Low Break', type: 'bear', desc: 'Breaking down to new lows — selling pressure' });
  return patterns.slice(0, 4);
}

function findLevels(chartData) {
  if (chartData.length < 20) return { support: null, resistance: null };
  const lows  = chartData.map(d => d.low);
  const highs = chartData.map(d => d.high);
  const support    = +Math.min(...lows.slice(-20)).toFixed(2);
  const resistance = +Math.max(...highs.slice(-20)).toFixed(2);
  return { support, resistance };
}

function computeFearGreed(chartData) {
  if (chartData.length < 10) return 50;
  const last10 = chartData.slice(-10);
  const bullDays = last10.filter(d => d.bullish).length;
  const rsi = chartData[chartData.length - 1].rsi || 50;
  return Math.round((bullDays / 10) * 50 + (rsi / 100) * 50);
}

/* ═══════════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════════ */

const fmt       = n => n == null ? '–' : n.toFixed(2);
const fmtDollar = n => n == null ? '–' : `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/* ═══════════════════════════════════════════════════════════════
   STYLED COMPONENTS — SHARED
═══════════════════════════════════════════════════════════════ */

const shimmer = keyframes`
  0%   { background-position: -200% 0; }
  100% { background-position:  200% 0; }
`;

const Page = styled.div`
  min-height: 100vh;
  background: #f0f4f8;
  padding: 1.5rem 1.25rem 3rem;
`;

/* ═══════════════════════════════════════════════════════════════
   TUTORIAL STYLED COMPONENTS
═══════════════════════════════════════════════════════════════ */

const TutWrap = styled.div`
  max-width: 860px;
  margin: 0 auto;
`;

const TutHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

const TutTitle = styled.h1`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.55rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const TutSubtitle = styled.p`
  font-size: 0.85rem;
  color: #64748b;
  margin: 0.25rem 0 0;
`;

const ProgressBar = styled.div`
  height: 6px;
  background: #e2e8f0;
  border-radius: 99px;
  margin-bottom: 1.75rem;
  overflow: hidden;
`;

const ProgressFill = styled(motion.div)`
  height: 100%;
  border-radius: 99px;
  background: linear-gradient(90deg, #22c55e, #0ea5e9);
`;

const StepDots = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const Dot = styled.div`
  width: ${p => p.$active ? '22px' : '8px'};
  height: 8px;
  border-radius: 99px;
  background: ${p => p.$done ? '#22c55e' : p.$active ? '#0ea5e9' : '#cbd5e1'};
  transition: all 0.3s;
`;

const LessonCard = styled(motion.div)`
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 4px 24px rgba(15, 23, 42, 0.08);
  overflow: hidden;
  margin-bottom: 1.25rem;
`;

const LessonCardHeader = styled.div`
  padding: 1.25rem 1.5rem 1rem;
  border-bottom: 1px solid #f1f5f9;
`;

const LessonNum = styled.span`
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #0ea5e9;
  background: rgba(14, 165, 233, 0.08);
  padding: 0.2rem 0.55rem;
  border-radius: 6px;
`;

const LessonTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-top: 0.55rem;
`;

const LessonTitle = styled.h2`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.2rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
`;

const LessonIntro = styled.p`
  font-size: 0.9rem;
  color: #475569;
  line-height: 1.65;
  margin: 0.75rem 0 0;
`;

const TipBox = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.55rem;
  background: rgba(14, 165, 233, 0.06);
  border: 1px solid rgba(14, 165, 233, 0.18);
  border-radius: 10px;
  padding: 0.65rem 0.9rem;
  margin: 0.85rem 0 0;
  font-size: 0.82rem;
  color: #0369a1;
  font-weight: 500;
`;

const ChartArea = styled.div`
  padding: 1.25rem 1.5rem;
  background: #fafbfc;
  border-bottom: 1px solid #f1f5f9;
`;

const QuizSection = styled.div`
  padding: 1.25rem 1.5rem;
`;

const QuizQ = styled.div`
  font-weight: 700;
  font-size: 0.95rem;
  color: #0f172a;
  margin-bottom: 0.85rem;
`;

const QuizOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const QuizOpt = styled(motion.button)`
  text-align: left;
  padding: 0.7rem 1rem;
  border-radius: 10px;
  border: 2px solid ${p =>
    p.$state === 'correct' ? '#16a34a' :
    p.$state === 'wrong'   ? '#dc2626' :
    p.$state === 'active'  ? '#0ea5e9' : '#e2e8f0'};
  background: ${p =>
    p.$state === 'correct' ? 'rgba(22,163,74,0.07)'  :
    p.$state === 'wrong'   ? 'rgba(220,38,38,0.07)'  :
    p.$state === 'active'  ? 'rgba(14,165,233,0.07)' : '#ffffff'};
  font-size: 0.88rem;
  font-weight: 600;
  color: #0f172a;
  cursor: ${p => p.$disabled ? 'default' : 'pointer'};
  display: flex;
  align-items: center;
  gap: 0.55rem;
  transition: border-color 0.15s, background 0.15s;
  &:hover {
    border-color: ${p => p.$disabled ? undefined : '#0ea5e9'};
  }
`;

const Explanation = styled(motion.div)`
  padding: 0.7rem 0.9rem;
  border-radius: 10px;
  background: rgba(22, 163, 74, 0.07);
  border: 1px solid rgba(22, 163, 74, 0.2);
  font-size: 0.83rem;
  color: #166534;
  font-weight: 500;
  line-height: 1.5;
  margin-bottom: 0.85rem;
`;

const NavRow = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
`;

const BtnPrimary = styled(motion.button)`
  padding: 0.65rem 1.4rem;
  border: none;
  border-radius: 10px;
  background: linear-gradient(135deg, #15803d, #0f766e);
  color: #fff;
  font-weight: 700;
  font-size: 0.92rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;

const BtnSecondary = styled(motion.button)`
  padding: 0.65rem 1.2rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  background: #fff;
  color: #475569;
  font-weight: 600;
  font-size: 0.88rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;

/* ═══════════════════════════════════════════════════════════════
   SINGLE CANDLE CHART (Lesson 1 — custom SVG)
═══════════════════════════════════════════════════════════════ */

function SingleCandleChart() {
  const W = 660, H = 300;
  const cx = W / 2;
  const highY = 30, lowY = 265;
  const bodyTop = 82, bodyBot = 205;
  const bw = 60;
  const wickLen = (lowY - highY);
  const bodyH   = bodyBot - bodyTop;
  const color   = '#16a34a';

  const callouts = [
    { label: 'HIGH',  y: highY,   side: 'right', delay: 0.7 },
    { label: 'CLOSE', y: bodyTop, side: 'right', delay: 0.9 },
    { label: 'OPEN',  y: bodyBot, side: 'right', delay: 1.1 },
    { label: 'LOW',   y: lowY,    side: 'right', delay: 1.3 },
  ];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: 480, display: 'block', margin: '0 auto' }}>
      {/* Wick */}
      <motion.line
        x1={cx} y1={highY} x2={cx} y2={lowY}
        stroke={color} strokeWidth={3}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      />
      {/* Body */}
      <motion.rect
        x={cx - bw / 2} y={bodyTop} width={bw} height={bodyH}
        rx={4} fill={color}
        initial={{ opacity: 0, scaleY: 0 }}
        animate={{ opacity: 1, scaleY: 1 }}
        style={{ originY: `${((bodyTop + bodyBot) / 2 / H) * 100}%` }}
        transition={{ delay: 0.35, duration: 0.4, ease: 'easeOut' }}
      />
      {/* Callout lines + labels */}
      {callouts.map(({ label, y, delay }) => (
        <motion.g key={label} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay, duration: 0.3 }}>
          <line x1={cx + bw / 2 + 6} y1={y} x2={cx + bw / 2 + 60} y2={y} stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="3 3" />
          <rect x={cx + bw / 2 + 64} y={y - 10} width={58} height={20} rx={5} fill="#f1f5f9" />
          <text x={cx + bw / 2 + 93} y={y + 4} textAnchor="middle" fontSize={11} fontWeight="700" fill="#0f172a">{label}</text>
        </motion.g>
      ))}
      {/* Body bracket */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.55, duration: 0.3 }}>
        <line x1={cx - bw / 2 - 10} y1={bodyTop} x2={cx - bw / 2 - 10} y2={bodyBot} stroke="#0ea5e9" strokeWidth={2} />
        <line x1={cx - bw / 2 - 16} y1={bodyTop} x2={cx - bw / 2 - 4} y2={bodyTop} stroke="#0ea5e9" strokeWidth={2} />
        <line x1={cx - bw / 2 - 16} y1={bodyBot} x2={cx - bw / 2 - 4} y2={bodyBot} stroke="#0ea5e9" strokeWidth={2} />
        <text x={cx - bw / 2 - 18} y={(bodyTop + bodyBot) / 2 + 4} textAnchor="end" fontSize={11} fontWeight="700" fill="#0ea5e9">BODY</text>
      </motion.g>
      {/* Wick label */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.75, duration: 0.3 }}>
        <text x={cx - bw / 2 - 18} y={highY + 4} textAnchor="end" fontSize={11} fontWeight="700" fill="#94a3b8">WICK</text>
        <line x1={cx - bw / 2 - 4} y1={highY} x2={cx - bw / 2 + 2} y2={highY} stroke="#94a3b8" strokeWidth={1.5} />
      </motion.g>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CUSTOM CANDLESTICK SHAPE (Recharts)
═══════════════════════════════════════════════════════════════ */

function CandlestickShape(props) {
  const { x, y, width, height, low, high, open, close, bullish } = props;
  if (x == null || width == null) return null;
  const cx     = x + width / 2;
  const color  = bullish ? '#16a34a' : '#dc2626';
  const bodyH  = Math.max(Math.abs(height), 1);
  const bodyY  = bullish ? y : y + height;
  const yScale = props.yScale || (v => v);

  return (
    <g>
      <line x1={cx} y1={yScale(high)} x2={cx} y2={yScale(low)} stroke={color} strokeWidth={1.5} />
      <rect x={x + 1} y={bodyY} width={Math.max(width - 2, 2)} height={bodyH} fill={color} rx={1} />
    </g>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TUTORIAL CHART (Recharts — lessons 2-5)
═══════════════════════════════════════════════════════════════ */

function TutorialChart({ lesson }) {
  const [start, end] = lesson.range || [0, 59];
  const slice = TDATA.slice(start, end + 1);

  const allPrices = slice.flatMap(d => [d.high, d.low]);
  const minP = Math.min(...allPrices) - 2;
  const maxP = Math.max(...allPrices) + 2;

  const showMA  = lesson.type === 'ma';
  const showRSI = lesson.showRSI;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <ResponsiveContainer width="100%" height={220}>
        <ComposedChart data={slice} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="idx" tick={false} axisLine={false} tickLine={false} />
          <YAxis domain={[minP, maxP]} tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={42} tickFormatter={v => `$${v.toFixed(0)}`} />
          <Tooltip
            contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 11 }}
            formatter={(v, name) => [typeof v === 'number' ? `$${v.toFixed(2)}` : v, name]}
          />

          {/* Trend highlight zones */}
          {lesson.type === 'trend' && (
            <>
              <ReferenceArea x1={12} x2={26} fill="rgba(220,38,38,0.08)" label={{ value: 'Downtrend', position: 'insideTop', fontSize: 10, fill: '#dc2626', fontWeight: 700 }} />
              <ReferenceArea x1={27} x2={43} fill="rgba(22,163,74,0.08)" label={{ value: 'Uptrend', position: 'insideTop', fontSize: 10, fill: '#16a34a', fontWeight: 700 }} />
            </>
          )}

          {/* Direction highlights */}
          {lesson.type === 'direction' && (() => {
            const bullIdx = slice.findIndex(d => d.bullish);
            const bearIdx = slice.findIndex(d => !d.bullish);
            return (
              <>
                {bullIdx >= 0 && <ReferenceArea x1={slice[bullIdx].idx} x2={slice[bullIdx].idx} fill="rgba(22,163,74,0.18)" label={{ value: '▲ Bull', position: 'insideTop', fontSize: 10, fill: '#16a34a', fontWeight: 700 }} />}
                {bearIdx >= 0 && <ReferenceArea x1={slice[bearIdx].idx} x2={slice[bearIdx].idx} fill="rgba(220,38,38,0.18)" label={{ value: '▼ Bear', position: 'insideTop', fontSize: 10, fill: '#dc2626', fontWeight: 700 }} />}
              </>
            );
          })()}

          {/* Support/Resistance */}
          {(lesson.type === 'trend' || lesson.type === 'rsi') && (
            <>
              <ReferenceLine y={T_SUPPORT}    stroke="#16a34a" strokeDasharray="4 3" label={{ value: 'Support',    position: 'insideBottomRight', fontSize: 9, fill: '#16a34a' }} />
              <ReferenceLine y={T_RESISTANCE} stroke="#dc2626" strokeDasharray="4 3" label={{ value: 'Resistance', position: 'insideTopRight',    fontSize: 9, fill: '#dc2626' }} />
            </>
          )}

          {/* Candlesticks */}
          <Bar dataKey="close" isAnimationActive={false} shape={(props) => {
            const d = slice.find(r => r.idx === props.idx) || {};
            return <CandlestickShape {...props} low={d.low} high={d.high} bullish={d.bullish} yScale={props.yAxis?.scale} />;
          }}>
            {slice.map((d, i) => <Cell key={i} fill={d.bullish ? '#16a34a' : '#dc2626'} />)}
          </Bar>

          {/* MAs */}
          {showMA && (
            <>
              <Line dataKey="sma20" stroke="#f59e0b" dot={false} strokeWidth={2} isAnimationActive animationDuration={800} name="SMA20" connectNulls />
              <Line dataKey="sma50" stroke="#3b82f6" dot={false} strokeWidth={2} isAnimationActive animationDuration={1000} name="SMA50" connectNulls />
            </>
          )}
        </ComposedChart>
      </ResponsiveContainer>

      {showRSI && (
        <ResponsiveContainer width="100%" height={80}>
          <ComposedChart data={slice} margin={{ top: 0, right: 8, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="idx" tick={false} axisLine={false} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 9, fill: '#94a3b8' }} width={42} tickFormatter={v => v} axisLine={false} tickLine={false} />
            <ReferenceArea y1={70} y2={100} fill="rgba(220,38,38,0.08)" label={{ value: 'Overbought', position: 'insideTopRight', fontSize: 9, fill: '#dc2626' }} />
            <ReferenceArea y1={0}  y2={30}  fill="rgba(22,163,74,0.08)"  label={{ value: 'Oversold',   position: 'insideBottomRight', fontSize: 9, fill: '#16a34a' }} />
            <ReferenceLine y={70} stroke="#dc2626" strokeDasharray="3 2" strokeWidth={1} />
            <ReferenceLine y={30} stroke="#16a34a" strokeDasharray="3 2" strokeWidth={1} />
            <Line dataKey="rsi" stroke="#8b5cf6" dot={false} strokeWidth={2} isAnimationActive animationDuration={900} name="RSI" connectNulls />
          </ComposedChart>
        </ResponsiveContainer>
      )}

      {showMA && (
        <div style={{ display: 'flex', gap: '1rem', paddingLeft: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11, color: '#f59e0b', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ display: 'inline-block', width: 18, height: 2, background: '#f59e0b', borderRadius: 2 }} /> SMA 20
          </span>
          <span style={{ fontSize: 11, color: '#3b82f6', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ display: 'inline-block', width: 18, height: 2, background: '#3b82f6', borderRadius: 2 }} /> SMA 50
          </span>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   GRADUATION SCREEN
═══════════════════════════════════════════════════════════════ */

const GradWrap = styled(motion.div)`
  max-width: 520px;
  margin: 0 auto;
  text-align: center;
  padding: 3rem 2rem;
`;

const TrophyRing = styled(motion.div)`
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background: linear-gradient(135deg, #22c55e, #0ea5e9);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  font-size: 2.5rem;
  box-shadow: 0 12px 40px rgba(34, 197, 94, 0.35);
`;

const GradTitle = styled.h2`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.8rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 0.6rem;
`;

const GradSub = styled.p`
  color: #64748b;
  font-size: 0.95rem;
  line-height: 1.6;
  margin: 0 0 2rem;
`;

const UnlockCard = styled(motion.div)`
  background: #fff;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  padding: 1.25rem 1.5rem;
  margin-bottom: 1rem;
  text-align: left;
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
`;

const UnlockIcon = styled.div`
  font-size: 1.4rem;
  margin-top: 0.1rem;
`;

function GraduationScreen({ onGraduate }) {
  const unlocks = [
    { icon: '📊', label: 'Live Price Charts', desc: 'Real stock data with OHLC candlesticks and indicators' },
    { icon: '🤖', label: 'AI Signal Engine', desc: 'Multi-factor BUY/SELL/HOLD signals with confidence scoring' },
    { icon: '🎯', label: 'Pattern Detection', desc: 'Auto-detect engulfing, morning stars, breakouts and more' },
    { icon: '📈', label: 'Technical Indicators', desc: 'Bollinger Bands, RSI, dual MAs and support/resistance' },
  ];

  return (
    <Page>
      <GradWrap
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <TrophyRing
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        >
          🏆
        </TrophyRing>
        <GradTitle>Chart Reading Unlocked!</GradTitle>
        <GradSub>
          You've completed all 5 lessons. You now understand candlesticks, trends, moving averages, and RSI.<br />
          Time to put it to work in the full trading simulator.
        </GradSub>

        {unlocks.map((u, i) => (
          <UnlockCard
            key={u.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 * i + 0.3 }}
          >
            <UnlockIcon>{u.icon}</UnlockIcon>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>{u.label}</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: 2 }}>{u.desc}</div>
            </div>
          </UnlockCard>
        ))}

        <BtnPrimary
          style={{ margin: '1.5rem auto 0', width: '100%', justifyContent: 'center', padding: '0.95rem', fontSize: '1rem' }}
          onClick={onGraduate}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FaChartLine /> Enter the Trading Simulator
        </BtnPrimary>
      </GradWrap>
    </Page>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TUTORIAL MODE
═══════════════════════════════════════════════════════════════ */

function TutorialMode({ onGraduate }) {
  const [lessonIdx, setLessonIdx] = useState(0);
  const [selected,  setSelected]  = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [showGrad,  setShowGrad]  = useState(false);

  const lesson = LESSONS[lessonIdx];
  const isLast = lessonIdx === LESSONS.length - 1;
  const progress = ((lessonIdx + (submitted ? 1 : 0)) / LESSONS.length) * 100;

  const handleSubmit = () => { if (selected !== null) setSubmitted(true); };

  const handleNext = () => {
    if (isLast) {
      setShowGrad(true);
    } else {
      setLessonIdx(i => i + 1);
      setSelected(null);
      setSubmitted(false);
    }
  };

  const handlePrev = () => {
    if (lessonIdx > 0) {
      setLessonIdx(i => i - 1);
      setSelected(null);
      setSubmitted(false);
    }
  };

  if (showGrad) return <GraduationScreen onGraduate={onGraduate} />;

  return (
    <Page>
      <TutWrap>
        <TutHeader>
          <div>
            <TutTitle><FaBook /> Chart Reading Course</TutTitle>
            <TutSubtitle>Learn to read charts before you trade — 5 animated lessons</TutSubtitle>
          </div>
          <StepDots>
            {LESSONS.map((l, i) => (
              <Dot key={l.id} $active={i === lessonIdx} $done={i < lessonIdx} />
            ))}
          </StepDots>
        </TutHeader>

        <ProgressBar>
          <ProgressFill animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} />
        </ProgressBar>

        <AnimatePresence mode="wait">
          <LessonCard
            key={lesson.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            <LessonCardHeader>
              <LessonNum>Lesson {lessonIdx + 1} of {LESSONS.length}</LessonNum>
              <LessonTitleRow>
                <span style={{ fontSize: '1.3rem' }}>{lesson.emoji}</span>
                <LessonTitle>{lesson.title}</LessonTitle>
              </LessonTitleRow>
              <LessonIntro>{lesson.intro}</LessonIntro>
              <TipBox>
                <FaLightbulb style={{ color: '#0ea5e9', marginTop: 1, flexShrink: 0 }} />
                {lesson.tip}
              </TipBox>
            </LessonCardHeader>

            <ChartArea>
              {lesson.type === 'single' ? <SingleCandleChart /> : <TutorialChart lesson={lesson} />}
            </ChartArea>

            <QuizSection>
              <QuizQ>🧠 Quick Check — {lesson.quiz.q}</QuizQ>
              <QuizOptions>
                {lesson.quiz.options.map((opt, i) => {
                  let state = 'idle';
                  if (submitted) {
                    if (i === lesson.quiz.correct) state = 'correct';
                    else if (i === selected)        state = 'wrong';
                  } else if (i === selected) {
                    state = 'active';
                  }
                  return (
                    <QuizOpt
                      key={i}
                      $state={state}
                      $disabled={submitted}
                      onClick={() => !submitted && setSelected(i)}
                      whileHover={submitted ? {} : { x: 3 }}
                      whileTap={submitted ? {} : { scale: 0.99 }}
                    >
                      {submitted && i === lesson.quiz.correct && <FaCheck style={{ color: '#16a34a', flexShrink: 0 }} />}
                      {submitted && i === selected && i !== lesson.quiz.correct && <FaTimes style={{ color: '#dc2626', flexShrink: 0 }} />}
                      {!submitted && (
                        <span style={{
                          width: 18, height: 18, borderRadius: '50%',
                          border: `2px solid ${selected === i ? '#0ea5e9' : '#cbd5e1'}`,
                          background: selected === i ? '#0ea5e9' : 'transparent',
                          flexShrink: 0, display: 'inline-block',
                        }} />
                      )}
                      {opt}
                    </QuizOpt>
                  );
                })}
              </QuizOptions>

              <AnimatePresence>
                {submitted && (
                  <Explanation
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    ✅ {lesson.quiz.explanation}
                  </Explanation>
                )}
              </AnimatePresence>

              <NavRow>
                {lessonIdx > 0 && (
                  <BtnSecondary onClick={handlePrev} whileHover={{ x: -2 }} whileTap={{ scale: 0.97 }}>
                    <FaChevronLeft /> Back
                  </BtnSecondary>
                )}
                {!submitted ? (
                  <BtnPrimary
                    onClick={handleSubmit}
                    style={{ opacity: selected === null ? 0.5 : 1, cursor: selected === null ? 'default' : 'pointer' }}
                    whileHover={selected !== null ? { scale: 1.02 } : {}}
                    whileTap={selected !== null ? { scale: 0.98 } : {}}
                  >
                    Check Answer <FaChevronRight />
                  </BtnPrimary>
                ) : (
                  <BtnPrimary onClick={handleNext} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    {isLast ? <><FaGraduationCap /> Graduate</> : <>Next Lesson <FaChevronRight /></>}
                  </BtnPrimary>
                )}
              </NavRow>
            </QuizSection>
          </LessonCard>
        </AnimatePresence>
      </TutWrap>
    </Page>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ADVANCED MODE STYLED COMPONENTS
═══════════════════════════════════════════════════════════════ */

const AdvPage = styled.div`
  min-height: 100vh;
  background: #f0f4f8;
  padding: 1.25rem 1rem 2.5rem;
`;

const AdvInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

const AdvTitle = styled.h1`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.4rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const BackBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 0.95rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background: #fff;
  font-size: 0.8rem;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  &:hover { border-color: #94a3b8; color: #334155; }
`;

const ControlRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-bottom: 1.1rem;
`;

const Select = styled.select`
  padding: 0.55rem 0.85rem;
  border: 1.5px solid #e2e8f0;
  border-radius: 9px;
  background: #fff;
  font-size: 0.85rem;
  font-weight: 600;
  color: #0f172a;
  cursor: pointer;
  &:focus { outline: none; border-color: #0ea5e9; }
`;

const TFBtn = styled.button`
  padding: 0.45rem 0.85rem;
  border-radius: 8px;
  border: 1.5px solid ${p => p.$active ? '#0ea5e9' : '#e2e8f0'};
  background: ${p => p.$active ? 'rgba(14,165,233,0.07)' : '#fff'};
  color: ${p => p.$active ? '#0369a1' : '#64748b'};
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
`;

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 1rem;
  @media (max-width: 900px) { grid-template-columns: 1fr; }
`;

const Card = styled.div`
  background: #fff;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 12px rgba(15,23,42,0.05);
  overflow: hidden;
`;

const CardHead = styled.div`
  padding: 0.9rem 1.1rem 0.75rem;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CardTitle = styled.span`
  font-weight: 800;
  font-size: 0.88rem;
  color: #0f172a;
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;

const PriceRow = styled.div`
  padding: 0.85rem 1.1rem;
  display: flex;
  align-items: baseline;
  gap: 0.65rem;
  flex-wrap: wrap;
`;

const PriceBig = styled.span`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.85rem;
  font-weight: 800;
  color: #0f172a;
`;

const PriceChange = styled.span`
  font-weight: 700;
  font-size: 0.9rem;
  color: ${p => p.$up ? '#16a34a' : '#dc2626'};
  background: ${p => p.$up ? 'rgba(22,163,74,0.08)' : 'rgba(220,38,38,0.08)'};
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
`;

const SidePanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SignalBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.3rem 0.75rem;
  border-radius: 8px;
  font-weight: 800;
  font-size: 0.88rem;
  background: ${p => p.$bg};
  color: ${p => p.$color};
  border: 1.5px solid ${p => p.$color}30;
`;

const FactorRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.4rem 0;
  border-bottom: 1px solid #f8fafc;
  font-size: 0.79rem;
`;

const FactorLabel = styled.span`
  font-weight: 600;
  color: ${p => p.$type === 'bull' ? '#16a34a' : '#dc2626'};
`;

const PatternChip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.25rem 0.6rem;
  border-radius: 6px;
  font-size: 0.74rem;
  font-weight: 700;
  background: ${p => p.$type === 'bull' ? 'rgba(22,163,74,0.08)' : 'rgba(220,38,38,0.08)'};
  color: ${p => p.$type === 'bull' ? '#15803d' : '#b91c1c'};
  border: 1px solid ${p => p.$type === 'bull' ? 'rgba(22,163,74,0.2)' : 'rgba(220,38,38,0.2)'};
  margin: 0.2rem 0.2rem 0 0;
`;

const AIBubble = styled(motion.div)`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 0.7rem 0.9rem;
  font-size: 0.82rem;
  color: #334155;
  line-height: 1.55;
  margin: 0.35rem 0;
  &.user {
    background: linear-gradient(135deg, rgba(15,118,110,0.07), rgba(34,197,94,0.07));
    border-color: rgba(15,118,110,0.15);
    color: #0f172a;
    align-self: flex-end;
    max-width: 85%;
  }
`;

const ChatInput = styled.input`
  flex: 1;
  padding: 0.6rem 0.85rem;
  border: 1.5px solid #e2e8f0;
  border-radius: 9px;
  font-size: 0.85rem;
  background: #fafbfc;
  color: #0f172a;
  &:focus { outline: none; border-color: #0ea5e9; background: #fff; }
`;

const SendBtn = styled.button`
  padding: 0.6rem 0.9rem;
  border: none;
  border-radius: 9px;
  background: linear-gradient(135deg, #15803d, #0f766e);
  color: #fff;
  font-weight: 700;
  font-size: 0.82rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.35rem;
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.6rem;
  padding: 0.75rem 1rem;
`;

const StatBox = styled.div`
  background: #f8fafc;
  border-radius: 9px;
  padding: 0.55rem 0.75rem;
`;

const StatLabel = styled.div`
  font-size: 0.67rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #94a3b8;
  margin-bottom: 0.22rem;
`;

const StatVal = styled.div`
  font-size: 0.92rem;
  font-weight: 800;
  color: ${p => p.$color || '#0f172a'};
`;

/* ═══════════════════════════════════════════════════════════════
   RECHARTS TOOLTIP
═══════════════════════════════════════════════════════════════ */

function CandleTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  if (!d) return null;
  return (
    <div style={{
      background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10,
      padding: '0.6rem 0.85rem', fontSize: 11, boxShadow: '0 4px 16px rgba(15,23,42,0.1)',
    }}>
      <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>{d.date}</div>
      {[['O', d.open], ['H', d.high], ['L', d.low], ['C', d.close]].map(([k, v]) => (
        <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, color: '#475569' }}>
          <span style={{ fontWeight: 600 }}>{k}</span><span>${fmt(v)}</span>
        </div>
      ))}
      {d.sma20 && <div style={{ color: '#f59e0b', fontWeight: 600 }}>SMA20 ${fmt(d.sma20)}</div>}
      {d.sma50 && <div style={{ color: '#3b82f6', fontWeight: 600 }}>SMA50 ${fmt(d.sma50)}</div>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ADVANCED MODE COMPONENT
═══════════════════════════════════════════════════════════════ */

function AdvancedMode({ onBackToTutorial }) {
  const { user } = useAuth();
  const [ticker,   setTicker]   = useState(stocks[0]?.symbol || 'AAPL');
  const [tf,       setTf]       = useState('3M');
  const [prices,   setPrices]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [livePrice, setLivePrice] = useState(null);
  const [chatMsg,  setChatMsg]  = useState('');
  const [chatLog,  setChatLog]  = useState([]);
  const [aiTyping, setAiTyping] = useState(false);
  const [showInd,  setShowInd]  = useState({ sma: true, bb: false, rsi: true });
  const chatEndRef = useRef(null);

  const stock = useMemo(() => stocks.find(s => s.symbol === ticker) || stocks[0], [ticker]);

  useEffect(() => {
    setLoading(true);
    const load = async () => {
      try {
        const data = await api.getStockHistory(ticker);
        setPrices(data || []);
        setLivePrice(data?.[data.length - 1]?.price ?? null);
      } catch {
        setPrices([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [ticker]);

  const ohlc      = useMemo(() => generateOHLC(sliceByTF(prices, tf)), [prices, tf]);
  const chartData = useMemo(() => buildChartData(ohlc), [ohlc]);
  const aiSignal  = useMemo(() => computeAISignal(chartData, livePrice), [chartData, livePrice]);
  const patterns  = useMemo(() => detectPatterns(chartData), [chartData]);
  const levels    = useMemo(() => findLevels(chartData), [chartData]);
  const fg        = useMemo(() => computeFearGreed(chartData), [chartData]);

  const change   = prices.length >= 2 ? prices[prices.length - 1].price - prices[prices.length - 2].price : 0;
  const changePct = prices.length >= 2 ? (change / prices[prices.length - 2].price) * 100 : 0;

  const allPrices = chartData.flatMap(d => [d.high, d.low]);
  const minP = allPrices.length ? Math.min(...allPrices) * 0.998 : 0;
  const maxP = allPrices.length ? Math.max(...allPrices) * 1.002 : 100;

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatLog]);

  const sendChat = async () => {
    const msg = chatMsg.trim();
    if (!msg) return;
    setChatMsg('');
    setChatLog(l => [...l, { role: 'user', text: msg }]);
    setAiTyping(true);
    try {
      const ctx = `Stock: ${ticker}. Price: $${fmt(livePrice)}. Signal: ${aiSignal?.signal} (${aiSignal?.confidence}%). RSI: ${chartData[chartData.length - 1]?.rsi ?? 'N/A'}. User question: ${msg}`;
      const res = await api.chat(ctx, user);
      setChatLog(l => [...l, { role: 'ai', text: res }]);
    } catch {
      setChatLog(l => [...l, { role: 'ai', text: "Sorry, I couldn't reach the AI at the moment. Try again soon." }]);
    } finally {
      setAiTyping(false);
    }
  };

  const rsiVals = chartData.map(d => d.rsi).filter(Boolean);
  const lastRsi = rsiVals[rsiVals.length - 1];

  return (
    <AdvPage>
      <AdvInner>
        <TopBar>
          <AdvTitle><FaChartLine /> Advanced Chart Simulator</AdvTitle>
          <BackBtn onClick={onBackToTutorial}>
            <FaBook /> Back to Tutorial
          </BackBtn>
        </TopBar>

        <ControlRow>
          <Select value={ticker} onChange={e => setTicker(e.target.value)}>
            {stocks.map(s => <option key={s.symbol} value={s.symbol}>{s.symbol} — {s.name}</option>)}
          </Select>
          {['1W', '1M', '3M', '6M'].map(t => (
            <TFBtn key={t} $active={tf === t} onClick={() => setTf(t)}>{t}</TFBtn>
          ))}
          <TFBtn $active={showInd.sma} onClick={() => setShowInd(s => ({ ...s, sma: !s.sma }))}>SMA</TFBtn>
          <TFBtn $active={showInd.bb}  onClick={() => setShowInd(s => ({ ...s, bb: !s.bb }))}>BB</TFBtn>
          <TFBtn $active={showInd.rsi} onClick={() => setShowInd(s => ({ ...s, rsi: !s.rsi }))}>RSI</TFBtn>
        </ControlRow>

        <MainGrid>
          {/* Left: Chart */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Card>
              <CardHead>
                <div>
                  <CardTitle style={{ fontSize: '1rem' }}>{ticker} <span style={{ fontWeight: 500, color: '#64748b', fontSize: '0.8rem' }}>{stock?.name}</span></CardTitle>
                </div>
                {aiSignal && (
                  <SignalBadge $bg={aiSignal.bg} $color={aiSignal.color}>
                    {aiSignal.signal === 'BUY' ? <FaArrowUp /> : aiSignal.signal === 'SELL' ? <FaArrowDown /> : <FaBolt />}
                    {aiSignal.signal} · {aiSignal.confidence}%
                  </SignalBadge>
                )}
              </CardHead>
              <PriceRow>
                <PriceBig>{fmtDollar(livePrice)}</PriceBig>
                {prices.length >= 2 && (
                  <PriceChange $up={change >= 0}>
                    {change >= 0 ? '▲' : '▼'} {Math.abs(change).toFixed(2)} ({Math.abs(changePct).toFixed(2)}%)
                  </PriceChange>
                )}
              </PriceRow>

              {loading ? (
                <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                  <FaSpinner style={{ animation: 'spin 1s linear infinite' }} /> &nbsp; Loading chart…
                </div>
              ) : (
                <div style={{ padding: '0 0.75rem 0.75rem' }}>
                  <ResponsiveContainer width="100%" height={260}>
                    <ComposedChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} interval={Math.floor(chartData.length / 6)} />
                      <YAxis domain={[minP, maxP]} tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={52} tickFormatter={v => `$${v.toFixed(0)}`} />
                      <Tooltip content={<CandleTooltip />} />

                      {levels.support    && <ReferenceLine y={levels.support}    stroke="#16a34a" strokeDasharray="4 3" label={{ value: 'S', position: 'right', fontSize: 10, fill: '#16a34a' }} />}
                      {levels.resistance && <ReferenceLine y={levels.resistance} stroke="#dc2626" strokeDasharray="4 3" label={{ value: 'R', position: 'right', fontSize: 10, fill: '#dc2626' }} />}

                      {showInd.bb && chartData[0]?.bbUpper && (
                        <>
                          <Line dataKey="bbUpper" stroke="#8b5cf6" dot={false} strokeWidth={1} strokeDasharray="3 2" isAnimationActive={false} name="BB Upper" connectNulls />
                          <Line dataKey="bbLower" stroke="#8b5cf6" dot={false} strokeWidth={1} strokeDasharray="3 2" isAnimationActive={false} name="BB Lower" connectNulls />
                          <Line dataKey="bbMid"   stroke="#8b5cf620" dot={false} strokeWidth={1} isAnimationActive={false} name="BB Mid" connectNulls />
                        </>
                      )}

                      <Bar dataKey="close" isAnimationActive={false} shape={(props) => {
                        const d = chartData[props.index] || {};
                        return <CandlestickShape {...props} low={d.low} high={d.high} bullish={d.bullish} yScale={props.yAxis?.scale} />;
                      }}>
                        {chartData.map((d, i) => <Cell key={i} fill={d.bullish ? '#16a34a' : '#dc2626'} />)}
                      </Bar>

                      {showInd.sma && (
                        <>
                          <Line dataKey="sma20" stroke="#f59e0b" dot={false} strokeWidth={2} isAnimationActive animationDuration={600} name="SMA20" connectNulls />
                          <Line dataKey="sma50" stroke="#3b82f6" dot={false} strokeWidth={2} isAnimationActive animationDuration={800} name="SMA50" connectNulls />
                        </>
                      )}
                    </ComposedChart>
                  </ResponsiveContainer>

                  {showInd.rsi && rsiVals.length > 0 && (
                    <ResponsiveContainer width="100%" height={80}>
                      <ComposedChart data={chartData} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="date" tick={false} axisLine={false} />
                        <YAxis domain={[0, 100]} tick={{ fontSize: 9, fill: '#94a3b8' }} width={52} axisLine={false} tickLine={false} />
                        <ReferenceArea y1={70} y2={100} fill="rgba(220,38,38,0.06)" />
                        <ReferenceArea y1={0}  y2={30}  fill="rgba(22,163,74,0.06)" />
                        <ReferenceLine y={70} stroke="#dc2626" strokeDasharray="3 2" strokeWidth={1} />
                        <ReferenceLine y={30} stroke="#16a34a" strokeDasharray="3 2" strokeWidth={1} />
                        <Line dataKey="rsi" stroke="#8b5cf6" dot={false} strokeWidth={2} isAnimationActive animationDuration={700} name="RSI" connectNulls />
                      </ComposedChart>
                    </ResponsiveContainer>
                  )}
                </div>
              )}
            </Card>

            {/* Patterns */}
            {patterns.length > 0 && (
              <Card>
                <CardHead>
                  <CardTitle><FaBullseye /> Detected Patterns</CardTitle>
                </CardHead>
                <div style={{ padding: '0.75rem 1rem', display: 'flex', flexWrap: 'wrap' }}>
                  {patterns.map(p => (
                    <PatternChip key={p.name} $type={p.type}>
                      {p.type === 'bull' ? '▲' : '▼'} {p.name}
                    </PatternChip>
                  ))}
                </div>
                <div style={{ padding: '0 1rem 0.85rem' }}>
                  {patterns.map(p => (
                    <div key={p.name} style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: 3 }}>
                      <strong style={{ color: p.type === 'bull' ? '#15803d' : '#b91c1c' }}>{p.name}:</strong> {p.desc}
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Right: Side Panel */}
          <SidePanel>
            {/* AI Signal */}
            {aiSignal && (
              <Card>
                <CardHead>
                  <CardTitle><FaRobot /> AI Signal</CardTitle>
                  <SignalBadge $bg={aiSignal.bg} $color={aiSignal.color}>{aiSignal.signal}</SignalBadge>
                </CardHead>
                <div style={{ padding: '0.85rem 1rem 0.35rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                    <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Confidence</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: aiSignal.color }}>{aiSignal.confidence}%</span>
                  </div>
                  <div style={{ height: 6, background: '#f1f5f9', borderRadius: 99, overflow: 'hidden', marginBottom: '0.85rem' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${aiSignal.confidence}%` }}
                      transition={{ duration: 0.6 }}
                      style={{ height: '100%', background: aiSignal.color, borderRadius: 99 }}
                    />
                  </div>
                  {aiSignal.factors.map(f => (
                    <FactorRow key={f.label}>
                      <FactorLabel $type={f.type}>{f.type === 'bull' ? '▲' : '▼'} {f.label}</FactorLabel>
                      <span style={{ fontSize: '0.7rem', color: '#94a3b8', maxWidth: 130, textAlign: 'right' }}>{f.detail.split('—')[0]}</span>
                    </FactorRow>
                  ))}
                </div>
              </Card>
            )}

            {/* Stats */}
            <Card>
              <CardHead><CardTitle><FaChartBar /> Key Stats</CardTitle></CardHead>
              <StatGrid>
                {[
                  ['RSI', lastRsi != null ? lastRsi.toFixed(1) : '–', lastRsi > 70 ? '#dc2626' : lastRsi < 30 ? '#16a34a' : '#0f172a'],
                  ['Support', levels.support ? `$${levels.support}` : '–', '#16a34a'],
                  ['Resistance', levels.resistance ? `$${levels.resistance}` : '–', '#dc2626'],
                  ['Fear/Greed', `${fg}/100`, fg > 60 ? '#16a34a' : fg < 40 ? '#dc2626' : '#d97706'],
                  ['Bull Bars', `${chartData.slice(-10).filter(d => d.bullish).length}/10`, '#16a34a'],
                  ['Candles', `${chartData.length}`, '#64748b'],
                ].map(([lbl, val, col]) => (
                  <StatBox key={lbl}>
                    <StatLabel>{lbl}</StatLabel>
                    <StatVal $color={col}>{val}</StatVal>
                  </StatBox>
                ))}
              </StatGrid>
            </Card>

            {/* AI Chat */}
            <Card>
              <CardHead><CardTitle><FaBrain /> AI Mentor</CardTitle></CardHead>
              <div style={{ padding: '0.6rem 0.85rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', maxHeight: 220, overflowY: 'auto' }}>
                {chatLog.length === 0 && (
                  <AIBubble>Ask me anything about {ticker} — patterns, signals, what the RSI means, how to read this chart…</AIBubble>
                )}
                {chatLog.map((m, i) => (
                  <AIBubble key={i} className={m.role === 'user' ? 'user' : ''}>
                    {m.role === 'ai' && <strong style={{ color: '#0ea5e9', marginRight: 4 }}>AI:</strong>}
                    {m.text}
                  </AIBubble>
                ))}
                {aiTyping && (
                  <AIBubble>
                    <span style={{ display: 'flex', gap: 4 }}>
                      {[0, 0.15, 0.3].map((d, i) => (
                        <motion.span key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#0ea5e9', display: 'inline-block' }}
                          animate={{ y: [0, -5, 0] }} transition={{ duration: 0.5, repeat: Infinity, delay: d }} />
                      ))}
                    </span>
                  </AIBubble>
                )}
                <div ref={chatEndRef} />
              </div>
              <div style={{ padding: '0.5rem 0.85rem 0.85rem', display: 'flex', gap: '0.45rem' }}>
                <ChatInput
                  value={chatMsg}
                  onChange={e => setChatMsg(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendChat()}
                  placeholder="Ask the AI mentor…"
                />
                <SendBtn onClick={sendChat} disabled={!chatMsg.trim() || aiTyping}>
                  <FaPaperPlane />
                </SendBtn>
              </div>
            </Card>
          </SidePanel>
        </MainGrid>
      </AdvInner>
    </AdvPage>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN EXPORT
═══════════════════════════════════════════════════════════════ */

export default function ChartSimPage() {
  const [graduated, setGraduated] = useState(() => {
    try { return localStorage.getItem('bv_chart_grad') === '1'; } catch { return false; }
  });

  const handleGraduate = () => {
    try { localStorage.setItem('bv_chart_grad', '1'); } catch {}
    setGraduated(true);
  };

  const handleBackToTutorial = () => {
    setGraduated(false);
  };

  return graduated
    ? <AdvancedMode onBackToTutorial={handleBackToTutorial} />
    : <TutorialMode onGraduate={handleGraduate} />;
}
