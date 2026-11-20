import type { Education, FocusArea, Highlight, Stat } from "./types";

export const profile = {
  name: "Marnix Allain Ampeloquio",
  shortName: "Marnix",
  /** The hero heading breaks the name across these two lines. */
  nameLines: ["Marnix Allain", "Ampeloquio"] as const,
  role: "Software Developer",
  status: "Open for Internship / Entry-Level Roles",
  tagline:
    "I build clean, reliable, and user-friendly digital solutions using Python, databases, web technologies, and modern development practices.",
  location: "Cavite, Philippines",
  email: "marnix.ampeloquio.work@gmail.com",
  phone: "09932824527",
  github: { username: "NixAmpi", url: "https://github.com/NixAmpi" },
  linkedin: {
    label: "Marnix Allain Ampeloquio",
    url: "https://www.linkedin.com/in/marnix-allain-ampeloquio-ba5732267/",
    certificationsUrl:
      "https://www.linkedin.com/in/marnix-allain-ampeloquio-ba5732267/details/certifications/",
  },
  // TODO: drop your CV at /public/cv/Marnix_Ampeloquio_CV.pdf (the old site linked a missing download/resume.jpg).
  cvUrl: "/cv/Marnix_Ampeloquio_CV.pdf",
  about: [
    "I build practical technology solutions — turning simple ideas into working systems. My work sits where software, databases, and networks meet, and I enjoy the problem-solving that comes with making them run smoothly, securely, and reliably.",
    "I've built projects across programming, database management, and system development, working hands-on with Python, MySQL, Firebase, HTML, CSS, and networking fundamentals. Each one has sharpened how I troubleshoot, design, and collaborate within a team.",
    "I'm open to roles where I can contribute to real products, take ownership of technical problems, and keep growing alongside a team that values reliable, well-crafted solutions.",
  ],
  careerDirection:
    "I am continuously improving in software development, database management, networking, and cybersecurity. My goal is to become a reliable IT professional who can build practical systems for real users.",
  traits: ["Internship Ready", "Fast Learner", "Team Player", "Problem Solver", "Detail-Oriented"],
  focusTags: [
    "Clean UI",
    "Database-backed systems",
    "Python fundamentals",
    "Networking & security basics",
    "Team-based development",
  ],
};

export const stats: Stat[] = [
  { value: "3", label: "Projects built across web, mobile, and database systems" },
  // Pearson IT Specialist – Databases, CCNA ITN, Python Essentials 1, Python Essentials 2, Packet Tracer.
  { value: "5", label: "Certifications in databases, networking, and programming" },
  { value: "5", label: "Core focus areas, from web to systems development" },
];

export const education: Education[] = [
  {
    school: "Lyceum of the Philippines University – Cavite",
    program: "Bachelor of Science in Information Technology",
    years: "2023 – 2027",
    note: "Focus on software engineering, data structures, networking, and system development.",
  },
];

export const focusAreas: FocusArea[] = [
  {
    title: "Web Development",
    description: "Responsive, user-friendly websites and interfaces with HTML, CSS, JavaScript, and React.",
    icon: "globe",
  },
  {
    title: "Software Development",
    description: "Clean, functional programs and automation scripts, primarily in Python.",
    icon: "terminal",
  },
  {
    title: "Database Development",
    description: "Structured, reliable data systems using MySQL and Firebase.",
    icon: "database",
  },
  {
    title: "UI/UX Design",
    description: "Wireframes, prototypes, and clean interface layouts using Figma.",
    icon: "layers",
  },
  {
    title: "System Development",
    description: "Modules, user flows, and system architecture, backed by networking and security fundamentals.",
    icon: "server",
  },
];

export const highlights: Highlight[] = [
  {
    title: "Database Certification",
    description: "Certified foundation in database concepts, data organization, and management principles.",
    icon: "award",
  },
  {
    title: "Cisco Networking Background",
    description: "Completed networking lessons involving IP addressing, routing, and Packet Tracer simulations.",
    icon: "network",
  },
  {
    title: "Web & App Project Experience",
    description: "Worked on project concepts involving dashboards, mobile features, and database-backed systems.",
    icon: "code",
  },
];

export const navLinks = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "certificates", label: "Certificates" },
  { id: "contact", label: "Contact" },
] as const;

export type SectionId = (typeof navLinks)[number]["id"];
