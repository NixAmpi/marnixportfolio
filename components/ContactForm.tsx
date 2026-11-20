"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Loader2, Send } from "lucide-react";
import { profile } from "@/data/profile";

type Fields = { name: string; email: string; message: string };
type Key = keyof Fields;
type Errors = Partial<Record<Key, string>>;
type Status = "idle" | "sending" | "done" | "error";
type Toast = { tone: "success" | "error"; text: string } | null;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Set NEXT_PUBLIC_FORMSPREE_ID (e.g. "xyzabcde") in .env.local / Vercel to send through Formspree.
const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID;

function validateField(key: Key, value: string): string | undefined {
  if (key === "name" && !value.trim()) return "Please enter your name.";
  if (key === "email" && !EMAIL_RE.test(value.trim())) return "Please enter a valid email address.";
  if (key === "message" && value.trim().length < 10) return "Please write at least 10 characters.";
}

function validate(f: Fields): Errors {
  const errors: Errors = {};
  for (const key of Object.keys(f) as Key[]) {
    const err = validateField(key, f[key]);
    if (err) errors[key] = err;
  }
  return errors;
}

/** Opens the visitor's email app with the message pre-filled. */
function openMailApp(f: Fields) {
  const subject = encodeURIComponent(`Portfolio inquiry from ${f.name.trim()}`);
  const body = encodeURIComponent(`${f.message.trim()}\n\n— ${f.name.trim()} (${f.email.trim()})`);
  window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
}

const fieldBase =
  "peer w-full rounded-xl border border-white/10 bg-ink-950 px-4 pt-6 pb-2 text-sm text-white transition-colors placeholder:text-transparent focus:border-transparent focus:outline-none aria-[invalid=true]:border-rose-400/70";

