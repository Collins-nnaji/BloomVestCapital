import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import AppSidebar from './AppSidebar';
import AppTopBar from './AppTopBar';
import AccountMenu from './AccountMenu';

const SIDEBAR_KEY = 'bv_sidebar_collapsed';

const ShellRoot = styled.div`
  --sb-w: ${p => (p.$collapsed ? '68px' : '248px')};
  min-height: 100vh;
  ${p => p.$copilot && `height: 100vh; overflow: hidden;`}
`;

/* ── desktop sidebar ─────────────────────────────────────────────── */
const Sidebar = styled.aside`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: var(--sb-w);
  z-index: 1100;
  background: #ffffff;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: width 0.22s ease;

  @media (max-width: 1024px) { display: none; }
`;

const SidebarHeader = styled.div`
  height: 64px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: ${p => (p.$collapsed ? 'center' : 'flex-start')};
  padding: ${p => (p.$collapsed ? '0' : '0 1rem')};
  border-bottom: 1px solid #f1f5f9;
`;

const BrandLink = styled(RouterLink)`
  display: flex;
  align-items: center;
  text-decoration: none;
  img { height: 32px; }
`;

const BrandMark = styled(RouterLink)`
  width: 38px;
  height: 38px;
  border-radius: 11px;
  background: linear-gradient(135deg, #0f172a 0%, #1e3a2f 100%);
  color: #fff;
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 800;
  font-size: 1.05rem;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
`;

const SidebarScroll = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 4px; }
`;

/* ── top bar ─────────────────────────────────────────────────────── */
const TopBar = styled.header`
  position: fixed;
  top: 0;
  left: var(--sb-w);
  right: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(15, 23, 42, 0.06);
  transition: left 0.22s ease;

  @media (max-width: 1024px) { left: 0; }
`;

/* ── content ─────────────────────────────────────────────────────── */
const Content = styled.main`
  margin-left: var(--sb-w);
  min-height: 100vh;
  transition: margin-left 0.22s ease;

  ${p => p.$copilot && `
    height: 100vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  `}

  @media (max-width: 1024px) { margin-left: 0; }
`;

/* ── mobile drawer ───────────────────────────────────────────────── */
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(4px);
  z-index: 1150;
  opacity: ${p => (p.$open ? 1 : 0)};
  pointer-events: ${p => (p.$open ? 'all' : 'none')};
  transition: opacity 0.3s ease;

  @media (min-width: 1025px) { display: none; }
`;

const Drawer = styled.div`
  position: fixed;
  top: 0;
  left: ${p => (p.$open ? '0' : '-320px')};
  width: 290px;
  height: 100vh;
  background: #ffffff;
  z-index: 1200;
  transition: left 0.3s ease;
  display: flex;
  flex-direction: column;
  overflow-y: auto;

  @media (min-width: 1025px) { display: none; }
`;

const DrawerHeader = styled.div`
  height: 64px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  border-bottom: 1px solid #f1f5f9;

  img { height: 30px; }
`;

const DrawerClose = styled.button`
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
  &:hover { background: rgba(0, 0, 0, 0.1); transform: rotate(90deg); }
`;

const DrawerAccount = styled.div`
  padding: 1rem;
  border-top: 1px solid #f1f5f9;
  margin-top: auto;
`;

function useCollapsed() {
  const [collapsed, setCollapsed] = useState(() => {
    try { return localStorage.getItem(SIDEBAR_KEY) === '1'; } catch { return false; }
  });
  const toggle = useCallback(() => {
    setCollapsed((c) => {
      const next = !c;
      try { localStorage.setItem(SIDEBAR_KEY, next ? '1' : '0'); } catch { /* ignore */ }
      return next;
    });
  }, []);
  return [collapsed, toggle];
}

const AppShell = ({ children, isCopilot }) => {
  const [collapsed, toggleCollapsed] = useCollapsed();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();

  // Close the mobile drawer on any navigation.
  useEffect(() => { setDrawerOpen(false); }, [location.pathname, location.search]);

  // Lock body scroll while the drawer is open; restore the previous value so
  // we don't fight the copilot full-height lock owned by Layout.
  useEffect(() => {
    if (!drawerOpen) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [drawerOpen]);

  return (
    <ShellRoot $collapsed={collapsed} $copilot={isCopilot}>
      <Sidebar>
        <SidebarHeader $collapsed={collapsed}>
          {collapsed
            ? <BrandMark to="/" aria-label="BloomVest home">B</BrandMark>
            : <BrandLink to="/"><img src="/bloomvestlogo.png" alt="BloomVest" /></BrandLink>}
        </SidebarHeader>
        <SidebarScroll>
          <AppSidebar collapsed={collapsed} />
        </SidebarScroll>
      </Sidebar>

      <TopBar>
        <AppTopBar
          collapsed={collapsed}
          onToggleCollapse={toggleCollapsed}
          onOpenDrawer={() => setDrawerOpen(true)}
        />
      </TopBar>

      <Content $copilot={isCopilot}>{children}</Content>

      <Overlay $open={drawerOpen} onClick={() => setDrawerOpen(false)} />
      <Drawer $open={drawerOpen}>
        <DrawerHeader>
          <RouterLink to="/" onClick={() => setDrawerOpen(false)}>
            <img src="/bloomvestlogo.png" alt="BloomVest" />
          </RouterLink>
          <DrawerClose type="button" onClick={() => setDrawerOpen(false)} aria-label="Close menu">
            <FaTimes />
          </DrawerClose>
        </DrawerHeader>
        <AppSidebar onNavigate={() => setDrawerOpen(false)} />
        <DrawerAccount>
          <AccountMenu variant="inline" onAction={() => setDrawerOpen(false)} />
        </DrawerAccount>
      </Drawer>
    </ShellRoot>
  );
};

export default AppShell;
