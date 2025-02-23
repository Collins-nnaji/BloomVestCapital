import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: ${props => props.scrolled ? '#FFFFFF' : 'transparent'};
  transition: all 0.3s ease;
  box-shadow: ${props => props.scrolled ? '0 2px 10px rgba(0,0,0,0.1)' : 'none'};
  padding: 0.5rem 0;
`;

const NavContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const LogoLink = styled.a`
  display: flex;
  align-items: center;
  text-decoration: none;
  transform-origin: left center;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.02);
  }

  img {
    height: 60px; // Increased logo size
    width: auto;
    
    @media (max-width: 768px) {
      height: 50px;
    }
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: 3rem;
  align-items: center;

  @media (max-width: 968px) {
    display: none;
  }
`;

const NavLink = styled.a`
  color: ${props => props.$scrolled ? '#1a365d' : '#FFFFFF'};
  text-decoration: none;
  font-weight: 500;
  font-size: 1.1rem;
  font-family: 'Inter', sans-serif;
  transition: all 0.3s ease;
  position: relative;

  &:after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 0;
    height: 2px;
    background: #22c55e;
    transition: width 0.3s ease;
  }

  &:hover {
    color: #22c55e;
    &:after {
      width: 100%;
    }
  }
`;

const ContactButton = styled.button`
  background: #22c55e;
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1.1rem;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(34, 197, 94, 0.2);

  &:hover {
    transform: translateY(-2px);
    background: #1a945e;
    box-shadow: 0 6px 8px rgba(34, 197, 94, 0.3);
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  color: ${props => props.$scrolled ? '#1a365d' : '#FFFFFF'};
  font-size: 1.8rem;
  transition: all 0.3s ease;

  @media (max-width: 968px) {
    display: block;
  }

  &:hover {
    transform: scale(1.1);
  }
`;

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <HeaderContainer scrolled={scrolled}>
      <NavContainer>
        <LogoLink href="/">
          <img src="/bloomvest.png" alt="BloomVest Capital" />
        </LogoLink>
        <Nav>
          <NavLink href="#services" $scrolled={scrolled}>Our Services</NavLink>
          <NavLink href="#about" $scrolled={scrolled}>About Us</NavLink>
          <NavLink href="#training" $scrolled={scrolled}>Training</NavLink>
          <NavLink href="#resources" $scrolled={scrolled}>Resources</NavLink>
          <NavLink href="#contact" $scrolled={scrolled}>Contact</NavLink>
          <ContactButton>Get Started</ContactButton>
        </Nav>
        <MobileMenuButton $scrolled={scrolled}>
          ☰
        </MobileMenuButton>
      </NavContainer>
    </HeaderContainer>
  );
};

export default Header;