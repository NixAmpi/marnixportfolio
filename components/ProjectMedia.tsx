import Image from "next/image";
import { ImageIcon } from "lucide-react";

const backdrop =
  "absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(124,92,255,0.35),transparent_50%),radial-gradient(circle_at_80%_85%,rgba(34,211,238,0.22),transparent_50%),linear-gradient(150deg,#141634,#0a0b1e)]";

/**
 * Screenshot if one exists, otherwise a branded placeholder so the grid never collapses.
 * `phone` shows a tall mobile screenshot whole, framed like a handset, instead of cropping it.
 */
export function ProjectMedia({
  src,
  alt,
  sizes,
  label = "TODO: add screenshot",
  preload = false,
  phone = false,
}: {
  src?: string;
  alt: string;
  sizes: string;
  label?: string;
  preload?: boolean;
  phone?: boolean;
}) {
  if (src && phone) {
    return (
      // Anchored to the bottom and nudged down so the phone "rises" from the edge and clears the corner badge.
      <div className={`${backdrop} flex items-end justify-center`}>
        <div className="relative aspect-[640/1303] h-[86%] translate-y-4 overflow-hidden rounded-[1.1rem] border-[3px] border-white/15 bg-white shadow-2xl shadow-black/60 transition duration-500 group-hover:translate-y-2">

          <Image
            src={src}
            alt={alt}
            fill
            sizes="(min-width: 1024px) 220px, 40vw"
            loading={preload ? "eager" : undefined}
            fetchPriority={preload ? "high" : undefined}
            className="object-cover object-top"
          />
        </div>
      </div>
    );
  }
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        loading={preload ? "eager" : undefined}
        fetchPriority={preload ? "high" : undefined}
        className="object-cover transition duration-500 group-hover:scale-[1.03]"
      />
    );
  }
  return (
    <div className={`${backdrop} grid place-items-center`}>
      <div className="flex flex-col items-center gap-2 text-center text-slate-400">
        <ImageIcon className="size-8 opacity-70" aria-hidden />
        <span className="text-xs">{label}</span>
      </div>
    </div>
  );
}
