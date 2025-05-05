import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, useInView } from 'framer-motion';
import { FaChartLine, FaUserTie, FaHome, FaUniversity, FaChartPie, FaRegLightbulb, FaArrowRight, 
  FaNewspaper, FaPodcast, FaFileAlt, FaGlobeAmericas, FaRegCalendarAlt, FaRegClock,
  FaDatabase, FaBookOpen, FaUniversalAccess, FaChartBar, FaMoneyBillWaveAlt, FaLandmark, 
  FaHandHoldingUsd, FaRegFileAlt, FaMoneyBillAlt, FaShieldAlt, FaRegHandshake, FaExternalLinkAlt,
  FaCalculator, FaCoins, FaChartArea, FaPercentage, FaDollarSign, FaPiggyBank, FaUnlock } from 'react-icons/fa';

// Add this new wrapper for the whole page
const PageWrapper = styled.div`
  overflow-x: hidden;
  background: #fcfcfd;
  transform: translateZ(0); /* Hardware acceleration */
  backface-visibility: hidden;
  perspective: 1000;
`;

// Update HeroSection
const HeroSection = styled.section`
  padding: 120px 5% 140px;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #1a365d 0%, #2d4e71 100%);
  min-height: 65vh;
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

// Optimize BackgroundDecoration animation for better mobile performance
const BackgroundDecoration = styled.div`
  position: absolute;
  border-radius: 50%;
  filter: blur(70px);
  z-index: 1;
  will-change: transform, opacity; /* Optimize animation */
  
  @media (max-width: 768px) {
    filter: blur(40px); /* Reduce blur on mobile */
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

// Optimize GridPattern for mobile
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
    background-size: 60px 60px; /* Simpler pattern on mobile */
    opacity: 0.3;
  }
`;

// Optimize FloatingElement animation
const FloatingElement = styled(motion.div)`
  position: absolute;
  z-index: 2;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.03));
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(4px);
  will-change: transform; /* Optimize animation */
  
  @media (max-width: 768px) {
    backdrop-filter: none; /* Remove expensive backdrop filter on mobile */
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1); /* Lighter shadow */
  }
  
  &.element-1 {
    width: 120px;
    height: 120px;
    top: 15%;
    left: 10%;
  }
  
  &.element-2 {
    width: 80px;
    height: 80px;
    bottom: 20%;
    left: 15%;
  }
  
  &.element-3 {
    width: 150px;
    height: 150px;
    top: 20%;
    right: 10%;
  }
  
  &.element-4 {
    width: 100px;
    height: 100px;
    bottom: 25%;
    right: 15%;
  }
`;

const ShapedElement = styled(motion.div)`
  position: absolute;
  z-index: 2;
  opacity: 0.8;
  
  &.triangle {
    width: 0;
    height: 0;
    border-left: 50px solid transparent;
    border-right: 50px solid transparent;
    border-bottom: 86px solid rgba(34, 197, 94, 0.15);
    top: 30%;
    left: 20%;
    filter: blur(2px);
  }
  
  &.square {
    width: 70px;
    height: 70px;
    background: rgba(59, 130, 246, 0.15);
    bottom: 35%;
    right: 25%;
    transform: rotate(45deg);
    filter: blur(2px);
  }
`;

// Update SectionContainer
const SectionContainer = styled.section`
  padding: 120px 0;
  background: ${props => props.bgColor || 'white'};
  position: relative;
  overflow: hidden;
  
  @media (max-width: 768px) {
    padding: 80px 0;
  }
`;

const ContentContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 2;
`;

// Update SectionTitle
const SectionTitle = styled.h2`
  font-size: 3rem;
  font-weight: 800;
  color: #1a365d;
  margin-bottom: 1.5rem;
  text-align: center;
  position: relative;
  
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
  
  &::after {
    content: '';
    position: absolute;
    bottom: -15px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 4px;
    background: linear-gradient(to right, #22c55e, rgba(34, 197, 94, 0.2));
    border-radius: 4px;
  }
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const SectionDescription = styled.p`
  font-size: 1.2rem;
  line-height: 1.8;
  color: #475569;
  text-align: center;
  max-width: 800px;
  margin: 2rem auto 3rem;
  
  strong {
    color: #1a365d;
    font-weight: 600;
  }
