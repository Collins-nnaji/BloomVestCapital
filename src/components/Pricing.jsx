import styled from 'styled-components';
import { GiMoneyStack, GiGrowth, GiCrownedSkull } from 'react-icons/gi';

const PricingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

const PricingCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  padding: 2rem;
  border-radius: 16px;
  text-align: center;
  transition: transform ${({ theme }) => theme.transitions.default};
  box-shadow: ${({ theme }) => theme.shadows.md};
  border: 2px solid ${({ theme }) => theme.colors.primary}20;

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`;

const PlanIcon = styled.div`
  font-size: 3rem;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 1rem;
`;

const Price = styled.div`
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.accent};
  font-weight: 700;
  margin: 1rem 0;
`;

const FeaturesList = styled.ul`
  list-style: none;
  margin: 2rem 0;
  padding: 0;

  li {
    padding: 0.8rem;
    margin: 0.5rem 0;
    background: ${({ theme }) => theme.colors.lightGreen};
    border-radius: 8px;
    font-size: 0.9rem;
  }
`;

const PlanButton = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  padding: 1rem 2rem;
  border: none;
  border-radius: 50px;
  width: 100%;
  font-weight: 600;
  cursor: pointer;
  transition: background ${({ theme }) => theme.transitions.default};

  &:hover {
    background: ${({ theme }) => theme.colors.secondary};
  }
`;

const Pricing = () => {
  const plans = [
    {
      icon: <GiMoneyStack />,
      title: "Seedling Plan",
      price: "₦25,000/mo",
      features: ["Personalized strategy session", "Monthly market reports", "Basic webinars", "WhatsApp support"]
    },
    {
      icon: <GiGrowth />,
      title: "Growth Partner",
      price: "₦75,000/mo",
      features: ["Custom portfolio design", "Quarterly reviews", "Premium workshops", "Priority email support"]
    },
    {
      icon: <GiCrownedSkull />,
      title: "Bloom Elite",
      price: "₦200,000/mo",
      features: ["Full portfolio management", "Exclusive opportunities", "ESG strategies", "Monthly Zoom calls"]
    }
  ];

  return (
    <section id="pricing">
      <div className="container">
        <h2>Investment Plans</h2>
        <PricingGrid>
          {plans.map((plan, index) => (
            <PricingCard key={index}>
              <PlanIcon>{plan.icon}</PlanIcon>
              <h3>{plan.title}</h3>
              <Price>{plan.price}</Price>
              <FeaturesList>
                {plan.features.map((feature, i) => (
                  <li key={i}>{feature}</li>
                ))}
              </FeaturesList>
              <PlanButton>Choose Plan</PlanButton>
            </PricingCard>
          ))}
        </PricingGrid>
      </div>
    </section>
  );
};

export default Pricing;