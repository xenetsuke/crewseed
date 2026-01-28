import { useEffect, useState } from "react";
import {  useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { initMatrixRain } from "gsap/matrixRain";
import { initLandingAnimations } from "gsap/landingAnimations";
import MagneticButton from "components/effects/MagneticButton";
import { initCounters } from "gsap/counters";
import TransitionSection from "./TransitionSection";
import FeaturesSection from "./FeaturesSection";
import WorkerSection from "./WorkerSection";
import HowItWorks from "./HowItWorks";
import ScaleSection from "./ScaleSection";
import { motion } from "framer-motion";
// gsap.registerPlugin(ScrollTrigger);
import Preloader from "components/Preloader";
import FAQSection from "./FAQSection";

export default function Landing() {
    
    // const [loading, setLoading] = useState(true);
    const landingRef = useRef(null);
    // const MIN_LOADER_TIME = 7000; // ms (1.8s feels premium)
// const startTimeRef = useRef(Date.now());

useEffect(() => {
  const canvas = document.getElementById("matrixRain");
  let cleanupMatrix;

  // ⏱ record when loader started
//   startTimeRef.current = Date.now();
//   setLoading(true);

  if (canvas) cleanupMatrix = initMatrixRain(canvas);

  // 🧠 DOUBLE RAF = guarantees browser painted loader at least once
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      initLandingAnimations(landingRef.current);
      initCounters(landingRef.current);
      ScrollTrigger.refresh();

      // const elapsed = Date.now() - startTimeRef.current;
      // const remaining = Math.max(MIN_LOADER_TIME - elapsed, 0);

      // ✅ hide loader ONLY after minimum time
      // setTimeout(() => {
      //   setLoading(false);
      // }, remaining); 
    });
  });

  return () => cleanupMatrix?.();
}, []);

// useEffect(() => {
//   document.body.style.overflow = loading ? "hidden" : "auto";
//   return () => (document.body.style.overflow = "auto");
// }, [loading]);

  return (
      <>

    {/* {loading && <Preloader />} */}

<div ref={landingRef}>

  <nav
  class="fixed  top-0 w-full z-50 text-black py-6 px-6 md:px-12 flex items-center justify-between transition-all duration-500"
    id="mainNav"
  >
    <div className="flex items-center gap-12">
<a
  href="#"
  className="relative inline-flex items-center px-4 py-1.5 rounded-full
             bg-slate-900/70 backdrop-blur-md
             border border-white/10 shadow-lg"
>
  <span className="text-3xl font-extrabold tracking-tighter
    bg-gradient-to-r from-[#38b6ff] via-[#d1ec44] to-[#38b6ff]
    bg-[length:200%_auto]
    animate-[shine_6s_linear_infinite]
    bg-clip-text text-transparent">
    CrewSeed
  </span>
</a>


      <div className="hidden  md:flex gap-8 text-xs font-bold tracking-widest uppercase">
        <a href="#features" className="hover:opacity-60 hover:text-[#d1ec44]  transition-opacity">
          Control Center
        </a>
        <a href="#how-it-works" className="hover:opacity-60 hover:text-[#d1ec44]  transition-opacity">
          How It Works
        </a>
        <a href="#scale" className="hover:opacity-60 hover:text-[#d1ec44]  transition-opacity">
          Trust
        </a>
      </div>
    </div>
    <div className="flex items-center gap-4">
    <motion.a
  href="https://www.crewseed.com/login"
  target="_blank"
  rel="noopener noreferrer"
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  className="inline-block bg-white text-slate-900 px-6 py-2.5 text-xs font-black uppercase tracking-widest hover:bg-[#d1ec44] transition-colors rounded-full text-center shadow-lg shadow-black/5"
>
  Sign In
</motion.a>
      {/* <button className="bg-white text-slate-900 px-6 py-2.5 text-xs font-black uppercase tracking-widest hover:bg-[#d1ec44] transition-colors rounded-full">
        Request Demo
      </button> */}
    </div>
  </nav>
  {/* Cinematic Hero Section */}
  <header
    // id="hero"
    className="relative w-full min-h-screen flex items-end px-6 md:px-12 pb-20 pt-32 overflow-hidden bg-gradient-to-r from-[#38b6ff] via-[#d1ec44] to-[#38b6ff]"
  >
    
    {/* Matrix Rain Canvas */}
    <canvas id="matrixRain" className="absolute inset-0 z-0 opacity-40" />
    {/* Dashboard Background Mockup */}
<motion.div   initial="hidden"
  whileInView="visible"
  viewport={{ once: false, amount: 0.3 }}
  variants={{
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 } 
    }
  }}  className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
    
  <motion.img
    src="https://img.rocket.new/generatedImages/rocket_gen_img_1681f78f6-1767085536563.png"
    alt="Workforce management dashboard"
    initial={{ scale: 1.1, x: 0, y: 0 }}
    animate={{ 
      x: [0, -20, 20, 0], // Subtle side-to-side drift
      y: [0, 15, -15, 0], // Subtle up-and-down drift
    }}
    transition={{ 
      duration: 20, 
      repeat: Infinity, 
      ease: "linear" 
    }}
    className="w-full h-full object-cover opacity-20"
  />
