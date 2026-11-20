import Link from "next/link";

export default function NotFound() {
  return (
    <section className="grid min-h-[70svh] place-items-center px-4 pt-16 text-center">
      <div>
        <p className="text-xs font-semibold tracking-[0.3em] text-eyebrow uppercase">404</p>
        <h1 className="mt-3 text-4xl font-extrabold text-white">Page not found</h1>
        <Link href="/" className="mt-6 inline-block rounded-full bg-accent-gradient px-5 py-3 text-sm font-semibold text-white">
          Back home
        </Link>
      </div>
    </section>
  );
}
