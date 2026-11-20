import Image from "next/image";
import { ImageIcon } from "lucide-react";

/** Screenshot if one exists, otherwise a branded placeholder so the grid never collapses. */
export function ProjectMedia({
  src,
  alt,
  sizes,
  label = "TODO: add screenshot",
  preload = false,
}: {
  src?: string;
  alt: string;
  sizes: string;
  label?: string;
  preload?: boolean;
}) {
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        fetchPriority={preload ? "high" : undefined}
        className="object-cover transition duration-500 group-hover:scale-[1.03]"
      />
    );
  }
  return (
    <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_25%_20%,rgba(124,92,255,0.35),transparent_50%),radial-gradient(circle_at_80%_85%,rgba(34,211,238,0.22),transparent_50%),linear-gradient(150deg,#141634,#0a0b1e)]">
      <div className="flex flex-col items-center gap-2 text-center text-slate-400">
        <ImageIcon className="size-8 opacity-70" aria-hidden />
        <span className="text-xs">{label}</span>
      </div>
    </div>
  );
}
