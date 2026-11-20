"use client";

import { useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { skillCategories, skills } from "@/data/skills";
import type { SkillCategory } from "@/data/types";
import { Icon } from "@/components/icons";
import { Container, SectionHeading } from "@/components/ui";
import { Reveal } from "@/components/Reveal";

type Filter = "All" | SkillCategory;

/** Number of skills behind each filter pill. */
const counts = Object.fromEntries(
  ["All", ...skillCategories].map((c) => [c, c === "All" ? skills.length : skills.filter((s) => s.category === c).length]),
) as Record<Filter, number>;

const filters: Filter[] = ["All", ...skillCategories.filter((c) => skills.some((s) => s.category === c))];

export function Skills() {
  const [filter, setFilter] = useState<Filter>("All");
  const visible = filter === "All" ? skills : skills.filter((s) => s.category === filter);

  return (
    <section id="skills" className="section-glow py-24 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="What I work with"
          title="Skills & Technologies"
          subtitle="Technologies and tools I use for development, database work, and project workflows."
        />

        <Reveal>
          <LayoutGroup id="skill-filters">
            <div role="group" aria-label="Filter skills by category" className="mb-10 flex flex-wrap justify-center gap-2">
              {filters.map((f) => {
                const active = f === filter;
                return (
                  <button
                    key={f}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setFilter(f)}
                    className={`relative rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                      active ? "border-transparent text-white" : "border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/25 hover:text-white"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="skill-pill"
                        className="absolute inset-0 -z-10 rounded-full bg-accent-gradient"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    {f}
                    <span
                      aria-hidden
                      className={`ml-2 inline-grid min-w-5 place-items-center rounded-full px-1.5 text-[10px] leading-5 font-semibold tabular-nums transition-colors ${
                        active ? "bg-white/20 text-white" : "bg-white/[0.07] text-slate-400"
                      }`}
                    >
                      {counts[f]}
                    </span>
                    <span className="sr-only">
                      , {counts[f]} {counts[f] === 1 ? "skill" : "skills"}
                    </span>
                  </button>
                );
              })}
            </div>
          </LayoutGroup>
        </Reveal>

        <motion.ul layout className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((s) => (
              <motion.li
                key={s.name}
                layout
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.25 }}
                className="glass glass-hover fx-card flex items-center gap-3 p-4"
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-white/10 bg-gradient-to-br from-accent-violet/25 to-accent-cyan/15 text-white">
                  <Icon name={s.icon} className="size-5" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-white">{s.name}</span>
                  <span className="block text-[10px] font-semibold tracking-[0.18em] text-muted uppercase">{s.category}</span>
                </span>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </Container>
    </section>
  );
}
