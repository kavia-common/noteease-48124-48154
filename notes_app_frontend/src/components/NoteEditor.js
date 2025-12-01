import React, { useEffect, useRef, useState } from 'react';

/**
 * NoteEditor component
 * Props:
 *  - note: Note | null
 *  - onSave: (updates: { title: string, content: string, tags: string }) => Promise<void> | void
 */
export default function NoteEditor({ note, onSave }) {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [tags, setTags] = useState((note?.tags || []).join(', '));
  const [error, setError] = useState('');
  const lastSavedRef = useRef(note?.updatedAt || null);

  useEffect(() => {
    setTitle(note?.title || '');
    setContent(note?.content || '');
    setTags((note?.tags || []).join(', '));
    setError('');
    lastSavedRef.current = note?.updatedAt || null;
  }, [note?.id]);

  useEffect(() => {
    const handler = (e) => {
      const isSave =
        (e.ctrlKey || e.metaKey) &&
        (e.key === 's' || e.code === 'KeyS');
      if (isSave) {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, content, tags, note?.id]);

  const handleSave = async () => {
    if (!title.trim()) {
      setError('Title is required.');
      return;
    }
    setError('');
    await onSave?.({ title, content, tags });
    lastSavedRef.current = Date.now();
  };

  if (!note) {
    return (
      <div className="editor-empty">
        <div className="empty-title">Select or create a note</div>
        <div className="empty-subtitle">Choose a note from the list or make a new one.</div>
      </div>
    );
  }

  return (
    <div className="note-editor">
      <div className="editor-controls">
        <button className="btn btn-primary" onClick={handleSave} title="Save (Ctrl/Cmd+S)">
          Save
        </button>
        <div className="saved-at">
          {lastSavedRef.current
            ? `Last saved: ${new Date(lastSavedRef.current).toLocaleTimeString()}`
            : ''}
        </div>
      </div>
      <div className="form-group">
        <label className="label" htmlFor="note-title">Title</label>
        <input
          id="note-title"
          className={`input ${error ? 'input-error' : ''}`}
          type="text"
          placeholder="Enter a title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {error ? <div className="error-text">{error}</div> : null}
      </div>
      <div className="form-group">
        <label className="label" htmlFor="note-content">Content</label>
        <textarea
          id="note-content"
          className="textarea"
          placeholder="Write your note content..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={14}
        />
      </div>
      <div className="form-group">
        <label className="label" htmlFor="note-tags">Tags</label>
        <input
          id="note-tags"
          className="input"
          type="text"
          placeholder="work, personal, ideas"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
        <div className="helper-text">Comma-separated. Click tags in list to filter.</div>
      </div>
    </div>
  );
}
