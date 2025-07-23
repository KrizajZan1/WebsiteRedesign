import React, { useState } from 'react';
import './NavigationBar.css';

const NavigationBar = ({ onNavChange }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (page) => {
    onNavChange(page);
    setIsMobileMenuOpen(false); // Close menu on selection
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="nav-container">
      {/* Hamburger button for mobile devices */}
      <button 
        className="hamburger-button"
        onClick={toggleMobileMenu}
        aria-label="Toggle menu"
      >
        ☰
      </button>

      {/* Navigation links */}
      <div className={`nav-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <span onClick={() => handleNavClick('home')}>Home</span>
        <span onClick={() => handleNavClick('about')}>About</span>
        <span onClick={() => handleNavClick('pricing')}>Pricing</span>
        <span onClick={() => handleNavClick('contact')}>Contact</span>
      </div>
    </nav>
  );
};

export default NavigationBar;