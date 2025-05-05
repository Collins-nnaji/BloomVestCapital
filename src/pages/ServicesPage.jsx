import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import AIFeatures from '../components/AIFeatures';
import Services from '../components/Services';

// Page wrapper for consistent styling
const PageWrapper = styled.div`
  overflow-x: hidden;
  background: #fcfcfd;
  transform: translateZ(0); /* Hardware acceleration */
  backface-visibility: hidden;
  perspective: 1000;
`;

// Styled components for the hero section
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

// Section divider with wave pattern - optimize for mobile
const SectionDivider = styled.div`
  height: 120px;
  background: white;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: -2px;
    height: 120px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'%3E%3Cpath d='M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z' style='fill: %231a365d;'/%3E%3C/svg%3E");
    background-size: cover;
    background-position: center;
    transform: rotate(180deg);
    will-change: transform; /* Optimize animation */
  }
  
  &.inverted {
    &::before {
      transform: rotate(0deg);
      top: auto;
      bottom: -2px;
    }
  }
  
  @media (max-width: 768px) {
    height: 80px; /* Smaller for mobile */
    
    &::before {
      height: 80px;
    }
  }
`;

const ScrollIndicator = styled.div`
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  letter-spacing: 1px;
  
  @media (max-width: 768px) {
    display: none; /* Hide on mobile to reduce animations */
  }
  
  .mouse {
    width: 30px;
    height: 50px;
    border: 2px solid rgba(255, 255, 255, 0.7);
    border-radius: 20px;
    display: flex;
    justify-content: center;
    margin-bottom: 10px;
    
    &::before {
      content: '';
      width: 4px;
      height: 10px;
      background: rgba(255, 255, 255, 0.7);
      border-radius: 2px;
      margin-top: 10px;
      animation: scroll 1.5s infinite;
      will-change: transform, opacity; /* Optimize animation */
    }
  }
  
  @keyframes scroll {
    0% {
      transform: translateY(0);
      opacity: 1;
    }
    100% {
      transform: translateY(15px);
      opacity: 0;
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

// Add mobile-optimized animation variants
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

const ServicesPage = () => {
  // Add state to detect mobile devices
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
    <PageWrapper>
      <HeroSection>
        <BackgroundDecoration className="top-left" />
        <BackgroundDecoration className="bottom-right" />
        <BackgroundDecoration className="center" />
        <GridPattern />
        
        {/* Conditionally render or use simpler animations on mobile */}
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
        
        {/* Only show decorative elements on desktop */}
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
              Our <span>Wealth Management</span> Solutions
            </MainHeading>
            <Description
              initial="hidden"
              animate="visible"
              variants={textVariants}
            >
              BloomVest Capital delivers comprehensive <strong>wealth management services</strong> tailored to your unique financial goals and needs, helping you build, protect, and grow your <strong>wealth</strong> for generations to come.
            </Description>
          </HeroContent>
        </HeroContainer>
        
        <ScrollIndicator>
          <div className="mouse"></div>
          <span>SCROLL DOWN</span>
        </ScrollIndicator>
      </HeroSection>
      
      <SectionDivider />
      
      <Services />
      
      <SectionDivider className="inverted" />
      
      <AIFeatures />
    </PageWrapper>
  );
};

export default ServicesPage; 