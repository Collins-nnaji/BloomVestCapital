import React from 'react';
import { FiDollarSign, FiPieChart, FiUsers } from 'react-icons/fi';

const Services = () => {
  const services = [
    { icon: <FiDollarSign />, title: "Naira & Dollar Options", desc: "Invest in multiple currencies" },
    { icon: <FiPieChart />, title: "Diversified Portfolios", desc: "Stocks, Real Estate, Agri" },
    { icon: <FiUsers />, title: "Community Support", desc: "24/7 WhatsApp access" },
  ];

  return (
    <section id="services" className="services">
      <div className="container">
        <h2 className="section-title">Our Services</h2>
        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index} className="service-card">
              <div className="service-icon">{service.icon}</div>
              <h3>{service.title}</h3>
              <p>{service.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;