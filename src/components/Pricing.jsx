import React from 'react';
import { GiMoneyStack, GiGrowth, GiCrownedSkull } from 'react-icons/gi';

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
    <section id="pricing" className="pricing">
      <div className="container">
        <h2 className="section-title">Investment Plans</h2>
        <div className="pricing-grid">
          {plans.map((plan, index) => (
            <div key={index} className="pricing-card">
              <div className="plan-icon">{plan.icon}</div>
              <h3>{plan.title}</h3>
              <div className="price">{plan.price}</div>
              <ul className="features">
                {plan.features.map((feature, i) => (
                  <li key={i}>{feature}</li>
                ))}
              </ul>
              <button className="plan-cta">Choose Plan</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;