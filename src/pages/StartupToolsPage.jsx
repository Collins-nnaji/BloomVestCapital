import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { motion, useInView } from 'framer-motion';
import { 
  FaCalculator, FaChartLine, FaFileContract, FaSearch, FaUsers, FaRegLightbulb,
  FaPiggyBank, FaPercentage, FaFileInvoiceDollar, FaHandshake, FaChartPie, 
  FaArrowRight, FaDownload, FaExternalLinkAlt, FaTools, FaBookOpen, FaPlay, 
  FaDatabase, FaBrain, FaGraduationCap, FaCheck, FaRocket, FaSeedling, FaCheckCircle,
  FaInfoCircle
} from 'react-icons/fa';

// Page wrapper
const PageWrapper = styled.div`
  overflow-x: hidden;
  background: #fcfcfd;
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000;
`;

// Hero section
const HeroSection = styled.section`
  padding: 120px 5% 140px;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #1a365d 0%, #2d4e71 100%);
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: white;
  
  @media (max-width: 768px) {
    padding: 80px 5% 100px;
    min-height: auto;
  }
`;

const HeroContainer = styled.div`
  max-width: 1280px;
  width: 100%;
  margin: 0 auto;
  position: relative;
  z-index: 5;
`;

const HeroContent = styled.div`
  text-align: center;
  max-width: 850px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
`;

const MainHeading = styled(motion.h1)`
  font-size: 4.5rem;
  font-weight: 900;
  line-height: 1.1;
  margin-bottom: 1.75rem;
  color: white;
  letter-spacing: -1px;
  
  span {
    color: #4ade80;
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      bottom: 5px;
      left: 0;
      width: 100%;
      height: 8px;
      background: rgba(74, 222, 128, 0.3);
      z-index: -1;
      border-radius: 4px;
    }
  }
  
  @media (max-width: 1024px) {
    font-size: 3.75rem;
  }
  
  @media (max-width: 768px) {
    font-size: 3rem;
  }
  
  @media (max-width: 480px) {
    font-size: 2.5rem;
    letter-spacing: -0.5px;
  }
`;

const SubHeading = styled(motion.p)`
  font-size: 1.5rem;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.8);
  max-width: 700px;
  margin: 0 auto 2.5rem;
  
  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const ComingSoonBadge = styled(motion.span)`
  display: inline-block;
  background: linear-gradient(to right, #f59e0b, #d97706);
  color: white;
  font-size: 1.2rem;
  font-weight: 700;
  padding: 0.5rem 1.5rem;
  border-radius: 50px;
  margin-bottom: 1.5rem;
  box-shadow: 0 10px 25px rgba(245, 158, 11, 0.3);
  
  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 0.4rem 1.25rem;
  }
`;

const Description = styled(motion.p)`
  font-size: 1.4rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 3rem;
  line-height: 1.8;
  font-weight: 400;
  
  strong {
    color: #4ade80;
    font-weight: 600;
  }
`;

// Background elements
const BackgroundDecoration = styled.div`
  position: absolute;
  border-radius: 50%;
  filter: blur(70px);
  z-index: 1;
  will-change: transform, opacity;
  
  @media (max-width: 768px) {
    filter: blur(40px);
  }
  
  &.top-left {
    top: -150px;
    left: -100px;
    width: 500px;
    height: 500px;
    background: linear-gradient(135deg, rgba(34, 197, 94, 0.25), rgba(16, 185, 129, 0.1));
    opacity: 0.6;
  }
  
  &.bottom-right {
    bottom: -200px;
    right: -150px;
    width: 600px;
    height: 600px;
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.25), rgba(34, 197, 94, 0.1));
    opacity: 0.6;
  }
  
  &.center {
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 800px;
    height: 800px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, transparent 70%);
    opacity: 0.4;
  }
`;

const GridPattern = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
  background-size: 40px 40px;
  background-position: center center;
  opacity: 0.4;
  z-index: 1;
  
  @media (max-width: 768px) {
    background-size: 60px 60px;
    opacity: 0.3;
  }
`;

// Section divider
const SectionDivider = styled.div`
  height: 100px;
  position: relative;
  background: linear-gradient(to bottom, #2d4e71 0%, #fcfcfd 100%);
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.05), transparent);
  }
`;

