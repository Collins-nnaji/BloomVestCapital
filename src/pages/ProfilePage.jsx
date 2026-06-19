import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaUser, FaMapMarkerAlt, FaCalendarAlt, FaEdit, FaCheck, FaTimes,
  FaChartLine, FaGraduationCap, FaHeart, FaBolt, FaFire,
  FaPlus, FaTrash, FaPencilAlt, FaCheckCircle, FaClock,
  FaSignInAlt, FaPiggyBank, FaHome, FaBriefcase, FaCoins,
  FaRobot, FaHistory, FaBook, FaArrowUp, FaTrophy,
  FaChevronDown, FaChevronUp,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { api } from '../api';
import { presetReturnFor, monthlyNeeded, yearsUntil } from '../utils/planning';

/* ═══════════════════════════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════════════════════════ */
const RISK_OPTIONS   = ['conservative', 'moderate', 'aggressive'];
const INVESTOR_TYPES = ['beginner', 'intermediate', 'advanced'];
const STYLES         = ['passive', 'active', 'mixed'];
const FOCUS_OPTIONS  = ['stocks', 'bonds', 'crypto', 'etfs', 'real-estate', 'mixed'];

const GOAL_CATS = [
  { id: 'savings',    label: 'Savings',       emoji: '💰', color: '#15803d' },
  { id: 'investment', label: 'Investment',     emoji: '📈', color: '#0284c7' },
  { id: 'debt',       label: 'Debt Payoff',    emoji: '💳', color: '#dc2626' },
  { id: 'property',   label: 'Property',       emoji: '🏠', color: '#7c3aed' },
  { id: 'income',     label: 'Income Goal',    emoji: '💼', color: '#d97706' },
  { id: 'custom',     label: 'Custom',         emoji: '🎯', color: '#6b7280' },
];

const RISK_LABELS = {
  conservative: { label: 'Conservative', color: '#0284c7', bg: 'rgba(2,132,199,0.08)' },
  moderate:     { label: 'Moderate',     color: '#d97706', bg: 'rgba(217,119,6,0.08)' },
  aggressive:   { label: 'Aggressive',   color: '#dc2626', bg: 'rgba(220,38,38,0.08)' },
};
const INVESTOR_LABELS = {
  beginner:     { label: 'Beginner',     dot: '🟢' },
  intermediate: { label: 'Intermediate', dot: '🟡' },
  advanced:     { label: 'Advanced',     dot: '🔴' },
};

function fmt(n) {
  if (!n && n !== 0) return '—';
  return Number(n).toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}
function fmtDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}
function timeAgo(iso) {
  if (!iso) return '';
  const s = Math.floor((Date.now() - new Date(iso)) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s/60)}m ago`;
  if (s < 86400) return `${Math.floor(s/3600)}h ago`;
  return `${Math.floor(s/86400)}d ago`;
}
function pct(cur, tgt) {
  if (!tgt) return 0;
  return Math.min(100, Math.round((cur / tgt) * 100));
}
function initials(name, email) {
  if (name) return name.slice(0, 2).toUpperCase();
  if (email) return email.slice(0, 2).toUpperCase();
  return 'BV';
}

/* ═══════════════════════════════════════════════════════════════
   STYLED COMPONENTS
═══════════════════════════════════════════════════════════════ */
const shimmer = keyframes`
  0%   { background-position: -300% 0 }
  100% { background-position:  300% 0 }
`;

const Page = styled.div`
  min-height: 100vh;
  background: #e8ecf2;
  padding-top: 64px;
`;

/* ── Hero / Cover ── */
const CoverArea = styled.div`
  height: 200px;
  background: linear-gradient(135deg, #0a0f1a 0%, #0f1f14 55%, #051a10 100%);
  position: relative;
  overflow: hidden;
  @media (max-width: 640px) { height: 140px; }
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none'%3E%3Cg fill='%2315803d' fill-opacity='0.06'%3E%3Cpath d='M40 40 L0 0 L80 0 Z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    background-size: 80px 80px;
  }
  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 40px;
    background: linear-gradient(to bottom, transparent, #f4f6f8);
  }
`;

const ProfileWrapper = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 1.5rem 4rem;
  @media (max-width: 640px) { padding: 0 1rem 2rem; }
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 1.25rem;
  margin-top: -56px;
  position: relative;
  z-index: 2;
  flex-wrap: wrap;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
  @media (max-width: 640px) { margin-top: -44px; gap: 0.85rem; }
`;

const Avatar = styled(motion.div)`
  width: 104px;
  height: 104px;
  border-radius: 50%;
  background: ${p => p.$color || '#15803d'};
  border: 4px solid #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 2rem;
  font-weight: 800;
  color: #fff;
  flex-shrink: 0;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  @media (max-width: 640px) { width: 84px; height: 84px; font-size: 1.5rem; }
`;

const ProfileInfo = styled.div`
  flex: 1;
  padding-bottom: 0.25rem;
  min-width: 0;
`;

const ProfileName = styled.h1`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.6rem;
  font-weight: 800;
  color: #0a0f1a;
  margin: 0 0 0.2rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  @media (max-width: 640px) { font-size: 1.3rem; }
`;

const ProfileTagline = styled.p`
  font-size: 0.9rem;
  color: #4b5563;
  margin: 0 0 0.45rem;
`;

const ProfileMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
  align-items: center;
`;

const MetaChip = styled.span`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.78rem;
  color: #6b7280;
