import { useEffect, useState } from "react";

const liens = [
  { id: "home", label: "Accueil" },
  { id: "about", label: "À propos" },
  { id: "portfolio", label: "Portfolio" },
  { id: "contact", label: "Contact" },
];

export default function Navbar() {
  const [actif, setActif] = useState("home");
  const [son, setSon] = useState(false);

  // détecte la section visible au milieu de l'écran
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entrees) =>
        entrees.forEach((e) => e.isIntersecting && setActif(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    liens.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <nav className="fixed left-1/2 top-3 z-40 w-max max-w-[96vw] -translate-x-1/2 sm:top-5">
      <ul className="flex items-center gap-0.5 rounded-full border border-white/15 bg-white/5 p-1 backdrop-blur-md sm:gap-1 sm:p-1.5">
        {liens.map(({ id, label }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className={`block rounded-full px-2.5 py-1.5 text-xs transition max-[360px]:px-1.5 max-[360px]:text-[11px] sm:px-4 sm:text-sm ${
                actif === id
                  ? "bg-white/15 text-white"
                  : "text-white/60 hover:text-white"
              }`}
            >
              {label}
            </a>
          </li>
        ))}
        <li>
          <button
            onClick={() => setSon(!son)}
            aria-label="Activer ou couper le son"
            className="grid h-8 w-8 place-items-center rounded-full text-white/60 transition hover:text-white max-[360px]:h-7 max-[360px]:w-7"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M11 5 6 9H3v6h3l5 4V5z" />
              {son ? (
                <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" />
              ) : (
                <>
                  <line x1="22" y1="9" x2="16" y2="15" />
                  <line x1="16" y1="9" x2="22" y2="15" />
                </>
              )}
            </svg>
          </button>
        </li>
      </ul>
    </nav>
  );
}