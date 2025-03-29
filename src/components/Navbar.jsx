import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaArrowRight, FaBars, FaTimes } from 'react-icons/fa';
import { NavLink as RouterLink, useLocation } from 'react-router-dom';

// Enhanced Navbar styling with better typography and visual hierarchy
const NavbarContainer = styled.header`
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  
  ${props => props.scrolled && `
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    padding: 0.75rem 0;
  `}
  
  @media (max-width: 768px) {
    padding: 0.75rem 0;
  }
`;

const NavWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;
  transition: height 0.3s ease;
  
  ${props => props.scrolled && `
    height: 70px;
  `}
  
  @media (max-width: 768px) {
    height: 70px;
  }
`;

const Logo = styled(RouterLink)`
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  font-weight: 800;
  color: #1a365d;
  text-decoration: none;
  letter-spacing: -0.5px;
  
  img {
    height: 40px;
    margin-right: 0.5rem;
  }
  
  span {
    color: #22c55e;
  }
`;

const NavLinks = styled.nav`
  display: flex;
  align-items: center;
  gap: 2rem;
  
  @media (max-width: 1024px) {
    display: none;
  }
`;

const NavLink = styled(RouterLink)`
  color: #1a365d;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  padding: 0.5rem 0;
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
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
  
  &.active {
    color: #22c55e;
    font-weight: 700;
    
    &:after {
      width: 100%;
      height: 3px;
      background: linear-gradient(to right, #22c55e, #4ade80);
    }
  }
`;

const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ActionButton = styled(RouterLink)`
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  text-decoration: none;
  
  &.outline {
    color: #1a365d;
    border: 2px solid #1a365d;
    background: transparent;
    
    &:hover {
      background: rgba(26, 54, 93, 0.05);
      transform: translateY(-3px);
    }
  }
  
  &.primary {
    background: #22c55e;
    color: white;
    border: none;
    box-shadow: 0 4px 15px rgba(34, 197, 94, 0.2);
    
    &:hover {
      background: #15803d;
      transform: translateY(-3px);
      box-shadow: 0 8px 20px rgba(34, 197, 94, 0.3);
    }
    
    svg {
      transition: transform 0.3s ease;
    }
    
    &:hover svg {
      transform: translateX(3px);
    }
  }
  
  @media (max-width: 1024px) {
    padding: 0.65rem 1.25rem;
    font-size: 0.9rem;
    
    &.outline {
      display: none;
    }
  }
`;

const MobileMenuToggle = styled.button`
  display: none;
  background: transparent;
  border: none;
  color: #1a365d;
  font-size: 1.5rem;
  cursor: pointer;
  transition: color 0.3s ease;
  
  &:hover {
    color: #22c55e;
  }
  
  @media (max-width: 1024px) {
    display: flex;
  }
`;

const MobileNavLinks = styled.div`
  display: none;
  
  @media (max-width: 1024px) {
    display: ${props => props.isOpen ? 'block' : 'none'};
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    padding: 1.5rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    border-top: 1px solid rgba(0, 0, 0, 0.05);
  }
`;

const MobileNavLink = styled(RouterLink)`
  display: block;
  padding: 1rem 0;
  color: #1a365d;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    color: #22c55e;
    padding-left: 0.5rem;
  }
  
  &.active {
    color: #22c55e;
    padding-left: 0.5rem;
    border-left: 3px solid #22c55e;
  }
`;

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  return (
    <NavbarContainer scrolled={scrolled}>
      <NavWrapper scrolled={scrolled}>
        <Logo to="/">
          <img src="/logo.png" alt="BloomVest Finance" />
          <span>Bloom<strong>Vest</strong></span>
        </Logo>
        
        <NavLinks>
          <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>
            Home
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => isActive ? "active" : ""}>
            About Us
          </NavLink>
          <NavLink to="/services" className={({ isActive }) => isActive ? "active" : ""}>
            Services
          </NavLink>
          <NavLink to="/education" className={({ isActive }) => isActive ? "active" : ""}>
            Education
          </NavLink>
        </NavLinks>
        
        <NavActions>
          <ActionButton to="/login" className="outline">
            Login
          </ActionButton>
          <ActionButton to="/consultation" className="primary">
            Get Started <FaArrowRight />
          </ActionButton>
          <MobileMenuToggle onClick={toggleMenu}>
            {menuOpen ? <FaTimes /> : <FaBars />}
          </MobileMenuToggle>
        </NavActions>
      </NavWrapper>
      
      <MobileNavLinks isOpen={menuOpen}>
        <MobileNavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>
          Home
        </MobileNavLink>
        <MobileNavLink to="/about" className={({ isActive }) => isActive ? "active" : ""}>
          About Us
        </MobileNavLink>
        <MobileNavLink to="/services" className={({ isActive }) => isActive ? "active" : ""}>
          Services
        </MobileNavLink>
        <MobileNavLink to="/education" className={({ isActive }) => isActive ? "active" : ""}>
          Education
        </MobileNavLink>
        <MobileNavLink to="/login">
          Login / Register
        </MobileNavLink>
      </MobileNavLinks>
    </NavbarContainer>
  );
};

export default Navbar; 