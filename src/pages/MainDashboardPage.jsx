import React from 'react';
import Hero from '../components/Hero';
import AIToolSection from '../components/AIToolSection';
import Services from '../components/Services';
import AIAdvisoryIntegration from '../components/AIAdvisoryIntegration';
import Contact from '../components/Contact';
import Layout from '../components/Layout';
import Footer from '../components/Footer';

const MainDashboardPage = () => (
  <Layout>
    <Hero />
    <Services />
    <AIToolSection />
    <AIAdvisoryIntegration />
    <Contact />
    <Footer />
  </Layout>
);

export default MainDashboardPage;