import React from 'react';
import TagChips from './TagChips';

/**
 * NotesList component
 * Props:
 *  - notes: Note[]
 *  - selectedId: string | null
 *  - onSelect: (id: string) => void
 *  - onDelete: (id: string) => void
 *  - onTagClick: (tag: string) => void
 */
export default function NotesList({
  notes = [],
  selectedId,
  onSelect,
  onDelete,
  onTagClick,
}) {
  if (!notes.length) {
    return (
      <div className="notes-empty">
        <div className="empty-title">No notes yet</div>
        <div className="empty-subtitle">Create your first note to get started.</div>
      </div>
    );
  }

  return (
    <ul className="notes-list">
      {notes.map((note) => {
        const firstLine = (note.content || '').split('\n')[0] || '';
        const updated = note.updatedAt ? new Date(note.updatedAt).toLocaleString() : '';
        const isSelected = selectedId === note.id;

        return (
          <li
            key={note.id}
            className={`notes-list-item ${isSelected ? 'selected' : ''}`}
            onClick={() => onSelect?.(note.id)}
          >
            <div className="item-header">
              <div className="item-title">{note.title}</div>
              <div className="item-updated" title={updated}>
                {updated}
              </div>
            </div>
            <div className="item-preview">{firstLine}</div>
            <div className="item-footer">
              <TagChips tags={note.tags} onClick={onTagClick} />
              <button
                className="btn btn-danger btn-ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm('Delete this note? This cannot be undone.')) {
                    onDelete?.(note.id);
                  }
                }}
                title="Delete note"
                aria-label={`Delete note ${note.title}`}
              >
                Delete
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
