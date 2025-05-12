import React, { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'
import gsap from 'gsap'

// Komponenta za neonsko črto z naključno generirano potjo
const NeonLine = ({ delay = 0, verticalZone = 'middle' }) => {
  const lineRef = useRef()
  const progressRef = useRef(0)  // Za animacijo risanja
  const fadeRef = useRef(0)      // Za animacijo brisanja
  const { viewport } = useThree() // Dobimo dimenzije viewport-a
  
  // State za shranjevanje trenutne poti
  const [linePath, setLinePath] = useState(() => generateNewPath(viewport, verticalZone))
  
  // Konstanta za barvo
  const neonColor = '#00ffff'; // Cyan
  
  // Funkcija za generiranje nove naključne poti z več prelomi
  function generateNewPath(viewport, verticalZone) {
    // Naključna začetna y pozicija glede na vertikalno območje
    let startY;
    if (verticalZone === 'top') {
      startY = (Math.random() * 0.3 + 0.1) * viewport.height;
    } else if (verticalZone === 'bottom') {
      startY = -(Math.random() * 0.3 + 0.1) * viewport.height;
    } else { // middle
      startY = (Math.random() * 0.6 - 0.3) * viewport.height;
    }
    
    // Določimo število prelomov (1-2)
    const numBreaks = Math.floor(Math.random() * 2) + 1;
    
    // Izračunamo pozicije prelomov
    const breakPositions = [];
    for (let i = 0; i < numBreaks; i++) {
      // Enakomerno razporedimo prelome po širini
      const position = 0.1 + (0.8 / numBreaks) * i + (Math.random() * 0.1);
      breakPositions.push(position);
    }
    
    // Sortiramo pozicije od najmanjše do največje
    breakPositions.sort((a, b) => a - b);
    
    // Za vsak prelom določimo smer (gor/dol) in velikost
    const breaks = breakPositions.map(position => {
      const direction = Math.random() > 0.5 ? 1 : -1;
      const size = viewport.width * (0.05 + Math.random() * 0.15) * direction;
      return { position, size };
    });
    
    // Generiramo točke
    const linePoints = [];
    const numPoints = 200; // Še več točk za bolj gladko animacijo
    
    // Dodatni odmik izven zaslona
    const extraMargin = viewport.width * 0.05;
    
    for (let i = 0; i < numPoints; i++) {
      const t = i / (numPoints - 1);
      
      // Celotna širina z dodatnim odmikom
      const fullWidth = viewport.width + extraMargin * 2;
      
      // Osnovna x pozicija od leve proti desni
      const baseX = -viewport.width / 2 - extraMargin + t * fullWidth;
      
      // Začnemo z osnovno y pozicijo
      let y = startY;
      
      // Apliciramo vse prelome
      for (const breakInfo of breaks) {
        if (t > breakInfo.position) {
          // Izračunamo, koliko smo čez prelom (0-1, maksimalno v 0.2 razdalje)
          const beyondBreak = Math.min((t - breakInfo.position) / 0.2, 1);
          
          // Dodamo odmik za y glede na velikost preloma
          y += breakInfo.size * beyondBreak;
        }
      }
      
      // Poskrbimo, da črta ostane v vidnem območju
      const safeY = Math.max(
        -viewport.height/2 + extraMargin, 
        Math.min(viewport.height/2 - extraMargin, y)
      );
      
      linePoints.push(new THREE.Vector3(baseX, safeY, 0));
    }
    
    return {
      points: linePoints,
      positions: new Float32Array(linePoints.flatMap(p => [p.x, p.y, p.z]))
    };
  }
  
  // Ponavljajoča animacija
  useEffect(() => {
    // Ustvarimo časovnico z GSAP
    const timeline = gsap.timeline({
      delay,            // Začetni zamik
      repeat: -1,       // Neskončno ponavljanje
      repeatDelay: 1,   // 1 sekunda premora med ponovitvami
      onRepeat: () => {
        // Ob vsaki ponovitvi generiramo novo pot (barva ostane enaka)
        progressRef.current = 0;
        fadeRef.current = 0;
        
        // Generiramo novo pot
        setLinePath(generateNewPath(viewport, verticalZone));
      }
    });
    
    // Začnemo z nevidno črto
    gsap.set(progressRef, { current: 0 });
    gsap.set(fadeRef, { current: 0 });
    
    // Animacija risanja
    timeline.to(progressRef, {
      current: 1,
      duration: 2,
      ease: "power1.inOut"
    });
    
    // Po 2 sekundah začnemo brisanje
    timeline.to(fadeRef, {
      current: 1.1, // Gremo rahlo čez 1, da zagotovimo popoln izbris
      duration: 2,
      delay: 2,  // 2s premor po popolnem izrisu
      ease: "power1.inOut"
    });
    
    return () => timeline.kill(); // Očistimo časovnico ob unmount
  }, [viewport, delay, verticalZone]);
  
  // Posodabljanje črte v vsakem frame-u
  useFrame(() => {
    if (!lineRef.current) return;
    
    const geometry = lineRef.current.geometry;
    const colors = geometry.attributes.color.array;
    const totalPoints = geometry.attributes.position.count;
    
    // Pretvorimo barvo v RGB
    const color = new THREE.Color(neonColor);
    
    for (let i = 0; i < totalPoints; i++) {
      const t = i / (totalPoints - 1);  // Normaliziran položaj točke (0-1)
      
      // Nastavimo privzeto na nevidno
      let opacity = 0;
      
      // Točka je vidna samo, če je med progress in fade
      if (t <= progressRef.current && t >= fadeRef.current) {
        opacity = 1; // Popolnoma vidno
        
        // Dodamo učinek bele "glave" risanja
        const headDistance = Math.abs(t - progressRef.current);
        const isNearHead = headDistance < 0.03 && fadeRef.current < 0.1;
        
        if (isNearHead) {
          // Bela barva za "glavo" risanja
          const whiteFactor = 1 - (headDistance / 0.03);
          colors[i * 4] = color.r * (1 - whiteFactor) + whiteFactor;     // R
          colors[i * 4 + 1] = color.g * (1 - whiteFactor) + whiteFactor; // G
          colors[i * 4 + 2] = color.b * (1 - whiteFactor) + whiteFactor; // B
        } else {
          // Normalna barva
          colors[i * 4] = color.r;     // R
          colors[i * 4 + 1] = color.g; // G
          colors[i * 4 + 2] = color.b; // B
        }
      } else {
        // Nevidna črta
        colors[i * 4] = 0;     // R
        colors[i * 4 + 1] = 0; // G
        colors[i * 4 + 2] = 0; // B
      }
      
      colors[i * 4 + 3] = opacity; // A (vidnost)
    }
    
    // Posodobimo pozicije in barve
    geometry.attributes.position.array.set(linePath.positions);
    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.color.needsUpdate = true;
  });
  
  // Pripravimo barve
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

// Več neonskih črt z različnimi zamiki
const NeonLines = () => {
  return (
    <>
      {/* Prva črta (sredina) - pojavi se takoj */}
      <NeonLine delay={0} verticalZone="middle" />
      
      {/* Druga črta (zgoraj) - pojavi se po 3 sekundah */}
      <NeonLine delay={3} verticalZone="top" />
      
      {/* Tretja črta (spodaj) - pojavi se po 6 sekundah */}
      <NeonLine delay={6} verticalZone="bottom" />
    </>
  );
};

// Glavna komponenta ozadja
const Background = (props) => {
  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: '100%', 
      height: '100%', 
      backgroundColor: '#1a1a1a',
      zIndex: -1 
    }} {...props}>
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
        <EffectComposer>
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
