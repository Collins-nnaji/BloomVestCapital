import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaChartLine, 
  FaShieldAlt, 
  FaFileInvoiceDollar, 
  FaRegLightbulb, 
  FaUsers, 
  FaAngleDown,
  FaArrowRight, 
  FaCheckCircle, 
  FaInfoCircle, 
  FaCalendarAlt,
  FaRobot,
  FaGlobe,
  FaChargingStation
} from 'react-icons/fa';

const ServicesSection = styled.section`
  padding: 120px 0;
  background: linear-gradient(to bottom, #ffffff, #f8fafc);
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

const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 1;
`;

const SectionHeader = styled.div`
  text-align: center;
  max-width: 800px;
  margin: 0 auto 70px;
`;

const SectionTitle = styled.h2`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 3.25rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 1.5rem;
  
  span {
    color: #22c55e;
  }
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const SectionDescription = styled.p`
  font-size: 1.25rem;
  color: #64748b;
  line-height: 1.8;
  
  strong {
    color: #0f172a;
    font-weight: 600;
  }
`;

const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2.5rem;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const ServiceCard = styled(motion.div)`
  background: white;
  border-radius: 24px;
  box-shadow: 0 5px 30px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  position: relative;
  z-index: 1;
  border: 1px solid rgba(15, 23, 42, 0.06);
  transition: all 0.4s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
    border-color: rgba(34, 197, 94, 0.2);
  }
