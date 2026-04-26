import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaBolt, FaGem, FaSyncAlt, FaSearch,
  FaChevronDown, FaChevronUp, FaCheckCircle,
  FaArrowUp, FaArrowDown, FaMinus, FaExchangeAlt,
  FaFilter, FaBookOpen, FaPlus, FaTrash, FaMagic, FaSpinner, FaChartLine,
  FaBold, FaItalic, FaListUl, FaTag, FaRobot, FaTimes, FaLightbulb,
  FaExclamationTriangle, FaAlignLeft, FaSearch as FaSearchIcon
} from 'react-icons/fa';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';
import { api } from '../api';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

/* ── animations ─────────────────────────────────────── */
const slide = keyframes`from{transform:translateX(0)}to{transform:translateX(-50%)}`;
const spinAnim = keyframes`to{transform:rotate(360deg)}`;
const pulse = keyframes`0%,100%{opacity:1}50%{opacity:.45}`;

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
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  flex: 1;
`;
const Brand = styled.span`
  font-size: 0.8rem;
  font-weight: 700;
  color: #10b981;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;
const Slash = styled.span`
  color: #cbd5e1;
  font-weight: 300;
`;
const PageTitle = styled.h1`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.1rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
`;

const FilterGroup = styled.div`
  display: flex;
  background: #f8fafc;
  border-radius: 8px;
  padding: 4px;
  border: 1px solid #e2e8f0;
  gap: 2px;

  @media (max-width: 640px) {
    width: 100%;
    justify-content: space-between;
  }
`;
const FilterBtn = styled.button`
  background: ${p => p.$active ? '#ffffff' : 'transparent'};
  border: 1px solid ${p => p.$active ? '#e2e8f0' : 'transparent'};
  box-shadow: ${p => p.$active ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'};
  color: ${p => p.$active ? '#0f172a' : '#64748b'};
  padding: 0.3rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex: 1;
  justify-content: center;
  transition: all 0.2s;
  &:hover { color: #0f172a; }

  @media (min-width: 641px) {
    flex: none;
  }
`;
const FilterDot = styled.span`
  width: 6px; height: 6px; border-radius: 50%;
  background: ${p => p.$color || '#cbd5e1'};
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;

  @media (max-width: 640px) {
    width: 100%;
    justify-content: flex-end;
  }
`;
const LastRunInfo = styled.div`
  font-size: 0.7rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
  span { font-family: 'JetBrains Mono', monospace; color: #0f172a; margin-left: 4px; }

  @media (max-width: 600px) { display: none; }
`;
const RefreshBtn = styled(motion.button)`
  display: inline-flex; align-items: center; justify-content: center;
  width: 32px; height: 32px; border-radius: 8px;
  border: 1px solid #e2e8f0; background: #ffffff;
  color: #64748b; cursor: pointer;
  &:hover { border-color: #cbd5e1; color: #0f172a; }
  svg.spin { animation: ${spinAnim} 0.85s linear infinite; }
`;
const PrefsToggleBtn = styled.button`
  display: inline-flex; align-items: center; gap: 0.5rem;
  padding: 0.5rem 0.8rem; border-radius: 8px;
  border: 1px solid #e2e8f0; background: ${p => p.$active ? '#f1f5f9' : '#ffffff'};
  color: ${p => p.$active ? '#0f172a' : '#64748b'};
  font-size: 0.75rem; font-weight: 700; cursor: pointer;
  &:hover { border-color: #cbd5e1; color: #0f172a; }

  @media (max-width: 480px) {
    padding: 0.45rem 0.6rem;
    font-size: 0.7rem;
    span { display: none; }
  }
`;
const RunBtn = styled(motion.button)`
  background: #0f172a; color: #ffffff;
  border: none; border-radius: 8px;
  padding: 0.55rem 1rem; font-size: 0.8rem; font-weight: 700;
  display: inline-flex; align-items: center; gap: 0.5rem;
  cursor: pointer; white-space: nowrap;
  &:hover { background: #1e293b; }
  &:disabled { opacity: 0.6; cursor: not-allowed; }

  @media (max-width: 640px) {
    flex: 1;
    justify-content: center;
    padding: 0.6rem 0.75rem;
  }
`;

