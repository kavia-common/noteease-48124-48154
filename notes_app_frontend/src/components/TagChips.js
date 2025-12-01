import React from 'react';

/**
 * TagChips renders a list of tags as clickable chips.
 * Props:
 *  - tags: string[] (normalized lowercase)
 *  - onClick: (tag: string) => void
 */
export default function TagChips({ tags = [], onClick }) {
  if (!tags.length) return null;
  return (
    <div className="tag-chips">
      {tags.map((t) => (
        <button
          key={t}
          className="chip"
          onClick={() => onClick?.(t)}
          title={`Filter by ${t}`}
        >
          #{t}
        </button>
      ))}
    </div>
  );
}
