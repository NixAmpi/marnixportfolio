"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LayoutGroup, motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { skillCategories, skills } from "@/data/skills";
import { isTodo, type SkillCategory } from "@/data/types";
import { Container, SectionHeading } from "@/components/ui";
import { Reveal } from "@/components/Reveal";
import { FINE_POINTER, useMediaQuery } from "@/lib/hooks";
import { inkFor } from "@/components/skills/keycaps";
import { haptic, playKey, preloadProfile, SOUND_PROFILES, type KeyPhase } from "@/components/skills/keySounds";
import { use3DCapable, useKeySound, useSoundProfile } from "@/components/skills/stores";
import { createKeyTimes, LAYOUTS, modSlot, panForSlot, type ModifierId } from "@/components/skills/layout";

const Keyboard3D = dynamic(() => import("@/components/skills/Keyboard3D"), { ssr: false });

type Filter = "All" | SkillCategory;

/** Number of skills behind each filter pill. */
const counts = Object.fromEntries(
  ["All", ...skillCategories].map((c) => [c, c === "All" ? skills.length : skills.filter((s) => s.category === c).length]),
) as Record<Filter, number>;

const filters: Filter[] = ["All", ...skillCategories.filter((c) => skills.some((s) => s.category === c))];

/** Sound family per slot: skills are normal keys; Enter/Shift are large; the spacebar has its own. */
const soundForSlot = new Map(LAYOUTS.desktop.keys.map((k) => [k.slot, k.sound]));

/** Real keys that animate their modifier keycap (Space is left alone: it scrolls the page). */
const HOTKEY_MODS: Record<string, ModifierId> = { Enter: "enter", Shift: "shift" };

