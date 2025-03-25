import React, { useState } from 'react';
import styled from 'styled-components';
import { FaChartLine, FaRegLightbulb, FaFileAlt, FaChartBar, FaArrowRight, FaTimes, FaCheck } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const ServicesSection = styled.section`
  background-color: #ffffff;
  padding: 120px 0;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: radial-gradient(#f0f9ff 2px, transparent 2px);
    background-size: 30px 30px;
    opacity: 0.4;
    z-index: 0;
  }
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
  max-width: 700px;
  margin: 0 auto 70px;
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

const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2.5rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ServiceCard = styled(motion.div)`
  background: #ffffff;
  border-radius: 20px;
  padding: 0;
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 6px;
    background: ${props => props.color || '#22c55e'};
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.5s ease;
  }
  
  &:hover::before {
    transform: scaleX(1);
  }
`;

const CardContent = styled.div`
  padding: 2.5rem;
`;

const IconWrapper = styled.div`
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.bgColor || '#e6f7ff'};
  color: ${props => props.iconColor || '#0284c7'};
  border-radius: 16px;
  margin-bottom: 1.5rem;
  font-size: 2rem;
  transition: all 0.4s ease;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.05);
  
  ${ServiceCard}:hover & {
    transform: translateY(-10px) rotate(10deg);
  }
`;

const ServiceTitle = styled.h3`
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a365d;
  margin-bottom: 1rem;
`;

const ServiceDescription = styled.p`
  color: #64748b;
  line-height: 1.7;
  margin-bottom: 1.5rem;
  font-size: 1.05rem;
`;

const LearnMore = styled.button`
  display: inline-flex;
  align-items: center;
  font-weight: 600;
  color: ${props => props.color || '#22c55e'};
  gap: 0.5rem;
  transition: all 0.3s ease;
  text-decoration: none;
  background: transparent;
  border: none;
  padding: 0.5rem 0;
  cursor: pointer;
  font-size: 1rem;
  
  svg {
    transition: transform 0.3s ease;
  }
  
  &:hover {
    color: ${props => props.hoverColor || '#15803d'};
    
    svg {
      transform: translateX(6px);
    }
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 2rem;
`;

const ModalContent = styled(motion.div)`
  background: white;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  padding: 2rem;
  background: ${props => props.bgColor || '#e6f7ff'};
  position: relative;
`;

const ModalTitle = styled.h3`
  font-size: 2rem;
  font-weight: 700;
  color: #1a365d;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ModalDescription = styled.p`
  color: #64748b;
  font-size: 1.1rem;
  line-height: 1.6;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1a365d;
  font-size: 1.2rem;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: rotate(90deg);
    color: #ef4444;
  }
`;

const ModalBody = styled.div`
  padding: 2rem;
  overflow-y: auto;
`;

const FeaturesList = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
`;

const FeatureIcon = styled.div`
  width: 40px;
  height: 40px;
  min-width: 40px;
  background: ${props => props.bgColor || 'rgba(34, 197, 94, 0.1)'};
  color: ${props => props.iconColor || '#22c55e'};
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
`;

const FeatureContent = styled.div``;

const FeatureTitle = styled.h4`
  font-size: 1.2rem;
  font-weight: 600;
  color: #1a365d;
  margin-bottom: 0.5rem;
`;

const FeatureDescription = styled.p`
  color: #64748b;
  line-height: 1.6;
  font-size: 0.95rem;
`;

const CaseStudy = styled.div`
  background: rgba(34, 197, 94, 0.05);
  padding: 1.5rem;
  border-radius: 12px;
  margin: 2rem 0;
  border-left: 4px solid #22c55e;
`;

const CaseStudyTitle = styled.h4`
  font-size: 1.2rem;
  font-weight: 600;
  color: #1a365d;
  margin-bottom: 1rem;
`;

const CaseStudyDescription = styled.p`
  color: #64748b;
  line-height: 1.7;
  font-size: 1rem;
`;

const ActionButton = styled.button`
  background: ${props => props.bgColor || '#22c55e'};
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 1.5rem;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    background: ${props => props.hoverColor || '#15803d'};
  }
  
  svg {
    transition: transform 0.3s ease;
  }
  
  &:hover svg {
    transform: translateX(5px);
  }
`;

