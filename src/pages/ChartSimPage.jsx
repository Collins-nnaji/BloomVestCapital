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
  FaHistory, FaWallet, FaFire, FaLightbulb,
  FaBullseye, FaExclamationTriangle, FaStar,
  FaSearch, FaRegBell, FaShieldAlt,
} from 'react-icons/fa';
import { stocks, marketIndices } from '../data/stockData';
import { api } from '../api';
import { useAuth } from '../AuthContext';

/* ─────────────────────────────────────────────────────────────
   ANALYTICS ENGINE
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
    if (livePrice > sma20) { bull += 1; factors.push({ label: 'Price > SMA20', type: 'bull', detail: 'Trading above short-term average' }); }
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
    if (livePrice >= bbUpper * 0.998) { bear += 1; factors.push({ label: 'BB Resistance', type: 'bear', detail: 'Touching upper band — mean reversion possible' }); }
    if (livePrice <= bbLower * 1.002) { bull += 2; factors.push({ label: 'BB Oversold', type: 'bull', detail: 'Touching lower band — bounce probability elevated' }); }
  }

  const total = bull + bear;
  const bullRatio = total > 0 ? bull / total : 0.5;
  let signal, confidence, color, bg;
  if (bullRatio >= 0.62) { signal = 'BUY'; confidence = Math.min(98, Math.round(50 + (bullRatio - 0.5) * 200)); color = '#16a34a'; bg = 'rgba(22,163,74,0.08)'; }
  else if (bullRatio <= 0.38) { signal = 'SELL'; confidence = Math.min(98, Math.round(50 + (0.5 - bullRatio) * 200)); color = '#dc2626'; bg = 'rgba(220,38,38,0.08)'; }
  else { signal = 'HOLD'; confidence = Math.round(50 + Math.abs(bullRatio - 0.5) * 50); color = '#d97706'; bg = 'rgba(217,119,6,0.08)'; }

  return { signal, confidence, color, bg, factors: factors.slice(0, 5), bull, bear };
}

function detectPatterns(chartData) {
  const patterns = [];
  if (chartData.length < 15) return patterns;
  const n = chartData.length;
  const closes = chartData.map(d => d.close);
  const highs = chartData.map(d => d.high);
  const lows = chartData.map(d => d.low);

  const recentHighs = highs.slice(-8);
  const recentLows = lows.slice(-8);
  const hhhl = recentHighs[7] > recentHighs[3] && recentLows[7] > recentLows[3];
  const lhll = recentHighs[7] < recentHighs[3] && recentLows[7] < recentLows[3];
  if (hhhl) patterns.push({ name: 'Uptrend', emoji: '📈', type: 'bull', desc: 'Higher highs & higher lows confirm uptrend' });
  if (lhll) patterns.push({ name: 'Downtrend', emoji: '📉', type: 'bear', desc: 'Lower highs & lower lows confirm downtrend' });

  const maxR = Math.max(...closes.slice(-12));
  const minR = Math.min(...closes.slice(-12));
  const rangePct = (maxR - minR) / minR;
  if (rangePct < 0.04 && !hhhl && !lhll) patterns.push({ name: 'Consolidation', emoji: '⬛', type: 'neutral', desc: 'Price compressing — breakout likely soon' });

  const last20H = highs.slice(-20);
  const peak1 = Math.max(...last20H.slice(0, 10));
  const peak2 = Math.max(...last20H.slice(10));
  if (Math.abs(peak1 - peak2) / peak1 < 0.015 && peak1 > closes[n - 1] * 1.01) {
    patterns.push({ name: 'Double Top', emoji: '🏔️', type: 'bear', desc: 'Two equal peaks — bearish reversal pattern' });
  }

  const lastRSI = chartData.slice(-5).map(d => d.rsi).filter(Boolean);
  if (lastRSI.some(r => r < 32) && closes[n - 1] > closes[n - 4]) {
    patterns.push({ name: 'Oversold Bounce', emoji: '🔄', type: 'bull', desc: 'RSI was oversold, price starting to recover' });
  }

  const rsiSlope = lastRSI.length >= 2 ? lastRSI[lastRSI.length - 1] - lastRSI[0] : 0;
  const priceSlope = closes[n - 1] - closes[n - Math.min(5, n)];
  if (priceSlope > 0 && rsiSlope < -3) patterns.push({ name: 'Bearish Div.', emoji: '⚠️', type: 'bear', desc: 'Price rising but RSI falling — momentum warning' });
  if (priceSlope < 0 && rsiSlope > 3) patterns.push({ name: 'Bullish Div.', emoji: '💡', type: 'bull', desc: 'Price falling but RSI rising — hidden strength' });

  return patterns.slice(0, 4);
}

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
    rationale = `Mixed signals — market is indecisive. Watch for a break above $${(nearResistance || livePrice * 1.03).toFixed(2)} or below $${(nearSupport || livePrice * 0.97).toFixed(2)} before committing.`;
  }

  const riskPerShare = Math.abs(entry - stop);
  const rr = riskPerShare > 0 ? +((Math.abs(target1 - entry) / riskPerShare)).toFixed(1) : 0;
  return { entry: +entry.toFixed(2), stop: +stop.toFixed(2), target1: +target1.toFixed(2), target2: +target2.toFixed(2), rr, timeHorizon, rationale };
}

function computeFearGreed(chartData, livePrice) {
  if (!chartData.length) return 50;
  const last = chartData[chartData.length - 1];
  const rsi = last?.rsi ?? 50;
  const priceMom = chartData.length >= 20
    ? ((livePrice - chartData[chartData.length - 20].close) / chartData[chartData.length - 20].close) * 100
    : 0;
  const volTrend = chartData.slice(-5).map(d => d.volume).reduce((s, v) => s + v, 0)
    > chartData.slice(-10, -5).map(d => d.volume).reduce((s, v) => s + v, 0) ? 5 : -5;
  return Math.round(Math.min(100, Math.max(0, (rsi - 30) * (100 / 40) * 0.5 + priceMom * 3 + 50 + volTrend)));
}

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
  const color = bullish ? '#16a34a' : '#dc2626';
  const cx = x + width / 2;
  const ppu = height / priceRange;
  const bodyTop = y + (high - Math.max(open, close)) * ppu;
  const bodyH = Math.max(1.5, Math.abs(close - open) * ppu);
  const bw = Math.max(3, Math.min(14, width * 0.72));
  return (
    <g>
      <line x1={cx} y1={y} x2={cx} y2={y + height} stroke={color} strokeWidth={1.2} opacity={0.55} />
      <rect x={cx - bw / 2} y={bodyTop} width={bw} height={bodyH} fill={color} fillOpacity={0.88} rx={1} />
    </g>
  );
};

/* ─────────────────────────────────────────────────────────────
   ANIMATIONS
───────────────────────────────────────────────────────────── */
const spin = keyframes`from{transform:rotate(0deg)}to{transform:rotate(360deg)}`;
const pulse = keyframes`0%,100%{opacity:.4}50%{opacity:1}`;
const blink = keyframes`0%,100%{opacity:1}50%{opacity:0.35}`;
const slideUp = keyframes`from{transform:translateY(6px);opacity:0}to{transform:translateY(0);opacity:1}`;
const glowGreen = keyframes`0%,100%{box-shadow:0 0 0 0 rgba(22,163,74,0)}50%{box-shadow:0 0 0 4px rgba(22,163,74,0.12)}`;

/* ─────────────────────────────────────────────────────────────
   DESIGN TOKENS (light theme)
   bg: #f0f4f8  surface: #fff  surface2: #f8fafc  border: #e2e8f0
   text: #0f172a  text2: #475569  text3: #94a3b8
───────────────────────────────────────────────────────────── */

