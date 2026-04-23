import React, { useState, useEffect, useCallback } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaBolt, FaGem, FaSyncAlt, FaSearch,
  FaChevronDown, FaChevronUp, FaCheckCircle,
  FaArrowUp, FaArrowDown, FaMinus, FaExchangeAlt,
  FaFilter,
} from 'react-icons/fa';
import { api } from '../api';

/* ── animations ─────────────────────────────────────── */
const slide = keyframes`from{transform:translateX(0)}to{transform:translateX(-50%)}`;
const spinAnim = keyframes`to{transform:rotate(360deg)}`;
const pulse = keyframes`0%,100%{opacity:1}50%{opacity:.45}`;

/* ── page ───────────────────────────────────────────── */
const Page = styled.div`
  min-height:calc(100vh - 80px);
  background:#0b1120;
  font-family:'DM Sans',system-ui,sans-serif;
  -webkit-font-smoothing:antialiased;
`;

/* ── top bar ────────────────────────────────────────── */
const TopBar = styled.header`
  background:linear-gradient(155deg,#020617 0%,#0f172a 55%,#111827 100%);
  border-bottom:1px solid rgba(148,163,184,0.1);
  padding:1.5rem 1.5rem 0;
  position:relative;
  overflow:hidden;
  &::before{
    content:'';position:absolute;inset:0;
    background-image:linear-gradient(rgba(148,163,184,0.04) 1px,transparent 1px),
      linear-gradient(90deg,rgba(148,163,184,0.04) 1px,transparent 1px);
    background-size:48px 48px;
    mask-image:linear-gradient(180deg,black 40%,transparent 95%);
    pointer-events:none;
  }
`;
const TopInner = styled.div`
  max-width:1280px;margin:0 auto;position:relative;z-index:1;
  display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;
  gap:1rem;padding-bottom:1.25rem;
`;
const Kicker = styled.div`
  display:inline-flex;align-items:center;gap:0.4rem;
  font-size:0.7rem;font-weight:700;letter-spacing:0.12em;
  text-transform:uppercase;color:#86efac;margin-bottom:0.45rem;
  span{width:6px;height:6px;border-radius:50%;background:#22c55e;
    box-shadow:0 0 10px rgba(34,197,94,0.8);}
`;
const PageTitle = styled.h1`
  font-family:'Space Grotesk',sans-serif;
  font-size:clamp(1.5rem,3vw,2rem);font-weight:800;
  letter-spacing:-0.04em;color:#f8fafc;margin:0 0 0.2rem;line-height:1.1;
`;
const PageSub = styled.p`margin:0;font-size:0.88rem;color:#64748b;`;
const HeaderRight = styled.div`display:flex;align-items:center;gap:0.75rem;flex-wrap:wrap;`;
const RefreshBtn = styled(motion.button)`
  display:inline-flex;align-items:center;gap:0.4rem;
  border-radius:9px;border:1px solid rgba(255,255,255,0.12);
  background:rgba(255,255,255,0.07);color:#e2e8f0;
  font-size:0.82rem;font-weight:700;padding:0.55rem 0.95rem;cursor:pointer;
  transition:background 0.2s,border-color 0.2s;
  &:hover:not(:disabled){background:rgba(34,197,94,0.14);border-color:rgba(34,197,94,0.4);}
  &:disabled{opacity:0.45;cursor:not-allowed;}
  svg.spin{animation:${spinAnim} 0.85s linear infinite;}
`;
const MetaPill = styled.div`
  font-size:0.74rem;font-weight:600;color:#475569;
  padding:0.32rem 0.65rem;border-radius:999px;
  background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.08);
`;

/* ── ticker ─────────────────────────────────────────── */
const TickerBar = styled.div`
  background:rgba(2,6,23,0.9);border-top:1px solid rgba(51,65,85,0.5);
  padding:0.45rem 0;overflow:hidden;
`;
const TickerTrack = styled.div`
  display:flex;gap:2.5rem;width:max-content;
  animation:${slide} 38s linear infinite;
`;
const TItem = styled.div`display:flex;align-items:center;gap:0.4rem;font-size:0.8rem;white-space:nowrap;`;
const TSym = styled.span`font-family:'JetBrains Mono',monospace;color:#475569;font-weight:700;`;
const TVal = styled.span`font-family:'JetBrains Mono',monospace;font-weight:600;color:#cbd5e1;`;
const TChg = styled.span`
  font-family:'JetBrains Mono',monospace;font-size:0.72rem;
  color:${p=>p.$pos?'#4ade80':'#f87171'};
`;

/* ── shell ──────────────────────────────────────────── */
const Shell = styled.div`
  max-width:1280px;margin:0 auto;
  padding:1.5rem 1.25rem 3rem;
  display:flex;flex-direction:column;gap:1.25rem;
`;

const ErrorBanner = styled.div`
  background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.2);
  color:#fca5a5;border-radius:12px;padding:0.8rem 1rem;
  font-size:0.85rem;font-weight:600;
`;

/* ── analysis panel ─────────────────────────────────── */
const Panel = styled.section`
  background:linear-gradient(145deg,#060d1a 0%,#0a1628 60%,#0f172a 100%);
  border-radius:20px;border:1px solid rgba(148,163,184,0.12);
  box-shadow:0 20px 60px rgba(2,6,23,0.35);
  overflow:hidden;
`;