`;

const BadgeRow = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 0.45rem;
`;

const Badge = styled.span`
  font-size: 0.72rem;
  font-weight: 700;
  padding: 0.22rem 0.65rem;
  border-radius: 99px;
  background: ${p => p.$bg};
  color: ${p => p.$color};
  border: 1px solid ${p => p.$color}30;
`;

const EditProfileBtn = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.6rem 1.1rem;
  border: 1.5px solid #d1d5db;
  border-radius: 10px;
  background: #fff;
  font-size: 0.82rem;
  font-weight: 700;
  color: #374151;
  cursor: pointer;
  margin-left: auto;
  align-self: flex-end;
  margin-bottom: 0.25rem;
  transition: border-color 0.15s;
  &:hover { border-color: #15803d; color: #15803d; }
`;

/* ── Stats Row ── */
const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.85rem;
  margin: 1.25rem 0;
  @media (max-width: 640px) { grid-template-columns: repeat(2, 1fr); }
`;

const StatCard = styled(motion.div)`
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 1rem 1.1rem;
  display: flex;
  align-items: center;
  gap: 0.85rem;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
`;

const StatIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: ${p => p.$bg};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.05rem;
  color: ${p => p.$color};
  flex-shrink: 0;
`;

const StatVal = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.35rem;
  font-weight: 800;
  color: #0a0f14;
  line-height: 1;
`;

const StatLbl = styled.div`
  font-size: 0.72rem;
  color: #6b7280;
  font-weight: 600;
  margin-top: 3px;
`;

/* ── Main Grid ── */
const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 1rem;
  align-items: start;
  @media (max-width: 900px) { grid-template-columns: 1fr; }
`;

/* ── Cards ── */
const Card = styled.div`
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  margin-bottom: 1rem;
`;

const CardHead = styled.div`
  padding: 0.9rem 1.1rem;
  border-bottom: 1px solid #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CardTitle = styled.div`
  font-weight: 800;
  font-size: 0.88rem;
  color: #0a0f14;
  display: flex;
  align-items: center;
  gap: 0.45rem;
`;

const CardBody = styled.div`
  padding: ${p => p.$p || '1rem 1.1rem'};
`;

/* ── Edit form ── */
const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.28rem;
  margin-bottom: 0.75rem;
`;

const FieldLabel = styled.label`
  font-size: 0.7rem;
  font-weight: 700;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const FieldInput = styled.input`
  padding: 0.55rem 0.75rem;
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.85rem;
  color: #0a0f14;
  background: #fff;
  font-family: inherit;
  width: 100%;
  box-sizing: border-box;
  &:focus { outline: none; border-color: #15803d; }
`;

const FieldTextarea = styled.textarea`
  padding: 0.55rem 0.75rem;
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.85rem;
  color: #0a0f14;
  background: #fff;
  font-family: inherit;
  width: 100%;
  box-sizing: border-box;
  resize: vertical;
  min-height: 72px;
  &:focus { outline: none; border-color: #15803d; }
`;

const FieldSelect = styled.select`
  padding: 0.55rem 0.75rem;
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.85rem;
  color: #0a0f14;
  background: #fff;
  font-family: inherit;
  width: 100%;
  box-sizing: border-box;
  &:focus { outline: none; border-color: #15803d; }
`;

const TwoCol = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.65rem;
  @media (max-width: 640px) { grid-template-columns: 1fr; }
`;

const SaveBtn = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 9px;
  background: #15803d;
  color: #fff;
  font-size: 0.84rem;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
`;

const CancelBtn = styled.button`
  padding: 0.6rem 1.1rem;
  border: 1.5px solid #e5e7eb;
  border-radius: 9px;
  background: #fff;
  font-size: 0.84rem;
  font-weight: 600;
  color: #6b7280;
  cursor: pointer;
  font-family: inherit;
  &:hover { color: #dc2626; border-color: #dc2626; }
`;

/* ── Goals ── */
const GoalCard = styled(motion.div)`
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 1rem 1.1rem;
  position: relative;
  overflow: hidden;
  margin-bottom: 0.75rem;
  box-shadow: 0 1px 4px rgba(0,0,0,0.03);
`;

const GoalTop = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.65rem;
  margin-bottom: 0.75rem;
`;

const GoalEmoji = styled.div`
  font-size: 1.4rem;
  line-height: 1;
  flex-shrink: 0;
`;

const GoalTitle = styled.div`
  font-size: 0.9rem;
  font-weight: 800;
  color: #0a0f14;
  margin-bottom: 0.2rem;
  flex: 1;
`;

const GoalMeta = styled.div`
  font-size: 0.72rem;
  color: #9ca3af;
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;

const ProgressTrack = styled.div`
  height: 7px;
  background: #f3f4f6;
  border-radius: 99px;
  overflow: hidden;
  margin-bottom: 0.55rem;
`;

const ProgressFill = styled(motion.div)`
  height: 100%;
  border-radius: 99px;
  background: ${p => p.$color || '#15803d'};
`;

const GoalAmounts = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.78rem;
`;

const GoalActions = styled.div`
  display: flex;
  gap: 0.35rem;
  margin-left: auto;
`;

const GoalActionBtn = styled.button`
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  border: 1.5px solid #e5e7eb;
  background: #fff;
  font-size: 0.68rem;
  cursor: pointer;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 0.2rem;
  font-weight: 600;
  &:hover { border-color: ${p => p.$danger ? '#dc2626' : '#15803d'}; color: ${p => p.$danger ? '#dc2626' : '#15803d'}; }
`;

const CompletedBadge = styled.span`
  font-size: 0.68rem;
  font-weight: 700;
  color: #15803d;
  background: rgba(21,128,61,0.08);
  border: 1px solid rgba(21,128,61,0.2);
  border-radius: 6px;
  padding: 0.18rem 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const AddGoalBtn = styled(motion.button)`
  width: 100%;
  padding: 0.75rem;
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  background: transparent;
  color: #6b7280;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  font-family: inherit;
  transition: border-color 0.15s, color 0.15s;
  &:hover { border-color: #15803d; color: #15803d; }
`;

/* ── Goal Modal ── */
const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  backdrop-filter: blur(3px);
  z-index: 1300;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  @media (max-width: 640px) { padding: 0.75rem; align-items: flex-end; }
`;

const ModalCard = styled(motion.div)`
  background: #fff;
  border-radius: 18px;
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 24px 60px rgba(0,0,0,0.2);
`;

const ModalHead = styled.div`
  padding: 1.1rem 1.25rem;
  border-bottom: 1px solid #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ModalTitle = styled.div`
  font-weight: 800;
  font-size: 1rem;
  color: #0a0f14;
`;

const ModalBody = styled.div`
  padding: 1.25rem;
  @media (max-width: 640px) { padding: 0.95rem; }
`;

const CatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  margin-bottom: 0.75rem;
`;

const CatBtn = styled.button`
  padding: 0.6rem 0.5rem;
  border-radius: 9px;
  border: 1.5px solid ${p => p.$active ? p.$color : '#e5e7eb'};
  background: ${p => p.$active ? p.$color + '12' : '#fff'};
  color: ${p => p.$active ? p.$color : '#6b7280'};
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
  font-family: inherit;
  transition: all 0.12s;
`;

/* ── About row ── */
const AboutRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  padding: 0.6rem 0;
  border-bottom: 1px solid #f9fafb;
  &:last-child { border-bottom: none; }
`;

const AboutKey = styled.div`
  font-size: 0.72rem;
  font-weight: 700;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  width: 90px;
  flex-shrink: 0;
  padding-top: 2px;
`;

const AboutVal = styled.div`
  font-size: 0.84rem;
  color: #0a0f14;
  font-weight: 600;
  flex: 1;
`;

/* ── Session item ── */
const SessionItem = styled.button`
  width: 100%;
  text-align: left;
  padding: 0.55rem 1.1rem;
  border: none;
  background: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.55rem;
  font-size: 0.79rem;
  font-weight: 600;
  color: #374151;
  border-bottom: 1px solid #f9fafb;
  transition: background 0.1s;
  &:hover { background: #f9fafb; }
  &:last-child { border-bottom: none; }
`;

/* ── Auth gate ── */
const AuthGate = styled.div`
  min-height: 100vh;
  background: #0a0f1a;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;
const AuthGateCard = styled(motion.div)`
  background: #0f1a0f;
  border: 1px solid rgba(74,222,128,0.2);
  border-radius: 24px;
  padding: 3rem 2.5rem;
  text-align: center;
  max-width: 400px;
  width: 100%;
`;

/* ── Snapshot widget ── */
const SnapRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.6rem 0;
  border-bottom: 1px solid #f3f4f6;
  &:last-child { border-bottom: none; }
`;

const SnapLabel = styled.div`
  font-size: 0.78rem;
  color: #6b7280;
  font-weight: 600;
  flex: 1;
`;

const SnapValue = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.92rem;
  font-weight: 800;
  color: ${p => p.$accent || '#0a0f14'};
`;

const SnapInput = styled.input`
  width: 110px;
  padding: 0.32rem 0.55rem;
  border: 1.5px solid #e5e7eb;
  border-radius: 7px;
  font-size: 0.82rem;
  text-align: right;
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  color: #0a0f14;
  &:focus { outline: none; border-color: #15803d; }
`;

/* ═══════════════════════════════════════════════════════════════
   GOAL MODAL
═══════════════════════════════════════════════════════════════ */
function GoalModal({ initial, onSave, onClose }) {
  const isEdit = !!initial;
  const [form, setForm] = useState({
    title: initial?.title || '',
    category: initial?.category || 'savings',
    emoji: initial?.emoji || '🎯',
    targetAmount: initial?.target_amount || '',
    currentAmount: initial?.current_amount || 0,
    deadline: initial?.deadline ? initial.deadline.slice(0, 10) : '',
  });

  const cat = GOAL_CATS.find(c => c.id === form.category) || GOAL_CATS[0];
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = () => {
    if (!form.title || !form.targetAmount) return;
    onSave({
      ...form,
      emoji: cat.emoji,
      color: cat.color,
      targetAmount: parseFloat(form.targetAmount) || 0,
      currentAmount: parseFloat(form.currentAmount) || 0,
    });
  };

  return (
    <Overlay
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <ModalCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        onClick={e => e.stopPropagation()}
      >
        <ModalHead>
          <ModalTitle>{isEdit ? 'Edit Goal' : 'Add Financial Goal'}</ModalTitle>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: '1.1rem' }}><FaTimes /></button>
        </ModalHead>
        <ModalBody>
          <FieldGroup>
            <FieldLabel>Category</FieldLabel>
            <CatGrid>
              {GOAL_CATS.map(c => (
                <CatBtn key={c.id} $active={form.category === c.id} $color={c.color} onClick={() => set('category', c.id)}>
                  <span style={{ fontSize: '1.3rem' }}>{c.emoji}</span>
                  {c.label}
                </CatBtn>
              ))}
            </CatGrid>
          </FieldGroup>
          <FieldGroup>
            <FieldLabel>Goal Title</FieldLabel>
            <FieldInput placeholder="e.g. Emergency Fund, Buy TSLA shares…" value={form.title} onChange={e => set('title', e.target.value)} />
          </FieldGroup>
          <TwoCol>
            <FieldGroup>
              <FieldLabel>Target Amount (£)</FieldLabel>
              <FieldInput type="number" placeholder="10000" value={form.targetAmount} onChange={e => set('targetAmount', e.target.value)} />
            </FieldGroup>
            <FieldGroup>
              <FieldLabel>Current Amount (£)</FieldLabel>
              <FieldInput type="number" placeholder="0" value={form.currentAmount} onChange={e => set('currentAmount', e.target.value)} />
            </FieldGroup>
          </TwoCol>
          <FieldGroup>
            <FieldLabel>Target Date (optional)</FieldLabel>
            <FieldInput type="date" value={form.deadline} onChange={e => set('deadline', e.target.value)} />
          </FieldGroup>
          <div style={{ display: 'flex', gap: '0.65rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <CancelBtn onClick={onClose}>Cancel</CancelBtn>
            <SaveBtn onClick={handleSave} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
              <FaCheck /> {isEdit ? 'Save Changes' : 'Add Goal'}
            </SaveBtn>
          </div>
        </ModalBody>
      </ModalCard>
    </Overlay>
  );
}

/* ═══════════════════════════════════════════════════════════════
   UPDATE AMOUNT INLINE
═══════════════════════════════════════════════════════════════ */
function UpdateAmountModal({ goal, onSave, onClose }) {
  const [val, setVal] = useState(String(goal.current_amount || 0));
  return (
    <Overlay initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <ModalCard initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }} onClick={e => e.stopPropagation()}
        style={{ maxWidth: 340 }}>
        <ModalHead>
          <ModalTitle>{goal.emoji} Update Progress</ModalTitle>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}><FaTimes /></button>
        </ModalHead>
        <ModalBody>
          <FieldGroup>
            <FieldLabel>Current amount saved (£)</FieldLabel>
            <FieldInput type="number" value={val} onChange={e => setVal(e.target.value)} autoFocus />
          </FieldGroup>
          <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'flex-end' }}>
            <CancelBtn onClick={onClose}>Cancel</CancelBtn>
            <SaveBtn onClick={() => onSave(parseFloat(val) || 0)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
              <FaCheck /> Update
            </SaveBtn>
          </div>
        </ModalBody>
      </ModalCard>
    </Overlay>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════ */
export default function ProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [profile,        setProfile]        = useState(null);
  const [goals,          setGoals]          = useState([]);
  const [learnedCount,   setLearnedCount]   = useState(0);
  const [sessions,       setSessions]       = useState([]);
  const [bookmarkCount,  setBookmarkCount]  = useState(0);
  const [memberSince,    setMemberSince]    = useState(null);
  const [loading,        setLoading]        = useState(true);

  const [editing,        setEditing]        = useState(false);
  const [editForm,       setEditForm]       = useState({});
  const [saving,         setSaving]         = useState(false);

  const [showAddGoal,    setShowAddGoal]    = useState(false);
  const [editGoal,       setEditGoal]       = useState(null);
  const [updateGoal,     setUpdateGoal]     = useState(null);

  // snapshot (local edit of income/expenses/net worth)
  const [income,   setIncome]   = useState('');
  const [expenses, setExpenses] = useState('');
  const [netWorth, setNetWorth] = useState('');

  /* Load data */
  useEffect(() => {
    if (!user) return;
    Promise.allSettled([
      api.getProfile(),
      api.getGlossaryBookmarks(),
    ]).then(([profRes, bkRes]) => {
      if (profRes.status === 'fulfilled') {
        const d = profRes.value;
        setProfile(d.profile || {});
        setGoals(d.goals || []);
        setLearnedCount(d.learnedCount || 0);
        setSessions(d.recentSessions || []);
        setMemberSince(d.memberSince || null);
        setIncome(d.profile?.monthly_income ? String(d.profile.monthly_income) : '');
        setExpenses(d.profile?.monthly_savings ? String(Math.max(0, (d.profile.monthly_income || 0) - (d.profile.monthly_savings || 0))) : '');
        setNetWorth(d.profile?.net_worth ? String(d.profile.net_worth) : '');
      }
      if (bkRes.status === 'fulfilled') {
        setBookmarkCount((bkRes.value.bookmarks || []).length);
      }
    }).finally(() => setLoading(false));
  }, [user]);

  const displayName = profile?.display_name || user?.email?.split('@')[0] || 'You';
  const avatarColor = profile?.avatar_color || '#15803d';
  const riskMeta    = RISK_LABELS[profile?.risk_tolerance || 'moderate'];
  const investMeta  = INVESTOR_LABELS[profile?.investor_type || 'beginner'];

  const completedGoals = goals.filter(g => g.completed).length;
  const activeGoals    = goals.filter(g => !g.completed);
  const doneGoals      = goals.filter(g => g.completed);

  const incomeNum   = parseFloat(income)   || 0;
  const expensesNum = parseFloat(expenses) || 0;
  const savings     = Math.max(0, incomeNum - expensesNum);
  const savingsRate = incomeNum > 0 ? Math.round((savings / incomeNum) * 100) : 0;
  const efMonths    = incomeNum > 0 ? (savings > 0 ? (incomeNum * 3 / savings).toFixed(1) : '∞') : '—';

  // assumed annual return from the profile's risk level — drives goal projections
  const planReturn = presetReturnFor(profile?.risk_tolerance);

  /* Edit profile */
  const startEdit = () => {
    setEditForm({
      display_name: profile?.display_name || '',
      tagline: profile?.tagline || '',
      bio: profile?.bio || '',
      location: profile?.location || '',
      risk_tolerance: profile?.risk_tolerance || 'moderate',
      investor_type: profile?.investor_type || 'beginner',
      investment_style: profile?.investment_style || 'mixed',
      primary_focus: profile?.primary_focus || 'stocks',
      experience_years: profile?.experience_years || 0,
    });
    setEditing(true);
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await api.saveProfile({
        ...editForm,
        monthly_income: incomeNum || undefined,
        monthly_savings: savings || undefined,
      });
      setProfile(p => ({ ...p, ...editForm, monthly_income: incomeNum, monthly_savings: savings }));
      setEditing(false);
    } catch { /* silent */ }
    setSaving(false);
  };

  /* Goals */
  const handleAddGoal = useCallback(async (data) => {
    try {
      const res = await api.createGoal(data);
      setGoals(g => [res.goal, ...g]);
      setShowAddGoal(false);
    } catch { /* silent */ }
  }, []);

  const handleEditGoal = useCallback(async (data) => {
    if (!editGoal) return;
    try {
      await api.updateGoal(editGoal.id, {
        title: data.title,
        targetAmount: data.targetAmount,
        currentAmount: data.currentAmount,
        deadline: data.deadline || null,
      });
      setGoals(g => g.map(x => x.id === editGoal.id ? { ...x, title: data.title, target_amount: data.targetAmount, current_amount: data.currentAmount, deadline: data.deadline || null } : x));
      setEditGoal(null);
    } catch { /* silent */ }
  }, [editGoal]);

  const handleUpdateAmount = useCallback(async (newAmt) => {
    if (!updateGoal) return;
    const completed = newAmt >= updateGoal.target_amount;
    try {
      await api.updateGoal(updateGoal.id, { currentAmount: newAmt, completed });
      setGoals(g => g.map(x => x.id === updateGoal.id ? { ...x, current_amount: newAmt, completed } : x));
      setUpdateGoal(null);
    } catch { /* silent */ }
  }, [updateGoal]);

  const handleDeleteGoal = useCallback(async (id) => {
    setGoals(g => g.filter(x => x.id !== id));
    try { await api.deleteGoal(id); } catch { /* silent */ }
  }, []);

  /* Auth gate */
  if (!user) {
    return (
      <AuthGate>
        <AuthGateCard initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔒</div>
          <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.4rem', fontWeight: 800, color: '#fff', margin: '0 0 0.5rem' }}>Sign in to view your profile</h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.88rem', margin: '0 0 1.5rem' }}>Your personal finance dashboard, goals, and learning progress.</p>
          <a href="/auth" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.8rem 1.75rem', background: 'linear-gradient(135deg,#15803d,#166534)', color: '#fff', fontWeight: 700, borderRadius: 10, textDecoration: 'none', fontSize: '0.9rem' }}>
            <FaSignInAlt /> Sign in
          </a>
        </AuthGateCard>
      </AuthGate>
    );
  }

  return (
    <Page>
      <CoverArea />
      <ProfileWrapper>
        {/* ── Profile Header ── */}
        <ProfileHeader>
          <Avatar $color={avatarColor} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            {initials(profile?.display_name, user?.email)}
          </Avatar>
          <ProfileInfo>
            <ProfileName>{displayName}</ProfileName>
            {profile?.tagline && <ProfileTagline>{profile.tagline}</ProfileTagline>}
            <ProfileMeta>
              {profile?.location && <MetaChip><FaMapMarkerAlt style={{ color: '#9ca3af', fontSize: '0.7rem' }} /> {profile.location}</MetaChip>}
              {memberSince && <MetaChip><FaCalendarAlt style={{ color: '#9ca3af', fontSize: '0.7rem' }} /> Joined {fmtDate(memberSince)}</MetaChip>}
            </ProfileMeta>
            <BadgeRow>
              <Badge $bg={riskMeta.bg} $color={riskMeta.color}>{riskMeta.label} Risk</Badge>
              <Badge $bg="rgba(21,128,61,0.07)" $color="#15803d">{investMeta.dot} {investMeta.label}</Badge>
              {profile?.primary_focus && <Badge $bg="#f3f4f6" $color="#374151">📌 {profile.primary_focus}</Badge>}
            </BadgeRow>
          </ProfileInfo>
          <EditProfileBtn onClick={editing ? () => setEditing(false) : startEdit} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
            {editing ? <><FaTimes /> Cancel</> : <><FaEdit /> Edit Profile</>}
          </EditProfileBtn>
        </ProfileHeader>

        {/* ── Stats Row ── */}
        <StatsRow>
          {[
            { icon: <FaGraduationCap />, color: '#15803d', bg: 'rgba(21,128,61,0.1)', val: learnedCount, lbl: 'Terms Learned' },
            { icon: <FaHistory />,       color: '#0284c7', bg: 'rgba(2,132,199,0.1)',  val: sessions.length, lbl: 'AI Sessions' },
            { icon: <FaHeart />,         color: '#f43f5e', bg: 'rgba(244,63,94,0.1)',  val: bookmarkCount, lbl: 'Bookmarked' },
            { icon: <FaTrophy />,        color: '#d97706', bg: 'rgba(217,119,6,0.1)',  val: completedGoals, lbl: 'Goals Met' },
          ].map((s, i) => (
            <StatCard key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
              <StatIcon $color={s.color} $bg={s.bg}>{s.icon}</StatIcon>
              <div>
                <StatVal>{s.val}</StatVal>
                <StatLbl>{s.lbl}</StatLbl>
              </div>
            </StatCard>
          ))}
        </StatsRow>

        {/* ── Body Grid ── */}
        <ContentGrid>
          {/* Left sidebar */}
          <div>
            {/* About / Edit */}
            <Card>
              <CardHead>
                <CardTitle><FaUser style={{ color: '#15803d' }} /> About</CardTitle>
              </CardHead>
              <CardBody>
                {editing ? (
                  <>
                    <FieldGroup>
                      <FieldLabel>Display Name</FieldLabel>
                      <FieldInput value={editForm.display_name} onChange={e => setEditForm(f => ({ ...f, display_name: e.target.value }))} placeholder="Your name" />
                    </FieldGroup>
                    <FieldGroup>
                      <FieldLabel>Tagline</FieldLabel>
                      <FieldInput value={editForm.tagline} onChange={e => setEditForm(f => ({ ...f, tagline: e.target.value }))} placeholder="e.g. Long-term investor · FIRE journey" />
                    </FieldGroup>
                    <FieldGroup>
                      <FieldLabel>Bio</FieldLabel>
                      <FieldTextarea value={editForm.bio} onChange={e => setEditForm(f => ({ ...f, bio: e.target.value }))} placeholder="A bit about your investing journey…" />
                    </FieldGroup>
                    <FieldGroup>
                      <FieldLabel>Location</FieldLabel>
                      <FieldInput value={editForm.location} onChange={e => setEditForm(f => ({ ...f, location: e.target.value }))} placeholder="London, UK" />
                    </FieldGroup>
                    <TwoCol>
                      <FieldGroup>
                        <FieldLabel>Risk Profile</FieldLabel>
                        <FieldSelect value={editForm.risk_tolerance} onChange={e => setEditForm(f => ({ ...f, risk_tolerance: e.target.value }))}>
                          {RISK_OPTIONS.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase()+r.slice(1)}</option>)}
                        </FieldSelect>
                      </FieldGroup>
                      <FieldGroup>
                        <FieldLabel>Investor Level</FieldLabel>
                        <FieldSelect value={editForm.investor_type} onChange={e => setEditForm(f => ({ ...f, investor_type: e.target.value }))}>
                          {INVESTOR_TYPES.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase()+r.slice(1)}</option>)}
                        </FieldSelect>
                      </FieldGroup>
                      <FieldGroup>
                        <FieldLabel>Style</FieldLabel>
                        <FieldSelect value={editForm.investment_style} onChange={e => setEditForm(f => ({ ...f, investment_style: e.target.value }))}>
                          {STYLES.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase()+r.slice(1)}</option>)}
                        </FieldSelect>
                      </FieldGroup>
                      <FieldGroup>
                        <FieldLabel>Focus</FieldLabel>
                        <FieldSelect value={editForm.primary_focus} onChange={e => setEditForm(f => ({ ...f, primary_focus: e.target.value }))}>
                          {FOCUS_OPTIONS.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase()+r.slice(1)}</option>)}
                        </FieldSelect>
                      </FieldGroup>
                    </TwoCol>
                    <FieldGroup>
                      <FieldLabel>Years Investing</FieldLabel>
                      <FieldInput type="number" min="0" value={editForm.experience_years} onChange={e => setEditForm(f => ({ ...f, experience_years: parseInt(e.target.value)||0 }))} />
                    </FieldGroup>
                    <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'flex-end' }}>
                      <CancelBtn onClick={() => setEditing(false)}>Cancel</CancelBtn>
                      <SaveBtn onClick={handleSaveProfile} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                        {saving ? 'Saving…' : <><FaCheck /> Save</>}
                      </SaveBtn>
                    </div>
                  </>
                ) : (
                  <>
                    {profile?.bio && <p style={{ fontSize: '0.84rem', color: '#374151', lineHeight: 1.6, margin: '0 0 0.75rem', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.75rem' }}>{profile.bio}</p>}
                    {[
                      ['Risk', riskMeta.label],
                      ['Level', investMeta.label],
                      ['Style', profile?.investment_style || 'Mixed'],
                      ['Focus', profile?.primary_focus || 'Stocks'],
                      ['Experience', profile?.experience_years ? `${profile.experience_years}y` : '—'],
                    ].map(([k, v]) => (
                      <AboutRow key={k}>
                        <AboutKey>{k}</AboutKey>
                        <AboutVal>{v}</AboutVal>
                      </AboutRow>
                    ))}
                  </>
                )}
              </CardBody>
            </Card>

            {/* Financial Snapshot */}
            <Card>
              <CardHead>
                <CardTitle><FaChartLine style={{ color: '#0284c7' }} /> Financial Snapshot</CardTitle>
              </CardHead>
              <CardBody>
                <SnapRow>
                  <SnapLabel>Monthly Income</SnapLabel>
                  <SnapInput type="number" value={income} onChange={e => setIncome(e.target.value)} onBlur={() => api.saveProfile({ monthly_income: parseFloat(income)||0 }).catch(()=>{})} placeholder="0" />
                </SnapRow>
                <SnapRow>
                  <SnapLabel>Monthly Expenses</SnapLabel>
                  <SnapInput type="number" value={expenses} onChange={e => setExpenses(e.target.value)} placeholder="0" />
                </SnapRow>
                <SnapRow>
                  <SnapLabel>Monthly Savings</SnapLabel>
                  <SnapValue $accent="#15803d">£{fmt(savings)}</SnapValue>
                </SnapRow>
                <SnapRow>
                  <SnapLabel>Savings Rate</SnapLabel>
                  <SnapValue $accent={savingsRate >= 20 ? '#15803d' : savingsRate >= 10 ? '#d97706' : '#dc2626'}>{savingsRate}%</SnapValue>
                </SnapRow>
                <SnapRow>
                  <SnapLabel>Months to 3× Emergency Fund</SnapLabel>
                  <SnapValue>{efMonths}</SnapValue>
                </SnapRow>
                <SnapRow>
                  <SnapLabel>Net Worth (£)</SnapLabel>
                  <SnapInput type="number" value={netWorth} onChange={e => setNetWorth(e.target.value)} onBlur={() => api.saveProfile({ net_worth: parseFloat(netWorth)||0 }).catch(()=>{})} placeholder="0" />
                </SnapRow>
              </CardBody>
            </Card>

            {/* Investment Planner CTA */}
            <Card>
              <CardBody $p="1.1rem">
                <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, fontSize: '0.95rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <FaChartLine style={{ color: '#15803d' }} /> Investment Planner
                </div>
                <p style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.5, margin: '0 0 0.85rem' }}>
                  Project any goal forward at a {Math.round(planReturn * 100)}%/yr assumed return ({profile?.risk_tolerance || 'moderate'} risk), see the monthly contribution needed, and build a fund strategy.
                </p>
                <button
                  onClick={() => navigate('/iq?tab=allocation')}
                  style={{ width: '100%', padding: '0.7rem', border: 'none', borderRadius: '10px', background: 'linear-gradient(135deg,#22c55e,#16a34a)', color: '#fff', fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                >
                  Open the Planner <FaArrowUp style={{ transform: 'rotate(45deg)', fontSize: '0.7rem' }} />
                </button>
              </CardBody>
            </Card>

            {/* AI Tutor activity */}
            {sessions.length > 0 && (
              <Card>
                <CardHead>
                  <CardTitle><FaRobot style={{ color: '#6d5ae0' }} /> Recent AI Sessions</CardTitle>
                  <button onClick={() => navigate('/glossary')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#15803d', fontSize: '0.75rem', fontWeight: 700 }}>Open →</button>
                </CardHead>
                <div>
                  {sessions.map(s => (
                    <SessionItem key={s.id} onClick={() => navigate('/glossary')}>
                      <FaBook style={{ color: '#9ca3af', flexShrink: 0, fontSize: '0.7rem' }} />
                      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.term_labels || s.terms}</span>
                      <span style={{ fontSize: '0.68rem', color: '#9ca3af', flexShrink: 0 }}>{timeAgo(s.created_at)}</span>
                    </SessionItem>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Right: Goals + Plans */}
          <div>
            {/* Financial Goals */}
            <Card style={{ marginBottom: '1rem' }}>
              <CardHead>
                <CardTitle><FaBolt style={{ color: '#d97706' }} /> Financial Goals</CardTitle>
                <AddGoalBtn
                  onClick={() => setShowAddGoal(true)}
                  style={{ width: 'auto', padding: '0.4rem 0.85rem', border: '1.5px solid #e5e7eb' }}
                  whileHover={{ scale: 1.02 }}
                >
                  <FaPlus style={{ fontSize: '0.7rem' }} /> Add Goal
                </AddGoalBtn>
              </CardHead>
              <CardBody $p="1rem 1.1rem">
                {goals.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#9ca3af' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎯</div>
                    <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>No goals yet</div>
                    <div style={{ fontSize: '0.8rem' }}>Set your first financial goal to start tracking your progress.</div>
                  </div>
                ) : (
                  <>
                    {activeGoals.map((g, i) => {
                      const p = pct(g.current_amount, g.target_amount);
                      const cat = GOAL_CATS.find(c => c.id === g.category) || GOAL_CATS[5];
                      return (
                        <GoalCard key={g.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                          <GoalTop>
                            <GoalEmoji>{g.emoji || cat.emoji}</GoalEmoji>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <GoalTitle>{g.title}</GoalTitle>
                              <GoalMeta>
                                <span style={{ background: cat.color + '12', color: cat.color, padding: '0.1rem 0.45rem', borderRadius: 5, fontWeight: 700 }}>{cat.label}</span>
                                {g.deadline && <span><FaClock style={{ fontSize: '0.6rem' }} /> {fmtDate(g.deadline)}</span>}
                              </GoalMeta>
                            </div>
                            <GoalActions>
                              <GoalActionBtn onClick={() => setUpdateGoal(g)}><FaArrowUp style={{ fontSize: '0.6rem' }} /> Update</GoalActionBtn>
                              <GoalActionBtn onClick={() => setEditGoal(g)}><FaPencilAlt style={{ fontSize: '0.6rem' }} /></GoalActionBtn>
                              <GoalActionBtn $danger onClick={() => handleDeleteGoal(g.id)}><FaTrash style={{ fontSize: '0.6rem' }} /></GoalActionBtn>
                            </GoalActions>
                          </GoalTop>
                          <ProgressTrack>
                            <ProgressFill $color={g.color || cat.color} initial={{ width: 0 }} animate={{ width: `${p}%` }} transition={{ duration: 0.8, delay: i * 0.05 }} />
                          </ProgressTrack>
                          <GoalAmounts>
                            <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, color: g.color || cat.color }}>£{fmt(g.current_amount)}</span>
                            <span style={{ color: '#9ca3af' }}>of £{fmt(g.target_amount)}</span>
                            <span style={{ fontWeight: 800, color: p >= 100 ? '#15803d' : '#374151' }}>{p}%</span>
                          </GoalAmounts>
                          {p < 100 && g.deadline && (() => {
                            const yrs = yearsUntil(g.deadline);
                            if (!yrs || yrs <= 0) return null;
                            const needed = monthlyNeeded({ target: g.target_amount, principal: g.current_amount, annualReturn: planReturn, years: yrs });
                            const feasible = savings > 0 && needed <= savings;
                            return (
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginTop: '0.55rem', paddingTop: '0.55rem', borderTop: '1px solid #f3f4f6', fontSize: '0.72rem', color: '#64748b' }}>
                                <span>≈ <strong style={{ color: '#0f172a' }}>£{fmt(Math.ceil(needed))}</strong>/mo to reach by {fmtDate(g.deadline)}</span>
                                <span style={{ fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', padding: '0.2rem 0.5rem', borderRadius: '100px', whiteSpace: 'nowrap', background: feasible ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.14)', color: feasible ? '#15803d' : '#b45309' }}>{feasible ? 'On track' : 'Stretch'}</span>
                              </div>
                            );
                          })()}
                        </GoalCard>
                      );
                    })}

                    {doneGoals.length > 0 && (
                      <div style={{ marginTop: '0.5rem' }}>
                        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.5rem' }}>Completed</div>
                        {doneGoals.map(g => (
                          <GoalCard key={g.id} style={{ opacity: 0.7, background: '#f9fafb' }}>
                            <GoalTop style={{ marginBottom: 0 }}>
                              <GoalEmoji>{g.emoji}</GoalEmoji>
                              <GoalTitle style={{ color: '#6b7280', textDecoration: 'line-through' }}>{g.title}</GoalTitle>
                              <CompletedBadge><FaCheckCircle /> Done · £{fmt(g.target_amount)}</CompletedBadge>
                              <GoalActionBtn $danger onClick={() => handleDeleteGoal(g.id)}><FaTrash style={{ fontSize: '0.6rem' }} /></GoalActionBtn>
                            </GoalTop>
                          </GoalCard>
                        ))}
                      </div>
                    )}
                  </>
                )}
                <AddGoalBtn onClick={() => setShowAddGoal(true)} whileHover={{ scale: 1.005 }} whileTap={{ scale: 0.99 }}>
                  <FaPlus /> Add a financial goal
                </AddGoalBtn>
              </CardBody>
            </Card>

            {/* Learning Progress */}
            <Card>
              <CardHead>
                <CardTitle><FaGraduationCap style={{ color: '#15803d' }} /> Learning Progress</CardTitle>
                <button onClick={() => navigate('/glossary')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#15803d', fontSize: '0.75rem', fontWeight: 700 }}>Open AI Tutor →</button>
              </CardHead>
              <CardBody $p="0.9rem 1.1rem">
                <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                  {[
                    { label: 'Terms Learned', val: learnedCount, color: '#15803d' },
                    { label: 'AI Sessions',   val: sessions.length, color: '#0284c7' },
                    { label: 'Bookmarked',    val: bookmarkCount,  color: '#f43f5e' },
                  ].map(s => (
                    <div key={s.label}>
                      <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.5rem', fontWeight: 800, color: s.color }}>{s.val}</div>
                      <div style={{ fontSize: '0.72rem', color: '#9ca3af', fontWeight: 600 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
                {/* progress bar */}
                <div style={{ marginBottom: '0.35rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#6b7280', marginBottom: '0.3rem' }}>
                    <span>Overall Mastery</span>
                    <span>{learnedCount}/130 terms</span>
                  </div>
                  <ProgressTrack style={{ height: 9 }}>
                    <ProgressFill $color="#15803d" initial={{ width: 0 }} animate={{ width: `${Math.round((learnedCount/130)*100)}%` }} transition={{ duration: 1 }} />
                  </ProgressTrack>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#9ca3af', textAlign: 'right' }}>{Math.round((learnedCount/130)*100)}% complete</div>
              </CardBody>
            </Card>
          </div>
        </ContentGrid>
      </ProfileWrapper>

      {/* Modals */}
      <AnimatePresence>
        {showAddGoal && <GoalModal onSave={handleAddGoal} onClose={() => setShowAddGoal(false)} />}
        {editGoal    && <GoalModal initial={editGoal} onSave={handleEditGoal} onClose={() => setEditGoal(null)} />}
        {updateGoal  && <UpdateAmountModal goal={updateGoal} onSave={handleUpdateAmount} onClose={() => setUpdateGoal(null)} />}
      </AnimatePresence>
    </Page>
  );
}
