import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FaArrowRight, FaChartLine, FaFileAlt, FaRegLightbulb, FaCheck, FaShieldAlt, FaUsers, FaGlobe, FaCheckCircle } from 'react-icons/fa';
import { motion, useAnimation, useInView } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';

const HeroSection = styled.section`
  padding: 130px 5% 160px;
  position: relative;
  overflow: hidden;
  min-height: 90vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: white;
  
  @media (max-width: 768px) {
    padding: 100px 5% 120px;
    min-height: 80vh;
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
  transform: scale(1.05);
`;

const VideoOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(26, 54, 93, 0.9) 0%, rgba(45, 78, 113, 0.85) 100%);
  z-index: 1;
  backdrop-filter: blur(2px);
`;

const HeroContainer = styled.div`
  max-width: 1280px;
  width: 100%;
  margin: 0 auto;
  position: relative;
  z-index: 5;
`;

const BackgroundDecoration = styled.div`
  position: absolute;
  border-radius: 50%;
  filter: blur(70px);
  z-index: 1;
  
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

const FloatingElement = styled(motion.div)`
  position: absolute;
  z-index: 2;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.03));
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(4px);
  
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
  
  @media (max-width: 768px) {
    &.element-1, &.element-3 {
      width: 80px;
      height: 80px;
    }
    
    &.element-2, &.element-4 {
      width: 60px;
      height: 60px;
    }
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
  
  @media (max-width: 768px) {
    display: none;
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
`;

const HeroContent = styled.div`
  text-align: center;
  max-width: 1000px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
  padding: 1rem;
`;

const SubHeading = styled(motion.p)`
  font-size: 1.25rem;
  font-weight: 700;
  color: #4ade80;
  margin-bottom: 1.25rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  position: relative;
  display: inline-block;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -6px;
    left: 50%;
    transform: translateX(-50%);
    width: 50px;
    height: 3px;
    background: linear-gradient(to right, #22c55e, #4ade80);
    border-radius: 3px;
  }
`;

const MainHeading = styled(motion.h1)`
  font-size: 4.8rem;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 1.75rem;
  color: white;
  letter-spacing: -1px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
  
  span {
    color: #22c55e;
    display: inline-block;
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 5px;
      background: rgba(34, 197, 94, 0.25);
      border-radius: 5px;
      transform: translateY(8px);
    }
  }
  
  @media (max-width: 1024px) {
    font-size: 4rem;
  }
  
  @media (max-width: 768px) {
    font-size: 3.2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 2.5rem;
  }
`;

const Description = styled(motion.p)`
  font-size: 1.35rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 3rem;
  line-height: 1.7;
  font-weight: 400;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  
  strong {
    color: #4ade80;
    font-weight: 600;
  }
`;

const CTAButtons = styled(motion.div)`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 2.5rem;
  
  @media (max-width: 640px) {
    flex-direction: column;
    gap: 1.2rem;
    align-items: center;
  }
`;

const PrimaryButton = styled(RouterLink)`
  background: linear-gradient(to right, #22c55e, #15803d);
  color: white;
  border: none;
  padding: 1.2rem 2.75rem;
  font-size: 1.15rem;
  font-weight: 700;
  border-radius: 50px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  box-shadow: 0 10px 25px rgba(34, 197, 94, 0.45);
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
  position: relative;
  overflow: hidden;
  z-index: 1;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 0%;
    height: 100%;
    background: linear-gradient(to right, #15803d, #0f5c2d);
    z-index: -1;
    transition: width 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: 50px;
  }
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(34, 197, 94, 0.6);
    
    &::before {
      width: 100%;
    }
  }
  
  svg {
    transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  &:hover svg {
    transform: translateX(5px);
  }
  
  @media (max-width: 768px) {
    padding: 1.1rem 2.25rem;
    font-size: 1.05rem;
  }
`;