`;

// Video Section
const VideoSection = styled.section`
  padding: 120px 0;
  background: linear-gradient(to bottom, #f8fafc, #ffffff);
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
  
  @media (max-width: 768px) {
    padding: 80px 0;
  }
`;

const VideoContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3.5rem;
  margin-top: 4rem;
  position: relative;
  
  @media (max-width: 1024px) {
    gap: 3rem;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 4rem;
  }
`;

const VideoCard = styled(motion.div)`
  background: white;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.1);
  transition: all 0.5s ease;
  transform: translateY(0);
  border: 1px solid rgba(226, 232, 240, 0.8);
  
  &:hover {
    transform: translateY(-15px);
    box-shadow: 0 35px 70px rgba(0, 0, 0, 0.15);
    border-color: rgba(34, 197, 94, 0.3);
  }
`;

const VideoWrapper = styled.div`
  position: relative;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  cursor: pointer;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.4));
    z-index: 1;
    opacity: 0;
    transition: opacity 0.5s ease;
  }
  
  ${VideoCard}:hover &::before {
    opacity: 1;
  }
  
  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.8s ease;
  }
  
  ${VideoCard}:hover video {
    transform: scale(1.05);
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, transparent 70%, rgba(0, 0, 0, 0.7));
    z-index: 1;
  }
`;

const VideoContent = styled.div`
  padding: 2.5rem;
`;

const VideoTitle = styled.h3`
  font-size: 1.6rem;
  font-weight: 700;
  color: #1a365d;
  margin-bottom: 1rem;
  position: relative;
  display: inline-block;
  
  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 3px;
    background: linear-gradient(to right, #22c55e, rgba(34, 197, 94, 0.2));
    bottom: -8px;
    left: 0;
    transform-origin: left;
    transform: scaleX(0.3);
    transition: transform 0.4s ease;
  }
  
  ${VideoCard}:hover &::after {
    transform: scaleX(1);
  }
`;

const VideoDescription = styled.p`
  font-size: 1.1rem;
  line-height: 1.7;
  color: #475569;
  margin-bottom: 1.5rem;
`;

// Case Studies
const CaseStudyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 3rem;
  
  @media (max-width: 1200px) {
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
`;

const CaseStudyCard = styled(motion.div)`
  background: white;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.06);
  transition: all 0.45s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(226, 232, 240, 0.8);
  position: relative;
  z-index: 1;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 24px;
    padding: 2px;
    background: linear-gradient(135deg, rgba(34, 197, 94, 0.5), rgba(26, 54, 93, 0.3));
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
    transform: translateY(-15px);
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.1);
    
    &::before {
      opacity: 1;
    }
  }
`;

const CaseStudyHeader = styled.div`
  padding: 2rem;
  position: relative;
  background: ${props => props.bg || 'linear-gradient(135deg, #22c55e, #15803d)'};
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 6px;
    background: rgba(255, 255, 255, 0.2);
  }
`;

const ClientProfile = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const ProfileIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  color: white;
  font-size: 1.5rem;
`;

const ClientInfo = styled.div`
  color: white;
`;

const ClientTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
`;

const ClientDetails = styled.p`
  font-size: 0.9rem;
  opacity: 0.8;
`;

const CaseStudyContent = styled.div`
  padding: 2rem;
`;

const ChallengeSection = styled.div`
  margin-bottom: 1.5rem;
`;

const SectionHeading = styled.h4`
  font-size: 1.1rem;
  font-weight: 700;
  color: #1a365d;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.5rem;
    color: #22c55e;
  }
`;

const SolutionSection = styled.div`
  margin-bottom: 1.5rem;
`;

const ResultsSection = styled.div`
  margin-bottom: 1.5rem;
`;

const ResultsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ResultItem = styled.li`
  display: flex;
  align-items: flex-start;
  margin-bottom: 0.75rem;
  
  svg {
    color: #22c55e;
    margin-right: 0.75rem;
    margin-top: 0.25rem;
    flex-shrink: 0;
  }
  
  span {
    color: #475569;
    line-height: 1.5;
  }
`;

const ReadMoreLink = styled.a`
  display: inline-flex;
  align-items: center;
  color: #22c55e;
  font-weight: 600;
  text-decoration: none;
  margin-top: 1rem;
  transition: all 0.3s ease;
  gap: 0.5rem;
  
  svg {
    transition: transform 0.3s ease;
  }
  
  &:hover {
    color: #15803d;
    
    svg {
      transform: translateX(3px);
    }
  }
