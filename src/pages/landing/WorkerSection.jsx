import { motion } from "framer-motion";

const WorkerSection = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  return (
    <section className="py-32 bg-white overflow-hidden relative">
      <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center mb-20"
        >
          <motion.span variants={fadeIn} className="text-xs font-black text-[#38b6ff] uppercase tracking-widest mb-4 block">
            For Workers
          </motion.span>
          <motion.h2 variants={fadeIn} className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-tight">
            See Work.
            <br />
            Click Photo.
            <br />
            <span className="text-slate-300">See Money.</span>
          </motion.h2>
          <motion.p variants={fadeIn} className="text-xl text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
            No confusion. No disputes. Workers see exactly what they'll earn —
            live, every day.
          </motion.p>
        </motion.div>

        {/* Mobile UI Showcase */}
        <div className="max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-slate-900 rounded-[60px] p-8 md:p-20 shadow-2xl border border-slate-800 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#38b6ff]/10 to-transparent opacity-50" />
            
            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
              {/* Mobile Mockup */}
              <motion.div 
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative mx-auto"
              >
                <div className="w-[280px] h-[580px] bg-slate-950 rounded-[50px] border-8 border-slate-800 overflow-hidden shadow-2xl relative">
                  <div className="w-full h-full bg-white flex flex-col">
                    {/* Status Bar */}
                    <div className="bg-slate-900 px-6 py-4 flex items-center justify-between">
                      <span className="text-white text-[10px] font-bold">9:41 AM</span>
                      <div className="flex gap-1">
                        <div className="w-1 h-1 rounded-full bg-white" />
                        <div className="w-1 h-1 rounded-full bg-white" />
                        <div className="w-1 h-1 rounded-full bg-white/40" />
                      </div>
                    </div>

                    {/* App Content */}
                    <div className="flex-1 p-5 overflow-y-auto">
                      <div className="mb-6">
                        <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Today's Work</div>
                        <div className="text-lg font-black text-slate-900 leading-tight">Andheri Site - Phase 2</div>
                      </div>

                      {/* Attendance Card */}
                      <motion.div 
                        whileHover={{ scale: 1.02 }}
                        className="bg-gradient-to-br from-[#38b6ff]/10 to-[#d1ec44]/10 rounded-2xl p-5 mb-4 border border-[#38b6ff]/20"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="text-xs font-black text-slate-900">Mark Attendance</div>
                          <motion.div 
                            animate={{ opacity: [1, 0.5, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="text-[10px] bg-[#d1ec44] text-slate-900 px-2 py-0.5 rounded-full font-black"
                          >
                            LIVE
                          </motion.div>
                        </div>
                        <motion.button 
                          whileTap={{ scale: 0.95 }}
                          className="w-full bg-[#38b6ff] text-white py-3 rounded-xl font-black text-xs shadow-lg shadow-[#38b6ff]/30"
                        >
                          Click Photo
                        </motion.button>
                      </motion.div>

                      {/* Earnings Card */}
                      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                        <div className="text-[10px] font-bold text-slate-400 mb-1">Total Earnings</div>
                        <motion.div 
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          className="text-2xl font-black text-slate-900 mb-3"
                        >
                          ₹11,240
                        </motion.div>
                        <div className="space-y-1.5 text-[11px]">
                          {/* <div className="flex justify-between text-slate-500">
                            <span>Monthly Pay</span>
                            <span className="font-bold text-slate-700">₹1,200</span>
                          </div> */}
                          <div className="flex justify-between text-slate-500">
                            <span>Overtime</span>
                            <span className="font-bold text-green-600">+₹40</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Decorative glow behind phone */}
                <div className="absolute -inset-4 bg-[#38b6ff]/20 blur-2xl rounded-[60px] -z-10" />
              </motion.div>

              {/* Feature List */}
              <motion.div 
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="space-y-8"
              >
                {[
                  {
                    title: "Simple",
                    desc: "Open app. Click photo. Done. Works even without internet.",
                    icon: <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />,
                    color: "bg-[#38b6ff]/20",
                    textColor: "text-[#38b6ff]"
                  },
                  {
                    title: "Clear Money",
                    desc: "See earnings live. OT, Bata, deductions — everything clear. No surprises.",
                    icon: <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />,
                    color: "bg-[#d1ec44]/20",
                    textColor: "text-[#d1ec44]"
                  },
                  {
                    title: "Get Payslip",
                    desc: "Download payslip anytime. Share with family. Use for loans.",
                    icon: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1={12} x2={12} y1={15} y2={3} /></>,
                    color: "bg-[#38b6ff]/20",
                    textColor: "text-[#38b6ff]"
                  }
                ].map((item, idx) => (
                  <motion.div key={idx} variants={fadeIn} className="flex items-start gap-4 group/item">
                    <div className={`w-12 h-12 rounded-2xl ${item.color} flex items-center justify-center shrink-0 group-hover/item:scale-110 transition-transform`}>
                      <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className={item.textColor}>
                        {item.icon}
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-white mb-2">{item.title}</h4>
                      <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Trust Statement */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <blockquote className="text-2xl md:text-3xl font-bold text-slate-900 max-w-3xl mx-auto leading-tight italic">
"भरोसा कागज़ों पर नहीं, स्क्रीन पर है। ड्यूटी खत्म होते ही ओटी का हिसाब हाज़िर—नो चिक-चिक, नो झंझट।"          </blockquote>
          <div className="mt-8 flex items-center justify-center gap-4">
            <div className="w-14 h-14 rounded-full bg-slate-100 border-2 border-white shadow-md overflow-hidden">
               <div className="w-full h-full bg-gradient-to-tr from-slate-200 to-slate-400" />
            </div>
            <div className="text-left">
              <div className="font-black text-slate-900">Ramesh Yadav</div>
              <div className="text-sm text-slate-500 font-medium">
                Construction Worker, Mumbai
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WorkerSection;