// Makes web-ready WebP copies of the lanyard ID card images.
// The site is a static export (no image optimizer), so run this after replacing
// public/lanyard/card.png or card-back.png:   node scripts/optimize-card.mjs
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const file = (name) => fileURLToPath(new URL(`../public/lanyard/${name}`, import.meta.url));
const jobs = [
  ["card.png", "card.webp", 800],
  ["card.png", "card-480.webp", 480],
  ["card-back.png", "card-back.webp", 800],
];

for (const [src, out, width] of jobs) {
  const info = await sharp(file(src)).resize({ width }).webp({ quality: 86 }).toFile(file(out));
  console.log(`${out}: ${info.width}×${info.height}, ${Math.round(info.size / 1024)} KB`);
}
