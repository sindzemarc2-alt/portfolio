import { useEffect, useRef, useState } from "react";
import { INFOS } from "../donnees";

// détecte quand un élément entre dans l'écran
function useVisible() {
  const ref = useRef(null);
  const [vu, setVu] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVu(true);
          obs.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return [ref, vu];
}

// fait apparaître son contenu en glissant vers le haut
function Apparait({ children, delai = 0, className = "" }) {
  const [ref, vu] = useVisible();
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delai}ms` }}
      className={`transition duration-700 ${
        vu ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}

// nombre qui monte de 0 jusqu'à la valeur
function Compteur({ cible }) {
  const [ref, vu] = useVisible();
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!vu) return;
    const debut = performance.now();
    const duree = 1200;
    let raf;
    const tick = (t) => {
      const p = Math.min(1, (t - debut) / duree);
      setN(Math.round(p * cible));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [vu, cible]);

  return <span ref={ref}>{n}</span>;
}

// une colonne « Formation » ou « Expérience »
function Chronologie({ titre, elements }) {
  return (
    <div>
      <h3 className="mb-6 text-xl font-bold">{titre}</h3>
      <ul className="space-y-6 border-l border-white/10 pl-6">
        {elements.map((e) => (
          <li key={e.titre} className="relative">
            <span className="absolute -left-[31px] top-1.5 h-2.5 w-2.5 rounded-full bg-blue-500 shadow-[0_0_12px_#3b82f6]" />
            <p className="text-xs font-semibold tracking-wider text-blue-400">
              {e.annee}
            </p>
            <p className="mt-1 font-medium">{e.titre}</p>
            <p className="text-sm text-white/50">{e.lieu}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Apropos() {
  return (
    <section id="about" className="mx-auto min-h-screen max-w-6xl px-6 py-28">
      <Apparait>
        <h2 className="text-center text-4xl font-extrabold md:text-5xl">
          À propos
        </h2>
      </Apparait>

      <div className="mt-16 grid items-center gap-14 md:grid-cols-2">
        {/* photo avec « Hi, I'm » */}
        <Apparait>
          <div className="relative mx-auto w-full max-w-sm">
            <div className="absolute -inset-6 rounded-full bg-blue-600/25 blur-3xl" />
            <img
              src={INFOS.photo}
              alt={INFOS.nom}
              className="relative aspect-square w-full rounded-3xl border border-white/10 object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 rounded-b-3xl bg-gradient-to-t from-[#03050f] via-[#03050f]/75 to-transparent p-6 pt-24">
              <p className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-3xl font-bold text-transparent">
                Hi, I'm
              </p>
              <p className="text-3xl font-extrabold leading-tight">
                {INFOS.nom}
              </p>
              <a
                href="#contact"
                className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium transition hover:bg-blue-500"
              >
                Me contacter
              </a>
            </div>
          </div>
        </Apparait>

        {/* texte */}
        <Apparait delai={150}>
          <p className="text-sm leading-relaxed text-white/70 md:text-base">
            {INFOS.paragraphe1}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-white/70 md:text-base">
            {INFOS.paragraphe2}
          </p>
          <a
            href="#portfolio"
            className="mt-6 inline-block rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-blue-400 transition hover:bg-white/10"
          >
            &lt;/&gt; Voir mes projets ↗
          </a>
        </Apparait>
      </div>

      {/* compteurs */}
      <div className="mt-20 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {INFOS.stats.map((s, i) => (
          <Apparait key={s.label} delai={i * 120}>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <p className="text-4xl font-extrabold">
                <Compteur cible={s.valeur} />
              </p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-blue-400">
                {s.label}
              </p>
              <p className="mt-1 text-sm text-white/50">{s.desc}</p>
            </div>
          </Apparait>
        ))}
      </div>

      {/* formation et expérience */}
      <div className="mt-20 grid gap-14 md:grid-cols-2">
        <Apparait>
          <Chronologie titre="Formation" elements={INFOS.formation} />
        </Apparait>
        <Apparait delai={150}>
          <Chronologie titre="Expérience" elements={INFOS.experience} />
        </Apparait>
      </div>
    </section>
  );
}