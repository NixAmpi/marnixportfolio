/**
 * Film-grain overlay. The noise texture is static; the layer is shifted in steps with
 * `transform` (compositor-only), so it never repaints. Reduced motion freezes it.
 */
export function Grain() {
  return <div aria-hidden className="grain pointer-events-none fixed -inset-1/2 z-[65] opacity-[0.03]" />;
}