const services = [
  {
    icon: <FaChartLine />,
    title: "Financial Analysis",
    description: "Leverage our advanced data analytics to gain deeper insights into your financial performance with comprehensive reporting.",
    bgColor: "#e6ffec",
    iconColor: "#22c55e",
    color: "#22c55e",
    hoverColor: "#15803d",
    features: [
      {
        title: "Performance Metrics",
        description: "Track and analyze key financial metrics and KPIs specific to your industry and business model.",
        icon: <FaChartBar />
      },
      {
        title: "Trend Identification",
        description: "Identify patterns and trends in your financial data that indicate opportunities or potential issues.",
        icon: <FaChartLine />
      },
      {
        title: "Comparative Analysis",
        description: "Benchmark your financial performance against industry standards and competitors.",
        icon: <FaChartBar />
      },
      {
        title: "Visualization Tools",
        description: "Interactive dashboards and visual reports that make complex financial data accessible and actionable.",
        icon: <FaChartBar />
      }
    ],
    caseStudy: {
      title: "How We Helped a Manufacturing Company Increase Profit Margins by 15%",
      description: "By analyzing their financial data across multiple departments, we identified inefficiencies in their supply chain and production processes. Our detailed financial analysis revealed opportunities for cost reduction and pricing optimization, resulting in a 15% increase in profit margins within 6 months."
    }
  },
  {
    icon: <FaFileAlt />,
    title: "Financial Reporting",
    description: "Comprehensive, automated financial reporting tailored to your business needs with visual clarity and actionable insights.",
    bgColor: "#e6f7ff",
    iconColor: "#0284c7",
    color: "#0284c7",
    hoverColor: "#0369a1",
    features: [
      {
        title: "Custom Report Creation",
        description: "Tailored financial reports designed specifically for your business needs and objectives.",
        icon: <FaFileAlt />
      },
      {
        title: "Automated Generation",
        description: "Regular, automated report generation on daily, weekly, monthly, or quarterly schedules.",
        icon: <FaFileAlt />
      },
      {
        title: "Compliance Assurance",
        description: "Reports formatted to meet regulatory requirements and industry standards.",
        icon: <FaCheck />
      },
      {
        title: "Stakeholder Reporting",
        description: "Different report versions optimized for various stakeholders from executives to investors.",
        icon: <FaFileAlt />
      }
    ],
    caseStudy: {
      title: "How We Streamlined Reporting for a Financial Services Firm",
      description: "A mid-sized financial services firm was spending over 40 hours per month manually creating reports for clients and regulators. We implemented automated financial reporting that reduced their report creation time by 85% while improving accuracy and consistency. The firm now delivers reports to clients 3 days faster than before."
    }
  },
  {
    icon: <FaRegLightbulb />,
    title: "Predictive Financial Insights",
    description: "Forward-looking financial insights based on advanced modeling and scenario analysis to guide strategic decisions.",
    bgColor: "#fff7e6",
    iconColor: "#f59e0b",
    color: "#f59e0b",
    hoverColor: "#d97706",
    features: [
      {
        title: "Future Projection Models",
        description: "Mathematical models that predict future financial performance based on historical data and market trends.",
        icon: <FaRegLightbulb />
      },
      {
        title: "Scenario Planning",
        description: "Analysis of multiple potential futures to prepare for different market conditions and business challenges.",
        icon: <FaRegLightbulb />
      },
      {
        title: "Risk Assessment",
        description: "Identification and quantification of potential risks that could impact financial performance.",
        icon: <FaRegLightbulb />
      },
      {
        title: "Strategic Recommendations",
        description: "Data-backed recommendations to optimize financial decisions and strategic planning.",
        icon: <FaRegLightbulb />
      }
    ],
    caseStudy: {
      title: "Helping a Retail Chain Navigate Market Uncertainty",
      description: "A retail chain with 50+ locations needed to make expansion decisions during market uncertainty. Our predictive financial insights helped them identify which regions would deliver the highest ROI, and which existing locations should be repositioned. Their new locations are outperforming previous openings by 35% in first-year revenue."
    }
  },
  {
    icon: <FaChartBar />,
    title: "Portfolio Optimization",
    description: "Maximize returns while managing risk through data-driven portfolio analysis and sophisticated allocation algorithms.",
    bgColor: "#f0e6ff",
    iconColor: "#8b5cf6",
    color: "#8b5cf6",
    hoverColor: "#7c3aed",
    features: [
      {
        title: "Asset Allocation Modeling",
        description: "Sophisticated statistical models to determine optimal distribution of assets based on risk tolerance and goals.",
        icon: <FaChartBar />
      },
      {
        title: "Risk-Return Analysis",
        description: "Detailed analysis of the trade-offs between potential returns and associated risks for different allocations.",
        icon: <FaChartBar />
      },
      {
        title: "Diversification Strategy",
        description: "Strategies to minimize portfolio risk through proper diversification across sectors and asset classes.",
        icon: <FaChartBar />
      },
      {
        title: "Rebalancing Recommendations",
        description: "Timely recommendations for portfolio adjustments based on market conditions and goal progress.",
        icon: <FaChartBar />
      }
    ],
    caseStudy: {
      title: "Optimizing an Investment Portfolio for a High-Net-Worth Client",
      description: "We worked with a high-net-worth client whose portfolio was underperforming the market despite significant asset value. Through our optimization process, we identified concentrated risk positions and inefficient allocations. After implementing our recommendations, their portfolio achieved 3.2% higher returns with 25% less volatility in the following year."
    }
  }
];

