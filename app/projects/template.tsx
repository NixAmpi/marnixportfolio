/**
 * Re-mounts on every navigation into /projects/*, replaying a CSS fade + slide.
 * Pure CSS, so it runs on first paint (no wait for hydration) and never delays LCP.
 */
export default function ProjectsTemplate({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
