import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { FaArrowRight, FaChartLine, FaFileAlt, FaRegLightbulb, FaCheck, FaUsers, FaGlobe, FaCheckCircle, FaFileInvoiceDollar, FaHandHoldingUsd, FaInfoCircle, FaCalendarAlt, FaChevronRight, FaExternalLinkAlt, FaAngleRight, FaStar, FaPlay, FaBriefcase, FaLightbulb, FaRocket, FaArrowDown } from 'react-icons/fa';
import { motion, useAnimation, useInView, AnimatePresence } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import { BsArrowRepeat, BsShieldCheck, BsLightningCharge } from 'react-icons/bs';
import { IoAnalytics, IoRocket, IoSparkles } from 'react-icons/io5';
import { RiBrainLine, RiUserHeartLine, RiTeamLine, RiBarChartBoxLine, RiMoneyDollarCircleLine } from 'react-icons/ri';

// Modern app-like styles
const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding-top: 60px; /* Header height */
  overflow-x: hidden;
  font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
  --primary: #22c55e;
  --primary-dark: #15803d;
  --secondary: #3b82f6;
  --dark: #1a365d;
  --text: #475569;
  --light-bg: #f8fafc;
  --surface: #ffffff;
  --border: rgba(226, 232, 240, 0.8);
`;

// Enhanced Hero Section
const HeroSection = styled.section`
  position: relative;
  overflow: hidden;
  min-height: 85vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: white;
  
  @media (max-width: 768px) {
    min-height: 75vh;
  }
`;

const VideoBackground = styled.video`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
  transform: scale(1.08);
  transition: opacity 1.5s ease-in-out;
  opacity: ${props => props.active ? 1 : 0};
`;

const VideoOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.92) 0%, rgba(26, 54, 93, 0.95) 100%);
  z-index: 1;
  backdrop-filter: blur(2px);
`;

const HeroContainer = styled(motion.div)`
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  position: relative;
  z-index: 5;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  
  @media (max-width: 1080px) {
    flex-direction: column;
    gap: 3rem;
    text-align: center;
    padding-top: 2rem;
  }
`;

const HeroContent = styled(motion.div)`
  flex: 1;
  max-width: 650px;
  
  @media (max-width: 1080px) {
    max-width: 100%;
  }
`;

const BigText = styled(motion.span)`
  font-size: 6.5rem;
  font-weight: 900;
  line-height: 1;
  display: block;
  margin-bottom: 0.5rem;
  background: linear-gradient(to right, #22c55e, #4ade80);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
  
  @media (max-width: 1080px) {
    font-size: 5rem;
  }
  
  @media (max-width: 640px) {
    font-size: 4rem;
  }
  
  @media (max-width: 480px) {
    font-size: 3.5rem;
  }
`;

const SubHeading = styled(motion.p)`
  font-size: 1.25rem;
  font-weight: 700;
  color: #4ade80;
  margin: 0 0 1.5rem;
  text-transform: uppercase;
  letter-spacing: 3px;
  position: relative;
  display: inline-block;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const MainHeading = styled(motion.h1)`
  font-size: 3.8rem;
  font-weight: 800;
  line-height: 1.1;
  margin: 0 0 1.5rem;
  color: white;
  letter-spacing: -1px;
  
  @media (max-width: 1080px) {
    font-size: 3.2rem;
  }
  
  @media (max-width: 640px) {
    font-size: 2.6rem;
  }
`;

const Description = styled(motion.p)`
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 2rem;
  line-height: 1.6;
  font-weight: 400;
  
  strong {
    color: #4ade80;
    font-weight: 600;
  }
  
  @media (max-width: 768px) {
    font-size: 1.15rem;
  }
`;

const ButtonGroup = styled(motion.div)`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0.75rem;
  }
`;

const PrimaryButton = styled(RouterLink)`
  background: linear-gradient(to right, #22c55e, #15803d);
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 50px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: 0 10px 25px rgba(34, 197, 94, 0.4);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 30px rgba(34, 197, 94, 0.5);
  }
  
  svg {
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  &:hover svg {
    transform: translateX(4px);
  }
`;

const SecondaryButton = styled(motion.button)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 50px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-3px);
  }
  
  svg {
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
`;

const HeroFeatures = styled(motion.div)`
  margin-top: 3rem;
  display: flex;
  gap: 2rem;
  
  @media (max-width: 1080px) {
    justify-content: center;
    flex-wrap: wrap;
    gap: 1.5rem;
  }
  
  @media (max-width: 640px) {
    gap: 1rem;
  }
`;

const FeatureItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  span {
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.85);
    font-weight: 500;
  }
  
  svg {
    color: #4ade80;
    font-size: 1.25rem;
  }
  
  @media (max-width: 640px) {
    span {
      font-size: 0.9rem;
    }
    
    svg {
      font-size: 1.1rem;
    }
  }
`;

const HeroImageContainer = styled(motion.div)`
  flex: 1;
  max-width: 600px;
  position: relative;
  
  @media (max-width: 1080px) {
    max-width: 500px;
    width: 100%;
  }
`;

const FloatingCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.3), transparent);
  }
`;

const CardTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: white;
  
  span {
    color: #4ade80;
  }
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
  margin-bottom: 1.5rem;
