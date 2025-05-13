import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaSearch, FaHandshake, FaFileContract, FaRocket } from 'react-icons/fa';

const Section = styled.section`
  padding: 4rem 0;
  background: linear-gradient(to right, #f8fafc, #f1f5f9);
  position: relative;
  overflow: hidden;
`;

const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1.5rem;
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
    radial-gradient(rgba(34, 197, 94, 0.03) 2px, transparent 2px);
  background-size: 30px 30px;
  opacity: 0.4;
  z-index: 1;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h2`
  font-size: 2.5rem;
  font-weight: 800;
  color: #1a365d;
  margin-bottom: 1.5rem;
  position: relative;
  display: inline-block;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 70px;
    height: 4px;
    background: linear-gradient(to right, #22c55e, rgba(34, 197, 94, 0.2));
    border-radius: 4px;
  }
  
  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
`;

const Description = styled.p`
  font-size: 1.2rem;
  color: #475569;
  line-height: 1.7;
  max-width: 800px;
  margin: 0 auto;
  
  strong {
    color: #1a365d;
    font-weight: 600;
  }
`;

const ProcessGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

const ProcessCard = styled(motion.div)`
  background: white;
  border-radius: 16px;
  padding: 1.75rem;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(226, 232, 240, 0.8);
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
  }
`;

const StepNumber = styled.div`
  position: absolute;
  top: -15px;
  left: -15px;
  width: 40px;
  height: 40px;
  background: ${props => props.bg || '#22c55e'};
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.25rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
`;

const IconContainer = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background: ${props => props.bg || 'rgba(34, 197, 94, 0.1)'};
  color: ${props => props.color || '#22c55e'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-bottom: 1.25rem;
`;

const ProcessTitle = styled.h3`
  font-size: 1.4rem;
  font-weight: 700;
  color: #1a365d;
  margin-bottom: 0.75rem;
`;

const ProcessText = styled.p`
  font-size: 1.05rem;
  color: #475569;
  line-height: 1.6;
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 1rem 0 0;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: flex-start;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
  color: #475569;
  
  &:before {
    content: '✓';
    min-width: 20px;
    margin-right: 0.5rem;
    color: ${props => props.color || '#22c55e'};
    font-weight: bold;
  }
`;

const OurProcess = () => {
  const process = [
    {
      step: 1,
      icon: <FaSearch />,
      title: "Profile & Discovery",
      description: "We analyze your startup's profile and investment needs to understand your unique value proposition and funding requirements.",
      color: "#22c55e",
      bgColor: "rgba(34, 197, 94, 0.1)",
      features: [
        "Detailed startup profile creation",
        "Investment needs assessment",
        "Market positioning analysis"
      ]
    },
    {
      step: 2,
      icon: <FaHandshake />,
      title: "Investor Matching",
      description: "Our algorithm identifies and connects you with investors whose investment thesis aligns with your sector, stage, and requirements.",
      color: "#3b82f6",
      bgColor: "rgba(59, 130, 246, 0.1)",
      features: [
        "AI-powered matching algorithm",
        "Investor preference alignment",
        "Strategic fit evaluation"
      ]
    },
    {
      step: 3,
      icon: <FaFileContract />,
      title: "Connection Facilitation",
      description: "We facilitate qualified introductions and provide guidance through the initial contact and pitch process.",
      color: "#8b5cf6",
      bgColor: "rgba(139, 92, 246, 0.1)",
      features: [
        "Warm introduction support",
        "Pitch preparation assistance",
        "Follow-up coordination"
      ]
    },
    {
      step: 4,
      icon: <FaRocket />,
      title: "Ongoing Support",
      description: "We continue to support both parties through the investment process, providing resources and guidance as needed.",
      color: "#f59e0b",
      bgColor: "rgba(245, 158, 11, 0.1)",
      features: [
        "Due diligence guidance",
        "Term sheet advisory",
        "Relationship management"
      ]
    }
  ];

  return (
    <Section>
      <BackgroundPattern />
      <Container>
        <Header>
          <Title>The Connection Process</Title>
          <Description>
            Our <strong>streamlined process</strong> connects promising startups with the right investors through a systematic approach designed to create strategic alignments.
          </Description>
        </Header>
        
        <ProcessGrid>
          {process.map((item, index) => (
            <ProcessCard
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <StepNumber bg={item.color}>{item.step}</StepNumber>
              <IconContainer bg={item.bgColor} color={item.color}>
                {item.icon}
              </IconContainer>
              <ProcessTitle>{item.title}</ProcessTitle>
              <ProcessText>{item.description}</ProcessText>
              <FeatureList>
                {item.features.map((feature, i) => (
                  <FeatureItem key={i} color={item.color}>{feature}</FeatureItem>
                ))}
              </FeatureList>
            </ProcessCard>
          ))}
        </ProcessGrid>
      </Container>
    </Section>
  );
};

export default OurProcess; 