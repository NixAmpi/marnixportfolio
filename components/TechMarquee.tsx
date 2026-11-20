import {
  siCss,
  siDart,
  siFigma,
  siFlutter,
  siHtml5,
  siJavascript,
  siMysql,
  siPostgresql,
  siPython,
  siSupabase,
  type SimpleIcon,
} from "simple-icons";

const tech: { icon: SimpleIcon; name: string }[] = [
  { icon: siFlutter, name: "Flutter" },
  { icon: siDart, name: "Dart" },
  { icon: siSupabase, name: "Supabase" },
  { icon: siPostgresql, name: "PostgreSQL" },
  { icon: siJavascript, name: "JavaScript" },
  { icon: siHtml5, name: "HTML" },
  { icon: siCss, name: "CSS" },
  { icon: siPython, name: "Python" },
  { icon: siMysql, name: "MySQL" },
  { icon: siFigma, name: "Figma" },
];

function Row({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul aria-hidden={hidden || undefined} className={`marquee-row flex shrink-0 items-center gap-10 pr-10 sm:gap-14 sm:pr-14 ${hidden ? "marquee-copy" : ""}`}>
      {tech.map(({ icon, name }) => (
        <li
          key={name}
          style={{ "--brand": `#${icon.hex}` } as React.CSSProperties}
          className="flex items-center gap-2.5 text-slate-400 transition-colors duration-300 hover:text-[var(--brand)]"
        >
          <svg viewBox="0 0 24 24" aria-hidden className="size-6 fill-current sm:size-7">
            <path d={icon.path} />
          </svg>
          <span className="text-sm font-semibold text-slate-300">{name}</span>
        </li>
      ))}
    </ul>
  );
}

/** Infinite logo strip (pauses on hover). Rendered on the server; the motion is pure CSS. */
export function TechMarquee() {
  return (
    <section aria-label="Technologies I use" className="marquee relative overflow-hidden border-y border-white/5 py-8">
      <div className="marquee-track flex w-max">
        <Row />
        <Row hidden />
      </div>
    </section>
  );
}
