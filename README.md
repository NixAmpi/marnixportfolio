# Marnix. — Portfolio

Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · Framer Motion · React Three Fiber + Rapier.

## Run

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
npm run lint
```

## Editing content

All content lives in `data/` — sections render from these files:

| File | What |
| --- | --- |
| `data/profile.ts` | name, role, bio, links, CV path, education, focus areas, stats, highlights |
| `data/skills.ts` | skills + filter categories (empty categories are hidden) |
| `data/projects.ts` | project cards and `/projects/[slug]` detail pages |
| `data/experience.ts` | journey timeline |
| `data/certificates.ts` | certificate cards + modal |

Any string starting with `TODO` renders as a dashed amber placeholder — search the repo for `TODO` to find what's left.

## Assets

- `public/lanyard/card.png` — 3D ID card face (800×1125). Replace with your own design/photo, same size.
- `public/lanyard/card-back.png`, `band.png` — card back and strap texture.
- `public/cv/Marnix_Ampeloquio_CV.pdf` — the Download CV button.
- `public/projects/<slug>/…` — screenshots; set `thumbnail` / `gallery` in `data/projects.ts`.
- `public/certificates/…` — badge images; set `image` in `data/certificates.ts`.

## Deploy (Vercel)

Push to GitHub, import the repo in Vercel (framework auto-detected, no settings needed).
Optionally set `NEXT_PUBLIC_SITE_URL` to your custom domain for correct Open Graph URLs.

The previous static site is kept in `legacy/index.html`.
