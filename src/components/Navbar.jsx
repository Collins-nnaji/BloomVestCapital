import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaArrowRight, FaBars, FaTimes, FaChevronRight } from 'react-icons/fa';
import { NavLink as RouterLink, useLocation } from 'react-router-dom';

// App-like navbar styling with modern design
const NavbarContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(12px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.04);
  height: 60px;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  
  ${props => props.scrolled && `
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.07);
  `}
`;

const NavWrapper = styled.div`
  max-width: 1280px;
  width: 100%;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled(RouterLink)`
  display: flex;
  align-items: center;
  font-size: 1.35rem;
  font-weight: 800;
  color: #1a365d;
  text-decoration: none;
  letter-spacing: -0.5px;
  
  img {
    height: 38px;
    margin-right: 0.5rem;
  }
  
  span {
    color: #22c55e;
  }
`;

const NavLinks = styled.nav`
  display: flex;
  align-items: center;
  gap: 2.25rem;
  
  @media (max-width: 1024px) {
    display: none;
  }
`;

const NavLink = styled(RouterLink)`
  color: #1a365d;
  font-size: 0.95rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  padding: 0.4rem 0;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 3px;
    background: #22c55e;
    border-radius: 3px;
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
  padding: 0.6rem 1.25rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.9rem;
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
      transform: translateY(-2px);
    }
  }
  
  &.primary {
    background: #22c55e;
    color: white;
    border: none;
    box-shadow: 0 4px 12px rgba(34, 197, 94, 0.2);
    
    &:hover {
      background: #15803d;
      transform: translateY(-2px);
      box-shadow: 0 6px 15px rgba(34, 197, 94, 0.3);
    }
    
    svg {
      transition: transform 0.3s ease;
    }
    
    &:hover svg {
      transform: translateX(3px);
    }
  }
  
  @media (max-width: 1024px) {
    padding: 0.55rem 1.1rem;
    font-size: 0.85rem;
    
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
  font-size: 1.3rem;
  cursor: pointer;
  transition: color 0.3s ease;
  padding: 0.4rem;
  
  &:hover {
    color: #22c55e;
  }
  
  @media (max-width: 1024px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const MobileMenu = styled.div`
  position: fixed;
  top: 0;
  right: ${props => props.isOpen ? '0' : '-280px'};
  width: 280px;
  height: 100vh;
  background: white;
  box-shadow: 0 0 40px rgba(0, 0, 0, 0.12);
  transition: right 0.3s ease;
  z-index: 1100;
  padding: 5rem 1.5rem 2rem;
  display: flex;
  flex-direction: column;
`;

const MobileNavLink = styled(RouterLink)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0;
  color: #1a365d;
  font-weight: 600;
  font-size: 1.1rem;
  text-decoration: none;
  transition: all 0.3s ease;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    color: #22c55e;
    transform: translateX(5px);
  }
  
  &.active {
    color: #22c55e;
  }
  
  svg {
    font-size: 0.8rem;
    opacity: 0.5;
  }
`;

const MobileMenuClose = styled.button`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: rgba(0, 0, 0, 0.05);
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  color: #1a365d;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(0, 0, 0, 0.08);
    transform: rotate(90deg);
    color: #22c55e;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(3px);
  z-index: 1050;
  opacity: ${props => props.isOpen ? '1' : '0'};
  pointer-events: ${props => props.isOpen ? 'all' : 'none'};
  transition: opacity 0.3s ease;
`;

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
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
  
  // Close menu when route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);
  
  // Prevent body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [menuOpen]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <>
      <NavbarContainer scrolled={scrolled}>
        <NavWrapper>
          <Logo to="/">
            <img src="/bloomvestlogo.png" alt="BloomVest" />
            Bloom<span>Vest</span>
          </Logo>
          
          <NavLinks>
            <NavLink to="/" className={location.pathname === '/' ? 'active' : ''}>
              Home
            </NavLink>
            <NavLink to="/tools" className={location.pathname === '/tools' ? 'active' : ''}>
              Tools
            </NavLink>
            <NavLink to="/about" className={location.pathname === '/about' ? 'active' : ''}>
              About Us
            </NavLink>
          </NavLinks>
          
          <NavActions>
            <ActionButton 
              to="/tools" 
              className="primary"
            >
              Get Started <FaArrowRight />
            </ActionButton>
          </NavActions>
          
          <MobileMenuToggle onClick={toggleMenu}>
            <FaBars />
          </MobileMenuToggle>
        </NavWrapper>
      </NavbarContainer>
      
      <Overlay isOpen={menuOpen} onClick={toggleMenu} />
      
      <MobileMenu isOpen={menuOpen}>
        <MobileMenuClose onClick={toggleMenu}>
          <FaTimes />
        </MobileMenuClose>
        
        <MobileNavLink to="/" className={location.pathname === '/' ? 'active' : ''}>
          Home <FaChevronRight />
        </MobileNavLink>
        <MobileNavLink to="/tools" className={location.pathname === '/tools' ? 'active' : ''}>
          Tools <FaChevronRight />
        </MobileNavLink>
        <MobileNavLink to="/about" className={location.pathname === '/about' ? 'active' : ''}>
          About Us <FaChevronRight />
        </MobileNavLink>
      </MobileMenu>
    </>
  );
};

export default Navbar; 