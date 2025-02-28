import React from 'react';
import styled from 'styled-components';
import { 
  FaUserShield, 
  FaGraduationCap, 
  FaHandshake, 
  FaGlobeAfrica,
  FaRobot,

  FaLock
} from 'react-icons/fa';

const Section = styled.section`
  padding: 120px 0;
  background: #FFFFFF;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(to right, transparent, rgba(34, 197, 94, 0.2), transparent);
  }
`;

const BackgroundAccent = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 800px;
  height: 800px;
  background: radial-gradient(circle, rgba(34, 197, 94, 0.04) 0%, rgba(255, 255, 255, 0) 70%);
  border-radius: 50%;
  z-index: 0;
`;

const BackgroundAccent2 = styled.div`
  position: absolute;
  top: -150px;
  left: -150px;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(26, 54, 93, 0.03) 0%, rgba(255, 255, 255, 0) 70%);
  border-radius: 50%;
  z-index: 0;
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 1;
`;

const Header = styled.div`
  text-align: center;
  max-width: 800px;
  margin: 0 auto 80px;
`;

const Preheading = styled.div`
  font-size: 1.125rem;
  font-weight: 600;
  color: #22c55e;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  position: relative;
  display: inline-block;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 2px;
    background: #22c55e;
  }
`;

const Title = styled.h2`
  font-size: 3rem;
  font-weight: 700;
  color: #1a365d;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Description = styled.p`
  font-size: 1.25rem;
  color: #64748b;
  line-height: 1.7;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 3rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: #ffffff;
  border-radius: 20px;
  padding: 3rem;
  transition: all 0.4s ease;
  border: 1px solid rgba(34, 197, 94, 0.1);
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
    border-color: rgba(34, 197, 94, 0.3);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: linear-gradient(to bottom, #22c55e, transparent);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::before {
    opacity: 1;
  }
`;

const TopContent = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const IconWrapper = styled.div`
  width: 80px;
  height: 80px;
  background: ${props => props.gradient || 'linear-gradient(135deg, #22c55e, #4ade80)'};
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 2.25rem;
  color: white;
  box-shadow: 0 10px 20px rgba(34, 197, 94, 0.2);
  transition: all 0.3s ease;
  
  ${Card}:hover & {
    transform: scale(1.05);
  }
`;

const TitleArea = styled.div`
  flex: 1;
`;

const CardTitle = styled.h3`
  font-size: 1.75rem;
  color: #1a365d;
  margin-bottom: 0.5rem;
  font-weight: 600;
`;

const CardTagline = styled.div`
  color: #22c55e;
  font-size: 1rem;
  font-weight: 500;
`;

const CardDescription = styled.p`
  color: #64748b;
  font-size: 1.1rem;
  line-height: 1.7;
  margin-bottom: 2rem;
`;

const StatsList = styled.div`
  display: flex;
  gap: 2rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
  }
`;

const Stat = styled.div`
  text-align: left;
`;

const StatNumber = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #22c55e;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: #64748b;
  font-size: 0.9rem;
`;

const WhyChooseUs = () => {
  const reasons = [
    {
      icon: <FaUserShield />,
      gradient: 'linear-gradient(135deg, #1a365d, #3b82f6)',
      title: "Independent Expertise",
      tagline: "Unbiased human guidance",
      description: "Our advisors provide objective guidance with no hidden agendas or platform-specific incentives. We focus solely on what's best for your financial growth and long-term success.",
      stats: [
        { number: "15+", label: "Years Experience" },
        { number: "100%", label: "Independent Advice" }
      ]
    },
    {
      icon: <FaRobot />,
      gradient: 'linear-gradient(135deg, #22c55e, #4ade80)',
      title: "AI-Powered Insights",
      tagline: "Data-driven intelligence",
      description: "Our proprietary AI systems analyze vast amounts of market data to identify patterns and opportunities that human analysis alone might miss, giving you a competitive advantage.",
      stats: [
        { number: "24/7", label: "Market Monitoring" },
        { number: "95%", label: "Prediction Accuracy" }
      ]
    },
    {
      icon: <FaGlobeAfrica />,
      gradient: 'linear-gradient(135deg, #8b5cf6, #c084fc)',
      title: "Nigeria-Focused Strategy",
      tagline: "Local expertise, global perspective",
      description: "Our hybrid advisory services are specifically tailored to the Nigerian economic landscape, including local market conditions, regulations, and unique investment opportunities.",
      stats: [
        { number: "20+", label: "Years in Nigeria" },
        { number: "All 36", label: "States Covered" }
      ]
    },
    {
      icon: <FaGraduationCap />,
      gradient: 'linear-gradient(135deg, #f97316, #fb923c)',
      title: "Education-First Approach",
      tagline: "Empowerment through knowledge",
      description: "We believe in empowering you through knowledge. Our hybrid services include AI-assisted learning tools and expert-led workshops to build your financial decision-making skills.",
      stats: [
        { number: "5,000+", label: "Workshop Graduates" },
        { number: "200+", label: "Educational Resources" }
      ]
    },
    {
      icon: <FaLock />,
      gradient: 'linear-gradient(135deg, #64748b, #94a3b8)',
      title: "Data Security",
      tagline: "Your information, protected",
      description: "We employ enterprise-grade security measures to protect your financial data, with strict protocols for both our human advisors and AI systems to ensure complete confidentiality.",
      stats: [
        { number: "256-bit", label: "Encryption" },
        { number: "ISO 27001", label: "Compliance" }
      ]
    },
    {
      icon: <FaHandshake />,
      gradient: 'linear-gradient(135deg, #0891b2, #06b6d4)',
      title: "Hybrid Partnership",
      tagline: "The best of both worlds",
      description: "Experience the perfect blend of human relationship-building and AI efficiency. Our hybrid model gives you both the personal touch of human advisors and the precision of technology.",
      stats: [
        { number: "98%", label: "Client Retention" },
        { number: "4.9/5", label: "Client Satisfaction" }
      ]
    }
  ];

  return (
    <Section id="why">
      <BackgroundAccent />
      <BackgroundAccent2 />
      <Container>
        <Header>
          <Preheading>Why Choose Us</Preheading>
          <Title>The BloomVest Finance Advantage</Title>
          <Description>
            As a pioneer in hybrid financial advisory, we combine unbiased human expertise with 
            powerful AI technology to deliver personalized solutions that empower you to make 
            confident financial decisions.
          </Description>
        </Header>
        <Grid>
          {reasons.map((reason, index) => (
            <Card key={index}>
              <TopContent>
                <IconWrapper gradient={reason.gradient}>{reason.icon}</IconWrapper>
                <TitleArea>
                  <CardTitle>{reason.title}</CardTitle>
                  <CardTagline>{reason.tagline}</CardTagline>
                </TitleArea>
              </TopContent>
              <CardDescription>{reason.description}</CardDescription>
              <StatsList>
                {reason.stats.map((stat, i) => (
                  <Stat key={i}>
                    <StatNumber>{stat.number}</StatNumber>
                    <StatLabel>{stat.label}</StatLabel>
                  </Stat>
                ))}
              </StatsList>
            </Card>
          ))}
        </Grid>
      </Container>
    </Section>
  );
};

export default WhyChooseUs;