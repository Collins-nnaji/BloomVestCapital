import { ThemeProvider } from 'styled-components';
import { theme } from './theme';
import { GlobalStyles } from './GlobalStyles';
import Header from './components/Header';
import Hero from './components/Hero';
import WhyChooseUs from './components/WhyChooseUs';
import Services from './components/Services';
import Pricing from './components/Pricing';
import AdditionalServices from './components/AdditionalServices';
import Footer from './components/Footer';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Header />
      <main>
        <Hero />
        <WhyChooseUs />
        <Services />
        <Pricing />
        <AdditionalServices />
      </main>
      <Footer />
    </ThemeProvider>
  );
}

export default App;