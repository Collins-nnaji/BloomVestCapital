import React, { Suspense, lazy } from 'react';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GlobalStyles } from './GlobalStyles';
import theme from './theme';
import Layout from './components/Layout';
import Loader from './components/Loader';

// Lazy load pages for better performance
const MainDashboardPage = lazy(() => import('./pages/MainDashboardPage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const EducationPage = lazy(() => import('./pages/EducationPage'));
const AboutUsPage = lazy(() => import('./pages/AboutUsPage'));
const HybridAdvisoryPage = lazy(() => import('./pages/HybridAdvisoryPage'));

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Router>
        <Suspense fallback={<Loader />}>
          <Layout>
            <Routes>
              <Route path="/" element={<MainDashboardPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/education" element={<EducationPage />} />
              <Route path="/about" element={<AboutUsPage />} />
              <Route path="/hybrid-advisory" element={<ServicesPage />} />
              {/* Add a 404 page if needed */}
              <Route path="*" element={<MainDashboardPage />} />
            </Routes>
          </Layout>
        </Suspense>
      </Router>
    </ThemeProvider>
  );
}

export default App;