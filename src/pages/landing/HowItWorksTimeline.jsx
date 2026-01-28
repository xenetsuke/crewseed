import { useEffect, useRef } from "react";
import { gsap } from "../../utils/gsap";

export default function HowItWorksTimeline() {
  const ref = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      ref.current.children,
      { x: -60, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        stagger: 0.25,
        scrollTrigger: {
          trigger: ref.current,
          start: "top 80%",
        },
      }
    );
  }, []);

  return (
    <section className="py-32 bg-slate-950 text-white">
      <div ref={ref} className="max-w-4xl mx-auto px-6 space-y-6">
        {/* steps */}
      </div>
    </section>
  );
}
