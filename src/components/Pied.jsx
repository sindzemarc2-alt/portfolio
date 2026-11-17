import { useEffect, useState } from "react";
import { INFOS } from "../donnees";
import { CONTACT } from "../contact";

const navigation = [
  { id: "home", label: "Accueil" },
  { id: "about", label: "À propos" },
  { id: "portfolio", label: "Portfolio" },
  { id: "contact", label: "Contact" },
];

export default function Pied() {
  const [bas, setBas] = useState(false);

  // le bouton « Haut de page » apparaît quand on a défilé
  useEffect(() => {
    const surDefilement = () => setBas(window.scrollY > 700);
    window.addEventListener("scroll", surDefilement);
    return () => window.removeEventListener("scroll", surDefilement);
  }, []);

  return (
    <footer className="relative z-10 border-t border-white/10 bg-[#03050f]/70 backdrop-blur">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-3">
        <div>
          <p className="text-lg font-bold">{INFOS.nom}</p>
          <p className="mt-3 max-w-xs text-sm text-white/50">
            Je conçois des expériences web modernes, avec précision et une touche
            de 3D interactive.
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-400">
            Navigation
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            {navigation.map((n) => (
              <li key={n.id}>
                <a
                  href={`#${n.id}`}
                  className="text-white/60 transition hover:text-white"
                >
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-400">
            Me suivre
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            {CONTACT.reseaux.map((r) => (
              <li key={r.nom}>
                <a
                  href={r.lien}
                  target="_blank"
                  rel="noreferrer"
                  className="text-white/60 transition hover:text-white"
                >
                  {r.nom}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/5 py-5 text-center text-xs text-white/35">
        © {new Date().getFullYear()} {INFOS.nom}. Tous droits réservés.
      </div>

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-6 right-6 z-40 rounded-lg border border-white/15 bg-[#03050f]/80 px-4 py-2 text-xs backdrop-blur transition ${
          bas ? "opacity-100" : "pointer-events-none opacity-0"
        } hover:bg-white/10`}
      >
        Haut de page
      </button>
    </footer>
  );
}