const Page = styled.div`
  display: flex; flex-direction: column; height: 100vh; overflow: hidden;
  background: #f0f4f8; color: #0f172a; font-family: 'Inter', sans-serif;
  @media(max-width:900px){ height:auto; overflow:visible; }
`;

/* ── Topbar ── */
const Topbar = styled.div`
  flex-shrink: 0; display: flex; align-items: center; gap: 1rem;
  padding: 0 1.5rem; height: 56px; background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(15,23,42,0.06);
  flex-wrap: wrap;
  @media(max-width:768px){ height:auto; padding:.75rem 1rem; gap:.6rem; }
`;
const TopSym = styled.div`font-family:'Space Grotesk',sans-serif;font-size:1.05rem;font-weight:800;color:#0f172a;letter-spacing:-.01em;`;
const TopName = styled.div`font-size:.7rem;color:#94a3b8;`;
const TopPrice = styled.div`font-family:'Space Grotesk',sans-serif;font-size:1.35rem;font-weight:800;color:#0f172a;letter-spacing:-.02em;`;
const TopChange = styled.div`font-size:.78rem;font-weight:700;color:${p=>p.$pos?'#16a34a':'#dc2626'};display:flex;align-items:center;gap:.2rem;`;
const VDiv = styled.div`width:1px;height:28px;background:#e2e8f0;flex-shrink:0;`;
const Stat = styled.div`font-size:.68rem;color:#94a3b8;span{color:#475569;font-weight:600;margin-left:.2rem;}`;
const TopSpacer = styled.div`flex:1;`;
const LiveDot = styled.div`
  width:7px;height:7px;border-radius:50%;background:#16a34a;
  animation:${pulse} 1.4s ease-in-out infinite;
  box-shadow:0 0 0 2px rgba(22,163,74,0.2);
`;

const AISignalBadge = styled.div`
  display:flex;align-items:center;gap:.5rem;padding:.32rem .9rem;
  border-radius:20px;border:1.5px solid ${p=>p.$color+'35'};
  background:${p=>p.$color+'0f'};
`;
const SigLabel = styled.div`font-family:'Space Grotesk',sans-serif;font-size:.82rem;font-weight:800;color:${p=>p.$color};letter-spacing:.05em;`;
const SigConf = styled.div`font-size:.63rem;color:#94a3b8;`;

/* ── Body ── */
const Body = styled.div`
  flex:1;display:grid;grid-template-columns:252px 1fr 308px;
  overflow:hidden;min-height:0;
  @media(max-width:1280px){grid-template-columns:220px 1fr 285px;}
  @media(max-width:900px){grid-template-columns:1fr;overflow:visible;}
`;

/* ── LEFT Panel ── */
const LeftPanel = styled.div`
  background:#ffffff;border-right:1px solid #e2e8f0;
  display:flex;flex-direction:column;overflow:hidden;
  @media(max-width:900px){display:none;}
`;
const PanelSection = styled.div`
  border-bottom:1px solid #f1f5f9;padding:.8rem .9rem;flex-shrink:0;
`;
const PSHead = styled.div`
  display:flex;align-items:center;gap:.4rem;
  font-size:.6rem;font-weight:800;text-transform:uppercase;letter-spacing:.1em;
  color:#94a3b8;margin-bottom:.6rem;
  svg{color:${p=>p.$accent||'#6366f1'};font-size:.72rem;}
`;

const SignalCard = styled.div`
  background:${p=>p.$bg||'#f8fafc'};
  border:1.5px solid ${p=>p.$color+'28'};
  border-radius:12px;padding:.8rem;margin-bottom:.55rem;
  animation:${p=>p.$glow?glowGreen:undefined} 2.5s ease-in-out infinite;
`;
const SignalMain = styled.div`display:flex;align-items:center;gap:.7rem;margin-bottom:.5rem;`;
const SignalText = styled.div`
  font-family:'Space Grotesk',sans-serif;font-size:1.6rem;font-weight:800;
  color:${p=>p.$color};letter-spacing:.04em;
`;
const ConfBar = styled.div`background:#f1f5f9;border-radius:999px;height:5px;overflow:hidden;margin:.45rem 0 .4rem;`;
const ConfFill = styled(motion.div)`
  height:100%;border-radius:999px;
  background:linear-gradient(90deg,${p=>p.$color+'88'},${p=>p.$color});
`;
const FactorList = styled.div`display:flex;flex-direction:column;gap:.22rem;`;
const Factor = styled.div`
  display:flex;align-items:center;gap:.4rem;font-size:.67rem;
  color:${p=>p.$bull?'#16a34a':'#dc2626'};
  &::before{content:'${p=>p.$bull?'▲':'▼'}';font-size:.52rem;}
`;

const FGWrap = styled.div`display:flex;align-items:center;gap:.7rem;`;
const FGArc = styled.div`
  width:54px;height:29px;border-radius:54px 54px 0 0;overflow:hidden;position:relative;
  background:linear-gradient(90deg,#dc2626 0%,#f59e0b 50%,#16a34a 100%);
  &::after{content:'';position:absolute;inset:4px 4px 0;border-radius:50px 50px 0 0;background:#ffffff;}
`;
const FGNeedle = styled.div`
  position:absolute;bottom:0;left:50%;width:2px;height:27px;
  background:#0f172a;transform-origin:bottom center;
  transform:translateX(-50%) rotate(${p=>p.$angle}deg);
  border-radius:2px 2px 0 0;z-index:1;
`;
const FGLabel = styled.div`font-size:.62rem;color:#94a3b8;`;
const FGValue = styled.div`font-family:'Space Grotesk',sans-serif;font-size:.9rem;font-weight:800;color:${p=>p.$color};`;

const PatternChip = styled.div`
  display:inline-flex;align-items:center;gap:.3rem;
  padding:.25rem .55rem;border-radius:6px;font-size:.67rem;font-weight:700;
  background:${p=>p.$type==='bull'?'#f0fdf4':p.$type==='bear'?'#fef2f2':'#f8fafc'};
  border:1px solid ${p=>p.$type==='bull'?'#bbf7d0':p.$type==='bear'?'#fecaca':'#e2e8f0'};
  color:${p=>p.$type==='bull'?'#16a34a':p.$type==='bear'?'#dc2626':'#64748b'};
  margin:.15rem .15rem 0 0;
`;

const LevelRow = styled.div`
  display:flex;justify-content:space-between;align-items:center;
  font-size:.72rem;padding:.22rem 0;
  border-bottom:1px solid #f8fafc;
`;
const LevelLabel = styled.span`color:#94a3b8;`;
const LevelVal = styled.span`font-weight:700;color:${p=>p.$res?'#dc2626':'#16a34a'};`;

const WatchScroll = styled.div`
  flex:1;overflow-y:auto;
  &::-webkit-scrollbar{width:3px;}
  &::-webkit-scrollbar-thumb{background:#e2e8f0;border-radius:3px;}
`;
const WatchSearch = styled.input`
  width:calc(100% - 1.8rem);margin:.55rem .9rem .4rem;
  background:#f8fafc;border:1px solid #e2e8f0;
  border-radius:8px;padding:.35rem .65rem;font-size:.72rem;color:#0f172a;outline:none;
  &::placeholder{color:#cbd5e1;}
  &:focus{border-color:#6366f1;background:#fff;}
`;
const WatchRow = styled.div`
  display:flex;align-items:center;padding:.55rem .9rem;cursor:pointer;
  border-left:2px solid ${p=>p.$active?'#16a34a':'transparent'};
  background:${p=>p.$active?'#f0fdf4':'transparent'};
  transition:background .12s;
  &:hover{background:#f8fafc;}
`;
const WSym = styled.div`font-family:'Space Grotesk',sans-serif;font-size:.78rem;font-weight:700;color:#0f172a;min-width:44px;`;
const WPrice = styled.div`flex:1;text-align:right;`;
const WPVal = styled.div`font-size:.72rem;font-weight:600;color:#1e293b;`;
const WChg = styled.div`font-size:.6rem;font-weight:700;color:${p=>p.$pos?'#16a34a':'#dc2626'};`;
const WSignal = styled.div`
  width:36px;text-align:center;font-size:.6rem;font-weight:800;letter-spacing:.04em;
  color:${p=>p.$s==='BUY'?'#16a34a':p.$s==='SELL'?'#dc2626':'#d97706'};
`;