`;

// Animation variants
const titleVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.7, ease: "easeOut" } 
  }
};

const textVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.7, delay: 0.2, ease: "easeOut" } 
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, type: "spring", stiffness: 50 } 
  }
};

// Update floatingVariants for more efficient mobile animations
const floatingVariants1 = {
  animate: {
    y: [0, -15, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut"
    }
  }
};

// Add conditional animation for mobile
const floatingMobileVariants = {
  animate: {
    y: [0, -5, 0], // Smaller movement range
    transition: {
      duration: 8, // Slower animation
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut"
    }
  }
};

const floatingVariants2 = {
  animate: {
    y: [0, 15, 0],
    transition: {
      duration: 7,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut"
    }
  }
};

const rotateVariants = {
  animate: {
    rotate: [0, 360],
    transition: {
      duration: 20,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

// New components for Market Insights section
const MarketInsightsSection = styled.section`
  padding: 120px 0;
  background: linear-gradient(to bottom, #ffffff, #f8fafc);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: 
      radial-gradient(rgba(26, 54, 93, 0.03) 1px, transparent 1px),
      radial-gradient(rgba(34, 197, 94, 0.03) 1px, transparent 1px);
    background-size: 40px 40px, 30px 30px;
    background-position: 0 0, 20px 20px;
    opacity: 0.6;
    z-index: 0;
  }
  
  @media (max-width: 768px) {
    padding: 80px 0;
  }
`;

const TabsContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 3rem;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 80%;
    max-width: 700px;
    height: 1px;
    background: #e2e8f0;
  }
`;

const TabButton = styled.button`
  background: transparent;
  border: none;
  padding: 1rem 1.5rem;
  margin: 0 0.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => props.active ? '#22c55e' : '#64748b'};
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background: #22c55e;
    transform: scaleX(${props => props.active ? 1 : 0});
    transform-origin: center;
    transition: transform 0.3s ease;
    z-index: 1;
  }
  
  &:hover {
    color: ${props => props.active ? '#22c55e' : '#1a365d'};
  }
`;

const InsightGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const InsightCard = styled(motion.article)`
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: 1px solid rgba(226, 232, 240, 0.8);
  display: flex;
  flex-direction: column;
  height: 100%;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    border-color: rgba(34, 197, 94, 0.3);
  }
`;

const InsightImage = styled.div`
  height: 220px;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50%;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  }
`;

const InsightCategory = styled.span`
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: ${props => props.bg || '#22c55e'};
  color: white;
  padding: 0.4rem 0.8rem;
  border-radius: 30px;
  font-size: 0.85rem;
  font-weight: 600;
  z-index: 2;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
`;

const InsightContent = styled.div`
  padding: 2rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const InsightTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a365d;
  margin-bottom: 1rem;
  line-height: 1.4;
`;

const InsightMeta = styled.div`
  display: flex;
  align-items: center;
  color: #64748b;
  font-size: 0.9rem;
  margin-bottom: 1.25rem;
  gap: 1.5rem;
`;

const MetaItem = styled.span`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  
  svg {
    color: #22c55e;
  }
`;

const InsightDescription = styled.p`
  font-size: 1.1rem;
  line-height: 1.7;
  color: #475569;
  margin-bottom: 1.5rem;
  flex-grow: 1;
`;

const ReadMoreButton = styled.a`
  display: inline-flex;
  align-items: center;
  color: #22c55e;
  font-weight: 600;
  text-decoration: none;
  gap: 0.5rem;
  margin-top: auto;
  transition: all 0.3s ease;
  
  svg {
    transition: transform 0.3s ease;
  }
  
  &:hover {
    color: #15803d;
    
    svg {
      transform: translateX(3px);
    }
  }
`;

const FeaturedInsight = styled(motion.article)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: white;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
  margin-bottom: 4rem;
  border: 1px solid rgba(226, 232, 240, 0.8);
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const FeaturedImage = styled.div`
  height: 100%;
  min-height: 400px;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
  position: relative;
  
  @media (max-width: 1024px) {
    height: 300px;
  }
`;

const FeaturedContent = styled.div`
  padding: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  
  @media (max-width: 768px) {
    padding: 2rem;
  }
`;

