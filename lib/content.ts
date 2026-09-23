import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { cache } from "react";
import { renderMarkdown } from "./markdown";

/**
 * Content loading.
 *
 * The Git repository is the CMS: every page and portfolio entry is a Markdown
 * file under /content with optional YAML frontmatter. Everything is read at
 * build time; invalid content throws, which fails the build instead of
 * silently shipping a broken page.
 */

const CONTENT_DIR = path.join(process.cwd(), "content");
const PUBLIC_DIR = path.join(process.cwd(), "public");

export class ContentError extends Error {
  constructor(file: string, message: string) {
    super(`[content] ${path.relative(process.cwd(), file)}: ${message}`);
    this.name = "ContentError";
  }
}

type Frontmatter = Record<string, unknown>;

export interface Link {
  label: string;
  url: string;
}

interface Document {
  file: string;
  slug: string;
  data: Frontmatter;
  html: string;
}

async function readDocument(file: string): Promise<Document> {
  if (!fs.existsSync(file)) {
    throw new ContentError(file, "file not found");
  }
  const { data, content } = matter(fs.readFileSync(file, "utf8"));
  return {
    file,
    slug: path.basename(file, path.extname(file)),
    data,
    html: content.trim() ? await renderMarkdown(content) : "",
  };
}

/* -------------------------------------------------------------------------- */
/* Frontmatter field readers                                                   */
/* -------------------------------------------------------------------------- */

function optionalString(doc: Document, key: string): string | undefined {
  const value = doc.data[key];
  if (value === undefined || value === null || value === "") return undefined;
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value);
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  throw new ContentError(doc.file, `"${key}" must be text`);
}

function requiredString(doc: Document, key: string): string {
  const value = optionalString(doc, key);
  if (!value) throw new ContentError(doc.file, `missing required field "${key}"`);
  return value;
}

function optionalUrl(doc: Document, key: string): string | undefined {
  const value = optionalString(doc, key);
  if (value && !/^(https?:\/\/|mailto:|\/)/.test(value)) {
    throw new ContentError(
      doc.file,
      `"${key}" must be an absolute URL (https://…) or a site path (/…), got "${value}"`,
    );
  }
  return value;
}

function optionalBoolean(doc: Document, key: string): boolean {
  const value = doc.data[key];
  if (value === undefined || value === null) return false;
  if (typeof value === "boolean") return value;
  throw new ContentError(doc.file, `"${key}" must be true or false`);
}

function optionalNumber(doc: Document, key: string): number | undefined {
  const value = doc.data[key];
  if (value === undefined || value === null) return undefined;
  if (typeof value === "number") return value;
  throw new ContentError(doc.file, `"${key}" must be a number`);
}

function stringList(doc: Document, key: string): string[] {
  const value = doc.data[key];
  if (value === undefined || value === null) return [];
  if (typeof value === "string") return value.split(",").map((s) => s.trim()).filter(Boolean);
  if (Array.isArray(value)) return value.map(String);
  throw new ContentError(doc.file, `"${key}" must be a list`);
}

function linkList(doc: Document, key: string): Link[] {
  const value = doc.data[key];
  if (value === undefined || value === null) return [];
  if (!Array.isArray(value)) throw new ContentError(doc.file, `"${key}" must be a list`);
  return value.map((item) => {
    const link = item as Partial<Link>;
    if (typeof link?.label !== "string" || typeof link?.url !== "string") {
      throw new ContentError(doc.file, `each "${key}" entry needs a "label" and a "url"`);
    }
    return { label: link.label, url: link.url };
  });
}

/**
 * Resolve an image path from frontmatter. Returns the path if the file exists
 * in /public (or is an external URL), otherwise null so the UI can render a
 * placeholder. This lets content reference images before they are added.
 */
