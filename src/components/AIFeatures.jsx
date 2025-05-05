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
  
  ${FeatureCard}:hover & {
    transform: scale(1.1) rotate(5deg);
    background: ${props => props.hoverBg || '#22c55e'};
    color: white;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a365d;
  margin-bottom: 1rem;
`;

const FeatureDescription = styled.p`
  color: #475569;
  font-size: 1.05rem;
  line-height: 1.7;
  margin-bottom: 1.5rem;
  flex-grow: 1;
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 1.5rem;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
  
  &:before {
    content: '';
    min-width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #22c55e;
    margin-right: 0.75rem;
  }
  
  span {
    color: #475569;
    font-size: 1rem;
  }
`;

const LearnMoreButton = styled.a`
  display: inline-flex;
  align-items: center;
  background: transparent;
  color: #22c55e;
  font-weight: 600;
  padding: 0;
  gap: 0.5rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: auto;
  
  svg {
    transition: transform 0.3s ease;
  }
  
  &:hover {
    color: #15803d;
    
    svg {
      transform: translateX(5px);
    }
  }
`;

const AIFeatures = () => {
  const processSteps = [
    {
      icon: <FaDatabase />,
      title: "Data Collection",
      description: "We securely gather your financial data, investment history, and goals to create a comprehensive profile.",
      bgColor: "rgba(34, 197, 94, 0.1)",
      iconColor: "#22c55e",
      number: "1"
    },
    {
      icon: <FaServer />,
      title: "Data Processing",
      description: "Our system analyzes your financial information to understand your unique circumstances and opportunities.",
      bgColor: "rgba(8, 145, 178, 0.1)",
      iconColor: "#0891b2",
      number: "2"
    },
    {
      icon: <FaRobot />,
      title: "AI Analysis",
      description: "Advanced algorithms identify patterns and insights that inform optimal wealth management strategies.",
      bgColor: "rgba(139, 92, 246, 0.1)",
      iconColor: "#8b5cf6",
      number: "3"
    },
    {
      icon: <FaBrain />,
      title: "Strategy Development",
      description: "Our advisors combine AI insights with their expertise to develop personalized financial strategies.",
      bgColor: "rgba(245, 158, 11, 0.1)",
      iconColor: "#f59e0b",
      number: "4"
    },
    {
      icon: <FaFileAlt />,
      title: "Implementation",
      description: "We execute your customized strategy with precision, continuously monitoring for optimal performance.",
      bgColor: "rgba(236, 72, 153, 0.1)",
      iconColor: "#ec4899",
      number: "5"
    }
  ];

  const capabilities = [
    {
      icon: <FaChartPie />,
      title: "Portfolio Optimization",
      description: "Our AI dynamically balances your investment portfolio to maximize returns while adhering to your risk tolerance.",
      features: ["Smart asset allocation", "Tax-efficient rebalancing", "Risk-adjusted returns"],
      color: "#22c55e",
      bg: "rgba(34, 197, 94, 0.1)",
      hoverBg: "#22c55e"
    },
    {
      icon: <FaChartLine />,
      title: "Market Prediction",
      description: "Advanced algorithms analyze market trends and economic indicators to anticipate shifts before they occur.",
      features: ["Pattern recognition", "Anomaly detection", "Trend forecasting"],
      color: "#0891b2",
      bg: "rgba(8, 145, 178, 0.1)",
      hoverBg: "#0891b2"
    },
    {
      icon: <FaLightbulb />,
      title: "Strategic Insights",
      description: "AI-generated recommendations identify opportunities and strategies uniquely suited to your financial goals.",
      features: ["Personalized suggestions", "Goal-based planning", "Opportunity identification"],
      color: "#8b5cf6",
      bg: "rgba(139, 92, 246, 0.1)",
      hoverBg: "#8b5cf6"
    },
    {
      icon: <FaShieldAlt />,
      title: "Risk Management",
      description: "Continuous monitoring of market conditions and your portfolio to identify and mitigate potential risks.",
      features: ["Early warning system", "Volatility protection", "Downside mitigation"],
      color: "#f59e0b",
      bg: "rgba(245, 158, 11, 0.1)",
      hoverBg: "#f59e0b"
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
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, type: "spring" }}
            viewport={{ once: true }}
          >
            <Preheading>AI-Powered Wealth Management</Preheading>
            <Title>Intelligent <span>Technology</span> for Smarter Wealth Strategies</Title>
            <Subtitle>
              Our advanced AI technology works alongside our human advisors to provide <strong>deeper insights</strong>, <strong>better forecasting</strong>, and <strong>optimized strategies</strong> for your wealth management journey.
            </Subtitle>
          </motion.div>
        </SectionHeader>
        
        <DataFlowSection>
          <ProcessSteps>
            {processSteps.map((step, index) => (
              <ProcessStep 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                isLast={index === processSteps.length - 1}
              >
                <StepIcon 
                  bgColor={step.bgColor}
                  iconColor={step.iconColor}
                  number={step.number}
                >
                  {step.icon}
                </StepIcon>
                <StepTitle>{step.title}</StepTitle>
                <StepDescription>{step.description}</StepDescription>
              </ProcessStep>
            ))}
          </ProcessSteps>
        </DataFlowSection>
        
        <CapabilitiesSection>
          <SectionHeader>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Title>Our AI <span>Capabilities</span></Title>
              <Subtitle>
                Leveraging cutting-edge artificial intelligence to transform financial data into actionable wealth management strategies that give you a <strong>competitive advantage</strong>.
              </Subtitle>
            </motion.div>
          </SectionHeader>
          
          <FeaturesGrid>
            {capabilities.map((capability, index) => (
              <FeatureCard
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.15,
                  type: "spring",
                  stiffness: 50
                }}
                viewport={{ once: true }}
              >
                <FeatureIcon 
                  color={capability.color}
                  bg={capability.bg}
                  hoverBg={capability.hoverBg}
                >
                  {capability.icon}
                </FeatureIcon>
                <FeatureTitle>{capability.title}</FeatureTitle>
                <FeatureDescription>{capability.description}</FeatureDescription>
                <FeatureList>
                  {capability.features.map((feature, featureIndex) => (
                    <FeatureItem key={featureIndex}>
                      <span>{feature}</span>
                    </FeatureItem>
                  ))}
                </FeatureList>
                <LearnMoreButton href="#">
                  Learn more <FaArrowRight />
                </LearnMoreButton>
              </FeatureCard>
            ))}
          </FeaturesGrid>
        </CapabilitiesSection>
      </Container>
    </Section>
  );
};

export default AIFeatures;