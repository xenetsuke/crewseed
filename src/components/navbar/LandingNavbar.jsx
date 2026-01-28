import { useNavigate } from "react-router-dom";
import MagneticButton from "../effects/MagneticButton";

const LandingNavbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 w-full z-50 glass-dark">
      <div className="max-w-screen-2xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="text-white font-black tracking-widest text-sm">
          BLUECOLLAR
        </div>

        <div className="flex items-center gap-6">
          <button className="text-white/70 hover:text-white text-xs tracking-widest uppercase">
            Employers
          </button>

          <button className="text-white/70 hover:text-white text-xs tracking-widest uppercase">
            Workers
          </button>

          <MagneticButton
            onClick={() => navigate("/how-it-works")}
            className="bg-white text-slate-900 px-6 py-2.5 text-xs font-black uppercase tracking-widest rounded-full hover:bg-[#d1ec44]"
          >
            How it works
          </MagneticButton>
        </div>
      </div>
    </nav>
  );
};

export default LandingNavbar;
