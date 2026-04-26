import React, { Suspense, lazy } from 'react';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import GlobalStyles from './styles/GlobalStyles';
import Layout from './components/Layout';
import Loader from './components/Loader';
import { AuthProvider } from './AuthContext';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const AuthCallback = lazy(() => import('./components/AuthCallback'));
const ScenarioPage = lazy(() => import('./pages/ScenarioPage'));
const MarketingHomepage = lazy(() => import('./pages/MarketingHomepage'));
const MarketingServices = lazy(() => import('./pages/MarketingServices'));
const ContactPage = lazy(() => import('./pages/ContactPage'));

function App() {
  return (
    <ThemeProvider theme={{}}>
      <GlobalStyles />
      <Router>
        <AuthProvider>
          <Suspense fallback={<Loader />}>
            <Layout>
              <Routes>
                {/* Marketing site */}
                <Route path="/" element={<MarketingHomepage />} />
                <Route path="/home" element={<Navigate to="/" replace />} />
                <Route path="/marketing-services" element={<MarketingServices />} />
                <Route path="/contact" element={<ContactPage />} />

                {/* BloomVest Intelligence */}
                <Route path="/signals" element={<Dashboard />} />

                {/* Learn — courses, scenarios & academy */}
                <Route path="/learn" element={<ScenarioPage />} />
                <Route path="/scenario" element={<Navigate to="/learn" replace />} />
                <Route path="/ai-tutor" element={<Navigate to="/learn" replace />} />

                {/* Auth */}
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/auth/callback" element={<AuthCallback />} />

                {/* Catch-all */}
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