`;

const CardItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const CardLabel = styled.span`
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 500;
`;

const CardValue = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  svg {
    color: #4ade80;
  }
`;

const CardProgress = styled.div`
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 1rem;
`;

const ProgressBar = styled.div`
  height: 100%;
  width: ${props => props.width || '0%'};
  background: linear-gradient(to right, #22c55e, #4ade80);
  border-radius: 10px;
`;

const CardAction = styled(motion.button)`
  width: 100%;
  padding: 0.75rem;
  background: rgba(34, 197, 94, 0.2);
  color: #4ade80;
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(34, 197, 94, 0.3);
  }
`;

const ScrollIndicator = styled(motion.div)`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
  font-weight: 500;
  
  svg {
    font-size: 1.5rem;
    animation: bounce 2s infinite;
  }
  
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-10px);
    }
    60% {
      transform: translateY(-5px);
    }
  }
`;

// App-like sections styling - enhancing with more modern design
const AppSection = styled.section`
  background: ${props => props.background || '#f8fafc'};
  padding: 5rem 1.5rem;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(to right, 
      transparent, 
      rgba(226, 232, 240, 0.7), 
      transparent
    );
  }
  
  /* Add subtle background pattern */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: radial-gradient(rgba(24, 24, 27, 0.03) 1px, transparent 1px);
    background-size: 20px 20px;
    pointer-events: none;
    z-index: 0;
  }
`;

const SectionHeader = styled.div`
  max-width: 800px;
  margin: 0 auto 3.5rem;
  text-align: center;
  position: relative;
  z-index: 1;
`;

const SectionTitle = styled.h2`
  font-size: 3rem;
  font-weight: 800;
  color: #1a365d;
  margin-bottom: 1.25rem;
  position: relative;
  display: inline-block;
  letter-spacing: -1px;
  
  span {
    color: #22c55e;
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      bottom: 4px;
      left: 0;
      width: 100%;
      height: 10px;
      background: rgba(34, 197, 94, 0.15);
      z-index: -1;
      border-radius: 4px;
    }
  }
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const SectionDescription = styled.p`
  font-size: 1.25rem;
  color: #475569;
  line-height: 1.6;
  max-width: 650px;
  margin: 0 auto;
  
  strong {
    color: #1a365d;
    font-weight: 600;
  }
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

// Tool cards layout with sophisticated styling
const ToolsWrapper = styled.div`
  max-width: 1300px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const TabsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -15px;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 3px;
    background: linear-gradient(to right, #22c55e, #3b82f6);
    border-radius: 3px;
  }
  
  @media (max-width: 640px) {
    gap: 0.5rem;
  }
`;

const Tab = styled.button`
  background: ${props => props.active ? 'white' : 'transparent'};
  color: ${props => props.active ? '#1a365d' : '#64748b'};
  border: 1px solid ${props => props.active ? 'rgba(226, 232, 240, 0.8)' : 'transparent'};
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: ${props => props.active ? '0 8px 15px rgba(0, 0, 0, 0.05)' : 'none'};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${props => props.active ? 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(66, 213, 120, 0.03) 100%)' : 'transparent'};
    z-index: -1;
  }
  
  &:hover {
    background: ${props => props.active ? 'white' : 'rgba(255, 255, 255, 0.8)'};
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.07);
  }
`;

const ToolsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.75rem;
  margin-top: 1.5rem;
`;

const ToolCard = styled(motion.div)`
  background: white;
  border-radius: 18px;
  overflow: hidden;
  position: relative;
  border: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  transform-origin: center bottom;
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(255,255,255,0) 70%, rgba(255,255,255,0.8) 100%);
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 0;
  }
  
  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
    
    &::after {
      opacity: 1;
    }
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: ${props => props.accentColor || '#22c55e'};
    transition: all 0.3s ease;
  }
  
  &:hover::before {
    width: 8px;
  }
`;

const ToolHeader = styled.div`
  padding: 2rem 1.75rem 1.25rem;
  display: flex;
  align-items: flex-start;
  gap: 1.25rem;
  position: relative;
  z-index: 1;
`;

const ToolIconWrapper = styled.div`
  flex-shrink: 0;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: -5px;
    left: -5px;
    width: calc(100% + 10px);
    height: calc(100% + 10px);
    border-radius: 12px;
    background: ${props => props.glowColor || 'rgba(34, 197, 94, 0.1)'};
    opacity: 0;
    z-index: -1;
    transition: opacity 0.3s ease;
  }
  
  ${ToolCard}:hover &::after {
    opacity: 1;
  }
`;

const ToolIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 12px;
  background: ${props => props.bg || 'rgba(34, 197, 94, 0.1)'};
  color: ${props => props.color || '#22c55e'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.7rem;
  position: relative;
  transition: all 0.3s ease;
  
  ${ToolCard}:hover & {
    transform: scale(1.1);
  }
`;

const ToolInfo = styled.div`
  flex: 1;
`;

const ToolTitle = styled.h3`
  font-size: 1.4rem;
  font-weight: 700;
  color: #1a365d;
  margin: 0 0 0.8rem;
  transition: color 0.3s ease;
  
  ${ToolCard}:hover & {
    color: ${props => props.hoverColor || '#22c55e'};
  }
`;

const ToolDescription = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: #475569;
  margin: 0;
