"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Award, ExternalLink, X } from "lucide-react";
import { certificates } from "@/data/certificates";
import { profile } from "@/data/profile";
import { isTodo, type Certificate } from "@/data/types";
import { Container, SectionHeading, Text } from "@/components/ui";
import { RevealItem } from "@/components/Reveal";

function CertImage({ cert, sizes }: { cert: Certificate; sizes: string }) {
  if (cert.image) {
    return <Image src={cert.image} alt={`${cert.title} certificate`} fill sizes={sizes} className="object-contain p-3" />;
  }
  return (
    <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_30%_25%,rgba(124,92,255,0.3),transparent_55%),radial-gradient(circle_at_75%_80%,rgba(34,211,238,0.18),transparent_55%),linear-gradient(150deg,#141634,#0a0b1e)]">
      <Award className="size-10 text-white/60" aria-hidden />
    </div>
  );
}

export function Certificates() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [selected, setSelected] = useState<Certificate | null>(null);

  const open = (cert: Certificate) => {
    setSelected(cert);
    dialogRef.current?.showModal();
  };
  const close = () => dialogRef.current?.close();

  return (
    <section id="certificates" className="section-glow py-24 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Proof of learning"
          title="Certificates"
          subtitle="Certifications in programming, networking, and databases."
        />

        <ul className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
          {certificates.map((c, i) => (
            <RevealItem key={c.slug} delay={(i % 3) * 0.06} className="h-full">
                <button
                  type="button"
                  onClick={() => open(c)}
                  aria-haspopup="dialog"
                  className="glass glass-hover fx-card flex h-full w-full flex-col overflow-hidden text-left"
                >
                  <span className="relative block aspect-[4/3] w-full border-b border-white/10">
                    <CertImage cert={c} sizes="(min-width: 1024px) 360px, 50vw" />
                  </span>
                  <span className="flex flex-1 flex-col p-3 sm:p-5">
                    <span className="text-[11px] font-semibold tracking-[0.18em] text-muted uppercase">
                      <Text value={c.year} />
                    </span>
                    <span className="mt-1 text-sm font-bold text-white sm:text-base">{c.title}</span>
                    <span className="mt-1 text-xs font-semibold text-accent-cyan sm:text-sm">{c.issuer}</span>
                  </span>
                </button>
            </RevealItem>
          ))}
        </ul>
      </Container>

      {/* Native <dialog>: focus trap, Escape to close, and inert background for free. */}
      <dialog
        ref={dialogRef}
        aria-labelledby="cert-dialog-title"
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
        onClose={() => setSelected(null)}
        className="m-auto w-[min(92vw,44rem)] rounded-2xl border border-white/10 bg-ink-900 p-0 text-white backdrop:bg-black/70 backdrop:backdrop-blur-sm"
      >
        {selected && (
          <div>
            <div className="relative aspect-[4/3] w-full border-b border-white/10 bg-ink-950">
              <CertImage cert={selected} sizes="(min-width: 768px) 704px, 92vw" />
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                autoFocus
                className="absolute top-3 right-3 grid size-9 place-items-center rounded-full border border-white/15 bg-ink-950/80 text-white hover:bg-ink-950"
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>
            <div className="p-6">
              <p className="text-xs font-semibold tracking-[0.18em] text-muted uppercase">
                <Text value={selected.year} />
              </p>
              <h3 id="cert-dialog-title" className="mt-1 text-xl font-bold">
                {selected.title}
              </h3>
              <p className="mt-1 text-sm font-semibold text-accent-cyan">{selected.issuer}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                <Text value={selected.description} />
              </p>
              <a
                href={isTodo(selected.credentialUrl) ? profile.linkedin.certificationsUrl : selected.credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-accent-gradient px-5 py-2.5 text-sm font-semibold text-white"
              >
                {isTodo(selected.credentialUrl) ? "View on LinkedIn" : "View Credential"}
                <ExternalLink className="size-4" aria-hidden />
              </a>
            </div>
          </div>
        )}
      </dialog>
    </section>
  );
}
