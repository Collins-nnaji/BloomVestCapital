import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  FaChartLine, 
  FaHome, 
  FaGraduationCap, 
  FaHandHoldingUsd,
  FaChartPie,
  FaShieldAlt,
  FaArrowRight,
  FaRobot,
  FaUserTie,
  FaExchangeAlt,
  FaSyncAlt
} from 'react-icons/fa';

const ServicesSection = styled.section`
  background: linear-gradient(to bottom, var(--background), #ffffff);
  padding: 120px 0 100px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(to right, transparent, rgba(74, 222, 128, 0.2), transparent);
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 20%;
    right: 20%;
    height: 1px;
    background: linear-gradient(to right, transparent, rgba(74, 222, 128, 0.1), transparent);
  }
`;

const SectionHeader = styled.div`
  text-align: center;
  max-width: 800px;
  margin: 0 auto 60px;
  padding: 0 2rem;
`;

const Preheading = styled.div`
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--accent-color);
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const Title = styled.h2`
  font-size: 3rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  color: var(--text-secondary);
  line-height: 1.7;
`;

const ToggleContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto 50px;
  max-width: 500px;
  padding: 0.5rem;
  background: rgba(26, 54, 93, 0.05);
  border-radius: 100px;
`;

const ToggleOption = styled.button`
  flex: 1;
  padding: 1rem 1.5rem;
  border: none;
  background: ${props => props.active ? 'var(--primary-color)' : 'transparent'};
  color: ${props => props.active ? 'white' : 'var(--primary-color)'};
  font-weight: 600;
  font-size: 1rem;
  border-radius: 100px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover {
    background: ${props => props.active ? 'var(--primary-color)' : 'rgba(26, 54, 93, 0.1)'};
  }
`;

const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2.5rem;
  padding: 0 2rem;
  max-width: 1400px;
  margin: 0 auto;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 0 1rem;
    gap: 2rem;
  }
`;

const ServiceCard = styled.div`
  background: ${props => props.theme.colors.cardBg};
  border-radius: 20px;
  padding: 2.5rem;
  transition: all 0.4s ease;
  position: relative;
  border: 1px solid rgba(74, 222, 128, 0.1);
  box-shadow: ${props => props.theme.shadows.md};
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: ${props => props.theme.shadows.lg};
    border-color: rgba(74, 222, 128, 0.3);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
`;

const IconWrapper = styled.div`
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, var(--accent-color), #4ade80);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: white;
  box-shadow: 0 10px 20px rgba(34, 197, 94, 0.2);
  transition: all 0.3s ease;
  
  ${ServiceCard}:hover & {
    transform: scale(1.1);
    box-shadow: 0 15px 25px rgba(34, 197, 94, 0.3);
  }
