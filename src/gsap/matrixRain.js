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

  const chars = "01";
  const size = 14;
  let cols = canvas.width / size;
  let drops = Array(Math.floor(cols)).fill(1);

  const draw = () => {
    ctx.fillStyle = "rgba(0,0,0,0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#38b6ff";
    ctx.font = `${size}px monospace`;

    drops.forEach((y, i) => {
      ctx.fillText(
        chars[Math.floor(Math.random() * chars.length)],
        i * size,
        y * size
      );
      if (y * size > canvas.height && Math.random() > 0.98) drops[i] = 0;
      drops[i]++;
    });
  };

  const interval = setInterval(draw, 50);

  return () => {
    clearInterval(interval);
    window.removeEventListener("resize", resize);
  };
}
