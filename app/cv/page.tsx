import type { Metadata } from "next";
import { DocumentPage } from "@/components/content/DocumentPage";
import { getPage } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("cv");
  return { title: page.title ?? "Curriculum Vitae", description: page.description };
}

/** Rendered from content/cv.md. */
export default async function CvPage() {
  return <DocumentPage label="Curriculum Vitae" page={await getPage("cv")} />;
}
