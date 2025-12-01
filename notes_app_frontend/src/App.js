import React, { useEffect, useMemo, useReducer, useState } from 'react';
import './App.css';
import './index.css';
import Header from './components/Header';
import NotesList from './components/NotesList';
import NoteEditor from './components/NoteEditor';
import {
  createNote,
  deleteNote,
  listNotes,
  searchNotes,
  updateNote,
} from './services/notesService';

// State management with reducer for clarity and scalability
const initialState = {
  notes: [],
  selectedId: null,
  query: '',
  tagFilter: '',
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_NOTES':
      return { ...state, notes: action.notes };
    case 'SELECT':
      return { ...state, selectedId: action.id };
    case 'QUERY':
      return { ...state, query: action.query };
    case 'TAG':
      return { ...state, tagFilter: action.tag };
    case 'CLEAR_FILTERS':
      return { ...state, query: '', tagFilter: '' };
    default:
      return state;
  }
}

// PUBLIC_INTERFACE
function App() {
  /** Root application component for NoteEase. Provides layout, state, and wiring to services. */
  const [state, dispatch] = useReducer(reducer, initialState);
  const { notes, selectedId, query, tagFilter } = state;
  const [loading, setLoading] = useState(true);

  // Fetch notes initially
  useEffect(() => {
    (async () => {
      const list = await listNotes();
      dispatch({ type: 'SET_NOTES', notes: list });
      setLoading(false);
    })();
  }, []);

  // Keyboard shortcut: Ctrl/Cmd+N to create a new note
  useEffect(() => {
    const handler = async (e) => {
      const isNew =
        (e.ctrlKey || e.metaKey) &&
        (e.key === 'n' || e.code === 'KeyN');
      if (isNew) {
        e.preventDefault();
        const created = await createNote({
          title: 'Untitled',
          content: '',
          tags: [],
        });
        const list = await listNotes();
        dispatch({ type: 'SET_NOTES', notes: list });
        dispatch({ type: 'SELECT', id: created.id });
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Derived: selected note
  const selectedNote = useMemo(
    () => notes.find((n) => n.id === selectedId) || null,
    [notes, selectedId]
  );

  // Derived: filtered notes based on query and tag
  const filteredNotes = useMemo(() => {
    if (!query && !tagFilter) return notes;
    // Use the local searchNotes for consistent results and future API swap
    // Note: searchNotes returns a promise; but here we want sync derive; fallback to inline filter
    const q = (query || '').trim().toLowerCase();
    const t = (tagFilter || '').trim().toLowerCase();
    return notes.filter((n) => {
      const matchesQuery =
        !q ||
        n.title.toLowerCase().includes(q) ||
        (n.content || '').toLowerCase().includes(q);
      const matchesTag = !t || (n.tags || []).includes(t);
      return matchesQuery && matchesTag;
    });
  }, [notes, query, tagFilter]);

  const handleSearchChange = (val) => {
    dispatch({ type: 'QUERY', query: val });
  };

  const handleNewNote = async () => {
    const created = await createNote({
      title: 'Untitled',
      content: '',
      tags: [],
    });
    const list = await listNotes();
    dispatch({ type: 'SET_NOTES', notes: list });
    dispatch({ type: 'SELECT', id: created.id });
  };

  const handleSelect = (id) => dispatch({ type: 'SELECT', id });

  const handleDelete = async (id) => {
    await deleteNote(id);
    const list = await listNotes();
    dispatch({ type: 'SET_NOTES', notes: list });
    if (selectedId === id) {
      dispatch({ type: 'SELECT', id: list[0]?.id || null });
    }
  };

  const handleSave = async (updates) => {
    if (!selectedId) return;
    await updateNote(selectedId, updates);
    const list = await listNotes();
    dispatch({ type: 'SET_NOTES', notes: list });
  };

  const handleTagClick = (tag) => {
    dispatch({ type: 'TAG', tag });
  };

  return (
    <div className="app-shell">
      <div className="gradient-bg" />
      <Header
        searchQuery={query}
        onSearchChange={handleSearchChange}
        onNewNote={handleNewNote}
      />
      <div className="content">
        <aside className="sidebar">
          <div className="sidebar-header">
            <div className="sidebar-title">Notes</div>
            {(query || tagFilter) ? (
              <button
                className="btn btn-ghost"
                onClick={() => dispatch({ type: 'CLEAR_FILTERS' })}
                title="Clear search and filters"
              >
                Clear
              </button>
            ) : null}
          </div>
          {loading ? (
            <div className="loading">Loading...</div>
          ) : (
            <NotesList
              notes={filteredNotes}
              selectedId={selectedId}
              onSelect={handleSelect}
              onDelete={handleDelete}
              onTagClick={handleTagClick}
            />
          )}
        </aside>
        <main className="main">
          <NoteEditor note={selectedNote} onSave={handleSave} />
        </main>
      </div>
      <footer className="footer">
        <span>
          Ocean Professional theme • Tip: Ctrl/Cmd+N new, Ctrl/Cmd+S save
        </span>
        {tagFilter ? <span className="active-filter">Filtering: #{tagFilter}</span> : null}
      </footer>
    </div>
  );
}

export default App;
