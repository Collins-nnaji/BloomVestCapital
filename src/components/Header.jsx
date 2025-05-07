import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FaBars, FaTimes, FaArrowRight } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const HeaderContainer = styled(motion.header)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  padding: 0.5rem 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &.scrolled {
    padding: 0.3rem 0;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  }
`;

const NavContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  height: 70px;
  
  @media (max-width: 768px) {
    height: 60px;
  }
`;

const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  position: relative;
  z-index: 1021;
  
  img {
    height: 45px;
    transition: all 0.3s ease;
    
    @media (max-width: 768px) {
      height: 38px;
    }
  }
`;

const MobileMenuToggle = styled.button`
  display: none;
  background: transparent;
  border: none;
  font-size: 1.5rem;
  color: #1a365d;
  cursor: pointer;
  z-index: 1021;
  transition: all 0.3s ease;
  
  &:hover {
    color: #22c55e;
    transform: scale(1.1);
  }
  
  @media (max-width: 1024px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const NavWrapper = styled.nav`
  display: flex;
  align-items: center;
  gap: 2.5rem;
  
  @media (max-width: 1024px) {
    display: none;
  }
`;

const MobileNavOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1010;
  backdrop-filter: blur(5px);
`;

const MobileNavWrapper = styled(motion.div)`
  position: fixed;
  top: 0;
  right: 0;
  width: 300px;
  height: 100vh;
  background: white;
  box-shadow: -5px 0 30px rgba(0, 0, 0, 0.15);
  z-index: 1020;
  padding: 100px 2rem 2rem;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  
  @media (max-width: 400px) {
    width: 85%;
  }
`;

const NavLink = styled(Link)`
  color: #1a365d;
  text-decoration: none;
  font-size: 1.05rem;
  font-weight: 600;
  position: relative;
  padding: 0.5rem 0;
  transition: all 0.3s ease;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background: #22c55e;
    transition: width 0.3s ease;
  }
  
  &:hover, &.active {
    color: #22c55e;
    
    &::after {
      width: 100%;
    }
  }
`;

const MobileNavLink = styled(Link)`
  color: #1a365d;
  text-decoration: none;
  font-size: 1.25rem;
  font-weight: 600;
  padding: 1rem 0;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  
  &:hover, &.active {
    color: #22c55e;
    transform: translateX(10px);
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: rgba(0, 0, 0, 0.05);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: #1a365d;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(0, 0, 0, 0.1);
    transform: rotate(90deg);
    color: #22c55e;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  
  @media (max-width: 1024px) {
    display: none;
  }
`;

const MobileActionButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
`;

const ActionButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: ${props => props.primary ? '0.75rem 1.5rem' : '0.7rem 1.25rem'};
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  white-space: nowrap;
  
  ${props => props.primary ? `
    background: #22c55e;
    color: white;
    box-shadow: 0 5px 15px rgba(34, 197, 94, 0.25);
    
    &:hover {
      background: #15803d;
      transform: translateY(-3px);
      box-shadow: 0 8px 20px rgba(34, 197, 94, 0.35);
    }
    
    svg {
      transition: transform 0.3s ease;
    }
    
    &:hover svg {
      transform: translateX(3px);
    }
  ` : `
    background: transparent;
    color: #1a365d;
    border: 2px solid #1a365d;
    
    &:hover {
      background: rgba(26, 54, 93, 0.05);
      transform: translateY(-3px);
    }
  `}
`;

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  
  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);
  
  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);
  
  // Detect scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const toggleMenu = () => {
    setIsMenuOpen(prevState => !prevState);
  };
  
  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/services', label: 'Services' },
    { path: '/tools', label: 'Tools' },
    { path: '/about', label: 'About Us' },
  ];
  
  const isActive = (path) => location.pathname === path;
  
  return (
    <HeaderContainer className={scrolled ? 'scrolled' : ''}>
      <NavContainer>
        <LogoLink to="/">
          <img src="/bloomvestlogo.png" alt="Bloomvest Capital" />
        </LogoLink>
        
        <NavWrapper>
          {navItems.map((item) => (
            <NavLink 
              key={item.path} 
              to={item.path} 
              className={isActive(item.path) ? 'active' : ''}
            >
              {item.label}
            </NavLink>
          ))}
        </NavWrapper>
        
        <MobileMenuToggle onClick={toggleMenu}>
          <FaBars />
        </MobileMenuToggle>
      </NavContainer>
      
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <MobileNavOverlay
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={toggleMenu}
            />
            <MobileNavWrapper
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
            >
              <CloseButton onClick={toggleMenu}>
                <FaTimes />
              </CloseButton>
              
              {navItems.map((item) => (
                <MobileNavLink 
                  key={item.path} 
                  to={item.path} 
                  className={isActive(item.path) ? 'active' : ''}
                  onClick={toggleMenu}
                >
                  {item.label}
                </MobileNavLink>
              ))}
            </MobileNavWrapper>
          </>
        )}
      </AnimatePresence>
    </HeaderContainer>
  );
};

export default Header;