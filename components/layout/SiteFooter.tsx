import { SocialLinks } from "@/components/navigation/SocialLinks";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { Container } from "@/components/ui/Container";
import { phoneHref, siteConfig } from "@/lib/site";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="no-print mt-24 sm:mt-32">
      <Container>
        <div className="grid gap-8 border-t border-ink pt-8 pb-10 sm:grid-cols-12">
          <h2 className="eyebrow sm:col-span-3">Contact</h2>
          <address className="flex flex-col gap-1.5 text-ink not-italic sm:col-span-5">
            <a href={`mailto:${siteConfig.email}`} className="link w-fit font-serif text-xl sm:text-2xl">
              {siteConfig.email}
            </a>
            <a href={phoneHref(siteConfig.phone)} className="link w-fit text-ink-soft">
              {siteConfig.phone}
            </a>
            <span className="text-muted">{siteConfig.location}</span>
          </address>
          <SocialLinks className="text-sm text-ink-soft sm:col-span-4 sm:justify-end sm:self-start" />
        </div>
        <div className="flex items-center justify-between border-t border-rule py-5 text-xs text-muted">
          <p>
            © {year} {siteConfig.name}
          </p>
          <a href="#top" className="inline-flex items-center gap-1.5 transition-colors hover:text-ink">
            Back to top <ArrowIcon direction="up" />
          </a>
        </div>
      </Container>
    </footer>
  );
}
