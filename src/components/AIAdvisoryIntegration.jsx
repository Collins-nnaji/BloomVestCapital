import React from 'react';
import styled from 'styled-components';
import { 
  FaRobot, 
  FaUserTie, 
  FaLaptop, 
  FaHandshake, 
  FaMobileAlt, 
  FaChartLine,
  FaArrowRight
} from 'react-icons/fa';

const Section = styled.section`
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  padding: 120px 0;
  position: relative;
  overflow: hidden;
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

const IntegrationBox = styled.div`
  background: white;
  border-radius: 20px;
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  margin-bottom: 60px;
`;

const IntegrationHeader = styled.div`
  background: #1a365d;
  color: white;
  padding: 2.5rem;
  text-align: center;
`;

const IntegrationTitle = styled.h3`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const IntegrationSubtitle = styled.p`
  font-size: 1.1rem;
  opacity: 0.9;
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.7;
`;

const StepsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  
  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const Column = styled.div`
  padding: 3rem;
  
  &:first-child {
    border-right: 1px solid rgba(0, 0, 0, 0.05);
  }
  
  @media (max-width: 968px) {
    &:first-child {
      border-right: none;
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    }
  }
  
  @media (max-width: 768px) {
    padding: 2rem;
  }
`;

const ColumnTitle = styled.h4`
  font-size: 1.5rem;
  color: #1a365d;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  svg {
    color: #22c55e;
  }
`;

const Steps = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Step = styled.div`
  display: flex;
  gap: 1.25rem;
`;

const StepNumber = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.$ai ? 'rgba(34, 197, 94, 0.1)' : 'rgba(26, 54, 93, 0.1)'};
  color: ${props => props.$ai ? '#22c55e' : '#1a365d'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  flex-shrink: 0;
`;

const StepContent = styled.div``;

const StepTitle = styled.h5`
  font-size: 1.1rem;
  color: #1a365d;
  margin-bottom: 0.5rem;
  font-weight: 600;
`;

const StepDescription = styled.p`
  color: #64748b;
  font-size: 0.95rem;
  line-height: 1.6;
`;

const StepTimeframe = styled.div`
  display: inline-block;
  background: ${props => props.$ai ? 'rgba(34, 197, 94, 0.1)' : 'rgba(26, 54, 93, 0.1)'};
  color: ${props => props.$ai ? '#22c55e' : '#1a365d'};
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  margin-top: 0.5rem;
  font-weight: 500;
`;

const BenefitsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-top: 60px;
  
  @media (max-width: 968px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const BenefitCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.05);
  height: 100%;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.08);
  }
`;

const BenefitIcon = styled.div`
  width: 60px;
  height: 60px;
  background: rgba(34, 197, 94, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  color: #22c55e;
  margin-bottom: 1.5rem;
`;

const BenefitTitle = styled.h4`
  font-size: 1.3rem;
  color: #1a365d;
  margin-bottom: 1rem;
  font-weight: 600;
`;

const BenefitDescription = styled.p`
  color: #64748b;
  font-size: 1rem;
  line-height: 1.7;
`;

const CtaContainer = styled.div`
  margin-top: 80px;
  background: #1a365d;
  border-radius: 16px;
  padding: 3rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: 968px) {
    flex-direction: column;
    text-align: center;
    gap: 2rem;
    padding: 2rem;
  }
`;

const CtaText = styled.div`
  color: white;
  
  h3 {
    font-size: 1.75rem;
    margin-bottom: 0.75rem;
  }
  
  p {
    font-size: 1.1rem;
    color: rgba(255, 255, 255, 0.9);
    max-width: 600px;
  }
`;

const CtaButtons = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
  }
