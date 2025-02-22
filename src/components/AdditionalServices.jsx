import React from 'react';
import { FaTelegram, FaChartLine, FaHandshake } from 'react-icons/fa';

const AdditionalServices = () => {
  const services = [
    {
      icon: <FaTelegram />,
      title: "Naija-Bloom Community",
      price: "₦10,000/mo",
      desc: "Real-time alerts & investor mixers"
    },
    {
      icon: <FaChartLine />,
      title: "SME Investment Prep",
      price: "₦150,000",
      desc: "Pitch deck design & financial modeling"
    },
    {
      icon: <FaHandshake />,
      title: "Real Estate Crowdfunding",
      price: "From ₦50,000",
      desc: "Fractional property ownership"
    }
  ];

  return (
    <section className="additional-services">
      <div className="container">
        <h2 className="section-title">More Opportunities</h2>
        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index} className="service-card">
              <div className="service-icon">{service.icon}</div>
              <h3>{service.title}</h3>
              <div className="service-price">{service.price}</div>
              <p>{service.desc}</p>
              <button className="service-cta">Learn More</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdditionalServices;