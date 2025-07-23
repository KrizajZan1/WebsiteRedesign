import React, { useState } from 'react';
import Background from './components/Background';
import NavigationBar from './components/Navigation/NavigationBar';
import MainContent from './components/MainContent';
import Pricing from './components/Navigation/Pricing/Pricing';
import About from './components/Navigation/About/About';
import Footer from './components/Footer';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
    
  // Function to change page
  const handleNavChange = (page) => {
    // First clean up any ScrollTrigger instances
    if (window.gsap && window.gsap.ScrollTrigger) {
      window.gsap.ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    }
    
    // Če je izbran contact, odpri ClerkBot widget
    if (page === 'contact') {
      const widget = document.getElementById('clerkbot-chat-widget');
      if (widget) {
        // Klikni na koordinate kjer je chat ikona
        const widgetRect = widget.getBoundingClientRect();
        const x = widgetRect.right - 30; // 30px od desne strani
        const y = widgetRect.bottom - 30; // 30px od spodaj
        
        const elementAtPoint = document.elementFromPoint(x, y);
        if (elementAtPoint) {
          elementAtPoint.click();
        }
      }
      
      return;
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
      <Background />
      <NavigationBar onNavChange={handleNavChange} />
      {renderPage()}
      <Footer />
    </>
  );
}

export default App;
