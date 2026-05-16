import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaBolt, FaGem, FaSyncAlt,
  FaChevronDown, FaChevronUp,
  FaFilter, FaBookOpen, FaPlus, FaTrash, FaMagic, FaSpinner, FaChartLine,
  FaBold, FaItalic, FaListUl, FaTag, FaRobot,
  FaExclamationTriangle, FaAlignLeft, FaNewspaper, FaSignal, FaCalendarAlt,
  FaStar, FaFileAlt, FaCheckDouble,
} from 'react-icons/fa';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { api } from '../api';
import { useAuth } from '../AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { extractTextFromPdfArrayBuffer } from '../utils/extractPdfText';
import MarketPage from './MarketPage';
import TradeIdeasPage from './TradeIdeasPage';

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
const SentimentIntro = styled.div`
  background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:1rem 1.15rem;margin-bottom:1rem;
`;
const SentimentIntroTitle = styled.h3`
  font-family:'Space Grotesk',sans-serif;font-size:0.92rem;font-weight:800;color:#0f172a;margin:0 0 0.4rem;
`;
const SentimentIntroText = styled.p`
  font-size:0.8rem;color:#64748b;line-height:1.6;margin:0 0 0.75rem;
`;
const SentimentLegend = styled.div`
  display:flex;flex-wrap:wrap;gap:0.4rem;
`;
const LegendChip = styled.span`
  font-size:0.68rem;font-weight:600;padding:0.25rem 0.55rem;border-radius:6px;
  background:${p=>p.$bg};color:${p=>p.$color};border:1px solid ${p=>p.$border};
`;
const SentimentHeader = styled.div`
  display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;flex-wrap:wrap;gap:0.75rem;
`;
const SentimentTitle = styled.div`
  font-family:'Space Grotesk',sans-serif;font-size:0.95rem;font-weight:700;color:#0f172a;
  display:flex;flex-direction:column;gap:0.15rem;
  span{font-family:'Inter',sans-serif;font-weight:400;color:#94a3b8;font-size:0.75rem;}
`;
const SentTable = styled.div`
  border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;
`;
const SentTHead = styled.div`
  display:grid;grid-template-columns:0.5fr 1.3fr 0.9fr 2.2fr;
  background:#f8fafc;border-bottom:1px solid #e2e8f0;
  @media(max-width:640px){grid-template-columns:0.6fr 1.2fr 1.2fr;}
`;
const SentTH = styled.div`
  padding:0.6rem 1rem;font-size:0.62rem;font-weight:700;color:#64748b;
  letter-spacing:0.02em;line-height:1.35;
  @media(max-width:640px){&:nth-child(4){display:none;}}
`;
const SentTRow = styled(motion.div)`
  display:grid;grid-template-columns:0.5fr 1.3fr 0.9fr 2.2fr;
  border-bottom:1px solid #f1f5f9;background:#ffffff;
  &:last-child{border-bottom:none;}
  &:hover{background:#f8fafc;}
  @media(max-width:640px){grid-template-columns:0.6fr 1.2fr 1.2fr;}
`;
const SentTD = styled.div`
  padding:0.75rem 1rem;display:flex;align-items:center;font-size:0.8rem;
  @media(max-width:640px){&:nth-child(4){display:none;}}
`;
const MoodHint = styled.div`font-size:0.68rem;color:#94a3b8;margin-top:0.2rem;line-height:1.4;`;
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

