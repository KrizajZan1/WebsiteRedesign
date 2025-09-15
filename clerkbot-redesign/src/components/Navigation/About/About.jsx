import { useEffect, useRef, Suspense, useLayoutEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, Environment, useAnimations } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrollIndicator from '../../ScrollIndicator';
import './About.css';

gsap.registerPlugin(ScrollTrigger);

const RobotModel = ({ modelPath }) => {
  const { scene, animations } = useGLTF(modelPath);
  const modelRef = useRef();
  const { actions } = useAnimations(animations, modelRef);
  
  useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
      const firstAnimation = Object.keys(actions)[0];
      actions[firstAnimation].reset().fadeIn(0.5).play();
    }
  }, [actions]);
  
  useEffect(() => {
    if (modelRef.current) {
      modelRef.current.scale.set(0.7, 0.7, 0.7);
      modelRef.current.rotation.set(0, 0.5, 0);
      modelRef.current.position.set(0, -1.4, 0);
    }
  }, []);
  
  return <primitive ref={modelRef} object={scene} />;
};

const About = () => {
  const containerRef = useRef(null);
  const sectionsRef = useRef(null);
  const scrollTriggersRef = useRef([]);
  const [modelError, setModelError] = useState(false);
  
  useLayoutEffect(() => {
    if (!sectionsRef.current || !containerRef.current) return;
    
    ScrollTrigger.getAll().forEach(st => st.kill());
    
    const totalWidth = 5 * window.innerWidth; // 5 sections
    
    sectionsRef.current.style.width = `${totalWidth}px`;
    
    containerRef.current.style.overflowX = 'hidden';
    containerRef.current.style.overflowY = 'scroll';
    
    const sectionElements = document.querySelectorAll('.horizontal-section');
    sectionElements.forEach((section, i) => {
      section.style.position = 'absolute';
      section.style.left = `${i * 100}vw`;
      section.style.width = '100vw';
    });
    
    const scrollTrigger = ScrollTrigger.create({
      trigger: containerRef.current,
      pin: true,
      pinSpacing: true,
      start: "top top",
      end: "+=3000",
      onUpdate: self => {
        const x = -self.progress * (totalWidth - window.innerWidth);
        gsap.set(sectionsRef.current, { x });
      }
    });
    
    scrollTriggersRef.current.push(scrollTrigger);
    
    return () => {
      scrollTriggersRef.current.forEach(trigger => {
        if (trigger) trigger.kill();
      });
      scrollTriggersRef.current = [];
      
      gsap.killTweensOf(sectionsRef.current);
      
      ScrollTrigger.getAll().forEach(st => st.kill());
      ScrollTrigger.refresh();
    };
  }, []);
  
  if (modelError) {
    return (
      <div className="about-container">
        <h2>Napaka pri nalaganju 3D modela</h2>
      </div>
    );
  }
  
  return (
    <div ref={containerRef} className="about-container">
      <div className="robot-container">
        <Canvas 
          shadows 
          camera={{ 
            position: [6, 2, 4], 
            fov: 30,
            near: 0.1,
            far: 1000
          }}
          className="robot-canvas"
          onError={() => setModelError(true)}
        >
          <Suspense fallback={null}>
            <RobotModel modelPath="/models/RobotkoRotate.glb" />
            <Environment preset="city" />
          </Suspense>
        </Canvas>
      </div>
      
      <div ref={sectionsRef} className="sections-container">
        {/* Section 1: About ClerkBot.AI */}
        <div className="horizontal-section">
          <div className="section-content">
            <div className="section-box">
              <h2 className="section-title">About ClerkBot.AI</h2>
              <div className="section-content-text">
                <p><strong>Transform Every Interaction: Automated, Efficient, and Always Engaged.</strong></p>
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
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Project */}
        <div className="horizontal-section">
          <div className="section-content">
            <div className="section-box">
              <h2 className="section-title">Project</h2>
              <div className="section-content-text">
                <p><strong>ClerkBot.AI: The Future of Customer Interaction</strong></p>
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
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Things I Can Do */}
        <div className="horizontal-section">
          <div className="section-content">
            <div className="section-box">
              <h2 className="section-title">Things I Can Do</h2>
              <div className="section-content-text">
                <p><strong>Transform your customer engagement—efficiently and effortlessly.</strong></p>
                <div style={{ marginTop: '20px' }}>
                  <div style={{ marginBottom: '15px' }}>
                    <span style={{ color: '#00ffff', fontWeight: 'bold' }}>-</span> Understand and respond with human-like precision
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <span style={{ color: '#00ffff', fontWeight: 'bold' }}>-</span> Manage interactions across multiple touchpoints
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <span style={{ color: '#00ffff', fontWeight: 'bold' }}>-</span> Capture data, complete forms, and integrate with APIs
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <span style={{ color: '#00ffff', fontWeight: 'bold' }}>-</span> Deliver 24/7 customer service
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <span style={{ color: '#00ffff', fontWeight: 'bold' }}>-</span> Learn and adapt to your business needs
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <span style={{ color: '#00ffff', fontWeight: 'bold' }}>-</span> Personalize interactions with detailed insights
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: How do I work? */}
        <div className="horizontal-section">
          <div className="section-content">
            <div className="section-box">
              <h2 className="section-title">How do I work?</h2>
              <div className="section-content-text">
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
              </div>
            </div>
          </div>
        </div>

        {/* Section 5: Project Financing */}
        <div className="horizontal-section">
          <div className="section-content">
            <div className="section-box">
              <h2 className="section-title">Project Financing</h2>
              <div className="section-content-text">
                <div>
                  <h3 style={{ color: '#00ffff', fontSize: '1.2rem', marginBottom: '15px' }}>
                    Information about project financing
                  </h3>
                  <p>
                    Research and development is being co-financed by Cloudvenia Ltd. and European Union through 
                    European Fund for regional development.
                  </p>
                  <p>
                    Link to the Slovenian page for European Funds: {' '}
                    <a 
                      href="https://evropskasredstva.si/en" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ 
                        color: '#00ffff', 
                        textDecoration: 'underline',
                        textShadow: '0 0 5px rgba(0, 255, 255, 0.5)'
                      }}
                    >
                      EU FUNDS
                    </a>
                  </p>
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-around', 
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '10px',
                  marginTop: '30px'
                }}>
                  <img 
                    src="images/eu.jpg" 
                    alt="EU Flag - Sofinancira Evropska unija"
                    style={{ 
                      height: '60px',
                      filter: 'drop-shadow(0 0 10px rgba(0, 255, 255, 0.3))'
                    }}
                  />
                  <img 
                    src="/images/IfeelSlovenia.jpg" 
                    alt="I feel Slovenia"
                    style={{ 
                      height: '60px',
                      filter: 'drop-shadow(0 0 10px rgba(0, 255, 255, 0.3))'
                    }}
                  />
                  <img 
                    src="/images/slovene_enterprise_fund.png" 
                    alt="Slovene Enterprise Fund"
                    style={{ 
                      height: '60px',
                      filter: 'drop-shadow(0 0 10px rgba(0, 255, 255, 0.3))'
                    }}
                  />
                  <img 
                    src="/images/MGTS_logo-2023.png" 
                    alt="Republika Slovenija - Ministrstvo za gospodarstvo"
                    style={{ 
                      height: '60px',
                      filter: 'drop-shadow(0 0 10px rgba(0, 255, 255, 0.3))'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <ScrollIndicator />
    </div>
  );
};

export default About;