const SecondaryButton = styled(RouterLink)`
  background: rgba(255, 255, 255, 0.08);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 1.2rem 2.75rem;
  font-size: 1.15rem;
  font-weight: 600;
  border-radius: 50px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
  backdrop-filter: blur(10px);
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-5px);
    box-shadow: 0 12px 25px rgba(0, 0, 0, 0.15);
    border-color: rgba(255, 255, 255, 0.5);
  }
  
  @media (max-width: 768px) {
    padding: 1.1rem 2.25rem;
    font-size: 1.05rem;
  }
`;

const ScrollIndicator = styled(motion.div)`
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  z-index: 10;
  cursor: pointer;
  
  .arrow {
    margin-top: 8px;
    width: 24px;
    height: 24px;
    border-left: 2px solid rgba(255, 255, 255, 0.7);
    border-bottom: 2px solid rgba(255, 255, 255, 0.7);
    transform: rotate(-45deg);
  }
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const FeaturesCards = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 3rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const FeatureCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(8px);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
    border-color: rgba(34, 197, 94, 0.4);
    background: rgba(255, 255, 255, 0.06);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: #22c55e;
    transition: all 0.3s ease;
  }
  
  &:hover::before {
    width: 6px;
  }
`;

const FeatureIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(34, 197, 94, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4ade80;
  font-size: 1.25rem;
  flex-shrink: 0;
  transition: all 0.3s ease;
  
  ${FeatureCard}:hover & {
    transform: scale(1.1) rotate(10deg);
    background: #22c55e;
    color: white;
  }
`;

const FeatureContent = styled.div`
  flex: 1;
`;

const FeatureTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
`;

const FeatureText = styled.p`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
`;

const WaveSeparator = styled.div`
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 80px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%23ffffff' fill-opacity='1' d='M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,218.7C672,235,768,245,864,229.3C960,213,1056,171,1152,154.7C1248,139,1344,149,1392,154.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'%3E%3C/path%3E%3C/svg%3E");
  background-size: cover;
  background-position: center;
  z-index: 3;
`;

const FeaturesSection = styled.section`
  padding: 120px 5%;
  background: linear-gradient(to bottom, #fff, #f8fafc);
  position: relative;
  overflow: hidden;
  
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
    padding: 80px 5%;
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
  font-size: 2.8rem;
  font-weight: 800;
  color: #1a365d;
  margin-bottom: 1.5rem;
  position: relative;
  display: inline-block;
  line-height: 1.3;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -12px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 4px;
    background: linear-gradient(to right, #22c55e, rgba(34, 197, 94, 0.2));
    border-radius: 4px;
  }
  
  @media (max-width: 768px) {
    font-size: 2.25rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.9rem;
  }
`;

const SectionDescription = styled.p`
  font-size: 1.2rem;
  color: #475569;
  line-height: 1.8;
  margin-top: 2rem;
  
  strong {
    color: #1a365d;
    font-weight: 600;
  }
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2.5rem;
  margin-top: 3.5rem;
  position: relative;
  z-index: 1;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const StatisticsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  max-width: 1200px;
  margin: 6rem auto 0;
  position: relative;
  z-index: 1;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const StatItem = styled(motion.div)`
  text-align: center;
  padding: 2.5rem 2rem;
  background: white;
  border-radius: 20px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(226, 232, 240, 0.6);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 20px;
    padding: 2px;
    background: linear-gradient(135deg, rgba(34, 197, 94, 0.5), rgba(26, 54, 93, 0.3));
    -webkit-mask: 
      linear-gradient(#fff 0 0) content-box, 
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0;
    transition: opacity 0.4s ease;
  }
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    
    &::before {
      opacity: 1;
    }
  }
