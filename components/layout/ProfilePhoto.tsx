import Image from "next/image";
import { publicFileExists } from "@/lib/content";
import { assetUrl, siteConfig } from "@/lib/site";

/**
 * Portrait from siteConfig.photo. Until that file exists in /public, renders
 * a framed monogram placeholder instead of a broken image.
 */
export function ProfilePhoto({ className = "" }: { className?: string }) {
  const hasPhoto = publicFileExists(siteConfig.photo);
  const initials = siteConfig.name
    .split(" ")
    .map((part) => part[0])
    .join("");

  return (
    <div
      className={`relative aspect-[4/5] shrink-0 overflow-hidden border border-rule bg-surface ${className}`}
    >
      {hasPhoto ? (
        <Image
          src={assetUrl(siteConfig.photo)}
          alt={`Portrait of ${siteConfig.name}`}
          fill
          sizes="112px"
          priority
          className="object-cover"
          style={{ objectPosition: siteConfig.photoPosition }}
        />
      ) : (
        <div
          role="img"
          aria-label="Professional photo placeholder"
          className="flex size-full flex-col items-center justify-center gap-1 text-muted"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, transparent 0 7px, color-mix(in oklab, currentColor 9%, transparent) 7px 8px)",
          }}
        >
          <span className="font-serif text-3xl text-ink/80 italic">{initials}</span>
          <span className="font-mono text-[0.5rem] tracking-[0.18em] uppercase">Photo</span>
        </div>
      )}
    </div>
  );
}
