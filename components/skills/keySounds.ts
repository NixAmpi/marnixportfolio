/**
 * Low-latency keyboard sounds via the Web Audio API.
 * Samples live in /public/sounds/keyboard/<profile>/<kind>-<phase>-<n>.wav and are
 * fetched + decoded only once sound is switched on (muted visitors download nothing).
 */

export type SoundProfile = "thocky" | "clacky" | "clicky";
export type KeyKind = "key" | "large" | "space";
export type KeyPhase = "down" | "up";

export const SOUND_PROFILES: { id: SoundProfile; label: string }[] = [
  { id: "thocky", label: "Thocky" },
  { id: "clacky", label: "Clacky" },
  { id: "clicky", label: "Clicky" },
];

const VARIATIONS = 3;
const KINDS: KeyKind[] = ["key", "large", "space"];
const PHASES: KeyPhase[] = ["down", "up"];

let ctx: AudioContext | null = null;
const buffers = new Map<string, AudioBuffer[]>(); // `${profile}/${kind}-${phase}` → variations
const loading = new Map<SoundProfile, Promise<void>>();
const lastVariation = new Map<string, number>();

function context(): AudioContext | null {
  try {
    ctx ??= new AudioContext({ latencyHint: "interactive" });
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

/** Fetches and decodes every sample of a profile (once). Call from a user gesture. */
export function preloadProfile(profile: SoundProfile): Promise<void> {
  const ac = context();
  if (!ac) return Promise.resolve();
  let p = loading.get(profile);
  if (!p) {
    p = Promise.all(
      KINDS.flatMap((kind) =>
        PHASES.map(async (phase) => {
          const list = await Promise.all(
            Array.from({ length: VARIATIONS }, async (_, i) => {
              const res = await fetch(`/sounds/keyboard/${profile}/${kind}-${phase}-${i + 1}.wav`);
              return ac.decodeAudioData(await res.arrayBuffer());
            }),
          );
          buffers.set(`${profile}/${kind}-${phase}`, list);
        }),
      ),
    ).then(
      () => undefined,
      () => {
        loading.delete(profile); // allow a retry later
      },
    );
    loading.set(profile, p);
  }
  return p;
}

/**
 * Plays one switch sound. `pan` is -1 (left) … 1 (right) from the key's position.
 * Each play varies pitch ±5% and volume ±10% and avoids repeating the last sample.
 */
export function playKey(profile: SoundProfile, kind: KeyKind, phase: KeyPhase, pan = 0) {
  const ac = context();
  const list = buffers.get(`${profile}/${kind}-${phase}`);
  if (!ac || !list?.length) {
    void preloadProfile(profile); // not ready yet — this press stays silent
    return;
  }
  const slot = `${profile}/${kind}-${phase}`;
  let i = Math.floor(Math.random() * list.length);
  if (list.length > 1 && i === lastVariation.get(slot)) i = (i + 1) % list.length;
  lastVariation.set(slot, i);

  const src = ac.createBufferSource();
  src.buffer = list[i];
  src.playbackRate.value = 1 + (Math.random() * 2 - 1) * 0.05;
  const gain = ac.createGain();
  gain.gain.value = (phase === "down" ? 0.55 : 0.4) * (1 + (Math.random() * 2 - 1) * 0.1);
  const panner = ac.createStereoPanner();
  panner.pan.value = Math.max(-1, Math.min(1, pan)) * 0.7;
  src.connect(gain).connect(panner).connect(ac.destination);
  src.start();
}

/** A light haptic tap where supported (Android Chrome; a no-op elsewhere). */
export function haptic() {
  try {
    navigator.vibrate?.(8);
  } catch {
    // ignore
  }
}