/* ── panel header ───────────────────────────────────── */
const PanelHead = styled.div`
  padding:1.4rem 1.6rem 1rem;
  display:flex;flex-wrap:wrap;align-items:flex-start;
  justify-content:space-between;gap:1rem;
  border-bottom:1px solid rgba(255,255,255,0.06);
`;
const PanelTitleBlock = styled.div`flex:1;min-width:0;`;
const Eyebrow = styled.div`
  font-size:0.68rem;font-weight:800;text-transform:uppercase;
  letter-spacing:0.13em;color:#86efac;margin-bottom:0.3rem;
`;
const PanelTitle = styled.h2`
  font-family:'Space Grotesk',sans-serif;
  font-size:clamp(1.1rem,2vw,1.4rem);font-weight:800;
  color:#f8fafc;letter-spacing:-0.03em;margin:0 0 0.2rem;
`;
const PanelSub = styled.p`margin:0;font-size:0.83rem;color:#475569;`;

/* ── controls bar ───────────────────────────────────── */
const ControlsBar = styled.div`
  padding:0.9rem 1.6rem;
  display:flex;flex-wrap:wrap;align-items:center;gap:0.75rem;
  border-bottom:1px solid rgba(255,255,255,0.06);
`;

const RunBtn = styled(motion.button)`
  display:inline-flex;align-items:center;gap:0.5rem;
  padding:0.72rem 1.4rem;border-radius:10px;
  font-size:0.9rem;font-weight:800;border:none;cursor:pointer;
  background:linear-gradient(135deg,#7c3aed 0%,#5b21b6 100%);
  color:#fff;box-shadow:0 5px 18px rgba(124,58,237,0.35);
  transition:box-shadow 0.2s;
  &:hover:not(:disabled){box-shadow:0 8px 24px rgba(124,58,237,0.5);}
  &:disabled{opacity:0.5;cursor:not-allowed;}
  svg.spin{animation:${spinAnim} 0.9s linear infinite;}
`;

const CtrlDivider = styled.div`width:1px;height:28px;background:rgba(255,255,255,0.08);flex-shrink:0;`;

const PrefsToggle = styled.button`
  display:inline-flex;align-items:center;gap:0.35rem;
  font-size:0.78rem;font-weight:700;color:#64748b;
  background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.09);
  border-radius:8px;padding:0.42rem 0.75rem;cursor:pointer;
  transition:color 0.18s,border-color 0.18s;
  &:hover{color:#c4b5fd;border-color:rgba(167,139,250,0.35);}
`;

const RunStatus = styled.div`
  display:inline-flex;align-items:center;gap:0.4rem;
  font-size:0.8rem;font-weight:600;
  color:${p=>p.$ok?'#86efac':p.$warn?'#fbbf24':'#f87171'};
`;

const ClearBtn = styled.button`
  margin-left:auto;background:none;border:none;
  color:#334155;font-size:0.78rem;font-weight:700;cursor:pointer;
  padding:0.3rem 0.5rem;border-radius:6px;
  transition:color 0.18s;
  &:hover{color:#94a3b8;}
`;

/* ── asset type + mode filters ──────────────────────── */
const FilterRow = styled.div`
  padding:0.75rem 1.6rem;
  display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem;
  border-bottom:1px solid rgba(255,255,255,0.06);
`;

const FilterLabel = styled.span`
  font-size:0.67rem;font-weight:800;text-transform:uppercase;
  letter-spacing:0.1em;color:#334155;margin-right:0.25rem;
  display:inline-flex;align-items:center;gap:0.3rem;
`;

const Chip = styled.button`
  padding:0.28rem 0.7rem;border-radius:999px;
  font-size:0.72rem;font-weight:700;cursor:pointer;
  transition:all 0.15s;
  border:1px solid ${p=>p.$active?p.$border||'rgba(167,139,250,0.55)':'rgba(255,255,255,0.1)'};
  background:${p=>p.$active?p.$activeBg||'rgba(167,139,250,0.14)':'transparent'};
  color:${p=>p.$active?p.$activeColor||'#c4b5fd':'#475569'};
  &:hover{color:${p=>p.$activeColor||'#c4b5fd'};border-color:${p=>p.$border||'rgba(167,139,250,0.4)'};}
`;

/* ── prefs panel ────────────────────────────────────── */
const PrefsWrap = styled(motion.div)`
  padding:1rem 1.6rem;
  border-bottom:1px solid rgba(255,255,255,0.06);
  background:rgba(255,255,255,0.025);
`;
const PrefsGrid = styled.div`
  display:grid;gap:1rem;grid-template-columns:1fr;
  @media(min-width:640px){grid-template-columns:repeat(2,1fr);}
  @media(min-width:1024px){grid-template-columns:repeat(3,1fr);}
`;
const PrefGroup = styled.div`display:flex;flex-direction:column;gap:0.35rem;`;
const PrefLabel = styled.label`
  font-size:0.65rem;font-weight:800;text-transform:uppercase;
  letter-spacing:0.1em;color:#334155;
`;
const PrefSelect = styled.select`
  appearance:none;background:rgba(255,255,255,0.06);
  border:1px solid rgba(255,255,255,0.1);border-radius:8px;
  color:#f1f5f9;font-size:0.86rem;font-weight:600;
  padding:0.5rem 0.75rem;cursor:pointer;font-family:inherit;
  transition:border-color 0.2s;
  &:focus{outline:none;border-color:rgba(167,139,250,0.45);}
  option{background:#0f172a;color:#f1f5f9;}
`;
const SectorsWrap = styled.div`display:flex;flex-wrap:wrap;gap:0.3rem;`;

