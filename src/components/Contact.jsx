import { useEffect, useState } from "react";
import { CONTACT } from "../contact";

const champ =
  "w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none transition placeholder:text-white/30 focus:border-blue-500";

const etiquette = "mb-1.5 block text-xs font-medium text-white/60";

/* ---------- formulaire de message ---------- */

function FormulaireMessage() {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [etat, setEtat] = useState("repos"); // repos | envoi | ok | erreur

  const envoyer = async (e) => {
    e.preventDefault();

    // sans service configuré : on ouvre l'application mail du visiteur
    if (!CONTACT.formulaireUrl) {
      const sujet = encodeURIComponent(`Message de ${nom} (portfolio)`);
      const corps = encodeURIComponent(`${message}\n\n${nom}\n${email}`);
      window.location.href = `mailto:${CONTACT.email}?subject=${sujet}&body=${corps}`;
      return;
    }

    setEtat("envoi");
    try {
      const rep = await fetch(CONTACT.formulaireUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ name: nom, email, message }),
      });
      if (!rep.ok) throw new Error("echec");
      setEtat("ok");
      setNom("");
      setEmail("");
      setMessage("");
    } catch {
      setEtat("erreur");
    }
  };

  return (
    <form onSubmit={envoyer} className="space-y-4">
      <div>
        <label className={etiquette}>Nom</label>
        <input
          required
          maxLength={60}
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          placeholder="Ton nom"
          className={champ}
        />
      </div>
      <div>
        <label className={etiquette}>Email</label>
        <input
          required
          type="email"
          maxLength={100}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ton@email.com"
          className={champ}
        />
      </div>
      <div>
        <label className={etiquette}>Message</label>
        <textarea
          required
          rows={5}
          maxLength={1000}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Écris ton message ici..."
          className={`${champ} resize-none`}
        />
      </div>

      <button
        type="submit"
        disabled={etat === "envoi"}
        className="w-full rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium transition hover:bg-blue-500 disabled:opacity-60"
      >
        {etat === "envoi" ? "Envoi en cours..." : "Envoyer le message"}
      </button>

      {etat === "ok" && (
        <p className="text-sm text-emerald-400">
          Merci ! Ton message a bien été envoyé.
        </p>
      )}
      {etat === "erreur" && (
        <p className="text-sm text-red-400">
          Le message n'a pas pu être envoyé. Réessaie, ou écris-moi directement
          par email.
        </p>
      )}
    </form>
  );
}

/* ---------- commentaires ---------- */

const CLE = "portfolio-commentaires";

function formaterDate(iso) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function Commentaires() {
  const [liste, setListe] = useState([]);
  const [nom, setNom] = useState("");
  const [texte, setTexte] = useState("");

  useEffect(() => {
    try {
      setListe(JSON.parse(localStorage.getItem(CLE)) || []);
    } catch {
      setListe([]);
    }
  }, []);

  const ajouter = (e) => {
    e.preventDefault();
    const n = nom.trim();
    const t = texte.trim();
    if (!n || !t) return;

    const nouvelle = [
      { id: Date.now(), nom: n, texte: t, date: new Date().toISOString() },
      ...liste,
    ];
    setListe(nouvelle);
    try {
      localStorage.setItem(CLE, JSON.stringify(nouvelle));
    } catch {
      /* stockage indisponible : le commentaire reste affiché pour la session */
    }
    setTexte("");
  };

  return (
    <div>
      <form onSubmit={ajouter} className="space-y-4">
        <div>
          <label className={etiquette}>Nom</label>
          <input
            required
            maxLength={40}
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            placeholder="Ton nom"
            className={champ}
          />
        </div>
        <div>
          <label className={etiquette}>Commentaire</label>
          <textarea
            required
            rows={3}
            maxLength={300}
            value={texte}
            onChange={(e) => setTexte(e.target.value)}
            placeholder="Écris ton commentaire ici..."
            className={`${champ} resize-none`}
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium transition hover:bg-blue-500"
        >
          Publier le commentaire
        </button>
      </form>

      <ul className="mt-6 max-h-72 space-y-4 overflow-y-auto pr-1">
        {liste.length === 0 && (
          <li className="text-sm text-white/40">
            Aucun commentaire pour le moment. Sois le premier à écrire.
          </li>
        )}
        {liste.map((c) => (
          <li key={c.id} className="flex gap-3">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-blue-600/25 text-sm font-semibold text-blue-300">
              {c.nom.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-3">
                <p className="truncate text-sm font-semibold">{c.nom}</p>
                <p className="shrink-0 text-xs text-white/35">
                  {formaterDate(c.date)}
                </p>
              </div>
              <p className="mt-1 break-words text-sm text-white/65">{c.texte}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- la section ---------- */

export default function Contact() {
  return (
    <section id="contact" className="mx-auto min-h-screen max-w-6xl px-6 py-28">
      <h2 className="text-center text-4xl font-extrabold md:text-5xl">
        Contact
      </h2>
      <p className="mx-auto mt-4 max-w-xl text-center text-sm text-white/50">
        Une idée, un projet ou une question ? Écris-moi, je te réponds avec plaisir.
      </p>

      <div className="mt-14 grid gap-8 md:grid-cols-2">
        {/* colonne message + réseaux */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur md:p-8">
          <h3 className="text-xl font-bold">Envoyer un message</h3>
          <div className="mt-6">
            <FormulaireMessage />
          </div>

          <div className="mt-10 border-t border-white/10 pt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-400">
              Me retrouver
            </p>
            <ul className="mt-4 space-y-2">
              {CONTACT.reseaux.map((r) => (
                <li key={r.nom}>
                  <a
                    href={r.lien}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm transition hover:border-blue-500/50 hover:bg-white/10"
                  >
                    <span className="font-medium">{r.nom}</span>
                    <span className="text-white/45 transition group-hover:text-white/80">
                      {r.pseudo}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* colonne commentaires */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur md:p-8">
          <h3 className="text-xl font-bold">Laisser un commentaire</h3>
          <div className="mt-6">
            <Commentaires />
          </div>
        </div>
      </div>
    </section>
  );
}