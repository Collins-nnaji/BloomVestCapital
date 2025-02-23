import React from 'react';
import styled from 'styled-components';
import { FaUserShield, FaChartLine, FaGem, FaGraduationCap } from 'react-icons/fa';

const Section = styled.section`
  padding: 100px 0;
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

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const Header = styled.div`
  text-align: center;
  max-width: 800px;
  margin: 0 auto 80px;
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
  transition: all 0.3s ease;
  border: 1px solid rgba(34, 197, 94, 0.1);
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05);
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
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, #22c55e, #4ade80);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
  font-size: 2rem;
  color: white;
  box-shadow: 0 10px 20px rgba(34, 197, 94, 0.2);
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
      title: "Trusted Expertise",
      description: "Our team of certified financial advisors brings decades of experience in wealth management and investment strategy.",
      stats: [
        { number: "15+", label: "Years Experience" },
        { number: "500+", label: "Happy Clients" }
      ]
    },
    {
      icon: <FaChartLine />,
      title: "Proven Track Record",
      description: "Consistent growth and remarkable returns through our tested and proven investment strategies.",
      stats: [
        { number: "₦50B+", label: "Managed Assets" },
        { number: "25%", label: "Avg. Returns" }
      ]
    },
    {
      icon: <FaGem />,
      title: "Premium Service",
      description: "Personalized attention and dedicated support to help you achieve your financial goals.",
      stats: [
        { number: "24/7", label: "Support" },
        { number: "98%", label: "Client Retention" }
      ]
    },
    {
      icon: <FaGraduationCap />,
      title: "Financial Education",
      description: "Comprehensive training and resources to help you make informed financial decisions.",
      stats: [
        { number: "1000+", label: "Workshops" },
        { number: "5000+", label: "Graduates" }
      ]
    }
  ];

  return (
    <Section id="why">
      <Container>
        <Header>
          <Title>Why Choose BloomVest Capital?</Title>
          <Description>
            We combine expertise, innovation, and personalized service to help you achieve 
            your financial goals with confidence and peace of mind.
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