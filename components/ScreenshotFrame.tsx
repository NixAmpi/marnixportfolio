import Image from "next/image";

export type FrameKind = "phone" | "browser";

/** Shared gradient behind framed screenshots. */
export const screenshotBackdrop =
  "bg-[radial-gradient(circle_at_25%_20%,rgba(124,92,255,0.35),transparent_50%),radial-gradient(circle_at_80%_85%,rgba(34,211,238,0.22),transparent_50%),linear-gradient(150deg,#141634,#0a0b1e)]";

/** Size and shape of each frame; position is left to the caller. */
export const frameBox: Record<FrameKind, string> = {
  phone: "aspect-[640/1303] h-[88%] rounded-[1.1rem] border-[3px]",
  browser: "w-[80%] rounded-lg border",
};

/** A screenshot inside a handset or browser-window frame. */
export function FramedShot({
  kind,
  src,
  alt,
  sizes,
  preload = false,
}: {
  kind: FrameKind;
  src: string;
  alt: string;
  sizes: string;
  preload?: boolean;
}) {
  const image = (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      loading={preload ? "eager" : undefined}
      fetchPriority={preload ? "high" : undefined}
      className="object-cover object-top"
    />
  );
  if (kind === "phone") return image;
  return (
    <>
      <span aria-hidden className="flex h-[clamp(10px,1.8vw,20px)] items-center gap-[0.35em] bg-[#e9e9ef] px-[0.7em] text-[clamp(8px,1.3vw,14px)]">
        <span className="size-[0.55em] rounded-full bg-[#ff5f57]" />
        <span className="size-[0.55em] rounded-full bg-[#febc2e]" />
        <span className="size-[0.55em] rounded-full bg-[#28c840]" />
      </span>
      <span className="relative block aspect-[1600/731]">{image}</span>
    </>
  );
}
