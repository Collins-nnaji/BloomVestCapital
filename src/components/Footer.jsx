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
  FaWhatsapp,
  FaClock
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const FooterContainer = styled.footer`
  background: #1a365d;
  padding: 5rem 0 3rem;
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
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: 1.5fr repeat(3, 1fr);
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
  display: inline-flex;
  align-items: center;
  font-size: 1.75rem;
  font-weight: 800;
  color: white;
  text-decoration: none;
  letter-spacing: -0.5px;
  margin-bottom: 1.25rem;
  
  span {
    color: #4ade80;
  }
`;

const CompanyDescription = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  line-height: 1.8;
  margin-bottom: 1.75rem;
  max-width: 400px;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  transition: all 0.3s ease;
  font-size: 1.2rem;
  
  &:hover {
    background: #22c55e;
    transform: translateY(-3px);
  }
`;

const ColumnTitle = styled.h4`
  color: white;
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
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
  }
`;

const LinksList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const LinkItem = styled.li`
  margin-bottom: 1rem;
`;

const FooterLink = styled.a`
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  
  &:hover {
    color: #22c55e;
    transform: translateX(3px);
  }
  
  svg {
    margin-right: 0.75rem;
    font-size: 0.85rem;
    color: #22c55e;
  }
`;

const ContactItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.25rem;
`;

const ContactIcon = styled.div`
  color: #22c55e;
  font-size: 1.25rem;
  flex-shrink: 0;
  margin-top: 0.25rem;
`;

const ContactText = styled.div`
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  line-height: 1.6;
`;

const CopyrightSection = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 2rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 3rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
    text-align: center;
  }
`;

const Copyright = styled.p`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.95rem;
`;

const LegalLinks = styled.div`
  display: flex;
  gap: 2rem;
  
  @media (max-width: 768px) {
    gap: 1.5rem;
  }
`;

const LegalLink = styled.a`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.95rem;
  transition: all 0.3s ease;
  
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
            <span>Bloom<strong>Vest</strong></span>
          </FooterLogoLink>
          <CompanyDescription>
            BloomVest Finance provides strategic financial solutions through innovative methodologies and personalized service to help clients achieve sustainable growth and financial success.
          </CompanyDescription>
          <SocialLinks>
            <SocialLink href="#" aria-label="Twitter">
              <FaTwitter />
            </SocialLink>
            <SocialLink href="#" aria-label="LinkedIn">
              <FaLinkedin />
            </SocialLink>
            <SocialLink href="#" aria-label="Facebook">
              <FaFacebook />
            </SocialLink>
            <SocialLink href="#" aria-label="Instagram">
              <FaInstagram />
            </SocialLink>
          </SocialLinks>
        </BrandColumn>
        
        <div>
          <ColumnTitle>Quick Links</ColumnTitle>
          <LinksList>
            <LinkItem>
              <FooterLink href="/">
                <FaChevronRight /> Home
              </FooterLink>
            </LinkItem>
            <LinkItem>
              <FooterLink href="/about">
                <FaChevronRight /> About Us
              </FooterLink>
            </LinkItem>
            <LinkItem>
              <FooterLink href="/services">
                <FaChevronRight /> Services
              </FooterLink>
            </LinkItem>
            <LinkItem>
              <FooterLink href="/education">
                <FaChevronRight /> Education
              </FooterLink>
            </LinkItem>
            <LinkItem>
              <FooterLink href="/contact">
                <FaChevronRight /> Contact
              </FooterLink>
            </LinkItem>
          </LinksList>
        </div>
        
        <div>
          <ColumnTitle>Our Services</ColumnTitle>
          <LinksList>
            <LinkItem>
              <FooterLink href="/services">
                <FaChevronRight /> Financial Planning
              </FooterLink>
            </LinkItem>
            <LinkItem>
              <FooterLink href="/services">
                <FaChevronRight /> Investment Advisory
              </FooterLink>
            </LinkItem>
            <LinkItem>
              <FooterLink href="/services">
                <FaChevronRight /> Retirement Planning
              </FooterLink>
            </LinkItem>
            <LinkItem>
              <FooterLink href="/services">
                <FaChevronRight /> Tax Optimization
              </FooterLink>
            </LinkItem>
            <LinkItem>
              <FooterLink href="/services">
                <FaChevronRight /> Estate Planning
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
              info@bloomvestfinance.com
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
          © {new Date().getFullYear()} BloomVest Finance. All rights reserved.
        </Copyright>
        <LegalLinks>
          <LegalLink href="#">Privacy Policy</LegalLink>
          <LegalLink href="#">Terms of Service</LegalLink>
          <LegalLink href="#">Cookie Policy</LegalLink>
        </LegalLinks>
      </CopyrightSection>
    </FooterContainer>
  );
};

export default Footer;