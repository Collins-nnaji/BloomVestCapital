import React, { useState, useEffect, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaUser, FaMapMarkerAlt, FaCalendarAlt, FaEdit, FaCheck, FaTimes,
  FaChartLine, FaGraduationCap, FaHeart, FaBolt, FaFire,
  FaPlus, FaTrash, FaPencilAlt, FaCheckCircle, FaClock,
  FaSignInAlt, FaRobot, FaHistory, FaBook, FaArrowUp, FaTrophy,
  FaListUl, FaLock, FaChevronDown, FaChevronUp, FaCoins,
  FaBalanceScale, FaShieldAlt, FaBriefcase, FaChartPie, FaRegBell,
  FaAngleRight,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { api } from '../api';

/* ═══════════════════════════════════════════════════
   TOKENS
═══════════════════════════════════════════════════ */
const T = {
  navy:      '#0b1622',
  navyMid:   '#0f2035',
  navyLight: '#162840',
  gold:      '#c9a84c',
  goldLight: '#e8c97a',
  green:     '#15803d',
  greenBright:'#27c46b',
  paper:     '#f7f8fa',
  white:     '#ffffff',
  border:    '#e2e8f0',
  borderDark:'#cbd5e1',
  ink:       '#0d1b2a',
  inkMid:    '#334155',
  inkMute:   '#64748b',
  inkFaint:  '#94a3b8',
};

/* ═══════════════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════════════ */
const RISK_OPTIONS   = ['conservative', 'moderate', 'aggressive'];
const INVESTOR_TYPES = ['beginner', 'intermediate', 'advanced'];
const STYLES         = ['passive', 'active', 'mixed'];
const FOCUS_OPTIONS  = ['stocks', 'bonds', 'crypto', 'etfs', 'real-estate', 'mixed'];

const AVATAR_COLORS = [
  '#0b1622','#15803d','#0284c7','#1d4ed8','#7c3aed',
  '#db2777','#dc2626','#c9a84c','#0f766e','#374151',
];

const GOAL_CATS = [
  { id: 'savings',    label: 'Savings',    emoji: '💰', color: '#15803d' },
  { id: 'investment', label: 'Investment', emoji: '📈', color: '#0284c7' },
  { id: 'debt',       label: 'Debt Payoff',emoji: '💳', color: '#dc2626' },
  { id: 'property',   label: 'Property',   emoji: '🏠', color: '#7c3aed' },
  { id: 'income',     label: 'Income',     emoji: '💼', color: '#d97706' },
  { id: 'custom',     label: 'Custom',     emoji: '🎯', color: '#64748b' },
];

const PLAN_TEMPLATES = [
  {
    emoji: '🛡️', title: '3-Month Emergency Fund',
    category: 'savings', description: 'Build a financial buffer covering 3 months of living expenses.',
    steps: ['Calculate monthly expenses precisely','Open dedicated high-interest savings account','Set up automatic monthly transfers','Track progress weekly','Celebrate each 25% milestone'],
  },
  {
    emoji: '📈', title: 'Start Investing Journey',
    category: 'investment', description: 'Move from saving to investing — starting with the fundamentals.',
    steps: ['Complete Investing 101 in AI Tutor','Open a stocks & shares ISA or brokerage account','Choose a low-cost index fund (e.g. FTSE All-World)','Set up monthly recurring investment (even £50/mo)','Review quarterly — avoid daily checking'],
  },
  {
    emoji: '💳', title: 'Debt Elimination Plan',
    category: 'debt', description: 'Clear high-interest debt using the avalanche method.',
    steps: ['List all debts with balances and interest rates','Stop adding new debt — reduce discretionary spend','Allocate every spare £ to highest-interest debt first','Roll cleared payments to the next debt','Build a small buffer to prevent relapse'],
  },
  {
    emoji: '🏠', title: 'House Deposit Plan',
    category: 'property', description: 'Save systematically toward a property deposit.',
    steps: ['Set a clear deposit target (e.g. 10% of property value)','Open a Lifetime ISA if eligible (25% government bonus)','Automate monthly savings into LISA or savings account','Reduce recurring subscriptions to free up capital','Review timeline every 6 months'],
  },
];

const RISK_META = {
  conservative: { label: 'Conservative', color: '#0284c7', bg: 'rgba(2,132,199,0.08)', barColor: '#0284c7', barW: '30%' },
  moderate:     { label: 'Moderate',     color: '#d97706', bg: 'rgba(217,119,6,0.08)',  barColor: '#d97706', barW: '60%' },
  aggressive:   { label: 'Aggressive',   color: '#dc2626', bg: 'rgba(220,38,38,0.08)',  barColor: '#dc2626', barW: '90%' },
};
const INVESTOR_META = {
  beginner:     { label: 'Beginner',     dot: '●', color: '#22c55e' },
  intermediate: { label: 'Intermediate', dot: '●', color: '#eab308' },
  advanced:     { label: 'Advanced',     dot: '●', color: '#ef4444' },
};

/* ═══════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════ */
const fmt = n => (!n && n !== 0) ? '—' : Number(n).toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
const fmtDate = iso => iso ? new Date(iso).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' }) : '—';
const fmtYear = iso => iso ? new Date(iso).getFullYear() : '';
const timeAgo = iso => {
  if (!iso) return '';
  const s = Math.floor((Date.now() - new Date(iso)) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s/60)}m ago`;
  if (s < 86400) return `${Math.floor(s/3600)}h ago`;
  return `${Math.floor(s/86400)}d ago`;
};
const pct = (cur, tgt) => tgt ? Math.min(100, Math.round((cur / tgt) * 100)) : 0;
const initials = (name, email) => {
  if (name) return name.trim().split(' ').map(w => w[0]).slice(0,2).join('').toUpperCase();
  if (email) return email.slice(0,2).toUpperCase();
  return 'BV';
};

/* ═══════════════════════════════════════════════════
   SKELETON ANIMATION
═══════════════════════════════════════════════════ */
const shimmer = keyframes`
  0%   { background-position: -600% 0 }
  100% { background-position:  600% 0 }
`;
const Skel = styled.div`
  border-radius: ${p => p.$r || 6}px;
  height: ${p => p.$h || 14}px;
  width: ${p => p.$w || '100%'};
  background: linear-gradient(90deg, #e9ecf0 25%, #f4f5f7 50%, #e9ecf0 75%);
  background-size: 600% 100%;
  animation: ${shimmer} 1.8s ease-in-out infinite;
  margin-bottom: ${p => p.$mb || 0}px;
`;

/* ═══════════════════════════════════════════════════
   PAGE SHELL
═══════════════════════════════════════════════════ */
const Page = styled.div`
  min-height: 100vh;
  background: ${T.paper};
  padding-top: 64px;
`;

/* ── Hero banner ── */
const HeroBanner = styled.div`
  height: 240px;
  background: linear-gradient(160deg, #071120 0%, #0b1c30 40%, #0e1f14 100%);
  position: relative;
  overflow: hidden;
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(201,168,76,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(201,168,76,0.04) 1px, transparent 1px);
    background-size: 40px 40px;
  }
  &::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 80px;
    background: linear-gradient(to bottom, transparent, ${T.paper});
  }
`;

const HeroAccent = styled.div`
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 15% 60%, rgba(21,128,61,0.15) 0%, transparent 55%),
    radial-gradient(ellipse at 85% 20%, rgba(201,168,76,0.08) 0%, transparent 45%);
`;

const HeroLabel = styled.div`
  position: absolute;
  top: 1.5rem;
  right: 1.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.68rem;
  font-weight: 700;
  color: rgba(201,168,76,0.7);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  border: 1px solid rgba(201,168,76,0.2);
  padding: 0.3rem 0.75rem;
  border-radius: 99px;
`;

const Wrap = styled.div`
  max-width: 1160px;
  margin: 0 auto;
  padding: 0 1.5rem 5rem;
`;

/* ── Profile header ── */
const PHeader = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 1.5rem;
  margin-top: -60px;
  position: relative;
  z-index: 2;
  padding-bottom: 1.4rem;
  border-bottom: 1px solid ${T.border};
  flex-wrap: wrap;
`;

const AvatarWrap = styled.div`position: relative; flex-shrink: 0;`;

const Avatar = styled(motion.div)`
  width: 118px;
  height: 118px;
  border-radius: 50%;
  background: ${p => p.$color || T.navy};
  border: 4px solid ${T.white};
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 2.2rem;
  font-weight: 800;
  color: #fff;
  box-shadow: 0 8px 30px rgba(0,0,0,0.22), 0 0 0 1px rgba(201,168,76,0.15);
  cursor: ${p => p.$editable ? 'pointer' : 'default'};
  position: relative;
  &::after {
    content: '';
    position: absolute;
    inset: -1px;
    border-radius: 50%;
    border: 1px solid rgba(201,168,76,0.2);
  }
`;

const AvatarBadge = styled.div`
  position: absolute;
  bottom: 4px;
  right: 4px;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: ${T.gold};
  border: 2.5px solid ${T.white};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
`;

const ColorPicker = styled(motion.div)`
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  background: ${T.white};
  border: 1px solid ${T.border};
  border-radius: 14px;
  padding: 0.65rem 0.75rem;
  box-shadow: 0 12px 32px rgba(0,0,0,0.14);
  display: flex;
  gap: 0.45rem;
  flex-wrap: wrap;
  width: 206px;
  z-index: 20;
`;

