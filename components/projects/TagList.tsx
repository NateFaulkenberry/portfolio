export function TagList({ tags }: { tags: string[] }) {
  if (tags.length === 0) return null;
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label="Tags">
      {tags.map((tag) => (
        <li key={tag} className="border border-rule px-2 py-0.5 font-mono text-[0.68rem] text-muted">
          {tag}
        </li>
      ))}
    </ul>
  );
}
