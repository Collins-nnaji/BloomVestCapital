import React from 'react';
import styled from 'styled-components';
import { 
  FaUserShield, 
  FaHandshake, 
  FaGlobeAfrica,
  FaChartLine,
  FaNetworkWired
} from 'react-icons/fa';
import { motion } from 'framer-motion';

const Section = styled.section`
  padding: 5rem 0;
  position: relative;
  overflow: hidden;
  background: linear-gradient(170deg, #f8fafc 0%, #eff6ff 100%);
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(to right, #22c55e, #15803d);
  }
  
  @media (max-width: 768px) {
    padding: 4rem 0;
  }
`;

const BackgroundPattern = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    linear-gradient(rgba(255, 255, 255, 0.8) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.8) 1px, transparent 1px);
  background-size: 50px 50px;
  opacity: 0.2;
  z-index: 0;
`;

const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1.5rem;
  position: relative;
  z-index: 1;
  
  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`;

const Heading = styled.h2`
  text-align: center;
  font-size: 2.8rem;
  font-weight: 800;
  margin-bottom: 1rem;
  color: #1a365d;
  line-height: 1.1;
  position: relative;
  display: inline-block;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 4px;
    background: linear-gradient(to right, #22c55e, rgba(34, 197, 94, 0.2));
    border-radius: 4px;
  }
  
  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
`;

const Description = styled.p`
  text-align: center;
  font-size: 1.2rem;
  line-height: 1.7;
  color: #475569;
  max-width: 800px;
  margin: 2rem auto 3rem;
  
  strong {
    font-weight: 600;
    color: #1a365d;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const Card = styled(motion.div)`
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
  }
`;

const CardHeader = styled.div`
  padding: 1.75rem 1.75rem 1rem;
  display: flex;
  align-items: center;
`;

const IconContainer = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1.25rem;
  background: ${props => `rgba(${props.color}, 0.15)`};
  
  svg {
    font-size: 1.75rem;
    color: ${props => `rgb(${props.color})`};
  }
`;

const CardTitle = styled.h3`
  font-size: 1.4rem;
  font-weight: 700;
  color: #1a365d;
  margin: 0;
`;

const CardBody = styled.div`
  padding: 0 1.75rem 1.75rem;
  flex: 1;
`;

const CardText = styled.p`
  font-size: 1.05rem;
  line-height: 1.6;
  color: #475569;
  margin-bottom: 0.5rem;
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 1.25rem 0 0;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: flex-start;
  margin-bottom: 0.75rem;
  font-size: 1rem;
  color: #475569;
  
  &:before {
    content: '✓';
    min-width: 20px;
    margin-right: 0.5rem;
    color: #22c55e;
    font-weight: bold;
  }
`;

const HeaderWrapper = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const WhyChooseUs = () => {
  const reasons = [
    {
      icon: <FaNetworkWired />,
      title: "Extensive Network",
      color: "34, 197, 94",
      description: "Access our extensive network of pre-vetted investors who are actively seeking opportunities across various industries and funding stages.",
      features: [
        "Connections to 320+ active investors",
        "Industry-specific investor matching",
        "Funding stage compatibility"
      ]
    },
    {
      icon: <FaHandshake />,
      title: "Strategic Guidance",
      color: "59, 130, 246",
      description: "Receive personalized guidance to optimize your investor outreach strategy and maximize chances of securing the right investment partner.",
      features: [
        "Pitch deck optimization",
        "Investor approach strategy",
        "Term sheet negotiation support"
      ]
    },
    {
      icon: <FaChartLine />,
      title: "Data-Driven Matching",
      color: "139, 92, 246",
      description: "Our proprietary algorithm matches startups with investors based on investment thesis alignment, ensuring more meaningful connections.",
      features: [
        "Data-backed compatibility analysis",
        "Investor preference mapping",
        "Strategic fit assessment"
      ]
    }
  ];

  return (
    <Section>
      <BackgroundPattern />
      <Container>
        <HeaderWrapper>
          <Heading>Why Choose BloomVest</Heading>
          <Description>
            We help <strong>connect promising startups with the right investors</strong> through our proprietary matching platform, extensive network, and expert guidance.
          </Description>
        </HeaderWrapper>
        
        <Grid>
          {reasons.map((reason, index) => (
            <Card
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <CardHeader>
                <IconContainer color={reason.color}>
                  {reason.icon}
                </IconContainer>
                <CardTitle>{reason.title}</CardTitle>
              </CardHeader>
              <CardBody>
                <CardText>{reason.description}</CardText>
                <FeatureList>
                  {reason.features.map((feature, i) => (
                    <FeatureItem key={i}>{feature}</FeatureItem>
                  ))}
                </FeatureList>
              </CardBody>
            </Card>
          ))}
        </Grid>
      </Container>
    </Section>
  );
};

export default WhyChooseUs;