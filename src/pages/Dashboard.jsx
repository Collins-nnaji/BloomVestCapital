import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaBolt, FaGem, FaSyncAlt, FaSearch,
  FaChevronDown, FaChevronUp, FaCheckCircle,
  FaArrowUp, FaArrowDown, FaMinus, FaExchangeAlt,
  FaFilter, FaBookOpen, FaPlus, FaTrash, FaMagic, FaSpinner, FaChartLine,
  FaBold, FaItalic, FaListUl, FaTag, FaRobot, FaTimes, FaLightbulb,
  FaExclamationTriangle, FaAlignLeft, FaNewspaper, FaSignal, FaCalendarAlt,
  FaFire, FaShieldAlt, FaBullseye, FaClock
} from 'react-icons/fa';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { api } from '../api';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

/* ── animations ─────────────────────────────────────── */
const slide    = keyframes`from{transform:translateX(0)}to{transform:translateX(-50%)}`;
const spinAnim = keyframes`to{transform:rotate(360deg)}`;

/* ── page ───────────────────────────────────────────── */
const Page = styled.div`
  min-height: 100vh;
  background: #ffffff;
  font-family: 'Inter', system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  padding-top: 64px;
  color: #0f172a;
  &::-webkit-scrollbar { display: none; }
  -ms-overflow-style: none; scrollbar-width: none;
`;

const TopHeader = styled.div`
  padding: 0.85rem 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #f1f5f9;
  flex-wrap: wrap;
  gap: 0.5rem;
  @media (max-width: 640px) {
    padding: 0.75rem 1rem;
    flex-direction: column;
    align-items: stretch;
    gap: 0.6rem;
  }
`;
const HeaderLeft = styled.div`
  display: flex; align-items: baseline; gap: 0.5rem; flex: 1;
`;
const Brand     = styled.span`font-size:0.8rem;font-weight:700;color:#10b981;text-transform:uppercase;letter-spacing:0.05em;`;
const Slash     = styled.span`color:#cbd5e1;font-weight:300;`;
const PageTitle = styled.h1`
  font-family:'Space Grotesk',sans-serif;font-size:1.1rem;font-weight:700;color:#0f172a;margin:0;
`;
const FilterGroup = styled.div`
  display:flex;background:#f8fafc;border-radius:8px;padding:4px;border:1px solid #e2e8f0;gap:2px;
  @media(max-width:640px){width:100%;justify-content:space-between;}
`;
const FilterBtn = styled.button`
  background:${p=>p.$active?'#ffffff':'transparent'};
  border:1px solid ${p=>p.$active?'#e2e8f0':'transparent'};
  box-shadow:${p=>p.$active?'0 1px 2px rgba(0,0,0,0.05)':'none'};
  color:${p=>p.$active?'#0f172a':'#64748b'};
  padding:0.3rem 0.75rem;border-radius:6px;font-size:0.75rem;font-weight:600;cursor:pointer;
  display:flex;align-items:center;gap:0.4rem;flex:1;justify-content:center;transition:all 0.2s;
  &:hover{color:#0f172a;}
  @media(min-width:641px){flex:none;}
`;
const FilterDot = styled.span`
  width:6px;height:6px;border-radius:50%;background:${p=>p.$color||'#cbd5e1'};
`;
const HeaderRight = styled.div`
  display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap;
  @media(max-width:640px){width:100%;justify-content:flex-end;}
`;
const LastRunInfo = styled.div`
  font-size:0.7rem;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;font-weight:600;
  span{font-family:'JetBrains Mono',monospace;color:#0f172a;margin-left:4px;}
  @media(max-width:600px){display:none;}
`;
const RefreshBtn = styled(motion.button)`
  display:inline-flex;align-items:center;justify-content:center;
  width:32px;height:32px;border-radius:8px;border:1px solid #e2e8f0;background:#ffffff;
  color:#64748b;cursor:pointer;
  &:hover{border-color:#cbd5e1;color:#0f172a;}
  svg.spin{animation:${spinAnim} 0.85s linear infinite;}
`;
const PrefsToggleBtn = styled.button`
  display:inline-flex;align-items:center;gap:0.5rem;padding:0.5rem 0.8rem;border-radius:8px;
  border:1px solid #e2e8f0;background:${p=>p.$active?'#f1f5f9':'#ffffff'};
  color:${p=>p.$active?'#0f172a':'#64748b'};font-size:0.75rem;font-weight:700;cursor:pointer;
  &:hover{border-color:#cbd5e1;color:#0f172a;}
  @media(max-width:480px){padding:0.45rem 0.6rem;font-size:0.7rem;span{display:none;}}
`;
const RunBtn = styled(motion.button)`
  background:#0f172a;color:#ffffff;border:none;border-radius:8px;
  padding:0.55rem 1rem;font-size:0.8rem;font-weight:700;
  display:inline-flex;align-items:center;gap:0.5rem;cursor:pointer;white-space:nowrap;
  &:hover{background:#1e293b;}&:disabled{opacity:0.6;cursor:not-allowed;}
  @media(max-width:640px){flex:1;justify-content:center;padding:0.6rem 0.75rem;}
`;

/* ── tabs ───────────────────────────────────────────── */
const DashTabBar = styled.div`
  display:flex;gap:0;border-bottom:1px solid #f1f5f9;
  background:#ffffff;padding:0 1.5rem;overflow-x:auto;
  scrollbar-width:none;&::-webkit-scrollbar{display:none;}
  @media(max-width:640px){padding:0;}
`;
const DashTabBtn = styled.button`
  padding:0.85rem 1.25rem;font-family:'Space Grotesk',sans-serif;font-size:0.82rem;font-weight:700;
  border:none;background:transparent;cursor:pointer;white-space:nowrap;
  color:${p=>p.$active?'#0f172a':'#94a3b8'};
  border-bottom:2px solid ${p=>p.$active?'#10b981':'transparent'};
  margin-bottom:-1px;transition:color 0.2s,border-color 0.2s;
  display:flex;align-items:center;gap:0.4rem;
  &:hover{color:#0f172a;}
  @media(max-width:640px){flex:1;justify-content:center;padding:0.75rem 0.5rem;font-size:0.78rem;}
`;

/* ── summary bar ────────────────────────────────────── */
const SummaryBar = styled.div`
  display:grid;grid-template-columns:repeat(5,1fr);
  background:#fcfcfc;border-bottom:1px solid #f1f5f9;
  @media(max-width:640px){grid-template-columns:repeat(3,1fr);}
`;
const SumItem = styled.div`
  padding:0.75rem 1rem;display:flex;flex-direction:column;gap:0.15rem;
  border-right:1px solid #f1f5f9;&:last-child{border-right:none;}
  @media(max-width:640px){padding:0.65rem 0.75rem;&:nth-child(4){display:none;}}
`;
const SumLabel = styled.div`font-size:0.6rem;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.08em;`;
const SumValue = styled.div`font-size:1.25rem;font-family:'Space Grotesk',sans-serif;font-weight:800;color:${p=>p.$color||'#0f172a'};`;

/* ── prefs ──────────────────────────────────────────── */
const PrefsWrap = styled(motion.div)`padding:1.25rem;background:#ffffff;`;
const PrefsGrid = styled.div`display:grid;gap:1.5rem;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));`;
const PrefGroup = styled.div`display:flex;flex-direction:column;gap:0.5rem;`;
const PrefLabel = styled.label`font-size:0.65rem;font-weight:800;text-transform:uppercase;letter-spacing:0.1em;color:#94a3b8;`;
const PrefSelect = styled.select`
  appearance:none;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;
  color:#0f172a;font-size:0.85rem;font-weight:600;padding:0.6rem 1rem;cursor:pointer;font-family:inherit;transition:all 0.2s;
  &:focus{outline:none;border-color:#0f172a;background:#ffffff;box-shadow:0 0 0 3px rgba(15,23,42,0.05);}
`;
const SectorsWrap = styled.div`display:flex;flex-wrap:wrap;gap:0.5rem;margin-top:0.5rem;`;
const SectorChip = styled(motion.button)`
  padding:0.4rem 0.8rem;border-radius:6px;font-size:0.7rem;font-weight:700;cursor:pointer;
  border:1px solid ${p=>p.$active?'#0f172a':'#e2e8f0'};
  background:${p=>p.$active?'#0f172a':'#ffffff'};
  color:${p=>p.$active?'#ffffff':'#64748b'};
  &:hover{border-color:#0f172a;color:${p=>p.$active?'#ffffff':'#0f172a'};}
`;

/* ── asset type row ─────────────────────────────────── */
const AssetTypeRow = styled.div`
  padding:0.65rem 1.25rem;display:flex;align-items:center;gap:0.5rem;
  background:#ffffff;border-bottom:1px solid #f8fafc;
  overflow-x:auto;flex-wrap:nowrap;-webkit-overflow-scrolling:touch;
  scrollbar-width:none;&::-webkit-scrollbar{display:none;}
  @media(max-width:640px){padding:0.6rem 1rem;gap:0.4rem;}
`;
const TypeLabel = styled.span`font-size:0.65rem;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:0.1em;`;
const TypeChip = styled(motion.button)`
  padding:0.35rem 0.75rem;border-radius:6px;font-size:0.7rem;font-weight:700;cursor:pointer;
  border:1px solid ${p=>p.$active?p.$color:'#e2e8f0'};
  background:${p=>p.$active?p.$bg:'#ffffff'};
  color:${p=>p.$active?p.$color:'#64748b'};
  &:hover{border-color:${p=>p.$color};}
`;

/* ── progress bar ───────────────────────────────────── */
const ProgressContainer = styled(motion.div)`
  background:#ffffff;border-bottom:1px solid #f1f5f9;padding:0.75rem 2rem;
  display:flex;align-items:center;gap:1rem;
`;
const ProgressBarWrap = styled.div`flex:1;height:6px;background:#f1f5f9;border-radius:3px;overflow:hidden;`;
const ProgressFill    = styled(motion.div)`height:100%;background:#10b981;border-radius:3px;`;
const ProgressText    = styled.div`font-size:0.7rem;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;min-width:140px;`;

/* ── shell / table ──────────────────────────────────── */
const Shell   = styled.div`display:grid;grid-template-columns:1fr;`;
const MainCol = styled.div`display:flex;flex-direction:column;min-width:0;`;

const TableHeader = styled.div`
  display:flex;justify-content:space-between;align-items:center;
  padding:0.8rem 1.25rem;background:#ffffff;border-bottom:1px solid #f8fafc;
  flex-wrap:wrap;gap:0.5rem;
`;
const THLeft = styled.div`
  font-family:'Space Grotesk',sans-serif;font-size:0.9rem;font-weight:700;color:#0f172a;
  span{color:#94a3b8;font-weight:400;margin-left:0.4rem;font-family:'Inter',sans-serif;}
`;
const THRight = styled.div`display:flex;align-items:center;gap:1rem;flex-wrap:wrap;`;
const THGroup = styled.div`
  display:flex;align-items:center;gap:0.5rem;
  font-size:0.65rem;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.1em;
`;
const CopyPicksBtn = styled.button`
  display:inline-flex;align-items:center;gap:0.4rem;
  background:#eff6ff;border:1px solid rgba(37,99,235,0.25);border-radius:6px;
  padding:0.35rem 0.75rem;font-size:0.7rem;font-weight:700;color:#2563eb;
  cursor:pointer;transition:all 0.2s;
  &:hover{background:#dbeafe;border-color:rgba(37,99,235,0.45);color:#1d4ed8;}
`;

