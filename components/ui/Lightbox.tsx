"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/** Images taller than this (height ÷ width) scroll at full width instead of shrinking to fit. */
const TALL_RATIO = 1.6;

/**
 * Makes its children (a framed thumbnail) open the full image in a full-screen
 * overlay. Uses a native <dialog>, so Escape, focus trapping and the top layer
 * come from the browser. The full image only loads once the overlay opens.
 */
export function Lightbox({ src, alt, children }: { src: string; alt: string; children: ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [tall, setTall] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();

    // Keep the page behind the overlay from scrolling.
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`View larger: ${alt}`}
        className="block w-full cursor-zoom-in text-left"
      >
        {children}
      </button>

      <dialog
        ref={dialogRef}
        aria-label={alt}
        onClose={() => setOpen(false)}
        className="m-0 h-dvh max-h-none w-screen max-w-none bg-transparent p-0 backdrop:bg-black/85"
      >
        {open && (
          <div
            className="flex h-full w-full cursor-zoom-out overflow-auto p-4 sm:p-10"
            onClick={(event) => {
              // Clicking the backdrop area closes; clicking the image itself does not.
              if (event.target === event.currentTarget) setOpen(false);
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- full-size original, no optimizer in a static export */}
            <img
              src={src}
              alt={alt}
              onLoad={(event) => {
                const img = event.currentTarget;
                setTall(img.naturalHeight / img.naturalWidth > TALL_RATIO);
              }}
              className={`m-auto block h-auto cursor-default animate-enter ${
                tall ? "w-full max-w-5xl" : "max-h-full max-w-full object-contain"
              }`}
            />
          </div>
        )}
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close"
          className="fixed top-3 right-3 flex size-11 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80 sm:top-5 sm:right-5"
        >
          <svg viewBox="0 0 16 16" aria-hidden="true" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 3l10 10M13 3L3 13" />
          </svg>
        </button>
      </dialog>
    </>
  );
}
