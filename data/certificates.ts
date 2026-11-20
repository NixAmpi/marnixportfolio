import type { Certificate } from "./types";

// TODO: add certificate images to /public/certificates/ and set `image` on each entry.
export const certificates: Certificate[] = [
  {
    slug: "it-specialist-databases",
    title: "IT Specialist – Databases",
    issuer: "Pearson",
    year: "2025",
    description: "Professional certification focused on database concepts and management.",
    credentialUrl: "TODO: credential link",
  },
  {
    slug: "ccna-itn",
    title: "CCNA: Introduction to Networks",
    issuer: "Cisco Networking Academy",
    year: "2025",
    description:
      "Networking fundamentals, IP addressing, routing, and network troubleshooting concepts.",
    credentialUrl: "TODO: Credly link",
  },
  {
    slug: "python-essentials",
    title: "Python Essentials 1 & 2",
    issuer: "Cisco Networking Academy",
    year: "2024 – 2025",
    description: "Programming fundamentals in Python.",
    credentialUrl: "TODO: Credly link",
  },
  {
    slug: "packet-tracer",
    title: "Cisco Packet Tracer",
    issuer: "Cisco Networking Academy",
    year: "2024 – 2025",
    description: "Hands-on network simulation practice.",
    credentialUrl: "TODO: Credly link",
  },
  {
    slug: "english-for-it-1",
    title: "English for IT 1",
    issuer: "Cisco Networking Academy",
    year: "TODO: year",
    description: "TODO: short description of English for IT 1.",
    credentialUrl: "TODO: Credly link",
  },
  {
    slug: "english-for-it-2",
    title: "English for IT 2",
    issuer: "Cisco Networking Academy",
    year: "TODO: year",
    description: "TODO: short description of English for IT 2.",
    credentialUrl: "TODO: Credly link",
  },
];
