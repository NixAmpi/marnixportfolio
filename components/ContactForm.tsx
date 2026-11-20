"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { profile } from "@/data/profile";

type Fields = { name: string; email: string; message: string };
type Errors = Partial<Record<keyof Fields, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(f: Fields): Errors {
  const errors: Errors = {};
  if (!f.name.trim()) errors.name = "Please enter your name.";
  if (!EMAIL_RE.test(f.email.trim())) errors.email = "Please enter a valid email address.";
  if (f.message.trim().length < 10) errors.message = "Please write at least 10 characters.";
  return errors;
}

const inputClass =
  "w-full rounded-xl border border-white/10 bg-ink-950/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 transition focus:border-accent-violet focus:ring-2 focus:ring-accent-violet/40 focus:outline-none aria-[invalid=true]:border-rose-400/70";

export function ContactForm() {
  const [fields, setFields] = useState<Fields>({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  const update = (key: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFields((prev) => ({ ...prev, [key]: e.target.value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const found = validate(fields);
    setErrors(found);
    const firstInvalid = (Object.keys(found) as (keyof Fields)[])[0];
    if (firstInvalid) {
      document.getElementById(`cf-${firstInvalid}`)?.focus();
      return;
    }
    // TODO: swap this mailto fallback for a form service (Resend via a route handler, or Formspree).
    const subject = encodeURIComponent(`Portfolio inquiry from ${fields.name.trim()}`);
    const body = encodeURIComponent(`${fields.message.trim()}\n\n— ${fields.name.trim()} (${fields.email.trim()})`);
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  const field = (key: keyof Fields, label: string, input: React.ReactNode) => (
    <div>
      <label htmlFor={`cf-${key}`} className="mb-2 block text-xs font-semibold tracking-wider text-slate-300 uppercase">
        {label}
      </label>
      {input}
      {errors[key] && (
        <p id={`cf-${key}-error`} className="mt-1.5 text-xs text-rose-300">
          {errors[key]}
        </p>
      )}
    </div>
  );

  const aria = (key: keyof Fields) => ({
    id: `cf-${key}`,
    name: key,
    "aria-invalid": errors[key] ? true : undefined,
    "aria-describedby": errors[key] ? `cf-${key}-error` : undefined,
  });

  return (
    <form noValidate onSubmit={onSubmit} className="glass flex flex-col gap-5 p-6 sm:p-8">
      {field("name", "Name", <input {...aria("name")} type="text" autoComplete="name" placeholder="Juan Dela Cruz" value={fields.name} onChange={update("name")} className={inputClass} />)}
      {field("email", "Email", <input {...aria("email")} type="email" autoComplete="email" placeholder="you@company.com" value={fields.email} onChange={update("email")} className={inputClass} />)}
      {field(
        "message",
        "Message",
        <textarea {...aria("message")} rows={5} placeholder="Let's talk about an opportunity…" value={fields.message} onChange={update("message")} className={`${inputClass} resize-y`} />,
      )}
      <button
        type="submit"
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent-gradient px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-accent-violet/25 transition hover:-translate-y-0.5 hover:shadow-accent-violet/40"
      >
        <Send className="size-4" aria-hidden /> Send Message
      </button>
      <p role="status" className="text-center text-xs text-muted">
        {sent ? "Your email app should have opened with the message ready to send." : "Opens your email app with this message pre-filled."}
      </p>
    </form>
  );
}
