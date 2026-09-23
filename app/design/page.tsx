import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { DesignProjectCard } from "@/components/projects/DesignProjectCard";
import { getCollection, getSection } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const section = await getSection("design");
  return { title: section.title, description: section.description };
}

/** Rendered from content/design/*.md (intro from content/design/_index.md). */
export default async function DesignPage() {
  const [section, projects] = await Promise.all([getSection("design"), getCollection("design")]);
  return (
    <>
      <PageHeader eyebrow="Design" title={section.title} description={section.description} html={section.html} />
      <div className="grid gap-x-10 gap-y-16 border-t border-rule pt-12 md:grid-cols-2 lg:gap-x-14">
        {projects.map((project, index) => (
          <DesignProjectCard key={project.slug} project={project} index={index} />
        ))}
      </div>
    </>
  );
}
