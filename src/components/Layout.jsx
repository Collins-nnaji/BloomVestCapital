import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import styled from 'styled-components';

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex-grow: 1;
  padding-bottom: env(safe-area-inset-bottom, 0);
  
  @media (max-width: 768px) {
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
      <Navbar />
      <MainContent>
        {children}
      </MainContent>
      <Footer />
    </PageWrapper>
  );
};

export default Layout;