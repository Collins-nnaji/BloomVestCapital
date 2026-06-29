import React, { Suspense, lazy } from 'react';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import GlobalStyles from './styles/GlobalStyles';
import Layout from './components/Layout';
import Loader from './components/Loader';
import { AuthProvider } from './AuthContext';

const AuthPage = lazy(() => import('./pages/AuthPage'));
const AuthCallback = lazy(() => import('./components/AuthCallback'));
const LandingPage = lazy(() => import('./pages/LandingPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const EnquiryPage = lazy(() => import('./pages/EnquiryPage'));

function App() {
  return (
    <ThemeProvider theme={{}}>
      <GlobalStyles />
      <Router>
        <AuthProvider>
          <Suspense fallback={<Loader />}>
            <Layout>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/enquiry" element={<EnquiryPage />} />

                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/auth/callback" element={<AuthCallback />} />

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
          </Suspense>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
