import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const heroRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    // --- Matrix Rain Logic ---
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const letters = "01010101CREWSEED";
    const fontSize = 16;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);

    const drawMatrix = () => {
      ctx.fillStyle = "rgba(15, 23, 42, 0.05)"; // slate-900 with alpha
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#38b6ff";
      ctx.font = `${fontSize}px monospace`;

      drops.forEach((y, i) => {
        const text = letters[Math.floor(Math.random() * letters.length)];
        ctx.fillText(text, i * fontSize, y * fontSize);
        if (y * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      });
    };

    const matrixInterval = setInterval(drawMatrix, 50);

    // --- GSAP Scroll-Out Animation ---
    const ctxGsap = gsap.context(() => {
      gsap.to(".hero-content-move", {
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
        y: -100,
        opacity: 0,
        scale: 0.95,
      });

      // Parallax for the dashboard card
      gsap.to(".dashboard-preview", {
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
        y: 150,
        rotateZ: 5,
      });
    }, heroRef);

    return () => {
      clearInterval(matrixInterval);
      ctxGsap.revert();
    };
  }, []);

  // Framer Motion Variants for "In" Animation
  const containerVars = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.3 }
    }
  };

  const itemVars = {
    hidden: { y: 40, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <header
      ref={heroRef}
      id="hero"
      className="relative w-full min-h-screen flex items-center lg:items-end px-6 md:px-12 pb-20 pt-32 overflow-hidden bg-slate-900"
    >
      {/* Matrix Rain Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-40 pointer-events-none" />
      
      {/* Dashboard Background Mockup */}
      <div className="absolute inset-0 z-0 select-none">
        <img
          src="https://img.rocket.new/generatedImages/rocket_gen_img_1681f78f6-1767085536563.png"
          alt="Background"
          className="w-full h-full object-cover opacity-10"
        />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent z-10" />

      {/* Content Container */}
      <motion.div 
        variants={containerVars}
        initial="hidden"
        animate="visible"
        className="relative z-20 w-full max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-end hero-content-move"
      >
        {/* Left Content */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          <motion.div variants={itemVars}>
            <span className="inline-block px-4 py-1.5 border border-[#38b6ff]/50 rounded-full text-[10px] md:text-xs uppercase tracking-[0.2em] text-[#38b6ff] mb-6 font-black bg-slate-900/80 backdrop-blur-md">
              Zero Fraud. Full Control.
            </span>
            <h1 className="text-6xl md:text-8xl lg:text-[120px] font-black leading-[0.85] tracking-tighter text-white mb-8">
              Control <br />
              Blue-Collar <br />
              <span className="bg-gradient-to-r from-[#38b6ff] via-[#d1ec44] to-[#38b6ff] bg-clip-text text-transparent gradient-text-animate">
                Workforce.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-white/70 leading-relaxed max-w-xl font-medium">
              Job Finding, Worker/Bulk Hiring, and automated pay — end-to-end workforce control for the modern industry.
            </p>
          </motion.div>

          {/* Floating Info Cards */}
          <motion.div variants={itemVars} className="grid grid-cols-2 gap-4 max-w-lg">
            {[
              { label: "Daily Active", val: "12,000+", sub: "Workers Tracked", color: "text-[#38b6ff]" },
              { label: "Payroll", val: "100%", sub: "Accuracy Guaranteed", color: "text-[#d1ec44]" }
            ].map((card, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-xl rounded-[2rem] p-6 border border-white/10 hover:border-white/20 transition-all duration-500 group">
                <div className="text-[10px] uppercase tracking-widest text-white/40 mb-2 font-black">{card.label}</div>
                <div className={`text-4xl font-black text-white group-hover:${card.color} transition-colors tabular-nums`}>{card.val}</div>
                <div className="text-xs text-white/60 mt-1 font-bold italic">{card.sub}</div>
              </div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div variants={itemVars} className="flex flex-col sm:flex-row gap-4 mt-4">
            <button className="bg-[#38b6ff] text-slate-950 px-10 py-5 text-xs font-black uppercase tracking-widest hover:bg-[#d1ec44] transition-all rounded-full flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(56,182,255,0.3)] hover:scale-105 active:scale-95">
              <span>Employer Portal</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
            </button>
            <button className="border-2 border-white/20 text-white px-10 py-5 text-xs font-black uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all rounded-full flex items-center justify-center gap-3">
              <span>I'm a Worker</span>
            </button>
          </motion.div>
        </div>

        {/* Right Dashboard Preview */}
        <motion.div 
          variants={itemVars}
          className="lg:col-span-5 hidden lg:flex justify-end dashboard-preview"
        >
          <div className="bg-slate-900/80 backdrop-blur-2xl rounded-[3rem] p-4 border border-white/10 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-1000">
             <div className="relative group overflow-hidden rounded-[2.5rem]">
                <img
                  src="https://img.rocket.new/generatedImages/rocket_gen_img_161d6a3b8-1764647226896.png"
                  alt="Dashboard Preview"
                  className="w-full max-w-md h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent flex items-end p-8">
                  <div className="flex items-center gap-4">
                    <div className="w-4 h-4 rounded-full bg-[#d1ec44] animate-ping" />
                    <span className="text-sm font-black text-white uppercase tracking-widest">Live Verification</span>
                  </div>
                </div>
             </div>
          </div>
        </motion.div>
      </motion.div>
    </header>
  );
};

export default Hero;