import React from 'react';
import styled from 'styled-components';
import { 
  FaChartPie, 
  FaLightbulb, 
  FaChartLine, 
  FaShieldAlt, 
  FaArrowRight, 
  FaRegComments,
  FaRegClock,
  FaRegFileAlt,
  FaUserTie,
  FaRegChartBar,
  FaMobile
} from 'react-icons/fa';

const Section = styled.section`
  padding: 120px 0;
  background: #ffffff;
  position: relative;
  overflow: hidden;
`;

const BackgroundPattern = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: linear-gradient(rgba(34, 197, 94, 0.03) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(34, 197, 94, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
  z-index: 0;
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
  margin: 0 auto 80px;
`;

const Preheading = styled.div`
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--accent-color);
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 2px;
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

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2.5rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled.div`
  background: ${props => props.theme.colors.cardBg};
  border-radius: 16px;
  padding: 2.5rem;
  box-shadow: ${props => props.theme.shadows.lg};
  border: 1px solid ${props => props.theme.colors.border};
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.07);
  }
  
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: var(--accent-color);
    border-radius: 16px 16px 0 0;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s ease;
  }
  
  &:hover:after {
    transform: scaleX(1);
  }
`;

const FeatureIcon = styled.div`
  width: 60px;
  height: 60px;
  background: rgba(34, 197, 94, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  color: var(--accent-color);
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;
  
  ${FeatureCard}:hover & {
    background: var(--accent-color);
    color: white;
    transform: rotate(5deg);
  }
`;

const FeatureTitle = styled.h3`
  font-size: 1.4rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
  font-weight: 600;
`;

const FeatureDescription = styled.p`
  color: var(--text-secondary);
  font-size: 1rem;
  line-height: 1.7;
  margin-bottom: 1.5rem;
`;

const FeatureList = styled.ul`
  padding-left: 1.5rem;
  margin-bottom: 1.5rem;
`;

const FeatureListItem = styled.li`
  color: #1a365d;
  margin-bottom: 0.75rem;
  font-size: 0.95rem;
  position: relative;
  
  &:before {
    content: '✓';
    color: #22c55e;
    position: absolute;
    left: -1.5rem;
  }
`;

const UseCaseBox = styled.div`
  background: rgba(34, 197, 94, 0.05);
  border-radius: 8px;
  padding: 1.25rem;
  margin-top: 1.5rem;
  border-left: 3px solid #22c55e;
`;

const UseCaseTitle = styled.h4`
  font-size: 1rem;
  color: #1a365d;
  margin-bottom: 0.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  svg {
    color: #22c55e;
  }
`;

const UseCaseText = styled.p`
  color: #64748b;
  font-size: 0.95rem;
  line-height: 1.6;
`;

const CtaContainer = styled.div`
  margin-top: 80px;
  text-align: center;
`;

const CtaText = styled.p`
  font-size: 1.25rem;
  color: #1a365d;
  margin-bottom: 2rem;
  font-weight: 500;
`;

const CtaButton = styled.button`
  background: #22c55e;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 1rem 2rem;
  font-weight: 600;
  font-size: 1.125rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  
  &:hover {
    background: #1a945e;
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(34, 197, 94, 0.15);
  }
`;

const AIFeatures = () => {
  const features = [
    {
      icon: <FaChartPie />,
      title: "5-Minute Risk Assessment",
      description: "Discover your investment personality and risk tolerance through our comprehensive quiz.",
      list: [
        "Analyzes your financial goals and timeframes",
        "Evaluates comfort with market volatility",
        "Considers your income stability and debt",
        "Creates a personalized risk profile"
      ],
      useCase: {
        icon: <FaRegComments />,
        title: "Real User Example",
        text: "\"I was labeled a 'Growth-Focused Builder' and learned I could take more calculated risks with my long-term investments.\""
      }
    },
    {
      icon: <FaLightbulb />,
      title: "Portfolio Simulator",
      description: "Visualize potential outcomes of different investment strategies based on historical data.",
      list: [
        "Tests hypothetical investment mixes",
        "Shows 5-year growth projections",
        "Highlights volatility and risk factors",
        "Compares against inflation benchmarks"
      ],
      useCase: {
        icon: <FaRegClock />,
        title: "Time-Saving",
        text: "Analyze dozens of investment combinations in minutes instead of spending hours on manual research."
      }
    },
    {
      icon: <FaChartLine />,
      title: "Financial Health Score",
      description: "Get a comprehensive assessment of your current financial standing with actionable insights.",
      list: [
        "Evaluates savings rate and emergency fund",
        "Analyzes debt-to-income ratio",
        "Assesses retirement readiness",
        "Provides specific improvement steps"
      ],
      useCase: {
        icon: <FaRegFileAlt />,
        title: "Improvement Tracking",
        text: "Retake the assessment quarterly to track your progress and adjust your financial strategies."
      }
    },
    {
      icon: <FaShieldAlt />,
      title: "Nigerian Market Navigator",
      description: "Gain insights specific to the Nigerian investment landscape and economic conditions.",
      list: [
        "Highlights trending local assets",
        "Explains current market conditions",
        "Identifies inflation hedging options",
        "Provides regulatory updates"
      ],
      useCase: {
        icon: <FaUserTie />,
        title: "Local Expertise",
        text: "Get the same quality of market analysis that typically requires expensive local consultants."
      }
    },
    {
      icon: <FaRegChartBar />,
      title: "Goal-Based Roadmaps",
      description: "Receive customized financial roadmaps tailored to your specific life goals and timeline.",
      list: [
        "Creates milestone-based plans",
        "Suggests saving and investment targets",
        "Adjusts for economic conditions",
        "Provides progress checkpoints"
      ],
      useCase: {
        icon: <FaLightbulb />,
        title: "Strategic Planning",
        text: "A user planning to buy land in 3 years received a step-by-step saving and investment strategy to reach their target."
      }
    },
    {
      icon: <FaMobile />,
      title: "AI Advisory Chat",
      description: "Get instant answers to your financial questions through our AI-powered conversational assistant.",
      list: [
        "Answers investment questions 24/7",
        "Explains complex financial concepts",
        "Provides relevant educational resources",
        "Suggests appropriate advisory services"
      ],
      useCase: {
        icon: <FaRegComments />,
        title: "Always Available",
        text: "Get immediate guidance on financial decisions anytime, with human advisor follow-up for complex situations."
      }
    }
  ];

  return (
    <Section id="ai-features">
      <BackgroundPattern />
      <Container>
        <SectionHeader>
          <Preheading>AI-POWERED INSIGHTS</Preheading>
          <Title>How Our Smart Technology Guides You</Title>
          <Subtitle>
            Our AI tools combine advanced analytics with Nigerian financial expertise to provide
            personalized insights that would typically require hours of consultation.
          </Subtitle>
        </SectionHeader>
        
        <FeaturesGrid>
          {features.map((feature, index) => (
            <FeatureCard key={index}>
              <FeatureIcon>{feature.icon}</FeatureIcon>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDescription>{feature.description}</FeatureDescription>
              <FeatureList>
                {feature.list.map((item, i) => (
                  <FeatureListItem key={i}>{item}</FeatureListItem>
                ))}
              </FeatureList>
              <UseCaseBox>
                <UseCaseTitle>
                  {feature.useCase.icon} {feature.useCase.title}
                </UseCaseTitle>
                <UseCaseText>{feature.useCase.text}</UseCaseText>
              </UseCaseBox>
            </FeatureCard>
          ))}
        </FeaturesGrid>
        
        <CtaContainer>
          <CtaText>
            Experience the power of AI-driven financial guidance tailored to your unique situation.
          </CtaText>
          <CtaButton>
            Try BloomVest AI Tool Now <FaArrowRight />
          </CtaButton>
        </CtaContainer>
      </Container>
    </Section>
  );
};

export default AIFeatures;