import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FaBars, FaTimes, FaChevronRight, FaSignOutAlt } from 'react-icons/fa';
import { NavLink as RouterLink, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { NAV_ITEMS } from '../config/platform';

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
    `box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);`}
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
  gap: 0.25rem;
`;

const NavLink = styled(RouterLink)`
  font-family: 'Inter', sans-serif;
  color: #475569;
  font-size: 0.9rem;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.18s ease, background 0.18s ease;
  padding: 0.5rem 0.9rem;
  border-radius: 9px;
  white-space: nowrap;
  position: relative;
  letter-spacing: -0.011em;
  -webkit-font-smoothing: antialiased;

  &::after {
    content: '';
    position: absolute;
    bottom: 0.1rem;
    left: 50%;
    width: 0;
    height: 2px;
    border-radius: 2px;
    background: #10b981;
    transform: translateX(-50%);
    transition: width 0.2s ease;
  }

  &:hover {
    color: #0f172a;
    background: rgba(15, 23, 42, 0.04);
  }

  &.active {
    color: #0f172a;
    background: transparent;
    font-weight: 600;
    &::after { width: calc(100% - 1.8rem); }
  }
`;

const NavBadge = styled.span`
  font-size: 0.58rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  padding: 0.12rem 0.35rem;
  border-radius: 4px;
  margin-left: 0.25rem;
  background: rgba(245, 158, 11, 0.15);
  color: #b45309;
  vertical-align: middle;
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
  padding: 0.55rem 1.15rem;
  border-radius: 10px;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 0.86rem;
  letter-spacing: -0.011em;
  color: #0f172a;
  border: 1px solid rgba(15, 23, 42, 0.14);
  background: white;
  text-decoration: none;
  transition: all 0.2s ease;
  white-space: nowrap;
  -webkit-font-smoothing: antialiased;

  &:hover {
    border-color: rgba(34, 197, 94, 0.45);
    color: #15803d;
    background: rgba(34, 197, 94, 0.06);
  }

  @media (max-width: 1024px) {
    display: none;
  }
`;

/* ── Avatar dropdown ─────────────────────────────────────────────── */
const AvatarWrap = styled.div`
  position: relative;

  @media (max-width: 1024px) {
    display: none;
  }
`;

const AvatarBtn = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0f172a 0%, #1e3a2f 100%);
  border: 2px solid rgba(34, 197, 94, 0.35);
  color: #fff;
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.01em;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    border-color: rgba(34, 197, 94, 0.7);
    box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.12);
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  background: #fff;
  border: 1px solid rgba(15, 23, 42, 0.09);
  border-radius: 14px;
  box-shadow: 0 8px 32px rgba(15, 23, 42, 0.12);
  min-width: 210px;
  padding: 0.5rem;
  z-index: 2000;
  opacity: ${p => p.$open ? 1 : 0};
  pointer-events: ${p => p.$open ? 'all' : 'none'};
  transform: ${p => p.$open ? 'translateY(0)' : 'translateY(-6px)'};
  transition: opacity 0.18s ease, transform 0.18s ease;
`;

const DropdownProfile = styled.div`
  padding: 0.65rem 0.85rem 0.75rem;
  border-bottom: 1px solid #f1f5f9;
  margin-bottom: 0.4rem;
`;

const DropdownName = styled.div`
  font-family: 'Inter', sans-serif;
  font-size: 0.88rem;
  font-weight: 600;
  letter-spacing: -0.011em;
  color: #0f172a;
  margin-bottom: 0.15rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const DropdownEmail = styled.div`
  font-size: 0.72rem;
  color: #94a3b8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const DropdownSignOut = styled.button`
  display: flex;
  align-items: center;
  gap: 0.55rem;
  width: 100%;
  padding: 0.6rem 0.85rem;
  border: none;
  border-radius: 9px;
  background: transparent;
  color: #64748b;
  font-size: 0.83rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    background: rgba(239, 68, 68, 0.07);
    color: #dc2626;
  }

  svg { font-size: 0.8rem; }