const Swatch = styled.div`
  width: 24px; height: 24px;
  border-radius: 50%;
  background: ${p => p.$c};
  cursor: pointer;
  border: 2.5px solid ${p => p.$active ? T.gold : 'transparent'};
  transition: transform 0.12s;
  &:hover { transform: scale(1.18); }
`;

const PInfo = styled.div`flex: 1; padding-bottom: 0.3rem; min-width: 0;`;

const PName = styled.h1`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.75rem;
  font-weight: 800;
  color: ${T.ink};
  margin: 0 0 0.15rem;
  letter-spacing: -0.02em;
`;

const PTagline = styled.p`
  font-size: 0.92rem;
  color: ${T.inkMid};
  margin: 0 0 0.5rem;
  font-weight: 500;
`;

const PMeta = styled.div`display: flex; flex-wrap: wrap; gap: 0.85rem; align-items: center;`;

const MetaItem = styled.span`
  display: flex; align-items: center; gap: 0.3rem;
  font-size: 0.78rem; color: ${T.inkMute}; font-weight: 500;
`;

const BadgeRow = styled.div`display: flex; gap: 0.45rem; flex-wrap: wrap; margin-top: 0.5rem;`;

const Badge = styled.span`
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.22rem 0.75rem;
  border-radius: 99px;
  background: ${p => p.$bg};
  color: ${p => p.$color};
  border: 1px solid ${p => p.$color}25;
  letter-spacing: 0.01em;
`;

const GoldBadge = styled.span`
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.22rem 0.75rem;
  border-radius: 99px;
  background: rgba(201,168,76,0.1);
  color: ${T.gold};
  border: 1px solid rgba(201,168,76,0.25);
`;

const EditBtn = styled(motion.button)`
  display: flex; align-items: center; gap: 0.4rem;
  padding: 0.6rem 1.25rem;
  border: 1.5px solid ${T.border};
  border-radius: 10px;
  background: ${T.white};
  font-size: 0.82rem; font-weight: 700; color: ${T.inkMid};
  cursor: pointer; margin-left: auto; align-self: flex-end; margin-bottom: 0.3rem;
  font-family: inherit; transition: border-color 0.15s, color 0.15s;
  &:hover { border-color: ${T.gold}; color: ${T.gold}; }
`;

/* ── Health Score banner ── */
const ScoreBanner = styled(motion.div)`
  background: linear-gradient(135deg, ${T.navy} 0%, ${T.navyMid} 60%, #0e1f14 100%);
  border-radius: 18px;
  padding: 1.5rem 1.75rem;
  display: flex;
  align-items: center;
  gap: 1.75rem;
  flex-wrap: wrap;
  margin: 1.4rem 0 1.2rem;
  box-shadow: 0 6px 24px rgba(11,22,34,0.18);
  border: 1px solid rgba(201,168,76,0.12);
  position: relative;
  overflow: hidden;
  &::before {
    content: '';
    position: absolute;
    right: -40px; top: -40px;
    width: 200px; height: 200px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(201,168,76,0.06), transparent 70%);
  }
`;

const ScoreRing = styled.div`
  position: relative;
  width: 96px;
  height: 96px;
  flex-shrink: 0;
`;

const ScoreCenter = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: 'Space Grotesk', sans-serif;
`;

const Pillar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.22rem;
  min-width: 96px;
`;
const PillarLabel = styled.div`font-size: 0.62rem; color: rgba(255,255,255,0.4); font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em;`;
const PillarVal   = styled.div`font-size: 0.88rem; font-weight: 800; color: rgba(255,255,255,0.92);`;
const PillarBar   = styled.div`height: 3px; width: 80px; background: rgba(255,255,255,0.1); border-radius: 99px; overflow: hidden;`;
const PillarFill  = styled(motion.div)`height: 100%; background: ${T.goldLight}; border-radius: 99px;`;

/* ── Stats row ── */
const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.85rem;
  margin-bottom: 1.2rem;
  @media (max-width: 640px) { grid-template-columns: repeat(2, 1fr); }
`;

const StatCard = styled(motion.div)`
  background: ${T.white};
  border: 1px solid ${T.border};
  border-radius: 14px;
  padding: 1.1rem 1.2rem;
  display: flex;
  align-items: center;
  gap: 0.9rem;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  transition: border-color 0.15s, box-shadow 0.15s;
  &:hover { border-color: ${T.borderDark}; box-shadow: 0 3px 10px rgba(0,0,0,0.07); }
`;

const StatIco = styled.div`
  width: 42px; height: 42px; border-radius: 11px;
  background: ${p => p.$bg};
  display: flex; align-items: center; justify-content: center;
  font-size: 1rem; color: ${p => p.$color}; flex-shrink: 0;
`;
const StatVal = styled.div`font-family: 'Space Grotesk',sans-serif; font-size: 1.45rem; font-weight: 800; color: ${T.ink}; line-height: 1;`;
const StatLbl = styled.div`font-size: 0.68rem; color: ${T.inkFaint}; font-weight: 600; margin-top: 3px; text-transform: uppercase; letter-spacing: 0.05em;`;

/* ── Main layout ── */
const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 1.15rem;
  align-items: start;
  @media (max-width: 900px) { grid-template-columns: 1fr; }
`;

/* ── Cards ── */
const Card = styled.div`
  background: ${T.white};
  border: 1px solid ${T.border};
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  margin-bottom: 1.1rem;
`;

const CardHead = styled.div`
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
`;

const CardTitle = styled.div`
  font-weight: 800;
  font-size: 0.84rem;
  color: ${T.ink};
  display: flex;
  align-items: center;
  gap: 0.45rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const CardBody = styled.div`padding: ${p => p.$p || '1rem 1.25rem'};`;

const SectionDivider = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 1.6rem 0 1rem;
`;
const DivLine = styled.div`flex: 1; height: 1px; background: ${T.border};`;
const DivLabel = styled.div`font-size: 0.68rem; font-weight: 800; color: ${T.inkFaint}; text-transform: uppercase; letter-spacing: 0.1em; white-space: nowrap;`;

/* ── Form ── */
const FG = styled.div`display: flex; flex-direction: column; gap: 0.25rem; margin-bottom: 0.7rem;`;
const FL = styled.label`font-size: 0.65rem; font-weight: 700; color: ${T.inkFaint}; text-transform: uppercase; letter-spacing: 0.07em;`;
const FI = styled.input`
  padding: 0.58rem 0.8rem; border: 1.5px solid ${T.border}; border-radius: 9px;
  font-size: 0.85rem; color: ${T.ink}; background: ${T.white}; font-family: inherit;
  width: 100%; box-sizing: border-box; transition: border-color 0.15s;
  &:focus { outline: none; border-color: ${T.gold}; box-shadow: 0 0 0 3px rgba(201,168,76,0.08); }
`;
const FT = styled.textarea`
  padding: 0.58rem 0.8rem; border: 1.5px solid ${T.border}; border-radius: 9px;
  font-size: 0.85rem; color: ${T.ink}; background: ${T.white}; font-family: inherit;
  width: 100%; box-sizing: border-box; resize: vertical; min-height: 72px; transition: border-color 0.15s;
  &:focus { outline: none; border-color: ${T.gold}; box-shadow: 0 0 0 3px rgba(201,168,76,0.08); }
`;
const FS = styled.select`
  padding: 0.58rem 0.8rem; border: 1.5px solid ${T.border}; border-radius: 9px;
  font-size: 0.85rem; color: ${T.ink}; background: ${T.white}; font-family: inherit;
  width: 100%; box-sizing: border-box;
  &:focus { outline: none; border-color: ${T.gold}; }
`;
const TwoCol = styled.div`display: grid; grid-template-columns: 1fr 1fr; gap: 0.6rem;`;

const SaveBtn = styled(motion.button)`
  display: flex; align-items: center; gap: 0.4rem;
  padding: 0.62rem 1.25rem; border: none; border-radius: 9px;
  background: linear-gradient(135deg, ${T.navy}, #0f2035);
  color: ${T.white}; font-size: 0.84rem; font-weight: 700;
  cursor: pointer; font-family: inherit;
  box-shadow: 0 2px 8px rgba(11,22,34,0.2);
  border: 1px solid rgba(201,168,76,0.2);
`;
const CancelBtn = styled.button`
  padding: 0.62rem 1.1rem; border: 1.5px solid ${T.border}; border-radius: 9px;
  background: ${T.white}; font-size: 0.84rem; font-weight: 600; color: ${T.inkMute};
  cursor: pointer; font-family: inherit;
  &:hover { color: #dc2626; border-color: #dc2626; }
`;

/* ── About rows ── */
const AR = styled.div`
  display: flex; align-items: flex-start; gap: 0.65rem;
  padding: 0.6rem 0; border-bottom: 1px solid #f8fafc;
  &:last-child { border-bottom: none; }
`;
const AK = styled.div`font-size: 0.65rem; font-weight: 700; color: ${T.inkFaint}; text-transform: uppercase; letter-spacing: 0.06em; width: 88px; flex-shrink: 0; padding-top: 2px;`;
const AV = styled.div`font-size: 0.85rem; color: ${T.ink}; font-weight: 600; flex: 1;`;

/* ── Goals ── */
const GoalCard = styled(motion.div)`
  background: ${T.white};
  border: 1px solid ${T.border};
  border-radius: 12px;
  padding: 1rem 1.1rem;
  margin-bottom: 0.75rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.03);
  transition: border-color 0.15s;
  &:hover { border-color: ${T.borderDark}; }
`;

