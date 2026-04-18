import React, { Suspense, lazy } from 'react';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GlobalStyles from './styles/GlobalStyles';
import Layout from './components/Layout';
import Loader from './components/Loader';
import { AuthProvider } from './AuthContext';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const AuthCallback = lazy(() => import('./components/AuthCallback'));
const ScenarioPage = lazy(() => import('./pages/ScenarioPage'));
const AITutor = lazy(() => import('./pages/AITutor'));

function App() {
  return (
    <ThemeProvider theme={{}}>
      <GlobalStyles />
      <Router>
        <AuthProvider>
          <Suspense fallback={<Loader />}>
            <Layout>
              <Routes>
                {/* The Entry */}
                <Route path="/" element={<Dashboard />} />
                
                {/* Legacy / Tools */}
                <Route path="/scenario" element={<ScenarioPage />} />
                <Route path="/ai-tutor" element={<AITutor />} />
                
                {/* Auth */}
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                
                {/* Catch-all */}
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
