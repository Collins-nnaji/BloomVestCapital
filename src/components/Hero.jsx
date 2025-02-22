import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const Hero = () => {
  return (
    <section className="hero">
      {/* Removed svg-background div */}
      <div className="container">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Grow Your Wealth Naija Style!</h1>
            <p className="subtitle">Smart investment solutions for Nigerians - From ₦25k/month</p>
            <button className="cta-button">
              Start Now <FaWhatsapp className="whatsapp-icon" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;