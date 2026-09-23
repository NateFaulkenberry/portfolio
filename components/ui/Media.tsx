import Image from "next/image";
import { assetUrl } from "@/lib/site";
import { Lightbox } from "./Lightbox";
import { MediaPlaceholder, type PlaceholderVariant } from "./MediaPlaceholder";

const ratios = {
  square: "aspect-square",
  landscape: "aspect-[4/3]",
  wide: "aspect-[16/10]",
} as const;

/**
 * Framed project image. Renders the real image when one exists in /public,
 * otherwise a placeholder, so pages look complete before assets are added.
 * With `zoomable`, clicking the image opens it full-screen.
 */
export function Media({
  src,
  alt,
  variant,
  ratio = "landscape",
  fit = "cover",
  sizes = "(min-width: 1024px) 50vw, 100vw",
  priority = false,
  zoomable = false,
}: {
  src: string | null;
  alt: string;
  variant: PlaceholderVariant;
  ratio?: keyof typeof ratios;
  /** "cover" fills the frame, cropping from the bottom; "contain" shows the whole image (e.g. album art in a non-square frame). */
  fit?: "cover" | "contain";
  sizes?: string;
  priority?: boolean;
  zoomable?: boolean;
}) {
  const frame = (
    <div className={`relative overflow-hidden border border-rule bg-surface ${ratios[ratio]}`}>
      {src ? (
        <Image
          src={assetUrl(src)}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={`${fit === "contain" ? "object-contain" : "object-cover object-top origin-top"} transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.02]`}
        />
      ) : (
        <MediaPlaceholder variant={variant} label={alt} />
      )}
    </div>
  );

  return zoomable && src ? (
    <Lightbox src={assetUrl(src)} alt={alt}>
      {frame}
    </Lightbox>
  ) : (
    frame
  );
}