`;

const ToolFeatures = styled.ul`
  list-style: none;
  padding: 0.75rem 1.75rem 1.5rem;
  margin: 0;
  position: relative;
  z-index: 1;
`;

const ToolFeature = styled.li`
  display: flex;
  align-items: flex-start;
  padding: 0.75rem 0;
  font-size: 0.95rem;
  color: #475569;
  border-bottom: 1px solid rgba(226, 232, 240, 0.5);
  transition: transform 0.3s ease;
  
  &:last-child {
    border-bottom: none;
  }
  
  ${ToolCard}:hover & {
    transform: translateX(5px);
  }
  
  svg {
    color: ${props => props.accentColor || '#22c55e'};
    margin-right: 0.75rem;
    margin-top: 0.15rem;
    flex-shrink: 0;
    font-size: 0.85rem;
  }
`;

const ToolAction = styled.div`
  padding: 1.25rem 1.75rem;
  border-top: 1px solid rgba(226, 232, 240, 0.8);
  background: ${props => props.bg || 'rgba(248, 250, 252, 0.7)'};
  margin-top: auto;
  position: relative;
  z-index: 1;
  transition: all 0.3s ease;
  
  ${ToolCard}:hover & {
    background: ${props => props.hoverBg || 'rgba(34, 197, 94, 0.03)'};
  }
`;

const ToolLink = styled(RouterLink)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${props => props.color || '#22c55e'};
  font-weight: 600;
  font-size: 1rem;
  text-decoration: none;
  transition: all 0.3s ease;
  
  svg {
    transition: transform 0.3s ease;
  }
  
  &:hover {
    color: ${props => props.hoverColor || '#15803d'};
    
    svg {
      transform: translateX(6px);
    }
  }
`;

// Stats section with more sophisticated design
const StatsSection = styled.div`
  background: linear-gradient(135deg, rgba(26, 54, 93, 0.03), rgba(34, 197, 94, 0.05));
  border-radius: 28px;
  padding: 3rem;
  margin: 4.5rem auto 0;
  max-width: 1300px;
  border: 1px solid rgba(226, 232, 240, 0.7);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(34, 197, 94, 0.07) 0%, rgba(255, 255, 255, 0) 70%);
    top: -200px;
    right: -200px;
    z-index: 0;
  }
  
  &::after {
    content: '';
    position: absolute;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(59, 130, 246, 0.07) 0%, rgba(255, 255, 255, 0) 70%);
    bottom: -150px;
    left: -150px;
    z-index: 0;
  }
  
  @media (max-width: 768px) {
    padding: 2rem;
    margin-top: 3rem;
  }
`;

const StatsHeader = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;
  position: relative;
  z-index: 1;
`;

const StatsTitle = styled.h3`
  font-size: 2rem;
  font-weight: 800;
  color: #1a365d;
  margin: 0 0 1rem;
  
  span {
    color: #22c55e;
  }
  
  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`;

const StatsDescription = styled.p`
  font-size: 1.1rem;
  color: #475569;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const StatCardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  position: relative;
  z-index: 1;
  
  @media (max-width: 960px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled(motion.div)`
  background: white;
  border-radius: 16px;
  padding: 2rem 1.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  text-align: center;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  position: relative;
  overflow: hidden;
  isolation: isolate;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(to right, ${props => props.gradient || '#22c55e'}, ${props => props.gradientEnd || '#4ade80'});
    transition: height 0.3s ease;
    z-index: -1;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50%;
    background: linear-gradient(to top, rgba(248, 250, 252, 0.7), transparent);
    z-index: -1;
  }
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    
    &::before {
      height: 8px;
    }
  }
`;

const StatIconWrapper = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: ${props => props.bg || 'rgba(34, 197, 94, 0.1)'};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
  
  svg {
    font-size: 2rem;
    color: ${props => props.color || '#22c55e'};
    transition: all 0.3s ease;
  }
  
  ${StatCard}:hover & {
    transform: scale(1.1);
    background: ${props => props.hoverBg || 'rgba(34, 197, 94, 0.2)'};
    
    svg {
      transform: scale(1.1);
    }
  }
`;

const StatValue = styled.div`
  font-size: 3rem;
  font-weight: 800;
  background: ${props => props.gradient || 'linear-gradient(135deg, #1a365d 0%, #22c55e 100%)'};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
  margin-bottom: 0.5rem;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 3px;
    background: ${props => props.gradient || 'linear-gradient(135deg, #1a365d 0%, #22c55e 100%)'};
    transition: width 0.3s ease;
    border-radius: 2px;
  }
  
  ${StatCard}:hover &::after {
    width: 30%;
  }
`;

const StatLabel = styled.div`
  font-size: 1.1rem;
  color: #475569;
  font-weight: 600;
  position: relative;
  z-index: 1;
`;

const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

// New Why Choose Us section styling
const WhyChooseSection = styled.section`
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  padding: 6rem 1.5rem;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2322c55e' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    opacity: 0.5;
  }
