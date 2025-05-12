import React from 'react';

const Footer = () => {
  const styles = {
    footer: {
      padding: '20px',
      backgroundColor: '#1a1a1a',
      color: 'white',
      position: 'fixed', // Sprememba s 'relative' na 'fixed'
      bottom: 0, // Postavi na dno zaslona
      left: 0, // Raztegni čez celotno širino
      width: '100%', // Raztegni čez celotno širino
      zIndex: 2,
      borderTop: '1px solid rgba(0, 255, 255, 0.3)',
      boxShadow: '0 -5px 20px rgba(0, 255, 255, 0.1)'
    },
    footerContent: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '25px',
      flexWrap: 'wrap',
      maxWidth: '1200px',
      margin: '0 auto'
    },
    logo: {
      height: '35px',
      width: 'auto'
    },
    copyright: {
      margin: 0,
      color: '#00ffff',
      fontSize: '0.9rem'
    }
  };

  const currentYear = new Date().getFullYear();
  
  return (
    <footer style={styles.footer}>      
      <div style={styles.footerContent}>
        <img 
          src="/images/eu.jpg" 
          alt="EU Logo" 
          style={styles.logo} 
        />
        <img 
          src="/images/IfeelSlovenia.png" 
          alt="I Feel Slovenia" 
          style={styles.logo} 
        />
        <img 
          src="/images/slovene_enterprise_fund.png" 
          alt="Slovene Enterprise Fund" 
          style={styles.logo} 
        />
        <img 
          src="/images/MGTS_logo-2023.png" 
          alt="Ministrstvo RS" 
          style={styles.logo} 
        />
        <p style={styles.copyright}>
          © {currentYear} ClerkBot AI. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;