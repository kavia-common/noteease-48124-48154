import React from 'react';

/**
 * Header with app title, search input, and optional quick add button.
 * Props:
 *  - searchQuery: string
 *  - onSearchChange: (value: string) => void
 *  - onNewNote: () => void
 */
export default function Header({ searchQuery, onSearchChange, onNewNote }) {
  return (
    <header className="header">
      <div className="header-left">
        <div className="app-title">NoteEase</div>
        <div className="api-mode">
          <span className="api-badge" title="Currently using local storage">
            Local
          </span>
        </div>
      </div>
      <div className="header-center">
        <input
          aria-label="Search notes"
          className="search-input"
          type="text"
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="header-right">
        <button className="btn btn-primary" onClick={onNewNote} title="New note (Ctrl/Cmd+N)">
          + New Note
        </button>
      </div>
    </header>
  );
}
