import React, { Suspense, lazy } from 'react';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GlobalStyles from './styles/GlobalStyles';
import Layout from './components/Layout';
import Loader from './components/Loader';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const LearnPage = lazy(() => import('./pages/LearnPage'));
const DemoTrading = lazy(() => import('./pages/DemoTrading'));
const AITutor = lazy(() => import('./pages/AITutor'));
const AboutUsPage = lazy(() => import('./pages/AboutUsPage'));


function App() {
  return (
    <ThemeProvider theme={{}}>
      <GlobalStyles />
      <Router>
        <Suspense fallback={<Loader />}>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/learn" element={<LearnPage />} />
              <Route path="/demo" element={<DemoTrading />} />
              <Route path="/ai-tutor" element={<AITutor />} />
              <Route path="/about" element={<AboutUsPage />} />
              <Route path="*" element={<Dashboard />} />
            </Routes>
          </Layout>
        </Suspense>
      </Router>
    </ThemeProvider>
  );
}

export default App;