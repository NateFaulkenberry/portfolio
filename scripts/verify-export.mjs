#!/usr/bin/env node
/**
 * Post-build verification of the static export in ./out.
 *
 *  1. Every route exists as a static HTML file.
 *  2. Markdown pages rendered and every collection entry appears on its page.
 *  3. Every internal link, image, script, stylesheet, and font URL resolves to
 *     a file in ./out — under the configured BASE_PATH, so a GitHub Pages
 *     project-site build is checked exactly as it will be served.
 *
 * Exits non-zero on any failure. Run after `npm run build` with the same
 * BASE_PATH environment variable.
 */
import fs from "node:fs";
import path from "node:path";

const OUT = path.resolve("out");
const CONTENT = path.resolve("content");
const basePath = (process.env.BASE_PATH ?? "").replace(/\/+$/, "");
const errors = [];
const fail = (msg) => errors.push(msg);

if (!fs.existsSync(OUT)) {
  console.error("✗ ./out not found — run `npm run build` first.");
  process.exit(1);
}

/* 1. Routes ---------------------------------------------------------------- */
const routes = ["/", "/resume/", "/cv/", "/code/", "/design/", "/audio/"];
const htmlFor = (route) => path.join(OUT, route, "index.html");
for (const route of routes) {
  if (!fs.existsSync(htmlFor(route))) fail(`missing route ${route}`);
}
for (const file of ["404.html", "robots.txt", "sitemap.xml"]) {
  if (!fs.existsSync(path.join(OUT, file))) fail(`missing ${file}`);
}

/* 2. Content --------------------------------------------------------------- */
const read = (route) => (fs.existsSync(htmlFor(route)) ? fs.readFileSync(htmlFor(route), "utf8") : "");

for (const route of ["/resume/", "/cv/"]) {
  // The document may open with any element (the resume and CV start with a tagline, not a heading).
  if (!/class="markdown markdown-document[^"]*"><[a-z]/.test(read(route))) {
    fail(`${route}: rendered Markdown document not found`);
  }
}
for (const name of ["code", "design", "audio"]) {
  const html = read(`/${name}/`);
  const slugs = fs
    .readdirSync(path.join(CONTENT, name))
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
    .map((f) => f.replace(/\.md$/, ""));
  for (const slug of slugs) {
    if (!html.includes(`<article id="${slug}"`)) fail(`/${name}/: entry "${slug}" not rendered`);
  }
}

/* 3. Internal URLs ---------------------------------------------------------- */
function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

function resolves(url) {
  let p = decodeURIComponent(url.split(/[?#]/)[0]);
  if (basePath) {
    if (p !== basePath && !p.startsWith(`${basePath}/`)) return false;
    p = p.slice(basePath.length) || "/";
  }
  const target = path.join(OUT, p);
  if (p.endsWith("/")) return fs.existsSync(path.join(target, "index.html"));
  return fs.existsSync(target) || fs.existsSync(path.join(target, "index.html"));
}

const files = walk(OUT);
let checked = 0;
for (const file of files.filter((f) => /\.(html|css)$/.test(f))) {
  const text = fs.readFileSync(file, "utf8");
  const urls = [];
  if (file.endsWith(".html")) {
    for (const m of text.matchAll(/\s(?:href|src)="([^"]+)"/g)) urls.push(m[1]);
    for (const m of text.matchAll(/\ssrcSet="([^"]+)"/gi)) {
      urls.push(...m[1].split(",").map((s) => s.trim().split(/\s+/)[0]));
    }
  } else {
    for (const m of text.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/g)) urls.push(m[1]);
  }
  for (const raw of urls) {
    const url = raw.replace(/&amp;/g, "&");
    if (!url.startsWith("/") || url.startsWith("//")) continue; // external, anchor, data:
    checked++;
    if (!resolves(url)) fail(`${path.relative(OUT, file)}: broken internal URL ${url}`);
  }
}

/* Report ------------------------------------------------------------------- */
const unique = [...new Set(errors)];
if (unique.length) {
  console.error(`✗ Static export verification failed (${unique.length} problem(s)):`);
  for (const e of unique) console.error(`  - ${e}`);
  process.exit(1);
}
console.log(
  `✓ Static export verified: ${routes.length} routes, ${checked} internal URLs, base path "${basePath || "/"}".`,
);
