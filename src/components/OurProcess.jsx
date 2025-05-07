import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaUserTie, FaChartLine, FaHandshake, FaRocket, FaSyncAlt, FaArrowRight } from 'react-icons/fa';

const Section = styled.section`
  padding: 120px 0;
  background: linear-gradient(to right, #f8fafc, #f1f5f9);
  position: relative;
  overflow: hidden;
`;

const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 2;
`;

const BackgroundPattern = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(rgba(34, 197, 94, 0.03) 2px, transparent 2px),
    radial-gradient(rgba(26, 54, 93, 0.03) 2px, transparent 2px);
  background-size: 40px 40px, 30px 30px;
  background-position: 0 0, 20px 20px;
  opacity: 0.6;
  z-index: 1;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 5rem;
`;

const Title = styled.h2`
  font-size: 3rem;
  font-weight: 800;
  color: #1a365d;
  margin-bottom: 1.5rem;
  position: relative;
  display: inline-block;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -12px;
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
`;

const Description = styled.p`
  font-size: 1.25rem;
  color: #475569;
  line-height: 1.8;
  max-width: 800px;
  margin: 0 auto;
  
  strong {
    color: #1a365d;
    font-weight: 600;
  }
`;

const Timeline = styled.div`
  position: relative;
  margin-top: 4rem;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 50%;
    width: 4px;
    background: linear-gradient(to bottom, #22c55e, #3b82f6);
    transform: translateX(-50%);
    border-radius: 4px;
    
    @media (max-width: 768px) {
      left: 30px;
    }
  }
`;

const TimelineItem = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 8rem;
  position: relative;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  &:nth-child(even) {
    flex-direction: row-reverse;
    
    @media (max-width: 768px) {
      flex-direction: row;
    }
  }
  
  @media (max-width: 768px) {
    margin-bottom: 5rem;
  }
`;

const TimelineIconContainer = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: ${props => props.bg || 'linear-gradient(135deg, #22c55e, #15803d)'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
  flex-shrink: 0;
  position: relative;
  z-index: 2;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    width: 60px;
    height: 60px;
    font-size: 1.5rem;
    position: absolute;
    left: 0;
  }
`;

const TimelineContent = styled(motion.div)`
  flex: 0 0 calc(50% - 60px);
  max-width: calc(50% - 60px);
  background: white;
  border-radius: 16px;
  padding: 2.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(226, 232, 240, 0.6);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 30px;
    width: 0;
    height: 0;
    border-top: 15px solid transparent;
    border-bottom: 15px solid transparent;
  }
  
  ${TimelineItem}:nth-child(odd) &::before {
    right: -15px;
    border-left: 15px solid white;
    
    @media (max-width: 768px) {
      left: -15px;
      right: auto;
      border-left: none;
      border-right: 15px solid white;
    }
  }
  
  ${TimelineItem}:nth-child(even) &::before {
    left: -15px;
    border-right: 15px solid white;
  }
  
  @media (max-width: 768px) {
    flex: 0 0 calc(100% - 100px);
    max-width: calc(100% - 100px);
    margin-left: 100px;
  }
`;

const TimelineStep = styled.div`
  display: inline-block;
  padding: 0.5rem 1rem;
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
  font-weight: 700;
  font-size: 0.9rem;
  border-radius: 50px;
  margin-bottom: 1.25rem;
`;

const TimelineTitle = styled.h3`
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a365d;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const TimelineTimeframe = styled.p`
  font-size: 1rem;
  color: #64748b;
  font-weight: 600;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.5rem;
  }
`;

const TimelineText = styled.p`
  font-size: 1.1rem;
  color: #475569;
  line-height: 1.7;
  margin-bottom: 1.5rem;
`;

const TimelineList = styled.ul`
  margin: 1.5rem 0;
  padding-left: 1.25rem;
`;

const TimelineListItem = styled.li`
  font-size: 1.05rem;
  color: #475569;
  margin-bottom: 0.75rem;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    left: -1.25rem;
    top: 0.5rem;
    width: 8px;
    height: 8px;
    background: #22c55e;
    border-radius: 50%;
  }
