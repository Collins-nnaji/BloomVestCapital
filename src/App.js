import React from 'react';
import { ThemeProvider } from 'styled-components';
import { GlobalStyles } from './GlobalStyles';
import theme from './theme';

// Import Components
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import Education from './components/Education';
import AIToolSection from './components/AIToolSection';
import AIFeatures from './components/AIFeatures';
import AIAdvisoryIntegration from './components/AIAdvisoryIntegration';
import WhyChooseUs from './components/WhyChooseUs';
import About from './components/About';
import Resources from './components/Resources';
import Pricing from './components/Pricing';
import AdditionalServices from './components/AdditionalServices';
import Contact from './components/Contact';

import Footer from './components/Footer';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Header />
      <Hero />
      <AIToolSection />
      <Services />
      <Education />
      <AIFeatures />
      <WhyChooseUs />
      <AIAdvisoryIntegration />
      <About />
      <Resources />
      <Pricing />
      <AdditionalServices />
      <Contact />
      <Footer />
    </ThemeProvider>
  );
}

export default App;