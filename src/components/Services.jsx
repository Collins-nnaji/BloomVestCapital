import React from 'react';
import styled from 'styled-components';
import { 
  FaChartLine, 
  FaHome, 
  FaGraduationCap, 
  FaHandHoldingUsd,
  FaChartPie,
  FaShieldAlt,
  FaArrowRight
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
  margin: 0 auto 80px;
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
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: ${props => props.theme.shadows.lg};
    border-color: rgba(74, 222, 128, 0.3);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 0;
    background: var(--accent-color);
    border-radius: 4px 0 0 4px;
    transition: height 0.4s ease;
  }
  
  &:hover::before {
    height: 100%;
  }
`;

const IconWrapper = styled.div`
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, var(--accent-color), #4ade80);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  font-size: 2rem;
  color: white;
  box-shadow: 0 10px 20px rgba(34, 197, 94, 0.2);
  transition: all 0.3s ease;
  
  ${ServiceCard}:hover & {
    transform: scale(1.1);
    box-shadow: 0 15px 25px rgba(34, 197, 94, 0.3);
  }
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
  
  @media (max-width: 968px) {
    flex-direction: column;
    text-align: center;
    gap: 2rem;
    padding: 2rem;
  }
`;

const ConsultationText = styled.div`
  max-width: 600px;
  
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
  const services = [
    {
      icon: <FaChartLine />,
      title: "Investment Advisory",
      description: "Receive expert guidance on investment decisions without the platform commitment. We analyze options and provide clear, actionable recommendations.",
      features: [
        "Independent market analysis",
        "Risk assessment consultation",
        "Portfolio strategy development",
        "Investment opportunity evaluation"
      ]
    },
    {
      icon: <FaHome />,
      title: "Property Investment Guidance",
      description: "Navigate Nigeria's real estate market with expert advisory on property investments, locations, and financing options.",
      features: [
        "Property market analysis",
        "Location opportunity assessment",
        "Mortgage and financing guidance",
        "Property investment strategy"
      ]
    },
    {
      icon: <FaGraduationCap />,
      title: "Financial Education",
      description: "Build your financial knowledge with our comprehensive training programs designed specifically for the Nigerian context.",
      features: [
        "Investment fundamentals workshops",
        "Wealth building strategy sessions",
        "Market analysis training",
        "Personal finance masterclasses"
      ]
    },
    {
      icon: <FaHandHoldingUsd />,
      title: "Wealth Preservation",
      description: "Protect and grow your existing assets with strategies designed to preserve wealth against inflation and market volatility.",
      features: [
        "Asset protection planning",
        "Inflation hedging strategies",
        "Wealth transfer consultation",
        "Economic trend analysis"
      ]
    },
    {
      icon: <FaChartPie />,
      title: "Financial Planning",
      description: "Create a comprehensive roadmap for your financial future with goal-based planning tailored to your personal circumstances.",
      features: [
        "Goal setting and prioritization",
        "Cash flow optimization",
        "Emergency planning",
        "Retirement roadmapping"
      ]
    },
    {
      icon: <FaShieldAlt />,
      title: "Risk Management Advisory",
      description: "Navigate financial uncertainties with expert risk assessment and mitigation strategies tailored to the Nigerian economic landscape.",
      features: [
        "Personalized risk assessment",
        "Diversification strategy",
        "Market volatility preparation",
        "Contingency planning"
      ]
    }
  ];

  return (
    <ServicesSection id="services">
      <SectionHeader>
        <Preheading>Our Services</Preheading>
        <Title>Expert Financial Advisory</Title>
        <Subtitle>
          We provide comprehensive financial advisory services to help you make informed decisions
          and achieve your financial goals through expert guidance and education.
        </Subtitle>
      </SectionHeader>
      
      <ServicesGrid>
        {services.map((service, index) => (
          <ServiceCard key={index}>
            <IconWrapper>{service.icon}</IconWrapper>
            <ServiceTitle>{service.title}</ServiceTitle>
            <ServiceDescription>{service.description}</ServiceDescription>
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
          <h3>Not sure which service fits your needs?</h3>
          <p>Schedule a free 30-minute consultation with our experts to discuss your financial goals and receive personalized recommendations.</p>
        </ConsultationText>
        <ConsultationButton>
          Book Free Consultation <FaArrowRight />
        </ConsultationButton>
      </ConsultationContainer>
    </ServicesSection>
  );
};

export default Services;