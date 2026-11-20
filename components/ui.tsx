import { isTodo } from "@/data/types";

export function Container({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <div className={`mx-auto w-full max-w-6xl px-4 sm:px-6 ${className}`}>{children}</div>;
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mx-auto mb-12 max-w-2xl text-center sm:mb-14">
      <p className="mb-3 text-xs font-semibold tracking-[0.3em] text-eyebrow uppercase">{eyebrow}</p>
      <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">{title}</h2>
      {subtitle && <p className="mt-4 text-base text-muted">{subtitle}</p>}
    </div>
  );
}

export function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-slate-200">
      {children}
    </span>
  );
}

/** Renders text, or a dashed placeholder when the value is a TODO. */
export function Text({ value, className = "" }: { value: string; className?: string }) {
  if (isTodo(value)) {
    return (
      <span className="inline-block rounded-md border border-dashed border-amber-300/40 bg-amber-300/5 px-2 py-0.5 text-sm text-amber-200/90">
        {value}
      </span>
    );
  }
  return <span className={className}>{value}</span>;
}