const GoalTop = styled.div`display: flex; align-items: flex-start; gap: 0.65rem; margin-bottom: 0.7rem;`;

const ProgressTrack = styled.div`
  height: 6px; background: #f1f5f9; border-radius: 99px; overflow: hidden; margin-bottom: 0.5rem;
`;
const ProgressFill = styled(motion.div)`
  height: 100%; border-radius: 99px;
  background: ${p => p.$color || T.green};
`;

const GoalAmts = styled.div`display: flex; justify-content: space-between; align-items: center; font-size: 0.78rem;`;

const ActionBtn = styled.button`
  padding: 0.22rem 0.5rem; border-radius: 6px; border: 1.5px solid ${T.border};
  background: ${T.white}; font-size: 0.65rem; cursor: pointer; color: ${T.inkMute};
  display: flex; align-items: center; gap: 0.2rem; font-weight: 600;
  transition: border-color 0.12s, color 0.12s;
  &:hover { border-color: ${p => p.$danger ? '#dc2626' : T.gold}; color: ${p => p.$danger ? '#dc2626' : T.gold}; }
`;

const AddBtn = styled(motion.button)`
  width: 100%; padding: 0.72rem; border: 2px dashed ${T.border}; border-radius: 11px;
  background: transparent; color: ${T.inkMute}; font-size: 0.82rem; font-weight: 700;
  cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.4rem;
  font-family: inherit; transition: border-color 0.15s, color 0.15s;
  &:hover { border-color: ${T.gold}; color: ${T.gold}; }
`;

/* ── Plans ── */
const PlanCard = styled(motion.div)`
  background: ${T.white};
  border: 1px solid ${T.border};
  border-radius: 14px;
  overflow: hidden;
  margin-bottom: 0.85rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.03);
`;

const PlanHead = styled.div`
  padding: 0.9rem 1.1rem;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  cursor: pointer;
  transition: background 0.12s;
  &:hover { background: #fafbfc; }
`;

const PlanEmoji = styled.span`font-size: 1.3rem; line-height: 1; flex-shrink: 0;`;
const PlanTitle = styled.div`font-size: 0.9rem; font-weight: 800; color: ${T.ink}; flex: 1;`;
const PlanMeta = styled.div`font-size: 0.7rem; color: ${T.inkFaint}; margin-top: 2px;`;
const PlanBody = styled(motion.div)`padding: 0 1.1rem 1rem; overflow: hidden;`;

const StepRow = styled.div`
  display: flex; align-items: flex-start; gap: 0.65rem;
  padding: 0.5rem 0; border-bottom: 1px solid #f8fafc;
  &:last-child { border-bottom: none; }
`;

const StepCheck = styled.div`
  width: 20px; height: 20px; border-radius: 50%; flex-shrink: 0; margin-top: 1px; cursor: pointer;
  border: 2px solid ${p => p.$done ? T.green : T.border};
  background: ${p => p.$done ? T.green : T.white};
  display: flex; align-items: center; justify-content: center;
  transition: all 0.15s;
  &:hover { border-color: ${T.green}; }
`;

const StepText = styled.div`
  font-size: 0.82rem;
  color: ${p => p.$done ? T.inkFaint : T.inkMid};
  text-decoration: ${p => p.$done ? 'line-through' : 'none'};
  line-height: 1.55; flex: 1;
`;

const TemplatePicker = styled.div`
  display: grid; grid-template-columns: 1fr 1fr; gap: 0.6rem; margin-bottom: 0.75rem;
`;

const TemplateBtn = styled.button`
  padding: 0.75rem 0.7rem; border-radius: 10px; border: 1.5px solid ${T.border};
  background: ${T.white}; text-align: left; cursor: pointer; font-family: inherit;
  transition: border-color 0.12s, background 0.12s;
  &:hover { border-color: ${T.gold}; background: rgba(201,168,76,0.04); }
`;

/* ── Cash Flow & Net Worth ── */
const DataRow = styled.div`
  display: flex; align-items: center; gap: 0.65rem;
  padding: 0.6rem 0; border-bottom: 1px solid #f1f5f9;
  &:last-child { border-bottom: none; }
`;
const DataLabel = styled.div`font-size: 0.78rem; color: ${T.inkMute}; font-weight: 600; flex: 1;`;
const DataValue = styled.div`
  font-family: 'Space Grotesk',sans-serif; font-size: 0.95rem; font-weight: 800;
  color: ${p => p.$accent || T.ink};
`;
const DataInput = styled.input`
  width: 118px; padding: 0.32rem 0.6rem; border: 1.5px solid ${T.border}; border-radius: 8px;
  font-size: 0.83rem; text-align: right; font-family: 'Space Grotesk',sans-serif; font-weight: 700; color: ${T.ink};
  transition: border-color 0.15s;
  &:focus { outline: none; border-color: ${T.gold}; }
`;

/* ── Risk gauge ── */
const RiskGauge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 1.25rem;
  background: ${p => p.$bg};
  border-radius: 12px;
  margin-bottom: 0.75rem;
  border: 1px solid ${p => p.$color}18;
`;
const RiskDot = styled.div`
  width: 10px; height: 10px; border-radius: 50%; background: ${p => p.$color}; flex-shrink: 0;
`;
const RiskBar = styled.div`
  flex: 1; height: 5px; background: rgba(0,0,0,0.07); border-radius: 99px; overflow: hidden;
`;
const RiskFill = styled(motion.div)`
  height: 100%; background: ${p => p.$color}; border-radius: 99px;
