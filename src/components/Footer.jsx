import React from 'react';
import styled from 'styled-components';
import { FaLinkedin, FaTwitter } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const FooterContainer = styled.footer`
  background: #ffffff;
  border-top: 1px solid #e5e7eb;
  padding: 2rem 0 1.5rem;
  padding-bottom: max(1.5rem, env(safe-area-inset-bottom));
  width: 100%;

  @media (max-width: 480px) {
    padding: 1.5rem 0 1.25rem;
  }
`;

const Inner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;

  @media (max-width: 480px) {
    padding: 0 1rem;
  }
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  flex-wrap: wrap;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid #e5e7eb;
`;

const LogoText = styled(Link)`
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: 1.2rem;
  color: #555;
  text-decoration: none;
  transition: color 0.2s ease;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  img {
    height: 32px;
  }

  span {
    color: #22c55e;
  }

  &:hover {
    color: #111;
    span { color: #15803d; }
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;

  @media (max-width: 600px) {
    gap: 1rem;
  }
`;

const FooterNavLink = styled(Link)`
  font-family: 'DM Sans', sans-serif;
  color: #555;
  font-size: 0.82rem;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: #22c55e;
  }
`;

const SocialIcons = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 6px;
  background: #f5f5f5;
  color: #555;
  font-size: 0.85rem;
  transition: all 0.2s ease;

  &:hover {
    color: #22c55e;
    background: rgba(34,197,94,0.1);
  }
`;

const BottomRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 1rem;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const Copyright = styled.p`
  font-family: 'DM Sans', sans-serif;
  color: #666;
  font-size: 0.75rem;
  margin: 0;
  line-height: 1.5;
`;

const PoweredBy = styled.span`
  font-family: 'DM Sans', sans-serif;
  color: #888;
  font-size: 0.72rem;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <Inner>
        <TopRow>
          <LogoText to="/">
            <img src="/bloomvestlogo.png" alt="BloomVest" />
            Bloom<span>Vest</span>
          </LogoText>

          <NavLinks>
            <FooterNavLink to="/learn">Learn</FooterNavLink>
            <FooterNavLink to="/scenario">Scenarios</FooterNavLink>
            <FooterNavLink to="/demo">Trading</FooterNavLink>
            <FooterNavLink to="/ai-tutor">AI Tutor</FooterNavLink>
          </NavLinks>

          <SocialIcons>
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
              aria-label="Twitter"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTwitter />
            </SocialLink>
          </SocialIcons>
        </TopRow>

        <BottomRow>
          <Copyright>&copy; 2026 BloomVest. All rights reserved.</Copyright>
          <PoweredBy>Powered by OpenAI</PoweredBy>
        </BottomRow>
      </Inner>
    </FooterContainer>
  );
};

export default Footer;
