import React, { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'
import gsap from 'gsap'

const LINE_PROPERTIES = {
  COLOR: '#00ffff',              // Barva neonskih črt (cyan)
  POINTS_COUNT: 200,             // Število točk na črto (večja vrednost = bolj gladko)
  ANIMATION_DURATION: 2,         // Trajanje animacije (sekunde)
  BREAK_DELAY: 2,                // Premor pred brisanjem črte (sekunde)
  HEAD_SIZE: 0.03,               // Velikost svetlečega dela na konici (0-1)
  MARGIN: 0.05,                  // Dodatni odmik črt izven zaslona
  MIN_BREAK_SIZE: 0.05,          // Minimalna velikost preloma (% širine zaslona)
  MAX_BREAK_SIZE: 0.15           // Maksimalna velikost preloma (% širine zaslona)
};

const NeonLine = ({ delay = 0, verticalZone = 'middle' }) => { // privzete vrednosti če niso podane
  const lineRef = useRef();           // Referenca na 3D objekt črte
  const progressRef = useRef(0);      // Za spremljanje napredka risanja (0-1)
  const fadeRef = useRef(0);          // Za spremljanje napredka brisanja (0-1)
  
  const { viewport } = useThree();
  
  const [linePath, setLinePath] = useState(() => createNewLine(viewport, verticalZone));
  
  function getStartingY(viewport, zone) {
    switch(zone) {
      case 'top':
        return (Math.random() * 0.3 + 0.1) * viewport.height;
      case 'bottom':
        return -(Math.random() * 0.3 + 0.1) * viewport.height;
      default:
        return (Math.random() * 0.6 - 0.3) * viewport.height;
    }
  }
  
  function createNewLine(viewport, verticalZone) {
    const startY = getStartingY(viewport, verticalZone);
    const breaks = createLineBreaks(viewport);
    return generateLinePoints(viewport, startY, breaks);
  }
  
  function createLineBreaks(viewport) {
    const numBreaks = 1 + Math.floor(Math.random() * 2);
    const breaks = [];
    
    for (let i = 0; i < numBreaks; i++) {
      const position = 0.1 + (0.8 / numBreaks) * i + (Math.random() * 0.1);
      
      const direction = Math.random() > 0.5 ? 1 : -1;
      
      const size = viewport.width * 
        (LINE_PROPERTIES.MIN_BREAK_SIZE + Math.random() * 
        (LINE_PROPERTIES.MAX_BREAK_SIZE - LINE_PROPERTIES.MIN_BREAK_SIZE)) * 
        direction;
      
      breaks.push({ position, size });
    }
    
    return breaks.sort((a, b) => a.position - b.position);
  }
  
  function generateLinePoints(viewport, startY, breaks) {
    const points = [];
    const extraMargin = viewport.width * LINE_PROPERTIES.MARGIN;
    const fullWidth = viewport.width + extraMargin * 2;
    
    for (let i = 0; i < LINE_PROPERTIES.POINTS_COUNT; i++) {
      const t = i / (LINE_PROPERTIES.POINTS_COUNT - 1);
      
      const x = -viewport.width / 2 - extraMargin + t * fullWidth;
      
      let y = startY;
      
      for (const breakInfo of breaks) {
        if (t > breakInfo.position) {
          const pastBreak = Math.min((t - breakInfo.position) / 0.2, 1);
          
          y += breakInfo.size * pastBreak;
        }
      }
      
      const safeY = Math.max(
        -viewport.height/2 + extraMargin, 
        Math.min(viewport.height/2 - extraMargin, y)
      );
      
      points.push(new THREE.Vector3(x, safeY, 0));
    }
    
    return {
      points: points,
      positions: new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))
    };
  }
  
  useEffect(() => {
    const timeline = gsap.timeline({
      delay,                  // Začetni zamik
      repeat: -1,             // Neskončno ponavljanje
      repeatDelay: 1,         // Sekunda premora med ponovitvami
      onRepeat: () => {       // Ob vsaki ponovitvi generiramo novo črto
        progressRef.current = 0;
        fadeRef.current = 0;
        setLinePath(createNewLine(viewport, verticalZone));
      }
    });
    
    gsap.set(progressRef, { current: 0 });
    gsap.set(fadeRef, { current: 0 });
    
    timeline.to(progressRef, {
      current: 1,
      duration: LINE_PROPERTIES.ANIMATION_DURATION,
      ease: "power1.inOut"
    });
    
    timeline.to(fadeRef, {
      current: 1.1,  // Malo čez 1 za popoln izbris
      duration: LINE_PROPERTIES.ANIMATION_DURATION,
      delay: LINE_PROPERTIES.BREAK_DELAY,
      ease: "power1.inOut"
    });
    
    return () => timeline.kill();
  }, [viewport, delay, verticalZone]);
  
  useFrame(() => {
    if (!lineRef.current) return;
    
    const geometry = lineRef.current.geometry;
    const colors = geometry.attributes.color.array;
    const totalPoints = geometry.attributes.position.count;
    
    const color = new THREE.Color(LINE_PROPERTIES.COLOR);
    
    for (let i = 0; i < totalPoints; i++) {
      const position = i / (totalPoints - 1);  
      
      let opacity = 0;
      
      if (position <= progressRef.current && position >= fadeRef.current) {
        opacity = 1;
        
        const distanceFromHead = Math.abs(position - progressRef.current);
        const isNearHead = distanceFromHead < LINE_PROPERTIES.HEAD_SIZE && fadeRef.current < 0.1;
        
        if (isNearHead) {
          const whiteFactor = 1 - (distanceFromHead / LINE_PROPERTIES.HEAD_SIZE);
          
          colors[i * 4] = color.r * (1 - whiteFactor) + whiteFactor;     // R
          colors[i * 4 + 1] = color.g * (1 - whiteFactor) + whiteFactor; // G
          colors[i * 4 + 2] = color.b * (1 - whiteFactor) + whiteFactor; // B
        } else {
          colors[i * 4] = color.r;     // R
          colors[i * 4 + 1] = color.g; // G
          colors[i * 4 + 2] = color.b; // B
        }
      } else {
        colors[i * 4] = 0;     // R
        colors[i * 4 + 1] = 0; // G
        colors[i * 4 + 2] = 0; // B
      }
      
      colors[i * 4 + 3] = opacity;
    }
    
    geometry.attributes.position.array.set(linePath.positions);
    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.color.needsUpdate = true;
  });
  
  const initialColors = new Float32Array(linePath.points.length * 4).fill(0);
  
  return (
    <line ref={lineRef}>
      <bufferGeometry>
        <bufferAttribute 
          attach="attributes-position" 
          count={linePath.points.length}
          array={linePath.positions} 
          itemSize={3} 
        />
        <bufferAttribute 
          attach="attributes-color" 
          count={linePath.points.length}
          array={initialColors} 
          itemSize={4} 
        />
      </bufferGeometry>
      <lineBasicMaterial 
        vertexColors 
        transparent={true}
        linewidth={3}
      />
    </line>
  );
};

const NeonLines = () => {
  return (
    <>
      <NeonLine delay={0} verticalZone="middle" /> {/* Prva črta takoj */}
      <NeonLine delay={3} verticalZone="top" />    {/* Druga po 3s */}
      <NeonLine delay={6} verticalZone="bottom" /> {/* Tretja po 6s */}
    </>
  );
};

const Background = (props) => {
  const containerStyle = { 
    position: 'fixed', 
    top: 0, 
    left: 0, 
    width: '100%', 
    height: '100%', 
    backgroundColor: '#1a1a1a',
    zIndex: -1 
  };
  
  return (
    <div style={containerStyle} {...props}>
      <Canvas 
        camera={{ position: [0, 0, 10], fov: 50 }}
        onCreated={({ gl }) => {
          gl.setClearColor('#1a1a1a');
        }}
        gl={{ 
          preserveDrawingBuffer: true,
          antialias: true
        }}
      >
        <NeonLines />
        <EffectComposer> {/* Odgovoren za dodajanje efektov. V našem primeru samo Bloom efekt odgovoren za sijaj neon črt*/}
          <Bloom 
            intensity={1.5}
            luminanceThreshold={0.1}
            luminanceSmoothing={0.9}
            radius={0.8}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
};

export default Background;
