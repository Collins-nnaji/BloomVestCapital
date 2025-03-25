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
`;

const BackgroundPattern = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: linear-gradient(rgba(34, 197, 94, 0.03) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(34, 197, 94, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
  z-index: 0;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 1;
`;

const SectionHeader = styled.div`
  text-align: center;
  max-width: 800px;
  margin: 0 auto 80px;
`;

const Preheading = styled.div`
  font-size: 1.125rem;
  font-weight: 600;
  color: #22c55e;
  margin-bottom: 1rem;
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
    width: 40px;
    height: 3px;
    background: linear-gradient(to right, #22c55e, #4ade80);
    border-radius: 3px;
  }
`;

const Title = styled.h2`
  font-size: 2.75rem;
  font-weight: 800;
  color: #1a365d;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, #1a365d 0%, #2d4e71 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  
  @media (max-width: 768px) {
    font-size: 2.25rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #64748b;
  line-height: 1.7;
`;

// Data Flow Section
const DataFlowSection = styled.div`
  margin-bottom: 100px;
`;

const ProcessSteps = styled.div`
  display: flex;
  justify-content: space-between;
  position: relative;
  margin: 60px 0;
  
  &::after {
    content: '';
    position: absolute;
    top: 50px;
    left: 60px;
    right: 60px;
    height: 4px;
    background: linear-gradient(to right, #22c55e, #4ade80);
    z-index: 0;
  }
  
  @media (max-width: 1024px) {
    flex-direction: column;
    align-items: center;
    gap: 60px;
    
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
  
  @media (max-width: 1024px) {
    width: 100%;
    max-width: 300px;
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
  margin-bottom: 1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  position: relative;
  
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
  }
`;

const StepTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;
  color: #1a365d;
  margin-bottom: 0.75rem;
`;

const StepDescription = styled.p`
  color: #64748b;
  font-size: 0.95rem;
  line-height: 1.6;
`;

// AI Capabilities Section
const CapabilitiesSection = styled.div`
  margin-bottom: 80px;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled(motion.div)`
  background: #ffffff;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
  }
  
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: #22c55e;
    border-radius: 16px 16px 0 0;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.4s ease;
  }
  
  &:hover:after {
    transform: scaleX(1);
  }
`;

const FeatureIcon = styled.div`
  width: 60px;
  height: 60px;
  background: rgba(34, 197, 94, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  color: #22c55e;
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;
  
  ${FeatureCard}:hover & {
    background: #22c55e;
    color: white;
    transform: rotate(5deg);
  }
`;

const FeatureTitle = styled.h3`
  font-size: 1.4rem;
  color: #1a365d;
  margin-bottom: 1rem;
  font-weight: 600;
`;

const FeatureDescription = styled.p`
  color: #64748b;
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  flex-grow: 1;
`;

const FeatureList = styled.ul`
  padding-left: 1.5rem;
  margin-bottom: 0;
  list-style: none;
`;

const FeatureListItem = styled.li`
  color: #64748b;
  margin-bottom: 0.75rem;
  font-size: 0.95rem;
  position: relative;
  
  &:before {
    content: '✓';
    color: #22c55e;
    position: absolute;
    left: -1.5rem;
  }
`;

// Demo Section
const DemoSection = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 3rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  text-align: center;
  margin-top: 80px;
`;

const DemoTitle = styled.h3`
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a365d;
  margin-bottom: 1.5rem;
`;

const DemoDescription = styled.p`
  color: #64748b;
  font-size: 1.1rem;
  line-height: 1.7;
  max-width: 800px;
  margin: 0 auto 2rem;
`;

const DemoButton = styled.button`
  background: #22c55e;
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  
  &:hover {
    background: #15803d;
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(34, 197, 94, 0.2);
  }
  
  svg {
    transition: transform 0.3s ease;
  }
  
  &:hover svg {
    transform: translateX(5px);
  }