`;

const HybridTag = styled.div`
  background: linear-gradient(135deg, #1a365d, #22c55e);
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.4rem 0.8rem;
  border-radius: 30px;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const ServiceTitle = styled.h3`
  font-size: 1.5rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
  font-weight: 600;
`;

const ServiceDescription = styled.p`
  color: var(--text-secondary);
  font-size: 1.1rem;
  line-height: 1.7;
  margin-bottom: 1.5rem;
  flex-grow: 1;
`;

const DeliveryModes = styled.div`
  display: flex;
  margin-bottom: 1.5rem;
  gap: 1rem;
  
  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const DeliveryMode = styled.div`
  flex: 1;
  background: ${props => props.ai ? 'rgba(34, 197, 94, 0.1)' : 'rgba(26, 54, 93, 0.1)'};
  padding: 0.8rem;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: ${props => props.ai ? 'var(--accent-color)' : 'var(--primary-color)'};
  font-weight: 500;
`;

const Features = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  margin-bottom: 2rem;
`;

const Feature = styled.li`
  color: var(--text-primary);
  font-size: 1rem;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: flex-start;

  &:before {
    content: '✓';
    color: var(--accent-color);
    margin-right: 0.75rem;
    font-weight: bold;
  }
`;

const LearnMoreButton = styled.button`
  background: transparent;
  color: var(--primary-color);
  border: none;
  font-size: 1rem;
  font-weight: 600;
  padding: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: auto;
  
  svg {
    transition: transform 0.3s ease;
  }
  
  &:hover {
    color: var(--accent-color);
    
    svg {
      transform: translateX(5px);
    }
  }
`;

const ConsultationContainer = styled.div`
  max-width: 1000px;
  margin: 100px auto 0;
  padding: 3rem;
  background: linear-gradient(135deg, var(--primary-color), #2d4e71);
  border-radius: 20px;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: ${props => props.theme.shadows.lg};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    width: 350px;
    height: 350px;
    background: radial-gradient(circle, rgba(34, 197, 94, 0.15) 0%, transparent 70%);
    top: -150px;
    right: -100px;
    border-radius: 50%;
  }
  
  @media (max-width: 968px) {
    flex-direction: column;
    text-align: center;
    gap: 2rem;
    padding: 2rem;
  }
`;

const ConsultationText = styled.div`
  max-width: 600px;
  position: relative;
  z-index: 1;
  
  h3 {
    font-size: 2rem;
    margin-bottom: 1rem;
    color: white;
  }
  
  p {
    color: rgba(255, 255, 255, 0.8);
    font-size: 1.1rem;
    margin-bottom: 0;
  }
`;

const ConsultationButton = styled.button`
  background: var(--accent-color);
  color: white;
  padding: 1.25rem 2.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1.125rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
  
  &:hover {
    transform: translateY(-3px);
    background: #1a945e;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
  
  @media (max-width: 968px) {
    width: 100%;
    justify-content: center;
  }
`;

const Services = () => {
  const [viewMode, setViewMode] = useState('all');
  
  const allServices = [
    {
      icon: <FaChartLine />,
      title: "Investment Advisory",
      description: "Get expert guidance on investment decisions with the perfect blend of human expertise and AI-powered analysis for optimal strategy.",
      features: [
        "Personalized investment strategy",
        "AI-powered market analysis",
        "Risk assessment consultation",
        "Investment opportunity evaluation"
      ],
      isHybrid: true
    },
    {
      icon: <FaHome />,
      title: "Property Investment Guidance",
      description: "Navigate Nigeria's real estate market with our hybrid approach combining human expertise on locations with AI data analysis.",
      features: [
        "AI-driven property market trends",
        "Expert location opportunity assessment",
        "Mortgage and financing guidance",
        "Predictive ROI analysis"
      ],
      isHybrid: true
    },
    {
      icon: <FaGraduationCap />,
      title: "Financial Education",
      description: "Build your financial knowledge with our comprehensive training that combines expert-led sessions with AI learning tools.",
      features: [
        "Interactive AI learning modules",
        "Expert-led strategy workshops",
        "Personalized education paths",
        "On-demand knowledge resources"
      ],
      isHybrid: true
    },
    {
      icon: <FaHandHoldingUsd />,
      title: "Wealth Preservation",
      description: "Protect and grow your existing assets with strategies designed by our experts and continuously monitored by AI tools.",
      features: [
        "Inflation protection planning",
        "AI-monitored asset tracking",
        "Expert wealth transfer consultation",
        "Economic trend analysis"
      ],
      isHybrid: true
    },
    {
      icon: <FaChartPie />,
      title: "Financial Planning",
      description: "Create a comprehensive roadmap for your financial future with human-led planning and AI-powered goal tracking and optimization.",
      features: [
        "Expert-led goal setting",
        "AI cash flow optimization",
        "Automated progress tracking",
        "Personalized retirement modeling"
      ],
      isHybrid: true
    },
    {
      icon: <FaShieldAlt />,
      title: "Risk Management Advisory",
      description: "Navigate financial uncertainties with our hybrid approach to risk assessment combining expert insight with AI-driven scenario analysis.",
      features: [
        "Human-AI collaborative risk assessment",
        "Diversification strategy development",
        "AI market volatility monitoring",
        "Expert-led contingency planning"
      ],
      isHybrid: true
    }
  ];

  const filteredServices = viewMode === 'all' 
    ? allServices 
    : viewMode === 'hybrid' 
      ? allServices.filter(service => service.isHybrid) 
      : allServices.filter(service => !service.isHybrid);

  return (
    <ServicesSection id="services">
      <SectionHeader>
        <Preheading>BloomVest Finance</Preheading>
        <Title>Hybrid Financial Advisory</Title>
        <Subtitle>
          Experience the best of both worlds with our hybrid approach that combines human financial 
          expertise with cutting-edge AI technology to deliver superior guidance tailored to your needs.
        </Subtitle>
      </SectionHeader>
      
      <ToggleContainer>
        <ToggleOption 
          active={viewMode === 'all'}
          onClick={() => setViewMode('all')}
        >
          All Services
        </ToggleOption>
        <ToggleOption 
          active={viewMode === 'hybrid'}
          onClick={() => setViewMode('hybrid')}
        >
          <FaSyncAlt /> Hybrid Services
        </ToggleOption>
      </ToggleContainer>
      
      <ServicesGrid>
        {filteredServices.map((service, index) => (
          <ServiceCard key={index}>
            <CardHeader>
              <IconWrapper>{service.icon}</IconWrapper>
              {service.isHybrid && (
                <HybridTag>
                  <FaExchangeAlt /> Hybrid
                </HybridTag>
              )}
            </CardHeader>
            <ServiceTitle>{service.title}</ServiceTitle>
            <ServiceDescription>{service.description}</ServiceDescription>
            
            {service.isHybrid && (
              <DeliveryModes>
                <DeliveryMode>
                  <FaUserTie /> Human Advisory
                </DeliveryMode>
                <DeliveryMode ai>
                  <FaRobot /> AI Support
                </DeliveryMode>
              </DeliveryModes>
            )}
            
            <Features>
              {service.features.map((feature, i) => (
                <Feature key={i}>{feature}</Feature>
              ))}
            </Features>
            <LearnMoreButton>
              Learn more <FaArrowRight />
            </LearnMoreButton>
          </ServiceCard>
        ))}
      </ServicesGrid>
      
      <ConsultationContainer>
        <ConsultationText>
          <h3>Ready to experience BloomVest Finance?</h3>
          <p>Schedule a free consultation to discuss your financial goals and see how our unique blend of human expertise and AI technology can help you achieve them.</p>
        </ConsultationText>
        <ConsultationButton>
          Book Free Consultation <FaArrowRight />
        </ConsultationButton>
      </ConsultationContainer>
    </ServicesSection>
  );
};

export default Services;