const FeaturedBadge = styled.div`
  display: inline-flex;
  align-items: center;
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
  gap: 0.4rem;
`;

const FeaturedTitle = styled.h3`
  font-size: 2.2rem;
  font-weight: 800;
  color: #1a365d;
  margin-bottom: 1.25rem;
  line-height: 1.3;
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

const PodcastSection = styled.div`
  margin-top: 5rem;
`;

const PodcastCard = styled(motion.div)`
  background: white;
  border-radius: 20px;
  overflow: hidden;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
  border: 1px solid rgba(226, 232, 240, 0.8);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    border-color: rgba(34, 197, 94, 0.3);
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    padding: 1.5rem;
    gap: 1.5rem;
    text-align: center;
  }
`;

const PodcastIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  flex-shrink: 0;
  
  @media (max-width: 768px) {
    margin: 0 auto;
  }
`;

const PodcastContent = styled.div`
  flex-grow: 1;
`;

const PodcastTitle = styled.h3`
  font-size: 1.6rem;
  font-weight: 700;
  color: #1a365d;
  margin-bottom: 0.75rem;
`;

const PodcastDescription = styled.p`
  font-size: 1.1rem;
  line-height: 1.7;
  color: #475569;
  margin-bottom: 1.25rem;
`;

const ListenButton = styled.a`
  display: inline-flex;
  align-items: center;
  background: #1a365d;
  color: white;
  font-weight: 600;
  padding: 0.8rem 1.5rem;
  border-radius: 50px;
  text-decoration: none;
  gap: 0.6rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: #22c55e;
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(34, 197, 94, 0.2);
  }
  
  @media (max-width: 768px) {
    margin: 0 auto;
  }
`;

// Update KnowledgeHubSection
const KnowledgeHubSection = styled.section`
  padding: 120px 0;
  background: linear-gradient(to bottom, #1a365d 0%, #0f2942 100%);
  position: relative;
  overflow: hidden;
  color: white;
  
  ${SectionTitle} {
    color: white;
  }
  
  ${SectionDescription} {
    color: rgba(255, 255, 255, 0.9);
    
    strong {
      color: #4ade80;
    }
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: 
      radial-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
      radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px);
    background-size: 40px 40px, 30px 30px;
    background-position: 0 0, 20px 20px;
    opacity: 0.4;
    z-index: 0;
  }
`;

// Update TopicsGrid
const TopicsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

// Update TopicCard
const TopicCard = styled(motion.a)`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: white;
  transition: all 0.3s ease;
  height: 100%;
  cursor: pointer;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  
  &:hover {
    transform: translateY(-10px);
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
  }
`;

const TopicIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  margin-bottom: 1.5rem;
  background: ${props => props.bg || 'rgba(34, 197, 94, 0.2)'};
  color: ${props => props.color || '#22c55e'};
`;

const TopicTitle = styled.h3`
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  color: white;
`;

const TopicDescription = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 1.5rem;
  flex-grow: 1;
`;

const ExternalLinkButton = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  font-size: 0.95rem;
  color: ${props => props.color || '#22c55e'};
  margin-top: auto;
  
  svg {
    transition: transform 0.3s ease;
  }
  
  ${TopicCard}:hover & svg {
    transform: translateX(3px);
  }
`;

const LightSection = styled.div`
  color: #1a365d;
  
  ${SectionTitle} {
    color: #1a365d;
  }
  
  ${SectionDescription} {
    color: #475569;
  }
`;

// Update CalculatorSection
const CalculatorSection = styled.section`
  padding: 120px 0;
  background: linear-gradient(to bottom, #ffffff, #f8fafc);
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
  
  @media (max-width: 768px) {
    padding: 80px 0;
  }
`;

// Update CalculatorContainer
const CalculatorContainer = styled.div`
  background: white;
  border-radius: 24px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  max-width: 1000px;
  margin: 0 auto;
  border: 1px solid rgba(226, 232, 240, 0.8);
  transform: translateY(0);
  transition: transform 0.5s ease, box-shadow 0.5s ease;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 30px 60px rgba(0, 0, 0, 0.15);
  }
