import './Pricing.css';

const Pricing = () => {
  return (
    <div className="pricing-container" style={{ position: 'relative', zIndex: 2 }}>
      <h1 className="pricing-title">Our Plans</h1>
      
      <div className="pricing-boxes">
        {/* Hobby paket */}
        <div className="pricing-box">
          <h2>Hobby</h2>
          <div className="price">38€<span>/month</span></div>
          <ul>
            <li>1 agent</li>
            <li>50 threads with max 50 steps per month</li>
            <li>1 knowledge area</li>
            <li>1 web site scrape</li>
            <li>10 documents in knowledge base</li>
            <li>1 collection form</li>
            <li>Chat threads insights</li>
          </ul>
        </div>
        
        {/* Standard paket */}
        <div className="pricing-box highlighted">
          <div className="popular-tag">Popular</div>
          <h2>Standard</h2>
          <div className="price">150€<span>/month</span></div>
          <ul>
            <li>3 agents</li>
            <li>150 threads with max 100 steps per month per agent</li>
            <li>3 knowledge areas per agent</li>
            <li>3 web sites scrape per agent</li>
            <li>50 documents per agent</li>
            <li>3 collection forms per agent</li>
            <li>Chat threads insights</li>
            <li>Analytics dashboard</li>
            <li>Support through email</li>
          </ul>
        </div>
        
        {/* Professional paket */}
        <div className="pricing-box">
          <h2>Professional</h2>
          <div className="price">500€<span>/month</span></div>
          <ul>
            <li>10 agents</li>
            <li>500 threads with max 100 steps per month per agent</li>
            <li>5 knowledge areas per agent</li>
            <li>5 web sites scrape per agent</li>
            <li>150 documents per agent</li>
            <li>5 collection forms per agent</li>
            <li>Chat threads insights</li>
            <li>Analytics dashboard</li>
            <li>Phone support</li>
            <li>AI feedback gathering and improvements</li>
          </ul>
        </div>
        
        {/* Enterprise paket */}
        <div className="pricing-box">
          <h2>Enterprise</h2>
          <div className="price">Custom<span>/pricing</span></div>
          <ul>
            <li>All Professional features, plus:</li>
            <li>Custom integration and deployment</li>
            <li>SLA (99.9%+)</li>
            <li>Priority support</li>
            <li>Dedicated account manager</li>
            <li>Advanced analytics</li>
            <li>Custom AI agent implementations</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Pricing;