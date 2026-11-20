import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { FramedShot, screenshotBackdrop, type FrameKind } from "@/components/ScreenshotFrame";

/**
 * Screenshot if one exists, otherwise a branded placeholder so the grid never collapses.
 * With a `frame`, the screenshot is shown whole inside a phone or browser frame instead of cropped.
 */
export function ProjectMedia({
  src,
  alt,
  sizes,
  label = "TODO: add screenshot",
  preload = false,
  frame,
}: {
  src?: string;
  alt: string;
  sizes: string;
  label?: string;
  preload?: boolean;
  frame?: FrameKind;
}) {
  if (src && frame) {
    return (
      // Anchored to the bottom and nudged down so the frame "rises" from the edge and clears the corner badge.
      <div className={`absolute inset-0 flex items-end justify-center ${screenshotBackdrop}`}>
        <div
          className={`relative translate-y-4 overflow-hidden border-white/15 bg-white shadow-2xl shadow-black/60 transition duration-500 group-hover:translate-y-2 group-hover:scale-105 ${
            frame === "phone" ? "aspect-[640/1303] h-[86%] rounded-[1.1rem] border-[3px]" : "w-[86%] rounded-lg border"
          }`}
        >
          <FramedShot kind={frame} src={src} alt={alt} sizes={frame === "phone" ? "(min-width: 1024px) 220px, 40vw" : sizes} preload={preload} />
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
        className="object-cover transition duration-500 group-hover:scale-105"
      />
    );
  }
  return (
    <div className={`absolute inset-0 grid place-items-center ${screenshotBackdrop}`}>
      <div className="flex flex-col items-center gap-2 text-center text-slate-400">
        <ImageIcon className="size-8 opacity-70" aria-hidden />
        <span className="text-xs">{label}</span>
      </div>
    </div>
  );
}
