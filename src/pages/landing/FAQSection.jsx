import React, { useState } from "react";
import Input from "components/ui/Input";
import Icon from "components/AppIcon";

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAll, setShowAll] = useState(false);

  const faqs = [
    {
      question: "What exactly does CrewSeed solve?",
      answer:
        "CrewSeed is an end-to-end workforce control platform for blue-collar operations. It handles job discovery, bulk hiring, photo-verified attendance, automated payroll, and dispute-proof records.",
      category: "platform",
    },
    {
      question: "How does bulk hiring work on CrewSeed?",
      answer:
        "Employers can assign 10–500+ workers in one flow. Joining status, replacements, attendance, and payroll are managed from a single dashboard.",
      category: "hiring",
    },
    {
      question: "How do workers find jobs?",
      answer:
        "Workers see nearby jobs based on skill, shift, and location. No resumes, no agents — just direct job access.",
      category: "jobs",
    },
    {
      question: "How is attendance verified?",
      answer:
        "Attendance uses selfie photo verification with GPS and timestamp. This removes proxy attendance and fake entries.",
      category: "attendance",
    },
    {
      question: "How is payroll calculated?",
      answer:
        "Payroll is auto-calculated from verified attendance including wages, overtime, bata, PF, and ESI. Both employer and worker see the same numbers.",
      category: "payroll",
    },
    {
      question: "Can CrewSeed handle multiple sites?",
      answer:
        "Yes. CrewSeed is built for scale — manage multiple sites, contractors, and projects from one system.",
      category: "scale",
    },
    {
      question: "How does CrewSeed prevent disputes?",
      answer:
        "Every record has photo, location, and time proof. Payroll is generated from approved attendance, eliminating arguments.",
      category: "security",
    },
  ];

  const filteredFAQs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Determine which items to display
  const displayFAQs = showAll ? filteredFAQs : filteredFAQs.slice(0, 4);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      className="relative py-20 md:py-28 px-4 md:px-8 overflow-hidden 
      bg-gradient-to-r from-[#38b6ff] via-[#d1ec44] to-[#38b6ff] 
      bg-[length:200%_auto] animate-[shine_6s_linear_infinite]"
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-slate-500/40 backdrop-blur-md" />

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-6">
            Frequently Asked Questions
          </h2>

          <p className="text-base md:text-xl text-white/70 max-w-2xl mx-auto mb-8">
            Everything you need to know about hiring, attendance, and payroll on
            CrewSeed
          </p>

          <div className="max-w-xl mx-auto">
            <Input
              type="search"
              placeholder="Search hiring, payroll, attendance…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/10 border-white/20 text-white placeholder:text-white/40"
            />
          </div>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {displayFAQs.length > 0 ? (
            <>
              {displayFAQs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-slate-900/95 rounded-2xl border border-white/10 overflow-hidden 
                  transition-all duration-300 hover:border-[#38b6ff]"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex items-center justify-between p-5 md:p-6 text-left 
                    hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <div className="p-2 bg-[#38b6ff]/10 rounded-full mt-1">
                        <Icon name="HelpCircle" size={20} color="#38b6ff" />
                      </div>
                      <span className="text-base md:text-lg font-semibold text-white pr-4">
                        {faq.question}
                      </span>
                    </div>

                    <Icon
                      name={openIndex === index ? "ChevronUp" : "ChevronDown"}
                      size={22}
                      className="text-white/60"
                    />
                  </button>

                  {openIndex === index && (
                    <div className="px-5 md:px-6 pb-5 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="pl-10 md:pl-12 pr-2">
                        <p className="text-sm md:text-base text-white/70 leading-relaxed">
                          {faq.answer}
                        </p>

                        <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 
                        bg-white/5 rounded-full">
                          <Icon name="Tag" size={14} color="#d1ec44" />
                          <span className="text-xs font-medium text-white/60 capitalize">
                            {faq.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Toggle Show All Button */}
              {filteredFAQs.length > 4 && (
                <div className="text-center mt-8">
                  <button
                    onClick={() => setShowAll(!showAll)}
                    className="group inline-flex items-center gap-2 text-black font-bold hover:text-white transition-colors"
                  >
                    {showAll ? "Show Less" : `View All ${filteredFAQs.length} Questions`}
                    <Icon 
                      name={showAll ? "ChevronUp" : "ChevronDown"} 
                      size={20} 
                      className="group-hover:translate-y-1 transition-transform" 
                    />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 text-white/70">
              <Icon name="Search" size={48} className="mx-auto mb-4 opacity-40" />
              <p>No results for “{searchQuery}”</p>
            </div>
          )}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-white/5 rounded-3xl p-8 border border-white/10 backdrop-blur-md">
            <Icon
              name="MessageCircle"
              size={32}
              color="#d1ec44"
              className="mx-auto mb-4"
            />
            <h3 className="text-2xl font-bold text-white mb-3">
              Still have questions?
            </h3>
            <p className="text-white/60 mb-6">
              Our CrewSeed support team is here to help.
            </p>

            <a
              href="mailto:contact@crewseed.com"
              className="inline-flex items-center gap-2 px-8 py-3 
              bg-[#d1ec44] text-slate-900 font-bold rounded-full 
              hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#d1ec44]/20"
            >
              <Icon name="Mail" size={18} />
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;