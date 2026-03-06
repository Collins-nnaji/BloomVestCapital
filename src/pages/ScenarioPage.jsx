import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { FaArrowUp, FaArrowDown, FaRobot, FaPlay, FaTrophy, FaClock, FaCheckCircle, FaTimesCircle, FaPaperPlane, FaChartLine, FaSignOutAlt, FaStar, FaLightbulb, FaSearch, FaLock, FaCrown, FaMagic, FaChevronRight, FaSave, FaBullseye, FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { scenarios, difficultyColors } from '../data/scenarios';
import { stocks } from '../data/stockData';
import { api } from '../api';
import { useAuth } from '../AuthContext';

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%);
`;

const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 1.5rem;

  @media (max-width: 480px) {
    padding: 1.5rem 1rem;
  }
`;

const PageHeader = styled(motion.div)`
  text-align: center;
  margin-bottom: 2.5rem;
`;

const PageTitle = styled.h1`
  font-size: 2.75rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 0.5rem;
  letter-spacing: -0.03em;
`;

const PageSubtitle = styled.p`
  color: rgba(15,23,42,0.72);
  font-size: 1.2rem;
  line-height: 1.6;
  font-weight: 450;
`;

const ScenariosGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  @media (max-width: 480px) {
    gap: 0.85rem;
  }
`;

const ScenarioCard = styled(motion.div)`
  background: #ffffff;
  border: 1px solid rgba(15,23,42,0.12);
  border-radius: 16px;
  padding: 1.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 25px rgba(0,0,0,0.3);
    border-color: rgba(15,23,42,0.2);
  }
`;

const ScenarioCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const ScenarioIcon = styled.span`
  font-size: 2rem;
`;

const DifficultyBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${p => (p.$color || '#22c55e') + '18'};
  color: ${p => p.$color || '#22c55e'};
`;

const ScenarioCardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 0.6rem;
  letter-spacing: -0.02em;
`;

const ScenarioCardDesc = styled.p`
  color: rgba(15,23,42,0.74);
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 1rem;
  font-weight: 450;
`;

const ScenarioCardMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const Duration = styled.span`
  color: rgba(15,23,42,0.62);
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 0.35rem;
`;

const StartLabel = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: #22c55e;
  font-weight: 600;
  font-size: 0.9rem;
  svg { font-size: 0.7rem; }
`;

const GoalsWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
`;

const GoalTag = styled.span`
  padding: 0.2rem 0.6rem;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 600;
  background: rgba(34,197,94,0.1);
  color: #22c55e;
  border: 1px solid rgba(34,197,94,0.2);
