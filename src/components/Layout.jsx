import React, { useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import AppShell from './AppShell';
import { isAppRoute } from '../config/sidebar';
import styled from 'styled-components';

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  ${(p) =>
    p.$copilot &&
    `
    height: 100vh;
    max-height: 100vh;
    overflow: hidden;
  `}
`;

const MainContent = styled.main`
  flex-grow: 1;
  padding-bottom: env(safe-area-inset-bottom, 0);
  display: flex;
  flex-direction: column;
  min-height: 0;

  ${(p) =>
    p.$copilot &&
    `
    overflow: hidden;
    flex: 1;
    padding-bottom: 0;
  `}

  @media (max-width: 768px) {
    padding-bottom: ${(p) => (p.$copilot ? '0' : '2rem')};
  }
`;

const Layout = ({ children }) => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const isLanding = location.pathname === '/';
  const isApp = isAppRoute(location.pathname);
  const isCopilot =
    location.pathname.startsWith('/iq') && searchParams.get('tab') === 'copilot';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    if (!isCopilot) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isCopilot]);

  if (isApp) {
    return <AppShell isCopilot={isCopilot}>{children}</AppShell>;
  }

  return (
    <PageWrapper $copilot={isCopilot}>
      <Navbar />
      <MainContent $copilot={isCopilot}>{children}</MainContent>
      {!isCopilot && !isLanding && <Footer />}
    </PageWrapper>
  );
};

export default Layout;