/* ── CENTER: Chart ── */
const ChartPanel = styled.div`
  display:flex;flex-direction:column;overflow:hidden;min-height:0;background:#f8fafc;
`;
const ChartBar = styled.div`
  flex-shrink:0;display:flex;align-items:center;gap:.5rem;flex-wrap:wrap;
  padding:.5rem .9rem;border-bottom:1px solid #e8edf3;background:#ffffff;
`;
const TFBtn = styled.button`
  padding:.22rem .6rem;border-radius:6px;font-size:.68rem;font-weight:700;
  border:1.5px solid ${p=>p.$a?'#6366f1':'#e2e8f0'};
  background:${p=>p.$a?'#eef2ff':'transparent'};
  color:${p=>p.$a?'#4f46e5':'#94a3b8'};cursor:pointer;transition:all .12s;
  &:hover{border-color:#6366f1;color:#4f46e5;}
`;
const ChartTypeBtn = styled.button`
  padding:.22rem .5rem;border-radius:6px;font-size:.76rem;
  border:1.5px solid ${p=>p.$a?'#334155':'#e2e8f0'};
  background:${p=>p.$a?'#f1f5f9':'transparent'};
  color:${p=>p.$a?'#0f172a':'#94a3b8'};cursor:pointer;transition:all .12s;
`;
const IndToggle = styled.button`
  padding:.2rem .52rem;border-radius:6px;font-size:.64rem;font-weight:700;
  border:1.5px solid ${p=>p.$a?p.$c+'60':'#e2e8f0'};
  background:${p=>p.$a?p.$c+'15':'transparent'};
  color:${p=>p.$a?p.$c:'#94a3b8'};cursor:pointer;transition:all .12s;
  &:hover{border-color:${p=>p.$c+'60'};}
`;
const Sep = styled.div`width:1px;height:18px;background:#e2e8f0;`;
const ChartMain = styled.div`flex:1;min-height:0;position:relative;`;
const SubPane = styled.div`
  height:${p=>p.$h||'68px'};flex-shrink:0;
  border-top:1px solid #e8edf3;position:relative;background:#ffffff;
`;
const PaneLabel = styled.div`
  position:absolute;top:5px;left:12px;font-size:.58rem;font-weight:800;
  text-transform:uppercase;letter-spacing:.08em;color:#cbd5e1;z-index:1;
`;

const CommentaryBar = styled.div`
  flex-shrink:0;height:30px;background:#fff;border-top:1px solid #e8edf3;
  display:flex;align-items:center;overflow:hidden;
  box-shadow:0 -1px 0 #f1f5f9;
`;
const CommentaryText = styled(motion.div)`
  display:flex;align-items:center;gap:.5rem;font-size:.68rem;color:#64748b;
  white-space:nowrap;padding:0 1.25rem;
  span.sym{color:#6366f1;font-weight:700;}
  span.bull{color:#16a34a;font-weight:700;}
  span.bear{color:#dc2626;font-weight:700;}
`;
const CommentaryDot = styled.div`
  width:6px;height:6px;flex-shrink:0;border-radius:50%;background:#6366f1;margin-left:1rem;
  animation:${blink} 1s ease-in-out infinite;
`;

/* ── RIGHT Panel ── */
const RightPanel = styled.div`
  background:#ffffff;border-left:1px solid #e2e8f0;
  display:flex;flex-direction:column;overflow:hidden;min-height:0;
  @media(max-width:900px){overflow:visible;min-height:600px;}
`;
const RTabs = styled.div`display:flex;flex-shrink:0;border-bottom:1.5px solid #f1f5f9;background:#fff;`;
const RTab = styled.button`
  flex:1;padding:.65rem 0;font-size:.65rem;font-weight:700;text-transform:uppercase;letter-spacing:.07em;
  border:none;background:transparent;
  color:${p=>p.$a?'#4f46e5':'#94a3b8'};
  border-bottom:2px solid ${p=>p.$a?'#6366f1':'transparent'};cursor:pointer;transition:all .12s;
  display:flex;align-items:center;justify-content:center;gap:.28rem;
  &:hover{color:#4f46e5;}
`;
const RTabBody = styled.div`
  flex:1;overflow-y:auto;display:flex;flex-direction:column;
  &::-webkit-scrollbar{width:3px;}
  &::-webkit-scrollbar-thumb{background:#e2e8f0;border-radius:3px;}
`;
const RSection = styled.div`padding:.8rem .9rem;border-bottom:1px solid #f1f5f9;`;
const RSHead = styled.div`
  font-size:.6rem;font-weight:800;text-transform:uppercase;letter-spacing:.1em;
  color:#94a3b8;margin-bottom:.6rem;display:flex;align-items:center;gap:.3rem;
  svg{color:${p=>p.$accent||'#6366f1'};font-size:.7rem;}
`;

const BlueprintCard = styled.div`
  background:linear-gradient(135deg,#f5f3ff,#eff6ff);
  border:1.5px solid #c7d2fe;border-radius:12px;padding:.8rem;margin-bottom:.55rem;
`;
const BPTitle = styled.div`
  font-family:'Space Grotesk',sans-serif;font-size:.8rem;font-weight:800;color:#4f46e5;margin-bottom:.6rem;
  display:flex;align-items:center;gap:.35rem;
`;
const BPGrid = styled.div`display:grid;grid-template-columns:1fr 1fr;gap:.35rem;`;
const BPItem = styled.div`background:#fff;border-radius:8px;padding:.48rem .58rem;border:1px solid #e0e7ff;`;
const BPLabel = styled.div`font-size:.58rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#94a3b8;margin-bottom:.2rem;`;
const BPVal = styled.div`font-size:.84rem;font-weight:700;color:${p=>p.$c||'#0f172a'};font-family:'Space Grotesk',sans-serif;`;
const BPRationale = styled.div`
  margin-top:.5rem;padding:.5rem .6rem;border-radius:8px;background:#fff;border:1px solid #e0e7ff;
  font-size:.7rem;color:#475569;line-height:1.55;
`;
const RRBadge = styled.div`
  display:inline-flex;align-items:center;gap:.3rem;padding:.2rem .55rem;
  border-radius:6px;font-size:.7rem;font-weight:700;
  background:${p=>p.$rr>=2?'#f0fdf4':'#fffbeb'};
  color:${p=>p.$rr>=2?'#16a34a':'#d97706'};
  border:1px solid ${p=>p.$rr>=2?'#bbf7d0':'#fde68a'};
`;

