import React from 'react';
import './Pricing.css';

const Pricing = () => {
  return (
    <div className="pricing-container" style={{ position: 'relative', zIndex: 2 }}>
      <h1 className="pricing-title">Our Plans</h1>
      
      <div className="pricing-boxes">
        {/* Prvi pravokotnik */}
        <div className="pricing-box">
          <h2>Basic</h2>
          <div className="price">$9.99<span>/month</span></div>
          <ul>
            <li>Basic AI features</li>
            <li>5 requests per day</li>
            <li>Email support</li>
            <li>Basic documentation</li>
          </ul>
          <button className="pricing-button">Select Plan</button>
        </div>
        
        {/* Drugi pravokotnik */}
        <div className="pricing-box highlighted">
          <div className="popular-tag">Popular</div>
          <h2>Professional</h2>
          <div className="price">$24.99<span>/month</span></div>
          <ul>
            <li>Advanced AI features</li>
            <li>25 requests per day</li>
            <li>Priority support</li>
            <li>Complete documentation</li>
            <li>API access</li>
          </ul>
          <button className="pricing-button">Select Plan</button>
        </div>
        
        {/* Tretji pravokotnik */}
        <div className="pricing-box">
          <h2>Enterprise</h2>
          <div className="price">$49.99<span>/month</span></div>
          <ul>
            <li>Full AI capabilities</li>
            <li>Unlimited requests</li>
            <li>24/7 dedicated support</li>
            <li>Custom integration</li>
            <li>Advanced analytics</li>
            <li>Team accounts</li>
          </ul>
          <button className="pricing-button">Contact Sales</button>
        </div>
      </div>
    </div>
  );
};

export default Pricing;