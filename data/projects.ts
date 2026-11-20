import type { Project } from "./types";

export const projects: Project[] = [
  {
    slug: "cleandasma",
    title: "CleanDasma",
    category: "Mobile Application",
    summary:
      "A hybrid waste management application for the City of Dasmariñas, Cavite, with GPS truck tracking, route planning, and collection updates for residents.",
    description:
      "A hybrid waste management application for the City of Dasmariñas, Cavite, with GPS truck tracking, route planning, and collection updates for residents.",
    tags: ["Flutter", "Firebase", "Mobile App"],
    githubUrl: "TODO: link to the CleanDasma repository",
    // TODO: add screenshots to /public/projects/cleandasma/ and reference them here.
    thumbnail: undefined,
    gallery: [],
    role: "Group leader",
    overview:
      "Hybrid waste management system built as a capstone project for the City of Dasmariñas, in coordination with CENRO (City Environment and Natural Resources Office).",
    problem: "TODO: describe the problem CleanDasma addresses.",
    solution: "TODO: describe how CleanDasma solves it.",
    features: [
      "GPS garbage truck tracking",
      "Collection route planning",
      "Collection schedule and notifications for residents",
      "Admin side for CENRO",
    ],
    stack: ["TODO: technology stack"],
    process: ["TODO: list the main development steps."],
    result:
      "Evaluated with ISO/IEC 25010 and MARS (Mobile App Rating Scale) by IT experts, a CENRO admin, and resident end-users.",
  },
  {
    slug: "agriconnect",
    title: "AgriConnect",
    category: "TODO: Mobile Application / Web Application",
    summary: "TODO: one-line description of AgriConnect",
    description: "TODO: one-line description of AgriConnect",
    tags: ["TODO: tags"],
    githubUrl: "TODO: link to the AgriConnect repository",
    thumbnail: undefined,
    gallery: [],
    role: "TODO: your role",
    overview: "TODO: overview of AgriConnect.",
    problem: "TODO: the problem AgriConnect addresses.",
    solution: "TODO: how AgriConnect solves it.",
    features: ["TODO: key features of AgriConnect."],
    stack: ["TODO: technology stack"],
    process: ["TODO: development steps for AgriConnect."],
    result: "TODO: outcome of AgriConnect.",
  },
  {
    slug: "flood-awareness",
    title: "Flood Awareness",
    category: "TODO: Mobile Application / Web Application",
    summary: "TODO: one-line description of Flood Awareness",
    description: "TODO: one-line description of Flood Awareness",
    tags: ["TODO: tags"],
    githubUrl: "TODO: link to the Flood Awareness repository",
    thumbnail: undefined,
    gallery: [],
    role: "TODO: your role",
    overview: "TODO: overview of Flood Awareness.",
    problem: "TODO: the problem Flood Awareness addresses.",
    solution: "TODO: how Flood Awareness solves it.",
    features: ["TODO: key features of Flood Awareness."],
    stack: ["TODO: technology stack"],
    process: ["TODO: development steps for Flood Awareness."],
    result: "TODO: outcome of Flood Awareness.",
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
