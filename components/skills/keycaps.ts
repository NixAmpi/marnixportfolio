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

let ctx: AudioContext | null = null;

/** A short, soft mechanical "thock", synthesised (no audio file). Call from a user gesture. */
export function playThock() {
  try {
    ctx ??= new AudioContext();
    if (ctx.state === "suspended") void ctx.resume();
    const t = ctx.currentTime;
    const pitch = 0.92 + Math.random() * 0.16; // slight variation, like real switches

    // Body: a quick low sine drop.
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(150 * pitch, t);
    osc.frequency.exponentialRampToValueAtTime(55 * pitch, t + 0.09);
    const body = ctx.createGain();
    body.gain.setValueAtTime(0.0001, t);
    body.gain.exponentialRampToValueAtTime(0.35, t + 0.004);
    body.gain.exponentialRampToValueAtTime(0.0001, t + 0.13);
    osc.connect(body).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.15);

    // Click: a burst of filtered noise.
    const len = Math.floor(ctx.sampleRate * 0.03);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len) ** 3;
    const noise = ctx.createBufferSource();
    noise.buffer = buf;
    const band = ctx.createBiquadFilter();
    band.type = "bandpass";
    band.frequency.value = 2200 * pitch;
    band.Q.value = 0.8;
    const click = ctx.createGain();
    click.gain.value = 0.18;
    noise.connect(band).connect(click).connect(ctx.destination);
    noise.start(t);
  } catch {
    // Audio unavailable — silently skip.
  }
}
