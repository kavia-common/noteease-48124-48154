const API_BASE = process.env.REACT_APP_API_BASE || process.env.REACT_APP_BACKEND_URL || null;

/**
 * Note type:
 * {
 *   id: string,
 *   title: string,
 *   content: string,
 *   tags: string[], // normalized to lowercase trimmed strings
 *   updatedAt: number
 * }
 */

const STORAGE_KEY = 'noteease.notes.v1';

// Utility to load from localStorage
function loadNotes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

// Utility to save to localStorage
function saveNotes(notes) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch {
    // ignore
  }
}

function normalizeTags(tags) {
  if (!tags) return [];
  if (Array.isArray(tags)) {
    return tags
      .map((t) => (typeof t === 'string' ? t.trim().toLowerCase() : ''))
      .filter(Boolean);
  }
  if (typeof tags === 'string') {
    return tags
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);
  }
  return [];
}

// PUBLIC_INTERFACE
export function getApiBase() {
  /** Returns configured API base (if any), else null for local mode. */
  return API_BASE;
}

// PUBLIC_INTERFACE
export async function listNotes() {
  /** List all notes. Currently localStorage-backed; shape matches future API. */
  const notes = loadNotes();
  // Sort by updatedAt desc
  notes.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
  return notes;
}

// PUBLIC_INTERFACE
export async function getNote(id) {
  /** Get a note by id. Returns null if not found. */
  const notes = loadNotes();
  return notes.find((n) => n.id === id) || null;
}

// PUBLIC_INTERFACE
export async function createNote({ title, content = '', tags = [] }) {
  /** Create a new note with required title. */
  if (!title || !title.trim()) {
    const err = new Error('Title is required');
    err.code = 'VALIDATION_ERROR';
    throw err;
  }
  const now = Date.now();
  const note = {
    id: cryptoRandomId(),
    title: title.trim(),
    content,
    tags: normalizeTags(tags),
    updatedAt: now,
  };
  const notes = loadNotes();
  notes.unshift(note);
  saveNotes(notes);
  return note;
}

// PUBLIC_INTERFACE
export async function updateNote(id, { title, content, tags }) {
  /** Update an existing note by id. Title required. */
  const notes = loadNotes();
  const idx = notes.findIndex((n) => n.id === id);
  if (idx === -1) throw new Error('Note not found');
  const next = { ...notes[idx] };
  if (title !== undefined) {
    if (!title || !title.trim()) {
      const err = new Error('Title is required');
      err.code = 'VALIDATION_ERROR';
      throw err;
    }
    next.title = title.trim();
  }
  if (content !== undefined) next.content = content;
  if (tags !== undefined) next.tags = normalizeTags(tags);
  next.updatedAt = Date.now();
  notes[idx] = next;
  saveNotes(notes);
  return next;
}

// PUBLIC_INTERFACE
export async function deleteNote(id) {
  /** Delete a note by id. Returns true if deleted, false if not found. */
  const notes = loadNotes();
  const next = notes.filter((n) => n.id !== id);
  const changed = next.length !== notes.length;
  if (changed) saveNotes(next);
  return changed;
}

// PUBLIC_INTERFACE
export async function searchNotes(query = '', tag = '') {
  /** Search by title/content and optional tag filter (case-insensitive). */
  const notes = await listNotes();
  const q = (query || '').trim().toLowerCase();
  const t = (tag || '').trim().toLowerCase();

  const filtered = notes.filter((n) => {
    const matchesQuery =
      !q ||
      n.title.toLowerCase().includes(q) ||
      (n.content || '').toLowerCase().includes(q);
    const matchesTag = !t || (n.tags || []).includes(t);
    return matchesQuery && matchesTag;
  });

  return filtered;
}

function cryptoRandomId() {
  // Small helper to generate a URL-safe id; falls back if crypto not available
  try {
    if (window.crypto?.randomUUID) return window.crypto.randomUUID();
    const arr = new Uint8Array(16);
    window.crypto.getRandomValues(arr);
    return Array.from(arr, (b) => b.toString(16).padStart(2, '0')).join('');
  } catch {
    return 'id_' + Math.random().toString(36).slice(2, 10);
  }
}