`;

const CtaButton = styled.button`
  background: #22c55e;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 1.25rem 2rem;
  font-weight: 600;
  font-size: 1.125rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  &:hover {
    background: #1a945e;
    transform: translateY(-3px);
  }
  
  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const CtaSecondaryButton = styled.button`
  background: transparent;
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  padding: 1.25rem 2rem;
  font-weight: 600;
  font-size: 1.125rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: white;
    transform: translateY(-3px);
  }
  
  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const AIAdvisoryIntegration = () => {
  const aiSteps = [
    {
      number: "1",
      title: "Free AI Assessment",
      description: "Complete the 5-minute questionnaire to get your financial health score and risk profile.",
      timeframe: "5 minutes"
    },
    {
      number: "2",
      title: "Review AI Recommendations",
      description: "Receive personalized investment strategy suggestions and improvement opportunities.",
      timeframe: "Instant"
    },
    {
      number: "3",
      title: "AI Portfolio Simulation",
      description: "Explore potential investment options through our advanced simulation engine.",
      timeframe: "10 minutes"
    },
    {
      number: "4",
      title: "Book Consultation if Needed",
      description: "Use the AI recommendation to schedule a focused session with a human advisor.",
      timeframe: "2 minutes"
    }
  ];
  
  const humanSteps = [
    {
      number: "1",
      title: "Personalized Consultation",
      description: "Meet with an advisor who already has your AI assessment results for deeper analysis.",
      timeframe: "45 minutes"
    },
    {
      number: "2",
      title: "Expert Strategy Development",
      description: "Receive a customized financial plan that builds on the AI insights with human expertise.",
      timeframe: "3-5 days"
    },
    {
      number: "3",
      title: "Implementation Guidance",
      description: "Get step-by-step support for executing your financial strategy with confidence.",
      timeframe: "Ongoing"
    },
    {
      number: "4",
      title: "Regular Progress Reviews",
      description: "Combine AI monitoring with human oversight to keep your financial plan on track.",
      timeframe: "Quarterly"
    }
  ];
  
  const benefits = [
    {
      icon: <FaLaptop />,
      title: "Save Time & Money",
      description: "Get instant AI insights for free, then invest in human advice only when you need deeper guidance."
    },
    {
      icon: <FaHandshake />,
      title: "Perfect Synergy",
      description: "AI handles data analysis and initial recommendations while human advisors provide nuance and emotional intelligence."
    },
    {
      icon: <FaMobileAlt />,
      title: "24/7 Accessibility",
      description: "Access AI guidance anytime, anywhere, with human experts available during business hours."
    },
    {
      icon: <FaRobot />,
      title: "Personalized Learning",
      description: "AI tailors educational content to your specific knowledge gaps and financial situation."
    },
    {
      icon: <FaUserTie />,
      title: "Judgment & Empathy",
      description: "Human advisors provide emotional support and complex decision-making during major life changes."
    },
    {
      icon: <FaChartLine />,
      title: "Continuous Improvement",
      description: "Your experience improves over time as both the AI and your advisor learn more about your preferences."
    }
  ];

  return (
    <Section id="ai-human-integration">
      <Container>
        <SectionHeader>
          <Preheading>THE BEST OF BOTH WORLDS</Preheading>
          <Title>How AI & Human Expertise Work Together</Title>
          <Subtitle>
            We've created a seamless journey that combines the efficiency of AI technology with the 
            nuanced understanding and emotional intelligence of human financial advisors.
          </Subtitle>
        </SectionHeader>
        
        <IntegrationBox>
          <IntegrationHeader>
            <IntegrationTitle>Your Financial Journey</IntegrationTitle>
            <IntegrationSubtitle>
              From initial assessment to ongoing support, see how our AI tools complement 
              our human advisory services at every step.
            </IntegrationSubtitle>
          </IntegrationHeader>
          
          <StepsContainer>
            <Column>
              <ColumnTitle>
                <FaRobot /> AI-Powered Phase
              </ColumnTitle>
              <Steps>
                {aiSteps.map((step, index) => (
                  <Step key={index}>
                    <StepNumber $ai>{step.number}</StepNumber>
                    <StepContent>
                      <StepTitle>{step.title}</StepTitle>
                      <StepDescription>{step.description}</StepDescription>
                      <StepTimeframe $ai>{step.timeframe}</StepTimeframe>
                    </StepContent>
                  </Step>
                ))}
              </Steps>
            </Column>
            
            <Column>
              <ColumnTitle>
                <FaUserTie /> Human Advisory Phase
              </ColumnTitle>
              <Steps>
                {humanSteps.map((step, index) => (
                  <Step key={index}>
                    <StepNumber>{step.number}</StepNumber>
                    <StepContent>
                      <StepTitle>{step.title}</StepTitle>
                      <StepDescription>{step.description}</StepDescription>
                      <StepTimeframe>{step.timeframe}</StepTimeframe>
                    </StepContent>
                  </Step>
                ))}
              </Steps>
            </Column>
          </StepsContainer>
        </IntegrationBox>
        
        <BenefitsGrid>
          {benefits.map((benefit, index) => (
            <BenefitCard key={index}>
              <BenefitIcon>{benefit.icon}</BenefitIcon>
              <BenefitTitle>{benefit.title}</BenefitTitle>
              <BenefitDescription>{benefit.description}</BenefitDescription>
            </BenefitCard>
          ))}
        </BenefitsGrid>
        
        <CtaContainer>
          <CtaText>
            <h3>Ready to Experience the Future of Financial Advisory?</h3>
            <p>
              Start with our free AI assessment and discover how technology and human expertise 
              can transform your financial journey.
            </p>
          </CtaText>
          <CtaButtons>
            <CtaButton>
              Try Free AI Assessment <FaArrowRight />
            </CtaButton>
            <CtaSecondaryButton>
              Book Human Advisor <FaUserTie />
            </CtaSecondaryButton>
          </CtaButtons>
        </CtaContainer>
      </Container>
    </Section>
  );
};

export default AIAdvisoryIntegration;