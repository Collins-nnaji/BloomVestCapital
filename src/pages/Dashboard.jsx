import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaBolt, FaGem, FaSyncAlt, FaSearch,
  FaChevronDown, FaChevronUp, FaCheckCircle,
  FaArrowUp, FaArrowDown, FaMinus, FaExchangeAlt,
  FaFilter, FaBookOpen, FaPlus, FaTrash, FaMagic, FaSpinner, FaChartLine
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
  min-height:calc(100vh - 80px);
  background:#ffffff;
  font-family:'Inter',system-ui,sans-serif;
  -webkit-font-smoothing:antialiased;
  padding-top: 64px;
  color: #0f172a;
  &::-webkit-scrollbar { display: none; }
  -ms-overflow-style: none; scrollbar-width: none;
`;

const TopHeader = styled.div`
  padding: 1.25rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #f8fafc;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
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
  transition: all 0.2s;
  &:hover { color: #0f172a; }
`;
const FilterDot = styled.span`
  width: 6px; height: 6px; border-radius: 50%;
  background: ${p => p.$color || '#cbd5e1'};
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;
const LastRunInfo = styled.div`
  font-size: 0.7rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
  span { font-family: 'JetBrains Mono', monospace; color: #0f172a; margin-left: 4px; }
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
`;
const RunBtn = styled(motion.button)`
  background: #0f172a; color: #ffffff;
  border: none; border-radius: 8px;
  padding: 0.5rem 1rem; font-size: 0.8rem; font-weight: 600;
  display: inline-flex; align-items: center; gap: 0.5rem;
  cursor: pointer;
  &:hover { background: #1e293b; }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;

/* ── summary bar ────────────────────────────────────── */
const SummaryBar = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  background: #fcfcfc;
`;
const SumItem = styled.div`
  padding: 0.8rem 2rem;
  display: flex; flex-direction: column; gap: 0.2rem;
`;
const SumLabel = styled.div`
  font-size: 0.65rem; font-weight: 700; color: #94a3b8;
  text-transform: uppercase; letter-spacing: 0.08em;
`;
const SumValue = styled.div`
  font-size: 1.4rem; font-family: 'Space Grotesk', sans-serif;
  font-weight: 700; color: ${p => p.$color || '#0f172a'};
`;

/* ── preferences & filters ──────────────────────────── */
const PrefsWrap = styled(motion.div)`
  padding: 1.5rem 2rem;
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
  padding: 0.8rem 2rem;
  display: flex; align-items: center; gap: 1rem;
  background: #ffffff;
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
  @media(max-width:1100px) { grid-template-columns: 1fr; }
`;

const MainCol = styled.div`
  display: flex; flex-direction: column;
`;

const SideCol = styled.div`
  display: flex; flex-direction: column;
  background: #fafafa;
`;

/* ── master table ───────────────────────────────────── */
const TableHeader = styled.div`
  display: flex; justify-content: space-between; align-items: center;
  padding: 0.8rem 1.5rem;
  background: #ffffff;
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
  flex: 1; overflow-y: auto;
  &::-webkit-scrollbar { display: none; }
  -ms-overflow-style: none; scrollbar-width: none;
`;
const THead = styled.div`
  display: grid; grid-template-columns: 1.4fr 0.8fr 1.2fr 2.5fr 1.5fr 0.6fr;
  @media(max-width: 900px) { min-width: 800px; }
`;
const THCell = styled.div`
  padding: 0.6rem 1rem; font-size: 0.6rem; font-weight: 700; color: #94a3b8;
  text-transform: uppercase; letter-spacing: 0.1em;
`;
const TRow = styled(motion.div)`
  display: grid; grid-template-columns: 1.4fr 0.8fr 1.2fr 2.5fr 1.5fr 0.6fr;
  cursor: pointer;
  @media(max-width: 900px) { min-width: 800px; }
  background: ${p => p.$selected ? '#f8fafc' : '#ffffff'};
  border-left: 3px solid ${p => p.$selected ? '#10b981' : 'transparent'};
  &:hover { background: #f8fafc; }
`;
const TCell = styled.div`
  padding: 1rem; display: flex; flex-direction: column; justify-content: center;
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

/* ── journal pane ───────────────────────────────────── */
const JournalWrap = styled.div`
  display: flex; flex-direction: column; height: 100%;
`;
const JournalHead = styled.div`
  padding: 1.5rem 2rem;
  display: flex; justify-content: space-between; align-items: center;
  background: #ffffff;
`;
const JournalTitle = styled.h3`
  font-family: 'Space Grotesk', sans-serif; font-size: 1.1rem; font-weight: 800; color: #0f172a; margin: 0;
  display: flex; align-items: center; gap: 0.5rem;
`;
const AddNoteBtn = styled.button`
  background: #0f172a; color: #ffffff; border: none; border-radius: 6px;
  width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: background 0.2s;
  &:hover { background: #1e293b; }
`;
const NotesList = styled.div`
  flex: 1; overflow-y: auto; padding: 1.5rem 2rem;
  display: flex; flex-direction: column; gap: 1rem;
  &::-webkit-scrollbar { display: none; }
`;
const NoteCard = styled(motion.div)`
  background: #ffffff; border: 1px solid #f1f5f9; border-radius: 12px;
  padding: 1rem; position: relative;
  box-shadow: 0 2px 8px rgba(0,0,0,0.02);
  &:hover { border-color: #cbd5e1; }
`;
const NoteText = styled.textarea`
  width: 100%; border: none; background: transparent; font-family: inherit;
  font-size: 0.85rem; color: #0f172a; line-height: 1.5; resize: none;
  &:focus { outline: none; }
`;
const NoteMeta = styled.div`
  display: flex; justify-content: space-between; align-items: center;
  margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px solid #f8fafc;
`;
const NoteDate = styled.span`font-size: 0.65rem; font-weight: 600; color: #94a3b8;`;
const DeleteNoteBtn = styled.button`
  background: transparent; border: none; color: #cbd5e1; cursor: pointer;
  font-size: 0.8rem; transition: color 0.2s;
  &:hover { color: #ef4444; }
`;

const EmptyJournal = styled.div`
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 4rem 2rem; text-align: center; color: #94a3b8; gap: 1rem;
  svg { font-size: 2rem; opacity: 0.3; }
  p { font-size: 0.85rem; margin: 0; line-height: 1.5; }
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
  const { user } = useAuth();
  const navigate = useNavigate();

  const [selectedAssetIdx, setSelectedAssetIdx] = useState(0);

  const [deepRunning, setDeepRunning] = useState(false);
  const [deepProgress, setDeepProgress] = useState(0);
  const [deepResult,  setDeepResult]  = useState(null);
  const [deepError,   setDeepError]   = useState(null);
  const [showPrefs,   setShowPrefs]   = useState(false);
  const [activeTypes, setActiveTypes] = useState(['Stocks','ETFs','Commodities','Crypto','Options Plays']);
  const [filterType,  setFilterType]  = useState('All');
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('bv_notes');
    return saved ? JSON.parse(saved) : [];
  });
  
  useEffect(() => {
    localStorage.setItem('bv_notes', JSON.stringify(notes));
  }, [notes]);

  const addNote = () => {
    const newNote = { id: Date.now(), text: '', date: new Date().toLocaleDateString() };
    setNotes([newNote, ...notes]);
  };

  const updateNote = (id, text) => {
    setNotes(notes.map(n => n.id === id ? { ...n, text } : n));
  };

  const deleteNote = (id) => {
    setNotes(notes.filter(n => n.id !== id));
  };
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
      if (window.confirm('Please log in to use the Deep Analysis engine.')) {
        navigate('/auth');
      }
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

  const investmentModes = brief?.investmentModes || defaultModes;
  const activeIdeas = mode === 'shortTerm' ? investmentModes.shortTerm : investmentModes.longTerm;

  const updatedLabel = brief?.generatedAt
    ? new Date(brief.generatedAt).toLocaleTimeString(undefined,{timeStyle:'short'})
    : null;

  const defaultMappedPicks = useMemo(() => activeIdeas.map(idea => ({
    company: idea.asset,
    ticker: idea.ticker,
    assetType: idea.vehicle,
    fit: idea.fit,
    action: idea.fit === 'Avoid' ? 'Avoid' : (idea.fit === 'Reduce' ? 'Reduce' : (idea.fit === 'Watch' ? 'Watch' : 'Buy')),
    trend: 'Sideways',
    confidence: 'Medium',
    thesis: idea.reason,
    whyNow: idea.whyNow,
    risk: idea.risk,
    horizon: idea.horizon
  })), [activeIdeas]);

  const rawPicks = deepResult ? deepResult.picks : defaultMappedPicks;

  const filteredPicks = useMemo(() => {
    if (filterType === 'All') return rawPicks;
    return rawPicks.filter(p => p.action === filterType || p.assetType === filterType);
  }, [rawPicks, filterType]);

  const counts = useMemo(() => {
    return rawPicks.reduce((acc, p) => { acc[p.action] = (acc[p.action] || 0) + 1; return acc; }, {});
  }, [rawPicks]);

  const selectedPick = filteredPicks[selectedAssetIdx] || filteredPicks[0] || null;

  const confToPct = (c) => c === 'High' ? 85 : c === 'Medium' ? 65 : 45;
  const confToScore = (c) => c === 'High' ? 82 : c === 'Medium' ? 61 : 34;

  const generateChartData = useCallback((trend, points) => {
    let val = 100;
    const slope = trend === 'Uptrend' ? 1.5 : trend === 'Downtrend' ? -1.5 : 0;
    return Array.from({length: points}).map((_, i) => {
      val += (Math.random() * 4 - 2) + slope;
      return { name: i, value: val };
    });
  }, []);

  return (
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
            const count = counts[f] || (f === 'All' ? filteredPicks.length : 0);
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
          <PrefsToggleBtn type="button" $active={showPrefs} onClick={() => setShowPrefs(!showPrefs)}>
            <FaFilter /> Preferences
          </PrefsToggleBtn>
          <RunBtn type="button" onClick={runDeepAnalysis} disabled={deepRunning}>
            <FaMagic /> {deepRunning ? 'Running...' : 'Run AI analysis'}
          </RunBtn>
        </HeaderRight>
      </TopHeader>

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
        <TypeLabel>Horizon Strategy:</TypeLabel>
        <ModeToggle>
          <ModeBtn type="button" $active={mode === 'longTerm'} onClick={() => setMode('longTerm')}>
            <FaChartLine /> Long-Term
          </ModeBtn>
          <ModeBtn type="button" $active={mode === 'shortTerm'} onClick={() => setMode('shortTerm')}>
            <FaBolt /> Short-Term
          </ModeBtn>
        </ModeToggle>
        
        <div style={{ width: '1px', height: '16px', background: '#e2e8f0', margin: '0 0.5rem' }} />

        <TypeLabel>Asset Filter:</TypeLabel>
        {ASSET_TYPES.map(type => (
          <TypeChip
            key={type.id}
            type="button"
            $active={activeTypes.includes(type.id)}
            $bg={type.activeBg.replace('rgba(','rgb(').replace(')','/ 0.1)')} // Convert to light theme friendly
            $color={type.activeColor === '#86efac' ? '#10b981' : type.activeColor === '#93c5fd' ? '#3b82f6' : (type.activeColor === '#fdba74' ? '#f97316' : '#8b5cf6')}
            onClick={() => toggleType(type.id)}
          >
            {type.label}
          </TypeChip>
        ))}
      </AssetTypeRow>

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
          <SumValue>61</SumValue>
        </SumItem>
      </SummaryBar>

      <Shell>
        <MainCol>
          <TableHeader>
            <THLeft>AI Picks <span>{filteredPicks.length} results</span></THLeft>
            <THRight>
              <THGroup>Horizon <THBtn type="button">Long-term</THBtn><THBtn type="button">Short-term</THBtn></THGroup>
              <THGroup>Export <THBtn type="button">CSV</THBtn><THBtn type="button">PDF</THBtn></THGroup>
            </THRight>
          </TableHeader>
          
          <TableWrap>
            <THead>
              <THCell>Asset</THCell><THCell>Verdict</THCell><THCell>AI Conf.</THCell>
              <THCell>Why it fits</THCell><THCell>Main risk</THCell><THCell>Trend</THCell>
            </THead>
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
                       <DeltaText $pos={true}>+3 vs last</DeltaText>
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
          <JournalWrap>
            <JournalHead>
              <JournalTitle><FaBookOpen /> Trading Journal</JournalTitle>
              <AddNoteBtn type="button" onClick={addNote}><FaPlus /></AddNoteBtn>
            </JournalHead>

            <NotesList>
              {notes.length === 0 ? (
                <EmptyJournal>
                  <FaBookOpen />
                  <p>Your journal is empty.<br/>Start tracking your strategy, wins, and lessons here.</p>
                </EmptyJournal>
              ) : (
                notes.map(note => (
                  <NoteCard
                    key={note.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <NoteText
                      placeholder="Type your notes..."
                      value={note.text}
                      onChange={e => updateNote(note.id, e.target.value)}
                      rows={3}
                    />
                    <NoteMeta>
                      <NoteDate>{note.date}</NoteDate>
                      <DeleteNoteBtn onClick={() => deleteNote(note.id)}>
                        <FaTrash />
                      </DeleteNoteBtn>
                    </NoteMeta>
                  </NoteCard>
                ))
              )}
            </NotesList>

            <Footer>
              Model: BloomVest-Analyst v1.2 · Run {updatedLabel || 'N/A'}<br/>
              SEC EDGAR: 14 filings | News wire: 892 headlines
            </Footer>
          </JournalWrap>
        </SideCol>
      </Shell>
    </Page>
  );
}