const AlertPill = styled(motion.div)`
  display:flex;align-items:flex-start;gap:.45rem;
  padding:.55rem .65rem;border-radius:9px;margin-bottom:.35rem;font-size:.72rem;
  background:${p=>p.$type==='warn'?'#fffbeb':p.$type==='bull'?'#f0fdf4':'#fef2f2'};
  border:1px solid ${p=>p.$type==='warn'?'#fde68a':p.$type==='bull'?'#bbf7d0':'#fecaca'};
  color:${p=>p.$type==='warn'?'#92400e':p.$type==='bull'?'#166534':'#991b1b'};
  line-height:1.5;animation:${slideUp} .3s ease;
`;
const AlertIcon = styled.div`color:${p=>p.$type==='warn'?'#f59e0b':p.$type==='bull'?'#16a34a':'#dc2626'};font-size:.75rem;margin-top:.1rem;flex-shrink:0;`;

const SideToggle = styled.div`display:grid;grid-template-columns:1fr 1fr;border-radius:10px;overflow:hidden;border:1.5px solid #e2e8f0;margin-bottom:.7rem;`;
const SideBtn = styled.button`
  padding:.55rem;border:none;font-weight:800;font-size:.8rem;cursor:pointer;transition:all .12s;
  background:${p=>!p.$a?'#f8fafc':p.$s==='buy'?'#16a34a':'#dc2626'};
  color:${p=>p.$a?'#fff':p.$s==='buy'?'#16a34a':'#dc2626'};
`;
const OTypeRow = styled.div`display:flex;gap:.35rem;margin-bottom:.65rem;`;
const OTypeBtn = styled.button`
  padding:.26rem .7rem;border-radius:7px;font-size:.68rem;font-weight:700;
  border:1.5px solid ${p=>p.$a?'#334155':'#e2e8f0'};
  background:${p=>p.$a?'#f1f5f9':'transparent'};
  color:${p=>p.$a?'#0f172a':'#94a3b8'};cursor:pointer;transition:all .12s;
`;
const FLabel = styled.div`font-size:.62rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#94a3b8;margin-bottom:.3rem;`;
const NInput = styled.input`
  width:100%;background:#f8fafc;border:1.5px solid #e2e8f0;
  border-radius:8px;padding:.52rem .7rem;font-size:.88rem;font-weight:600;color:#0f172a;
  outline:none;margin-bottom:.55rem;
  &:focus{border-color:#6366f1;background:#fff;box-shadow:0 0 0 3px rgba(99,102,241,0.08);}
  &::placeholder{color:#cbd5e1;}
`;
const AISizeHint = styled.div`
  background:#f5f3ff;border:1.5px solid #ddd6fe;border-radius:9px;
  padding:.5rem .7rem;margin-bottom:.55rem;font-size:.7rem;color:#4c1d95;
  line-height:1.55;
  strong{color:#7c3aed;}
`;
const OSummary = styled.div`background:#f8fafc;border-radius:9px;padding:.65rem .8rem;margin-bottom:.7rem;border:1px solid #e2e8f0;`;
const ORow = styled.div`display:flex;justify-content:space-between;font-size:.72rem;color:#94a3b8;padding:.18rem 0;span:last-child{color:#1e293b;font-weight:600;}`;
const OrderBtn = styled.button`
  width:100%;padding:.72rem;border-radius:10px;border:none;font-weight:800;font-size:.88rem;
  cursor:pointer;transition:all .15s;
  background:${p=>p.$s==='buy'?'linear-gradient(135deg,#16a34a,#15803d)':'linear-gradient(135deg,#dc2626,#b91c1c)'};
  color:#fff;box-shadow:${p=>p.$s==='buy'?'0 4px 14px rgba(22,163,74,0.28)':'0 4px 14px rgba(220,38,38,0.28)'};
  &:hover{transform:translateY(-1px);filter:brightness(1.05);}
  &:disabled{opacity:.4;cursor:not-allowed;transform:none;filter:none;}
`;
const BalBadge = styled.div`font-size:.67rem;color:#94a3b8;margin-top:.45rem;text-align:center;span{color:#16a34a;font-weight:700;}`;

const PosCard = styled.div`
  background:#f8fafc;border:1.5px solid #e2e8f0;
  border-radius:10px;padding:.7rem .8rem;margin-bottom:.45rem;
`;
const PosHead = styled.div`display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:.3rem;`;
const PosSym2 = styled.div`font-family:'Space Grotesk',sans-serif;font-weight:800;font-size:.88rem;color:#0f172a;`;
const PnlBadge = styled.div`font-size:.75rem;font-weight:700;color:${p=>p.$pos?'#16a34a':'#dc2626'};`;
const PosStats = styled.div`display:grid;grid-template-columns:repeat(3,1fr);gap:.2rem;`;
const PS = styled.div`font-size:.6rem;color:#94a3b8;span{display:block;color:#475569;font-weight:600;margin-top:1px;font-size:.68rem;}`;
const CloseBtn = styled.button`
  width:100%;margin-top:.48rem;padding:.3rem;border-radius:7px;
  border:1.5px solid #fecaca;background:#fef2f2;
  color:#dc2626;font-size:.67rem;font-weight:700;cursor:pointer;
  &:hover{background:#fee2e2;}
`;

const AIChat = styled.div`display:flex;flex-direction:column;flex:1;min-height:0;`;
const AIMsgs = styled.div`
  flex:1;overflow-y:auto;padding:.7rem .85rem;display:flex;flex-direction:column;gap:.5rem;
  &::-webkit-scrollbar{width:3px;}
  &::-webkit-scrollbar-thumb{background:#e2e8f0;border-radius:3px;}
`;
const AIMsgB = styled.div`
  padding:.7rem .8rem;border-radius:12px;font-size:.78rem;line-height:1.65;
  color:${p=>p.$ai?'#1e293b':'#166534'};
  background:${p=>p.$ai?'#f5f3ff':'#f0fdf4'};
  border:1px solid ${p=>p.$ai?'#ddd6fe':'#bbf7d0'};
  white-space:pre-line;
`;
const AIMsgLabel = styled.div`
  font-size:.58rem;font-weight:800;text-transform:uppercase;letter-spacing:.08em;
  margin-bottom:.3rem;color:${p=>p.$ai?'#6366f1':'#16a34a'};
  display:flex;align-items:center;gap:.28rem;
`;
const Chips = styled.div`padding:.5rem .85rem;display:flex;flex-wrap:wrap;gap:.3rem;border-top:1px solid #f1f5f9;`;
const Chip = styled.button`
  padding:.28rem .65rem;border-radius:999px;font-size:.65rem;font-weight:600;
  border:1.5px solid #ddd6fe;background:#f5f3ff;color:#6366f1;
  cursor:pointer;transition:all .1s;
  &:hover{background:#ede9fe;border-color:#a5b4fc;}
  &:disabled{opacity:.4;cursor:not-allowed;}
`;
const AIInputRow = styled.div`
  display:flex;gap:.4rem;padding:.65rem .85rem;border-top:1px solid #f1f5f9;flex-shrink:0;
`;
const AICInput = styled.input`
  flex:1;background:#f8fafc;border:1.5px solid #e2e8f0;
  border-radius:9px;padding:.5rem .7rem;font-size:.76rem;color:#0f172a;outline:none;
  &:focus{border-color:#6366f1;background:#fff;box-shadow:0 0 0 3px rgba(99,102,241,0.08);}
  &::placeholder{color:#cbd5e1;}
`;
const AISendBtn = styled.button`
  padding:.5rem .65rem;border-radius:9px;border:none;background:#4f46e5;color:#fff;
  cursor:pointer;font-size:.78rem;transition:all .12s;
  &:hover{background:#4338ca;}
  &:disabled{opacity:.4;cursor:not-allowed;}
`;
const Spinner2 = styled(FaSpinner)`animation:${spin} 1s linear infinite;`;

