import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  FaRobot, 

  FaPercent, 
  FaShieldAlt, 
  FaArrowRight, 

  FaRegLightbulb,
  FaRegChartBar
} from 'react-icons/fa';

const Section = styled.section`
  background: linear-gradient(135deg, var(--background), #f1f5f9);
  padding: 120px 0;
  position: relative;
  overflow: hidden;
`;

const BackgroundCircle = styled.div`
  position: absolute;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(34, 197, 94, 0.05) 0%, rgba(34, 197, 94, 0) 70%);
  top: -200px;
  left: -200px;
  z-index: 0;
`;

const BackgroundCircle2 = styled.div`
  position: absolute;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(26, 54, 93, 0.05) 0%, rgba(26, 54, 93, 0) 70%);
  bottom: -100px;
  right: -100px;
  z-index: 0;
`;

const Container = styled.div`
  max-width: 1400px;
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
  color: var(--accent-color);
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
`;

const Title = styled.h2`
  font-size: 2.75rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    font-size: 2.25rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: var(--text-secondary);
  line-height: 1.7;
`;

const ToolContainer = styled.div`
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  position: relative;
  border: 1px solid rgba(0, 0, 0, 0.05);
`;

const ToolGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  
  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const ToolInfo = styled.div`
  padding: 3.5rem;
  
  @media (max-width: 768px) {
    padding: 2rem;
  }
`;

const ToolTitle = styled.h3`
  font-size: 2rem;
  color: #1a365d;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  
  svg {
    color: #22c55e;
  }
  
  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`;

const ToolDescription = styled.p`
  font-size: 1.1rem;
  color: #64748b;
  line-height: 1.7;
  margin-bottom: 2rem;
`;

const FeaturesList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2.5rem;
  
  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureItem = styled.div`
  display: flex;
  gap: 1rem;
`;

const FeatureIcon = styled.div`
  width: 45px;
  height: 45px;
  border-radius: 10px;
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  flex-shrink: 0;
`;

const FeatureText = styled.div`
  h4 {
    color: #1a365d;
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
    font-weight: 600;
  }
  
  p {
    color: #64748b;
    font-size: 0.95rem;
    line-height: 1.5;
  }
`;

const ToolActions = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ToolButton = styled.button`
  background: #22c55e;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 1rem 1.5rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: #1a945e;
    transform: translateY(-2px);
  }
  
  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const SecondaryButton = styled.button`
  background: transparent;
  color: #1a365d;
  border: 2px solid #1a365d;
  border-radius: 8px;
  padding: 1rem 1.5rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(26, 54, 93, 0.05);
    transform: translateY(-2px);
  }
  
  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const ToolForm = styled.div`
  background: #1a365d;
  padding: 3.5rem;
  color: white;
  position: relative;
  overflow: hidden;
  
  @media (max-width: 768px) {
    padding: 2rem;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: -50px;
    right: -50px;
    width: 150px;
    height: 150px;
    border-radius: 50%;
    background: rgba(34, 197, 94, 0.2);
    z-index: 0;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -30px;
    left: -30px;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: rgba(34, 197, 94, 0.1);
    z-index: 0;
  }
`;

const FormTitle = styled.h3`
  font-size: 1.75rem;
  margin-bottom: 1.5rem;
  position: relative;
  z-index: 1;
`;

const FormSubtitle = styled.p`
  font-size: 1rem;
  opacity: 0.8;
  margin-bottom: 2rem;
  position: relative;
  z-index: 1;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  position: relative;
  z-index: 1;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
  opacity: 0.9;
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
    color: rgba(255, 255, 255, 0.5);
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

const FormRange = styled.input.attrs({ type: 'range' })`
  width: 100%;
  appearance: none;
  background: rgba(255, 255, 255, 0.2);
  height: 5px;
  border-radius: 5px;
  margin: 1rem 0;
  
  &::-webkit-slider-thumb {
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #22c55e;
    cursor: pointer;
  }
`;

const RangeLabels = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  opacity: 0.7;
`;

const SubmitButton = styled.button`
  width: 100%;
  background: #22c55e;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 1rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: #1a945e;
  }
`;

const Disclaimer = styled.p`
  font-size: 0.8rem;
  opacity: 0.7;
  margin-top: 1rem;
  text-align: center;
  position: relative;
  z-index: 1;
`;

const TestimonialSection = styled.div`
  margin-top: 80px;
`;

const TestimonialCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.05);
  margin: 0 auto;
  max-width: 800px;
  text-align: center;
`;

const TestimonialText = styled.blockquote`
  font-size: 1.25rem;
  color: #1a365d;
  font-style: italic;
  line-height: 1.7;
  margin-bottom: 1.5rem;
  position: relative;
  
  &::before, &::after {
    content: '"';
    font-size: 3rem;
    color: rgba(34, 197, 94, 0.2);
    position: absolute;
  }
  
  &::before {
    top: -1.5rem;
    left: -1rem;
  }
  
  &::after {
    bottom: -2.5rem;
    right: -1rem;
  }
