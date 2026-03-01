import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import styled from 'styled-components';

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex-grow: 1;
  margin-top: 80px;
  padding-bottom: env(safe-area-inset-bottom, 0);
  
  @media (max-width: 768px) {
    margin-top: 60px;
    padding-bottom: 2rem;
  }
`;

const Layout = ({ children }) => {
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <PageWrapper>
      <Header />
      <MainContent>
        {children}
      </MainContent>
      <Footer />
    </PageWrapper>
  );
};

export default Layout;