import React, { useState, useEffect, useCallback } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaArrowLeft,
  FaCheck,
  FaCheckCircle,
  FaTrophy,
  FaBookOpen,
  FaChevronDown,
  FaChevronRight,
  FaClock,
  FaArrowRight,
  FaTimes,
  FaLock,
  FaGraduationCap,
  FaPlay,
} from 'react-icons/fa';
import { api } from '../api';

/* ─── Animations ──────────────────────────────────────────── */

const shimmer = keyframes`
  0% { background-position: -400px 0; }
  100% { background-position: 400px 0; }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

/* ─── Layout ──────────────────────────────────────────────── */

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(180deg, #0a0f1c 0%, #111827 100%);
`;

const MaxWidth = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

/* ─── Header ──────────────────────────────────────────────── */

const Header = styled.section`
  background: linear-gradient(135deg, rgba(34,197,94,0.12) 0%, rgba(59,130,246,0.06) 100%);
  border-bottom: 1px solid rgba(255,255,255,0.06);
  padding: 3rem 1.5rem 4rem;
`;

const HeaderInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const HeaderTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 2rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
`;

const HeaderLeft = styled.div``;

const HeaderTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  color: white;
  margin: 0 0 0.5rem;
  span { color: #22c55e; }
  @media (max-width: 768px) { font-size: 2rem; }
`;

const HeaderSubtitle = styled.p`
  color: rgba(255,255,255,0.5);
  font-size: 1.05rem;
  margin: 0;
  max-width: 520px;
  line-height: 1.6;
`;

const StatsRow = styled.div`
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
`;

const StatBox = styled.div`
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 12px;
  padding: 1rem 1.25rem;
  text-align: center;
  min-width: 100px;
`;

const StatNumber = styled.div`
  font-size: 1.5rem;
  font-weight: 800;
  color: ${(p) => p.$color || '#22c55e'};
`;

const StatLabel = styled.div`
  font-size: 0.75rem;
  color: rgba(255,255,255,0.4);
  font-weight: 500;
  margin-top: 0.25rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

/* ─── Progress Bar ────────────────────────────────────────── */

const ProgressWrapper = styled.div`
  max-width: 1200px;
  margin: -1.75rem auto 0;
  padding: 0 1.5rem;
  position: relative;
  z-index: 2;
`;

const ProgressCard = styled.div`
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 16px;
  padding: 1.25rem 1.75rem;
  box-shadow: 0 4px 24px rgba(0,0,0,0.25);
  display: flex;
  align-items: center;
  gap: 1.25rem;
  flex-wrap: wrap;
`;

const ProgressInfo = styled.div`
  flex: 1;
  min-width: 200px;
`;

const ProgressLabel = styled.div`
  font-size: 0.8rem;
  color: rgba(255,255,255,0.4);
  font-weight: 500;
  margin-bottom: 0.4rem;
`;

const ProgressTrack = styled.div`
  height: 10px;
  background: rgba(255,255,255,0.06);
  border-radius: 10px;
  overflow: hidden;
