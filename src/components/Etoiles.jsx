import { useEffect, useRef } from "react";

export default function Etoiles() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    let w = 0;
    let h = 0;
    let raf;
    let etoiles = [];
    let filante = null;

    const init = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      const n = Math.floor((w * h) / 9000);
      etoiles = Array.from({ length: n }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.3 + 0.3,
        a: Math.random() * Math.PI * 2,
        v: Math.random() * 0.02 + 0.005,
        dy: Math.random() * 0.08 + 0.02,
      }));
    };

    // sur téléphone, la barre d'adresse qui se cache change un peu la hauteur :
    // on ignore ces petits changements pour ne pas régénérer le ciel
    const surRedim = () => {
      if (window.innerWidth === w && Math.abs(window.innerHeight - h) < 160) {
        return;
      }
      init();
    };

    const dessiner = () => {
      ctx.clearRect(0, 0, w, h);

      for (const e of etoiles) {
        e.a += e.v;
        e.y -= e.dy;
        if (e.y < 0) e.y = h;
        const opacite = 0.3 + 0.7 * Math.abs(Math.sin(e.a));
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${opacite})`;
        ctx.fill();
      }

      // étoile filante de temps en temps
      if (!filante && Math.random() < 0.004) {
        filante = {
          x: Math.random() * w * 0.8,
          y: Math.random() * h * 0.4,
          vx: 7,
          vy: 4,
          vie: 1,
        };
      }
      if (filante) {
        const bx = filante.x - filante.vx * 8;
        const by = filante.y - filante.vy * 8;
        const g = ctx.createLinearGradient(filante.x, filante.y, bx, by);
        g.addColorStop(0, `rgba(255,255,255,${filante.vie})`);
        g.addColorStop(1, "rgba(255,255,255,0)");
        ctx.strokeStyle = g;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(filante.x, filante.y);
        ctx.lineTo(bx, by);
        ctx.stroke();
        filante.x += filante.vx;
        filante.y += filante.vy;
        filante.vie -= 0.012;
        if (filante.vie <= 0) filante = null;
      }

      raf = requestAnimationFrame(dessiner);
    };

    init();
    dessiner();
    window.addEventListener("resize", surRedim);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", surRedim);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
    />
  );
}