// Container for all sections
const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  
  @media (max-width: 768px) {
    padding: 0 1.5rem;
  }
`;

// Tool categories section
const CategoriesSection = styled.section`
  padding: 100px 0 60px;
  background: #ffffff;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: 
      radial-gradient(rgba(34, 197, 94, 0.03) 1px, transparent 1px),
      radial-gradient(rgba(26, 54, 93, 0.03) 1px, transparent 1px);
    background-size: 40px 40px, 30px 30px;
    background-position: 0 0, 20px 20px;
    opacity: 0.6;
    z-index: 0;
  }
`;

const SectionHeader = styled.div`
  text-align: center;
  max-width: 800px;
  margin: 0 auto 60px;
  position: relative;
  z-index: 1;
`;

const SectionTitle = styled.h2`
  font-size: 3rem;
  font-weight: 800;
  color: #1a365d;
  margin-bottom: 1.5rem;
  position: relative;
  display: inline-block;
  
  span {
    color: #22c55e;
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      bottom: 5px;
      left: 0;
      width: 100%;
      height: 8px;
      background: rgba(34, 197, 94, 0.2);
      z-index: -1;
      border-radius: 4px;
    }
  }
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const SectionDescription = styled.p`
  font-size: 1.2rem;
  color: #475569;
  line-height: 1.8;
`;

// Category tabs
const CategoryTabsContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 3rem;
  position: relative;
  z-index: 1;
`;

const NotificationBanner = styled.div`
  background: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.3);
  border-radius: 10px;
  padding: 1rem 1.5rem;
  margin-bottom: 2.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  
  svg {
    color: #f59e0b;
    font-size: 1.5rem;
    flex-shrink: 0;
  }
  
  p {
    color: #92400e;
    font-size: 1.05rem;
    line-height: 1.6;
    margin: 0;
  }
  
  strong {
    font-weight: 600;
  }
`;

const CategoryTab = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: none;
  outline: none;
  
  background: ${props => props.isActive ? 'linear-gradient(135deg, #22c55e, #15803d)' : '#ffffff'};
  color: ${props => props.isActive ? 'white' : '#1a365d'};
  box-shadow: ${props => props.isActive ? 
    '0 10px 15px rgba(34, 197, 94, 0.2)' : 
    '0 5px 15px rgba(0, 0, 0, 0.05)'};
  border: ${props => props.isActive ? 'none' : '1px solid #e2e8f0'};
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: ${props => props.isActive ? 
      '0 15px 25px rgba(34, 197, 94, 0.25)' : 
      '0 10px 20px rgba(0, 0, 0, 0.08)'};
  }
`;

// Tools grid
const ToolsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2.5rem;
  position: relative;
  z-index: 1;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const ToolCard = styled(motion.div)`
  background: white;
  border-radius: 20px;
  padding: 2.25rem;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(226, 232, 240, 0.8);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 1;
  height: 100%;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 20px;
    padding: 2px;
    background: linear-gradient(135deg, ${props => props.gradient || 'rgba(34, 197, 94, 0.5), rgba(26, 54, 93, 0.3)'});
    -webkit-mask: 
      linear-gradient(#fff 0 0) content-box, 
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0;
    transition: opacity 0.4s ease;
    z-index: -1;
  }
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.08);
    
    &::before {
      opacity: 1;
    }
  }
`;

const ToolIcon = styled.div`
  width: 70px;
  height: 70px;
  background: ${props => props.bg || 'rgba(34, 197, 94, 0.1)'};
  color: ${props => props.color || '#22c55e'};
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.85rem;
  margin-bottom: 1.5rem;
  transition: all 0.4s ease;
  box-shadow: 0 10px 15px ${props => props.shadowColor || 'rgba(0, 0, 0, 0.05)'};
  
  ${ToolCard}:hover & {
    transform: scale(1.1) rotate(5deg);
    background: ${props => props.hoverBg || '#22c55e'};
    color: white;
    box-shadow: 0 10px 20px ${props => props.hoverShadow || 'rgba(0, 0, 0, 0.1)'};
  }
`;

const ToolTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a365d;
  margin-bottom: 1rem;
  position: relative;
  padding-bottom: 0.75rem;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 50px;
    height: 3px;
    background: ${props => props.underlineColor || '#22c55e'};
    border-radius: 3px;
    transition: width 0.3s ease;
  }
  
  ${ToolCard}:hover &::after {
    width: 100px;
  }
`;

const ToolDescription = styled.p`
  color: #475569;
  font-size: 1.05rem;
  line-height: 1.7;
  flex-grow: 1;
  margin-bottom: 1.5rem;
`;

const ButtonLink = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.primary ? 
    props.disabled ? '#a3a3a3' : 'linear-gradient(to right, #22c55e, #15803d)' : 
    'transparent'};
  color: ${props => props.primary ? 
    'white' : 
    props.disabled ? '#a3a3a3' : '#1a365d'};
  border: ${props => props.primary ? 
    'none' : 
    props.disabled ? '1px solid #d4d4d4' : '1px solid #e2e8f0'};
  border-radius: 50px;
  padding: ${props => props.primary ? '0.75rem 1.5rem' : '0.5rem 1rem'};
  font-weight: 600;
  font-size: 1rem;
  text-decoration: none;
  transition: all 0.3s ease;
  gap: 0.5rem;
  margin-right: ${props => props.primary ? '0' : '1rem'};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? '0.8' : '1'};
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: ${props => props.disabled ? 'none' : 'translateY(-3px)'};
    box-shadow: ${props => props.disabled ? 'none' : props.primary ? 
      '0 10px 20px rgba(0, 0, 0, 0.1)' : 
      '0 5px 15px rgba(0, 0, 0, 0.05)'};
  }
  
  svg {
    transition: transform 0.3s ease;
  }
  
  &:hover svg {
    transform: ${props => props.disabled ? 'none' : 'translateX(3px)'};
  }
`;

const CommingSoonTag = styled.span`
  position: absolute;
  top: -2px;
  right: -2px;
  background: #f59e0b;
  color: white;
  font-size: 0.6rem;
  padding: 0.15rem 0.35rem;
  border-radius: 3px;
  font-weight: 700;
  transform: rotate(3deg) translateY(-50%);
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

// Featured resources section
const ResourcesSection = styled.section`
  padding: 100px 0;
  background: linear-gradient(to bottom, #f8fafc, #ffffff);
  position: relative;
`;

const ResourceCard = styled(motion.div)`
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(226, 232, 240, 0.8);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.08);
  }
`;

const ResourceImage = styled.div`
  height: 200px;
  background: ${props => props.bg || '#f1f5f9'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1a365d;
  font-size: 3rem;
  
  svg {
    filter: drop-shadow(0 10px 8px rgb(0 0 0 / 0.04)) drop-shadow(0 4px 3px rgb(0 0 0 / 0.1));
  }
`;

const ResourceContent = styled.div`
  padding: 2rem;
`;

const ResourceTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a365d;
  margin-bottom: 1rem;
`;

const ResourceDescription = styled.p`
  color: #475569;
  font-size: 1.05rem;
  line-height: 1.7;
  margin-bottom: 1.5rem;
`;

const ResourcesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

// Newsletter section
const NewsletterSection = styled.section`
  padding: 100px 0;
  background: #f0fdf4;
  position: relative;
`;

const NewsletterContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
`;

const NewsletterTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 800;
  color: #1a365d;
  margin-bottom: 1.5rem;
`;

const NewsletterDescription = styled.p`
  font-size: 1.2rem;
  color: #475569;
  line-height: 1.8;
  margin-bottom: 2.5rem;
`;

const SubscribeForm = styled.form`
  display: flex;
  max-width: 600px;
  margin: 0 auto;
  
  @media (max-width: 640px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const SubscribeInput = styled.input`
  flex: 1;
  padding: 1rem 1.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 50px;
  font-size: 1rem;
  outline: none;
  
  &:focus {
    border-color: #22c55e;
    box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.2);
  }
  
  @media (max-width: 640px) {
    width: 100%;
  }
