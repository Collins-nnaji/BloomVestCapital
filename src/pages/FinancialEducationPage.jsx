import React from 'react';
import Education from '../components/Education';
import Pricing from '../components/Pricing';
import Resources from '../components/Resources';
import Layout from '../components/Layout';
import Footer from '../components/Footer';

const FinancialEducationPage = () => (
  <Layout>
    <Education />
    <Resources />
    <Pricing />
    <Footer />
  </Layout>
);

export default FinancialEducationPage;