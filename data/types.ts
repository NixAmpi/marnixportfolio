import type { IconName } from "@/components/icons";

/**
 * Any string that starts with "TODO" is rendered as a dashed placeholder box
 * so missing content is obvious while developing. Replace it with real text.
 */
export type Content = string;

export const isTodo = (value?: string | null): boolean =>
  !value || value.trim().toUpperCase().startsWith("TODO");

export type Education = {
  school: string;
  program: string;
  years: string;
  note: string;
};

export type FocusArea = {
  title: string;
  description: string;
  icon: IconName;
};

export type Stat = { value: string; label: string };

export type SkillCategory =
  | "Programming"
  | "Frontend"
  | "Mobile"
  | "Backend"
  | "Database"
  | "Tools"
  | "AI"
  | "Other";

export type Skill = {
  name: string;
  category: SkillCategory;
  icon: IconName;
};

export type Project = {
  slug: string;
  title: string;
  category: string;
  /** 2–3 lines, shown on the card. */
  summary: Content;
  /** Longer intro shown under the title on the detail page. */
  description: Content;
  tags: string[];
  githubUrl: Content;
  liveUrl?: string;
  /** Path under /public, e.g. "/projects/cleandasma/cover.png". */
  thumbnail?: string;
  /** Set for tall phone screenshots so they're shown whole in a handset frame instead of cropped. */
  phoneScreenshots?: boolean;
  gallery: { src: string; alt: string }[];
  /** Your role on the project, e.g. "Group leader". */
  role?: Content;
  overview: Content;
  problem: Content;
  solution: Content;
  features: Content[];
  stack: string[];
  process: Content[];
  result: Content;
};

export type ExperienceEntry = {
  period: Content;
  title: string;
  organization: string;
  description: Content;
  tags: string[];
};

export type Highlight = {
  title: string;
  description: string;
  icon: IconName;
};

export type Certificate = {
  slug: string;
  title: string;
  issuer: string;
  year: Content;
  description: Content;
  /** Path under /public, e.g. "/certificates/ccna-itn.png". */
  image?: string;
  credentialUrl: Content;
};