const TableWrap = styled.div`
  flex:1;overflow-x:auto;overflow-y:auto;
  &::-webkit-scrollbar{display:none;}-ms-overflow-style:none;scrollbar-width:none;
`;
const THead = styled.div`
  display:grid;grid-template-columns:1.4fr 0.8fr 1fr 2.8fr 1.5fr 0.6fr;
  min-width:750px;border-bottom:1px solid #f1f5f9;
  @media(max-width:640px){display:none;}
`;
const THCell = styled.div`
  padding:0.6rem 1rem;font-size:0.6rem;font-weight:700;color:#94a3b8;
  text-transform:uppercase;letter-spacing:0.1em;
`;
const TRow = styled(motion.div)`
  display:grid;grid-template-columns:1.4fr 0.8fr 1fr 2.8fr 1.5fr 0.6fr;
  min-width:750px;cursor:pointer;
  background:${p=>p.$selected?'#f8fafc':'#ffffff'};
  border-left:3px solid ${p=>p.$selected?'#10b981':'transparent'};
  border-bottom:1px solid #f8fafc;
  &:hover{background:#f8fafc;}
  @media(max-width:640px){
    display:flex;flex-direction:column;min-width:unset;
    padding:1rem;gap:0.5rem;
    border-left:3px solid ${p=>p.$selected?'#10b981':'transparent'};
    border-bottom:1px solid #f1f5f9;
  }
`;
const TCell = styled.div`
  padding:0.85rem 1rem;display:flex;flex-direction:column;justify-content:center;
  @media(max-width:640px){
    padding:0;
    &:nth-child(3),&:nth-child(5),&:nth-child(6){display:none;}
  }
`;
const AssetSymbol = styled.div`font-weight:800;color:#0f172a;font-size:0.85rem;`;
const MiniTags    = styled.div`display:flex;gap:0.3rem;margin-top:0.4rem;flex-wrap:wrap;`;
const MiniTag     = styled.span`
  background:#f1f5f9;color:#64748b;font-size:0.55rem;padding:0.1rem 0.3rem;
  border-radius:4px;font-weight:600;text-transform:uppercase;
`;
const VerdictBadge = styled.div`
  display:inline-flex;align-items:center;gap:0.3rem;
  background:${p=>p.$bg};color:${p=>p.$color};
  padding:0.2rem 0.5rem;border-radius:6px;font-size:0.65rem;font-weight:800;text-transform:uppercase;
  width:max-content;
`;
const ConfRow     = styled.div`display:flex;align-items:center;gap:0.5rem;`;
const ConfBarWrap = styled.div`flex:1;height:4px;background:#f1f5f9;border-radius:2px;overflow:hidden;`;
const ConfBarFill = styled.div`height:100%;background:${p=>p.$color};width:${p=>p.$pct}%;`;
const ConfScore   = styled.div`font-weight:700;font-size:0.8rem;color:#0f172a;`;
const DeltaText   = styled.div`font-size:0.6rem;color:${p=>p.$pos?'#10b981':'#f43f5e'};font-weight:600;`;
const SparkWrap   = styled.div`height:30px;width:100%;`;
const Spinner = styled(FaSpinner)`animation:${spinAnim} 0.8s linear infinite;`;
const SpinnerGreen = styled(FaSpinner)`animation:${spinAnim} 0.8s linear infinite;color:#10b981;`;

/* expandable thesis ────────────────────────────────── */
const ThesisText = styled.div`
  font-size:0.72rem;color:#475569;line-height:1.5;
  ${p=>!p.$expanded&&`display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;`}
  cursor:pointer;
  &:hover{color:#0f172a;}
`;
const ExpandBtn = styled.button`
  background:none;border:none;padding:0;font-size:0.62rem;font-weight:700;
  color:#10b981;cursor:pointer;margin-top:2px;display:flex;align-items:center;gap:2px;
  &:hover{color:#059669;}
`;

/* ── detail drawer ──────────────────────────────────── */
const DetailDrawer = styled(motion.div)`
  background:#f8fafc;border-top:1px solid #e2e8f0;
  padding:1.25rem 1.5rem;
  display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1rem;
  @media(max-width:640px){grid-template-columns:1fr;padding:1rem;}
`;
const DetailBlock = styled.div`display:flex;flex-direction:column;gap:0.25rem;`;
const DetailLabel = styled.div`font-size:0.6rem;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;color:#94a3b8;`;
const DetailValue = styled.div`font-size:0.82rem;color:#0f172a;line-height:1.5;font-weight:500;`;
const CatalystList= styled.ul`margin:0;padding-left:1rem;`;
const CatalystItem= styled.li`font-size:0.78rem;color:#374151;line-height:1.5;`;

/* ── market brief tab ───────────────────────────────── */
const BriefWrap = styled.div`max-width:900px;margin:0 auto;padding:1.5rem;@media(max-width:640px){padding:1rem;}`;
const BriefHero = styled.div`
  background:linear-gradient(135deg,#0f172a 0%,#1e3a5f 100%);
  border-radius:16px;padding:2rem;margin-bottom:1.5rem;
  @media(max-width:640px){padding:1.25rem;}
`;
const BriefTheme = styled.div`
  font-family:'Space Grotesk',sans-serif;font-size:1.5rem;font-weight:800;
  color:#ffffff;margin-bottom:0.75rem;line-height:1.25;
  @media(max-width:640px){font-size:1.2rem;}
`;
const BriefNarrative = styled.p`
  font-size:0.9rem;color:rgba(255,255,255,0.75);line-height:1.7;margin:0;
`;
const BriefMeta = styled.div`
  font-size:0.68rem;color:rgba(255,255,255,0.4);margin-top:1rem;font-weight:600;letter-spacing:0.05em;
`;
const SignalsGrid = styled.div`
  display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:0.85rem;margin-bottom:1.5rem;
`;
const SignalCard = styled(motion.div)`
  border-radius:12px;padding:1rem 1.1rem;
  border:1px solid ${p=>p.$color+'33'};
  background:${p=>p.$color+'0d'};
`;
const SignalStance = styled.div`
  font-size:0.6rem;font-weight:800;text-transform:uppercase;letter-spacing:0.1em;
  color:${p=>p.$color};margin-bottom:0.4rem;display:flex;align-items:center;gap:0.35rem;
`;
const SignalTitle = styled.div`font-size:0.88rem;font-weight:700;color:#0f172a;margin-bottom:0.35rem;`;
const SignalDetail= styled.div`font-size:0.8rem;color:#475569;line-height:1.6;`;

const ModesSection = styled.div`margin-top:1.5rem;`;
const ModeToggle = styled.div`
  display:inline-flex;background:#f1f5f9;padding:3px;border-radius:8px;margin-bottom:1rem;
`;
const ModeBtn = styled.button`
  padding:0.4rem 1rem;border-radius:6px;border:none;font-size:0.78rem;font-weight:700;cursor:pointer;
  background:${p=>p.$active?'#ffffff':'transparent'};
  color:${p=>p.$active?'#0f172a':'#64748b'};
  box-shadow:${p=>p.$active?'0 2px 4px rgba(0,0,0,0.05)':'none'};transition:all 0.2s;
  display:flex;align-items:center;gap:0.4rem;
`;
const IdeasGrid = styled.div`display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:0.85rem;`;
const IdeaCard = styled(motion.div)`
  border-radius:12px;border:1px solid #e2e8f0;background:#ffffff;padding:1.1rem;
  transition:box-shadow 0.2s,border-color 0.2s;
  &:hover{box-shadow:0 4px 16px rgba(0,0,0,0.06);border-color:#cbd5e1;}
`;
const IdeaTicker = styled.div`
  font-family:'Space Grotesk',sans-serif;font-size:1rem;font-weight:800;color:#0f172a;
`;
const IdeaAsset  = styled.div`font-size:0.75rem;color:#64748b;margin-bottom:0.5rem;`;
const IdeaBadge  = styled.span`
  font-size:0.58rem;font-weight:800;text-transform:uppercase;letter-spacing:0.06em;
  padding:0.15rem 0.45rem;border-radius:4px;
  background:${p=>p.$bg||'#f1f5f9'};color:${p=>p.$color||'#64748b'};
  margin-right:0.3rem;
`;
const IdeaRow    = styled.div`margin-top:0.6rem;font-size:0.78rem;color:#374151;line-height:1.5;`;
const IdeaLabel  = styled.span`font-weight:700;color:#0f172a;margin-right:0.3rem;`;
const IdeaRisk   = styled.div`
  margin-top:0.5rem;font-size:0.72rem;color:#ef4444;line-height:1.4;
  background:#fef2f2;border-radius:6px;padding:0.4rem 0.6rem;
`;

