import { Mail, MapPin, Phone } from "lucide-react";
import { profile } from "@/data/profile";
import { GithubIcon, LinkedinIcon } from "@/components/icons";
import { Container, SectionHeading } from "@/components/ui";
import { Reveal } from "@/components/Reveal";
import { ContactForm } from "./ContactForm";
import { CopyButton } from "./CopyButton";

const rows = [
  { label: "Email", value: profile.email, href: `mailto:${profile.email}`, icon: <Mail className="size-5" aria-hidden /> },
  { label: "GitHub", value: profile.github.username, href: profile.github.url, icon: <GithubIcon className="size-5" /> },
  { label: "LinkedIn", value: profile.linkedin.label, href: profile.linkedin.url, icon: <LinkedinIcon className="size-5" /> },
  { label: "Phone", value: profile.phone, href: `tel:${profile.phone}`, icon: <Phone className="size-5" aria-hidden /> },
  { label: "Location", value: profile.location, icon: <MapPin className="size-5" aria-hidden /> },
];

export function Contact() {
  return (
    <section id="contact" className="section-glow py-24 sm:py-28">
      <Container className="max-w-5xl">
        <SectionHeading
          eyebrow="Let's build something together"
          title="Contact Me"
          subtitle="I'm actively looking for internship and entry-level opportunities in software development, database management, and IT support."
        />

        <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
          <Reveal className="flex flex-col gap-3">
            {rows.map((r) => {
              const inner = (
                <>
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-accent-violet/30 to-accent-cyan/20 text-white">
                    {r.icon}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs font-semibold tracking-[0.18em] text-muted uppercase">{r.label}</span>
                    <span className="block truncate text-sm font-medium text-white">{r.value}</span>
                  </span>
                </>
              );
              // Email: a <button> can't live inside the <a>, so the link stretches over the card
              // and the copy button sits above it.
              if (r.label === "Email") {
                return (
                  <div key={r.label} className="glass glass-hover relative flex items-center gap-4 p-4">
                    <a href={r.href} className="flex min-w-0 flex-1 items-center gap-4 after:absolute after:inset-0 after:content-['']">
                      {inner}
                    </a>
                    <CopyButton value={profile.email} label="Copy email address" />
                  </div>
                );
              }
              return r.href ? (
                <a
                  key={r.label}
                  href={r.href}
                  {...(r.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="glass glass-hover flex items-center gap-4 p-4"
                >
                  {inner}
                </a>
              ) : (
                <div key={r.label} className="glass flex items-center gap-4 p-4">
                  {inner}
                </div>
              );
            })}
          </Reveal>

          <Reveal delay={0.08}>
            <ContactForm />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
