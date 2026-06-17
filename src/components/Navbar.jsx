import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaBars, FaTimes, FaChevronRight } from 'react-icons/fa';
import { NavLink as RouterLink, useLocation } from 'react-router-dom';
import { NAV_ITEMS } from '../config/platform';
import AccountMenu from './AccountMenu';

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

const DesktopAccount = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: 1024px) {
    display: none;
  }
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

const NavCta = styled.a`
  padding: 0.55rem 1.2rem;
  border-radius: 10px;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 0.86rem;
  letter-spacing: -0.011em;
  color: #ffffff;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  text-decoration: none;
  white-space: nowrap;
  transition: transform 0.18s ease, box-shadow 0.18s ease;
  -webkit-font-smoothing: antialiased;

  &:hover { transform: translateY(-1px); box-shadow: 0 8px 20px rgba(34, 197, 94, 0.3); }

  @media (max-width: 1024px) { display: none; }
`;

const MobileCta = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0.85rem;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: #ffffff;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 0.95rem;
  letter-spacing: -0.011em;
  text-decoration: none;
  border-radius: 12px;
  margin-top: 0.85rem;
`;

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

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

  const isActive = (matchPaths) => {
    const paths = Array.isArray(matchPaths) ? matchPaths : [matchPaths];
    return paths.some(
      (p) => location.pathname === p || location.pathname.startsWith(`${p}/`)
    )
      ? 'active'
      : '';
  };

  return (
    <>
      <NavbarContainer $scrolled={scrolled}>
        <NavWrapper>
          <Logo to="/">
            <img src="/bloomvestlogo.png" alt="BloomVest" />
          </Logo>

          <NavCenter>
            <NavGroup>
              {NAV_ITEMS.filter((item) => !item.cta).map((item) => (
                <NavLink key={item.to} to={item.to} className={isActive(item.match)}>
                  {item.label}
                  {item.badge ? <NavBadge>{item.badge}</NavBadge> : null}
                </NavLink>
              ))}
            </NavGroup>
          </NavCenter>

          <NavRight>
            {NAV_ITEMS.filter((item) => item.cta).map((item) => (
              <NavCta key={item.label} href={item.href} target="_blank" rel="noopener noreferrer">
                {item.label}
              </NavCta>
            ))}
            <DesktopAccount>
              <AccountMenu />
            </DesktopAccount>
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

        <AccountMenu variant="inline" onAction={() => setMenuOpen(false)} />

        <MobileSection>
          <MobileSectionLabel>Platform</MobileSectionLabel>
          {NAV_ITEMS.filter((item) => !item.cta).map((item) => (
            <MobileLink key={item.to} to={item.to} className={isActive(item.match)} onClick={() => setMenuOpen(false)}>
              {item.label}
              {item.badge ? ` · ${item.badge}` : ''}
              <FaChevronRight />
            </MobileLink>
          ))}
          {NAV_ITEMS.filter((item) => item.cta).map((item) => (
            <MobileCta key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" onClick={() => setMenuOpen(false)}>
              {item.label}
            </MobileCta>
          ))}
        </MobileSection>
      </MobileMenu>
    </>
  );
};

export default Navbar;