export function resolveImage(src: string | undefined): string | null {
  if (!src) return null;
  if (/^https?:\/\//.test(src)) return src;
  const normalized = src.startsWith("/") ? src : `/${src}`;
  return fs.existsSync(path.join(PUBLIC_DIR, normalized)) ? normalized : null;
}

/** True when a root-relative file exists in /public. */
export function publicFileExists(src: string): boolean {
  return fs.existsSync(path.join(PUBLIC_DIR, src));
}

/* -------------------------------------------------------------------------- */
/* Standalone pages (home.md, resume.md, cv.md, <section>/_index.md)          */
/* -------------------------------------------------------------------------- */

export interface Page {
  title?: string;
  description?: string;
  html: string;
  data: Frontmatter;
}

export const getPage = cache(async (name: string): Promise<Page> => {
  const doc = await readDocument(path.join(CONTENT_DIR, `${name}.md`));
  return {
    title: optionalString(doc, "title"),
    description: optionalString(doc, "description"),
    html: doc.html,
    data: doc.data,
  };
});

/* -------------------------------------------------------------------------- */
/* Collections (content/code, content/design, content/audio)                  */
/* -------------------------------------------------------------------------- */

interface BaseEntry {
  slug: string;
  title: string;
  description: string;
  /** Resolved image path, or null when the file has not been added yet. */
  image: string | null;
  featured: boolean;
  order?: number;
  year?: string;
  tags: string[];
  links: Link[];
  html: string;
}

export interface CodeProject extends BaseEntry {
  github?: string;
  url?: string;
}

export interface DesignProject extends BaseEntry {
  url?: string;
  category?: string;
}

export interface AudioProject extends BaseEntry {
  artist: string;
  role?: string;
  url?: string;
}

function baseEntry(doc: Document): BaseEntry {
  return {
    slug: doc.slug,
    title: requiredString(doc, "title"),
    description: requiredString(doc, "description"),
    image: resolveImage(optionalString(doc, "image")),
    featured: optionalBoolean(doc, "featured"),
    order: optionalNumber(doc, "order"),
    year: optionalString(doc, "year"),
    tags: stringList(doc, "tags"),
    links: linkList(doc, "links"),
    html: doc.html,
  };
}

const parsers = {
  code: (doc: Document): CodeProject => ({
    ...baseEntry(doc),
    github: optionalUrl(doc, "github"),
    url: optionalUrl(doc, "url"),
  }),
  design: (doc: Document): DesignProject => ({
    ...baseEntry(doc),
    url: optionalUrl(doc, "url"),
    category: optionalString(doc, "category"),
  }),
  audio: (doc: Document): AudioProject => ({
    ...baseEntry(doc),
    artist: requiredString(doc, "artist"),
    role: optionalString(doc, "role"),
    url: optionalUrl(doc, "url"),
  }),
};

export type CollectionName = keyof typeof parsers;
type EntryOf<C extends CollectionName> = ReturnType<(typeof parsers)[C]>;

/**
 * Sort order: explicit `order` (ascending) first, then featured entries,
 * then most recent `year`, then title.
 */
function compareEntries(a: BaseEntry, b: BaseEntry): number {
  return (
    (a.order ?? Infinity) - (b.order ?? Infinity) ||
    Number(b.featured) - Number(a.featured) ||
    (b.year ?? "").localeCompare(a.year ?? "") ||
    a.title.localeCompare(b.title)
  );
}

/**
 * Load every Markdown file in content/<name>/. Files starting with "_" are
 * skipped (content/<name>/_index.md holds the section introduction).
 */
export const getCollection = cache(
  async <C extends CollectionName>(name: C): Promise<EntryOf<C>[]> => {
    const dir = path.join(CONTENT_DIR, name);
    if (!fs.existsSync(dir)) throw new ContentError(dir, "collection directory not found");

    const files = fs
      .readdirSync(dir)
      .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
      .map((f) => path.join(dir, f));

    const docs = await Promise.all(files.map(readDocument));
    const entries = docs.map((doc) => parsers[name](doc) as EntryOf<C>);
    return entries.sort(compareEntries);
  },
);

export interface Section {
  title: string;
  description?: string;
  html: string;
}

/** Section introduction from content/<name>/_index.md. */
export async function getSection(name: CollectionName): Promise<Section> {
  const page = await getPage(`${name}/_index`);
  if (!page.title) {
    throw new ContentError(
      path.join(CONTENT_DIR, name, "_index.md"),
      'missing required field "title"',
    );
  }
  return { title: page.title, description: page.description, html: page.html };
}

export interface FeaturedEntry {
  section: CollectionName;
  slug: string;
  title: string;
  description: string;
  image: string | null;
  meta?: string;
}

/** Entries marked `featured: true` across all collections, for the home page. */
export async function getFeatured(): Promise<FeaturedEntry[]> {
  const [code, design, audio] = await Promise.all([
    getCollection("code"),
    getCollection("design"),
    getCollection("audio"),
  ]);
  const pick = (section: CollectionName, entry: BaseEntry, meta?: string): FeaturedEntry => ({
    section,
    slug: entry.slug,
    title: entry.title,
    description: entry.description,
    image: entry.image,
    meta,
  });
  return [
    ...code.filter((e) => e.featured).map((e) => pick("code", e, e.tags.slice(0, 2).join(" · "))),
    ...design.filter((e) => e.featured).map((e) => pick("design", e, e.category)),
    ...audio.filter((e) => e.featured).map((e) => pick("audio", e, e.artist)),
  ];
}
