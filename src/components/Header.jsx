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
  position: relative;
`;

const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  
  img {
    height: 50px;
    width: auto;
  }
`;

const MobileMenuToggle = styled.div`
  display: none;
  
  @media (max-width: 1024px) {
    display: block;
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    z-index: 1020;
    cursor: pointer;
  }
`;

const NavWrapper = styled.nav`
  display: flex;
  align-items: center;
  gap: 2rem;
  @media (max-width: 1024px) {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background: #1a365d;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    transform: ${props => props.isopen ? 'translateX(0)' : 'translateX(100%)'};
    transition: transform 0.3s ease-in-out;
    z-index: 1010;
  }
`;

const NavLink = styled(Link)`
  color: #1a365d;
  text-decoration: none;
  font-size: 1rem;
  transition: color 0.3s ease;
  @media (max-width: 1024px) {
    color: white;
    font-size: 1.2rem;
    margin: 1rem 0;
  }
  &:hover {
    color: #22c55e;
  }
`;

const CloseButton = styled.div`
  display: none;
  
  @media (max-width: 1024px) {
    display: block;
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
    z-index: 1020;
  }
`;

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);
  
  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'auto';
  }, [isMenuOpen]);
  
  const toggleMenu = () => {
    console.log('Toggle menu clicked');
    setIsMenuOpen(prevState => !prevState);
  };
  
  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/hybrid-advisory', label: 'Hybrid Advisory' }, 
    { path: '/education', label: 'Education' },
    { path: '/about', label: 'About Us' }, 
   
  ];
  
  return (
    <HeaderContainer>
      <NavContainer>
        <LogoLink to="/">
          <img src="/bloomvest.png" alt="BloomVest Capital" />
        </LogoLink>
        
        <MobileMenuToggle onClick={toggleMenu}>
          <FaBars />
        </MobileMenuToggle>
        
        <NavWrapper isopen={isMenuOpen ? 1 : 0}>
          <CloseButton onClick={toggleMenu}>
            <FaTimes />
          </CloseButton>
          
          {navItems.map((item) => (
            <NavLink 
              key={item.path} 
              to={item.path} 
              onClick={toggleMenu}
            >
              {item.label}
            </NavLink>
          ))}
        </NavWrapper>
      </NavContainer>
    </HeaderContainer>
  );
};

export default Header;