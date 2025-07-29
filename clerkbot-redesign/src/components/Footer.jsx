import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">      
      <div className="footer-content">
        <div className="footer-logos">
          <img 
            src="/images/eu.jpg" 
            alt="EU Logo" 
            className="footer-logo" 
          />
          <img 
            src="/images/IfeelSlovenia.jpg" 
            alt="I Feel Slovenia" 
            className="footer-logo" 
          />
          <img 
            src="/images/slovene_enterprise_fund.png" 
            alt="Slovene Enterprise Fund" 
            className="footer-logo" 
          />
          <img 
            src="/images/MGTS_logo-2023.png" 
            alt="Ministrstvo RS" 
            className="footer-logo" 
          />
        </div>
        <p className="footer-copyright">
          © {currentYear} ClerkBot AI. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;