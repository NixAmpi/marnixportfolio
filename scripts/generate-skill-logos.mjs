// Writes the white keycap logos to public/skills/*.svg.
// Run: node scripts/generate-skill-logos.mjs
// Brand marks come from simple-icons; skills without a brand mark use a lucide icon.
// To use your own logo instead, just replace the file (white artwork on a transparent background).
import { mkdirSync, writeFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import * as si from "simple-icons";
import { Code2, Database, Network, ShieldCheck, Layers, Workflow, Webhook } from "lucide-react";

const out = new URL("../public/skills/", import.meta.url);
mkdirSync(out, { recursive: true });

const brand = {
  python: si.siPython,
  javascript: si.siJavascript,
  typescript: si.siTypescript,
  html: si.siHtml5,
  css: si.siCss,
  react: si.siReact,
  tailwind: si.siTailwindcss,
  flutter: si.siFlutter,
  nodejs: si.siNodedotjs,
  mysql: si.siMysql,
  firebase: si.siFirebase,
  git: si.siGit,
  figma: si.siFigma,
  linux: si.siLinux,
  cisco: si.siCisco,
};

const lucide = {
  sql: Database,
  "rest-apis": Webhook,
  vscode: Code2,
  networking: Network,
  cybersecurity: ShieldCheck,
  "ui-ux": Layers,
  agile: Workflow,
};

for (const [file, icon] of Object.entries(brand)) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 24 24"><title>${icon.title}</title><path fill="#ffffff" d="${icon.path}"/></svg>\n`;
  writeFileSync(new URL(`${file}.svg`, out), svg);
}

for (const [file, Icon] of Object.entries(lucide)) {
  const svg = renderToStaticMarkup(createElement(Icon, { size: 256, color: "#ffffff", strokeWidth: 2 }));
  writeFileSync(new URL(`${file}.svg`, out), svg + "\n"); // lucide already includes xmlns
}

console.log(`wrote ${Object.keys(brand).length + Object.keys(lucide).length} logos to public/skills/`);
