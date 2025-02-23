import styled from 'styled-components';

// Component imports
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import WhyChooseUs from './components/WhyChooseUs';
import Pricing from './components/Pricing';
import CTA from './components/CTA';
import Footer from './components/Footer';

const MainContent = styled.main`
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden;
`;

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

function App() {
  return (
    <PageContainer>
      <Header />
      <MainContent>
        <Hero />
        <Services />
        <WhyChooseUs />
        <Pricing />
        <CTA />
      </MainContent>
      <Footer />
    </PageContainer>
  );
}

export default App;