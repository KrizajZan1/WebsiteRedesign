import { useState, useEffect } from 'react';

const Background = () => {
  const [lines, setLines] = useState([]);
  let lineCounter = 0;

  const createLine = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const yPositions = [height * 0.2, height * 0.4, height * 0.6, height * 0.8];
    const startY = yPositions[Math.floor(Math.random() * 4)];
    const bends = Math.floor(Math.random() * 4);
    
    let path = `M 0 ${startY}`;
    let currentY = startY;
    
    for (let i = 0; i < bends; i++) {
      const bendX = (width / (bends + 1)) * (i + 1);      
      path += ` L ${bendX} ${currentY}`;
      
      const direction = Math.random() > 0.5 ? 1 : -1;
      const bendSize = 50 + Math.random() * 50;
      currentY += direction * bendSize;
      currentY = Math.max(50, Math.min(height - 50, currentY));
      
      path += ` L ${bendX + bendSize} ${currentY}`;
    }
    
    path += ` L ${width} ${currentY}`;
    
    return {
      id: ++lineCounter,
      path,
      length: width + bends * 100,
      duration: 2.5 + Math.random() * 1.5
    };
  };

  const addLine = () => {
    if (lines.length >= 4) return;
    
    const newLine = createLine();
    setLines(prev => [...prev, newLine]);
    
    setTimeout(() => {
      setLines(prev => prev.filter(line => line.id !== newLine.id));
    }, 7000);
  };

  useEffect(() => {
    const timer = setInterval(addLine, 3000);
    addLine();
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: '100vw', 
      height: '100vh', 
      zIndex: -1, 
      background: '#1a1a1a' 
    }}>
      <style>{`
        .line {
          fill: none;
          stroke: #00ffff;
          stroke-width: 2px;
          stroke-linecap: round;
          stroke-dasharray: var(--len);
          stroke-dashoffset: var(--len);
          animation: 
            draw var(--dur) ease-out forwards,
            fade 1.5s ease-in calc(var(--dur) + 1s) forwards;
        }
        
        @keyframes draw {
          to { stroke-dashoffset: 0; opacity: 0.8; }
        }
        @keyframes fade {
          to { stroke-dashoffset: calc(-1 * var(--len)); opacity: 0; }
        }
      `}</style>
      
      <svg width="100%" height="100%">
        {lines.map(line => (
          <path
            key={line.id}
            d={line.path}
            className="line"
            style={{
              '--len': `${line.length}px`,
              '--dur': `${line.duration}s`
            }}
          />
        ))}
      </svg>
    </div>
  );
};

export default Background;