`;

const ServiceHeader = styled.div`
  padding: 2.5rem;
  background: white;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const ServiceIcon = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: ${props => props.$bg || 'rgba(34, 197, 94, 0.1)'};
  color: ${props => props.$color || '#22c55e'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 8px 16px ${props => props.$shadow || 'rgba(34, 197, 94, 0.1)'};
`;

const ServiceTitle = styled.h3`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.8rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 1rem;
`;

const ServiceDescription = styled.p`
  font-size: 1.1rem;
  line-height: 1.7;
  color: #64748b;
  margin-bottom: 1.5rem;
`;

const ServiceFeaturesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ServiceFeature = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
  color: #64748b;
  font-size: 1rem;
  font-weight: 500;
  
  svg {
    color: #22c55e;
    margin-right: 0.75rem;
    flex-shrink: 0;
  }
`;

const ExpandedIndicator = styled.div`
  margin-top: 1.5rem;
  font-size: 0.85rem;
  font-weight: 700;
  color: #22c55e;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  svg {
    transition: transform 0.3s;
    transform: ${props => props.$open ? 'rotate(180deg)' : 'rotate(0)'};
  }
`;

const ServiceExpandedContent = styled(motion.div)`
  overflow: hidden;
  background: #f8fafc;
  border-top: 1px solid #f1f5f9;
`;

const DetailInner = styled.div`
  padding: 2.5rem;
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const DetailItem = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
`;

const DetailTitle = styled.h4`
  font-size: 1.1rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  svg { color: #22c55e; }
`;

const DetailDesc = styled.p`
  font-size: 0.95rem;
  color: #64748b;
  line-height: 1.6;
`;

const Services = () => {
  const [expanded, setExpanded] = useState(null);

  const servicesList = [
    {
      icon: <FaGlobe />,
      bg: "rgba(34, 197, 94, 0.1)",
      color: "#22c55e",
      shadow: "rgba(34, 197, 94, 0.15)",
      title: "Strategic Business Scouting",
      description: "Identifying and vetting high-yield private business opportunities and franchises aligned with 2026 macro trends.",
      features: [
        "Private Asset Sourcing",
        "Due Diligence Frameworks",
        "Franchise Profitability Modeling",
        "Emerging Market Entry"
      ],
      details: [
        { title: "Institutional Vetting", desc: "We apply private-equity level scrutiny to every business opportunity before it reaches your desk." },
        { title: "2026 Sector Arbitrage", desc: "Identifying businesses that benefit from infrastructure shifts and energy scarcity." }
      ]
    },
    {
      icon: <FaFileInvoiceDollar />,
      bg: "rgba(59, 130, 246, 0.1)",
      color: "#3b82f6",
      shadow: "rgba(59, 130, 246, 0.15)",
      title: "The Sovereign Alpha Report",
      description: "Monthly institutional-grade reports on Energy, Private Equity, and Global Infrastructure Trends.",
      features: [
        "Infrastructure Deep-Dives",
        "Private Market Arbitrage",
        "Emerging Industry Signals",
        "Quarterly Macro Forecasts"
      ],
      details: [
        { title: "Capital Insight", desc: "Data sourced from global indicators often reserved for sovereign wealth funds and family offices." },
        { title: "Actionable Intelligence", desc: "Focusing strictly on high-probability capital positioning for the next multi-year cycle." }
      ]
    },
    {
      icon: <FaChartLine />,
      bg: "rgba(139, 92, 246, 0.1)",
      color: "#8b5cf6",
      shadow: "rgba(139, 92, 246, 0.15)",
      title: "Capital Path Planning",
      description: "Custom roadmaps for your liquidity, balancing public market exposure with private business ventures.",
      features: [
        "Strategic Asset Allocation",
        "Liquidity Event Planning",
        "Bespoke Wealth Strategy",
        "Quarterly Intelligence Briefs"
      ],
      details: [
        { title: "Persistent Growth", desc: "Build a roadmap that ensures your capital is always positioned in the direction of macro momentum." },
        { title: "Risk-Adjusted Alpha", desc: "Tailored strategic plans that align your legacy with 2026 macro realities." }
      ]
    },
    {
      icon: <FaRobot />,
      bg: "rgba(236, 72, 153, 0.1)",
      color: "#ec4899",
      shadow: "rgba(236, 72, 153, 0.15)",
      title: "The Intelligence Layer",
      description: "Access our masterclasses and AI breakdowns to master the BloomVest Framework.",
      features: [
        "Sentiment Arbitrage Class",
        "AI Market Breakdowns",
        "Infrastructure Masterclass",
        "Live Market Intelligence"
      ],
      details: [
        { title: "Continuous Learning", desc: "The BloomVest client is informed. Access our library of high-fidelity market tutorials." },
        { title: "Interactive AI", desc: "Use our AI tutor to break down complex institutional reports into plain English." }
      ]
    }
  ];

  return (
    <ServicesSection>
      <BackgroundDecoration className="top-left" />
      <BackgroundDecoration className="bottom-right" />
      
      <Container>
        <SectionHeader>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <SectionTitle>Bespoke <span>Intelligence</span> Services</SectionTitle>
            <SectionDescription>
              In a market flooded with noise, BloomVest provides the signal. 
              Our proprietary frameworks filter global volatility into <strong>actionable investment consulting</strong>.
            </SectionDescription>
          </motion.div>
        </SectionHeader>
        
        <ServicesGrid>
          {servicesList.map((service, index) => (
            <ServiceCard 
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              onClick={() => setExpanded(expanded === index ? null : index)}
            >
              <ServiceHeader>
                <ServiceIcon $bg={service.bg} $color={service.color} $shadow={service.shadow}>
                  {service.icon}
                </ServiceIcon>
                
                <ServiceTitle>{service.title}</ServiceTitle>
                <ServiceDescription>{service.description}</ServiceDescription>
                
                <ServiceFeaturesList>
                  {service.features.map((f, i) => (
                    <ServiceFeature key={i}>
                      <FaCheckCircle /> {f}
                    </ServiceFeature>
                  ))}
                </ServiceFeaturesList>

                <ExpandedIndicator $open={expanded === index}>
                  {expanded === index ? "View less" : "View technical breakdown"}
                  <FaAngleDown />
                </ExpandedIndicator>
              </ServiceHeader>
              
              <AnimatePresence>
                {expanded === index && (
                  <ServiceExpandedContent
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <DetailInner>
                      <DetailGrid>
                        {service.details.map((d, i) => (
                          <DetailItem key={i}>
                            <DetailTitle><FaInfoCircle /> {d.title}</DetailTitle>
                            <DetailDesc>{d.desc}</DetailDesc>
                          </DetailItem>
                        ))}
                      </DetailGrid>
                    </DetailInner>
                  </ServiceExpandedContent>
                )}
              </AnimatePresence>
            </ServiceCard>
          ))}
        </ServicesGrid>
      </Container>
    </ServicesSection>
  );
};

export default Services;