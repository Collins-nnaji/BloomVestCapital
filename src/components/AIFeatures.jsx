import React from 'react';
import styled from 'styled-components';
import { 
  FaChartPie, 
  FaLightbulb, 
  FaChartLine, 
  FaShieldAlt, 
  FaArrowRight, 
  FaDatabase,
  FaBrain,
  FaFileAlt,
  FaRobot,
  FaServer
} from 'react-icons/fa';
import { motion } from 'framer-motion';

const Section = styled.section`
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

const BackgroundDecoration = styled.div`
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  z-index: 0;
  
  &.top-left {
    top: -150px;
    left: -150px;
    width: 500px;
    height: 500px;
    background: linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(16, 185, 129, 0.05));
    opacity: 0.5;
  }
  
  &.bottom-right {
    bottom: -200px;
    right: -150px;
    width: 600px;
    height: 600px;
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(34, 197, 94, 0.05));
    opacity: 0.5;
  }
`;

const FloatingShape = styled.div`
  position: absolute;
  z-index: 0;
  opacity: 0.5;
  
  &.shape1 {
    width: 120px;
    height: 120px;
    top: 15%;
    right: 10%;
    border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
    background: linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(59, 130, 246, 0.1));
    animation: float1 15s infinite ease-in-out;
  }
  
  &.shape2 {
    width: 80px;
    height: 80px;
    bottom: 20%;
    left: 10%;
    border-radius: 30% 70% 50% 50% / 50% 50% 70% 30%;
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1));
    animation: float2 18s infinite ease-in-out;
  }
  
  @keyframes float1 {
    0% { transform: translate(0, 0) rotate(0deg); }
    50% { transform: translate(15px, -15px) rotate(10deg); }
    100% { transform: translate(0, 0) rotate(0deg); }
  }
  
  @keyframes float2 {
    0% { transform: translate(0, 0) rotate(0deg); }
    50% { transform: translate(-15px, 10px) rotate(-10deg); }
    100% { transform: translate(0, 0) rotate(0deg); }
  }
`;

const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 1;
  
  @media (max-width: 768px) {
    padding: 0 1.5rem;
  }
`;

const SectionHeader = styled.div`
  text-align: center;
  max-width: 800px;
  margin: 0 auto 80px;
`;

const Preheading = styled.div`
  font-size: 1.15rem;
  font-weight: 700;
  color: #22c55e;
  margin-bottom: 1.25rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  position: relative;
  display: inline-block;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 50px;
    height: 3px;
    background: linear-gradient(to right, #22c55e, #4ade80);
    border-radius: 3px;
  }
`;

const Title = styled.h2`
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
  
  @media (max-width: 480px) {
    font-size: 2.25rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #475569;
  line-height: 1.8;
  margin-top: 2rem;
  
  strong {
    color: #1a365d;
    font-weight: 600;
  }
`;

// Data Flow Section
const DataFlowSection = styled.div`
  margin-bottom: 120px;
  position: relative;
`;

const ProcessSteps = styled.div`
  display: flex;
  justify-content: space-between;
  position: relative;
  margin: 80px 0;
  
  &::after {
    content: '';
    position: absolute;
    top: 50px;
    left: 60px;
    right: 60px;
    height: 4px;
    background: linear-gradient(to right, #22c55e, #0891b2);
    z-index: 0;
    border-radius: 2px;
  }
  
  @media (max-width: 1024px) {
    flex-direction: column;
    align-items: center;
    gap: 70px;
    
    &::after {
      display: none;
    }
  }
`;

