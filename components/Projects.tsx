import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { isTodo } from "@/data/types";
import { GithubIcon } from "@/components/icons";
import { ProjectMedia } from "@/components/ProjectMedia";
import { Chip, Container, SectionHeading, Text } from "@/components/ui";
import { Reveal, RevealItem } from "@/components/Reveal";

export function Projects() {
  return (
    <section id="projects" className="section-glow py-24 sm:py-28">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Selected work"
            title="Projects"
            subtitle="Projects that show practical problem-solving, system planning, and application development experience."
          />
        </Reveal>

        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <RevealItem key={p.slug} delay={i * 0.08} className="glass glass-hover group relative flex h-full flex-col overflow-hidden">
                <div className="relative aspect-[16/10] overflow-hidden border-b border-white/10">
                  <ProjectMedia
                    src={p.thumbnail}
                    alt={`${p.title} screenshot`}
                    phone={p.phoneScreenshots}
                    sizes="(min-width: 1024px) 360px, (min-width: 768px) 50vw, 100vw"
                  />
                  <span
                    className={`absolute top-3 left-3 rounded-full border bg-ink-950/75 px-3 py-1 text-[11px] font-semibold backdrop-blur ${
                      isTodo(p.category) ? "border-dashed border-amber-300/50 text-amber-200" : "border-white/15 text-white"
                    }`}
                  >
                    {p.category}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-xl font-bold text-white">
                      {/* Stretched link: the whole card opens the detail page. */}
                      <Link href={`/projects/${p.slug}`} className="after:absolute after:inset-0 after:content-['']">
                        {p.title}
                      </Link>
                    </h3>
                    <ArrowUpRight className="size-5 shrink-0 text-muted transition group-hover:text-accent-cyan" aria-hidden />
                  </div>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">
                    <Text value={p.summary} />
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <Chip key={t}>{t}</Chip>
                    ))}
                  </div>
                  <div className="mt-auto flex pt-5">
                    <a
                      href={isTodo(p.githubUrl) ? profile.github.url : p.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${p.title} source code on GitHub`}
                      className="relative z-10 grid size-9 place-items-center rounded-full border border-white/15 text-slate-300 transition hover:border-white/30 hover:text-white"
                    >
                      <GithubIcon className="size-4" />
                    </a>
                  </div>
                </div>
            </RevealItem>
          ))}
        </ul>
      </Container>
    </section>
  );
}