`;

/* ── Session row ── */
const SessionRow = styled.button`
  width: 100%; text-align: left; padding: 0.52rem 1.25rem; border: none; background: none; cursor: pointer;
  display: flex; align-items: center; gap: 0.55rem; font-size: 0.78rem; font-weight: 600; color: ${T.inkMid};
  border-bottom: 1px solid #f8fafc; transition: background 0.1s;
  &:hover { background: #fafbfc; }
  &:last-child { border-bottom: none; }
`;

/* ── Modal ── */
const Overlay = styled(motion.div)`
  position: fixed; inset: 0; background: rgba(0,0,0,0.5);
  backdrop-filter: blur(4px); z-index: 200;
  display: flex; align-items: center; justify-content: center; padding: 1.5rem;
`;
const Modal = styled(motion.div)`
  background: ${T.white}; border-radius: 20px; width: 100%;
  max-width: 490px; max-height: 90vh; overflow-y: auto;
  box-shadow: 0 28px 70px rgba(0,0,0,0.22);
  border: 1px solid ${T.border};
`;
const MHead = styled.div`
  padding: 1.2rem 1.4rem; border-bottom: 1px solid #f1f5f9;
  display: flex; align-items: center; justify-content: space-between;
`;
const MTitle = styled.div`font-weight: 800; font-size: 1rem; color: ${T.ink}; font-family: 'Space Grotesk',sans-serif;`;
const MBody  = styled.div`padding: 1.3rem 1.4rem;`;

const CatGrid = styled.div`display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; margin-bottom: 0.8rem;`;
const CatBtn  = styled.button`
  padding: 0.65rem 0.5rem; border-radius: 10px;
  border: 1.5px solid ${p => p.$active ? p.$color : T.border};
  background: ${p => p.$active ? p.$color + '12' : T.white};
  color: ${p => p.$active ? p.$color : T.inkMute};
  font-size: 0.75rem; font-weight: 700; cursor: pointer;
  text-align: center; display: flex; flex-direction: column; align-items: center; gap: 0.2rem; font-family: inherit;
  transition: border-color 0.12s, background 0.12s;
`;

/* ── Auth gate ── */
const AuthGate = styled.div`
  min-height: 100vh;
  background: linear-gradient(160deg, #071120 0%, #0b1c30 50%, #0e1f14 100%);
  display: flex; align-items: center; justify-content: center; padding: 2rem;
`;

/* ═══════════════════════════════════════════════════
   GOAL MODAL
═══════════════════════════════════════════════════ */
function GoalModal({ initial, onSave, onClose }) {
  const [form, setForm] = useState({
    title: initial?.title || '',
    category: initial?.category || 'savings',
    targetAmount: initial?.target_amount ?? '',
    currentAmount: initial?.current_amount ?? 0,
    deadline: initial?.deadline ? initial.deadline.slice(0,10) : '',
  });
  const cat = GOAL_CATS.find(c => c.id === form.category) || GOAL_CATS[0];
  const set = (k,v) => setForm(f => ({ ...f, [k]: v }));
  return (
    <Overlay initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} onClick={onClose}>
      <Modal initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:24 }} onClick={e => e.stopPropagation()}>
        <MHead>
          <MTitle>{initial ? 'Edit Investment Goal' : 'New Investment Goal'}</MTitle>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:T.inkFaint, fontSize:'1rem' }}><FaTimes /></button>
        </MHead>
        <MBody>
          <FG><FL>Category</FL>
            <CatGrid>
              {GOAL_CATS.map(c => (
                <CatBtn key={c.id} $active={form.category===c.id} $color={c.color} onClick={() => set('category',c.id)}>
                  <span style={{ fontSize:'1.2rem' }}>{c.emoji}</span>{c.label}
                </CatBtn>
              ))}
            </CatGrid>
          </FG>
          <FG><FL>Goal Title</FL><FI placeholder="e.g. Emergency Fund, Max ISA…" value={form.title} onChange={e=>set('title',e.target.value)} /></FG>
          <TwoCol>
            <FG><FL>Target (£)</FL><FI type="number" placeholder="10000" value={form.targetAmount} onChange={e=>set('targetAmount',e.target.value)} /></FG>
            <FG><FL>Current (£)</FL><FI type="number" placeholder="0" value={form.currentAmount} onChange={e=>set('currentAmount',e.target.value)} /></FG>
          </TwoCol>
          <FG><FL>Target Date</FL><FI type="date" value={form.deadline} onChange={e=>set('deadline',e.target.value)} /></FG>
          <div style={{ display:'flex', gap:'0.6rem', justifyContent:'flex-end', marginTop:'0.75rem' }}>
            <CancelBtn onClick={onClose}>Cancel</CancelBtn>
            <SaveBtn onClick={() => { if(!form.title||!form.targetAmount) return; onSave({ ...form, emoji: cat.emoji, color: cat.color, targetAmount: parseFloat(form.targetAmount)||0, currentAmount: parseFloat(form.currentAmount)||0 }); }} whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}>
              <FaCheck /> {initial ? 'Save Changes' : 'Add Goal'}
            </SaveBtn>
          </div>
        </MBody>
      </Modal>
    </Overlay>
  );
}

function UpdateAmountModal({ goal, onSave, onClose }) {
  const [val, setVal] = useState(String(goal.current_amount || 0));
  return (
    <Overlay initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} onClick={onClose}>
      <Modal initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:16 }} onClick={e => e.stopPropagation()} style={{ maxWidth:360 }}>
        <MHead>
          <MTitle>{goal.emoji} Update Progress</MTitle>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:T.inkFaint }}><FaTimes /></button>
        </MHead>
        <MBody>
          <FG><FL>Current Amount (£)</FL><FI type="number" value={val} onChange={e=>setVal(e.target.value)} autoFocus /></FG>
          <div style={{ marginBottom:'0.75rem', fontSize:'0.8rem', color:T.inkMute }}>
            Target: £{fmt(goal.target_amount)} — you are {pct(parseFloat(val)||0, goal.target_amount)}% there
          </div>
          <div style={{ display:'flex', gap:'0.6rem', justifyContent:'flex-end' }}>
            <CancelBtn onClick={onClose}>Cancel</CancelBtn>
            <SaveBtn onClick={() => onSave(parseFloat(val)||0)} whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}>
              <FaCheck /> Update
            </SaveBtn>
          </div>
        </MBody>
      </Modal>
    </Overlay>
  );
}

/* ═══════════════════════════════════════════════════
   PLAN MODAL
═══════════════════════════════════════════════════ */
function PlanModal({ onSave, onClose }) {
  const [step, setStep] = useState('pick');
  const [form, setForm] = useState({ title:'', description:'', category:'custom', emoji:'📋', steps:[] });
  const [newStep, setNewStep] = useState('');
  const set = (k,v) => setForm(f => ({ ...f, [k]: v }));
  const applyTemplate = t => {
    setForm({ title:t.title, description:t.description, category:t.category, emoji:t.emoji, steps:t.steps.map(s=>({ text:s, done:false })) });
    setStep('custom');
  };
  const addStep = () => {
    if (!newStep.trim()) return;
    setForm(f => ({ ...f, steps:[...f.steps, { text:newStep.trim(), done:false }] }));
    setNewStep('');
  };
  const removeStep = i => setForm(f => ({ ...f, steps:f.steps.filter((_,idx)=>idx!==i) }));
  return (
    <Overlay initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} onClick={onClose}>
      <Modal initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:24 }} onClick={e => e.stopPropagation()}>
        <MHead>
          <MTitle>{step==='pick' ? 'Choose a Plan' : 'Build Your Plan'}</MTitle>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:T.inkFaint, fontSize:'1rem' }}><FaTimes /></button>
        </MHead>
        <MBody>
          {step === 'pick' ? (
            <>
              <TemplatePicker>
                {PLAN_TEMPLATES.map(t => (
                  <TemplateBtn key={t.title} onClick={() => applyTemplate(t)}>
                    <div style={{ fontSize:'1.4rem', marginBottom:5 }}>{t.emoji}</div>
                    <div style={{ fontSize:'0.78rem', fontWeight:700, color:T.ink, lineHeight:1.35 }}>{t.title}</div>
                    <div style={{ fontSize:'0.68rem', color:T.inkFaint, marginTop:3, lineHeight:1.4 }}>{t.description.slice(0,50)}…</div>
                  </TemplateBtn>
                ))}
              </TemplatePicker>
              <button onClick={() => setStep('custom')} style={{ width:'100%', padding:'0.72rem', border:`2px dashed ${T.border}`, borderRadius:10, background:'transparent', color:T.inkMute, fontSize:'0.82rem', fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>
                + Start from scratch
              </button>
            </>
          ) : (
            <>
              <FG><FL>Plan Title</FL><FI value={form.title} onChange={e=>set('title',e.target.value)} placeholder="e.g. Build Emergency Fund" /></FG>
              <FG><FL>Description</FL><FT value={form.description} onChange={e=>set('description',e.target.value)} placeholder="What's this plan about?" rows={2} /></FG>
              <FG>
                <FL>Action Steps ({form.steps.length})</FL>
                {form.steps.map((s,i) => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:'0.4rem', padding:'0.38rem 0', borderBottom:`1px solid #f1f5f9` }}>
                    <span style={{ fontSize:'0.82rem', color:T.inkMid, flex:1 }}>{i+1}. {s.text}</span>
                    <button onClick={() => removeStep(i)} style={{ background:'none', border:'none', cursor:'pointer', color:T.border, fontSize:'0.7rem', transition:'color 0.12s' }} onMouseEnter={e=>e.target.style.color='#dc2626'} onMouseLeave={e=>e.target.style.color=T.border}><FaTrash /></button>
                  </div>
                ))}
                <div style={{ display:'flex', gap:'0.5rem', marginTop:'0.5rem' }}>
                  <FI value={newStep} onChange={e=>setNewStep(e.target.value)} placeholder="Add a step…" onKeyDown={e=>e.key==='Enter'&&addStep()} style={{ marginBottom:0 }} />
                  <button onClick={addStep} style={{ padding:'0.58rem 1rem', border:`1.5px solid ${T.navy}`, borderRadius:9, background:T.navy, color:'#fff', cursor:'pointer', fontFamily:'inherit', fontWeight:700, fontSize:'0.82rem', whiteSpace:'nowrap' }}>+ Add</button>
                </div>
              </FG>
              <div style={{ display:'flex', gap:'0.6rem', justifyContent:'flex-end', marginTop:'0.75rem' }}>
                <CancelBtn onClick={() => setStep('pick')}>← Back</CancelBtn>
                <SaveBtn onClick={() => { if(!form.title) return; onSave(form); }} whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}>
                  <FaCheck /> Create Plan
                </SaveBtn>
              </div>
            </>
          )}
        </MBody>
      </Modal>
    </Overlay>
  );
}

/* ═══════════════════════════════════════════════════
   HEALTH SCORE
═══════════════════════════════════════════════════ */
function HealthScore({ profile, goals, learnedCount, savingsRate }) {
  const savingsPts  = Math.min(25, Math.round(savingsRate * 1.25));
  const goalsPts    = goals.length === 0 ? 0 : Math.round((goals.reduce((s,g) => s + pct(g.current_amount, g.target_amount), 0) / goals.length) * 0.25);
  const learningPts = Math.min(25, Math.round((learnedCount / 130) * 25));
  const profilePts  = Math.round([profile?.display_name, profile?.bio, profile?.location, profile?.risk_tolerance, profile?.monthly_income].filter(Boolean).length * 5);
  const total = Math.min(100, savingsPts + goalsPts + learningPts + profilePts);

  const pillars = [
    { label:'Savings Rate',   val:`${savingsRate}%`,        pts:savingsPts   },
    { label:'Goals Progress', val:`${goalsPts}/25 pts`,     pts:goalsPts     },
    { label:'Knowledge',      val:`${learnedCount} terms`,  pts:learningPts  },
    { label:'Profile',        val:`${profilePts}/25 pts`,   pts:profilePts   },
  ];

  const scoreColor = total >= 75 ? T.greenBright : total >= 50 ? T.goldLight : total >= 25 ? '#f97316' : '#ef4444';
  const scoreLabel = total >= 75 ? 'Strong Position' : total >= 50 ? 'On Track' : total >= 25 ? 'Getting Started' : 'Needs Attention';
  const r = 38, stroke = 7, circ = 2 * Math.PI * r;

  return (
    <ScoreBanner initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}>
      <ScoreRing>
        <svg width="96" height="96" style={{ transform:'rotate(-90deg)' }}>
          <circle cx="48" cy="48" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
          <motion.circle cx="48" cy="48" r={r} fill="none" stroke={scoreColor} strokeWidth={stroke}
            strokeDasharray={circ} strokeLinecap="round"
            initial={{ strokeDashoffset:circ }}
            animate={{ strokeDashoffset: circ * (1 - total/100) }}
            transition={{ duration:1.3, ease:'easeOut' }}
          />
        </svg>
        <ScoreCenter>
          <span style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'1.55rem', fontWeight:800, color:'#fff', lineHeight:1 }}>{total}</span>
          <span style={{ fontSize:'0.52rem', color:'rgba(255,255,255,0.4)', fontWeight:600, letterSpacing:'0.05em' }}>/ 100</span>
        </ScoreCenter>
      </ScoreRing>

      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:'0.62rem', color:'rgba(201,168,76,0.65)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:4 }}>Financial Health Score</div>
        <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'1.1rem', fontWeight:800, color:'#fff', marginBottom:12, display:'flex', alignItems:'center', gap:'0.5rem' }}>
          {scoreLabel}
          <span style={{ display:'inline-block', width:8, height:8, borderRadius:'50%', background:scoreColor }} />
        </div>
        <div style={{ display:'flex', gap:'1.25rem', flexWrap:'wrap' }}>
          {pillars.map(p => (
            <Pillar key={p.label}>
              <PillarLabel>{p.label}</PillarLabel>
              <PillarVal>{p.val}</PillarVal>
              <PillarBar><PillarFill initial={{ width:0 }} animate={{ width:`${Math.round((p.pts/25)*100)}%` }} transition={{ duration:1 }} /></PillarBar>
            </Pillar>
          ))}
        </div>
      </div>
    </ScoreBanner>
  );
}