`;

/* ── Mobile ─────────────────────────────────────────────────────── */
const MobileToggle = styled.button`
  display: none;
  background: transparent;
  border: none;
  color: #0f172a;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.35rem;
  transition: color 0.2s;

  &:hover { color: #22c55e; }

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
  padding: 0.8rem 0.65rem;
  color: #1e293b;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 0.98rem;
  letter-spacing: -0.011em;
  text-decoration: none;
  border-radius: 9px;
  transition: all 0.18s ease;
  -webkit-font-smoothing: antialiased;

  &:hover { color: #0f172a; background: rgba(15, 23, 42, 0.04); }
  &.active { color: #15803d; font-weight: 600; background: rgba(34, 197, 94, 0.08); }

  svg { font-size: 0.7rem; opacity: 0.35; }
`;

const MobileAuthBtn = styled(RouterLink)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0.85rem;
  background: #0f172a;
  color: white;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 0.95rem;
  letter-spacing: -0.011em;
  text-decoration: none;
  border-radius: 12px;
  margin-bottom: 0.65rem;
  transition: all 0.25s;

  &:hover { background: #22c55e; color: #0f172a; }
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

  &:hover { border-color: rgba(185, 28, 28, 0.3); color: #b91c1c; }
`;

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [menuOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const isActive = (matchPaths) => {
    const paths = Array.isArray(matchPaths) ? matchPaths : [matchPaths];
    return paths.some(
      (p) => location.pathname === p || location.pathname.startsWith(`${p}/`)
    )
      ? 'active'
      : '';
  };

  const displayName = user?.name || user?.email?.split('@')[0] || '';
  const initials = displayName
    ? displayName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <>
      <NavbarContainer $scrolled={scrolled}>
        <NavWrapper>
          <Logo to="/">
            <img src="/bloomvestlogo.png" alt="BloomVest" />
          </Logo>

          <NavCenter>
            <NavGroup>
              {NAV_ITEMS.map((item) => (
                <NavLink key={item.to} to={item.to} className={isActive(item.match)}>
                  {item.label}
                  {item.badge ? <NavBadge>{item.badge}</NavBadge> : null}
                </NavLink>
              ))}
            </NavGroup>
          </NavCenter>

          <NavRight>
            {user ? (
              <AvatarWrap ref={dropdownRef}>
                <AvatarBtn
                  type="button"
                  onClick={() => setDropdownOpen(o => !o)}
                  aria-label="Account menu"
                >
                  {initials}
                </AvatarBtn>
                <DropdownMenu $open={dropdownOpen}>
                  <DropdownProfile>
                    <DropdownName>{displayName}</DropdownName>
                    {user.email && <DropdownEmail>{user.email}</DropdownEmail>}
                  </DropdownProfile>
                  <DropdownSignOut
                    type="button"
                    onClick={() => { setDropdownOpen(false); signOut(); }}
                  >
                    <FaSignOutAlt /> Sign out
                  </DropdownSignOut>
                </DropdownMenu>
              </AvatarWrap>
            ) : (
              <SignInLink to="/auth">Sign in</SignInLink>
            )}
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
            <MobileSectionLabel style={{ marginBottom: '0.35rem' }}>Signed in as</MobileSectionLabel>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', padding: '0 0.5rem 0.75rem', wordBreak: 'break-word' }}>
              {displayName}{user.email && displayName !== user.email && (
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 500, marginTop: '0.1rem' }}>{user.email}</div>
              )}
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
          <MobileSectionLabel>Platform</MobileSectionLabel>
          {NAV_ITEMS.map((item) => (
            <MobileLink key={item.to} to={item.to} className={isActive(item.match)} onClick={() => setMenuOpen(false)}>
              {item.label}
              {item.badge ? ` · ${item.badge}` : ''}
              <FaChevronRight />
            </MobileLink>
          ))}
        </MobileSection>
      </MobileMenu>
    </>
  );
};

export default Navbar;
