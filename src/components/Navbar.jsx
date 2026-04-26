import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaBars, FaTimes, FaChevronRight, FaSignOutAlt } from 'react-icons/fa';
import { NavLink as RouterLink, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const NavbarContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(15, 23, 42, 0.06);
  height: 64px;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;

  ${(props) =>
    props.$scrolled &&
    `
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  `}
`;

const NavWrapper = styled.div`
  max-width: 1320px;
  width: 100%;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`;

const Logo = styled(RouterLink)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  flex-shrink: 0;

  img {
    height: 36px;
  }
`;

const NavCenter = styled.nav`
  display: flex;
  align-items: center;
  gap: 0.25rem;

  @media (max-width: 1024px) {
    display: none;
  }
`;

const NavGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.1rem;
  padding: 0.3rem;
  border-radius: 12px;
  background: ${(props) => (props.$highlight ? 'rgba(34,197,94,0.06)' : 'transparent')};
`;

const NavLink = styled(RouterLink)`
  color: rgba(15, 23, 42, 0.65);
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
  padding: 0.4rem 0.75rem;
  border-radius: 8px;
  white-space: nowrap;

  &:hover {
    color: #0f172a;
    background: rgba(15, 23, 42, 0.05);
  }

  &.active {
    color: #15803d;
    background: rgba(34, 197, 94, 0.1);
    font-weight: 700;
  }
`;

const BookCallBtn = styled(RouterLink)`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1.1rem;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.82rem;
  color: white;
  background: #0a0f1e;
  text-decoration: none;
  transition: all 0.2s ease;
  white-space: nowrap;

  &::before {
    content: '●';
    color: #22c55e;
    font-size: 0.5rem;
  }

  &:hover {
    background: #15803d;
  }

  @media (max-width: 1024px) {
    display: none;
  }
`;

const NavRight = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;

  @media (max-width: 1024px) {
    gap: 0.35rem;
  }
`;

const SignInLink = styled(RouterLink)`
  padding: 0.5rem 1rem;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.82rem;
  color: #0f172a;
  border: 1px solid rgba(15, 23, 42, 0.14);
  background: white;
  text-decoration: none;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    border-color: rgba(34, 197, 94, 0.45);
    color: #15803d;
    background: rgba(34, 197, 94, 0.06);
  }

  @media (max-width: 1024px) {
    display: none;
  }
`;

const UserWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: 1024px) {
    display: none;
  }
`;

const UserHint = styled.span`
  font-size: 0.72rem;
  font-weight: 600;
  color: rgba(15, 23, 42, 0.45);
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const SignOutBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.5rem 0.85rem;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.8rem;
  color: #64748b;
  border: 1px solid rgba(15, 23, 42, 0.1);
  background: rgba(15, 23, 42, 0.03);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: #b91c1c;
    border-color: rgba(185, 28, 28, 0.25);
    background: rgba(254, 226, 226, 0.5);
  }

  @media (max-width: 1024px) {
    display: none;
  }
`;

const MobileToggle = styled.button`
  display: none;
  background: transparent;
  border: none;
  color: #0f172a;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.35rem;
  transition: color 0.2s;

  &:hover {
    color: #22c55e;
  }

  @media (max-width: 1024px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(4px);
  z-index: 1050;
  opacity: ${(props) => (props.$open ? 1 : 0)};
  pointer-events: ${(props) => (props.$open ? 'all' : 'none')};
  transition: opacity 0.3s ease;
`;

const MobileMenu = styled.div`
  position: fixed;
  top: 0;
  right: ${(props) => (props.$open ? '0' : '-300px')};
  width: 290px;
  height: 100vh;
  background: white;
  z-index: 1100;
  transition: right 0.3s ease;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  padding-top: 5rem;
  overflow-y: auto;
`;

const MobileClose = styled.button`
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  background: rgba(0, 0, 0, 0.05);
  border: none;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  color: #0f172a;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(0, 0, 0, 0.1);
    transform: rotate(90deg);
  }
`;

const MobileSection = styled.div`
  margin-bottom: 1.25rem;
`;

const MobileSectionLabel = styled.div`
  font-size: 0.65rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(15, 23, 42, 0.35);
  padding: 0 0.5rem;
  margin-bottom: 0.5rem;
