import { useEffect, useRef, Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, Environment, useAnimations } from '@react-three/drei';
import gsap from 'gsap';
import './MainContent.css';

function RobotModel({ modelPath }) {
  const { scene, animations } = useGLTF(modelPath);
  const robotRef = useRef();
  const { actions } = useAnimations(animations, robotRef);
  
  useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
      const firstAnimation = Object.keys(actions)[0];
      actions[firstAnimation].reset().fadeIn(0.5).play();
    }
  }, [actions]);
  
  useEffect(() => {
    if (robotRef.current) {
      robotRef.current.scale.set(0.7, 0.7, 0.7);
      robotRef.current.rotation.set(0, 0.8, 0);
      robotRef.current.position.set(1, -1.46, 0);
    }
  }, []);
  
  return <primitive ref={robotRef} object={scene} />;
}

export default function MainContent({ onOpenChat }) {
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const modelContainerRef = useRef(null);
  const speechBubbleRef = useRef(null);
  const [modelError, setModelError] = useState(false);

  const handleSpeechBubbleClick = () => {
    if (onOpenChat) {
      onOpenChat();
    }
  };

  useEffect(() => {
    gsap.fromTo(titleRef.current, 
      { opacity: 0, x: -50 }, 
      { opacity: 1, x: 0, duration: 1.5, ease: "power3.out" }
    );
    
    setTimeout(() => {
      gsap.fromTo(subtitleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 0.8, y: 0, duration: 1, ease: "power3.out" }
      );
    }, 700);
    
    setTimeout(() => {
      gsap.fromTo(modelContainerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1, ease: "power3.out" }
      );
    }, 1000);

    setTimeout(() => {
      gsap.fromTo(speechBubbleRef.current,
        { opacity: 0, scale: 0.8, y: -20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: "power3.out" }
      );
    }, 1300);
  }, []);

  if (modelError) {
    return (
      <div className="main-content">
        <h2>Napaka pri nalaganju 3D modela</h2>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="title-container">
        <h1 ref={titleRef} className="main-title">ClerkBot AI</h1>
        <p ref={subtitleRef} className="subtitle">Interface between your customers and your AI.</p>
      </div>
      
      <div ref={modelContainerRef} className="model-container">
        <Canvas 
          shadows 
          camera={{ 
            position: [7, 2, 4], 
            fov: 25,
            near: 0.1,
            far: 1000
          }}
          style={{ background: 'transparent' }}
          onError={() => setModelError(true)}
        >
          <Suspense fallback={null}>
            <RobotModel modelPath="/models/Robotko.glb" />
            <Environment preset="city" />
          </Suspense>
        </Canvas>
      </div>

      <div 
        ref={speechBubbleRef} 
        className="speech-bubble-image clickable-bubble"
        onClick={handleSpeechBubbleClick}
        style={{ cursor: 'pointer' }}
      >
        <img src="/images/cloud_image.png" alt="Speech bubble" />
        <p className="bubble-text">How may I assist you?</p>
      </div>
    </div>
  );
}