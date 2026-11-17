import { MUSIQUE } from "../musique";

// transforme un lien Spotify normal en lien de lecteur intégré
function versEmbed(lien) {
  const m = lien.match(
    /open\.spotify\.com\/(?:intl-[a-z]+\/)?(playlist|album|track|artist|episode|show)\/([A-Za-z0-9]+)/
  );
  if (!m) return null;
  return `https://open.spotify.com/embed/${m[1]}/${m[2]}?utm_source=generator&theme=0`;
}

export default function Musique() {
  const embed = MUSIQUE.lien ? versEmbed(MUSIQUE.lien) : null;

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="grid items-center gap-10 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur md:grid-cols-2 md:p-12">
        {/* texte */}
        <div>
          <h3 className="text-4xl font-extrabold leading-tight md:text-5xl">
            <span className="text-white/70">A little music.</span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              A lot of ideas.
            </span>
          </h3>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/55">
            {MUSIQUE.texte}
          </p>
          {MUSIQUE.lien && (
            <a
              href={MUSIQUE.lien}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-block rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium transition hover:bg-white/10"
            >
              Ouvrir dans Spotify
            </a>
          )}
        </div>

        {/* lecteur */}
        <div>
          {embed ? (
            <iframe
              title="Ma playlist Spotify"
              src={embed}
              width="100%"
              height="352"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              style={{ borderRadius: 12 }}
            />
          ) : (
            <div className="grid h-[352px] place-items-center rounded-xl border border-dashed border-white/15 px-6 text-center text-sm text-white/40">
              Ajoute le lien de ta playlist Spotify dans src/musique.js pour
              afficher le lecteur ici.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}