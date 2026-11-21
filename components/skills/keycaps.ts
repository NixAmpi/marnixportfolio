/** Shared keycap helpers for the 3D keyboard and the flat fallback grid. */

/** Relative luminance (WCAG) of a #rrggbb colour. */
function luminance(hex: string): number {
  const n = parseInt(hex.slice(1), 16);
  const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
}

/**
 * Logo/legend colour for a keycap: white on dark caps, near-black on light ones
 * (yellow JavaScript, Linux, Firebase…) where white would be unreadable.
 */
export function inkFor(color: string): string {
  return luminance(color) > 0.4 ? "#10121f" : "#ffffff";
}