</motion.div>
    {/* Gradient Overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/60 to-transparent z-10" />
    {/* Animated Gradient Accent */}
    <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-br from-[#38b6ff]/30 via-[#d1ec44]/20 to-transparent blur-3xl z-10 animate-gradient-move" />
    {/* Content Container */}
    <div className="relative z-20 w-full max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
      {/* Left Content */}
      
  <motion.div 
  initial="hidden"
  whileInView="visible"
  viewport={{ once: false, amount: 0.3 }}
  variants={{
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 } 
    }
  }}
  className="lg:col-span-6 flex flex-col gap-8"
>
  {/* Header Section */}
  <motion.div
    variants={{
      hidden: { opacity: 0, x: -50 },
      visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
    }}
  >
    <span className="inline-block px-4 py-1.5 border border-white/20 rounded-full text-xs uppercase tracking-widest text-[#d1ec44] mb-6 font-bold glow-text animate-pulse bg-white/5">
      Zero Fraud. Full Control.
    </span>
    
    <h1 className="text-6xl md:text-8xl lg:text-9xl font-black leading-[0.85] tracking-tighter text-white mb-6">
      Control
      <br />
      Blue-Collar
      <br />
      <span className="bg-gradient-to-r from-[#38b6ff] via-[#d1ec44] to-[#38b6ff] bg-clip-text text-transparent gradient-text-animate">
        Workforce.
      </span>
    </h1>

    <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-xl font-medium">
      “Job Finding, Worker/Bulk Hiring, Job Management, photo-verified
      work, and automated pay — end-to-end workforce control.”
    </p>
  </motion.div>

  {/* Floating Info Cards */}
  <div className="grid grid-cols-2 gap-4 max-w-lg">
    {[
      { label: "Daily Active", value: "12,000+", sub: "Workers Tracked", color: "text-[#38b6ff]" },
      { label: "Payroll", value: "100%", sub: "Accuracy. Zero Errors.", color: "text-white" }
    ].map((card, i) => (
      <motion.div 
        key={i}
        variants={{
          hidden: { opacity: 0, y: 30, scale: 0.9 },
          visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100 } }
        }}
        whileHover={{ y: -10, transition: { duration: 0.3 } }}
        className="glass-dark rounded-3xl p-6 border border-[#38b6ff]/30 hover:border-[#38b6ff] transition-colors duration-500 group"
      >
        <div className="text-xs uppercase tracking-widest text-white/60 mb-2 font-bold whitespace-nowrap">
          {card.label}
        </div>
        <div className={`text-3xl font-black transition-colors ${card.color} group-hover:text-[#38b6ff]`}>
          {card.value}
        </div>
        <div className="text-xs text-[#d1ec44] mt-1 font-medium italic">
          {card.sub}
        </div>
      </motion.div>
    ))}
  </div>

  {/* CTA Buttons */}
  <motion.div 
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    }}
    className="flex flex-col sm:flex-row gap-4"
  >
   <motion.a
  href="https://www.crewseed.com/employer-signup"
  target="_blank"
  rel="noopener noreferrer"
  // Entrance (In) and Exit (Out)
  initial={{ opacity: 0, scale: 0.8, y: 20 }}
  whileInView={{ opacity: 1, scale: 1, y: 0 }}
  viewport={{ once: false }}
  // Interaction
  whileHover={{ 
    scale: 1.05,
    shadow: "0px 20px 40px rgba(56, 182, 255, 0.4)" 
  }}
  whileTap={{ scale: 0.95 }}
  transition={{ 
    type: "spring", 
    stiffness: 300, 
    damping: 15 
  }}
  className="relative inline-flex bg-gradient-to-r from-[#38b6ff] via-[#d1ec44] to-[#38b6ff] bg-[length:200%_auto] text-slate-900 px-10 py-5 text-sm font-black uppercase tracking-widest rounded-full items-center justify-center gap-3 shadow-2xl shadow-[#38b6ff]/50 transition-all hover:bg-right duration-500 group"
