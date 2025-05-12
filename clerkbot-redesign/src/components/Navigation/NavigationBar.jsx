import React from 'react';
import './NavigationBar.css';

const NavigationBar = ({ onNavChange }) => {
  return (
    <nav className="nav-container">
      <div className="nav-links">
        <span onClick={() => onNavChange('home')}>Home</span>
        <span onClick={() => onNavChange('about')}>About</span>
        <span onClick={() => onNavChange('pricing')}>Pricing</span>
        <span onClick={() => onNavChange('contact')}>Contact</span>
      </div>
    </nav>
  );
};

export default NavigationBar;