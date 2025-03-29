import React from 'react';
import styled from 'styled-components';
import { FaArrowRight, FaChartLine, FaFileAlt, FaRegLightbulb, FaCheck, FaShieldAlt, FaUsers, FaGlobe, FaCheckCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';

const HeroSection = styled.section`
  padding: 100px 5% 120px;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #1a365d 0%, #2d4e71 100%);
  min-height: 80vh;
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
  max-width: 850px;
  margin: 0 auto 4rem;
  position: relative;
  z-index: 2;
`;

const SubHeading = styled(motion.p)`
  font-size: 1.35rem;
  font-weight: 700;
  color: #4ade80;
  margin-bottom: 1.5rem;
  text-transform: uppercase;
  letter-spacing: 3px;
  position: relative;
  display: inline-block;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background: #22c55e;
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

const CTAContainer = styled(motion.div)`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 2rem;
  
  @media (max-width: 640px) {
    flex-direction: column;
    gap: 1rem;
    align-items: center;
  }
`;

const CTAButton = styled(motion.button)`
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
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(34, 197, 94, 0.6);
  }
  
  svg {
    transition: transform 0.3s ease;
  }
  
  &:hover svg {
    transform: translateX(5px);
  }
  
  @media (max-width: 768px) {
    padding: 1rem 2rem;
    font-size: 1rem;
  }
`;

const SecondaryButton = styled(motion.button)`
  background: rgba(255, 255, 255, 0.05);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 1.2rem 2.75rem;
  font-size: 1.15rem;
  font-weight: 600;
  border-radius: 50px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-5px);
    box-shadow: 0 12px 25px rgba(0, 0, 0, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
  }
  
  @media (max-width: 768px) {
    padding: 1rem 2rem;
    font-size: 1rem;
  }
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
  background: #ffffff;
  position: relative;
  
  @media (max-width: 768px) {
    padding: 80px 5%;
  }
`;

const StatisticsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  max-width: 1200px;
  margin: 4rem auto 0;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const StatItem = styled(motion.div)`
  text-align: center;
  padding: 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(226, 232, 240, 0.8);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
    border-color: rgba(34, 197, 94, 0.3);
  }
`;

const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: 800;
  color: #1a365d;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #1a365d 0%, #22c55e 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const StatLabel = styled.div`
  font-size: 1rem;
  color: #64748b;
  font-weight: 500;
`;

const SectionHeader = styled.div`
  text-align: center;
  max-width: 700px;
  margin: 0 auto 70px;
`;

const SectionTitle = styled.h2`
  font-size: 2.75rem;
  font-weight: 800;
  color: #1a365d;
  margin-bottom: 1rem;
  position: relative;
  display: inline-block;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -12px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 4px;
    background: linear-gradient(to right, #22c55e, rgba(34, 197, 94, 0.2));
    border-radius: 2px;
  }
  
  @media (max-width: 768px) {
    font-size: 2.25rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.75rem;
  }
`;

const SectionDescription = styled.p`
  font-size: 1.2rem;
  color: #64748b;
  line-height: 1.7;
  margin-top: 2rem;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2.5rem;
  margin-top: 4rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
  }
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const HomeContent = () => {
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

  const features = [
    {
      icon: <FaCheckCircle />,
      title: "Personalized Financial Strategies",
      description: "Customized plans tailored to your unique financial goals and circumstances."
    },
    {
      icon: <FaChartLine />,
      title: "Data-Driven Investment Insights",
      description: "Evidence-based approaches to maximize returns and minimize risk for your portfolio."
    },
    {
      icon: <FaUsers />,
      title: "Expert Financial Advisory",
      description: "Ongoing support from seasoned professionals focused on your long-term success."
    }
  ];

  const statistics = [
    { value: "95%", label: "Client Retention Rate" },
    { value: "₦850M+", label: "Managed Assets" },
    { value: "250+", label: "Satisfied Clients" },
    { value: "35%", label: "Average ROI" }
  ];

  return (
    <>
      <HeroSection>
        <BackgroundDecoration className="top-left" />
        <BackgroundDecoration className="bottom-right" />
        <BackgroundDecoration className="center" />
        <GridPattern />
        <WaveSeparator />
        
        {/* Animated floating elements */}
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
          animate={{
            ...floatingAnimation2,
            x: [0, 15, 0],
            transition: {
              y: {
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              },
              x: {
                duration: 9,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }
          }}
        />
        <FloatingElement 
          className="element-4"
          animate={{
            ...floatingAnimation1,
            x: [0, -10, 0],
            transition: {
              y: {
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              },
              x: {
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }
            }
          }}
        />
        
        <ShapedElement 
          className="triangle"
          animate={rotateAnimation}
          style={{ originX: 0.5, originY: 0.5 }}
        />
        <ShapedElement 
          className="square"
          animate={{
            rotate: [45, 225, 45],
            transition: {
              rotate: {
                duration: 15,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }
          }}
        />
        
        <HeroContainer>
          <HeroContent>
            <SubHeading
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Financial Excellence
            </SubHeading>
            
            <MainHeading
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Strategic <span>Financial Solutions</span> for Nigerian Growth
            </MainHeading>
            
            <Description
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              BloomVest Finance combines <strong>proven financial expertise</strong> with innovative methodologies 
              to help businesses and individuals make informed decisions and achieve strategic growth.
            </Description>
          </HeroContent>
          
          <FeaturesCards
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                custom={index}
                variants={cardVariants}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <FeatureIcon>{feature.icon}</FeatureIcon>
                <FeatureContent>
                  <FeatureTitle>{feature.title}</FeatureTitle>
                  <FeatureText>{feature.description}</FeatureText>
                </FeatureContent>
              </FeatureCard>
            ))}
          </FeaturesCards>
          
          <CTAContainer
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <CTAButton
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started <FaArrowRight />
            </CTAButton>
            
            <SecondaryButton
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Learn More
            </SecondaryButton>
          </CTAContainer>
        </HeroContainer>
      </HeroSection>
      
      <FeaturesSection>
        <SectionHeader>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <SectionTitle>How We Transform Your Finances</SectionTitle>
            <SectionDescription>
              We provide comprehensive financial services that help you optimize performance 
              and make informed decisions for long-term success.
            </SectionDescription>
          </motion.div>
        </SectionHeader>
        
        <FeatureGrid>
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              style={{ 
                background: "white", 
                borderColor: "rgba(226, 232, 240, 0.8)"
              }}
            >
              <FeatureIcon>{feature.icon}</FeatureIcon>
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
              transition={{ duration: 0.4, delay: index * 0.1 }}
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