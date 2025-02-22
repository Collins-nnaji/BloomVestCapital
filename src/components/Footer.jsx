import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-section">
            <h4>BloomVest Capital</h4>
            <p>Lagos Headquarters:</p>
            <p>123 Adeola Odeku Street, VI</p>
            <p>contact@bloomvest.ng</p>
          </div>
          
          <div className="footer-section">
            <h4>Quick Links</h4>
            <a href="#services">Services</a>
            <a href="#pricing">Pricing</a>
            <a href="#why">Why Us</a>
          </div>
          
          <div className="footer-section">
            <h4>Payment Methods</h4>
            <div className="payment-methods">
              <span>Opay</span>
              <span>PalmPay</span>
              <span>GTBank</span>
            </div>
            <div className="social-icons">
              <FaFacebook />
              <FaTwitter />
              <FaInstagram />
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2023 BloomVest Capital. All rights reserved</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;