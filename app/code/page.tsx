import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { CodeProjectEntry } from "@/components/projects/CodeProjectEntry";
import { getCollection, getSection } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const section = await getSection("code");
  return { title: section.title, description: section.description };
}

/** Rendered from content/code/*.md (intro from content/code/_index.md). */
export default async function CodePage() {
  const [section, projects] = await Promise.all([getSection("code"), getCollection("code")]);
  return (
    <>
      <PageHeader eyebrow="Code" title={section.title} description={section.description} html={section.html} />
      <div className="border-b border-rule">
        {projects.map((project, index) => (
          <CodeProjectEntry key={project.slug} project={project} index={index} />
        ))}
      </div>
    </>
  );
}
