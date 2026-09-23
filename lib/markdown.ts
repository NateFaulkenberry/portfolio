import type { Element, Root } from "hast";
import type { PhrasingContent, Root as MdastRoot, Text as MdastText } from "mdast";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { visit } from "unist-util-visit";
import { assetUrl } from "./site";

/**
 * Rewrites root-relative links and images inside Markdown ("/downloads/cv.pdf")
 * so they keep working when the site is served from a GitHub Pages sub-path.
 * External links are marked to open safely in a new tab.
 */
function rehypeSiteLinks() {
  return (tree: Root) => {
    visit(tree, "element", (node: Element) => {
      const attr = node.tagName === "a" ? "href" : node.tagName === "img" ? "src" : null;
      if (!attr) return;
      const value = node.properties[attr];
      if (typeof value !== "string") return;

      node.properties[attr] = assetUrl(value);
      if (node.tagName === "a" && /^https?:\/\//.test(value)) {
        node.properties.target = "_blank";
        node.properties.rel = ["noopener", "noreferrer"];
      }
      if (node.tagName === "img") {
        node.properties.loading = "lazy";
      }
    });
  };
}

/**
 * Keeps single line breaks as line breaks. The resume and CV rely on this for
 * "**Role** · Location" / "**Dates**" and "**Skill group**" / "items" pairs,
 * which standard Markdown would run together into one line.
 */
function remarkLineBreaks() {
  return (tree: MdastRoot) => {
    visit(tree, "text", (node: MdastText, index, parent) => {
      if (!parent || index === undefined || !node.value.includes("\n")) return;

      const parts: PhrasingContent[] = [];
      node.value.split("\n").forEach((line, i) => {
        if (i > 0) parts.push({ type: "break" });
        if (line) parts.push({ type: "text", value: line });
      });
      parent.children.splice(index, 1, ...parts);
      return index + parts.length;
    });
  };
}

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm) // tables, strikethrough, autolinks, task lists
  .use(remarkLineBreaks)
  .use(remarkRehype) // raw HTML in Markdown is intentionally dropped
  .use(rehypeSlug) // heading ids for deep links
  .use(rehypeSiteLinks)
  .use(rehypeStringify);

/** Render a Markdown string to an HTML string at build time. */
export async function renderMarkdown(markdown: string): Promise<string> {
  const file = await processor.process(markdown);
  return String(file);
}
