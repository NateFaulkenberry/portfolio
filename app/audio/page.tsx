import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { AudioProjectCard } from "@/components/projects/AudioProjectCard";
import { getCollection, getSection } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const section = await getSection("audio");
  return { title: section.title, description: section.description };
}

/** Rendered from content/audio/*.md (intro from content/audio/_index.md). */
export default async function AudioPage() {
  const [section, projects] = await Promise.all([getSection("audio"), getCollection("audio")]);
  return (
    <>
      <PageHeader eyebrow="Audio" title={section.title} description={section.description} html={section.html} />
      <div className="grid gap-x-8 gap-y-16 border-t border-rule pt-12 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, index) => (
          <AudioProjectCard key={project.slug} project={project} index={index} />
        ))}
      </div>
    </>
  );
}
