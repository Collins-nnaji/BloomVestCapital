import React from 'react';
import styled from 'styled-components';
import { 
  FaUserTie, 
  FaChartBar, 
  FaHandshake, 
  FaFileAlt,
  FaArrowRight
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
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover {
    background: #1a365d;
    color: white;
    
    svg {
      transform: translateX(5px);
    }
  }
  
  svg {
    transition: transform 0.3s ease;
  }
`;

const CustomServicesCTA = styled.div`
  background: #ffffff;
  padding: 4rem;
  border-radius: 16px;
  text-align: center;
  margin-top: 4rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.03);
`;

const CTAContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const CTAHeading = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a365d;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const CTAText = styled.p`
  font-size: 1.2rem;
  color: #64748b;
  line-height: 1.7;
  margin-bottom: 2rem;
`;

const CTAButton = styled.button`
  background: #22c55e;
  color: white;
  border: none;
  padding: 0.9rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: #1a945e;
    transform: translateY(-3px);
    
    svg {
      transform: translateX(5px);
    }
  }
  
  svg {
    transition: transform 0.3s ease;
  }
`;

const AdditionalServices = () => {
  const services = [
    {
      icon: <FaUserTie />,
      title: "Executive Financial Advisory",
      description: "Personalized advisory services for executives and high-net-worth individuals focused on wealth optimization and growth.",
      features: [
        "Dedicated financial advisor",
        "Comprehensive wealth strategy",
        "Tax optimization planning",
        "Investment opportunity access"
      ]
    },
    {
      icon: <FaChartBar />,
      title: "Strategic Financial Consulting",
      description: "In-depth consulting engagements helping organizations solve complex financial challenges and implement solutions.",
      features: [
        "Comprehensive assessment",
        "Strategic planning workshops",
        "Implementation roadmaps",
        "Regular progress reviews"
      ]
    },
    {
      icon: <FaHandshake />,
      title: "M&A Financial Advisory",
      description: "Expert guidance for mergers, acquisitions, and business transitions with comprehensive financial analysis.",
      features: [
        "Target valuation",
        "Due diligence review",
        "Transaction structuring",
        "Post-merger optimization"
      ]
    },
    {
      icon: <FaFileAlt />,
      title: "Financial Reporting Services",
      description: "Professional financial reporting services for companies needing accurate, compliant, and insightful documentation.",
      features: [
        "Custom financial statements",
        "Compliance verification",
        "Performance analysis",
        "Stakeholder reports"
      ]
    }
  ];

  return (
    <Section id="specialized-services">
      <SectionPattern />
      <Container>
        <SectionHeader>
          <Preheading>BloomVest Capital</Preheading>
          <Title>Specialized Services</Title>
          <Subtitle>
            Beyond our core offerings, we provide specialized financial services designed to address 
            specific needs of individuals and organizations with complex financial requirements.
          </Subtitle>
        </SectionHeader>
        
        <ServicesGrid>
          {services.map((service, index) => (
            <ServiceCard key={index}>
              <ServiceIcon>{service.icon}</ServiceIcon>
              <ServiceTitle>{service.title}</ServiceTitle>
              <ServiceDescription>{service.description}</ServiceDescription>
              <ServiceFeatures>
                {service.features.map((feature, i) => (
                  <ServiceFeature key={i}>{feature}</ServiceFeature>
                ))}
              </ServiceFeatures>
              <ServiceButton>
                Request Information <FaArrowRight />
              </ServiceButton>
            </ServiceCard>
          ))}
        </ServicesGrid>
        
        <CustomServicesCTA>
          <CTAContent>
            <CTAHeading>Need a customized solution?</CTAHeading>
            <CTAText>
              Our team can create tailor-made financial solutions for your unique challenges.
              Contact us to discuss your specific requirements.
            </CTAText>
            <CTAButton>
              Schedule a Consultation <FaArrowRight />
            </CTAButton>
          </CTAContent>
        </CustomServicesCTA>
      </Container>
    </Section>
  );
};

export default AdditionalServices;