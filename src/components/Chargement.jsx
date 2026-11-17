import { useEffect, useRef, useState } from "react";

export default function Chargement({ onFini }) {
  const [pct, setPct] = useState(0);
  const [sortie, setSortie] = useState(false);
  const cb = useRef(onFini);
  cb.current = onFini;

  useEffect(() => {
    const debut = performance.now();
    const duree = 2800;
    let raf;

    const tick = (t) => {
      const p = Math.min(100, Math.round(((t - debut) / duree) * 100));
      setPct(p);
      if (p < 100) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(() => setSortie(true), 300);
        setTimeout(() => cb.current(), 1100);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#03050f] transition-opacity duration-700 ${
        sortie ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex items-start">
        <span className="text-8xl font-bold tabular-nums">{pct}</span>
        <span className="mt-3 text-3xl font-semibold text-blue-500">%</span>
      </div>

      <div className="mt-6 h-0.5 w-72 bg-white/10">
        <div className="h-full bg-blue-500" style={{ width: `${pct}%` }} />
      </div>

      <p className="mt-6 text-xs text-white/70">Chargement des assets...</p>
    </div>
  );
}