export function ContactForm() {
  const [fields, setFields] = useState<Fields>({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<Key, boolean>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [toast, setToast] = useState<Toast>(null);

  // Toast dismisses itself; the button returns to idle a little later.
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 6000);
    return () => clearTimeout(t);
  }, [toast]);
  useEffect(() => {
    if (status !== "done" && status !== "error") return;
    const t = setTimeout(() => setStatus("idle"), 4000);
    return () => clearTimeout(t);
  }, [status]);

  const update = (key: Key) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value;
    setFields((prev) => ({ ...prev, [key]: value }));
    // Once a field has been visited, re-validate it live as the visitor types.
    if (touched[key]) setErrors((prev) => ({ ...prev, [key]: validateField(key, value) }));
  };
  const blur = (key: Key) => () => {
    setTouched((prev) => ({ ...prev, [key]: true }));
    setErrors((prev) => ({ ...prev, [key]: validateField(key, fields[key]) }));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;
    const found = validate(fields);
    setErrors(found);
    setTouched({ name: true, email: true, message: true });
    const firstInvalid = (Object.keys(found) as Key[])[0];
    if (firstInvalid) {
      document.getElementById(`cf-${firstInvalid}`)?.focus();
      return;
    }

    setStatus("sending");
    if (FORMSPREE_ID) {
      try {
        const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ name: fields.name.trim(), email: fields.email.trim(), message: fields.message.trim() }),
        });
        if (!res.ok) throw new Error(`Formspree ${res.status}`);
        setStatus("done");
        setToast({ tone: "success", text: "Message sent! I'll get back to you soon." });
        setFields({ name: "", email: "", message: "" });
        setTouched({});
      } catch {
        setStatus("error");
        setToast({ tone: "error", text: `Couldn't send right now. Please email me at ${profile.email}.` });
      }
      return;
    }

    // No form service configured: hand off to the visitor's email app, and say so honestly.
    openMailApp(fields);
    setTimeout(() => {
      setStatus("done");
      setToast({ tone: "success", text: "Your email app should be open with the message ready — just hit send." });
    }, 700);
  };

  const field = (key: Key, label: string, input: React.ReactNode) => (
    <div>
      <div className="group relative">
        {/* Gradient focus ring: fades in behind the field (opacity only). */}
        <span
          aria-hidden
          className="pointer-events-none absolute -inset-px rounded-[0.8rem] bg-accent-gradient opacity-0 transition-opacity duration-300 group-focus-within:opacity-100"
        />
        <span aria-hidden className="pointer-events-none absolute -inset-1 rounded-2xl bg-accent-violet/25 opacity-0 blur-md transition-opacity duration-300 group-focus-within:opacity-100" />
        <div className="relative">
          {input}
          <label
            htmlFor={`cf-${key}`}
            className="pointer-events-none absolute top-4 left-4 origin-left text-sm text-slate-400 transition-transform duration-200 peer-focus:-translate-y-2.5 peer-focus:scale-[0.8] peer-focus:text-accent-cyan peer-[:not(:placeholder-shown)]:-translate-y-2.5 peer-[:not(:placeholder-shown)]:scale-[0.8]"
          >
            {label}
          </label>
        </div>
      </div>
      <AnimatePresence initial={false}>
        {errors[key] && (
          <motion.p
            id={`cf-${key}-error`}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="mt-1.5 flex items-center gap-1.5 text-xs text-rose-300"
          >
            <AlertCircle className="size-3.5 shrink-0" aria-hidden />
            {errors[key]}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );

  const aria = (key: Key) => ({
    id: `cf-${key}`,
    name: key,
    placeholder: " ", // lets the label float via :placeholder-shown
    onBlur: blur(key),
    "aria-invalid": errors[key] ? true : undefined,
    "aria-describedby": errors[key] ? `cf-${key}-error` : undefined,
  });

  return (
    <>
      <form noValidate onSubmit={onSubmit} className="glass flex flex-col gap-5 p-6 sm:p-8" aria-busy={status === "sending"}>
        {field("name", "Name", <input {...aria("name")} type="text" autoComplete="name" value={fields.name} onChange={update("name")} className={fieldBase} />)}
        {field("email", "Email", <input {...aria("email")} type="email" autoComplete="email" value={fields.email} onChange={update("email")} className={fieldBase} />)}
        {field(
          "message",
          "Message",
          <textarea {...aria("message")} rows={5} value={fields.message} onChange={update("message")} className={`${fieldBase} resize-y`} />,
        )}
        <button
          type="submit"
          disabled={status === "sending"}
          className="btn-shine relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-accent-gradient px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-accent-violet/25 transition hover:-translate-y-0.5 hover:shadow-accent-violet/40 disabled:cursor-wait disabled:opacity-90"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={status}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="inline-flex items-center gap-2"
            >
              {status === "sending" ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden /> {FORMSPREE_ID ? "Sending…" : "Opening your email app…"}
                </>
              ) : status === "done" ? (
                <>
                  <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
                    <motion.path
                      d="M5 12.5l4.5 4.5L19 7.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.45, ease: "easeOut" }}
                    />
                  </svg>
                  {FORMSPREE_ID ? "Sent" : "Email app opened"}
                </>
              ) : status === "error" ? (
                <>
                  <AlertCircle className="size-4" aria-hidden /> Try again
                </>
              ) : (
                <>
                  <Send className="size-4" aria-hidden /> Send Message
                </>
              )}
            </motion.span>
          </AnimatePresence>
        </button>
        <p className="text-center text-xs text-muted">
          {FORMSPREE_ID ? "Your message goes straight to my inbox." : "Opens your email app with this message pre-filled."}
        </p>
      </form>

      {/* Toast — announced politely to screen readers. */}
      <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-[60] flex justify-center px-4">
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              className={`pointer-events-auto flex max-w-md items-start gap-3 rounded-2xl border px-4 py-3 text-sm text-white shadow-2xl shadow-black/50 backdrop-blur-xl ${
                toast.tone === "success" ? "border-emerald-400/30 bg-emerald-950/80" : "border-rose-400/30 bg-rose-950/80"
              }`}
            >
              {toast.tone === "success" ? (
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-300" aria-hidden />
              ) : (
                <AlertCircle className="mt-0.5 size-4 shrink-0 text-rose-300" aria-hidden />
              )}
              {toast.text}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