>
  <span className="relative z-10">I'm Employer</span>

  {/* Animated Icon */}
  <motion.svg
    xmlns="http://www.w3.org/2000/svg"
    width={18}
    height={18}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={3}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="transition-transform group-hover:translate-x-1"
  >
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </motion.svg>

  {/* Subtle Outer Glow Layer */}
  <div className="absolute inset-0 rounded-full bg-inherit blur-md opacity-40 group-hover:opacity-60 transition-opacity" />
</motion.a>
    
  <motion.a
  href="https://www.crewseed.com/worker-signup"
  target="_blank"
  rel="noopener noreferrer"
  // Entrance (In) and Exit (Out) Animation
  initial={{ opacity: 0, y: 30, rotateX: 45 }}
  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
  viewport={{ once: false, amount: 0.5 }}
  // Interaction Logic
  whileHover={{ 
    scale: 1.02,
    y: -5,
  }}
  whileTap={{ scale: 0.98 }}
  transition={{ 
    type: "spring", 
    stiffness: 260, 
    damping: 20 
  }}
  className="inline-flex border-2 border-white/30 text-white px-10 py-5 text-sm font-black uppercase tracking-widest hover:bg-white hover:text-slate-900 hover:border-white transition-all duration-300 rounded-full items-center justify-center gap-3 group backdrop-blur-sm"
>
  <span className="relative z-10">I'm a Worker</span>
  
  <motion.svg
    xmlns="http://www.w3.org/2000/svg"
    width={18}
    height={18}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={3}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="transition-transform duration-300 group-hover:translate-x-1 group-hover:rotate-[-10deg]"
  >
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </motion.svg>
</motion.a>
  </motion.div>
