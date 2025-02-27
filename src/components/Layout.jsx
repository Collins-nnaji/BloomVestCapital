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
  margin-top: 80px; // Adjust based on header height
  
  @media (max-width: 1024px) {
    margin-top: 60px;
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