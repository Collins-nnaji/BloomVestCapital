import React from 'react';
import styled from 'styled-components';
import { FaArrowRight, FaLock, FaChartLine, FaRegLightbulb, FaCheckCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Section = styled.section`
  background: linear-gradient(135deg, #1a365d 0%, #0f172a 100%);
  padding: 120px 0;
  position: relative;
  overflow: hidden;
  color: white;
`;

const BackgroundAnimation = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    width: 300%;
    height: 300%;
    top: -100%;
    left: -100%;
    background: radial-gradient(rgba(59, 130, 246, 0.15) 2px, transparent 2px);
    background-size: 50px 50px;
    animation: moveGridBackground 60s linear infinite;
  }
  
  @keyframes moveGridBackground {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const BackgroundGlow = styled.div`
  position: absolute;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.2;
  
  &.green {
    background: rgba(34, 197, 94, 0.5);
    top: -100px;
    right: -100px;
  }
  
  &.blue {
    background: rgba(59, 130, 246, 0.5);
    bottom: -100px;
    left: -100px;
  }
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4rem;
  
  @media (max-width: 1024px) {
    flex-direction: column;
    text-align: center;
  }
`;

const Grid = styled.div`
  display: flex;
  gap: 2rem;
  
  @media (max-width: 1024px) {
    flex-direction: column;
  }
`;

const ContentColumn = styled.div`
  flex: 1;
  max-width: 600px;
  
  @media (max-width: 1024px) {
    max-width: 100%;
  }
`;

const Heading = styled(motion.h2)`
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  line-height: 1.2;
  background: linear-gradient(to right, #ffffff, #22c55e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subheading = styled(motion.p)`
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 2.5rem;
  line-height: 1.7;
`;

const Description = styled(motion.p)`
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 2rem;
  font-size: 1.1rem;
`;

const FeaturesList = styled(motion.ul)`
  list-style: none;
  padding: 0;
  margin-bottom: 3rem;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.25rem;
  
  @media (max-width: 1024px) {
    justify-content: center;
  }
`;

const FeatureIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(34, 197, 94, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: #22c55e;
  flex-shrink: 0;
`;

const Button = styled(motion.a)`
  background: ${props => props.secondary ? 'transparent' : '#22c55e'};
  color: ${props => props.secondary ? 'white' : 'white'};
  font-weight: 600;
  padding: 1.25rem 2.5rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.3s ease;
  cursor: pointer;
  text-decoration: none;
  font-size: 1.125rem;
  border: ${props => props.secondary ? '2px solid rgba(255, 255, 255, 0.3)' : 'none'};
  box-shadow: ${props => props.secondary ? 'none' : '0 10px 25px rgba(34, 197, 94, 0.4)'};
  
  &:hover {
    transform: ${props => props.secondary ? 'translateY(-5px)' : 'translateY(-5px)'};
    ${props => props.secondary ? 'border-color: white' : 'background: ' + (props.secondary ? 'rgba(255, 255, 255, 0.1)' : '#16a34a')};
    ${props => props.secondary ? 'box-shadow: none' : 'box-shadow: 0 15px 30px rgba(34, 197, 94, 0.5)'};
  }
  
  @media (max-width: 640px) {
    width: 100%;
    justify-content: center;
  }
`;

const CallToAction = () => {
  return (
    <Section>
      <BackgroundAnimation />
      <BackgroundGlow className="green" />
      <BackgroundGlow className="blue" />
      
      <Container>
        <Grid>
          <ContentColumn>
            <Heading
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              For Investors
            </Heading>
            
            <Subheading
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Access Curated Early-Stage Opportunities
            </Subheading>
            
            <Description
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              Join our exclusive investor network to access carefully vetted startup opportunities with exceptional growth potential. Benefit from our rigorous due diligence process, deal structuring expertise, and comprehensive portfolio support.
            </Description>
            
            <FeaturesList
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <FeatureItem>
                <FeatureIcon>
                  <FaCheckCircle />
                </FeatureIcon>
                <span>Curated deal flow of high-potential startups</span>
              </FeatureItem>
              <FeatureItem>
                <FeatureIcon>
                  <FaCheckCircle />
                </FeatureIcon>
                <span>Comprehensive due diligence materials</span>
              </FeatureItem>
              <FeatureItem>
                <FeatureIcon>
                  <FaCheckCircle />
                </FeatureIcon>
                <span>Co-investment opportunities with leading VCs</span>
              </FeatureItem>
            </FeaturesList>
            
            <Button
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
              href="https://linkedin.com/company/bloomvest-finance"
              target="_blank"
              rel="noopener noreferrer"
            >
              Join Investor Network <FaArrowRight />
            </Button>
          </ContentColumn>
          
          <ContentColumn>
            <Heading
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              For Startups
            </Heading>
            
            <Subheading
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Fuel Your Growth With Strategic Capital
            </Subheading>
            
            <Description
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              We provide more than just capital. BloomVest partners with exceptional founders, offering strategic guidance, operational support, and valuable connections to help transform innovative ideas into category-defining companies.
            </Description>
            
            <FeaturesList
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <FeatureItem>
                <FeatureIcon>
                  <FaCheckCircle />
                </FeatureIcon>
                <span>Seed and Series A investments ($250K-$3M)</span>
              </FeatureItem>
              <FeatureItem>
                <FeatureIcon>
                  <FaCheckCircle />
                </FeatureIcon>
                <span>Access to our extensive industry network</span>
              </FeatureItem>
              <FeatureItem>
                <FeatureIcon>
                  <FaCheckCircle />
                </FeatureIcon>
                <span>Hands-on growth acceleration support</span>
              </FeatureItem>
            </FeaturesList>
            
            <Button
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
              to="/apply-for-funding"
              secondary
            >
              Apply For Funding <FaArrowRight />
            </Button>
          </ContentColumn>
        </Grid>
      </Container>
    </Section>
  );
};

export default CallToAction; 