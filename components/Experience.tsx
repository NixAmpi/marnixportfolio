import { experience } from "@/data/experience";
import { highlights } from "@/data/profile";
import { Icon } from "@/components/icons";
import { Chip, Container, SectionHeading, Text } from "@/components/ui";
import { Reveal } from "@/components/Reveal";

export function Experience() {
  return (
    <section id="experience" className="section-glow py-24 sm:py-28">
      <Container className="max-w-4xl">
        <Reveal>
          <SectionHeading
            eyebrow="My path so far"
            title="Journey Timeline"
            subtitle="Education, projects, and certifications that shaped how I build."
          />
        </Reveal>

        <ol className="relative ml-3 border-l border-transparent sm:ml-4">
          <span
            aria-hidden
            className="absolute top-2 bottom-2 -left-px w-px bg-gradient-to-b from-accent-violet via-accent-blue to-transparent shadow-[0_0_12px_rgba(124,92,255,0.7)]"
          />
          {experience.map((e, i) => (
            <li key={`${e.title}-${i}`} className="relative pb-8 pl-8 last:pb-0 sm:pl-10">
              <span
                aria-hidden
                className="absolute top-6 -left-[7px] size-3.5 rounded-full border-2 border-accent-violet bg-ink-950 shadow-[0_0_0_4px_rgba(124,92,255,0.15),0_0_14px_rgba(124,92,255,0.8)]"
              />
              <Reveal className="glass glass-hover p-5 sm:p-6">
                <p className="text-xs font-semibold tracking-[0.18em] text-muted uppercase">
                  <Text value={e.period} />
                </p>
                <h3 className="mt-2 text-lg font-bold text-white">{e.title}</h3>
                <p className="mt-0.5 text-sm font-semibold text-accent-cyan">{e.organization}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  <Text value={e.description} />
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {e.tags.map((t) => (
                    <Chip key={t}>{t}</Chip>
                  ))}
                </div>
              </Reveal>
            </li>
          ))}
        </ol>

        <div className="mt-16">
          <h3 className="mb-6 text-center text-sm font-semibold tracking-[0.2em] text-eyebrow uppercase">Highlights</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            {highlights.map((h, i) => (
              <Reveal key={h.title} delay={i * 0.06} className="glass glass-hover p-5">
                <span className="mb-3 grid size-10 place-items-center rounded-lg bg-gradient-to-br from-accent-violet/30 to-accent-cyan/20 text-white">
                  <Icon name={h.icon} className="size-5" />
                </span>
                <p className="font-semibold text-white">{h.title}</p>
                <p className="mt-1 text-sm text-muted">{h.description}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
