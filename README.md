# Marnix. — Portfolio

Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · Framer Motion · React Three Fiber + Rapier.

## Run

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # static export into ./out (index.html + one page per project)
npx serve out   # preview the exported site
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

- `public/lanyard/card.png` — 3D ID card face (800×1125). Replace with your own design/photo, same size,
  then run `node scripts/optimize-card.mjs` to rebuild the WebP copies the site actually loads.
- `public/lanyard/card-back.png`, `band.png` — card back and strap texture.
- `public/skills/*.svg` — white keycap logos for the Skills keyboard (`node scripts/generate-skill-logos.mjs` restores them).
- `public/sounds/keyboard/<thocky|clacky|clicky>/*.wav` — keyboard switch sounds (synthesized, CC0).
  See `public/sounds/CREDITS.md` for the file list and how to drop in your own recordings;
  `node scripts/generate-key-sounds.mjs` restores the defaults.
- `public/cv/Marnix_Ampeloquio_CV.pdf` — the Download CV button.
- `public/projects/<slug>/…` — screenshots; set `thumbnail` / `gallery` in `data/projects.ts`.
- `public/certificates/…` — badge images; set `image` in `data/certificates.ts`.

## Deploy (Cloudflare Pages)

The site is a fully static export (`output: "export"` in `next.config.ts`), so no server is needed.

1. Push the repo to GitHub and create a Cloudflare Pages project from it.
2. Build command: `npm run build` · Build output directory: `out`.
3. Environment variables (Settings → Variables):
   - `NODE_VERSION` = `22`
   - `NEXT_PUBLIC_SITE_URL` = your final URL (e.g. `https://marnix.pages.dev`) so link previews use the right address.
   - `NEXT_PUBLIC_FORMSPREE_ID` = your Formspree form ID, to have the contact form send messages directly
     (without it, the form opens the visitor's email app).

`public/_headers` sets Cloudflare response headers (Open Graph image content type, long caching for hashed assets).

The previous static site is kept in `legacy/index.html`.
