import { useEffect, useRef } from "react";
import { gsap } from "../../utils/gsap";
import MatrixRain from "../../components/effects/MatrixRain";
import MagneticButton from "../../components/effects/MagneticButton";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();
  const headingRef = useRef(null);
  const subRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      headingRef.current,
      { y: 80, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: "power4.out" }
    );

    gsap.fromTo(
      subRef.current,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, delay: 0.4, duration: 1, ease: "power3.out" }
    );
  }, []);

  return (
    <section className="relative min-h-screen bg-slate-950 overflow-hidden flex items-center">
      <MatrixRain />

      <div className="relative z-10 max-w-screen-2xl mx-auto px-6 text-center">
        <h1
          data-gsap="hero-title"

          ref={headingRef}
          className="text-6xl md:text-8xl font-black leading-[0.85] tracking-tighter text-white mb-6"
        >
          From Chaos
          <br />
          <span className="gradient-text-animate">to Clarity</span>
        </h1>

        <p
          data-gsap="hero-sub"

          ref={subRef}
          className="max-w-3xl mx-auto text-white/70 text-lg md:text-xl leading-relaxed mb-10"
        >
          Hiring, attendance, payroll & workforce management — built for
          real-world blue-collar operations.
        </p>

        <div className="flex justify-center gap-6">
          <MagneticButton
            onClick={() => navigate("/how-it-works")}
            className="px-10 py-4 rounded-full bg-[#38b6ff] text-white font-bold hover:bg-[#38b6ff]/90"
          >
            See how it works
          </MagneticButton>

          <MagneticButton
            className="px-10 py-4 rounded-full border border-white/20 text-white hover:bg-white hover:text-slate-900"
          >
            For Employers
          </MagneticButton>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