</motion.div>
      {/* Right Floating Dashboard Preview */}
      <div className="lg:col-span-6 hidden lg:flex justify-end animate-fade-in-left delay-600">
        <div className="glass-dark rounded-3xl p-8 max-w-md backdrop-blur-xl border border-[#38b6ff]/30 transform hover:scale-105 transition-all duration-700 hover-lift animate-float-slow">
          <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-6 bg-slate-800/50 relative group">
            <img
              src="https://img.rocket.new/generatedImages/rocket_gen_img_161d6a3b8-1764647226896.png"
              alt="Live attendance dashboard interface showing worker photos and real-time verification status"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent flex items-end p-6">
              <div className="text-white">
                <div className="text-xs uppercase tracking-widest opacity-70 mb-1 font-bold">
                  Live Now
                </div>
                <div className="text-lg font-bold">
                  Photo Verification Active
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between text-white">
            <div>
              <div className="text-sm uppercase tracking-widest opacity-70 mb-1 font-bold">
                Today's Status
              </div>
              <div className="text-lg font-bold">324 Workers Clocked In</div>
            </div>
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-[#38b6ff] animate-pulse" />
              <div className="text-xs uppercase tracking-widest font-bold text-[#d1ec44]">
                Live
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    {/* Scroll Indicator */}
    {/* <div
  class="absolute b left-1/2  -translate-x-1/2 z-30 flex flex-col items-center gap-1 md:gap-2 text-white/50 hover:text-[#38b6ff] transition-colors cursor-pointer group"
  onclick="
    gsap.to(window, {
      duration: 1.2,
      scrollTo: { y: '#transition', offsetY: 80 },
      ease: 'power3.inOut',
    })
  "
>
  <span
    class="text-[10px] md:text-xs uppercase tracking-[0.3em] font-black whitespace-nowrap drop-shadow-lg"
  >
    Scroll to Explore
  </span>

  <div class="animate-bounce">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="3"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="md:w-6 md:h-6"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  </div>
</div> */}
  </header>
  {/* {Section-2 } */}
  {/* <section className="py-32 bg-white overflow-hidden relative" id="transition">
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
      <div className="absolute -top-[10%] -left-[5%] w-[40%] h-[40%] bg-[#38b6ff]/10 rounded-full blur-[120px]" />
      <div className="absolute -bottom-[10%] -right-[5%] w-[40%] h-[40%] bg-[#d1ec44]/10 rounded-full blur-[120px]" />
    </div>
    <div className="max-w-screen-2xl mx-auto px-6 md:px-12 relative z-10">
      <div className="text-center mb-24">
        <span className="text-xs font-black text-[#38b6ff] uppercase tracking-[0.3em] mb-6 block">
          The Ground Reality
        </span>
        <h2 className="text-6xl md:text-9xl font-black tracking-tighter mb-8 leading-[0.85] text-slate-900">
          From <span className="text-red-600 italic">Chaos</span>
          <br />
          <span className="bg-gradient-to-r from-[#38b6ff] to-[#d1ec44] bg-clip-text text-transparent">
            to Clarity
          </span>
        </h2>
        <p className="text-xl md:text-3xl text-slate-500 max-w-4xl mx-auto font-medium leading-tight">
          Standard job sites stop at "Application." We manage the
          <span className="inline-block text-slate-900 border-b-8 border-[#d1ec44] px-2 py-1 transform -rotate-1">
            entire lifecycle
          </span>
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-stretch">
        <div className="group perspective-1000" id="oldWay">
          <div className="h-full bg-slate-50 rounded-[3rem] p-10 md:p-16 border border-slate-200 shadow-sm transition-all duration-500 group-hover:shadow-2xl group-hover:bg-white relative overflow-hidden">
            <div className="flex items-center gap-4 mb-12">
              <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center text-red-600 font-bold text-2xl border border-red-100">
                ✕
              </div>
              <span className="text-sm uppercase tracking-widest text-slate-400 font-black">
                Traditional Methods
              </span>
            </div>
            <h3 className="text-4xl md:text-5xl font-black mb-12 text-slate-900 leading-none">
              The Broken <br />
              <span className="text-red-500">Manual Process</span>
            </h3>
            <ul className="space-y-10">
              <li className="flex gap-4">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2.5 shrink-0" />
                <div>
                  <strong className="block text-xl text-slate-900 mb-1 font-bold">
                    Agent Dependency
                  </strong>
                  <p className="text-slate-500 text-lg">
                    Hiring relies on unverified contractors and messy WhatsApp
                    groups.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2.5 shrink-0" />
                <div>
                  <strong className="block text-xl text-slate-900 mb-1 font-bold">
                    The CV Dead-End
                  </strong>
                  <p className="text-slate-500 text-lg">
                    Workers need location and shift info — not complex resumes.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2.5 shrink-0" />
                <div>
                  <strong className="block text-xl text-slate-900 mb-1 font-bold">
                    Paper Attendance
                  </strong>
                  <p className="text-slate-500 text-lg">
                    End-of-month pay disputes with zero physical or digital
                    proof.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div className="group perspective-1000" id="newWay">
          <div className="h-full bg-slate-900 rounded-[3rem] p-10 md:p-16 border border-[#38b6ff]/30 shadow-2xl relative overflow-hidden transition-all duration-500 group-hover:border-[#38b6ff]">
            <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#38b6ff]/10 blur-[100px] rounded-full group-hover:bg-[#38b6ff]/20 transition-colors" />
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-12">
                <div className="w-14 h-14 rounded-2xl bg-[#d1ec44] flex items-center justify-center text-slate-900 font-bold text-2xl shadow-[0_0_20px_rgba(209,236,68,0.3)]">
                  ✓
                </div>
                <span className="text-sm uppercase tracking-widest text-[#d1ec44] font-black">
                  The CrewSeed Advantage
                </span>
              </div>
              <h3 className="text-4xl md:text-5xl font-black mb-12 text-white leading-none">
                The Digital <br />
                <span className="text-[#38b6ff]">Powerhouse</span>
              </h3>
              <ul className="space-y-10">
                <li className="flex gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#38b6ff] mt-2.5 shrink-0" />
                  <div>
                    <strong className="block text-xl text-white mb-1 font-bold">
                      Instant Bulk Hiring
                    </strong>
                    <p className="text-slate-400 text-lg">
                      Deploy 50–500 verified workers to your site with one
                      click.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#38b6ff] mt-2.5 shrink-0" />
                  <div>
                    <strong className="block text-xl text-white mb-1 font-bold">
                      Geo-Tagged Attendance
                    </strong>
                    <p className="text-slate-400 text-lg">
                      Selfie-based clock-ins ensure workers are exactly where
                      they should be.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#38b6ff] mt-2.5 shrink-0" />
                  <div>
                    <strong className="block text-xl text-white mb-1 font-bold">
                      Automated Payroll
                    </strong>
                    <p className="text-slate-400 text-lg">
                      Transparency for workers and instant reporting for
                      management.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section> */}
  <TransitionSection></TransitionSection>
  {/* Employer HR Control Center Section */}
  <section 
    id="features"
    // data-gsap="section"
    className="py-32 bg-slate-900 text-white overflow-hidden relative"
  >
    {/* Noise texture */}
    <div
      className="absolute inset-0 opacity-[0.03] pointer-events-none"
      style={{
        backgroundImage:
          'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")'
      }}
    />
     <FeaturesSection></FeaturesSection>

  </section>
  {/* Worker Assignment Experience Section */}
  <section className="py-32 bg-white overflow-hidden relative">
    <WorkerSection></WorkerSection>
  </section>
  {/* How It Works Timeline Section */}
  <section
    id="how-it-works"
    className="py-20 md:py-32 bg-slate-900 text-white overflow-hidden relative"
  >
  <HowItWorks></HowItWorks>
  </section>
  {/* Trust & Scale Section */}
  <section id="scale" className="py-32 bg-white overflow-hidden relative">
   <ScaleSection></ScaleSection>
  </section>
  <FAQSection></FAQSection>
  {/* Final CTA Section */}
  <section className="py-32 bg-slate-900 text-white overflow-hidden relative">
    <div className="absolute inset-0 bg-gradient-to-br from-[#38b6ff]/10 via-transparent to-[#d1ec44]/10" />
    <div className="max-w-4xl mx-auto px-6 md:px-12 text-center relative z-10">
      <div className="mb-12">
        <div className="text-7xl md:text-9xl font-black tracking-tighter mb-8 leading-none">
          <span className="bg-gradient-to-r from-[#38b6ff] via-[#d1ec44] to-[#38b6ff] bg-clip-text text-transparent">
            CrewSeed
          </span>
        </div>
        <p className="text-2xl md:text-3xl font-medium text-white/90 mb-4">
          Stop Managing. Start Controlling.
        </p>
        <p className="text-lg text-white/60 max-w-2xl mx-auto">
          500+ companies. 12,000+ workers. Zero fraud. 100% payroll accuracy.
          Built for India's blue-collar reality.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
        {/* <button className="bg-gradient-to-r from-[#38b6ff] to-[#38b6ff]/80 text-white px-12 py-6 text-base font-black uppercase tracking-widest hover:from-[#38b6ff]/90 hover:to-[#38b6ff]/70 transition-all rounded-full flex items-center justify-center gap-3 shadow-2xl shadow-[#38b6ff]/50 hover:shadow-[#38b6ff]/70 hover:scale-105">
          <span>Start Controlling Now</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={18}
            height={18}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </button> */}
 <motion.a
  href="https://www.crewseed.com/signup" // Updated to signup path
  target="_blank"
  rel="noopener noreferrer"
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: false }}
  whileHover={{ 
    scale: 1.05,
    backgroundColor: "#d1ec44",
    color: "#0f172a" // slate-900
  }}
  whileTap={{ scale: 0.95 }}
  transition={{ type: "spring", stiffness: 400, damping: 10 }}
  className="inline-flex border-2 border-[#d1ec44] text-[#d1ec44] px-12 py-6 text-base font-black uppercase tracking-widest transition-all rounded-full items-center justify-center gap-3 group shadow-xl shadow-[#d1ec44]/10"
