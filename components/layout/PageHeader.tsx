import type { ReactNode } from "react";
import { Markdown } from "@/components/content/Markdown";

/** Title block at the top of each section page. */
export function PageHeader({
  eyebrow,
  title,
  description,
  html,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  /** Optional rendered Markdown introduction. */
  html?: string;
  children?: ReactNode;
}) {
  return (
    <header className="grid gap-6 pb-12 sm:pb-16 lg:grid-cols-12">
      <p className="eyebrow pt-2 lg:col-span-3">{eyebrow}</p>
      <div className="lg:col-span-9">
        <h1 className="max-w-3xl font-serif text-4xl leading-[1.08] tracking-[-0.02em] text-balance text-ink sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        {description && (
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-pretty text-ink-soft">
            {description}
          </p>
        )}
        {html && <Markdown html={html} className="mt-5 max-w-2xl" />}
        {children}
      </div>
    </header>
  );
}