`;

const CalculatorHeader = styled.div`
  background: linear-gradient(135deg, #1a365d, #0f2942);
  padding: 2.5rem 3rem;
  color: white;
  
  h2 {
    font-size: 2.5rem;
    font-weight: 800;
    margin-bottom: 1rem;
  }
  
  p {
    font-size: 1.1rem;
    opacity: 0.9;
  }
`;

const TabsWrapper = styled.div`
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
  display: flex;
  overflow-x: auto;
  
  &::-webkit-scrollbar {
    display: none;
  }
`;

const CalcTab = styled.button`
  padding: 1.25rem 2rem;
  background: ${props => props.active ? 'white' : 'transparent'};
  border: none;
  font-weight: 600;
  color: ${props => props.active ? '#1a365d' : '#64748b'};
  border-bottom: 3px solid ${props => props.active ? '#22c55e' : 'transparent'};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    color: ${props => props.active ? '#1a365d' : '#334155'};
  }
`;

const CalculatorBody = styled.div`
  padding: 2.5rem 3rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  color: #1a365d;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.875rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1.1rem;
  
  &:focus {
    outline: none;
    border-color: #22c55e;
    box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.2);
  }
`;

const InputGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const CalcButton = styled.button`
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: white;
  font-weight: 700;
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 30px rgba(34, 197, 94, 0.3);
  }
`;

const CalculatorResultsSection = styled.div`
  margin-top: 2rem;
  background: #f0fdf4;
  border: 1px solid #dcfce7;
  border-radius: 12px;
  padding: 2rem;
`;

const ResultsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
`;

const ResultBox = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  
  h4 {
    font-size: 1rem;
    color: #64748b;
    margin-bottom: 0.5rem;
  }
  
  .value {
    font-size: 2rem;
    font-weight: 800;
    color: #1a365d;
  }
