const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const canvas = document.getElementById('starsCanvas') as HTMLCanvasElement | null;
if (canvas && !prefersReducedMotion) {
  const ctx = canvas.getContext('2d')!;
  const stars: { x: number; y: number; r: number; alpha: number; speed: number; dir: number }[] = [];
  const COUNT = 130;

  function resize() { canvas!.width = window.innerWidth; canvas!.height = window.innerHeight; }

  function mkStar() {
    return {
      x: Math.random() * canvas!.width, y: Math.random() * canvas!.height,
      r: Math.random() * 1.3 + 0.4, alpha: Math.random(),
      speed: 0.003 + Math.random() * 0.007, dir: Math.random() > 0.5 ? 1 : -1
    };
  }

  function draw() {
    ctx.clearRect(0, 0, canvas!.width, canvas!.height);
    for (const s of stars) {
      s.alpha += s.speed * s.dir;
      if (s.alpha >= 1 || s.alpha <= 0) s.dir *= -1;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${s.alpha.toFixed(2)})`;
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize);
  for (let i = 0; i < COUNT; i++) stars.push(mkStar());
  draw();
}

// Keyboard navigation for level cards
const cards = Array.from(document.querySelectorAll<HTMLElement>('.level-card'));
cards.forEach((card, i) => {
  card.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' && cards[i + 1]) { e.preventDefault(); cards[i + 1].focus(); }
    if (e.key === 'ArrowLeft' && cards[i - 1]) { e.preventDefault(); cards[i - 1].focus(); }
  });
});
