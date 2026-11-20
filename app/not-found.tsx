import Link from "next/link";
import { ArrowLeft, FolderOpen } from "lucide-react";

export default function NotFound() {
  return (
    <section className="relative isolate grid min-h-[80svh] place-items-center overflow-hidden px-4 pt-16 text-center">
      <div aria-hidden className="pointer-events-none absolute top-1/2 left-1/2 -z-10 size-[36rem] -translate-x-1/2 -translate-y-1/2">
        <div className="aurora size-full rounded-full bg-[radial-gradient(closest-side,rgba(124,92,255,0.25),rgba(34,211,238,0.08)_60%,transparent)] blur-2xl" />
      </div>
      <div className="hero-in">
        <p className="mb-3 inline-flex items-center gap-3 text-xs font-semibold tracking-[0.3em] text-eyebrow uppercase">
          <span aria-hidden className="eyebrow-line relative h-px w-8 overflow-hidden bg-gradient-to-r from-accent-violet to-accent-cyan" />
          Error 404
        </p>
        <p aria-hidden className="text-gradient text-8xl leading-none font-extrabold tracking-tighter sm:text-9xl">
          404
        </p>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">This page wandered off</h1>
        <p className="mx-auto mt-3 max-w-md text-muted">The link may be broken or the page may have moved. Let&apos;s get you back on track.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="btn-shine relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-accent-gradient px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-accent-violet/25 transition hover:-translate-y-0.5"
          >
            <ArrowLeft className="size-4" aria-hidden /> Back home
          </Link>
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-white/30"
          >
            <FolderOpen className="size-4" aria-hidden /> See my projects
          </Link>
        </div>
      </div>
    </section>
  );
}
