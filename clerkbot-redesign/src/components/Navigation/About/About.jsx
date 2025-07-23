import React, { useEffect, useRef, Suspense, useLayoutEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Environment, useAnimations } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './About.css';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Model component with basic functionality and cleanup
const RobotModel = ({ modelPath }) => {
  const { scene, animations } = useGLTF(modelPath);
  const modelRef = useRef();
  const { actions } = useAnimations(animations, modelRef);
  const { gl } = useThree();
  
  // Play animations
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
  
  // Proper Three.js cleanup
  useEffect(() => {
    return () => {
      if (scene) {
        scene.traverse((object) => {
          if (object.geometry) object.geometry.dispose();
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach(material => material.dispose());
            } else {
              object.material.dispose();
            }
          }
        });
      }
    };
  }, [scene]);
  
  // Set position and animation
  useFrame((state) => {
    if (modelRef.current) {
      // Basic settings
      modelRef.current.scale.set(0.5, 0.5, 0.5);
      modelRef.current.rotation.set(0, Math.sin(state.clock.elapsedTime * 0.3) * 0.3 + 0.5, 0);
      
      // Position with gentle hovering
      const baseY = -1.2;
      const offsetY = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      modelRef.current.position.set(
        0.2, 
        baseY + offsetY, 
        0
      );
    }
  });
  
  return <primitive ref={modelRef} object={scene} />;
};

// Error boundary component
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
      return (
        <div className="error-boundary">
          <h2>Error loading 3D model</h2>
        </div>
      );
    }
    return this.props.children;
  }
}

// Section Component for horizontal scrolling
const Section = ({ title, content, index }) => {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  
  return (
    <div ref={sectionRef} className="horizontal-section">
      <div ref={contentRef} className="section-content">
        {/* Text Content */}
        <div className="section-text">
          <h2 className="section-title">{title}</h2>
          <div className="section-content-text">
            {content}
          </div>
        </div>
      </div>
    </div>
  );
};