`;

const ProgressFill = styled(motion.div)`
  height: 100%;
  background: linear-gradient(90deg, #22c55e, #4ade80);
  border-radius: 10px;
`;

const ProgressText = styled.span`
  font-size: 0.95rem;
  font-weight: 700;
  color: white;
  white-space: nowrap;
`;

/* ─── Skeleton / Loading ──────────────────────────────────── */

const SkeletonBlock = styled.div`
  background: linear-gradient(90deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 100%);
  background-size: 800px 100%;
  animation: ${shimmer} 1.5s ease-in-out infinite;
  border-radius: ${(p) => p.$radius || '8px'};
  height: ${(p) => p.$h || '20px'};
  width: ${(p) => p.$w || '100%'};
  margin-bottom: ${(p) => p.$mb || '0'};
`;

const Spinner = styled.div`
  width: 36px;
  height: 36px;
  border: 3px solid rgba(255,255,255,0.1);
  border-top-color: #22c55e;
  border-radius: 50%;
  animation: ${spin} 0.7s linear infinite;
`;

const CenteredMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 6rem 2rem;
  text-align: center;
  gap: 1rem;
  color: rgba(255,255,255,0.5);
  font-size: 1rem;
`;

/* ─── Error State ─────────────────────────────────────────── */

const ErrorBox = styled.div`
  background: rgba(239,68,68,0.08);
  border: 1px solid rgba(239,68,68,0.2);
  border-radius: 14px;
  padding: 2rem;
  text-align: center;
  max-width: 500px;
  margin: 4rem auto;
`;

const ErrorTitle = styled.h3`
  color: #ef4444;
  font-size: 1.1rem;
  margin: 0 0 0.5rem;
`;

const ErrorText = styled.p`
  color: rgba(255,255,255,0.5);
  font-size: 0.9rem;
  margin: 0 0 1rem;
`;

const RetryButton = styled.button`
  padding: 0.6rem 1.5rem;
  border-radius: 10px;
  background: rgba(239,68,68,0.15);
  border: 1px solid rgba(239,68,68,0.3);
  color: #ef4444;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  &:hover { background: rgba(239,68,68,0.25); }
`;

/* ─── Course Grid ─────────────────────────────────────────── */

const SectionTitle = styled.h2`
  color: white;
  font-size: 1.4rem;
  font-weight: 700;
  margin: 0 0 1.5rem;
`;

const CoursesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 1.5rem;
  @media (max-width: 768px) { grid-template-columns: 1fr; }
`;

const CourseCard = styled(motion.div)`
  background: rgba(255,255,255,0.03);
  border-radius: 18px;
  border: 1px solid rgba(255,255,255,0.06);
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.3s, box-shadow 0.3s;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: ${(p) => p.$accentColor || '#22c55e'};
    opacity: 0.7;
  }

  &:hover {
    border-color: ${(p) => p.$accentColor ? p.$accentColor + '55' : 'rgba(34,197,94,0.3)'};
    box-shadow: 0 8px 30px rgba(0,0,0,0.25);
  }
`;

const CourseCardBody = styled.div`
  padding: 1.75rem;
`;

const CourseIconRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const CourseIconCircle = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 14px;
  background: ${(p) => p.$color ? p.$color + '18' : 'rgba(34,197,94,0.1)'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
`;

const LevelBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.3rem 0.75rem;
  border-radius: 50px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  ${(p) => {
    const colors = {
      beginner: '#22c55e',
      intermediate: '#3b82f6',
      advanced: '#a855f7',
    };
    const c = colors[p.$level] || '#22c55e';
    return css`
      background: ${c}18;
      color: ${c};
    `;
  }}
`;

const CourseTitle = styled.h3`
  font-size: 1.15rem;
  font-weight: 700;
  color: white;
  margin: 0 0 0.5rem;
`;

const CourseDesc = styled.p`
  color: rgba(255,255,255,0.45);
  font-size: 0.88rem;
  line-height: 1.6;
  margin: 0 0 1.25rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const CourseFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`;

const CourseProgressOuter = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const MiniProgressTrack = styled.div`
  flex: 1;
  height: 6px;
  background: rgba(255,255,255,0.06);
  border-radius: 6px;
  overflow: hidden;
`;

const MiniProgressFill = styled.div`
  height: 100%;
  border-radius: 6px;
  background: ${(p) => p.$color || '#22c55e'};
  width: ${(p) => p.$percent}%;
  transition: width 0.4s ease;
`;

const CourseProgressLabel = styled.span`
  font-size: 0.78rem;
  color: rgba(255,255,255,0.5);
  white-space: nowrap;
  font-weight: 600;
`;

const CourseModuleCount = styled.span`
  font-size: 0.75rem;
  color: rgba(255,255,255,0.3);
  white-space: nowrap;
`;

/* ─── Course Detail ───────────────────────────────────────── */

const BackBtn = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 10px;
  color: rgba(255,255,255,0.6);
  font-size: 0.88rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0.55rem 1rem;
  margin-bottom: 1.5rem;
  transition: all 0.2s;
  &:hover { color: #22c55e; border-color: rgba(34,197,94,0.3); }
`;

