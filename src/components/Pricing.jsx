import React from 'react';
import styled from 'styled-components';
import { FaCheck, FaStar } from 'react-icons/fa';

const PricingSection = styled.section`
  background: linear-gradient(to bottom, #f8fafc, #ffffff);
  padding: 80px 0;
  position: relative;
`;

const SectionHeader = styled.div`
  text-align: center;
  max-width: 700px;
  margin: 0 auto 50px;
  padding: 0 1.5rem;
`;

const Title = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a365d;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: #64748b;
  line-height: 1.6;
`;

const PricingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    max-width: 400px;
  }
`;

const PricingCard = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 2rem;
  position: relative;
  transition: all 0.3s ease;
  border: 1px solid ${props => props.$featured ? '#22c55e' : 'rgba(0,0,0,0.1)'};
  box-shadow: ${props => props.$featured ? '0 10px 20px rgba(34, 197, 94, 0.1)' : '0 5px 10px rgba(0,0,0,0.05)'};
  transform: ${props => props.$featured ? 'translateY(-5px)' : 'none'};

  &:hover {
    transform: translateY(-5px);
  }
`;

const PopularTag = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: #22c55e;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.3rem;
`;

const PlanName = styled.h3`
  font-size: 1.25rem;
  color: #1a365d;
  margin-bottom: 0.5rem;
  font-weight: 600;
`;

const Description = styled.p`
  color: #64748b;
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 1.5rem;
`;

const PlanPrice = styled.div`
  margin: 1.5rem 0;
  color: #1a365d;
`;

const Amount = styled.span`
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1;
`;

const Currency = styled.span`
  font-size: 1.25rem;
  font-weight: 500;
  margin-right: 0.25rem;
`;

const Period = styled.span`
  font-size: 0.9rem;
  color: #64748b;
  margin-left: 0.25rem;
`;

const FeatureList = styled.ul`
  list-style: none;
  margin: 1.5rem 0;
  padding: 0;
`;

const Feature = styled.li`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  color: #1a365d;
  font-size: 0.9rem;

  svg {
    color: #22c55e;
    flex-shrink: 0;
    font-size: 0.8rem;
  }
`;

const PlanButton = styled.button`
  width: 100%;
  background: ${props => props.$featured ? '#22c55e' : '#1a365d'};
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1.5rem;

  &:hover {
    transform: translateY(-2px);
    opacity: 0.9;
  }
`;

const Pricing = () => {
  const plans = [
    {
      name: "Starter",
      price: "25,000",
      description: "For individuals starting their investment journey",
      features: [
        "Initial investment strategy",
        "Quarterly portfolio review",
        "Basic financial planning",
        "Email support",
        "Educational resources"
      ]
    },
    {
      name: "Professional",
      price: "75,000",
      featured: true,
      description: "Comprehensive package for serious investors",
      features: [
        "Advanced investment strategy",
        "Monthly portfolio review",
        "Full financial planning",
        "Priority support",
        "Exclusive opportunities",
        "Tax optimization"
      ]
    },
    {
      name: "Enterprise",
      price: "200,000",
      description: "Full-service solution for high-net-worth individuals",
      features: [
        "Custom investment strategy",
        "Weekly portfolio review",
        "Dedicated advisor",
        "24/7 VIP support",
        "Elite opportunities",
        "Estate planning"
      ]
    }
  ];

  return (
    <PricingSection id="pricing">
      <SectionHeader>
        <Title>Investment Plans</Title>
        <Subtitle>
          Choose the perfect plan to start your investment journey with BloomVest Capital
        </Subtitle>
      </SectionHeader>
      <PricingGrid>
        {plans.map((plan, index) => (
          <PricingCard key={index} $featured={plan.featured}>
            {plan.featured && (
              <PopularTag>
                <FaStar /> Most Popular
              </PopularTag>
            )}
            <PlanName>{plan.name}</PlanName>
            <Description>{plan.description}</Description>
            <PlanPrice>
              <Currency>₦</Currency>
              <Amount>{plan.price}</Amount>
              <Period>/month</Period>
            </PlanPrice>
            <FeatureList>
              {plan.features.map((feature, i) => (
                <Feature key={i}>
                  <FaCheck /> {feature}
                </Feature>
              ))}
            </FeatureList>
            <PlanButton $featured={plan.featured}>
              Get Started
            </PlanButton>
          </PricingCard>
        ))}
      </PricingGrid>
    </PricingSection>
  );
};

export default Pricing;