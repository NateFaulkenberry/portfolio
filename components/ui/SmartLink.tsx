import Link from "next/link";
import type { ReactNode } from "react";
import { assetUrl } from "@/lib/site";
import { ArrowIcon } from "./ArrowIcon";

/**
 * Link that does the right thing for any URL found in content:
 * internal routes use next/link, files under /public get the base path,
 * external URLs open in a new tab with an "out" arrow.
 */
export function SmartLink({
  href,
  children,
  className = "link",
  arrow = true,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  arrow?: boolean;
}) {
  const isExternal = /^https?:\/\//.test(href);
  const isFile = href.startsWith("/") && /\.[a-z0-9]+$/i.test(href);

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
        {arrow && <ArrowIcon direction="out" className="ml-1 align-[-0.05em]" />}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }
  if (isFile || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return (
      <a href={assetUrl(href)} className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
      {arrow && <ArrowIcon className="ml-1 align-[-0.05em]" />}
    </Link>
  );
}