/* ── news feed tab ──────────────────────────────────── */
const NewsFeedWrap = styled.div`padding:1.25rem;`;
const NewsFeedHeader = styled.div`
  display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;flex-wrap:wrap;gap:0.75rem;
`;
const NewsFeedTitle = styled.div`
  font-family:'Space Grotesk',sans-serif;font-size:0.95rem;font-weight:700;color:#0f172a;
  display:flex;align-items:center;gap:0.5rem;
  span{font-family:'Inter',sans-serif;font-weight:400;color:#94a3b8;font-size:0.75rem;}
`;
const NewsSearch = styled.input`
  background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;
  padding:0.45rem 0.85rem;font-size:0.8rem;color:#0f172a;font-family:inherit;
  width:240px;min-width:0;
  &:focus{outline:none;border-color:#94a3b8;}
  &::placeholder{color:#94a3b8;}
  @media(max-width:640px){width:100%;}
`;
const SourceFilterRow = styled.div`
  display:flex;flex-wrap:wrap;gap:0.4rem;margin-bottom:1rem;
`;
const SourceFilterChip = styled.button`
  padding:0.28rem 0.65rem;border-radius:5px;font-size:0.65rem;font-weight:700;cursor:pointer;
  border:1px solid ${p=>p.$active?'#0f172a':'#e2e8f0'};
  background:${p=>p.$active?'#0f172a':'#ffffff'};
  color:${p=>p.$active?'#ffffff':'#64748b'};
  transition:all 0.15s;
  &:hover{border-color:#0f172a;color:${p=>p.$active?'#ffffff':'#0f172a'};}
`;
const NewsGrid = styled.div`
  display:flex;flex-direction:column;gap:0.5rem;
  max-height:calc(100vh - 300px);overflow-y:auto;
  padding-right:4px;
  &::-webkit-scrollbar{width:4px;}
  &::-webkit-scrollbar-track{background:transparent;}
  &::-webkit-scrollbar-thumb{background:#e2e8f0;border-radius:4px;}
`;
const NewsItem = styled(motion.div)`
  display:flex;flex-direction:column;gap:0.4rem;
  padding:0.85rem 1rem;border-radius:10px;border:1px solid transparent;
  background:#f8fafc;transition:all 0.15s;
  &:hover{border-color:#e2e8f0;background:#ffffff;box-shadow:0 2px 8px rgba(0,0,0,0.04);}
`;
const NewsItemTop = styled.div`display:flex;align-items:flex-start;gap:0.75rem;`;
const NewsBadge = styled.span`
  font-size:0.58rem;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;
  color:#64748b;background:#e2e8f0;border-radius:4px;
  padding:0.15rem 0.4rem;white-space:nowrap;flex-shrink:0;margin-top:2px;
`;
const SentimentDot = styled.span`
  width:7px;height:7px;border-radius:50%;flex-shrink:0;margin-top:5px;
  background:${p=>p.$color||'#cbd5e1'};
`;
const NewsTitle = styled.a`
  font-size:0.85rem;font-weight:600;color:#0f172a;text-decoration:none;flex:1;line-height:1.45;
  &:hover{color:#10b981;text-decoration:underline;}
`;
const NewsSummary = styled.div`
  font-size:0.77rem;color:#64748b;line-height:1.55;padding-left:calc(0.75rem + 14px);
  border-left:2px solid #e2e8f0;margin-left:calc(0.75rem + 3px);
`;
const NewsInsightBox = styled(motion.div)`
  font-size:0.78rem;color:#374151;line-height:1.6;
  background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;
  padding:0.65rem 0.85rem;white-space:pre-wrap;
`;
const NewsInsightBtn = styled.button`
  font-size:0.68rem;font-weight:700;padding:0.25rem 0.6rem;border-radius:5px;
  border:1px solid #e2e8f0;background:#ffffff;color:#64748b;cursor:pointer;
  display:flex;align-items:center;gap:0.3rem;transition:all 0.15s;white-space:nowrap;flex-shrink:0;
  &:hover{border-color:#10b981;color:#10b981;background:#f0fdf4;}
  &:disabled{opacity:0.5;cursor:not-allowed;}
`;
const TickerPillRow = styled.div`
  display:flex;flex-wrap:wrap;gap:0.3rem;padding-left:calc(0.75rem + 14px);
`;
const TickerPill = styled.span`
  font-size:0.6rem;font-weight:700;padding:0.1rem 0.4rem;border-radius:4px;
  background:#eff6ff;color:#3b82f6;border:1px solid rgba(59,130,246,0.2);
`;
const SentimentLabel = styled.span`
  font-size:0.6rem;font-weight:700;padding:0.1rem 0.4rem;border-radius:4px;
  background:${p=>p.$bg};color:${p=>p.$color};border:1px solid ${p=>p.$border};
`;

/* ── sentiment tab ──────────────────────────────────── */
const SentimentWrap = styled.div`padding:1.25rem;`;
const SentimentHeader = styled.div`
  display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;flex-wrap:wrap;gap:0.75rem;
`;
const SentimentTitle = styled.div`
  font-family:'Space Grotesk',sans-serif;font-size:0.95rem;font-weight:700;color:#0f172a;
  display:flex;align-items:center;gap:0.5rem;
  span{font-family:'Inter',sans-serif;font-weight:400;color:#94a3b8;font-size:0.75rem;}
`;
const SentTable = styled.div`
  border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;
`;
const SentTHead = styled.div`
  display:grid;grid-template-columns:0.6fr 1.4fr 0.8fr 2fr 0.8fr;
  background:#f8fafc;border-bottom:1px solid #e2e8f0;
  @media(max-width:640px){grid-template-columns:0.8fr 1.2fr 1fr;}
`;
const SentTH = styled.div`
  padding:0.6rem 1rem;font-size:0.6rem;font-weight:700;color:#94a3b8;
  text-transform:uppercase;letter-spacing:0.1em;
  @media(max-width:640px){&:nth-child(4),&:nth-child(5){display:none;}}
`;
const SentTRow = styled(motion.div)`
  display:grid;grid-template-columns:0.6fr 1.4fr 0.8fr 2fr 0.8fr;
  border-bottom:1px solid #f1f5f9;background:#ffffff;
  &:last-child{border-bottom:none;}
  &:hover{background:#f8fafc;}
  @media(max-width:640px){grid-template-columns:0.8fr 1.2fr 1fr;}
`;
const SentTD = styled.div`
  padding:0.75rem 1rem;display:flex;align-items:center;font-size:0.8rem;
  @media(max-width:640px){&:nth-child(4),&:nth-child(5){display:none;}}
`;
const ScoreBar = styled.div`
  height:6px;border-radius:3px;background:#f1f5f9;flex:1;overflow:hidden;margin-left:0.5rem;
`;
const ScoreFill = styled.div`
  height:100%;border-radius:3px;width:${p=>p.$pct}%;
  background:${p=>p.$color};transition:width 0.4s ease;
`;
const RankBadge = styled.div`
  width:22px;height:22px;border-radius:6px;
  background:${p=>p.$rank<=3?'#0f172a':'#f1f5f9'};
  color:${p=>p.$rank<=3?'#ffffff':'#94a3b8'};
  font-size:0.65rem;font-weight:800;display:flex;align-items:center;justify-content:center;
`;
const EmptyState = styled.div`
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  padding:3.5rem 2rem;gap:0.75rem;color:#94a3b8;text-align:center;
  svg{font-size:1.8rem;color:#cbd5e1;}
`;
const EmptyTitle = styled.div`font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:0.95rem;color:#64748b;`;
const EmptyDesc  = styled.div`font-size:0.8rem;max-width:300px;`;

/* ── journal ────────────────────────────────────────── */
const JournalFullPage = styled.div`max-width:900px;margin:0 auto;padding:1.5rem;@media(max-width:640px){padding:1rem;}`;
const JournalFullHeader = styled.div`display:flex;justify-content:space-between;align-items:center;margin-bottom:1.25rem;`;
const JournalFullTitle  = styled.h2`
  font-family:'Space Grotesk',sans-serif;font-size:1.25rem;font-weight:800;color:#0f172a;
  display:flex;align-items:center;gap:0.5rem;margin:0;
`;
const AddNoteBtn = styled.button`
  background:#0f172a;color:#ffffff;border:none;border-radius:8px;
  padding:0.5rem 1rem;display:flex;align-items:center;gap:0.4rem;
  font-size:0.82rem;font-weight:700;font-family:'Space Grotesk',sans-serif;
  cursor:pointer;transition:background 0.2s;white-space:nowrap;
  &:hover{background:#1e293b;}
`;
const JournalGrid = styled.div`
  display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:1.25rem;
  @media(max-width:640px){grid-template-columns:1fr;gap:0.85rem;}
`;
const NoteCard = styled(motion.div)`
  background:#ffffff;border:1px solid ${p=>p.$focused?'#0f172a':'#e2e8f0'};border-radius:16px;
  display:flex;flex-direction:column;
  box-shadow:${p=>p.$focused?'0 0 0 3px rgba(15,23,42,0.06)':'0 1px 6px rgba(0,0,0,0.04)'};
  transition:border-color 0.2s,box-shadow 0.2s;overflow:hidden;
`;
const NoteCardHeader = styled.div`
  padding:0.75rem 1rem 0.5rem;display:flex;align-items:center;gap:0.5rem;border-bottom:1px solid #f8fafc;
`;
const NoteTagBadge = styled.span`
  font-size:0.6rem;font-weight:800;text-transform:uppercase;letter-spacing:0.06em;
  padding:0.2rem 0.5rem;border-radius:5px;
  background:${p=>p.$bg||'#f1f5f9'};color:${p=>p.$color||'#64748b'};
`;
const NoteTitle = styled.input`
  flex:1;border:none;background:transparent;font-family:'Space Grotesk',sans-serif;
  font-size:0.88rem;font-weight:700;color:#0f172a;outline:none;
  &::placeholder{color:#cbd5e1;font-weight:500;}
`;
const NoteToolbar = styled.div`
  display:flex;align-items:center;gap:2px;padding:0.35rem 0.75rem;
  background:#f8fafc;border-bottom:1px solid #f1f5f9;flex-wrap:wrap;
`;
const ToolbarBtn = styled.button`
  width:28px;height:28px;border-radius:6px;border:none;
  background:${p=>p.$active?'#e2e8f0':'transparent'};
  color:${p=>p.$active?'#0f172a':'#94a3b8'};
  display:flex;align-items:center;justify-content:center;font-size:0.75rem;
  cursor:pointer;transition:all 0.15s;
  &:hover{background:#e2e8f0;color:#0f172a;}
`;
const ToolbarDivider = styled.div`width:1px;height:16px;background:#e2e8f0;margin:0 2px;`;
const TagSelector = styled.select`
  border:none;background:transparent;font-size:0.72rem;font-weight:700;
  color:#64748b;cursor:pointer;outline:none;padding:0.15rem 0.3rem;border-radius:4px;
  &:hover{background:#e2e8f0;}
`;
const NoteBody = styled.div`
  padding:0.75rem 1rem;flex:1;min-height:120px;
  font-size:0.88rem;color:#0f172a;line-height:1.7;outline:none;
  white-space:pre-wrap;word-break:break-word;overflow-y:auto;
  &:empty::before{content:attr(data-placeholder);color:#cbd5e1;pointer-events:none;}
  b,strong{font-weight:700;}i,em{font-style:italic;}
  ul{padding-left:1.25rem;margin:0.25rem 0;}li{margin-bottom:0.2rem;}
  @media(max-width:640px){font-size:1rem;min-height:100px;}
`;
const NoteMeta    = styled.div`
  display:flex;justify-content:space-between;align-items:center;
  padding:0.5rem 1rem 0.65rem;border-top:1px solid #f8fafc;
`;
const NoteDate    = styled.span`font-size:0.62rem;font-weight:600;color:#cbd5e1;`;
const NoteActions = styled.div`display:flex;align-items:center;gap:0.35rem;`;
const AIBtn       = styled.button`
  display:flex;align-items:center;gap:0.3rem;padding:0.3rem 0.65rem;border-radius:6px;
  border:1px solid #e2e8f0;background:#ffffff;color:#64748b;font-size:0.7rem;font-weight:700;
  cursor:pointer;transition:all 0.15s;
  &:hover{border-color:#10b981;color:#10b981;background:#f0fdf4;}
  &:disabled{opacity:0.5;cursor:not-allowed;}
`;
const DeleteNoteBtn = styled.button`
  background:transparent;border:none;color:#e2e8f0;cursor:pointer;font-size:0.78rem;
  padding:0.3rem;border-radius:5px;transition:all 0.15s;
  &:hover{color:#ef4444;background:#fef2f2;}
`;
const AIPanel = styled(motion.div)`
  margin:0 1rem 0.75rem;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;background:#fafafa;
`;
const AIPanelHeader = styled.div`
  display:flex;align-items:center;justify-content:space-between;padding:0.65rem 0.9rem;background:#0f172a;
`;
const AIPanelTitle = styled.div`
  font-size:0.72rem;font-weight:800;color:#ffffff;display:flex;align-items:center;gap:0.4rem;letter-spacing:0.02em;
  span{color:#4ade80;}
`;
const AIActionBtn = styled.button`
  padding:0.25rem 0.6rem;border-radius:5px;border:1px solid rgba(255,255,255,0.15);
  background:rgba(255,255,255,0.08);color:rgba(255,255,255,0.75);font-size:0.65rem;font-weight:700;
  cursor:pointer;transition:all 0.15s;white-space:nowrap;
  &:hover{background:rgba(255,255,255,0.18);color:#fff;}
`;
const AIPanelBody = styled.div`
  padding:0.85rem 0.9rem;font-size:0.8rem;color:#374151;line-height:1.7;white-space:pre-wrap;min-height:60px;
`;
const AIThinking = styled.div`
  display:flex;align-items:center;gap:0.5rem;color:#94a3b8;font-size:0.78rem;font-style:italic;padding:0.85rem 0.9rem;
`;
const EmptyJournal = styled.div`
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  padding:4rem 2rem;text-align:center;color:#94a3b8;gap:1rem;
  svg{font-size:2rem;opacity:0.3;}p{font-size:0.85rem;margin:0;line-height:1.5;}
`;

