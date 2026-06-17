import React from 'react';
import styled from 'styled-components';
import { Link as RouterLink } from 'react-router-dom';
import { FaBars, FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import AccountMenu from './AccountMenu';

const Row = styled.div`
  height: 64px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0 1.5rem;

  @media (max-width: 1024px) {
    padding: 0 1rem;
  }
`;

const IconBtn = styled.button`
  background: transparent;
  border: none;
  color: #475569;
  font-size: 1.1rem;
  cursor: pointer;
  width: 36px;
  height: 36px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: color 0.18s ease, background 0.18s ease;

  &:hover { color: #0f172a; background: rgba(15, 23, 42, 0.05); }
`;

const CollapseBtn = styled(IconBtn)`
  @media (max-width: 1024px) { display: none; }
`;

const Hamburger = styled(IconBtn)`
  display: none;
  @media (max-width: 1024px) { display: flex; }
`;

const MobileLogo = styled(RouterLink)`
  display: none;
  align-items: center;
  text-decoration: none;

  img { height: 30px; }

  @media (max-width: 1024px) { display: flex; }
`;

const Spacer = styled.div`
  flex: 1;
`;

const AppTopBar = ({ collapsed, onToggleCollapse, onOpenDrawer }) => (
  <Row>
    <CollapseBtn
      type="button"
      onClick={onToggleCollapse}
      aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
    >
      {collapsed ? <FaAngleRight /> : <FaAngleLeft />}
    </CollapseBtn>
    <Hamburger type="button" onClick={onOpenDrawer} aria-label="Open menu">
      <FaBars />
    </Hamburger>
    <MobileLogo to="/">
      <img src="/bloomvestlogo.png" alt="BloomVest" />
    </MobileLogo>
    <Spacer />
    <AccountMenu />
  </Row>
);

export default AppTopBar;