`;

const AIFeatures = () => {
  const processSteps = [
    {
      icon: <FaDatabase />,
      title: "Data Collection",
      description: "We securely gather financial data from various sources including accounting systems, ERPs, and market feeds.",
      bgColor: "rgba(34, 197, 94, 0.1)",
      iconColor: "#22c55e",
      number: "1"
    },
    {
      icon: <FaServer />,
      title: "Data Processing",
      description: "Our system cleans, normalizes, and structures your data to prepare it for advanced analysis.",
      bgColor: "rgba(8, 145, 178, 0.1)",
      iconColor: "#0891b2",
      number: "2"
    },
    {
      icon: <FaRobot />,
      title: "AI Analysis",
      description: "Advanced algorithms analyze the processed data to identify patterns, trends, and actionable insights.",
      bgColor: "rgba(139, 92, 246, 0.1)",
      iconColor: "#8b5cf6",
      number: "3"
    },
    {
      icon: <FaFileAlt />,
      title: "Report Generation",
      description: "The system automatically creates detailed financial reports with visualizations and key insights.",
      bgColor: "rgba(2, 132, 199, 0.1)",
      iconColor: "#0284c7",
      number: "4"
    },
    {
      icon: <FaLightbulb />,
      title: "Predictive Insights",
      description: "Machine learning models provide forward-looking insights and strategic recommendations.",
      bgColor: "rgba(245, 158, 11, 0.1)",
      iconColor: "#f59e0b",
      number: "5"
    }
  ];

  const capabilities = [
    {
      icon: <FaChartPie />,
      title: "Financial Performance Analysis",
      description: "Our AI analyzes your financial data to identify strengths, weaknesses, and improvement opportunities.",
      benefits: [
        "Automatic ratio analysis and benchmarking",
        "Trend identification with statistical validation",
        "Anomaly detection with alert generation",
        "Performance attribution analysis"
      ]
    },
    {
      icon: <FaChartLine />,
      title: "Predictive Forecasting",
      description: "Machine learning models predict future financial performance with high accuracy.",
      benefits: [
        "Revenue and expense predictions",
        "Cash flow forecasting",
        "Working capital requirement projections",
        "Budget variance predictions"
      ]
    },
    {
      icon: <FaLightbulb />,
      title: "Automated Reporting",
      description: "Generate comprehensive financial reports customized for different stakeholders automatically.",
      benefits: [
        "Executive-ready financial summaries",
        "Detailed departmental performance reports",
        "Regulatory compliance documentation",
        "Investor-focused presentations"
      ]
    },
    {
      icon: <FaShieldAlt />,
      title: "Risk Assessment",
      description: "Identify and quantify financial risks before they impact your business.",
      benefits: [
        "Credit risk evaluation",
        "Liquidity risk monitoring",
        "Market risk exposure analysis",
        "Operational risk identification"
      ]
    },
    {
      icon: <FaFileAlt />,
      title: "Strategic Recommendations",
      description: "Receive AI-powered recommendations to improve financial performance.",
      benefits: [
        "Cost optimization suggestions",
        "Revenue enhancement strategies",
        "Investment prioritization guidance",
        "Resource allocation recommendations"
      ]
    },
    {
      icon: <FaBrain />,
      title: "Continuous Learning",
      description: "Our AI system continuously learns from your data to improve accuracy over time.",
      benefits: [
        "Self-improving prediction models",
        "Adaptive to your business changes",
        "Industry-specific insight development",
        "Seasonal pattern recognition"
      ]
    }
  ];

  return (
    <Section id="ai-analytics">
      <BackgroundPattern />
      <Container>
        <SectionHeader>
          <Preheading>AI-Powered Analytics</Preheading>
          <Title>How Our System Transforms Your Financial Data</Title>
          <Subtitle>
            Our advanced AI analytics platform turns your raw financial data into comprehensive reports
            and predictive insights that drive better business decisions.
          </Subtitle>
        </SectionHeader>
        
        <DataFlowSection>
          <h3 style={{ textAlign: 'center', color: '#1a365d', fontSize: '1.8rem', marginBottom: '2rem' }}>
            The Data Analysis Process
          </h3>
          
          <ProcessSteps>
            {processSteps.map((step, index) => (
              <ProcessStep
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
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
          <h3 style={{ textAlign: 'center', color: '#1a365d', fontSize: '1.8rem', marginBottom: '2rem' }}>
            AI Capabilities
          </h3>
          
          <FeaturesGrid>
            {capabilities.map((feature, index) => (
              <FeatureCard 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <FeatureIcon>{feature.icon}</FeatureIcon>
                <FeatureTitle>{feature.title}</FeatureTitle>
                <FeatureDescription>{feature.description}</FeatureDescription>
                
                <FeatureList>
                  {feature.benefits.map((benefit, i) => (
                    <FeatureListItem key={i}>{benefit}</FeatureListItem>
                  ))}
                </FeatureList>
              </FeatureCard>
            ))}
          </FeaturesGrid>
        </CapabilitiesSection>
        
        <DemoSection>
          <DemoTitle>Experience Our AI Analytics Platform</DemoTitle>
          <DemoDescription>
            See how our AI can transform your financial data into actionable insights with a personalized demo.
            Our experts will show you real examples using industry-specific data similar to your business.
          </DemoDescription>
          <DemoButton>
            Schedule a Demo <FaArrowRight />
          </DemoButton>
        </DemoSection>
      </Container>
    </Section>
  );
};

export default AIFeatures;