const TRow = styled.div`
  display:flex;align-items:center;gap:.5rem;padding:.58rem .9rem;
  border-bottom:1px solid #f1f5f9;
`;
const TSide = styled.div`font-size:.62rem;font-weight:800;text-transform:uppercase;letter-spacing:.06em;color:${p=>p.$b?'#16a34a':'#dc2626'};min-width:28px;`;
const TInfo = styled.div`flex:1;`;
const TSym = styled.div`font-size:.76rem;font-weight:700;color:#1e293b;`;
const TMeta = styled.div`font-size:.6rem;color:#94a3b8;`;
const TTotal = styled.div`font-size:.72rem;font-weight:600;color:#475569;`;
const TAINote = styled.div`font-size:.65rem;color:#6366f1;margin-top:.15rem;font-style:italic;`;

const Notif = styled(motion.div)`
  position:fixed;bottom:1.5rem;left:50%;transform:translateX(-50%);
  background:#fff;border:1.5px solid ${p=>p.$t==='success'?'#bbf7d0':'#fecaca'};
  color:${p=>p.$t==='success'?'#166534':'#991b1b'};
  padding:.6rem 1.25rem;border-radius:12px;font-size:.8rem;font-weight:700;
  box-shadow:0 8px 32px rgba(15,23,42,0.14);z-index:9999;white-space:nowrap;
  display:flex;align-items:center;gap:.5rem;
`;

const NoItems = styled.div`text-align:center;padding:2.5rem 1rem;color:#cbd5e1;font-size:.8rem;`;

