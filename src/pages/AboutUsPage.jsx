import React from 'react';
import About from '../components/About';
import WhyChooseUs from '../components/WhyChooseUs';
import Layout from '../components/Layout';
import Footer from '../components/Footer';

const AboutUsPage = () => (
  <Layout>
    <About />
    <WhyChooseUs />
    <Footer />
  </Layout>
);

export default AboutUsPage;