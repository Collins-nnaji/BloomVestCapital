import React from 'react';
import styled from 'styled-components';
import { FaLinkedin, FaTwitter, FaInstagram, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const FooterWrapper = styled.footer`
  background: #1a365d;
  color: white;
  padding: 80px 0 40px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.1), transparent);
  }
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 4rem;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }
`;

const FooterColumn = styled.div`
  h4 {
    color: white;
    font-size: 1.25rem;
    margin-bottom: 1.5rem;
    font-weight: 600;
  }
`;

const CompanyInfo = styled.div`
  img {
    height: 50px;
    margin-bottom: 1.5rem;
  }

  p {
    color: rgba(255, 255, 255, 0.8);
    line-height: 1.7;
    font-size: 1rem;
    margin-bottom: 1.5rem;
  }
`;

const QuickLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  a {
    color: rgba(255, 255, 255, 0.8);
    transition: all 0.3s ease;
    font-size: 1rem;

    &:hover {
      color: #22c55e;
      transform: translateX(5px);
    }
  }
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;

  svg {
    color: #22c55e;
    font-size: 1.25rem;
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-top: 2rem;

  a {
    color: rgba(255, 255, 255, 0.8);
    font-size: 1.5rem;
    transition: all 0.3s ease;

    &:hover {
      color: #22c55e;
      transform: translateY(-3px);
    }
  }
`;

const BottomBar = styled.div`
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 4rem;
  padding-top: 2rem;
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
`;

const Footer = () => {
  return (
    <FooterWrapper>
      <FooterGrid>
        <FooterColumn>
          <CompanyInfo>
            <img src="/bloomvest.png" alt="BloomVest Capital" />
            <p>
              Your trusted partner in financial growth and wealth management. 
              We provide expert guidance to help you achieve your financial goals 
              through smart investment strategies and comprehensive advisory services.
            </p>
            <SocialLinks>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <FaLinkedin />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <FaTwitter />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <FaInstagram />
              </a>
            </SocialLinks>
          </CompanyInfo>
        </FooterColumn>

        <FooterColumn>
          <h4>Quick Links</h4>
          <QuickLinks>
            <a href="#services">Our Services</a>
            <a href="#about">About Us</a>
            <a href="#training">Training</a>
            <a href="#resources">Resources</a>
            <a href="#contact">Contact</a>
          </QuickLinks>
        </FooterColumn>

        <FooterColumn>
          <h4>Services</h4>
          <QuickLinks>
            <a href="#investment">Investment Advisory</a>
            <a href="#property">Property Investment</a>
            <a href="#wealth">Wealth Management</a>
            <a href="#education">Financial Education</a>
            <a href="#planning">Financial Planning</a>
          </QuickLinks>
        </FooterColumn>

        <FooterColumn>
          <h4>Contact Us</h4>
          <ContactInfo>
            <ContactItem>
              <FaPhone />
              <span>+234 123 456 7890</span>
            </ContactItem>
            <ContactItem>
              <FaEnvelope />
              <span>hello@bloomvest.ng</span>
            </ContactItem>
            <ContactItem>
              <FaMapMarkerAlt />
              <span>123 Victoria Island, Lagos, Nigeria</span>
            </ContactItem>
          </ContactInfo>
        </FooterColumn>
      </FooterGrid>

      <BottomBar>
        <p>&copy; {new Date().getFullYear()} BloomVest Capital. All rights reserved.</p>
      </BottomBar>
    </FooterWrapper>
  );
};

export default Footer;