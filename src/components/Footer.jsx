import React from 'react';
import styled from 'styled-components';
import { FaLinkedin, FaTwitter } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const FooterContainer = styled.footer`
  background: #ffffff;
  border-top: 1px solid rgba(15, 23, 42, 0.08);
  padding: 0.75rem 0;
  padding-bottom: max(0.75rem, env(safe-area-inset-bottom));
  width: 100%;
`;

const Inner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem 1.25rem;

  @media (max-width: 480px) {
    padding: 0 1rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
`;

const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  flex-shrink: 0;
  &:hover {
    opacity: 0.8;
  }
  img {
    height: 24px;
  }
`;

const Links = styled.div`
  display: flex;
  align-items: center;
  gap: 1.25rem;
  flex-wrap: wrap;
`;

const FLink = styled(Link)`
  color: #64748b;
  font-size: 0.75rem;
  font-weight: 500;
  text-decoration: none;
  font-family: 'DM Sans', sans-serif;
  &:hover {
    color: #22c55e;
  }
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 0.85rem;
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 6px;
  background: rgba(15, 23, 42, 0.05);
  color: #64748b;
  font-size: 0.78rem;
  transition: all 0.18s;
  &:hover {
    color: #22c55e;
    background: rgba(34, 197, 94, 0.1);
  }
`;

const Copyright = styled.span`
  color: #94a3b8;
  font-size: 0.72rem;
  font-family: 'DM Sans', sans-serif;
`;

const Footer = () => (
  <FooterContainer>
    <Inner>
      <LogoLink to="/">
        <img src="/bloomvestlogo.png" alt="BloomVest" />
      </LogoLink>

      <Links>
        <FLink to="/enquiry">Enquire</FLink>
        <FLink to="/privacy">Privacy</FLink>
        <FLink to="/terms">Terms</FLink>
      </Links>

      <Right>
        <Copyright>&copy; 2026 Bloomvest Property</Copyright>
        <SocialLink
          href="https://www.linkedin.com/company/bloomvest-finance"
          aria-label="LinkedIn"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaLinkedin />
        </SocialLink>
        <SocialLink
          href="https://twitter.com/bloomvest"
          aria-label="Twitter / X"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaTwitter />
        </SocialLink>
      </Right>
    </Inner>
  </FooterContainer>
);

export default Footer;
