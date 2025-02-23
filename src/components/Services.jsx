import React from 'react';
import styled from 'styled-components';
import { 
  FaChartLine, 
  FaHome, 
  FaGraduationCap, 
  FaHandHoldingUsd,
  FaChartPie,
  FaShieldAlt
} from 'react-icons/fa';

const ServicesSection = styled.section`
  background: linear-gradient(to bottom, #f8fafc, #ffffff);
  padding: 100px 0;
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
`;

const SectionHeader = styled.div`
  text-align: center;
  max-width: 800px;
  margin: 0 auto 80px;
  padding: 0 2rem;
`;

const Title = styled.h2`
  font-size: 3rem;
  font-weight: 700;
  color: #1a365d;
  margin-bottom: 1.5rem;
  font-family: 'Inter', sans-serif;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  color: #64748b;
  line-height: 1.7;
  font-family: 'Inter', sans-serif;
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
  }
`;

const ServiceCard = styled.div`
  background: #ffffff;
  border-radius: 20px;
  padding: 2.5rem;
  transition: all 0.3s ease;
  position: relative;
  border: 1px solid rgba(74, 222, 128, 0.1);
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(74, 222, 128, 0.3);
  }
`;

const IconWrapper = styled.div`
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, #22c55e, #4ade80);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  font-size: 2rem;
  color: white;
  box-shadow: 0 10px 20px rgba(34, 197, 94, 0.2);
`;

const ServiceTitle = styled.h3`
  font-size: 1.5rem;
  color: #1a365d;
  margin-bottom: 1rem;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
`;

const ServiceDescription = styled.p`
  color: #64748b;
  font-size: 1.1rem;
  line-height: 1.7;
  margin-bottom: 1.5rem;
  font-family: 'Inter', sans-serif;
`;

const Features = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const Feature = styled.li`
  color: #334155;
  font-size: 1rem;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  font-family: 'Inter', sans-serif;

  &:before {
    content: '✓';
    color: #22c55e;
    margin-right: 0.75rem;
    font-weight: bold;
  }
`;

const Services = () => {
  const services = [
    {
      icon: <FaChartLine />,
      title: "Investment Advisory",
      description: "Expert guidance for smart investment decisions and portfolio management",
      features: [
        "Personalized investment strategies",
        "Risk assessment and management",
        "Portfolio diversification",
        "Regular performance reviews"
      ]
    },
    {
      icon: <FaHome />,
      title: "Property Investment",
      description: "Comprehensive support for real estate investment and home acquisition",
      features: [
        "Property market analysis",
        "Investment opportunity assessment",
        "Mortgage guidance",
        "Property acquisition support"
      ]
    },
    {
      icon: <FaGraduationCap />,
      title: "Financial Education",
      description: "Professional training programs to enhance your financial literacy",
      features: [
        "Investment fundamentals",
        "Wealth building strategies",
        "Risk management principles",
        "Market analysis techniques"
      ]
    },
    {
      icon: <FaHandHoldingUsd />,
      title: "Wealth Management",
      description: "Comprehensive wealth management and growth strategies",
      features: [
        "Asset allocation",
        "Tax optimization",
        "Estate planning",
        "Retirement planning"
      ]
    },
    {
      icon: <FaChartPie />,
      title: "Portfolio Management",
      description: "Active portfolio management and optimization services",
      features: [
        "Portfolio rebalancing",
        "Performance tracking",
        "Risk monitoring",
        "Investment reporting"
      ]
    },
    {
      icon: <FaShieldAlt />,
      title: "Financial Planning",
      description: "Comprehensive financial planning for your future",
      features: [
        "Goal-based planning",
        "Cash flow management",
        "Insurance needs analysis",
        "Retirement strategizing"
      ]
    }
  ];

  return (
    <ServicesSection id="services">
      <SectionHeader>
        <Title>Our Services</Title>
        <Subtitle>
          Comprehensive financial solutions tailored to help you achieve your wealth creation 
          and management goals through expert guidance and proven strategies.
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
          </ServiceCard>
        ))}
      </ServicesGrid>
    </ServicesSection>
  );
};

export default Services;