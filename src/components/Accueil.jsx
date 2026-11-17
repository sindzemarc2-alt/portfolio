import { useEffect, useState } from "react";
import Badge from "./Badge";
import { CONTACT } from "../contact";

const PHRASES = [
  "React & Three.js Enthusiast",
  "Web Developer",
  "Creative Coder",
];

// effet machine à écrire : écrit, attend, efface, passe à la phrase suivante
function useMachine(phrases, vitesse = 80, pause = 1500) {
  const [texte, setTexte] = useState("");
  const [i, setI] = useState(0);
  const [efface, setEfface] = useState(false);

  useEffect(() => {
    const phrase = phrases[i];
    let t;

    if (!efface && texte === phrase) {
      t = setTimeout(() => setEfface(true), pause);
    } else if (efface && texte === "") {
      setEfface(false);
      setI((i + 1) % phrases.length);
    } else {
      t = setTimeout(
        () =>
          setTexte(
            efface
              ? phrase.slice(0, texte.length - 1)
              : phrase.slice(0, texte.length + 1)
          ),
        efface ? vitesse / 2 : vitesse
      );
    }
    return () => clearTimeout(t);
  }, [texte, efface, i, phrases, vitesse, pause]);

  return texte;
}

export default function Accueil() {
  const texte = useMachine(PHRASES);

  return (
    <section id="home" className="relative">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 pb-4 pt-28 md:min-h-dvh md:grid-cols-2 md:pt-24">
        {/* colonne gauche : le texte */}
        <div>
          <h1 className="apparait text-4xl font-extrabold leading-tight sm:text-5xl md:text-6xl">
            <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              Welcome to
            </span>
            <br />
            My Portfolio
          </h1>

          <p
            className="apparait mt-4 h-7 text-lg text-blue-400"
            style={{ animationDelay: "0.2s" }}
          >
            {texte}
            <span className="ml-0.5 inline-block w-0.5 animate-pulse bg-blue-400">
              &nbsp;
            </span>
          </p>

          <p
            className="apparait mt-6 max-w-md text-sm leading-relaxed text-white/50"
            style={{ animationDelay: "0.4s" }}
          >
            Curieux de nature, aujourd'hui passionné. J'aime expérimenter avec
            le code, explorer de nouvelles technologies et transformer mes idées
            en quelque chose de concret. Du web moderne aux interactions 3D, je
            cherche toujours à créer des projets qui ont du style.
          </p>

          <div
            className="apparait mt-8 flex flex-wrap gap-3"
            style={{ animationDelay: "0.6s" }}
          >
            <a
              href="#portfolio"
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium transition hover:bg-blue-500"
            >
              Voir mes projets
            </a>
            <a
              href="#contact"
              className="rounded-lg border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-medium transition hover:bg-white/10"
            >
              Me contacter
            </a>
          </div>

          <div
            className="apparait mt-10 flex flex-wrap items-center gap-x-5 gap-y-2"
            style={{ animationDelay: "0.8s" }}
          >
            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-blue-400">
              Me retrouver
            </span>
            {CONTACT.reseaux.map((r) => (
              <a
                key={r.nom}
                href={r.lien}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-white/50 transition hover:text-white"
              >
                {r.nom}
              </a>
            ))}
          </div>
        </div>

        {/* colonne droite : vide sur ordinateur, le badge flotte par-dessus */}
        <div className="hidden md:block" />
      </div>

      {/* badge 3D : sous le texte sur téléphone, à droite sur grand écran */}
      <div className="relative h-[75dvh] w-full md:absolute md:inset-y-0 md:right-0 md:h-auto md:w-1/2">
        <Badge />
      </div>
    </section>
  );
}