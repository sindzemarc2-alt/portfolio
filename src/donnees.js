const projets = [
  {
    id: "projet-1",
    titre: "Projet 1",
    resume: "Courte description de ce que fait ce projet.",
    description:
      "Description complète du projet : le problème résolu, ce que tu as construit, ton rôle et le résultat obtenu.",
    technologies: ["React", "Tailwind CSS", "Supabase"],
    image: null,
    lien: "",
  },
  {
    id: "projet-2",
    titre: "Projet 2",
    resume: "Courte description de ce que fait ce projet.",
    description:
      "Description complète du projet : le problème résolu, ce que tu as construit, ton rôle et le résultat obtenu.",
    technologies: ["Python", "MySQL"],
    image: null,
    lien: "",
  },
  {
    id: "projet-3",
    titre: "Projet 3",
    resume: "Courte description de ce que fait ce projet.",
    description:
      "Description complète du projet : le problème résolu, ce que tu as construit, ton rôle et le résultat obtenu.",
    technologies: ["JavaScript", "HTML", "CSS"],
    image: null,
    lien: "",
  },
];

const certificats = [
  {
    titre: "IoT (Internet of Things) Wireless & Cloud Computing Emerging Technologies",
    organisme: "Yonsei University, via Coursera",
    date: "1 novembre 2026",
    image: "/certificats/iot-yonsei.jpg",
    lien: "https://coursera.org/verify/IN4W07UFCAUL",
  },
  {
    titre: "Generative AI",
    organisme: "MTN Skills Academy, Microsoft Learn",
    date: "30 octobre 2026",
    image: "/certificats/generative-ai.jpg",
    lien: "",
  },
];

export const INFOS = {
  nom: "Sindze Waffo Marc Donald",
  metier: "Développeur Logiciel",
  photo: "/photo.jpg",

  paragraphe1:
    "Étudiant en Génie Logiciel, j'ai passé trois ans à l'Université de Yaoundé 1 (ICT4D). J'y ai appris à concevoir des solutions numériques utiles, solides et adaptées aux besoins réels.",
  paragraphe2:
    "Je maîtrise de nombreux outils du développement et j'aime transformer mes idées en projets concrets : des interfaces modernes, des applications fonctionnelles et des expériences 3D interactives.",

  // les compteurs de projets et de certificats se calculent tout seuls
  stats: [
    { valeur: projets.length, label: "Projets", desc: "Créations réalisées" },
    { valeur: certificats.length, label: "Certificats", desc: "Formations validées" },
    { valeur: 1, label: "Récompenses", desc: "Réussites obtenues" },
  ],

  formation: [
    {
      annee: "3 ans",
      titre: "ICT4D, option Génie Logiciel",
      lieu: "Université de Yaoundé 1",
    },
  ],

  experience: [
    {
      annee: "Année",
      titre: "Ton stage, ton poste ou ton projet",
      lieu: "À compléter",
    },
  ],

  projets,
  certificats,

  realisations: [
    {
      titre: "Ta réalisation",
      desc: "Prix, classement, concours ou réussite dont tu es fier.",
    },
  ],

  // icone : nom de l'icône sur devicon.dev (dossier/fichier)
  outils: [
    { nom: "React", icone: "react/react-original" },
    { nom: "JavaScript", icone: "javascript/javascript-original" },
    { nom: "HTML5", icone: "html5/html5-original" },
    { nom: "CSS3", icone: "css3/css3-original" },
    { nom: "Tailwind", icone: "tailwindcss/tailwindcss-original" },
    { nom: "Node.js", icone: "nodejs/nodejs-original" },
    { nom: "Python", icone: "python/python-original" },
    { nom: "PHP", icone: "php/php-original" },
    { nom: "MySQL", icone: "mysql/mysql-original" },
    { nom: "Git", icone: "git/git-original" },
    { nom: "VS Code", icone: "vscode/vscode-original" },
    { nom: "Java", icone: "java/java-original" },
  ],
};