`;

const StatValue = styled.div`
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #1a365d 0%, #22c55e 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
  position: relative;
  display: inline-block;
  
  &::after {
    content: '';
    position: absolute;
    width: 50%;
    height: 3px;
    background: linear-gradient(to right, #22c55e, rgba(34, 197, 94, 0.3));
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 3px;
  }
`;

const StatLabel = styled.div`
  font-size: 1.1rem;
  color: #475569;
  font-weight: 600;
  margin-top: 0.5rem;
`;

const AboutSection = styled.section`
  padding: 120px 0;
  background: linear-gradient(to bottom, #f8fafc, #ffffff);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: radial-gradient(rgba(34, 197, 94, 0.03) 2px, transparent 2px);
    background-size: 30px 30px;
    opacity: 0.8;
    z-index: 0;
  }
`;

const AboutContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  position: relative;
  z-index: 1;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
`;

const AboutImage = styled.div`
  position: relative;
  
  img {
    width: 100%;
    border-radius: 20px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 20px;
    padding: 3px;
    background: linear-gradient(135deg, #22c55e, #0891b2);
    -webkit-mask: 
      linear-gradient(#fff 0 0) content-box, 
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0.7;
    z-index: 1;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 20px;
    left: 20px;
    right: -20px;
    bottom: -20px;
    border: 2px solid rgba(34, 197, 94, 0.4);
    border-radius: 20px;
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: -1;
  }
  
  &:hover {
    img {
      transform: scale(1.02);
    }
    
    &::after {
      top: 15px;
      left: 15px;
      right: -15px;
      bottom: -15px;
      border-color: rgba(34, 197, 94, 0.7);
    }
  }
  
  @media (max-width: 1024px) {
    max-width: 600px;
    margin: 0 auto;
  }
`;

const AboutImageDecoration = styled.div`
  position: absolute;
  z-index: -1;
  
  &.circle-1 {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(8, 145, 178, 0.1));
    bottom: -30px;
    right: -40px;
    filter: blur(3px);
  }
  
  &.circle-2 {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(8, 145, 178, 0.15), rgba(59, 130, 246, 0.15));
    top: -20px;
    left: -30px;
    filter: blur(2px);
  }
`;

const AboutContent = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const AboutSubtitle = styled.p`
  color: #22c55e;
  font-weight: 700;
  font-size: 1.1rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  position: relative;
  display: inline-block;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -6px;
    left: 0;
    width: 40px;
    height: 3px;
    background: linear-gradient(to right, #22c55e, #4ade80);
    border-radius: 3px;
  }
`;

const AboutTitle = styled.h2`
  font-size: 2.75rem;
  font-weight: 800;
  color: #1a365d;
  line-height: 1.2;
  margin-bottom: 0.75rem;
  
  span {
    color: #22c55e;
  position: relative;
  display: inline-block;
    z-index: 1;
  
  &::after {
    content: '';
    position: absolute;
      bottom: 6px;
      left: 0;
      width: 100%;
      height: 8px;
      background: rgba(34, 197, 94, 0.2);
      z-index: -1;
      border-radius: 4px;
    }
  }
  
  @media (max-width: 768px) {
    font-size: 2.25rem;
  }
`;

const AboutDescription = styled.p`
  font-size: 1.15rem;
  line-height: 1.8;
  color: #475569;
  margin-bottom: 0.5rem;
  
  strong {
    color: #1a365d;
    font-weight: 600;
  }
`;

const AboutFeatures = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  margin-top: 1.5rem;

  @media (min-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem; 
  }
`;

const AboutFeature = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.9rem;
  padding: 1rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: 1px solid rgba(226, 232, 240, 0.8);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
    border-color: rgba(34, 197, 94, 0.5);
  }
  
  svg {
    color: #22c55e;
    font-size: 1.4rem;
    background: rgba(34, 197, 94, 0.1);
    padding: 0.5rem;
    border-radius: 50%;
    flex-shrink: 0;
    transition: all 0.3s ease;
  }
  
  &:hover svg {
    transform: scale(1.1);
    background: #22c55e;
    color: white;
  }
`;

const AboutFeatureText = styled.p`
  font-weight: 600;
  color: #1a365d;
  font-size: 1rem;
  line-height: 1.5;
`;

const AboutCTA = styled(motion.div)`
  margin-top: 2rem;
  
  a {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.9rem 2rem;
    background: linear-gradient(to right, #22c55e, #15803d);
    color: white;
    font-weight: 600;
    border-radius: 50px;
    text-decoration: none;
    box-shadow: 0 8px 15px rgba(34, 197, 94, 0.25);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    
    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 12px 20px rgba(34, 197, 94, 0.4);
      
      svg {
        transform: translateX(3px);
      }
    }
    
    svg {
      transition: transform 0.3s ease;
    }
  }
`;

const HomeContent = () => {
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: false });
  const heroControls = useAnimation();
  
  useEffect(() => {
    if (heroInView) {
      heroControls.start('visible');
    }
  }, [heroInView, heroControls]);

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

  const scrollIndicatorVariants = {
    animate: {
      y: [0, 10, 0],
      opacity: [0.7, 1, 0.7],
      transition: {
        y: {
          repeat: Infinity,
          duration: 2,
          ease: "easeInOut"
        },
        opacity: {
          repeat: Infinity,
          duration: 2,
          ease: "easeInOut"
        }
      }
    }
  };

  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: (i) => ({ 
      y: 0, 
      opacity: 1,
      transition: { 
        type: 'spring', 
        damping: 15, 
        stiffness: 100,
        delay: i * 0.1,
      }
    })
  };

  const floatingAnimation1 = {
    y: [0, -15, 0],
    transition: {
      y: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const floatingAnimation2 = {
    y: [0, -20, 0],
    transition: {
      y: {
        duration: 7,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 0.5
      }
    }
  };

  const rotateAnimation = {
    rotate: [0, 360],
    transition: {
      rotate: {
        duration: 20,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  // Updated features content focused on startup investment
  const features = [
    {
      icon: <FaCheckCircle />,
      title: "Startup Funding",
      description: "Strategic capital deployment through seed rounds, Series A participation, convertible notes, and SAFE arrangements tailored to each venture's growth stage."
    },
    {
      icon: <FaChartLine />,
      title: "Due Diligence Excellence",
      description: "Comprehensive evaluation frameworks analyzing market potential, founder dynamics, technology validation, and scalability factors for informed investment decisions."
    },
    {
      icon: <FaShieldAlt />,
      title: "Growth Acceleration",
      description: "Beyond capital, we provide strategic partnership connections, industry expert introductions, and operational guidance to maximize startup success."
    }
  ];

  // Updated statistics content focused on startup investments
  const statistics = [
    { value: "85+", label: "Portfolio Companies" },
    { value: "92%", label: "Startups Still Active" },
    { value: "$180M+", label: "Capital Deployed" },
    { value: "12", label: "Successful Exits" } 
  ];

  const scrollToContent = () => {
    const aboutSection = document.querySelector('#about-section');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <HeroSection ref={heroRef}>
        <VideoBackground autoPlay loop muted playsInline>
          <source src="/video2.mp4" type="video/mp4" />
        </VideoBackground>
        <VideoOverlay />
        <BackgroundDecoration className="top-left" />
        <BackgroundDecoration className="bottom-right" />
        <BackgroundDecoration className="center" />
        <GridPattern />
        
        <FloatingElement 
          className="element-1"
          animate={floatingAnimation1}
        />
        <FloatingElement 
          className="element-2"
          animate={floatingAnimation2}
        />
        <FloatingElement 
          className="element-3"
          animate={floatingAnimation2}
        />
        <FloatingElement 
          className="element-4"
          animate={floatingAnimation1}
        />
        
        <ShapedElement 
          className="triangle"
          animate={rotateAnimation}
        />
        <ShapedElement 
          className="square"
          animate={rotateAnimation}
        />
        
        <HeroContainer>
          <HeroContent>
            <SubHeading
              initial={{ opacity: 0, y: 20 }}
              animate={heroControls}
              variants={{
                visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
                hidden: { opacity: 0, y: 20 }
              }}
            >
              Fueling Innovation Through Strategic Investments
            </SubHeading>
            <MainHeading
              initial={{ opacity: 0, y: 30 }}
              animate={heroControls}
              variants={{
                visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.2 } },
                hidden: { opacity: 0, y: 30 }
              }}
            >
              Helping Startups <span>Bloom</span> Into Industry Leaders
            </MainHeading>
            <Description
              initial={{ opacity: 0, y: 30 }}
              animate={heroControls}
              variants={{
                visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.4 } },
                hidden: { opacity: 0, y: 30 }
              }}
            >
              BloomVest specializes in <strong>early-stage investment services</strong> that propel promising startups toward sustainable growth. We bridge the gap between visionary founders and strategic capital, combining financial expertise with operational guidance to transform innovative ideas into market-leading companies.
            </Description>
            <CTAButtons
              initial={{ opacity: 0, y: 30 }}
              animate={heroControls}
              variants={{
                visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.6 } },
                hidden: { opacity: 0, y: 30 }
              }}
            >
              <PrimaryButton to="/services">
                Explore Investment Opportunities <FaArrowRight />
              </PrimaryButton>
              <SecondaryButton to="/about">
                For Startups
              </SecondaryButton>
            </CTAButtons>
          </HeroContent>
        </HeroContainer>
        
        <ScrollIndicator 
          onClick={scrollToContent}
          animate="animate"
          variants={scrollIndicatorVariants}
        >
          <span>Scroll Down</span>
          <div className="arrow"></div>
        </ScrollIndicator>
      </HeroSection>
      
      <AboutSection id="about-section">
        <AboutContainer>
          <AboutImage>
            <AboutImageDecoration className="circle-1" />
            <AboutImageDecoration className="circle-2" />
            <img src="/bloomvest.png" alt="BloomVest investment team" />
          </AboutImage>
          <AboutContent
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, type: "spring" }}
            viewport={{ once: true }}
          >
            <AboutSubtitle>Our Investment Approach</AboutSubtitle>
            <AboutTitle>Venture Portfolio <span>Management</span></AboutTitle>
            <AboutDescription>
              At BloomVest, we craft <strong>diversified early-stage investment portfolios</strong> that balance innovation potential with strategic risk management. Our expertise spans multiple industries, enabling us to identify promising startups with strong market positioning, exceptional founding teams, and scalable business models—the fundamental elements for extraordinary growth and successful exits.
            </AboutDescription>
            <AboutFeatures>
              {[
                "Seed & Series A Investments",
                "Convertible Note Financing",
                "SAFE Arrangements",
                "Secondary Market Opportunities"
              ].map((feature, index) => (
                <AboutFeature 
                key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <FaCheckCircle />
                  <AboutFeatureText>{feature}</AboutFeatureText>
                </AboutFeature>
              ))}
            </AboutFeatures>
            <AboutCTA
            initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <RouterLink to="/services">
                Discover Our Investment Process <FaArrowRight />
              </RouterLink>
            </AboutCTA>
          </AboutContent>
        </AboutContainer>
      </AboutSection>
      
      <FeaturesSection>
        <SectionHeader>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, type: "spring" }}
            viewport={{ once: true }}
          >
            <SectionTitle>Beyond Capital Investment</SectionTitle>
            <SectionDescription>
              We believe exceptional returns come from <strong>active partnership with founders</strong>. Our comprehensive approach combines strategic capital with operational expertise, network access, and growth resources—everything promising startups need to accelerate their journey from concept to market leadership.
            </SectionDescription>
          </motion.div>
        </SectionHeader>
        
        <FeatureGrid>
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15, type: "spring" }}
              viewport={{ once: true }}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              style={{ 
                background: "white", 
                borderColor: "rgba(226, 232, 240, 0.8)",
                border: "1px solid rgba(226, 232, 240, 0.8)",
                borderRadius: "16px"
              }}
            >
              <FeatureIcon 
                 style={{
                    background: "rgba(34, 197, 94, 0.1)",
                    color: "#22c55e"
                 }}
              >{feature.icon}</FeatureIcon>
              <FeatureContent>
                <FeatureTitle style={{ color: "#1a365d" }}>{feature.title}</FeatureTitle>
                <FeatureText style={{ color: "#475569" }}>{feature.description}</FeatureText>
              </FeatureContent>
            </FeatureCard>
          ))}
        </FeatureGrid>
        
        <StatisticsSection>
          {statistics.map((stat, index) => (
            <StatItem 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              viewport={{ once: true }}
            >
              <StatValue>{stat.value}</StatValue>
              <StatLabel>{stat.label}</StatLabel>
            </StatItem>
          ))}
        </StatisticsSection>
      </FeaturesSection>
    </>
  );
};

export default HomeContent; 