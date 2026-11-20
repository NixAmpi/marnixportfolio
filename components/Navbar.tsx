"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { navLinks, profile, type SectionId } from "@/data/profile";
import { useReducedMotion } from "@/lib/hooks";

export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  const [spied, setSpied] = useState<SectionId>("home");
  const toggleRef = useRef<HTMLButtonElement>(null);

  const active: SectionId | null = isHome ? spied : pathname.startsWith("/projects") ? "projects" : null;

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 16);
      // Hide on scroll down, reveal on any scroll up; always shown near the top.
      if (Math.abs(y - lastY) > 6) {
        setHidden(y > lastY && y > 160);
        lastY = y;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy: the section crossing a band just above the viewport middle wins.
  useEffect(() => {
    if (!isHome) return;
    const sections = navLinks
      .map(({ id }) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setSpied(entry.target.id as SectionId);
        }
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [isHome]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const solid = scrolled || open;
  // Never tuck away while the mobile menu is open or for reduced-motion users.
  const tucked = hidden && !open && !reduced;

  return (
    <header
      // Keyboard users tabbing into a tucked-away navbar bring it back.
      onFocusCapture={() => setHidden(false)}
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter,translate] duration-300 ${
        tucked ? "-translate-y-full" : ""
      } ${solid ? "border-b border-white/10 bg-ink-950/70 backdrop-blur-xl" : "border-b border-transparent"}`}
    >
      <nav aria-label="Primary" className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/#home" className="text-xl font-extrabold tracking-tight text-white" onClick={() => setOpen(false)}>
          {profile.shortName}
          <span className="text-gradient">.</span>
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {navLinks.map(({ id, label }) => (
            <li key={id}>
              <Link
                href={`/#${id}`}
                aria-current={active === id ? "true" : undefined}
                className={`relative block rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  active === id ? "text-white" : "text-muted hover:text-white"
                }`}
              >
                {active === id && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 -z-10 rounded-full border border-white/10 bg-accent-gradient"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <button
          ref={toggleRef}
          type="button"
          className="grid size-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-white lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="px-4 pb-4 lg:hidden"
          >
            <ul className="glass flex flex-col gap-1 bg-ink-900/90 p-2">
              {navLinks.map(({ id, label }) => (
                <li key={id}>
                  <Link
                    href={`/#${id}`}
                    onClick={() => setOpen(false)}
                    aria-current={active === id ? "true" : undefined}
                    className={`block rounded-xl px-4 py-3 text-sm font-medium ${
                      active === id ? "bg-accent-gradient text-white" : "text-slate-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
