import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';

const steps = [
  {
    number: 1,
    title: "Job Created",
    desc: "Employer creates job with site location, shift timing, pay structure. Takes 2 minutes.",
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
    desc: "Worker clicks on-site photo. GPS + timestamp captured automatically. Impossible to fake.",
    features: ["GPS verified", "Timestamp captured", "Stored securely"],
    duration: "5 seconds",
    gradient: "from-[#38b6ff] to-[#d1ec44]"
  },
  {
    number: 5,
    title: "HR Approves",
    desc: "HR reviews photo + GPS + timestamp. Approve or reject in 2 taps. Worker notified instantly.",
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
    desc: "Payday arrives → payslip auto-generated. Worker downloads from app. Transparent.",
    features: ["Auto-generated", "Download in app", "Share as PDF"],
    duration: "Automatic",
    gradient: "from-[#38b6ff] to-[#d1ec44]"
  }
];

const HowItWorks = () => {
  const sliderRef = useRef(null);
  const loopRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const slider = sliderRef.current;
    const cards = gsap.utils.toArray(".step-card");
    
    cards.forEach(card => {
      const clone = card.cloneNode(true);
      slider.appendChild(clone);
    });

    const totalWidth = slider.scrollWidth / 2;

    loopRef.current = gsap.to(slider, {
      x: `-=${totalWidth}`,
      duration: 40,
      ease: "none",
      repeat: -1,
      paused: false,
    });

    return () => {
      if (loopRef.current) loopRef.current.kill();
    };
  }, []);

  const handleNav = (direction) => {
    const card = document.querySelector('.step-card');
    if (!card || !loopRef.current) return;

    const newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (newIndex < 0 || newIndex >= steps.length) return;

    setCurrentIndex(newIndex);
    loopRef.current.pause();

    const style = window.getComputedStyle(card);
    const marginRight = parseFloat(style.marginRight) || 32;
    const moveAmount = card.offsetWidth + marginRight;

    gsap.to(sliderRef.current, {
      x: -(newIndex * moveAmount),
      duration: 0.8,
      ease: "power4.out"
    });
  };

  return (
    <section 
      id="how-it-works" 
      className="py-20 md:py-32 bg-slate-900 text-white overflow-hidden relative"
      onMouseLeave={() => {
        // Animation restarts when user leaves the section
        loopRef.current?.play();
        setCurrentIndex(0); // Optional: resets index for infinite flow
      }}
    >
      <div className="max-w-screen-2xl mx-auto px-6 md:px-12 mb-12 text-center">
        <span className="text-xs font-black text-[#d1ec44] uppercase tracking-widest mb-4 block">The Complete Flow</span>
        <h2 className="text-4xl md:text-7xl font-black tracking-tighter mb-6">
          Job to Payslip <br />
          <span className="bg-gradient-to-r from-[#38b6ff] to-[#d1ec44] bg-clip-text text-transparent">in 7 Steps</span>
        </h2>
      </div>

      {/* Desktop: Max-width removed for full view | Mobile: Centered container */}
      <div className="relative flex items-center justify-center max-w-full md:px-20 mx-auto group">
        
        {/* Navigation Buttons (Sidebar Bars) */}
        <button 
          onClick={() => handleNav('prev')}
          disabled={currentIndex === 0}
          className={`absolute left-2 md:left-8 z-40 h-32 w-1.5 md:w-2 rounded-full transition-all duration-300
            ${currentIndex === 0 
              ? 'bg-white/5 cursor-not-allowed' 
              : 'bg-[#38b6ff]/40 hover:bg-[#38b6ff] hover:w-3 cursor-pointer shadow-[0_0_20px_rgba(56,182,255,0.3)]'}`}
        />

        <button 
          onClick={() => handleNav('next')}
          disabled={currentIndex === steps.length - 1}
          className={`absolute right-2 md:right-8 z-40 h-32 w-1.5 md:w-2 rounded-full transition-all duration-300
            ${currentIndex === steps.length - 1 
              ? 'bg-white/5 cursor-not-allowed' 
              : 'bg-[#d1ec44]/40 hover:bg-[#d1ec44] hover:w-3 cursor-pointer shadow-[0_0_20px_rgba(209,236,68,0.3)]'}`}
        />

        {/* Viewport: Full width on desktop, single card width logic on mobile */}
        <div 
          className="w-full md:max-w-none max-w-[90vw] overflow-hidden"
          onMouseEnter={() => loopRef.current?.pause()}
        >
          <div ref={sliderRef} className="flex gap-6 md:gap-10 w-max">
            {steps.map((step, idx) => (
              <div key={idx} className="step-card w-[85vw] md:w-[420px] group/card relative shrink-0">
                <div className="relative h-[480px] md:h-[500px] overflow-hidden rounded-3xl border border-[#38b6ff]/20 bg-slate-950/50 backdrop-blur-xl">
                  <div className="h-full p-8 md:p-10 flex flex-col justify-between relative z-10">
                    <div>
                      <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center mb-6 text-xl md:text-2xl font-black text-slate-900`}>
                        {step.number}
                      </div>
                      <h3 className="text-2xl md:text-3xl font-black mb-4">{step.title}</h3>
                      <p className="text-white/60 text-sm md:text-base mb-6 leading-relaxed">{step.desc}</p>
                      
                      <div className="space-y-3">
                        {step.features.map((feat, i) => (
                          <div key={i} className="flex items-center gap-3 text-xs md:text-sm text-white/50">
                            <svg className="text-[#38b6ff] shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/5 border border-white/10 w-fit">
                      <span className="text-[10px] md:text-xs uppercase tracking-widest text-[#d1ec44] font-black">
                        Duration: {step.duration}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;