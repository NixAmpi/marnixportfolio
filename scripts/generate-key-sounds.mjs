// Synthesizes the 3D keyboard's switch sounds into public/sounds/keyboard/<profile>/.
// Run: node scripts/generate-key-sounds.mjs
//
// Each file is an original, procedurally generated sound (released CC0, see
// public/sounds/CREDITS.md). Model: a short contact transient + damped "body" modes
// for the keycap/plate/case, filtered noise for the impact, and — per profile —
// a click jacket (Clicky) or stabilizer rattle (spacebar).
//
// Output: 16-bit mono WAV @ 22.05 kHz. WAV (not MP3) on purpose: MP3 adds ~25–50 ms of
// encoder padding at the start, which would make every keystroke sound late.
import { mkdirSync, writeFileSync } from "node:fs";

const RATE = 22050;
const VARIATIONS = 3;
const root = new URL("../public/sounds/keyboard/", import.meta.url);

// Deterministic RNG so re-running the script reproduces the same files.
let seed = 1337;
const rand = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
const jitter = (amount) => 1 + (rand() * 2 - 1) * amount;

/** One-pole low-pass / high-pass and a simple resonant band-pass (RBJ biquad). */
function biquadBandpass(x, freq, q) {
  const w = (2 * Math.PI * freq) / RATE;
  const alpha = Math.sin(w) / (2 * q);
  const [b0, b1, b2] = [alpha, 0, -alpha];
  const [a0, a1, a2] = [1 + alpha, -2 * Math.cos(w), 1 - alpha];
  const y = new Float32Array(x.length);
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  for (let i = 0; i < x.length; i++) {
    const v = (b0 * x[i] + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2) / a0;
    x2 = x1; x1 = x[i]; y2 = y1; y1 = v; y[i] = v;
  }
  return y;
}
function lowpass(x, freq) {
  const a = Math.exp((-2 * Math.PI * freq) / RATE);
  const y = new Float32Array(x.length);
  let p = 0;
  for (let i = 0; i < x.length; i++) y[i] = p = (1 - a) * x[i] + a * p;
  return y;
}

/** Adds `src` into `dst` starting at `offsetSec`, scaled by `gain`. */
function mix(dst, src, offsetSec = 0, gain = 1) {
  const o = Math.round(offsetSec * RATE);
  for (let i = 0; i < src.length && o + i < dst.length; i++) dst[o + i] += src[i] * gain;
}

/** Damped sinusoid modes (the "body" of a keycap, plate or case). */
function modes(durSec, list) {
  const n = Math.round(durSec * RATE);
  const out = new Float32Array(n);
  for (const { f, decay, amp } of list) {
    const freq = f * jitter(0.04);
    const phase = rand() * Math.PI * 2;
    for (let i = 0; i < n; i++) {
      const t = i / RATE;
      out[i] += amp * Math.exp(-t / decay) * Math.sin(2 * Math.PI * freq * t + phase);
    }
  }
  return out;
}

/** Exponentially decaying noise burst, band-passed. */
function burst(durSec, decay, center, q, amp = 1) {
  const n = Math.round(durSec * RATE);
  const raw = new Float32Array(n);
  for (let i = 0; i < n; i++) raw[i] = (rand() * 2 - 1) * Math.exp(-i / RATE / decay);
  const f = biquadBandpass(raw, center * jitter(0.06), q);
  for (let i = 0; i < n; i++) f[i] *= amp;
  return f;
}

/**
 * Sound recipes. `down` = bottom-out (cap hits the plate), `up` = return (cap tops out).
 * kind: key (1u), large (Enter/Shift: bigger, lower, fuller), space (deepest + stabilizer rattle).
 */
const scale = { key: 1, large: 0.78, space: 0.6 };
const length = { key: 0.14, large: 0.2, space: 0.3 };