export function Skills() {
  const [filter, setFilter] = useState<Filter>("All");
  const [selected, setSelected] = useState<number | null>(null);
  const [focused, setFocused] = useState<number | null>(null);
  const [load3D, setLoad3D] = useState(false);
  const [visible, setVisible] = useState(false);
  const [ready, setReady] = useState(false);
  const [sound, setSound] = useKeySound();
  const [profile, setProfile] = useSoundProfile();
  // Server + first hydration render the flat grid; capable devices then switch to 3D.
  // Skills sits below the fold, so that swap happens off-screen.
  const mode = use3DCapable() ? "3d" : "2d";
  const keyTimes = useRef(createKeyTimes());
  const stageRef = useRef<HTMLDivElement>(null);
  const finePointer = useMediaQuery(FINE_POINTER);
  const compact = useMediaQuery("(max-width: 767px)");

  const dimmed = useMemo(() => skills.map((s) => filter !== "All" && s.category !== filter), [filter]);

  // Load the 3D chunk when the stage nears the viewport; run it only while on screen.
  useEffect(() => {
    const el = stageRef.current;
    if (!el || mode !== "3d") return;
    const near = new IntersectionObserver(([e]) => e.isIntersecting && setLoad3D(true), { rootMargin: "300px 0px" });
    const onScreen = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    near.observe(el);
    onScreen.observe(el);
    return () => {
      near.disconnect();
      onScreen.disconnect();
    };
  }, [mode]);

  // Latest sound settings for the (stable) press handlers below.
  const soundRef = useRef({ on: sound, profile });
  useEffect(() => {
    soundRef.current = { on: sound, profile };
  }, [sound, profile]);

  const compactRef = useRef(compact);
  useEffect(() => {
    compactRef.current = compact;
  }, [compact]);

  const keySound = useCallback((slot: number, phase: KeyPhase) => {
    const { on, profile } = soundRef.current;
    if (!on) return;
    playKey(profile, soundForSlot.get(slot) ?? "key", phase, panForSlot(slot, compactRef.current));
    if (phase === "down") haptic();
  }, []);

  /** A key (skill or modifier slot) goes down: animate, show a skill's card, play the bottom-out. */
  const press = useCallback(
    (slot: number) => {
      keyTimes.current.down[slot] = performance.now() / 1000;
      if (slot < skills.length) setSelected(slot);
      keySound(slot, "down");
    },
    [keySound],
  );
  /** The key comes back up: springs back and plays the return sound (a real switch makes two). */
  const release = useCallback(
    (slot: number) => {
      keyTimes.current.up[slot] = performance.now() / 1000;
      keySound(slot, "up");
    },
    [keySound],
  );
  /** A tap, click or Enter on a button: down, then up a moment later. */
  const tap = useCallback(
    (i: number) => {
      press(i);
      setTimeout(() => release(i), 90);
    },
    [press, release],
  );

  // Real-keyboard shortcuts: desktop only, while the section is on screen, never while typing in a field.
  const sectionVisible = useRef(false);
  useEffect(() => {
    const el = document.getElementById("skills");
    if (!el) return;
    const io = new IntersectionObserver(([e]) => (sectionVisible.current = e.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!finePointer) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat || e.ctrlKey || e.metaKey || e.altKey || !sectionVisible.current) return;
      const t = e.target as HTMLElement | null;
      if (t?.closest("input, textarea, select, [contenteditable='true']")) return;
      const mod = HOTKEY_MODS[e.key];
      // Enter on a focused button/link activates it instead — don't also animate the cap.
      if (mod && !(mod === "enter" && t?.closest("button, a, [role=button]"))) return press(modSlot(mod));
      const i = skills.findIndex((s) => s.key === e.key.toUpperCase());
      if (i >= 0) press(i);
    };
    // The real key's release plays the up sound, so fast typing overlaps naturally.
    const onKeyUp = (e: KeyboardEvent) => {
      if (!sectionVisible.current) return;
      const mod = HOTKEY_MODS[e.key];
      if (mod) {
        const slot = modSlot(mod);
        if (keyTimes.current.up[slot] < keyTimes.current.down[slot]) release(slot);
        return;
      }
      const i = skills.findIndex((s) => s.key === e.key.toUpperCase());
      if (i >= 0) release(i);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [finePointer, press, release]);

  /** Plays a sample down/up pair once the profile's sounds are decoded. */
  const demo = (p: typeof profile) =>
    preloadProfile(p).then(() => {
      playKey(p, "key", "down");
      setTimeout(() => playKey(p, "key", "up"), 90);
    });

  const toggleSound = () => {
    setSound(!sound);
    if (!sound) void demo(profile); // this click also unlocks audio and loads the samples
  };
  const chooseProfile = (p: typeof profile) => {
    setProfile(p);
    if (sound) void demo(p);
  };

  const current = selected !== null ? skills[selected] : null;

  return (
    <section id="skills" className="section-glow py-24 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="What I work with"
          title="Skills & Technologies"
          subtitle="Technologies and tools I use for development, database work, and project workflows."
          hint={
            <>
              <span className="hidden [@media(hover:hover)_and_(pointer:fine)]:inline">(hint: press a key or click one)</span>
              <span className="[@media(hover:hover)_and_(pointer:fine)]:hidden">(hint: tap a key)</span>
            </>
          }
        />

        <Reveal>
          <LayoutGroup id="skill-filters">
            <div role="group" aria-label="Filter skills by category" className="mb-6 flex flex-wrap justify-center gap-2">
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

        <div className="relative">
          <div className="absolute top-0 right-0 z-10 flex items-center gap-2">
            {/* Sound profile picker (radio group), then the mute toggle. */}
            <div
              role="radiogroup"
              aria-label="Key sound"
              className="flex rounded-full border border-white/10 bg-white/[0.04] p-0.5 text-[11px] font-semibold"
            >
              {SOUND_PROFILES.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  role="radio"
                  aria-checked={profile === id}
                  onClick={() => chooseProfile(id)}
                  className={`rounded-full px-2.5 py-1.5 transition-colors ${
                    profile === id ? "bg-white/15 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={toggleSound}
              aria-pressed={sound}
              aria-label={sound ? "Mute key sounds" : "Turn on key sounds"}
              className="grid size-10 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-slate-300 transition hover:border-white/25 hover:text-white"
            >
              {sound ? <Volume2 className="size-4" aria-hidden /> : <VolumeX className="size-4" aria-hidden />}
            </button>
          </div>

          {mode === "3d" ? (
            <div ref={stageRef} className="relative h-[440px] sm:h-[500px]">
              {/* Placeholder plate until the 3D scene is ready (same size, so no layout shift). */}
              <div
                aria-hidden
                className={`absolute inset-x-[12%] top-1/2 h-1/2 -translate-y-1/2 -skew-x-12 rounded-3xl bg-gradient-to-br from-white/[0.05] to-white/[0.01] transition-opacity duration-500 ${ready ? "opacity-0" : "opacity-100"}`}
              />
              {load3D && (
                <div className={`absolute inset-0 transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}>
                  <Keyboard3D
                    skills={skills}
                    dimmed={dimmed}
                    focused={focused}
                    keyTimes={keyTimes}
                    onPress={press}
                    onRelease={release}
                    onTap={tap}
                    active={visible}
                    compact={compact}
                    onReady={() => setReady(true)}
                  />
                </div>
              )}
              {/* The canvas isn't reachable by keyboard or screen readers, so each key also exists
                  as a real button. Focusing one lifts and lights its keycap in the scene. */}
              <ul className="sr-only" aria-label="Skill keys">
                {skills.map((s, i) => (
                  <li key={s.name}>
                    <button
                      type="button"
                      aria-label={`${s.name}, ${s.category}${dimmed[i] ? " (filtered out)" : ""}`}
                      aria-keyshortcuts={finePointer ? s.key : undefined}
                      onFocus={() => setFocused(i)}
                      onBlur={() => setFocused((f) => (f === i ? null : f))}
                      onClick={() => tap(i)}
                    >
                      {s.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <FlatKeys dimmed={dimmed} selected={selected} onPress={tap} />
          )}

          <InfoCard skill={current} />
        </div>
      </Container>
    </section>
  );
}

/** Reduced-motion / low-end fallback: keycap-styled buttons in a flat grid. */
function FlatKeys({ dimmed, selected, onPress }: { dimmed: boolean[]; selected: number | null; onPress: (i: number) => void }) {
  return (
    <ul className="mx-auto grid max-w-3xl grid-cols-4 gap-3 pt-12 sm:grid-cols-6 sm:gap-4">
      {skills.map((s, i) => {
        const ink = inkFor(s.color);
        return (
          <li key={s.name}>
            <button
              type="button"
              onClick={() => onPress(i)}
              aria-label={`${s.name}, ${s.category}${dimmed[i] ? " (filtered out)" : ""}`}
              style={{ backgroundColor: s.color, color: ink }}
              className={`relative grid aspect-square w-full place-items-center rounded-2xl shadow-[inset_0_-6px_0_rgba(0,0,0,0.28),0_6px_14px_rgba(0,0,0,0.35)] transition duration-200 active:translate-y-1 active:shadow-[inset_0_-2px_0_rgba(0,0,0,0.28),0_2px_6px_rgba(0,0,0,0.35)] ${
                dimmed[i] ? "translate-y-1 opacity-30 saturate-50" : ""
              } ${selected === i ? "ring-2 ring-white ring-offset-2 ring-offset-ink-950" : ""}`}
            >
              <span aria-hidden className="absolute top-1.5 left-2 text-[11px] font-bold opacity-80">
                {s.key}
              </span>
              {/* eslint-disable-next-line @next/next/no-img-element -- tiny local SVGs, tinted with a CSS filter */}
              <img src={s.logo} alt="" loading="lazy" className="size-1/2" style={ink === "#ffffff" ? undefined : { filter: "brightness(0)" }} />
            </button>
          </li>
        );
      })}
    </ul>
  );
}

/** The info card under the keyboard; announced to screen readers when it changes. */
function InfoCard({ skill }: { skill: (typeof skills)[number] | null }) {
  return (
    <div aria-live="polite" className="glass mx-auto mt-6 flex max-w-xl items-center gap-4 p-4 sm:p-5">
      {skill ? (
        <>
          <span
            aria-hidden
            className="grid size-12 shrink-0 place-items-center rounded-xl shadow-[inset_0_-4px_0_rgba(0,0,0,0.25)]"
            style={{ backgroundColor: skill.color }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- tiny local SVG */}
            <img src={skill.logo} alt="" className="size-6" style={inkFor(skill.color) === "#ffffff" ? undefined : { filter: "brightness(0)" }} />
          </span>
          <span className="min-w-0">
            <span className="flex flex-wrap items-baseline gap-x-2">
              <span className="font-bold text-white">{skill.name}</span>
              <span className="text-[11px] font-semibold tracking-[0.18em] text-muted uppercase">{skill.category}</span>
            </span>
            {!isTodo(skill.description) && <span className="mt-0.5 block text-sm text-slate-300">{skill.description}</span>}
          </span>
        </>
      ) : (
        <span className="w-full text-center text-sm text-muted">Pick a key to see how I use it.</span>
      )}
    </div>
  );
}
