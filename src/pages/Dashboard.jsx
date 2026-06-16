import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaBolt, FaGem, FaSyncAlt,
  FaChevronDown, FaChevronUp,
  FaFilter, FaBookOpen, FaPlus, FaTrash, FaMagic, FaSpinner, FaChartLine,
  FaBold, FaItalic, FaListUl, FaTag, FaRobot,
  FaExclamationTriangle, FaAlignLeft, FaNewspaper, FaSignal, FaCalendarAlt,
  FaStar, FaFileAlt, FaCheckDouble, FaChartPie, FaRedo, FaSave, FaCoins, FaCheck,
  FaFire, FaArrowUp, FaArrowDown, FaExchangeAlt,
} from 'react-icons/fa';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RcTooltip } from 'recharts';
import { api } from '../api';
import { useAuth } from '../AuthContext';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import MentorPage from './MentorPage';
import { extractTextFromPdfArrayBuffer } from '../utils/extractPdfText';
import { sanitizeHeadline } from '../utils/sanitizeHeadline';
import {
  toStudyLevel,
  studyLevelStyle,
  isDeepDiveLevel,
  isCautionLevel,
  docStanceStyle,
  EDUCATION_DISCLAIMER,
} from '../utils/learningLabels';
import LearningLinks from '../components/LearningLinks';
import IqLearningStrip from '../components/learning/IqLearningStrip';
import { matchHeadlineTopic } from '../config/learningPaths';
import {
  incrementHeadlinesDecoded,
  setMentorContext,
  addJournalNote,
} from '../utils/learningState';

/* ── animations ─────────────────────────────────────── */
const slide    = keyframes`from{transform:translateX(0)}to{transform:translateX(-50%)}`;
const spinAnim = keyframes`to{transform:rotate(360deg)}`;

/* ── page ───────────────────────────────────────────── */
const Page = styled.div`
  min-height: 100vh;
  background: #e8ecf2;
  font-family: 'Inter', system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  padding-top: 64px;
  color: #0f172a;
  &::-webkit-scrollbar { display: none; }
  -ms-overflow-style: none; scrollbar-width: none;

  ${(p) =>
    p.$copilot &&
    `
    flex: 1;
    min-height: 0;
    padding-top: 64px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    background: #e8ecf2;
  `}
`;

/* tab bar is ~45px, so copilot pane gets the rest */
const CopilotPane = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  width: 100%;
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
  @media(max-width:640px){
    width:100%;
    justify-content:flex-end;
    gap:0.45rem;
  }
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
  @media(max-width:640px){flex:1 1 100%;justify-content:center;padding:0.7rem 0.75rem;order:1;}
`;

/* ── tabs ───────────────────────────────────────────── */
const IntelligenceBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.65rem 1.5rem;
  background: #ffffff;
  border-bottom: 1px solid #f1f5f9;
  flex-shrink: 0;
  @media (max-width: 640px) {
    padding: 0.6rem 1rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
`;
const IntelligenceTitle = styled.h1`
  margin: 0;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1rem;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.02em;
`;
const IntelligenceSub = styled.p`
  margin: 0;
  font-size: 0.72rem;
  color: #64748b;
  font-weight: 500;
`;

const DashTabBar = styled.div`
  display:flex;gap:0.15rem;border-bottom:1px solid #f1f5f9;
  background:#ffffff;padding:0.35rem 1.5rem 0;overflow-x:auto;
  flex-shrink: 0;
  scrollbar-width:none;&::-webkit-scrollbar{display:none;}
  @media(max-width:640px){padding:0.25rem 0.35rem 0;gap:0;}
`;
const DashTabBtn = styled.button`
  padding:0.7rem 1.05rem;font-family:'Inter',sans-serif;font-size:0.86rem;font-weight:${p=>p.$active?600:500};
  letter-spacing:-0.011em;-webkit-font-smoothing:antialiased;
  border:none;background:transparent;cursor:pointer;white-space:nowrap;
  color:${p=>p.$active?'#0f172a':'#94a3b8'};
  border-bottom:2px solid ${p=>p.$active?'#10b981':'transparent'};
  margin-bottom:-1px;border-radius:8px 8px 0 0;transition:color 0.18s,background 0.18s,border-color 0.18s;
  display:flex;align-items:center;gap:0.45rem;
  svg{font-size:0.9em;opacity:${p=>p.$active?1:0.7};}
  &:hover{color:#0f172a;background:${p=>p.$active?'transparent':'rgba(15,23,42,0.04)'};}
  @media(max-width:640px){flex:1;justify-content:center;padding:0.7rem 0.4rem;font-size:0.8rem;gap:0.3rem;}
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
  background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;
  padding:0.75rem 0.9rem;white-space:pre-wrap;
`;
const InsightActions = styled.div`
  display:flex;flex-wrap:wrap;gap:0.45rem;margin-top:0.7rem;padding-top:0.65rem;
  border-top:1px solid rgba(34,197,94,0.2);
`;
const InsightActionBtn = styled.button`
  display:inline-flex;align-items:center;gap:0.35rem;
  padding:0.42rem 0.8rem;border-radius:8px;border:1px solid #e2e8f0;
  background:#fff;font-size:0.75rem;font-weight:700;color:#475569;cursor:pointer;
  transition:border-color 0.15s,color 0.15s,background 0.15s;
  &:hover{border-color:#10b981;color:#15803d;background:#f0fdf4;}
`;
const LabNextSteps = styled.div`
  padding:0.9rem 1.25rem;border-top:1px solid #f1f5f9;
  display:flex;flex-wrap:wrap;gap:0.5rem;align-items:center;
  background:linear-gradient(180deg,#fafbfc 0%,#fff 100%);
`;
const LabNextLabel = styled.span`
  font-size:0.75rem;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:0.06em;
`;
const LabNextBtn = styled.button`
  padding:0.48rem 0.9rem;border-radius:9px;border:1px solid #e2e8f0;
  background:#fff;font-size:0.78rem;font-weight:700;cursor:pointer;color:#0f172a;
  transition:border-color 0.15s,box-shadow 0.15s;
  &:hover{border-color:#cbd5e1;box-shadow:0 2px 8px rgba(15,23,42,0.06);}
`;
const LabNextLink = styled(Link)`
  padding:0.48rem 0.9rem;border-radius:9px;font-size:0.78rem;font-weight:700;text-decoration:none;
  border:1px solid ${p=>p.$primary?'rgba(34,197,94,0.35)':'rgba(14,165,233,0.25)'};
  background:${p=>p.$primary?'rgba(34,197,94,0.1)':'rgba(14,165,233,0.08)'};
  color:${p=>p.$primary?'#15803d':'#0369a1'};
  transition:background 0.15s,transform 0.15s;
  &:hover{transform:translateY(-1px);background:${p=>p.$primary?'rgba(34,197,94,0.16)':'rgba(14,165,233,0.12)'};}
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
/* ── fund allocation ────────────────────────────────── */
const AllocPage = styled.div`max-width:1100px;margin:0 auto;padding:1.5rem;width:100%;@media(max-width:640px){padding:1rem;}`;
const AllocHeader = styled.div`
  display:flex;align-items:flex-start;justify-content:space-between;gap:1rem;margin-bottom:1.25rem;flex-wrap:wrap;
