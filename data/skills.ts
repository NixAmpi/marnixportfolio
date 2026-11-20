import type { Skill, SkillCategory } from "./types";

/** Filter pills, in display order. Categories with no skills are hidden automatically. */
export const skillCategories: SkillCategory[] = [
  "Programming",
  "Frontend",
  "Mobile",
  "Backend",
  "Database",
  "Tools",
  "AI",
  "Other",
];

/*
 * Each skill is a keycap on the 3D keyboard.
 * - key:   the real keyboard letter that presses it (must be unique).
 * - color: keycap colour (brand colour where there is one).
 * - logo:  white SVG in /public/skills/ — swap the file to change a logo.
 *          Regenerate all of them with `node scripts/generate-skill-logos.mjs`.
 * - description: one line on how I use it ("TODO…" hides the line in the info card).
 */
export const skills: Skill[] = [
  {
    name: "Python",
    category: "Programming",
    key: "P",
    color: "#3776AB",
    logo: "/skills/python.svg",
    description: "Programs and automation scripts — certified through Cisco's Python Essentials 1 & 2.",
  },
  {
    name: "JavaScript",
    category: "Programming",
    key: "J",
    color: "#F7DF1E",
    logo: "/skills/javascript.svg",
    description: "Interactivity for AgriConnect and Flood Awareness Philippines, written without a framework.",
  },
  {
    name: "TypeScript",
    category: "Programming",
    key: "T",
    color: "#3178C6",
    logo: "/skills/typescript.svg",
    description: "Typed components and data for this portfolio.",
  },
  {
    name: "SQL",
    category: "Programming",
    key: "Q",
    color: "#0E7490",
    logo: "/skills/sql.svg",
    description: "Database design and queries — the PostgreSQL schema behind AgriConnect, and a Pearson IT Specialist – Databases certification.",
  },

  {
    name: "HTML",
    category: "Frontend",
    key: "H",
    color: "#E34F26",
    logo: "/skills/html.svg",
    description: "Semantic, responsive pages for AgriConnect and Flood Awareness Philippines.",
  },
  {
    name: "CSS",
    category: "Frontend",
    key: "C",
    color: "#663399",
    logo: "/skills/css.svg",
    description: "Responsive, mobile-first layouts for AgriConnect and Flood Awareness Philippines.",
  },
  {
    name: "React",
    category: "Frontend",
    key: "R",
    color: "#61DAFB",
    logo: "/skills/react.svg",
    description: "This portfolio is built with React and Next.js.",
  },
  {
    name: "Tailwind CSS",
    category: "Frontend",
    key: "W",
    color: "#06B6D4",
    logo: "/skills/tailwind.svg",
    description: "All the styling in this portfolio.",
  },

  {
    name: "Flutter",
    category: "Mobile",
    key: "F",
    color: "#02569B",
    logo: "/skills/flutter.svg",
    description: "Built the CleanDasma mobile app and its web PWA for the City of Dasmariñas.",
  },

  {
    name: "Node.js",
    category: "Backend",
    key: "N",
    color: "#5FA04E",
    logo: "/skills/nodejs.svg",
    description: "TODO: one line on how you use Node.js.",
  },
  {
    name: "REST APIs",
    category: "Backend",
    key: "E",
    color: "#6D28D9",
    logo: "/skills/rest-apis.svg",
    description: "Supabase APIs for authentication and data in CleanDasma and AgriConnect.",
  },

  {
    name: "MySQL",
    category: "Database",
    key: "M",
    color: "#4479A1",
    logo: "/skills/mysql.svg",
    description: "Structured, reliable data systems for database-backed projects.",
  },
  {
    name: "Firebase",
    category: "Database",
    key: "B",
    color: "#FFA000",
    logo: "/skills/firebase.svg",
    description: "Push notifications for CleanDasma residents via Firebase Cloud Messaging.",
  },

  {
    name: "Git / GitHub",
    category: "Tools",
    key: "G",
    color: "#F05032",
    logo: "/skills/git.svg",
    description: "Version control for all my projects, hosted on GitHub.",
  },
  {
    name: "VS Code",
    category: "Tools",
    key: "V",
    color: "#007ACC",
    logo: "/skills/vscode.svg",
    description: "TODO: one line on how you use VS Code.",
  },
  {
    name: "Figma",
    category: "Tools",
    key: "I",
    color: "#A259FF",
    logo: "/skills/figma.svg",
    description: "Wireframes, prototypes, and interface layouts — including CleanDasma's mobile and admin screens.",
  },
  {
    name: "Linux",
    category: "Tools",
    key: "L",
    color: "#FCC624",
    logo: "/skills/linux.svg",
    description: "TODO: one line on how you use Linux.",
  },
  {
    name: "Cisco Packet Tracer",
    category: "Tools",
    key: "K",
    color: "#1BA0D7",
    logo: "/skills/cisco.svg",
    description: "Hands-on network simulation through Cisco Networking Academy.",
  },

  // TODO: add any AI tools you use (category "AI") — the AI pill appears once one exists.

  {
    name: "Networking",
    category: "Other",
    key: "O",
    color: "#2563EB",
    logo: "/skills/networking.svg",
    description: "CCNA: Introduction to Networks — IP addressing, routing, and troubleshooting.",
  },
  {
    name: "Cybersecurity",
    category: "Other",
    key: "Y",
    color: "#059669",
    logo: "/skills/cybersecurity.svg",
    description: "Security fundamentals in practice — Row Level Security on every AgriConnect table.",
  },
  {
    name: "UI/UX",
    category: "Other",
    key: "U",
    color: "#DB2777",
    logo: "/skills/ui-ux.svg",
    description: "High-contrast, mobile-first interfaces with large tap targets, as in Flood Awareness Philippines.",
  },
  {
    name: "Agile",
    category: "Other",
    key: "A",
    color: "#7C3AED",
    logo: "/skills/agile.svg",
    description: "Iterative development of CleanDasma's mobile app and admin dashboard as group leader.",
  },
];
