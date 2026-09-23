import Link from "next/link";
import { NavLinks } from "@/components/navigation/NavLinks";
import { SocialLinks } from "@/components/navigation/SocialLinks";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/lib/site";
import { ProfilePhoto } from "./ProfilePhoto";

export function SiteHeader() {
  return (
    <header className="no-print">
      <Container>
        <div className="flex items-start justify-between gap-6 pt-8 pb-6 sm:pt-12 sm:pb-8">
          <div className="min-w-0">
            <Link
              href="/"
              className="font-serif text-[1.65rem] leading-[1.1] tracking-[-0.015em] text-ink transition-colors hover:text-accent sm:text-4xl"
            >
              {siteConfig.title}
            </Link>
            <div className="mt-4 flex flex-col gap-2 text-sm text-ink-soft sm:flex-row sm:items-center sm:gap-5">
              <p className="flex items-center gap-2">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
                {siteConfig.location}
              </p>
              <span aria-hidden="true" className="hidden h-3 w-px bg-rule sm:block" />
              <SocialLinks />
            </div>
          </div>
          <ProfilePhoto className="w-16 sm:w-24" />
        </div>

        <nav aria-label="Primary" className="border-y border-rule">
          <NavLinks />
        </nav>
      </Container>
    </header>
  );
}
