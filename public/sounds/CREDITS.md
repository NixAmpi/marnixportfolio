# Sound credits

## Keyboard switch sounds — `keyboard/<profile>/*.wav`

All 54 files are **original, procedurally synthesized** sounds made for this site by
`scripts/generate-key-sounds.mjs` (no recordings or third-party samples are used).

License: **CC0 1.0 Universal (public domain dedication)** —
https://creativecommons.org/publicdomain/zero/1.0/

### Layout

```
keyboard/
  thocky/   deep, creamy (default)
  clacky/   bright, hollow plastic
  clicky/   blue-switch style click
    key-down-{1,2,3}.wav     normal keys, bottom-out
    key-up-{1,2,3}.wav       normal keys, return
    large-down-{1,2,3}.wav   Enter / Shift
    large-up-{1,2,3}.wav
    space-down-{1,2,3}.wav   spacebar (with stabilizer rattle)
    space-up-{1,2,3}.wav
```

### Using your own recordings

Replace any file with your own clip, keeping the same name. Keep each clip short
(down ≈ 100–300 ms, up ≈ 60–180 ms) with the sound starting at time 0 — trim any silence
at the start, or the key will feel laggy. WAV works best (MP3 adds start padding).
If you use someone else's recording, add its author, source URL and license here.
To restore the defaults, run `node scripts/generate-key-sounds.mjs`.
