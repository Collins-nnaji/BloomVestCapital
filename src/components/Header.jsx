import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FaBars, FaTimes, FaCrown } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../AuthContext';

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: 64px;
  display: flex;
  align-items: center;
  background: ${props => props.$scrolled
    ? 'rgba(4,6,12,0.95)'
    : 'rgba(6,9,16,0.85)'};
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255,255,255,0.06);
  transition: background 0.3s ease;
`;

const NavContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

const Logo = styled(Link)`
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: 1.4rem;
  text-decoration: none;
  color: #fff;
  display: flex;
  align-items: center;
  z-index: 1021;

  span {
    color: #22c55e;
  }
`;

const NavWrapper = styled.nav`
  display: flex;
  align-items: center;
  gap: 2rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  font-family: 'DM Sans', sans-serif;
  color: ${props => props.$active ? '#22c55e' : 'rgba(255,255,255,0.75)'};
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 500;
  position: relative;
  padding: 0.35rem 0;
  transition: color 0.25s ease;

  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: ${props => props.$active ? '100%' : '0'};
    height: 2px;
    background: #22c55e;
    transition: width 0.25s ease;
    border-radius: 1px;
  }

  &:hover {
    color: #22c55e;

    &::after {
      width: 100%;
    }
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const CTAButton = styled(Link)`
  font-family: 'DM Sans', sans-serif;
  display: inline-flex;
  align-items: center;
  padding: 0.45rem 1rem;
  background: #22c55e;
  color: #fff;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.25s ease;
  white-space: nowrap;

  &:hover {
    background: #16a34a;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(34,197,94,0.35);
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const HamburgerButton = styled.button`
  display: none;
  background: transparent;
  border: none;
  color: rgba(255,255,255,0.8);
  font-size: 1.25rem;
  cursor: pointer;
  z-index: 1021;
  padding: 0.25rem;
  transition: color 0.2s ease;

  &:hover {
    color: #22c55e;
  }

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const MobileOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  z-index: 1010;
  backdrop-filter: blur(4px);
`;

const MobilePanel = styled(motion.div)`
  position: fixed;
  top: 0;
  right: 0;
  width: 280px;
  height: 100vh;
  height: 100dvh;
  background: #0a0f1c;
  z-index: 1020;
  padding: 5rem 1.5rem 2rem;
  display: flex;
  flex-direction: column;
  border-left: 1px solid rgba(255,255,255,0.06);

  @media (max-width: 320px) {
    width: 100%;
  }
`;

const MobileCloseButton = styled.button`
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.08);
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255,255,255,0.5);
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s ease;

  &:hover {
    color: #22c55e;
    border-color: rgba(34,197,94,0.3);
  }
`;

const MobileNavLink = styled(Link)`
  font-family: 'DM Sans', sans-serif;
  color: ${props => props.$active ? '#22c55e' : 'rgba(255,255,255,0.6)'};
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
  padding: 0.9rem 0;
  border-bottom: 1px solid rgba(255,255,255,0.04);
  transition: all 0.2s ease;
  display: block;

  &:hover {
    color: #22c55e;
    padding-left: 0.5rem;
  }
`;

const MobileCTA = styled(Link)`
  font-family: 'DM Sans', sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: auto;
  padding: 0.7rem 1.25rem;
  background: #22c55e;
  color: #fff;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.25s ease;

  &:hover {
    background: #16a34a;
  }
`;

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  font-family: 'Space Grotesk', sans-serif;
  flex-shrink: 0;
  cursor: pointer;
`;

const AuthButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  @media (max-width: 1024px) { display: none; }
`;

const SignInBtn = styled.button`
  padding: 0.45rem 1rem;
  border-radius: 8px;
  background: transparent;
  border: 1px solid rgba(255,255,255,0.12);
  color: rgba(255,255,255,0.7);
  font-family: 'DM Sans', sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  &:hover { border-color: rgba(255,255,255,0.25); color: white; }
`;

const ProBadge = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.35rem 0.75rem;
  border-radius: 6px;
  background: rgba(34,197,94,0.1);
  border: 1px solid rgba(34,197,94,0.2);
  color: #4ade80;
  font-size: 0.7rem;
  font-weight: 600;
  text-decoration: none;
`;

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/learn', label: 'Learn' },
  { path: '/scenario', label: 'Scenarios' },
  { path: '/demo', label: 'Trading' },
  { path: '/ai-tutor', label: 'AI Tutor' },
];

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user, isPro, signInWithGoogle, signOut, loading: authLoading } = useAuth();

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [menuOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <HeaderContainer $scrolled={scrolled}>
      <NavContainer>
        <Logo to="/">
          Bloom<span>Vest</span>
        </Logo>

        <NavWrapper>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              $active={isActive(item.path)}
            >
              {item.label}
            </NavLink>
          ))}
        </NavWrapper>

        <RightSection>
          {!authLoading && (
            <AuthButtons>
              {user ? (
                <>
                  {isPro ? (
                    <ProBadge to="/pricing"><FaCrown /> Pro</ProBadge>
                  ) : (
                    <CTAButton to="/pricing">Upgrade</CTAButton>
                  )}
                  <UserAvatar onClick={signOut} title={`${user.email}\nClick to sign out`}>
                    {(user.name || user.email || '?')[0].toUpperCase()}
                  </UserAvatar>
                </>
              ) : (
                <>
                  <SignInBtn as={Link} to="/auth">Sign In</SignInBtn>
                  <CTAButton to="/pricing">Start Free</CTAButton>
                </>
              )}
            </AuthButtons>
          )}
          <HamburgerButton onClick={() => setMenuOpen(true)} aria-label="Open menu">
            <FaBars />
          </HamburgerButton>
        </RightSection>
      </NavContainer>

      <AnimatePresence>
        {menuOpen && (
          <>
            <MobileOverlay
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMenuOpen(false)}
            />
            <MobilePanel
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.28, ease: 'easeOut' }}
            >
              <MobileCloseButton onClick={() => setMenuOpen(false)} aria-label="Close menu">
                <FaTimes />
              </MobileCloseButton>

              {navItems.map((item) => (
                <MobileNavLink
                  key={item.path}
                  to={item.path}
                  $active={isActive(item.path)}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </MobileNavLink>
              ))}

              <MobileCTA to="/learn" onClick={() => setMenuOpen(false)}>
                Start Free
              </MobileCTA>
            </MobilePanel>
          </>
        )}
      </AnimatePresence>
    </HeaderContainer>
  );
};

export default Header;
