import { Markdown } from "@/components/content/Markdown";
import { Media } from "@/components/ui/Media";
import type { AudioProject } from "@/lib/content";
import { EntryLinks } from "./EntryLinks";

/** A discography entry: square artwork with credits beneath. */
export function AudioProjectCard({ project, index }: { project: AudioProject; index: number }) {
  return (
    <article id={project.slug} className="group flex flex-col">
      <Media
        src={project.image}
        alt={`${project.title} — ${project.artist}`}
        variant="audio"
        ratio="square"
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        priority={index < 3}
        zoomable
      />
      <div className="mt-5 flex flex-col gap-1">
        <h2 className="font-serif text-2xl leading-tight text-ink">{project.title}</h2>
        <p className="text-ink-soft">{project.artist}</p>
      </div>
      <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 border-t border-rule pt-3 text-sm">
        {project.role && (
          <>
            <dt className="eyebrow leading-5">Role</dt>
            <dd className="text-ink-soft">{project.role}</dd>
          </>
        )}
        {project.year && (
          <>
            <dt className="eyebrow leading-5">Year</dt>
            <dd className="text-ink-soft">{project.year}</dd>
          </>
        )}
      </dl>
      <p className="mt-4 text-[0.95rem] leading-relaxed text-ink-soft">{project.description}</p>
      {project.html && <Markdown html={project.html} className="mt-3 text-[0.95rem]" />}
      <div className="mt-4">
        <EntryLinks
          links={[project.url ? { label: "Listen", url: project.url } : undefined, ...project.links]}
        />
      </div>
    </article>
  );
}