/* ── market context bar ─────────────────────────────── */
const ContextBar = styled.div`
  padding:1rem 1.6rem;
  background:rgba(167,139,250,0.04);
  border-bottom:1px solid rgba(255,255,255,0.06);
`;
const ContextTheme = styled.span`
  font-family:'Space Grotesk',sans-serif;font-weight:800;
  font-size:0.95rem;color:#c4b5fd;margin-right:0.6rem;
`;
const ContextText = styled.span`font-size:0.86rem;color:#64748b;line-height:1.6;`;

/* ── sector breakdown strip ─────────────────────────── */
const SectorStrip = styled.div`
  padding:0.75rem 1.6rem;
  display:flex;flex-wrap:wrap;gap:0.5rem;
  border-bottom:1px solid rgba(255,255,255,0.06);
`;
const SectorBadge = styled.div`
  display:flex;align-items:baseline;gap:0.4rem;
  padding:0.3rem 0.7rem;border-radius:8px;
  background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);
`;
const SectorName = styled.span`font-size:0.7rem;font-weight:800;color:#94a3b8;`;
const SectorNote = styled.span`font-size:0.72rem;color:#475569;`;

/* ── cards grid ─────────────────────────────────────── */
const CardsGrid = styled.div`
  padding:1.25rem 1.4rem;
  display:grid;gap:1rem;
  grid-template-columns:1fr;
  @media(min-width:720px){grid-template-columns:repeat(2,1fr);}
  @media(min-width:1100px){grid-template-columns:repeat(3,1fr);}
`;

/* ── pick card ──────────────────────────────────────── */
const actionBorder = {
  'Strong Buy':'#22c55e','Buy':'#3b82f6','Watch':'#eab308','Reduce':'#f97316','Avoid':'#ef4444',
};
const actionBg = {
  'Strong Buy':'rgba(34,197,94,0.06)','Buy':'rgba(59,130,246,0.05)',
  'Watch':'rgba(234,179,8,0.04)','Reduce':'rgba(249,115,22,0.04)','Avoid':'rgba(239,68,68,0.05)',
};
const actionChip = {
  'Strong Buy':{bg:'rgba(34,197,94,0.16)',color:'#86efac'},
  'Buy':{bg:'rgba(59,130,246,0.15)',color:'#93c5fd'},
  'Watch':{bg:'rgba(234,179,8,0.13)',color:'#fde68a'},
  'Reduce':{bg:'rgba(249,115,22,0.13)',color:'#fed7aa'},
  'Avoid':{bg:'rgba(239,68,68,0.13)',color:'#fca5a5'},
};
const confColor = {High:'#86efac',Medium:'#fde68a',Low:'#94a3b8'};

const Card = styled(motion.div)`
  border-radius:16px;
  border:1px solid ${p=>actionBorder[p.$action]||'rgba(255,255,255,0.1)'}33;
  background:${p=>actionBg[p.$action]||'rgba(255,255,255,0.02)'};
  border-top:2px solid ${p=>actionBorder[p.$action]||'rgba(255,255,255,0.12)'};
  padding:1.1rem 1.15rem 1rem;
  display:flex;flex-direction:column;gap:0.85rem;
  transition:transform 0.25s,box-shadow 0.25s;
  &:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(0,0,0,0.25);}
`;

const CardTop = styled.div`
  display:flex;align-items:flex-start;justify-content:space-between;gap:0.5rem;
`;
const CardLeft = styled.div`flex:1;min-width:0;`;
const CompanyName = styled.div`
  font-family:'Space Grotesk',sans-serif;font-size:1rem;font-weight:800;
  color:#f8fafc;letter-spacing:-0.025em;line-height:1.2;
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
`;
const TickerRow = styled.div`
  display:flex;align-items:center;gap:0.5rem;margin-top:0.22rem;flex-wrap:wrap;
`;
const TickerBadge = styled.span`
  font-family:'JetBrains Mono',monospace;font-size:0.82rem;
  font-weight:700;color:#94a3b8;
`;

const TagRow = styled.div`display:flex;flex-wrap:wrap;gap:0.28rem;`;
const Tag = styled.span`
  display:inline-block;padding:0.17rem 0.42rem;border-radius:5px;
  font-size:0.6rem;font-weight:800;text-transform:uppercase;letter-spacing:0.05em;
  background:${p=>p.$bg||'rgba(255,255,255,0.07)'};
  color:${p=>p.$color||'#64748b'};
`;

const ActionBadge = styled.span`
  display:inline-flex;align-items:center;
  padding:0.3rem 0.65rem;border-radius:8px;
  font-size:0.7rem;font-weight:800;text-transform:uppercase;letter-spacing:0.06em;
  background:${p=>(actionChip[p.$a]||actionChip.Watch).bg};
  color:${p=>(actionChip[p.$a]||actionChip.Watch).color};
  flex-shrink:0;
`;

/* ── trend indicator ────────────────────────────────── */
const trendColor = {Uptrend:'#4ade80',Downtrend:'#f87171',Sideways:'#94a3b8',Reversal:'#fb923c'};
const TrendRow = styled.div`
  display:flex;align-items:center;gap:0.5rem;
  padding:0.45rem 0.6rem;border-radius:8px;
  background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);
`;
const TrendIcon = styled.span`color:${p=>trendColor[p.$t]||'#94a3b8'};font-size:0.8rem;display:flex;`;
const TrendLabel = styled.span`
  font-size:0.72rem;font-weight:800;color:${p=>trendColor[p.$t]||'#94a3b8'};
`;
const TrendStrength = styled.span`font-size:0.7rem;color:#334155;font-weight:600;margin-left:auto;`;
const ConfLabel = styled.span`
  font-size:0.72rem;font-weight:800;
  color:${p=>confColor[p.$c]||'#94a3b8'};margin-left:0.4rem;
`;