/* ── watchlist ──────────────────────────────────────── */
const WatchlistWrap = styled.div`max-width:960px;margin:0 auto;padding:1.5rem;@media(max-width:640px){padding:1rem;}`;
const WatchlistHeader = styled.div`
  display:flex;align-items:center;justify-content:space-between;margin-bottom:1.25rem;flex-wrap:wrap;gap:0.75rem;
`;
const WatchlistTitle = styled.h2`
  font-family:'Space Grotesk',sans-serif;font-size:1.1rem;font-weight:800;color:#0f172a;
  display:flex;align-items:center;gap:0.5rem;margin:0;
`;
const AddTickerForm = styled.form`
  display:flex;gap:0.5rem;align-items:center;
  @media(max-width:640px){width:100%;}
`;
const TickerInput = styled.input`
  background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;
  padding:0.5rem 0.85rem;font-size:0.85rem;font-weight:700;color:#0f172a;
  font-family:'Space Grotesk',sans-serif;text-transform:uppercase;width:100px;
  &:focus{outline:none;border-color:#10b981;background:#fff;box-shadow:0 0 0 3px rgba(16,185,129,0.08);}
  &::placeholder{text-transform:none;font-weight:400;color:#cbd5e1;}
`;
const AddTickerBtn = styled.button`
  background:#0f172a;color:#fff;border:none;border-radius:8px;
  padding:0.5rem 1rem;font-size:0.78rem;font-weight:700;cursor:pointer;
  display:flex;align-items:center;gap:0.4rem;white-space:nowrap;
  &:hover{background:#1e293b;}&:disabled{opacity:0.5;cursor:not-allowed;}
`;
const WatchGrid = styled.div`
  display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:1rem;
  @media(max-width:640px){grid-template-columns:1fr 1fr;}
`;
const WatchCard = styled(motion.div)`
  background:#ffffff;border:1px solid #e2e8f0;border-radius:14px;padding:1.1rem;
  position:relative;transition:box-shadow 0.2s,border-color 0.2s;
  &:hover{box-shadow:0 4px 16px rgba(0,0,0,0.07);border-color:#cbd5e1;}
`;
const WatchCardTop = styled.div`display:flex;align-items:flex-start;justify-content:space-between;`;
const WatchSymbol = styled.div`
  font-family:'Space Grotesk',sans-serif;font-size:1.1rem;font-weight:800;color:#0f172a;
`;
const WatchPrice = styled.div`
  font-family:'Space Grotesk',sans-serif;font-size:1.2rem;font-weight:800;
  color:#0f172a;margin-top:0.35rem;
`;
const WatchChange = styled.div`
  font-size:0.78rem;font-weight:700;
  color:${p=>p.$pos?'#10b981':'#ef4444'};
  display:flex;align-items:center;gap:0.25rem;margin-top:0.1rem;
`;
const shimmer = keyframes`0%{background-position:200% 0}100%{background-position:-200% 0}`;
const WatchLoading = styled.div`
  height:28px;background:linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%);
  background-size:200% 100%;animation:${shimmer} 1.5s infinite;
  border-radius:6px;margin-top:0.5rem;
`;
const RemoveWatchBtn = styled.button`
  width:22px;height:22px;border-radius:6px;flex-shrink:0;
  background:transparent;border:none;color:#cbd5e1;cursor:pointer;font-size:0.75rem;
  display:flex;align-items:center;justify-content:center;transition:all 0.15s;
  &:hover{background:#fee2e2;color:#ef4444;}
`;
const WatchEmptyCard = styled.div`
  border:2px dashed #e2e8f0;border-radius:14px;padding:2.5rem 1rem;
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  gap:0.5rem;color:#94a3b8;text-align:center;grid-column:1/-1;
`;
const WatchAIBar = styled.div`
  margin-top:1.5rem;background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;
`;
const WatchAIBarHeader = styled.div`
  padding:0.65rem 1rem;background:#0f172a;display:flex;align-items:center;justify-content:space-between;
`;
const WatchAIBarTitle = styled.div`
  font-size:0.72rem;font-weight:800;color:#fff;display:flex;align-items:center;gap:0.4rem;
`;
const WatchAIBtn = styled.button`
  padding:0.28rem 0.7rem;border-radius:6px;border:1px solid rgba(255,255,255,0.2);
  background:rgba(255,255,255,0.08);color:#fff;font-size:0.7rem;font-weight:700;
  cursor:pointer;transition:all 0.15s;
  &:hover{background:rgba(255,255,255,0.18);}&:disabled{opacity:0.5;cursor:not-allowed;}
`;
const WatchAIBody = styled.div`
  padding:1rem;font-size:0.82rem;color:#374151;line-height:1.7;white-space:pre-wrap;min-height:48px;
`;

