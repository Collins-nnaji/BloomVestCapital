import React, { Suspense, lazy } from 'react';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GlobalStyles from './styles/GlobalStyles';
import Layout from './components/Layout';
import Loader from './components/Loader';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './AuthContext';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const LearnPage = lazy(() => import('./pages/LearnPage'));
const DemoTrading = lazy(() => import('./pages/DemoTrading'));
const AITutor = lazy(() => import('./pages/AITutor'));
const AboutUsPage = lazy(() => import('./pages/AboutUsPage'));
const ScenarioPage = lazy(() => import('./pages/ScenarioPage'));
const PricingPage = lazy(() => import('./pages/PricingPage'));
const AuthPage = lazy(() => import('./pages/AuthPage'));

function App() {
  return (
    <ThemeProvider theme={{}}>
      <GlobalStyles />
      <Router>
        <AuthProvider>
          <Suspense fallback={<Loader />}>
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/auth/callback" element={<Dashboard />} />
                <Route path="/learn" element={<ProtectedRoute><LearnPage /></ProtectedRoute>} />
                <Route path="/demo" element={<ProtectedRoute><DemoTrading /></ProtectedRoute>} />
                <Route path="/ai-tutor" element={<ProtectedRoute><AITutor /></ProtectedRoute>} />
                <Route path="/about" element={<ProtectedRoute><AboutUsPage /></ProtectedRoute>} />
                <Route path="/scenario" element={<ProtectedRoute><ScenarioPage /></ProtectedRoute>} />
                <Route path="/pricing" element={<ProtectedRoute><PricingPage /></ProtectedRoute>} />
                <Route path="/billing/success" element={<ProtectedRoute><PricingPage /></ProtectedRoute>} />
                <Route path="*" element={<Dashboard />} />
              </Routes>
            </Layout>
          </Suspense>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
