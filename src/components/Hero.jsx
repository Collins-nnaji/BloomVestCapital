import React from 'react';
import styled from 'styled-components';
import { FaArrowRight, FaCheckCircle, FaRobot, FaUserTie} from 'react-icons/fa';

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
    rgba(26, 54, 93, 0.97) 0%,
    rgba(26, 54, 93, 0.87) 100%
  );
  z-index: 2;
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 3;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: 1024px) {
    flex-direction: column;
    gap: 3rem;
  }
`;

const HeroContent = styled.div`
  max-width: 650px;
  color: #FFFFFF;
  animation: fadeIn 1s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @media (max-width: 1024px) {
    text-align: center;
    align-items: center;
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
  
  @media (max-width: 1024px) {
    justify-content: center;
    
    &:before {
      display: none;
    }
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
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.9);
`;

const HybridContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 2.5rem;
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const HybridBox = styled.div`
  flex: 1;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid ${props => props.aiBox ? 'rgba(34, 197, 94, 0.3)' : 'rgba(255, 255, 255, 0.1)'};
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.08);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  }
`;

const HybridTitle = styled.h3`
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  color: ${props => props.aiTitle ? '#22c55e' : 'white'};
  
  svg {
    font-size: 1.5rem;
  }
`;

const HybridList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const HybridItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  font-size: 1rem;
  
  svg {
    color: #22c55e;
    flex-shrink: 0;
    margin-top: 0.25rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-top: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    align-items: center;
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
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
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
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const HeroFormCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2.5rem;
  width: 450px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.1);
  animation: fadeIn 1.2s ease-out 0.3s forwards;
  opacity: 0;
  
  @media (max-width: 768px) {
    width: 100%;
    padding: 2rem;
  }
`;

const FormTitle = styled.h3`
  color: white;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const SwitchContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 0.5rem;
  position: relative;
`;

const SwitchOption = styled.button`
  flex: 1;
  padding: 0.75rem 1rem;
  border: none;
  background: ${props => props.active ? 'rgba(34, 197, 94, 0.8)' : 'transparent'};
  color: white;
  font-weight: ${props => props.active ? '600' : '400'};
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 1;
  
  &:hover {
    background: ${props => props.active ? 'rgba(34, 197, 94, 0.8)' : 'rgba(255, 255, 255, 0.05)'};
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
  
  &:focus {
    outline: none;
    border-color: #22c55e;
    background: rgba(255, 255, 255, 0.15);
  }
`;

const FormSelect = styled.select`
  width: 100%;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
  font-size: 1rem;
  transition: all 0.3s ease;
  appearance: none;
  
  &:focus {
    outline: none;
    border-color: #22c55e;
    background: rgba(255, 255, 255, 0.15);
  }
  
  option {
    background: #1a365d;
    color: white;
  }
`;

const FormButton = styled.button`
  width: 100%;
  background: #22c55e;
  color: white;
  padding: 1.25rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1.125rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.75rem;
  
  &:hover {
    background: #1a945e;
  }
`;

const FormDisclaimer = styled.p`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.8rem;
  text-align: center;
  margin-top: 1rem;
`;

const Hero = () => {
  const [selectedOption, setSelectedOption] = React.useState('hybrid');
  
  return (
    <HeroSection>
      <VideoBackground autoPlay muted loop playsInline>
        <source src="/video2.mp4" type="video/mp4" />
      </VideoBackground>
      <Overlay />
      <ContentWrapper>
        <HeroContent>
          <Overline>BloomVest Finance</Overline>
          <HeroHeading>Hybrid Financial Advisory</HeroHeading>
          <HeroSubtitle>
            Leverage the perfect blend of human expertise and cutting-edge AI technology to navigate your financial 
            journey with personalized advisory, education, and actionable insights.
          </HeroSubtitle>
          
          <HybridContainer>
            <HybridBox>
              <HybridTitle>
                <FaUserTie /> Human Expertise
              </HybridTitle>
              <HybridList>
                <HybridItem>
                  <FaCheckCircle />
                  <span>Personalized financial strategy sessions</span>
                </HybridItem>
                <HybridItem>
                  <FaCheckCircle />
                  <span>Nuanced market insights from experts</span>
                </HybridItem>
                <HybridItem>
                  <FaCheckCircle />
                  <span>Complex decision support & guidance</span>
                </HybridItem>
              </HybridList>
            </HybridBox>
            
            <HybridBox aiBox>
              <HybridTitle aiTitle>
                <FaRobot /> AI-Powered Tools
              </HybridTitle>
              <HybridList>
                <HybridItem>
                  <FaCheckCircle />
                  <span>Real-time data analysis & insights</span>
                </HybridItem>
                <HybridItem>
                  <FaCheckCircle />
                  <span>Automated portfolio monitoring</span>
                </HybridItem>
                <HybridItem>
                  <FaCheckCircle />
                  <span>Smart financial goals tracking</span>
                </HybridItem>
              </HybridList>
            </HybridBox>
          </HybridContainer>
          
          <ButtonGroup>
            <PrimaryButton>
              Start Free Assessment <FaArrowRight />
            </PrimaryButton>
            <SecondaryButton>Explore Hybrid Services</SecondaryButton>
          </ButtonGroup>
        </HeroContent>
        
        <HeroFormCard>
          <FormTitle>BloomVest Finance Consultation</FormTitle>
          
          <SwitchContainer>
            <SwitchOption 
              active={selectedOption === 'hybrid'}
              onClick={() => setSelectedOption('hybrid')}
            >
              Hybrid Advisory
            </SwitchOption>
            <SwitchOption 
              active={selectedOption === 'ai'}
              onClick={() => setSelectedOption('ai')}
            >
              AI Only
            </SwitchOption>
          </SwitchContainer>
          
          <FormGroup>
            <FormInput type="text" placeholder="Your Full Name" />
          </FormGroup>
          <FormGroup>
            <FormInput type="email" placeholder="Email Address" />
          </FormGroup>
          <FormGroup>
            <FormInput type="tel" placeholder="Phone Number" />
          </FormGroup>
          <FormGroup>
            <FormSelect>
              <option value="">Select Your Primary Goal</option>
              <option value="wealth-building">Wealth Building</option>
              <option value="retirement">Retirement Planning</option>
              <option value="property">Property Investment</option>
              <option value="education">Financial Education</option>
              <option value="risk-management">Risk Management</option>
            </FormSelect>
          </FormGroup>
          <FormButton>
            {selectedOption === 'hybrid' ? 'Schedule Strategy Session' : 'Get AI Analysis'} <FaArrowRight />
          </FormButton>
          <FormDisclaimer>
            We respect your privacy. Your information will never be shared.
          </FormDisclaimer>
        </HeroFormCard>
      </ContentWrapper>
    </HeroSection>
  );
};

export default Hero;