const CourseDetailHeader = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const CourseDetailIcon = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 18px;
  background: ${(p) => p.$color ? p.$color + '18' : 'rgba(34,197,94,0.1)'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  flex-shrink: 0;
`;

const CourseDetailInfo = styled.div`
  flex: 1;
  min-width: 200px;
`;

const CourseDetailTitle = styled.h2`
  font-size: 1.6rem;
  font-weight: 800;
  color: white;
  margin: 0 0 0.4rem;
  @media (max-width: 768px) { font-size: 1.3rem; }
`;

const CourseDetailDesc = styled.p`
  color: rgba(255,255,255,0.5);
  font-size: 0.95rem;
  line-height: 1.6;
  margin: 0 0 0.75rem;
`;

const CourseDetailMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

const MetaItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.82rem;
  color: rgba(255,255,255,0.4);
  font-weight: 500;
  svg { font-size: 0.75rem; }
`;

/* ─── Module Accordion ────────────────────────────────────── */

const ModuleAccordion = styled.div`
  margin-bottom: 1rem;
  border-radius: 14px;
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.06);
  overflow: hidden;
  transition: border-color 0.3s;
  &:hover { border-color: rgba(255,255,255,0.1); }
`;

const ModuleHeader = styled.button`
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  padding: 1.25rem 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  transition: background 0.2s;
  &:hover { background: rgba(255,255,255,0.02); }
`;

const ModuleChevron = styled(motion.span)`
  color: rgba(255,255,255,0.3);
  font-size: 0.8rem;
  display: flex;
  align-items: center;
`;

const ModuleInfo = styled.div`
  flex: 1;
`;

const ModuleTitle = styled.h4`
  color: white;
  font-size: 1rem;
  font-weight: 700;
  margin: 0 0 0.2rem;
`;

const ModuleDesc = styled.p`
  color: rgba(255,255,255,0.35);
  font-size: 0.82rem;
  margin: 0;
`;

const ModuleLessonCount = styled.span`
  font-size: 0.75rem;
  color: rgba(255,255,255,0.3);
  font-weight: 500;
  white-space: nowrap;
`;

const ModuleLessons = styled(motion.div)`
  overflow: hidden;
`;

const LessonRow = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.85rem 1.5rem 0.85rem 2.5rem;
  cursor: pointer;
  transition: background 0.2s;
  border-top: 1px solid rgba(255,255,255,0.04);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: 1.75rem;
    top: 0;
    bottom: 0;
    width: 2px;
    background: ${(p) => p.$completed ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.06)'};
  }

  &:hover { background: rgba(255,255,255,0.03); }
`;

const LessonRowIcon = styled.span`
  font-size: 1.1rem;
  position: relative;
  z-index: 1;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: ${(p) => p.$completed ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.05)'};
  flex-shrink: 0;
`;

const LessonRowInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const LessonRowTitle = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${(p) => p.$completed ? 'rgba(255,255,255,0.6)' : 'white'};
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const LessonRowDuration = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.75rem;
  color: rgba(255,255,255,0.3);
  margin-top: 0.15rem;
  svg { font-size: 0.65rem; }
`;

const LessonStatus = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  flex-shrink: 0;
  color: ${(p) => p.$completed ? '#22c55e' : 'rgba(255,255,255,0.15)'};
  font-size: ${(p) => p.$completed ? '1rem' : '0.75rem'};
`;

/* ─── Lesson Viewer Modal ─────────────────────────────────── */

const ModalOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.9);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  overflow-y: auto;
`;

const ModalPanel = styled(motion.div)`
  background: linear-gradient(180deg, #111827 0%, #0f1521 100%);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 20px;
  width: 100%;
  max-width: 780px;
  max-height: 92vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 24px 64px rgba(0,0,0,0.5);

  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
  &::-webkit-scrollbar-track { background: transparent; }
`;

const ModalTop = styled.div`
  padding: 1.5rem 2rem 1.25rem;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  position: sticky;
  top: 0;
  background: #111827;
  border-radius: 20px 20px 0 0;
  z-index: 2;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
`;

const ModalTopLeft = styled.div`
  flex: 1;
  min-width: 0;
`;

const Breadcrumb = styled.div`
  font-size: 0.78rem;
  color: rgba(255,255,255,0.35);
  margin-bottom: 0.4rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  flex-wrap: wrap;

  span { color: #22c55e; }
`;

const ModalLessonTitle = styled.h2`
  font-size: 1.4rem;
  font-weight: 800;
  color: white;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  @media (max-width: 768px) { font-size: 1.15rem; }
`;

const CloseBtn = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.08);
  color: rgba(255,255,255,0.5);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 0.85rem;
  transition: all 0.2s;
  &:hover { color: white; background: rgba(255,255,255,0.1); }
`;

const ModalBody = styled.div`
  padding: 2rem;
`;

const ContentBlock = styled.div`
  margin-bottom: 2rem;
`;

const ContentHeading = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: white;
  margin: 0 0 0.6rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ContentText = styled.p`
  color: rgba(255,255,255,0.6);
  font-size: 0.92rem;
  line-height: 1.85;
  margin: 0;
