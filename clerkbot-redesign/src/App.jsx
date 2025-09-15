import React, { useState } from 'react';
import Background from './components/Background';
import NavigationBar from './components/Navigation/NavigationBar';
import MainContent from './components/MainContent';
import Pricing from './components/Navigation/Pricing/Pricing';
import About from './components/Navigation/About/About';
import Footer from './components/Footer';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
    
  // Funkcija za odpiranje chat widget-a
  const handleOpenChat = () => {
    const widget = document.getElementById('clerkbot-chat-widget');
    if (widget) {
      const widgetRect = widget.getBoundingClientRect();
      const x = widgetRect.right - 30;
      const y = widgetRect.bottom - 30;
      
      const elementAtPoint = document.elementFromPoint(x, y);
      if (elementAtPoint) {
        elementAtPoint.click();
      }
    }
  };

  const handleNavChange = (page) => {    
    if (page === 'contact') {
      handleOpenChat();
      return;
    }
    
    setCurrentPage(page);
  };
  
  const renderPage = () => {
    switch(currentPage) {
      case 'home':
        return <MainContent onOpenChat={handleOpenChat} />;
      case 'pricing':
        return <Pricing />;
      case 'about':
        return <About />;
      default:
        return <MainContent onOpenChat={handleOpenChat} />;
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