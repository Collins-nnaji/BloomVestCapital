import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FaBars, FaTimes } from 'react-icons/fa';

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: #FFFFFF;
  transition: all 0.4s ease;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  padding: 0.5rem 0;
`;

const NavContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;

  @media (max-width: 1024px) {
    padding: 0 1rem;
  }
`;

const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  transform-origin: left center;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.02);
  }
  
  img {
    height: 50px;
    width: auto;
    
    @media (max-width: 768px) {
      height: 40px;
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
    width: 100%;
    height: 100vh;
    background: #1a365d;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    transition: right 0.4s ease;
    box-shadow: ${props => props.isOpen ? '-5px 0 25px rgba(0,0,0,0.1)' : 'none'};
    z-index: 1001;
    padding: 0 2rem;
  }
`;

const NavLink = styled(Link)`
  color: ${props => props.isopen ? '#FFFFFF' : '#1a365d'};
  text-decoration: none;
  font-weight: 500;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  position: relative;
  padding: 0.5rem 0;
  text-align: center;
  width: 100%;
  
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
    font-size: 1.5rem;
    padding: 1rem 0;
  }
`;

const MenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  color: #1a365d;
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
  z-index: 1003;
  
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Navigation items for easier maintenance
  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About Us' },
    { path: '/education', label: 'Education' },
    { path: '/resources', label: 'Resources' }
  ];

  // Manage menu and body overflow
  useEffect(() => {
    // Close menu when route changes
    setIsMenuOpen(false);
    
    // Manage body overflow when menu is open
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'auto';
  }, [location, isMenuOpen]);

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  return (
    <>
      <HeaderContainer>
        <NavContainer>
          <LogoLink to="/">
            <img src="/bloomvest.png" alt="BloomVest Capital" />
          </LogoLink>
          
          <Nav isOpen={isMenuOpen}>
            <CloseButton onClick={toggleMenu} aria-label="Close Menu">
              <FaTimes />
            </CloseButton>
            
            {navItems.map((item) => (
              <NavLink 
                key={item.path}
                to={item.path} 
                isopen={isMenuOpen ? 1 : 0}
                onClick={toggleMenu}
                aria-label={item.label}
              >
                {item.label}
              </NavLink>
            ))}
          </Nav>
          
          <MenuButton 
            onClick={toggleMenu}
            aria-label="Open Menu"
          >
            <FaBars />
          </MenuButton>
        </NavContainer>
      </HeaderContainer>
      
      <Overlay isOpen={isMenuOpen} onClick={toggleMenu} />
    </>
  );
};

export default Header;