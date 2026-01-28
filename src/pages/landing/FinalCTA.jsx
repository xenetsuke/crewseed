import MagneticButton from "../../components/effects/MagneticButton";

export default function FinalCTA() {
  return (
    <section className="py-32 bg-gradient-to-r from-[#38b6ff] to-[#d1ec44] text-center">
      <h2 className="text-5xl font-black mb-6 text-slate-900">
        Ready to simplify operations?
      </h2>
      <MagneticButton className="bg-slate-900 text-white px-10 py-4 rounded-full">
        Get Started
      </MagneticButton>
    </section>
  );
}