/* ── card body sections ─────────────────────────────── */
const Thesis = styled.p`
  margin:0;font-size:0.86rem;color:#94a3b8;line-height:1.62;
`;
const EntryBox = styled.div`
  padding:0.5rem 0.65rem;border-radius:8px;
  background:rgba(59,130,246,0.07);border-left:2px solid rgba(59,130,246,0.4);
  font-size:0.8rem;color:#7dd3fc;line-height:1.5;
`;
const PriceCtx = styled.div`
  font-size:0.78rem;color:#475569;line-height:1.45;
  padding:0.4rem 0.6rem;border-radius:7px;
  background:rgba(255,255,255,0.03);
`;
const CatalystList = styled.div`display:flex;flex-direction:column;gap:0.18rem;`;
const CatalystItem = styled.span`
  font-size:0.78rem;color:#64748b;line-height:1.4;
  &::before{content:'→ ';color:#a78bfa;font-weight:700;}
`;
const RiskBox = styled.div`
  padding:0.45rem 0.6rem;border-radius:8px;
  background:rgba(239,68,68,0.06);border-left:2px solid rgba(239,68,68,0.3);
  font-size:0.78rem;color:#fca5a5;line-height:1.45;
`;
const HorizonLine = styled.div`
  display:flex;align-items:center;justify-content:space-between;
  font-size:0.75rem;color:#334155;border-top:1px solid rgba(255,255,255,0.06);
  padding-top:0.6rem;margin-top:auto;
`;
const HorizonVal = styled.span`font-weight:700;color:#64748b;`;

/* ── default ideas table (unchanged from before) ────── */
const TableWrap = styled.div`overflow-x:auto;`;
const Table = styled.div`min-width:860px;`;
const THead = styled.div`
  display:grid;grid-template-columns:1.2fr 0.6fr 1.8fr 1.6fr 1.4fr 0.65fr;
  background:rgba(255,255,255,0.04);
  border-top:1px solid rgba(255,255,255,0.07);
  border-bottom:1px solid rgba(255,255,255,0.07);
`;
const THCell = styled.div`
  padding:0.65rem 1rem;font-size:0.65rem;font-weight:800;
  text-transform:uppercase;letter-spacing:0.1em;color:#334155;
`;
const TRow = styled(motion.div)`
  display:grid;grid-template-columns:1.2fr 0.6fr 1.8fr 1.6fr 1.4fr 0.65fr;
  border-bottom:1px solid rgba(255,255,255,0.05);
  &:last-child{border-bottom:none;}
  &:hover{background:rgba(255,255,255,0.025);}
`;
const TCell = styled.div`padding:0.9rem 1rem;font-size:0.85rem;line-height:1.55;color:#64748b;`;
const AssetName = styled.div`
  font-family:'Space Grotesk',sans-serif;font-size:0.92rem;
  font-weight:800;color:#f8fafc;letter-spacing:-0.02em;
`;
const AssetPills = styled.div`display:flex;flex-wrap:wrap;gap:0.25rem;margin-top:0.22rem;`;
const Pill = styled.span`
  display:inline-block;padding:0.16rem 0.4rem;border-radius:5px;
  font-size:0.6rem;font-weight:800;text-transform:uppercase;letter-spacing:0.05em;
  background:${p=>p.$bg||'rgba(255,255,255,0.07)'};
  color:${p=>p.$color||'#64748b'};
`;
const TickerMono = styled.div`
  font-family:'JetBrains Mono',monospace;font-size:0.86rem;font-weight:700;color:#f8fafc;
`;
const RiskText = styled.div`color:#fca5a5;font-size:0.83rem;`;
const HorizonText = styled.div`font-size:0.8rem;font-weight:700;color:#f8fafc;`;

/* ── loading ────────────────────────────────────────── */
const LoadingBox = styled.div`
  display:flex;flex-direction:column;align-items:center;
  gap:0.75rem;padding:3.5rem 1rem;color:#334155;
  font-size:0.9rem;text-align:center;
`;
const Spinner = styled.div`
  width:38px;height:38px;border-radius:50%;
  border:3px solid rgba(167,139,250,0.15);border-top-color:#a78bfa;
  animation:${spinAnim} 0.85s linear infinite;
`;
const LoadingDots = styled.div`
  display:flex;gap:0.4rem;
  span{
    width:6px;height:6px;border-radius:50%;background:#a78bfa;
    animation:${pulse} 1.2s ease-in-out infinite;
    &:nth-child(2){animation-delay:0.2s;}
    &:nth-child(3){animation-delay:0.4s;}
  }
`;

const PanelFooter = styled.div`
  padding:0.85rem 1.6rem;font-size:0.75rem;color:#1e293b;
  line-height:1.55;border-top:1px solid rgba(255,255,255,0.05);
`;

/* ── mode toggle ────────────────────────────────────── */
const ModeRow = styled.div`
  padding:0.75rem 1.6rem 0;display:flex;gap:0.5rem;
`;
const ModeBtn = styled.button`
  display:inline-flex;align-items:center;gap:0.35rem;
  padding:0.42rem 0.9rem;border-radius:999px;
  font-size:0.78rem;font-weight:700;cursor:pointer;transition:all 0.18s;
  border:1px solid ${p=>p.$active?'rgba(34,197,94,0.45)':'rgba(255,255,255,0.09)'};
  background:${p=>p.$active?'rgba(34,197,94,0.12)':'transparent'};
  color:${p=>p.$active?'#86efac':'#334155'};
  &:hover{color:#86efac;border-color:rgba(34,197,94,0.35);}
`;

