import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaBars, FaTimes } from 'react-icons/fa';

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: ${props => props.scrolled ? '#FFFFFF' : 'transparent'};
  transition: all 0.4s ease;
  box-shadow: ${props => props.scrolled ? '0 4px 20px rgba(0,0,0,0.08)' : 'none'};
  padding: ${props => props.scrolled ? '0.5rem 0' : '1rem 0'};
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
    height: 60px;
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
  
  @media (max-width: 1024px) {
    position: fixed;
    top: 0;
    right: ${props => props.isOpen ? '0' : '-100%'};
    width: 300px;
    height: 100vh;
    background: #1a365d;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    transition: right 0.4s ease;
    box-shadow: ${props => props.isOpen ? '-5px 0 25px rgba(0,0,0,0.1)' : 'none'};
    z-index: 1001;
  }
`;

const NavLink = styled.a`
  color: ${props => (props.isOpen || !props.scrolled) ? '#FFFFFF' : '#1a365d'};
  text-decoration: none;
  font-weight: 500;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  position: relative;
  padding: 0.5rem 0;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -2px;
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
  
  @media (max-width: 1024px) {
    color: #FFFFFF;
    font-size: 1.2rem;
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
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.2);
  
  &:hover {
    transform: translateY(-2px);
    background: #1a945e;
    box-shadow: 0 6px 16px rgba(34, 197, 94, 0.3);
  }
  
  @media (max-width: 1024px) {
    margin-top: 1.5rem;
    width: 80%;
  }
`;

const MenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  color: ${props => props.scrolled ? '#1a365d' : '#FFFFFF'};
  font-size: 1.8rem;
  transition: all 0.3s ease;
  z-index: 1002;
  
  @media (max-width: 1024px) {
    display: block;
  }
  
  &:hover {
    transform: scale(1.1);
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 2rem;
  right: 2rem;
  background: none;
  border: none;
  color: white;
  font-size: 1.8rem;
  cursor: pointer;
  display: none;
  
  @media (max-width: 1024px) {
    display: block;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
`;

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Prevent body scroll when menu is open
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <HeaderContainer scrolled={scrolled}>
        <NavContainer>
          <LogoLink href="/">
            <img src="/bloomvest.png" alt="BloomVest Capital" />
          </LogoLink>
          <Nav isOpen={isMenuOpen}>
            <CloseButton onClick={closeMenu}>
              <FaTimes />
            </CloseButton>
            <NavLink href="#services" scrolled={scrolled} isOpen={isMenuOpen}>Advisory Services</NavLink>
            <NavLink href="#ai-tool" scrolled={scrolled} isOpen={isMenuOpen}>AI Wealth Check</NavLink>
            <NavLink href="#education" scrolled={scrolled} isOpen={isMenuOpen}>Financial Education</NavLink>
            <NavLink href="#about" scrolled={scrolled} isOpen={isMenuOpen}>About Us</NavLink>
            <NavLink href="#resources" scrolled={scrolled} isOpen={isMenuOpen}>Resources</NavLink>
            <NavLink href="#contact" scrolled={scrolled} isOpen={isMenuOpen}>Contact</NavLink>
            <ContactButton>Free Consultation</ContactButton>
          </Nav>
          <MenuButton scrolled={scrolled} onClick={toggleMenu}>
            <FaBars />
          </MenuButton>
        </NavContainer>
      </HeaderContainer>
      <Overlay isOpen={isMenuOpen} onClick={closeMenu} />
    </>
  );
};

export default Header;