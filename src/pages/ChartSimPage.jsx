import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ComposedChart, Area, Bar, Cell, Line, XAxis, YAxis,
  Tooltip, ResponsiveContainer, ReferenceLine, CartesianGrid,
} from 'recharts';
import {
  FaRobot, FaPaperPlane, FaChartLine, FaChartBar, FaArrowUp, FaArrowDown,
  FaBolt, FaSpinner, FaCheckCircle, FaTimes, FaBrain,
  FaHistory, FaWallet, FaFire, FaShieldAlt, FaLightbulb,
  FaBullseye, FaExclamationTriangle, FaChevronRight, FaStar,
  FaSearch, FaRegBell,
} from 'react-icons/fa';
import { stocks, marketIndices } from '../data/stockData';
import { api } from '../api';
import { useAuth } from '../AuthContext';

/* ─────────────────────────────────────────────────────────────
   ANALYTICS ENGINE — signal, patterns, levels, commentary
───────────────────────────────────────────────────────────── */

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
    const low = +(Math.min(open, close) - wick * (0.2 + Math.random() * 0.6)).toFixed(2);
    return { date: p.date, open, close, high, low, volume: p.volume, bullish: close >= open };
  });
}

function buildChartData(ohlc) {
  const sma20 = computeSMA(ohlc, 20);
  const sma50 = computeSMA(ohlc, 50);
  const bb = computeBB(ohlc, 20, 2);
  const rsiVals = computeRSI(ohlc, 14);
  return ohlc.map((d, i) => ({
    ...d,
    wickRange: [d.low, d.high],
    sma20: sma20[i],
    sma50: sma50[i],
    bbUpper: bb[i].upper,
    bbMid: bb[i].mid,
    bbLower: bb[i].lower,
    rsi: rsiVals[i],
  }));
}

function sliceByTF(prices, tf) {
  return prices.slice(-({ '1W': 7, '1M': 30, '3M': 60, '6M': 90 }[tf] ?? 90));
}

// ── AI Signal Engine ──────────────────────────────────────────
function computeAISignal(chartData, livePrice) {
  if (!chartData.length) return null;
  const last = chartData[chartData.length - 1];
  const { rsi, sma20, sma50, bbUpper, bbLower } = last;
  const recent5 = chartData.slice(-5).map(d => d.close);
  const recent10 = chartData.slice(-10).map(d => d.close);
  const trendUp5 = recent5[recent5.length - 1] > recent5[0];
  const trendUp10 = recent10[recent10.length - 1] > recent10[0];

  const factors = [];
  let bull = 0, bear = 0;

  if (rsi !== null) {
    if (rsi < 30) { bull += 3; factors.push({ label: 'RSI Oversold', type: 'bull', detail: `RSI ${rsi} — historically strong reversal zone` }); }
    else if (rsi > 70) { bear += 3; factors.push({ label: 'RSI Overbought', type: 'bear', detail: `RSI ${rsi} — momentum stretched, pullback risk` }); }
    else if (rsi > 55) { bull += 1; factors.push({ label: 'RSI Bullish', type: 'bull', detail: `RSI ${rsi} — above midline, momentum positive` }); }
    else if (rsi < 45) { bear += 1; factors.push({ label: 'RSI Bearish', type: 'bear', detail: `RSI ${rsi} — below midline, weak momentum` }); }
  }
  if (sma20 && sma50) {
    if (sma20 > sma50) { bull += 2; factors.push({ label: 'Golden Cross', type: 'bull', detail: 'SMA20 above SMA50 — medium-term uptrend confirmed' }); }
    else { bear += 2; factors.push({ label: 'Death Cross', type: 'bear', detail: 'SMA20 below SMA50 — medium-term downtrend active' }); }
  }
  if (sma20) {
    if (livePrice > sma20) { bull += 1; factors.push({ label: 'Price > SMA20', type: 'bull', detail: 'Trading above short-term average — near-term strength' }); }
    else { bear += 1; factors.push({ label: 'Price < SMA20', type: 'bear', detail: 'Below short-term average — near-term weakness' }); }
  }
  if (sma50) {
    if (livePrice > sma50) { bull += 1; factors.push({ label: 'Price > SMA50', type: 'bull', detail: 'Above medium-term average — trend intact' }); }
    else { bear += 1; factors.push({ label: 'Price < SMA50', type: 'bear', detail: 'Below medium-term average — caution warranted' }); }
  }
  if (trendUp5) { bull += 1; factors.push({ label: '5-bar Uptrend', type: 'bull', detail: 'Recent 5 candles trending higher' }); }
  else { bear += 1; factors.push({ label: '5-bar Downtrend', type: 'bear', detail: 'Recent 5 candles trending lower' }); }
  if (trendUp10) { bull += 1; } else { bear += 1; }
  if (bbUpper && bbLower) {
    const bbWidth = bbUpper - bbLower;
    const midBB = (bbUpper + bbLower) / 2;
    if (livePrice > midBB + bbWidth * 0.3) { bull += 1; factors.push({ label: 'BB Upper Half', type: 'bull', detail: 'Price in upper Bollinger Band — bullish bias' }); }
    else if (livePrice < midBB - bbWidth * 0.3) { bear += 1; factors.push({ label: 'BB Lower Half', type: 'bear', detail: 'Price in lower Bollinger Band — bearish bias' }); }
    if (livePrice >= bbUpper * 0.998) { bear += 1; factors.push({ label: 'BB Resistance', type: 'bear', detail: 'Touching upper Bollinger Band — mean reversion possible' }); }
    if (livePrice <= bbLower * 1.002) { bull += 2; factors.push({ label: 'BB Oversold', type: 'bull', detail: 'Touching lower Bollinger Band — bounce probability elevated' }); }
  }

  const total = bull + bear;
  const bullRatio = total > 0 ? bull / total : 0.5;
  let signal, confidence, color, bg;
  if (bullRatio >= 0.62) { signal = 'BUY'; confidence = Math.min(98, Math.round(50 + (bullRatio - 0.5) * 200)); color = '#22c55e'; bg = 'rgba(34,197,94,0.12)'; }
  else if (bullRatio <= 0.38) { signal = 'SELL'; confidence = Math.min(98, Math.round(50 + (0.5 - bullRatio) * 200)); color = '#ef4444'; bg = 'rgba(239,68,68,0.12)'; }
  else { signal = 'HOLD'; confidence = Math.round(50 + Math.abs(bullRatio - 0.5) * 50); color = '#f59e0b'; bg = 'rgba(245,158,11,0.12)'; }

  return { signal, confidence, color, bg, factors: factors.slice(0, 5), bull, bear };
}

// ── Pattern Detection ─────────────────────────────────────────
function detectPatterns(chartData) {
  const patterns = [];
  if (chartData.length < 15) return patterns;
  const n = chartData.length;
  const closes = chartData.map(d => d.close);
  const highs = chartData.map(d => d.high);
  const lows = chartData.map(d => d.low);

  // Higher highs & higher lows = uptrend
  const recentHighs = highs.slice(-8);
  const recentLows = lows.slice(-8);
  const hhhl = recentHighs[7] > recentHighs[3] && recentLows[7] > recentLows[3];
  const lhll = recentHighs[7] < recentHighs[3] && recentLows[7] < recentLows[3];
  if (hhhl) patterns.push({ name: 'Uptrend', emoji: '📈', type: 'bull', desc: 'Higher highs & higher lows confirm uptrend' });
  if (lhll) patterns.push({ name: 'Downtrend', emoji: '📉', type: 'bear', desc: 'Lower highs & lower lows confirm downtrend' });

  // Consolidation / range
  const maxR = Math.max(...closes.slice(-12));
  const minR = Math.min(...closes.slice(-12));
  const rangePct = (maxR - minR) / minR;
  if (rangePct < 0.04 && !hhhl && !lhll) patterns.push({ name: 'Consolidation', emoji: '⬛', type: 'neutral', desc: 'Price compressing — breakout likely soon' });

  // Double top: two similar highs in last 20 bars
  const last20H = highs.slice(-20);
  const peak1 = Math.max(...last20H.slice(0, 10));
  const peak2 = Math.max(...last20H.slice(10));
  if (Math.abs(peak1 - peak2) / peak1 < 0.015 && peak1 > closes[n - 1] * 1.01) {
    patterns.push({ name: 'Double Top', emoji: '🏔️', type: 'bear', desc: 'Two equal peaks — bearish reversal pattern' });
  }

  // Oversold bounce setup
  const lastRSI = chartData.slice(-5).map(d => d.rsi).filter(Boolean);
  if (lastRSI.some(r => r < 32) && closes[n - 1] > closes[n - 4]) {
    patterns.push({ name: 'Oversold Bounce', emoji: '🔄', type: 'bull', desc: 'RSI was oversold, price starting to recover' });
  }

  // Momentum divergence
  const rsiSlope = lastRSI.length >= 2 ? lastRSI[lastRSI.length - 1] - lastRSI[0] : 0;
  const priceSlope = closes[n - 1] - closes[n - Math.min(5, n)];
  if (priceSlope > 0 && rsiSlope < -3) patterns.push({ name: 'Bearish Div.', emoji: '⚠️', type: 'bear', desc: 'Price rising but RSI falling — momentum warning' });
  if (priceSlope < 0 && rsiSlope > 3) patterns.push({ name: 'Bullish Div.', emoji: '💡', type: 'bull', desc: 'Price falling but RSI rising — hidden strength' });

  return patterns.slice(0, 4);
}

// ── Support / Resistance ──────────────────────────────────────
function findLevels(chartData, livePrice) {
  const pivotHighs = [], pivotLows = [];
  for (let i = 3; i < chartData.length - 3; i++) {
    const slice = chartData.slice(i - 3, i + 4);
    const h = chartData[i].high, l = chartData[i].low;
    if (h === Math.max(...slice.map(d => d.high))) pivotHighs.push(h);
    if (l === Math.min(...slice.map(d => d.low))) pivotLows.push(l);
  }
  const cluster = (arr, tol = 0.015) => {
    const sorted = [...new Set(arr.map(v => +v.toFixed(2)))].sort((a, b) => a - b);
    const clusters = [];
    let group = [sorted[0]];
    for (let i = 1; i < sorted.length; i++) {
      if ((sorted[i] - group[0]) / group[0] < tol) group.push(sorted[i]);
      else { clusters.push(+(group.reduce((s, v) => s + v, 0) / group.length).toFixed(2)); group = [sorted[i]]; }
    }
    if (group.length) clusters.push(+(group.reduce((s, v) => s + v, 0) / group.length).toFixed(2));
    return clusters;
  };
  const res = cluster(pivotHighs).filter(v => v > livePrice * 1.003).slice(0, 2);
  const sup = cluster(pivotLows).filter(v => v < livePrice * 0.997).reverse().slice(0, 2);
  return { resistance: res, support: sup };
}