/* ── summary bar ────────────────────────────────────── */
const SummaryBar = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  background: #fcfcfc;
  border-bottom: 1px solid #f1f5f9;

  @media (max-width: 640px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;
const SumItem = styled.div`
  padding: 0.75rem 1rem;
  display: flex; flex-direction: column; gap: 0.15rem;
  border-right: 1px solid #f1f5f9;
  &:last-child { border-right: none; }

  @media (max-width: 640px) {
    padding: 0.65rem 0.75rem;
    /* hide last stat on mobile to fit 3-column */
    &:nth-child(4) { display: none; }
  }
`;
const SumLabel = styled.div`
  font-size: 0.6rem; font-weight: 700; color: #94a3b8;
  text-transform: uppercase; letter-spacing: 0.08em;
`;
const SumValue = styled.div`
  font-size: 1.25rem; font-family: 'Space Grotesk', sans-serif;
  font-weight: 800; color: ${p => p.$color || '#0f172a'};
`;

/* ── preferences & filters ──────────────────────────── */
const PrefsWrap = styled(motion.div)`
  padding: 1.25rem;
  background: #ffffff;
`;
const PrefsGrid = styled.div`
  display: grid; gap: 1.5rem; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
`;
const PrefGroup = styled.div`display: flex; flex-direction: column; gap: 0.5rem;`;
const PrefLabel = styled.label`
  font-size: 0.65rem; font-weight: 800; text-transform: uppercase;
  letter-spacing: 0.1em; color: #94a3b8;
`;
const PrefSelect = styled.select`
  appearance: none; background: #f8fafc;
  border: 1px solid #e2e8f0; border-radius: 8px;
  color: #0f172a; font-size: 0.85rem; font-weight: 600;
  padding: 0.6rem 1rem; cursor: pointer; font-family: inherit;
  transition: all 0.2s;
  &:focus { outline: none; border-color: #0f172a; background: #ffffff; box-shadow: 0 0 0 3px rgba(15, 23, 42, 0.05); }
`;
const SectorsWrap = styled.div`display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.5rem;`;
const SectorChip = styled(motion.button)`
  padding: 0.4rem 0.8rem; border-radius: 6px;
  font-size: 0.7rem; font-weight: 700; cursor: pointer;
  border: 1px solid ${p => p.$active ? '#0f172a' : '#e2e8f0'};
  background: ${p => p.$active ? '#0f172a' : '#ffffff'};
  color: ${p => p.$active ? '#ffffff' : '#64748b'};
  &:hover { border-color: #0f172a; color: ${p => p.$active ? '#ffffff' : '#0f172a'}; }
`;

const AssetTypeRow = styled.div`
  padding: 0.65rem 1.25rem;
  display: flex; align-items: center; gap: 0.5rem;
  background: #ffffff;
  border-bottom: 1px solid #f8fafc;
  overflow-x: auto; flex-wrap: nowrap;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }

  @media (max-width: 640px) { padding: 0.6rem 1rem; gap: 0.4rem; }
`;
const TypeLabel = styled.span`
  font-size: 0.65rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em;
`;
const TypeChip = styled(motion.button)`
  padding: 0.35rem 0.75rem; border-radius: 6px;
  font-size: 0.7rem; font-weight: 700; cursor: pointer;
  border: 1px solid ${p => p.$active ? p.$color : '#e2e8f0'};
  background: ${p => p.$active ? p.$bg : '#ffffff'};
  color: ${p => p.$active ? p.$color : '#64748b'};
  &:hover { border-color: ${p => p.$color}; }
`;

const ModeToggle = styled.div`
  display: flex; background: #f1f5f9; padding: 3px; border-radius: 8px;
`;
const ModeBtn = styled.button`
  padding: 0.4rem 0.8rem; border-radius: 6px; border: none;
  font-size: 0.7rem; font-weight: 700; cursor: pointer;
  background: ${p => p.$active ? '#ffffff' : 'transparent'};
  color: ${p => p.$active ? '#0f172a' : '#64748b'};
  box-shadow: ${p => p.$active ? '0 2px 4px rgba(0,0,0,0.05)' : 'none'};
  transition: all 0.2s;
  display: flex; align-items: center; gap: 0.4rem;
`;


/* ── sources panel ──────────────────────────────────── */
const SourcesPanel = styled(motion.div)`
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  padding: 1.25rem 1.25rem;
  overflow: hidden;
`;
const SourcesPanelHeader = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 1rem; gap: 0.75rem;
  @media (max-width: 640px) { flex-direction: column; align-items: stretch; }
`;
const SourcesPanelTitle = styled.div`
  font-family: 'Space Grotesk', sans-serif; font-size: 0.88rem; font-weight: 700; color: #0f172a;
  display: flex; align-items: center; gap: 0.5rem;
  span { font-family: 'Inter', sans-serif; font-weight: 400; color: #94a3b8; font-size: 0.75rem; }
`;
const SourcesSearch = styled.input`
  background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;
  padding: 0.4rem 0.75rem; font-size: 0.8rem; color: #0f172a;
  font-family: inherit; width: 220px; min-width: 0;
  &:focus { outline: none; border-color: #94a3b8; }
  &::placeholder { color: #94a3b8; }
  @media (max-width: 640px) { width: 100%; }
`;
const SourcesGrid = styled.div`
  display: flex; flex-direction: column; gap: 0.35rem;
  max-height: 480px; overflow-y: auto;
  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 4px; }
`;
const SourceItem = styled.div`
  display: flex; flex-direction: column; gap: 0.35rem;
  padding: 0.6rem 0.75rem; border-radius: 8px;
  border: 1px solid transparent;
  background: #f8fafc;
  transition: all 0.15s;
  &:hover { border-color: #e2e8f0; background: #ffffff; }
`;
const SourceRow = styled.div`
  display: flex; align-items: flex-start; gap: 0.75rem;
`;
const SourceBadge = styled.span`
  font-size: 0.6rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;
  color: #64748b; background: #e2e8f0; border-radius: 4px;
  padding: 0.15rem 0.4rem; white-space: nowrap; flex-shrink: 0; margin-top: 2px;
`;
const SourceTitle = styled.a`
  font-size: 0.82rem; font-weight: 500; color: #0f172a; text-decoration: none; flex: 1; line-height: 1.45;
  &:hover { color: #10b981; text-decoration: underline; }
`;
const SourceActions = styled.div`
  display: flex; align-items: center; gap: 0.5rem; margin-left: auto; flex-shrink: 0;
`;
const AnalyseBtn = styled.button`
  font-size: 0.7rem; font-weight: 700; padding: 0.25rem 0.6rem; border-radius: 5px;
  border: 1px solid #e2e8f0; background: #ffffff; color: #64748b; cursor: pointer;
  display: flex; align-items: center; gap: 0.3rem;
  transition: all 0.15s;
  &:hover { border-color: #10b981; color: #10b981; background: #f0fdf4; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;
const InsightBox = styled.div`
  font-size: 0.78rem; color: #374151; line-height: 1.6;
  background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px;
  padding: 0.5rem 0.75rem;
  white-space: pre-wrap;
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
  display: grid;
  grid-template-columns: 2.3fr 1fr;
  @media (max-width: 1100px) { grid-template-columns: 1fr; }
`;

const MainCol = styled.div`
  display: flex; flex-direction: column;
  min-width: 0;
`;

const SideCol = styled.div`
  display: flex; flex-direction: column;
  background: #fafafa;
  @media (max-width: 1100px) { display: none; }
`;

/* ── master table ───────────────────────────────────── */
const TableHeader = styled.div`
  display: flex; justify-content: space-between; align-items: center;
  padding: 0.8rem 1.25rem;
  background: #ffffff;
  border-bottom: 1px solid #f8fafc;
`;
const THLeft = styled.div`
  font-family: 'Space Grotesk', sans-serif; font-size: 0.9rem; font-weight: 700; color: #0f172a;
  span { color: #94a3b8; font-weight: 400; margin-left: 0.4rem; font-family: 'Inter', sans-serif; }
`;
const THRight = styled.div`
  display: flex; align-items: center; gap: 1.5rem;
`;
const THGroup = styled.div`
  display: flex; align-items: center; gap: 0.5rem;
  font-size: 0.65rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em;
`;
const THBtn = styled.button`
  background: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 4px;
  padding: 0.2rem 0.5rem; font-size: 0.65rem; font-weight: 600; color: #475569;
  cursor: pointer; &:hover { background: #e2e8f0; color: #0f172a; }
`;

const TableWrap = styled.div`
  flex: 1; overflow-x: auto; overflow-y: auto;
  &::-webkit-scrollbar { display: none; }
  -ms-overflow-style: none; scrollbar-width: none;
`;
const THead = styled.div`
  display: grid; grid-template-columns: 1.4fr 0.8fr 1.2fr 2.5fr 1.5fr 0.6fr;
  min-width: 700px;
  @media (max-width: 640px) { display: none; }
`;
const THCell = styled.div`
  padding: 0.6rem 1rem; font-size: 0.6rem; font-weight: 700; color: #94a3b8;
  text-transform: uppercase; letter-spacing: 0.1em;
`;
const TRow = styled(motion.div)`
  display: grid; grid-template-columns: 1.4fr 0.8fr 1.2fr 2.5fr 1.5fr 0.6fr;
  min-width: 700px;
  cursor: pointer;
  background: ${p => p.$selected ? '#f8fafc' : '#ffffff'};
  border-left: 3px solid ${p => p.$selected ? '#10b981' : 'transparent'};
  border-bottom: 1px solid #f8fafc;
  &:hover { background: #f8fafc; }

  @media (max-width: 640px) {
    display: flex; flex-direction: column; min-width: unset;
    padding: 1rem;
    gap: 0.5rem;
    border-left: 3px solid ${p => p.$selected ? '#10b981' : 'transparent'};
    border-bottom: 1px solid #f1f5f9;
  }
`;
const TCell = styled.div`
  padding: 0.85rem 1rem; display: flex; flex-direction: column; justify-content: center;

  @media (max-width: 640px) {
    padding: 0;
    /* hide confidence bar, risk, spark on mobile */
    &:nth-child(3), &:nth-child(5), &:nth-child(6) { display: none; }
  }
`;
const AssetSymbol = styled.div`font-weight: 800; color: #0f172a; font-size: 0.85rem;`;
const AssetNameText = styled.div`font-size: 0.75rem; color: #64748b; margin-top: 0.1rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;`;
const MiniTags = styled.div`display: flex; gap: 0.3rem; margin-top: 0.4rem;`;
const MiniTag = styled.span`
  background: #f1f5f9; color: #64748b; font-size: 0.55rem; padding: 0.1rem 0.3rem; border-radius: 4px; font-weight: 600; text-transform: uppercase;
`;

const VerdictBadge = styled.div`
  display: inline-flex; align-items: center; gap: 0.3rem;
  background: ${p => p.$bg}; color: ${p => p.$color};
  padding: 0.2rem 0.5rem; border-radius: 6px; font-size: 0.65rem; font-weight: 800; text-transform: uppercase;
  width: max-content;
`;

const ConfRow = styled.div`display: flex; align-items: center; gap: 0.5rem;`;
const ConfBarWrap = styled.div`flex: 1; height: 4px; background: #f1f5f9; border-radius: 2px; overflow: hidden;`;
const ConfBarFill = styled.div`height: 100%; background: ${p => p.$color}; width: ${p => p.$pct}%;`;
const ConfScore = styled.div`font-weight: 700; font-size: 0.8rem; color: #0f172a;`;
const DeltaText = styled.div`font-size: 0.6rem; color: ${p => p.$pos ? '#10b981' : '#f43f5e'}; font-weight: 600;`;

const PriceVal = styled.div`font-weight: 700; font-size: 0.8rem; color: #0f172a;`;
const PriceChg = styled.div`font-size: 0.7rem; font-weight: 600; color: ${p => p.$pos ? '#10b981' : '#f43f5e'}; margin-top: 0.1rem;`;

const TextSnippet = styled.div`font-size: 0.7rem; color: #475569; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;`;
const AllocText = styled.div`font-weight: 700; font-size: 0.8rem; color: #0f172a;`;

const SparkWrap = styled.div`height: 30px; width: 100%;`;

/* ── dash tabs ──────────────────────────────────────── */
const DashTabBar = styled.div`
  display: flex; gap: 0; border-bottom: 1px solid #f1f5f9;
  background: #ffffff; padding: 0 1.5rem;
  @media (max-width: 640px) { padding: 0; }
`;
const DashTabBtn = styled.button`
  padding: 0.85rem 1.5rem;
  font-family: 'Space Grotesk', sans-serif; font-size: 0.85rem; font-weight: 700;
  border: none; background: transparent; cursor: pointer;
  color: ${p => p.$active ? '#0f172a' : '#94a3b8'};
  border-bottom: 2px solid ${p => p.$active ? '#10b981' : 'transparent'};
  margin-bottom: -1px; transition: color 0.2s, border-color 0.2s;
  display: flex; align-items: center; gap: 0.4rem;
  white-space: nowrap;
  &:hover { color: #0f172a; }

  @media (max-width: 640px) {
    flex: 1;
    justify-content: center;
    padding: 0.85rem 0.5rem;
    font-size: 0.82rem;
  }
`;

/* ── journal pane ───────────────────────────────────── */
const AddNoteBtn = styled.button`
  background: #0f172a; color: #ffffff; border: none; border-radius: 8px;
  padding: 0.5rem 1rem; display: flex; align-items: center; gap: 0.4rem;
  font-size: 0.82rem; font-weight: 700; font-family: 'Space Grotesk', sans-serif;
  cursor: pointer; transition: background 0.2s; white-space: nowrap;
  &:hover { background: #1e293b; }
`;

const JournalGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 1.25rem;
  @media (max-width: 640px) { grid-template-columns: 1fr; gap: 0.85rem; }
`;

const NoteCard = styled(motion.div)`
  background: #ffffff;
  border: 1px solid ${p => p.$focused ? '#0f172a' : '#e2e8f0'};
  border-radius: 16px;
  display: flex; flex-direction: column;
  box-shadow: ${p => p.$focused ? '0 0 0 3px rgba(15,23,42,0.06)' : '0 1px 6px rgba(0,0,0,0.04)'};
  transition: border-color 0.2s, box-shadow 0.2s;
  overflow: hidden;
`;

const NoteCardHeader = styled.div`
  padding: 0.75rem 1rem 0.5rem;
  display: flex; align-items: center; gap: 0.5rem;
  border-bottom: 1px solid #f8fafc;
`;

const NoteTagBadge = styled.span`
  font-size: 0.6rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em;
  padding: 0.2rem 0.5rem; border-radius: 5px;
  background: ${p => p.$bg || '#f1f5f9'}; color: ${p => p.$color || '#64748b'};
`;

const NoteTitle = styled.input`
  flex: 1; border: none; background: transparent;
  font-family: 'Space Grotesk', sans-serif; font-size: 0.88rem; font-weight: 700;
  color: #0f172a; outline: none;
  &::placeholder { color: #cbd5e1; font-weight: 500; }
`;

const NoteToolbar = styled.div`
  display: flex; align-items: center; gap: 2px;
  padding: 0.35rem 0.75rem; background: #f8fafc;
  border-bottom: 1px solid #f1f5f9; flex-wrap: wrap;
`;

const ToolbarBtn = styled.button`
  width: 28px; height: 28px; border-radius: 6px;
  border: none; background: ${p => p.$active ? '#e2e8f0' : 'transparent'};
  color: ${p => p.$active ? '#0f172a' : '#94a3b8'};
  display: flex; align-items: center; justify-content: center;
  font-size: 0.75rem; cursor: pointer; transition: all 0.15s;
  &:hover { background: #e2e8f0; color: #0f172a; }
`;

const ToolbarDivider = styled.div`
  width: 1px; height: 16px; background: #e2e8f0; margin: 0 2px;
`;

const TagSelector = styled.select`
  border: none; background: transparent; font-size: 0.72rem; font-weight: 700;
  color: #64748b; cursor: pointer; outline: none; padding: 0.15rem 0.3rem;
  border-radius: 4px;
  &:hover { background: #e2e8f0; }
`;

const NoteBody = styled.div`
  padding: 0.75rem 1rem; flex: 1; min-height: 120px;
  font-size: 0.88rem; color: #0f172a; line-height: 1.7;
  outline: none; white-space: pre-wrap; word-break: break-word;
  overflow-y: auto;
  &:empty::before { content: attr(data-placeholder); color: #cbd5e1; pointer-events: none; }
  b, strong { font-weight: 700; }
  i, em { font-style: italic; }
  ul { padding-left: 1.25rem; margin: 0.25rem 0; }
  li { margin-bottom: 0.2rem; }
  @media (max-width: 640px) { font-size: 1rem; min-height: 100px; }
`;

const NoteMeta = styled.div`
  display: flex; justify-content: space-between; align-items: center;
  padding: 0.5rem 1rem 0.65rem; border-top: 1px solid #f8fafc;
`;

const NoteDate = styled.span`font-size: 0.62rem; font-weight: 600; color: #cbd5e1;`;

const NoteActions = styled.div`display: flex; align-items: center; gap: 0.35rem;`;

const AIBtn = styled.button`
  display: flex; align-items: center; gap: 0.3rem;
  padding: 0.3rem 0.65rem; border-radius: 6px;
  border: 1px solid #e2e8f0; background: #ffffff;
  color: #64748b; font-size: 0.7rem; font-weight: 700;
  cursor: pointer; transition: all 0.15s;
  &:hover { border-color: #10b981; color: #10b981; background: #f0fdf4; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const DeleteNoteBtn = styled.button`
  background: transparent; border: none; color: #e2e8f0; cursor: pointer;
  font-size: 0.78rem; padding: 0.3rem; border-radius: 5px; transition: all 0.15s;
  &:hover { color: #ef4444; background: #fef2f2; }
`;

const AIPanel = styled(motion.div)`
  margin: 0 1rem 0.75rem;
  border: 1px solid #e2e8f0; border-radius: 12px;
  overflow: hidden; background: #fafafa;
`;

const AIPanelHeader = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  padding: 0.65rem 0.9rem; background: #0f172a;
`;

const AIPanelTitle = styled.div`
  font-size: 0.72rem; font-weight: 800; color: #ffffff;
  display: flex; align-items: center; gap: 0.4rem; letter-spacing: 0.02em;
  span { color: #4ade80; }
`;

const AIPanelActions = styled.div`
  display: flex; gap: 0.35rem;
`;

const AIActionBtn = styled.button`
  padding: 0.25rem 0.6rem; border-radius: 5px;
  border: 1px solid rgba(255,255,255,0.15); background: rgba(255,255,255,0.08);
  color: rgba(255,255,255,0.75); font-size: 0.65rem; font-weight: 700;
  cursor: pointer; transition: all 0.15s; white-space: nowrap;
  &:hover { background: rgba(255,255,255,0.18); color: #fff; }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
  &.active { background: rgba(74,222,128,0.2); border-color: rgba(74,222,128,0.4); color: #4ade80; }
`;

const AIPanelBody = styled.div`
  padding: 0.85rem 0.9rem;
  font-size: 0.8rem; color: #374151; line-height: 1.7;
  white-space: pre-wrap;
  min-height: 60px;
`;

const AIThinking = styled.div`
  display: flex; align-items: center; gap: 0.5rem;
  color: #94a3b8; font-size: 0.78rem; font-style: italic;
  padding: 0.85rem 0.9rem;
`;

const EmptyJournal = styled.div`
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 4rem 2rem; text-align: center; color: #94a3b8; gap: 1rem;
  svg { font-size: 2rem; opacity: 0.3; }
  p { font-size: 0.85rem; margin: 0; line-height: 1.5; }
`;

const JournalFullPage = styled.div`
  max-width: 900px; margin: 0 auto; padding: 1.5rem 1.5rem;
  @media (max-width: 640px) { padding: 1rem; }
`;
const JournalFullHeader = styled.div`
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 1.25rem;
`;
const JournalFullTitle = styled.h2`
  font-family: 'Space Grotesk', sans-serif; font-size: 1.25rem; font-weight: 800; color: #0f172a;
  display: flex; align-items: center; gap: 0.5rem; margin: 0;
`;

const Footer = styled.div`
  padding: 1.5rem 2rem; font-size: 0.7rem; color: #94a3b8;
  background: #fcfcfc;
`;

const ErrorBanner = styled.div`
  background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.2);
  color:#fca5a5;border-radius:12px;padding:0.8rem 1rem;
  font-size:0.85rem;font-weight:600;
`;

const ProgressContainer = styled(motion.div)`
  background: #ffffff;
  border-bottom: 1px solid #f1f5f9;
  padding: 0.75rem 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
`;
const ProgressBarWrap = styled.div`
  flex: 1;
  height: 6px;
  background: #f1f5f9;
  border-radius: 3px;
  overflow: hidden;
`;
const ProgressFill = styled(motion.div)`
  height: 100%;
  background: #0f172a;
`;
const ProgressText = styled.div`
  font-size: 0.7rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  min-width: 120px;
`;

/* ── auth modal ─────────────────────────────────────── */
const ModalOverlay = styled(motion.div)`
  position: fixed; inset: 0; z-index: 2000;
  background: rgba(2, 6, 23, 0.6);
  backdrop-filter: blur(6px);
  display: flex; align-items: center; justify-content: center;
  padding: 1rem;
`;
const ModalCard = styled(motion.div)`
  background: #ffffff;
  border-radius: 20px;
  padding: 2.5rem 2rem 2rem;
  width: 100%; max-width: 400px;
  box-shadow: 0 24px 64px rgba(0,0,0,0.18);
  display: flex; flex-direction: column; align-items: center;
  text-align: center; gap: 0;
  position: relative;
`;
const ModalClose = styled.button`
  position: absolute; top: 1rem; right: 1rem;
  background: rgba(15,23,42,0.06); border: none;
  width: 30px; height: 30px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.85rem; color: #64748b; cursor: pointer;
  transition: all 0.15s;
  &:hover { background: rgba(15,23,42,0.1); color: #0f172a; }
`;
const ModalIcon = styled.div`
  width: 60px; height: 60px; border-radius: 18px;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  display: flex; align-items: center; justify-content: center;
  font-size: 1.5rem; margin-bottom: 1.25rem;
  box-shadow: 0 8px 24px rgba(15,23,42,0.15);
`;
const ModalTitle = styled.h2`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.35rem; font-weight: 800; color: #0f172a;
  margin: 0 0 0.5rem; letter-spacing: -0.02em;
`;
const ModalDesc = styled.p`
  font-size: 0.88rem; color: #64748b; line-height: 1.6;
  margin: 0 0 1.75rem;
`;
const ModalPerks = styled.div`
  display: flex; flex-direction: column; gap: 0.5rem;
  width: 100%; margin-bottom: 1.75rem;
`;
const ModalPerk = styled.div`
  display: flex; align-items: center; gap: 0.6rem;
  font-size: 0.82rem; color: #374151; font-weight: 500;
  background: #f8fafc; border-radius: 8px; padding: 0.6rem 0.75rem;
  text-align: left;
`;
const ModalSignInBtn = styled.button`
  width: 100%; padding: 0.85rem;
  background: #0f172a; color: #ffffff;
  border: none; border-radius: 12px;
  font-size: 0.95rem; font-weight: 700;
  cursor: pointer; transition: all 0.2s; margin-bottom: 0.65rem;
  &:hover { background: #15803d; }
`;
const ModalCreateBtn = styled.button`
  width: 100%; padding: 0.75rem;
  background: transparent; color: #0f172a;
  border: 1.5px solid rgba(15,23,42,0.15);
  border-radius: 12px; font-size: 0.88rem; font-weight: 600;
  cursor: pointer; transition: all 0.2s;
  &:hover { border-color: rgba(15,23,42,0.35); background: rgba(15,23,42,0.03); }
`;
const ModalNote = styled.p`
  font-size: 0.72rem; color: #94a3b8; margin: 0.75rem 0 0;
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

// Server now returns exact chip ids, but keep a client-side guard for old cached results
const normaliseAssetType = (t = '') => {
  const VALID = ['Stocks','ETFs','Commodities','Crypto','Options Plays'];
  if (VALID.includes(t)) return t;
  const s = t.toLowerCase();
  if (s.includes('etf'))     return 'ETFs';
  if (s.includes('crypto') || s.includes('coin') || s.includes('token')) return 'Crypto';
  if (s.includes('option'))  return 'Options Plays';
  if (s.includes('commodi')) return 'Commodities';
  return 'Stocks';
};

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
  const { user } = useAuth();
  const navigate = useNavigate();

  const [selectedAssetIdx, setSelectedAssetIdx] = useState(0);

  const [deepRunning, setDeepRunning] = useState(false);
  const [deepProgress, setDeepProgress] = useState(0);
  const [deepResult,  setDeepResult]  = useState(null);
  const [deepError,   setDeepError]   = useState(null);
  const [showPrefs,   setShowPrefs]   = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSources, setShowSources] = useState(false);
  const [sourcesQuery, setSourcesQuery] = useState('');
  const [headlineInsights, setHeadlineInsights] = useState({});
  const [headlineLoading,  setHeadlineLoading]  = useState({});
  const [activeTypes, setActiveTypes] = useState(['Stocks','ETFs','Commodities','Crypto','Options Plays']);
  const [filterType,  setFilterType]  = useState('All');
  const [filterAsset, setFilterAsset] = useState('All');
  const [dashTab, setDashTab] = useState('picks');
  const [notes, setNotes] = useState(() => {
    try {
      const saved = localStorage.getItem('bv_notes_v2');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [focusedNote, setFocusedNote] = useState(null);
  const [aiState, setAiState] = useState({}); // { [noteId]: { loading, result, action } }

  useEffect(() => {
    localStorage.setItem('bv_notes_v2', JSON.stringify(notes));
  }, [notes]);

  const addNote = () => {
    const newNote = {
      id: Date.now(),
      title: '',
      text: '',
      tag: 'trade',
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    };
    setNotes(prev => [newNote, ...prev]);
    setFocusedNote(newNote.id);
  };

  const updateNote = (id, field, value) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, [field]: value } : n));
  };

  const deleteNote = (id) => {
    setNotes(prev => prev.filter(n => n.id !== id));
    setAiState(prev => { const s = { ...prev }; delete s[id]; return s; });
  };

  const runJournalAI = useCallback(async (noteId, action) => {
    const note = notes.find(n => n.id === noteId);
    if (!note?.text?.trim()) return;
    setAiState(prev => ({ ...prev, [noteId]: { loading: true, result: null, action } }));
    try {
      const { result } = await api.journalAssist(note.text, action);
      setAiState(prev => ({ ...prev, [noteId]: { loading: false, result, action } }));
    } catch {
      setAiState(prev => ({ ...prev, [noteId]: { loading: false, result: 'Could not connect to AI. Please try again.', action } }));
    }
  }, [notes]);
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
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setDeepRunning(true); setDeepProgress(0); setDeepError(null); setDeepResult(null);
    
    try {
      const TOTAL_BATCHES = 6;
      let completed = 0;
      
      const runBatch = async (index) => {
        try {
          const res = await api.runDeepAnalysis({ ...prefs, assetTypes: activeTypes, batchIndex: index, totalBatches: TOTAL_BATCHES });
          completed++;
          setDeepProgress(Math.round((completed / TOTAL_BATCHES) * 100));
          return res;
        } catch (err) {
          console.error(`Batch ${index} failed:`, err);
          return null; // Handle partial failure gracefully
        }
      };

      const results = [];
      for (let i = 1; i <= TOTAL_BATCHES; i++) {
        const res = await runBatch(i);
        if (res) results.push(res);
      }
      
      if (results.length === 0) throw new Error('All analysis batches failed');

      // Merge results
      const combinedPicks = [];
      const combinedSectorBreakdown = {};
      const seenTickers = new Set();
      
      results.forEach(res => {
        if (res.picks) {
          res.picks.forEach(p => {
            if (!seenTickers.has(p.ticker)) {
              combinedPicks.push(p);
              seenTickers.add(p.ticker);
            }
          });
        }
        if (res.sectorBreakdown) {
          Object.assign(combinedSectorBreakdown, res.sectorBreakdown);
        }
      });
      
      setDeepResult({
        ...results[0],
        picks: combinedPicks,
        sectorBreakdown: combinedSectorBreakdown,
        generatedAt: new Date().toISOString(),
      });
      setFilterType('All');
      setSelectedAssetIdx(0);
    } catch (e) {
      setDeepError(e.message || 'Analysis failed');
    } finally {
      setDeepRunning(false);
    }
  }, [prefs, activeTypes, user, navigate]);

  const handleAnalyseHeadline = useCallback(async (idx, title, source) => {
    if (headlineLoading[idx]) return;
    setHeadlineLoading(prev => ({ ...prev, [idx]: true }));
    try {
      const { insight } = await api.analyseHeadline(title, source);
      setHeadlineInsights(prev => ({ ...prev, [idx]: insight }));
    } catch {
      setHeadlineInsights(prev => ({ ...prev, [idx]: 'Could not load analysis right now.' }));
    } finally {
      setHeadlineLoading(prev => ({ ...prev, [idx]: false }));
    }
  }, [headlineLoading]);

  const updatedLabel = brief?.generatedAt
    ? new Date(brief.generatedAt).toLocaleTimeString(undefined,{timeStyle:'short'})
    : null;

  const rawPicks = deepResult ? deepResult.picks : [];

  const confToPct = (c) => c === 'High' ? 85 : c === 'Medium' ? 65 : 45;
  const confToScore = (c) => c === 'High' ? 82 : c === 'Medium' ? 61 : 34;

  const filteredPicks = useMemo(() => {
    return rawPicks.filter(p => {
      const actionOk = filterType === 'All'
        || (filterType === 'Buy' && (p.action === 'Buy' || p.action === 'Strong Buy'))
        || (filterType === 'Watch' && p.action === 'Watch')
        || (filterType === 'Avoid' && (p.action === 'Avoid' || p.action === 'Reduce'));
      const assetOk = filterAsset === 'All' || normaliseAssetType(p.assetType) === filterAsset;
      return actionOk && assetOk;
    });
  }, [rawPicks, filterType, filterAsset]);

  const counts = useMemo(() => {
    return rawPicks.reduce((acc, p) => { acc[p.action] = (acc[p.action] || 0) + 1; return acc; }, {});
  }, [rawPicks]);

  const avgConfidence = useMemo(() => {
    if (!rawPicks.length) return null;
    const sum = rawPicks.reduce((s, p) => s + confToPct(p.confidence), 0);
    return Math.round(sum / rawPicks.length);
  }, [rawPicks]);

  const selectedPick = filteredPicks[selectedAssetIdx] || filteredPicks[0] || null;

  const generateChartData = useCallback((trend, points) => {
    let val = 100;
    const slope = trend === 'Uptrend' ? 1.5 : trend === 'Downtrend' ? -1.5 : 0;
    return Array.from({length: points}).map((_, i) => {
      val += (Math.random() * 4 - 2) + slope;
      return { name: i, value: val };
    });
  }, []);

  return (
    <>
    <Page>
      <TopHeader>
        <HeaderLeft>
          <Brand>BloomVest</Brand>
          <Slash>/</Slash>
          <PageTitle>Investment Dashboard</PageTitle>
        </HeaderLeft>

        <FilterGroup>
          {['All', 'Buy', 'Watch', 'Avoid'].map(f => {
            const displayLabel = f === 'Watch' ? 'Hold' : f;
            const assetFiltered = filterAsset === 'All' ? rawPicks : rawPicks.filter(p => normaliseAssetType(p.assetType) === filterAsset);
            const count = f === 'All' ? assetFiltered.length
              : f === 'Buy' ? assetFiltered.filter(p => ['Buy','Strong Buy'].includes(p.action)).length
              : assetFiltered.filter(p => p.action === f).length;
            return (
              <FilterBtn key={f} type="button" $active={filterType === f} onClick={() => setFilterType(f)}>
                <FilterDot $color={f === 'Buy' ? '#10b981' : f === 'Watch' ? '#f59e0b' : f === 'Avoid' ? '#ef4444' : '#cbd5e1'} />
                {displayLabel} {count > 0 ? count : ''}
              </FilterBtn>
            );
          })}
        </FilterGroup>

        <HeaderRight>
          <LastRunInfo>
            LAST RUN <span>{updatedLabel || 'N/A'}</span>
          </LastRunInfo>
          <RefreshBtn type="button" onClick={() => load(true)} disabled={loading || refreshing}>
            <FaSyncAlt className={refreshing ? 'spin' : ''} />
          </RefreshBtn>
          <PrefsToggleBtn type="button" $active={showSources} onClick={() => setShowSources(!showSources)}>
            <FaBookOpen /> Sources
          </PrefsToggleBtn>
          <PrefsToggleBtn type="button" $active={showPrefs} onClick={() => setShowPrefs(!showPrefs)}>
            <FaFilter /> Preferences
          </PrefsToggleBtn>
          <RunBtn type="button" onClick={runDeepAnalysis} disabled={deepRunning}>
            <FaMagic /> {deepRunning ? 'Running...' : 'Run AI analysis'}
          </RunBtn>
        </HeaderRight>
      </TopHeader>

      <DashTabBar>
        <DashTabBtn $active={dashTab === 'picks'} onClick={() => setDashTab('picks')}>
          <FaMagic /> AI Picks
        </DashTabBtn>
        <DashTabBtn $active={dashTab === 'journal'} onClick={() => setDashTab('journal')}>
          <FaBookOpen /> Trading Journal
        </DashTabBtn>
      </DashTabBar>

      {dashTab === 'journal' ? (
        <JournalFullPage>
          <JournalFullHeader>
            <JournalFullTitle><FaBookOpen /> Trading Journal</JournalFullTitle>
            <AddNoteBtn type="button" onClick={addNote}><FaPlus /> New entry</AddNoteBtn>
          </JournalFullHeader>
          {notes.length === 0 ? (
            <EmptyJournal>
              <FaBookOpen />
              <p>Your journal is empty.<br />Log trades, ideas, and lessons — then let AI analyse your thinking.</p>
            </EmptyJournal>
          ) : (
            <JournalGrid>
              {notes.map(note => {
                const ai = aiState[note.id] || {};
                const TAG_STYLES = {
                  trade:    { $bg: '#dcfce7', $color: '#15803d' },
                  idea:     { $bg: '#eff6ff', $color: '#2563eb' },
                  review:   { $bg: '#fef3c7', $color: '#b45309' },
                  mistake:  { $bg: '#fee2e2', $color: '#dc2626' },
                  lesson:   { $bg: '#f3e8ff', $color: '#7c3aed' },
                };
                const tagStyle = TAG_STYLES[note.tag] || TAG_STYLES.trade;
                const isFocused = focusedNote === note.id;

                const execCmd = (cmd, val) => {
                  document.execCommand(cmd, false, val);
                };

                return (
                  <NoteCard
                    key={note.id}
                    $focused={isFocused}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    onFocus={() => setFocusedNote(note.id)}
                  >
                    {/* Header row — title + tag */}
                    <NoteCardHeader>
                      <NoteTagBadge {...tagStyle}>{note.tag}</NoteTagBadge>
                      <NoteTitle
                        placeholder="Entry title..."
                        value={note.title}
                        onChange={e => updateNote(note.id, 'title', e.target.value)}
                      />
                    </NoteCardHeader>

                    {/* Formatting toolbar */}
                    <NoteToolbar>
                      <ToolbarBtn title="Bold" onMouseDown={e => { e.preventDefault(); execCmd('bold'); }}>
                        <FaBold />
                      </ToolbarBtn>
                      <ToolbarBtn title="Italic" onMouseDown={e => { e.preventDefault(); execCmd('italic'); }}>
                        <FaItalic />
                      </ToolbarBtn>
                      <ToolbarBtn title="Bullet list" onMouseDown={e => { e.preventDefault(); execCmd('insertUnorderedList'); }}>
                        <FaListUl />
                      </ToolbarBtn>
                      <ToolbarDivider />
                      <FaTag style={{ fontSize: '0.65rem', color: '#cbd5e1', marginLeft: '2px' }} />
                      <TagSelector
                        value={note.tag}
                        onChange={e => updateNote(note.id, 'tag', e.target.value)}
                      >
                        <option value="trade">Trade</option>
                        <option value="idea">Idea</option>
                        <option value="review">Review</option>
                        <option value="mistake">Mistake</option>
                        <option value="lesson">Lesson</option>
                      </TagSelector>
                    </NoteToolbar>

                    {/* Rich text content area */}
                    <NoteBody
                      contentEditable
                      suppressContentEditableWarning
                      data-placeholder="Write your trade notes, thesis, or observations..."
                      onInput={e => updateNote(note.id, 'text', e.currentTarget.innerText)}
                      dangerouslySetInnerHTML={note._html !== undefined ? undefined : undefined}
                      ref={el => {
                        if (el && el.innerText !== note.text && document.activeElement !== el) {
                          el.innerText = note.text;
                        }
                      }}
                    />

                    {/* AI panel */}
                    <AnimatePresence>
                      {(ai.result || ai.loading) && (
                        <AIPanel
                          key="ai"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <AIPanelHeader>
                            <AIPanelTitle>
                              <FaRobot /> BloomVest <span>AI</span>
                              {ai.action && <span style={{ color: '#94a3b8', fontWeight: 400, textTransform: 'capitalize', marginLeft: 4 }}>— {ai.action}</span>}
                            </AIPanelTitle>
                            <AIActionBtn onClick={() => setAiState(prev => { const s = {...prev}; delete s[note.id]; return s; })}>
                              ✕
                            </AIActionBtn>
                          </AIPanelHeader>
                          {ai.loading ? (
                            <AIThinking>
                              <FaSpinner style={{ animation: `${spinAnim.getName ? '' : 'spin'} 0.8s linear infinite` }} />
                              Analysing your entry...
                            </AIThinking>
                          ) : (
                            <AIPanelBody>{ai.result}</AIPanelBody>
                          )}
                        </AIPanel>
                      )}
                    </AnimatePresence>

                    {/* Footer — date + actions */}
                    <NoteMeta>
                      <NoteDate>{note.date}</NoteDate>
                      <NoteActions>
                        <AIBtn
                          type="button"
                          disabled={ai.loading || !note.text?.trim()}
                          title="Summarise"
                          onClick={() => runJournalAI(note.id, 'summarise')}
                        >
                          <FaAlignLeft /> Summarise
                        </AIBtn>
                        <AIBtn
                          type="button"
                          disabled={ai.loading || !note.text?.trim()}
                          title="Deep analysis"
                          onClick={() => runJournalAI(note.id, 'analyse')}
                        >
                          <FaRobot /> Analyse
                        </AIBtn>
                        <AIBtn
                          type="button"
                          disabled={ai.loading || !note.text?.trim()}
                          title="Spot risks"
                          onClick={() => runJournalAI(note.id, 'risks')}
                        >
                          <FaExclamationTriangle /> Risks
                        </AIBtn>
                        <DeleteNoteBtn type="button" onClick={() => deleteNote(note.id)} title="Delete">
                          <FaTrash />
                        </DeleteNoteBtn>
                      </NoteActions>
                    </NoteMeta>
                  </NoteCard>
                );
              })}
            </JournalGrid>
          )}
        </JournalFullPage>
      ) : null}

      {dashTab === 'picks' && <>
      <AnimatePresence>
        {showPrefs && (
          <PrefsWrap
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <PrefsGrid>
              <PrefGroup>
                <PrefLabel>Risk Profile</PrefLabel>
                <PrefSelect value={prefs.riskLevel} onChange={e => setPrefs(p => ({...p, riskLevel: e.target.value}))}>
                  <option value="conservative">Conservative</option>
                  <option value="moderate">Moderate</option>
                  <option value="aggressive">Aggressive</option>
                </PrefSelect>
              </PrefGroup>
              <PrefGroup>
                <PrefLabel>Time Horizon</PrefLabel>
                <PrefSelect value={prefs.horizon} onChange={e => setPrefs(p => ({...p, horizon: e.target.value}))}>
                  <option value="short">Short Term (0-1 yr)</option>
                  <option value="medium">Medium Term (1-3 yrs)</option>
                  <option value="long">Long Term (3+ yrs)</option>
                </PrefSelect>
              </PrefGroup>
              <PrefGroup>
                <PrefLabel>Investment Style</PrefLabel>
                <PrefSelect value={prefs.style} onChange={e => setPrefs(p => ({...p, style: e.target.value}))}>
                  <option value="balanced">Balanced</option>
                  <option value="growth">Aggressive Growth</option>
                  <option value="value">Value Focused</option>
                  <option value="income">Dividend/Income</option>
                </PrefSelect>
              </PrefGroup>
              <PrefGroup style={{ gridColumn: '1 / -1' }}>
                <PrefLabel>Target Sectors</PrefLabel>
                <SectorsWrap>
                  {SECTORS.map(s => (
                    <SectorChip
                      key={s}
                      type="button"
                      $active={prefs.sectors.includes(s)}
                      onClick={() => toggleSector(s)}
                    >
                      {s}
                    </SectorChip>
                  ))}
                </SectorsWrap>
              </PrefGroup>
            </PrefsGrid>
          </PrefsWrap>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deepRunning && (
          <ProgressContainer
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <ProgressText>Analyzing Batch {Math.ceil((deepProgress / 100) * 6) || 1} of 6</ProgressText>
            <ProgressBarWrap>
              <ProgressFill 
                initial={{ width: 0 }}
                animate={{ width: `${deepProgress}%` }}
                transition={{ duration: 0.5 }}
              />
            </ProgressBarWrap>
            <ProgressText style={{ minWidth: '40px', textAlign: 'right' }}>{deepProgress}%</ProgressText>
          </ProgressContainer>
        )}
      </AnimatePresence>

      <AssetTypeRow>
        <div style={{ width: '1px', height: '16px', background: '#e2e8f0', margin: '0 0.5rem' }} />

        <TypeLabel>Asset Filter:</TypeLabel>
        {ASSET_TYPES.map(type => (
          <TypeChip
            key={type.id}
            type="button"
            $active={filterAsset === type.id}
            $bg={type.activeBg.replace('rgba(','rgb(').replace(')','/ 0.1)')}
            $color={type.activeColor === '#86efac' ? '#10b981' : type.activeColor === '#93c5fd' ? '#3b82f6' : (type.activeColor === '#fdba74' ? '#f97316' : '#8b5cf6')}
            onClick={() => setFilterAsset(prev => prev === type.id ? 'All' : type.id)}
          >
            {type.label}
          </TypeChip>
        ))}
      </AssetTypeRow>

      <AnimatePresence>
        {showSources && (
          <SourcesPanel
            key="sources"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {(() => {
              const headlines = brief?.headlines || [];
              const filtered = sourcesQuery.trim()
                ? headlines.filter(h => h.title?.toLowerCase().includes(sourcesQuery.toLowerCase()) || h.source?.toLowerCase().includes(sourcesQuery.toLowerCase()))
                : headlines;
              return (
                <>
                  <SourcesPanelHeader>
                    <SourcesPanelTitle>
                      News Sources <span>{filtered.length} articles being analysed</span>
                    </SourcesPanelTitle>
                    <SourcesSearch
                      placeholder="Filter headlines..."
                      value={sourcesQuery}
                      onChange={e => setSourcesQuery(e.target.value)}
                    />
                  </SourcesPanelHeader>
                  <SourcesGrid>
                    {filtered.length === 0 && (
                      <div style={{color:'#94a3b8',fontSize:'0.82rem',padding:'0.5rem'}}>
                        {headlines.length === 0 ? 'Headlines will appear after the next refresh.' : 'No results.'}
                      </div>
                    )}
                    {filtered.map((h, idx) => {
                      const key = headlines.indexOf(h);
                      const insight = headlineInsights[key];
                      const loading = headlineLoading[key];
                      return (
                        <SourceItem key={key}>
                          <SourceRow>
                            <SourceBadge>{h.source || 'News'}</SourceBadge>
                            <SourceTitle href={h.link} target="_blank" rel="noopener noreferrer">
                              {h.title}
                            </SourceTitle>
                            <SourceActions>
                              {!insight && (
                                <AnalyseBtn
                                  type="button"
                                  disabled={loading}
                                  onClick={() => handleAnalyseHeadline(key, h.title, h.source)}
                                >
                                  {loading ? <FaSpinner style={{animation:'spin 0.8s linear infinite'}} /> : <FaChartLine />}
                                  {loading ? 'Analysing...' : 'AI Insight'}
                                </AnalyseBtn>
                              )}
                            </SourceActions>
                          </SourceRow>
                          {insight && <InsightBox>{insight}</InsightBox>}
                        </SourceItem>
                      );
                    })}
                  </SourcesGrid>
                </>
              );
            })()}
          </SourcesPanel>
        )}
      </AnimatePresence>

      <SummaryBar>
        <SumItem>
          <SumLabel>Assets Analyzed</SumLabel>
          <SumValue>{filteredPicks.length}</SumValue>
        </SumItem>
        <SumItem>
          <SumLabel>Buys</SumLabel>
          <SumValue $color="#10b981">{counts['Buy'] || counts['Strong Buy'] || 0}</SumValue>
        </SumItem>
        <SumItem>
          <SumLabel>Holds</SumLabel>
          <SumValue $color="#f59e0b">{counts['Watch'] || counts['Hold'] || 0}</SumValue>
        </SumItem>
        <SumItem>
          <SumLabel>Avoids</SumLabel>
          <SumValue $color="#ef4444">{counts['Avoid'] || counts['Reduce'] || 0}</SumValue>
        </SumItem>
        <SumItem>
          <SumLabel>Avg. AI Confidence</SumLabel>
          <SumValue>{avgConfidence !== null ? `${avgConfidence}%` : '—'}</SumValue>
        </SumItem>
      </SummaryBar>

      <Shell>
        <MainCol>
          <TableHeader>
            <THLeft>AI Picks <span>{filteredPicks.length} results</span></THLeft>
            <THRight>
              {deepResult && (
                <THGroup style={{color:'#10b981'}}>
                  Analysis complete · {new Date(deepResult.generatedAt).toLocaleTimeString(undefined,{timeStyle:'short'})}
                </THGroup>
              )}
            </THRight>
          </TableHeader>
          
          <TableWrap>
            <THead>
              <THCell>Asset</THCell><THCell>Verdict</THCell><THCell>AI Conf.</THCell>
              <THCell>Why it fits</THCell><THCell>Main risk</THCell><THCell>Trend</THCell>
            </THead>
            {!deepResult && !deepRunning && (
              <div style={{
                display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
                padding:'3.5rem 2rem', gap:'0.75rem', color:'#94a3b8', textAlign:'center'
              }}>
                <FaMagic style={{fontSize:'1.8rem', color:'#cbd5e1'}} />
                <div style={{fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:'0.95rem', color:'#64748b'}}>
                  No analysis yet
                </div>
                <div style={{fontSize:'0.8rem', maxWidth:300}}>
                  Set your preferences and click <strong style={{color:'#0f172a'}}>Run AI analysis</strong> to generate live market picks based on today's news.
                </div>
              </div>
            )}
            {deepRunning && (
              <div style={{
                display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
                padding:'3.5rem 2rem', gap:'0.75rem', color:'#94a3b8', textAlign:'center'
              }}>
                <FaSpinner style={{fontSize:'1.8rem', color:'#10b981', animation:'spin 0.8s linear infinite'}} />
                <div style={{fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:'0.95rem', color:'#64748b'}}>
                  Analysing markets... {deepProgress}%
                </div>
                <div style={{fontSize:'0.8rem'}}>Reading today's headlines across all sources</div>
              </div>
            )}
            {filteredPicks.map((pick, i) => {
               const isBuy = ['Buy', 'Strong Buy'].includes(pick.action);
               const isAvoid = ['Avoid', 'Reduce'].includes(pick.action);
               const vColor = isBuy ? '#10b981' : isAvoid ? '#ef4444' : '#f59e0b';
               const vBg = isBuy ? '#d1fae5' : isAvoid ? '#fee2e2' : '#fef3c7';
               const confVal = confToPct(pick.confidence);
               
               return (
                 <TRow key={i} $selected={selectedAssetIdx === i} onClick={() => setSelectedAssetIdx(i)}>
                   <TCell>
                     <AssetSymbol>{pick.ticker} <span style={{fontWeight:400,color:'#94a3b8'}}>{pick.company}</span></AssetSymbol>
                     <MiniTags>
                       <MiniTag>{pick.assetType}</MiniTag>
                       <MiniTag>{pick.fit}</MiniTag>
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
                       <DeltaText $pos={pick.confidence === 'High'}>AI scored</DeltaText>
                     </ConfRow>
                     <ConfBarWrap><ConfBarFill $color={vColor} $pct={confVal} /></ConfBarWrap>
                   </TCell>
                   <TCell><TextSnippet>{pick.thesis}</TextSnippet></TCell>
                   <TCell><TextSnippet style={{color:'#ef4444'}}>{pick.risk}</TextSnippet></TCell>
                   <TCell>
                     <SparkWrap>
                       <ResponsiveContainer width="100%" height="100%">
                         <AreaChart data={generateChartData(pick.trend, 10)}>
                           <Area type="monotone" dataKey="value" stroke={vColor} fill={vColor} fillOpacity={0.1} strokeWidth={1.5} isAnimationActive={false} />
                         </AreaChart>
                       </ResponsiveContainer>
                     </SparkWrap>
                   </TCell>
                 </TRow>
               )
            })}
          </TableWrap>
        </MainCol>

        <SideCol>
          <Footer>
            AI analysis last run: {updatedLabel || 'Not yet run'}<br/>
            Sources: RSS feeds · Alpha Vantage · Finnhub
          </Footer>
        </SideCol>
      </Shell>
      </>}
    </Page>

    <AnimatePresence>
      {showAuthModal && (
        <ModalOverlay
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={() => setShowAuthModal(false)}
        >
          <ModalCard
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            onClick={e => e.stopPropagation()}
          >
            <ModalClose onClick={() => setShowAuthModal(false)}>✕</ModalClose>
            <ModalIcon>🔐</ModalIcon>
            <ModalTitle>Sign in to unlock this</ModalTitle>
            <ModalDesc>
              The AI analysis engine reads live market headlines and generates picks tailored to your preferences. Free to use — just needs an account.
            </ModalDesc>
            <ModalPerks>
              <ModalPerk>
                <span style={{color:'#10b981',fontWeight:700,fontSize:'1rem'}}>✓</span>
                Run live AI analysis on today's market news
              </ModalPerk>
              <ModalPerk>
                <span style={{color:'#10b981',fontWeight:700,fontSize:'1rem'}}>✓</span>
                Save preferences — risk level, sectors, horizon
              </ModalPerk>
              <ModalPerk>
                <span style={{color:'#10b981',fontWeight:700,fontSize:'1rem'}}>✓</span>
                Keep a personal trading journal
              </ModalPerk>
              <ModalPerk>
                <span style={{color:'#10b981',fontWeight:700,fontSize:'1rem'}}>✓</span>
                Access Academy scenarios and courses
              </ModalPerk>
            </ModalPerks>
            <ModalSignInBtn onClick={() => { setShowAuthModal(false); navigate('/auth?mode=signin'); }}>
              Sign in
            </ModalSignInBtn>
            <ModalCreateBtn onClick={() => { setShowAuthModal(false); navigate('/auth?mode=signup'); }}>
              Create a free account
            </ModalCreateBtn>
            <ModalNote>No credit card required · Free forever</ModalNote>
          </ModalCard>
        </ModalOverlay>
      )}
    </AnimatePresence>
    </>
  );
}