`;

const TestimonialAuthor = styled.div`
  font-weight: 600;
  color: #1a365d;
`;

const TestimonialRole = styled.div`
  color: #64748b;
  font-size: 0.9rem;
  margin-top: 0.25rem;
`;

const AIToolSection = () => {
  const [sliderValue, setSliderValue] = useState(5);
  
  const handleSliderChange = (e) => {
    setSliderValue(e.target.value);
  };
  
  return (
    <Section id="ai-tool">
      <BackgroundCircle />
      <BackgroundCircle2 />
      <Container>
        <SectionHeader>
          <Preheading><FaRobot /> AI-POWERED FEATURE</Preheading>
          <Title>BloomVest Wealth Check</Title>
          <Subtitle>
            Our free AI-powered tool analyzes your financial situation and provides 
            personalized insights to help you make better investment decisions.
          </Subtitle>
        </SectionHeader>
        
        <ToolContainer>
          <ToolGrid>
            <ToolInfo>
              <ToolTitle>
                <FaRobot /> Financial Assessment Bot
              </ToolTitle>
              <ToolDescription>
                Get a comprehensive analysis of your financial health and personalized 
                recommendations in just 5 minutes - no commitment required.
              </ToolDescription>
              
              <FeaturesList>
                <FeatureItem>
                  <FeatureIcon>
                    <FaRegLightbulb />
                  </FeatureIcon>
                  <FeatureText>
                    <h4>Risk Profile Assessment</h4>
                    <p>Discover your investment personality and risk tolerance level</p>
                  </FeatureText>
                </FeatureItem>
                
                <FeatureItem>
                  <FeatureIcon>
                    <FaRegChartBar />
                  </FeatureIcon>
                  <FeatureText>
                    <h4>Portfolio Simulation</h4>
                    <p>See potential growth scenarios based on different investment mixes</p>
                  </FeatureText>
                </FeatureItem>
                
                <FeatureItem>
                  <FeatureIcon>
                    <FaPercent />
                  </FeatureIcon>
                  <FeatureText>
                    <h4>Financial Health Score</h4>
                    <p>Get your personalized score with actionable improvement tips</p>
                  </FeatureText>
                </FeatureItem>
                
                <FeatureItem>
                  <FeatureIcon>
                    <FaShieldAlt />
                  </FeatureIcon>
                  <FeatureText>
                    <h4>Nigerian Market Insights</h4>
                    <p>Gain contextual knowledge tailored to local market conditions</p>
                  </FeatureText>
                </FeatureItem>
              </FeaturesList>
              
              <ToolActions>
                <ToolButton>
                  Try It Now <FaArrowRight />
                </ToolButton>
                <SecondaryButton>
                  Learn More
                </SecondaryButton>
              </ToolActions>
            </ToolInfo>
            
            <ToolForm>
              <FormTitle>Start Your Free Assessment</FormTitle>
              <FormSubtitle>
                Fill out this quick form to get your personalized financial analysis.
              </FormSubtitle>
              
              <FormGroup>
                <FormLabel>What's your financial goal?</FormLabel>
                <FormSelect>
                  <option value="">Select your primary goal</option>
                  <option value="retirement">Retirement planning</option>
                  <option value="property">Property investment</option>
                  <option value="education">Children's education</option>
                  <option value="business">Starting a business</option>
                  <option value="wealth">General wealth building</option>
                </FormSelect>
              </FormGroup>
              
              <FormGroup>
                <FormLabel>Your monthly income (₦)</FormLabel>
                <FormInput type="number" placeholder="e.g. 250000" />
              </FormGroup>
              
              <FormGroup>
                <FormLabel>Risk Tolerance (1-10)</FormLabel>
                <FormRange 
                  min="1" 
                  max="10" 
                  value={sliderValue} 
                  onChange={handleSliderChange} 
                />
                <RangeLabels>
                  <span>Conservative</span>
                  <span>Balanced</span>
                  <span>Aggressive</span>
                </RangeLabels>
              </FormGroup>
              
              <FormGroup>
                <FormLabel>Email address</FormLabel>
                <FormInput type="email" placeholder="Where to send your results" />
              </FormGroup>
              
              <SubmitButton>
                Get My Analysis <FaArrowRight />
              </SubmitButton>
              
              <Disclaimer>
                Your data is secure and will never be shared with third parties.
              </Disclaimer>
            </ToolForm>
          </ToolGrid>
        </ToolContainer>
        
        <TestimonialSection>
          <TestimonialCard>
            <TestimonialText>
              The BloomVest AI tool gave me insights I never considered before. It showed me how to 
              rebalance my investments to better match my goals and risk tolerance. The financial health 
              score was eye-opening — and the best part is it took only 5 minutes!
            </TestimonialText>
            <TestimonialAuthor>Adebayo Johnson</TestimonialAuthor>
            <TestimonialRole>Business Owner, Lagos</TestimonialRole>
          </TestimonialCard>
        </TestimonialSection>
      </Container>
    </Section>
  );
};

export default AIToolSection;