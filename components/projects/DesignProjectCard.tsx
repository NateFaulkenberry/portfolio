import { Markdown } from "@/components/content/Markdown";
import { Media } from "@/components/ui/Media";
import type { DesignProject } from "@/lib/content";
import { EntryLinks } from "./EntryLinks";
import { TagList } from "./TagList";

/** A design project with a large screenshot, suited to a two-column gallery. */
export function DesignProjectCard({ project, index }: { project: DesignProject; index: number }) {
  return (
    <article id={project.slug} className="group flex flex-col gap-5">
      <Media
        src={project.image}
        alt={project.title}
        variant="design"
        ratio="wide"
        sizes="(min-width: 768px) 50vw, 100vw"
        priority={index < 2}
        zoomable
      />
      <div className="flex items-baseline justify-between gap-4 border-b border-rule pb-3">
        <span className="eyebrow">{project.category ?? "Design"}</span>
        {project.year && <span className="eyebrow">{project.year}</span>}
      </div>
      <h2 className="font-serif text-2xl leading-tight text-ink sm:text-[1.75rem]">{project.title}</h2>
      <p className="leading-relaxed text-ink-soft">{project.description}</p>
      {project.html && <Markdown html={project.html} className="text-[0.95rem]" />}
      <TagList tags={project.tags} />
      <EntryLinks
        links={[project.url ? { label: "Visit site", url: project.url } : undefined, ...project.links]}
      />
    </article>
  );
}
