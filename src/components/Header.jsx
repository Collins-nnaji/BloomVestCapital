import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FaBars, FaTimes, FaCrown, FaSignOutAlt } from 'react-icons/fa';
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
    ? 'rgba(255,255,255,0.98)'
    : 'rgba(255,255,255,0.95)'};
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(0,0,0,0.06);
  box-shadow: ${props => props.$scrolled ? '0 2px 12px rgba(0,0,0,0.06)' : 'none'};
  transition: all 0.3s ease;
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
  color: #111;
  display: flex;
  align-items: center;
  z-index: 1021;
  gap: 0.5rem;

  img {
    height: 38px;
    width: auto;
  }

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
  color: ${props => props.$active ? '#22c55e' : '#111'};
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
  color: #111;
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
  background: rgba(0,0,0,0.4);
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
  background: #fff;
  z-index: 1020;
  padding: 5rem 1.5rem 2rem;
  display: flex;
  flex-direction: column;
  border-left: 1px solid rgba(0,0,0,0.08);

  @media (max-width: 320px) {
    width: 100%;
  }
`;

const MobileCloseButton = styled.button`
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  background: rgba(0,0,0,0.04);
  border: 1px solid rgba(0,0,0,0.08);
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #111;
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
  color: ${props => props.$active ? '#22c55e' : '#111'};
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
  padding: 0.9rem 0;
  border-bottom: 1px solid rgba(0,0,0,0.06);
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

const UserMenuWrapper = styled.div`
  position: relative;
`;

const UserAvatar = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.8rem;
  font-weight: 700;
  font-family: 'Space Grotesk', sans-serif;
  flex-shrink: 0;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  &:hover { transform: scale(1.05); box-shadow: 0 0 12px rgba(34,197,94,0.4); }
`;

const UserDropdown = styled(motion.div)`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 200px;
  background: #fff;
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: 12px;
  padding: 0.75rem 0;
  box-shadow: 0 8px 32px rgba(0,0,0,0.12);
  z-index: 1100;
`;

const UserDropdownName = styled.div`
  padding: 0.5rem 1rem;
  color: #111;
  font-size: 0.85rem;
  font-weight: 600;
  border-bottom: 1px solid rgba(0,0,0,0.06);
  word-break: break-all;
`;

const SignOutBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.6rem 1rem;
  border: none;
  background: transparent;
  color: #111;
  font-size: 0.85rem;
  cursor: pointer;
  transition: color 0.2s, background 0.2s;
  &:hover { background: rgba(239,68,68,0.08); color: #dc2626; }
`;

const MobileUserSection = styled.div`
  padding: 1rem 0;
  border-top: 1px solid rgba(0,0,0,0.06);
  margin-top: 0.5rem;
`;

const MobileUserEmail = styled.div`
  color: #333;
  font-size: 0.85rem;
  padding-bottom: 0.5rem;
  word-break: break-all;
`;

const MobileSignOut = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 0;
  background: none;
  border: none;
  color: #f87171;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  &:hover { color: #fca5a5; }
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
  border: 2px solid #111;
  color: #111;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  &:hover { border-color: #22c55e; color: #22c55e; }
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
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const userMenuRef = useRef(null);
  const location = useLocation();
  const { user, isPro, signOut, loading: authLoading } = useAuth();

  useEffect(() => {
    setMenuOpen(false);
    setUserDropdownOpen(false);
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

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (path) => location.pathname === path;
  const handleSignOut = () => {
    setUserDropdownOpen(false);
    setMenuOpen(false);
    signOut();
  };

  return (
    <HeaderContainer $scrolled={scrolled}>
      <NavContainer>
        <Logo to="/">
          <img src="/bloomvestlogo.png" alt="BloomVest" />
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
                  <UserMenuWrapper ref={userMenuRef}>
                    <UserAvatar
                      onClick={() => setUserDropdownOpen((v) => !v)}
                      aria-label="Account menu"
                      aria-expanded={userDropdownOpen}
                    >
                      {(user.name || user.email || '?')[0].toUpperCase()}
                    </UserAvatar>
                    <AnimatePresence>
                      {userDropdownOpen && (
                        <UserDropdown
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.15 }}
                        >
                          <UserDropdownName>{user.name || user.email}</UserDropdownName>
                          <SignOutBtn onClick={handleSignOut}>
                            <FaSignOutAlt /> Sign out
                          </SignOutBtn>
                        </UserDropdown>
                      )}
                    </AnimatePresence>
                  </UserMenuWrapper>
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

              {!user ? (
                <MobileNavLink to="/auth" $active={isActive('/auth')} onClick={() => setMenuOpen(false)}>
                  Sign In
                </MobileNavLink>
              ) : (
                <MobileUserSection>
                  <MobileUserEmail>{user.name || user.email}</MobileUserEmail>
                  <MobileSignOut onClick={() => { handleSignOut(); setMenuOpen(false); }}>
                    <FaSignOutAlt /> Sign out
                  </MobileSignOut>
                </MobileUserSection>
              )}
              <MobileCTA to={user ? '/pricing' : '/learn'} onClick={() => setMenuOpen(false)}>
                {user && isPro ? 'Manage' : user ? 'Upgrade' : 'Start Free'}
              </MobileCTA>
            </MobilePanel>
          </>
        )}
      </AnimatePresence>
    </HeaderContainer>
  );
};

export default Header;
