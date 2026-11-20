import { isTodo } from "@/data/types";

export function Container({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <div className={`mx-auto w-full max-w-6xl px-4 sm:px-6 ${className}`}>{children}</div>;
}

export { SectionHeading } from "@/components/SectionHeading";

export function Chip({ children }: { children: React.ReactNode }) {
  const todo = typeof children === "string" && isTodo(children);
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${
        todo ? "border-dashed border-amber-300/40 bg-amber-300/5 text-amber-200/90" : "border-white/10 bg-white/[0.04] text-slate-200"
      }`}
    >
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