>
  <span>Sign Up now</span>
  
  {/* Modern Animated Arrow */}
  <motion.svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={3}
    strokeLinecap="round"
    strokeLinejoin="round"
    initial={{ x: 0 }}
    variants={{
      hover: { x: 5 }
    }}
    className="transition-transform group-hover:translate-x-1"
  >
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </motion.svg>
</motion.a>
      </div>
      <div className="mt-12 flex items-center justify-center gap-8 text-xs uppercase tracking-widest text-white/40">
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"   
            width={16}
            height={16}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
          </svg>
          <span>Fraud-Proof</span>
        </div>
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={16}
            height={16}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
            <path d="m9 12 2 2 4-4" />
          </svg>
          <span>100% Accurate</span>
        </div>
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={16}
            height={16}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx={9} cy={7} r={4} />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          <span>Built for Reality</span>
        </div>
      </div>
    </div>
  </section>
  {/* Footer */}
  <footer className="bg-slate-900 text-white py-20 px-6 md:px-12 border-t border-white/10">
    <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
      <div className="md:col-span-4">
          <img 
              src="/crewlogo.svg"
              alt="Company Logo"
              className="w-24 h-24 pb-4 object-contain"
            />
        <p className="text-white/60 leading-relaxed mb-6 max-w-xs">
          Blue-collar workforce control platform. Photo-verified attendance.
          Automated payroll. Complete transparency.
        </p>
        <div className="text-xs text-white/40 uppercase tracking-widest">
          Built for India. Designed for Scale.
        </div>
      </div>
      <div className="md:col-span-3">
        <h5 className="text-xs font-black uppercase tracking-widest mb-6 text-[#d1ec44]">
          Product
        </h5>
        <ul className="space-y-3">
          <li>
            <a
              href="#features"
              className="hover:text-[#38b6ff] transition-colors text-white/80"
            >
              Control Center
            </a>
          </li>
          <li>
            <a
              href="#how-it-works"
              className="hover:text-[#38b6ff] transition-colors text-white/80"
            >
              How It Works
            </a>
          </li>
          <li>
            <a
              href="#"
              className="hover:text-[#38b6ff] transition-colors text-white/80"
            >
              Pricing
            </a>
          </li>
          <li>
            <a
              href="#"
              className="hover:text-[#38b6ff] transition-colors text-white/80"
            >
              Security
            </a>
          </li>
        </ul>
      </div>
      <div className="md:col-span-2">
        <h5 className="text-xs font-black uppercase tracking-widest mb-6 text-[#d1ec44]">
          Company
        </h5>
        <ul className="space-y-3">
          <li>
            <a
              href="#"
              className="hover:text-[#38b6ff] transition-colors text-white/80"
            >
              About
            </a>
          </li>
          <li>
            <a
              href="#"
              className="hover:text-[#38b6ff] transition-colors text-white/80"
            >
              Careers
            </a>
          </li>
          <li>
            <a
              href="#"
              className="hover:text-[#38b6ff] transition-colors text-white/80"
            >
              Contact
            </a>
          </li>
          <li>
            <a
              href="#"
              className="hover:text-[#38b6ff] transition-colors text-white/80"
            >
              Blog
            </a>
          </li>
        </ul>
      </div>
      <div className="md:col-span-3">
        <h5 className="text-xs font-black uppercase tracking-widest mb-6 text-[#d1ec44]">
          Resources
        </h5>
        <ul className="space-y-3">
          <li>
            <a
              href="#"
              className="hover:text-[#38b6ff] transition-colors text-white/80"
            >
              Help Center
            </a>
          </li>
          <li>
            <a
              href="#"
              className="hover:text-[#38b6ff] transition-colors text-white/80"
            >
              Documentation
            </a>
          </li>
          <li>
            <a
              href="#"
              className="hover:text-[#38b6ff] transition-colors text-white/80"
            >
              Case Studies
            </a>
          </li>
          <li>
            <a
              href="#"
              className="hover:text-[#38b6ff] transition-colors text-white/80"
            >
              API
            </a>
          </li>
        </ul>
      </div>
    </div>
    <div className="max-w-screen-2xl mx-auto pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs uppercase tracking-widest text-white/40">
      <span>© 2026 CrewSeed. All rights reserved.</span>
      <div className="flex gap-8">
        <a href="#" className="hover:text-white transition-colors">
          Privacy
        </a>
        <a href="#" className="hover:text-white transition-colors">
          Terms
        </a>
        <a href="#" className="hover:text-white transition-colors">
          Cookies
        </a>
      </div>
    </div>
  </footer>
</div>
  </>
  );
}

