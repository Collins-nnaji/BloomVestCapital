import React from 'react';
import styled from 'styled-components';
import { 
  FaUsers, 
  FaChartBar, 
  FaHandshake, 
  FaBook, 
  FaGlobe, 
  FaUserTie 
} from 'react-icons/fa';

const Section = styled.section`
  background: #f8fafc;
  padding: 100px 0;
  position: relative;
  overflow: hidden;
`;

const SectionPattern = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-image: radial-gradient(rgba(34, 197, 94, 0.1) 2px, transparent 2px);
  background-size: 30px 30px;
  opacity: 0.3;
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
  margin: 0 auto 60px;
`;

const Preheading = styled.div`
  font-size: 1.125rem;
  font-weight: 600;
  color: #22c55e;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const Title = styled.h2`
  font-size: 2.75rem;
  font-weight: 700;
  color: #1a365d;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    font-size: 2.25rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #64748b;
  line-height: 1.7;
`;

const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ServiceCard = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 2.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.03);
  display: flex;
  flex-direction: column;
  height: 100%;
  border: 1px solid rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.08);
  }
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 5px;
    background: linear-gradient(to right, #22c55e, #4ade80);
    transform: scaleX(0);
    transform-origin: bottom right;
    transition: transform 0.4s ease;
  }
  
  &:hover:after {
    transform: scaleX(1);
    transform-origin: bottom left;
  }
`;

const ServiceIcon = styled.div`
  width: 70px;
  height: 70px;
  background: rgba(34, 197, 94, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  font-size: 1.75rem;
  color: #22c55e;
  transition: all 0.3s ease;
  
  ${ServiceCard}:hover & {
    background: #22c55e;
    color: white;
    transform: rotate(5deg) scale(1.05);
  }
`;

const ServiceTitle = styled.h3`
  font-size: 1.5rem;
  color: #1a365d;
  margin-bottom: 1rem;
  font-weight: 600;
`;

const ServiceDescription = styled.p`
  color: #64748b;
  font-size: 1rem;
  line-height: 1.7;
  margin-bottom: 1.5rem;
  flex-grow: 1;
`;

const ServicePrice = styled.div`
  color: #22c55e;
  font-weight: 700;
  font-size: 1.25rem;
  margin: 0.5rem 0 1.5rem;
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  
  span {
    color: #64748b;
    font-size: 0.9rem;
    font-weight: 400;
  }
`;

const ServiceFeatures = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 1.5rem;
`;

const ServiceFeature = styled.li`
  margin-bottom: 0.75rem;
  color: #334155;
  font-size: 0.95rem;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  
  &:before {
    content: '✓';
    color: #22c55e;
    font-weight: bold;
  }
`;

const ServiceButton = styled.button`
  background: transparent;
  color: #1a365d;
  border: 2px solid #1a365d;
  padding: 0.9rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: auto;
  
  &:hover {
    background: #1a365d;
    color: white;
  }
`;

const AdditionalServices = () => {
  const services = [
    {
      icon: <FaUsers />,
      title: "Naija-Bloom Mastermind",
      price: "₦15,000/month",
      description: "Join our exclusive community of like-minded Nigerian investors for regular group coaching, networking, and collaborative learning.",
      features: [
        "Bi-weekly group coaching sessions",
        "Members-only investment insights",
        "Peer networking opportunities",
        "First access to special events"
      ]
    },
    {
      icon: <FaChartBar />,
      title: "Business Investment Readiness",
      price: "₦180,000 (one-time)",
      description: "Comprehensive advisory package for SME owners seeking to attract investment or scale their business operations.",
      features: [
        "Business valuation assessment",
        "Financial structure optimization",
        "Investor pitch preparation",
        "Growth strategy development"
      ]
    },
    {
      icon: <FaHandshake />,
      title: "Real Estate Advisory",
      price: "₦120,000/project",
      description: "Specialized guidance for property investment decisions, from residential to commercial opportunities across Nigeria.",
      features: [
        "Location analysis & valuation",
        "ROI projection & modeling",
        "Risk assessment & mitigation",
        "Financing option advisory"
      ]
    },
    {
      icon: <FaBook />,
      title: "Financial Literacy Program",
      price: "₦45,000 (8 weeks)",
      description: "Structured education program to build your financial knowledge and investment decision-making capabilities.",
      features: [
        "8 comprehensive modules",
        "Weekly coaching sessions",
        "Practical exercises & case studies",
        "Lifetime access to materials"
      ]
    },
    {
      icon: <FaGlobe />,
      title: "Diaspora Investment Advisory",
      price: "₦200,000/year",
      description: "Specialized guidance for Nigerians abroad looking to make informed investment decisions back home.",
      features: [
        "Remote consultation sessions",
        "Currency risk management",
        "Legal & regulatory guidance",
        "Local market representation"
      ]
    },
    {
      icon: <FaUserTie />,
      title: "Executive Wealth Strategy",
      price: "₦350,000/year",
      description: "Premium advisory service for C-suite executives and high-income professionals with complex financial needs.",
      features: [
        "Comprehensive wealth strategy",
        "Executive compensation optimization",
        "Advanced tax planning",
        "Succession & legacy planning"
      ]
    }
  ];

  return (
    <Section id="additional-services">
      <SectionPattern />
      <Container>
        <SectionHeader>
          <Preheading>Specialized Services</Preheading>
          <Title>Additional Advisory Opportunities</Title>
          <Subtitle>
            Beyond our core services, we offer specialized advisory packages designed for 
            specific needs and circumstances. Each service provides targeted guidance to help you 
            achieve your unique financial goals.
          </Subtitle>
        </SectionHeader>
        
        <ServicesGrid>
          {services.map((service, index) => (
            <ServiceCard key={index}>
              <ServiceIcon>{service.icon}</ServiceIcon>
              <ServiceTitle>{service.title}</ServiceTitle>
              <ServicePrice>
                {service.price} <span>{service.price.includes('month') ? 'subscription' : 'package'}</span>
              </ServicePrice>
              <ServiceDescription>{service.description}</ServiceDescription>
              <ServiceFeatures>
                {service.features.map((feature, i) => (
                  <ServiceFeature key={i}>{feature}</ServiceFeature>
                ))}
              </ServiceFeatures>
              <ServiceButton>Learn More</ServiceButton>
            </ServiceCard>
          ))}
        </ServicesGrid>
      </Container>
    </Section>
  );
};

export default AdditionalServices;