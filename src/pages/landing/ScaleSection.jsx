import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ScaleSection = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Header Reveal (Plays and Resets)
      gsap.from(".scale-header > *", {
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ".scale-header",
          start: "top 85%",
          toggleActions: "play none none reverse",
        }
      });

      // 2. Optimized Count-up with Overflow Fix
      const counters = gsap.utils.toArray(".counter");
      counters.forEach((counter) => {
        const target = parseInt(counter.getAttribute('data-target'));
        
        gsap.fromTo(counter, 
          { innerText: 0 },
          {
            innerText: target,
            duration: 2.5,
            snap: { innerText: 1 },
            ease: "expo.out",
            scrollTrigger: {
              trigger: counter,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
            onUpdate: function() {
              counter.innerText = Math.floor(this.targets()[0].innerText).toLocaleString();
            }
          }
        );
      });

      // 3. Map Box Entrance
      gsap.from(".map-container", {
        scale: 0.95,
        opacity: 0,
        duration: 1.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".map-container",
          start: "top 80%",
          toggleActions: "play none none reverse",
        }
      });

      // 4. City Tags Entrance
      gsap.from(".city-tag", {
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.05,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: ".city-grid",
          start: "top 85%",
          toggleActions: "play none none reverse",
        }
      });

      // 5. Trust Cards (Staggered)
      gsap.from(".trust-card", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".trust-grid",
          start: "top 90%",
          toggleActions: "play none none reverse",
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="scale" className="py-24 md:py-32 bg-white overflow-hidden relative">
      <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
        <div className="text-center mb-20 scale-header">
          <span className="text-xs font-black text-[#38b6ff] uppercase tracking-widest mb-4 block">
            Proven at Scale
          </span>
          <h2 className="text-4xl md:text-7xl font-black tracking-tighter mb-6 text-slate-900 leading-[1.1]">
            Designed for India.
            <br />
            <span className="bg-gradient-to-r from-[#38b6ff] to-[#d1ec44] bg-clip-text text-transparent">
              Built for Reality.
            </span>
          </h2>
        </div>

        {/* Stats Grid - Tabular numbers prevent layout shift during counting */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {[
            { label: "Workers Tracked", sub: "Photo-Verified Daily", target: 12000, suffix: "+" },
            { label: "Attendance Photos", sub: "GPS + Timestamp Verified", target: 450000, suffix: "+" },
            { label: "Payroll Processed", sub: "100% Accuracy. Zero Errors.", target: 84, prefix: "₹", suffix: "Cr+" },
          ].map((stat, i) => (
            <div key={i} className="text-center p-6 rounded-3xl transition-all duration-500 hover:shadow-xl hover:shadow-slate-100 group">
              <div className="text-5xl lg:text-8xl font-black text-slate-900 mb-4 flex items-center justify-center tabular-nums tracking-tight">
                {stat.prefix}<span className="counter" data-target={stat.target}>0</span>{stat.suffix}
              </div>
              <div className="text-sm uppercase tracking-widest text-slate-600 font-extrabold mb-2 group-hover:text-[#38b6ff] transition-colors">
                {stat.label}
              </div>
              <div className="text-xs text-slate-400 font-bold">{stat.sub}</div>
            </div>
          ))}
        </div>

        {/* Map Visual */}
        <div className="map-container bg-slate-950 rounded-[2rem] md:rounded-[3rem] p-8 md:p-20 relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 opacity-20 transition-transform duration-[2000ms] hover:scale-110">
            <img
              src="https://img.rocket.new/generatedImages/rocket_gen_img_1d79ba782-1764849105292.png"
              alt="Operational Map"
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="relative z-10 text-center">
            <h3 className="text-3xl md:text-6xl font-black text-white mb-6 tracking-tight">
              Operating Across
              <br />
              <span className="bg-gradient-to-r from-[#38b6ff] to-[#d1ec44] bg-clip-text text-transparent">15+ Cities</span>
            </h3>
            <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
              From Mumbai construction sites to Delhi factories to Bangalore
              logistics — CrewSeed handles blue-collar workforce control across
              India.
            </p>
            
            <div className="flex flex-wrap justify-center gap-2 md:gap-3 city-grid max-w-4xl mx-auto">
              {["Mumbai", "Delhi", "Bangalore", "Pune", "Hyderabad", "Chennai", "Ahmedabad", "Kolkata", "+7 More"].map((city, idx) => (
                <span key={idx} className="city-tag px-4 md:px-6 py-2 md:py-3 bg-white/5 backdrop-blur-md rounded-xl md:rounded-2xl text-xs md:text-sm font-black text-white border border-white/10 hover:border-[#38b6ff] hover:bg-white/10 transition-all cursor-default">
                  {city}
                </span>
              ))}
            </div>
          </div>
          
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#38b6ff] opacity-10 blur-[100px] rounded-full" />
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#d1ec44] opacity-10 blur-[100px] rounded-full" />
        </div>

        {/* Trust Indicators */}
        <div className="mt-24 grid md:grid-cols-3 gap-12 trust-grid">
          {[
            {
              title: "Secure",
              desc: "Bank-grade encryption. All photos + data protected.",
              icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />,
              color: "text-[#38b6ff]",
              bg: "bg-[#38b6ff]/10"
            },
            {
              title: "Reliable",
              desc: "99.9% uptime. Works offline. Always available.",
              icon: <><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path d="m9 12 2 2 4-4" /></>,
              color: "text-[#d1ec44]",
              bg: "bg-[#d1ec44]/20"
            },
            {
              title: "Built for Reality",
              desc: "Designed for real blue-collar operations. Not generic HR software.",
              icon: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx={9} cy={7} r={4} /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>,
              color: "text-[#38b6ff]",
              bg: "bg-[#38b6ff]/10"
            }
          ].map((item, i) => (
            <div key={i} className="trust-card text-center group">
              <div className={`w-20 h-20 rounded-3xl ${item.bg} flex items-center justify-center mx-auto mb-6 group-hover:rotate-6 transition-transform duration-500`}>
                <svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className={item.color}>
                  {item.icon}
                </svg>
              </div>
              <h4 className="text-2xl font-black text-slate-900 mb-3">{item.title}</h4>
              <p className="text-slate-500 text-sm leading-relaxed max-w-[260px] mx-auto font-medium">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ScaleSection;