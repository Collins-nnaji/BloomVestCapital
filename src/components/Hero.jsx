import React from 'react';
import styled from 'styled-components';
import { FaArrowRight } from 'react-icons/fa';


const HeroSection = styled.div`
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 120px 0 60px;
  overflow: hidden;
  background-color: #000;
`;

const VideoBackground = styled.video`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
  opacity: 0.7;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(26, 54, 93, 0.95) 0%,
    rgba(26, 54, 93, 0.85) 100%
  );
  z-index: 2;
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 3;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const HeroContent = styled.div`
  max-width: 800px;
  color: #FFFFFF;
  animation: fadeIn 1s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const Overline = styled.div`
  color: #22c55e;
  font-weight: 600;
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  display: flex;
  align-items: center;
  
  &:before {
    content: '';
    width: 50px;
    height: 2px;
    background: #22c55e;
    margin-right: 1rem;
  }
`;

const HeroHeading = styled.h1`
  font-size: 4.5rem;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  background: linear-gradient(to right, #ffffff, #22c55e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  
  @media (max-width: 768px) {
    font-size: 2.75rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.5rem;
  margin-bottom: 2.5rem;
  opacity: 0.9;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.9);
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-top: 3rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const PrimaryButton = styled.button`
  background: #22c55e;
  color: white;
  padding: 1.25rem 2.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1.125rem;
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(34, 197, 94, 0.3);

  &:hover {
    transform: translateY(-2px);
    background: #1a945e;
    box-shadow: 0 6px 25px rgba(34, 197, 94, 0.4);
  }
`;

const SecondaryButton = styled.button`
  background: transparent;
  color: white;
  padding: 1.25rem 2.5rem;
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-radius: 8px;
  font-weight: 600;
  font-size: 1.125rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: white;
    transform: translateY(-2px);
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 3rem;
  margin-top: 5rem;
  padding-top: 3rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);

  @media (max-width: 768px) {
    gap: 2rem;
  }
`;

const StatItem = styled.div`
  text-align: left;
  color: white;
`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #22c55e;
`;

const StatLabel = styled.div`
  font-size: 1rem;
  opacity: 0.8;
  font-weight: 500;
`;

const Hero = () => {
  return (
    <HeroSection>
      <VideoBackground autoPlay muted loop playsInline>
        <source src="/video2.mp4" type="video/mp4" />
      </VideoBackground>
      <Overlay />
      <ContentWrapper>
        <HeroContent>
          <Overline>Welcome to BloomVest Capital</Overline>
          <HeroHeading>Building Wealth Through Expert Guidance</HeroHeading>
          <HeroSubtitle>
            Unlock your financial potential with our comprehensive investment advisory, 
            property acquisition guidance, and professional financial education services.
          </HeroSubtitle>
          <ButtonGroup>
            <PrimaryButton>
              Start Investing Now <FaArrowRight />
            </PrimaryButton>
            <SecondaryButton>Explore Our Services</SecondaryButton>
          </ButtonGroup>
          
          <StatsGrid>
            <StatItem>
              <StatNumber>₦50B+</StatNumber>
              <StatLabel>Assets Under Management</StatLabel>
            </StatItem>
            <StatItem>
              <StatNumber>15,000+</StatNumber>
              <StatLabel>Satisfied Clients</StatLabel>
            </StatItem>
            <StatItem>
              <StatNumber>98%</StatNumber>
              <StatLabel>Client Retention Rate</StatLabel>
            </StatItem>
          </StatsGrid>
        </HeroContent>
      </ContentWrapper>
    </HeroSection>
  );
};

export default Hero;