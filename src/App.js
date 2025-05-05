import React, { Suspense, lazy } from 'react';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GlobalStyles from './styles/GlobalStyles';
import Layout from './components/Layout';
import Loader from './components/Loader';

// Lazy load pages for better performance
const MainDashboardPage = lazy(() => import('./pages/MainDashboardPage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const CaseStudiesAndInsightsPage = lazy(() => import('./pages/CaseStudiesAndInsightsPage'));
const AboutUsPage = lazy(() => import('./pages/AboutUsPage'));


function App() {
  return (
    <ThemeProvider theme={{}}>
      <GlobalStyles />
      <Router>
        <Suspense fallback={<Loader />}>
          <Layout>
            <Routes>
              <Route path="/" element={<MainDashboardPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/insights" element={<CaseStudiesAndInsightsPage />} />
              <Route path="/about" element={<AboutUsPage />} />

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