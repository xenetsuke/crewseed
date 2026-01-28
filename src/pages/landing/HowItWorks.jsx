import React, { useState, useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

const steps = [
  {
    number: 1,
    title: "Job Created",
    desc: "Employer creates job with site location, shift timing, and pay structure.",
    features: ["Site location with GPS", "Shift timings defined", "Pay structure set"],
    duration: "2 minutes",
    gradient: "from-[#38b6ff] to-[#38b6ff]/50"
  },
  {
    number: 2,
    title: "Worker Assigned",
    desc: "Worker gets SMS with job details. Opens CrewSeed app to see assignment.",
    features: ["SMS sent instantly", "Assignment in app", "Worker confirms"],
    duration: "Instant",
    gradient: "from-[#38b6ff] to-[#38b6ff]/50"
  },
  {
    number: 3,
    title: "Attendance Auto-Created",
    desc: "Shift starts → attendance record created automatically. Worker uploads photo to verify.",
    features: ["Shift-aware creation", "Zero manual entry", "Works offline"],
    duration: "Automatic",
    gradient: "from-[#d1ec44] to-[#d1ec44]/50"
  },
  {
    number: 4,
    title: "Photo Uploaded",
    desc: "Worker clicks on-site photo. GPS + timestamp captured automatically.",
    features: ["GPS verified", "Timestamp captured", "Stored securely"],
    duration: "5 seconds",
    gradient: "from-[#38b6ff] to-[#d1ec44]"
  },
  {
    number: 5,
    title: "HR Approves",
    desc: "HR reviews photo + GPS + timestamp. Approve or reject in 2 taps.",
    features: ["Review all details", "One-tap approval", "Real-time update"],
    duration: "2 taps",
    gradient: "from-[#38b6ff] to-[#38b6ff]/50"
  },
  {
    number: 6,
    title: "Payroll Auto-Calculated",
    desc: "Moment HR approves → payroll calculates. Base pay, OT, Bata, Advance, PF, ESI.",
    features: ["OT auto-calculated", "All deductions applied", "Worker sees live earnings"],
    duration: "Instant",
    gradient: "from-[#d1ec44] to-[#d1ec44]/50"
  },
  {
    number: 7,
    title: "Payslip Generated",
    desc: "Payday arrives → payslip auto-generated. Worker downloads from app.",
    features: ["Auto-generated", "Download in app", "Share as PDF"],
    duration: "Automatic",
    gradient: "from-[#38b6ff] to-[#d1ec44]"
  }
];

const HowItWorks = () => {
  const [index, setIndex] = useState(0);
  const containerRef = useRef(null);

  const { scrollXProgress } = useScroll({ container: containerRef });
  const scaleX = useSpring(scrollXProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Fixed Navigation Logic
  const scrollToCard = (newIndex) => {
    if (containerRef.current) {
      const container = containerRef.current;
      const totalScrollable = container.scrollWidth - container.clientWidth;
      const perStep = totalScrollable / (steps.length - 1);
      
      const targetIndex = newIndex >= steps.length ? 0 : newIndex;
      
      container.scrollTo({
        left: targetIndex * perStep,
        behavior: 'smooth'
      });
      setIndex(targetIndex);
    }
  };

  return (
    <section id="how-it-works" className="py-24 md:py-32 bg-slate-900 text-white overflow-hidden relative">
      <div className="max-w-screen-2xl mx-auto px-6 md:px-12 mb-16 flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="max-w-2xl">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-xs font-black text-[#d1ec44] uppercase tracking-widest mb-4 block"
          >
            The Complete Flow
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-7xl font-black tracking-tighter"
          >
            Job to Payslip <br />
            <span className="bg-gradient-to-r from-[#38b6ff] to-[#d1ec44] bg-clip-text text-transparent">in 7 Steps</span>
          </motion.h2>
        </div>

        {/* Dynamic Step Counter */}
        <div className="flex gap-4 items-center">
            <span className="text-4xl font-black text-white/10 tabular-nums">
              0{index + 1}
            </span>
            <div className="w-32 h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div style={{ scaleX }} className="h-full bg-[#38b6ff] origin-left" />
            </div>
            <span className="text-sm font-bold text-white/40">07</span>
        </div>
      </div>

      <div className="relative group">
        <motion.div
          ref={containerRef}
          className="flex gap-6 overflow-x-auto px-[5vw] md:px-[10vw] pb-12 no-scrollbar scroll-smooth"
          style={{ scrollSnapType: "x mandatory" }}
          onScroll={(e) => {
             const container = e.currentTarget;
             const scrollPercentage = container.scrollLeft / (container.scrollWidth - container.clientWidth);
             const newIndex = Math.round(scrollPercentage * (steps.length - 1));
             if(newIndex !== index && newIndex >= 0 && newIndex < steps.length) {
               setIndex(newIndex);
             }
          }}
        >
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              style={{ scrollSnapAlign: "center" }}
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: false, margin: "-100px" }}
              transition={{ duration: 0.6, delay: idx * 0.05 }}
              className="relative shrink-0 w-[85vw] md:w-[420px]"
            >
              <div className="h-[520px] rounded-[2.5rem] bg-slate-950/40 border border-white/5 backdrop-blur-3xl p-8 md:p-10 flex flex-col justify-between group hover:border-[#38b6ff]/30 transition-colors duration-500">
                <span className="absolute -top-10 -right-4 text-[12rem] font-black text-white/[0.02] pointer-events-none group-hover:text-[#38b6ff]/[0.05] transition-colors duration-700">
                    {step.number}
                </span>

                <div className="relative z-10">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center mb-8 shadow-lg shadow-[#38b6ff]/20`}>
                    <span className="text-2xl font-black text-slate-900">{step.number}</span>
                  </div>
                  <h3 className="text-3xl font-black mb-4 tracking-tight group-hover:text-[#38b6ff] transition-colors">{step.title}</h3>
                  <p className="text-white/50 leading-relaxed mb-8 font-medium">{step.desc}</p>
                  <div className="space-y-3">
                    {step.features.map((feat, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#d1ec44]" />
                        <span className="text-sm font-bold text-white/70">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="relative z-10 pt-6 border-t border-white/5 flex items-center justify-between">
                  <div className="text-[10px] uppercase tracking-widest text-[#d1ec44] font-black">Duration: {step.duration}</div>
                  
                  <button 
                    onClick={() => scrollToCard(idx + 1)}
                    className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#38b6ff] group-hover:text-slate-900 transition-all cursor-pointer active:scale-90"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
          {/* Spacer to allow the last card to center correctly */}
          <div className="shrink-0 w-[5vw] md:w-[10vw]" />
        </motion.div>
      </div>

      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-[#38b6ff]/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#d1ec44]/5 blur-[150px] pointer-events-none" />
    </section>
  );
};

export default HowItWorks;