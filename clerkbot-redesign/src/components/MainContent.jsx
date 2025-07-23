import React, { useEffect, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, useAnimations } from '@react-three/drei';
import gsap from 'gsap';
import './MainContent.css';

// Model komponenta z osnovno funkcionalnostjo
const RobotModel = ({ modelPath }) => {
  const { scene, animations } = useGLTF(modelPath);
  const modelRef = useRef();
  const { actions } = useAnimations(animations, modelRef);
  
  // Predvajanje animacij
  useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
      const firstAnimation = Object.keys(actions)[0];
      actions[firstAnimation].reset().fadeIn(0.5).play();
    }
    
    return () => {
      if (actions) {
        Object.values(actions).forEach(action => {
          if (action) action.fadeOut(0.5);
        });
      }
    };
  }, [actions]);
  
  // Nastavitev pozicije in animacija
  useFrame((state) => {
    if (modelRef.current) {
      // Osnovne nastavitve
      modelRef.current.scale.set(0.7, 0.7, 0.7);
      modelRef.current.rotation.set(0, 0.8, 0);
      
      // Osnovna pozicija z nežnim lebdenjem
      const baseY = -1.4632344063314857;
      const offsetY = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      
      modelRef.current.position.set(
        1,  // Fiksna x pozicija
        baseY + offsetY, 
        0
      );
    }
  });
  
  return <primitive ref={modelRef} object={scene} />;
};

// Dodaj manjkajočo ErrorBoundary komponento
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <div className="error-message">
        <h2>Napaka pri nalaganju 3D modela</h2>
      </div>;
    }
    return this.props.children;
  }
}

const MainContent = () => {
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const modelContainerRef = useRef(null);
  const speechBubbleRef = useRef(null);

  // Animation effect on component mount
  useEffect(() => {
    const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
    
    timeline.fromTo(titleRef.current, 
      { opacity: 0, x: -50 }, 
      { opacity: 1, x: 0, duration: 1.5 }
    );
    
    timeline.fromTo(subtitleRef.current,
      { opacity: 0, y: 20 },
      { opacity: 0.8, y: 0, duration: 1 },
      "-=0.8"
    );
    
    timeline.fromTo(modelContainerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1.2 },
      "-=0.5"
    );

    // Animacija za oblaček
    timeline.fromTo(speechBubbleRef.current,
      { opacity: 0, scale: 0.8, y: -20 },
      { opacity: 1, scale: 1, y: 0, duration: 0.8 },
      "-=0.5"
    );
    
    return () => timeline.kill();
  }, []);

  return (
    <div className="main-content">
      <div className="title-container">
        <h1 ref={titleRef} className="main-title">ClerkBot AI</h1>
        <p ref={subtitleRef} className="subtitle">Interface between your customers and AI.</p>
      </div>
      
      {/* 3D Model container */}
      <div ref={modelContainerRef} className="model-container">
        <ErrorBoundary>
          <Canvas 
            shadows 
            camera={{ 
              position: [7, 2, 4], 
              fov: 25,
              near: 0.1,
              far: 1000
            }}
            style={{ background: 'transparent' }}
          >
            <Suspense fallback={null}>
              <RobotModel modelPath="/models/Robotko.glb" />
              
              {/* Osvetlitev */}
              <ambientLight intensity={0.5} />
              <spotLight position={[5, 5, 5]} angle={0.15} penumbra={1} intensity={1} castShadow />
              <spotLight position={[-5, 5, 5]} angle={0.15} penumbra={1} intensity={0.5} castShadow />
              
              {/* Okolje */}
              <Environment preset="city" />
            </Suspense>
          </Canvas>
        </ErrorBoundary>
      </div>

      {/* Oblaček iz slike */}
      <div ref={speechBubbleRef} className="speech-bubble-image">
        <img src="/images/cloud_image.png" alt="Speech bubble" />
        <p className="bubble-text">How may I assist you?</p>
      </div>
    </div>
  );
};

export default MainContent;