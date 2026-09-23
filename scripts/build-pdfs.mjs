#!/usr/bin/env node
/**
 * Post-build PDF generation for the resume and CV.
 *
 * Serves the static export in ./out, prints each document page with headless
 * Chrome (using the site's print stylesheet), and writes the PDF to the path in
 * that Markdown file's `pdf` frontmatter — into both ./public (so the file is
 * kept in the repository) and ./out (so this build ships it).
 *
 * Needs a Chrome or Chromium install. Set CHROME_PATH to use a specific one;
 * otherwise the usual macOS and Linux locations are tried.
 * Run after `npm run build` with the same BASE_PATH environment variable.
 */
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import matter from "gray-matter";
import { chromium } from "playwright-core";

const OUT = path.resolve("out");
const PUBLIC = path.resolve("public");
const basePath = (process.env.BASE_PATH ?? "").replace(/\/+$/, "");

/** Markdown documents to print, and the route each is rendered at. */
const documents = [
  { file: "content/resume.md", route: "/resume/" },
  { file: "content/cv.md", route: "/cv/" },
];

const chromeCandidates = [
  process.env.CHROME_PATH,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/usr/bin/google-chrome",
  "/usr/bin/google-chrome-stable",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
].filter(Boolean);

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".json": "application/json",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".txt": "text/plain",
};

function fail(message) {
  console.error(`✗ PDF generation failed: ${message}`);
  process.exit(1);
}

if (!fs.existsSync(OUT)) fail("./out not found — run `next build` first.");

const jobs = documents
  .map(({ file, route }) => ({ route, pdf: matter(fs.readFileSync(file, "utf8")).data.pdf }))
  .filter((job) => typeof job.pdf === "string" && job.pdf.startsWith("/"));
if (!jobs.length) {
  console.log("No `pdf` frontmatter set on the resume or CV; skipping PDF generation.");
  process.exit(0);
}

const executablePath = chromeCandidates.find((p) => fs.existsSync(p));
if (!executablePath) {
  fail("no Chrome/Chromium found. Install one or set CHROME_PATH to its executable.");
}

/** Serve ./out the way GitHub Pages does, under the configured base path. */
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
  if (basePath && (p === basePath || p.startsWith(`${basePath}/`))) p = p.slice(basePath.length) || "/";
  let file = path.join(OUT, p);
  if (!file.startsWith(OUT)) return res.writeHead(403).end();
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
  if (!fs.existsSync(file)) return res.writeHead(404).end();
  res.writeHead(200, { "Content-Type": contentTypes[path.extname(file)] ?? "application/octet-stream" });
  fs.createReadStream(file).pipe(res);
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const origin = `http://127.0.0.1:${server.address().port}`;

const browser = await chromium.launch({ executablePath });
try {
  const page = await browser.newPage({ colorScheme: "light" });
  for (const { route, pdf } of jobs) {
    const response = await page.goto(`${origin}${basePath}${route}`, { waitUntil: "networkidle" });
    if (!response?.ok()) fail(`${route} returned ${response?.status()}`);
    await page.evaluate(() => document.fonts.ready);

    const bytes = await page.pdf({ format: "Letter", printBackground: true, preferCSSPageSize: true });
    for (const root of [PUBLIC, OUT]) {
      const target = path.join(root, pdf);
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, bytes);
    }
    console.log(`✓ ${route} → public${pdf} (${Math.round(bytes.length / 1024)} KB)`);
  }
} finally {
  await browser.close();
  server.close();
}