// ── AI Trade Blueprint ────────────────────────────────────────
function buildBlueprint(signal, livePrice, levels, stock, chartData) {
  const last = chartData[chartData.length - 1];
  const rsi = last?.rsi;
  const atr = chartData.slice(-14).reduce((s, d) => s + (d.high - d.low), 0) / 14;

  const nearSupport = levels.support[0];
  const nearResistance = levels.resistance[0];

  let entry, stop, target1, target2, timeHorizon, rationale;

  if (signal.signal === 'BUY') {
    entry = livePrice;
    stop = nearSupport ? Math.max(nearSupport * 0.995, livePrice - atr * 1.5) : livePrice - atr * 2;
    target1 = nearResistance || livePrice + atr * 2.5;
    target2 = target1 + (target1 - stop) * 0.8;
    timeHorizon = rsi < 40 ? '2–5 days (oversold recovery)' : '1–3 weeks (trend continuation)';
    rationale = `Strong bullish signals (${signal.confidence}% confidence). ${signal.factors[0]?.label} is the primary driver. Entry near ${nearSupport ? 'support' : 'current price'} with defined risk below $${stop.toFixed(2)}.`;
  } else if (signal.signal === 'SELL') {
    entry = livePrice;
    stop = nearResistance ? Math.min(nearResistance * 1.005, livePrice + atr * 1.5) : livePrice + atr * 2;
    target1 = nearSupport || livePrice - atr * 2.5;
    target2 = target1 - (stop - target1) * 0.8;
    timeHorizon = rsi > 65 ? '2–5 days (overbought pullback)' : '1–3 weeks (trend continuation)';
    rationale = `Bearish signals dominant (${signal.confidence}% confidence). ${signal.factors[0]?.label} confirmed by momentum. Short entry with stop above $${stop.toFixed(2)}.`;
  } else {
    entry = livePrice;
    stop = livePrice - atr * 1.8;
    target1 = livePrice + atr * 1.5;
    target2 = livePrice + atr * 3;
    timeHorizon = 'Wait for breakout catalyst';
    rationale = `Mixed signals — market is indecisive. Patience is the edge here. Watch for a break above $${(nearResistance || livePrice * 1.03).toFixed(2)} or below $${(nearSupport || livePrice * 0.97).toFixed(2)} before committing.`;
  }

  const riskPerShare = Math.abs(entry - stop);
  const rr = riskPerShare > 0 ? +((Math.abs(target1 - entry) / riskPerShare)).toFixed(1) : 0;

  return { entry: +entry.toFixed(2), stop: +stop.toFixed(2), target1: +target1.toFixed(2), target2: +target2.toFixed(2), rr, timeHorizon, rationale };
}

// ── Fear & Greed Score ────────────────────────────────────────
function computeFearGreed(chartData, livePrice) {
  if (!chartData.length) return 50;
  const last = chartData[chartData.length - 1];
  const rsi = last?.rsi ?? 50;
  const priceMom = chartData.length >= 20
    ? ((livePrice - chartData[chartData.length - 20].close) / chartData[chartData.length - 20].close) * 100
    : 0;
  const volTrend = chartData.slice(-5).map(d => d.volume).reduce((s, v) => s + v, 0)
    > chartData.slice(-10, -5).map(d => d.volume).reduce((s, v) => s + v, 0) ? 5 : -5;
  const score = Math.round(Math.min(100, Math.max(0, (rsi - 30) * (100 / 40) * 0.5 + priceMom * 3 + 50 + volTrend)));
  return score;
}

// ── Commentary Generator ──────────────────────────────────────
const COMMENTARY_POOL = (sym, price, rsi, sma20, bullish, sig) => [
  bullish ? `${sym} holding above SMA20 — short-term bulls in control` : `${sym} struggling below SMA20 — sellers defending key level`,
  rsi > 70 ? `⚠️ RSI at ${rsi} — ${sym} is overbought, watch for profit-taking` : rsi < 30 ? `🟢 RSI at ${rsi} — ${sym} is oversold, high-probability bounce zone` : `RSI at ${rsi} — ${sym} momentum is neutral`,
  sig === 'BUY' ? `AI signal: BUY on ${sym} — ${Math.round(Math.random() * 15 + 65)}% of technical factors align` : sig === 'SELL' ? `AI signal: SELL on ${sym} — risk outweighs reward at current level` : `AI: ${sym} needs a catalyst — range-bound price action likely`,
  `Volume analysis: ${Math.random() > 0.5 ? 'above average — institutional participation' : 'below average — retail-driven move, lower conviction'}`,
  `${sym} key level to watch: $${(price * (1 + (Math.random() * 0.04 - 0.01))).toFixed(2)}`,
  bullish ? `${sym} pattern: potential continuation — momentum traders may add on dips` : `${sym} pattern: distribution phase — be cautious on new longs`,
];

function fmt(n) { return n?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? '--'; }
function fmtDollar(n) { const s = Math.abs(n); const v = s >= 1e9 ? (s / 1e9).toFixed(1) + 'B' : s >= 1e6 ? (s / 1e6).toFixed(1) + 'M' : s.toFixed(2); return (n < 0 ? '-$' : '+$') + v; }

const TIMEFRAMES = ['1W', '1M', '3M', '6M'];
const WATCH_DEFAULTS = ['AAPL', 'MSFT', 'NVDA', 'GOOGL', 'AMZN', 'SPY', 'JPM', 'IBIT', 'TSLA', 'QQQ'];

/* ─────────────────────────────────────────────────────────────
   CUSTOM CANDLESTICK SHAPE
───────────────────────────────────────────────────────────── */
const CandlestickShape = ({ x, y, width, height, payload }) => {
  if (!payload || !height || height <= 0) return null;
  const { open, close, high, low, bullish } = payload;
  const priceRange = high - low;
  if (!priceRange) return null;
  const color = bullish ? '#22c55e' : '#ef4444';
  const cx = x + width / 2;
  const ppu = height / priceRange;
  const bodyTop = y + (high - Math.max(open, close)) * ppu;
  const bodyH = Math.max(1, Math.abs(close - open) * ppu);
  const bw = Math.max(3, Math.min(14, width * 0.72));
  return (
    <g>
      <line x1={cx} y1={y} x2={cx} y2={y + height} stroke={color} strokeWidth={1} opacity={0.6} />
      <rect x={cx - bw / 2} y={bodyTop} width={bw} height={bodyH} fill={color} fillOpacity={0.9} rx={0.5} />
    </g>
  );
};

/* ─────────────────────────────────────────────────────────────
   ANIMATIONS & GLOBAL STYLES
───────────────────────────────────────────────────────────── */
const spin = keyframes`from{transform:rotate(0deg)}to{transform:rotate(360deg)}`;
const pulse = keyframes`0%,100%{opacity:.35}50%{opacity:1}`;
const blink = keyframes`0%,100%{opacity:1}50%{opacity:0.4}`;
const slideIn = keyframes`from{transform:translateX(8px);opacity:0}to{transform:translateX(0);opacity:1}`;
const glowPulse = keyframes`0%,100%{box-shadow:0 0 0 0 rgba(34,197,94,0)}50%{box-shadow:0 0 12px 3px rgba(34,197,94,0.3)}`;

/* ─────────────────────────────────────────────────────────────
   STYLED COMPONENTS
───────────────────────────────────────────────────────────── */

// Layout
const Page = styled.div`
  display: flex; flex-direction: column; height: 100vh; overflow: hidden;
  background: #05080f; color: #e2e8f0; font-family: 'Inter', sans-serif;
  @media(max-width:900px){ height:auto; overflow:visible; }
`;

// Topbar
const Topbar = styled.div`
  flex-shrink: 0; display: flex; align-items: center; gap: 0.85rem;
  padding: 0 1.25rem; height: 52px; background: #090e1a;
  border-bottom: 1px solid rgba(255,255,255,0.05); flex-wrap: wrap;
  @media(max-width:768px){ height:auto; padding:.65rem .85rem; gap:.5rem; }
`;
const TopSym = styled.div`font-family:'Space Grotesk',sans-serif;font-size:1rem;font-weight:800;color:#fff;letter-spacing:-.01em;`;
const TopName = styled.div`font-size:.68rem;color:rgba(255,255,255,.3);`;
const TopPrice = styled.div`font-family:'Space Grotesk',sans-serif;font-size:1.3rem;font-weight:800;color:#fff;letter-spacing:-.02em;`;
const TopChange = styled.div`font-size:.78rem;font-weight:700;color:${p=>p.$pos?'#22c55e':'#ef4444'};display:flex;align-items:center;gap:.2rem;`;
const VDiv = styled.div`width:1px;height:26px;background:rgba(255,255,255,.07);flex-shrink:0;`;
const Stat = styled.div`font-size:.67rem;color:rgba(255,255,255,.3);span{color:rgba(255,255,255,.7);font-weight:600;margin-left:.2rem;}`;
const TopSpacer = styled.div`flex:1;`;
const LiveDot = styled.div`
  width:7px;height:7px;border-radius:50%;background:#22c55e;
  animation:${pulse} 1.4s ease-in-out infinite;
`;

// AI Signal Badge in topbar
const AISignalBadge = styled.div`
  display: flex; align-items: center; gap: .45rem; padding: .3rem .85rem;
  border-radius: 20px; border: 1px solid ${p=>p.$color+'40'};
  background: ${p=>p.$color+'14'}; cursor: default;
`;
const SigLabel = styled.div`font-family:'Space Grotesk',sans-serif;font-size:.82rem;font-weight:800;color:${p=>p.$color};letter-spacing:.06em;`;
const SigConf = styled.div`font-size:.65rem;color:rgba(255,255,255,.4);`;

// Body
const Body = styled.div`
  flex:1; display:grid; grid-template-columns:260px 1fr 320px;
  overflow:hidden; min-height:0;
  @media(max-width:1280px){ grid-template-columns:220px 1fr 290px; }
  @media(max-width:900px){ grid-template-columns:1fr; overflow:visible; }
`;

// ── LEFT: AI Intelligence Panel ──
const LeftPanel = styled.div`
  background:#090e1a; border-right:1px solid rgba(255,255,255,.05);
  display:flex; flex-direction:column; overflow:hidden;
  @media(max-width:900px){ display:none; }
`;
const PanelSection = styled.div`
  border-bottom:1px solid rgba(255,255,255,.05); padding:.75rem .85rem; flex-shrink:0;
`;
const PSHead = styled.div`
  display:flex;align-items:center;gap:.4rem;
  font-size:.6rem;font-weight:800;text-transform:uppercase;letter-spacing:.1em;
  color:rgba(255,255,255,.25); margin-bottom:.55rem;
  svg{color:${p=>p.$accent||'#818cf8'};font-size:.72rem;}
`;

// Signal card
const SignalCard = styled.div`
  background:${p=>p.$bg||'rgba(99,102,241,0.08)'};
  border:1px solid ${p=>p.$color+'30'};
  border-radius:10px; padding:.75rem .85rem; margin-bottom:.55rem;
  animation:${p=>p.$glow?glowPulse:undefined} 2s ease-in-out infinite;
`;
const SignalMain = styled.div`
  display:flex;align-items:center;gap:.65rem;margin-bottom:.45rem;
`;
const SignalText = styled.div`
  font-family:'Space Grotesk',sans-serif;font-size:1.5rem;font-weight:800;
  color:${p=>p.$color};letter-spacing:.05em;
`;
const ConfBar = styled.div`
  background:rgba(255,255,255,.06);border-radius:999px;height:5px;overflow:hidden;
  margin:.45rem 0 .35rem;
`;
const ConfFill = styled(motion.div)`
  height:100%;border-radius:999px;
  background:linear-gradient(90deg,${p=>p.$color}88,${p=>p.$color});
`;
const FactorList = styled.div`display:flex;flex-direction:column;gap:.22rem;`;
const Factor = styled.div`
  display:flex;align-items:center;gap:.4rem;font-size:.67rem;
  color:${p=>p.$bull?'#4ade80':'#f87171'};
  &::before{content:'${p=>p.$bull?'▲':'▼'}';font-size:.55rem;}
`;

