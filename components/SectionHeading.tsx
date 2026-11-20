"use client";

import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Eyebrow (with a drawn-in gradient line) + title + subtitle. On first view the title
 * fades up from a slight blur. Reduced motion is handled in CSS via [data-reveal].
 */
export function SectionHeading({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.6 }}
      className="relative isolate mx-auto mb-12 max-w-2xl text-center sm:mb-14"
    >
      {/* Wrapper centres the blob; the inner element owns the drifting transform. */}
      <div aria-hidden className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-40 w-[28rem] max-w-full -translate-x-1/2 -translate-y-1/2">
        <div className="aurora size-full rounded-full bg-[radial-gradient(closest-side,rgba(124,92,255,0.16),rgba(34,211,238,0.06)_60%,transparent)] blur-2xl" />
      </div>

      <motion.p
        data-reveal
        variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.5 } } }}
        className="mb-3 inline-flex items-center gap-3 text-xs font-semibold tracking-[0.3em] text-eyebrow uppercase"
      >
        <motion.span
          data-reveal
          aria-hidden
          variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 0.6, ease } } }}
          className="eyebrow-line relative h-px w-8 origin-left overflow-hidden bg-gradient-to-r from-accent-violet to-accent-cyan"
        />
        {eyebrow}
      </motion.p>
      <motion.h2
        data-reveal
        variants={{
          hidden: { opacity: 0, y: 16, filter: "blur(8px)" },
          show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, delay: 0.08, ease } },
        }}
        className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl"
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          data-reveal
          variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.18, ease } } }}
          className="mt-4 text-base text-muted"
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}
