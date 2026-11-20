"use client";

import { motion, type HTMLMotionProps } from "framer-motion";

const reveal = (delay: number) =>
  ({
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.15 },
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
  }) as const;

export function Reveal({ delay = 0, ...props }: HTMLMotionProps<"div"> & { delay?: number }) {
  return <motion.div data-reveal {...reveal(delay)} {...props} />;
}

/** Same as Reveal, for direct children of <ul>/<ol>. */
export function RevealItem({ delay = 0, ...props }: HTMLMotionProps<"li"> & { delay?: number }) {
  return <motion.li data-reveal {...reveal(delay)} {...props} />;
}
