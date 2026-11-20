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
    githubUrl: "https://github.com/Russsz/CleanDasma",
    liveUrl: "https://cleandasma.org",
    // TODO: add more screens to /public/projects/cleandasma/ and list them in `gallery`.
    thumbnail: "/projects/cleandasma/home.webp",
    phoneScreenshots: true,
    gallery: [{ src: "/projects/cleandasma/home.webp", alt: "CleanDasma home screen with the community welcome banner and next collection" }],
    role: "Group leader",
    overview:
      "Hybrid waste management system built as a capstone project for the City of Dasmariñas, in coordination with CENRO (City Environment and Natural Resources Office).",
    problem:
      "Residents of Dasmariñas often miss garbage collection because schedules, delays, and service disruptions aren't communicated clearly or on time. Announcements are scattered across barangay posts and word of mouth, so residents and CENRO (City Environment and Natural Resources Office) have no direct, reliable channel. The result is missed pickups, uncollected waste, poor segregation habits, and weak compliance with RA 9003 (Ecological Solid Waste Management Act).",
    solution:
      "CleanDasma is a hybrid mobile and web waste management system that connects CENRO with residents. Residents get real-time collection schedules, truck tracking, alerts, and segregation tips on their phones. CENRO manages schedules, trucks, routes, drivers, and reports from a web admin dashboard. Every announcement reaches residents instantly through push notifications, and they can report issues back.",
    features: [
      "GPS garbage truck tracking using the driver's phone",
      "Collection route planning and route monitoring",
      "Barangay-based collection schedules with real-time alerts and push notifications",
      "Role-based access for residents, drivers/pahinante, and CENRO admins",
      "Problem reports and service requests from residents",
      "Eco-tips and waste segregation education",
      "Digital barangay bulletin board and community hub",
      "Data analytics, monthly reports, and audit logs",
      "English and Tagalog language support",
    ],
    stack: ["Flutter", "Dart", "Supabase", "PostgreSQL", "Supabase Auth", "Firebase Cloud Messaging", "PWA"],
    process: [
      "Requirements gathering through interviews and surveys with CENRO and residents of Dasmariñas",
      "System design: user roles, database schema, and UI/UX wireframes for mobile and admin web",
      "Agile, iterative development of the Flutter mobile app and the web admin dashboard",
      "Backend integration with Supabase for authentication, database, and APIs, plus FCM for push notifications",
      "GPS tracking and route planning for collection trucks",
      "Testing, debugging, and refinement based on user feedback",
      "Evaluation with ISO/IEC 25010 software quality and MARS (Mobile App Rating Scale) by IT experts, a CENRO admin, and resident end-users",
      "Deployment as a web app at cleandasma.org",
    ],
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
