import React, { useEffect, useRef, Suspense, useState, useLayoutEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Environment, useAnimations } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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
      return <div style={{color: 'red', padding: '20px'}}>
        <h2>Error loading 3D model</h2>
      </div>;
    }
    return this.props.children;
  }
}

// Section Component for horizontal scrolling
const Section = ({ title, content, image, model, index }) => {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const imageRef = useRef(null);
  
  return (
    <div 
      ref={sectionRef} 
      className="horizontal-section"
      style={{
        width: '100vw',
        height: '100vh',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div 
        ref={contentRef} 
        style={{
          width: '80%',
          maxWidth: '1200px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px'
        }}
      >
        {/* Text Content */}
        <div style={{ flex: '0 0 50%', padding: '20px' }}>
          <h2 style={{
            fontSize: '2.5rem',
            color: '#00ffff',
            marginBottom: '20px',
            textShadow: '0 0 10px rgba(0, 255, 255, 0.3)'
          }}>{title}</h2>
          <div style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
            {content}
          </div>
        </div>
        
        {/* Image or Model */}
        <div ref={imageRef} style={{ flex: '0 0 45%', height: '60vh' }}>
          {image ? (
            <div style={{ 
              width: '100%', 
              height: '100%', 
              borderRadius: '12px',
              overflow: 'hidden',
              background: 'rgba(26, 26, 26, 0.5)',
              boxShadow: '0 4px 30px rgba(0, 255, 255, 0.15)',
              border: '1px solid rgba(0, 255, 255, 0.3)'
            }}>
              <img 
                src={image} 
                alt={title} 
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>
          ) : model ? (
            <div style={{ 
              width: '100%', 
              height: '100%', 
              borderRadius: '12px',
              overflow: 'hidden',
              background: 'rgba(26, 26, 26, 0.3)',
              boxShadow: '0 4px 30px rgba(0, 255, 255, 0.15)',
              border: '1px solid rgba(0, 255, 255, 0.3)'
            }}>
              <ErrorBoundary>
                <Canvas 
                  shadows 
                  camera={{ 
                    position: [6, 2, 4], 
                    fov: 30,
                    near: 0.1,
                    far: 1000
                  }}
                  style={{ background: 'transparent' }}
                >
                  <Suspense fallback={null}>
                    <RobotModel modelPath={model} />
                    <ambientLight intensity={0.5} />
                    <spotLight position={[5, 5, 5]} angle={0.15} penumbra={1} intensity={1} castShadow />
                    <spotLight position={[-5, 5, 5]} angle={0.15} penumbra={1} intensity={0.5} castShadow />
                    <Environment preset="city" />
                  </Suspense>
                </Canvas>
              </ErrorBoundary>
            </div>
          ) : null}
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
      title: "About ClerkBot AI",
      content: (
        <>
          <p>
            Founded in 2023, ClerkBot AI is transforming customer service through advanced 
            artificial intelligence. Our mission is to create seamless interactions between 
            businesses and their customers.
          </p>
          <p>
            With our <span style={{ color: '#00ffff', fontWeight: 600 }}>
              state-of-the-art conversational AI
            </span>, we're helping businesses automate routine inquiries while maintaining 
            the human touch that customers value.
          </p>
          <p>
            ClerkBot AI is proudly based in Slovenia and supported by the 
            Slovene Enterprise Fund and the European Union.
          </p>
        </>
      ),
      model: "/models/StandStill.glb"
    },
    {
      title: "Our Technology",
      content: (
        <>
          <p>
            ClerkBot AI leverages cutting-edge natural language processing and machine learning 
            algorithms to understand and respond to customer inquiries with remarkable accuracy.
          </p>
          <p>
            Our proprietary conversation engine adapts to your business needs, learning from 
            each interaction to continuously improve its performance.
          </p>
        </>
      ),
      image: "/images/technology.jpg"
    },
    {
      title: "Our Team",
      content: (
        <>
          <p>
            Behind ClerkBot AI is a team of passionate AI researchers, engineers, and 
            customer experience experts. With decades of combined experience in machine 
            learning and conversational design, our diverse team is united by a common goal.
          </p>
          <p>
            We're making AI accessible and valuable for businesses of all sizes.
          </p>
        </>
      ),
      image: "/images/team.jpg"
    },
    {
      title: "Our Values",
      content: (
        <>
          <p>
            At ClerkBot AI, we believe technology should serve humanity, not replace it. 
            We are committed to developing AI that enhances human capabilities and creates 
            better experiences for both businesses and their customers.
          </p>
          <p>
            Transparency, privacy, and ethical AI development are core to everything we do.
          </p>
        </>
      ),
      image: "/images/values.jpg"
    },
    {
      title: "Our Impact",
      content: (
        <>
          <p>
            Since our launch, ClerkBot AI has helped businesses reduce customer service costs 
            by up to 40% while improving customer satisfaction scores.
          </p>
          <p>
            Our AI assistants have successfully handled millions of customer interactions across 
            various industries including retail, healthcare, and financial services.
          </p>
        </>
      ),
      image: "/images/impact.jpg"
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
    <div 
      ref={containerRef} 
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        overflow: 'hidden', // Namesto 'auto' uporabimo 'hidden'
        padding: '0',
        color: 'white',
        marginTop: '0',
      }}
    >
      {/* Arrow indicator showing horizontal scroll direction */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        background: 'rgba(0, 255, 255, 0.2)',
        padding: '10px 20px',
        borderRadius: '20px',
        zIndex: 10,
        fontSize: '0.9rem',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        Scroll to explore <span style={{ fontSize: '1.5rem' }}>→</span>
      </div>
      
      {/* Horizontal sections container */}
      <div 
        ref={sectionsRef}
        style={{
          position: 'relative', // Dodamo position relative
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'nowrap',
          height: '100vh',
          willChange: 'transform' // Optimizacija za performans
        }}
      >
        {sections.map((section, index) => (
          <Section 
            key={index}
            title={section.title}
            content={section.content}
            image={section.image}
            model={section.model}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

export default About;