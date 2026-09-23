/**
 * Tasteful stand-in artwork shown until a real image is added to /public.
 * Pure CSS/SVG; the pattern varies deterministically with the label so a
 * page of placeholders doesn't look copy-pasted.
 */

export type PlaceholderVariant = "code" | "design" | "audio";

function hash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Deterministic pseudo-random sequence in [0, 1). */
function sequence(seed: number, count: number): number[] {
  const out: number[] = [];
  let s = seed || 1;
  for (let i = 0; i < count; i++) {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    out.push(s / 2 ** 32);
  }
  return out;
}

function CodeArt({ seed }: { seed: number }) {
  const rows = sequence(seed, 9);
  return (
    <div className="absolute inset-0 flex flex-col justify-center gap-[7%] px-[10%]">
      {rows.map((r, i) => (
        <div key={i} className="flex gap-[3%]" style={{ paddingLeft: `${Math.floor(r * 3) * 6}%` }}>
          <span className="h-[5px] rounded-full bg-muted/35" style={{ width: `${14 + r * 20}%` }} />
          <span
            className={`h-[5px] rounded-full ${i % 4 === 1 ? "bg-accent/60" : "bg-muted/20"}`}
            style={{ width: `${10 + ((r * 7) % 1) * 36}%` }}
          />
        </div>
      ))}
    </div>
  );
}

function DesignArt({ seed }: { seed: number }) {
  const [a, b] = sequence(seed, 2);
  return (
    <div className="absolute inset-x-[8%] top-[8%] bottom-[18%] flex flex-col border border-muted/25 bg-paper/60">
      <div className="flex items-center gap-1.5 border-b border-muted/20 px-3 py-2">
        {[0, 1, 2].map((i) => (
          <span key={i} className="size-1.5 rounded-full bg-muted/35" />
        ))}
      </div>
      <div className="flex flex-1 flex-col gap-[6%] p-[6%]">
        <span className="h-[8%] rounded-sm bg-muted/30" style={{ width: `${35 + a * 25}%` }} />
        <span className="h-[4%] w-[70%] rounded-sm bg-muted/15" />
        <div className="grid flex-1 grid-cols-3 gap-[4%]">
          <span className="col-span-2 bg-muted/12" />
          <span className={b > 0.5 ? "bg-accent/25" : "bg-muted/20"} />
        </div>
      </div>
    </div>
  );
}

function AudioArt({ seed }: { seed: number }) {
  const [a, b] = sequence(seed, 2);
  const grooves = Array.from({ length: 7 }, (_, i) => 18 + i * 4.2);
  return (
    <svg viewBox="0 0 100 100" className="absolute inset-0 size-full" aria-hidden="true">
      <g transform={`translate(${50 + (a - 0.5) * 16} ${50 + (b - 0.5) * 16})`}>
        {grooves.map((r) => (
          <circle key={r} r={r} fill="none" stroke="currentColor" strokeOpacity="0.18" strokeWidth="0.4" />
        ))}
        <circle r="13" className="fill-accent/70" />
        <circle r="1.6" className="fill-paper" />
      </g>
    </svg>
  );
}

export function MediaPlaceholder({
  variant,
  label,
  className = "",
}: {
  variant: PlaceholderVariant;
  label: string;
  className?: string;
}) {
  const seed = hash(label);
  const Art = { code: CodeArt, design: DesignArt, audio: AudioArt }[variant];
  return (
    <div
      role="img"
      aria-label={`Placeholder artwork for ${label}`}
      className={`relative size-full overflow-hidden bg-surface text-muted ${className}`}
      style={{
        backgroundImage:
          "radial-gradient(color-mix(in oklab, currentColor 14%, transparent) 0.6px, transparent 0.6px)",
        backgroundSize: "10px 10px",
      }}
    >
      <Art seed={seed} />
      <span className="absolute bottom-3 left-3 font-mono text-[0.625rem] tracking-[0.12em] uppercase opacity-80">
        {label}
      </span>
    </div>
  );
}