`;
const AllocTitle = styled.h2`
  font-family:'Space Grotesk',sans-serif;font-size:1.3rem;font-weight:800;color:#0f172a;margin:0 0 0.25rem;
  display:flex;align-items:center;gap:0.5rem;
`;
const AllocSub = styled.p`font-size:0.82rem;color:#64748b;margin:0;max-width:560px;line-height:1.5;`;
const AllocActions = styled.div`display:flex;gap:0.5rem;flex-wrap:wrap;@media(max-width:640px){width:100%;}`;
const AllocBtn = styled.button`
  display:inline-flex;align-items:center;gap:0.45rem;padding:0.6rem 1rem;border-radius:8px;
  font-family:'Space Grotesk',sans-serif;font-size:0.8rem;font-weight:700;cursor:pointer;white-space:nowrap;
  border:1px solid ${p=>p.$primary?'#0f172a':'#e2e8f0'};
  background:${p=>p.$primary?'#0f172a':'#ffffff'};
  color:${p=>p.$primary?'#ffffff':'#0f172a'};
  transition:all 0.18s;
  &:hover:not(:disabled){background:${p=>p.$primary?'#1e293b':'#f8fafc'};border-color:${p=>p.$primary?'#1e293b':'#cbd5e1'};}
  &:disabled{opacity:0.55;cursor:not-allowed;}
  svg.spin{animation:${spinAnim} 0.85s linear infinite;}
  @media(max-width:640px){flex:1;justify-content:center;}
`;
const FundControlRow = styled.div`
  display:flex;align-items:flex-end;gap:1rem;flex-wrap:wrap;
  background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:1rem 1.25rem;margin-bottom:1.5rem;
`;
const FundField = styled.div`display:flex;flex-direction:column;gap:0.35rem;`;
const FundLabel = styled.label`font-size:0.65rem;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;color:#94a3b8;`;
const FundInput = styled.input`
  border:1px solid #e2e8f0;border-radius:8px;padding:0.55rem 0.75rem;font-size:0.9rem;font-weight:700;
  color:#0f172a;font-family:'JetBrains Mono',monospace;width:170px;background:#ffffff;
  &:focus{outline:none;border-color:#0f172a;box-shadow:0 0 0 3px rgba(15,23,42,0.05);}
`;
const FundHint = styled.div`font-size:0.72rem;color:#64748b;flex:1;min-width:200px;line-height:1.45;`;
const PieGrid = styled.div`
  display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.25rem;margin-bottom:1.5rem;
`;
const PieCard = styled.div`
  background:#ffffff;border:1px solid #e2e8f0;border-radius:14px;padding:1.25rem;
  box-shadow:0 1px 6px rgba(0,0,0,0.04);
`;
const PieCardTitle = styled.h3`
  font-family:'Space Grotesk',sans-serif;font-size:0.95rem;font-weight:700;color:#0f172a;margin:0 0 0.75rem;
  display:flex;align-items:center;gap:0.4rem;
`;
const PieLegend = styled.div`display:flex;flex-direction:column;gap:0.4rem;margin-top:0.75rem;`;
const LegendRow = styled.div`display:flex;align-items:center;gap:0.5rem;font-size:0.78rem;`;
const LegendDot = styled.span`width:10px;height:10px;border-radius:3px;background:${p=>p.$color};flex-shrink:0;`;
const LegendName = styled.span`flex:1;color:#475569;font-weight:600;`;
const LegendVal = styled.span`color:#0f172a;font-weight:800;font-family:'JetBrains Mono',monospace;`;
const AllocTableWrap = styled.div`
  background:#ffffff;border:1px solid #e2e8f0;border-radius:14px;overflow:hidden;box-shadow:0 1px 6px rgba(0,0,0,0.04);
`;
const AllocTableHead = styled.div`
  display:grid;grid-template-columns:2fr 1fr 1fr 1fr 1.2fr;gap:0.5rem;
  padding:0.75rem 1.1rem;background:#f8fafc;border-bottom:1px solid #f1f5f9;
  font-size:0.62rem;font-weight:800;text-transform:uppercase;letter-spacing:0.06em;color:#94a3b8;
  @media(max-width:640px){grid-template-columns:1.6fr 1fr 1fr;span:nth-child(4),span:nth-child(5){display:none;}}
`;
const AllocRow = styled.div`
  display:grid;grid-template-columns:2fr 1fr 1fr 1fr 1.2fr;gap:0.5rem;align-items:center;
  padding:0.7rem 1.1rem;border-bottom:1px solid #f8fafc;font-size:0.82rem;
  &:last-child{border-bottom:none;}
  @media(max-width:640px){grid-template-columns:1.6fr 1fr 1fr;div:nth-child(4),div:nth-child(5){display:none;}}
`;
const AllocSym = styled.div`font-weight:800;color:#0f172a;span{font-weight:400;color:#94a3b8;font-size:0.72rem;margin-left:0.35rem;}`;
const AllocPct = styled.div`font-weight:800;color:#0f172a;font-family:'JetBrains Mono',monospace;`;
const AllocDollars = styled.div`font-weight:700;color:#10b981;font-family:'JetBrains Mono',monospace;`;
const AllocBar = styled.div`height:6px;border-radius:3px;background:#f1f5f9;overflow:hidden;
  div{height:100%;border-radius:3px;background:${p=>p.$color||'#10b981'};width:${p=>p.$pct}%;}
`;
const SavedSection = styled.div`margin-top:2rem;`;
const SavedTitle = styled.h3`
  font-family:'Space Grotesk',sans-serif;font-size:1rem;font-weight:800;color:#0f172a;margin:0 0 0.85rem;
  display:flex;align-items:center;gap:0.5rem;
`;
const SavedGrid = styled.div`display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:0.85rem;`;
const SavedCard = styled.div`
  background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;padding:1rem;
  display:flex;flex-direction:column;gap:0.5rem;
`;
const SavedName = styled.div`font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:0.9rem;color:#0f172a;`;
const SavedMeta = styled.div`font-size:0.72rem;color:#94a3b8;`;
const SavedChips = styled.div`display:flex;flex-wrap:wrap;gap:0.3rem;`;
const SavedChip = styled.span`
  font-size:0.66rem;font-weight:700;padding:0.18rem 0.45rem;border-radius:5px;
  background:${p=>p.$bg||'#f1f5f9'};color:${p=>p.$color||'#475569'};font-family:'JetBrains Mono',monospace;
`;
const SavedActions = styled.div`display:flex;justify-content:space-between;align-items:center;margin-top:0.25rem;`;
const SavedLoadBtn = styled.button`
  border:none;background:none;color:#10b981;font-size:0.76rem;font-weight:700;cursor:pointer;padding:0;
  display:inline-flex;align-items:center;gap:0.3rem;&:hover{color:#059669;}
`;
const SavedDelBtn = styled.button`
  border:none;background:none;color:#cbd5e1;cursor:pointer;font-size:0.8rem;padding:0.2rem;
  &:hover{color:#ef4444;}
`;
const NameInput = styled.input`
  border:1px solid #e2e8f0;border-radius:8px;padding:0.55rem 0.75rem;font-size:0.85rem;font-weight:600;
  color:#0f172a;width:220px;background:#ffffff;font-family:inherit;
  &:focus{outline:none;border-color:#0f172a;box-shadow:0 0 0 3px rgba(15,23,42,0.05);}
  @media(max-width:640px){width:100%;}
`;

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
  const [searchParams, setSearchParams] = useSearchParams();

  const selectTab = useCallback((tab) => {
    setDashTab(tab);
    if (tab === 'news') {
      setSearchParams({}, { replace: true });
    } else {
      setSearchParams({ tab }, { replace: true });
    }
  }, [setSearchParams]);

  const [deepRunning,  setDeepRunning]  = useState(false);
  const [deepProgress, setDeepProgress] = useState(0);
  const [deepBatch,    setDeepBatch]    = useState(0);
  const [deepResult,   setDeepResult]   = useState(null);
  const [deepError,    setDeepError]    = useState(null);
  const [showPrefs,    setShowPrefs]    = useState(false);
  const [showAuthModal,setShowAuthModal]= useState(false);
  const [filterType,   setFilterType]   = useState('All'); // All | DeepDive | Discuss | Caution
  const [filterAsset,  setFilterAsset]  = useState('All');
  const [expandedRows, setExpandedRows] = useState({});
  const [selectedRow,  setSelectedRow]  = useState(null);

  // fund allocation state
  const [fundAmount,    setFundAmount]    = useState(10000);
  const [allocName,     setAllocName]     = useState('');
  const [savedAllocs,   setSavedAllocs]   = useState([]);
  const [savingAlloc,   setSavingAlloc]   = useState(false);
  const [allocSaved,    setAllocSaved]    = useState(false);

  // tabs: 'picks' | 'news' | 'journal' | 'allocation' | 'copilot' | 'movers'
  const [dashTab, setDashTab] = useState('news');

  useEffect(() => {
    const tab = searchParams.get('tab');
    const allowed = ['picks', 'news', 'journal', 'allocation', 'copilot', 'movers'];
    if (tab && allowed.includes(tab)) setDashTab(tab);
    if (tab && !allowed.includes(tab)) setDashTab('news');
  }, [searchParams]);

  // movers state
  const [moversData,    setMoversData]    = useState(null);
  const [moversLoading, setMoversLoading] = useState(false);
  const [moversError,   setMoversError]   = useState(null);
  const [moversExpanded, setMoversExpanded] = useState(null);

  const loadMovers = useCallback(async () => {
    if (moversLoading) return;
    setMoversLoading(true);
    setMoversError(null);
    try {
      const data = await api.getMovers();
      setMoversData(data);
    } catch (e) {
      setMoversError(e.message || 'Failed to load movers scan');
    } finally {
      setMoversLoading(false);
    }
  }, [moversLoading]);

  useEffect(() => {
    if (dashTab === 'movers' && !moversData && !moversLoading) loadMovers();
  }, [dashTab, moversData, moversLoading, loadMovers]);

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

  const [headlineTopics, setHeadlineTopics] = useState({});

  const handleAnalyseHeadline = useCallback(async (key, title, source) => {
    if (headlineLoading[key]) return;
    setHeadlineLoading(p=>({...p,[key]:true}));
    const cleanTitle = sanitizeHeadline(title);
    try {
      const {insight} = await api.analyseHeadline(cleanTitle, source);
      setHeadlineInsights(p=>({...p,[key]:insight}));
      const topic = matchHeadlineTopic(cleanTitle);
      setHeadlineTopics(p=>({...p,[key]:topic}));
      incrementHeadlinesDecoded();
      setMentorContext({
        source: 'headline-decoder',
        headline: cleanTitle,
        topicId: topic.id,
        topicLabel: topic.label,
      });
    } catch {
      setHeadlineInsights(p=>({...p,[key]:'Could not load analysis right now.'}));
    } finally {
      setHeadlineLoading(p=>({...p,[key]:false}));
    }
  }, [headlineLoading]);

  const saveHeadlineToJournal = useCallback((title, insight) => {
    const note = addJournalNote({
      title: `Headline: ${sanitizeHeadline(title).slice(0, 72)}`,
      text: insight,
      tag: 'headline',
    });
    setNotes(p=>[note,...p]);
    setFocusedNote(note.id);
    selectTab('journal');
  }, []);

  const updatedLabel = brief?.generatedAt
    ? new Date(brief.generatedAt).toLocaleTimeString(undefined,{timeStyle:'short'})
    : null;

  const lastRunLabel = deepResult?.generatedAt
    ? new Date(deepResult.generatedAt).toLocaleTimeString(undefined,{timeStyle:'short'})
    : updatedLabel;

  const copyPicksToNotes = useCallback(() => {
    if (!deepResult?.picks) return;
    const studies = deepResult.picks.filter(p=>isDeepDiveLevel(p.action || p.studyLevel));
    const text = studies.length>0
      ? `Market Lab case studies to review:\n\n`+studies.map(p=>`• ${p.ticker} (${p.company}): ${toStudyLevel(p.action)}\n  Lesson: ${p.thesis}\n  Research: ${p.researchFocus||p.entrySignal||'—'}\n  Risk: ${p.risk}`).join('\n\n')
      : `Market Lab run at ${new Date(deepResult.generatedAt).toLocaleString()}.\nNo deep-dive case studies yet — run analysis again.`;
    const n = { id:Date.now(), title:`Market Lab notes - ${new Date().toLocaleDateString('en-GB',{day:'numeric',month:'short'})}`,
      text, tag:'review', date:new Date().toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'}) };
    setNotes(p=>[n,...p]); setFocusedNote(n.id); selectTab('journal');
  }, [deepResult]);

  const rawPicks = deepResult?.picks||[];
  const confToPct   = c => c==='High'?85:c==='Medium'?65:45;
  const confToScore = c => c==='High'?82:c==='Medium'?61:34;

  const filteredPicks = useMemo(()=>rawPicks.filter(p=>{
    const level = toStudyLevel(p.studyLevel || p.action);
    const actionOk = filterType==='All'
      ||(filterType==='DeepDive'&&isDeepDiveLevel(level))
      ||(filterType==='Discuss'&&level==='Discuss')
      ||(filterType==='Caution'&&isCautionLevel(level));
    const assetOk = filterAsset==='All'||normaliseAssetType(p.assetType)===filterAsset;
    return actionOk&&assetOk;
  }),[rawPicks,filterType,filterAsset]);

  const counts = useMemo(()=>rawPicks.reduce((a,p)=>{
    const level = toStudyLevel(p.studyLevel || p.action);
    a[level]=(a[level]||0)+1;
    return a;
  },{}), [rawPicks]);

  const filterCounts = useMemo(() => ({
    All: rawPicks.length,
    DeepDive: (counts['Deep Dive'] || 0) + (counts['Study'] || 0),
    Discuss: counts['Discuss'] || 0,
    Caution: (counts['Caution'] || 0) + (counts['Skip'] || 0),
  }), [rawPicks.length, counts]);

  const avgConfidence = useMemo(()=>{
    if (!rawPicks.length) return null;
    return Math.round(rawPicks.reduce((s,p)=>s+confToPct(p.confidence),0)/rawPicks.length);
  },[rawPicks]);

  // ── fund allocation engine ──────────────────────────
  const STUDY_WEIGHT = { 'Deep Dive':3, Study:2, Discuss:1, Caution:0.4, Skip:0 };
  const CONF_WEIGHT  = { High:1, Medium:0.7, Low:0.45 };
  const ASSET_COLOR  = { Stocks:'#10b981', ETFs:'#3b82f6', Commodities:'#ca8a04', Crypto:'#f97316', 'Options Plays':'#8b5cf6' };
  const SECTOR_PALETTE = ['#10b981','#3b82f6','#f97316','#8b5cf6','#ec4899','#14b8a6','#f59e0b','#6366f1','#ef4444','#84cc16'];

  const allocation = useMemo(()=>{
    const investable = rawPicks
      .map(p=>{
        const level = toStudyLevel(p.studyLevel || p.action);
        const w = (STUDY_WEIGHT[level] ?? 0) * (CONF_WEIGHT[p.confidence] ?? 0.5);
        return { pick:p, level, weight:w };
      })
      .filter(x=>x.weight > 0);

    const totalWeight = investable.reduce((s,x)=>s+x.weight,0);
    if (!totalWeight) return { holdings:[], byAsset:[], bySector:[], count:0 };

    const holdings = investable.map(({pick,level,weight})=>{
      const pct = (weight/totalWeight)*100;
      const asset = normaliseAssetType(pick.assetType);
      return {
        ticker: pick.ticker,
        company: pick.company || '',
        assetType: asset,
        sector: pick.sector || 'Other',
        studyLevel: level,
        confidence: pick.confidence || 'Medium',
        pct: Math.round(pct*10)/10,
        dollars: Math.round((pct/100)*fundAmount*100)/100,
      };
    }).sort((a,b)=>b.pct-a.pct);

    const groupSum = (key) => {
      const m = {};
      holdings.forEach(h=>{ m[h[key]] = (m[h[key]]||0) + h.pct; });
      return Object.entries(m).map(([name,pct])=>({ name, pct:Math.round(pct*10)/10 })).sort((a,b)=>b.pct-a.pct);
    };

    const byAsset = groupSum('assetType').map(x=>({ ...x, color: ASSET_COLOR[x.name] || '#64748b' }));
    const bySector = groupSum('sector').map((x,i)=>({ ...x, color: SECTOR_PALETTE[i % SECTOR_PALETTE.length] }));

    return { holdings, byAsset, bySector, count:holdings.length };
  },[rawPicks, fundAmount]); // eslint-disable-line

  // Load saved allocations when user signs in / opens the tab
  useEffect(()=>{
    if (!user) { setSavedAllocs([]); return; }
    api.getAllocations()
      .then(({ allocations })=> setSavedAllocs(allocations || []))
      .catch(()=>{});
  }, [user]);

  // reset "saved" confirmation when results change
  useEffect(()=>{ setAllocSaved(false); }, [deepResult, fundAmount]);

  const handleSaveAllocation = useCallback(async ()=>{
    if (!user) { setShowAuthModal(true); return; }
    if (!allocation.holdings.length) return;
    setSavingAlloc(true);
    try {
      const name = (allocName.trim()) || `Allocation ${new Date().toLocaleDateString('en-GB',{day:'numeric',month:'short'})}`;
      const { allocation: saved } = await api.saveAllocation({
        name,
        fundAmount: Number(fundAmount) || 100,
        allocations: allocation.holdings,
        breakdown: { byAsset: allocation.byAsset, bySector: allocation.bySector },
        preferences: { ...prefs, assetTypes: activeTypes },
      });
      if (saved) setSavedAllocs(prev=>[saved, ...prev]);
      setAllocName('');
      setAllocSaved(true);
    } catch (e) {
      setDeepError(e.message || 'Could not save allocation');
    } finally {
      setSavingAlloc(false);
    }
  }, [user, allocation, allocName, fundAmount, prefs, activeTypes]); // eslint-disable-line

  const handleDeleteAllocation = useCallback(async (id)=>{
    setSavedAllocs(prev=>prev.filter(a=>a.id!==id));
    try { await api.deleteAllocation(id); } catch { /* ignore */ }
  }, []);

  const handleLoadAllocation = useCallback((a)=>{
    if (a.fund_amount) setFundAmount(Number(a.fund_amount));
    selectTab('allocation');
  }, [selectTab]);

  const allHeadlines = brief?.headlines||[];
  const uniqueSources = useMemo(()=>{
    const s=new Set(allHeadlines.map(h=>h.source).filter(Boolean));
    return ['All',...Array.from(s).sort()];
  },[allHeadlines]);

  const filteredNews = useMemo(()=>{
    let h = allHeadlines.map((x) => ({
      ...x,
      title: sanitizeHeadline(x.title),
      summary: sanitizeHeadline(x.summary),
    }));
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
    <Page $copilot={dashTab === 'copilot'}>
      {dashTab !== 'copilot' && (
        <IntelligenceBar>
          <IntelligenceTitle>BloomVest Intelligence</IntelligenceTitle>
          <IntelligenceSub>Headlines · Market Lab · Fund Allocation · Copilot</IntelligenceSub>
        </IntelligenceBar>
      )}

      <DashTabBar>
        <DashTabBtn $active={dashTab==='news'} onClick={()=>selectTab('news')}><FaNewspaper/>Headline Decoder</DashTabBtn>
        <DashTabBtn $active={dashTab==='picks'} onClick={()=>selectTab('picks')}><FaMagic/>Market Lab</DashTabBtn>
        <DashTabBtn $active={dashTab==='movers'} onClick={()=>selectTab('movers')}><FaFire/>Movers Scanner</DashTabBtn>
        <DashTabBtn $active={dashTab==='allocation'} onClick={()=>selectTab('allocation')}><FaChartPie/>Fund Allocation</DashTabBtn>
        <DashTabBtn $active={dashTab==='journal'} onClick={()=>selectTab('journal')}><FaBookOpen/>Reflection Journal</DashTabBtn>
        <DashTabBtn $active={dashTab==='copilot'} onClick={()=>selectTab('copilot')}><FaRobot/>Copilot</DashTabBtn>
      </DashTabBar>

      {dashTab !== 'copilot' && (
      <div style={{
        margin:'0 1.25rem 0.75rem', padding:'0.55rem 0.85rem', borderRadius:8,
        background:'rgba(34,197,94,0.06)', border:'1px solid rgba(34,197,94,0.2)',
        fontSize:'0.75rem', color:'#475569', lineHeight:1.45,
      }}>
        {EDUCATION_DISCLAIMER}
      </div>
      )}

      {dashTab === 'picks' && (
        <TopHeader>
          <HeaderLeft>
            <Brand>Market Lab</Brand>
            <Slash>/</Slash>
            <PageTitle>AI case studies</PageTitle>
          </HeaderLeft>

          <FilterGroup>
            {[
              { id: 'All', label: 'All', color: '#cbd5e1' },
              { id: 'DeepDive', label: 'Deep dive', color: '#10b981' },
              { id: 'Discuss', label: 'Discuss', color: '#f59e0b' },
              { id: 'Caution', label: 'Caution', color: '#ef4444' },
            ].map(({ id, label, color }) => (
              <FilterBtn
                key={id}
                type="button"
                $active={filterType === id}
                onClick={() => setFilterType(id)}
              >
                <FilterDot $color={color} />
                {label}{filterCounts[id] > 0 ? ` ${filterCounts[id]}` : ''}
              </FilterBtn>
            ))}
          </FilterGroup>

          <HeaderRight>
            <LastRunInfo>
              LAST RUN <span>{lastRunLabel || 'N/A'}</span>
            </LastRunInfo>
            <RefreshBtn type="button" onClick={() => load(true)} disabled={loading || refreshing}>
              <FaSyncAlt className={refreshing ? 'spin' : ''} />
            </RefreshBtn>
            <PrefsToggleBtn type="button" $active={showPrefs} onClick={() => setShowPrefs(!showPrefs)}>
              <FaFilter /> <span>Preferences</span>
            </PrefsToggleBtn>
            <RunBtn type="button" onClick={runDeepAnalysis} disabled={deepRunning}>
              <FaMagic /> {deepRunning ? 'Running…' : 'Run AI analysis'}
            </RunBtn>
          </HeaderRight>
        </TopHeader>
      )}

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
            <SumItem>
              <SumLabel>Assets Analyzed</SumLabel>
              <SumValue>{rawPicks.length || '—'}</SumValue>
              {rawPicks.length > 0 && <div style={{fontSize:'0.6rem',color:'#94a3b8',marginTop:2}}>{TOTAL_BATCHES} batches · live data</div>}
            </SumItem>
            <SumItem>
              <SumLabel>Deep dives</SumLabel>
              <SumValue $color="#10b981">{(counts['Deep Dive']||0)+(counts['Study']||0) || '—'}</SumValue>
            </SumItem>
            <SumItem>
              <SumLabel>Discuss</SumLabel>
              <SumValue $color="#f59e0b">{counts['Discuss']||0 || '—'}</SumValue>
            </SumItem>
            <SumItem>
              <SumLabel>Caution / Skip</SumLabel>
              <SumValue $color="#ef4444">{(counts['Caution']||0)+(counts['Skip']||0) || '—'}</SumValue>
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
                <THLeft>Case studies <span>{filteredPicks.length} results{deepResult?.batchesCompleted?` · ${deepResult.batchesCompleted} batches`:''}</span></THLeft>
                <THRight>
                  {deepResult && (
                    <>
                      <CopyPicksBtn type="button" onClick={copyPicksToNotes}><FaBookOpen/> Save to Journal</CopyPicksBtn>
                      <THGroup style={{color:'#10b981'}}>Complete · {new Date(deepResult.generatedAt).toLocaleTimeString(undefined,{timeStyle:'short'})}</THGroup>
                    </>
                  )}
                </THRight>
              </TableHeader>

              <TableWrap>
                <THead>
                  <THCell>Asset</THCell>
                  <THCell>Study focus</THCell>
                  <THCell>AI Confidence</THCell>
                  <THCell>Thesis (click to expand)</THCell>
                  <THCell>Main Risk</THCell>
                </THead>

                {!deepResult && !deepRunning && (
                  <EmptyState>
                    <FaMagic/>
                    <EmptyTitle>No analysis yet</EmptyTitle>
                    <EmptyDesc>Set preferences above and click <strong>Run Market Lab</strong> to generate case studies from {TOTAL_BATCHES} batches of live headlines.</EmptyDesc>
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
                  const level = toStudyLevel(pick.studyLevel || pick.action);
                  const style = studyLevelStyle(level);
                  const vColor = style.barColor;
                  const vBg = style.bg;
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
                          <VerdictBadge $bg={vBg} $color={style.color}>
                            <FilterDot $color={vColor} style={{width:4,height:4}}/> {level}
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
                      </TRow>

                      {/* expanded detail drawer */}
                      <AnimatePresence>
                        {isSelected && (
                          <motion.div key={`detail-${i}`} initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} exit={{opacity:0,height:0}} transition={{duration:0.2}}>
                            <DetailDrawer>
                              <DetailBlock>
                                <DetailLabel>Research focus</DetailLabel>
                                <DetailValue>{pick.researchFocus||pick.entrySignal||'—'}</DetailValue>
                              </DetailBlock>
                              {pick.learnerQuestion && (
                              <DetailBlock>
                                <DetailLabel>Quiz yourself</DetailLabel>
                                <DetailValue>{pick.learnerQuestion}</DetailValue>
                              </DetailBlock>
                              )}
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
              {deepResult && (
                <LabNextSteps>
                  <LabNextLabel>Next steps</LabNextLabel>
                  <LabNextBtn type="button" onClick={copyPicksToNotes}>Save to journal</LabNextBtn>
                  <LabNextLink
                    to="/mentor"
                    $primary
                    onClick={() => setMentorContext({ source: 'market-lab', headline: 'Market Lab case studies' })}
                  >
                    Discuss with Mentor
                  </LabNextLink>
                </LabNextSteps>
              )}
            </MainCol>
          </Shell>
        </>
      )}

      {/* ══════════════════════════════════════════════
          HEADLINE DECODER
      ══════════════════════════════════════════════ */}
      {dashTab==='news' && (
        <NewsFeedWrap>
          <IqLearningStrip />
          <NewsFeedHeader>
            <NewsFeedTitle>
              Headline Decoder <span>{filteredNews.length} headlines</span>
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
                <EmptyDesc>Click refresh in the header to load the latest headlines from live sources.</EmptyDesc>
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
                      <NewsInsightBtn type="button" disabled={loading} onClick={()=>handleAnalyseHeadline(key,sanitizeHeadline(h.title),h.source)}>
                        {loading?<Spinner/>:<FaChartLine/>}
                        {loading?'…':'Decode'}
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
                      <InsightActions>
                        <InsightActionBtn type="button" onClick={() => saveHeadlineToJournal(h.title, insight)}>
                          <FaBookOpen style={{ fontSize:'0.72rem' }} /> Save to journal
                        </InsightActionBtn>
                      </InsightActions>
                      <LearningLinks
                        topic={headlineTopics[key]}
                        mentorQuery={headlineTopics[key]
                          ? `Help me understand this headline in plain English: "${sanitizeHeadline(h.title).slice(0, 120)}"`
                          : undefined}
                      />
                    </NewsInsightBox>
                  )}
                </NewsItem>
              );
            })}
          </NewsGrid>
        </NewsFeedWrap>
      )}


      {/* DOCUMENT ANALYST TAB REMOVED */}
      {false && (
        <DocWrap>
          <DocHeader>
            <DocTitle><FaFileAlt style={{color:'#10b981'}}/> Document Analyst</DocTitle>
            <DocSubtitle>
              Paste an earnings call transcript, 10-K filing, 8-K, or any financial document.
              Learn to extract key metrics, themes, risks, and a learning takeaway — not buy/sell advice.
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

                {docResult.verdict && (() => {
                  const doc = docStanceStyle(docResult.verdict.stance);
                  return (
                  <DocVerdictBox
                    $stance={doc.label}
                    initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.12}}
                    style={{ background: doc.bg, borderColor: doc.border }}>
                    <DocResultLabel>Learning takeaway</DocResultLabel>
                    <DocVerdictStance $stance={doc.label} style={{ color: doc.color }}>
                      {doc.label} · {docResult.verdict.confidence} confidence
                    </DocVerdictStance>
                    <div style={{fontSize:'0.85rem',color:'#374151',lineHeight:1.6}}>{docResult.verdict.rationale}</div>
                    {docResult.learnerQuestions?.length > 0 && (
                      <ul style={{ margin:'0.75rem 0 0', paddingLeft:'1.1rem', fontSize:'0.82rem', color:'#475569' }}>
                        {docResult.learnerQuestions.map((q, qi) => <li key={qi}>{q}</li>)}
                      </ul>
                    )}
                  </DocVerdictBox>
                  );
                })()}
              </DocResultGrid>
            </AnimatePresence>
          )}

          {!docResult && !docLoading && (
            <div style={{marginTop:'2.5rem',textAlign:'center',color:'#94a3b8',fontSize:'0.82rem',lineHeight:1.6}}>
              <FaFileAlt style={{fontSize:'2rem',opacity:0.2,display:'block',margin:'0 auto 0.75rem'}}/>
              Paste a document above and click Analyse to practice reading filings like a student — metrics, risks, and quiz questions.
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
      {dashTab==='allocation' && (
        <AllocPage>
          <AllocHeader>
            <div>
              <AllocTitle><FaChartPie style={{color:'#10b981'}}/> Fund Allocation</AllocTitle>
              <AllocSub>
                A study model that splits a hypothetical fund across your latest Market Lab case studies — weighted by study priority and AI confidence. Educational only, not investment advice.
              </AllocSub>
            </div>
            <AllocActions>
              <AllocBtn type="button" onClick={runDeepAnalysis} disabled={deepRunning}>
                <FaRedo/> {deepRunning ? 'Running…' : 'Run new analysis'}
              </AllocBtn>
            </AllocActions>
          </AllocHeader>

          {allocation.count === 0 ? (
            <EmptyState style={{background:'#fff',border:'1px solid #e2e8f0',borderRadius:14}}>
              <FaChartPie/>
              <EmptyTitle>No allocation yet</EmptyTitle>
              <EmptyDesc>
                Run a Market Lab analysis first. We'll turn the case studies into a weighted fund split with pie breakdowns by asset class and sector.
              </EmptyDesc>
              <AllocBtn type="button" $primary onClick={runDeepAnalysis} disabled={deepRunning} style={{marginTop:'0.5rem'}}>
                <FaMagic/> {deepRunning ? 'Running…' : 'Run AI analysis'}
              </AllocBtn>
            </EmptyState>
          ) : (
            <>
              <FundControlRow>
                <FundField>
                  <FundLabel>Hypothetical fund size</FundLabel>
                  <FundInput
                    type="number" min="1" step="100"
                    value={fundAmount}
                    onChange={(e)=>setFundAmount(Math.max(1, Number(e.target.value) || 0))}
                  />
                </FundField>
                <FundHint>
                  100% of the fund is split across <strong>{allocation.count}</strong> case studies. Weighting = study priority (Deep Dive &gt; Study &gt; Discuss) × AI confidence. Caution/Skip levels are excluded.
                </FundHint>
              </FundControlRow>

              <PieGrid>
                <PieCard>
                  <PieCardTitle><FaCoins style={{color:'#10b981'}}/> By Asset Class</PieCardTitle>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={allocation.byAsset} dataKey="pct" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2}>
                        {allocation.byAsset.map((d)=><Cell key={d.name} fill={d.color}/>)}
                      </Pie>
                      <RcTooltip formatter={(v)=>`${v}%`}/>
                    </PieChart>
                  </ResponsiveContainer>
                  <PieLegend>
                    {allocation.byAsset.map(d=>(
                      <LegendRow key={d.name}>
                        <LegendDot $color={d.color}/>
                        <LegendName>{d.name}</LegendName>
                        <LegendVal>{d.pct}%</LegendVal>
                      </LegendRow>
                    ))}
                  </PieLegend>
                </PieCard>

                <PieCard>
                  <PieCardTitle><FaChartPie style={{color:'#3b82f6'}}/> By Sector</PieCardTitle>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={allocation.bySector} dataKey="pct" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2}>
                        {allocation.bySector.map((d)=><Cell key={d.name} fill={d.color}/>)}
                      </Pie>
                      <RcTooltip formatter={(v)=>`${v}%`}/>
                    </PieChart>
                  </ResponsiveContainer>
                  <PieLegend>
                    {allocation.bySector.slice(0,8).map(d=>(
                      <LegendRow key={d.name}>
                        <LegendDot $color={d.color}/>
                        <LegendName>{d.name}</LegendName>
                        <LegendVal>{d.pct}%</LegendVal>
                      </LegendRow>
                    ))}
                  </PieLegend>
                </PieCard>
              </PieGrid>

              <AllocTableWrap>
                <AllocTableHead>
                  <span>Holding</span>
                  <span>Asset</span>
                  <span>Weight</span>
                  <span>Amount</span>
                  <span>Split</span>
                </AllocTableHead>
                {allocation.holdings.map(h=>(
                  <AllocRow key={h.ticker}>
                    <AllocSym>{h.ticker}<span>{h.company}</span></AllocSym>
                    <div style={{fontSize:'0.74rem',fontWeight:700,color:ASSET_COLOR[h.assetType]||'#64748b'}}>{h.assetType}</div>
                    <AllocPct>{h.pct}%</AllocPct>
                    <AllocDollars>${h.dollars.toLocaleString()}</AllocDollars>
                    <AllocBar $pct={h.pct} $color={ASSET_COLOR[h.assetType]||'#10b981'}><div/></AllocBar>
                  </AllocRow>
                ))}
              </AllocTableWrap>

              <FundControlRow style={{marginTop:'1.5rem',marginBottom:0}}>
                <FundField>
                  <FundLabel>Save this allocation</FundLabel>
                  <NameInput
                    placeholder="e.g. Balanced growth model"
                    value={allocName}
                    onChange={(e)=>setAllocName(e.target.value)}
                  />
                </FundField>
                <AllocBtn type="button" $primary onClick={handleSaveAllocation} disabled={savingAlloc}>
                  {savingAlloc ? <FaSpinner className="spin"/> : allocSaved ? <FaCheck/> : <FaSave/>}
                  {savingAlloc ? 'Saving…' : allocSaved ? 'Saved' : 'Save to database'}
                </AllocBtn>
                <FundHint style={{flexBasis:'100%'}}>
                  {user ? 'Saved allocations are stored to your account and listed below.' : 'Sign in to save allocations to your account.'}
                </FundHint>
              </FundControlRow>

              {savedAllocs.length > 0 && (
                <SavedSection>
                  <SavedTitle><FaBookOpen style={{color:'#10b981'}}/> Saved allocations</SavedTitle>
                  <SavedGrid>
                    {savedAllocs.map(a=>{
                      const top = Array.isArray(a.allocations) ? a.allocations.slice(0,4) : [];
                      return (
                        <SavedCard key={a.id}>
                          <SavedName>{a.name}</SavedName>
                          <SavedMeta>
                            ${Number(a.fund_amount).toLocaleString()} · {Array.isArray(a.allocations)?a.allocations.length:0} holdings · {new Date(a.created_at).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})}
                          </SavedMeta>
                          <SavedChips>
                            {top.map(h=>(
                              <SavedChip key={h.ticker} $bg="rgba(16,185,129,0.1)" $color="#059669">{h.ticker} {h.pct}%</SavedChip>
                            ))}
                          </SavedChips>
                          <SavedActions>
                            <SavedLoadBtn type="button" onClick={()=>handleLoadAllocation(a)}><FaCoins/> Use fund size</SavedLoadBtn>
                            <SavedDelBtn type="button" onClick={()=>handleDeleteAllocation(a.id)} aria-label="Delete"><FaTrash/></SavedDelBtn>
                          </SavedActions>
                        </SavedCard>
                      );
                    })}
                  </SavedGrid>
                </SavedSection>
              )}
            </>
          )}
        </AllocPage>
      )}
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
      {dashTab==='movers' && (
        <div style={{padding:'1.25rem',maxWidth:900,margin:'0 auto'}}>
          {/* Header row */}
          <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',flexWrap:'wrap',gap:'0.75rem',marginBottom:'1.25rem'}}>
            <div>
              <div style={{fontSize:'0.65rem',fontWeight:800,textTransform:'uppercase',letterSpacing:'0.12em',color:'#10b981',marginBottom:'0.2rem'}}>BloomVest Intelligence</div>
              <h2 style={{margin:0,fontFamily:"'Space Grotesk',sans-serif",fontSize:'1.35rem',fontWeight:800,color:'#0f172a',letterSpacing:'-0.02em'}}>Movers Scanner</h2>
              <p style={{margin:'0.2rem 0 0',fontSize:'0.78rem',color:'#64748b'}}>AI-spotted stocks &amp; assets with explosive movement potential</p>
            </div>
            <div style={{display:'flex',gap:'0.5rem',alignItems:'center',flexWrap:'wrap'}}>
              {moversData && (
                <div style={{fontSize:'0.7rem',color:'#64748b',fontWeight:600}}>
                  Updated {new Date(moversData.generatedAt).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}
                  {moversData.cached && <span style={{marginLeft:4,color:'#94a3b8'}}>(cached)</span>}
                </div>
              )}
              <button
                onClick={()=>{setMoversData(null);loadMovers();}}
                disabled={moversLoading}
                style={{display:'inline-flex',alignItems:'center',gap:'0.4rem',padding:'0.45rem 0.9rem',borderRadius:8,border:'1px solid #e2e8f0',background:'#fff',color:'#0f172a',fontSize:'0.75rem',fontWeight:700,cursor:moversLoading?'not-allowed':'pointer',opacity:moversLoading?0.6:1}}>
                <FaSyncAlt className={moversLoading?'spin':''} style={{fontSize:'0.7rem'}}/> {moversLoading?'Scanning…':'Re-scan'}
              </button>
            </div>
          </div>

          {/* Loading skeleton */}
          {moversLoading && (
            <div style={{display:'flex',flexDirection:'column',gap:'0.75rem'}}>
              {[1,2,3].map(i=>(
                <div key={i} style={{height:80,borderRadius:12,background:'linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)',backgroundSize:'200% 100%',animation:'shimmer 1.4s infinite'}}/>
              ))}
            </div>
          )}

          {/* Error */}
          {moversError && !moversLoading && (
            <div style={{padding:'1.5rem',borderRadius:12,background:'#fef2f2',border:'1px solid #fecaca',color:'#dc2626',fontSize:'0.85rem',fontWeight:600}}>
              {moversError} — <button onClick={loadMovers} style={{background:'none',border:'none',color:'#dc2626',textDecoration:'underline',cursor:'pointer',fontWeight:700}}>Retry</button>
            </div>
          )}

          {/* Market mood + top theme summary */}
          {moversData && !moversLoading && (
            <>
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:'0.75rem',marginBottom:'1.25rem'}}>
                <div style={{padding:'0.9rem 1.1rem',borderRadius:12,background:moversData.marketMood==='Risk-On'?'rgba(16,185,129,0.07)':moversData.marketMood==='Risk-Off'?'rgba(239,68,68,0.07)':'rgba(245,158,11,0.07)',border:`1px solid ${moversData.marketMood==='Risk-On'?'rgba(16,185,129,0.2)':moversData.marketMood==='Risk-Off'?'rgba(239,68,68,0.2)':'rgba(245,158,11,0.2)'}`}}>
                  <div style={{fontSize:'0.6rem',fontWeight:800,textTransform:'uppercase',letterSpacing:'0.1em',color:'#94a3b8',marginBottom:'0.25rem'}}>Market Mood</div>
                  <div style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:800,fontSize:'1.1rem',color:moversData.marketMood==='Risk-On'?'#10b981':moversData.marketMood==='Risk-Off'?'#ef4444':'#f59e0b'}}>{moversData.marketMood}</div>
                </div>
                <div style={{padding:'0.9rem 1.1rem',borderRadius:12,background:'rgba(99,102,241,0.06)',border:'1px solid rgba(99,102,241,0.15)',gridColumn:'span 2'}}>
                  <div style={{fontSize:'0.6rem',fontWeight:800,textTransform:'uppercase',letterSpacing:'0.1em',color:'#94a3b8',marginBottom:'0.25rem'}}>Top Theme</div>
                  <div style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:700,fontSize:'0.95rem',color:'#0f172a'}}>{moversData.topTheme}</div>
                </div>
              </div>

              {moversData.scanSummary && (
                <div style={{padding:'0.9rem 1.1rem',borderRadius:12,background:'#f8fafc',border:'1px solid #e2e8f0',fontSize:'0.82rem',color:'#475569',lineHeight:1.6,marginBottom:'1.25rem',borderLeft:'3px solid #10b981'}}>
                  {moversData.scanSummary}
                </div>
              )}

              {/* AV real-time movers strip */}
              {moversData.avMovers && (moversData.avMovers.gainers.length > 0 || moversData.avMovers.losers.length > 0) && (
                <div style={{marginBottom:'1.25rem'}}>
                  <div style={{fontSize:'0.65rem',fontWeight:800,textTransform:'uppercase',letterSpacing:'0.1em',color:'#94a3b8',marginBottom:'0.6rem'}}>Real-Time Top Movers (Alpha Vantage)</div>
                  <div style={{display:'flex',gap:'0.5rem',flexWrap:'wrap'}}>
                    {moversData.avMovers.gainers.slice(0,4).map(g=>(
                      <div key={g.ticker} style={{display:'inline-flex',alignItems:'center',gap:'0.35rem',padding:'0.3rem 0.7rem',borderRadius:100,background:'rgba(16,185,129,0.08)',border:'1px solid rgba(16,185,129,0.2)',fontSize:'0.75rem',fontWeight:700,color:'#065f46'}}>
                        <FaArrowUp style={{fontSize:'0.6rem',color:'#10b981'}}/> {g.ticker} <span style={{color:'#10b981'}}>{g.changePct}</span>
                      </div>
                    ))}
                    {moversData.avMovers.losers.slice(0,4).map(l=>(
                      <div key={l.ticker} style={{display:'inline-flex',alignItems:'center',gap:'0.35rem',padding:'0.3rem 0.7rem',borderRadius:100,background:'rgba(239,68,68,0.07)',border:'1px solid rgba(239,68,68,0.15)',fontSize:'0.75rem',fontWeight:700,color:'#7f1d1d'}}>
                        <FaArrowDown style={{fontSize:'0.6rem',color:'#ef4444'}}/> {l.ticker} <span style={{color:'#ef4444'}}>{l.changePct}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Catalyst cards */}
              <div style={{fontSize:'0.65rem',fontWeight:800,textTransform:'uppercase',letterSpacing:'0.1em',color:'#94a3b8',marginBottom:'0.75rem'}}>
                AI-Identified Movement Catalysts ({moversData.catalysts.length})
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:'0.65rem'}}>
                {moversData.catalysts.map((c, i) => {
                  const isOpen = moversExpanded === i;
                  const urgencyColor = c.urgency==='High'?'#ef4444':c.urgency==='Medium'?'#f59e0b':'#64748b';
                  const urgencyBg   = c.urgency==='High'?'rgba(239,68,68,0.08)':c.urgency==='Medium'?'rgba(245,158,11,0.08)':'rgba(100,116,139,0.08)';
                  const dirColor = c.direction==='Up'?'#10b981':c.direction==='Down'?'#ef4444':'#6366f1';
                  const DirIcon = c.direction==='Up'?FaArrowUp:c.direction==='Down'?FaArrowDown:FaExchangeAlt;
                  const typeColors = {Breakout:'#6366f1',Catalyst:'#f59e0b',Reversal:'#ec4899',Momentum:'#10b981',Squeeze:'#ef4444','Event-Driven':'#3b82f6'};
                  const typeColor = typeColors[c.movementType] || '#64748b';
                  return (
                    <motion.div key={i}
                      initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*0.04}}
                      style={{borderRadius:12,border:`1px solid ${isOpen?'#cbd5e1':'#f1f5f9'}`,background:'#fff',overflow:'hidden',cursor:'pointer',transition:'border-color 0.2s,box-shadow 0.2s',boxShadow:isOpen?'0 4px 16px rgba(0,0,0,0.06)':'none'}}
                      onClick={()=>setMoversExpanded(isOpen?null:i)}>
                      <div style={{padding:'0.85rem 1rem',display:'flex',alignItems:'center',gap:'0.75rem'}}>
                        {/* Direction badge */}
                        <div style={{width:38,height:38,borderRadius:10,background:`rgba(${c.direction==='Up'?'16,185,129':c.direction==='Down'?'239,68,68':'99,102,241'},0.1)`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                          <DirIcon style={{color:dirColor,fontSize:'0.9rem'}}/>
                        </div>
                        {/* Meta */}
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{display:'flex',alignItems:'center',gap:'0.4rem',flexWrap:'wrap'}}>
                            <span style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:800,fontSize:'0.95rem',color:'#0f172a'}}>{c.ticker}</span>
                            <span style={{fontSize:'0.72rem',color:'#64748b'}}>{c.name}</span>
                            <span style={{fontSize:'0.65rem',fontWeight:700,padding:'0.1rem 0.45rem',borderRadius:100,background:`rgba(${typeColor.slice(1).match(/../g).map(h=>parseInt(h,16)).join(',')},0.1)`,color:typeColor}}>{c.movementType}</span>
                          </div>
                          <div style={{fontSize:'0.75rem',color:'#94a3b8',marginTop:'0.15rem'}}>{c.triggerEvent}</div>
                        </div>
                        {/* Right badges */}
                        <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:'0.25rem',flexShrink:0}}>
                          <span style={{fontSize:'0.68rem',fontWeight:800,padding:'0.15rem 0.5rem',borderRadius:100,background:urgencyBg,color:urgencyColor}}>{c.urgency}</span>
                          <span style={{fontSize:'0.68rem',fontWeight:700,color:'#64748b'}}>{c.magnitude} · {c.timeframe}</span>
                          <span style={{color:'#94a3b8',fontSize:'0.75rem'}}>{isOpen?<FaChevronUp/>:<FaChevronDown/>}</span>
                        </div>
                      </div>
                      {/* Expanded detail */}
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} transition={{duration:0.2}}>
                            <div style={{padding:'0 1rem 1rem',borderTop:'1px solid #f1f5f9',paddingTop:'0.85rem',display:'flex',flexDirection:'column',gap:'0.65rem'}}>
                              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))',gap:'0.5rem'}}>
                                <div style={{padding:'0.6rem 0.75rem',borderRadius:8,background:'#f8fafc'}}>
                                  <div style={{fontSize:'0.58rem',fontWeight:800,textTransform:'uppercase',letterSpacing:'0.08em',color:'#94a3b8',marginBottom:'0.2rem'}}>Asset Type</div>
                                  <div style={{fontWeight:700,fontSize:'0.82rem',color:'#0f172a'}}>{c.assetType}</div>
                                </div>
                                <div style={{padding:'0.6rem 0.75rem',borderRadius:8,background:'#f8fafc'}}>
                                  <div style={{fontSize:'0.58rem',fontWeight:800,textTransform:'uppercase',letterSpacing:'0.08em',color:'#94a3b8',marginBottom:'0.2rem'}}>Direction</div>
                                  <div style={{fontWeight:700,fontSize:'0.82rem',color:dirColor}}>{c.direction}</div>
                                </div>
                                <div style={{padding:'0.6rem 0.75rem',borderRadius:8,background:'#f8fafc'}}>
                                  <div style={{fontSize:'0.58rem',fontWeight:800,textTransform:'uppercase',letterSpacing:'0.08em',color:'#94a3b8',marginBottom:'0.2rem'}}>Expected Move</div>
                                  <div style={{fontWeight:700,fontSize:'0.82rem',color:'#0f172a'}}>{c.magnitude}</div>
                                </div>
                                <div style={{padding:'0.6rem 0.75rem',borderRadius:8,background:'#f8fafc'}}>
                                  <div style={{fontSize:'0.58rem',fontWeight:800,textTransform:'uppercase',letterSpacing:'0.08em',color:'#94a3b8',marginBottom:'0.2rem'}}>Timeframe</div>
                                  <div style={{fontWeight:700,fontSize:'0.82rem',color:'#0f172a'}}>{c.timeframe}</div>
                                </div>
                              </div>
                              {c.technicalNote && (
                                <div style={{fontSize:'0.8rem',color:'#475569',lineHeight:1.55,padding:'0.65rem 0.85rem',borderRadius:8,background:'rgba(99,102,241,0.05)',borderLeft:'3px solid #6366f1'}}>
                                  <span style={{fontSize:'0.6rem',fontWeight:800,textTransform:'uppercase',letterSpacing:'0.08em',color:'#94a3b8',display:'block',marginBottom:'0.25rem'}}>Technical Setup</span>
                                  {c.technicalNote}
                                </div>
                              )}
                              <div style={{fontSize:'0.8rem',color:'#475569',lineHeight:1.55,padding:'0.65rem 0.85rem',borderRadius:8,background:'rgba(239,68,68,0.04)',borderLeft:'3px solid #fca5a5'}}>
                                <span style={{fontSize:'0.6rem',fontWeight:800,textTransform:'uppercase',letterSpacing:'0.08em',color:'#94a3b8',display:'block',marginBottom:'0.25rem'}}>Key Risk</span>
                                {c.risk}
                              </div>
                              {c.nairaRelevance && (
                                <div style={{fontSize:'0.8rem',color:'#475569',lineHeight:1.55,padding:'0.65rem 0.85rem',borderRadius:8,background:'rgba(16,185,129,0.04)',borderLeft:'3px solid #6ee7b7'}}>
                                  <span style={{fontSize:'0.6rem',fontWeight:800,textTransform:'uppercase',letterSpacing:'0.08em',color:'#94a3b8',display:'block',marginBottom:'0.25rem'}}>Nigeria / Africa Angle</span>
                                  {c.nairaRelevance}
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>

              <p style={{fontSize:'0.68rem',color:'#94a3b8',textAlign:'center',marginTop:'1.5rem',lineHeight:1.5}}>
                For educational purposes only. Not financial advice. AI analysis is derived from public headlines and may be delayed. Capital at risk.
              </p>
            </>
          )}
        </div>
      )}
      {dashTab==='copilot' && (
        <CopilotPane>
          <MentorPage embedded />
        </CopilotPane>
      )}
    </Page>

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