/* ── auth modal ─────────────────────────────────────── */
const ModalOverlay = styled(motion.div)`
  position:fixed;inset:0;z-index:2000;background:rgba(2,6,23,0.6);backdrop-filter:blur(6px);
  display:flex;align-items:center;justify-content:center;padding:1rem;
`;
const ModalCard = styled(motion.div)`
  background:#ffffff;border-radius:20px;padding:2.5rem 2rem 2rem;
  width:100%;max-width:400px;box-shadow:0 24px 64px rgba(0,0,0,0.18);
  display:flex;flex-direction:column;align-items:center;text-align:center;gap:0;position:relative;
`;
const ModalClose    = styled.button`
  position:absolute;top:1rem;right:1rem;background:rgba(15,23,42,0.06);border:none;
  width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;
  font-size:0.85rem;color:#64748b;cursor:pointer;transition:all 0.15s;
  &:hover{background:rgba(15,23,42,0.1);color:#0f172a;}
`;
const ModalIcon     = styled.div`
  width:60px;height:60px;border-radius:18px;
  background:linear-gradient(135deg,#0f172a 0%,#1e293b 100%);
  display:flex;align-items:center;justify-content:center;font-size:1.5rem;margin-bottom:1.25rem;
  box-shadow:0 8px 24px rgba(15,23,42,0.15);
`;
const ModalTitle    = styled.h2`font-family:'Space Grotesk',sans-serif;font-size:1.35rem;font-weight:800;color:#0f172a;margin:0 0 0.5rem;letter-spacing:-0.02em;`;
const ModalDesc     = styled.p`font-size:0.88rem;color:#64748b;line-height:1.6;margin:0 0 1.75rem;`;
const ModalPerks    = styled.div`display:flex;flex-direction:column;gap:0.5rem;width:100%;margin-bottom:1.75rem;`;
const ModalPerk     = styled.div`
  display:flex;align-items:center;gap:0.6rem;font-size:0.82rem;color:#374151;font-weight:500;
  background:#f8fafc;border-radius:8px;padding:0.6rem 0.75rem;text-align:left;
`;
const ModalSignInBtn  = styled.button`
  width:100%;padding:0.85rem;background:#0f172a;color:#ffffff;border:none;border-radius:12px;
  font-size:0.95rem;font-weight:700;cursor:pointer;transition:all 0.2s;margin-bottom:0.65rem;
  &:hover{background:#15803d;}
`;
const ModalCreateBtn  = styled.button`
  width:100%;padding:0.75rem;background:transparent;color:#0f172a;
  border:1.5px solid rgba(15,23,42,0.15);border-radius:12px;font-size:0.88rem;font-weight:600;
  cursor:pointer;transition:all 0.2s;
  &:hover{border-color:rgba(15,23,42,0.35);background:rgba(15,23,42,0.03);}
`;
const ModalNote = styled.p`font-size:0.72rem;color:#94a3b8;margin:0.75rem 0 0;`;

/* ── constants ──────────────────────────────────────── */
const ASSET_TYPES = [
  { id:'Stocks',        label:'Stocks',        border:'rgba(34,197,94,0.5)',  activeBg:'rgba(34,197,94,0.1)',  activeColor:'#10b981' },
  { id:'ETFs',          label:'ETFs',           border:'rgba(59,130,246,0.5)', activeBg:'rgba(59,130,246,0.1)', activeColor:'#3b82f6' },
  { id:'Commodities',   label:'Commodities',    border:'rgba(234,179,8,0.5)',  activeBg:'rgba(234,179,8,0.1)',  activeColor:'#ca8a04' },
  { id:'Crypto',        label:'Crypto',         border:'rgba(251,146,60,0.5)', activeBg:'rgba(251,146,60,0.1)', activeColor:'#f97316' },
  { id:'Options Plays', label:'Options Plays',  border:'rgba(167,139,250,0.5)',activeBg:'rgba(167,139,250,0.1)',activeColor:'#8b5cf6' },
];
const SECTORS = ['Technology','Health Care','Financials','Energy','Consumer','Industrials','Materials','Utilities'];

const STANCE_CONFIG = {
  watch:       { color:'#f59e0b', label:'Watch',       icon:'👁' },
  caution:     { color:'#ef4444', label:'Caution',     icon:'⚠️' },
  opportunity: { color:'#10b981', label:'Opportunity', icon:'✅' },
};

const SENTIMENT_COLORS = {
  'Bullish':           { dot:'#10b981', bg:'#dcfce7', color:'#15803d', border:'#bbf7d0' },
  'Somewhat-Bullish':  { dot:'#34d399', bg:'#d1fae5', color:'#059669', border:'#a7f3d0' },
  'Neutral':           { dot:'#94a3b8', bg:'#f1f5f9', color:'#64748b', border:'#e2e8f0' },
  'Somewhat-Bearish':  { dot:'#fb923c', bg:'#fff7ed', color:'#c2410c', border:'#fed7aa' },
  'Bearish':           { dot:'#ef4444', bg:'#fee2e2', color:'#dc2626', border:'#fecaca' },
};

const normaliseAssetType = (t='') => {
  const VALID = ['Stocks','ETFs','Commodities','Crypto','Options Plays'];
  if (VALID.includes(t)) return t;
  const s = t.toLowerCase();
  if (s.includes('etf'))    return 'ETFs';
  if (s.includes('crypto')||s.includes('coin')||s.includes('token')) return 'Crypto';
  if (s.includes('option')) return 'Options Plays';
  if (s.includes('commodi')) return 'Commodities';
  return 'Stocks';
};

function sentimentColor(label) {
  return SENTIMENT_COLORS[label] || SENTIMENT_COLORS['Neutral'];
}

