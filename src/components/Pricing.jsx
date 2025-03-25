import React from 'react';
import styled from 'styled-components';
import { FaCheck, FaStar, FaArrowRight } from 'react-icons/fa';

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
    gap: 2rem;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    max-width: 450px;
    gap: 2.5rem;
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
  height: 100%;
  display: flex;
  flex-direction: column;

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
`;

const PlanPrice = styled.div`
  margin: 1.5rem 0;
  color: #1a365d;
  position: relative;
  display: inline-block;
`;

const Amount = styled.span`
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1;
  background: ${props => props.$featured ? 
    'linear-gradient(135deg, #22c55e, #15803d)' : 
    'linear-gradient(135deg, #1a365d, #2d4e71)'};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Currency = styled.span`
  font-size: 1.25rem;
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
  margin: 1.5rem 0;
  padding: 0;
  flex-grow: 1;
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
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: auto;

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

const InfoSection = styled.div`
  max-width: 900px;
  margin: 3rem auto 0;
  text-align: center;
  padding: 2rem;
  background: rgba(34, 197, 94, 0.05);
  border-radius: 16px;
`;

const InfoText = styled.p`
  font-size: 1.1rem;
  color: #1a365d;
  margin-bottom: 1rem;
  
  strong {
    color: #22c55e;
  }
`;

const ContactButton = styled.button`
  background: #22c55e;
  color: white;
  padding: 0.9rem 1.8rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: #1a945e;
    transform: translateY(-3px);
  }
  
  svg {
    transition: transform 0.3s ease;
  }
  
  &:hover svg {
    transform: translateX(4px);
  }
`;

const Pricing = () => {
  const plans = [
    {
      name: "Essential",
      description: "Data-driven financial planning for individuals at the beginning of their financial journey.",
      price: {
        amount: "120,000",
        period: "/year"
      },
      features: [
        "Financial assessment & planning",
        "Quarterly portfolio review",
        "Basic analytics dashboard",
        "Email support",
        "Educational resources"
      ],
      buttonText: "Get Started",
      featured: false
    },
    {
      name: "Professional",
      description: "Comprehensive financial management with advanced analytics for serious investors.",
      price: {
        amount: "340,000",
        period: "/year"
      },
      features: [
        "Everything in Essential, plus:",
        "Monthly portfolio optimization",
        "Advanced AI analytics",
        "Dedicated financial advisor",
        "Tax optimization"
      ],
      buttonText: "Choose Plan",
      featured: true,
      popular: true
    },
    {
      name: "Enterprise",
      description: "Full-scale financial partnership with customized solutions for corporate clients.",
      price: {
        amount: "Custom",
        period: ""
      },
      features: [
        "Everything in Professional, plus:",
        "Custom financial solutions",
        "Enterprise analytics platform",
        "24/7 priority support",
        "Advanced risk management"
      ],
      buttonText: "Contact Us",
      featured: false
    }
  ];

  return (
    <PricingSection id="pricing">
      <SectionHeader>
        <Preheading>BloomVest Capital</Preheading>
        <Title>Simple, Transparent Pricing</Title>
        <Subtitle>
          Choose the plan that suits your financial goals with access to our data-driven 
          insights and expertise to make informed decisions.
        </Subtitle>
      </SectionHeader>
      
      <PricingGrid>
        {plans.map((plan, index) => (
          <PricingCard key={index} $featured={plan.featured}>
            {plan.popular && (
              <PopularTag>
                <FaStar /> Most Popular
              </PopularTag>
            )}
            
            <PlanName>{plan.name}</PlanName>
            <Description>{plan.description}</Description>
            
            <PlanPrice>
              <Currency>₦</Currency>
              <Amount $featured={plan.featured}>{plan.price.amount}</Amount>
              <Period>{plan.price.period}</Period>
            </PlanPrice>
            
            <FeatureList>
              {plan.features.map((feature, i) => (
                <Feature key={i}>
                  <FaCheck /> 
                  <span>{feature}</span>
                </Feature>
              ))}
            </FeatureList>
            
            <PlanButton $featured={plan.featured}>
              {plan.buttonText} {plan.featured && <FaArrowRight />}
            </PlanButton>
          </PricingCard>
        ))}
      </PricingGrid>
      
      <InfoSection>
        <InfoText>
          Need a <strong>custom solution</strong> for your specific financial needs?
        </InfoText>
        <ContactButton>
          Schedule a Consultation <FaArrowRight />
        </ContactButton>
      </InfoSection>
    </PricingSection>
  );
};

export default Pricing;