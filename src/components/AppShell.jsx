import React, { useState } from 'react';
import styled from 'styled-components';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaGraduationCap, FaBrain, FaRobot, FaSignOutAlt, FaSignInAlt, FaBars, FaTimes } from 'react-icons/fa';
import { useAuth } from '../AuthContext';
import { auth } from '../auth';
const LOGO_SRC = '/bloomvestlogo.png';

const NAV = [
  { to: '/academy', label: 'Academy', icon: FaGraduationCap },
  { to: '/iq', label: 'IQ', icon: FaBrain },
  { to: '/mentor', label: 'Mentor', icon: FaRobot },
];

/* ── layout wrapper ────────────────────────────────── */
export const ShellWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  background: #f8fafc;
`;

/* ── sidebar ───────────────────────────────────────── */
const Sidebar = styled.aside`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 220px;
  background: #ffffff;
  border-right: 1px solid #e8edf3;
  display: flex;
  flex-direction: column;
  z-index: 200;
  transition: transform 0.25s ease;

  @media (max-width: 768px) {
    transform: ${p => p.$open ? 'translateX(0)' : 'translateX(-100%)'};
    box-shadow: ${p => p.$open ? '4px 0 24px rgba(0,0,0,0.12)' : 'none'};
  }
`;

const Overlay = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: ${p => p.$open ? 'block' : 'none'};
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.35);
    z-index: 199;
  }
`;

const LogoArea = styled.div`
  padding: 1.25rem 1.25rem 0.75rem;
  border-bottom: 1px solid #f1f5f9;
  flex-shrink: 0;

  img {
    height: 32px;
    width: auto;
  }
`;

const NavArea = styled.nav`
  flex: 1;
  padding: 0.75rem 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  overflow-y: auto;
`;

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.6rem 0.85rem;
  border-radius: 8px;
  text-decoration: none;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  color: #64748b;
  transition: background 0.15s, color 0.15s;

  svg {
    font-size: 0.9rem;
    flex-shrink: 0;
    opacity: 0.7;
    transition: opacity 0.15s;
  }

  &:hover {
    background: #f1f5f9;
    color: #0f172a;
    svg { opacity: 1; }
  }

  &.active {
    background: #f0fdf4;
    color: #15803d;
    svg { opacity: 1; color: #15803d; }
  }
`;

const Divider = styled.div`
  height: 1px;
  background: #f1f5f9;
  margin: 0.5rem 0.85rem;
`;

const BottomArea = styled.div`
  padding: 0.75rem 0.5rem;
  border-top: 1px solid #f1f5f9;
  flex-shrink: 0;
`;

const AuthBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.6rem 0.85rem;
  border-radius: 8px;
  border: none;
  background: transparent;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  text-align: left;

  svg { font-size: 0.9rem; flex-shrink: 0; opacity: 0.7; }

  &:hover {
    background: #fef2f2;
    color: #dc2626;
    svg { opacity: 1; }
  }
`;

const UserChip = styled.div`
  padding: 0.5rem 0.85rem;
  margin-bottom: 0.25rem;
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  color: #94a3b8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

/* ── mobile toggle ─────────────────────────────────── */
const MobileToggle = styled.button`
  display: none;
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 300;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #0f172a;
  font-size: 1rem;

  @media (max-width: 768px) {
    display: flex;
  }
`;

/* ── main content area ─────────────────────────────── */
export const MainPane = styled.main`
  margin-left: 220px;
  flex: 1;
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

export default function AppShell({ children }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleSignOut = async () => {
    await auth.signOut();
    navigate('/');
  };

  return (
    <>
      <MobileToggle onClick={() => setOpen(o => !o)} aria-label="Toggle menu">
        {open ? <FaTimes /> : <FaBars />}
      </MobileToggle>

      <Overlay $open={open} onClick={() => setOpen(false)} />

      <Sidebar $open={open}>
        <LogoArea as={NavLink} to="/console" style={{ textDecoration: 'none', display: 'block' }}>
          <img src={LOGO_SRC} alt="Bloomvest" />
        </LogoArea>

        <NavArea>
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavItem
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              <Icon />
              {label}
            </NavItem>
          ))}
        </NavArea>

        <BottomArea>
          {user && <UserChip>{user.email}</UserChip>}
          <Divider />
          {user ? (
            <AuthBtn onClick={handleSignOut}>
              <FaSignOutAlt />
              Sign out
            </AuthBtn>
          ) : (
            <AuthBtn onClick={() => { navigate('/auth'); setOpen(false); }} style={{ color: '#15803d' }}>
              <FaSignInAlt />
              Sign in
            </AuthBtn>
          )}
        </BottomArea>
      </Sidebar>

      <MainPane>
        {children}
      </MainPane>
    </>
  );
}
