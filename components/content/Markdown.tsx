/**
 * Renders Markdown that was converted to HTML at build time by lib/markdown.ts.
 * Content comes from files in this repository, and raw HTML inside Markdown is
 * stripped during rendering, so injecting the result is safe.
 */
export function Markdown({
  html,
  variant = "default",
  className = "",
}: {
  html: string;
  variant?: "default" | "document";
  className?: string;
}) {
  const classes = ["markdown", variant === "document" && "markdown-document", className]
    .filter(Boolean)
    .join(" ");
  return <div className={classes} dangerouslySetInnerHTML={{ __html: html }} />;
}