`;

const WhyChooseContainer = styled.div`
  max-width: 1300px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-top: 3.5rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const FeatureCard = styled(motion.div)`
  background: white;
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  isolation: isolate;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 150px;
    height: 150px;
    background: ${props => props.accentGradient || 'linear-gradient(135deg, rgba(34, 197, 94, 0.05) 0%, rgba(34, 197, 94, 0.01) 100%)'};
    border-radius: 60% 0 0 0;
    z-index: -1;
    opacity: 0;
    transition: opacity 0.5s ease;
  }
  
  &:hover {
    &::before {
      opacity: 1;
    }
  }
`;

const FeatureIconWrapper = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 18px;
  background: ${props => props.bg || 'rgba(34, 197, 94, 0.1)'};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  position: relative;
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 18px;
    padding: 2px;
    background: linear-gradient(135deg, 
      ${props => props.borderGradientStart || 'rgba(34, 197, 94, 0.5)'}, 
      ${props => props.borderGradientEnd || 'rgba(34, 197, 94, 0.1)'}
    );
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0.5;
    transition: opacity 0.3s ease;
  }
  
  svg {
    font-size: 2rem;
    color: ${props => props.iconColor || '#22c55e'};
    transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  
  ${FeatureCard}:hover & {
    transform: scale(1.08) rotate(3deg);
    
    &::after {
      opacity: 1;
    }
    
    svg {
      transform: scale(1.1);
    }
  }
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a365d;
  margin: 0 0 1rem;
  transition: color 0.3s ease;
  
  ${FeatureCard}:hover & {
    color: ${props => props.hoverColor || '#22c55e'};
  }
`;

const FeatureDescription = styled.p`
  font-size: 1.05rem;
  line-height: 1.6;
  color: #475569;
  margin: 0;
`;

// Connection Process section
const ProcessSection = styled.section`
  background: #fff;
  padding: 6rem 1.5rem;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(to right, 
      transparent, 
      rgba(226, 232, 240, 0.7), 
      transparent
    );
    z-index: 0;
  }
`;

const ProcessContainer = styled.div`
  max-width: 1300px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const ProcessStepsContainer = styled.div`
  margin-top: 4rem;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 70px;
    left: calc(12.5% + 20px);
    right: calc(12.5% + 20px);
    height: 4px;
    background: linear-gradient(to right, #22c55e, #3b82f6, #8b5cf6);
    border-radius: 4px;
    z-index: 0;
    
    @media (max-width: 1024px) {
      display: none;
    }
  }
`;

const ProcessSteps = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  position: relative;
  z-index: 1;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
`;

const ProcessStep = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  
  @media (max-width: 1024px) {
    flex-direction: row;
    text-align: left;
    gap: 2rem;
  }
  
  @media (max-width: 640px) {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
`;

const StepNumber = styled(motion.div)`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: ${props => props.bg || 'linear-gradient(135deg, #22c55e, #15803d)'};
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  position: relative;
  z-index: 2;
  box-shadow: 0 10px 25px ${props => props.shadowColor || 'rgba(34, 197, 94, 0.3)'};
  
  &::before {
    content: '';
    position: absolute;
    inset: -8px;
    border-radius: 50%;
    background: white;
    z-index: -1;
  }
  
  &::after {
    content: '';
    position: absolute;
    inset: -12px;
    border-radius: 50%;
    background: ${props => props.bgRing || 'rgba(34, 197, 94, 0.1)'};
    z-index: -2;
    transition: all 0.3s ease;
  }
  
  ${ProcessStep}:hover &::after {
    transform: scale(1.2);
  }
  
  @media (max-width: 1024px) {
    margin-bottom: 0;
  }
  
  @media (max-width: 640px) {
    margin-bottom: 1.5rem;
  }
`;

const StepContent = styled.div`
  max-width: 250px;
  
  @media (max-width: 1024px) {
    max-width: none;
    flex: 1;
  }
`;

const StepTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;
  color: #1a365d;
  margin: 0 0 0.75rem;
`;

const StepDescription = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: #475569;
  margin: 0;
`;

const StartedCTA = styled(motion.div)`
  margin-top: 5rem;
  text-align: center;
  
  h3 {
    font-size: 2rem;
    font-weight: 800;
    color: #1a365d;
    margin: 0 0 1.5rem;
    
    span {
      color: #22c55e;
    }
  }
  
  p {
    font-size: 1.1rem;
    color: #475569;
    max-width: 600px;
    margin: 0 auto 2rem;
    line-height: 1.6;
  }
`;

const CTAButton = styled(PrimaryButton)`
  padding: 1.2rem 2.5rem;
  font-size: 1.1rem;
  box-shadow: 0 15px 30px rgba(34, 197, 94, 0.4);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(34, 197, 94, 0.5);
  }
`;

