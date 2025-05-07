import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import AIFeatures from '../components/AIFeatures';
import Services from '../components/Services';

// Page wrapper for consistent styling
const PageWrapper = styled.div`
  overflow-x: hidden;
  background: linear-gradient(to bottom, #fcfcfd, #f8fafc);
  transform: translateZ(0); /* Hardware acceleration */
  backface-visibility: hidden;
  perspective: 1000;
`;

// Video Background Components
const VideoBackground = styled.video`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.25;
  z-index: 1;
`;

const VideoOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(26, 54, 93, 0.85) 0%, rgba(15, 23, 42, 0.95) 100%);
  z-index: 2;
`;

// Featured Video Section
const FeaturedVideoSection = styled.section`
  padding: 100px 0;
  background: linear-gradient(to bottom, #ffffff, #f8fafc);
  position: relative;
  overflow: hidden;
`;

const VideoContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 1;
`;

const VideoHeader = styled.div`
  text-align: center;
  max-width: 800px;
  margin: 0 auto 4rem;
`;

const VideoTitle = styled.h2`
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

const VideoDescription = styled.p`
  font-size: 1.2rem;
  color: #475569;
  line-height: 1.8;
`;

const MainVideoWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
  position: relative;
  aspect-ratio: 16 / 9;
  background: #000;
  margin: 0 auto;
  
  video {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

// Styled components for the hero section
const HeroSection = styled.section`
  padding: 120px 5% 130px;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #1a365d 0%, #0f172a 100%);
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: white;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    opacity: 0.08;
    z-index: 3;
  }
  
  @media (max-width: 768px) {
    padding: 90px 5% 100px;
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
  z-index: 5;
  
  /* Add subtle glass morphism effect */
  padding: 3rem;
  background: rgba(15, 23, 42, 0.35);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  
  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
  }
`;

const MainHeading = styled(motion.h1)`
  font-size: 4.5rem;
  font-weight: 900;
  line-height: 1.1;
  margin-bottom: 1.75rem;
  color: white;
  letter-spacing: -1px;
  
  span {
    background: linear-gradient(90deg, #4ade80 0%, #22d3ee 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      bottom: 5px;
      left: 0;
      width: 100%;
      height: 8px;
      background: rgba(74, 222, 128, 0.15);
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
  font-size: 1.5rem;
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
  filter: blur(80px);
  z-index: 1;
  will-change: transform, opacity;
  
  @media (max-width: 768px) {
    filter: blur(50px);
  }
  
  &.top-left {
    top: -100px;
    left: -80px;
    width: 400px;
    height: 400px;
    background: linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(16, 185, 129, 0.05));
    opacity: 0.5;
  }
  
  &.bottom-right {
    bottom: -120px;
    right: -80px;
    width: 450px;
    height: 450px;
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(34, 197, 94, 0.05));
    opacity: 0.5;
  }
  
  &.center {
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 700px;
    height: 700px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.05) 0%, transparent 70%);
    opacity: 0.3;
  }
`;

const GridPattern = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
  background-size: 60px 60px;
  background-position: center center;
  opacity: 0.4;
  z-index: 2;
`;

const FloatingElement = styled(motion.div)`
  position: absolute;
  z-index: 4;
  border-radius: 24px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02));
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(4px);
  will-change: transform;
  
  @media (max-width: 768px) {
    backdrop-filter: none;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  }
  
  &.element-1 {
    width: 120px;
    height: 120px;
    top: 15%;
    left: 10%;
    transform: rotate(15deg);
  }
  
  &.element-2 {
    width: 80px;
    height: 80px;
    bottom: 20%;
    left: 15%;
    transform: rotate(-10deg);
  }
  
  &.element-3 {
    width: 160px;
    height: 160px;
    top: 20%;
    right: 10%;
    transform: rotate(5deg);
  }
  
  &.element-4 {
    width: 100px;
    height: 100px;
    bottom: 25%;
    right: 15%;
    transform: rotate(-20deg);
  }
`;

// Section divider with a cleaner, more modern approach
const SectionDivider = styled.div`
  height: 50px;
  position: relative;
  background: linear-gradient(to bottom, #1a365d, #ffffff);
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background: rgba(255, 255, 255, 0.1);
  }
  
  @media (max-width: 768px) {
    height: 40px;
  }
`;

const ServicesPage = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const checkMobile = () => {
    setIsMobile(window.innerWidth <= 768);
  };
  
  const animationVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: [0.1, 0.9, 0.2, 1] }
    }
  };
  
  const floatingAnimation1 = {
    y: [0, -15, 0],
    rotate: ['-15deg', '-10deg', '-15deg'],
    transition: {
      y: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      },
      rotate: {
        duration: 10,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const floatingAnimation2 = {
    y: [0, -20, 0],
    rotate: ['10deg', '15deg', '10deg'],
    transition: {
      y: {
        duration: 7,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 0.5
      },
      rotate: {
        duration: 12,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const floatingAnimation3 = {
    y: [0, -12, 0],
    rotate: ['-5deg', '-8deg', '-5deg'],
    transition: {
      y: {
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 1
      },
      rotate: {
        duration: 9,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const floatingAnimation4 = {
    y: [0, -18, 0],
    rotate: ['20deg', '25deg', '20deg'],
    transition: {
      y: {
        duration: 9,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 1.5
      },
      rotate: {
        duration: 11,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };
  
  return (
    <PageWrapper>
      <HeroSection>
        <BackgroundDecoration className="top-left" />
        <BackgroundDecoration className="bottom-right" />
        <BackgroundDecoration className="center" />
        <GridPattern />
        
        {!isMobile && (
          <>
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
              animate={floatingAnimation3}
            />
            <FloatingElement 
              className="element-4"
              animate={floatingAnimation4}
            />
          </>
        )}
        
        <HeroContainer>
          <HeroContent>
            <MainHeading
              initial="hidden"
              animate="visible"
              variants={animationVariants}
            >
              Early-Stage <span>Investment</span> Services
            </MainHeading>
            
            <Description
              initial="hidden"
              animate="visible"
              variants={{
                ...animationVariants,
                visible: {
                  ...animationVariants.visible,
                  transition: {
                    delay: 0.2,
                    duration: 0.8,
                    ease: [0.1, 0.9, 0.2, 1]
                  }
                }
              }}
            >
              BloomVest provides comprehensive investment services for <strong>promising startups</strong> and <strong>strategic investors</strong>, combining rigorous due diligence, tailored capital deployment, and hands-on growth acceleration.
            </Description>
          </HeroContent>
        </HeroContainer>
      </HeroSection>
      
      <SectionDivider />

      <FeaturedVideoSection>
        <VideoContainer>
          <VideoHeader>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, type: "spring" }}
              viewport={{ once: true }}
            >
              <VideoTitle>Our <span>Investment</span> Philosophy</VideoTitle>
              <VideoDescription>
                Learn how BloomVest identifies and nurtures exceptional startups, providing the strategic capital and expertise needed to accelerate their journey from innovative concept to market leader.
              </VideoDescription>
            </motion.div>
          </VideoHeader>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, type: "spring" }}
            viewport={{ once: true }}
          >
            <MainVideoWrapper>
              <video 
                autoPlay
                loop
                muted
                playsInline
              >
                <source src="/wealthmanagement.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </MainVideoWrapper>
          </motion.div>
        </VideoContainer>
      </FeaturedVideoSection>
      
      <Services />
      
      <AIFeatures />
    </PageWrapper>
  );
};

export default ServicesPage; 