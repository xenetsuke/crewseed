import React from "react";

const Preloader = () => {
  const isMobile = window.innerWidth < 768;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "#ffffff",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <img
        src={isMobile ? "/cbm.gif" : "/cbd.gif"}
        alt="Loading..."
        style={{
          width: isMobile ? "220px" : "420px",
          maxWidth: "90%",
        }}
      />
    </div>
  );
};

export default Preloader;
