import { useEffect, useState } from "react";
import Preloader from "./Preloader";

const PRELOADER_KEY = "crewseed-preloader-shown";

const PreloaderGate = ({ children }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hasShown = sessionStorage.getItem(PRELOADER_KEY);

    if (!hasShown) {
      setShow(true);
      sessionStorage.setItem(PRELOADER_KEY, "true");

      const timer = setTimeout(() => {
        setShow(false);
      }, 7500); // ⏱️ GIF duration

      return () => clearTimeout(timer);
    }
  }, []);

  if (show) {
    return <Preloader />;
  }

  return children;
};

export default PreloaderGate;
