import { useEffect, useState } from "react";
import { INFOS } from "../donnees";

const ONGLETS = [
  { id: "projets", label: "Projets" },
  { id: "certificats", label: "Certificats" },
  { id: "realisations", label: "Réalisations" },
  { id: "outils", label: "Tech Stack" },
];

// image du projet, ou visuel de remplacement avec la première lettre
function Visuel({ image, titre, className = "" }) {
  if (image) {
    return (
      <img
        src={image}
        alt={titre}
        className={`w-full object-cover ${className}`}
      />
    );
  }
  return (
    <div
      className={`grid w-full place-items-center bg-gradient-to-br from-blue-900/60 via-[#0b1330] to-[#03050f] text-5xl font-extrabold text-blue-400/60 ${className}`}
    >
      {titre.charAt(0)}
    </div>
  );
}

function CarteProjet({ p, onOuvrir }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur transition hover:-translate-y-1 hover:border-blue-500/50">
      <Visuel image={p.image} titre={p.titre} className="h-40" />
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold">{p.titre}</h3>
        <p className="mt-2 flex-1 text-sm text-white/55">{p.resume}</p>
        <button
          onClick={() => onOuvrir(p)}
          className="mt-5 self-start rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium transition hover:bg-white/10"
        >
          Voir les détails
        </button>
      </div>
    </article>
  );
}

function CarteCertificat({ c, onAgrandir }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur transition hover:-translate-y-1 hover:border-blue-500/50">
      <button
        onClick={() => c.image && onAgrandir(c)}
        className="group relative block overflow-hidden bg-white"
        aria-label={`Agrandir le certificat ${c.titre}`}
      >
        <Visuel
          image={c.image}
          titre={c.titre}
          className="aspect-[4/3] transition duration-500 group-hover:scale-105"
        />
        {c.image && (
          <span className="absolute inset-0 grid place-items-center bg-black/55 text-sm font-medium opacity-0 transition group-hover:opacity-100">
            Agrandir
          </span>
        )}
      </button>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-bold leading-snug">{c.titre}</h3>
        <p className="mt-2 text-sm text-white/55">{c.organisme}</p>
        {c.date && <p className="mt-1 text-xs text-white/40">{c.date}</p>}
        {c.lien && (
          <a
            href={c.lien}
            target="_blank"
            rel="noreferrer"
            className="mt-4 self-start text-sm font-medium text-blue-400 transition hover:text-blue-300"
          >
            Vérifier le certificat
          </a>
        )}
      </div>
    </article>
  );
}

function CarteRealisation({ r, numero }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:-translate-y-1 hover:border-blue-500/50">
      <p className="text-sm font-semibold tracking-widest text-blue-400">
        {String(numero).padStart(2, "0")}
      </p>
      <h3 className="mt-4 text-lg font-bold">{r.titre}</h3>
      <p className="mt-2 text-sm text-white/55">{r.desc}</p>
    </article>
  );
}

function TuileOutil({ o }) {
  const [ok, setOk] = useState(true);
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:-translate-y-1 hover:border-blue-500/50">
      {ok && (
        <img
          src={`https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${o.icone}.svg`}
          alt={o.nom}
          className="h-10 w-10"
          onError={() => setOk(false)}
        />
      )}
      <span className="text-center text-xs text-white/70">{o.nom}</span>
    </div>
  );
}

// ferme avec la touche Échap et bloque le défilement de la page derrière
function useFenetre(onFermer) {
  useEffect(() => {
    const touche = (e) => e.key === "Escape" && onFermer();
    window.addEventListener("keydown", touche);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", touche);
      document.body.style.overflow = "";
    };
  }, [onFermer]);
}

// fenêtre de détails d'un projet
function Detail({ projet, onFermer }) {
  useFenetre(onFermer);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#03050f]/95 backdrop-blur-md">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <button
          onClick={onFermer}
          className="rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm transition hover:bg-white/10"
        >
          Retour
        </button>

        <div className="apparait mt-10 grid items-start gap-10 md:grid-cols-2">
          <div>
            <h3 className="text-4xl font-extrabold md:text-5xl">
              {projet.titre}
            </h3>
            <p className="mt-6 text-sm leading-relaxed text-white/65">
              {projet.description}
            </p>

            <p className="mt-8 text-xs font-semibold uppercase tracking-widest text-blue-400">
              Technologies utilisées
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {projet.technologies.map((t) => (
                <span
                  key={t}
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs"
                >
                  {t}
                </span>
              ))}
            </div>

            {projet.lien && (
              <a
                href={projet.lien}
                target="_blank"
                rel="noreferrer"
                className="mt-8 inline-block rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium transition hover:bg-blue-500"
              >
                Voir le projet
              </a>
            )}
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/10">
            <Visuel image={projet.image} titre={projet.titre} className="h-72" />
          </div>
        </div>
      </div>
    </div>
  );
}

// certificat en grand
function Agrandi({ certificat, onFermer }) {
  useFenetre(onFermer);

  return (
    <div
      onClick={onFermer}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
    >
      <img
        src={certificat.image}
        alt={certificat.titre}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] max-w-full rounded-lg shadow-2xl"
      />
      <button
        onClick={onFermer}
        className="absolute right-5 top-5 rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm transition hover:bg-white/20"
      >
        Fermer
      </button>
    </div>
  );
}

export default function Portfolio() {
  const [onglet, setOnglet] = useState("projets");
  const [ouvert, setOuvert] = useState(null);
  const [agrandi, setAgrandi] = useState(null);

  return (
    <section id="portfolio" className="mx-auto min-h-screen max-w-6xl px-6 py-28">
      <h2 className="text-center text-4xl font-extrabold md:text-5xl">
        Portfolio
      </h2>
      <p className="mx-auto mt-4 max-w-xl text-center text-sm text-white/50">
        Mes projets, mes certificats, mes réalisations et les outils que j'utilise.
      </p>

      {/* onglets */}
      <div className="mt-10 flex justify-center">
        <div className="flex flex-wrap justify-center gap-1 rounded-2xl border border-white/10 bg-white/5 p-1.5 backdrop-blur">
          {ONGLETS.map((o) => (
            <button
              key={o.id}
              onClick={() => setOnglet(o.id)}
              className={`rounded-xl px-5 py-2 text-sm transition ${
                onglet === o.id
                  ? "bg-blue-600 text-white"
                  : "text-white/60 hover:text-white"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      {/* contenu de l'onglet (key = l'animation rejoue à chaque changement) */}
      <div key={onglet} className="apparait mt-12">
        {onglet === "projets" && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {INFOS.projets.map((p) => (
              <CarteProjet key={p.id} p={p} onOuvrir={setOuvert} />
            ))}
          </div>
        )}

        {onglet === "certificats" && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {INFOS.certificats.map((c, i) => (
              <CarteCertificat key={i} c={c} onAgrandir={setAgrandi} />
            ))}
          </div>
        )}

        {onglet === "realisations" && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {INFOS.realisations.map((r, i) => (
              <CarteRealisation key={i} r={r} numero={i + 1} />
            ))}
          </div>
        )}

        {onglet === "outils" && (
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6">
            {INFOS.outils.map((o) => (
              <TuileOutil key={o.nom} o={o} />
            ))}
          </div>
        )}
      </div>

      {ouvert && <Detail projet={ouvert} onFermer={() => setOuvert(null)} />}
      {agrandi && (
        <Agrandi certificat={agrandi} onFermer={() => setAgrandi(null)} />
      )}
    </section>
  );
}