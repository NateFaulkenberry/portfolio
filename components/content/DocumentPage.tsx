import { SmartLink } from "@/components/ui/SmartLink";
import type { Page } from "@/lib/content";
import { phoneHref, siteConfig } from "@/lib/site";
import { Markdown } from "./Markdown";

/**
 * Formal document layout for Markdown pages such as the resume and CV.
 * Optional frontmatter: `updated` (date shown in the margin) and `pdf`
 * (e.g. /downloads/cv.pdf; `npm run build` generates that file from the page).
 */
export function DocumentPage({ label, page }: { label: string; page: Page }) {
  const updated = typeof page.data.updated === "string" || page.data.updated instanceof Date
    ? new Date(page.data.updated).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        timeZone: "UTC",
      })
    : undefined;
  const pdf = typeof page.data.pdf === "string" ? page.data.pdf : undefined;

  return (
    <article className="grid gap-8 lg:grid-cols-12">
      <aside className="no-print flex flex-row flex-wrap gap-x-8 gap-y-3 text-sm lg:col-span-3 lg:flex-col lg:pt-4">
        <p className="eyebrow">{label}</p>
        {updated && (
          <p className="text-muted">
            <span className="sr-only">Last updated </span>
            Updated {updated}
          </p>
        )}
        {pdf && (
          <SmartLink href={pdf} className="link w-fit text-ink">
            Download PDF
          </SmartLink>
        )}
      </aside>
      <PrintHeader />
      <Markdown html={page.html} variant="document" className="max-w-[44rem] lg:col-span-9" />
    </article>
  );
}

/**
 * Name, contact details and profile links for the printed/PDF copy. The site
 * header is hidden in print, and the Markdown documents leave the name out.
 */
function PrintHeader() {
  const { email, phone, location, social, portfolioUrl } = siteConfig;
  const linkedin: string = social.linkedin; // widen: empty until the URL is set
  const bare = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "");

  const contact = [
    { label: location },
    { label: email, href: `mailto:${email}` },
    { label: phone, href: phoneHref(phone) },
  ];
  const profiles = [
    { label: bare(social.github), href: social.github },
    linkedin ? { label: bare(linkedin), href: linkedin } : undefined,
    { label: bare(portfolioUrl), href: portfolioUrl },
  ].filter((link) => link !== undefined);

  return (
    <header className="hidden print:block">
      <p className="font-serif text-[22pt] leading-tight">{siteConfig.name}</p>
      <PrintLine items={contact} className="mt-1" />
      <PrintLine items={profiles} />
    </header>
  );
}

function PrintLine({ items, className = "" }: { items: { label: string; href?: string }[]; className?: string }) {
  return (
    <p className={`text-[9.5pt] ${className}`}>
      {items.map((item, i) => (
        <span key={item.label}>
          {i > 0 && " · "}
          {item.href ? <a href={item.href}>{item.label}</a> : item.label}
        </span>
      ))}
    </p>
  );
}