`;

const MobileLink = styled(RouterLink)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 0.5rem;
  color: #0f172a;
  font-weight: 600;
  font-size: 1rem;
  text-decoration: none;
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
  transition: all 0.2s;

  &:last-child {
    border-bottom: none;
  }
  &:hover {
    color: #22c55e;
    transform: translateX(4px);
  }
  &.active {
    color: #15803d;
  }

  svg {
    font-size: 0.75rem;
    opacity: 0.4;
  }
`;

const MobileAuthBtn = styled(RouterLink)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0.85rem;
  background: #0f172a;
  color: white;
  font-weight: 700;
  font-size: 0.95rem;
  text-decoration: none;
  border-radius: 12px;
  margin-bottom: 0.65rem;
  transition: all 0.25s;

  &:hover {
    background: #22c55e;
    color: #0f172a;
  }
`;

const MobileSignOut = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem;
  border-radius: 12px;
  border: 1px solid rgba(15, 23, 42, 0.12);
  background: white;
  color: #64748b;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  margin-bottom: 0.5rem;

  &:hover {
    border-color: rgba(185, 28, 28, 0.3);
    color: #b91c1c;
  }
`;

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [menuOpen]);

  const isActive = (path) => (location.pathname === path ? 'active' : '');

  const displayName = user?.name || user?.email?.split('@')[0] || '';

  return (
    <>
      <NavbarContainer $scrolled={scrolled}>
        <NavWrapper>
          <Logo to="/home">
            <img src="/bloomvestlogo.png" alt="BloomVest" />
          </Logo>

          <NavCenter>
            <NavGroup>
              <NavLink to="/home" className={isActive('/home')}>
                Home
              </NavLink>
              <NavLink to="/marketing-services" className={isActive('/marketing-services')}>
                Services
              </NavLink>
            </NavGroup>
            <NavGroup $highlight>
              <NavLink to="/signals" className={isActive('/signals')}>
                AI Invest Signals
              </NavLink>
              <NavLink to="/scenario" className={isActive('/scenario')}>
                Academy
              </NavLink>
            </NavGroup>
          </NavCenter>

          <NavRight>
            {user ? (
              <UserWrap>
                {displayName && <UserHint title={user.email || ''}>{displayName}</UserHint>}
                <SignOutBtn type="button" onClick={() => signOut()}>
                  <FaSignOutAlt /> Sign out
                </SignOutBtn>
              </UserWrap>
            ) : (
              <SignInLink to="/auth">Sign in</SignInLink>
            )}
            <BookCallBtn to="/contact">Book a call</BookCallBtn>
            <MobileToggle type="button" onClick={() => setMenuOpen(true)} aria-label="Open menu">
              <FaBars />
            </MobileToggle>
          </NavRight>
        </NavWrapper>
      </NavbarContainer>

      <Overlay $open={menuOpen} onClick={() => setMenuOpen(false)} />

      <MobileMenu $open={menuOpen}>
        <MobileClose type="button" onClick={() => setMenuOpen(false)} aria-label="Close menu">
          <FaTimes />
        </MobileClose>

        {user ? (
          <>
            {displayName && (
              <MobileSectionLabel style={{ marginBottom: '0.35rem' }}>Signed in</MobileSectionLabel>
            )}
            <div
              style={{
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#0f172a',
                padding: '0 0.5rem 0.75rem',
                wordBreak: 'break-word',
              }}
            >
              {user.email || displayName}
            </div>
            <MobileSignOut type="button" onClick={() => { signOut(); setMenuOpen(false); }}>
              <FaSignOutAlt /> Sign out
            </MobileSignOut>
          </>
        ) : (
          <MobileAuthBtn to="/auth" onClick={() => setMenuOpen(false)}>
            Sign in
          </MobileAuthBtn>
        )}

        <MobileSection>
          <MobileSectionLabel>Company</MobileSectionLabel>
          <MobileLink to="/home" className={isActive('/home')}>
            Home <FaChevronRight />
          </MobileLink>
          <MobileLink to="/marketing-services" className={isActive('/marketing-services')}>
            Services <FaChevronRight />
          </MobileLink>
        </MobileSection>

        <MobileSection>
          <MobileSectionLabel>Intelligence Tools</MobileSectionLabel>
          <MobileLink to="/signals" className={isActive('/signals')}>
            AI Invest Signals <FaChevronRight />
          </MobileLink>
          <MobileLink to="/scenario" className={isActive('/scenario')}>
            Academy <FaChevronRight />
          </MobileLink>
        </MobileSection>
      </MobileMenu>
    </>
  );
};

export default Navbar;