/* ── summary bar (shown with results) ──────────────── */
const SummaryBar = styled.div`
  padding:0.7rem 1.6rem;
  display:flex;flex-wrap:wrap;gap:1.25rem;
  border-bottom:1px solid rgba(255,255,255,0.06);
`;
const SumStat = styled.div`display:flex;flex-direction:column;gap:0.12rem;`;
const SumLabel = styled.div`font-size:0.63rem;font-weight:800;text-transform:uppercase;letter-spacing:0.1em;color:#1e293b;`;
const SumValue = styled.div`
  font-family:'Space Grotesk',sans-serif;font-size:1.1rem;font-weight:800;
  color:${p=>p.$color||'#f8fafc'};letter-spacing:-0.03em;
`;

/* ── trend icon helper ──────────────────────────────── */
function TrendIconEl({ trend }) {
  if (trend === 'Uptrend')   return <FaArrowUp />;
  if (trend === 'Downtrend') return <FaArrowDown />;
  if (trend === 'Reversal')  return <FaExchangeAlt />;
  return <FaMinus />;
}

/* ── constants ──────────────────────────────────────── */
const ASSET_TYPES = [
  { id:'Stocks',       label:'Stocks',       border:'rgba(34,197,94,0.5)',  activeBg:'rgba(34,197,94,0.12)',  activeColor:'#86efac' },
  { id:'ETFs',         label:'ETFs',          border:'rgba(59,130,246,0.5)', activeBg:'rgba(59,130,246,0.12)', activeColor:'#93c5fd' },
  { id:'Commodities',  label:'Commodities',   border:'rgba(234,179,8,0.5)',  activeBg:'rgba(234,179,8,0.1)',   activeColor:'#fde68a' },
  { id:'Crypto',       label:'Crypto',        border:'rgba(251,146,60,0.5)', activeBg:'rgba(251,146,60,0.1)',  activeColor:'#fdba74' },
  { id:'Options Plays',label:'Options Plays', border:'rgba(167,139,250,0.5)',activeBg:'rgba(167,139,250,0.12)',activeColor:'#c4b5fd' },
];

const SECTORS = ['Technology','Health Care','Financials','Energy','Consumer','Industrials','Materials','Utilities'];

const defaultModes = {
  disclaimer:'Educational commentary only, not financial advice.',
  longTerm:[
    {asset:'Microsoft',  ticker:'MSFT',vehicle:'Stock',        fit:'Compounder',  reason:'Enterprise cloud and AI via Azure and Copilot.',             whyNow:'AI infrastructure demand keeps reinforcing platform leaders.',  risk:'Multiple compression if AI monetisation disappoints.',horizon:'5+ yrs'},
    {asset:'NVIDIA',     ticker:'NVDA',vehicle:'Stock',        fit:'Growth',      reason:'Central to AI compute and semiconductor capex cycles.',       whyNow:'Data-centre headlines keep it at the narrative centre.',        risk:'Any AI spending pause can trigger sharp multiple pressure.',horizon:'3–5 yrs'},
    {asset:'Eli Lilly',  ticker:'LLY', vehicle:'Stock',        fit:'Growth',      reason:'Leading GLP-1 market with Mounjaro and Zepbound.',            whyNow:'Market is large and manufacturing is scaling rapidly.',         risk:'Medicare pricing pressure or biosimilar competition.',horizon:'3–5 yrs'},
    {asset:'Alphabet',   ticker:'GOOGL',vehicle:'Stock',       fit:'Value-Growth',reason:'Search extended into AI with Google Cloud diversification.',  whyNow:'Trades at a P/E discount to mega-cap peers.',                  risk:'Antitrust rulings pose structural risk.',horizon:'3–5 yrs'},
    {asset:'S&P 500 ETF',ticker:'VOO', vehicle:'ETF',          fit:'Core',        reason:'Broad US equity captures winners across all sectors.',         whyNow:'Diversified exposure is cleaner when narratives compete.',      risk:'Broad earnings recession weighs on the full basket.',horizon:'5+ yrs'},
    {asset:'Gold',       ticker:'GLD', vehicle:'Commodity ETF',fit:'Defensive',   reason:'Hedge against inflation and geopolitical uncertainty.',        whyNow:'Policy-sensitive headlines lift defensive demand.',            risk:'Rising real yields can weigh on gold quickly.',horizon:'3–5 yrs'},
  ],
  shortTerm:[
    {asset:'Tesla',      ticker:'TSLA',vehicle:'Stock',        fit:'Catalyst',    reason:'Reacts fast to delivery, margin, and autonomy news.',         whyNow:'Fresh headlines quickly reset expectations.',                   risk:'Sentiment reversal if execution disappoints.',horizon:'1–3 mo'},
    {asset:'NVIDIA',     ticker:'NVDA',vehicle:'Stock',        fit:'Momentum',    reason:'Moves sharply when AI demand or guidance headlines shift.',    whyNow:'Sits at the centre of high-attention news cycles.',             risk:'Sells off hard if expectations are already too high.',horizon:'days–wks'},
    {asset:'Crude Oil',  ticker:'USO', vehicle:'Commodity ETF',fit:'Cyclical',    reason:'Responds to geopolitical, inventory, and demand headlines.',   whyNow:'Commodity news creates near-term directional setups fast.',     risk:'Supply expectation shift can reverse quickly.',horizon:'days–wks'},
    {asset:'Alphabet',   ticker:'GOOGL',vehicle:'Stock',       fit:'Value-Growth',reason:'Search dominance with AI extensions and Cloud revenue.',      whyNow:'Discount to peers makes it interesting on any pullback.',       risk:'Antitrust rulings pose structural risk.',horizon:'1–3 mo'},
  ],
};

