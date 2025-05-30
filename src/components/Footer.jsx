import React from 'react';
import styled from 'styled-components';
import { 
  FaLinkedin, 
  FaTwitter, 
  FaInstagram, 
  FaPhone, 
  FaEnvelope, 
  FaMapMarkerAlt,
  FaChevronRight,
  FaClock
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const FooterContainer = styled.footer`
  background: #1a365d;
  background-image: linear-gradient(0deg, #0f2744 0%, #1a365d 100%);
  padding: 4rem 0 2rem;
  color: #ffffff;
  position: relative;
  overflow: hidden;
  width: 100%;
  max-width: 100vw;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(to right, #22c55e, #15803d);
  }
`;

const FooterContent = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: grid;
  grid-template-columns: 1.2fr repeat(2, 1fr);
  gap: 3rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }
`;

const BrandColumn = styled.div`
  @media (max-width: 1024px) {
    grid-column: 1 / 3;
  }
  
  @media (max-width: 768px) {
    grid-column: 1;
  }
`;

const FooterLogoLink = styled(Link)`
  display: inline-block;
  margin-bottom: 1.25rem;
  
  img {
    height: 38px;
    width: auto;
    filter: brightness(0) invert(1);
    transition: all 0.3s ease;
    
    &:hover {
      opacity: 0.9;
      transform: scale(1.02);
    }
  }
`;

const CompanyDescription = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.95rem;
  line-height: 1.7;
  margin-bottom: 1.5rem;
  max-width: 400px;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 0.8rem;
  margin-bottom: 1.5rem;
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  transition: all 0.3s ease;
  font-size: 1.1rem;
  
  &:hover {
    background: #22c55e;
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(34, 197, 94, 0.2);
  }
`;

const ColumnTitle = styled.h4`
  color: white;
  font-size: 1.15rem;
  font-weight: 600;
  margin-bottom: 1.25rem;
  position: relative;
  padding-bottom: 0.75rem;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 40px;
    height: 3px;
    background: #22c55e;
    border-radius: 2px;
  }
`;

const LinksList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const LinkItem = styled.li`
  margin-bottom: 0.8rem;
`;

const FooterLink = styled(Link)`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.95rem;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  
  &:hover {
    color: #22c55e;
    transform: translateX(3px);
  }
  
  svg {
    margin-right: 0.6rem;
    font-size: 0.8rem;
    color: #22c55e;
  }
`;

const ContactItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.8rem;
  margin-bottom: 1rem;
`;

const ContactIcon = styled.div`
  color: #22c55e;
  font-size: 1.1rem;
  flex-shrink: 0;
  margin-top: 0.2rem;
`;

const ContactText = styled.div`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.95rem;
  line-height: 1.5;
`;

const CopyrightSection = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 1.5rem 1.5rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  margin-top: 2.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.25rem;
    text-align: center;
    padding-top: 1.25rem;
  }
`;

const Copyright = styled.p`
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.9rem;
`;

const LegalLinks = styled.div`
  display: flex;
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    gap: 1.25rem;
    flex-wrap: wrap;
    justify-content: center;
  }
`;

const LegalLink = styled.a`
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.9rem;
  transition: all 0.3s ease;
  text-decoration: none;
  
  &:hover {
    color: #22c55e;
  }
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <BrandColumn>
          <FooterLogoLink to="/">
            <img src="/bloomvestlogo.png" alt="BloomVest" />
          </FooterLogoLink>
          <CompanyDescription>
            BloomVest is a startup-investor connection platform that helps innovative startups find the right investors through strategic guidance, valuable networks, and expert support.
          </CompanyDescription>
          <SocialLinks>
            <SocialLink href="https://www.linkedin.com/company/bloomvest-finance" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
              <FaLinkedin />
            </SocialLink>
            <SocialLink href="https://twitter.com/bloomvest" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
              <FaTwitter />
            </SocialLink>
            <SocialLink href="https://instagram.com/bloomvest" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
              <FaInstagram />
            </SocialLink>
          </SocialLinks>
        </BrandColumn>
        
        <div>
          <ColumnTitle>Quick Links</ColumnTitle>
          <LinksList>
            <LinkItem>
              <FooterLink to="/">
                <FaChevronRight /> Home
              </FooterLink>
            </LinkItem>
            <LinkItem>
              <FooterLink to="/about">
                <FaChevronRight /> About Us
              </FooterLink>
            </LinkItem>
            <LinkItem>
              <FooterLink to="/tools">
                <FaChevronRight /> Tools
              </FooterLink>
            </LinkItem>
          </LinksList>
        </div>
        
        <div>
          <ColumnTitle>Contact Us</ColumnTitle>
          <ContactItem>
            <ContactIcon>
              <FaMapMarkerAlt />
            </ContactIcon>
            <ContactText>
              123 Finance Boulevard, Victoria Island, Lagos, Nigeria
            </ContactText>
          </ContactItem>
          <ContactItem>
            <ContactIcon>
              <FaPhone />
            </ContactIcon>
            <ContactText>
              +234 123 456 7890
            </ContactText>
          </ContactItem>
          <ContactItem>
            <ContactIcon>
              <FaEnvelope />
            </ContactIcon>
            <ContactText>
              info@bloomvest.com
            </ContactText>
          </ContactItem>
          <ContactItem>
            <ContactIcon>
              <FaClock />
            </ContactIcon>
            <ContactText>
              Monday - Friday: 9:00 AM - 5:00 PM
            </ContactText>
          </ContactItem>
        </div>
      </FooterContent>
      
      <CopyrightSection>
        <Copyright>
          © {new Date().getFullYear()} BloomVest. All rights reserved.
        </Copyright>
        <LegalLinks>
          <LegalLink href="/privacy">Privacy Policy</LegalLink>
          <LegalLink href="/terms">Terms of Service</LegalLink>
          <LegalLink href="/cookies">Cookie Policy</LegalLink>
        </LegalLinks>
      </CopyrightSection>
    </FooterContainer>
  );
};

export default Footer;