import React, { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import AppShell, { ShellWrapper } from './AppShell';
import OnboardingModal from './OnboardingModal';
import { needsOnboarding } from '../utils/learningState';
import styled from 'styled-components';

// Public paths render with no shell, no navbar, no popup
const PUBLIC_PATHS = ['/', '/auth', '/privacy', '/terms'];

const PublicWrapper = styled.div`
  min-height: 100vh;
`;

const Layout = ({ children }) => {
  const location = useLocation();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const isPublic = PUBLIC_PATHS.some(p =>
    p === '/' ? location.pathname === '/' : location.pathname.startsWith(p)
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    if (isPublic) return;
    if (needsOnboarding()) setShowOnboarding(true);
  }, [location.pathname, isPublic]);

  if (isPublic) {
    return <PublicWrapper>{children}</PublicWrapper>;
  }

  return (
    <ShellWrapper>
      <AppShell>{children}</AppShell>
      <AnimatePresence>
        {showOnboarding && (
          <OnboardingModal key="onboarding" onClose={() => setShowOnboarding(false)} />
        )}
      </AnimatePresence>
    </ShellWrapper>
  );
};

export default Layout;
