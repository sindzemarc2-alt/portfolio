import { useState } from "react";
import Etoiles from "./components/Etoiles";
import Chargement from "./components/Chargement";
import Navbar from "./components/Navbar";
import Accueil from "./components/Accueil";
import Apropos from "./components/Apropos";
import Musique from "./components/Musique";
import Portfolio from "./components/Portfolio";
import Contact from "./components/Contact";
import Pied from "./components/Pied";

export default function App() {
  const [charge, setCharge] = useState(false);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* lueurs bleues */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse at 15% 20%, rgba(37,99,235,0.25), transparent 50%), radial-gradient(ellipse at 85% 80%, rgba(30,64,175,0.2), transparent 50%)",
        }}
      />
      <Etoiles />
      <Navbar />

      <main className="relative z-10">
        {charge && <Accueil />}
        <Apropos />
        <Musique />
        <Portfolio />
        <Contact />
      </main>

      <Pied />

      {!charge && <Chargement onFini={() => setCharge(true)} />}
    </div>
  );
}