/* ── component ──────────────────────────────────────── */
export default function Dashboard() {
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error,      setError]      = useState(null);
  const [brief,      setBrief]      = useState(null);
  const [briefMode,  setBriefMode]  = useState('longTerm');
  const { user } = useAuth();
  const navigate = useNavigate();

  const [deepRunning,  setDeepRunning]  = useState(false);
  const [deepProgress, setDeepProgress] = useState(0);
  const [deepBatch,    setDeepBatch]    = useState(0);
  const [deepResult,   setDeepResult]   = useState(null);
  const [deepError,    setDeepError]    = useState(null);
  const [showPrefs,    setShowPrefs]    = useState(false);
  const [showAuthModal,setShowAuthModal]= useState(false);
  const [filterType,   setFilterType]   = useState('All');
  const [filterAsset,  setFilterAsset]  = useState('All');
  const [expandedRows, setExpandedRows] = useState({});
  const [selectedRow,  setSelectedRow]  = useState(null);

  // tabs: 'picks' | 'brief' | 'news' | 'sentiment' | 'journal'
  const [dashTab, setDashTab] = useState('picks');

  // news tab state
  const [newsQuery,      setNewsQuery]      = useState('');
  const [newsSourceFilter, setNewsSourceFilter] = useState('All');
  const [headlineInsights, setHeadlineInsights] = useState({});
  const [headlineLoading,  setHeadlineLoading]  = useState({});

  // sentiment tab state
  const [sentimentData, setSentimentData] = useState([]);

  // journal
  const [notes,       setNotes]       = useState(() => {
    try { const s=localStorage.getItem('bv_notes_v2'); return s?JSON.parse(s):[]; } catch{return [];}
  });
  const [focusedNote, setFocusedNote] = useState(null);
  const [aiState,     setAiState]     = useState({});

  const [prefs, setPrefs] = useState({
    riskLevel:'moderate', horizon:'medium', style:'balanced', sectors:[],
  });
  const [activeTypes, setActiveTypes] = useState(['Stocks','ETFs','Commodities','Crypto','Options Plays']);

  useEffect(() => { localStorage.setItem('bv_notes_v2', JSON.stringify(notes)); }, [notes]);

  const addNote = () => {
    const n = { id:Date.now(), title:'', text:'', tag:'trade',
      date:new Date().toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'}) };
    setNotes(p=>[n,...p]); setFocusedNote(n.id);
  };
  const updateNote = (id,field,value) => setNotes(p=>p.map(n=>n.id===id?{...n,[field]:value}:n));
  const deleteNote = (id) => {
    setNotes(p=>p.filter(n=>n.id!==id));
    setAiState(p=>{const s={...p};delete s[id];return s;});
  };

  const runJournalAI = useCallback(async (noteId, action) => {
    const note = notes.find(n=>n.id===noteId);
    if (!note?.text?.trim()) return;
    setAiState(p=>({...p,[noteId]:{loading:true,result:null,action}}));
    try {
      const {result} = await api.journalAssist(note.text, action);
      setAiState(p=>({...p,[noteId]:{loading:false,result,action}}));
    } catch {
      setAiState(p=>({...p,[noteId]:{loading:false,result:'Could not connect to AI. Please try again.',action}}));
    }
  }, [notes]);

  const toggleSector = s => setPrefs(p=>({...p,sectors:p.sectors.includes(s)?p.sectors.filter(x=>x!==s):[...p.sectors,s]}));

  const load = useCallback(async (isRefresh) => {
    if (isRefresh) setRefreshing(true); else setLoading(true);
    setError(null);
    try {
      const data = await api.getDailyBrief({ refresh:!!isRefresh });
      setBrief(data);
      // Extract sentiment data from ticker sentiments embedded in brief
      if (data?.tickerSentiments) {
        setSentimentData(data.tickerSentiments);
      }
    } catch(e) {
      setError(e.message||'Could not load insights');
    } finally {
      setLoading(false); setRefreshing(false);
    }
  }, []);

  useEffect(()=>{ load(false); },[load]);

  // Load previously saved analysis when user signs in
  useEffect(() => {
    if (!user) return;
    api.getSavedAnalysis().then(({ saved }) => {
      if (saved) setDeepResult(saved);
    }).catch(() => {});
  }, [user]);

  const TOTAL_BATCHES = 8;

  const runDeepAnalysis = useCallback(async () => {
    if (!user) { setShowAuthModal(true); return; }
    setDeepRunning(true); setDeepProgress(0); setDeepBatch(0);
    setDeepError(null); setDeepResult(null);
    try {
      let completed = 0;
      const results = [];

      for (let i=1; i<=TOTAL_BATCHES; i++) {
        setDeepBatch(i);
        try {
          const res = await api.runDeepAnalysis({
            ...prefs, assetTypes:activeTypes, batchIndex:i, totalBatches:TOTAL_BATCHES
          });
          if (res) results.push(res);
        } catch(err) {
          console.error(`Batch ${i} failed:`, err.message);
        }
        completed++;
        setDeepProgress(Math.round((completed/TOTAL_BATCHES)*100));
      }

      if (results.length===0) throw new Error('All analysis batches failed');

      const combinedPicks = [];
      const combinedSectorBreakdown = {};
      const seenTickers = new Set();
      results.forEach(res=>{
        if (res.picks) res.picks.forEach(p=>{
          if (!seenTickers.has(p.ticker)) { combinedPicks.push(p); seenTickers.add(p.ticker); }
        });
        if (res.sectorBreakdown) Object.assign(combinedSectorBreakdown, res.sectorBreakdown);
      });

      const mergedResult = {
        ...results[0],
        picks:combinedPicks,
        sectorBreakdown:combinedSectorBreakdown,
        generatedAt:new Date().toISOString(),
        batchesCompleted:results.length,
      };
      setDeepResult(mergedResult);
      setFilterType('All'); setFilterAsset('All');
      // Persist to DB (fire-and-forget — don't block UI)
      api.saveAnalysis(mergedResult, { ...prefs, assetTypes: activeTypes }).catch(() => {});
    } catch(e) {
      setDeepError(e.message||'Analysis failed');
    } finally {
      setDeepRunning(false);
    }
  }, [prefs, activeTypes, user]);

  const handleAnalyseHeadline = useCallback(async (key, title, source) => {
    if (headlineLoading[key]) return;
    setHeadlineLoading(p=>({...p,[key]:true}));
    try {
      const {insight} = await api.analyseHeadline(title, source);
      setHeadlineInsights(p=>({...p,[key]:insight}));
    } catch {
      setHeadlineInsights(p=>({...p,[key]:'Could not load analysis right now.'}));
    } finally {
      setHeadlineLoading(p=>({...p,[key]:false}));
    }
  }, [headlineLoading]);

  const updatedLabel = brief?.generatedAt
    ? new Date(brief.generatedAt).toLocaleTimeString(undefined,{timeStyle:'short'})
    : null;

  const copyPicksToNotes = useCallback(() => {
    if (!deepResult?.picks) return;
    const buys = deepResult.picks.filter(p=>['Buy','Strong Buy'].includes(p.action));
    const text = buys.length>0
      ? `Recommended buys from AI analysis:\n\n`+buys.map(p=>`• ${p.ticker} (${p.company}): ${p.action}\n  Thesis: ${p.thesis}\n  Risk: ${p.risk}`).join('\n\n')
      : `AI Analysis run at ${new Date(deepResult.generatedAt).toLocaleString()}.\nNo explicit Buy recommendations.`;
    const n = { id:Date.now(), title:`AI Recommendations - ${new Date().toLocaleDateString('en-GB',{day:'numeric',month:'short'})}`,
      text, tag:'review', date:new Date().toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'}) };
    setNotes(p=>[n,...p]); setFocusedNote(n.id); setDashTab('journal');
  }, [deepResult]);

  const rawPicks = deepResult?.picks||[];
  const confToPct   = c => c==='High'?85:c==='Medium'?65:45;
  const confToScore = c => c==='High'?82:c==='Medium'?61:34;

  const filteredPicks = useMemo(()=>rawPicks.filter(p=>{
    const actionOk = filterType==='All'
      ||(filterType==='Buy'&&(p.action==='Buy'||p.action==='Strong Buy'))
      ||(filterType==='Watch'&&p.action==='Watch')
      ||(filterType==='Avoid'&&(p.action==='Avoid'||p.action==='Reduce'));
    const assetOk = filterAsset==='All'||normaliseAssetType(p.assetType)===filterAsset;
    return actionOk&&assetOk;
  }),[rawPicks,filterType,filterAsset]);

  const counts = useMemo(()=>rawPicks.reduce((a,p)=>{a[p.action]=(a[p.action]||0)+1;return a;},{}), [rawPicks]);
  const avgConfidence = useMemo(()=>{
    if (!rawPicks.length) return null;
    return Math.round(rawPicks.reduce((s,p)=>s+confToPct(p.confidence),0)/rawPicks.length);
  },[rawPicks]);

  const generateChartData = useCallback((trend,points)=>{
    let val=100; const slope=trend==='Uptrend'?1.5:trend==='Downtrend'?-1.5:0;
    return Array.from({length:points}).map((_,i)=>{val+=(Math.random()*4-2)+slope;return{name:i,value:val};});
  },[]);

  // Unique sources for news filter
  const allHeadlines = brief?.headlines||[];
  const uniqueSources = useMemo(()=>{
    const s=new Set(allHeadlines.map(h=>h.source).filter(Boolean));
    return ['All',...Array.from(s).sort()];
  },[allHeadlines]);

  const filteredNews = useMemo(()=>{
    let h = allHeadlines;
    if (newsSourceFilter!=='All') h=h.filter(x=>x.source===newsSourceFilter);
    if (newsQuery.trim()) {
      const q=newsQuery.toLowerCase();
      h=h.filter(x=>(x.title||'').toLowerCase().includes(q)||(x.source||'').toLowerCase().includes(q)||(x.summary||'').toLowerCase().includes(q));
    }
    return h;
  },[allHeadlines,newsSourceFilter,newsQuery]);

  // Build sentiment rows from brief response
  const sentimentRows = useMemo(()=>{
    if (!brief?.tickerSentimentTable) return [];
    // Parse text table into rows if provided, else empty
    return [];
  },[brief]);

  // ── render ──────────────────────────────────────────
  return (
    <>
    <Page>
      {/* ── top header ── */}
      <TopHeader>
        <HeaderLeft>
          <Brand>BloomVest</Brand><Slash>/</Slash>
          <PageTitle>Investment Intelligence</PageTitle>
        </HeaderLeft>

        <FilterGroup>
          {['All','Buy','Watch','Avoid'].map(f=>{
            const label = f==='Watch'?'Hold':f;
            const af = filterAsset==='All'?rawPicks:rawPicks.filter(p=>normaliseAssetType(p.assetType)===filterAsset);
            const count = f==='All'?af.length
              :f==='Buy'?af.filter(p=>['Buy','Strong Buy'].includes(p.action)).length
              :af.filter(p=>p.action===f).length;
            return (
              <FilterBtn key={f} type="button" $active={filterType===f} onClick={()=>setFilterType(f)}>
                <FilterDot $color={f==='Buy'?'#10b981':f==='Watch'?'#f59e0b':f==='Avoid'?'#ef4444':'#cbd5e1'}/>
                {label}{count>0?` ${count}`:''}
              </FilterBtn>
            );
          })}
        </FilterGroup>

        <HeaderRight>
          <LastRunInfo>LAST RUN <span>{updatedLabel||'N/A'}</span></LastRunInfo>
          <RefreshBtn type="button" onClick={()=>load(true)} disabled={loading||refreshing}>
            <FaSyncAlt className={refreshing?'spin':''} />
          </RefreshBtn>
          <PrefsToggleBtn type="button" $active={showPrefs} onClick={()=>setShowPrefs(!showPrefs)}>
            <FaFilter /> Preferences
          </PrefsToggleBtn>
          <RunBtn type="button" onClick={runDeepAnalysis} disabled={deepRunning}>
            <FaMagic/>{deepRunning?`Running batch ${deepBatch}/${TOTAL_BATCHES}...`:'Run AI Analysis'}
          </RunBtn>
        </HeaderRight>
      </TopHeader>

      {/* ── tabs ── */}
      <DashTabBar>
        <DashTabBtn $active={dashTab==='picks'}     onClick={()=>setDashTab('picks')}><FaMagic/>AI Picks</DashTabBtn>
        <DashTabBtn $active={dashTab==='brief'}     onClick={()=>setDashTab('brief')}><FaCalendarAlt/>Market Brief</DashTabBtn>
        <DashTabBtn $active={dashTab==='news'}      onClick={()=>setDashTab('news')}><FaNewspaper/>News Feed</DashTabBtn>
        <DashTabBtn $active={dashTab==='sentiment'} onClick={()=>setDashTab('sentiment')}><FaSignal/>Sentiment</DashTabBtn>
        <DashTabBtn $active={dashTab==='journal'}   onClick={()=>setDashTab('journal')}><FaBookOpen/>Journal</DashTabBtn>
      </DashTabBar>

      {/* ── prefs panel ── */}
      <AnimatePresence>
        {showPrefs && (
          <PrefsWrap initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} transition={{duration:0.2}}>
            <PrefsGrid>
              <PrefGroup>
                <PrefLabel>Risk Profile</PrefLabel>
                <PrefSelect value={prefs.riskLevel} onChange={e=>setPrefs(p=>({...p,riskLevel:e.target.value}))}>
                  <option value="conservative">Conservative</option>
                  <option value="moderate">Moderate</option>
                  <option value="aggressive">Aggressive</option>
                </PrefSelect>
              </PrefGroup>
              <PrefGroup>
                <PrefLabel>Time Horizon</PrefLabel>
                <PrefSelect value={prefs.horizon} onChange={e=>setPrefs(p=>({...p,horizon:e.target.value}))}>
                  <option value="short">Short (0–1 yr)</option>
                  <option value="medium">Medium (1–3 yrs)</option>
                  <option value="long">Long (3+ yrs)</option>
                </PrefSelect>
              </PrefGroup>
              <PrefGroup>
                <PrefLabel>Style</PrefLabel>
                <PrefSelect value={prefs.style} onChange={e=>setPrefs(p=>({...p,style:e.target.value}))}>
                  <option value="balanced">Balanced</option>
                  <option value="growth">Aggressive Growth</option>
                  <option value="value">Value Focused</option>
                  <option value="income">Dividend/Income</option>
                </PrefSelect>
              </PrefGroup>
              <PrefGroup style={{gridColumn:'1/-1'}}>
                <PrefLabel>Target Sectors (optional)</PrefLabel>
                <SectorsWrap>
                  {SECTORS.map(s=>(
                    <SectorChip key={s} type="button" $active={prefs.sectors.includes(s)} onClick={()=>toggleSector(s)}>{s}</SectorChip>
                  ))}
                </SectorsWrap>
              </PrefGroup>
              <PrefGroup style={{gridColumn:'1/-1'}}>
                <PrefLabel>Asset Classes to Include</PrefLabel>
                <SectorsWrap>
                  {ASSET_TYPES.map(t=>(
                    <SectorChip key={t.id} type="button"
                      $active={activeTypes.includes(t.id)}
                      onClick={()=>setActiveTypes(prev=>prev.includes(t.id)?prev.filter(x=>x!==t.id):[...prev,t.id])}
                    >{t.label}</SectorChip>
                  ))}
                </SectorsWrap>
              </PrefGroup>
            </PrefsGrid>
          </PrefsWrap>
        )}
      </AnimatePresence>

      {/* ── progress bar ── */}
      <AnimatePresence>
        {deepRunning && (
          <ProgressContainer initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}}>
            <ProgressText>Batch {deepBatch} of {TOTAL_BATCHES}</ProgressText>
            <ProgressBarWrap>
              <ProgressFill initial={{width:0}} animate={{width:`${deepProgress}%`}} transition={{duration:0.5}}/>
            </ProgressBarWrap>
            <ProgressText style={{minWidth:40,textAlign:'right'}}>{deepProgress}%</ProgressText>
          </ProgressContainer>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════
          AI PICKS TAB
      ══════════════════════════════════════════════ */}
      {dashTab==='picks' && (
        <>
          <AssetTypeRow>
            <TypeLabel>Asset Filter:</TypeLabel>
            {ASSET_TYPES.map(t=>(
              <TypeChip key={t.id} type="button"
                $active={filterAsset===t.id}
                $bg={t.activeBg} $color={t.activeColor}
                onClick={()=>setFilterAsset(prev=>prev===t.id?'All':t.id)}
              >{t.label}</TypeChip>
            ))}
          </AssetTypeRow>

          <SummaryBar>
            <SumItem><SumLabel>Assets Analyzed</SumLabel><SumValue>{rawPicks.length}</SumValue></SumItem>
            <SumItem><SumLabel>Buys</SumLabel><SumValue $color="#10b981">{(counts['Buy']||0)+(counts['Strong Buy']||0)}</SumValue></SumItem>
            <SumItem><SumLabel>Holds</SumLabel><SumValue $color="#f59e0b">{counts['Watch']||0}</SumValue></SumItem>
            <SumItem><SumLabel>Avoids</SumLabel><SumValue $color="#ef4444">{(counts['Avoid']||0)+(counts['Reduce']||0)}</SumValue></SumItem>
            <SumItem><SumLabel>Avg. Confidence</SumLabel><SumValue>{avgConfidence!==null?`${avgConfidence}%`:'—'}</SumValue></SumItem>
          </SummaryBar>

          <Shell>
            <MainCol>
              <TableHeader>
                <THLeft>AI Picks <span>{filteredPicks.length} results{deepResult?.batchesCompleted?` · ${deepResult.batchesCompleted} batches`:''}</span></THLeft>
                <THRight>
                  {deepResult && (
                    <>
                      <CopyPicksBtn type="button" onClick={copyPicksToNotes}><FaBookOpen/> Copy Buys to Journal</CopyPicksBtn>
                      <THGroup style={{color:'#10b981'}}>Complete · {new Date(deepResult.generatedAt).toLocaleTimeString(undefined,{timeStyle:'short'})}</THGroup>
                    </>
                  )}
                </THRight>
              </TableHeader>

              <TableWrap>
                <THead>
                  <THCell>Asset</THCell>
                  <THCell>Verdict</THCell>
                  <THCell>AI Confidence</THCell>
                  <THCell>Thesis (click to expand)</THCell>
                  <THCell>Main Risk</THCell>
                  <THCell>Trend</THCell>
                </THead>

                {!deepResult && !deepRunning && (
                  <EmptyState>
                    <FaMagic/>
                    <EmptyTitle>No analysis yet</EmptyTitle>
                    <EmptyDesc>Set preferences above and click <strong>Run AI Analysis</strong> to generate live picks across {TOTAL_BATCHES} batches of market data.</EmptyDesc>
                  </EmptyState>
                )}
                {deepRunning && (
                  <EmptyState>
                    <SpinnerGreen/>
                    <EmptyTitle>Analysing markets… {deepProgress}%</EmptyTitle>
                    <EmptyDesc>Reading headlines, sentiment data, and Finnhub across {TOTAL_BATCHES} analysis batches</EmptyDesc>
                  </EmptyState>
                )}
                {deepError && (
                  <EmptyState>
                    <FaExclamationTriangle style={{color:'#ef4444'}}/>
                    <EmptyTitle style={{color:'#ef4444'}}>Analysis failed</EmptyTitle>
                    <EmptyDesc>{deepError}</EmptyDesc>
                  </EmptyState>
                )}

                {filteredPicks.map((pick,i)=>{
                  const isBuy   = ['Buy','Strong Buy'].includes(pick.action);
                  const isAvoid = ['Avoid','Reduce'].includes(pick.action);
                  const vColor  = isBuy?'#10b981':isAvoid?'#ef4444':'#f59e0b';
                  const vBg     = isBuy?'#d1fae5':isAvoid?'#fee2e2':'#fef3c7';
                  const isSelected = selectedRow===i;
                  const isExpanded = expandedRows[i];

                  return (
                    <React.Fragment key={i}>
                      <TRow $selected={isSelected} onClick={()=>setSelectedRow(isSelected?null:i)}>
                        <TCell>
                          <AssetSymbol>{pick.ticker} <span style={{fontWeight:400,color:'#94a3b8',fontSize:'0.75rem'}}>{pick.company}</span></AssetSymbol>
                          <MiniTags>
                            <MiniTag>{normaliseAssetType(pick.assetType)}</MiniTag>
                            <MiniTag>{pick.fit}</MiniTag>
                            <MiniTag>{pick.horizon}</MiniTag>
                          </MiniTags>
                        </TCell>
                        <TCell>
                          <VerdictBadge $bg={vBg} $color={vColor}>
                            <FilterDot $color={vColor} style={{width:4,height:4}}/> {pick.action}
                          </VerdictBadge>
                        </TCell>
                        <TCell>
                          <ConfRow>
                            <ConfScore>{confToScore(pick.confidence)}</ConfScore>
                            <DeltaText $pos={pick.confidence==='High'}>/ 100</DeltaText>
                          </ConfRow>
                          <ConfBarWrap><ConfBarFill $color={vColor} $pct={confToPct(pick.confidence)}/></ConfBarWrap>
                          <div style={{fontSize:'0.6rem',color:'#94a3b8',marginTop:'2px'}}>{pick.confidence} confidence</div>
                        </TCell>
                        <TCell>
                          <ThesisText $expanded={isExpanded} onClick={e=>{e.stopPropagation();setExpandedRows(p=>({...p,[i]:!p[i]}));}}>
                            {pick.thesis}
                          </ThesisText>
                          <ExpandBtn onClick={e=>{e.stopPropagation();setExpandedRows(p=>({...p,[i]:!p[i]}));}}>
                            {isExpanded?<><FaChevronUp/>less</>:<><FaChevronDown/>more</>}
                          </ExpandBtn>
                        </TCell>
                        <TCell>
                          <ThesisText $expanded={isExpanded} style={{color:'#ef4444'}}>{pick.risk}</ThesisText>
                        </TCell>
                        <TCell>
                          <SparkWrap>
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={generateChartData(pick.trend,10)}>
                                <Area type="monotone" dataKey="value" stroke={vColor} fill={vColor} fillOpacity={0.1} strokeWidth={1.5} isAnimationActive={false}/>
                              </AreaChart>
                            </ResponsiveContainer>
                          </SparkWrap>
                        </TCell>
                      </TRow>

                      {/* expanded detail drawer */}
                      <AnimatePresence>
                        {isSelected && (
                          <motion.div key={`detail-${i}`} initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} exit={{opacity:0,height:0}} transition={{duration:0.2}}>
                            <DetailDrawer>
                              <DetailBlock>
                                <DetailLabel>Entry Signal</DetailLabel>
                                <DetailValue>{pick.entrySignal||'—'}</DetailValue>
                              </DetailBlock>
                              <DetailBlock>
                                <DetailLabel>Price Context</DetailLabel>
                                <DetailValue>{pick.priceContext||'—'}</DetailValue>
                              </DetailBlock>
                              <DetailBlock>
                                <DetailLabel>Trend</DetailLabel>
                                <DetailValue>{pick.trend} · {pick.trendStrength}</DetailValue>
                              </DetailBlock>
                              <DetailBlock>
                                <DetailLabel>Catalysts</DetailLabel>
                                <CatalystList>
                                  {(pick.catalysts||[]).map((c,ci)=><CatalystItem key={ci}>{c}</CatalystItem>)}
                                </CatalystList>
                              </DetailBlock>
                              <DetailBlock>
                                <DetailLabel>Sector</DetailLabel>
                                <DetailValue>{pick.sector||'—'}</DetailValue>
                              </DetailBlock>
                              <DetailBlock>
                                <DetailLabel>Horizon</DetailLabel>
                                <DetailValue>{pick.horizon||'—'}</DetailValue>
                              </DetailBlock>
                            </DetailDrawer>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </React.Fragment>
                  );
                })}
              </TableWrap>

              {deepResult?.disclaimer && (
                <div style={{padding:'0.75rem 1.25rem',fontSize:'0.68rem',color:'#94a3b8',borderTop:'1px solid #f1f5f9',lineHeight:1.5}}>
                  {deepResult.disclaimer}
                </div>
              )}
            </MainCol>
          </Shell>
        </>
      )}

      {/* ══════════════════════════════════════════════
          MARKET BRIEF TAB
      ══════════════════════════════════════════════ */}
      {dashTab==='brief' && (
        <BriefWrap>
          {loading && <EmptyState><SpinnerGreen/><EmptyTitle>Loading brief…</EmptyTitle></EmptyState>}
          {error && <EmptyState><FaExclamationTriangle style={{color:'#ef4444'}}/><EmptyTitle>{error}</EmptyTitle></EmptyState>}
          {brief && (
            <>
              <BriefHero>
                <BriefTheme>{brief.dayTheme||'Markets in focus'}</BriefTheme>
                <BriefNarrative>{brief.narrative}</BriefNarrative>
                <BriefMeta>Generated {updatedLabel} · Sources: RSS · Alpha Vantage · Finnhub</BriefMeta>
              </BriefHero>

              {/* signals */}
              <div style={{marginBottom:'0.5rem'}}>
                <div style={{fontSize:'0.65rem',fontWeight:800,textTransform:'uppercase',letterSpacing:'0.1em',color:'#94a3b8',marginBottom:'0.75rem'}}>
                  Market Signals
                </div>
                <SignalsGrid>
                  {(brief.signals||[]).map((s,i)=>{
                    const cfg = STANCE_CONFIG[s.stance]||STANCE_CONFIG.watch;
                    return (
                      <SignalCard key={i} $color={cfg.color} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:i*0.05}}>
                        <SignalStance $color={cfg.color}>{cfg.icon} {cfg.label}</SignalStance>
                        <SignalTitle>{s.title}</SignalTitle>
                        <SignalDetail>{s.detail}</SignalDetail>
                      </SignalCard>
                    );
                  })}
                </SignalsGrid>
              </div>

              {/* investment modes */}
              <ModesSection>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'0.75rem',flexWrap:'wrap',gap:'0.5rem'}}>
                  <div style={{fontSize:'0.65rem',fontWeight:800,textTransform:'uppercase',letterSpacing:'0.1em',color:'#94a3b8'}}>Investment Ideas</div>
                  <ModeToggle>
                    <ModeBtn $active={briefMode==='longTerm'} onClick={()=>setBriefMode('longTerm')}><FaGem/>Long Term</ModeBtn>
                    <ModeBtn $active={briefMode==='shortTerm'} onClick={()=>setBriefMode('shortTerm')}><FaBolt/>Short Term</ModeBtn>
                  </ModeToggle>
                </div>
                <IdeasGrid>
                  {((brief.investmentModes||{})[briefMode]||[]).map((idea,i)=>(
                    <IdeaCard key={i} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:i*0.04}}>
                      <IdeaTicker>{idea.ticker}</IdeaTicker>
                      <IdeaAsset>{idea.asset} · {idea.vehicle}</IdeaAsset>
                      <div>
                        <IdeaBadge $bg="#dcfce7" $color="#15803d">{idea.fit}</IdeaBadge>
                        <IdeaBadge $bg="#eff6ff" $color="#2563eb">{idea.horizon}</IdeaBadge>
                      </div>
                      <IdeaRow><IdeaLabel>Why:</IdeaLabel>{idea.reason}</IdeaRow>
                      <IdeaRow><IdeaLabel>Now:</IdeaLabel>{idea.whyNow}</IdeaRow>
                      <IdeaRisk><strong>Risk:</strong> {idea.risk}</IdeaRisk>
                    </IdeaCard>
                  ))}
                </IdeasGrid>

                {brief.investmentModes?.methodology && (
                  <div style={{marginTop:'1rem',padding:'0.85rem 1rem',background:'#f8fafc',borderRadius:'10px',fontSize:'0.78rem',color:'#64748b',lineHeight:1.6}}>
                    <strong style={{color:'#0f172a'}}>Methodology:</strong> {brief.investmentModes.methodology}
                  </div>
                )}
                {brief.investmentModes?.disclaimer && (
                  <div style={{marginTop:'0.5rem',fontSize:'0.68rem',color:'#94a3b8',lineHeight:1.5}}>
                    {brief.investmentModes.disclaimer}
                  </div>
                )}
              </ModesSection>
            </>
          )}
        </BriefWrap>
      )}

      {/* ══════════════════════════════════════════════
          NEWS FEED TAB
      ══════════════════════════════════════════════ */}
      {dashTab==='news' && (
        <NewsFeedWrap>
          <NewsFeedHeader>
            <NewsFeedTitle>
              News Feed <span>{filteredNews.length} articles</span>
            </NewsFeedTitle>
            <NewsSearch
              placeholder="Search headlines, sources..."
              value={newsQuery}
              onChange={e=>setNewsQuery(e.target.value)}
            />
          </NewsFeedHeader>

          {/* source filter chips */}
          <SourceFilterRow>
            {uniqueSources.slice(0,30).map(s=>(
              <SourceFilterChip key={s} type="button" $active={newsSourceFilter===s} onClick={()=>setNewsSourceFilter(s)}>
                {s}
              </SourceFilterChip>
            ))}
          </SourceFilterRow>

          <NewsGrid>
            {filteredNews.length===0 && (
              <EmptyState>
                <FaNewspaper/>
                <EmptyTitle>No headlines yet</EmptyTitle>
                <EmptyDesc>Headlines load with the daily brief. Click the refresh button to fetch the latest news.</EmptyDesc>
              </EmptyState>
            )}
            {filteredNews.map((h,idx)=>{
              const key = allHeadlines.indexOf(h);
              const sc = sentimentColor(h.sentiment);
              const insight = headlineInsights[key];
              const loading = headlineLoading[key];
              const tickers = h.tickers ? h.tickers.split(',').slice(0,5).map(t=>t.trim()).filter(Boolean) : [];

              return (
                <NewsItem key={key} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:Math.min(idx*0.015,0.3)}}>
                  <NewsItemTop>
                    {h.sentiment && <SentimentDot $color={sc.dot} title={h.sentiment}/>}
                    <NewsBadge>{h.source||'News'}</NewsBadge>
                    {h.pubDate && (
                      <span style={{fontSize:'0.6rem',color:'#94a3b8',whiteSpace:'nowrap',flexShrink:0,marginTop:'3px'}}>
                        {(()=>{
                          const diff=Date.now()-new Date(h.pubDate).getTime();
                          const mins=Math.floor(diff/60000);
                          const hrs=Math.floor(diff/3600000);
                          if(mins<60) return `${mins}m ago`;
                          if(hrs<24)  return `${hrs}h ago`;
                          return `${Math.floor(hrs/24)}d ago`;
                        })()}
                      </span>
                    )}
                    <NewsTitle href={h.link} target="_blank" rel="noopener noreferrer">{h.title}</NewsTitle>
                    {!insight && (
                      <NewsInsightBtn type="button" disabled={loading} onClick={()=>handleAnalyseHeadline(key,h.title,h.source)}>
                        {loading?<Spinner/>:<FaChartLine/>}
                        {loading?'…':'AI Insight'}
                      </NewsInsightBtn>
                    )}
                  </NewsItemTop>

                  {h.summary && <NewsSummary>{h.summary}</NewsSummary>}

                  {(tickers.length>0||h.sentiment) && (
                    <TickerPillRow>
                      {tickers.map((t,ti)=><TickerPill key={ti}>{t}</TickerPill>)}
                      {h.sentiment && (
                        <SentimentLabel $bg={sc.bg} $color={sc.color} $border={sc.border}>{h.sentiment}</SentimentLabel>
                      )}
                      {h.sentimentScore!=null && (
                        <SentimentLabel $bg="#f8fafc" $color="#64748b" $border="#e2e8f0">
                          score {h.sentimentScore>=0?'+':''}{Number(h.sentimentScore).toFixed(3)}
                        </SentimentLabel>
                      )}
                    </TickerPillRow>
                  )}

                  {insight && (
                    <NewsInsightBox initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} transition={{duration:0.2}}>
                      {insight}
                    </NewsInsightBox>
                  )}
                </NewsItem>
              );
            })}
          </NewsGrid>
        </NewsFeedWrap>
      )}

      {/* ══════════════════════════════════════════════
          SENTIMENT TAB
      ══════════════════════════════════════════════ */}
      {dashTab==='sentiment' && (
        <SentimentWrap>
          <SentimentHeader>
            <SentimentTitle>
              Ticker Sentiment
              {brief?.tickerSentiments?.length > 0
                ? <span>from Alpha Vantage — {brief.tickerSentiments.length} tickers</span>
                : deepResult?.picks?.length > 0
                  ? <span>from AI deep analysis picks</span>
                  : <span>extracted from news headlines</span>
              }
            </SentimentTitle>
            <RefreshBtn type="button" onClick={()=>load(true)} disabled={loading||refreshing} title="Refresh data">
              <FaSyncAlt className={refreshing?'spin':''}/>
            </RefreshBtn>
          </SentimentHeader>

          {(() => {
            let rows = [];
            let source = 'headlines';

            // Source 1: Alpha Vantage (most accurate — requires API key)
            if (brief?.tickerSentiments?.length > 0) {
              source = 'alphavantage';
              rows = brief.tickerSentiments.map(t => ({
                ticker: t.ticker,
                topLabel: t.label || 'Neutral',
                count: t.count,
                avgScore: t.avgScore,
                source: 'Alpha Vantage',
              }));
            }

            // Source 2: Deep analysis picks — map action → sentiment label
            if (rows.length === 0 && deepResult?.picks?.length > 0) {
              source = 'picks';
              const actionToLabel = { 'Strong Buy': 'Bullish', 'Buy': 'Somewhat-Bullish', 'Hold': 'Neutral', 'Sell': 'Somewhat-Bearish', 'Strong Sell': 'Bearish' };
              rows = deepResult.picks.map((p, i) => ({
                ticker: p.ticker,
                topLabel: actionToLabel[p.action] || 'Neutral',
                count: p.confidence ? Math.round(p.confidence) : (50 - i),
                avgScore: p.action==='Strong Buy'?0.35:p.action==='Buy'?0.18:p.action==='Hold'?0:p.action==='Sell'?-0.18:-0.35,
                source: 'AI Analysis',
                name: p.name,
                action: p.action,
                confidence: p.confidence,
              })).sort((a,b)=>b.count-a.count);
            }

            // Source 3: Regex-extract tickers from headline text
            if (rows.length === 0 && allHeadlines.length > 0) {
              source = 'headlines';
              const TICKER_RE = /\b([A-Z]{2,5})\b/g;
              // Common non-ticker uppercase words to skip
              const SKIP = new Set(['CEO','CFO','ETF','IPO','GDP','CPI','FED','SEC','FDA','API','AI','US','UK','EU','EV','PE','VC','VIX','SPY','QQQ','DXY','USD','EUR','GBP','JPY','BTC','ETH','AND','FOR','THE','NOT','BUT','ARE','HAS','NEW','OLD','INC','LLC','PLC','LTD']);
              const tickerMap = {};
              allHeadlines.forEach(h => {
                const matches = [...(h.title||'').matchAll(TICKER_RE)].map(m=>m[1]).filter(t=>!SKIP.has(t)&&t.length>=2&&t.length<=5);
                const hasBullish = /surge|soar|jump|gain|rise|rally|beat|record|high|bull/i.test(h.title);
                const hasBearish = /fall|drop|plunge|crash|miss|low|cut|warn|bear|decline|tumble/i.test(h.title);
                const sentLabel = hasBullish && !hasBearish ? 'Bullish' : hasBearish && !hasBullish ? 'Bearish' : 'Neutral';
                matches.forEach(ticker => {
                  if (!tickerMap[ticker]) tickerMap[ticker] = { ticker, count:0, bullish:0, bearish:0, neutral:0, source:'Headlines' };
                  tickerMap[ticker].count++;
                  tickerMap[ticker][sentLabel.toLowerCase()]++;
                });
              });
              rows = Object.values(tickerMap)
                .filter(t => t.count >= 2) // only tickers appearing 2+ times
                .map(t => {
                  const topLabel = t.bullish > t.bearish && t.bullish > t.neutral ? 'Bullish'
                    : t.bearish > t.bullish && t.bearish > t.neutral ? 'Bearish' : 'Neutral';
                  const avgScore = (t.bullish - t.bearish) / t.count;
                  return { ...t, topLabel, avgScore, source: 'Headlines' };
                })
                .sort((a,b) => b.count - a.count)
                .slice(0, 50);
            }

            if (rows.length === 0) return (
              <EmptyState>
                <FaSignal/>
                <EmptyTitle>No sentiment data yet</EmptyTitle>
                <EmptyDesc>Run the AI Deep Analysis or refresh the daily brief to populate sentiment data.</EmptyDesc>
              </EmptyState>
            );

            const maxCount = rows[0]?.count || 1;

            return (
              <>
                <div style={{fontSize:'0.7rem',color:'#94a3b8',marginBottom:'0.75rem',display:'flex',alignItems:'center',gap:'0.5rem'}}>
                  <span style={{background:'#f1f5f9',border:'1px solid #e2e8f0',borderRadius:4,padding:'2px 7px',fontWeight:600,color:'#64748b'}}>
                    {source === 'alphavantage' ? 'Alpha Vantage' : source === 'picks' ? 'AI Deep Analysis' : 'News Headlines'}
                  </span>
                  <span>{rows.length} tickers tracked</span>
                </div>
                <SentTable>
                  <SentTHead>
                    <SentTH>#</SentTH>
                    <SentTH>Ticker</SentTH>
                    <SentTH>{source==='picks'?'Confidence':'Mentions'}</SentTH>
                    <SentTH>Sentiment</SentTH>
                    <SentTH>Signal</SentTH>
                  </SentTHead>
                  {rows.map((row,i)=>{
                    const sc = sentimentColor(row.topLabel);
                    const pct = Math.min(100, Math.round((row.count/maxCount)*100));
                    return (
                      <SentTRow key={row.ticker} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*0.02}}>
                        <SentTD><RankBadge $rank={i+1}>{i+1}</RankBadge></SentTD>
                        <SentTD>
                          <div style={{fontWeight:800,fontSize:'0.85rem',fontFamily:"'Space Grotesk',sans-serif"}}>{row.ticker}</div>
                          {row.name && <div style={{fontSize:'0.65rem',color:'#94a3b8',marginTop:1}}>{row.name}</div>}
                        </SentTD>
                        <SentTD>
                          <div style={{fontWeight:700,color:'#0f172a'}}>{source==='picks' ? `${row.confidence??row.count}%` : row.count}</div>
                          {source==='picks' && row.action && <div style={{fontSize:'0.6rem',color:'#94a3b8'}}>{row.action}</div>}
                        </SentTD>
                        <SentTD>
                          <div style={{display:'flex',flexDirection:'column',gap:'0.3rem',flex:1}}>
                            <div style={{display:'flex',alignItems:'center',gap:'0.5rem'}}>
                              <SentimentLabel $bg={sc.bg} $color={sc.color} $border={sc.border}>{row.topLabel}</SentimentLabel>
                              {row.avgScore!=null && (
                                <span style={{fontSize:'0.65rem',color:'#94a3b8',fontFamily:"'JetBrains Mono',monospace",fontWeight:600}}>
                                  {row.avgScore>=0?'+':''}{Number(row.avgScore).toFixed(2)}
                                </span>
                              )}
                            </div>
                            <ScoreBar><ScoreFill $pct={pct} $color={sc.dot}/></ScoreBar>
                          </div>
                        </SentTD>
                        <SentTD>
                          <div style={{display:'flex',alignItems:'center',gap:'0.35rem'}}>
                            <SentimentDot $color={sc.dot}/>
                            <span style={{fontSize:'0.75rem',color:sc.color,fontWeight:700}}>
                              {row.topLabel.includes('Bullish')?'Bullish':row.topLabel.includes('Bearish')?'Bearish':'Neutral'}
                            </span>
                          </div>
                        </SentTD>
                      </SentTRow>
                    );
                  })}
                </SentTable>
              </>
            );
          })()}

          <div style={{marginTop:'1rem',fontSize:'0.68rem',color:'#94a3b8',lineHeight:1.5}}>
            Sentiment signals are for educational purposes only — not financial advice.
          </div>
        </SentimentWrap>
      )}

      {/* ══════════════════════════════════════════════
          JOURNAL TAB
      ══════════════════════════════════════════════ */}
      {dashTab==='journal' && (
        <JournalFullPage>
          <JournalFullHeader>
            <JournalFullTitle><FaBookOpen/> Trading Journal</JournalFullTitle>
            <AddNoteBtn type="button" onClick={addNote}><FaPlus/> New entry</AddNoteBtn>
          </JournalFullHeader>
          {notes.length===0 ? (
            <EmptyJournal>
              <FaBookOpen/>
              <p>Your journal is empty.<br/>Log trades, ideas, and lessons — then let AI analyse your thinking.</p>
            </EmptyJournal>
          ) : (
            <JournalGrid>
              {notes.map(note=>{
                const ai = aiState[note.id]||{};
                const TAG_STYLES = {
                  trade:   {$bg:'#dcfce7',$color:'#15803d'},
                  idea:    {$bg:'#eff6ff',$color:'#2563eb'},
                  review:  {$bg:'#fef3c7',$color:'#b45309'},
                  mistake: {$bg:'#fee2e2',$color:'#dc2626'},
                  lesson:  {$bg:'#f3e8ff',$color:'#7c3aed'},
                };
                const tagStyle = TAG_STYLES[note.tag]||TAG_STYLES.trade;
                const isFocused = focusedNote===note.id;
                const execCmd = (cmd,val)=>document.execCommand(cmd,false,val);
                return (
                  <NoteCard key={note.id} $focused={isFocused}
                    initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:0.2}}
                    onFocus={()=>setFocusedNote(note.id)}>
                    <NoteCardHeader>
                      <NoteTagBadge {...tagStyle}>{note.tag}</NoteTagBadge>
                      <NoteTitle placeholder="Entry title..." value={note.title} onChange={e=>updateNote(note.id,'title',e.target.value)}/>
                    </NoteCardHeader>
                    <NoteToolbar>
                      <ToolbarBtn title="Bold" onMouseDown={e=>{e.preventDefault();execCmd('bold');}}><FaBold/></ToolbarBtn>
                      <ToolbarBtn title="Italic" onMouseDown={e=>{e.preventDefault();execCmd('italic');}}><FaItalic/></ToolbarBtn>
                      <ToolbarBtn title="Bullets" onMouseDown={e=>{e.preventDefault();execCmd('insertUnorderedList');}}><FaListUl/></ToolbarBtn>
                      <ToolbarDivider/>
                      <FaTag style={{fontSize:'0.65rem',color:'#cbd5e1',marginLeft:'2px'}}/>
                      <TagSelector value={note.tag} onChange={e=>updateNote(note.id,'tag',e.target.value)}>
                        <option value="trade">Trade</option>
                        <option value="idea">Idea</option>
                        <option value="review">Review</option>
                        <option value="mistake">Mistake</option>
                        <option value="lesson">Lesson</option>
                      </TagSelector>
                    </NoteToolbar>
                    <NoteBody contentEditable suppressContentEditableWarning
                      data-placeholder="Write your trade notes, thesis, or observations..."
                      onInput={e=>updateNote(note.id,'text',e.currentTarget.innerText)}
                      ref={el=>{if(el&&el.innerText!==note.text&&document.activeElement!==el)el.innerText=note.text;}}
                    />
                    <AnimatePresence>
                      {(ai.result||ai.loading) && (
                        <AIPanel key="ai" initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} exit={{opacity:0,height:0}} transition={{duration:0.2}}>
                          <AIPanelHeader>
                            <AIPanelTitle><FaRobot/> BloomVest <span>AI</span>
                              {ai.action&&<span style={{color:'#94a3b8',fontWeight:400,textTransform:'capitalize',marginLeft:4}}>— {ai.action}</span>}
                            </AIPanelTitle>
                            <AIActionBtn onClick={()=>setAiState(p=>{const s={...p};delete s[note.id];return s;})}>✕</AIActionBtn>
                          </AIPanelHeader>
                          {ai.loading
                            ?<AIThinking><Spinner/> Analysing your entry…</AIThinking>
                            :<AIPanelBody>{ai.result}</AIPanelBody>
                          }
                        </AIPanel>
                      )}
                    </AnimatePresence>
                    <NoteMeta>
                      <NoteDate>{note.date}</NoteDate>
                      <NoteActions>
                        <AIBtn type="button" disabled={ai.loading||!note.text?.trim()} onClick={()=>runJournalAI(note.id,'summarise')}><FaAlignLeft/> Summarise</AIBtn>
                        <AIBtn type="button" disabled={ai.loading||!note.text?.trim()} onClick={()=>runJournalAI(note.id,'analyse')}><FaRobot/> Analyse</AIBtn>
                        <AIBtn type="button" disabled={ai.loading||!note.text?.trim()} onClick={()=>runJournalAI(note.id,'risks')}><FaExclamationTriangle/> Risks</AIBtn>
                        <DeleteNoteBtn type="button" onClick={()=>deleteNote(note.id)} title="Delete"><FaTrash/></DeleteNoteBtn>
                      </NoteActions>
                    </NoteMeta>
                  </NoteCard>
                );
              })}
            </JournalGrid>
          )}
        </JournalFullPage>
      )}
    </Page>

    {/* ── auth modal ── */}
    <AnimatePresence>
      {showAuthModal && (
        <ModalOverlay initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.2}} onClick={()=>setShowAuthModal(false)}>
          <ModalCard initial={{opacity:0,scale:0.94,y:16}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:0.94,y:16}}
            transition={{duration:0.22,ease:[0.16,1,0.3,1]}} onClick={e=>e.stopPropagation()}>
            <ModalClose onClick={()=>setShowAuthModal(false)}>✕</ModalClose>
            <ModalIcon>🔐</ModalIcon>
            <ModalTitle>Sign in to unlock this</ModalTitle>
            <ModalDesc>The AI analysis engine reads live market headlines and generates picks tailored to your preferences. Free to use — just needs an account.</ModalDesc>
            <ModalPerks>
              <ModalPerk><span style={{color:'#10b981',fontWeight:700,fontSize:'1rem'}}>✓</span>Run live AI analysis across 8 batches</ModalPerk>
              <ModalPerk><span style={{color:'#10b981',fontWeight:700,fontSize:'1rem'}}>✓</span>Full news feed with AI insights per headline</ModalPerk>
              <ModalPerk><span style={{color:'#10b981',fontWeight:700,fontSize:'1rem'}}>✓</span>Ticker sentiment from Alpha Vantage</ModalPerk>
              <ModalPerk><span style={{color:'#10b981',fontWeight:700,fontSize:'1rem'}}>✓</span>Personal trading journal with AI reflection</ModalPerk>
            </ModalPerks>
            <ModalSignInBtn onClick={()=>{setShowAuthModal(false);navigate('/auth?mode=signin');}}>Sign in</ModalSignInBtn>
            <ModalCreateBtn onClick={()=>{setShowAuthModal(false);navigate('/auth?mode=signup');}}>Create a free account</ModalCreateBtn>
            <ModalNote>No credit card required · Free forever</ModalNote>
          </ModalCard>
        </ModalOverlay>
      )}
    </AnimatePresence>
    </>
  );
}
