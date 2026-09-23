import { siteConfig } from "@/lib/site";
import { ArrowIcon } from "@/components/ui/ArrowIcon";

/**
 * GitHub / LinkedIn links from siteConfig. A social link with no URL renders
 * as muted text so the slot is visible but never points somewhere invented.
 */
export function SocialLinks({ className = "" }: { className?: string }) {
  const links = [
    { label: "GitHub", href: siteConfig.social.github },
    { label: "LinkedIn", href: siteConfig.social.linkedin },
  ];

  return (
    <ul className={`flex flex-wrap items-center gap-x-5 gap-y-1 ${className}`}>
      {links.map(({ label, href }) =>
        href ? (
          <li key={label}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="link inline-flex items-center gap-1"
            >
              {label}
              <ArrowIcon direction="out" />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </li>
        ) : (
          <li key={label}>
            <span className="text-muted/70" title={`${label} profile coming soon`}>
              {label}
              <span className="sr-only"> (coming soon)</span>
            </span>
          </li>
        ),
      )}
    </ul>
  );
}
