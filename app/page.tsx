import Link from "next/link";
import { Markdown } from "@/components/content/Markdown";
import { FeaturedWork } from "@/components/projects/FeaturedWork";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { getCollection, getFeatured, getPage, getSection, type CollectionName } from "@/lib/content";
import { siteConfig } from "@/lib/site";

const disciplines: CollectionName[] = ["code", "design", "audio"];

export default async function HomePage() {
  const [home, featured, sections] = await Promise.all([
    getPage("home"),
    getFeatured(),
    Promise.all(
      disciplines.map(async (name) => ({
        name,
        section: await getSection(name),
        count: (await getCollection(name)).length,
      })),
    ),
  ]);

  return (
    <>
      <section aria-labelledby="intro-heading" className="grid gap-8 pb-20 sm:pb-28 lg:grid-cols-12">
        <p className="eyebrow pt-3 lg:col-span-3">Introduction</p>
        <div className="lg:col-span-9">
          {/* <h1
            id="intro-heading"
            className="font-serif text-5xl leading-[1.02] tracking-[-0.025em] text-ink sm:text-7xl lg:text-[5.25rem]"
          >
            {siteConfig.name}
          </h1> */}
          <p className="mt-5 max-w-2xl font-serif text-2xl leading-snug text-ink-soft italic sm:text-3xl">
            {siteConfig.tagline}
          </p>
          {home.html && <Markdown html={home.html} className="mt-8 max-w-2xl" />}
          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm">
            <Link href="/resume" className="link inline-flex items-center gap-1.5 text-ink">
              Read my resume <ArrowIcon />
            </Link>
            <a href={`mailto:${siteConfig.email}`} className="link inline-flex items-center gap-1.5 text-ink">
              Get in touch <ArrowIcon />
            </a>
          </div>
        </div>
      </section>

      {featured.length > 0 && (
        <section aria-labelledby="selected-heading" className="border-t border-ink pt-6 pb-20 sm:pb-28">
          <div className="mb-10 flex items-baseline justify-between gap-4">
            <h2 id="selected-heading" className="eyebrow">
              Selected work
            </h2>
            <span className="eyebrow">{String(featured.length).padStart(2, "0")}</span>
          </div>
          <FeaturedWork entries={featured} />
        </section>
      )}

      <section aria-labelledby="index-heading" className="border-t border-ink pt-6">
        <h2 id="index-heading" className="eyebrow mb-4">
          Index
        </h2>
        <ul>
          {sections.map(({ name, section, count }) => (
            <li key={name} className="border-b border-rule last:border-b-0">
              <Link
                href={`/${name}`}
                className="group grid grid-cols-[1fr_auto] items-baseline gap-x-6 gap-y-1 py-6 sm:grid-cols-12"
              >
                <span className="font-serif text-3xl text-ink transition-colors group-hover:text-accent sm:col-span-5 sm:text-4xl">
                  {section.title}
                </span>
                <span className="col-span-2 row-start-2 text-ink-soft sm:col-span-5 sm:row-start-auto">
                  {section.description}
                </span>
                <span className="eyebrow col-start-2 row-start-1 flex items-center justify-end gap-3 sm:col-span-2 sm:col-start-auto sm:row-start-auto">
                  {count} {count === 1 ? "entry" : "entries"}
                  <ArrowIcon className="text-ink transition-transform duration-300 motion-safe:group-hover:translate-x-1" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
