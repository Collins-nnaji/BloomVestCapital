import React from 'react';
import { MdSecurity, MdTrendingUp, MdPeople } from 'react-icons/md';

const WhyChooseUs = () => {
  const reasons = [
    {
      icon: <MdSecurity />,
      title: "SEC Registered",
      desc: "Fully compliant with Nigerian regulations"
    },
    {
      icon: <MdTrendingUp />,
      title: "10% Average Returns",
      desc: "Consistent growth across portfolios"
    },
    {
      icon: <MdPeople />,
      title: "15,000+ Investors",
      desc: "Largest Naija investment community"
    }
  ];

  return (
    <section id="why" className="why-choose">
      <div className="container">
        <h2 className="section-title">Why BloomVest?</h2>
        <div className="reasons-grid">
          {reasons.map((reason, index) => (
            <div key={index} className="reason-card">
              <div className="reason-icon">{reason.icon}</div>
              <h3>{reason.title}</h3>
              <p>{reason.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;