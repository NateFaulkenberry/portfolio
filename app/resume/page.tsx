import type { Metadata } from "next";
import { DocumentPage } from "@/components/content/DocumentPage";
import { getPage } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("resume");
  return { title: page.title ?? "Resume", description: page.description };
}

/** Rendered from content/resume.md. */
export default async function ResumePage() {
  return <DocumentPage label="Resume" page={await getPage("resume")} />;
}