// Fear & Greed gauge
const FGWrap = styled.div`display:flex;align-items:center;gap:.65rem;`;
const FGArc = styled.div`
  width:52px;height:28px;border-radius:52px 52px 0 0;overflow:hidden;position:relative;
  background:linear-gradient(90deg,#ef4444 0%,#f59e0b 50%,#22c55e 100%);
  &::after{
    content:'';position:absolute;inset:4px 4px 0;
    border-radius:48px 48px 0 0;background:#090e1a;
  }
`;
const FGNeedle = styled.div`
  position:absolute;bottom:0;left:50%;width:2px;height:26px;
  background:white;transform-origin:bottom center;
  transform:translateX(-50%) rotate(${p=>p.$angle}deg);
  border-radius:2px 2px 0 0;z-index:1;
`;
const FGLabel = styled.div`font-size:.62rem;color:rgba(255,255,255,.4);`;
const FGValue = styled.div`font-family:'Space Grotesk',sans-serif;font-size:.88rem;font-weight:800;color:${p=>p.$color};`;

// Pattern chips
const PatternChip = styled.div`
  display:inline-flex;align-items:center;gap:.3rem;
  padding:.25rem .55rem;border-radius:6px;font-size:.67rem;font-weight:700;
  background:${p=>p.$type==='bull'?'rgba(34,197,94,.1)':p.$type==='bear'?'rgba(239,68,68,.1)':'rgba(255,255,255,.06)'};
  border:1px solid ${p=>p.$type==='bull'?'rgba(34,197,94,.25)':p.$type==='bear'?'rgba(239,68,68,.25)':'rgba(255,255,255,.12)'};
  color:${p=>p.$type==='bull'?'#4ade80':p.$type==='bear'?'#f87171':'#94a3b8'};
  margin:.15rem .15rem 0 0;
`;

// Level rows
const LevelRow = styled.div`
  display:flex;justify-content:space-between;align-items:center;
  font-size:.72rem;padding:.2rem 0;
  border-bottom:1px solid rgba(255,255,255,.04);
`;
const LevelLabel = styled.span`color:rgba(255,255,255,.3);`;
const LevelVal = styled.span`font-weight:700;color:${p=>p.$res?'#f87171':'#4ade80'};`;

// Watchlist
const WatchScroll = styled.div`
  flex:1;overflow-y:auto;
  &::-webkit-scrollbar{width:2px;}
  &::-webkit-scrollbar-thumb{background:rgba(255,255,255,.07);border-radius:2px;}
`;
const WatchSearch = styled.input`
  width:calc(100% - 1.7rem);margin:.5rem .85rem .35rem;
  background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);
  border-radius:7px;padding:.32rem .6rem;font-size:.72rem;color:#e2e8f0;outline:none;
  &::placeholder{color:rgba(255,255,255,.2);}
  &:focus{border-color:rgba(99,102,241,.4);}
`;
const WatchRow = styled.div`
  display:flex;align-items:center;padding:.52rem .85rem;cursor:pointer;
  border-left:2px solid ${p=>p.$active?'#22c55e':'transparent'};
  background:${p=>p.$active?'rgba(34,197,94,.06)':'transparent'};
  transition:background .1s;
  &:hover{background:rgba(255,255,255,.04);}
`;
const WSym = styled.div`font-family:'Space Grotesk',sans-serif;font-size:.78rem;font-weight:700;color:#fff;min-width:40px;`;
const WPrice = styled.div`flex:1;text-align:right;`;
const WPVal = styled.div`font-size:.72rem;font-weight:600;color:#e2e8f0;`;
const WChg = styled.div`font-size:.6rem;font-weight:700;color:${p=>p.$pos?'#22c55e':'#ef4444'};`;
const WSignal = styled.div`
  width:34px;text-align:center;font-size:.6rem;font-weight:800;letter-spacing:.04em;
  color:${p=>p.$s==='BUY'?'#22c55e':p.$s==='SELL'?'#ef4444':'#f59e0b'};
`;

// ── CENTER: Chart ──
const ChartPanel = styled.div`
  display:flex;flex-direction:column;overflow:hidden;min-height:0;background:#05080f;
`;
const ChartBar = styled.div`
  flex-shrink:0;display:flex;align-items:center;gap:.55rem;
  padding:.45rem .85rem;border-bottom:1px solid rgba(255,255,255,.04);background:#090e1a;
`;
const TFBtn = styled.button`
  padding:.2rem .55rem;border-radius:5px;font-size:.68rem;font-weight:700;
  border:1px solid ${p=>p.$a?'rgba(99,102,241,.5)':'rgba(255,255,255,.09)'};
  background:${p=>p.$a?'rgba(99,102,241,.15)':'transparent'};
  color:${p=>p.$a?'#818cf8':'rgba(255,255,255,.3)'};cursor:pointer;transition:all .12s;
  &:hover{border-color:rgba(99,102,241,.4);color:#818cf8;}
`;
const ChartTypeBtn = styled.button`
  padding:.2rem .45rem;border-radius:5px;font-size:.75rem;
  border:1px solid ${p=>p.$a?'rgba(255,255,255,.18)':'rgba(255,255,255,.06)'};
  background:${p=>p.$a?'rgba(255,255,255,.07)':'transparent'};
  color:${p=>p.$a?'#fff':'rgba(255,255,255,.28)'};cursor:pointer;
`;
const IndToggle = styled.button`
  padding:.18rem .5rem;border-radius:5px;font-size:.64rem;font-weight:700;
  border:1px solid ${p=>p.$a?p.$c+'55':'rgba(255,255,255,.07)'};
  background:${p=>p.$a?p.$c+'18':'transparent'};
  color:${p=>p.$a?p.$c:'rgba(255,255,255,.28)'};cursor:pointer;transition:all .12s;
`;
const Sep = styled.div`width:1px;height:16px;background:rgba(255,255,255,.06);`;
const ChartMain = styled.div`flex:1;min-height:0;position:relative;`;
const SubPane = styled.div`
  height:${p=>p.$h||'68px'};flex-shrink:0;
  border-top:1px solid rgba(255,255,255,.04);position:relative;
`;
const PaneLabel = styled.div`
  position:absolute;top:4px;left:10px;font-size:.58rem;font-weight:700;
  text-transform:uppercase;letter-spacing:.08em;color:rgba(255,255,255,.18);z-index:1;
`;

// AI Commentary Ticker
const CommentaryBar = styled.div`
  flex-shrink:0;height:28px;background:#090e1a;border-top:1px solid rgba(255,255,255,.05);
  display:flex;align-items:center;overflow:hidden;position:relative;
`;
const CommentaryText = styled(motion.div)`
  display:flex;align-items:center;gap:.5rem;font-size:.68rem;color:rgba(255,255,255,.5);
  white-space:nowrap;padding:0 1.25rem;
  span.sym{color:#818cf8;font-weight:700;}
  span.bull{color:#4ade80;font-weight:700;}
  span.bear{color:#f87171;font-weight:700;}
`;
const CommentaryDot = styled.div`
  width:5px;height:5px;border-radius:50%;background:#818cf8;flex-shrink:0;
  animation:${blink} 1s ease-in-out infinite;
`;

// ── RIGHT: AI Trade Desk ──
const RightPanel = styled.div`
  background:#090e1a;border-left:1px solid rgba(255,255,255,.05);
  display:flex;flex-direction:column;overflow:hidden;min-height:0;
  @media(max-width:900px){ overflow:visible;min-height:600px; }
`;
const RTabs = styled.div`display:flex;flex-shrink:0;border-bottom:1px solid rgba(255,255,255,.06);`;
const RTab = styled.button`
  flex:1;padding:.6rem 0;font-size:.66rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;
  border:none;background:transparent;
  color:${p=>p.$a?'#fff':'rgba(255,255,255,.22)'};
  border-bottom:2px solid ${p=>p.$a?'#818cf8':'transparent'};cursor:pointer;transition:all .12s;
  display:flex;align-items:center;justify-content:center;gap:.28rem;
  &:hover{color:rgba(255,255,255,.7);}
`;
const RTabBody = styled.div`
  flex:1;overflow-y:auto;display:flex;flex-direction:column;
  &::-webkit-scrollbar{width:3px;}
  &::-webkit-scrollbar-thumb{background:rgba(255,255,255,.07);border-radius:3px;}
`;
const RSection = styled.div`padding:.75rem .85rem;border-bottom:1px solid rgba(255,255,255,.05);`;
const RSHead = styled.div`
  font-size:.6rem;font-weight:800;text-transform:uppercase;letter-spacing:.1em;
  color:rgba(255,255,255,.25);margin-bottom:.55rem;display:flex;align-items:center;gap:.3rem;
  svg{color:${p=>p.$accent||'#818cf8'};font-size:.7rem;}
`;

// Blueprint card
const BlueprintCard = styled.div`
  background:rgba(99,102,241,.07);border:1px solid rgba(99,102,241,.2);
  border-radius:10px;padding:.75rem;margin-bottom:.55rem;
`;
const BPTitle = styled.div`
  font-family:'Space Grotesk',sans-serif;font-size:.8rem;font-weight:800;color:#818cf8;margin-bottom:.55rem;
  display:flex;align-items:center;gap:.35rem;
`;
const BPGrid = styled.div`display:grid;grid-template-columns:1fr 1fr;gap:.35rem;`;
const BPItem = styled.div`
  background:rgba(255,255,255,.03);border-radius:7px;padding:.45rem .55rem;
`;
const BPLabel = styled.div`font-size:.58rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:rgba(255,255,255,.28);margin-bottom:.2rem;`;
const BPVal = styled.div`font-size:.82rem;font-weight:700;color:${p=>p.$c||'#e2e8f0'};font-family:'Space Grotesk',sans-serif;`;
const BPRationale = styled.div`
  margin-top:.55rem;padding:.5rem;border-radius:7px;background:rgba(255,255,255,.03);
  font-size:.7rem;color:rgba(255,255,255,.55);line-height:1.55;
`;
const RRBadge = styled.div`
  display:inline-flex;align-items:center;gap:.3rem;padding:.2rem .55rem;
  border-radius:6px;font-size:.7rem;font-weight:700;
  background:${p=>p.$rr>=2?'rgba(34,197,94,.12)':'rgba(245,158,11,.1)'};
  color:${p=>p.$rr>=2?'#4ade80':'#fbbf24'};
  border:1px solid ${p=>p.$rr>=2?'rgba(34,197,94,.25)':'rgba(245,158,11,.2)'};
`;

// Alert pills
const AlertPill = styled(motion.div)`
  display:flex;align-items:flex-start;gap:.45rem;
  padding:.55rem .65rem;border-radius:8px;margin-bottom:.35rem;font-size:.72rem;
  background:${p=>p.$type==='warn'?'rgba(245,158,11,.09)':p.$type==='bull'?'rgba(34,197,94,.08)':'rgba(239,68,68,.08)'};
  border:1px solid ${p=>p.$type==='warn'?'rgba(245,158,11,.25)':p.$type==='bull'?'rgba(34,197,94,.2)':'rgba(239,68,68,.2)'};
  color:rgba(255,255,255,.65);line-height:1.5;
  animation:${slideIn} .3s ease;
`;
const AlertIcon = styled.div`color:${p=>p.$type==='warn'?'#fbbf24':p.$type==='bull'?'#4ade80':'#f87171'};font-size:.75rem;margin-top:.1rem;`;

