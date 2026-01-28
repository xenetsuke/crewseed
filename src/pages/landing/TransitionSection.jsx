import { motion } from "framer-motion";

const TransitionSection = () => {
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut", staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
  };

  return (
    <section className="py-32 bg-white overflow-hidden relative" id="transition">
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -top-[10%] -left-[5%] w-[40%] h-[40%] bg-[#38b6ff]/10 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          className="absolute -bottom-[10%] -right-[5%] w-[40%] h-[40%] bg-[#d1ec44]/10 rounded-full blur-[120px]"
        />
      </div>

      <div className="max-w-screen-2xl mx-auto px-6 md:px-12 relative z-10">
        {/* Header Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="text-center mb-24"
        >
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
            Most platforms stop at job posting. CrewSeed simplifies
            <span className="inline-block text-slate-900 border-b-8 border-[#d1ec44] px-2 py-1 transform -rotate-1 ml-2">
              hiring → job discovery → attendance → payroll
            </span>
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-stretch">
          {/* Old Way Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -10 }}
            transition={{ duration: 0.6 }}
            className="group perspective-1000"
            id="oldWay"
          >
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
                Hiring & Jobs <br />
                <span className="text-red-500">Full of Friction</span>
              </h3>

              <ul className="space-y-10">
                {[
                  {
                    title: "Agent & Contractor Dependency",
                    desc:
                      "Employers rely on middlemen. Workers depend on agents who take commissions and give inconsistent job details."
                  },
                  {
                    title: "No Real Job Visibility",
                    desc:
                      "Workers hear about jobs through word-of-mouth or WhatsApp forwards — no clear location, wage, or shift info."
                  },
                  {
                    title: "Slow & Unreliable Hiring",
                    desc:
                      "Calling hundreds of workers, last-minute dropouts, and no guarantee who will actually show up on-site."
                  },
                  {
                    title: "Mismatch & Drop-offs",
                    desc:
                      "Wrong skills, wrong location, wrong shift — leading to high absenteeism and re-hiring every day."
                  }
                ].map((item, idx) => (
                  <motion.li
                    key={idx}
                    variants={itemVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="flex gap-4"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2.5 shrink-0" />
                    <div>
                      <strong className="block text-xl text-slate-900 mb-1 font-bold">
                        {item.title}
                      </strong>
                      <p className="text-slate-500 text-lg">{item.desc}</p>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* New Way Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -10 }}
            transition={{ duration: 0.6 }}
            className="group perspective-1000"
            id="newWay"
          >
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
                  Hiring & Jobs <br />
                  <span className="text-[#38b6ff]">Made Simple</span>
                </h3>

                <ul className="space-y-10">
                  {[
                    {
                      title: "One-Tap Job Discovery",
                      desc:
                        "Workers see nearby jobs with clear pay, shift timing, location, and duration — no agents, no confusion."
                    },
                    {
                      title: "Instant Bulk Hiring",
                      desc:
                        "Employers post jobs and instantly assign 10–500 workers based on skills, availability, and location."
                    },
                    {
                      title: "Smart Matching",
                      desc:
                        "Right worker, right site, right shift — reducing absenteeism and daily rehiring chaos."
                    },
                    {
                      title: "Guaranteed Show-Up",
                      desc:
                        "Assigned workers get app + SMS confirmation, reminders, and clear joining instructions."
                    },
                    {
                      title: "End-to-End Control",
                      desc:
                        "From job posting to attendance, approval, and payroll — everything happens in one system."
                    }
                  ].map((item, idx) => (
                    <motion.li
                      key={idx}
                      variants={itemVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      className="flex gap-4"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-[#38b6ff] mt-2.5 shrink-0" />
                      <div>
                        <strong className="block text-xl text-white mb-1 font-bold">
                          {item.title}
                        </strong>
                        <p className="text-slate-400 text-lg">{item.desc}</p>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TransitionSection;
