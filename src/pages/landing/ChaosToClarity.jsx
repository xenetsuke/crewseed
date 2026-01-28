import { useEffect, useRef } from "react";
import { gsap } from "../../utils/gsap";

export default function ChaosToClarity() {
  const sectionRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      sectionRef.current.children,
      { y: 80, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.2,
        duration: 1,
        ease: "power4.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
      }
    );
  }, []);

  return (
    <section ref={sectionRef} className="py-32 bg-slate-900 text-white">
      {/* cards */}
    </section>
  );
}
