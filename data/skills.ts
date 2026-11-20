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

export const skills: Skill[] = [
  { name: "Python", category: "Programming", icon: "terminal" },
  { name: "JavaScript", category: "Programming", icon: "braces" },
  { name: "TypeScript", category: "Programming", icon: "fileCode" },
  { name: "SQL", category: "Programming", icon: "database" },

  { name: "HTML", category: "Frontend", icon: "code" },
  { name: "CSS", category: "Frontend", icon: "palette" },
  { name: "React", category: "Frontend", icon: "atom" },
  { name: "Tailwind CSS", category: "Frontend", icon: "wind" },

  { name: "Flutter", category: "Mobile", icon: "smartphone" },

  { name: "Node.js", category: "Backend", icon: "server" },
  { name: "REST APIs", category: "Backend", icon: "workflow" },

  { name: "MySQL", category: "Database", icon: "database" },
  { name: "Firebase", category: "Database", icon: "flame" },

  { name: "Git / GitHub", category: "Tools", icon: "gitBranch" },
  { name: "VS Code", category: "Tools", icon: "monitor" },
  { name: "Figma", category: "Tools", icon: "penTool" },
  { name: "Linux", category: "Tools", icon: "terminal" },
  { name: "Cisco Packet Tracer", category: "Tools", icon: "network" },

  // TODO: add any AI tools you use (e.g. category "AI") — the AI pill appears once one exists.

  { name: "Networking", category: "Other", icon: "network" },
  { name: "Cybersecurity", category: "Other", icon: "shield" },
  { name: "UI/UX", category: "Other", icon: "layers" },
  { name: "Agile", category: "Other", icon: "workflow" },
];