`;

const BuilderHero = styled(motion.div)`
  margin-bottom: 1.25rem;
  padding: 1.25rem;
  border-radius: 16px;
  border: 1px solid rgba(56,189,248,0.3);
  background: linear-gradient(130deg, rgba(34,197,94,0.12), #ffffff);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
`;

const BuilderCtaBtn = styled.button`
  border: none;
  border-radius: 10px;
  background: linear-gradient(120deg, #22c55e, #16a34a);
  color: white;
  font-weight: 700;
  font-size: 0.9rem;
  padding: 0.7rem 1rem;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  cursor: pointer;
  transition: transform 0.2s ease;
  &:hover {
    transform: translateY(-2px);
  }
`;

const FilterBar = styled.div`
  margin-bottom: 1.25rem;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.8rem;
  align-items: center;

  @media (max-width: 880px) {
    grid-template-columns: 1fr;
  }
`;

const FilterSearch = styled.div`
  display: flex;
  align-items: center;
  gap: 0.55rem;
  border-radius: 10px;
  border: 1px solid rgba(15,23,42,0.14);
  background: #ffffff;
  padding: 0.6rem 0.8rem;
`;

const FilterInput = styled.input`
  border: none;
  background: transparent;
  color: #0f172a;
  width: 100%;
  font-size: 0.85rem;
  outline: none;
  &::placeholder { color: rgba(15,23,42,0.4); }
`;

const FilterChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
`;

const FilterChip = styled.button`
  border: 1px solid ${p => p.$active ? 'rgba(34,197,94,0.45)' : 'rgba(15,23,42,0.16)'};
  background: ${p => p.$active ? 'rgba(34,197,94,0.16)' : '#ffffff'};
  color: ${p => p.$active ? '#15803d' : 'rgba(15,23,42,0.72)'};
  border-radius: 999px;
  padding: 0.35rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
`;

const SectionHeader = styled.div`
  margin: 1rem 0 0.9rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.8rem;
  flex-wrap: wrap;
`;

const SectionTitle = styled.h3`
  color: #0f172a;
  font-size: 1rem;
  letter-spacing: -0.01em;
`;

const SectionHint = styled.p`
  color: rgba(15,23,42,0.6);
  font-size: 0.78rem;
`;

const BuilderShell = styled(motion.div)`
  background: #ffffff;
  border: 1px solid rgba(15,23,42,0.12);
  border-radius: 16px;
  padding: 1rem;
`;

const BuilderHead = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`;

const BuilderTitle = styled.h2`
  color: #0f172a;
  font-size: 1.35rem;
  font-weight: 800;
`;

const Stepper = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const StepPill = styled.div`
  border-radius: 999px;
  padding: 0.3rem 0.65rem;
  font-size: 0.72rem;
  font-weight: 700;
  color: ${p => p.$active ? '#15803d' : 'rgba(15,23,42,0.65)'};
  border: 1px solid ${p => p.$active ? 'rgba(34,197,94,0.45)' : 'rgba(15,23,42,0.16)'};
  background: ${p => p.$active ? 'rgba(34,197,94,0.14)' : '#ffffff'};
`;

const BuilderGrid = styled.div`
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 0.9rem;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

const BuilderPanel = styled.div`
  border: 1px solid rgba(15,23,42,0.12);
  border-radius: 12px;
  background: #ffffff;
  padding: 0.9rem;
`;

const OptionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
  gap: 0.6rem;
`;

const OptionCard = styled.button`
  border: 1px solid ${p => p.$active ? 'rgba(56,189,248,0.5)' : 'rgba(15,23,42,0.14)'};
  background: ${p => p.$active ? 'rgba(56,189,248,0.14)' : '#ffffff'};
  color: #0f172a;
  border-radius: 10px;
  padding: 0.7rem;
  text-align: left;
  cursor: pointer;
  transition: 0.2s ease;
  &:hover { border-color: rgba(56,189,248,0.35); }
`;

const BuilderTextInput = styled.input`
  width: 100%;
  border-radius: 10px;
  border: 1px solid rgba(15,23,42,0.14);
  background: #ffffff;
  color: #0f172a;
  padding: 0.62rem 0.72rem;
  font-size: 0.85rem;
  outline: none;
`;

const BuilderTextArea = styled.textarea`
  width: 100%;
  min-height: 84px;
  resize: vertical;
  border-radius: 10px;
  border: 1px solid rgba(15,23,42,0.14);
  background: #ffffff;
  color: #0f172a;
  padding: 0.62rem 0.72rem;
  font-size: 0.85rem;
  outline: none;
`;

const BuilderRange = styled.input`
  width: 100%;
`;

const AssetGrid = styled.div`
  max-height: 250px;
  overflow-y: auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 0.45rem;
  padding-right: 0.25rem;
`;

const AssetChip = styled.button`
  border: 1px solid ${p => p.$active ? 'rgba(34,197,94,0.48)' : 'rgba(15,23,42,0.14)'};
  background: ${p => p.$active ? 'rgba(34,197,94,0.14)' : '#ffffff'};
  color: ${p => p.$active ? '#166534' : 'rgba(15,23,42,0.82)'};
  border-radius: 8px;
  padding: 0.45rem 0.55rem;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  text-align: left;
`;

const ObjectiveCard = styled.button`
  width: 100%;
  border: 1px solid ${p => p.$active ? 'rgba(34,197,94,0.5)' : 'rgba(15,23,42,0.14)'};
  background: ${p => p.$active ? 'rgba(34,197,94,0.14)' : '#ffffff'};
  color: #0f172a;
  border-radius: 10px;
  padding: 0.6rem;
  cursor: pointer;
  text-align: left;
`;

const BuilderActions = styled.div`
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.7rem;
  flex-wrap: wrap;
`;

const BtnGroup = styled.div`
  display: inline-flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const SecondaryBtn = styled.button`
  border: 1px solid rgba(15,23,42,0.16);
  background: rgba(15,23,42,0.05);
  color: #0f172a;
  border-radius: 10px;
  padding: 0.55rem 0.85rem;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
`;

const PrimaryBtn = styled.button`
  border: none;
  background: linear-gradient(120deg, #22c55e, #16a34a);
  color: white;
  border-radius: 10px;
  padding: 0.55rem 0.9rem;
  font-size: 0.8rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  cursor: pointer;
  &:disabled { opacity: 0.45; cursor: not-allowed; }
`;

const PreviewCard = styled.div`
  border: 1px solid rgba(56,189,248,0.35);
  background: rgba(56,189,248,0.08);
  border-radius: 12px;
  padding: 0.85rem;
`;

/* ======= Active Simulation Styles ======= */

const SimContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 1.5rem;
  display: grid;
  grid-template-columns: 65% 35%;
  gap: 1.25rem;
  min-height: calc(100vh - 60px);

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  @media (max-width: 480px) {
    padding: 1rem;
    gap: 0.85rem;
  }
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const ScenarioBar = styled(motion.div)`
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 14px;
  padding: 1rem 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

const BarIcon = styled.span`font-size: 1.5rem;`;

const BarTitle = styled.h2`
  font-size: 1.15rem;
  font-weight: 700;
  color: white;
  flex: 1;
`;

const ExitButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1rem;
  background: rgba(239,68,68,0.08);
  border: 1px solid rgba(239,68,68,0.2);
  border-radius: 8px;
  color: #dc2626;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  &:hover { background: rgba(239,68,68,0.15); }
`;

const BalanceBar = styled(motion.div)`
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 14px;
  padding: 1rem 1.25rem;
  display: flex;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    gap: 1rem;
    padding: 0.85rem 1rem;
  }
`;

const BalanceStat = styled.div`min-width: 100px;`;
const BalanceLabel = styled.div`font-size:0.65rem;color:rgba(255,255,255,0.35);text-transform:uppercase;font-weight:700;letter-spacing:0.8px;margin-bottom:0.15rem;`;
const BalanceValue = styled.div`font-size:1.2rem;font-weight:800;color:${p => p.$color || 'white'};`;

const Card = styled(motion.div)`
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 14px;
  overflow: hidden;
`;

const CardHead = styled.div`
  padding: 0.85rem 1.25rem;
  border-bottom: 1px solid rgba(255,255,255,0.04);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CardLabel = styled.h3`
  font-size: 0.8rem;
  font-weight: 700;
  color: rgba(255,255,255,0.7);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  svg { color: #22c55e; }
`;

const CardBody = styled.div`padding: 1.25rem;`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
  margin-bottom: 0.75rem;
`;

const SearchInput = styled.input`
  border: none;
  background: none;
  outline: none;
  font-size: 0.85rem;
  color: white;
  width: 100%;
  &::placeholder { color: rgba(255,255,255,0.25); }
`;

const StockGrid = styled.div`
  max-height: 200px;
  overflow-y: auto;
  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb { background: #c5c5c5; border-radius: 4px; }
`;

const StockRow = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.4rem;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 6px;
  &:hover { background: rgba(34,197,94,0.06); }
  ${p => p.$active && `background: rgba(34,197,94,0.08); border-left: 3px solid #22c55e;`}
`;

const StockSymbol = styled.div`font-weight:700;color:white;font-size:0.85rem;`;
const StockName = styled.div`color:rgba(255,255,255,0.35);font-size:0.7rem;`;
const PriceVal = styled.div`font-weight:700;color:white;font-size:0.85rem;text-align:right;`;
const PriceChg = styled.div`
  font-size:0.7rem;font-weight:600;text-align:right;
  color:${p => p.$pos ? '#4ade80' : '#f87171'};
`;

const DetailSection = styled(motion.div)`
  margin-top: 0.75rem;
`;

const BigPrice = styled.div`font-size:1.5rem;font-weight:800;color:white;`;
const BigChange = styled.div`font-size:0.85rem;font-weight:600;color:${p => p.$pos ? '#4ade80' : '#f87171'};display:flex;align-items:center;gap:0.3rem;`;

const ChartWrap = styled.div`height:160px;margin: 0.75rem -0.5rem 0;`;

const MetricsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
  margin: 0.75rem 0;
`;

const MetricBox = styled.div`
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 8px;
  padding: 0.5rem;
  text-align: center;
`;

const MetricLabel = styled.div`font-size:0.6rem;color:rgba(255,255,255,0.3);text-transform:uppercase;font-weight:600;`;
const MetricValue = styled.div`font-size:0.85rem;font-weight:700;color:white;`;

const TradeForm = styled.div`
  background: rgba(34,197,94,0.06);
  border: 1px solid rgba(34,197,94,0.2);
  border-radius: 10px;
  padding: 1rem;
  margin-top: 0.75rem;
`;

const TradeRow = styled.div`display:flex;gap:0.5rem;margin-bottom:0.5rem;`;

const TradeInput = styled.input`
  flex: 1;
  padding: 0.6rem 0.8rem;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  background: rgba(255,255,255,0.04);
  color: white;
  outline: none;
  &:focus { border-color: #22c55e; }
`;

const TradeBtn = styled.button`
  padding: 0.6rem 1.25rem;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.85rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  &:disabled { opacity: 0.4; cursor: not-allowed; }
`;

const BuyBtn = styled(TradeBtn)`
  background: #22c55e;
  color: white;
  &:hover:not(:disabled) { background: #16a34a; }
`;

const SellBtn = styled(TradeBtn)`
  background: rgba(239,68,68,0.15);
  color: #f87171;
  border: 1px solid rgba(239,68,68,0.2);
  &:hover:not(:disabled) { background: rgba(239,68,68,0.25); }
`;

const TradeCost = styled.div`
  text-align: right;
  font-size: 0.8rem;
  color: rgba(255,255,255,0.4);
  span { font-weight: 700; color: white; }
`;

const HoldingsTable = styled.div`
  max-height: 180px;
  overflow-y: auto;
  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb { background: #c5c5c5; border-radius: 4px; }
`;

const HoldingRow = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  &:last-child { border-bottom: none; }
  &:hover { background: rgba(34,197,94,0.04); }
`;

const HoldingSym = styled.div`font-weight:700;color:white;font-size:0.85rem;`;
const HoldingShares = styled.div`color:rgba(255,255,255,0.3);font-size:0.7rem;`;
const HoldingValue = styled.div`font-weight:700;color:white;font-size:0.85rem;text-align:right;`;

const EmptyState = styled.div`
  text-align: center;
  padding: 1.5rem;
  color: rgba(255,255,255,0.25);
  font-size: 0.85rem;
`;

/* ======= AI Advisor Panel ======= */

const AdvisorHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.85rem 1.25rem;
  border-bottom: 1px solid rgba(255,255,255,0.04);
  svg { color: #22c55e; font-size: 1.1rem; }
`;

const AdvisorTitle = styled.h3`
  font-size: 0.9rem;
  font-weight: 700;
  color: white;
`;

const ObjectivesList = styled.div`
  padding: 1rem 1.25rem;
  border-bottom: 1px solid rgba(255,255,255,0.04);
`;

const ObjectivesCounter = styled.div`
  font-size: 0.75rem;
  font-weight: 700;
  color: #22c55e;
  margin-bottom: 0.6rem;
`;

const ObjectiveItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0;
  font-size: 0.8rem;
  color: ${p => p.$done ? '#4ade80' : 'rgba(255,255,255,0.5)'};
  font-weight: ${p => p.$done ? '600' : '400'};
  transition: color 0.3s;
`;

const CheckIcon = styled.span`
  font-size: 0.85rem;
  color: ${p => p.$done ? '#22c55e' : 'rgba(255,255,255,0.15)'};
  display: flex;
  align-items: center;
`;

const MessagesArea = styled.div`
  flex: 1;
  min-height: 250px;
  max-height: 400px;
  overflow-y: auto;
  padding: 1rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
`;

const MessageBubble = styled(motion.div)`
  background: ${p => p.$isAi ? 'rgba(255,255,255,0.05)' : 'rgba(34,197,94,0.08)'};
  border: 1px solid ${p => p.$isAi ? 'rgba(255,255,255,0.12)' : 'rgba(34,197,94,0.15)'};
  border-radius: 12px;
  padding: 1rem 1.15rem;
  font-size: 1rem;
  color: rgba(255,255,255,0.85);
  line-height: 1.7;
  font-weight: 450;
`;

const MessageTime = styled.div`
  font-size: 0.65rem;
  color: rgba(255,255,255,0.2);
  margin-top: 0.5rem;
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
`;

const TypingIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.85rem 1rem;
  background: rgba(34,197,94,0.1);
  border: 1px solid rgba(34,197,94,0.2);
  border-radius: 12px;
  width: fit-content;
`;

const Dot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #22c55e;
  animation: ${pulse} 1.2s ease-in-out infinite;
  animation-delay: ${p => p.$d || '0s'};
`;

const QuickActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  padding: 0.75rem 1.25rem;
  border-top: 1px solid rgba(255,255,255,0.04);
`;

const QuickBtn = styled.button`
  padding: 0.4rem 0.75rem;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 600;
  background: rgba(34,197,94,0.1);
  color: #22c55e;
  border: 1px solid rgba(34,197,94,0.2);
  cursor: pointer;
  transition: all 0.2s;
  &:hover { background: rgba(34,197,94,0.2); }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
`;

const InputRow = styled.div`
  display: flex;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border-top: 1px solid rgba(255,255,255,0.04);
`;

const ChatInput = styled.input`
  flex: 1;
  padding: 0.6rem 0.8rem;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 8px;
  background: rgba(255,255,255,0.04);
  color: white;
  font-size: 0.85rem;
  outline: none;
  &:focus { border-color: #22c55e; }
  &::placeholder { color: rgba(255,255,255,0.2); }
`;

const SendBtn = styled.button`
  padding: 0.6rem 0.85rem;
  border-radius: 8px;
  background: #22c55e;
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.2s;
  &:hover { background: #16a34a; }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
`;

/* ======= Completion Modal ======= */

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
`;

const ModalContent = styled(motion.div)`
  background: #111827;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 20px;
  padding: 2.5rem;
  max-width: 600px;
  width: 100%;
  max-height: 85vh;
  overflow-y: auto;
  text-align: center;
  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
`;

const confettiFloat = keyframes`
  0% { transform: translateY(0) rotate(0deg); opacity: 1; }
  100% { transform: translateY(-200px) rotate(720deg); opacity: 0; }
`;

const CelebrationEmoji = styled.div`
  font-size: 3.5rem;
  margin-bottom: 1rem;
  animation: ${confettiFloat} 2s ease-out;
  animation-fill-mode: forwards;
  animation-iteration-count: 1;
`;

const ModalTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 800;
  color: white;
  margin-bottom: 0.5rem;
`;

const ModalSubtitle = styled.p`
  color: rgba(255,255,255,0.5);
  font-size: 1rem;
  margin-bottom: 1.5rem;
`;

const ReviewText = styled.div`
  text-align: left;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 12px;
  padding: 1.25rem;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  color: rgba(255,255,255,0.8);
  line-height: 1.7;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`;

const StatBox = styled.div`
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 10px;
  padding: 1rem;
`;

const StatNum = styled.div`font-size:1.3rem;font-weight:800;color:${p => p.$color || 'white'};`;
const StatDesc = styled.div`font-size:0.7rem;color:rgba(255,255,255,0.35);text-transform:uppercase;font-weight:600;margin-top:0.2rem;`;

const LearningsSection = styled.div`
  text-align: left;
  margin-bottom: 1.5rem;
`;

const LearningTitle = styled.h4`
  font-size: 1.1rem;
  font-weight: 800;
  color: white;
  margin-bottom: 0.85rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  letter-spacing: -0.01em;
  svg { color: #f59e0b; font-size: 1rem; }
`;

const LearningItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.3rem 0;
  font-size: 0.85rem;
  color: rgba(255,255,255,0.6);
  svg { color: #22c55e; font-size: 0.7rem; }
`;

const TryAgainBtn = styled.button`
  padding: 0.85rem 2rem;
  background: #22c55e;
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(34,197,94,0.3);
  &:hover {
    background: #16a34a;
    transform: translateY(-2px);
  }
`;

const Notification = styled(motion.div)`
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background: #0f172a;
  border: 1px solid ${p => p.$type === 'success' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'};
  color: white;
  padding: 0.7rem 1.25rem;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 600;
  box-shadow: 0 8px 30px rgba(0,0,0,0.4);
  z-index: 1001;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

function formatAIText(text) {
  if (!text) return '';
  let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  formatted = formatted.replace(/\n/g, '<br/>');
  return formatted;
}

function timeNow() {
  return new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

const BUILDER_STEPS = ['Theme', 'Setup', 'Assets', 'Objectives', 'Preview'];

const BUILDER_THEMES = [
  { id: 'future-self', title: 'Future Self Plan', desc: 'Build wealth for a life goal.', emoji: '🧭', goal: 'long-term planning and balanced growth' },
  { id: 'volatility', title: 'Volatility Storm', desc: 'Stay rational during chaos.', emoji: '🌪️', goal: 'risk control and discipline under pressure' },
  { id: 'income', title: 'Income Machine', desc: 'Generate recurring cashflow.', emoji: '💸', goal: 'income investing and dividend quality' },
  { id: 'global', title: 'Global Macro Mix', desc: 'Diversify across asset classes.', emoji: '🌍', goal: 'multi-asset diversification and hedging' },
];

const NARRATIVE_STYLES = ['Coach-style', 'Story-based', 'Data-driven', 'Challenge mode'];

const OBJECTIVE_LIBRARY = [
  { id: 'first-trade', label: 'Make first purchase', hint: 'Gets the user into action quickly', rule: { type: 'holdings_count_min', min: 1 } },
  { id: 'diversify-3', label: 'Own 3 different positions', hint: 'Basic diversification discipline', rule: { type: 'holdings_count_min', min: 3 } },
  { id: 'sectors-2', label: 'Invest across 2 sectors', hint: 'Reduces concentration risk', rule: { type: 'sectors_min', min: 2 } },
  { id: 'invest-60', label: 'Invest at least 60% cash', hint: 'Encourages capital deployment', rule: { type: 'invest_percent_min', minPercent: 60 } },
  { id: 'single-cap', label: 'No single position > 40%', hint: 'Position sizing guardrail', rule: { type: 'single_position_max', maxPercent: 40 } },
  { id: 'dividend', label: 'Buy a dividend asset (>2%)', hint: 'Income lens', rule: { type: 'dividend_stock_min', minDividend: 2 } },
];

function createBuilderState() {
  const starterTheme = BUILDER_THEMES[0];
  return {
    themeId: starterTheme.id,
    topic: starterTheme.title,
    goal: starterTheme.goal,
    emoji: starterTheme.emoji,
    narrativeStyle: NARRATIVE_STYLES[0],
    challengeLevel: 'Beginner',
    duration: '15 min',
    startingBalance: 10000,
    selectedAssets: ['AAPL', 'MSFT', 'SPY', 'BND'],
    objectiveFocus: ['first-trade', 'diversify-3', 'invest-60'],
    customFlavor: '',
  };
}

function evaluateObjectiveRule(rule, currentHoldings, currentBalance, scenario) {
  if (!rule || typeof rule !== 'object') return false;
  const totalValue = scenario.startingBalance > 0
    ? scenario.startingBalance
    : currentHoldings.reduce((sum, holding) => sum + (holding.marketValue || 0), 0) + currentBalance;
  const bySymbol = new Map(stocks.map((stock) => [stock.symbol, stock]));

  switch (rule.type) {
    case 'holdings_count_min':
      return currentHoldings.length >= (Number(rule.min) || 1);
    case 'sectors_min': {
      const sectors = new Set(
        currentHoldings
          .map((holding) => bySymbol.get(holding.symbol)?.sector)
          .filter(Boolean)
      );
      return sectors.size >= (Number(rule.min) || 1);
    }
    case 'invest_percent_min': {
      const minPercent = Number(rule.minPercent) || 50;
      const invested = totalValue - currentBalance;
      return totalValue > 0 && (invested / totalValue) * 100 >= minPercent;
    }
    case 'stock_in_portfolio':
      return currentHoldings.some((holding) => holding.symbol === rule.symbol);
    case 'sector_holdings_min': {
      const min = Number(rule.min) || 1;
      const count = currentHoldings.filter((holding) => bySymbol.get(holding.symbol)?.sector === rule.sector).length;
      return count >= min;
    }
    case 'dividend_stock_min': {
      const minDividend = Number(rule.minDividend) || 1;
      return currentHoldings.some((holding) => (bySymbol.get(holding.symbol)?.dividend || 0) >= minDividend);
    }
    case 'pe_condition_any': {
      const target = Number(rule.value) || 20;
      const compare = {
        gte: (pe) => pe >= target,
        lte: (pe) => pe <= target,
        gt: (pe) => pe > target,
        lt: (pe) => pe < target,
      }[rule.operator || 'gte'];
      return currentHoldings.some((holding) => {
        const pe = bySymbol.get(holding.symbol)?.pe;
        return typeof pe === 'number' && compare(pe);
      });
    }
    case 'single_position_max': {
      const maxPercent = Number(rule.maxPercent) || 40;
      const total = currentHoldings.reduce((sum, holding) => {
        const stock = bySymbol.get(holding.symbol);
        return sum + ((stock?.price || 0) * holding.shares);
      }, 0) + currentBalance;
      if (total <= 0 || currentHoldings.length === 0) return false;
      return currentHoldings.every((holding) => {
        const stock = bySymbol.get(holding.symbol);
        const positionValue = (stock?.price || 0) * holding.shares;
        return (positionValue / total) * 100 <= maxPercent;
      });
    }
    default:
      return false;
  }
}

const ProGate = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 16px;
  max-width: 500px;
  margin: 2rem auto;
`;

const ProGateTitle = styled.h2`
  font-family: 'Space Grotesk', sans-serif;
  color: white;
  font-size: 1.5rem;
  margin-bottom: 0.75rem;
`;

const ProGateText = styled.p`
  color: rgba(255,255,255,0.5);
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

const ProGateBtn = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #22c55e;
  color: white;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.9rem;
  text-decoration: none;
  transition: all 0.3s;
  &:hover { background: #16a34a; transform: translateY(-2px); }
`;

const ScenarioPage = () => {
  const { user, isPro } = useAuth();
  const [view, setView] = useState('select');
  const [activeScenario, setActiveScenario] = useState(null);
  const [balance, setBalance] = useState(0);
  const [holdings, setHoldings] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [messages, setMessages] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [customQuestion, setCustomQuestion] = useState('');
  const [completedObjectives, setCompletedObjectives] = useState([]);
  const [showCompletion, setShowCompletion] = useState(false);
  const [completionReview, setCompletionReview] = useState('');
  const [notification, setNotification] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [catalogQuery, setCatalogQuery] = useState('');
  const [catalogFilter, setCatalogFilter] = useState('All');
  const [customScenarios, setCustomScenarios] = useState([]);
  const [customScenariosLoading, setCustomScenariosLoading] = useState(false);
  const [builderStep, setBuilderStep] = useState(0);
  const [builder, setBuilder] = useState(createBuilderState);
  const [builderGenerating, setBuilderGenerating] = useState(false);
  const [builderSaving, setBuilderSaving] = useState(false);
  const [builderPreview, setBuilderPreview] = useState(null);

  const messagesEndRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, aiLoading, scrollToBottom]);

  useEffect(() => {
    let cancelled = false;
    if (!isPro || !user) {
      setCustomScenarios([]);
      return () => {
        cancelled = true;
      };
    }

    const loadCustomScenarios = async () => {
      setCustomScenariosLoading(true);
      try {
        const result = await api.getCustomScenarios();
        if (!cancelled) {
          setCustomScenarios(result.scenarios || []);
        }
      } catch (err) {
        if (!cancelled) setCustomScenarios([]);
      } finally {
        if (!cancelled) setCustomScenariosLoading(false);
      }
    };

    loadCustomScenarios();
    return () => {
      cancelled = true;
    };
  }, [isPro, user]);

  const showNotif = useCallback((msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const checkObjectives = useCallback((currentHoldings, currentBalance, scenario = activeScenario) => {
    if (!scenario?.objectives?.length) return [];
    const done = scenario.objectives
      .filter((obj) => {
        if (typeof obj.check === 'function') {
          return obj.check(currentHoldings, stocks, currentBalance);
        }
        if (obj.rule) {
          return evaluateObjectiveRule(obj.rule, currentHoldings, currentBalance, scenario);
        }
        return false;
      })
      .map((obj) => obj.id);
    return done;
  }, [activeScenario]);

  const getPortfolioSummary = useCallback(() => {
    const invested = holdings.reduce((sum, h) => {
      const stock = stocks.find(s => s.symbol === h.symbol);
      return sum + (stock ? stock.price * h.shares : 0);
    }, 0);
    return { balance, holdings, invested, total: balance + invested };
  }, [balance, holdings]);

  const getObjectivesSummary = useCallback(() => {
    if (!activeScenario) return { completed: [], remaining: [] };
    const completed = activeScenario.objectives
      .filter(o => completedObjectives.includes(o.id))
      .map(o => o.label);
    const remaining = activeScenario.objectives
      .filter(o => !completedObjectives.includes(o.id))
      .map(o => o.label);
    return { completed, remaining };
  }, [activeScenario, completedObjectives]);

  const addAiMessage = useCallback((text) => {
    setMessages(prev => [...prev, { text, isAi: true, time: timeNow() }]);
  }, []);

  const addUserMessage = useCallback((text) => {
    setMessages(prev => [...prev, { text, isAi: false, time: timeNow() }]);
  }, []);

  const callAdvisor = useCallback(async (action, details = {}) => {
    if (!activeScenario) return;
    setAiLoading(true);
    try {
      const result = await api.getScenarioAdvice(
        action,
        activeScenario.title,
        details,
        getPortfolioSummary(),
        getObjectivesSummary()
      );
      addAiMessage(result.advice);
    } catch (err) {
      addAiMessage("I'm having trouble connecting right now. Let me know if you'd like to try again!");
    } finally {
      setAiLoading(false);
    }
  }, [activeScenario, getPortfolioSummary, getObjectivesSummary, addAiMessage]);

  const startScenario = useCallback(async (scenario) => {
    if (!isPro) return;
    setActiveScenario(scenario);
    setBalance(scenario.startingBalance);
    setHoldings([]);
    setTransactions([]);
    setMessages([]);
    setCompletedObjectives([]);
    setSelectedStock(null);
    setQuantity('');
    setShowCompletion(false);
    setCompletionReview('');
    setSearchQuery('');
    setView('sim');

    setAiLoading(true);
    try {
      const objectiveLabels = scenario.objectives.map(o => o.label);
      const result = await api.getScenarioAdvice(
        'START_SCENARIO',
        scenario.title,
        {},
        { balance: scenario.startingBalance, holdings: [], invested: 0 },
        { completed: [], remaining: objectiveLabels }
      );
      setMessages([{ text: result.advice, isAi: true, time: timeNow() }]);
    } catch (err) {
      setMessages([{
        text: `🎓 **Welcome to: ${scenario.title}**\n\n${scenario.briefing}\n\n💰 You have **$${scenario.startingBalance.toLocaleString()}** in virtual cash to invest.\n\n📋 **Your learning objectives are on the left** — I'll help you complete each one and explain the concepts as you go.\n\nI'm your AI tutor — I'll explain every trade you make, teach you the concepts behind your decisions, and guide you step by step. **Let's start!** Click on a stock from the list to begin.`,
        isAi: true,
        time: timeNow(),
      }]);
    } finally {
      setAiLoading(false);
    }
  }, [isPro]);

  const resetBuilder = useCallback(() => {
    setBuilderStep(0);
    setBuilder(createBuilderState());
    setBuilderPreview(null);
  }, []);

  const goToBuilder = useCallback(() => {
    resetBuilder();
    setView('builder');
  }, [resetBuilder]);

  const updateBuilder = useCallback((key, value) => {
    setBuilder((prev) => ({ ...prev, [key]: value }));
  }, []);

  const toggleBuilderAsset = useCallback((symbol) => {
    setBuilder((prev) => {
      const exists = prev.selectedAssets.includes(symbol);
      const nextAssets = exists
        ? prev.selectedAssets.filter((item) => item !== symbol)
        : [...prev.selectedAssets, symbol];
      return { ...prev, selectedAssets: nextAssets.slice(0, 16) };
    });
  }, []);

  const toggleBuilderObjective = useCallback((objectiveId) => {
    setBuilder((prev) => {
      const exists = prev.objectiveFocus.includes(objectiveId);
      const next = exists
        ? prev.objectiveFocus.filter((item) => item !== objectiveId)
        : [...prev.objectiveFocus, objectiveId];
      return { ...prev, objectiveFocus: next.slice(0, 6) };
    });
  }, []);

  const applyTheme = useCallback((theme) => {
    setBuilder((prev) => ({
      ...prev,
      themeId: theme.id,
      topic: theme.title,
      goal: theme.goal,
      emoji: theme.emoji,
    }));
  }, []);

  const generateBuilderScenario = useCallback(async () => {
    if (builder.selectedAssets.length < 2) {
      showNotif('Select at least 2 assets for your scenario.', 'error');
      return;
    }
    setBuilderGenerating(true);
    try {
      const objectiveFocus = OBJECTIVE_LIBRARY
        .filter((item) => builder.objectiveFocus.includes(item.id))
        .map((item) => ({
          id: item.id,
          label: item.label,
          rule: item.rule,
        }));
      const result = await api.generateCustomScenario({
        ...builder,
        objectiveFocus,
      });
      setBuilderPreview(result.scenario);
      setBuilderStep(4);
      showNotif('Scenario draft generated with AI.');
    } catch (err) {
      showNotif(err.message || 'Failed to generate scenario draft.', 'error');
    } finally {
      setBuilderGenerating(false);
    }
  }, [builder, showNotif]);

  const saveBuilderScenario = useCallback(async () => {
    if (!builderPreview) return;
    setBuilderSaving(true);
    try {
      const result = await api.saveCustomScenario(builderPreview);
      const saved = result.scenario;
      setBuilderPreview(saved);
      setCustomScenarios((prev) => {
        const exists = prev.some((item) => item.dbId === saved.dbId);
        return exists
          ? prev.map((item) => (item.dbId === saved.dbId ? saved : item))
          : [saved, ...prev];
      });
      showNotif('Scenario saved to your library.');
    } catch (err) {
      showNotif(err.message || 'Could not save scenario.', 'error');
    } finally {
      setBuilderSaving(false);
    }
  }, [builderPreview, showNotif]);

  const handleBuy = useCallback(async () => {
    if (!selectedStock || !quantity || parseInt(quantity) <= 0) return;
    const shares = parseInt(quantity);
    const stock = stocks.find(s => s.symbol === selectedStock.symbol);
    if (!stock) return;
    const total = stock.price * shares;
    if (total > balance) {
      showNotif('Insufficient funds!', 'error');
      return;
    }

    const newBalance = balance - total;
    setBalance(newBalance);

    const existing = holdings.find(h => h.symbol === stock.symbol);
    let newHoldings;
    if (existing) {
      newHoldings = holdings.map(h =>
        h.symbol === stock.symbol
          ? { ...h, shares: h.shares + shares, avgPrice: ((h.avgPrice * h.shares) + total) / (h.shares + shares) }
          : h
      );
    } else {
      newHoldings = [...holdings, { symbol: stock.symbol, shares, avgPrice: stock.price }];
    }
    setHoldings(newHoldings);
    setTransactions(prev => [...prev, { type: 'BUY', symbol: stock.symbol, shares, price: stock.price, time: timeNow() }]);
    setQuantity('');
    showNotif(`Bought ${shares} shares of ${stock.symbol}`);

    addUserMessage(`Bought ${shares} shares of ${stock.symbol} at $${stock.price.toFixed(2)}`);

    const newCompleted = checkObjectives(newHoldings, newBalance);
    setCompletedObjectives(newCompleted);

    const allDone = activeScenario && newCompleted.length === activeScenario.objectives.length;

    if (allDone) {
      setAiLoading(true);
      try {
        const invested = newHoldings.reduce((sum, h) => {
          const s = stocks.find(st => st.symbol === h.symbol);
          return sum + (s ? s.price * h.shares : 0);
        }, 0);
        const result = await api.getScenarioAdvice(
          'COMPLETE_SCENARIO',
          activeScenario.title,
          { symbol: stock.symbol, name: stock.name, shares, price: stock.price, total, sector: stock.sector, pe: stock.pe, dividend: stock.dividend },
          { balance: newBalance, holdings: newHoldings, invested },
          { completed: activeScenario.objectives.map(o => o.label), remaining: [] }
        );
        addAiMessage(result.advice);
        setCompletionReview(result.advice);
        setTimeout(() => setShowCompletion(true), 1200);
      } catch (err) {
        setCompletionReview('Congratulations on completing the scenario! You demonstrated great investing skills.');
        setTimeout(() => setShowCompletion(true), 1200);
      } finally {
        setAiLoading(false);
      }
    } else {
      callAdvisor('BUY_STOCK', {
        symbol: stock.symbol,
        name: stock.name,
        shares,
        price: stock.price,
        total,
        sector: stock.sector,
        pe: stock.pe,
        dividend: stock.dividend,
      });
    }
  }, [selectedStock, quantity, balance, holdings, activeScenario, checkObjectives, showNotif, addUserMessage, addAiMessage, callAdvisor]);

  const handleSell = useCallback(async () => {
    if (!selectedStock || !quantity || parseInt(quantity) <= 0) return;
    const shares = parseInt(quantity);
    const stock = stocks.find(s => s.symbol === selectedStock.symbol);
    if (!stock) return;

    const holding = holdings.find(h => h.symbol === stock.symbol);
    if (!holding || holding.shares < shares) {
      showNotif('Not enough shares to sell!', 'error');
      return;
    }

    const total = stock.price * shares;
    const newBalance = balance + total;
    setBalance(newBalance);

    let newHoldings;
    if (holding.shares === shares) {
      newHoldings = holdings.filter(h => h.symbol !== stock.symbol);
    } else {
      newHoldings = holdings.map(h =>
        h.symbol === stock.symbol ? { ...h, shares: h.shares - shares } : h
      );
    }
    setHoldings(newHoldings);
    setTransactions(prev => [...prev, { type: 'SELL', symbol: stock.symbol, shares, price: stock.price, time: timeNow() }]);
    setQuantity('');
    showNotif(`Sold ${shares} shares of ${stock.symbol}`);

    addUserMessage(`Sold ${shares} shares of ${stock.symbol} at $${stock.price.toFixed(2)}`);

    const newCompleted = checkObjectives(newHoldings, newBalance);
    setCompletedObjectives(newCompleted);

    callAdvisor('SELL_STOCK', {
      symbol: stock.symbol,
      name: stock.name,
      shares,
      price: stock.price,
      total,
    });
  }, [selectedStock, quantity, balance, holdings, checkObjectives, showNotif, addUserMessage, callAdvisor]);

  const handleQuickAction = useCallback(async (action) => {
    if (aiLoading) return;
    if (action === 'advice') {
      addUserMessage('What should I buy next?');
      callAdvisor('ASK_ADVICE', { question: 'What stock should I buy next and why?' });
    } else if (action === 'progress') {
      addUserMessage('Check my progress');
      callAdvisor('CHECK_PROGRESS');
    } else if (action === 'explain') {
      if (selectedStock) {
        addUserMessage(`Tell me about ${selectedStock.symbol}`);
        callAdvisor('ASK_ADVICE', { question: `Explain ${selectedStock.symbol} (${selectedStock.name}) - is it a good pick for this scenario? What are the risks and benefits?` });
      } else {
        showNotif('Select a stock first!', 'error');
      }
    }
  }, [aiLoading, selectedStock, addUserMessage, callAdvisor, showNotif]);

  const handleCustomQuestion = useCallback(async () => {
    if (!customQuestion.trim() || aiLoading) return;
    addUserMessage(customQuestion);
    const q = customQuestion;
    setCustomQuestion('');
    callAdvisor('ASK_ADVICE', { question: q });
  }, [customQuestion, aiLoading, addUserMessage, callAdvisor]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') handleCustomQuestion();
  }, [handleCustomQuestion]);

  const scenarioAssets = activeScenario?.assets;
  const filteredStocks = stocks.filter(s => {
    if (scenarioAssets && !scenarioAssets.includes(s.symbol)) return false;
    return s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.sector.toLowerCase().includes(searchQuery.toLowerCase());
  }
  );

  const portfolioValue = holdings.reduce((sum, h) => {
    const stock = stocks.find(s => s.symbol === h.symbol);
    return sum + (stock ? stock.price * h.shares : 0);
  }, 0);

  const totalValue = balance + portfolioValue;

  const costForQuantity = selectedStock && quantity
    ? (stocks.find(s => s.symbol === selectedStock.symbol)?.price || 0) * parseInt(quantity || 0)
    : 0;

  const currentHolding = selectedStock
    ? holdings.find(h => h.symbol === selectedStock.symbol)
    : null;

  const allScenarios = [...scenarios, ...customScenarios];
  const catalogFilteredScenarios = allScenarios.filter((scenario) => {
    const query = catalogQuery.toLowerCase().trim();
    if (catalogFilter === 'Custom' && !scenario.isCustom) return false;
    if (catalogFilter !== 'All' && catalogFilter !== 'Custom' && scenario.difficulty !== catalogFilter) return false;
    if (!query) return true;
    return (
      scenario.title.toLowerCase().includes(query) ||
      scenario.description.toLowerCase().includes(query) ||
      scenario.learningGoals.some((goal) => goal.toLowerCase().includes(query))
    );
  });
  const selectedTheme = BUILDER_THEMES.find((theme) => theme.id === builder.themeId) || BUILDER_THEMES[0];
  const selectedObjectiveTemplates = OBJECTIVE_LIBRARY.filter((item) => builder.objectiveFocus.includes(item.id));

  /* ======= RENDER: Scenario Selection ======= */
  if (view === 'select') {
    return (
      <PageContainer>
        <ContentWrapper>
          <PageHeader
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <PageTitle>Investment <span style={{color:'#22c55e'}}>Scenarios</span></PageTitle>
            <PageSubtitle style={{maxWidth:760,margin:'0.5rem auto 0'}}>A real investing simulator with guided missions, live portfolio mechanics, and a personal <strong style={{color:'#22c55e'}}>AI tutor</strong>. Build confidence before risking real capital.</PageSubtitle>
          </PageHeader>

          {!isPro && (
            <ProGate>
              <FaLock style={{fontSize:'2rem',color:'rgba(255,255,255,0.15)',marginBottom:'1rem'}} />
              <ProGateTitle>Scenarios require <span style={{color:'#22c55e'}}>Pro</span></ProGateTitle>
              <ProGateText>
                AI-guided scenario simulations are a Pro feature. Upgrade to get real-time GPT-4 coaching, 11 interactive simulations across stocks, crypto, commodities, bonds, and forex.
              </ProGateText>
              <ProGateBtn to="/pricing"><FaCrown /> View Pricing</ProGateBtn>
            </ProGate>
          )}

          {isPro && (
            <BuilderHero
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div>
                <div style={{fontSize:'0.72rem',fontWeight:800,letterSpacing:'0.06em',textTransform:'uppercase',color:'#7dd3fc',marginBottom:'0.35rem'}}>New creator mode</div>
                <div style={{color:'white',fontSize:'1.15rem',fontWeight:800,marginBottom:'0.25rem'}}>Design your own scenario with guided AI blocks</div>
                <div style={{color:'rgba(255,255,255,0.7)',fontSize:'0.86rem'}}>Pick a theme, assets, and learning objectives, then generate a polished scenario you can save and replay.</div>
              </div>
              <BuilderCtaBtn onClick={goToBuilder}>
                <FaMagic /> Create custom scenario
              </BuilderCtaBtn>
            </BuilderHero>
          )}

          <FilterBar>
            <FilterSearch>
              <FaSearch style={{color:'rgba(255,255,255,0.3)',fontSize:'0.8rem'}} />
              <FilterInput
                placeholder="Search scenarios, outcomes, or learning goals..."
                value={catalogQuery}
                onChange={(e) => setCatalogQuery(e.target.value)}
              />
            </FilterSearch>
            <FilterChips>
              {['All', 'Beginner', 'Intermediate', 'Advanced', 'Custom'].map((filter) => (
                <FilterChip
                  key={filter}
                  $active={catalogFilter === filter}
                  onClick={() => setCatalogFilter(filter)}
                >
                  {filter}
                </FilterChip>
              ))}
            </FilterChips>
          </FilterBar>

          <SectionHeader>
            <SectionTitle>
              Scenario Library ({catalogFilteredScenarios.length})
            </SectionTitle>
            <SectionHint>
              {customScenariosLoading ? 'Loading your saved scenarios...' : `${customScenarios.length} custom saved`}
            </SectionHint>
          </SectionHeader>

          {catalogFilteredScenarios.length === 0 ? (
            <Card style={{padding:'1.2rem',textAlign:'center'}}>
              <div style={{color:'rgba(255,255,255,0.75)',fontWeight:700,marginBottom:'0.4rem'}}>No scenarios match your filter yet.</div>
              <div style={{color:'rgba(255,255,255,0.45)',fontSize:'0.85rem'}}>Try a different search term or create your own scenario.</div>
            </Card>
          ) : (
            <ScenariosGrid>
              {catalogFilteredScenarios.map((scenario, idx) => (
                <ScenarioCard
                  key={scenario.id}
                  onClick={() => isPro ? startScenario(scenario) : null}
                  style={{ opacity: isPro ? 1 : 0.5, cursor: isPro ? 'pointer' : 'default' }}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05, type: 'spring', stiffness: 120 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ScenarioCardHeader>
                    <ScenarioIcon>{scenario.icon}</ScenarioIcon>
                    <div style={{display:'flex',gap:'0.35rem',alignItems:'center'}}>
                      {scenario.isCustom && (
                        <DifficultyBadge $color="#38bdf8">Custom</DifficultyBadge>
                      )}
                      <DifficultyBadge $color={difficultyColors[scenario.difficulty]}>
                        {scenario.difficulty}
                      </DifficultyBadge>
                    </div>
                  </ScenarioCardHeader>
                  <ScenarioCardTitle>{scenario.title}</ScenarioCardTitle>
                  <ScenarioCardDesc>{scenario.description}</ScenarioCardDesc>
                  <div style={{background:'rgba(34,197,94,0.08)',border:'1px solid rgba(34,197,94,0.2)',borderRadius:10,padding:'0.65rem 0.85rem',marginBottom:'1rem',display:'flex',alignItems:'flex-start',gap:'0.6rem'}}>
                    <FaRobot style={{color:'#22c55e',flexShrink:0,marginTop:2,fontSize:'0.9rem'}} />
                    <span style={{color:'rgba(255,255,255,0.55)',fontSize:'0.78rem',lineHeight:1.45}}>
                      <strong style={{color:'#22c55e'}}>AI Tutor guides you</strong> with actionable coaching and instant feedback on every decision.
                    </span>
                  </div>
                  <ScenarioCardMeta>
                    <Duration><FaClock /> {scenario.duration}</Duration>
                    <StartLabel><FaPlay /> Start Simulation</StartLabel>
                  </ScenarioCardMeta>
                  <GoalsWrap>
                    {scenario.learningGoals.slice(0, 4).map(g => (
                      <GoalTag key={g}>{g}</GoalTag>
                    ))}
                  </GoalsWrap>
                </ScenarioCard>
              ))}
            </ScenariosGrid>
          )}
        </ContentWrapper>
      </PageContainer>
    );
  }

  if (view === 'builder') {
    const canProceedFromObjectives = builder.objectiveFocus.length >= 2;
    return (
      <PageContainer>
        <ContentWrapper>
          <BuilderShell
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <BuilderHead>
              <div>
                <BuilderTitle><FaMagic style={{marginRight:'0.45rem',color:'#38bdf8'}} />Scenario Creator Studio</BuilderTitle>
                <div style={{color:'rgba(255,255,255,0.5)',fontSize:'0.85rem',marginTop:'0.2rem'}}>Build an interactive scenario with guided cards, then generate a polished draft with OpenAI.</div>
              </div>
              <Stepper>
                {BUILDER_STEPS.map((stepLabel, index) => (
                  <StepPill key={stepLabel} $active={index === builderStep}>{index + 1}. {stepLabel}</StepPill>
                ))}
              </Stepper>
            </BuilderHead>

            <BuilderGrid>
              <BuilderPanel>
                {builderStep === 0 && (
                  <div>
                    <div style={{color:'white',fontWeight:800,marginBottom:'0.65rem'}}>Pick a scenario theme</div>
                    <OptionGrid>
                      {BUILDER_THEMES.map((theme) => (
                        <OptionCard
                          key={theme.id}
                          $active={builder.themeId === theme.id}
                          onClick={() => applyTheme(theme)}
                        >
                          <div style={{fontSize:'1.25rem',marginBottom:'0.25rem'}}>{theme.emoji}</div>
                          <div style={{fontWeight:800,fontSize:'0.86rem'}}>{theme.title}</div>
                          <div style={{fontSize:'0.75rem',color:'rgba(255,255,255,0.58)',marginTop:'0.2rem'}}>{theme.desc}</div>
                        </OptionCard>
                      ))}
                    </OptionGrid>
                    <div style={{marginTop:'0.8rem'}}>
                      <div style={{fontSize:'0.76rem',fontWeight:700,color:'rgba(255,255,255,0.6)',marginBottom:'0.35rem'}}>Optional flavor text</div>
                      <BuilderTextArea
                        value={builder.customFlavor}
                        placeholder="Example: Include a mid-simulation market shock and force risk management decisions."
                        onChange={(e) => updateBuilder('customFlavor', e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {builderStep === 1 && (
                  <div>
                    <div style={{display:'grid',gap:'0.7rem'}}>
                      <div>
                        <div style={{fontSize:'0.76rem',fontWeight:700,color:'rgba(255,255,255,0.6)',marginBottom:'0.35rem'}}>Scenario title</div>
                        <BuilderTextInput value={builder.topic} onChange={(e) => updateBuilder('topic', e.target.value)} />
                      </div>
                      <div>
                        <div style={{fontSize:'0.76rem',fontWeight:700,color:'rgba(255,255,255,0.6)',marginBottom:'0.35rem'}}>Learning goal</div>
                        <BuilderTextArea value={builder.goal} onChange={(e) => updateBuilder('goal', e.target.value)} />
                      </div>
                      <OptionGrid>
                        {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                          <OptionCard
                            key={level}
                            $active={builder.challengeLevel === level}
                            onClick={() => updateBuilder('challengeLevel', level)}
                          >
                            <div style={{fontWeight:800,fontSize:'0.82rem'}}>{level}</div>
                            <div style={{fontSize:'0.72rem',color:'rgba(255,255,255,0.55)',marginTop:'0.2rem'}}>Difficulty</div>
                          </OptionCard>
                        ))}
                      </OptionGrid>
                      <div>
                        <div style={{fontSize:'0.76rem',fontWeight:700,color:'rgba(255,255,255,0.6)',marginBottom:'0.35rem'}}>Duration</div>
                        <OptionGrid>
                          {['10 min', '15 min', '20 min', '30 min'].map((dur) => (
                            <OptionCard key={dur} $active={builder.duration === dur} onClick={() => updateBuilder('duration', dur)}>
                              <div style={{fontWeight:800,fontSize:'0.82rem'}}>{dur}</div>
                            </OptionCard>
                          ))}
                        </OptionGrid>
                      </div>
                      <div>
                        <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.76rem',fontWeight:700,color:'rgba(255,255,255,0.6)',marginBottom:'0.35rem'}}>
                          <span>Starting balance</span>
                          <span>${builder.startingBalance.toLocaleString()}</span>
                        </div>
                        <BuilderRange
                          type="range"
                          min="5000"
                          max="100000"
                          step="1000"
                          value={builder.startingBalance}
                          onChange={(e) => updateBuilder('startingBalance', Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <div style={{fontSize:'0.76rem',fontWeight:700,color:'rgba(255,255,255,0.6)',marginBottom:'0.35rem'}}>Narrative style</div>
                        <OptionGrid>
                          {NARRATIVE_STYLES.map((style) => (
                            <OptionCard key={style} $active={builder.narrativeStyle === style} onClick={() => updateBuilder('narrativeStyle', style)}>
                              <div style={{fontWeight:800,fontSize:'0.82rem'}}>{style}</div>
                            </OptionCard>
                          ))}
                        </OptionGrid>
                      </div>
                    </div>
                  </div>
                )}

                {builderStep === 2 && (
                  <div>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'0.6rem'}}>
                      <div style={{color:'white',fontWeight:800}}>Asset universe</div>
                      <div style={{fontSize:'0.75rem',color:'rgba(255,255,255,0.5)'}}>{builder.selectedAssets.length} selected</div>
                    </div>
                    <AssetGrid>
                      {stocks.map((stock) => (
                        <AssetChip
                          key={stock.symbol}
                          $active={builder.selectedAssets.includes(stock.symbol)}
                          onClick={() => toggleBuilderAsset(stock.symbol)}
                        >
                          <div style={{fontWeight:800}}>{stock.symbol}</div>
                          <div style={{fontSize:'0.68rem',opacity:0.85}}>{stock.sector}</div>
                        </AssetChip>
                      ))}
                    </AssetGrid>
                  </div>
                )}

                {builderStep === 3 && (
                  <div>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'0.6rem'}}>
                      <div style={{color:'white',fontWeight:800}}>Objective templates</div>
                      <div style={{fontSize:'0.75rem',color:'rgba(255,255,255,0.5)'}}>{builder.objectiveFocus.length} selected</div>
                    </div>
                    <div style={{display:'grid',gap:'0.5rem'}}>
                      {OBJECTIVE_LIBRARY.map((objective) => (
                        <ObjectiveCard
                          key={objective.id}
                          $active={builder.objectiveFocus.includes(objective.id)}
                          onClick={() => toggleBuilderObjective(objective.id)}
                        >
                          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:'0.4rem'}}>
                            <div style={{fontWeight:800,fontSize:'0.82rem'}}>{objective.label}</div>
                            <FaBullseye style={{color:builder.objectiveFocus.includes(objective.id) ? '#22c55e' : 'rgba(255,255,255,0.3)',fontSize:'0.7rem'}} />
                          </div>
                          <div style={{fontSize:'0.72rem',color:'rgba(255,255,255,0.55)',marginTop:'0.2rem'}}>{objective.hint}</div>
                        </ObjectiveCard>
                      ))}
                    </div>
                    {!canProceedFromObjectives && (
                      <div style={{marginTop:'0.6rem',fontSize:'0.74rem',color:'#f87171'}}>Select at least 2 objective templates.</div>
                    )}
                  </div>
                )}

                {builderStep === 4 && (
                  <div>
                    <PreviewCard>
                      {builderPreview ? (
                        <>
                          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:'0.6rem'}}>
                            <div style={{display:'flex',alignItems:'center',gap:'0.55rem'}}>
                              <div style={{fontSize:'1.35rem'}}>{builderPreview.icon}</div>
                              <div>
                                <div style={{fontWeight:800,color:'white'}}>{builderPreview.title}</div>
                                <div style={{fontSize:'0.75rem',color:'rgba(255,255,255,0.6)'}}>{builderPreview.difficulty} • {builderPreview.duration} • ${Number(builderPreview.startingBalance).toLocaleString()}</div>
                              </div>
                            </div>
                            <DifficultyBadge $color="#38bdf8">AI Draft</DifficultyBadge>
                          </div>
                          <p style={{color:'rgba(255,255,255,0.72)',fontSize:'0.82rem',lineHeight:1.5,marginTop:'0.7rem'}}>{builderPreview.description}</p>
                          <div style={{marginTop:'0.7rem',display:'flex',flexWrap:'wrap',gap:'0.35rem'}}>
                            {builderPreview.learningGoals?.slice(0, 5).map((goal) => <GoalTag key={goal}>{goal}</GoalTag>)}
                          </div>
                          <div style={{marginTop:'0.75rem'}}>
                            <div style={{fontSize:'0.72rem',color:'rgba(255,255,255,0.55)',marginBottom:'0.35rem'}}>Objectives</div>
                            {(builderPreview.objectives || []).map((objective) => (
                              <div key={objective.id} style={{fontSize:'0.78rem',color:'rgba(255,255,255,0.8)',marginBottom:'0.3rem'}}>• {objective.label}</div>
                            ))}
                          </div>
                        </>
                      ) : (
                        <div style={{color:'rgba(255,255,255,0.72)',fontSize:'0.85rem'}}>Generate a scenario to preview it here.</div>
                      )}
                    </PreviewCard>
                  </div>
                )}
              </BuilderPanel>

              <BuilderPanel>
                <div style={{fontSize:'0.72rem',textTransform:'uppercase',letterSpacing:'0.07em',color:'#7dd3fc',fontWeight:700,marginBottom:'0.35rem'}}>Builder summary</div>
                <div style={{display:'flex',alignItems:'center',gap:'0.55rem',marginBottom:'0.7rem'}}>
                  <div style={{fontSize:'1.5rem'}}>{selectedTheme.emoji}</div>
                  <div>
                    <div style={{fontWeight:800,color:'white'}}>{builder.topic}</div>
                    <div style={{fontSize:'0.75rem',color:'rgba(255,255,255,0.6)'}}>{builder.challengeLevel} • {builder.duration}</div>
                  </div>
                </div>
                <div style={{fontSize:'0.78rem',color:'rgba(255,255,255,0.68)',lineHeight:1.5}}>{builder.goal}</div>

                <div style={{marginTop:'0.85rem'}}>
                  <div style={{fontSize:'0.72rem',color:'rgba(255,255,255,0.55)',marginBottom:'0.35rem'}}>Selected assets ({builder.selectedAssets.length})</div>
                  <GoalsWrap>
                    {builder.selectedAssets.slice(0, 12).map((symbol) => <GoalTag key={symbol}>{symbol}</GoalTag>)}
                  </GoalsWrap>
                </div>

                <div style={{marginTop:'0.85rem'}}>
                  <div style={{fontSize:'0.72rem',color:'rgba(255,255,255,0.55)',marginBottom:'0.35rem'}}>Objective focus</div>
                  {selectedObjectiveTemplates.length === 0 ? (
                    <div style={{fontSize:'0.76rem',color:'rgba(255,255,255,0.45)'}}>No objective templates selected.</div>
                  ) : (
                    selectedObjectiveTemplates.map((item) => (
                      <div key={item.id} style={{fontSize:'0.76rem',color:'rgba(255,255,255,0.78)',marginBottom:'0.25rem'}}>• {item.label}</div>
                    ))
                  )}
                </div>

                <div style={{marginTop:'1rem',padding:'0.7rem',borderRadius:10,border:'1px solid rgba(34,197,94,0.26)',background:'rgba(34,197,94,0.08)'}}>
                  <div style={{fontSize:'0.72rem',fontWeight:700,color:'#86efac',marginBottom:'0.25rem'}}>OpenAI integration</div>
                  <div style={{fontSize:'0.74rem',color:'rgba(255,255,255,0.65)',lineHeight:1.45}}>Your guided inputs are converted into a complete scenario blueprint with briefing text and objective rules, then can be saved to your database-backed library.</div>
                </div>
              </BuilderPanel>
            </BuilderGrid>

            <BuilderActions>
              <BtnGroup>
                <SecondaryBtn onClick={() => { setView('select'); }}>
                  <FaSignOutAlt style={{marginRight:'0.3rem'}} />
                  Back to library
                </SecondaryBtn>
              </BtnGroup>
              <BtnGroup>
                <SecondaryBtn
                  onClick={() => setBuilderStep((prev) => Math.max(0, prev - 1))}
                  disabled={builderStep === 0}
                  style={{opacity: builderStep === 0 ? 0.5 : 1}}
                >
                  Previous
                </SecondaryBtn>
                {builderStep < 3 && (
                  <PrimaryBtn onClick={() => setBuilderStep((prev) => Math.min(3, prev + 1))}>
                    Next <FaChevronRight />
                  </PrimaryBtn>
                )}
                {builderStep === 3 && (
                  <PrimaryBtn
                    onClick={generateBuilderScenario}
                    disabled={builderGenerating || !canProceedFromObjectives}
                  >
                    {builderGenerating ? <FaSpinner /> : <FaMagic />}
                    {builderGenerating ? 'Generating...' : 'Generate with AI'}
                  </PrimaryBtn>
                )}
                {builderStep === 4 && (
                  <>
                    <SecondaryBtn onClick={generateBuilderScenario} disabled={builderGenerating}>
                      {builderGenerating ? 'Regenerating...' : 'Regenerate'}
                    </SecondaryBtn>
                    <PrimaryBtn onClick={saveBuilderScenario} disabled={!builderPreview || builderSaving}>
                      <FaSave />
                      {builderSaving ? 'Saving...' : 'Save'}
                    </PrimaryBtn>
                    <PrimaryBtn onClick={() => builderPreview && startScenario(builderPreview)} disabled={!builderPreview}>
                      <FaPlay />
                      Start scenario
                    </PrimaryBtn>
                  </>
                )}
              </BtnGroup>
            </BuilderActions>
          </BuilderShell>
        </ContentWrapper>
      </PageContainer>
    );
  }

  /* ======= RENDER: Active Simulation ======= */
  return (
    <PageContainer>
      <SimContainer>
        {/* LEFT COLUMN — Trading Panel */}
        <LeftColumn>
          <ScenarioBar>
            <BarIcon>{activeScenario?.icon}</BarIcon>
            <BarTitle>{activeScenario?.title}</BarTitle>
            <DifficultyBadge $color={difficultyColors[activeScenario?.difficulty]}>
              {activeScenario?.difficulty}
            </DifficultyBadge>
            <ExitButton onClick={() => { setView('select'); setActiveScenario(null); }}>
              <FaSignOutAlt /> Exit Scenario
            </ExitButton>
          </ScenarioBar>

          <BalanceBar>
            <BalanceStat>
              <BalanceLabel>Cash Balance</BalanceLabel>
              <BalanceValue $color="#22c55e">${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</BalanceValue>
            </BalanceStat>
            <BalanceStat>
              <BalanceLabel>Invested</BalanceLabel>
              <BalanceValue>${portfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</BalanceValue>
            </BalanceStat>
            <BalanceStat>
              <BalanceLabel>Total Value</BalanceLabel>
              <BalanceValue>${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</BalanceValue>
            </BalanceStat>
            <BalanceStat>
              <BalanceLabel>Holdings</BalanceLabel>
              <BalanceValue>{holdings.length} stocks</BalanceValue>
            </BalanceStat>
          </BalanceBar>

          {/* Stock Selector */}
          <Card>
            <CardHead>
              <CardLabel><FaChartLine /> Available Stocks</CardLabel>
            </CardHead>
            <CardBody>
              <SearchBar>
                <FaSearch style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.8rem' }} />
                <SearchInput
                  placeholder="Search stocks..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </SearchBar>
              <StockGrid>
                {filteredStocks.map(stock => (
                  <StockRow
                    key={stock.symbol}
                    $active={selectedStock?.symbol === stock.symbol}
                    onClick={() => { setSelectedStock(stock); setQuantity(''); }}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <div>
                      <StockSymbol>{stock.symbol}</StockSymbol>
                      <StockName>{stock.name}</StockName>
                    </div>
                    <div>
                      <PriceVal>${stock.price.toFixed(2)}</PriceVal>
                      <PriceChg $pos={stock.change >= 0}>
                        {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                      </PriceChg>
                    </div>
                  </StockRow>
                ))}
              </StockGrid>
            </CardBody>
          </Card>

          {/* Selected Stock Detail */}
          <AnimatePresence>
            {selectedStock && (
              <DetailSection
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Card>
                  <CardHead>
                    <CardLabel>{selectedStock.symbol} — {selectedStock.name}</CardLabel>
                    <DifficultyBadge $color="#3b82f6">{selectedStock.sector}</DifficultyBadge>
                  </CardHead>
                  <CardBody>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '0.25rem' }}>
                      <BigPrice>${selectedStock.price.toFixed(2)}</BigPrice>
                      <BigChange $pos={selectedStock.change >= 0}>
                        {selectedStock.change >= 0 ? <FaArrowUp /> : <FaArrowDown />}
                        {selectedStock.change >= 0 ? '+' : ''}{selectedStock.changePercent.toFixed(2)}%
                      </BigChange>
                    </div>

                    <ChartWrap>
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={selectedStock.historicalPrices}>
                          <defs>
                            <linearGradient id="scenarioChartGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="date" hide />
                          <YAxis domain={['auto', 'auto']} hide />
                          <Tooltip
                            contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', fontSize: '0.8rem' }}
                            labelStyle={{ color: 'rgba(255,255,255,0.5)' }}
                            formatter={(val) => [`$${val.toFixed(2)}`, 'Price']}
                          />
                          <Area type="monotone" dataKey="price" stroke="#22c55e" fillOpacity={1} fill="url(#scenarioChartGrad)" strokeWidth={2} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </ChartWrap>

                    <MetricsRow>
                      <MetricBox>
                        <MetricLabel>P/E Ratio</MetricLabel>
                        <MetricValue>{selectedStock.pe || 'N/A'}</MetricValue>
                      </MetricBox>
                      <MetricBox>
                        <MetricLabel>Dividend</MetricLabel>
                        <MetricValue>{selectedStock.dividend ? `${selectedStock.dividend}%` : 'None'}</MetricValue>
                      </MetricBox>
                      <MetricBox>
                        <MetricLabel>Market Cap</MetricLabel>
                        <MetricValue>{selectedStock.marketCap}</MetricValue>
                      </MetricBox>
                      <MetricBox>
                        <MetricLabel>Sector</MetricLabel>
                        <MetricValue style={{ fontSize: '0.7rem' }}>{selectedStock.sector}</MetricValue>
                      </MetricBox>
                    </MetricsRow>

                    <TradeForm>
                      <TradeRow>
                        <TradeInput
                          type="number"
                          min="1"
                          placeholder="Quantity"
                          value={quantity}
                          onChange={e => setQuantity(e.target.value)}
                        />
                        <BuyBtn
                          onClick={handleBuy}
                          disabled={!quantity || parseInt(quantity) <= 0 || costForQuantity > balance}
                        >
                          <FaArrowUp /> Buy
                        </BuyBtn>
                        <SellBtn
                          onClick={handleSell}
                          disabled={!quantity || parseInt(quantity) <= 0 || !currentHolding || currentHolding.shares < parseInt(quantity || 0)}
                        >
                          <FaArrowDown /> Sell
                        </SellBtn>
                      </TradeRow>
                      {quantity && parseInt(quantity) > 0 && (
                        <TradeCost>
                          Total: <span>${costForQuantity.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                          {currentHolding && (
                            <span style={{ marginLeft: '1rem', color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}>
                              You own: {currentHolding.shares} shares
                            </span>
                          )}
                        </TradeCost>
                      )}
                    </TradeForm>
                  </CardBody>
                </Card>
              </DetailSection>
            )}
          </AnimatePresence>

          {/* Current Holdings */}
          <Card>
            <CardHead>
              <CardLabel><FaChartLine /> Current Holdings</CardLabel>
              <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' }}>{holdings.length} positions</span>
            </CardHead>
            <CardBody>
              {holdings.length === 0 ? (
                <EmptyState>No holdings yet. Buy some stocks to get started!</EmptyState>
              ) : (
                <HoldingsTable>
                  {holdings.map(h => {
                    const stock = stocks.find(s => s.symbol === h.symbol);
                    const currentVal = stock ? stock.price * h.shares : 0;
                    const pnl = stock ? (stock.price - h.avgPrice) * h.shares : 0;
                    return (
                      <HoldingRow key={h.symbol} onClick={() => { setSelectedStock(stock); setQuantity(''); }}>
                        <div>
                          <HoldingSym>{h.symbol}</HoldingSym>
                          <HoldingShares>{h.shares} shares @ ${h.avgPrice.toFixed(2)}</HoldingShares>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <HoldingValue>${currentVal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</HoldingValue>
                          <HoldingShares style={{ color: pnl >= 0 ? '#4ade80' : '#f87171' }}>
                            {pnl >= 0 ? '+' : ''}${pnl.toFixed(2)}
                          </HoldingShares>
                        </div>
                      </HoldingRow>
                    );
                  })}
                </HoldingsTable>
              )}
            </CardBody>
          </Card>
        </LeftColumn>

        {/* RIGHT COLUMN — AI Advisor Panel */}
        <RightColumn>
          <Card style={{ display: 'flex', flexDirection: 'column', maxHeight: 'calc(100vh - 3rem)' }}>
            <AdvisorHeader>
              <FaRobot />
              <div>
                <AdvisorTitle>AI Investment Tutor</AdvisorTitle>
                <div style={{fontSize:'0.7rem',color:'rgba(255,255,255,0.35)',marginTop:1}}>Teaches & explains every step</div>
              </div>
            </AdvisorHeader>

            <ObjectivesList>
              <div style={{fontSize:'0.7rem',color:'rgba(255,255,255,0.3)',textTransform:'uppercase',letterSpacing:'0.5px',fontWeight:700,marginBottom:'0.3rem'}}>📋 Learning Objectives</div>
              <ObjectivesCounter>
                {completedObjectives.length}/{activeScenario?.objectives.length || 0} completed
              </ObjectivesCounter>
              {activeScenario?.objectives.map(obj => (
                <ObjectiveItem key={obj.id} $done={completedObjectives.includes(obj.id)}>
                  <CheckIcon $done={completedObjectives.includes(obj.id)}>
                    {completedObjectives.includes(obj.id) ? <FaCheckCircle /> : <FaTimesCircle />}
                  </CheckIcon>
                  {obj.label}
                </ObjectiveItem>
              ))}
            </ObjectivesList>

            <MessagesArea>
              {messages.map((msg, i) => (
                <MessageBubble
                  key={i}
                  $isAi={msg.isAi}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div dangerouslySetInnerHTML={{ __html: formatAIText(msg.text) }} />
                  <MessageTime>{msg.time}</MessageTime>
                </MessageBubble>
              ))}
              {aiLoading && (
                <TypingIndicator>
                  <Dot $d="0s" />
                  <Dot $d="0.2s" />
                  <Dot $d="0.4s" />
                </TypingIndicator>
              )}
              <div ref={messagesEndRef} />
            </MessagesArea>

            <QuickActions>
              <QuickBtn onClick={() => handleQuickAction('advice')} disabled={aiLoading}>
                <FaLightbulb style={{ marginRight: '0.2rem' }} /> Teach me what to buy next
              </QuickBtn>
              <QuickBtn onClick={() => handleQuickAction('progress')} disabled={aiLoading}>
                <FaTrophy style={{ marginRight: '0.2rem' }} /> Review my progress
              </QuickBtn>
              <QuickBtn onClick={() => handleQuickAction('explain')} disabled={aiLoading}>
                <FaSearch style={{ marginRight: '0.2rem' }} /> Explain this stock to me
              </QuickBtn>
            </QuickActions>

            <InputRow>
              <ChatInput
                placeholder="Ask the AI advisor..."
                value={customQuestion}
                onChange={e => setCustomQuestion(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={aiLoading}
              />
              <SendBtn onClick={handleCustomQuestion} disabled={aiLoading || !customQuestion.trim()}>
                <FaPaperPlane />
              </SendBtn>
            </InputRow>
          </Card>
        </RightColumn>
      </SimContainer>

      {/* Completion Modal */}
      <AnimatePresence>
        {showCompletion && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ModalContent
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: 'spring', damping: 25 }}
            >
              <CelebrationEmoji>🎉</CelebrationEmoji>
              <ModalTitle>Scenario Complete!</ModalTitle>
              <ModalSubtitle>{activeScenario?.title}</ModalSubtitle>

              <StatsGrid>
                <StatBox>
                  <StatNum $color="#22c55e">${balance.toLocaleString('en-US', { minimumFractionDigits: 0 })}</StatNum>
                  <StatDesc>Cash Remaining</StatDesc>
                </StatBox>
                <StatBox>
                  <StatNum>${portfolioValue.toLocaleString('en-US', { minimumFractionDigits: 0 })}</StatNum>
                  <StatDesc>Invested</StatDesc>
                </StatBox>
                <StatBox>
                  <StatNum>{holdings.length}</StatNum>
                  <StatDesc>Stocks Owned</StatDesc>
                </StatBox>
              </StatsGrid>

              {completionReview && (
                <ReviewText dangerouslySetInnerHTML={{ __html: formatAIText(completionReview) }} />
              )}

              <LearningsSection>
                <LearningTitle><FaStar /> Key Learnings</LearningTitle>
                {activeScenario?.learningGoals.map(g => (
                  <LearningItem key={g}>
                    <FaCheckCircle /> {g}
                  </LearningItem>
                ))}
              </LearningsSection>

              <TryAgainBtn onClick={() => { setShowCompletion(false); setView('select'); setActiveScenario(null); }}>
                Try Another Scenario
              </TryAgainBtn>
            </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>

      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <Notification
            $type={notification.type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            {notification.type === 'success' ? <FaCheckCircle style={{ color: '#4ade80' }} /> : <FaTimesCircle style={{ color: '#f87171' }} />}
            {notification.msg}
          </Notification>
        )}
      </AnimatePresence>
    </PageContainer>
  );
};

export default ScenarioPage;
