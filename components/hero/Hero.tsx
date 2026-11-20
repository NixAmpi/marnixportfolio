import Link from "next/link";
import { ChevronDown, Download, Mail } from "lucide-react";
import { profile } from "@/data/profile";
import { GithubIcon, LinkedinIcon } from "@/components/icons";
import { Magnetic } from "@/components/effects/Magnetic";
import { HeroVisual } from "./HeroVisual";
import { RoleRotator } from "./RoleRotator";

// The rotating role leads with the real title, then cycles the others.
const roles = [profile.role, "IT Professional", "Web & Systems Developer", "Mobile App Developer"] as const;

const nameWords = profile.nameLines.flatMap((line) =>
  line.split(" ").map((text, i, arr) => ({ text, breakAfter: i === arr.length - 1 })),
);

const delay = (d: number) => ({ "--d": `${d}s` }) as React.CSSProperties;

/** One word sliding up from behind a mask. `gradient` (0–1) offsets a shared gradient so the name reads as one sweep. */
function Word({ children, d, gradient }: { children: React.ReactNode; d: number; gradient?: number }) {
  return (
    <span className="hero-mask">
      <span
        className={`hero-word ${gradient !== undefined ? "text-gradient-sweep" : ""}`}
        style={{ ...delay(d), ...(gradient !== undefined ? { backgroundPosition: `${gradient * 100}% 50%` } : {}) }}
      >
        {children}
      </span>
    </span>
  );
}

const ghostButton =
  "inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/[0.07]";

export function Hero() {
  return (
    <section id="home" className="relative isolate overflow-hidden lg:min-h-svh">
      <div
        aria-hidden
        className="aurora pointer-events-none absolute -top-40 right-[-10%] -z-10 size-[44rem] rounded-full bg-[radial-gradient(closest-side,rgba(124,92,255,0.28),transparent)] blur-2xl"
      />
      <div
        aria-hidden
        className="aurora aurora-slow pointer-events-none absolute top-1/3 left-[-15%] -z-10 size-[36rem] rounded-full bg-[radial-gradient(closest-side,rgba(34,211,238,0.12),transparent)] blur-2xl"
      />

      <div className="mx-auto grid max-w-6xl grid-cols-1 lg:min-h-svh lg:grid-cols-2">
        {/* Lanyard: on top on mobile, right column on desktop; hangs from the top edge either way. */}
        <div className="h-[440px] sm:h-[480px] lg:order-last lg:h-auto lg:min-h-[640px]">
          <HeroVisual />
        </div>

        <div className="flex flex-col justify-center px-4 pb-20 sm:px-6 lg:pt-24 lg:pb-24">
          {/* Load-in stagger is pure CSS (.hero-in / .hero-word in globals.css): eyebrow → name → role → bio → buttons. */}
          <p className="hero-in mb-4 text-xs font-semibold tracking-[0.3em] text-eyebrow uppercase" style={delay(0)}>
            Welcome to my portfolio
          </p>
          <h1 className="text-4xl leading-[1.05] font-extrabold tracking-tight text-white sm:text-6xl">
            <Word d={0.1}>Hi,</Word> <Word d={0.16}>I&apos;m</Word>
            <br />
            {nameWords.map((w, i) => (
              <span key={w.text}>
                <Word d={0.24 + i * 0.08} gradient={i / (nameWords.length - 1)}>
                  {w.text}
                </Word>
                {w.breakAfter ? <br /> : " "}
              </span>
            ))}
          </h1>
          <p className="hero-in mt-5 text-lg font-semibold text-accent-cyan" style={delay(0.6)}>
            <RoleRotator roles={roles} />
          </p>
          <p className="hero-in mt-4 max-w-xl text-base leading-relaxed text-muted" style={delay(0.72)}>
            {profile.tagline}
          </p>

          <div className="hero-in mt-8 flex flex-wrap gap-3" style={delay(0.84)}>
            <Magnetic>
              <a
                href={profile.cvUrl}
                download
                className="btn-shine relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-accent-gradient px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-accent-violet/25 transition hover:-translate-y-0.5 hover:shadow-accent-violet/40"
              >
                <Download className="size-4" aria-hidden /> Download CV
              </a>
            </Magnetic>
            <Magnetic>
              <a href={profile.github.url} target="_blank" rel="noopener noreferrer" className={ghostButton}>
                <GithubIcon className="size-4" /> GitHub
              </a>
            </Magnetic>
            <Magnetic>
              <a href={profile.linkedin.url} target="_blank" rel="noopener noreferrer" className={ghostButton}>
                <LinkedinIcon className="size-4" /> LinkedIn
              </a>
            </Magnetic>
            <Magnetic>
              <Link href="/#contact" className={ghostButton}>
                <Mail className="size-4" aria-hidden /> Contact Me
              </Link>
            </Magnetic>
          </div>
        </div>
      </div>

      <Link
        href="/#about"
        aria-label="Scroll to About"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 rounded-full p-2 text-muted transition hover:text-white lg:block"
      >
        <ChevronDown className="size-6 animate-bounce" aria-hidden />
      </Link>
    </section>
  );
}
