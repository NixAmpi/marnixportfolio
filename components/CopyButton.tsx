"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy } from "lucide-react";

/** Copies `value` to the clipboard and shows a brief "Copied!" tooltip. */
export function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(t);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // Older browsers / insecure contexts: fall back to a hidden textarea.
      const ta = document.createElement("textarea");
      ta.value = value;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
  };

  return (
    <span className="relative z-10 shrink-0">
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "Copied" : label}
        className="grid size-9 place-items-center rounded-full border border-white/15 bg-white/[0.04] text-slate-300 transition hover:border-white/30 hover:text-white"
      >
        {copied ? <Check className="size-4 text-emerald-300" aria-hidden /> : <Copy className="size-4" aria-hidden />}
      </button>
      <AnimatePresence>
        {copied && (
          <motion.span
            role="status"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 rounded-md bg-white px-2 py-1 text-xs font-semibold whitespace-nowrap text-ink-950 shadow-lg"
          >
            Copied!
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