const HomeContent = () => {
  const [activeVideo, setActiveVideo] = useState('main');
  const [activeTab, setActiveTab] = useState('all');
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: false });
  const heroControls = useAnimation();
  
  useEffect(() => {
    if (heroInView) {
      heroControls.start('visible');
    }
  }, [heroInView, heroControls]);
  
  // Auto-rotate videos
  useEffect(() => {
    const videoTimer = setInterval(() => {
      setActiveVideo(prev => prev === 'main' ? 'wealth' : 'main');
    }, 10000); // Switch every 10 seconds
    
    return () => clearInterval(videoTimer);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const heroItemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.7, type: "spring", stiffness: 100 }
    }
  };
  
  const featureItemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: i => ({ 
      y: 0, 
      opacity: 1, 
      transition: { 
        delay: 0.5 + (i * 0.1),
        duration: 0.5,
        type: "spring",
        stiffness: 100
      }
    })
  };
  
  const floatingCardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { 
        delay: 0.3,
        duration: 0.7,
        type: "spring",
        stiffness: 70
      }
    },
    hover: {
      y: -10,
      boxShadow: "0 30px 60px rgba(0, 0, 0, 0.3)",
      transition: { duration: 0.3 }
    }
  };

  // Connection tools with enhanced info
  const toolsList = [
    {
      icon: <FaUsers />,
      title: "Investor Matching",
      description: "Our AI algorithm connects you with investors whose investment thesis perfectly aligns with your sector, stage, and goals.",
      features: [
        "AI-powered matching algorithm",
        "Industry-specific connections",
        "Strategic fit assessment",
        "Personalized introduction support"
      ],
      iconBg: "rgba(34, 197, 94, 0.1)",
      iconColor: "#22c55e",
      accentColor: "#22c55e",
      linkColor: "#22c55e",
      linkHoverColor: "#15803d",
      audience: ["startups", "all"]
    },
    {
      icon: <FaRegLightbulb />,
      title: "Pitch Optimization",
      description: "Refine your pitch materials with expert guidance to effectively communicate your value proposition and growth story.",
      features: [
        "Pitch deck enhancement",
        "Narrative development",
        "Presentation coaching",
        "Investor psychology insights"
      ],
      iconBg: "rgba(59, 130, 246, 0.1)",
      iconColor: "#3b82f6",
      accentColor: "#3b82f6",
      linkColor: "#3b82f6",
      linkHoverColor: "#1d4ed8",
      audience: ["startups", "all"]
    },
    {
      icon: <FaFileInvoiceDollar />,
      title: "Due Diligence Tools",
      description: "Access comprehensive frameworks and tools for thorough due diligence, risk assessment, and investment preparation.",
      features: [
        "Financial review framework",
        "Market validation approach",
        "Documentation organization",
        "Risk assessment templates"
      ],
      iconBg: "rgba(245, 158, 11, 0.1)",
      iconColor: "#f59e0b",
      accentColor: "#f59e0b",
      linkColor: "#f59e0b",
      linkHoverColor: "#d97706",
      audience: ["investors", "all"]
    },
    {
      icon: <FaHandHoldingUsd />,
      title: "Deal Management",
      description: "Streamline the investment process with our end-to-end deal tracking platform from initial interest to post-investment.",
      features: [
        "Term sheet template library",
        "Investment management dashboard",
        "Post-investment tracking",
        "Portfolio performance analytics"
      ],
      iconBg: "rgba(139, 92, 246, 0.1)",
      iconColor: "#8b5cf6",
      accentColor: "#8b5cf6",
      linkColor: "#8b5cf6",
      linkHoverColor: "#7c3aed",
      audience: ["investors", "all"]
    },
    {
      icon: <FaChartLine />,
      title: "Market Intelligence",
      description: "Get exclusive access to industry trends, market data, investment patterns, and competitive landscape insights.",
      features: [
        "Sector trend analysis",
        "Investment activity reports",
        "Market mapping tools",
        "Competitive landscape insights"
      ],
      iconBg: "rgba(236, 72, 153, 0.1)",
      iconColor: "#ec4899",
      accentColor: "#ec4899",
      linkColor: "#ec4899",
      linkHoverColor: "#be185d",
      audience: ["investors", "all"]
    },
    {
      icon: <FaGlobe />,
      title: "Network Access",
      description: "Connect with our global community of founders, investors, experts, and mentors for support and collaboration.",
      features: [
        "Exclusive networking events",
        "Expert advisor matching",
        "Community resources",
        "Collaborative opportunities"
      ],
      iconBg: "rgba(20, 184, 166, 0.1)",
      iconColor: "#14b8a6",
      accentColor: "#14b8a6",
      linkColor: "#14b8a6",
      linkHoverColor: "#0f766e",
      audience: ["startups", "investors", "all"]
    }
  ];

  // Enhanced platform stats with icons
  const stats = [
    { 
      value: "750+", 
      label: "Startups Connected",
      icon: <FaRocket />,
      iconBg: "rgba(34, 197, 94, 0.1)",
      iconColor: "#22c55e",
      gradient: "linear-gradient(135deg, #15803d 0%, #22c55e 100%)"
    },
    { 
      value: "320+", 
      label: "Active Investors",
      icon: <FaUsers />,
      iconBg: "rgba(59, 130, 246, 0.1)",
      iconColor: "#3b82f6",
      gradient: "linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)"
    },
    { 
      value: "$250M+", 
      label: "Facilitated Funding",
      icon: <FaHandHoldingUsd />,
      iconBg: "rgba(139, 92, 246, 0.1)",
      iconColor: "#8b5cf6",
      gradient: "linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)"
    },
    { 
      value: "92%", 
      label: "Success Rate",
      icon: <FaCheckCircle />,
      iconBg: "rgba(236, 72, 153, 0.1)",
      iconColor: "#ec4899",
      gradient: "linear-gradient(135deg, #be185d 0%, #ec4899 100%)"
    } 
  ];
  
  // Filter tools based on active tab
  const filteredTools = toolsList.filter(tool => 
    tool.audience.includes(activeTab)
  );

  // Feature cards data
  const features = [
    {
      icon: <RiBrainLine />,
      title: "AI-Powered Matching",
      description: "Our proprietary algorithm analyzes over 50 parameters to create perfect startup-investor matches based on investment thesis, sector, and growth potential.",
      bg: "rgba(34, 197, 94, 0.1)",
      iconColor: "#22c55e",
      borderGradientStart: "rgba(34, 197, 94, 0.6)",
      borderGradientEnd: "rgba(34, 197, 94, 0.1)",
      accentGradient: "linear-gradient(135deg, rgba(34, 197, 94, 0.05) 0%, rgba(34, 197, 94, 0.01) 100%)",
      hoverColor: "#22c55e"
    },
    {
      icon: <RiUserHeartLine />,
      title: "Personalized Support",
      description: "Each connection is complemented with hands-on guidance from our team of experienced advisors who understand the funding landscape across industries.",
      bg: "rgba(59, 130, 246, 0.1)",
      iconColor: "#3b82f6",
      borderGradientStart: "rgba(59, 130, 246, 0.6)",
      borderGradientEnd: "rgba(59, 130, 246, 0.1)",
      accentGradient: "linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(59, 130, 246, 0.01) 100%)",
      hoverColor: "#3b82f6"
    },
    {
      icon: <BsShieldCheck />,
      title: "Verified Partners",
      description: "All investors and startups on our platform undergo thorough verification, ensuring legitimacy, credibility, and alignment with our community standards.",
      bg: "rgba(139, 92, 246, 0.1)",
      iconColor: "#8b5cf6",
      borderGradientStart: "rgba(139, 92, 246, 0.6)",
      borderGradientEnd: "rgba(139, 92, 246, 0.1)",
      accentGradient: "linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(139, 92, 246, 0.01) 100%)",
      hoverColor: "#8b5cf6"
    },
    {
      icon: <IoAnalytics />,
      title: "Data-Driven Insights",
      description: "Access comprehensive market analytics, investment trends, and competitive intelligence to make informed decisions about partnerships and growth strategies.",
      bg: "rgba(236, 72, 153, 0.1)",
      iconColor: "#ec4899",
      borderGradientStart: "rgba(236, 72, 153, 0.6)",
      borderGradientEnd: "rgba(236, 72, 153, 0.1)",
      accentGradient: "linear-gradient(135deg, rgba(236, 72, 153, 0.05) 0%, rgba(236, 72, 153, 0.01) 100%)",
      hoverColor: "#ec4899"
    },
    {
      icon: <RiTeamLine />,
      title: "Exclusive Network",
      description: "Join our community of founders, investors, industry experts, and advisors for unparalleled networking opportunities and collaborative growth.",
      bg: "rgba(245, 158, 11, 0.1)",
      iconColor: "#f59e0b",
      borderGradientStart: "rgba(245, 158, 11, 0.6)",
      borderGradientEnd: "rgba(245, 158, 11, 0.1)",
      accentGradient: "linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(245, 158, 11, 0.01) 100%)",
      hoverColor: "#f59e0b"
    },
    {
      icon: <BsLightningCharge />,
      title: "Accelerated Process",
      description: "Our streamlined process reduces the typical funding journey from months to weeks, with optimized workflows for documentation, due diligence, and deal closing.",
      bg: "rgba(20, 184, 166, 0.1)",
      iconColor: "#14b8a6",
      borderGradientStart: "rgba(20, 184, 166, 0.6)",
      borderGradientEnd: "rgba(20, 184, 166, 0.1)",
      accentGradient: "linear-gradient(135deg, rgba(20, 184, 166, 0.05) 0%, rgba(20, 184, 166, 0.01) 100%)",
      hoverColor: "#14b8a6"
    }
  ];
  
  // Connection process steps
  const processSteps = [
    {
      number: 1,
      title: "Create Your Profile",
      description: "Complete your startup or investor profile with all relevant details about your business, investment thesis, and objectives.",
      bg: "linear-gradient(135deg, #22c55e, #15803d)",
      bgRing: "rgba(34, 197, 94, 0.1)",
      shadowColor: "rgba(34, 197, 94, 0.3)"
    },
    {
      number: 2,
      title: "Get Matched",
      description: "Our AI algorithm will identify and suggest the most relevant connections based on your profile, goals, and potential fit.",
      bg: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
      bgRing: "rgba(59, 130, 246, 0.1)",
      shadowColor: "rgba(59, 130, 246, 0.3)"
    },
    {
      number: 3,
      title: "Connect & Engage",
      description: "Initiate conversations, share materials, and schedule meetings through our secure platform with interested parties.",
      bg: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
      bgRing: "rgba(139, 92, 246, 0.1)",
      shadowColor: "rgba(139, 92, 246, 0.3)"
    },
    {
      number: 4,
      title: "Close the Deal",
      description: "Finalize partnerships with our deal management tools, templates, and expert guidance throughout the process.",
      bg: "linear-gradient(135deg, #ec4899, #be185d)",
      bgRing: "rgba(236, 72, 153, 0.1)",
      shadowColor: "rgba(236, 72, 153, 0.3)"
    }
  ];
  
  // Animation variants for the process steps
  const processContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 50
      }
    }
  };
  
  // Feature card animations
  const featureVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: i => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.6,
        ease: "easeOut"
      }
    }),
    hover: {
      y: -10,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  return (
    <AppContainer>
      <HeroSection ref={heroRef}>
        <VideoBackground 
          autoPlay 
          loop 
          muted 
          playsInline
          active={activeVideo === 'main'}
        >
          <source src="/video2.mp4" type="video/mp4" />
        </VideoBackground>
        
        <VideoBackground 
          autoPlay 
          loop 
          muted 
          playsInline
          active={activeVideo === 'wealth'}
        >
          <source src="/wealth-management.mp4" type="video/mp4" />
        </VideoBackground>
        
        <VideoOverlay />
        
        <HeroContainer
          initial="hidden"
          animate={heroControls}
          variants={containerVariants}
        >
          <HeroContent>
            <SubHeading variants={heroItemVariants}>The Startup-Investor Connection Platform</SubHeading>
            <MainHeading variants={heroItemVariants}>
              Connecting <BigText>Startups</BigText> With The Right Investors
            </MainHeading>
            <Description variants={heroItemVariants}>
              BloomVest's AI-powered platform connects promising startups with strategic investors, providing all the tools needed to secure the right funding and relationships for sustainable growth.
            </Description>
            
            <ButtonGroup variants={heroItemVariants}>
              <PrimaryButton to="/tools">
                Explore Platform <FaArrowRight />
              </PrimaryButton>
              <SecondaryButton>
                <FaPlay /> Watch Demo
              </SecondaryButton>
            </ButtonGroup>
            
            <HeroFeatures>
              <FeatureItem custom={0} variants={featureItemVariants}>
                <FaCheck />
                <span>750+ Startups Connected</span>
              </FeatureItem>
              <FeatureItem custom={1} variants={featureItemVariants}>
                <FaCheck />
                <span>320+ Active Investors</span>
              </FeatureItem>
              <FeatureItem custom={2} variants={featureItemVariants}>
                <FaCheck />
                <span>$250M+ Facilitated</span>
              </FeatureItem>
            </HeroFeatures>
          </HeroContent>
          
          <HeroImageContainer>
            <FloatingCard 
              variants={floatingCardVariants}
              whileHover="hover"
            >
              <CardTitle>Investor <span>Matching</span></CardTitle>
              <CardGrid>
                <CardItem>
                  <CardLabel>Sector</CardLabel>
                  <CardValue><FaBriefcase /> Fintech</CardValue>
                </CardItem>
                <CardItem>
                  <CardLabel>Stage</CardLabel>
                  <CardValue><FaRocket /> Seed</CardValue>
                </CardItem>
                <CardItem>
                  <CardLabel>Funding Goal</CardLabel>
                  <CardValue>$1.2M</CardValue>
                </CardItem>
                <CardItem>
                  <CardLabel>Matched Investors</CardLabel>
                  <CardValue>24</CardValue>
                </CardItem>
              </CardGrid>
              
              <CardLabel>Match Progress</CardLabel>
              <CardProgress>
                <ProgressBar width="75%" />
              </CardProgress>
              
              <CardAction>
                View Matches <FaArrowRight />
              </CardAction>
            </FloatingCard>
          </HeroImageContainer>
        </HeroContainer>
        
        <ScrollIndicator
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.7 }}
        >
          <span>Scroll to explore</span>
          <FaArrowDown />
        </ScrollIndicator>
      </HeroSection>
      
      {/* New Why Choose Us section */}
      <WhyChooseSection>
        <WhyChooseContainer>
          <SectionHeader>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <SectionTitle>Why <span>Choose</span> BloomVest</SectionTitle>
              <SectionDescription>
                Our platform offers unique advantages that help startups and investors form meaningful connections that lead to successful partnerships.
              </SectionDescription>
            </motion.div>
          </SectionHeader>
          
          <FeaturesGrid>
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                custom={index}
                initial="hidden"
                whileInView="visible"
                whileHover="hover"
                viewport={{ once: true, margin: "-50px" }}
                variants={featureVariants}
                accentGradient={feature.accentGradient}
              >
                <FeatureIconWrapper 
                  bg={feature.bg}
                  iconColor={feature.iconColor}
                  borderGradientStart={feature.borderGradientStart}
                  borderGradientEnd={feature.borderGradientEnd}
                >
                  {feature.icon}
                </FeatureIconWrapper>
                <FeatureTitle hoverColor={feature.hoverColor}>{feature.title}</FeatureTitle>
                <FeatureDescription>{feature.description}</FeatureDescription>
              </FeatureCard>
            ))}
          </FeaturesGrid>
        </WhyChooseContainer>
      </WhyChooseSection>
      
      {/* Connection Process section */}
      <ProcessSection>
        <ProcessContainer>
          <SectionHeader>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <SectionTitle>Our <span>Connection</span> Process</SectionTitle>
              <SectionDescription>
                A simple and effective four-step journey to connect startups with the right investors and secure funding for growth.
              </SectionDescription>
            </motion.div>
          </SectionHeader>
          
          <ProcessStepsContainer>
            <ProcessSteps
              as={motion.div}
              variants={processContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              {processSteps.map((step, index) => (
                <ProcessStep key={index} variants={itemVariants}>
                  <StepNumber 
                    bg={step.bg}
                    bgRing={step.bgRing}
                    shadowColor={step.shadowColor}
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ 
                      scale: 1, 
                      opacity: 1,
                      transition: { 
                        delay: index * 0.2,
                        duration: 0.5, 
                        type: "spring",
                        stiffness: 100
                      }
                    }}
                    viewport={{ once: true }}
                  >
                    {step.number}
                  </StepNumber>
                  <StepContent>
                    <StepTitle>{step.title}</StepTitle>
                    <StepDescription>{step.description}</StepDescription>
                  </StepContent>
                </ProcessStep>
              ))}
            </ProcessSteps>
          </ProcessStepsContainer>
          
          <StartedCTA
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <h3>Ready to <span>Connect</span> and Grow?</h3>
            <p>
              Start your journey towards the right funding or investment opportunities today. It takes just minutes to create your profile.
            </p>
            <CTAButton to="/signup">
              Get Started Now <FaArrowRight />
            </CTAButton>
          </StartedCTA>
        </ProcessContainer>
      </ProcessSection>
      
      <AppSection>
        <SectionHeader>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <SectionTitle>Our <span>Connection</span> Platform</SectionTitle>
            <SectionDescription>
              We provide sophisticated tools designed to <strong>bridge the gap between startups and investors</strong>—from AI-powered matching to comprehensive deal support and portfolio management.
            </SectionDescription>
          </motion.div>
        </SectionHeader>
        
        <ToolsWrapper>
          <TabsContainer>
            <Tab 
              active={activeTab === 'all'} 
              onClick={() => setActiveTab('all')}
            >
              All Tools
            </Tab>
            <Tab 
              active={activeTab === 'startups'} 
              onClick={() => setActiveTab('startups')}
            >
              For Startups
            </Tab>
            <Tab 
              active={activeTab === 'investors'} 
              onClick={() => setActiveTab('investors')}
            >
              For Investors
            </Tab>
          </TabsContainer>
          
          <ToolsGrid>
            {filteredTools.map((tool, index) => (
              <ToolCard 
                key={index}
                accentColor={tool.accentColor}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <ToolHeader>
                  <ToolIconWrapper glowColor={tool.iconBg}>
                    <ToolIcon 
                      bg={tool.iconBg}
                      color={tool.iconColor}
                    >
                      {tool.icon}
                    </ToolIcon>
                  </ToolIconWrapper>
                  <ToolInfo>
                    <ToolTitle hoverColor={tool.accentColor}>{tool.title}</ToolTitle>
                    <ToolDescription>{tool.description}</ToolDescription>
                  </ToolInfo>
                </ToolHeader>
                <ToolFeatures>
                  {tool.features.map((feature, idx) => (
                    <ToolFeature 
                      key={idx}
                      accentColor={tool.accentColor}
                    >
                      <FaCheckCircle /> {feature}
                    </ToolFeature>
                  ))}
                </ToolFeatures>
                <ToolAction bg={`rgba(${tool.accentColor === '#22c55e' ? '34, 197, 94' : tool.accentColor === '#3b82f6' ? '59, 130, 246' : tool.accentColor === '#f59e0b' ? '245, 158, 11' : tool.accentColor === '#8b5cf6' ? '139, 92, 246' : tool.accentColor === '#ec4899' ? '236, 72, 153' : '20, 184, 166'}, 0.05)`} 
                  hoverBg={`rgba(${tool.accentColor === '#22c55e' ? '34, 197, 94' : tool.accentColor === '#3b82f6' ? '59, 130, 246' : tool.accentColor === '#f59e0b' ? '245, 158, 11' : tool.accentColor === '#8b5cf6' ? '139, 92, 246' : tool.accentColor === '#ec4899' ? '236, 72, 153' : '20, 184, 166'}, 0.1)`}>
                  <ToolLink 
                    to="/tools"
                    color={tool.linkColor}
                    hoverColor={tool.linkHoverColor}
                  >
                    Explore {tool.title} <FaArrowRight />
                  </ToolLink>
                </ToolAction>
              </ToolCard>
            ))}
          </ToolsGrid>
          
          <StatsSection>
            <StatsHeader>
              <StatsTitle>BloomVest <span>Impact</span></StatsTitle>
              <StatsDescription>
                Our platform has already made a significant impact connecting startups with the right investors, facilitating funding, and creating success stories.
              </StatsDescription>
            </StatsHeader>
            <StatCardsGrid>
              {stats.map((stat, index) => (
                <StatCard
                  key={index}
                  gradient={stat.gradient}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  viewport={{ once: true }}
                >
                  <StatIconWrapper 
                    bg={stat.iconBg} 
                    color={stat.iconColor}
                    hoverBg={stat.iconBg.replace('0.1', '0.2')}
                  >
                    {stat.icon}
                  </StatIconWrapper>
                  <div>
                    <StatValue gradient={stat.gradient}>{stat.value}</StatValue>
                    <StatLabel>{stat.label}</StatLabel>
                  </div>
                </StatCard>
              ))}
            </StatCardsGrid>
          </StatsSection>
        </ToolsWrapper>
      </AppSection>
    </AppContainer>
  );
};

export default HomeContent; 