// Order entry
const SideToggle = styled.div`display:grid;grid-template-columns:1fr 1fr;border-radius:8px;overflow:hidden;border:1px solid rgba(255,255,255,.08);margin-bottom:.65rem;`;
const SideBtn = styled.button`
  padding:.52rem;border:none;font-weight:800;font-size:.78rem;cursor:pointer;transition:all .12s;
  background:${p=>!p.$a?'rgba(255,255,255,.02)':p.$s==='buy'?'#16a34a':'#dc2626'};
  color:${p=>p.$a?'#fff':'rgba(255,255,255,.28)'};
`;
const OTypeRow = styled.div`display:flex;gap:.3rem;margin-bottom:.6rem;`;
const OTypeBtn = styled.button`
  padding:.24rem .65rem;border-radius:6px;font-size:.68rem;font-weight:700;
  border:1px solid ${p=>p.$a?'rgba(255,255,255,.18)':'rgba(255,255,255,.07)'};
  background:${p=>p.$a?'rgba(255,255,255,.07)':'transparent'};
  color:${p=>p.$a?'#fff':'rgba(255,255,255,.28)'};cursor:pointer;
`;
const FLabel = styled.div`font-size:.62rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:rgba(255,255,255,.28);margin-bottom:.28rem;`;
const NInput = styled.input`
  width:100%;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);
  border-radius:7px;padding:.5rem .65rem;font-size:.85rem;font-weight:600;color:#e2e8f0;
  outline:none;margin-bottom:.55rem;
  &:focus{border-color:rgba(99,102,241,.45);}
  &::placeholder{color:rgba(255,255,255,.15);}
`;
const AISizeHint = styled.div`
  background:rgba(99,102,241,.08);border:1px solid rgba(99,102,241,.18);border-radius:7px;
  padding:.45rem .65rem;margin-bottom:.55rem;font-size:.7rem;color:rgba(255,255,255,.6);
  line-height:1.5;
  strong{color:#a5b4fc;}
`;
const OSummary = styled.div`background:rgba(255,255,255,.03);border-radius:8px;padding:.6rem .75rem;margin-bottom:.65rem;`;
const ORow = styled.div`display:flex;justify-content:space-between;font-size:.7rem;color:rgba(255,255,255,.38);padding:.15rem 0;span:last-child{color:#e2e8f0;font-weight:600;}`;
const OrderBtn = styled.button`
  width:100%;padding:.68rem;border-radius:8px;border:none;font-weight:800;font-size:.85rem;
  cursor:pointer;transition:all .15s;
  background:${p=>p.$s==='buy'?'linear-gradient(135deg,#16a34a,#15803d)':'linear-gradient(135deg,#dc2626,#b91c1c)'};
  color:#fff;box-shadow:${p=>p.$s==='buy'?'0 4px 16px rgba(22,163,74,.3)':'0 4px 16px rgba(220,38,38,.3)'};
  &:hover{transform:translateY(-1px);} &:disabled{opacity:.4;cursor:not-allowed;transform:none;}
`;
const BalBadge = styled.div`font-size:.67rem;color:rgba(255,255,255,.28);margin-top:.4rem;text-align:center;span{color:#22c55e;font-weight:700;}`;

// Positions
const PosCard = styled.div`
  background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);
  border-radius:9px;padding:.65rem .75rem;margin-bottom:.45rem;
`;
const PosHead = styled.div`display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:.3rem;`;
const PosSym2 = styled.div`font-family:'Space Grotesk',sans-serif;font-weight:800;font-size:.85rem;color:#fff;`;
const PnlBadge = styled.div`font-size:.72rem;font-weight:700;color:${p=>p.$pos?'#22c55e':'#ef4444'};`;
const PosStats = styled.div`display:grid;grid-template-columns:repeat(3,1fr);gap:.2rem;`;
const PS = styled.div`font-size:.6rem;color:rgba(255,255,255,.28);span{display:block;color:rgba(255,255,255,.68);font-weight:600;margin-top:1px;font-size:.68rem;}`;
const CloseBtn = styled.button`
  width:100%;margin-top:.45rem;padding:.28rem;border-radius:6px;
  border:1px solid rgba(239,68,68,.28);background:rgba(239,68,68,.05);
  color:#f87171;font-size:.67rem;font-weight:700;cursor:pointer;
  &:hover{background:rgba(239,68,68,.14);}
`;

// AI Chat
const AIChat = styled.div`display:flex;flex-direction:column;flex:1;min-height:0;`;
const AIMsgs = styled.div`
  flex:1;overflow-y:auto;padding:.65rem .75rem;display:flex;flex-direction:column;gap:.5rem;
  &::-webkit-scrollbar{width:2px;}
  &::-webkit-scrollbar-thumb{background:rgba(255,255,255,.07);border-radius:2px;}
`;
const AIMsgB = styled.div`
  padding:.65rem .75rem;border-radius:10px;font-size:.77rem;line-height:1.65;
  color:rgba(255,255,255,.8);
  background:${p=>p.$ai?'rgba(99,102,241,.08)':'rgba(34,197,94,.06)'};
  border:1px solid ${p=>p.$ai?'rgba(99,102,241,.18)':'rgba(34,197,94,.12)'};
  white-space:pre-line;
`;
const AIMsgLabel = styled.div`
  font-size:.58rem;font-weight:800;text-transform:uppercase;letter-spacing:.08em;
  margin-bottom:.28rem;color:${p=>p.$ai?'#818cf8':'#22c55e'};
  display:flex;align-items:center;gap:.28rem;
`;
const Chips = styled.div`padding:.45rem .75rem;display:flex;flex-wrap:wrap;gap:.28rem;border-top:1px solid rgba(255,255,255,.04);`;
const Chip = styled.button`
  padding:.25rem .6rem;border-radius:999px;font-size:.65rem;font-weight:600;
  border:1px solid rgba(99,102,241,.22);background:rgba(99,102,241,.07);color:#a5b4fc;
  cursor:pointer;transition:all .1s;
  &:hover{background:rgba(99,102,241,.18);} &:disabled{opacity:.4;cursor:not-allowed;}
`;
const AIInputRow = styled.div`
  display:flex;gap:.38rem;padding:.6rem .75rem;border-top:1px solid rgba(255,255,255,.05);flex-shrink:0;
`;
const AICInput = styled.input`
  flex:1;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);
  border-radius:8px;padding:.48rem .65rem;font-size:.75rem;color:#e2e8f0;outline:none;
  &:focus{border-color:rgba(99,102,241,.45);} &::placeholder{color:rgba(255,255,255,.18);}
`;
const AISendBtn = styled.button`
  padding:.48rem .62rem;border-radius:8px;border:none;background:#4f46e5;color:#fff;
  cursor:pointer;font-size:.78rem;transition:background .12s;
  &:hover{background:#4338ca;} &:disabled{opacity:.4;cursor:not-allowed;}
`;
const Spinner2 = styled(FaSpinner)`animation:${spin} 1s linear infinite;`;

// Trade History
const TRow = styled.div`
  display:flex;align-items:center;gap:.5rem;padding:.55rem .85rem;
  border-bottom:1px solid rgba(255,255,255,.04);
`;
const TSide = styled.div`font-size:.62rem;font-weight:800;text-transform:uppercase;letter-spacing:.06em;color:${p=>p.$b?'#22c55e':'#ef4444'};min-width:26px;`;
const TInfo = styled.div`flex:1;`;
const TSym = styled.div`font-size:.75rem;font-weight:700;color:#e2e8f0;`;
const TMeta = styled.div`font-size:.6rem;color:rgba(255,255,255,.28);`;
const TTotal = styled.div`font-size:.72rem;font-weight:600;color:rgba(255,255,255,.55);`;
const TAINote = styled.div`font-size:.65rem;color:#818cf8;margin-top:.15rem;font-style:italic;`;

// Notification
const Notif = styled(motion.div)`
  position:fixed;bottom:1.5rem;left:50%;transform:translateX(-50%);
  background:#0f1e35;border:1px solid ${p=>p.$t==='success'?'rgba(34,197,94,.4)':'rgba(239,68,68,.4)'};
  color:${p=>p.$t==='success'?'#4ade80':'#f87171'};
  padding:.55rem 1.2rem;border-radius:10px;font-size:.8rem;font-weight:700;
  box-shadow:0 8px 32px rgba(0,0,0,.5);z-index:9999;white-space:nowrap;
  display:flex;align-items:center;gap:.45rem;
`;

const NoItems = styled.div`text-align:center;padding:2rem 1rem;color:rgba(255,255,255,.2);font-size:.8rem;`;

