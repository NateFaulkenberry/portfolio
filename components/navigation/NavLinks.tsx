"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "@/lib/site";

/**
 * Primary navigation. A client component because it needs the
 * current pathname to mark the active section.
 */
export function NavLinks() {
  const pathname = usePathname().replace(/\/+$/, "") || "/";

  return (
    <ul className="flex flex-wrap gap-x-6 gap-y-2 sm:gap-x-9">
      {navItems.map((item, index) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`group relative inline-flex items-baseline gap-2 py-3 text-[0.95rem] transition-colors duration-200 ${
                active ? "text-ink" : "text-muted hover:text-ink"
              }`}
            >
              <span
                aria-hidden="true"
                className={`hidden font-mono text-[0.65rem] sm:inline ${active ? "text-accent" : "text-muted/70"}`}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              {item.label}
              <span
                aria-hidden="true"
                className={`absolute inset-x-0 -bottom-px h-px origin-left bg-accent transition-transform duration-300 ${
                  active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100 group-hover:bg-rule"
                }`}
              />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
