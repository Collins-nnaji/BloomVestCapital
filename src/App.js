import React, { Suspense, lazy } from 'react';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import GlobalStyles from './styles/GlobalStyles';
import Layout from './components/Layout';
import Loader from './components/Loader';
import { AuthProvider } from './AuthContext';

const HomePage = lazy(() => import('./pages/HomePage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const AuthCallback = lazy(() => import('./components/AuthCallback'));
const LandingPage = lazy(() => import('./pages/LandingPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const EnquiryPage = lazy(() => import('./pages/EnquiryPage'));
const SignalsPage = lazy(() => import('./pages/SignalsPage'));
const ChartSimPage = lazy(() => import('./pages/ChartSimPage'));

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
                <Route path="/console" element={<HomePage />} />
                <Route path="/home" element={<Navigate to="/console" replace />} />
                <Route path="/marketing-services" element={<Navigate to="/" replace />} />
                <Route path="/contact" element={<Navigate to="/" replace />} />

                <Route path="/mentor" element={<Navigate to="/iq?tab=copilot" replace />} />
                <Route path="/iq" element={<Dashboard />} />
                <Route path="/enquiry" element={<EnquiryPage />} />
                <Route path="/signals" element={<SignalsPage />} />
                <Route path="/charts" element={<ChartSimPage />} />

                <Route path="/market" element={<Navigate to="/iq" replace />} />
                <Route path="/trade-ideas" element={<Navigate to="/iq" replace />} />
                <Route path="/calendar" element={<Navigate to="/iq" replace />} />
                <Route path="/ai-tutor" element={<Navigate to="/iq?tab=copilot" replace />} />
                <Route path="/academy" element={<Navigate to="/iq?tab=copilot" replace />} />
                <Route path="/learn" element={<Navigate to="/iq?tab=copilot" replace />} />
                <Route path="/paper-wealth" element={<Navigate to="/iq?tab=copilot" replace />} />
                <Route path="/scenario" element={<Navigate to="/iq?tab=copilot" replace />} />
                <Route path="/wealth" element={<Navigate to="/iq?tab=copilot" replace />} />
                <Route path="/community" element={<Navigate to="/iq?tab=copilot" replace />} />

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
