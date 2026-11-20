import type { Project } from "./types";

export const projects: Project[] = [
  {
    slug: "cleandasma",
    title: "CleanDasma",
    category: "Mobile Application",
    summary:
      "A mobile-based civic engagement and waste management application for community collection updates.",
    description:
      "CleanDasma is my capstone project: a mobile-based civic engagement and waste management application that keeps residents updated on community waste collection.",
    tags: ["Flutter", "Firebase", "Mobile App"],
    githubUrl: "TODO: link to the CleanDasma repository",
    // TODO: add screenshots to /public/projects/cleandasma/ and reference them here.
    thumbnail: undefined,
    gallery: [],
    overview:
      "A mobile-based civic engagement and waste management application for community collection updates, built as a capstone project.",
    problem: "TODO: describe the problem CleanDasma addresses for residents and the barangay/LGU.",
    solution: "TODO: describe how the app solves it.",
    features: [
      "Collection schedule and reminder notifications",
      "Resident request service module",
      "Admin-side community waste monitoring concept",
    ],
    stack: ["Flutter", "Firebase"],
    process: ["TODO: list the main development steps (research, design, build, testing…)."],
    result: "TODO: describe the outcome (defense result, users, feedback, status).",
  },
  {
    slug: "cleanapp",
    title: "CleanApp",
    category: "Mobile Application",
    summary: "A Flutter app that runs on Android and as an installable web PWA.",
    description: "TODO: one or two sentences describing what CleanApp does and who it is for.",
    tags: ["Flutter", "Android", "PWA"],
    githubUrl: "TODO: link to the CleanApp repository",
    thumbnail: undefined,
    gallery: [],
    overview: "TODO: overview of CleanApp.",
    problem: "TODO: the problem CleanApp addresses.",
    solution: "TODO: how CleanApp solves it.",
    features: ["TODO: key features of CleanApp."],
    stack: ["Flutter", "Android", "PWA"],
    process: ["TODO: development steps for CleanApp."],
    result: "TODO: outcome of CleanApp.",
  },
  {
    slug: "task-management-app",
    title: "Task Management App",
    category: "Web Application",
    summary:
      "A collaborative productivity tool for organizing team tasks, progress, and assignments.",
    description:
      "A collaborative productivity tool for organizing team tasks, progress, and assignments.",
    tags: ["React", "TypeScript", "Firebase", "Tailwind CSS"],
    githubUrl: "TODO: link to the Task Management App repository",
    thumbnail: undefined,
    gallery: [],
    overview:
      "A web app for team task and project tracking, with task cards, role-based permissions, and a progress dashboard.",
    problem: "TODO: the problem this app addresses.",
    solution: "TODO: how the app solves it.",
    features: [
      "Task cards with status tracking",
      "Team-based role permissions",
      "Simple dashboard for project progress",
    ],
    stack: ["React", "TypeScript", "Firebase", "Tailwind CSS"],
    process: ["TODO: development steps for this project."],
    result: "TODO: outcome of this project.",
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
