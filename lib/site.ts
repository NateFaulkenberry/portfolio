/**
 * Central site configuration.
 *
 * Every piece of personal/contact information used on the site comes from here.
 * Change a value once and it updates everywhere (header, footer, metadata).
 */
export const siteConfig = {
  name: "Nate Faulkenberry",
  title: "Nate Faulkenberry's Portfolio",
  tagline: "Software engineer, creative thinker, and music lover.",
  description:
    "The portfolio of Nate Faulkenberry — software, design, and audio work.",
  location: "Glastonbury, CT",
  email: "nate.faulkenberry@gmail.com",
  phone: "(860) 710-0897",

  /**
   * Profile photo, relative to /public. Drop an image at this path and it
   * replaces the placeholder automatically on the next build.
   */
  photo: "/images/profile/nate.jpg",
  /**
   * Which part of the photo stays visible when it is cropped to the frame
   * (CSS object-position): "center top", "center 20%", "center", etc.
   */
  photoPosition: "center top",

  /** Public address of this site, linked from the resume/CV PDF header. */
  portfolioUrl: "https://natefaulkenberry.github.io/portfolio",

  social: {
    github: "https://github.com/NateFaulkenberry",
    /** Leave empty until you have the URL; the link renders as a placeholder. */
    linkedin: "https://www.linkedin.com/in/nate-faulkenberry-08705543a/",
  },
} as const;

export const navItems = [
  { href: "/resume", label: "Resume" },
  { href: "/cv", label: "CV" },
  { href: "/code", label: "Code" },
  { href: "/design", label: "Design" },
  { href: "/audio", label: "Audio" },
] as const;

/** "(860) 710-0897" → "tel:+18607100897" */
export function phoneHref(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return `tel:+${digits.length === 10 ? `1${digits}` : digits}`;
}

/** Base path the site is served from ("" locally, "/repo" on project Pages sites). */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * Prefix a root-relative asset path ("/images/x.jpg") with the base path.
 * next/link handles this for routes; raw asset URLs (images, downloads) need it.
 * External URLs are returned unchanged.
 */
export function assetUrl(path: string): string {
  if (!path.startsWith("/") || path.startsWith("//")) return path;
  return `${basePath}${path}`;
}
