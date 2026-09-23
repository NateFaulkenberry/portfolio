import Link from "next/link";
import { ArrowIcon } from "@/components/ui/ArrowIcon";

export default function NotFound() {
  return (
    <section className="grid gap-6 py-10 lg:grid-cols-12">
      <p className="eyebrow pt-3 lg:col-span-3">Error 404</p>
      <div className="lg:col-span-9">
        <h1 className="font-serif text-5xl tracking-[-0.02em] text-ink sm:text-6xl">Page not found.</h1>
        <p className="mt-5 max-w-xl text-lg text-ink-soft">
          The page you were looking for doesn&apos;t exist or has moved.
        </p>
        <Link href="/" className="link mt-8 inline-flex items-center gap-1.5 text-ink">
          Return home <ArrowIcon />
        </Link>
      </div>
    </section>
  );
}
