import React from 'react';
import styled from 'styled-components';
import { 
  FaLinkedin, 
  FaTwitter, 
  FaInstagram, 
  FaPhone, 
  FaEnvelope, 
  FaMapMarkerAlt,
  FaYoutube,
  FaFacebook,
  FaChevronRight,
  FaWhatsapp
} from 'react-icons/fa';

const FooterWrapper = styled.footer`
  background: #1a365d;
  color: white;
  padding: 100px 0 40px;
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

const FooterPattern = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-image: linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
  opacity: 0.5;
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 4rem;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 1;

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
    position: relative;
    padding-bottom: 1rem;
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 50px;
      height: 2px;
      background: #22c55e;
    }
  }
`;

const CompanyInfo = styled.div`
  img {
    height: 60px;
    margin-bottom: 1.5rem;
  }

  p {
    color: rgba(255, 255, 255, 0.8);
    line-height: 1.7;
    font-size: 1rem;
    margin-bottom: 1.5rem;
  }
`;

const Tagline = styled.div`
  display: inline-block;
  background: rgba(34, 197, 94, 0.15);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  color: #22c55e;
  font-weight: 500;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
`;

const QuickLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const NavLink = styled.a`
  color: rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    font-size: 0.75rem;
    transition: transform 0.3s ease;
  }

  &:hover {
    color: #22c55e;
    transform: translateX(2px);
    
    svg {
      transform: translateX(3px);
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
  align-items: flex-start;
  gap: 1rem;
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;

  svg {
    color: #22c55e;
    font-size: 1.25rem;
    margin-top: 0.1rem;
  }
  
  a {
    color: rgba(255, 255, 255, 0.8);
    transition: color 0.3s ease;
    
    &:hover {
      color: #22c55e;
    }
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1.25rem;
  margin-top: 2rem;

  a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    color: rgba(255, 255, 255, 0.8);
    font-size: 1.25rem;
    transition: all 0.3s ease;

    &:hover {
      color: #22c55e;
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-3px);
    }
  }
`;

const NewsletterBox = styled.div`
  margin-top: 1.5rem;
`;

const NewsletterForm = styled.form`
  display: flex;
  margin-top: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const NewsletterInput = styled.input`
  flex-grow: 1;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px 0 0 8px;
  color: white;
  font-size: 1rem;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
  
  &:focus {
    outline: none;
    border-color: #22c55e;
  }
  
  @media (max-width: 768px) {
    border-radius: 8px;
  }
`;

const NewsletterButton = styled.button`
  background: #22c55e;
  color: white;
  padding: 1rem 1.5rem;
  border: none;
  border-radius: 0 8px 8px 0;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #1a945e;
  }
  
  @media (max-width: 768px) {
    border-radius: 8px;
  }
`;

const Disclaimer = styled.p`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 1rem;
`;

const BottomBar = styled.div`
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 4rem;
  padding-top: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 2rem;
  padding-right: 2rem;
  position: relative;
  z-index: 1;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
`;

const Copyright = styled.p`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
`;

const LegalLinks = styled.div`
  display: flex;
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    flex-wrap: wrap;
    justify-content: center;
  }
`;

const LegalLink = styled.a`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
  transition: color 0.3s ease;
  
  &:hover {
    color: #22c55e;
  }
`;

const Footer = () => {
  return (
    <FooterWrapper>
      <FooterPattern />
      <FooterGrid>
        <FooterColumn>
          <CompanyInfo>
            <img src="/bloomvest.png" alt="BloomVest Finance" />
            <Tagline>Hybrid Financial Advisory</Tagline>
            <p>
              BloomVest Finance combines human expertise with AI-powered insights to deliver 
              exceptional financial advisory services. We empower individuals and businesses to make 
              informed decisions through personalized guidance and innovative solutions.
            </p>
            <SocialLinks>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <FaLinkedin />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <FaTwitter />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <FaFacebook />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <FaYoutube />
              </a>
            </SocialLinks>
          </CompanyInfo>
        </FooterColumn>

        <FooterColumn>
          <h4>Quick Links</h4>
          <QuickLinks>
            <NavLink href="/about">
              <FaChevronRight /> About Us
            </NavLink>
            <NavLink href="/hybrid-advisory">
              <FaChevronRight /> Hybrid Advisory
            </NavLink>
            <NavLink href="/events">
              <FaChevronRight /> Events & Workshops
            </NavLink>
            <NavLink href="/training">
              <FaChevronRight /> Training Sessions
            </NavLink>
            <NavLink href="/resources">
              <FaChevronRight /> Resources
            </NavLink>
            <NavLink href="/contact">
              <FaChevronRight /> Contact Us
            </NavLink>
          </QuickLinks>
        </FooterColumn>

        <FooterColumn>
          <h4>Contact Us</h4>
          <ContactInfo>
            <ContactItem>
              <FaPhone />
              <span>
                <a href="tel:+2341234567890">+234 123 456 7890</a>
              </span>
            </ContactItem>
            <ContactItem>
              <FaWhatsapp />
              <span>
                <a href="https://wa.me/2341234567890">+234 123 456 7890</a>
              </span>
            </ContactItem>
            <ContactItem>
              <FaEnvelope />
              <span>
                <a href="mailto:hello@bloomvestfinance.com">hello@bloomvestfinance.com</a>
              </span>
            </ContactItem>
            <ContactItem>
              <FaMapMarkerAlt />
              <span>123 Victoria Island, Lagos, Nigeria</span>
            </ContactItem>
          </ContactInfo>
          
          <NewsletterBox>
            <h4>Newsletter</h4>
            <p>Subscribe for financial tips and insights</p>
            <NewsletterForm>
              <NewsletterInput type="email" placeholder="Your email address" />
              <NewsletterButton type="submit">Subscribe</NewsletterButton>
            </NewsletterForm>
            <Disclaimer>We'll never share your email with third parties.</Disclaimer>
          </NewsletterBox>
        </FooterColumn>
      </FooterGrid>

      <BottomBar>
        <Copyright>&copy; {new Date().getFullYear()} BloomVest Finance. All rights reserved.</Copyright>
        <LegalLinks>
          <LegalLink href="/terms">Terms of Service</LegalLink>
          <LegalLink href="/privacy">Privacy Policy</LegalLink>
          <LegalLink href="/disclaimer">Disclaimer</LegalLink>
        </LegalLinks>
      </BottomBar>
    </FooterWrapper>
  );
};

export default Footer;