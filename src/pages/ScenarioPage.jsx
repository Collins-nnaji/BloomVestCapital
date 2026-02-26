import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { FaArrowUp, FaArrowDown, FaRobot, FaPlay, FaTrophy, FaClock, FaCheckCircle, FaTimesCircle, FaPaperPlane, FaChartLine, FaSignOutAlt, FaStar, FaLightbulb, FaSearch } from 'react-icons/fa';
import { scenarios, difficultyColors } from '../data/scenarios';
import { stocks } from '../data/stockData';
import { api } from '../api';

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(180deg, #0a0f1c 0%, #111827 100%);
`;

const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
`;

const PageHeader = styled(motion.div)`
  text-align: center;
  margin-bottom: 2.5rem;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  color: white;
  margin-bottom: 0.5rem;
  letter-spacing: -0.02em;
`;

const PageSubtitle = styled.p`
  color: rgba(255,255,255,0.4);
  font-size: 1.1rem;
`;

const ScenariosGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 1.5rem;
  @media (max-width: 768px) { grid-template-columns: 1fr; }
`;

const ScenarioCard = styled(motion.div)`
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 16px;
  padding: 1.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 25px rgba(0,0,0,0.3);
    border-color: rgba(255,255,255,0.12);
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
  font-size: 1.1rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
`;

const ScenarioCardDesc = styled.p`
  color: rgba(255,255,255,0.4);
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 1rem;
`;

const ScenarioCardMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const Duration = styled.span`
  color: rgba(255,255,255,0.25);
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
  background: rgba(168,85,247,0.1);
  color: #a855f7;
  border: 1px solid rgba(168,85,247,0.15);
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

const ScenarioBar = styled.div`
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
  background: rgba(239,68,68,0.1);
  border: 1px solid rgba(239,68,68,0.2);
  border-radius: 8px;
  color: #f87171;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  &:hover { background: rgba(239,68,68,0.2); }
`;

const BalanceBar = styled.div`
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 14px;
  padding: 1rem 1.25rem;
  display: flex;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;
`;

const BalanceStat = styled.div`min-width: 100px;`;
const BalanceLabel = styled.div`font-size:0.65rem;color:rgba(255,255,255,0.35);text-transform:uppercase;font-weight:700;letter-spacing:0.8px;margin-bottom:0.15rem;`;
const BalanceValue = styled.div`font-size:1.2rem;font-weight:800;color:${p => p.$color || 'white'};`;

const Card = styled.div`
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
  &::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
`;

const StockRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.4rem;
  border-bottom: 1px solid rgba(255,255,255,0.03);
  cursor: pointer;
  transition: all 0.15s;
  border-radius: 6px;
  &:hover { background: rgba(34,197,94,0.05); }
  ${p => p.$active && `background: rgba(34,197,94,0.08); border-left: 2px solid #22c55e;`}
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
  background: rgba(34,197,94,0.04);
  border: 1px solid rgba(34,197,94,0.1);
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
  &::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
`;

const HoldingRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(255,255,255,0.03);
  &:last-child { border-bottom: none; }
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
  svg { color: #a855f7; font-size: 1.1rem; }
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
  background: ${p => p.$isAi ? 'rgba(168,85,247,0.08)' : 'rgba(34,197,94,0.08)'};
  border: 1px solid ${p => p.$isAi ? 'rgba(168,85,247,0.15)' : 'rgba(34,197,94,0.15)'};
  border-radius: 12px;
  padding: 0.85rem 1rem;
  font-size: 0.85rem;
  color: rgba(255,255,255,0.85);
  line-height: 1.6;
`;

const MessageTime = styled.div`
  font-size: 0.65rem;
  color: rgba(255,255,255,0.2);
  margin-top: 0.4rem;
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
  background: rgba(168,85,247,0.08);
  border: 1px solid rgba(168,85,247,0.15);
  border-radius: 12px;
  width: fit-content;
`;

const Dot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #a855f7;
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
  background: rgba(168,85,247,0.1);
  color: #a855f7;
  border: 1px solid rgba(168,85,247,0.15);
  cursor: pointer;
  transition: all 0.2s;
  &:hover { background: rgba(168,85,247,0.2); }
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
  &:focus { border-color: #a855f7; }
  &::placeholder { color: rgba(255,255,255,0.2); }
`;

const SendBtn = styled.button`
  padding: 0.6rem 0.85rem;
  border-radius: 8px;
  background: #a855f7;
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.2s;
  &:hover { background: #9333ea; }
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
  font-size: 0.9rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.6rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  svg { color: #f59e0b; }
`;

const LearningItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
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

const ScenarioPage = () => {
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

  const messagesEndRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, aiLoading, scrollToBottom]);

  const showNotif = useCallback((msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const checkObjectives = useCallback((currentHoldings, currentBalance) => {
    if (!activeScenario) return [];
    const done = activeScenario.objectives
      .filter(obj => obj.check(currentHoldings, stocks, currentBalance))
      .map(obj => obj.id);
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
  }, []);

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
            <PageSubtitle style={{maxWidth:600,margin:'0.5rem auto 0'}}>Step-by-step investing simulations with a personal <strong style={{color:'#a78bfa'}}>AI tutor</strong> that teaches, explains every decision, and coaches you in real time.</PageSubtitle>
          </PageHeader>

          <ScenariosGrid>
            {scenarios.map((scenario, idx) => (
              <ScenarioCard
                key={scenario.id}
                onClick={() => startScenario(scenario)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                whileHover={{ scale: 1.01 }}
              >
                <ScenarioCardHeader>
                  <ScenarioIcon>{scenario.icon}</ScenarioIcon>
                  <DifficultyBadge $color={difficultyColors[scenario.difficulty]}>
                    {scenario.difficulty}
                  </DifficultyBadge>
                </ScenarioCardHeader>
                <ScenarioCardTitle>{scenario.title}</ScenarioCardTitle>
                <ScenarioCardDesc>{scenario.description}</ScenarioCardDesc>
                <div style={{background:'rgba(139,92,246,0.06)',border:'1px solid rgba(139,92,246,0.12)',borderRadius:10,padding:'0.65rem 0.85rem',marginBottom:'1rem',display:'flex',alignItems:'flex-start',gap:'0.6rem'}}>
                  <FaRobot style={{color:'#a78bfa',flexShrink:0,marginTop:2,fontSize:'0.9rem'}} />
                  <span style={{color:'rgba(255,255,255,0.55)',fontSize:'0.78rem',lineHeight:1.45}}>
                    <strong style={{color:'#a78bfa'}}>AI Tutor guides you</strong> — explains every trade, coaches your decisions, and teaches {scenario.learningGoals.slice(0,2).join(' & ').toLowerCase()} step by step.
                  </span>
                </div>
                <ScenarioCardMeta>
                  <Duration><FaClock /> {scenario.duration}</Duration>
                  <StartLabel><FaPlay /> Start Simulation</StartLabel>
                </ScenarioCardMeta>
                <GoalsWrap>
                  {scenario.learningGoals.map(g => (
                    <GoalTag key={g}>{g}</GoalTag>
                  ))}
                </GoalsWrap>
              </ScenarioCard>
            ))}
          </ScenariosGrid>
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
