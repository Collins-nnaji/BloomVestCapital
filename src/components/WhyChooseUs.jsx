import React from 'react';
import styled from 'styled-components';
import { 
  FaUserShield, 

  FaGraduationCap, 
  FaHandshake, 
  FaGlobeAfrica 
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
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(34, 197, 94, 0.03) 0%, rgba(255, 255, 255, 0) 70%);
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

const IconWrapper = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #22c55e, #4ade80);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
  font-size: 2.25rem;
  color: white;
  box-shadow: 0 10px 20px rgba(34, 197, 94, 0.2);
  transition: all 0.3s ease;
  
  ${Card}:hover & {
    transform: scale(1.05) rotate(5deg);
  }
`;

const CardTitle = styled.h3`
  font-size: 1.75rem;
  color: #1a365d;
  margin-bottom: 1rem;
  font-weight: 600;
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
      title: "Independent Expertise",
      description: "Our advisors provide unbiased guidance with no hidden agendas or platform-specific incentives. We focus solely on what's best for your financial growth.",
      stats: [
        { number: "15+", label: "Years Experience" },
        { number: "100%", label: "Independent Advice" }
      ]
    },
    {
      icon: <FaGlobeAfrica />,
      title: "Nigeria-Focused Insights",
      description: "Our advisory services are specifically tailored to the Nigerian economic landscape, including local market conditions, regulations, and opportunities.",
      stats: [
        { number: "20+", label: "Years in Nigeria" },
        { number: "All 36", label: "States Covered" }
      ]
    },
    {
      icon: <FaGraduationCap />,
      title: "Education-First Approach",
      description: "We believe in empowering you through knowledge. Our services include comprehensive financial education to build your decision-making skills.",
      stats: [
        { number: "5,000+", label: "Workshop Graduates" },
        { number: "200+", label: "Educational Resources" }
      ]
    },
    {
      icon: <FaHandshake />,
      title: "Client Partnership",
      description: "We build long-term relationships founded on trust and transparency. Your financial success is our ultimate goal and measure of achievement.",
      stats: [
        { number: "98%", label: "Client Retention" },
        { number: "4.9/5", label: "Client Satisfaction" }
      ]
    }
  ];

  return (
    <Section id="why">
      <BackgroundAccent />
      <Container>
        <Header>
          <Preheading>Why Choose Us</Preheading>
          <Title>The BloomVest Capital Advantage</Title>
          <Description>
            As an independent advisory firm, we offer something different: unbiased guidance and 
            personalized solutions focused on empowering you to make informed financial decisions.
          </Description>
        </Header>
        <Grid>
          {reasons.map((reason, index) => (
            <Card key={index}>
              <IconWrapper>{reason.icon}</IconWrapper>
              <CardTitle>{reason.title}</CardTitle>
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