function synth(profile, kind, phase) {
  const k = scale[kind];
  const dur = phase === "down" ? length[kind] : length[kind] * 0.6;
  const out = new Float32Array(Math.round(dur * RATE));

  if (profile === "thocky") {
    // Deep, creamy: low body modes, dark impact, soft attack.
    if (phase === "down") {
      mix(out, modes(dur, [
        { f: 210 * k, decay: 0.032 / k, amp: 0.9 },
        { f: 380 * k, decay: 0.018, amp: 0.45 },
        { f: 820 * k, decay: 0.008, amp: 0.2 },
      ]));
      mix(out, lowpass(burst(0.03, 0.006, 1400 * k, 0.9, 1.1), 2200));
    } else {
      mix(out, modes(dur, [{ f: 330 * k, decay: 0.015, amp: 0.45 }, { f: 700 * k, decay: 0.007, amp: 0.2 }]));
      mix(out, burst(0.02, 0.004, 1800 * k, 1.2, 0.45));
    }
  } else if (profile === "clacky") {
    // Bright, hollow plastic: higher modes, sharper impact, shorter tail.
    if (phase === "down") {
      mix(out, modes(dur, [
        { f: 520 * k, decay: 0.02 / k, amp: 0.7 },
        { f: 1150 * k, decay: 0.012, amp: 0.55 },
        { f: 2300 * k, decay: 0.005, amp: 0.25 },
      ]));
      mix(out, burst(0.025, 0.004, 3200 * k, 1.1, 1.2));
    } else {
      mix(out, modes(dur, [{ f: 900 * k, decay: 0.01, amp: 0.45 }]));
      mix(out, burst(0.018, 0.003, 3600 * k, 1.4, 0.6));
    }
  } else {
    // Clicky (blue-switch style): a crisp click-jacket snap, then the bottom-out.
    if (phase === "down") {
      mix(out, burst(0.012, 0.0016, 5200, 3, 1.4)); // click
      mix(out, modes(dur, [
        { f: 430 * k, decay: 0.02 / k, amp: 0.55 },
        { f: 1000 * k, decay: 0.01, amp: 0.4 },
      ]), 0.006);
      mix(out, burst(0.02, 0.004, 2600 * k, 1.1, 0.8), 0.006);
    } else {
      mix(out, burst(0.01, 0.0014, 4600, 3, 1.0)); // second, softer click on release
      mix(out, modes(dur, [{ f: 820 * k, decay: 0.008, amp: 0.35 }]), 0.004);
    }
  }

  // Spacebar: stabilizer wire rattle — a few small metallic ticks after the impact.
  if (kind === "space") {
    const ticks = phase === "down" ? 3 : 2;
    let t = 0.012;
    for (let i = 0; i < ticks; i++) {
      t += 0.006 + rand() * 0.012;
      mix(out, burst(0.012, 0.0025, 3000 + rand() * 1500, 4, 0.35 / (i + 1)), t);
    }
  }

  // Short fade in/out, then normalise every file to the same peak.
  const fadeIn = Math.round(0.0008 * RATE);
  const fadeOut = Math.round(0.01 * RATE);
  for (let i = 0; i < fadeIn; i++) out[i] *= i / fadeIn;
  for (let i = 0; i < fadeOut; i++) out[out.length - 1 - i] *= i / fadeOut;
  let peak = 0;
  for (const v of out) peak = Math.max(peak, Math.abs(v));
  const target = phase === "down" ? 0.85 : 0.6;
  for (let i = 0; i < out.length; i++) out[i] = (out[i] / (peak || 1)) * target;
  return out;
}

function wav(samples) {
  const data = Buffer.alloc(samples.length * 2);
  samples.forEach((v, i) => data.writeInt16LE(Math.max(-32768, Math.min(32767, Math.round(v * 32767))), i * 2));
  const h = Buffer.alloc(44);
  h.write("RIFF", 0); h.writeUInt32LE(36 + data.length, 4); h.write("WAVE", 8);
  h.write("fmt ", 12); h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(1, 22);
  h.writeUInt32LE(RATE, 24); h.writeUInt32LE(RATE * 2, 28); h.writeUInt16LE(2, 32); h.writeUInt16LE(16, 34);
  h.write("data", 36); h.writeUInt32LE(data.length, 40);
  return Buffer.concat([h, data]);
}

let total = 0, files = 0;
for (const profile of ["thocky", "clacky", "clicky"]) {
  const dir = new URL(`${profile}/`, root);
  mkdirSync(dir, { recursive: true });
  for (const kind of ["key", "large", "space"]) {
    for (const phase of ["down", "up"]) {
      for (let v = 1; v <= VARIATIONS; v++) {
        const buf = wav(synth(profile, kind, phase));
        writeFileSync(new URL(`${kind}-${phase}-${v}.wav`, dir), buf);
        total += buf.length;
        files++;
      }
    }
  }
}
console.log(`wrote ${files} files, ${Math.round(total / 1024)} KB total, to public/sounds/keyboard/`);
