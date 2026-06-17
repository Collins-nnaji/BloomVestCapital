import React from 'react';
import styled from 'styled-components';
import { Link as RouterLink, useLocation, useSearchParams } from 'react-router-dom';
import { SIDEBAR_SECTIONS } from '../config/sidebar';

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  padding: ${p => (p.$collapsed ? '0.75rem 0.5rem' : '0.75rem 0.75rem')};
`;

const GroupLabel = styled.div`
  font-size: 0.62rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #94a3b8;
  padding: 0.85rem 0.65rem 0.4rem;
  white-space: nowrap;
  overflow: hidden;
`;

const Item = styled(RouterLink)`
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: ${p => (p.$collapsed ? '0.6rem' : '0.6rem 0.7rem')};
  justify-content: ${p => (p.$collapsed ? 'center' : 'flex-start')};
  border-radius: 10px;
  text-decoration: none;
  font-family: 'Inter', sans-serif;
  font-size: ${p => (p.$child ? '0.86rem' : '0.9rem')};
  font-weight: ${p => (p.$active ? 600 : 500)};
  letter-spacing: -0.011em;
  color: ${p => (p.$active ? '#0f172a' : '#475569')};
  background: ${p => (p.$active ? 'rgba(16,185,129,0.12)' : 'transparent')};
  transition: color 0.16s ease, background 0.16s ease;
  position: relative;
  -webkit-font-smoothing: antialiased;

  &:hover {
    color: #0f172a;
    background: ${p => (p.$active ? 'rgba(16,185,129,0.14)' : 'rgba(15,23,42,0.04)')};
  }

  svg {
    flex-shrink: 0;
    font-size: ${p => (p.$child ? '0.85rem' : '1rem')};
    color: ${p => (p.$active ? '#10b981' : '#94a3b8')};
  }
`;

const Label = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: ${p => (p.$collapsed ? 'none' : 'inline')};
`;

const ChildList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  margin: 0.1rem 0 0.35rem ${p => (p.$collapsed ? '0' : '0.85rem')};
  padding-left: ${p => (p.$collapsed ? '0' : '0.5rem')};
  border-left: ${p => (p.$collapsed ? 'none' : '1px solid #eef2f7')};
`;

const AppSidebar = ({ collapsed = false, onNavigate }) => {
  const { pathname } = useLocation();
  const [sp] = useSearchParams();
  const tab = sp.get('tab') || 'news';

  const sectionActive = (section) =>
    section.match.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  const childActive = (child) =>
    pathname.startsWith('/iq') && child.tab === tab;

  return (
    <Nav $collapsed={collapsed}>
      {SIDEBAR_SECTIONS.map((section) => {
        const SIcon = section.icon;
        const active = sectionActive(section);

        if (!section.children) {
          return (
            <Item
              key={section.to}
              to={section.to}
              $active={active}
              $collapsed={collapsed}
              onClick={onNavigate}
              title={collapsed ? section.label : undefined}
            >
              <SIcon />
              <Label $collapsed={collapsed}>{section.label}</Label>
            </Item>
          );
        }

        // Section with children (Intelligence). Collapsed rail shows only the
        // tool icons; expanded shows a group label + the full tool list.
        return (
          <React.Fragment key={section.to}>
            {!collapsed && <GroupLabel>{section.label}</GroupLabel>}
            <ChildList $collapsed={collapsed}>
              {section.children.map((child) => {
                const CIcon = child.icon;
                const cActive = childActive(child);
                return (
                  <Item
                    key={child.label}
                    to={child.to}
                    $active={cActive}
                    $collapsed={collapsed}
                    $child
                    onClick={onNavigate}
                    title={collapsed ? child.label : undefined}
                  >
                    <CIcon />
                    <Label $collapsed={collapsed}>{child.label}</Label>
                  </Item>
                );
              })}
            </ChildList>
          </React.Fragment>
        );
      })}
    </Nav>
  );
};

export default AppSidebar;
