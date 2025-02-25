import React from 'react';
import styled from 'styled-components';
import { FaCheck, FaStar, FaArrowRight, FaHeadset, FaShieldAlt, FaFileAlt } from 'react-icons/fa';

const PricingSection = styled.section`
  background: linear-gradient(to bottom, #f8fafc, #ffffff);
  padding: 100px 0;
  position: relative;
`;

const SectionHeader = styled.div`
  text-align: center;
  max-width: 700px;
  margin: 0 auto 60px;
  padding: 0 1.5rem;
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
    max-width: 450px;
  }
`;

const PricingCard = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 2.5rem;
  position: relative;
  transition: all 0.4s ease;
  border: 1px solid ${props => props.$featured ? '#22c55e' : 'rgba(0,0,0,0.08)'};
  box-shadow: ${props => props.$featured ? '0 15px 30px rgba(34, 197, 94, 0.15)' : '0 10px 20px rgba(0,0,0,0.03)'};
  transform: ${props => props.$featured ? 'translateY(-15px)' : 'none'};
  overflow: hidden;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
    border-color: ${props => props.$featured ? '#22c55e' : 'rgba(0,0,0,0.15)'};
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 6px;
    background: ${props => props.$featured ? '#22c55e' : 'transparent'};
    transition: background 0.3s ease;
  }
  
  &:hover::before {
    background: ${props => props.$featured ? '#22c55e' : 'rgba(0,0,0,0.1)'};
  }
`;

const PopularTag = styled.div`
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  background: #22c55e;
  color: white;
  padding: 0.35rem 0.85rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  box-shadow: 0 4px 10px rgba(34, 197, 94, 0.25);
`;

const PlanName = styled.h3`
  font-size: 1.5rem;
  color: #1a365d;
  margin-bottom: 0.5rem;
  font-weight: 600;
`;

const Description = styled.p`
  color: #64748b;
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 1.5rem;
  min-height: 60px;
`;

const PlanPrice = styled.div`
  margin: 1.75rem 0;
  color: #1a365d;
  position: relative;
  display: inline-block;
`;

const Amount = styled.span`
  font-size: 3rem;
  font-weight: 700;
  line-height: 1;
  background: ${props => props.$featured ? 
    'linear-gradient(135deg, #22c55e, #15803d)' : 
    'linear-gradient(135deg, #1a365d, #2d4e71)'};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Currency = styled.span`
  font-size: 1.5rem;
  font-weight: 500;
  margin-right: 0.25rem;
  vertical-align: top;
  position: relative;
  top: 0.5rem;
  opacity: 0.8;
`;

const Period = styled.span`
  font-size: 1rem;
  color: #64748b;
  margin-left: 0.25rem;
  font-weight: 500;
`;

const FeatureList = styled.ul`
  list-style: none;
  margin: 1.75rem 0;
  padding: 0;
`;

const Feature = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 1rem;
  color: #1a365d;
  font-size: 0.95rem;

  svg {
    color: #22c55e;
    flex-shrink: 0;
    margin-top: 0.25rem;
  }
`;

const PlanButton = styled.button`
  width: 100%;
  background: ${props => props.$featured ? '#22c55e' : 'transparent'};
  color: ${props => props.$featured ? 'white' : '#1a365d'};
  padding: 1rem;
  border: ${props => props.$featured ? 'none' : '2px solid #1a365d'};
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-3px);
    background: ${props => props.$featured ? '#1a945e' : 'rgba(26, 54, 93, 0.05)'};
    box-shadow: ${props => props.$featured ? '0 10px 20px rgba(34, 197, 94, 0.2)' : 'none'};
  }
  
  svg {
    transition: transform 0.3s ease;
  }
  
  &:hover svg {
    transform: translateX(4px);
  }
`;

const BonusBadge = styled.div`
  margin-top: 2rem;
  padding: 1rem;
  background: rgba(34, 197, 94, 0.08);
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  svg {
    color: #22c55e;
    font-size: 1.5rem;
    flex-shrink: 0;
  }
  
  div {
    font-size: 0.9rem;
    color: #1a365d;
    line-height: 1.5;
  }
`;

const Disclaimer = styled.div`
  text-align: center;
  margin-top: 3rem;
  color: #64748b;
  font-size: 0.9rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  padding: 0 1.5rem;
`;

const Pricing = () => {
  const plans = [
    {
      name: "Starter Advisory",
      price: "30,000",
      description: "Basic financial guidance for individuals beginning their wealth-building journey.",
      features: [
        "Initial financial assessment",
        "Basic investment strategy guidance",
        "Quarterly portfolio review",
        "Email support within 48 hours",
        "Access to educational resources",
        "Nigerian investment landscape overview"
      ],
      bonus: {
        icon: <FaFileAlt />,
        text: "Free 'Beginner's Guide to Nigerian Markets' e-book"
      }
    },
    {
      name: "Pro Advisory",
      price: "90,000",
      featured: true,
      description: "Comprehensive financial advisory for serious wealth builders.",
      features: [
        "In-depth financial assessment",
        "Personalized investment roadmap",
        "Monthly strategy sessions",
        "Priority support within 24 hours",
        "Exclusive market insights and opportunities",
        "Tax optimization guidance",
        "Risk mitigation planning"
      ],
      bonus: {
        icon: <FaHeadset />,
        text: "2 emergency consulting sessions per quarter"
      }
    },
    {
      name: "Premium Advisory",
      price: "250,000",
      description: "Elite advisory service for high-net-worth individuals with complex financial needs.",
      features: [
        "Comprehensive wealth strategy",
        "Weekly advisory sessions",
        "24/7 priority support",
        "Dedicated financial advisor",
        "Advanced portfolio strategy",
        "Estate and succession planning",
        "International investment guidance",
        "Family wealth management"
      ],
      bonus: {
        icon: <FaShieldAlt />,
        text: "Complete legal and tax documentation review"
      }
    }
  ];

  return (
    <PricingSection id="pricing">
      <SectionHeader>
        <Preheading>Our Advisory Packages</Preheading>
        <Title>Expert Guidance That Fits Your Needs</Title>
        <Subtitle>
          Choose the advisory package that aligns with your financial goals and get personalized guidance 
          from our experienced advisors.
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
              <Amount $featured={plan.featured}>{plan.price}</Amount>
              <Period>/month</Period>
            </PlanPrice>
            <FeatureList>
              {plan.features.map((feature, i) => (
                <Feature key={i}>
                  <FaCheck /> <span>{feature}</span>
                </Feature>
              ))}
            </FeatureList>
            <PlanButton $featured={plan.featured}>
              Get Started <FaArrowRight />
            </PlanButton>
            
            <BonusBadge>
              {plan.bonus.icon}
              <div>{plan.bonus.text}</div>
            </BonusBadge>
          </PricingCard>
        ))}
      </PricingGrid>
      
      <Disclaimer>
        All advisory packages include a no-obligation initial consultation. BloomVest Capital does not directly execute trades 
        or manage investment accounts on your behalf - we provide expert guidance to help you make informed decisions.
      </Disclaimer>
    </PricingSection>
  );
};

export default Pricing;