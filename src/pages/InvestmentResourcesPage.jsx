import React from 'react';
import Resources from '../components/Resources';
import AdditionalServices from '../components/AdditionalServices';
import AIFeatures from '../components/AIFeatures';
import Layout from '../components/Layout';
import Footer from '../components/Footer';

const InvestmentResourcesPage = () => (
  <Layout>
    <Resources />
    <AIFeatures />
    <AdditionalServices />
    <Footer />
  </Layout>
);

export default InvestmentResourcesPage;