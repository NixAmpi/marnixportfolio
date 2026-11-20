import { GraduationCap } from "lucide-react";
import { education, focusAreas, profile, stats } from "@/data/profile";
import { Icon } from "@/components/icons";
import { Chip, Container, SectionHeading } from "@/components/ui";
import { Reveal } from "@/components/Reveal";

export function About() {
  return (
    <section id="about" className="section-glow py-24 sm:py-28">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Get to know me"
            title="About Me"
            subtitle="A quick look at my background, interests, and career direction in Information Technology."
          />
        </Reveal>

        <div className="grid gap-8 lg:grid-cols-[1.25fr_1fr]">
          <div className="flex flex-col gap-6">
            <Reveal className="glass space-y-4 p-6 text-[15px] leading-relaxed text-slate-300 sm:p-8">
              {profile.about.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </Reveal>

            <Reveal className="grid grid-cols-3 gap-3">
              {stats.map((s) => (
                <div key={s.label} className="glass p-4 text-center sm:p-5">
                  <p className="text-gradient text-2xl font-extrabold sm:text-3xl">{s.value}</p>
                  <p className="mt-1 text-[11px] leading-snug text-muted sm:text-xs">{s.label}</p>
                </div>
              ))}
            </Reveal>

            {education.map((e) => (
              <Reveal key={e.school} className="glass glass-hover flex gap-4 p-5 sm:p-6">
                <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-accent-gradient text-white">
                  <GraduationCap className="size-6" aria-hidden />
                </span>
                <div>
                  <h3 className="font-bold text-accent-cyan">{e.school}</h3>
                  <p className="mt-0.5 text-sm font-medium text-white">{e.program}</p>
                  <p className="mt-1 text-xs tracking-wider text-muted uppercase">{e.years}</p>
                  <p className="mt-2 text-sm text-muted">{e.note}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="flex flex-col gap-6">
            <Reveal className="glass p-6 sm:p-7">
              <h3 className="mb-4 text-sm font-semibold tracking-[0.2em] text-eyebrow uppercase">Focus areas</h3>
              <ul className="space-y-2">
                {focusAreas.map((f) => (
                  <li key={f.title} className="flex items-start gap-3 rounded-xl p-2.5 transition hover:bg-white/[0.04]">
                    <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-accent-cyan">
                      <Icon name={f.icon} className="size-5" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-white">{f.title}</p>
                      <p className="text-xs leading-relaxed text-muted">{f.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex flex-wrap gap-2">
                {profile.focusTags.map((t) => (
                  <Chip key={t}>{t}</Chip>
                ))}
              </div>
            </Reveal>

            <Reveal className="glass p-6 sm:p-7">
              <h3 className="mb-3 text-sm font-semibold tracking-[0.2em] text-eyebrow uppercase">Career direction</h3>
              <p className="text-sm leading-relaxed text-slate-300">{profile.careerDirection}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {profile.traits.map((t) => (
                  <Chip key={t}>{t}</Chip>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