/* ═══════════════════════════════════════════════════
   LOADING SKELETON
═══════════════════════════════════════════════════ */
function LoadingSkeleton() {
  return (
    <Page>
      <HeroBanner />
      <Wrap>
        <PHeader>
          <div style={{ width:118, height:118, borderRadius:'50%', background:'#e2e8f0', border:`4px solid ${T.white}`, flexShrink:0, marginTop:-60 }} />
          <div style={{ flex:1, paddingBottom:'0.3rem' }}>
            <Skel $h={30} $w="220px" $mb={12} $r={8} />
            <Skel $h={16} $w="160px" $mb={10} />
            <div style={{ display:'flex', gap:'0.5rem' }}>
              <Skel $h={24} $w="90px" $r={99} />
              <Skel $h={24} $w="80px" $r={99} />
              <Skel $h={24} $w="100px" $r={99} />
            </div>
          </div>
        </PHeader>
        <div style={{ height:100, background:`linear-gradient(135deg,${T.navy},${T.navyMid})`, borderRadius:18, margin:'1.4rem 0 1.2rem' }} />
        <StatsRow>{[0,1,2,3].map(i => <div key={i} style={{ height:76, background:T.white, borderRadius:14, border:`1px solid ${T.border}` }} />)}</StatsRow>
        <MainGrid>
          <div>{[120,110,100].map(h => <div key={h} style={{ height:h, background:T.white, borderRadius:16, marginBottom:'1.1rem', border:`1px solid ${T.border}` }} />)}</div>
          <div>{[180,220].map(h => <div key={h} style={{ height:h, background:T.white, borderRadius:16, marginBottom:'1.1rem', border:`1px solid ${T.border}` }} />)}</div>
        </MainGrid>
      </Wrap>
    </Page>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════ */
export default function ProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [profile,       setProfile]       = useState(null);
  const [goals,         setGoals]         = useState([]);
  const [plans,         setPlans]         = useState([]);
  const [learnedCount,  setLearnedCount]  = useState(0);
  const [sessions,      setSessions]      = useState([]);
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [memberSince,   setMemberSince]   = useState(null);
  const [loading,       setLoading]       = useState(true);

  const [editing,    setEditing]    = useState(false);
  const [editForm,   setEditForm]   = useState({});
  const [saving,     setSaving]     = useState(false);
  const [showColors, setShowColors] = useState(false);

  const [showAddGoal,    setShowAddGoal]    = useState(false);
  const [editGoal,       setEditGoal]       = useState(null);
  const [updateGoal,     setUpdateGoal]     = useState(null);
  const [showAddPlan,    setShowAddPlan]    = useState(false);
  const [expandedPlans,  setExpandedPlans]  = useState({});

  const [income,      setIncome]      = useState('');
  const [expenses,    setExpenses]    = useState('');
  const [assets,      setAssets]      = useState('');
  const [liabilities, setLiabilities] = useState('');

  useEffect(() => {
    if (!user) return;
    api.getProfile().then(d => {
      setProfile(d.profile || {});
      setGoals(d.goals || []);
      setPlans(d.plans || []);
      setLearnedCount(d.learnedCount || 0);
      setSessions(d.recentSessions || []);
      setBookmarkCount(d.bookmarkCount || 0);
      setMemberSince(d.memberSince || null);
      setIncome(d.profile?.monthly_income ? String(d.profile.monthly_income) : '');
      setExpenses(d.profile?.monthly_income && d.profile?.monthly_savings
        ? String(Math.max(0, d.profile.monthly_income - d.profile.monthly_savings)) : '');
      setAssets(d.profile?.net_worth ? String(Math.max(0, d.profile.net_worth)) : '');
    }).catch(()=>{}).finally(() => setLoading(false));
  }, [user]);

  const displayName  = profile?.display_name || user?.email?.split('@')[0] || 'Investor';
  const avatarColor  = profile?.avatar_color || T.navy;
  const riskMeta     = RISK_META[profile?.risk_tolerance || 'moderate'];
  const investMeta   = INVESTOR_META[profile?.investor_type || 'beginner'];

  const incomeNum    = parseFloat(income)      || 0;
  const expensesNum  = parseFloat(expenses)    || 0;
  const assetsNum    = parseFloat(assets)      || 0;
  const liabsNum     = parseFloat(liabilities) || 0;
  const savings      = Math.max(0, incomeNum - expensesNum);
  const savingsRate  = incomeNum > 0 ? Math.round((savings / incomeNum) * 100) : 0;
  const netWorth     = assetsNum - liabsNum;
  const activeGoals  = goals.filter(g => !g.completed);
  const completedGoals = goals.filter(g => g.completed);

  const saveSnapshot = useCallback(() => {
    if (!user) return;
    api.saveProfile({ monthly_income: incomeNum, monthly_savings: savings, net_worth: netWorth }).catch(()=>{});
  }, [incomeNum, savings, netWorth, user]);

  const startEdit = () => {
    setEditForm({
      display_name:     profile?.display_name    || '',
      tagline:          profile?.tagline         || '',
      bio:              profile?.bio             || '',
      location:         profile?.location        || '',
      risk_tolerance:   profile?.risk_tolerance  || 'moderate',
      investor_type:    profile?.investor_type   || 'beginner',
      investment_style: profile?.investment_style|| 'mixed',
      primary_focus:    profile?.primary_focus   || 'stocks',
      experience_years: profile?.experience_years|| 0,
    });
    setEditing(true);
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      await api.saveProfile({ ...editForm, monthly_income:incomeNum, monthly_savings:savings, net_worth:netWorth });
      setProfile(p => ({ ...p, ...editForm }));
      setEditing(false);
    } catch {/* silent */}
    setSaving(false);
  };

  const changeColor = async (color) => {
    setProfile(p => ({ ...p, avatar_color:color }));
    setShowColors(false);
    api.saveProfile({ avatar_color:color }).catch(()=>{});
  };

  const handleAddGoal  = useCallback(async (data) => {
    const res = await api.createGoal(data).catch(()=>null);
    if (res?.goal) { setGoals(g => [res.goal,...g]); setShowAddGoal(false); }
  }, []);

  const handleEditGoal = useCallback(async (data) => {
    if (!editGoal) return;
    await api.updateGoal(editGoal.id, { title:data.title, targetAmount:data.targetAmount, currentAmount:data.currentAmount, deadline:data.deadline||null }).catch(()=>{});
    setGoals(g => g.map(x => x.id===editGoal.id ? { ...x, title:data.title, target_amount:data.targetAmount, current_amount:data.currentAmount, deadline:data.deadline||null } : x));
    setEditGoal(null);
  }, [editGoal]);

  const handleUpdateAmount = useCallback(async (newAmt) => {
    if (!updateGoal) return;
    const done = newAmt >= updateGoal.target_amount;
    await api.updateGoal(updateGoal.id, { currentAmount:newAmt, completed:done }).catch(()=>{});
    setGoals(g => g.map(x => x.id===updateGoal.id ? { ...x, current_amount:newAmt, completed:done } : x));
    setUpdateGoal(null);
  }, [updateGoal]);

  const handleDeleteGoal  = useCallback(async (id) => { setGoals(g=>g.filter(x=>x.id!==id)); api.deleteGoal(id).catch(()=>{}); }, []);
  const handleAddPlan     = useCallback(async (data) => {
    const res = await api.createPlan(data).catch(()=>null);
    if (res?.plan) { setPlans(p=>[res.plan,...p]); setShowAddPlan(false); setExpandedPlans(e=>({...e,[res.plan.id]:true})); }
  }, []);

  const toggleStep   = useCallback(async (planId, stepIdx) => {
    setPlans(ps => ps.map(p => {
      if (p.id !== planId) return p;
      const steps = (typeof p.steps==='string' ? JSON.parse(p.steps) : p.steps).map((s,i)=>i===stepIdx?{...s,done:!s.done}:s);
      api.updatePlan(planId, { steps }).catch(()=>{});
      return { ...p, steps };
    }));
  }, []);

  const handleDeletePlan  = useCallback(async (id) => { setPlans(p=>p.filter(x=>x.id!==id)); api.deletePlan(id).catch(()=>{}); }, []);
  const toggleExpand = id => setExpandedPlans(e => ({ ...e, [id]:!e[id] }));

  /* ─ Auth gate ─ */
  if (!user) return (
    <AuthGate>
      <motion.div initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }}
        style={{ background:'rgba(15,32,53,0.9)', border:'1px solid rgba(201,168,76,0.2)', borderRadius:24, padding:'3rem 2.5rem', textAlign:'center', maxWidth:420, width:'100%', backdropFilter:'blur(12px)' }}>
        <div style={{ width:60, height:60, borderRadius:'50%', background:'rgba(201,168,76,0.1)', border:'1px solid rgba(201,168,76,0.2)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 1.25rem' }}>
          <FaLock style={{ color:T.gold, fontSize:'1.3rem' }} />
        </div>
        <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'1.5rem', fontWeight:800, color:'#fff', margin:'0 0 0.5rem', letterSpacing:'-0.02em' }}>Investment Profile</h2>
        <p style={{ color:'rgba(255,255,255,0.5)', fontSize:'0.88rem', margin:'0 0 1.75rem', lineHeight:1.6 }}>Sign in to access your personalised investment dashboard — goals, financial plans, net worth tracker and more.</p>
        <a href="/auth" style={{ display:'inline-flex', alignItems:'center', gap:'0.5rem', padding:'0.85rem 2rem', background:`linear-gradient(135deg,${T.navy},${T.navyMid})`, color:'#fff', fontWeight:700, borderRadius:11, textDecoration:'none', fontSize:'0.9rem', border:'1px solid rgba(201,168,76,0.25)', boxShadow:'0 4px 16px rgba(0,0,0,0.3)' }}>
          <FaSignInAlt /> Sign In to Continue
        </a>
      </motion.div>
    </AuthGate>
  );

  if (loading) return <LoadingSkeleton />;

  return (
    <Page>
      <HeroBanner>
        <HeroAccent />
        <HeroLabel>
          <FaBriefcase style={{ fontSize:'0.65rem' }} /> Investment Profile
        </HeroLabel>
      </HeroBanner>

      <Wrap>

        {/* ── Profile Header ── */}
        <PHeader>
          <AvatarWrap>
            <Avatar $color={avatarColor} $editable={editing}
              onClick={editing ? () => setShowColors(s=>!s) : undefined}
              initial={{ scale:0.85, opacity:0 }} animate={{ scale:1, opacity:1 }} transition={{ type:'spring', stiffness:260, damping:20 }}>
              {initials(profile?.display_name, user?.email)}
            </Avatar>
            {editing && (
              <AvatarBadge onClick={() => setShowColors(s=>!s)}>
                <FaEdit style={{ color:T.navy, fontSize:'0.6rem' }} />
              </AvatarBadge>
            )}
            <AnimatePresence>
              {showColors && (
                <ColorPicker initial={{ opacity:0, y:10, scale:0.96 }} animate={{ opacity:1, y:0, scale:1 }} exit={{ opacity:0, y:10, scale:0.96 }}>
                  {AVATAR_COLORS.map(c => <Swatch key={c} $c={c} $active={avatarColor===c} onClick={() => changeColor(c)} />)}
                </ColorPicker>
              )}
            </AnimatePresence>
          </AvatarWrap>

          <PInfo>
            <PName>{displayName}</PName>
            {profile?.tagline && <PTagline>{profile.tagline}</PTagline>}
            <PMeta>
              {profile?.location && <MetaItem><FaMapMarkerAlt style={{ color:T.inkFaint, fontSize:'0.7rem' }} />{profile.location}</MetaItem>}
              {memberSince && <MetaItem><FaCalendarAlt style={{ color:T.inkFaint, fontSize:'0.7rem' }} />Member since {fmtYear(memberSince)}</MetaItem>}
              {user?.email && <MetaItem>{user.email}</MetaItem>}
            </PMeta>
            <BadgeRow>
              <Badge $bg={riskMeta.bg} $color={riskMeta.color}>{riskMeta.label} Risk</Badge>
              <Badge $bg={investMeta.color+'10'} $color={investMeta.color}>{investMeta.dot} {investMeta.label}</Badge>
              {profile?.primary_focus && <Badge $bg="#f1f5f9" $color={T.inkMid}>📌 {profile.primary_focus}</Badge>}
              {profile?.experience_years > 0 && <GoldBadge>⏱ {profile.experience_years}y experience</GoldBadge>}
              {goals.length > 0 && <Badge $bg="rgba(21,128,61,0.07)" $color={T.green}>🎯 {goals.length} goal{goals.length!==1?'s':''}</Badge>}
            </BadgeRow>
          </PInfo>

          <EditBtn onClick={editing ? () => setEditing(false) : startEdit} whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}>
            {editing ? <><FaTimes /> Cancel</> : <><FaEdit /> Edit Profile</>}
          </EditBtn>
        </PHeader>

        {/* ── Health Score ── */}
        <HealthScore profile={profile} goals={goals} learnedCount={learnedCount} savingsRate={savingsRate} />

        {/* ── Stats Row ── */}
        <StatsRow>
          {[
            { icon:<FaGraduationCap />, color:T.green,   bg:'rgba(21,128,61,0.09)',    val:learnedCount,          lbl:'Terms Mastered' },
            { icon:<FaHistory />,       color:'#0284c7', bg:'rgba(2,132,199,0.09)',     val:sessions.length,       lbl:'AI Sessions'    },
            { icon:<FaHeart />,         color:'#f43f5e', bg:'rgba(244,63,94,0.09)',     val:bookmarkCount,         lbl:'Bookmarked'     },
            { icon:<FaTrophy />,        color:T.gold,    bg:'rgba(201,168,76,0.09)',    val:completedGoals.length, lbl:'Goals Achieved' },
          ].map((s,i) => (
            <StatCard key={i} initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.07 }}>
              <StatIco $color={s.color} $bg={s.bg}>{s.icon}</StatIco>
              <div><StatVal>{s.val}</StatVal><StatLbl>{s.lbl}</StatLbl></div>
            </StatCard>
          ))}
        </StatsRow>

        {/* ── Main Grid ── */}
        <MainGrid>

          {/* ── Left sidebar ── */}
          <div>

            {/* Profile detail / edit */}
            <Card>
              <CardHead>
                <CardTitle><FaUser style={{ color:T.gold }} /> Profile</CardTitle>
              </CardHead>
              <CardBody>
                {editing ? (
                  <>
                    <FG><FL>Display Name</FL><FI value={editForm.display_name} onChange={e=>setEditForm(f=>({...f,display_name:e.target.value}))} placeholder="Your name" /></FG>
                    <FG><FL>Headline</FL><FI value={editForm.tagline} onChange={e=>setEditForm(f=>({...f,tagline:e.target.value}))} placeholder="e.g. Long-term investor · FIRE journey" /></FG>
                    <FG><FL>Bio</FL><FT value={editForm.bio} onChange={e=>setEditForm(f=>({...f,bio:e.target.value}))} placeholder="Your investing story…" /></FG>
                    <FG><FL>Location</FL><FI value={editForm.location} onChange={e=>setEditForm(f=>({...f,location:e.target.value}))} placeholder="London, UK" /></FG>
                    <TwoCol>
                      <FG><FL>Risk Profile</FL><FS value={editForm.risk_tolerance} onChange={e=>setEditForm(f=>({...f,risk_tolerance:e.target.value}))}>{RISK_OPTIONS.map(r=><option key={r}>{r[0].toUpperCase()+r.slice(1)}</option>)}</FS></FG>
                      <FG><FL>Level</FL><FS value={editForm.investor_type} onChange={e=>setEditForm(f=>({...f,investor_type:e.target.value}))}>{INVESTOR_TYPES.map(r=><option key={r}>{r[0].toUpperCase()+r.slice(1)}</option>)}</FS></FG>
                      <FG><FL>Style</FL><FS value={editForm.investment_style} onChange={e=>setEditForm(f=>({...f,investment_style:e.target.value}))}>{STYLES.map(r=><option key={r}>{r[0].toUpperCase()+r.slice(1)}</option>)}</FS></FG>
                      <FG><FL>Focus</FL><FS value={editForm.primary_focus} onChange={e=>setEditForm(f=>({...f,primary_focus:e.target.value}))}>{FOCUS_OPTIONS.map(r=><option key={r}>{r[0].toUpperCase()+r.slice(1)}</option>)}</FS></FG>
                    </TwoCol>
                    <FG><FL>Years Investing</FL><FI type="number" min="0" value={editForm.experience_years} onChange={e=>setEditForm(f=>({...f,experience_years:parseInt(e.target.value)||0}))} /></FG>
                    <div style={{ display:'flex', gap:'0.6rem', justifyContent:'flex-end', paddingTop:'0.25rem' }}>
                      <CancelBtn onClick={() => setEditing(false)}>Cancel</CancelBtn>
                      <SaveBtn onClick={saveProfile} whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}>{saving?'Saving…':<><FaCheck />Save</>}</SaveBtn>
                    </div>
                  </>
                ) : (
                  <>
                    {profile?.bio && (
                      <p style={{ fontSize:'0.85rem', color:T.inkMid, lineHeight:1.7, margin:'0 0 0.85rem', paddingBottom:'0.85rem', borderBottom:`1px solid #f1f5f9` }}>{profile.bio}</p>
                    )}

                    {/* Risk gauge */}
                    <RiskGauge $bg={riskMeta.bg} $color={riskMeta.color}>
                      <RiskDot $color={riskMeta.color} />
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:'0.65rem', fontWeight:700, color:T.inkFaint, textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:4 }}>Risk Profile</div>
                        <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
                          <span style={{ fontSize:'0.88rem', fontWeight:800, color:riskMeta.color }}>{riskMeta.label}</span>
                          <RiskBar><RiskFill $color={riskMeta.color} initial={{ width:0 }} animate={{ width:riskMeta.barW }} transition={{ duration:1 }} /></RiskBar>
                        </div>
                      </div>
                    </RiskGauge>

                    {[
                      ['Level',      investMeta.label],
                      ['Style',      profile?.investment_style  || 'Mixed'],
                      ['Focus',      profile?.primary_focus     || 'Stocks'],
                      ['Experience', profile?.experience_years ? `${profile.experience_years} years` : '—'],
                    ].map(([k,v]) => (
                      <AR key={k}><AK>{k}</AK><AV>{v}</AV></AR>
                    ))}

                    {!profile?.bio && !profile?.display_name && (
                      <div style={{ textAlign:'center', padding:'0.75rem 0' }}>
                        <div style={{ fontSize:'0.82rem', color:T.inkFaint, marginBottom:8 }}>Complete your investor profile</div>
                        <button onClick={startEdit} style={{ background:'none', border:`1.5px solid ${T.gold}`, color:T.gold, borderRadius:9, padding:'0.45rem 1rem', cursor:'pointer', fontSize:'0.78rem', fontWeight:700, fontFamily:'inherit', transition:'background 0.12s' }}>Set up profile</button>
                      </div>
                    )}
                  </>
                )}
              </CardBody>
            </Card>

            {/* Monthly Cash Flow */}
            <Card>
              <CardHead><CardTitle><FaChartLine style={{ color:'#0284c7' }} /> Cash Flow</CardTitle></CardHead>
              <CardBody>
                <DataRow>
                  <DataLabel>Monthly Income</DataLabel>
                  <DataInput type="number" value={income} onChange={e=>setIncome(e.target.value)} onBlur={saveSnapshot} placeholder="0" />
                </DataRow>
                <DataRow>
                  <DataLabel>Monthly Expenses</DataLabel>
                  <DataInput type="number" value={expenses} onChange={e=>setExpenses(e.target.value)} onBlur={saveSnapshot} placeholder="0" />
                </DataRow>
                <DataRow>
                  <DataLabel>Monthly Savings</DataLabel>
                  <DataValue $accent={T.green}>£{fmt(savings)}</DataValue>
                </DataRow>
                <DataRow>
                  <DataLabel>Savings Rate</DataLabel>
                  <DataValue $accent={savingsRate>=20?T.green:savingsRate>=10?'#d97706':'#dc2626'}>{savingsRate}%</DataValue>
                </DataRow>
                {incomeNum > 0 && savings > 0 && (
                  <DataRow>
                    <DataLabel>Months to 3× EF</DataLabel>
                    <DataValue>{(incomeNum * 3 / savings).toFixed(1)} mo</DataValue>
                  </DataRow>
                )}
              </CardBody>
            </Card>

            {/* Net Worth */}
            <Card>
              <CardHead><CardTitle><FaBalanceScale style={{ color:T.gold }} /> Net Worth</CardTitle></CardHead>
              <CardBody>
                <DataRow>
                  <DataLabel>Total Assets</DataLabel>
                  <DataInput type="number" value={assets} onChange={e=>setAssets(e.target.value)} onBlur={saveSnapshot} placeholder="0" />
                </DataRow>
                <DataRow>
                  <DataLabel>Total Liabilities</DataLabel>
                  <DataInput type="number" value={liabilities} onChange={e=>setLiabilities(e.target.value)} onBlur={saveSnapshot} placeholder="0" />
                </DataRow>
                <div style={{ padding:'0.75rem 0 0.25rem' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
                    <span style={{ fontSize:'0.8rem', fontWeight:700, color:T.inkMid }}>Net Worth</span>
                    <span style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'1.15rem', fontWeight:800, color:netWorth>=0?T.green:'#dc2626' }}>
                      {netWorth<0?'-':''}£{fmt(Math.abs(netWorth))}
                    </span>
                  </div>
                  <div style={{ height:6, background:'#f1f5f9', borderRadius:99, overflow:'hidden' }}>
                    <motion.div style={{ height:'100%', background:netWorth>=0?T.green:'#dc2626', borderRadius:99 }}
                      initial={{ width:0 }} animate={{ width: assetsNum>0 ? `${Math.min(100,(assetsNum/(assetsNum+liabsNum+1))*100)}%` : '0%' }} transition={{ duration:0.9 }} />
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between', marginTop:5, fontSize:'0.67rem', color:T.inkFaint }}>
                    <span>Assets £{fmt(assetsNum)}</span><span>Liabilities £{fmt(liabsNum)}</span>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* AI Tutor sessions */}
            {sessions.length > 0 && (
              <Card>
                <CardHead>
                  <CardTitle><FaRobot style={{ color:'#6d5ae0' }} /> AI Tutor Activity</CardTitle>
                  <button onClick={() => navigate('/glossary')} style={{ background:'none', border:'none', cursor:'pointer', color:T.green, fontSize:'0.75rem', fontWeight:700 }}>Open →</button>
                </CardHead>
                <div>
                  {sessions.map(s => (
                    <SessionRow key={s.id} onClick={() => navigate('/glossary')}>
                      <FaBook style={{ color:T.border, flexShrink:0, fontSize:'0.65rem' }} />
                      <span style={{ flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{s.term_labels || s.terms}</span>
                      <span style={{ fontSize:'0.65rem', color:T.inkFaint, flexShrink:0 }}>{timeAgo(s.created_at)}</span>
                    </SessionRow>
                  ))}
                </div>
              </Card>
            )}

          </div>

          {/* ── Right main ── */}
          <div>

            {/* Investment Goals */}
            <Card>
              <CardHead>
                <CardTitle><FaBolt style={{ color:T.gold }} /> Investment Goals</CardTitle>
                <AddBtn onClick={() => setShowAddGoal(true)} style={{ width:'auto', padding:'0.38rem 0.9rem', border:`1.5px solid ${T.border}`, borderRadius:9 }} whileHover={{ scale:1.02 }}>
                  <FaPlus style={{ fontSize:'0.65rem' }} /> Add Goal
                </AddBtn>
              </CardHead>
              <CardBody $p="1rem 1.25rem">
                {goals.length === 0 ? (
                  <div style={{ textAlign:'center', padding:'2.5rem 1rem' }}>
                    <div style={{ fontSize:'2.5rem', marginBottom:'0.75rem' }}>🎯</div>
                    <div style={{ fontWeight:800, color:T.ink, marginBottom:'0.4rem', fontSize:'1rem' }}>No investment goals yet</div>
                    <div style={{ fontSize:'0.82rem', color:T.inkMute, marginBottom:'1.25rem', lineHeight:1.6 }}>Define clear financial targets — savings, investments, property, or debt elimination.</div>
                    <AddBtn onClick={() => setShowAddGoal(true)} style={{ maxWidth:240, margin:'0 auto' }} whileHover={{ scale:1.01 }}>
                      <FaPlus /> Set your first goal
                    </AddBtn>
                  </div>
                ) : (
                  <>
                    {activeGoals.map((g, i) => {
                      const p = pct(g.current_amount, g.target_amount);
                      const cat = GOAL_CATS.find(c => c.id === g.category) || GOAL_CATS[5];
                      return (
                        <GoalCard key={g.id} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.06 }}>
                          <GoalTop>
                            <span style={{ fontSize:'1.4rem', lineHeight:1, flexShrink:0 }}>{g.emoji||cat.emoji}</span>
                            <div style={{ flex:1, minWidth:0 }}>
                              <div style={{ fontSize:'0.92rem', fontWeight:800, color:T.ink, marginBottom:4 }}>{g.title}</div>
                              <div style={{ display:'flex', alignItems:'center', gap:'0.45rem', flexWrap:'wrap' }}>
                                <span style={{ fontSize:'0.68rem', fontWeight:700, background:cat.color+'12', color:cat.color, padding:'0.1rem 0.5rem', borderRadius:5 }}>{cat.label}</span>
                                {g.deadline && <span style={{ fontSize:'0.68rem', color:T.inkFaint, display:'flex', alignItems:'center', gap:3 }}><FaClock style={{ fontSize:'0.6rem' }} />{fmtDate(g.deadline)}</span>}
                                {p === 100 && <span style={{ fontSize:'0.68rem', color:T.green, fontWeight:700 }}>✓ Achieved</span>}
                              </div>
                            </div>
                            <div style={{ display:'flex', gap:'0.3rem', flexShrink:0 }}>
                              <ActionBtn onClick={() => setUpdateGoal(g)} title="Update progress"><FaArrowUp style={{ fontSize:'0.6rem' }} /></ActionBtn>
                              <ActionBtn onClick={() => setEditGoal(g)} title="Edit"><FaPencilAlt style={{ fontSize:'0.6rem' }} /></ActionBtn>
                              <ActionBtn $danger onClick={() => handleDeleteGoal(g.id)} title="Delete"><FaTrash style={{ fontSize:'0.6rem' }} /></ActionBtn>
                            </div>
                          </GoalTop>
                          <ProgressTrack>
                            <ProgressFill $color={g.color||cat.color} initial={{ width:0 }} animate={{ width:`${p}%` }} transition={{ duration:0.8, delay:i*0.05 }} />
                          </ProgressTrack>
                          <GoalAmts>
                            <span style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:800, color:g.color||cat.color }}>£{fmt(g.current_amount)}</span>
                            <span style={{ color:T.inkFaint }}>of £{fmt(g.target_amount)}</span>
                            <span style={{ fontWeight:800, color:p===100?T.green:T.ink }}>{p}%</span>
                          </GoalAmts>
                        </GoalCard>
                      );
                    })}

                    {completedGoals.length > 0 && (
                      <div style={{ marginTop:'0.75rem' }}>
                        <SectionDivider>
                          <DivLine />
                          <DivLabel>Achieved <FaCheckCircle style={{ color:T.green, verticalAlign:'middle', marginLeft:4 }} /></DivLabel>
                          <DivLine />
                        </SectionDivider>
                        {completedGoals.map(g => (
                          <GoalCard key={g.id} style={{ opacity:0.55, background:'#fafbfd' }}>
                            <GoalTop style={{ marginBottom:0 }}>
                              <span style={{ fontSize:'1.2rem' }}>{g.emoji}</span>
                              <span style={{ flex:1, fontSize:'0.88rem', fontWeight:700, color:T.inkMute, textDecoration:'line-through' }}>{g.title}</span>
                              <span style={{ fontSize:'0.72rem', fontWeight:700, color:T.green, display:'flex', alignItems:'center', gap:4 }}><FaCheckCircle /> £{fmt(g.target_amount)}</span>
                              <ActionBtn $danger onClick={() => handleDeleteGoal(g.id)}><FaTrash style={{ fontSize:'0.6rem' }} /></ActionBtn>
                            </GoalTop>
                          </GoalCard>
                        ))}
                      </div>
                    )}

                    <AddBtn onClick={() => setShowAddGoal(true)} style={{ marginTop:'0.6rem' }} whileHover={{ scale:1.005 }}>
                      <FaPlus /> Add another goal
                    </AddBtn>
                  </>
                )}
              </CardBody>
            </Card>

            {/* Action Plans */}
            <Card>
              <CardHead>
                <CardTitle><FaListUl style={{ color:T.navy }} /> Action Plans</CardTitle>
                <AddBtn onClick={() => setShowAddPlan(true)} style={{ width:'auto', padding:'0.38rem 0.9rem', border:`1.5px solid ${T.border}`, borderRadius:9 }} whileHover={{ scale:1.02 }}>
                  <FaPlus style={{ fontSize:'0.65rem' }} /> Add Plan
                </AddBtn>
              </CardHead>
              <CardBody $p="0.9rem 1.25rem">
                {plans.length === 0 ? (
                  <div style={{ textAlign:'center', padding:'2rem 1rem' }}>
                    <div style={{ fontSize:'2.5rem', marginBottom:'0.6rem' }}>📋</div>
                    <div style={{ fontWeight:800, color:T.ink, marginBottom:'0.4rem' }}>No action plans yet</div>
                    <div style={{ fontSize:'0.82rem', color:T.inkMute, marginBottom:'1.25rem', lineHeight:1.6 }}>Build step-by-step plans for your financial journey — from emergency funds to investment strategies.</div>
                    <AddBtn onClick={() => setShowAddPlan(true)} style={{ maxWidth:260, margin:'0 auto' }} whileHover={{ scale:1.01 }}>
                      <FaPlus /> Create your first plan
                    </AddBtn>
                  </div>
                ) : (
                  <>
                    {plans.map((plan, pi) => {
                      const steps    = typeof plan.steps === 'string' ? JSON.parse(plan.steps||'[]') : (plan.steps||[]);
                      const doneCount = steps.filter(s=>s.done).length;
                      const planPct  = steps.length > 0 ? Math.round((doneCount/steps.length)*100) : 0;
                      const expanded = expandedPlans[plan.id];
                      return (
                        <PlanCard key={plan.id} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:pi*0.05 }}>
                          <PlanHead onClick={() => toggleExpand(plan.id)}>
                            <PlanEmoji>{plan.emoji}</PlanEmoji>
                            <div style={{ flex:1, minWidth:0 }}>
                              <PlanTitle>{plan.title}</PlanTitle>
                              <PlanMeta>{doneCount}/{steps.length} steps · {planPct}% complete</PlanMeta>
                            </div>
                            <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
                              {planPct > 0 && (
                                <span style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'0.82rem', fontWeight:800, color:planPct===100?T.green:T.gold }}>{planPct}%</span>
                              )}
                              <ActionBtn $danger onClick={e=>{e.stopPropagation();handleDeletePlan(plan.id);}}><FaTrash style={{ fontSize:'0.6rem' }} /></ActionBtn>
                              {expanded ? <FaChevronUp style={{ color:T.inkFaint, fontSize:'0.7rem' }} /> : <FaChevronDown style={{ color:T.inkFaint, fontSize:'0.7rem' }} />}
                            </div>
                          </PlanHead>

                          <AnimatePresence>
                            {expanded && (
                              <PlanBody initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }} exit={{ height:0, opacity:0 }} transition={{ duration:0.2 }}>
                                {plan.description && <p style={{ fontSize:'0.82rem', color:T.inkMute, margin:'0 0 0.8rem', lineHeight:1.65 }}>{plan.description}</p>}
                                <ProgressTrack><ProgressFill $color={T.navy} initial={{ width:0 }} animate={{ width:`${planPct}%` }} transition={{ duration:0.7 }} /></ProgressTrack>
                                <div style={{ marginTop:'0.6rem' }}>
                                  {steps.map((s, si) => (
                                    <StepRow key={si}>
                                      <StepCheck $done={s.done} onClick={() => toggleStep(plan.id, si)}>
                                        {s.done && <FaCheck style={{ color:'#fff', fontSize:'0.55rem' }} />}
                                      </StepCheck>
                                      <StepText $done={s.done}>{s.text}</StepText>
                                    </StepRow>
                                  ))}
                                </div>
                                {planPct === 100 && (
                                  <div style={{ marginTop:'0.85rem', background:'rgba(21,128,61,0.05)', border:'1px solid rgba(21,128,61,0.18)', borderRadius:10, padding:'0.65rem 0.9rem', fontSize:'0.82rem', color:T.green, fontWeight:700, display:'flex', alignItems:'center', gap:6 }}>
                                    <FaTrophy /> Plan complete — outstanding execution.
                                  </div>
                                )}
                              </PlanBody>
                            )}
                          </AnimatePresence>
                        </PlanCard>
                      );
                    })}
                    <AddBtn onClick={() => setShowAddPlan(true)} style={{ marginTop:'0.3rem' }} whileHover={{ scale:1.005 }}>
                      <FaPlus /> Add another plan
                    </AddBtn>
                  </>
                )}
              </CardBody>
            </Card>

            {/* Learning progress */}
            <Card>
              <CardHead>
                <CardTitle><FaGraduationCap style={{ color:T.green }} /> Learning Progress</CardTitle>
                <button onClick={() => navigate('/glossary')} style={{ background:'none', border:'none', cursor:'pointer', color:T.green, fontSize:'0.75rem', fontWeight:700 }}>AI Tutor →</button>
              </CardHead>
              <CardBody $p="1.1rem 1.25rem">
                <div style={{ display:'flex', gap:'2rem', marginBottom:'1.2rem', flexWrap:'wrap' }}>
                  {[
                    { label:'Terms Mastered', val:learnedCount,   color:T.green   },
                    { label:'AI Sessions',    val:sessions.length, color:'#0284c7' },
                    { label:'Bookmarked',     val:bookmarkCount,   color:'#f43f5e' },
                  ].map(s => (
                    <div key={s.label}>
                      <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'1.55rem', fontWeight:800, color:s.color }}>{s.val}</div>
                      <div style={{ fontSize:'0.68rem', color:T.inkFaint, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.05em' }}>{s.label}</div>
                    </div>
                  ))}
                </div>
                <div style={{ marginBottom:'0.4rem', display:'flex', justifyContent:'space-between', fontSize:'0.74rem', color:T.inkMute }}>
                  <span style={{ fontWeight:600 }}>Mastery Progress</span>
                  <span>{learnedCount}/130 terms</span>
                </div>
                <ProgressTrack style={{ height:8 }}>
                  <ProgressFill $color={T.green} initial={{ width:0 }} animate={{ width:`${Math.round((learnedCount/130)*100)}%` }} transition={{ duration:1.1 }} />
                </ProgressTrack>
                <div style={{ fontSize:'0.72rem', color:T.inkFaint, textAlign:'right', marginTop:5 }}>{Math.round((learnedCount/130)*100)}% complete</div>
              </CardBody>
            </Card>

          </div>
        </MainGrid>
      </Wrap>

      {/* ── Modals ── */}
      <AnimatePresence>
        {showAddGoal && <GoalModal onSave={handleAddGoal} onClose={() => setShowAddGoal(false)} />}
        {editGoal    && <GoalModal initial={editGoal} onSave={handleEditGoal} onClose={() => setEditGoal(null)} />}
        {updateGoal  && <UpdateAmountModal goal={updateGoal} onSave={handleUpdateAmount} onClose={() => setUpdateGoal(null)} />}
        {showAddPlan && <PlanModal onSave={handleAddPlan} onClose={() => setShowAddPlan(false)} />}
      </AnimatePresence>
    </Page>
  );
}
