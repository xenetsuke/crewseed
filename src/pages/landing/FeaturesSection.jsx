import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

// Helper for count-up animation
const Counter = ({ value, duration = 2 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = parseInt(value.toString().replace(/[^0-9]/g, ""));
      if (start === end) return;
      
      let totalMiliseconds = duration * 1000;
      let incrementTime = totalMiliseconds / end;

      let timer = setInterval(() => {
        start += 1;
        setCount(start);
        if (start === end) clearInterval(timer);
      }, incrementTime);

      return () => clearInterval(timer);
    }
  }, [isInView, value, duration]);

  return <span ref={ref}>{value.toString().includes('%') ? `${count}%` : count}</span>;
};

const FeaturesSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <section id="features" className="py-32 bg-slate-900 text-white overflow-hidden relative">
      {/* Noise texture */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")'
        }}
      />

      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="max-w-screen-2xl mx-auto px-6 md:px-12 relative z-10"
      >
        <motion.div variants={itemVariants} className="mb-20">
          <span className="text-xs font-black text-[#d1ec44] uppercase tracking-widest mb-4 block">
            Exclusive for Employers
          </span>
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
            HR Control Center.
            <br />
            <span className="bg-gradient-to-r from-[#38b6ff] to-[#d1ec44] bg-clip-text text-transparent">
              Built for Scale.
            </span>
          </h2>
          <p className="text-xl text-white/70 max-w-2xl font-medium leading-relaxed">
            The only platform designed for blue-collar reality. Photo review.
            Instant approval. Live payroll updates. Complete workforce control.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Feature Callouts (Left Column) */}
          <div className="lg:col-span-4 space-y-6">
            {[
              {
                title: "Photo Verification",
                desc: "GPS coordinates + timestamp on every photo. Verify workers are actually on-site. Zero fraud.",
                color: "from-[#38b6ff] to-[#38b6ff]/50",
                icon: <rect width={18} height={18} x={3} y={3} rx={2} />
              },
              {
                title: "Instant Approval",
                desc: "Review photo + metadata. Approve or reject in 2 taps. Payroll calculates instantly.",
                color: "from-[#d1ec44] to-[#d1ec44]/50",
                icon: <path d="M12 2v20M2 12h20" />,
                iconColor: "text-slate-900"
              },
              {
                title: "Auto Payroll",
                desc: "OT, Bata, Advance deductions — everything calculated automatically. Zero manual errors.",
                color: "from-[#38b6ff] to-[#d1ec44]",
                icon: <><path d="M12 22v-5" /><path d="M9 8V2" /><path d="M15 8V2" /><path d="M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z" /></>
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={{ x: 10 }}
                className="glass-dark rounded-3xl p-8 border border-[#38b6ff]/30 hover:border-[#38b6ff] transition-all duration-500 group cursor-default"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={feature.iconColor || "text-white"}>
                    {feature.icon}
                  </svg>
                </div>
                <h3 className="text-2xl font-black mb-3">{feature.title}</h3>
                <p className="text-white/70 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Dashboard Preview (Main Column) */}
          <motion.div variants={itemVariants} className="lg:col-span-8">
            <div className="glass-dark rounded-[2.5rem] p-8 md:p-12 border border-[#38b6ff]/30 relative overflow-hidden group h-full">
              <motion.div 
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.2, 0.3, 0.2] 
                }}
                transition={{ duration: 8, repeat: Infinity }}
                className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-br from-[#38b6ff]/20 to-transparent blur-3xl" 
              />
              
              <div className="relative z-10 h-full flex flex-col">
                <div className="mb-8">
                  <div className="text-xs uppercase tracking-widest text-[#d1ec44] mb-2 font-bold">Live Command Panel</div>
                  <h3 className="text-4xl font-black mb-4">Watch Everything Happen Live</h3>
                  <p className="text-white/70 max-w-xl">See attendance photos as workers upload them. Approve instantly. Watch payroll calculate in real-time.</p>
                </div>

                {/* Animated Mock UI */}
                <motion.div 
                  initial={{ y: 40, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 1 }}
                  className="flex-1 bg-slate-950/50 rounded-2xl p-6 border border-white/10 shadow-2xl"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-[#38b6ff]/20 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="text-[#38b6ff]">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx={9} cy={7} r={4} /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                          </svg>
                        </div>
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-950 rounded-full animate-pulse"></span>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">Rajesh Kumar</div>
                        <div className="text-xs text-white/60">Site: Andheri Construction</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <motion.button whileTap={{ scale: 0.95 }} className="px-4 py-2 bg-[#d1ec44] text-slate-900 rounded-lg text-xs font-black hover:shadow-[0_0_15px_rgba(209,236,68,0.4)] transition-all">Approve</motion.button>
                      <motion.button whileTap={{ scale: 0.95 }} className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-xs font-black hover:bg-red-500/30 transition-colors">Reject</motion.button>
                    </div>
                  </div>

                  <div className="aspect-video rounded-xl overflow-hidden bg-slate-800 mb-4 relative group/img">
                    <img src="https://images.unsplash.com/photo-1628673178245-081fbf621b1d" alt="Attendance" className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent flex items-end p-4">
                       <span className="text-[10px] text-white/80 font-mono">LAT: 19.1136° N | LONG: 72.8697° E</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: "Time", val: "08:42 AM", color: "text-white" },
                      { label: "GPS", val: "Verified", color: "text-[#d1ec44]" },
                      { label: "Status", val: "Pending", color: "text-[#38b6ff]" }
                    ].map((stat, idx) => (
                      <div key={idx} className="bg-slate-900/50 rounded-lg p-3 border border-white/5">
                        <div className="text-xs text-white/60 mb-1">{stat.label}</div>
                        <div className={`text-sm font-bold ${stat.color}`}>{stat.val}</div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Key Stats */}
        <motion.div variants={itemVariants} className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-white/10 pt-16">
          {[
            { val: "0", label: "Attendance Fraud", color: "text-[#38b6ff]" },
            { val: "0", label: "Manual Entry", color: "text-[#38b6ff]" },
            { val: "2", label: "Taps to Approve", color: "text-[#d1ec44]" },
            { val: "100%", label: "Payroll Accuracy", color: "text-[#d1ec44]" }
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className={`text-4xl md:text-5xl font-black ${stat.color} mb-2`}>
                <Counter value={stat.val} />
              </div>
              <div className="text-sm text-white/60 uppercase tracking-widest font-bold">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default FeaturesSection;