import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import TrainingSessions from '../components/TrainingSessions';
import { FaGraduationCap, FaLaptop, FaUsers, FaChartLine, FaHandHoldingUsd } from 'react-icons/fa';

// Styled components for the hero section
const HeroSection = styled.section`
  padding: 100px 5% 120px;
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

const HighlightBox = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  padding: 2.5rem;
  border-radius: 1.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  margin-top: 2.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  text-align: left;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
  position: relative;
  z-index: 10;
  
  @media (max-width: 768px) {
    padding: 1.75rem;
  }
`;

const HighlightTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: white;
  margin-bottom: 2rem;
  text-align: center;
`;

const HighlightGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2.5rem 3rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const HighlightItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1.25rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 1rem;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.07);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.06);
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
  }
  
  svg {
    color: #4ade80;
    font-size: 1.75rem;
    flex-shrink: 0;
    margin-top: 0.25rem;
    background: rgba(74, 222, 128, 0.1);
    padding: 0.75rem;
    border-radius: 0.75rem;
    border: 1px solid rgba(74, 222, 128, 0.2);
  }
`;

const HighlightContent = styled.div`
  flex: 1;
`;

const HighlightItemTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
  margin-bottom: 0.75rem;
`;

const HighlightItemText = styled.p`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
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

const boxVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, delay: 0.4, ease: "easeOut" } 
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

const EducationPage = () => {
  return (
    <>
      <HeroSection>
        <BackgroundDecoration className="top-left" />
        <BackgroundDecoration className="bottom-right" />
        <BackgroundDecoration className="center" />
        <GridPattern />
        
        <FloatingElement 
          className="element-1" 
          variants={floatingVariants1} 
          animate="animate"
        />
        <FloatingElement 
          className="element-2" 
          variants={floatingVariants2} 
          animate="animate"
        />
        <FloatingElement 
          className="element-3" 
          variants={floatingVariants2} 
          animate="animate"
        />
        <FloatingElement 
          className="element-4" 
          variants={floatingVariants1} 
          animate="animate"
        />
        
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
        
        <HeroContainer>
          <HeroContent>
            <MainHeading
              initial="hidden"
              animate="visible"
              variants={titleVariants}
            >
              Financial <span>Education</span> That Makes a Difference
            </MainHeading>
            <Description
              initial="hidden"
              animate="visible"
              variants={textVariants}
            >
              At <strong>BloomVest Finance</strong>, we believe in practical financial education that delivers real results. Our focused training programs are designed to build essential financial knowledge and skills.
            </Description>
            
            <motion.div
              initial="hidden"
              animate="visible"
              variants={boxVariants}
            >
              <HighlightBox>
                <HighlightTitle>Why Choose Our Financial Education Programs</HighlightTitle>
                <HighlightGrid>
                  <HighlightItem>
                    <FaGraduationCap />
                    <HighlightContent>
                      <HighlightItemTitle>Expert-Led Training</HighlightItemTitle>
                      <HighlightItemText>
                        Learn from seasoned financial professionals with real-world experience across various sectors of the Nigerian economy.
                      </HighlightItemText>
                    </HighlightContent>
                  </HighlightItem>
                  
                  <HighlightItem>
                    <FaHandHoldingUsd />
                    <HighlightContent>
                      <HighlightItemTitle>Practical Application</HighlightItemTitle>
                      <HighlightItemText>
                        Focus on actionable strategies and tools you can implement immediately to improve your financial position.
                      </HighlightItemText>
                    </HighlightContent>
                  </HighlightItem>
                  
                  <HighlightItem>
                    <FaChartLine />
                    <HighlightContent>
                      <HighlightItemTitle>Nigerian Context</HighlightItemTitle>
                      <HighlightItemText>
                        Content tailored specifically to the Nigerian financial environment, regulations, and market conditions.
                      </HighlightItemText>
                    </HighlightContent>
                  </HighlightItem>
                  
                  <HighlightItem>
                    <FaLaptop />
                    <HighlightContent>
                      <HighlightItemTitle>Flexible Learning Options</HighlightItemTitle>
                      <HighlightItemText>
                        Choose from in-person workshops, virtual sessions, or hybrid formats to fit your schedule and learning preferences.
                      </HighlightItemText>
                    </HighlightContent>
                  </HighlightItem>
                </HighlightGrid>
              </HighlightBox>
            </motion.div>
          </HeroContent>
        </HeroContainer>
      </HeroSection>
      <TrainingSessions />
    </>
  );
};

export default EducationPage; 