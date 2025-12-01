# NoteEase – React Notes App (Frontend)

A modern, responsive notes app with create, edit, view, delete, and search/filter capabilities. Data persists to localStorage and the data layer is future-ready for a REST API swap without UI changes.

## Features

- Create, edit, delete notes
- Search by title/content
- Filter by tag (click tag chips)
- Tags input (comma-separated)
- Last saved timestamp, validation (title required)
- Keyboard shortcuts: Ctrl/Cmd+N to create, Ctrl/Cmd+S to save
- Ocean Professional theme (blue primary, amber accents), subtle shadows and rounded corners
- LocalStorage persistence with data service abstraction

## Tech

- React 18 function components with hooks
- Lightweight CSS (no UI framework); theme in `src/ocean.css`
- Data service in `src/services/notesService.js`

## Getting Started

Install dependencies and run dev server:

```
npm install
npm start
```

The app runs on http://localhost:3000.

## Environment Variables

These are optional today but reserved for future backend integration:

- `REACT_APP_API_BASE` – base URL for API (if present, code can be switched later)
- `REACT_APP_BACKEND_URL` – alternative variable for API base

Currently, all data is stored in `localStorage`. The service reads env vars but uses local mode by default.

You can create a `.env.local`:

```
REACT_APP_API_BASE=http://localhost:4000
```

## Project Structure

- `src/services/notesService.js` – localStorage-backed CRUD with future-ready signatures
- `src/components/Header.js` – app title, search, quick add
- `src/components/NotesList.js` – list with preview, tags, delete
- `src/components/NoteEditor.js` – editor with save and tags
- `src/ocean.css` – Ocean Professional theme and layout
- `src/App.js` – layout wiring and state management

## Notes Data Shape

```
{
  id: string,
  title: string,
  content: string,
  tags: string[],   // normalized lowercase
  updatedAt: number // epoch millis
}
```

## Testing

Run tests:
```
npm test
```

## Build

```
npm run build
```

This creates an optimized production build in `build/`.
