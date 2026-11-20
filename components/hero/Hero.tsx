import Link from "next/link";
import { ChevronDown, Download, Mail } from "lucide-react";
import { profile } from "@/data/profile";
import { GithubIcon, LinkedinIcon } from "@/components/icons";
import { HeroVisual } from "./HeroVisual";

const ghostButton =
  "inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/[0.07]";

export function Hero() {
  return (
    <section id="home" className="relative isolate overflow-hidden lg:min-h-svh">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-[-10%] -z-10 size-[44rem] rounded-full bg-[radial-gradient(closest-side,rgba(124,92,255,0.28),transparent)] blur-2xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/3 left-[-15%] -z-10 size-[36rem] rounded-full bg-[radial-gradient(closest-side,rgba(34,211,238,0.12),transparent)] blur-2xl"
      />

      <div className="mx-auto grid max-w-6xl grid-cols-1 lg:min-h-svh lg:grid-cols-2">
        {/* Lanyard: on top on mobile, right column on desktop; hangs from the top edge either way. */}
        <div className="h-[440px] sm:h-[480px] lg:order-last lg:h-auto lg:min-h-[640px]">
          <HeroVisual />
        </div>

        <div className="flex flex-col justify-center px-4 pb-20 sm:px-6 lg:pt-24 lg:pb-24">
          <p className="mb-4 text-xs font-semibold tracking-[0.3em] text-eyebrow uppercase">Welcome to my portfolio</p>
          <h1 className="text-4xl leading-[1.05] font-extrabold tracking-tight text-white sm:text-6xl">
            Hi, I&apos;m <br />
            <span className="text-gradient">
              {profile.nameLines[0]}
              <br />
              {profile.nameLines[1]}
            </span>
          </h1>
          <p className="mt-5 text-lg font-semibold text-accent-cyan">{profile.role}</p>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">{profile.tagline}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={profile.cvUrl}
              download
              className="inline-flex items-center gap-2 rounded-full bg-accent-gradient px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-accent-violet/25 transition hover:-translate-y-0.5 hover:shadow-accent-violet/40"
            >
              <Download className="size-4" aria-hidden /> Download CV
            </a>
            <a href={profile.github.url} target="_blank" rel="noopener noreferrer" className={ghostButton}>
              <GithubIcon className="size-4" /> GitHub
            </a>
            <a href={profile.linkedin.url} target="_blank" rel="noopener noreferrer" className={ghostButton}>
              <LinkedinIcon className="size-4" /> LinkedIn
            </a>
            <Link href="/#contact" className={ghostButton}>
              <Mail className="size-4" aria-hidden /> Contact Me
            </Link>
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
