import React, { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import OnboardingModal from './OnboardingModal';
import { needsOnboarding } from '../utils/learningState';
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
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const skip = ['/auth', '/privacy', '/terms'].some((p) => location.pathname.startsWith(p));
    if (!skip && needsOnboarding()) {
      setShowOnboarding(true);
    }
  }, [location.pathname]);

  return (
    <PageWrapper>
      <Navbar />
      <MainContent>
        {children}
      </MainContent>
      <Footer />
      <AnimatePresence>
        {showOnboarding && (
          <OnboardingModal key="onboarding" onClose={() => setShowOnboarding(false)} />
        )}
      </AnimatePresence>
    </PageWrapper>
  );
};

export default Layout;