const ProcessStep = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  z-index: 1;
  background: #ffffff;
  padding: 0 10px;
  width: 20%;
  position: relative;
  
  @media (max-width: 1024px) {
    width: 100%;
    max-width: 320px;
    
    &::after {
      content: '';
      position: absolute;
      top: 100%;
      left: 50%;
      width: 4px;
      height: 70px;
      background: linear-gradient(to bottom, #22c55e, transparent);
      display: ${props => props.isLast ? 'none' : 'block'};
    }
  }
`;

const StepIcon = styled.div`
  width: 100px;
  height: 100px;
  background: ${props => props.bgColor || 'rgba(34, 197, 94, 0.1)'};
  color: ${props => props.iconColor || '#22c55e'};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  position: relative;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  
  ${ProcessStep}:hover & {
    transform: scale(1.1) translateY(-10px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    background: ${props => props.iconColor || '#22c55e'};
    color: white;
  }
  
  &::after {
    content: '${props => props.number}';
    position: absolute;
    top: -10px;
    right: -10px;
    width: 35px;
    height: 35px;
    background: #1a365d;
    color: white;
    font-size: 1rem;
    font-weight: 700;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
    border: 2px solid white;
  }
`;

const StepTitle = styled.h3`
  font-size: 1.4rem;
  font-weight: 700;
  color: #1a365d;
  margin-bottom: 0.85rem;
`;

const StepDescription = styled.p`
  color: #475569;
  font-size: 1rem;
  line-height: 1.7;
`;

// AI Capabilities Section
const CapabilitiesSection = styled.div`
  margin-bottom: 100px;
`;

const FeaturesSection = styled.div`
  margin-bottom: 80px;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const FeatureCard = styled(motion.div)`
  background: #ffffff;
  border-radius: 20px;
  padding: 2.25rem;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(226, 232, 240, 0.8);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 1;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 20px;
    padding: 2px;
    background: linear-gradient(135deg, ${props => props.borderGradient || 'rgba(34, 197, 94, 0.5), rgba(26, 54, 93, 0.3)'});
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

const FeatureIcon = styled.div`
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
  
  ${FeatureCard}:hover & {
    transform: scale(1.1) rotate(5deg);
    background: ${props => props.hoverBg || '#22c55e'};
    color: white;
    box-shadow: 0 10px 20px ${props => props.hoverShadow || 'rgba(0, 0, 0, 0.1)'};
  }
`;

const FeatureTitle = styled.h3`
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
  
  ${FeatureCard}:hover &::after {
    width: 100px;
  }
`;

const FeatureDescription = styled.p`
  color: #475569;
  font-size: 1.05rem;
  line-height: 1.7;
  flex-grow: 1;
`;

// Define CTA section components
const CTASection = styled.div`
  background: #f0fdf4;
  padding: 4rem;
  border-radius: 24px;
  text-align: center;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(226, 232, 240, 0.8);
  
  @media (max-width: 768px) {
    padding: 2.5rem 1.5rem;
  }
`;

const CTATitle = styled.h3`
  font-size: 2.25rem;
  font-weight: 800;
  color: #1a365d;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`;

const CTADescription = styled.p`
  font-size: 1.2rem;
  color: #475569;
  line-height: 1.8;
  max-width: 800px;
  margin: 0 auto 2.5rem;
`;

const CTAButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
`;

const PrimaryButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(to right, #22c55e, #15803d);
  color: white;
  border-radius: 50px;
  padding: 1rem 2.5rem;
  font-weight: 600;
  font-size: 1.1rem;
  text-decoration: none;
  transition: all 0.3s ease;
  gap: 0.75rem;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
  }
  
  svg {
    transition: transform 0.3s ease;
  }
  
  &:hover svg {
    transform: translateX(3px);
  }
`;

const SecondaryButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: white;
  color: #1a365d;
  border: 2px solid #e2e8f0;
  border-radius: 50px;
  padding: 1rem 2.5rem;
  font-weight: 600;
  font-size: 1.1rem;
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
    border-color: #22c55e;
  }
`;

const AIFeatures = () => {
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" }
    }
  };

  const processStepVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.7,
        ease: "easeOut"
      }
    })
  };

  const featureVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.15,
        duration: 0.7,
        ease: "easeOut"
      }
    })
  };

  // Data for the process steps
  const processSteps = [
    {
      icon: <FaDatabase />,
      title: "Data Collection",
      description: "Gathering startup metrics, market data, and industry benchmarks from multiple sources"
    },
    {
      icon: <FaBrain />,
      title: "AI Analysis",
      description: "Algorithmic processing using machine learning models to identify patterns and insights"
    },
    {
      icon: <FaFileAlt />,
      title: "Opportunity Scoring",
      description: "Quantitative evaluation of startups against success predictors and risk factors"
    },
    {
      icon: <FaRobot />,
      title: "Decision Support",
      description: "AI-enhanced recommendations to augment human investment judgment"
    },
    {
      icon: <FaServer />,
      title: "Performance Tracking",
      description: "Continuous monitoring of portfolio companies' growth metrics and milestones"
    }
  ];

  // Data for AI-powered features
  const aiFeatures = [
    {
      icon: <FaChartPie />,
      title: "Deal Flow Optimization",
      description: "Our AI-powered deal sourcing system continuously scans thousands of startups across multiple ecosystems, identifying promising opportunities that match our investment criteria before they reach mainstream visibility.",
      color: "#22c55e",
      bgLight: "rgba(34, 197, 94, 0.1)",
      hoverShadow: "rgba(34, 197, 94, 0.2)",
      underlineColor: "#22c55e",
      borderGradient: "rgba(34, 197, 94, 0.5), rgba(26, 54, 93, 0.3)"
    },
    {
      icon: <FaLightbulb />,
      title: "Founder Success Prediction",
      description: "Our proprietary algorithm analyzes over 50 founder and team attributes correlated with startup success, helping identify exceptional entrepreneurial talent with the highest probability of building category-defining companies.",
      color: "#3b82f6",
      bgLight: "rgba(59, 130, 246, 0.1)",
      hoverShadow: "rgba(59, 130, 246, 0.2)",
      underlineColor: "#3b82f6",
      borderGradient: "rgba(59, 130, 246, 0.5), rgba(26, 54, 93, 0.3)"
    },
    {
      icon: <FaChartLine />,
      title: "Market Opportunity Sizing",
      description: "Advanced data analytics tools provide precise total addressable market calculations and growth trajectory forecasts, validated against real-world adoption patterns from similar technology deployments.",
      color: "#f59e0b",
      bgLight: "rgba(245, 158, 11, 0.1)",
      hoverShadow: "rgba(245, 158, 11, 0.2)",
      underlineColor: "#f59e0b",
      borderGradient: "rgba(245, 158, 11, 0.5), rgba(26, 54, 93, 0.3)"
    },
    {
      icon: <FaShieldAlt />,
      title: "Risk Modeling & Mitigation",
      description: "Sophisticated risk assessment algorithms identify potential challenges in business models, technology implementation, or market adoption, enabling preemptive strategy adjustments that improve startup success rates.",
      color: "#8b5cf6",
      bgLight: "rgba(139, 92, 246, 0.1)",
      hoverShadow: "rgba(139, 92, 246, 0.2)",
      underlineColor: "#8b5cf6",
      borderGradient: "rgba(139, 92, 246, 0.5), rgba(26, 54, 93, 0.3)"
    }
  ];

  return (
    <Section>
      <BackgroundDecoration className="top-left" />
      <BackgroundDecoration className="bottom-right" />
      <FloatingShape className="shape1" />
      <FloatingShape className="shape2" />
      
      <Container>
        <SectionHeader>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <Preheading>Technology-Enhanced Investing</Preheading>
            <Title>Our <span>Data-Driven</span> Approach</Title>
            <Subtitle>
              BloomVest combines human expertise with advanced technology to identify <strong>promising investment opportunities</strong> and accelerate startup growth through <strong>data-driven insights</strong> and strategic guidance.
            </Subtitle>
          </motion.div>
        </SectionHeader>
        
        <DataFlowSection>
          <ProcessSteps>
            {processSteps.map((step, index) => (
              <ProcessStep
                key={index}
                custom={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={processStepVariants}
              >
                <StepIcon>
                  {step.icon}
                </StepIcon>
                <StepTitle>{step.title}</StepTitle>
                <StepDescription>{step.description}</StepDescription>
              </ProcessStep>
            ))}
          </ProcessSteps>
        </DataFlowSection>
        
        <FeaturesSection>
          <FeaturesGrid>
            {aiFeatures.map((feature, index) => (
              <FeatureCard
                key={index}
                custom={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={featureVariants}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                borderGradient={feature.borderGradient}
              >
                <FeatureIcon 
                  bg={feature.bgLight} 
                  color={feature.color}
                  hoverBg={feature.color}
                  shadowColor={feature.shadowColor}
                  hoverShadow={feature.hoverShadow}
                >
                  {feature.icon}
                </FeatureIcon>
                <FeatureTitle underlineColor={feature.underlineColor}>
                  {feature.title}
                </FeatureTitle>
                <FeatureDescription>
                  {feature.description}
                </FeatureDescription>
              </FeatureCard>
            ))}
          </FeaturesGrid>
        </FeaturesSection>
      </Container>
    </Section>
  );
};

export default AIFeatures;