`;

const TakeawaysBox = styled.div`
  background: rgba(34,197,94,0.06);
  border: 1px solid rgba(34,197,94,0.15);
  border-radius: 14px;
  padding: 1.5rem;
  margin: 2rem 0;
`;

const TakeawaysHeader = styled.h4`
  font-size: 1rem;
  font-weight: 700;
  color: white;
  margin: 0 0 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  svg { color: #22c55e; }
`;

const TakeawayItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  margin-bottom: 0.6rem;
  color: rgba(255,255,255,0.6);
  font-size: 0.88rem;
  line-height: 1.55;
  svg { color: #22c55e; flex-shrink: 0; margin-top: 0.25rem; font-size: 0.75rem; }
`;

/* ─── Quiz ────────────────────────────────────────────────── */

const QuizSection = styled.div`
  margin-top: 2.5rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255,255,255,0.06);
`;

const QuizHeader = styled.h3`
  font-size: 1.15rem;
  font-weight: 700;
  color: white;
  margin: 0 0 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  svg { color: #f59e0b; }
`;

const QuestionCard = styled.div`
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 14px;
  padding: 1.25rem;
  margin-bottom: 1rem;
`;

const QuestionText = styled.p`
  font-weight: 600;
  color: white;
  margin: 0 0 0.75rem;
  font-size: 0.92rem;
  line-height: 1.5;
`;

const OptionsGrid = styled.div`
  display: grid;
  gap: 0.4rem;
`;

const OptionBtn = styled.button`
  text-align: left;
  padding: 0.7rem 1rem;
  border-radius: 10px;
  font-size: 0.88rem;
  cursor: ${(p) => (p.disabled ? 'default' : 'pointer')};
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255,255,255,0.8);

  border: 2px solid ${(p) => {
    if (p.$submitted && p.$isCorrect) return '#22c55e';
    if (p.$submitted && p.$selected && !p.$isCorrect) return '#ef4444';
    if (!p.$submitted && p.$selected) return '#3b82f6';
    return 'rgba(255,255,255,0.08)';
  }};

  background: ${(p) => {
    if (p.$submitted && p.$isCorrect) return 'rgba(34,197,94,0.1)';
    if (p.$submitted && p.$selected && !p.$isCorrect) return 'rgba(239,68,68,0.1)';
    if (!p.$submitted && p.$selected) return 'rgba(59,130,246,0.08)';
    return 'rgba(255,255,255,0.02)';
  }};

  &:hover:not(:disabled) {
    border-color: ${(p) => (!p.$selected && !p.$submitted ? '#3b82f6' : undefined)};
    background: ${(p) => (!p.$selected && !p.$submitted ? 'rgba(59,130,246,0.05)' : undefined)};
  }
`;

const SubmitQuizBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.9rem;
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  margin-top: 1rem;
  transition: all 0.3s ease;
  &:hover { opacity: 0.9; }
  &:disabled {
    background: rgba(255,255,255,0.08);
    color: rgba(255,255,255,0.25);
    cursor: not-allowed;
  }
`;

const ScoreCard = styled(motion.div)`
  text-align: center;
  padding: 1.5rem;
  border-radius: 14px;
  margin-top: 1.25rem;
  background: ${(p) => (p.$passed ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)')};
  border: 1px solid ${(p) => (p.$passed ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)')};
`;

const ScoreValue = styled.div`
  font-size: 2rem;
  font-weight: 800;
  color: ${(p) => (p.$passed ? '#22c55e' : '#ef4444')};
`;

const ScoreLabel = styled.p`
  color: rgba(255,255,255,0.5);
  font-size: 0.88rem;
  margin: 0.5rem 0 0;
`;

const CompleteBtn = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  margin-top: 1.25rem;
  transition: all 0.3s ease;
  &:hover { opacity: 0.9; transform: translateY(-1px); }
  &:disabled {
    background: rgba(255,255,255,0.08);
    color: rgba(255,255,255,0.3);
    cursor: not-allowed;
  }
`;

/* ─── Lesson Navigation ───────────────────────────────────── */

const LessonNav = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255,255,255,0.06);
`;

const NavBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.6rem 1.2rem;
  border-radius: 10px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  color: rgba(255,255,255,0.6);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  &:hover { color: white; border-color: rgba(255,255,255,0.15); }
  &:disabled { opacity: 0.3; cursor: not-allowed; }
`;

/* ─── MAIN COMPONENT ──────────────────────────────────────── */

const LearnPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [expandedModules, setExpandedModules] = useState({});

  const [lessonData, setLessonData] = useState(null);
  const [lessonLoading, setLessonLoading] = useState(false);

  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [completing, setCompleting] = useState(false);

  const [progress, setProgress] = useState({ totalLessons: 0, completedLessons: 0, completedIds: [] });

  /* ─── Data Loading ──── */

  const loadCourses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [coursesData, progressData] = await Promise.all([
        api.getCourses(),
        api.getCourseProgress(),
      ]);
      setCourses(coursesData.courses || []);
      setProgress({
        totalLessons: progressData.totalLessons || 0,
        completedLessons: progressData.completedLessons || 0,
        completedIds: progressData.completedIds || [],
      });
    } catch (err) {
      console.error('Failed to load courses:', err);
      setError(err.message || 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  const openLesson = useCallback(async (lessonId) => {
    setLessonLoading(true);
    setQuizAnswers({});
    setQuizSubmitted(false);
    try {
      const data = await api.getLesson(lessonId);
      setLessonData(data.lesson);
    } catch (err) {
      console.error('Failed to load lesson:', err);
      setLessonData(null);
    } finally {
      setLessonLoading(false);
    }
  }, []);

  const closeLesson = useCallback(() => {
    setLessonData(null);
    setQuizAnswers({});
    setQuizSubmitted(false);
  }, []);

  /* ─── Quiz Logic ──── */

  const handleQuizAnswer = (qIdx, optIdx) => {
    if (quizSubmitted) return;
    setQuizAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  const submitQuiz = () => setQuizSubmitted(true);

  const getQuizScore = () => {
    if (!lessonData || !lessonData.quiz) return 0;
    let correct = 0;
    lessonData.quiz.forEach((q, i) => {
      if (quizAnswers[i] === q.answer) correct++;
    });
    return correct;
  };

  const allAnswered = lessonData && lessonData.quiz
    ? Object.keys(quizAnswers).length === lessonData.quiz.length
    : false;

  /* ─── Complete Lesson ──── */

  const completeLesson = useCallback(async () => {
    if (!lessonData || completing) return;
    setCompleting(true);
    const score = lessonData.quiz
      ? lessonData.quiz.reduce((acc, q, i) => acc + (quizAnswers[i] === q.answer ? 1 : 0), 0)
      : 0;
    try {
      await api.completeLessonV2(lessonData.id, score);
    } catch (err) {
      console.error('Failed to complete lesson:', err);
    }
    closeLesson();
    setCompleting(false);
    loadCourses();
  }, [lessonData, quizAnswers, completing, closeLesson, loadCourses]);

  /* ─── Navigate Between Lessons ──── */

  const navigateLesson = useCallback((lessonId) => {
    if (lessonId) openLesson(lessonId);
  }, [openLesson]);

  /* ─── Module Toggle ──── */

  const toggleModule = (modId) => {
    setExpandedModules((prev) => ({ ...prev, [modId]: !prev[modId] }));
  };

  /* ─── Course Selection ──── */

  const selectCourse = (course) => {
    setSelectedCourse(course);
    const initial = {};
    if (course.modules && course.modules.length > 0) {
      initial[course.modules[0].id] = true;
    }
    setExpandedModules(initial);
  };

  const goBackToCourses = () => {
    setSelectedCourse(null);
    setExpandedModules({});
  };

  /* ─── Derived ──── */

  const progressPercent = progress.totalLessons > 0
    ? Math.round((progress.completedLessons / progress.totalLessons) * 100)
    : 0;

  const isLessonCompleted = (lessonId) => progress.completedIds.includes(lessonId);

  /* ─── Render: Loading ──── */

  if (loading) {
    return (
      <PageContainer>
        <Header>
          <HeaderInner>
            <SkeletonBlock $h="36px" $w="320px" $mb="12px" />
            <SkeletonBlock $h="18px" $w="420px" />
          </HeaderInner>
        </Header>
        <MaxWidth>
          <div style={{ padding: '3rem 0' }}>
            <CoursesGrid>
              {[1, 2, 3].map((i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 18, padding: '1.75rem', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <SkeletonBlock $h="56px" $w="56px" $radius="14px" $mb="16px" />
                  <SkeletonBlock $h="20px" $w="70%" $mb="8px" />
                  <SkeletonBlock $h="14px" $w="100%" $mb="4px" />
                  <SkeletonBlock $h="14px" $w="85%" $mb="16px" />
                  <SkeletonBlock $h="6px" $w="100%" $radius="6px" />
                </div>
              ))}
            </CoursesGrid>
          </div>
        </MaxWidth>
      </PageContainer>
    );
  }

  /* ─── Render: Error ──── */

  if (error) {
    return (
      <PageContainer>
        <Header>
          <HeaderInner>
            <HeaderTitle>Investment <span>Academy</span></HeaderTitle>
          </HeaderInner>
        </Header>
        <MaxWidth>
          <ErrorBox>
            <ErrorTitle>Failed to load courses</ErrorTitle>
            <ErrorText>{error}</ErrorText>
            <RetryButton onClick={loadCourses}>Try Again</RetryButton>
          </ErrorBox>
        </MaxWidth>
      </PageContainer>
    );
  }

  const totalCourses = courses.length;
  const totalLessons = progress.totalLessons;
  const completedCount = progress.completedLessons;

  /* ─── Render: Course Detail ──── */

  const renderCourseDetail = () => {
    const c = selectedCourse;
    if (!c) return null;

    const courseCompleted = c.modules
      ? c.modules.reduce((sum, m) => sum + m.lessons.filter((l) => isLessonCompleted(l.id)).length, 0)
      : 0;
    const courseTotal = c.totalLessons || 0;
    const coursePercent = courseTotal > 0 ? Math.round((courseCompleted / courseTotal) * 100) : 0;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <BackBtn
          onClick={goBackToCourses}
          whileHover={{ x: -3 }}
          whileTap={{ scale: 0.97 }}
        >
          <FaArrowLeft /> All Courses
        </BackBtn>

        <CourseDetailHeader>
          <CourseDetailIcon $color={c.color}>{c.icon}</CourseDetailIcon>
          <CourseDetailInfo>
            <CourseDetailTitle>{c.title}</CourseDetailTitle>
            <CourseDetailDesc>{c.description}</CourseDetailDesc>
            <CourseDetailMeta>
              <LevelBadge $level={c.level}>{c.level}</LevelBadge>
              <MetaItem><FaBookOpen /> {courseTotal} lessons</MetaItem>
              <MetaItem><FaCheckCircle style={{ color: '#22c55e' }} /> {courseCompleted} completed</MetaItem>
              <MetaItem><FaGraduationCap /> {coursePercent}% done</MetaItem>
            </CourseDetailMeta>
          </CourseDetailInfo>
        </CourseDetailHeader>

        {c.modules && c.modules.map((mod) => {
          const modCompleted = mod.lessons.filter((l) => isLessonCompleted(l.id)).length;
          const isOpen = !!expandedModules[mod.id];

          return (
            <ModuleAccordion key={mod.id}>
              <ModuleHeader onClick={() => toggleModule(mod.id)}>
                <ModuleChevron
                  animate={{ rotate: isOpen ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FaChevronRight />
                </ModuleChevron>
                <ModuleInfo>
                  <ModuleTitle>{mod.title}</ModuleTitle>
                  {mod.description && <ModuleDesc>{mod.description}</ModuleDesc>}
                </ModuleInfo>
                <ModuleLessonCount>
                  {modCompleted}/{mod.lessons.length} done
                </ModuleLessonCount>
              </ModuleHeader>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <ModuleLessons
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                  >
                    {mod.lessons.map((lesson) => {
                      const done = isLessonCompleted(lesson.id);
                      return (
                        <LessonRow
                          key={lesson.id}
                          $completed={done}
                          onClick={() => openLesson(lesson.id)}
                          whileHover={{ x: 4 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          <LessonRowIcon $completed={done}>
                            {lesson.icon || <FaPlay style={{ fontSize: '0.7rem', color: done ? '#22c55e' : 'rgba(255,255,255,0.3)' }} />}
                          </LessonRowIcon>
                          <LessonRowInfo>
                            <LessonRowTitle $completed={done}>{lesson.title}</LessonRowTitle>
                            <LessonRowDuration><FaClock /> {lesson.duration}</LessonRowDuration>
                          </LessonRowInfo>
                          <LessonStatus $completed={done}>
                            {done ? <FaCheckCircle /> : <FaChevronRight />}
                          </LessonStatus>
                        </LessonRow>
                      );
                    })}
                  </ModuleLessons>
                )}
              </AnimatePresence>
            </ModuleAccordion>
          );
        })}
      </motion.div>
    );
  };

  /* ─── Render: Courses Grid ──── */

  const renderCoursesGrid = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <SectionTitle>Your Courses</SectionTitle>
      <CoursesGrid>
        {courses.map((course, idx) => {
          const pct = course.totalLessons > 0
            ? Math.round((course.completedLessons / course.totalLessons) * 100)
            : 0;
          return (
            <CourseCard
              key={course.id}
              $accentColor={course.color}
              onClick={() => selectCourse(course)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08, duration: 0.35 }}
              whileHover={{ y: -4 }}
            >
              <CourseCardBody>
                <CourseIconRow>
                  <CourseIconCircle $color={course.color}>{course.icon}</CourseIconCircle>
                  <LevelBadge $level={course.level}>{course.level}</LevelBadge>
                </CourseIconRow>
                <CourseTitle>{course.title}</CourseTitle>
                <CourseDesc>{course.description}</CourseDesc>
                <CourseFooter>
                  <CourseProgressOuter>
                    <MiniProgressTrack>
                      <MiniProgressFill $color={course.color} $percent={pct} />
                    </MiniProgressTrack>
                    <CourseProgressLabel>
                      {course.completedLessons}/{course.totalLessons}
                    </CourseProgressLabel>
                  </CourseProgressOuter>
                  <CourseModuleCount>
                    {course.modules ? course.modules.length : 0} modules
                  </CourseModuleCount>
                </CourseFooter>
              </CourseCardBody>
            </CourseCard>
          );
        })}
      </CoursesGrid>
    </motion.div>
  );

  /* ─── Render: Lesson Modal ──── */

  const renderLessonModal = () => {
    if (!lessonData && !lessonLoading) return null;

    return (
      <ModalOverlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        onClick={closeLesson}
      >
        <ModalPanel
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={(e) => e.stopPropagation()}
        >
          {lessonLoading ? (
            <CenteredMessage style={{ padding: '4rem 2rem' }}>
              <Spinner />
              <span>Loading lesson…</span>
            </CenteredMessage>
          ) : lessonData ? (
            <>
              <ModalTop>
                <ModalTopLeft>
                  <Breadcrumb>
                    {lessonData.courseTitle} <FaChevronRight style={{ fontSize: '0.55rem' }} /> <span>{lessonData.moduleTitle}</span>
                  </Breadcrumb>
                  <ModalLessonTitle>
                    <span>{lessonData.icon}</span>
                    {lessonData.title}
                  </ModalLessonTitle>
                </ModalTopLeft>
                <CloseBtn onClick={closeLesson}><FaTimes /></CloseBtn>
              </ModalTop>

              <ModalBody>
                {/* Duration badge */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <MetaItem>
                    <FaClock /> {lessonData.duration}
                    {lessonData.completed && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: '#22c55e', marginLeft: '1rem', fontWeight: 600 }}>
                        <FaCheckCircle /> Completed
                      </span>
                    )}
                  </MetaItem>
                </div>

                {/* Content sections */}
                {lessonData.content && lessonData.content.map((block, i) => (
                  <ContentBlock key={i}>
                    <ContentHeading>{block.heading}</ContentHeading>
                    <ContentText>{block.text}</ContentText>
                  </ContentBlock>
                ))}

                {/* Key Takeaways */}
                {lessonData.keyTakeaways && lessonData.keyTakeaways.length > 0 && (
                  <TakeawaysBox>
                    <TakeawaysHeader>
                      <FaCheckCircle /> Key Takeaways
                    </TakeawaysHeader>
                    {lessonData.keyTakeaways.map((t, i) => (
                      <TakeawayItem key={i}>
                        <FaCheck /> {t}
                      </TakeawayItem>
                    ))}
                  </TakeawaysBox>
                )}

                {/* Quiz */}
                {lessonData.quiz && lessonData.quiz.length > 0 && (
                  <QuizSection>
                    <QuizHeader>
                      <FaTrophy /> Test Your Knowledge
                    </QuizHeader>

                    {lessonData.quiz.map((q, qIdx) => (
                      <QuestionCard key={qIdx}>
                        <QuestionText>
                          {qIdx + 1}. {q.question}
                        </QuestionText>
                        <OptionsGrid>
                          {q.options.map((opt, oIdx) => (
                            <OptionBtn
                              key={oIdx}
                              $selected={quizAnswers[qIdx] === oIdx}
                              $isCorrect={oIdx === q.answer}
                              $submitted={quizSubmitted}
                              disabled={quizSubmitted}
                              onClick={() => handleQuizAnswer(qIdx, oIdx)}
                            >
                              {quizSubmitted && oIdx === q.answer && (
                                <FaCheck style={{ color: '#22c55e', flexShrink: 0 }} />
                              )}
                              {quizSubmitted && quizAnswers[qIdx] === oIdx && oIdx !== q.answer && (
                                <FaTimes style={{ color: '#ef4444', flexShrink: 0 }} />
                              )}
                              {opt}
                            </OptionBtn>
                          ))}
                        </OptionsGrid>
                      </QuestionCard>
                    ))}

                    {!quizSubmitted ? (
                      <SubmitQuizBtn onClick={submitQuiz} disabled={!allAnswered}>
                        Submit Answers
                      </SubmitQuizBtn>
                    ) : (
                      <>
                        <ScoreCard
                          $passed={getQuizScore() >= Math.ceil(lessonData.quiz.length / 2)}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                        >
                          <ScoreValue $passed={getQuizScore() >= Math.ceil(lessonData.quiz.length / 2)}>
                            {getQuizScore()}/{lessonData.quiz.length}
                          </ScoreValue>
                          <ScoreLabel>
                            {getQuizScore() >= Math.ceil(lessonData.quiz.length / 2)
                              ? 'Great work! You can mark this lesson as complete.'
                              : 'Review the material and try again for a better score.'}
                          </ScoreLabel>
                        </ScoreCard>
                        <CompleteBtn
                          onClick={completeLesson}
                          disabled={completing}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <FaCheckCircle />
                          {completing ? 'Saving…' : 'Mark Lesson as Complete'}
                        </CompleteBtn>
                      </>
                    )}
                  </QuizSection>
                )}

                {/* Nav buttons */}
                <LessonNav>
                  <NavBtn
                    disabled={!lessonData.prevLessonId}
                    onClick={() => navigateLesson(lessonData.prevLessonId)}
                  >
                    <FaArrowLeft /> Previous
                  </NavBtn>
                  <NavBtn
                    disabled={!lessonData.nextLessonId}
                    onClick={() => navigateLesson(lessonData.nextLessonId)}
                  >
                    Next <FaArrowRight />
                  </NavBtn>
                </LessonNav>
              </ModalBody>
            </>
          ) : (
            <CenteredMessage>
              <ErrorTitle>Could not load lesson</ErrorTitle>
              <RetryButton onClick={closeLesson}>Close</RetryButton>
            </CenteredMessage>
          )}
        </ModalPanel>
      </ModalOverlay>
    );
  };

  /* ─── Main Render ──── */

  return (
    <PageContainer>
      <Header>
        <HeaderInner>
          <HeaderTop>
            <HeaderLeft>
              <HeaderTitle>Investment <span>Academy</span></HeaderTitle>
              <HeaderSubtitle>
                Master investing with structured courses from beginner to advanced.
                Learn at your own pace with interactive quizzes and track your progress.
              </HeaderSubtitle>
            </HeaderLeft>
            <StatsRow>
              <StatBox>
                <StatNumber $color="#3b82f6">{totalCourses}</StatNumber>
                <StatLabel>Courses</StatLabel>
              </StatBox>
              <StatBox>
                <StatNumber $color="#a855f7">{totalLessons}</StatNumber>
                <StatLabel>Lessons</StatLabel>
              </StatBox>
              <StatBox>
                <StatNumber $color="#22c55e">{completedCount}</StatNumber>
                <StatLabel>Completed</StatLabel>
              </StatBox>
            </StatsRow>
          </HeaderTop>
        </HeaderInner>
      </Header>

      <ProgressWrapper>
        <ProgressCard>
          <ProgressInfo>
            <ProgressLabel>Overall Progress</ProgressLabel>
            <ProgressTrack>
              <ProgressFill
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </ProgressTrack>
          </ProgressInfo>
          <ProgressText>{completedCount}/{totalLessons} Lessons</ProgressText>
        </ProgressCard>
      </ProgressWrapper>

      <MaxWidth>
        <div style={{ padding: '3rem 0 4rem' }}>
          <AnimatePresence mode="wait">
            {selectedCourse ? (
              <motion.div key="detail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {renderCourseDetail()}
              </motion.div>
            ) : (
              <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {renderCoursesGrid()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </MaxWidth>

      <AnimatePresence>
        {(lessonData || lessonLoading) && renderLessonModal()}
      </AnimatePresence>
    </PageContainer>
  );
};

export default LearnPage;
