// src/components/Header.js
import styled from 'styled-components';

const HeaderWrapper = styled.header`
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
  background: ${({ theme }) => theme.colors.white};
  box-shadow: ${({ theme }) => theme.shadows.md};
  padding: 1rem 0;
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const Logo = styled.a`
  img {
    height: 60px;  // Increased from 40px
    width: auto;
    transition: transform ${({ theme }) => theme.transitions.default};

    &:hover {
      transform: scale(1.05);
    }

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
      height: 50px;  // Slightly smaller on mobile
    }
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2.5rem;
  align-items: center;

  a {
    color: ${({ theme }) => theme.colors.text};
    text-decoration: none;
    font-weight: 500;
    transition: all ${({ theme }) => theme.transitions.default};
    padding: 0.5rem;
    position: relative;

    &:hover {
      color: ${({ theme }) => theme.colors.primary};
      
      &::after {
        width: 100%;
      }
    }

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 2px;
      background: ${({ theme }) => theme.colors.primary};
      transition: width ${({ theme }) => theme.transitions.default};
    }
  }
`;

const Header = () => {
  return (
    <HeaderWrapper>
      <Nav>
        <Logo href="/">
          <img src="/bloomvest.png" alt="BloomVest Logo" />
        </Logo>
        
        <NavLinks>
          <a href="#home">Home</a>
          <a href="#invest">Invest</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
          <a href="#blog">Blog</a>
        </NavLinks>
      </Nav>
    </HeaderWrapper>
  );
};

export default Header;