const Services = () => {
  const [selectedService, setSelectedService] = useState(null);
  
  const openModal = (service) => {
    setSelectedService(service);
    document.body.style.overflow = 'hidden';
  };
  
  const closeModal = () => {
    setSelectedService(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <ServicesSection id="services">
      <Container>
        <SectionHeader>
          <Preheading>Our Services</Preheading>
          <Title>Data-Driven Financial Services</Title>
          <Subtitle>
            We combine advanced analytics with financial expertise to provide services that
            empower informed decision-making and strategic growth for your business.
          </Subtitle>
        </SectionHeader>
        
        <ServicesGrid>
          {services.map((service, index) => (
            <ServiceCard 
              key={index}
              color={service.color}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1,
                ease: "easeOut"
              }}
            >
              <CardContent>
                <IconWrapper bgColor={service.bgColor} iconColor={service.iconColor}>
                  {service.icon}
                </IconWrapper>
                <ServiceTitle>{service.title}</ServiceTitle>
                <ServiceDescription>{service.description}</ServiceDescription>
                <LearnMore 
                  onClick={() => openModal(service)}
                  color={service.color}
                  hoverColor={service.hoverColor}
                >
                  Learn More <FaArrowRight />
                </LearnMore>
              </CardContent>
            </ServiceCard>
          ))}
        </ServicesGrid>
      </Container>
      
      <AnimatePresence>
        {selectedService && (
          <Overlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <ModalContent
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ModalHeader bgColor={selectedService.bgColor}>
                <ModalTitle>
                  <IconWrapper 
                    bgColor={selectedService.bgColor} 
                    iconColor={selectedService.iconColor}
                    style={{ margin: 0 }}
                  >
                    {selectedService.icon}
                  </IconWrapper>
                  {selectedService.title}
                </ModalTitle>
                <ModalDescription>{selectedService.description}</ModalDescription>
                <CloseButton onClick={closeModal}>
                  <FaTimes />
                </CloseButton>
              </ModalHeader>
              
              <ModalBody>
                <h3 style={{ marginBottom: '1.5rem', color: '#1a365d', fontSize: '1.3rem' }}>Core Features</h3>
                <FeaturesList>
                  {selectedService.features.map((feature, index) => (
                    <FeatureItem key={index}>
                      <FeatureIcon 
                        bgColor={`${selectedService.color}15`} 
                        iconColor={selectedService.color}
                      >
                        {feature.icon}
                      </FeatureIcon>
                      <FeatureContent>
                        <FeatureTitle>{feature.title}</FeatureTitle>
                        <FeatureDescription>{feature.description}</FeatureDescription>
                      </FeatureContent>
                    </FeatureItem>
                  ))}
                </FeaturesList>
                
                <CaseStudy>
                  <CaseStudyTitle>{selectedService.caseStudy.title}</CaseStudyTitle>
                  <CaseStudyDescription>{selectedService.caseStudy.description}</CaseStudyDescription>
                </CaseStudy>
                
                <div style={{ textAlign: 'center' }}>
                  <ActionButton 
                    bgColor={selectedService.color}
                    hoverColor={selectedService.hoverColor}
                  >
                    Request This Service <FaArrowRight />
                  </ActionButton>
                </div>
              </ModalBody>
            </ModalContent>
          </Overlay>
        )}
      </AnimatePresence>
    </ServicesSection>
  );
};

export default Services;