/* ── component ──────────────────────────────────────── */
export default function Dashboard() {
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error,      setError]      = useState(null);
  const [brief,      setBrief]      = useState(null);
  const [mode,       setMode]       = useState('longTerm');

  const [deepRunning, setDeepRunning] = useState(false);
  const [deepResult,  setDeepResult]  = useState(null);
  const [deepError,   setDeepError]   = useState(null);
  const [showPrefs,   setShowPrefs]   = useState(false);
  const [activeTypes, setActiveTypes] = useState(['Stocks','ETFs','Commodities']);
  const [filterType,  setFilterType]  = useState('All');
  const [prefs, setPrefs] = useState({
    riskLevel:'moderate', horizon:'medium', style:'balanced', sectors:[],
  });

  const toggleType = id =>
    setActiveTypes(t => t.includes(id) ? t.filter(x=>x!==id) : [...t, id]);

  const toggleSector = s =>
    setPrefs(p => ({ ...p, sectors: p.sectors.includes(s) ? p.sectors.filter(x=>x!==s) : [...p.sectors,s] }));

  const load = useCallback(async (isRefresh) => {
    if (isRefresh) setRefreshing(true); else setLoading(true);
    setError(null);
    try {
      const data = await api.getDailyBrief({ refresh: !!isRefresh });
      setBrief(data);
    } catch (e) {
      setError(e.message || 'Could not load insights');
    } finally {
      setLoading(false); setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(false); }, [load]);

  const runDeepAnalysis = useCallback(async () => {
    setDeepRunning(true); setDeepError(null); setDeepResult(null);
    try {
      const result = await api.runDeepAnalysis({ ...prefs, assetTypes: activeTypes });
      setDeepResult(result);
      setFilterType('All');
    } catch (e) {
      setDeepError(e.message || 'Analysis failed');
    } finally {
      setDeepRunning(false);
    }
  }, [prefs, activeTypes]);

  const investmentModes = brief?.investmentModes || defaultModes;
  const activeIdeas = mode === 'shortTerm' ? investmentModes.shortTerm : investmentModes.longTerm;

  const updatedLabel = brief?.generatedAt
    ? new Date(brief.generatedAt).toLocaleTimeString(undefined,{timeStyle:'short'})
    : null;

  /* filtered deep picks */
  const filteredPicks = deepResult
    ? filterType === 'All'
      ? deepResult.picks
      : deepResult.picks.filter(p => p.assetType === filterType || p.action === filterType)
    : [];

  /* summary counts */
  const counts = deepResult
    ? deepResult.picks.reduce((acc,p)=>{ acc[p.action]=(acc[p.action]||0)+1; return acc; },{})
    : {};

  return (
    <Page>
      {/* top bar */}
      <TopBar>
        <TopInner>
          <div>
            <Kicker><span />BloomVest Intelligence</Kicker>
            <PageTitle>Investment Dashboard</PageTitle>
            <PageSub>Live headlines · AI-powered picks · Educational only</PageSub>
          </div>
          <HeaderRight>
            <RefreshBtn type="button" onClick={()=>load(true)}
              disabled={loading||refreshing} whileTap={{scale:0.96}}>
              <FaSyncAlt className={refreshing?'spin':''} />
              {refreshing?'Refreshing…':'Refresh'}
            </RefreshBtn>
            {updatedLabel && <MetaPill>Updated {updatedLabel}</MetaPill>}
          </HeaderRight>
        </TopInner>
      </TopBar>

      <Shell>
        {error && <ErrorBanner>{error}</ErrorBanner>}

        <Panel>
          {/* header */}
          <PanelHead>
            <PanelTitleBlock>
              <Eyebrow>AI Analysis Engine</Eyebrow>
              <PanelTitle>Stocks, ETFs &amp; commodities to watch</PanelTitle>
              <PanelSub>
                {deepResult
                  ? `${deepResult.picks.length} picks across ${Object.keys(deepResult.sectorBreakdown||{}).length} sectors · GPT-4o · ${deepResult.headlines?.length||0} live headlines`
                  : 'Select asset types, set preferences, and run a live AI sweep'}
              </PanelSub>
            </PanelTitleBlock>
            <PrefsToggle type="button" onClick={()=>setShowPrefs(v=>!v)}>
              {showPrefs?<FaChevronUp size={9}/>:<FaChevronDown size={9}/>}
              Preferences
            </PrefsToggle>
          </PanelHead>

          {/* preferences */}
          <AnimatePresence>
            {showPrefs && (
              <PrefsWrap
                initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}}
                exit={{opacity:0,height:0}} transition={{duration:0.22}}
              >
                <PrefsGrid>
                  <PrefGroup>
                    <PrefLabel htmlFor="risk">Risk appetite</PrefLabel>
                    <PrefSelect id="risk" value={prefs.riskLevel}
                      onChange={e=>setPrefs(p=>({...p,riskLevel:e.target.value}))}>
                      <option value="conservative">Conservative</option>
                      <option value="moderate">Moderate</option>
                      <option value="aggressive">Aggressive</option>
                    </PrefSelect>
                  </PrefGroup>
                  <PrefGroup>
                    <PrefLabel htmlFor="horizon">Horizon</PrefLabel>
                    <PrefSelect id="horizon" value={prefs.horizon}
                      onChange={e=>setPrefs(p=>({...p,horizon:e.target.value}))}>
                      <option value="short">Short · 1–6 mo</option>
                      <option value="medium">Medium · 6–18 mo</option>
                      <option value="long">Long · 2–5 yr</option>
                    </PrefSelect>
                  </PrefGroup>
                  <PrefGroup>
                    <PrefLabel htmlFor="style">Style</PrefLabel>
                    <PrefSelect id="style" value={prefs.style}
                      onChange={e=>setPrefs(p=>({...p,style:e.target.value}))}>
                      <option value="growth">Growth</option>
                      <option value="value">Value</option>
                      <option value="income">Income</option>
                      <option value="balanced">Balanced</option>
                    </PrefSelect>
                  </PrefGroup>
                </PrefsGrid>
                <div style={{marginTop:'0.85rem'}}>
                  <PrefLabel style={{display:'block',marginBottom:'0.4rem'}}>Sectors (optional)</PrefLabel>
                  <SectorsWrap>
                    {SECTORS.map(s=>(
                      <Chip key={s} type="button" $active={prefs.sectors.includes(s)}
                        $border="rgba(167,139,250,0.5)" $activeBg="rgba(167,139,250,0.13)"
                        $activeColor="#c4b5fd" onClick={()=>toggleSector(s)}>{s}
                      </Chip>
                    ))}
                  </SectorsWrap>
                </div>
              </PrefsWrap>
            )}
          </AnimatePresence>

          {/* asset type selector */}
          <FilterRow>
            <FilterLabel><FaFilter size={9}/>Asset types</FilterLabel>
            {ASSET_TYPES.map(t=>(
              <Chip key={t.id} type="button"
                $active={activeTypes.includes(t.id)}
                $border={t.border} $activeBg={t.activeBg} $activeColor={t.activeColor}
                onClick={()=>toggleType(t.id)}>{t.label}
              </Chip>
            ))}
          </FilterRow>

          {/* run controls */}
          <ControlsBar>
            <RunBtn type="button" onClick={runDeepAnalysis}
              disabled={deepRunning||activeTypes.length===0} whileTap={{scale:0.97}}>
              <FaSearch className={deepRunning?'spin':''} />
              {deepRunning?'Analysing live headlines…':'Run AI analysis'}
            </RunBtn>

            {deepResult && !deepRunning && (
              <>
                <CtrlDivider />
                <RunStatus $ok>
                  <FaCheckCircle />
                  {deepResult.fromFallback
                    ?'Reference data (live AI unavailable)'
                    :`${deepResult.headlines?.length||0} headlines · ${new Date(deepResult.generatedAt).toLocaleTimeString(undefined,{timeStyle:'short'})}`}
                </RunStatus>
              </>
            )}
            {deepError && !deepRunning && (
              <RunStatus>{deepError}</RunStatus>
            )}
            {deepResult && !deepRunning && (
              <ClearBtn type="button" onClick={()=>setDeepResult(null)}>Clear ×</ClearBtn>
            )}
          </ControlsBar>

          {/* summary bar */}
          {deepResult && !deepRunning && (
            <SummaryBar>
              <SumStat>
                <SumLabel>Total picks</SumLabel>
                <SumValue>{deepResult.picks.length}</SumValue>
              </SumStat>
              {Object.entries(counts).map(([action,count])=>(
                <SumStat key={action}>
                  <SumLabel>{action}</SumLabel>
                  <SumValue $color={(actionChip[action]||actionChip.Watch).color}>{count}</SumValue>
                </SumStat>
              ))}
              <SumStat>
                <SumLabel>Sectors</SumLabel>
                <SumValue>{Object.keys(deepResult.sectorBreakdown||{}).length}</SumValue>
              </SumStat>
            </SummaryBar>
          )}

          {/* market context */}
          {deepResult && !deepRunning && deepResult.marketContext && (
            <ContextBar>
              <ContextTheme>{deepResult.topTheme} —</ContextTheme>
              <ContextText>{deepResult.marketContext}</ContextText>
            </ContextBar>
          )}

          {/* sector breakdown */}
          {deepResult && !deepRunning && deepResult.sectorBreakdown && Object.keys(deepResult.sectorBreakdown).length>0 && (
            <SectorStrip>
              {Object.entries(deepResult.sectorBreakdown).map(([sector,note])=>(
                <SectorBadge key={sector}>
                  <SectorName>{sector}</SectorName>
                  <SectorNote>— {note}</SectorNote>
                </SectorBadge>
              ))}
            </SectorStrip>
          )}

          {/* filter strip for deep results */}
          {deepResult && !deepRunning && (
            <FilterRow style={{borderTop:'none'}}>
              <FilterLabel>Show</FilterLabel>
              {['All','Strong Buy','Buy','Watch','Reduce','Avoid'].map(f=>(
                <Chip key={f} type="button" $active={filterType===f}
                  $border={f==='All'?'rgba(148,163,184,0.4)':actionBorder[f]+'88'||'rgba(148,163,184,0.4)'}
                  $activeBg={f==='All'?'rgba(255,255,255,0.08)':(actionChip[f]||actionChip.Watch).bg}
                  $activeColor={f==='All'?'#94a3b8':(actionChip[f]||actionChip.Watch).color}
                  onClick={()=>setFilterType(f)}
                >{f}{f!=='All'&&counts[f]?` (${counts[f]})`:''}</Chip>
              ))}
            </FilterRow>
          )}

          {/* loading */}
          {deepRunning && (
            <LoadingBox>
              <Spinner />
              <LoadingDots><span/><span/><span/></LoadingDots>
              <div>Fetching live headlines · running GPT-4o analysis</div>
              <div style={{fontSize:'0.78rem',color:'#1e293b'}}>20 picks · usually 15–25 seconds</div>
            </LoadingBox>
          )}

          {/* deep results — cards */}
          {deepResult && !deepRunning && (
            <CardsGrid>
              <AnimatePresence mode="popLayout">
                {filteredPicks.map((pick,i)=>(
                  <Card
                    key={`${pick.ticker}-${i}`}
                    $action={pick.action}
                    layout
                    initial={{opacity:0,y:14}}
                    animate={{opacity:1,y:0}}
                    exit={{opacity:0,scale:0.96}}
                    transition={{delay:Math.min(i*0.03,0.3),type:'spring',stiffness:340,damping:30}}
                  >
                    {/* top */}
                    <CardTop>
                      <CardLeft>
                        <CompanyName title={pick.company}>{pick.company}</CompanyName>
                        <TickerRow>
                          <TickerBadge>{pick.ticker}</TickerBadge>
                          <TagRow>
                            <Tag $bg="rgba(255,255,255,0.06)" $color="#475569">{pick.assetType}</Tag>
                            <Tag $bg="rgba(167,139,250,0.1)" $color="#c4b5fd">{pick.fit}</Tag>
                          </TagRow>
                        </TickerRow>
                        <div style={{fontSize:'0.72rem',color:'#1e293b',marginTop:'0.18rem'}}>{pick.sector}</div>
                      </CardLeft>
                      <ActionBadge $a={pick.action}>{pick.action}</ActionBadge>
                    </CardTop>

                    {/* trend + confidence */}
                    <TrendRow>
                      <TrendIcon $t={pick.trend}><TrendIconEl trend={pick.trend}/></TrendIcon>
                      <TrendLabel $t={pick.trend}>{pick.trend}</TrendLabel>
                      <TrendStrength>{pick.trendStrength}</TrendStrength>
                      <ConfLabel $c={pick.confidence}>· {pick.confidence} conf.</ConfLabel>
                    </TrendRow>

                    {/* thesis */}
                    <Thesis>{pick.thesis}</Thesis>

                    {/* entry signal */}
                    <EntryBox>⤷ {pick.entrySignal}</EntryBox>

                    {/* price context */}
                    <PriceCtx>{pick.priceContext}</PriceCtx>

                    {/* catalysts */}
                    <CatalystList>
                      {pick.catalysts.map((c,ci)=><CatalystItem key={ci}>{c}</CatalystItem>)}
                    </CatalystList>

                    {/* risk */}
                    <RiskBox>⚠ {pick.risk}</RiskBox>

                    {/* horizon */}
                    <HorizonLine>
                      <span>Horizon</span>
                      <HorizonVal>{pick.horizon}</HorizonVal>
                    </HorizonLine>
                  </Card>
                ))}
              </AnimatePresence>
            </CardsGrid>
          )}

          {/* default table — shown before any analysis */}
          {!deepResult && !deepRunning && (
            <>
              <ModeRow>
                <ModeBtn type="button" $active={mode==='longTerm'} onClick={()=>setMode('longTerm')}>
                  <FaGem size={10}/> Long-term
                </ModeBtn>
                <ModeBtn type="button" $active={mode==='shortTerm'} onClick={()=>setMode('shortTerm')}>
                  <FaBolt size={10}/> Short-term
                </ModeBtn>
              </ModeRow>
              <TableWrap>
                <Table>
                  <THead>
                    <THCell>Asset</THCell><THCell>Ticker</THCell>
                    <THCell>Why it fits</THCell><THCell>Why now</THCell>
                    <THCell>Main risk</THCell><THCell>Horizon</THCell>
                  </THead>
                  {activeIdeas.map((idea,i)=>(
                    <TRow key={`${mode}-${idea.asset}-${i}`}
                      initial={{opacity:0,y:7}} animate={{opacity:1,y:0}}
                      transition={{delay:Math.min(i*0.05,0.22),duration:0.24}}>
                      <TCell>
                        <AssetName>{idea.asset}</AssetName>
                        <AssetPills>
                          <Pill $bg="rgba(34,197,94,0.1)" $color="#86efac">{idea.vehicle}</Pill>
                          <Pill $bg="rgba(59,130,246,0.1)" $color="#93c5fd">{idea.fit}</Pill>
                        </AssetPills>
                      </TCell>
                      <TCell><TickerMono>{idea.ticker}</TickerMono></TCell>
                      <TCell>{idea.reason}</TCell>
                      <TCell>{idea.whyNow}</TCell>
                      <TCell><RiskText>{idea.risk}</RiskText></TCell>
                      <TCell><HorizonText>{idea.horizon}</HorizonText></TCell>
                    </TRow>
                  ))}
                </Table>
              </TableWrap>
            </>
          )}

          <PanelFooter>
            {deepResult ? deepResult.disclaimer : investmentModes.disclaimer}
          </PanelFooter>
        </Panel>
      </Shell>
    </Page>
  );
}
