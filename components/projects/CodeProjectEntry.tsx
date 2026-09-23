import { Markdown } from "@/components/content/Markdown";
import { Media } from "@/components/ui/Media";
import type { CodeProject } from "@/lib/content";
import { EntryLinks } from "./EntryLinks";
import { TagList } from "./TagList";

/** A code project laid out as an editorial row: image beside the write-up. */
export function CodeProjectEntry({ project, index }: { project: CodeProject; index: number }) {
  return (
    <article id={project.slug} className="group grid gap-6 border-t border-rule py-10 sm:py-14 lg:grid-cols-12 lg:gap-10">
      <div className="lg:col-span-5">
        <Media src={project.image} alt={project.title} variant="code" priority={index === 0} zoomable />
      </div>
      <div className="flex flex-col gap-5 lg:col-span-7">
        <div className="flex items-baseline justify-between gap-4">
          <span className="eyebrow">{String(index + 1).padStart(2, "0")}</span>
          {project.year && <span className="eyebrow">{project.year}</span>}
        </div>
        <h2 className="font-serif text-3xl leading-tight tracking-[-0.01em] text-ink sm:text-[2.1rem]">
          {project.title}
        </h2>
        <p className="text-lg leading-relaxed text-ink-soft">{project.description}</p>
        {project.html && <Markdown html={project.html} className="text-base" />}
        <TagList tags={project.tags} />
        <EntryLinks
          links={[
            project.github ? { label: "Source on GitHub", url: project.github } : undefined,
            project.url ? { label: "Live project", url: project.url } : undefined,
            ...project.links,
          ]}
        />
      </div>
    </article>
  );
}