const AI_PROMPTS = [
  'Explain the current signal',
  'What patterns do you see?',
  'Suggest a stop-loss level',
  'Is this overbought or oversold?',
  'Walk me through the trade blueprint',
  'What could invalidate this setup?',
];

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────── */
export default function ChartSimPage() {
  const { user } = useAuth();

  // Stock
  const [sym, setSym] = useState('AAPL');
  const stock = useMemo(() => stocks.find(s => s.symbol === sym) || stocks[0], [sym]);

  // Live price
  const [livePrice, setLivePrice] = useState(stock.price);
  const livePriceRef = useRef(stock.price);

  // Chart
  const [tf, setTf] = useState('3M');
  const [chartType, setChartType] = useState('candle');
  const [inds, setInds] = useState({ sma20: true, sma50: true, bb: false, rsi: true, volume: true });

  // Right panel
  const [rTab, setRTab] = useState('ai');

  // Order
  const [side, setSide] = useState('buy');
  const [oType, setOType] = useState('market');
  const [qty, setQty] = useState('');
  const [limitPx, setLimitPx] = useState('');

  // Portfolio
  const [balance, setBalance] = useState(25000);
  const [positions, setPositions] = useState({});
  const [trades, setTrades] = useState([]);

  // AI
  const [aiMsgs, setAiMsgs] = useState([]);
  const [aiInput, setAiInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiAutoLoading, setAiAutoLoading] = useState(false);

  // Alerts
  const [alerts, setAlerts] = useState([]);

  // Commentary
  const [commentary, setCommentary] = useState('');
  const [commentaryIdx, setCommentaryIdx] = useState(0);

  // Notification
  const [notif, setNotif] = useState(null);

  // Watchlist search
  const [wSearch, setWSearch] = useState('');

  const aiEndRef = useRef(null);
  const alertsRef = useRef([]);

  /* ── Chart data ── */
  const chartData = useMemo(() => {
    const sliced = sliceByTF(stock.historicalPrices, tf);
    const ohlc = generateOHLC(sliced);
    return buildChartData(ohlc);
  }, [stock, tf]);

  const displayData = useMemo(() => {
    if (!chartData.length) return chartData;
    const last = chartData[chartData.length - 1];
    return [...chartData.slice(0, -1), { ...last, close: livePrice, bullish: livePrice >= last.open, wickRange: [last.low, Math.max(last.high, livePrice)] }];
  }, [chartData, livePrice]);

  /* ── AI Analysis ── */
  const aiSignal = useMemo(() => computeAISignal(displayData, livePrice), [displayData, livePrice]);
  const patterns = useMemo(() => detectPatterns(displayData), [displayData]);
  const levels = useMemo(() => findLevels(displayData, livePrice), [displayData, livePrice]);
  const blueprint = useMemo(() => aiSignal ? buildBlueprint(aiSignal, livePrice, levels, stock, displayData) : null, [aiSignal, livePrice, levels, stock, displayData]);
  const fearGreed = useMemo(() => computeFearGreed(displayData, livePrice), [displayData, livePrice]);

  // Precompute AI signals for watchlist
  const watchlistWithSignals = useMemo(() => {
    const priority = WATCH_DEFAULTS.map(s => stocks.find(x => x.symbol === s)).filter(Boolean);
    const rest = stocks.filter(s => !WATCH_DEFAULTS.includes(s.symbol));
    return [...priority, ...rest].map(s => {
      const ohlc = generateOHLC(sliceByTF(s.historicalPrices, '1M'));
      const cd = buildChartData(ohlc);
      const sig = computeAISignal(cd, s.price);
      return { ...s, aiSig: sig?.signal || 'HOLD' };
    });
  }, []);

  const filteredWatch = useMemo(() => {
    const q = wSearch.toLowerCase();
    return q ? watchlistWithSignals.filter(s => s.symbol.toLowerCase().includes(q) || s.name.toLowerCase().includes(q)) : watchlistWithSignals;
  }, [wSearch, watchlistWithSignals]);

  /* ── Live price tick ── */
  useEffect(() => {
    livePriceRef.current = stock.price;
    setLivePrice(stock.price);
    setLimitPx(stock.price.toFixed(2));
  }, [stock]);

  useEffect(() => {
    const vol = stock.historicalPrices.length > 1
      ? Math.abs(stock.historicalPrices[1].price - stock.historicalPrices[0].price) / stock.price * 0.45
      : 0.003;
    const iv = setInterval(() => {
      const delta = livePriceRef.current * vol * (Math.random() * 2 - 0.98);
      const next = Math.max(livePriceRef.current + delta, stock.price * 0.65);
      livePriceRef.current = next;
      setLivePrice(+next.toFixed(2));
    }, 2000);
    return () => clearInterval(iv);
  }, [stock]);

  /* ── Auto AI analysis on symbol change ── */
  useEffect(() => {
    setAiMsgs([]);
    setAlerts([]);
    alertsRef.current = [];

    const timer = setTimeout(async () => {
      setAiAutoLoading(true);
      const last = chartData[chartData.length - 1];
      const sig = computeAISignal(chartData, stock.price);
      const pats = detectPatterns(chartData);
      const ctx = `Chart analysis request for ${stock.symbol} (${stock.name}). Price: $${stock.price}. RSI: ${last?.rsi ?? 'N/A'}. SMA20: ${last?.sma20 ?? 'N/A'}. SMA50: ${last?.sma50 ?? 'N/A'}. Signal: ${sig?.signal} at ${sig?.confidence}% confidence. Patterns detected: ${pats.map(p => p.name).join(', ') || 'None'}. ${stock.description}`;
      try {
        const res = await api.chat(`Give me a concise AI trading analysis for ${stock.symbol}. Include: 1) Overall market structure 2) Key risk factors 3) One actionable insight. Keep it under 120 words.`, ctx);
        setAiMsgs([{ role: 'ai', text: res.response || res.message || '' }]);
      } catch {
        setAiMsgs([{ role: 'ai', text: generateAutoAnalysis(stock, stock.price, last?.rsi, last?.sma20, last?.sma50, sig) }]);
      } finally {
        setAiAutoLoading(false);
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [sym, stock, chartData]);

  /* ── Proactive alerts on price/RSI changes ── */
  useEffect(() => {
    const last = displayData[displayData.length - 1];
    if (!last) return;
    const { rsi, sma20 } = last;
    const newAlerts = [];
    if (rsi !== null && rsi < 30 && !alertsRef.current.includes('rsi-oversold')) {
      newAlerts.push({ id: 'rsi-oversold', type: 'bull', icon: FaFire, text: `RSI at ${rsi} — ${sym} is oversold. High-probability bounce zone.` });
      alertsRef.current.push('rsi-oversold');
    }
    if (rsi !== null && rsi > 72 && !alertsRef.current.includes('rsi-overbought')) {
      newAlerts.push({ id: 'rsi-overbought', type: 'bear', icon: FaExclamationTriangle, text: `RSI at ${rsi} — ${sym} is overbought. Consider profit-taking or tighter stop.` });
      alertsRef.current.push('rsi-overbought');
    }
    if (sma20 && Math.abs(livePrice - sma20) / sma20 < 0.005 && !alertsRef.current.includes('sma20-touch')) {
      newAlerts.push({ id: 'sma20-touch', type: 'warn', icon: FaRegBell, text: `${sym} is testing SMA20 ($${fmt(sma20)}) — key decision level. Watch for bounce or breakdown.` });
      alertsRef.current.push('sma20-touch');
    }
    if (newAlerts.length) setAlerts(prev => [...newAlerts, ...prev].slice(0, 6));
  }, [displayData, livePrice, sym]);

  /* ── Commentary ticker ── */
  useEffect(() => {
    const last = displayData[displayData.length - 1];
    const pool = COMMENTARY_POOL(sym, livePrice, last?.rsi, last?.sma20, livePrice > (last?.sma20 || livePrice), aiSignal?.signal);
    const iv = setInterval(() => {
      setCommentaryIdx(i => (i + 1) % pool.length);
      setCommentary(pool[commentaryIdx % pool.length]);
    }, 5000);
    setCommentary(pool[0]);
    return () => clearInterval(iv);
  }, [sym, livePrice, commentaryIdx, aiSignal, displayData]);

  /* ── AI scroll ── */
  useEffect(() => { aiEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [aiMsgs]);

  /* ── Portfolio computed ── */
  const portfolioValue = useMemo(() => {
    const m = Object.fromEntries(stocks.map(s => [s.symbol, s.price]));
    return balance + Object.entries(positions).reduce((s, [k, v]) => s + v.shares * (k === sym ? livePrice : (m[k] || 0)), 0);
  }, [positions, balance, sym, livePrice]);

  const totalPnl = useMemo(() => {
    const m = Object.fromEntries(stocks.map(s => [s.symbol, s.price]));
    return Object.entries(positions).reduce((s, [k, v]) => s + v.shares * ((k === sym ? livePrice : (m[k] || 0)) - v.avgCost), 0);
  }, [positions, sym, livePrice]);

  /* ── Chart domain ── */
  const yDomain = useMemo(() => {
    if (!displayData.length) return ['auto', 'auto'];
    const prices = displayData.flatMap(d => [d.high ?? d.close, d.low ?? d.close]);
    const mn = Math.min(...prices), mx = Math.max(...prices);
    const pad = (mx - mn) * 0.1;
    return [+(mn - pad).toFixed(2), +(mx + pad).toFixed(2)];
  }, [displayData]);

  /* ── Handlers ── */
  const showNotif = (text, type = 'success') => { setNotif({ text, type }); setTimeout(() => setNotif(null), 3000); };
  const toggleInd = k => setInds(p => ({ ...p, [k]: !p[k] }));

  const aiSuggestedQty = useMemo(() => {
    if (!blueprint || !livePrice) return null;
    const riskPer = Math.abs(livePrice - blueprint.stop);
    if (!riskPer) return null;
    const maxRisk = balance * 0.02;
    return Math.max(1, Math.floor(maxRisk / riskPer));
  }, [blueprint, livePrice, balance]);

  const submitOrder = () => {
    const q = parseInt(qty, 10);
    if (!q || q <= 0) { showNotif('Enter a valid quantity', 'error'); return; }
    const execPx = oType === 'market' ? livePrice : parseFloat(limitPx);
    if (!execPx || isNaN(execPx)) { showNotif('Invalid limit price', 'error'); return; }
    const cost = q * execPx;

    if (side === 'buy') {
      if (cost > balance) { showNotif('Insufficient balance', 'error'); return; }
      setBalance(b => +(b - cost).toFixed(2));
      setPositions(prev => {
        const ex = prev[sym];
        if (!ex) return { ...prev, [sym]: { shares: q, avgCost: execPx } };
        const tot = ex.shares + q;
        return { ...prev, [sym]: { shares: tot, avgCost: +((ex.shares * ex.avgCost + q * execPx) / tot).toFixed(3) } };
      });
      showNotif(`Bought ${q} × ${sym} @ $${fmt(execPx)}`);
    } else {
      const pos = positions[sym];
      if (!pos || pos.shares < q) { showNotif('Not enough shares', 'error'); return; }
      setBalance(b => +(b + q * execPx).toFixed(2));
      setPositions(prev => {
        const rem = prev[sym].shares - q;
        if (rem <= 0) { const n = { ...prev }; delete n[sym]; return n; }
        return { ...prev, [sym]: { ...prev[sym], shares: rem } };
      });
      showNotif(`Sold ${q} × ${sym} @ $${fmt(execPx)}`);
    }

    const aiNote = aiSignal?.signal === side.toUpperCase()
      ? `AI was aligned — ${aiSignal.signal} signal at ${aiSignal.confidence}% confidence`
      : `Traded against AI signal (AI: ${aiSignal?.signal})`;

    setTrades(p => [{ id: Date.now(), side, sym, qty: q, price: execPx, total: q * execPx, time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }), aiNote }, ...p]);
    setQty('');
  };

  const closePos = (s) => {
    const pos = positions[s];
    if (!pos) return;
    const px = s === sym ? livePrice : (stocks.find(x => x.symbol === s)?.price || 0);
    setBalance(b => +(b + pos.shares * px).toFixed(2));
    setTrades(p => [{ id: Date.now(), side: 'sell', sym: s, qty: pos.shares, price: px, total: pos.shares * px, time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }), aiNote: 'Position closed' }, ...p]);
    setPositions(prev => { const n = { ...prev }; delete n[s]; return n; });
    showNotif(`Closed ${s}`);
  };

  const sendAI = useCallback(async (text) => {
    const msg = text || aiInput;
    if (!msg.trim() || aiLoading) return;
    setAiInput('');
    setAiMsgs(p => [...p, { role: 'user', text: msg }]);
    setAiLoading(true);
    const last = displayData[displayData.length - 1];
    const pos = positions[sym];
    const ctx = `${sym} live $${fmt(livePrice)} | RSI:${last?.rsi ?? 'N/A'} | SMA20:${last?.sma20 ?? 'N/A'} | SMA50:${last?.sma50 ?? 'N/A'} | Signal:${aiSignal?.signal} ${aiSignal?.confidence}% | Patterns:${patterns.map(p => p.name).join(',')||'None'} | Support:${levels.support.join(',')||'N/A'} | Resistance:${levels.resistance.join(',')||'N/A'} | ${pos ? `Position:${pos.shares}sh@$${pos.avgCost}` : 'No position'} | Balance:$${fmt(balance)}`;
    try {
      const res = await api.chat(msg, ctx);
      setAiMsgs(p => [...p, { role: 'ai', text: res.response || res.message || '' }]);
    } catch {
      setAiMsgs(p => [...p, { role: 'ai', text: generateLocalAnalysis(msg, stock, livePrice, last?.rsi, last?.sma20, last?.sma50, aiSignal, levels, blueprint, pos) }]);
    } finally {
      setAiLoading(false);
    }
  }, [aiInput, aiLoading, sym, livePrice, displayData, positions, balance, aiSignal, patterns, levels, blueprint, stock]);

  /* ── Tooltip ── */
  const ChartTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0]?.payload;
    if (!d) return null;
    return (
      <div style={{ background: '#0f1e35', border: '1px solid rgba(255,255,255,.1)', borderRadius: 8, padding: '.55rem .8rem', fontSize: '.7rem', color: 'rgba(255,255,255,.75)', minWidth: 160 }}>
        <div style={{ fontWeight: 700, color: '#fff', marginBottom: 4 }}>{d.date}</div>
        <div>O: <b style={{ color: '#e2e8f0' }}>${fmt(d.open)}</b> H: <b style={{ color: '#4ade80' }}>${fmt(d.high)}</b></div>
        <div>L: <b style={{ color: '#f87171' }}>${fmt(d.low)}</b> C: <b style={{ color: d.bullish ? '#4ade80' : '#f87171' }}>${fmt(d.close)}</b></div>
        {d.sma20 && <div style={{ marginTop: 3, borderTop: '1px solid rgba(255,255,255,.07)', paddingTop: 3 }}>SMA20: <b style={{ color: '#fbbf24' }}>${fmt(d.sma20)}</b> SMA50: <b style={{ color: '#60a5fa' }}>${fmt(d.sma50)}</b></div>}
        {d.rsi != null && <div>RSI: <b style={{ color: d.rsi > 70 ? '#f87171' : d.rsi < 30 ? '#4ade80' : '#e2e8f0' }}>{d.rsi}</b></div>}
      </div>
    );
  };

  /* ── Misc ── */
  const priceChangePct = ((livePrice - (stock.price - stock.change)) / (stock.price - stock.change) * 100);
  const priceChangeDollar = livePrice - (stock.price - stock.change);
  const orderCost = (parseInt(qty) || 0) * (oType === 'market' ? livePrice : parseFloat(limitPx) || livePrice);
  const curPos = positions[sym];
  const fg = fearGreed;
  const fgLabel = fg >= 75 ? 'Extreme Greed' : fg >= 55 ? 'Greed' : fg >= 45 ? 'Neutral' : fg >= 25 ? 'Fear' : 'Extreme Fear';
  const fgColor = fg >= 60 ? '#22c55e' : fg >= 40 ? '#f59e0b' : '#ef4444';
  const fgAngle = (fg / 100) * 180 - 90;

  return (
    <Page>
      {/* ── TOPBAR ── */}
      <Topbar>
        <div>
          <TopSym>{stock.symbol}</TopSym>
          <TopName>{stock.name}</TopName>
        </div>
        <div>
          <TopPrice>${fmt(livePrice)}</TopPrice>
          <TopChange $pos={priceChangeDollar >= 0}>
            {priceChangeDollar >= 0 ? <FaArrowUp /> : <FaArrowDown />}
            ${Math.abs(priceChangeDollar).toFixed(2)} ({Math.abs(priceChangePct).toFixed(2)}%)
          </TopChange>
        </div>

        <VDiv />

        {aiSignal && (
          <AISignalBadge $color={aiSignal.color}>
            <FaBrain style={{ fontSize: '.72rem', color: aiSignal.color }} />
            <div>
              <SigLabel $color={aiSignal.color}>{aiSignal.signal}</SigLabel>
              <SigConf>{aiSignal.confidence}% confidence</SigConf>
            </div>
          </AISignalBadge>
        )}

        <VDiv />
        <Stat>P/E <span>{stock.pe || '–'}</span></Stat>
        <Stat>Div <span>{stock.dividend ? stock.dividend + '%' : '–'}</span></Stat>
        <Stat>Mkt Cap <span>{stock.marketCap}</span></Stat>
        <TopSpacer />
        <Stat>Portfolio <span style={{ color: totalPnl >= 0 ? '#22c55e' : '#ef4444' }}>${portfolioValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span></Stat>
        <Stat>P&L <span style={{ color: totalPnl >= 0 ? '#22c55e' : '#ef4444' }}>{totalPnl >= 0 ? '+' : ''}${Math.abs(totalPnl).toFixed(2)}</span></Stat>
        <VDiv />
        <LiveDot title="Live simulation" />
      </Topbar>

      <Body>
        {/* ── LEFT: AI Intelligence ── */}
        <LeftPanel>
          {/* Signal */}
          <PanelSection>
            <PSHead $accent="#818cf8"><FaBrain /> AI Signal</PSHead>
            {aiSignal && (
              <SignalCard $bg={aiSignal.bg} $color={aiSignal.color} $glow={aiSignal.signal !== 'HOLD'}>
                <SignalMain>
                  <SignalText $color={aiSignal.color}>{aiSignal.signal}</SignalText>
                  <div>
                    <div style={{ fontSize: '.68rem', fontWeight: 700, color: aiSignal.color }}>{aiSignal.confidence}% confidence</div>
                    <div style={{ fontSize: '.6rem', color: 'rgba(255,255,255,.3)' }}>{aiSignal.bull}B / {aiSignal.bear}Br factors</div>
                  </div>
                </SignalMain>
                <ConfBar>
                  <ConfFill
                    $color={aiSignal.color}
                    initial={{ width: 0 }}
                    animate={{ width: `${aiSignal.confidence}%` }}
                    transition={{ duration: .8, ease: 'easeOut' }}
                  />
                </ConfBar>
                <FactorList>
                  {aiSignal.factors.slice(0, 4).map((f, i) => (
                    <Factor key={i} $bull={f.type === 'bull'} title={f.detail}>{f.label}</Factor>
                  ))}
                </FactorList>
              </SignalCard>
            )}
          </PanelSection>

          {/* Fear & Greed + Patterns */}
          <PanelSection>
            <PSHead $accent="#f59e0b"><FaFire /> Market Psychology</PSHead>
            <FGWrap>
              <div style={{ position: 'relative' }}>
                <FGArc />
                <FGNeedle $angle={fgAngle} />
              </div>
              <div>
                <FGValue $color={fgColor}>{fg}</FGValue>
                <FGLabel>{fgLabel}</FGLabel>
              </div>
            </FGWrap>
          </PanelSection>

          {/* Patterns */}
          <PanelSection>
            <PSHead $accent="#34d399"><FaStar /> Patterns Detected</PSHead>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {patterns.length ? patterns.map((p, i) => (
                <PatternChip key={i} $type={p.type} title={p.desc}>
                  {p.emoji} {p.name}
                </PatternChip>
              )) : <div style={{ fontSize: '.68rem', color: 'rgba(255,255,255,.25)' }}>No strong patterns</div>}
            </div>
          </PanelSection>

          {/* Key Levels */}
          <PanelSection>
            <PSHead $accent="#f87171"><FaBullseye /> Key Levels</PSHead>
            {levels.resistance.map(r => <LevelRow key={r}><LevelLabel>Resistance</LevelLabel><LevelVal $res>${fmt(r)}</LevelVal></LevelRow>)}
            <LevelRow><LevelLabel>Live Price</LevelLabel><span style={{ fontSize: '.72rem', fontWeight: 700, color: '#fff' }}>${fmt(livePrice)}</span></LevelRow>
            {levels.support.map(s => <LevelRow key={s}><LevelLabel>Support</LevelLabel><LevelVal>${fmt(s)}</LevelVal></LevelRow>)}
            {blueprint && (
              <>
                <LevelRow><LevelLabel>AI Target</LevelLabel><LevelVal>${fmt(blueprint.target1)}</LevelVal></LevelRow>
                <LevelRow><LevelLabel>AI Stop</LevelLabel><LevelVal $res>${fmt(blueprint.stop)}</LevelVal></LevelRow>
              </>
            )}
          </PanelSection>

          {/* Watchlist */}
          <PSHead $accent="#818cf8" style={{ padding: '.65rem .85rem .1rem', flexShrink: 0 }}><FaChartLine /> Watchlist</PSHead>
          <WatchSearch placeholder="Search…" value={wSearch} onChange={e => setWSearch(e.target.value)} />
          <WatchScroll>
            {filteredWatch.map(s => (
              <WatchRow key={s.symbol} $active={s.symbol === sym} onClick={() => setSym(s.symbol)}>
                <WSym>{s.symbol}</WSym>
                <WSignal $s={s.aiSig}>{s.aiSig}</WSignal>
                <WPrice>
                  <WPVal>${fmt(s.price)}</WPVal>
                  <WChg $pos={s.changePercent >= 0}>{s.changePercent >= 0 ? '+' : ''}{s.changePercent.toFixed(2)}%</WChg>
                </WPrice>
              </WatchRow>
            ))}
          </WatchScroll>
        </LeftPanel>

        {/* ── CENTER: Chart ── */}
        <ChartPanel>
          <ChartBar>
            {TIMEFRAMES.map(t => <TFBtn key={t} $a={tf === t} onClick={() => setTf(t)}>{t}</TFBtn>)}
            <Sep />
            <ChartTypeBtn $a={chartType === 'candle'} onClick={() => setChartType('candle')}><FaChartBar style={{ fontSize: '.78rem' }} /></ChartTypeBtn>
            <ChartTypeBtn $a={chartType === 'line'} onClick={() => setChartType('line')}><FaChartLine style={{ fontSize: '.78rem' }} /></ChartTypeBtn>
            <Sep />
            {[{ k: 'sma20', l: 'SMA20', c: '#fbbf24' }, { k: 'sma50', l: 'SMA50', c: '#60a5fa' }, { k: 'bb', l: 'BB', c: '#a78bfa' }, { k: 'rsi', l: 'RSI', c: '#34d399' }, { k: 'volume', l: 'Vol', c: '#94a3b8' }].map(({ k, l, c }) => (
              <IndToggle key={k} $a={inds[k]} $c={c} onClick={() => toggleInd(k)}>{l}</IndToggle>
            ))}
          </ChartBar>

          {/* Main chart */}
          <ChartMain>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={displayData} margin={{ top: 8, right: 58, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="pgUp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="pgDown" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity={0.12} />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.04)" vertical={false} />
                <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,.22)', fontSize: 9 }} tickLine={false} axisLine={{ stroke: 'rgba(255,255,255,.05)' }} interval={Math.floor(displayData.length / 6)} />
                <YAxis domain={yDomain} orientation="right" tick={{ fill: 'rgba(255,255,255,.22)', fontSize: 9 }} tickLine={false} axisLine={false} tickFormatter={v => `$${v.toFixed(0)}`} width={58} />
                <Tooltip content={<ChartTooltip />} />

                {/* Bollinger Bands */}
                {inds.bb && <>
                  <Area type="monotone" dataKey="bbUpper" stroke="#a78bfa" strokeWidth={0.7} fill="rgba(167,139,250,0.06)" dot={false} isAnimationActive={false} connectNulls />
                  <Area type="monotone" dataKey="bbLower" stroke="#a78bfa" strokeWidth={0.7} fill="transparent" dot={false} isAnimationActive={false} connectNulls />
                </>}

                {/* Price */}
                {chartType === 'line'
                  ? <Area type="monotone" dataKey="close" stroke={livePrice >= (displayData[0]?.close || livePrice) ? '#22c55e' : '#ef4444'} strokeWidth={1.8} fill={livePrice >= (displayData[0]?.close || livePrice) ? 'url(#pgUp)' : 'url(#pgDown)'} dot={false} isAnimationActive={false} />
                  : <Bar dataKey="wickRange" shape={<CandlestickShape />} isAnimationActive={false} maxBarSize={16}>
                    {displayData.map((d, i) => <Cell key={i} fill={d.bullish ? '#22c55e' : '#ef4444'} />)}
                  </Bar>
                }

                {/* MAs */}
                {inds.sma20 && <Line type="monotone" dataKey="sma20" stroke="#fbbf24" strokeWidth={1.2} dot={false} isAnimationActive={false} connectNulls />}
                {inds.sma50 && <Line type="monotone" dataKey="sma50" stroke="#60a5fa" strokeWidth={1.2} dot={false} isAnimationActive={false} connectNulls />}

                {/* AI Levels on chart */}
                {levels.resistance.map(r => (
                  <ReferenceLine key={`res-${r}`} y={r} stroke="rgba(248,113,113,.45)" strokeDasharray="5 4" label={{ value: `R $${r}`, position: 'right', fill: '#f87171', fontSize: 8, dx: 4 }} />
                ))}
                {levels.support.map(s => (
                  <ReferenceLine key={`sup-${s}`} y={s} stroke="rgba(74,222,128,.35)" strokeDasharray="5 4" label={{ value: `S $${s}`, position: 'right', fill: '#4ade80', fontSize: 8, dx: 4 }} />
                ))}
                {blueprint && (
                  <>
                    <ReferenceLine y={blueprint.target1} stroke="rgba(99,102,241,.6)" strokeDasharray="4 3" label={{ value: `T $${blueprint.target1}`, position: 'right', fill: '#818cf8', fontSize: 8, dx: 4 }} />
                    <ReferenceLine y={blueprint.stop} stroke="rgba(239,68,68,.55)" strokeWidth={1.5} label={{ value: `SL $${blueprint.stop}`, position: 'right', fill: '#ef4444', fontSize: 8, dx: 4 }} />
                  </>
                )}
                <ReferenceLine y={livePrice} stroke="rgba(255,255,255,.18)" strokeDasharray="4 4" label={{ value: `$${fmt(livePrice)}`, position: 'right', fill: '#fff', fontSize: 9, dx: 4 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartMain>

          {/* Volume */}
          {inds.volume && (
            <SubPane $h="62px">
              <PaneLabel>Volume</PaneLabel>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={displayData} margin={{ top: 2, right: 58, left: 0, bottom: 0 }}>
                  <XAxis dataKey="date" hide />
                  <YAxis orientation="right" tick={{ fill: 'rgba(255,255,255,.15)', fontSize: 8 }} tickLine={false} axisLine={false} width={58} tickFormatter={v => (v / 1e6).toFixed(0) + 'M'} />
                  <Bar dataKey="volume" isAnimationActive={false} maxBarSize={12}>
                    {displayData.map((d, i) => <Cell key={i} fill={d.bullish ? 'rgba(34,197,94,.4)' : 'rgba(239,68,68,.38)'} />)}
                  </Bar>
                </ComposedChart>
              </ResponsiveContainer>
            </SubPane>
          )}

          {/* RSI */}
          {inds.rsi && (
            <SubPane $h="72px">
              <PaneLabel>RSI (14)</PaneLabel>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={displayData} margin={{ top: 2, right: 58, left: 0, bottom: 0 }}>
                  <XAxis dataKey="date" hide />
                  <YAxis domain={[0, 100]} orientation="right" tick={{ fill: 'rgba(255,255,255,.15)', fontSize: 8 }} tickLine={false} axisLine={false} width={58} ticks={[30, 50, 70]} />
                  <ReferenceLine y={70} stroke="rgba(239,68,68,.28)" strokeDasharray="3 3" />
                  <ReferenceLine y={30} stroke="rgba(34,197,94,.28)" strokeDasharray="3 3" />
                  <Line type="monotone" dataKey="rsi" stroke="#34d399" strokeWidth={1.5} dot={false} isAnimationActive={false} connectNulls />
                </ComposedChart>
              </ResponsiveContainer>
            </SubPane>
          )}

          {/* AI Commentary ticker */}
          <CommentaryBar>
            <CommentaryDot />
            <AnimatePresence mode="wait">
              <CommentaryText
                key={commentaryIdx}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.4 }}
                dangerouslySetInnerHTML={{ __html: (commentary || '').replace(sym, `<span class="sym">${sym}</span>`).replace(/above|bullish|bounce|recovery/gi, m => `<span class="bull">${m}</span>`).replace(/below|bearish|overbought|warning/gi, m => `<span class="bear">${m}</span>`) }}
              />
            </AnimatePresence>
          </CommentaryBar>
        </ChartPanel>

        {/* ── RIGHT: AI Trade Desk ── */}
        <RightPanel>
          <RTabs>
            <RTab $a={rTab === 'ai'} onClick={() => setRTab('ai')}><FaBrain style={{ fontSize: '.65rem' }} /> Coach</RTab>
            <RTab $a={rTab === 'order'} onClick={() => setRTab('order')}><FaBolt style={{ fontSize: '.65rem' }} /> Order</RTab>
            <RTab $a={rTab === 'pos'} onClick={() => setRTab('pos')}><FaWallet style={{ fontSize: '.65rem' }} /> Portfolio</RTab>
            <RTab $a={rTab === 'hist'} onClick={() => setRTab('hist')}><FaHistory style={{ fontSize: '.65rem' }} /> Journal</RTab>
          </RTabs>

          <RTabBody>
            {/* ── AI Coach Tab ── */}
            {rTab === 'ai' && (
              <>
                {/* Alerts */}
                {alerts.length > 0 && (
                  <RSection>
                    <RSHead $accent="#fbbf24"><FaExclamationTriangle /> Live Alerts</RSHead>
                    <AnimatePresence>
                      {alerts.slice(0, 3).map(a => (
                        <AlertPill key={a.id} $type={a.type} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}>
                          <AlertIcon $type={a.type}><a.icon /></AlertIcon>
                          <span>{a.text}</span>
                        </AlertPill>
                      ))}
                    </AnimatePresence>
                  </RSection>
                )}

                {/* Blueprint */}
                {blueprint && (
                  <RSection>
                    <RSHead $accent="#818cf8"><FaLightbulb /> Trade Blueprint</RSHead>
                    <BlueprintCard>
                      <BPTitle>
                        <FaBullseye style={{ fontSize: '.75rem' }} />
                        {aiSignal?.signal} Setup — {sym}
                        <RRBadge $rr={blueprint.rr} style={{ marginLeft: 'auto', fontSize: '.62rem' }}>R/R {blueprint.rr}:1</RRBadge>
                      </BPTitle>
                      <BPGrid>
                        <BPItem><BPLabel>Entry</BPLabel><BPVal>${fmt(blueprint.entry)}</BPVal></BPItem>
                        <BPItem><BPLabel>Stop Loss</BPLabel><BPVal $c="#f87171">${fmt(blueprint.stop)}</BPVal></BPItem>
                        <BPItem><BPLabel>Target 1</BPLabel><BPVal $c="#4ade80">${fmt(blueprint.target1)}</BPVal></BPItem>
                        <BPItem><BPLabel>Target 2</BPLabel><BPVal $c="#4ade80">${fmt(blueprint.target2)}</BPVal></BPItem>
                      </BPGrid>
                      <BPItem style={{ marginTop: '.35rem' }}><BPLabel>Time Horizon</BPLabel><BPVal style={{ fontSize: '.75rem' }}>{blueprint.timeHorizon}</BPVal></BPItem>
                      <BPRationale>{blueprint.rationale}</BPRationale>
                    </BlueprintCard>
                  </RSection>
                )}

                {/* AI Chat */}
                <AIChat>
                  <AIMsgs>
                    {aiAutoLoading && !aiMsgs.length && (
                      <AIMsgB $ai>
                        <AIMsgLabel $ai><FaRobot /> AI Analyst</AIMsgLabel>
                        <Spinner2 style={{ marginRight: 6 }} /> Analysing {sym}…
                      </AIMsgB>
                    )}
                    {aiMsgs.map((m, i) => (
                      <AIMsgB key={i} $ai={m.role === 'ai'}>
                        <AIMsgLabel $ai={m.role === 'ai'}>{m.role === 'ai' ? <><FaRobot /> AI Analyst</> : <><FaChartLine /> You</>}</AIMsgLabel>
                        {m.text}
                      </AIMsgB>
                    ))}
                    {aiLoading && (
                      <AIMsgB $ai>
                        <AIMsgLabel $ai><FaRobot /> AI Analyst</AIMsgLabel>
                        <Spinner2 style={{ marginRight: 6 }} /> Thinking…
                      </AIMsgB>
                    )}
                    <div ref={aiEndRef} />
                  </AIMsgs>

                  <Chips>
                    {AI_PROMPTS.map(p => (
                      <Chip key={p} disabled={aiLoading || aiAutoLoading} onClick={() => sendAI(p)}>{p}</Chip>
                    ))}
                  </Chips>

                  <AIInputRow>
                    <AICInput
                      placeholder={`Ask about ${sym}…`}
                      value={aiInput}
                      onChange={e => setAiInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && sendAI()}
                      disabled={aiLoading || aiAutoLoading}
                    />
                    <AISendBtn disabled={!aiInput.trim() || aiLoading || aiAutoLoading} onClick={() => sendAI()}>
                      <FaPaperPlane />
                    </AISendBtn>
                  </AIInputRow>
                </AIChat>
              </>
            )}

            {/* ── Order Tab ── */}
            {rTab === 'order' && (
              <RSection>
                <SideToggle>
                  <SideBtn $a={side === 'buy'} $s="buy" onClick={() => setSide('buy')}>▲ BUY</SideBtn>
                  <SideBtn $a={side === 'sell'} $s="sell" onClick={() => setSide('sell')}>▼ SELL</SideBtn>
                </SideToggle>

                <OTypeRow>
                  {['market', 'limit'].map(t => <OTypeBtn key={t} $a={oType === t} onClick={() => setOType(t)}>{t.charAt(0).toUpperCase() + t.slice(1)}</OTypeBtn>)}
                </OTypeRow>

                <FLabel>Quantity</FLabel>
                <NInput type="number" min="1" placeholder="0 shares" value={qty} onChange={e => setQty(e.target.value)} />

                {oType === 'limit' && (
                  <><FLabel>Limit Price</FLabel><NInput type="number" step=".01" value={limitPx} onChange={e => setLimitPx(e.target.value)} /></>
                )}

                {/* AI Position Sizing */}
                {aiSuggestedQty && blueprint && (
                  <AISizeHint>
                    <strong>AI Size Suggestion: {aiSuggestedQty} shares</strong><br />
                    Based on 2% portfolio risk rule. Stop at ${fmt(blueprint.stop)} → risk per share ${fmt(Math.abs(livePrice - blueprint.stop))}
                    <br />
                    <span style={{ color: '#818cf8', cursor: 'pointer', fontWeight: 700 }} onClick={() => setQty(String(aiSuggestedQty))}>
                      Apply suggestion →
                    </span>
                  </AISizeHint>
                )}

                {curPos && (
                  <div style={{ background: 'rgba(99,102,241,.08)', border: '1px solid rgba(99,102,241,.18)', borderRadius: 8, padding: '.45rem .65rem', marginBottom: '.55rem', fontSize: '.7rem', color: 'rgba(255,255,255,.6)', lineHeight: 1.5 }}>
                    <strong style={{ color: '#a5b4fc' }}>Open: </strong>{curPos.shares} shares @ ${fmt(curPos.avgCost)} —
                    P&L: <strong style={{ color: curPos.shares * (livePrice - curPos.avgCost) >= 0 ? '#4ade80' : '#f87171' }}>
                      {fmtDollar(curPos.shares * (livePrice - curPos.avgCost))}
                    </strong>
                  </div>
                )}

                <OSummary>
                  <ORow><span>Exec Price</span><span>{oType === 'market' ? `$${fmt(livePrice)} (live)` : `$${parseFloat(limitPx || livePrice).toFixed(2)}`}</span></ORow>
                  <ORow><span>Est. Total</span><span style={{ color: side === 'buy' ? '#f87171' : '#4ade80' }}>${qty ? orderCost.toFixed(2) : '0.00'}</span></ORow>
                  {blueprint && <ORow><span>AI Signal</span><span style={{ color: aiSignal?.color }}>{aiSignal?.signal} ({aiSignal?.confidence}%)</span></ORow>}
                </OSummary>

                <OrderBtn $s={side} disabled={!qty || parseInt(qty) <= 0} onClick={submitOrder}>
                  {side === 'buy' ? '▲ Place Buy Order' : '▼ Place Sell Order'}
                </OrderBtn>
                <BalBadge>Cash: <span>${balance.toLocaleString('en-US', { maximumFractionDigits: 2 })}</span></BalBadge>

                {/* Market indices strip */}
                <div style={{ marginTop: '.85rem', borderTop: '1px solid rgba(255,255,255,.05)', paddingTop: '.65rem' }}>
                  {marketIndices.map(idx => (
                    <div key={idx.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '.2rem 0', fontSize: '.67rem' }}>
                      <span style={{ color: 'rgba(255,255,255,.3)' }}>{idx.name}</span>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ color: '#e2e8f0', fontWeight: 600 }}>{idx.value.toLocaleString()}</div>
                        <div style={{ color: idx.changePercent >= 0 ? '#22c55e' : '#ef4444', fontSize: '.6rem' }}>{idx.changePercent >= 0 ? '+' : ''}{idx.changePercent.toFixed(2)}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </RSection>
            )}

            {/* ── Portfolio Tab ── */}
            {rTab === 'pos' && (
              <>
                <RSection>
                  <RSHead $accent="#22c55e"><FaWallet /> Open Positions</RSHead>
                  {Object.keys(positions).length === 0 ? (
                    <NoItems>No open positions.</NoItems>
                  ) : Object.entries(positions).map(([s, pos]) => {
                    const st = stocks.find(x => x.symbol === s);
                    const cpx = s === sym ? livePrice : (st?.price || 0);
                    const pnl = pos.shares * (cpx - pos.avgCost);
                    return (
                      <PosCard key={s}>
                        <PosHead>
                          <div><PosSym2>{s}</PosSym2><div style={{ fontSize: '.6rem', color: 'rgba(255,255,255,.28)', marginTop: 2 }}>{st?.name}</div></div>
                          <div style={{ textAlign: 'right' }}>
                            <PnlBadge $pos={pnl >= 0}>{fmtDollar(pnl)}</PnlBadge>
                            <div style={{ fontSize: '.6rem', color: pnl >= 0 ? '#22c55e' : '#ef4444' }}>{((cpx - pos.avgCost) / pos.avgCost * 100).toFixed(2)}%</div>
                          </div>
                        </PosHead>
                        <PosStats>
                          <PS>Shares<span>{pos.shares}</span></PS>
                          <PS>Avg Cost<span>${fmt(pos.avgCost)}</span></PS>
                          <PS>Mkt Val<span>${fmt(pos.shares * cpx)}</span></PS>
                        </PosStats>
                        <CloseBtn onClick={() => closePos(s)}>Close Position</CloseBtn>
                      </PosCard>
                    );
                  })}
                </RSection>
                <RSection>
                  <RSHead>Account Summary</RSHead>
                  {[{ l: 'Cash', v: `$${balance.toLocaleString('en-US', { maximumFractionDigits: 2 })}` }, { l: 'Portfolio Value', v: `$${portfolioValue.toLocaleString('en-US', { maximumFractionDigits: 2 })}` }, { l: 'Total P&L', v: fmtDollar(totalPnl), c: totalPnl >= 0 ? '#4ade80' : '#f87171' }, { l: 'Trades', v: trades.length }].map(r => (
                    <div key={r.l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.7rem', padding: '.2rem 0', color: 'rgba(255,255,255,.32)' }}>
                      <span>{r.l}</span><span style={{ color: r.c || '#e2e8f0', fontWeight: 600 }}>{r.v}</span>
                    </div>
                  ))}
                </RSection>
              </>
            )}

            {/* ── Journal Tab ── */}
            {rTab === 'hist' && (
              <>
                <div style={{ padding: '.55rem .85rem .25rem', fontSize: '.6rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.1em', color: 'rgba(255,255,255,.22)', borderBottom: '1px solid rgba(255,255,255,.04)' }}>
                  AI Trade Journal ({trades.length} trades)
                </div>
                {trades.length === 0 ? <NoItems>No trades yet.</NoItems> : trades.map(t => (
                  <TRow key={t.id}>
                    <TSide $b={t.side === 'buy'}>{t.side}</TSide>
                    <TInfo>
                      <TSym>{t.sym} <span style={{ fontSize: '.6rem', color: 'rgba(255,255,255,.3)' }}>{t.time}</span></TSym>
                      <TMeta>{t.qty} shares @ ${fmt(t.price)}</TMeta>
                      {t.aiNote && <TAINote><FaRobot style={{ marginRight: 3 }} />{t.aiNote}</TAINote>}
                    </TInfo>
                    <TTotal>${fmt(t.total)}</TTotal>
                  </TRow>
                ))}
              </>
            )}
          </RTabBody>
        </RightPanel>
      </Body>

      {/* Notification */}
      <AnimatePresence>
        {notif && (
          <Notif key="n" $t={notif.type} initial={{ opacity: 0, y: 20, x: '-50%' }} animate={{ opacity: 1, y: 0, x: '-50%' }} exit={{ opacity: 0, y: 20, x: '-50%' }}>
            {notif.type === 'success' ? <FaCheckCircle /> : <FaTimes />} {notif.text}
          </Notif>
        )}
      </AnimatePresence>
    </Page>
  );
}

/* ─────────────────────────────────────────────────────────────
   LOCAL AI FALLBACK
───────────────────────────────────────────────────────────── */

function generateAutoAnalysis(stock, price, rsi, sma20, sma50, sig) {
  const bull = price > (sma20 || price);
  const cross = sma20 && sma50 ? (sma20 > sma50 ? 'Golden Cross active' : 'Death Cross active') : '';
  return `**${stock.symbol} — AI Auto Analysis**\n\nSignal: **${sig?.signal || 'HOLD'}** (${sig?.confidence || 50}% confidence)\n\n${stock.description}\n\nPrice $${price.toFixed(2)} is ${bull ? 'above' : 'below'} SMA20 ($${sma20 ?? 'N/A'}) — ${bull ? 'short-term trend is positive' : 'short-term trend is negative'}. ${cross ? cross + '.' : ''} RSI at ${rsi ?? 'N/A'} is ${rsi > 70 ? 'overbought — watch for pullback' : rsi < 30 ? 'oversold — bounce probability elevated' : 'neutral'}.\n\nKey risk: ${sig?.factors?.filter(f => f.type === 'bear').slice(0, 2).map(f => f.label).join(', ') || 'Monitor volume for confirmation'}.\n\nAsk me anything specific about this setup.`;
}

function generateLocalAnalysis(q, stock, price, rsi, sma20, sma50, sig, levels, blueprint, pos) {
  const ql = q.toLowerCase();
  const bull = price > (sma20 || price);

  if (ql.includes('signal') || ql.includes('explain')) {
    return `**Signal Breakdown — ${stock.symbol}**\n\nCurrent: **${sig?.signal}** at ${sig?.confidence}% confidence.\n\n${sig?.factors?.map(f => `${f.type === 'bull' ? '▲' : '▼'} **${f.label}** — ${f.detail}`).join('\n') || 'Signal computing…'}\n\n${sig?.signal === 'BUY' ? 'Bullish factors outweigh bearish. Risk is defined — consider the trade blueprint.' : sig?.signal === 'SELL' ? 'Bearish pressure dominant. Wait for reversal signals before buying.' : 'Market is indecisive. Patience and waiting for a catalyst is the professional move.'}`;
  }
  if (ql.includes('pattern')) {
    return `**Pattern Analysis — ${stock.symbol}**\n\nPrice structure shows ${bull ? 'higher highs and higher lows — classic uptrend characteristics' : 'lower highs and lower lows — downtrend in progress'}.\n\nKey observation: ${rsi > 70 ? 'RSI divergence risk — price may be running ahead of fundamentals.' : rsi < 30 ? 'Capitulation signs — historically a high-probability reversal zone for quality assets.' : 'RSI in neutral zone — momentum could break either way.'}\n\nSupport zones: ${levels?.support?.map(s => `$${s}`).join(', ') || 'Computing…'}\nResistance zones: ${levels?.resistance?.map(r => `$${r}`).join(', ') || 'Computing…'}`;
  }
  if (ql.includes('stop') || ql.includes('stop-loss')) {
    return `**Stop-Loss Guidance — ${stock.symbol}**\n\nAI Blueprint Stop: **$${blueprint?.stop?.toFixed(2) || 'N/A'}**\n\nThis is placed ${blueprint ? 'below the nearest support level, giving the trade room to breathe while limiting downside' : 'based on ATR (average true range) volatility'}.\n\n**Position Sizing Rule:** Size so your stop hit = max 2% of total capital. If your stop is $${Math.abs(price - (blueprint?.stop || price * 0.95)).toFixed(2)} away per share, on a $${Math.round(25000 * 0.02)} max risk = max ${Math.floor(25000 * 0.02 / Math.abs(price - (blueprint?.stop || price * 0.95)))} shares.\n\nNever move a stop against your position — that's the fastest way to turn a small loss into a large one.`;
  }
  if (ql.includes('blueprint') || ql.includes('setup') || ql.includes('trade')) {
    return blueprint ? `**Trade Blueprint — ${stock.symbol}**\n\nEntry: $${blueprint.entry} | Stop: $${blueprint.stop} | T1: $${blueprint.target1} | T2: $${blueprint.target2}\nRisk/Reward: **${blueprint.rr}:1** | Time: ${blueprint.timeHorizon}\n\n${blueprint.rationale}\n\n${blueprint.rr >= 2 ? '✅ R/R exceeds 2:1 — meets professional trading standards.' : '⚠️ R/R below 2:1 — consider tighter stop or higher target before entering.'}` : 'Blueprint is computing with current market data…';
  }
  if (ql.includes('overbought') || ql.includes('oversold') || ql.includes('rsi')) {
    return `**RSI Analysis — ${stock.symbol}**\n\nCurrent RSI: **${rsi ?? 'N/A'}**\n\n${rsi > 70 ? '🔴 **Overbought** — RSI above 70 means buying momentum has been aggressive. This doesn\'t mean sell immediately, but:\n• New longs have poor risk/reward\n• Look for RSI divergence (price rises, RSI falls) as a sell signal\n• Trail stops tighter to protect gains' : rsi < 30 ? '🟢 **Oversold** — RSI below 30 signals extreme selling. Historically, this is where:\n• Short-sellers cover positions\n• Value buyers step in\n• Bounces of 5–15% are common\nConfirm with volume before buying the dip.' : `⚪ **Neutral RSI (${rsi})** — No extreme reading. Price can continue trending. Watch for:\n• A move above 60 = bullish momentum building\n• A drop below 40 = bearish pressure increasing`}`;
  }
  if (ql.includes('invalidat')) {
    return `**What Would Invalidate This Setup — ${stock.symbol}**\n\n${sig?.signal === 'BUY' ? `For the BUY thesis to fail:\n• Price breaks below $${(blueprint?.stop || price * 0.95).toFixed(2)} (AI stop level) on volume\n• RSI drops back below 40 after a recovery attempt\n• SMA20 crosses below SMA50 (Death Cross)\n• Sector-wide selling overwhelms individual stock strength` : sig?.signal === 'SELL' ? `For the SELL thesis to fail:\n• Price reclaims SMA20 ($${sma20 ?? 'N/A'}) on strong volume\n• RSI bounces sharply from oversold\n• Positive earnings or macro catalyst\n• Sector rotation into this space` : `For a HOLD, watch for the breakout catalyst:\n• Volume surge above recent average\n• RSI breaking convincingly above 60 or below 40\n• Price clearing $${(levels?.resistance?.[0] || price * 1.03).toFixed(2)} resistance or losing $${(levels?.support?.[0] || price * 0.97).toFixed(2)} support`}`;
  }
  return `**${stock.symbol} Analysis**\n\nPrice: $${price.toFixed(2)} | Signal: **${sig?.signal}** (${sig?.confidence}% conf) | RSI: ${rsi ?? 'N/A'}\n\n${stock.description}\n\n${bull ? 'Bullish structure intact — price above key moving averages.' : 'Bearish pressure — price below key moving averages.'} ${pos ? `\n\nYour position: ${pos.shares} shares avg $${pos.avgCost} — P&L ${fmtDollar(pos.shares * (price - pos.avgCost))}.` : ''}\n\nAsk me about: the trade blueprint, stop-loss levels, what patterns I see, or what would invalidate the setup.`;
}