const About = () => {
  const containerRef = useRef(null);
  const sectionsRef = useRef(null);
  const scrollTriggersRef = useRef([]);
  
  // Sections data
  const sections = [
    {
      title: "About ClerkBot.AI",
      content: (
        <>
          <p>
            <strong>Transform Every Interaction: Automated, Efficient, and Always Engaged.</strong>
          </p>
          <p>
            ClerkBot.AI is your ultimate solution for seamless customer communication, whether you're dealing 
            with businesses (B2B) or direct consumers (B2C). Our advanced chatbot technology is designed to 
            handle every interaction on your website, ensuring that your customers receive instant, accurate, and 
            personalized responses 24/7.
          </p>
          <p>
            By integrating ClerkBot.AI into your operations, you'll not only enhance 
            customer satisfaction but also free up valuable resources, allowing your team to focus on what really 
            matters—growing your business.
          </p>
        </>
      )
    },
    {
      title: "Project",
      content: (
        <>
          <p>
            <strong>ClerkBot.AI: The Future of Customer Interaction</strong>
          </p>
          <p>
            Modern AI has reached a point where it can effectively replace many aspects of human interaction. 
            ClerkBot.AI is designed with the latest GPT technology, offering an innovative solution that 
            surpasses traditional digital interactions.
          </p>
          <p>
            It seamlessly integrates websites, search engines, phone support, and customer data capture 
            in an intuitive manner. With conversations similar to speaking with a professional, 
            it sets new standards in digital communication.
          </p>
          <p>
            Our chatbot facilitates paperless operations with advanced data capture and form completion, 
            reducing carbon footprint while enhancing efficiency for both B2C and B2B communications.
          </p>
        </>
      )
    },
    {
      title: "Things I Can Do",
      content: (
        <>
          <p>
            <strong>Transform your customer engagement—efficiently and effortlessly.</strong>
          </p>
          <div style={{ marginTop: '20px' }}>
            <div style={{ marginBottom: '15px' }}>
              <span style={{ color: '#00ffff', fontWeight: 'bold' }}>•</span> Understand and respond with human-like precision
            </div>
            <div style={{ marginBottom: '15px' }}>
              <span style={{ color: '#00ffff', fontWeight: 'bold' }}>•</span> Manage interactions across multiple touchpoints
            </div>
            <div style={{ marginBottom: '15px' }}>
              <span style={{ color: '#00ffff', fontWeight: 'bold' }}>•</span> Capture data, complete forms, and integrate with APIs
            </div>
            <div style={{ marginBottom: '15px' }}>
              <span style={{ color: '#00ffff', fontWeight: 'bold' }}>•</span> Deliver 24/7 customer service
            </div>
            <div style={{ marginBottom: '15px' }}>
              <span style={{ color: '#00ffff', fontWeight: 'bold' }}>•</span> Learn and adapt to your business needs
            </div>
            <div style={{ marginBottom: '15px' }}>
              <span style={{ color: '#00ffff', fontWeight: 'bold' }}>•</span> Personalize interactions with detailed insights
            </div>
          </div>
        </>
      )
    },
    {
      title: "How do I work?",
      content: (
        <>
          <div style={{ marginTop: '10px', width: '100%', display: 'flex', justifyContent: 'center' }}>
            <video 
              width="100%" 
              height="auto"
              controls
              style={{ 
                maxWidth: '600px',
                borderRadius: '10px',
                border: '2px solid rgba(0, 255, 255, 0.3)',
                boxShadow: '0 4px 30px rgba(0, 255, 255, 0.15)'
              }}
            >
              <source src="/Clerkbot_Tutorial.mp4" type="video/mp4" />
              <source src="/Clerkbot_Tutorial.webm" type="video/webm" />
              Your browser does not support the video tag.
            </video>
          </div>
        </>
      )
    }
  ];

  // Set up horizontal scrolling with GSAP
  useLayoutEffect(() => {
    if (!sectionsRef.current || !containerRef.current) return;
    
    // Počistimo morebitne prejšnje instance ScrollTriggerja
    ScrollTrigger.getAll().forEach(st => st.kill());
    
    // Calculate the width of all sections combined
    const totalWidth = sections.length * window.innerWidth;
    
    // Set the width of the sections container
    sectionsRef.current.style.width = `${totalWidth}px`;
    
    // Zagotovimo, da je overflow nastavljen pravilno
    containerRef.current.style.overflowX = 'hidden';
    containerRef.current.style.overflowY = 'scroll';
    
    // Dodamo prepoznavne stile za lažjo identifikacijo sekcij
    const sectionElements = document.querySelectorAll('.horizontal-section');
    sectionElements.forEach((section, i) => {
      section.style.position = 'absolute';
      section.style.left = `${i * 100}vw`;
      section.style.width = '100vw';
    });
    
    // UPORABIMO PREPROSTEJŠI PRISTOP Z HORIZONTALNIM SCROLLANJEM
    const scrollTrigger = ScrollTrigger.create({
      trigger: containerRef.current,
      pin: true,
      pinSpacing: true,
      start: "top top",
      end: "+=3000", // Fiksna vrednost scrollanja, ki jo lahko prilagodimo
      onUpdate: self => {
        // Premaknemo sekcije horizontalno
        const x = -self.progress * (totalWidth - window.innerWidth);
        gsap.set(sectionsRef.current, { x });
      }
    });
    
    // Dodamo scrollTrigger v array za čiščenje
    scrollTriggersRef.current.push(scrollTrigger);
    
    // Omogočimo preprostejšo vizualno animacijo za vsako sekcijo
    sectionElements.forEach((section, i) => {
      if (i > 0) {
        const title = section.querySelector('h2');
        const paragraphs = section.querySelectorAll('p');
        
        // Začetni stil
        gsap.set(title, { opacity: 0, y: 20 });
        gsap.set(paragraphs, { opacity: 0, y: 20 });
        
        // Ustvarimo animacijo, ki se sproži, ko je sekcija vidna
        const trigger = ScrollTrigger.create({
          trigger: section,
          start: "left 80%",
          end: "right 20%",
          toggleActions: "play none none reverse",
          onEnter: () => {
            gsap.to(title, { opacity: 1, y: 0, duration: 0.5 });
            gsap.to(paragraphs, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 });
          },
          onLeaveBack: () => {
            gsap.to(title, { opacity: 0, y: 20, duration: 0.5 });
            gsap.to(paragraphs, { opacity: 0, y: 20, duration: 0.5 });
          }
        });
        
        scrollTriggersRef.current.push(trigger);
      }
    });
    
    // Comprehensive cleanup
    return () => {
      scrollTriggersRef.current.forEach(trigger => {
        if (trigger) trigger.kill();
      });
      scrollTriggersRef.current = [];
      
      // Počistimo vse animacije
      gsap.killTweensOf(sectionsRef.current);
      gsap.killTweensOf('.horizontal-section h2');
      gsap.killTweensOf('.horizontal-section p');
      
      ScrollTrigger.getAll().forEach(st => st.kill());
      ScrollTrigger.refresh();
    };
  }, [sections.length]);
  
  return (
    <div ref={containerRef} className="about-container">
      {/* ROBOT - GLOBALNO FIKSEN NA LEVI STRANI */}
      <div className="robot-container">
        <ErrorBoundary>
          <Canvas 
            shadows 
            camera={{ 
              position: [6, 2, 4], 
              fov: 30,
              near: 0.1,
              far: 1000
            }}
            className="robot-canvas"
          >
            <Suspense fallback={null}>
              <RobotModel modelPath="/models/StandStill.glb" />
              <ambientLight intensity={0.5} />
              <spotLight position={[5, 5, 5]} angle={0.15} penumbra={1} intensity={1} castShadow />
              <spotLight position={[-5, 5, 5]} angle={0.15} penumbra={1} intensity={0.5} castShadow />
              <Environment preset="city" />
            </Suspense>
          </Canvas>
        </ErrorBoundary>
      </div>
      
      {/* Horizontal sections container */}
      <div ref={sectionsRef} className="sections-container">
        {sections.map((section, index) => (
          <Section 
            key={index}
            title={section.title}
            content={section.content}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

export default About;