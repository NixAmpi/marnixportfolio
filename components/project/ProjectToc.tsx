"use client";

import { useEffect, useState } from "react";

export type TocItem = { id: string; label: string };

/**
 * Sticky mini table of contents for project pages. It floats in the empty left margin
 * on very wide screens only (≥1400px), so the page layout itself is untouched.
 */
export function ProjectToc({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter((el): el is HTMLElement => !!el);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav
      aria-label="On this page"
      className="fixed top-32 left-[max(1rem,calc((100vw-64rem)/2-12.5rem))] z-30 hidden w-44 min-[1400px]:block"
    >
      <p className="mb-3 text-[11px] font-semibold tracking-[0.25em] text-eyebrow uppercase">On this page</p>
      <ul className="space-y-1 border-l border-white/10">
        {items.map((item) => {
          const on = item.id === active;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={on ? "true" : undefined}
                className={`-ml-px block border-l py-1.5 pl-4 text-sm transition-colors ${
                  on ? "border-accent-cyan font-semibold text-white" : "border-transparent text-muted hover:text-white"
                }`}
              >
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
