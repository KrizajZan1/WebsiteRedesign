import './ScrollIndicator.css';

const ScrollIndicator = () => {
  return (
    <div className="scroll-indicator">
      <div className="arrow-container">
        <div className="neon-arrow">-----&gt;</div>
      </div>
      <p className="scroll-text">Scroll to continue</p>
    </div>
  );
};

export default ScrollIndicator;