`;

const OurProcess = () => {
  const processes = [
    {
      icon: <FaUserTie />,
      step: "Step 1",
      title: "Startup Screening",
      timeframe: "Week 1-2",
      gradient: "linear-gradient(135deg, #22c55e, #15803d)",
      description: "We evaluate hundreds of startups through our rigorous initial screening process, identifying companies with exceptional founders, innovative solutions, and strong market potential.",
      details: [
        "Founder background and domain expertise assessment",
        "Technology and product differentiation analysis",
        "Market size and growth trajectory evaluation",
        "Initial business model and unit economics review",
        "Competitive landscape mapping and analysis"
      ]
    },
    {
      icon: <FaChartLine />,
      step: "Step 2",
      title: "Comprehensive Due Diligence",
      timeframe: "Weeks 3-5",
      gradient: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
      description: "For startups that pass our initial screening, we conduct thorough due diligence across multiple dimensions, involving domain experts, customer interviews, and detailed financial analysis.",
      details: [
        "In-depth technology validation with domain experts",
        "Customer and market validation interviews",
        "Financial model stress-testing and analysis",
        "Reference checks with customers and partners",
        "Legal review of IP, contracts, and compliance"
      ]
    },
    {
      icon: <FaHandshake />,
      step: "Step 3",
      title: "Deal Structuring",
      timeframe: "Week 6",
      gradient: "linear-gradient(135deg, #f59e0b, #d97706)",
      description: "For selected startups, we develop investment terms that balance founder incentives with investor protection, creating alignment between all stakeholders and positioning the company for future growth.",
      details: [
        "Valuation assessment based on multiple methodologies",
        "Term sheet development with founder-friendly provisions",
        "Investment vehicle selection (equity, convertible note, SAFE)",
        "Board composition and governance structure design",
        "Investment syndication with strategic co-investors"
      ]
    },
    {
      icon: <FaRocket />,
      step: "Step 4",
      title: "Investment & Onboarding",
      timeframe: "Weeks 7-8",
      gradient: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
      description: "Upon finalizing investment terms, we efficiently complete the transaction and immediately begin integrating the startup into our growth acceleration programs and network.",
      details: [
        "Legal documentation and closing process",
        "Initial capital deployment and banking setup",
        "Strategic growth planning workshop with founders",
        "Key metrics and reporting framework establishment",
        "Introduction to BloomVest's advisor network"
      ]
    },
    {
      icon: <FaSyncAlt />,
      step: "Step 5",
      title: "Growth Acceleration",
      timeframe: "Ongoing",
      gradient: "linear-gradient(135deg, #ec4899, #be185d)",
      description: "We actively support our portfolio companies with strategic guidance, operational expertise, and valuable connections to accelerate growth and maximize the probability of successful outcomes.",
      details: [
        "Monthly performance reviews and operational support",
        "Strategic partnership and customer introductions",
        "Talent acquisition assistance for key positions",
        "Preparation for follow-on funding rounds",
        "Exit strategy development and execution support",
        "Regular founder mastermind sessions and workshops"
      ]
    }
  ];

  return (
    <Section>
      <BackgroundPattern />
      <Container>
        <Header>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <Title>The BloomVest Investment Process</Title>
            <Description>
              Our structured investment approach is designed to <strong>identify exceptional startups</strong> and provide them with the capital, expertise, and connections needed to achieve extraordinary growth. Each step in our process adds value for both founders and investors.
            </Description>
          </motion.div>
        </Header>
        
        <Timeline>
          {processes.map((process, index) => (
            <TimelineItem key={index}>
              <TimelineIconContainer bg={process.gradient}>
                {process.icon}
              </TimelineIconContainer>
              
              <TimelineContent
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <TimelineStep>{process.step}</TimelineStep>
                <TimelineTitle>{process.title}</TimelineTitle>
                <TimelineTimeframe>
                  <FaArrowRight /> {process.timeframe}
                </TimelineTimeframe>
                <TimelineText>{process.description}</TimelineText>
                
                <div>
                  <strong style={{fontSize: '1.1rem', color: '#1a365d'}}>Key Activities:</strong>
                  <TimelineList>
                    {process.details.map((detail, idx) => (
                      <TimelineListItem key={idx}>{detail}</TimelineListItem>
                    ))}
                  </TimelineList>
                </div>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </Container>
    </Section>
  );
};

export default OurProcess; 