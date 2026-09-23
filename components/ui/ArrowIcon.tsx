/** Small arrow glyph. "out" marks links that leave the site. */
export function ArrowIcon({
  direction = "right",
  className = "",
}: {
  direction?: "right" | "out" | "up";
  className?: string;
}) {
  const rotate = { right: "", out: "-rotate-45", up: "-rotate-90" }[direction];
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      className={`inline-block size-[0.8em] shrink-0 ${rotate} ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M2 8h11M9 4l4 4-4 4" />
    </svg>
  );
}
