import Link from "next/link";
import { Media } from "@/components/ui/Media";
import type { FeaturedEntry } from "@/lib/content";

const sectionLabels = { code: "Code", design: "Design", audio: "Audio" } as const;

/** Grid of featured entries across all collections, linking to their section. */
export function FeaturedWork({ entries }: { entries: FeaturedEntry[] }) {
  return (
    <ul className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
      {entries.map((entry) => (
        <li key={`${entry.section}-${entry.slug}`}>
          <Link href={`/${entry.section}/#${entry.slug}`} className="group flex flex-col gap-4">
            <Media
              src={entry.image}
              alt={entry.title}
              variant={entry.section}
              fit={entry.section === "audio" ? "contain" : "cover"}
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            />
            <div className="flex items-baseline justify-between gap-3">
              <span className="eyebrow">{sectionLabels[entry.section]}</span>
              {entry.meta && <span className="truncate text-xs text-muted">{entry.meta}</span>}
            </div>
            <div>
              <h3 className="font-serif text-2xl leading-tight text-ink transition-colors group-hover:text-accent">
                {entry.title}
              </h3>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-soft">{entry.description}</p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
