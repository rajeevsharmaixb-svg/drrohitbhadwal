'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function StickyHeroSequence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [framesLoaded, setFramesLoaded] = useState(false);
  const frameCount = 40;
  
  // Array to hold cached Image objects
  const images = useRef<HTMLImageElement[]>([]);
  // We'll mutate this object to let gsap tween its property and update the canvas
  const progressState = useRef({ frame: 0 });

  useEffect(() => {
    // 1. Preload Images
    let loadedCount = 0;
    const pad = (n: number) => n.toString().padStart(2, '0');
    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      img.src = `/animationframes/${pad(i)}.webp`;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === frameCount) {
          setFramesLoaded(true);
        }
      };
      images.current.push(img);
    }
  }, []);

  useEffect(() => {
    if (!framesLoaded) return;

    // Detect reduced motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const render = () => {
      if (!canvas || !images.current || images.current.length === 0) return;
      const img = images.current[Math.min(frameCount - 1, progressState.current.frame)];
      if (!img || !img.complete) return;
      
      context.clearRect(0, 0, canvas.width, canvas.height);
      
      // Calculate scaling to cover the canvas full bleed
      const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
      const x = (canvas.width / 2) - (img.width / 2) * scale;
      const y = (canvas.height / 2) - (img.height / 2) * scale;
      
      // Apply scaling based on scroll progress (Phase 1 slightly zooms out from 1.05 to 1) 
      // But we can keep it simpler by letting gsap handle canvas container scaling and just draw full bleed here
      context.drawImage(img, x, y, img.width * scale, img.height * scale);
    };

    // Initial render
    render();

    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      render();
    });

    if (prefersReduced) {
      // Just render the last frame if reduced motion
      progressState.current.frame = frameCount - 1;
      render();
      if (textRef.current) {
        textRef.current.style.opacity = '1';
        textRef.current.style.transform = 'translateY(0)';
      }
      return;
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        pin: heroRef.current,
        scrub: 0.3,
        start: 'top top',
        end: '+=100%',
        anticipatePin: 1,
        onUpdate: () => render(),
        id: 'hero-scroll-trigger'
      }
    });

    // Phase 1-4: Frame sequence (progress 0 to 0.82 roughly)
    tl.to(progressState.current, {
      frame: frameCount - 1,
      snap: { frame: 1 }, // Ensure we always have an integer for array indexing
      ease: 'none',
      duration: 0.82 // 82% of the scroll logic
    });
    
    // Add blue blur/overlay filter over canvas (Phase 3 & 4)
    tl.fromTo(canvas, 
      { filter: 'brightness(1) blur(0px)' }, 
      { filter: 'brightness(1.1) contrast(1.05) blur(1px)', duration: 0.1, yoyo: true, repeat: 1 }, 
      "<0.45" // start at progress 0.45
    );

    // Phase 5: Text reveal (last 18%)
    tl.fromTo(textRef.current, 
      { opacity: 0, y: 16 }, 
      { opacity: 1, y: 0, duration: 0.18, ease: "power2.out" },
      0.82 
    );

    // Error recovery: Emergency scroll unlock if stuck for 8s
    let stuckTimeout: NodeJS.Timeout;
    const onScroll = () => {
      clearTimeout(stuckTimeout);
      stuckTimeout = setTimeout(() => {
        // If we are stuck with GSAP pinned but scroll isn't moving
        if (containerRef.current) {
           const rect = containerRef.current.getBoundingClientRect();
           const prog = Math.min(1, Math.max(0, -rect.top / (rect.height - window.innerHeight)));
           if (prog < 1.0 && prog > 0) {
             console.warn('[Hero] Scroll may be stuck. Fallback releasing viewport.');
           }
        }
      }, 8000);
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      tl.kill();
      const st = ScrollTrigger.getById('hero-scroll-trigger');
      if (st) st.kill();
      window.removeEventListener('resize', render);
      window.removeEventListener('scroll', onScroll);
      clearTimeout(stuckTimeout);
    };
  }, [framesLoaded]);

  return (
    <div ref={containerRef} className="relative w-full sticky-container z-[60] -mt-20" style={{ height: '200vh', backgroundColor: '#000' }}>
      <div 
        ref={heroRef} 
        className="sticky-hero top-0 w-full h-screen overflow-hidden flex items-center justify-center relative bg-black"
        role="region" aria-label="Hero animation section"
      >
        {!framesLoaded && (
          <div className="absolute z-50 text-white font-serif italic text-xl animate-pulse">
            Loading Cinematic Experience...
          </div>
        )}
        
        {/* Skip Animation Btn - Accessability */}
        <button 
          onClick={() => {
            window.scrollTo({
              top: (containerRef.current?.getBoundingClientRect().bottom || 0) + window.scrollY,
              behavior: 'smooth'
            });
          }}
          className="skip-animation-btn absolute top-4 left-4 z-[9999] bg-[#1B6CA8] text-white px-4 py-2 rounded-md opacity-0 focus:opacity-100 transition-opacity"
        >
          Skip to content
        </button>

        <canvas 
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
          style={{ opacity: framesLoaded ? 1 : 0 }}
        />
        
        {/* Glow Overlay to match PRD aesthetic if frames alone don't provide the tint */}
        <div className="absolute inset-0 bg-blue-900/10 pointer-events-none mix-blend-overlay" />
        
        <div ref={textRef} className="absolute inset-0 flex flex-col items-center justify-center px-4 opacity-0 translate-y-4 z-20">
          <h1 
            className="font-serif text-[clamp(3rem,6vw,5.5rem)] font-bold text-white text-center leading-[1.1] tracking-wide max-w-[900px] drop-shadow-[0_0_40px_rgba(20,184,166,0.6)]"
          >
            Precision Excellence
          </h1>
          <p className="mt-6 text-lg md:text-2xl text-white/90 font-outfit font-light tracking-wide text-center max-w-[700px] drop-shadow-lg">
            Compassionate Care for Your Perfect Smile.<br/>
            Your journey to a painless dental experience starts here.
          </p>
          <div className="mt-12 flex flex-col sm:flex-row gap-6">
            <button 
              onClick={() => window.location.href = '/book'}
              className="px-10 py-5 bg-primary text-white rounded-full font-bold uppercase tracking-widest text-xs shadow-2xl shadow-primary/40 hover:scale-105 transition-transform active:scale-95"
            >
              Book Appointment
            </button>
            <button 
              onClick={() => window.location.href = '/services'}
              className="px-10 py-5 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-white/20 transition-all"
            >
              Our Services
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
