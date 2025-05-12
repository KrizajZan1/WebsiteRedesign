import React, { useState, useEffect } from 'react';
import Background from './components/Background';
import NavigationBar from './components/Navigation/NavigationBar';
import MainContent from './components/MainContent';
import Pricing from './components/Navigation/Pricing/Pricing';
import About from './components/Navigation/About/About';
import Footer from './components/Footer';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  
  // Force background refresh when changing pages
  useEffect(() => {
    // Ensure the background is visible
    const bgElement = document.querySelector('[data-component="background"]');
    if (bgElement) {
      bgElement.style.display = 'block';
    }
  }, [currentPage]);
  
  // Function to change page
  const handleNavChange = (page) => {
    // First clean up any ScrollTrigger instances
    if (window.gsap && window.gsap.ScrollTrigger) {
      window.gsap.ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    }
    
    setCurrentPage(page);
  };
  
  // Function to display appropriate page
  const renderPage = () => {
    switch(currentPage) {
      case 'home':
        return <MainContent />;
      case 'pricing':
        return <Pricing />;
      case 'about':
        return <About />;
      default:
        return <MainContent />;
    }
  };
  
  return (
    <>
      <Background data-component="background" />
      <NavigationBar onNavChange={handleNavChange} />
      {renderPage()}
      <Footer />
    </>
  );
}

export default App;