`;

const SubscribeButton = styled.button`
  padding: 1rem 2rem;
  border-radius: 50px;
  background: ${props => props.disabled ? '#a3a3a3' : 'linear-gradient(to right, #22c55e, #15803d)'};
  color: white;
  font-weight: 600;
  font-size: 1rem;
  border: none;
  outline: none;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  margin-left: 1rem;
  transition: all 0.3s ease;
  white-space: nowrap;
  position: relative;
  
  &:hover {
    transform: ${props => props.disabled ? 'none' : 'translateY(-3px)'};
    box-shadow: ${props => props.disabled ? 'none' : '0 10px 20px rgba(0, 0, 0, 0.1)'};
  }
  
  @media (max-width: 640px) {
    width: 100%;
    margin-left: 0;
  }
`;

const StartupToolsPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" }
    }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const toolVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };
  
  // Category data
  const categories = [
    { id: 'all', name: 'All Tools', icon: <FaTools /> },
    { id: 'finance', name: 'Financial', icon: <FaCalculator /> },
    { id: 'legal', name: 'Legal', icon: <FaFileContract /> },
    { id: 'market', name: 'Market Research', icon: <FaSearch /> },
    { id: 'pitch', name: 'Fundraising', icon: <FaPiggyBank /> },
    { id: 'growth', name: 'Growth', icon: <FaChartLine /> }
  ];
  
  // Tools data
  const tools = [
    {
      id: 1,
      title: 'Startup Valuation Calculator',
      description: 'Determine your startup\'s valuation using multiple methodologies including discounted cash flow, comparable company analysis, and VC method.',
      icon: <FaCalculator />,
      color: '#22c55e',
      bg: 'rgba(34, 197, 94, 0.1)',
      hoverShadow: 'rgba(34, 197, 94, 0.2)',
      link: '#',
      download: false,
      category: 'finance',
      gradient: 'rgba(34, 197, 94, 0.5), rgba(26, 54, 93, 0.3)'
    },
    {
      id: 2,
      title: 'Cap Table Manager',
      description: 'Interactive tool to model your company\'s equity distribution across funding rounds, visualize dilution, and plan option pools.',
      icon: <FaChartPie />,
      color: '#3b82f6',
      bg: 'rgba(59, 130, 246, 0.1)',
      hoverShadow: 'rgba(59, 130, 246, 0.2)',
      link: '#',
      download: true,
      category: 'finance',
      gradient: 'rgba(59, 130, 246, 0.5), rgba(26, 54, 93, 0.3)'
    },
    {
      id: 3,
      title: 'Investment Term Sheet Generator',
      description: 'Create customized term sheets for your funding round with explanations of key terms and provisions.',
      icon: <FaFileContract />,
      color: '#f59e0b',
      bg: 'rgba(245, 158, 11, 0.1)',
      hoverShadow: 'rgba(245, 158, 11, 0.2)',
      link: '#',
      download: true,
      category: 'legal',
      gradient: 'rgba(245, 158, 11, 0.5), rgba(26, 54, 93, 0.3)'
    },
    {
      id: 4,
      title: 'Market Size Analyzer',
      description: 'Calculate your total addressable market (TAM), serviceable available market (SAM), and serviceable obtainable market (SOM).',
      icon: <FaSearch />,
      color: '#8b5cf6',
      bg: 'rgba(139, 92, 246, 0.1)',
      hoverShadow: 'rgba(139, 92, 246, 0.2)',
      link: '#',
      download: false,
      category: 'market',
      gradient: 'rgba(139, 92, 246, 0.5), rgba(26, 54, 93, 0.3)'
    },
    {
      id: 5,
      title: 'Investor Pitch Deck Template',
      description: 'Professionally designed slide templates with guidance on crafting a compelling narrative for your fundraising presentations.',
      icon: <FaRegLightbulb />,
      color: '#ec4899',
      bg: 'rgba(236, 72, 153, 0.1)',
      hoverShadow: 'rgba(236, 72, 153, 0.2)',
      link: '#',
      download: true,
      category: 'pitch',
      gradient: 'rgba(236, 72, 153, 0.5), rgba(26, 54, 93, 0.3)'
    },
    {
      id: 6,
      title: 'Burn Rate & Runway Calculator',
      description: 'Track your cash flow, calculate burn rate, and forecast your startup\'s runway with different growth scenarios.',
      icon: <FaFileInvoiceDollar />,
      color: '#06b6d4',
      bg: 'rgba(6, 182, 212, 0.1)',
      hoverShadow: 'rgba(6, 182, 212, 0.2)',
      link: '#',
      download: false,
      category: 'finance',
      gradient: 'rgba(6, 182, 212, 0.5), rgba(26, 54, 93, 0.3)'
    },
    {
      id: 7,
      title: 'Competitor Analysis Framework',
      description: 'Structured template to evaluate competitors across key dimensions and identify your competitive advantages.',
      icon: <FaSearch />,
      color: '#0ea5e9',
      bg: 'rgba(14, 165, 233, 0.1)',
      hoverShadow: 'rgba(14, 165, 233, 0.2)',
      link: '#',
      download: true,
      category: 'market',
      gradient: 'rgba(14, 165, 233, 0.5), rgba(26, 54, 93, 0.3)'
    },
    {
      id: 8,
      title: 'Growth Metrics Dashboard',
      description: 'Interactive dashboard to track and visualize key growth metrics including user acquisition, retention, and revenue.',
      icon: <FaChartLine />,
      color: '#14b8a6',
      bg: 'rgba(20, 184, 166, 0.1)', 
      hoverShadow: 'rgba(20, 184, 166, 0.2)',
      link: '#',
      download: false,
      category: 'growth',
      gradient: 'rgba(20, 184, 166, 0.5), rgba(26, 54, 93, 0.3)'
    },
    {
      id: 9,
      title: 'Investor Database Access',
      description: 'Searchable database of active investors filtered by investment stage, industry focus, and geographic preferences.',
      icon: <FaUsers />,
      color: '#a855f7',
      bg: 'rgba(168, 85, 247, 0.1)',
      hoverShadow: 'rgba(168, 85, 247, 0.2)',
      link: '#',
      download: false,
      category: 'pitch',
      gradient: 'rgba(168, 85, 247, 0.5), rgba(26, 54, 93, 0.3)'
    }
  ];
  
  // Featured resources data
  const resources = [
    {
      title: 'Fundraising Masterclass',
      description: 'Learn how to build relationships with investors, structure your fundraising process, and close your round efficiently.',
      icon: <FaPiggyBank />,
      bg: 'rgba(34, 197, 94, 0.1)',
      link: '#'
    },
    {
      title: 'Due Diligence Checklist',
      description: 'Comprehensive list of materials to prepare for investor due diligence, with tips on presenting your data effectively.',
      icon: <FaCheckCircle />,
      bg: 'rgba(59, 130, 246, 0.1)',
      link: '#'
    },
    {
      title: 'Startup Legal Guide',
      description: 'Essential legal considerations for founders covering entity formation, IP protection, and employment agreements.',
      icon: <FaFileContract />,
      bg: 'rgba(245, 158, 11, 0.1)',
      link: '#'
    }
  ];
  
  // Filter tools based on active category
  const filteredTools = activeCategory === 'all' 
    ? tools
    : tools.filter(tool => tool.category === activeCategory);
  
  return (
    <PageWrapper>
      <HeroSection>
        <BackgroundDecoration className="top-left" />
        <BackgroundDecoration className="bottom-right" />
        <BackgroundDecoration className="center" />
        <GridPattern />
        
        <HeroContainer>
          <HeroContent>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <ComingSoonBadge>COMING SOON</ComingSoonBadge>
            </motion.div>
            <MainHeading
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              Startup <span>Tools</span> for Founders
            </MainHeading>
            <SubHeading
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              We're building a comprehensive suite of tools to help founders navigate the startup journey. Our tools will launch soon to support your growth strategy and funding needs.
            </SubHeading>
          </HeroContent>
        </HeroContainer>
      </HeroSection>
      
      <SectionDivider />
      
      <CategoriesSection>
        <Container>
          <SectionHeader>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <SectionTitle>Interactive <span>Tools</span></SectionTitle>
              <SectionDescription>
                Our suite of specialized tools helps you make data-driven decisions at every stage of the startup journey.
              </SectionDescription>
            </motion.div>
          </SectionHeader>
          
          <NotificationBanner>
            <FaInfoCircle />
            <p>
              <strong>Note:</strong> Our startup tools are currently in development and will be launched soon. Stay tuned for powerful resources designed to help founders navigate their startup journey.
            </p>
          </NotificationBanner>
          
          <CategoryTabsContainer>
            {categories.map(category => (
              <CategoryTab
                key={category.id}
                isActive={activeCategory === category.id}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.icon} {category.name}
              </CategoryTab>
            ))}
          </CategoryTabsContainer>
          
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            <ToolsGrid>
              {filteredTools.map(tool => (
                <ToolCard
                  key={tool.id}
                  variants={toolVariants}
                  gradient={tool.gradient}
                >
                  <ToolIcon 
                    bg={tool.bg} 
                    color={tool.color}
                    hoverBg={tool.color}
                    hoverShadow={tool.hoverShadow}
                  >
                    {tool.icon}
                  </ToolIcon>
                  <ToolTitle underlineColor={tool.color}>
                    {tool.title}
                  </ToolTitle>
                  <ToolDescription>
                    {tool.description}
                  </ToolDescription>
                  <ButtonContainer>
                    <ButtonLink primary disabled href="#" onClick={(e) => e.preventDefault()}>
                      {tool.download ? 'Download' : 'Access Tool'} 
                      {tool.download ? <FaDownload /> : <FaArrowRight />}
                      <CommingSoonTag>COMING SOON</CommingSoonTag>
                    </ButtonLink>
                    {!tool.download && (
                      <ButtonLink disabled href="#" onClick={(e) => e.preventDefault()}>
                        Learn More <FaExternalLinkAlt />
                      </ButtonLink>
                    )}
                  </ButtonContainer>
                </ToolCard>
              ))}
            </ToolsGrid>
          </motion.div>
        </Container>
      </CategoriesSection>
      
      <ResourcesSection>
        <Container>
          <SectionHeader>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <SectionTitle>Featured <span>Resources</span></SectionTitle>
              <SectionDescription>
                Educational content and expert guidance to help you navigate the complexities of startup building and investing.
              </SectionDescription>
            </motion.div>
          </SectionHeader>
          
          <NotificationBanner>
            <FaInfoCircle />
            <p>
              <strong>Coming Soon:</strong> We're preparing high-quality resources to support founders on their journey. Check back soon for guides, templates, and educational content.
            </p>
          </NotificationBanner>
          
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            <ResourcesGrid>
              {resources.map((resource, index) => (
                <ResourceCard
                  key={index}
                  variants={toolVariants}
                >
                  <ResourceImage bg={resource.bg}>
                    {resource.icon}
                  </ResourceImage>
                  <ResourceContent>
                    <ResourceTitle>{resource.title}</ResourceTitle>
                    <ResourceDescription>{resource.description}</ResourceDescription>
                    <ButtonLink primary disabled href="#" onClick={(e) => e.preventDefault()}>
                      Access Resource <FaArrowRight />
                      <CommingSoonTag>COMING SOON</CommingSoonTag>
                    </ButtonLink>
                  </ResourceContent>
                </ResourceCard>
              ))}
            </ResourcesGrid>
          </motion.div>
        </Container>
      </ResourcesSection>
      
      <NewsletterSection>
        <Container>
          <NewsletterContainer>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <NewsletterTitle>Stay Updated</NewsletterTitle>
              <NewsletterDescription>
                Subscribe to our newsletter to receive updates on new tools, resources, and investment opportunities.
              </NewsletterDescription>
            </motion.div>
            
            <NotificationBanner>
              <FaInfoCircle />
              <p>
                <strong>Coming Soon:</strong> Our newsletter subscription will be active shortly. Thank you for your interest!
              </p>
            </NotificationBanner>
            
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <SubscribeForm>
                <SubscribeInput 
                  type="email" 
                  placeholder="Enter your email address" 
                  disabled
                />
                <SubscribeButton disabled>
                  Subscribe
                  <CommingSoonTag>SOON</CommingSoonTag>
                </SubscribeButton>
              </SubscribeForm>
            </motion.div>
          </NewsletterContainer>
        </Container>
      </NewsletterSection>
    </PageWrapper>
  );
};

export default StartupToolsPage; 