`;

// Add in the component itself
const CaseStudiesAndInsightsPage = () => {
  const videoRef1 = useRef(null);
  const videoRef2 = useRef(null);
  const [activeTab, setActiveTab] = React.useState('market');
  const [activeCalcTab, setActiveCalcTab] = React.useState('retirement');
  
  // Define knowledgeTopics array
  const knowledgeTopics = [
    {
      title: "Investment Education",
      description: "Comprehensive guides and articles on investment strategies, asset allocation, and market analysis for investors of all levels.",
      icon: <FaChartPie />,
      link: "https://www.investopedia.com/investing-essentials-4689754",
      iconBg: "rgba(59, 130, 246, 0.15)",
      iconColor: "#3b82f6"
    },
    {
      title: "Retirement Planning",
      description: "Resources to help you plan for a secure retirement, including 401(k) guides, IRA comparisons, and retirement calculators.",
      icon: <FaPiggyBank />,
      link: "https://www.nerdwallet.com/article/investing/retirement-planning-strategies",
      iconBg: "rgba(34, 197, 94, 0.15)",
      iconColor: "#22c55e"
    },
    {
      title: "Tax Strategy",
      description: "Insights on tax-efficient investing, tax planning, deductions, and how to maximize your after-tax returns.",
      icon: <FaMoneyBillAlt />,
      link: "https://www.morningstar.com/tax-planning",
      iconBg: "rgba(245, 158, 11, 0.15)",
      iconColor: "#f59e0b"
    },
    {
      title: "Estate Planning",
      description: "Information on wills, trusts, inheritance planning, and strategies to protect and transfer your wealth efficiently.",
      icon: <FaShieldAlt />,
      link: "https://www.fidelity.com/estate-planning-inheritance/overview",
      iconBg: "rgba(139, 92, 246, 0.15)",
      iconColor: "#8b5cf6"
    },
    {
      title: "Market Research",
      description: "Access professional market analysis, sector outlooks, and economic forecasts from leading financial institutions.",
      icon: <FaChartLine />,
      link: "https://www.bloomberg.com/markets",
      iconBg: "rgba(236, 72, 153, 0.15)",
      iconColor: "#ec4899"
    },
    {
      title: "Financial Education",
      description: "Foundational resources for building financial literacy, including budgeting, debt management, and saving strategies.",
      icon: <FaBookOpen />,
      link: "https://www.khanacademy.org/college-careers-more/personal-finance",
      iconBg: "rgba(14, 165, 233, 0.15)",
      iconColor: "#0ea5e9"
    }
  ];
  
  // Case study data
  const caseStudies = [
    {
      client: "High-Net-Worth Family Office",
      industry: "Multi-Generational Wealth",
      icon: <FaUserTie />,
      bg: "linear-gradient(135deg, #22c55e, #15803d)",
      challenge: "A family with $50M+ in assets needed comprehensive wealth transfer planning while minimizing estate taxes and ensuring family values continued across generations.",
      solution: "We created a sophisticated multi-layered trust structure combined with a family governance framework that aligned with their philanthropic goals.",
      results: [
        "Reduced projected estate tax burden by approximately $12.8M",
        "Established protected trusts for future generations with clear governance",
        "Created a family foundation with structured giving guidelines",
        "Implemented family education program for next-generation wealth stewards"
      ]
    },
    {
      client: "Pre-IPO Tech Executive",
      industry: "Concentrated Equity Position",
      icon: <FaChartLine />,
      bg: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
      challenge: "A senior executive with significant pre-IPO equity needed strategies to diversify holdings while managing tax implications after the lockup period.",
      solution: "Developed a systematic diversification strategy utilizing exchange funds, charitable vehicles, and optimized selling schedules aligned with long-term goals.",
      results: [
        "Reduced single-stock position risk by 60% within 18 months",
        "Established $1.5M donor-advised fund using appreciated shares",
        "Created tax-efficient income stream through option collar strategies",
        "Minimized tax impact through multi-year diversification approach"
      ]
    },
    {
      client: "Retiring Business Owner",
      industry: "Business Succession Planning",
      icon: <FaRegHandshake />,
      bg: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
      challenge: "A business owner approaching retirement needed to transition their $25M manufacturing company while supporting their retirement lifestyle and legacy objectives.",
      solution: "Structured a combination ESOP and management buyout transaction with seller financing components and integrated estate planning.",
      results: [
        "Successfully transferred business while deferring capital gains taxes",
        "Created $12M retirement funding strategy with tax-efficient income",
        "Established legacy trusts for grandchildren's education",
        "Retained strategic advisory board position with ongoing income stream"
      ]
    }
  ];

  // Video data
  const videos = [
    {
      title: "Understanding Private Equity Opportunities",
      description: "Our investment team discusses how qualified investors can access institutional-quality private equity investments and their role in diversified portfolios.",
      poster: "https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80"
    },
    {
      title: "2023 Market Outlook & Positioning",
      description: "Chief Investment Officer shares analysis on current market conditions, economic indicators, and strategic portfolio allocations for the coming year.",
      poster: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80"
    }
  ];
  
  // Existing useEffect and data
  
  // Add useEffect to handle cleanup of animations
  useEffect(() => {
    // Cleanup function for better performance
    return () => {
      // This cleans up animation effects when component unmounts
    };
  }, []);
  
  // Add media query detection for conditional rendering
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Initial check
    checkMobile();
    
    // Add event listener
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  return (
    <PageWrapper className="insights-page">
      {/* Hero Section - Keep at top */}
      <HeroSection>
        <BackgroundDecoration className="top-left" />
        <BackgroundDecoration className="bottom-right" />
        <BackgroundDecoration className="center" />
        <GridPattern />
        
        {/* Don't render these on mobile or use simpler variants */}
        {!isMobile && (
          <>
            <FloatingElement 
              className="element-1"
              variants={isMobile ? floatingMobileVariants : floatingVariants1}
              animate="animate"
            />
            <FloatingElement 
              className="element-2"
              variants={isMobile ? floatingMobileVariants : floatingVariants2}
              animate="animate"
            />
            <FloatingElement 
              className="element-3"
              variants={isMobile ? floatingMobileVariants : floatingVariants2}
              animate="animate"
            />
            <FloatingElement 
              className="element-4"
              variants={isMobile ? floatingMobileVariants : floatingVariants1}
              animate="animate"
            />
          </>
        )}
        
        {/* Only show on desktop */}
        {!isMobile && (
          <>
            <ShapedElement 
              className="triangle"
              variants={rotateVariants}
              animate="animate"
            />
            <ShapedElement 
              className="square"
              variants={rotateVariants}
              animate="animate"
            />
          </>
        )}
        
        <HeroContainer>
          <HeroContent>
            <MainHeading
              initial="hidden"
              animate="visible"
              variants={titleVariants}
            >
              Financial <span>Insights</span> & Resources
            </MainHeading>
            <Description
              initial="hidden"
              animate="visible"
              variants={textVariants}
            >
              Explore our collection of case studies, financial tools, knowledge resources, and educational videos to help you make <strong>informed financial decisions</strong>.
            </Description>
          </HeroContent>
        </HeroContainer>
      </HeroSection>
      
      {/* Case Studies Section - Client Success Stories */}
      <SectionContainer bgColor="#f8fafc">
        <ContentContainer>
          <SectionTitle>Client <span>Success</span> Stories</SectionTitle>
          <SectionDescription>
            Discover how our wealth management expertise has delivered <strong>tangible results</strong> for clients across different circumstances and financial goals.
          </SectionDescription>
          
          <CaseStudyGrid>
            {caseStudies.map((study, index) => (
              <CaseStudyCard
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={cardVariants}
                transition={{ delay: index * 0.2 }}
              >
                <CaseStudyHeader bg={study.bg}>
                  <ClientProfile>
                    <ProfileIcon>
                      {study.icon}
                    </ProfileIcon>
                    <ClientInfo>
                      <ClientTitle>{study.client}</ClientTitle>
                      <ClientDetails>{study.industry}</ClientDetails>
                    </ClientInfo>
                  </ClientProfile>
                </CaseStudyHeader>
                
                <CaseStudyContent>
                  <ChallengeSection>
                    <SectionHeading>
                      <FaRegLightbulb /> Challenge
                    </SectionHeading>
                    <p>{study.challenge}</p>
                  </ChallengeSection>
                  
                  <SolutionSection>
                    <SectionHeading>
                      <FaChartPie /> Our Solution
                    </SectionHeading>
                    <p>{study.solution}</p>
                  </SolutionSection>
                  
                  <ResultsSection>
                    <SectionHeading>
                      <FaChartBar /> Results Delivered
                    </SectionHeading>
                    <ResultsList>
                      {study.results.map((result, i) => (
                        <ResultItem key={i}>
                          <FaArrowRight />
                          <span>{result}</span>
                        </ResultItem>
                      ))}
                    </ResultsList>
                  </ResultsSection>
                  
                  <ReadMoreLink href="#">
                    Read Full Case Study <FaArrowRight />
                  </ReadMoreLink>
                </CaseStudyContent>
              </CaseStudyCard>
            ))}
          </CaseStudyGrid>
        </ContentContainer>
      </SectionContainer>

      {/* Financial Calculators - Interactive tools */}
      <CalculatorSection>
        <ContentContainer>
          <SectionTitle>Financial <span>Planning</span> Calculator</SectionTitle>
          <SectionDescription>
            Our interactive financial planning tools help you visualize your financial future and make better decisions. Use these <strong>powerful calculators</strong> to project retirement savings, optimize investments, and plan for major life goals.
          </SectionDescription>
          
          <CalculatorContainer>
            <CalculatorHeader>
              <h2>Wealth Planning Calculator</h2>
              <p>Get personalized financial projections based on your goals, income, and investment strategy.</p>
            </CalculatorHeader>
            
            <TabsWrapper>
              <CalcTab 
                active={activeCalcTab === 'retirement'} 
                onClick={() => setActiveCalcTab('retirement')}
              >
                Retirement Planning
              </CalcTab>
              <CalcTab 
                active={activeCalcTab === 'investment'} 
                onClick={() => setActiveCalcTab('investment')}
              >
                Investment Growth
              </CalcTab>
              <CalcTab 
                active={activeCalcTab === 'mortgage'} 
                onClick={() => setActiveCalcTab('mortgage')}
              >
                Mortgage Calculator
              </CalcTab>
              <CalcTab 
                active={activeCalcTab === 'tax'} 
                onClick={() => setActiveCalcTab('tax')}
              >
                Tax Optimization
              </CalcTab>
            </TabsWrapper>
            
            <CalculatorBody>
              {activeCalcTab === 'retirement' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <InputGrid>
                    <div>
                      <FormGroup>
                        <Label>Current Age</Label>
                        <Input type="number" placeholder="35" min="18" max="80" />
                      </FormGroup>
                      
                      <FormGroup>
                        <Label>Retirement Age</Label>
                        <Input type="number" placeholder="65" min="40" max="90" />
                      </FormGroup>
                    </div>
                    
                    <div>
                      <FormGroup>
                        <Label>Current Savings ($)</Label>
                        <Input type="number" placeholder="100000" min="0" />
                      </FormGroup>
                      
                      <FormGroup>
                        <Label>Monthly Contribution ($)</Label>
                        <Input type="number" placeholder="1000" min="0" />
                      </FormGroup>
                    </div>
                    
                    <div>
                      <FormGroup>
                        <Label>Expected Annual Return (%)</Label>
                        <Input type="number" placeholder="7" min="1" max="15" step="0.1" />
                      </FormGroup>
                    </div>
                    
                    <div>
                      <FormGroup>
                        <Label>Inflation Rate (%)</Label>
                        <Input type="number" placeholder="2.5" min="0" max="10" step="0.1" />
                      </FormGroup>
                    </div>
                  </InputGrid>
                  
                  <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                    <CalcButton>
                      Calculate Retirement Projection
                    </CalcButton>
                  </div>
                  
                  <CalculatorResultsSection>
                    <ResultsGrid>
                      <ResultBox>
                        <h4>Projected Retirement Savings</h4>
                        <div className="value">$2,184,500</div>
                      </ResultBox>
                      
                      <ResultBox>
                        <h4>Monthly Retirement Income</h4>
                        <div className="value">$7,281</div>
                      </ResultBox>
                      
                      <ResultBox>
                        <h4>Years Until Retirement</h4>
                        <div className="value">30</div>
                      </ResultBox>
                    </ResultsGrid>
                  </CalculatorResultsSection>
                </motion.div>
              )}
              
              {activeCalcTab !== 'retirement' && (
                <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                  <p style={{ fontSize: '1.1rem', color: '#475569', marginBottom: '1rem' }}>
                    This calculator is coming soon! We're working on making it available for you.
                  </p>
                  <p style={{ color: '#64748b' }}>
                    In the meantime, try our Retirement Planning calculator to start planning your financial future.
                  </p>
                </div>
              )}
            </CalculatorBody>
          </CalculatorContainer>
        </ContentContainer>
      </CalculatorSection>
      
      {/* Knowledge Hub - Learning Resources */}
      <KnowledgeHubSection>
        <ContentContainer>
          <SectionTitle>Knowledge <span>Hub</span></SectionTitle>
          <SectionDescription>
            Expand your financial knowledge with our curated selection of <strong>trusted external resources</strong>. These knowledge bases offer in-depth information on various wealth management topics to help you make more informed financial decisions.
          </SectionDescription>
          
          <TopicsGrid>
            {knowledgeTopics.map((topic, index) => (
              <TopicCard 
                key={index}
                href={topic.link}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.1, 
                  type: "spring",
                  stiffness: 50
                }}
                viewport={{ once: true }}
              >
                <TopicIcon bg={topic.iconBg} color={topic.iconColor}>
                  {topic.icon}
                </TopicIcon>
                <TopicTitle>{topic.title}</TopicTitle>
                <TopicDescription>{topic.description}</TopicDescription>
                <ExternalLinkButton color={topic.iconColor}>
                  Visit Knowledge Base <FaExternalLinkAlt />
                </ExternalLinkButton>
              </TopicCard>
            ))}
          </TopicsGrid>
        </ContentContainer>
      </KnowledgeHubSection>
      
      {/* Educational Videos Section */}
      <VideoSection>
        <ContentContainer>
          <SectionTitle>Educational <span>Videos</span></SectionTitle>
          <SectionDescription>
            Watch our expert advisors discuss key wealth management topics and provide <strong>actionable insights</strong> to help you make informed financial decisions.
          </SectionDescription>
          
          <VideoContainer>
            {videos.map((video, index) => (
              <VideoCard
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={cardVariants}
                transition={{ delay: index * 0.2 }}
              >
                <VideoWrapper>
                  <img 
                    src={video.poster} 
                    alt={video.title} 
                    style={{width: "100%", height: "100%", objectFit: "cover"}}
                  />
                </VideoWrapper>
                <VideoContent>
                  <VideoTitle>{video.title}</VideoTitle>
                  <VideoDescription>{video.description}</VideoDescription>
                  <ReadMoreLink href="#">
                    Watch Video <FaArrowRight />
                  </ReadMoreLink>
                </VideoContent>
              </VideoCard>
            ))}
          </VideoContainer>
        </ContentContainer>
      </VideoSection>
    </PageWrapper>
  );
};

export default CaseStudiesAndInsightsPage; 