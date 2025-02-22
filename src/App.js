import React from 'react';
import './App.css';
import Hero from './components/Hero';
import Services from './components/Services';
import Pricing from './components/Pricing';
import AdditionalServices from './components/AdditionalServices';
import WhyChooseUs from './components/WhyChooseUs';
import Footer from './components/Footer';

function App() {
  return (
    <div className="App">
      <nav className="navbar">
        <div className="container">
          <h1 className="logo">BloomVest Capital</h1>
          <div className="nav-links">
            <a href="#services">Services</a>
            <a href="#pricing">Pricing</a>
            <a href="#why">Why Us</a>
          </div>
        </div>
      </nav>
      
      <Hero />
      <Services />
      <Pricing />
      <AdditionalServices />
      <WhyChooseUs />
      <Footer />
    </div>
  );
}

export default App;