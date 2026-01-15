import React from "react";

const Preloader = () => {
  const isMobile = window.innerWidth < 768;

  return (
    <div
      style={{
        position: "fixed",
        // inset: 0 covers the whole screen
        inset: 0,
        // ✅ Changed from solid white to semi-transparent
        backgroundColor: "rgba(255, 255, 255, 0.3)", 
        // ✅ Adds the blur effect to the content behind it
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)", // For Safari support
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        // Ensures it doesn't capture clicks on invisible areas if needed
        pointerEvents: "all", 
      }}
    >
      <img
        src={isMobile ? "/Crewm.gif" : "/Crewd.gif"}
        alt="Loading..."
        style={{
          width: isMobile ? "220px" : "420px",
          maxWidth: "90%",
          // ✅ Ensures the image doesn't have a forced background
          backgroundColor: "transparent", 
          // Optional: slight shadow to make the transparent GIF pop
          filter: "drop-shadow(0px 10px 20px rgba(0,0,0,0.05))"
        }}
      />
    </div>
  );
};

export default Preloader;