/* ── document analyst ───────────────────────────────── */
const DocWrap = styled.div`max-width:960px;margin:0 auto;padding:1.5rem;@media(max-width:640px){padding:1rem;}`;
const DocHeader = styled.div`margin-bottom:1.25rem;`;
const DocTitle = styled.h2`
  font-family:'Space Grotesk',sans-serif;font-size:1.1rem;font-weight:800;color:#0f172a;
  display:flex;align-items:center;gap:0.5rem;margin:0 0 0.3rem;
`;
const DocSubtitle = styled.div`font-size:0.8rem;color:#64748b;line-height:1.5;`;
const DocTypeRow = styled.div`display:flex;gap:0.5rem;margin-bottom:0.85rem;flex-wrap:wrap;`;
const DocTypeBtn = styled.button`
  padding:0.35rem 0.8rem;border-radius:6px;font-size:0.73rem;font-weight:700;cursor:pointer;
  border:1px solid ${p=>p.$active?'#0f172a':'#e2e8f0'};
  background:${p=>p.$active?'#0f172a':'#fff'};
  color:${p=>p.$active?'#fff':'#64748b'};
  transition:all 0.15s;
  &:hover{border-color:#0f172a;color:${p=>p.$active?'#fff':'#0f172a'};}
`;
const DocInputWrap = styled.div`display:flex;flex-direction:column;gap:0.65rem;`;
const DocQuestionInput = styled.input`
  width:100%;border:1px solid #e2e8f0;border-radius:8px;
  padding:0.6rem 1rem;font-size:0.85rem;color:#0f172a;font-family:'Inter',sans-serif;
  background:#f8fafc;box-sizing:border-box;
  &:focus{outline:none;border-color:#10b981;background:#fff;box-shadow:0 0 0 3px rgba(16,185,129,0.08);}
  &::placeholder{color:#94a3b8;}
`;
const DocTextArea = styled.textarea`
  width:100%;min-height:200px;border:1px solid #e2e8f0;border-radius:12px;
  padding:1rem;font-size:0.85rem;color:#0f172a;line-height:1.7;font-family:'Inter',sans-serif;
  resize:vertical;background:#f8fafc;box-sizing:border-box;
  &:focus{outline:none;border-color:#10b981;background:#fff;box-shadow:0 0 0 3px rgba(16,185,129,0.08);}
  &::placeholder{color:#94a3b8;}
`;
const DocAnalyseBtn = styled(motion.button)`
  background:#0f172a;color:#fff;border:none;border-radius:10px;
  padding:0.65rem 1.5rem;font-size:0.85rem;font-weight:700;
  display:flex;align-items:center;gap:0.5rem;cursor:pointer;
  &:hover{background:#1e293b;}&:disabled{opacity:0.55;cursor:not-allowed;}
`;
const DocResultGrid = styled.div`
  display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-top:1.5rem;
  @media(max-width:640px){grid-template-columns:1fr;}
`;
const DocResultCard = styled(motion.div)`
  background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:1.1rem;
`;
const DocResultLabel = styled.div`
  font-size:0.6rem;font-weight:800;text-transform:uppercase;letter-spacing:0.1em;
  color:#94a3b8;margin-bottom:0.6rem;
`;
const DocSummaryCard = styled(DocResultCard)`
  grid-column:1/-1;border-left:3px solid #10b981;
`;
const DocSummaryText = styled.div`font-size:0.88rem;color:#0f172a;line-height:1.7;`;
const DocMetricRow = styled.div`
  display:flex;align-items:center;justify-content:space-between;
  padding:0.4rem 0;border-bottom:1px solid #f1f5f9;
  &:last-child{border-bottom:none;}
`;
const DocMetricLabel = styled.div`font-size:0.8rem;color:#475569;font-weight:500;`;
const DocMetricValue = styled.div`
  font-size:0.82rem;font-weight:700;
  color:${p=>p.$dir==='up'?'#10b981':p.$dir==='down'?'#ef4444':'#0f172a'};
`;
const DocBullet = styled.div`
  font-size:0.82rem;color:#374151;line-height:1.55;padding:0.3rem 0 0.3rem 0.85rem;position:relative;
  &:before{content:"•";position:absolute;left:0;color:${p=>p.$color||'#10b981'};}
`;
const DocSignalBadge = styled.div`
  display:inline-flex;align-items:center;gap:0.35rem;margin-bottom:0.4rem;
  padding:0.35rem 0.7rem;border-radius:8px;font-size:0.75rem;font-weight:700;
  background:${p=>p.$type==='bullish'?'#dcfce7':p.$type==='bearish'?'#fee2e2':'#f1f5f9'};
  color:${p=>p.$type==='bullish'?'#15803d':p.$type==='bearish'?'#dc2626':'#64748b'};
`;
const DocVerdictBox = styled(DocResultCard)`
  grid-column:1/-1;
  background:${p=>p.$stance==='Buy'?'#f0fdf4':p.$stance==='Sell'?'#fef2f2':p.$stance==='Hold'?'#fefce8':'#f8fafc'};
  border-color:${p=>p.$stance==='Buy'?'#bbf7d0':p.$stance==='Sell'?'#fecaca':p.$stance==='Hold'?'#fde68a':'#e2e8f0'};
`;
const DocVerdictStance = styled.div`
  font-family:'Space Grotesk',sans-serif;font-size:1.1rem;font-weight:800;
  color:${p=>p.$stance==='Buy'?'#15803d':p.$stance==='Sell'?'#dc2626':p.$stance==='Hold'?'#b45309':'#0f172a'};
  margin-bottom:0.35rem;
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

/** Plain-language labels for Alpha Vantage / news sentiment terms */
const SENTIMENT_PLAIN = {
  'Bullish':          { title: 'Positive',     hint: 'News is mostly upbeat about this symbol' },
  'Somewhat-Bullish': { title: 'Slightly positive', hint: 'News leans positive, but not strongly' },
  'Neutral':          { title: 'Mixed / neutral', hint: 'News is balanced or unclear' },
  'Somewhat-Bearish': { title: 'Slightly negative', hint: 'News leans negative, but not strongly' },
  'Bearish':          { title: 'Negative',     hint: 'News is mostly cautious or downbeat' },
};

const SOURCE_PLAIN = {
  alphavantage: 'Scored from live financial news',
  picks: 'Estimated from your AI stock picks',
  headlines: 'Estimated from headline keywords',
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

function plainSentiment(label) {
  return SENTIMENT_PLAIN[label] || SENTIMENT_PLAIN['Neutral'];
}

/** Turn Alpha Vantage-style score (-1 to +1) into readable text */
function scoreToMoodText(avgScore) {
  if (avgScore == null || Number.isNaN(Number(avgScore))) return null;
  const n = Number(avgScore);
  if (n >= 0.3) return 'Strong positive tone in recent news';
  if (n >= 0.1) return 'Mild positive tone in recent news';
  if (n <= -0.3) return 'Strong negative tone in recent news';
  if (n <= -0.1) return 'Mild negative tone in recent news';
  return 'Balanced or mixed tone in recent news';
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
  const [searchParams] = useSearchParams();

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

  // tabs: 'picks' | 'trade-ideas' | 'markets' | 'brief' | 'news' | 'sentiment' | 'journal' | 'watchlist' | 'analyst'
  const [dashTab, setDashTab] = useState('picks');

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'trade-ideas' || tab === 'markets') setDashTab(tab);
  }, [searchParams]);

  // watchlist state
  const [watchlist, setWatchlist] = useState(() => {
    try { const s = localStorage.getItem('bv_watchlist_v1'); return s ? JSON.parse(s) : ['SPY','QQQ','NVDA','AAPL','BTC']; } catch { return ['SPY','QQQ','NVDA','AAPL','BTC']; }
  });
  const [watchQuotes, setWatchQuotes] = useState({});
  const [watchLoading, setWatchLoading] = useState({});
  const [tickerInput, setTickerInput] = useState('');
  const [watchAI, setWatchAI] = useState({ loading: false, result: null });

  // document analyst state
  const [docText, setDocText] = useState('');
  const [docPdfLoading, setDocPdfLoading] = useState(false);
  const [docType, setDocType] = useState('earnings');
  const [docQuestion, setDocQuestion] = useState('');
  const [docLoading, setDocLoading] = useState(false);
  const [docResult, setDocResult] = useState(null);
  const [docError, setDocError] = useState(null);

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
  useEffect(() => { localStorage.setItem('bv_watchlist_v1', JSON.stringify(watchlist)); }, [watchlist]);

  // Fetch quotes for all watchlist symbols
  const fetchQuote = useCallback(async (symbol) => {
    setWatchLoading(p => ({ ...p, [symbol]: true }));
    try {
      const data = await api.getQuote(symbol);
      setWatchQuotes(p => ({ ...p, [symbol]: data }));
    } catch {
      setWatchQuotes(p => ({ ...p, [symbol]: { symbol, price: null } }));
    } finally {
      setWatchLoading(p => ({ ...p, [symbol]: false }));
    }
  }, []);

  useEffect(() => {
    if (dashTab !== 'watchlist') return;
    watchlist.forEach(sym => { if (!watchQuotes[sym]) fetchQuote(sym); });
  }, [dashTab, watchlist, watchQuotes, fetchQuote]);

  const addToWatchlist = useCallback((e) => {
    e.preventDefault();
    const sym = tickerInput.trim().toUpperCase();
    if (!sym || watchlist.includes(sym)) { setTickerInput(''); return; }
    setWatchlist(p => [...p, sym]);
    setTickerInput('');
    fetchQuote(sym);
  }, [tickerInput, watchlist, fetchQuote]);

  const removeFromWatchlist = useCallback((sym) => {
    setWatchlist(p => p.filter(s => s !== sym));
    setWatchQuotes(p => { const n = { ...p }; delete n[sym]; return n; });
  }, []);

  const runWatchlistAI = useCallback(async () => {
    if (!watchlist.length) return;
    setWatchAI({ loading: true, result: null });
    const quoteLines = watchlist.map(sym => {
      const q = watchQuotes[sym];
      if (!q?.price) return `${sym}: no price data`;
      const pct = q.changePct != null ? ` (${q.changePct >= 0 ? '+' : ''}${q.changePct.toFixed(2)}%)` : '';
      return `${sym}: $${q.price.toFixed(2)}${pct}`;
    }).join(', ');
    try {
      const { insight } = await api.analyseHeadline(
        `Watchlist snapshot — ${quoteLines}`,
        'BloomVest Watchlist'
      );
      setWatchAI({ loading: false, result: insight });
    } catch {
      setWatchAI({ loading: false, result: 'Could not generate watchlist briefing.' });
    }
  }, [watchlist, watchQuotes]);

  const handlePdfUpload = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      setDocError('Please upload a PDF file.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setDocError('PDF too large — please use a file under 10 MB.');
      return;
    }
    setDocPdfLoading(true);
    setDocError(null);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const { text } = await extractTextFromPdfArrayBuffer(arrayBuffer);
      if (text.length < 50) {
        setDocError(
          'Could not extract text from this PDF. It may be scanned (image-only). Try another file or paste the text manually.'
        );
        return;
      }
      setDocText(text);
    } catch (err) {
      setDocError(err?.message || 'Failed to read the PDF. Please paste the text manually.');
    } finally {
      setDocPdfLoading(false);
      // Reset file input so same file can be re-uploaded
      e.target.value = '';
    }
  }, []);

  const runDocAnalysis = useCallback(async () => {
    if (!docText.trim() || docText.trim().length < 50) return;
    setDocLoading(true); setDocResult(null); setDocError(null);
    try {
      const { analysis } = await api.analyseDocument(docText, docType, docQuestion);
      setDocResult(analysis);
    } catch (e) {
      setDocError(e.message || 'Analysis failed');
    } finally {
      setDocLoading(false);
    }
  }, [docText, docType, docQuestion]);

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
      // Fire all 8 batches in parallel — each resolves independently,
      // progress ticks as each one lands.
      let completed = 0;
      const settled = await Promise.allSettled(
        Array.from({ length: TOTAL_BATCHES }, (_, i) =>
          api.runDeepAnalysis({
            ...prefs, assetTypes: activeTypes,
            batchIndex: i + 1, totalBatches: TOTAL_BATCHES,
          }).then(res => {
            completed++;
            setDeepProgress(Math.round((completed / TOTAL_BATCHES) * 100));
            setDeepBatch(completed);
            return res;
          })
        )
      );

      const results = settled
        .filter(s => s.status === 'fulfilled' && s.value)
        .map(s => s.value);

      settled
        .filter(s => s.status === 'rejected')
        .forEach(s => console.error('Batch failed:', s.reason?.message));

      if (results.length === 0) throw new Error('All analysis batches failed');

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
        <DashTabBtn $active={dashTab==='trade-ideas'} onClick={()=>setDashTab('trade-ideas')}><FaBolt/>Trade Ideas</DashTabBtn>
        <DashTabBtn $active={dashTab==='markets'}   onClick={()=>setDashTab('markets')}><FaChartLine/>Markets</DashTabBtn>
        <DashTabBtn $active={dashTab==='brief'}     onClick={()=>setDashTab('brief')}><FaCalendarAlt/>Market Brief</DashTabBtn>
        <DashTabBtn $active={dashTab==='news'}      onClick={()=>setDashTab('news')}><FaNewspaper/>News Feed</DashTabBtn>
        <DashTabBtn $active={dashTab==='sentiment'} onClick={()=>setDashTab('sentiment')}><FaSignal/>Market Mood</DashTabBtn>
        <DashTabBtn $active={dashTab==='watchlist'} onClick={()=>setDashTab('watchlist')}><FaStar/>Watchlist</DashTabBtn>
        <DashTabBtn $active={dashTab==='analyst'}   onClick={()=>setDashTab('analyst')}><FaFileAlt/>Doc Analyst</DashTabBtn>
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
      {dashTab==='trade-ideas' && <TradeIdeasPage embedded />}
      {dashTab==='markets' && <MarketPage embedded />}

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
            <SumItem>
              <SumLabel>Assets Analyzed</SumLabel>
              <SumValue>{rawPicks.length || '—'}</SumValue>
              {rawPicks.length > 0 && <div style={{fontSize:'0.6rem',color:'#94a3b8',marginTop:2}}>{TOTAL_BATCHES} batches · live data</div>}
            </SumItem>
            <SumItem>
              <SumLabel>Buy Signals</SumLabel>
              <SumValue $color="#10b981">{(counts['Buy']||0)+(counts['Strong Buy']||0) || '—'}</SumValue>
              {(counts['Strong Buy']||0) > 0 && <div style={{fontSize:'0.6rem',color:'#10b981',marginTop:2}}>{counts['Strong Buy']} strong</div>}
            </SumItem>
            <SumItem>
              <SumLabel>Watch / Hold</SumLabel>
              <SumValue $color="#f59e0b">{counts['Watch']||0 || '—'}</SumValue>
            </SumItem>
            <SumItem>
              <SumLabel>Avoid / Reduce</SumLabel>
              <SumValue $color="#ef4444">{(counts['Avoid']||0)+(counts['Reduce']||0) || '—'}</SumValue>
            </SumItem>
            <SumItem>
              <SumLabel>Avg. Confidence</SumLabel>
              <SumValue $color={avgConfidence!=null?(avgConfidence>=70?'#10b981':avgConfidence>=50?'#f59e0b':'#ef4444'):'#0f172a'}>
                {avgConfidence!=null?`${avgConfidence}%`:'—'}
              </SumValue>
              {avgConfidence!=null && (
                <div style={{marginTop:3,height:3,background:'#f1f5f9',borderRadius:2,overflow:'hidden',width:'100%'}}>
                  <div style={{height:'100%',width:`${avgConfidence}%`,background:avgConfidence>=70?'#10b981':avgConfidence>=50?'#f59e0b':'#ef4444',borderRadius:2}}/>
                </div>
              )}
            </SumItem>
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
          {brief?.aiError && <EmptyState><FaExclamationTriangle style={{color:'#ef4444'}}/><EmptyTitle>{brief.aiError}</EmptyTitle><EmptyDesc>Check the server AI connection and try refreshing.</EmptyDesc></EmptyState>}
          {brief && !brief.aiError && (
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
                    {h.sentiment && <SentimentDot $color={sc.dot} title={plainSentiment(h.sentiment).hint}/>}
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
                        <SentimentLabel $bg={sc.bg} $color={sc.color} $border={sc.border} title={plainSentiment(h.sentiment).hint}>
                          {plainSentiment(h.sentiment).title}
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
          <SentimentIntro>
            <SentimentIntroTitle>What is market mood?</SentimentIntroTitle>
            <SentimentIntroText>
              This tab shows whether <strong>recent news</strong> sounds positive, negative, or mixed for each stock symbol.
              It is <strong>not</strong> a buy/sell signal — it only reflects the tone of headlines and articles we scan.
              Symbols like <strong>AAPL</strong> or <strong>NVDA</strong> are stock tickers (short codes for companies).
            </SentimentIntroText>
            <SentimentLegend>
              {Object.entries(SENTIMENT_PLAIN).map(([key, p]) => {
                const sc = sentimentColor(key);
                return (
                  <LegendChip key={key} $bg={sc.bg} $color={sc.color} $border={sc.border} title={p.hint}>
                    {p.title}
                  </LegendChip>
                );
              })}
            </SentimentLegend>
          </SentimentIntro>

          <SentimentHeader>
            <SentimentTitle>
              Symbols ranked by news mood
              <span>
                {brief?.tickerSentiments?.length > 0
                  ? `${brief.tickerSentiments.length} symbols from live news`
                  : deepResult?.picks?.length > 0
                    ? `${deepResult.picks.length} symbols from your AI picks`
                    : 'Refresh or run AI analysis to load data'}
              </span>
            </SentimentTitle>
            <RefreshBtn type="button" onClick={()=>load(true)} disabled={loading||refreshing} title="Refresh news data">
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
                <EmptyTitle>No market mood data yet</EmptyTitle>
                <EmptyDesc>Click Refresh above, or run AI Analysis on the AI Picks tab. We need recent news before moods can be calculated.</EmptyDesc>
              </EmptyState>
            );

            const maxCount = rows[0]?.count || 1;

            return (
              <>
                <div style={{fontSize:'0.75rem',color:'#64748b',marginBottom:'0.75rem',lineHeight:1.5}}>
                  <strong style={{color:'#0f172a'}}>Data source:</strong>{' '}
                  {SOURCE_PLAIN[source] || SOURCE_PLAIN.headlines}
                  {' · '}{rows.length} symbol{rows.length !== 1 ? 's' : ''}
                </div>
                <SentTable>
                  <SentTHead>
                    <SentTH>Rank</SentTH>
                    <SentTH>Symbol</SentTH>
                    <SentTH>{source==='picks' ? 'AI confidence' : 'News mentions'}</SentTH>
                    <SentTH>Overall mood</SentTH>
                  </SentTHead>
                  {rows.map((row,i)=>{
                    const sc = sentimentColor(row.topLabel);
                    const plain = plainSentiment(row.topLabel);
                    const pct = Math.min(100, Math.round((row.count/maxCount)*100));
                    const moodText = scoreToMoodText(row.avgScore);
                    return (
                      <SentTRow key={row.ticker} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*0.02}}>
                        <SentTD><RankBadge $rank={i+1}>{i+1}</RankBadge></SentTD>
                        <SentTD>
                          <div style={{fontWeight:800,fontSize:'0.85rem',fontFamily:"'Space Grotesk',sans-serif"}} title="Stock symbol">{row.ticker}</div>
                          {row.name && <div style={{fontSize:'0.65rem',color:'#94a3b8',marginTop:1}}>{row.name}</div>}
                        </SentTD>
                        <SentTD>
                          <div style={{fontWeight:700,color:'#0f172a'}}>
                            {source==='picks' ? `${row.confidence ?? row.count}% sure` : `${row.count} article${row.count !== 1 ? 's' : ''}`}
                          </div>
                          {source==='picks' && row.action && (
                            <div style={{fontSize:'0.68rem',color:'#64748b',marginTop:2}}>AI view: {row.action}</div>
                          )}
                          {source!=='picks' && (
                            <div style={{fontSize:'0.65rem',color:'#94a3b8',marginTop:2}}>How often it appeared in news</div>
                          )}
                        </SentTD>
                        <SentTD>
                          <div style={{display:'flex',flexDirection:'column',gap:'0.35rem',flex:1,width:'100%'}}>
                            <div style={{display:'flex',alignItems:'center',gap:'0.5rem',flexWrap:'wrap'}}>
                              <SentimentDot $color={sc.dot}/>
                              <SentimentLabel $bg={sc.bg} $color={sc.color} $border={sc.border} title={plain.hint}>
                                {plain.title}
                              </SentimentLabel>
                            </div>
                            <MoodHint>{moodText || plain.hint}</MoodHint>
                            <ScoreBar title="Relative attention in the news feed">
                              <ScoreFill $pct={pct} $color={sc.dot}/>
                            </ScoreBar>
                            <MoodHint style={{marginTop:0}}>Bar = how much coverage vs. other symbols on this list</MoodHint>
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
            Market mood is based on news tone only — for learning, not financial advice. Always do your own research before investing.
          </div>
        </SentimentWrap>
      )}

      {/* ══════════════════════════════════════════════
          WATCHLIST TAB
      ══════════════════════════════════════════════ */}
      {dashTab==='watchlist' && (
        <WatchlistWrap>
          <WatchlistHeader>
            <div>
              <WatchlistTitle><FaStar style={{color:'#f59e0b'}}/> My Watchlist</WatchlistTitle>
              <div style={{fontSize:'0.75rem',color:'#94a3b8',marginTop:'0.15rem'}}>
                Track tickers — prices refresh on each visit. Add up to 20 symbols.
              </div>
            </div>
            <AddTickerForm onSubmit={addToWatchlist}>
              <TickerInput
                value={tickerInput}
                onChange={e=>setTickerInput(e.target.value.toUpperCase())}
                placeholder="e.g. TSLA"
                maxLength={6}
              />
              <AddTickerBtn type="submit" disabled={!tickerInput.trim() || watchlist.length >= 20}>
                <FaPlus/> Add
              </AddTickerBtn>
            </AddTickerForm>
          </WatchlistHeader>

          <WatchGrid>
            {watchlist.length === 0 && (
              <WatchEmptyCard>
                <FaStar style={{fontSize:'2rem',opacity:0.2}}/>
                <div style={{fontWeight:700,color:'#64748b'}}>No tickers yet</div>
                <div style={{fontSize:'0.78rem'}}>Add symbols above to track them here.</div>
              </WatchEmptyCard>
            )}
            {watchlist.map((sym, idx) => {
              const q = watchQuotes[sym];
              const loading = watchLoading[sym];
              const isPos = q?.change != null && q.change >= 0;
              return (
                <WatchCard key={sym}
                  initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:idx*0.04}}>
                  <WatchCardTop>
                    <WatchSymbol>{sym}</WatchSymbol>
                    <div style={{display:'flex',gap:'0.35rem',alignItems:'center'}}>
                      {!q && !loading && (
                        <button type="button" onClick={()=>fetchQuote(sym)}
                          style={{fontSize:'0.65rem',color:'#10b981',fontWeight:700,background:'none',border:'none',cursor:'pointer',padding:0}}>
                          Load
                        </button>
                      )}
                      <RemoveWatchBtn type="button" onClick={()=>removeFromWatchlist(sym)} title="Remove">✕</RemoveWatchBtn>
                    </div>
                  </WatchCardTop>

                  {loading && <WatchLoading/>}

                  {!loading && q?.price != null && (
                    <>
                      <WatchPrice>${q.price.toLocaleString('en-US', {minimumFractionDigits:2,maximumFractionDigits:2})}</WatchPrice>
                      {q.change != null && (
                        <WatchChange $pos={isPos}>
                          {isPos ? '▲' : '▼'} {Math.abs(q.change).toFixed(2)}
                          {q.changePct != null && <span>({isPos?'+':''}{q.changePct.toFixed(2)}%)</span>}
                        </WatchChange>
                      )}
                      {q.volume != null && (
                        <div style={{fontSize:'0.65rem',color:'#94a3b8',marginTop:'0.4rem',fontFamily:"'JetBrains Mono',monospace"}}>
                          Vol {(q.volume/1e6).toFixed(1)}M
                        </div>
                      )}
                    </>
                  )}
                  {!loading && q && q.price == null && (
                    <div style={{fontSize:'0.75rem',color:'#94a3b8',marginTop:'0.5rem'}}>
                      No price data
                      <div style={{fontSize:'0.65rem',marginTop:'0.2rem'}}>Add ALPHA_VANTAGE_KEY to enable live quotes</div>
                    </div>
                  )}
                </WatchCard>
              );
            })}
          </WatchGrid>

          {/* AI Watchlist Brief */}
          <WatchAIBar>
            <WatchAIBarHeader>
              <WatchAIBarTitle>
                <FaRobot style={{color:'#4ade80'}}/> AI Watchlist Brief
              </WatchAIBarTitle>
              <WatchAIBtn
                type="button"
                disabled={watchAI.loading || watchlist.length === 0}
                onClick={runWatchlistAI}
              >
                {watchAI.loading ? <><Spinner style={{marginRight:4}}/>Analysing…</> : 'Generate Brief'}
              </WatchAIBtn>
            </WatchAIBarHeader>
            {(watchAI.result || watchAI.loading) && (
              <WatchAIBody>
                {watchAI.loading
                  ? <span style={{color:'#94a3b8',fontStyle:'italic'}}>Generating your watchlist briefing…</span>
                  : watchAI.result
                }
              </WatchAIBody>
            )}
            {!watchAI.result && !watchAI.loading && (
              <WatchAIBody style={{color:'#94a3b8'}}>
                Click "Generate Brief" to get an AI summary of what's happening with your tracked tickers based on current market context.
              </WatchAIBody>
            )}
          </WatchAIBar>
        </WatchlistWrap>
      )}

      {/* ══════════════════════════════════════════════
          DOCUMENT ANALYST TAB
      ══════════════════════════════════════════════ */}
      {dashTab==='analyst' && (
        <DocWrap>
          <DocHeader>
            <DocTitle><FaFileAlt style={{color:'#10b981'}}/> Document Analyst</DocTitle>
            <DocSubtitle>
              Paste an earnings call transcript, 10-K filing, 8-K, or any financial document.
              The AI extracts key metrics, investment signals, risks, and a verdict.
            </DocSubtitle>
          </DocHeader>

          <DocTypeRow>
            {[
              {id:'earnings', label:'Earnings Call'},
              {id:'10k',      label:'10-K Annual'},
              {id:'8k',       label:'8-K Filing'},
              {id:'general',  label:'General Doc'},
            ].map(t => (
              <DocTypeBtn key={t.id} type="button" $active={docType===t.id} onClick={()=>setDocType(t.id)}>
                {t.label}
              </DocTypeBtn>
            ))}
          </DocTypeRow>

          {/* PDF upload row */}
          <div style={{display:'flex',alignItems:'center',gap:'0.65rem',marginBottom:'0.75rem',flexWrap:'wrap'}}>
            <label style={{
              display:'inline-flex',alignItems:'center',gap:0.4+'rem',
              padding:'0.45rem 1rem',borderRadius:'8px',border:'1px solid #e2e8f0',
              background:'#f8fafc',color:'#475569',fontSize:'0.78rem',fontWeight:700,
              cursor: docPdfLoading ? 'not-allowed' : 'pointer',
              opacity: docPdfLoading ? 0.6 : 1,
              transition:'border-color 0.15s,background 0.15s',
            }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor='#10b981';e.currentTarget.style.background='#f0fdf4';}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor='#e2e8f0';e.currentTarget.style.background='#f8fafc';}}
            >
              {docPdfLoading ? <><Spinner style={{color:'#10b981',marginRight:4}}/> Reading PDF…</> : <><FaFileAlt style={{color:'#10b981'}}/> Upload PDF</>}
              <input
                type="file" accept="application/pdf" style={{display:'none'}}
                disabled={docPdfLoading}
                onChange={handlePdfUpload}
              />
            </label>
            <div style={{fontSize:'0.72rem',color:'#94a3b8',lineHeight:1.4}}>
              Upload a text-layer PDF — or paste text directly below.
            </div>
          </div>

          <DocInputWrap>
            <DocQuestionInput
              placeholder="Optional: Ask a specific question (e.g. What was management's guidance for Q3?)"
              value={docQuestion}
              onChange={e=>setDocQuestion(e.target.value)}
            />
            <DocTextArea
              placeholder={`Paste ${docType === 'earnings' ? 'earnings call transcript' : docType === '10k' ? '10-K text (key sections)' : docType === '8k' ? '8-K filing text' : 'financial document text'} here…\n\nOr upload a PDF above. The AI reads up to ~12,000 characters.`}
              value={docText}
              onChange={e=>setDocText(e.target.value)}
            />
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:'0.5rem'}}>
              <div style={{fontSize:'0.72rem',color:'#94a3b8'}}>
                {docText.length.toLocaleString()} chars · AI reads first ~12,000
                {docText.length > 0 && <button type="button" onClick={()=>{setDocText('');setDocResult(null);setDocError(null);}} style={{marginLeft:8,fontSize:'0.65rem',color:'#94a3b8',background:'none',border:'none',cursor:'pointer',textDecoration:'underline'}}>Clear</button>}
              </div>
              <DocAnalyseBtn
                type="button"
                onClick={runDocAnalysis}
                disabled={docLoading || docText.trim().length < 50}
                whileTap={{scale:0.97}}
              >
                {docLoading ? <><Spinner/> Analysing…</> : <><FaCheckDouble/> Analyse Document</>}
              </DocAnalyseBtn>
            </div>
          </DocInputWrap>

          {docError && (
            <div style={{marginTop:'1rem',padding:'0.85rem 1rem',background:'#fef2f2',border:'1px solid #fecaca',borderRadius:10,fontSize:'0.82rem',color:'#dc2626'}}>
              {docError}
            </div>
          )}

          {docResult && (
            <AnimatePresence>
              <DocResultGrid>
                <DocSummaryCard initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}>
                  <DocResultLabel>Executive Summary</DocResultLabel>
                  <DocSummaryText>{docResult.summary}</DocSummaryText>
                </DocSummaryCard>

                {docResult.keyMetrics?.length > 0 && (
                  <DocResultCard initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.05}}>
                    <DocResultLabel>Key Metrics</DocResultLabel>
                    {docResult.keyMetrics.map((m,i) => (
                      <DocMetricRow key={i}>
                        <DocMetricLabel>{m.label}</DocMetricLabel>
                        <DocMetricValue $dir={m.direction}>
                          {m.direction==='up' ? '▲ ' : m.direction==='down' ? '▼ ' : ''}{m.value}
                        </DocMetricValue>
                      </DocMetricRow>
                    ))}
                  </DocResultCard>
                )}

                {(docResult.positives?.length > 0 || docResult.risks?.length > 0) && (
                  <DocResultCard initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.08}}>
                    {docResult.positives?.length > 0 && (
                      <>
                        <DocResultLabel>Positives</DocResultLabel>
                        {docResult.positives.map((p,i) => <DocBullet key={i} $color="#10b981">{p}</DocBullet>)}
                      </>
                    )}
                    {docResult.risks?.length > 0 && (
                      <>
                        <DocResultLabel style={{marginTop:'0.75rem'}}>Risks</DocResultLabel>
                        {docResult.risks.map((r,i) => <DocBullet key={i} $color="#ef4444">{r}</DocBullet>)}
                      </>
                    )}
                  </DocResultCard>
                )}

                {docResult.signals?.length > 0 && (
                  <DocResultCard initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.1}}>
                    <DocResultLabel>Investment Signals</DocResultLabel>
                    {docResult.signals.map((s,i) => (
                      <div key={i}>
                        <DocSignalBadge $type={s.type}>
                          {s.type==='bullish' ? '▲ Bullish' : s.type==='bearish' ? '▼ Bearish' : '— Neutral'}
                        </DocSignalBadge>
                        <div style={{fontSize:'0.8rem',color:'#374151',lineHeight:1.55,marginBottom:'0.5rem'}}>{s.detail}</div>
                      </div>
                    ))}
                  </DocResultCard>
                )}

                {docResult.verdict && (
                  <DocVerdictBox
                    $stance={docResult.verdict.stance}
                    initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.12}}>
                    <DocResultLabel>AI Verdict</DocResultLabel>
                    <DocVerdictStance $stance={docResult.verdict.stance}>
                      {docResult.verdict.stance} · {docResult.verdict.confidence} Confidence
                    </DocVerdictStance>
                    <div style={{fontSize:'0.85rem',color:'#374151',lineHeight:1.6}}>{docResult.verdict.rationale}</div>
                  </DocVerdictBox>
                )}
              </DocResultGrid>
            </AnimatePresence>
          )}

          {!docResult && !docLoading && (
            <div style={{marginTop:'2.5rem',textAlign:'center',color:'#94a3b8',fontSize:'0.82rem',lineHeight:1.6}}>
              <FaFileAlt style={{fontSize:'2rem',opacity:0.2,display:'block',margin:'0 auto 0.75rem'}}/>
              Paste a document above and click Analyse to extract investment intelligence from any financial text.
            </div>
          )}

          <div style={{marginTop:'1.5rem',fontSize:'0.68rem',color:'#94a3b8',lineHeight:1.5}}>
            For educational purposes only. Not financial advice. Always verify key figures against official filings.
          </div>
        </DocWrap>
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
