// gsap/matrixRain.js
export function initMatrixRain(canvas) {
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  resize();
  window.addEventListener("resize", resize);

  // ✅ BRAND TEXT (THIS IS THE KEY LINE)
  const chars = "CREWSEED";
  const size = 14;

  let cols = Math.floor(canvas.width / size);
  let drops = Array(cols).fill(1);

  const draw = () => {
    ctx.fillStyle = "rgba(2, 6, 23, 0.08)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#38b6ff";
    ctx.font = `${size}px monospace`;

    for (let i = 0; i < drops.length; i++) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(char, i * size, drops[i] * size);

      if (drops[i] * size > canvas.height && Math.random() > 0.98) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  };

  const interval = setInterval(draw, 50);

  return () => {
    clearInterval(interval);
    window.removeEventListener("resize", resize);
  };
}