const AI_PROMPTS = [
  'Explain the current signal',
  'What patterns do you see?',
  'Suggest a stop-loss level',
  'Is this overbought or oversold?',
  'Walk me through the blueprint',
  'What would invalidate this?',
];

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────── */
export default function ChartSimPage() {
  const { user } = useAuth();

  const [sym, setSym] = useState('AAPL');
  const stock = useMemo(() => stocks.find(s => s.symbol === sym) || stocks[0], [sym]);

  const [livePrice, setLivePrice] = useState(stock.price);
  const livePriceRef = useRef(stock.price);

  const [tf, setTf] = useState('3M');
  const [chartType, setChartType] = useState('candle');
  const [inds, setInds] = useState({ sma20: true, sma50: true, bb: false, rsi: true, volume: true });

  const [rTab, setRTab] = useState('ai');
  const [side, setSide] = useState('buy');
  const [oType, setOType] = useState('market');
  const [qty, setQty] = useState('');
  const [limitPx, setLimitPx] = useState('');

  const [balance, setBalance] = useState(25000);
  const [positions, setPositions] = useState({});
  const [trades, setTrades] = useState([]);

  const [aiMsgs, setAiMsgs] = useState([]);
  const [aiInput, setAiInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiAutoLoading, setAiAutoLoading] = useState(false);

  const [alerts, setAlerts] = useState([]);
  const [commentary, setCommentary] = useState('');
  const [commentaryIdx, setCommentaryIdx] = useState(0);
  const [notif, setNotif] = useState(null);
  const [wSearch, setWSearch] = useState('');

  const aiEndRef = useRef(null);
  const alertsRef = useRef([]);

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

  const aiSignal = useMemo(() => computeAISignal(displayData, livePrice), [displayData, livePrice]);
  const patterns = useMemo(() => detectPatterns(displayData), [displayData]);
  const levels = useMemo(() => findLevels(displayData, livePrice), [displayData, livePrice]);
  const blueprint = useMemo(() => aiSignal ? buildBlueprint(aiSignal, livePrice, levels, stock, displayData) : null, [aiSignal, livePrice, levels, stock, displayData]);
  const fearGreed = useMemo(() => computeFearGreed(displayData, livePrice), [displayData, livePrice]);

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

  useEffect(() => {
    setAiMsgs([]);
    setAlerts([]);
    alertsRef.current = [];

    const timer = setTimeout(async () => {
      setAiAutoLoading(true);
      const last = chartData[chartData.length - 1];
      const sig = computeAISignal(chartData, stock.price);
      const pats = detectPatterns(chartData);
      const ctx = `Chart analysis request for ${stock.symbol} (${stock.name}). Price: $${stock.price}. RSI: ${last?.rsi ?? 'N/A'}. SMA20: ${last?.sma20 ?? 'N/A'}. SMA50: ${last?.sma50 ?? 'N/A'}. Signal: ${sig?.signal} at ${sig?.confidence}% confidence. Patterns: ${pats.map(p => p.name).join(', ') || 'None'}. ${stock.description}`;
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
      newAlerts.push({ id: 'rsi-overbought', type: 'bear', icon: FaExclamationTriangle, text: `RSI at ${rsi} — ${sym} is overbought. Consider tighter stop.` });
      alertsRef.current.push('rsi-overbought');
    }
    if (sma20 && Math.abs(livePrice - sma20) / sma20 < 0.005 && !alertsRef.current.includes('sma20-touch')) {
      newAlerts.push({ id: 'sma20-touch', type: 'warn', icon: FaRegBell, text: `${sym} is testing SMA20 ($${fmt(sma20)}) — key decision level.` });
      alertsRef.current.push('sma20-touch');
    }
    if (newAlerts.length) setAlerts(prev => [...newAlerts, ...prev].slice(0, 6));
  }, [displayData, livePrice, sym]);

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

  useEffect(() => { aiEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [aiMsgs]);

  const portfolioValue = useMemo(() => {
    const m = Object.fromEntries(stocks.map(s => [s.symbol, s.price]));
    return balance + Object.entries(positions).reduce((s, [k, v]) => s + v.shares * (k === sym ? livePrice : (m[k] || 0)), 0);
  }, [positions, balance, sym, livePrice]);

  const totalPnl = useMemo(() => {
    const m = Object.fromEntries(stocks.map(s => [s.symbol, s.price]));
    return Object.entries(positions).reduce((s, [k, v]) => s + v.shares * ((k === sym ? livePrice : (m[k] || 0)) - v.avgCost), 0);
  }, [positions, sym, livePrice]);

  const yDomain = useMemo(() => {
    if (!displayData.length) return ['auto', 'auto'];
    const prices = displayData.flatMap(d => [d.high ?? d.close, d.low ?? d.close]);
    const mn = Math.min(...prices), mx = Math.max(...prices);
    const pad = (mx - mn) * 0.1;
    return [+(mn - pad).toFixed(2), +(mx + pad).toFixed(2)];
  }, [displayData]);

  const showNotif = (text, type = 'success') => { setNotif({ text, type }); setTimeout(() => setNotif(null), 3000); };
  const toggleInd = k => setInds(p => ({ ...p, [k]: !p[k] }));

  const aiSuggestedQty = useMemo(() => {
    if (!blueprint || !livePrice) return null;
    const riskPer = Math.abs(livePrice - blueprint.stop);
    if (!riskPer) return null;
    return Math.max(1, Math.floor(balance * 0.02 / riskPer));
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
      ? `AI aligned — ${aiSignal.signal} signal at ${aiSignal.confidence}%`
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

  const ChartTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0]?.payload;
    if (!d) return null;
    return (
      <div style={{ background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '.6rem .85rem', fontSize: '.7rem', color: '#475569', minWidth: 165, boxShadow: '0 8px 24px rgba(15,23,42,0.1)' }}>
        <div style={{ fontWeight: 800, color: '#0f172a', marginBottom: 5, fontFamily: 'Space Grotesk' }}>{d.date}</div>
        <div>O: <b style={{ color: '#1e293b' }}>${fmt(d.open)}</b>  H: <b style={{ color: '#16a34a' }}>${fmt(d.high)}</b></div>
        <div>L: <b style={{ color: '#dc2626' }}>${fmt(d.low)}</b>  C: <b style={{ color: d.bullish ? '#16a34a' : '#dc2626' }}>${fmt(d.close)}</b></div>
        {d.sma20 && <div style={{ marginTop: 4, borderTop: '1px solid #f1f5f9', paddingTop: 4 }}>SMA20: <b style={{ color: '#d97706' }}>${fmt(d.sma20)}</b>  SMA50: <b style={{ color: '#2563eb' }}>${fmt(d.sma50)}</b></div>}
        {d.rsi != null && <div>RSI: <b style={{ color: d.rsi > 70 ? '#dc2626' : d.rsi < 30 ? '#16a34a' : '#475569' }}>{d.rsi}</b></div>}
      </div>
    );
  };

  const priceChangePct = ((livePrice - (stock.price - stock.change)) / (stock.price - stock.change) * 100);
  const priceChangeDollar = livePrice - (stock.price - stock.change);
  const orderCost = (parseInt(qty) || 0) * (oType === 'market' ? livePrice : parseFloat(limitPx) || livePrice);
  const curPos = positions[sym];
  const fg = fearGreed;
  const fgLabel = fg >= 75 ? 'Extreme Greed' : fg >= 55 ? 'Greed' : fg >= 45 ? 'Neutral' : fg >= 25 ? 'Fear' : 'Extreme Fear';
  const fgColor = fg >= 60 ? '#16a34a' : fg >= 40 ? '#d97706' : '#dc2626';
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
        <Stat>Portfolio <span style={{ color: totalPnl >= 0 ? '#16a34a' : '#dc2626' }}>${portfolioValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span></Stat>
        <Stat>P&L <span style={{ color: totalPnl >= 0 ? '#16a34a' : '#dc2626' }}>{totalPnl >= 0 ? '+' : ''}${Math.abs(totalPnl).toFixed(2)}</span></Stat>
        <VDiv />
        <LiveDot title="Live simulation" />
      </Topbar>

      <Body>
        {/* ── LEFT: AI Intelligence ── */}
        <LeftPanel>
          <PanelSection>
            <PSHead $accent="#6366f1"><FaBrain /> AI Signal</PSHead>
            {aiSignal && (
              <SignalCard $bg={aiSignal.bg} $color={aiSignal.color} $glow={aiSignal.signal !== 'HOLD'}>
                <SignalMain>
                  <SignalText $color={aiSignal.color}>{aiSignal.signal}</SignalText>
                  <div>
                    <div style={{ fontSize: '.68rem', fontWeight: 700, color: aiSignal.color }}>{aiSignal.confidence}% confidence</div>
                    <div style={{ fontSize: '.6rem', color: '#94a3b8' }}>{aiSignal.bull} bull / {aiSignal.bear} bear</div>
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

          <PanelSection>
            <PSHead $accent="#d97706"><FaFire /> Market Psychology</PSHead>
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

          <PanelSection>
            <PSHead $accent="#16a34a"><FaStar /> Patterns Detected</PSHead>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {patterns.length ? patterns.map((p, i) => (
                <PatternChip key={i} $type={p.type} title={p.desc}>
                  {p.emoji} {p.name}
                </PatternChip>
              )) : <div style={{ fontSize: '.68rem', color: '#cbd5e1' }}>No strong patterns</div>}
            </div>
          </PanelSection>

          <PanelSection>
            <PSHead $accent="#dc2626"><FaBullseye /> Key Levels</PSHead>
            {levels.resistance.map(r => <LevelRow key={r}><LevelLabel>Resistance</LevelLabel><LevelVal $res>${fmt(r)}</LevelVal></LevelRow>)}
            <LevelRow><LevelLabel>Live Price</LevelLabel><span style={{ fontSize: '.72rem', fontWeight: 700, color: '#0f172a' }}>${fmt(livePrice)}</span></LevelRow>
            {levels.support.map(s => <LevelRow key={s}><LevelLabel>Support</LevelLabel><LevelVal>${fmt(s)}</LevelVal></LevelRow>)}
            {blueprint && (
              <>
                <LevelRow><LevelLabel>AI Target</LevelLabel><LevelVal>${fmt(blueprint.target1)}</LevelVal></LevelRow>
                <LevelRow><LevelLabel>AI Stop</LevelLabel><LevelVal $res>${fmt(blueprint.stop)}</LevelVal></LevelRow>
              </>
            )}
          </PanelSection>

          <PSHead $accent="#6366f1" style={{ padding: '.7rem .9rem .1rem', flexShrink: 0 }}><FaChartLine /> Watchlist</PSHead>
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
            <ChartTypeBtn $a={chartType === 'candle'} onClick={() => setChartType('candle')}><FaChartBar style={{ fontSize: '.8rem' }} /></ChartTypeBtn>
            <ChartTypeBtn $a={chartType === 'line'} onClick={() => setChartType('line')}><FaChartLine style={{ fontSize: '.8rem' }} /></ChartTypeBtn>
            <Sep />
            {[{ k: 'sma20', l: 'SMA20', c: '#d97706' }, { k: 'sma50', l: 'SMA50', c: '#2563eb' }, { k: 'bb', l: 'BB', c: '#7c3aed' }, { k: 'rsi', l: 'RSI', c: '#059669' }, { k: 'volume', l: 'Vol', c: '#64748b' }].map(({ k, l, c }) => (
              <IndToggle key={k} $a={inds[k]} $c={c} onClick={() => toggleInd(k)}>{l}</IndToggle>
            ))}
          </ChartBar>

          <ChartMain>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={displayData} margin={{ top: 10, right: 62, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="pgUp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#16a34a" stopOpacity={0.12} />
                    <stop offset="100%" stopColor="#16a34a" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="pgDown" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#dc2626" stopOpacity={0.1} />
                    <stop offset="100%" stopColor="#dc2626" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(15,23,42,0.05)" vertical={false} />
                <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 9 }} tickLine={false} axisLine={{ stroke: '#e2e8f0' }} interval={Math.floor(displayData.length / 6)} />
                <YAxis domain={yDomain} orientation="right" tick={{ fill: '#94a3b8', fontSize: 9 }} tickLine={false} axisLine={false} tickFormatter={v => `$${v.toFixed(0)}`} width={62} />
                <Tooltip content={<ChartTooltip />} />

                {inds.bb && <>
                  <Area type="monotone" dataKey="bbUpper" stroke="#7c3aed" strokeWidth={0.8} fill="rgba(124,58,237,0.04)" dot={false} isAnimationActive={false} connectNulls />
                  <Area type="monotone" dataKey="bbLower" stroke="#7c3aed" strokeWidth={0.8} fill="transparent" dot={false} isAnimationActive={false} connectNulls />
                </>}

                {chartType === 'line'
                  ? <Area type="monotone" dataKey="close" stroke={livePrice >= (displayData[0]?.close || livePrice) ? '#16a34a' : '#dc2626'} strokeWidth={2} fill={livePrice >= (displayData[0]?.close || livePrice) ? 'url(#pgUp)' : 'url(#pgDown)'} dot={false} isAnimationActive={false} />
                  : <Bar dataKey="wickRange" shape={<CandlestickShape />} isAnimationActive={false} maxBarSize={16}>
                    {displayData.map((d, i) => <Cell key={i} fill={d.bullish ? '#16a34a' : '#dc2626'} />)}
                  </Bar>
                }

                {inds.sma20 && <Line type="monotone" dataKey="sma20" stroke="#d97706" strokeWidth={1.5} dot={false} isAnimationActive={false} connectNulls />}
                {inds.sma50 && <Line type="monotone" dataKey="sma50" stroke="#2563eb" strokeWidth={1.5} dot={false} isAnimationActive={false} connectNulls />}

                {levels.resistance.map(r => (
                  <ReferenceLine key={`res-${r}`} y={r} stroke="rgba(220,38,38,0.5)" strokeDasharray="5 4" label={{ value: `R $${r}`, position: 'right', fill: '#dc2626', fontSize: 8, dx: 4 }} />
                ))}
                {levels.support.map(s => (
                  <ReferenceLine key={`sup-${s}`} y={s} stroke="rgba(22,163,74,0.5)" strokeDasharray="5 4" label={{ value: `S $${s}`, position: 'right', fill: '#16a34a', fontSize: 8, dx: 4 }} />
                ))}
                {blueprint && (
                  <>
                    <ReferenceLine y={blueprint.target1} stroke="rgba(99,102,241,0.65)" strokeDasharray="4 3" label={{ value: `T $${blueprint.target1}`, position: 'right', fill: '#6366f1', fontSize: 8, dx: 4 }} />
                    <ReferenceLine y={blueprint.stop} stroke="rgba(220,38,38,0.65)" strokeWidth={1.5} label={{ value: `SL $${blueprint.stop}`, position: 'right', fill: '#dc2626', fontSize: 8, dx: 4 }} />
                  </>
                )}
                <ReferenceLine y={livePrice} stroke="rgba(15,23,42,0.2)" strokeDasharray="4 4" label={{ value: `$${fmt(livePrice)}`, position: 'right', fill: '#475569', fontSize: 9, dx: 4 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartMain>

          {inds.volume && (
            <SubPane $h="64px">
              <PaneLabel>Volume</PaneLabel>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={displayData} margin={{ top: 2, right: 62, left: 0, bottom: 0 }}>
                  <XAxis dataKey="date" hide />
                  <YAxis orientation="right" tick={{ fill: '#cbd5e1', fontSize: 8 }} tickLine={false} axisLine={false} width={62} tickFormatter={v => (v / 1e6).toFixed(0) + 'M'} />
                  <Bar dataKey="volume" isAnimationActive={false} maxBarSize={12}>
                    {displayData.map((d, i) => <Cell key={i} fill={d.bullish ? 'rgba(22,163,74,0.45)' : 'rgba(220,38,38,0.4)'} />)}
                  </Bar>
                </ComposedChart>
              </ResponsiveContainer>
            </SubPane>
          )}

          {inds.rsi && (
            <SubPane $h="74px">
              <PaneLabel>RSI (14)</PaneLabel>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={displayData} margin={{ top: 2, right: 62, left: 0, bottom: 0 }}>
                  <XAxis dataKey="date" hide />
                  <YAxis domain={[0, 100]} orientation="right" tick={{ fill: '#cbd5e1', fontSize: 8 }} tickLine={false} axisLine={false} width={62} ticks={[30, 50, 70]} />
                  <ReferenceLine y={70} stroke="rgba(220,38,38,0.3)" strokeDasharray="3 3" />
                  <ReferenceLine y={30} stroke="rgba(22,163,74,0.3)" strokeDasharray="3 3" />
                  <Line type="monotone" dataKey="rsi" stroke="#059669" strokeWidth={1.8} dot={false} isAnimationActive={false} connectNulls />
                </ComposedChart>
              </ResponsiveContainer>
            </SubPane>
          )}

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
            {rTab === 'ai' && (
              <>
                {alerts.length > 0 && (
                  <RSection>
                    <RSHead $accent="#d97706"><FaExclamationTriangle /> Live Alerts</RSHead>
                    <AnimatePresence>
                      {alerts.slice(0, 3).map(a => (
                        <AlertPill key={a.id} $type={a.type} initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}>
                          <AlertIcon $type={a.type}><a.icon /></AlertIcon>
                          <span>{a.text}</span>
                        </AlertPill>
                      ))}
                    </AnimatePresence>
                  </RSection>
                )}

                {blueprint && (
                  <RSection>
                    <RSHead $accent="#6366f1"><FaLightbulb /> Trade Blueprint</RSHead>
                    <BlueprintCard>
                      <BPTitle>
                        <FaBullseye style={{ fontSize: '.75rem' }} />
                        {aiSignal?.signal} Setup — {sym}
                        <RRBadge $rr={blueprint.rr} style={{ marginLeft: 'auto', fontSize: '.62rem' }}>R/R {blueprint.rr}:1</RRBadge>
                      </BPTitle>
                      <BPGrid>
                        <BPItem><BPLabel>Entry</BPLabel><BPVal>${fmt(blueprint.entry)}</BPVal></BPItem>
                        <BPItem><BPLabel>Stop Loss</BPLabel><BPVal $c="#dc2626">${fmt(blueprint.stop)}</BPVal></BPItem>
                        <BPItem><BPLabel>Target 1</BPLabel><BPVal $c="#16a34a">${fmt(blueprint.target1)}</BPVal></BPItem>
                        <BPItem><BPLabel>Target 2</BPLabel><BPVal $c="#16a34a">${fmt(blueprint.target2)}</BPVal></BPItem>
                      </BPGrid>
                      <BPItem style={{ marginTop: '.35rem' }}><BPLabel>Time Horizon</BPLabel><BPVal style={{ fontSize: '.75rem', color: '#475569' }}>{blueprint.timeHorizon}</BPVal></BPItem>
                      <BPRationale>{blueprint.rationale}</BPRationale>
                    </BlueprintCard>
                  </RSection>
                )}

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

                {aiSuggestedQty && blueprint && (
                  <AISizeHint>
                    <strong>AI Size: {aiSuggestedQty} shares</strong> (2% portfolio risk)<br />
                    Stop ${fmt(blueprint.stop)} → risk/share ${fmt(Math.abs(livePrice - blueprint.stop))}
                    <br />
                    <span style={{ color: '#7c3aed', cursor: 'pointer', fontWeight: 700 }} onClick={() => setQty(String(aiSuggestedQty))}>
                      Apply suggestion →
                    </span>
                  </AISizeHint>
                )}

                {curPos && (
                  <div style={{ background: '#f5f3ff', border: '1.5px solid #ddd6fe', borderRadius: 8, padding: '.48rem .68rem', marginBottom: '.55rem', fontSize: '.7rem', color: '#4c1d95', lineHeight: 1.5 }}>
                    <strong style={{ color: '#7c3aed' }}>Open: </strong>{curPos.shares} shares @ ${fmt(curPos.avgCost)} —
                    P&L: <strong style={{ color: curPos.shares * (livePrice - curPos.avgCost) >= 0 ? '#16a34a' : '#dc2626' }}>
                      {fmtDollar(curPos.shares * (livePrice - curPos.avgCost))}
                    </strong>
                  </div>
                )}

                <OSummary>
                  <ORow><span>Exec Price</span><span>{oType === 'market' ? `$${fmt(livePrice)} (live)` : `$${parseFloat(limitPx || livePrice).toFixed(2)}`}</span></ORow>
                  <ORow><span>Est. Total</span><span style={{ color: side === 'buy' ? '#dc2626' : '#16a34a' }}>${qty ? orderCost.toFixed(2) : '0.00'}</span></ORow>
                  {blueprint && <ORow><span>AI Signal</span><span style={{ color: aiSignal?.color }}>{aiSignal?.signal} ({aiSignal?.confidence}%)</span></ORow>}
                </OSummary>

                <OrderBtn $s={side} disabled={!qty || parseInt(qty) <= 0} onClick={submitOrder}>
                  {side === 'buy' ? '▲ Place Buy Order' : '▼ Place Sell Order'}
                </OrderBtn>
                <BalBadge>Cash: <span>${balance.toLocaleString('en-US', { maximumFractionDigits: 2 })}</span></BalBadge>

                <div style={{ marginTop: '.85rem', borderTop: '1px solid #f1f5f9', paddingTop: '.65rem' }}>
                  {marketIndices.map(idx => (
                    <div key={idx.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '.2rem 0', fontSize: '.67rem' }}>
                      <span style={{ color: '#94a3b8' }}>{idx.name}</span>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ color: '#1e293b', fontWeight: 600 }}>{idx.value.toLocaleString()}</div>
                        <div style={{ color: idx.changePercent >= 0 ? '#16a34a' : '#dc2626', fontSize: '.6rem' }}>{idx.changePercent >= 0 ? '+' : ''}{idx.changePercent.toFixed(2)}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </RSection>
            )}

            {rTab === 'pos' && (
              <>
                <RSection>
                  <RSHead $accent="#16a34a"><FaWallet /> Open Positions</RSHead>
                  {Object.keys(positions).length === 0 ? (
                    <NoItems>No open positions yet.</NoItems>
                  ) : Object.entries(positions).map(([s, pos]) => {
                    const st = stocks.find(x => x.symbol === s);
                    const cpx = s === sym ? livePrice : (st?.price || 0);
                    const pnl = pos.shares * (cpx - pos.avgCost);
                    return (
                      <PosCard key={s}>
                        <PosHead>
                          <div><PosSym2>{s}</PosSym2><div style={{ fontSize: '.6rem', color: '#94a3b8', marginTop: 2 }}>{st?.name}</div></div>
                          <div style={{ textAlign: 'right' }}>
                            <PnlBadge $pos={pnl >= 0}>{fmtDollar(pnl)}</PnlBadge>
                            <div style={{ fontSize: '.6rem', color: pnl >= 0 ? '#16a34a' : '#dc2626' }}>{((cpx - pos.avgCost) / pos.avgCost * 100).toFixed(2)}%</div>
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
                  {[{ l: 'Cash', v: `$${balance.toLocaleString('en-US', { maximumFractionDigits: 2 })}` }, { l: 'Portfolio Value', v: `$${portfolioValue.toLocaleString('en-US', { maximumFractionDigits: 2 })}` }, { l: 'Total P&L', v: fmtDollar(totalPnl), c: totalPnl >= 0 ? '#16a34a' : '#dc2626' }, { l: 'Trades', v: trades.length }].map(r => (
                    <div key={r.l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.72rem', padding: '.22rem 0', color: '#94a3b8', borderBottom: '1px solid #f8fafc' }}>
                      <span>{r.l}</span><span style={{ color: r.c || '#1e293b', fontWeight: 600 }}>{r.v}</span>
                    </div>
                  ))}
                </RSection>
              </>
            )}

            {rTab === 'hist' && (
              <>
                <div style={{ padding: '.6rem .9rem .3rem', fontSize: '.6rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.1em', color: '#94a3b8', borderBottom: '1px solid #f1f5f9' }}>
                  AI Trade Journal ({trades.length} trades)
                </div>
                {trades.length === 0 ? <NoItems>No trades yet.</NoItems> : trades.map(t => (
                  <TRow key={t.id}>
                    <TSide $b={t.side === 'buy'}>{t.side}</TSide>
                    <TInfo>
                      <TSym>{t.sym} <span style={{ fontSize: '.6rem', color: '#94a3b8' }}>{t.time}</span></TSym>
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
    return `**Pattern Analysis — ${stock.symbol}**\n\nPrice structure shows ${bull ? 'higher highs and higher lows — classic uptrend characteristics' : 'lower highs and lower lows — downtrend in progress'}.\n\nKey observation: ${rsi > 70 ? 'RSI divergence risk — price may be running ahead of fundamentals.' : rsi < 30 ? 'Capitulation signs — historically a high-probability reversal zone for quality assets.' : 'RSI in neutral zone — momentum could break either way.'}\n\nSupport: ${levels?.support?.map(s => `$${s}`).join(', ') || 'Computing…'}\nResistance: ${levels?.resistance?.map(r => `$${r}`).join(', ') || 'Computing…'}`;
  }
  if (ql.includes('stop') || ql.includes('stop-loss')) {
    return `**Stop-Loss Guidance — ${stock.symbol}**\n\nAI Blueprint Stop: **$${blueprint?.stop?.toFixed(2) || 'N/A'}**\n\nPlaced ${blueprint ? 'below nearest support, giving the trade room while limiting downside' : 'based on ATR volatility'}.\n\n**2% Rule:** Size so a stop hit = max 2% of capital. Stop is $${Math.abs(price - (blueprint?.stop || price * 0.95)).toFixed(2)} away → max ${Math.floor(25000 * 0.02 / Math.abs(price - (blueprint?.stop || price * 0.95)))} shares on $25k account.\n\nNever move a stop against your position.`;
  }
  if (ql.includes('blueprint') || ql.includes('setup') || ql.includes('trade')) {
    return blueprint ? `**Trade Blueprint — ${stock.symbol}**\n\nEntry: $${blueprint.entry} | Stop: $${blueprint.stop} | T1: $${blueprint.target1} | T2: $${blueprint.target2}\nRisk/Reward: **${blueprint.rr}:1** | Time: ${blueprint.timeHorizon}\n\n${blueprint.rationale}\n\n${blueprint.rr >= 2 ? '✅ R/R exceeds 2:1 — meets professional trading standards.' : '⚠️ R/R below 2:1 — consider tighter stop or higher target before entering.'}` : 'Blueprint is computing with current market data…';
  }
  if (ql.includes('overbought') || ql.includes('oversold') || ql.includes('rsi')) {
    return `**RSI Analysis — ${stock.symbol}**\n\nCurrent RSI: **${rsi ?? 'N/A'}**\n\n${rsi > 70 ? '🔴 **Overbought** — RSI above 70. New longs have poor risk/reward. Trail stops tighter to protect gains.' : rsi < 30 ? '🟢 **Oversold** — RSI below 30. Where short-sellers cover and value buyers step in. Confirm with volume.' : `⚪ **Neutral RSI (${rsi})** — Watch for move above 60 (bullish) or drop below 40 (bearish).`}`;
  }
  if (ql.includes('invalidat')) {
    return `**What Would Invalidate This Setup — ${stock.symbol}**\n\n${sig?.signal === 'BUY' ? `BUY thesis fails if:\n• Price breaks below $${(blueprint?.stop || price * 0.95).toFixed(2)} on volume\n• RSI drops back below 40\n• SMA20 crosses below SMA50 (Death Cross)\n• Sector-wide selling overwhelms strength` : sig?.signal === 'SELL' ? `SELL thesis fails if:\n• Price reclaims SMA20 ($${sma20 ?? 'N/A'}) on strong volume\n• RSI bounces from oversold\n• Positive earnings or macro catalyst` : `HOLD — watch for breakout:\n• Volume surge above recent average\n• RSI breaking convincingly above 60 or below 40`}`;
  }
  return `**${stock.symbol} Analysis**\n\nPrice: $${price.toFixed(2)} | Signal: **${sig?.signal}** (${sig?.confidence}% conf) | RSI: ${rsi ?? 'N/A'}\n\n${stock.description}\n\n${bull ? 'Bullish structure intact — price above key moving averages.' : 'Bearish pressure — price below key moving averages.'} ${pos ? `\n\nYour position: ${pos.shares} shares avg $${pos.avgCost} — P&L ${fmtDollar(pos.shares * (price - pos.avgCost))}.` : ''}\n\nAsk me about: the trade blueprint, stop-loss levels, what patterns I see, or what would invalidate the setup.`;
}
