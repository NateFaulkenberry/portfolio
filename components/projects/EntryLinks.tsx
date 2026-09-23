import { SmartLink } from "@/components/ui/SmartLink";
import type { Link } from "@/lib/content";

/** Row of outbound links for a portfolio entry; renders nothing if empty. */
export function EntryLinks({ links }: { links: (Link | false | undefined)[] }) {
  const items = links.filter((l): l is Link => Boolean(l && l.url));
  if (items.length === 0) return null;
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink">
      {items.map((link) => (
        <li key={`${link.label}-${link.url}`}>
          <SmartLink href={link.url}>{link.label}</SmartLink>
        </li>
      ))}
    </ul>
  );
}
