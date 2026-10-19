# FAAN Staff Promotion CBT Practice

A offline-friendly, self-grading multiple-choice practice test for the FAAN
Staff Promotion Examination, focused on the **Mechanical Department**
syllabus plus **General Knowledge / Current Affairs**.

## How it works

- Everything runs **entirely in the browser** — there is no server and no
  internet connection required once the app is loaded/built. Scoring happens
  instantly on your device against the bundled answer key.
- Three modes: **Past Questions** (from the provided past-question material),
  **Likely Questions** (new questions written from the official 2026 syllabus
  reading guide), and **Mixture** of both.
- Choose the subject area (Mechanical, General, or Mixed), how many
  questions, and how many minutes for the session — fully flexible per
  attempt.
- A results screen shows the score, pass/fail, and a full answer review
  (correct answer highlighted for every question).

## Windows desktop app (recommended for offline use)

For a real double-click desktop app (taskbar icon, Desktop/Start Menu
shortcut — not just an HTML file), build the portable Windows package:

```bash
cd app
npm install
npm run package:win
```

This produces `app/release/win-unpacked/`, a self-contained folder with
`FAAN CBT Practice.exe`. Hand that whole folder to the end user (zip it,
copy it to a USB drive, whatever) — inside it they:

1. Double-click **`Create Shortcuts.bat`** once, to add a Desktop and Start
   Menu shortcut (no admin rights needed).
2. From then on, open **FAAN CBT Practice** like any other installed app.

No internet connection is needed to run it. `npm run package:win` requires
`node_modules/electron/dist` to be populated by `npm install` first (if
`npm install` can't reach the Electron binary download, see the note in
`app/scripts/package-win.cjs`).

## Running it as a plain web app (no internet needed)

```bash
cd app
npm install
npm run build
```

This produces `app/dist/`. Because the build uses relative asset paths, you
can open `app/dist/index.html` directly by double-clicking it in Windows
Explorer — no server, no internet connection required. Copy the `dist`
folder anywhere (e.g. a USB drive or the desktop) to use it completely
offline.

For development with live-reload:

```bash
cd app
npm run dev
```

## Project structure

- `app/` — the Vite + React + TypeScript web app.
- `app/src/data/questions.json` — the full question bank (past + likely,
  general + mechanical).
- `scripts/` — Python scripts used to extract and assemble the question bank
  from the source study material (kept local-only, not committed to GitHub —
  see `.gitignore`).

## Expanding the question bank

Add more entries to `app/src/data/questions.json` following the existing
shape:

```json
{
  "id": "MEC-LQ-34",
  "category": "mechanical",
  "type": "likely",
  "section": "Some Topic",
  "question": "...?",
  "options": ["...", "...", "...", "..."],
  "correctIndex": 0
}
```

Then re-run `npm run build`.

## Deployment

The `app/` folder deploys to Vercel as a static Vite site with zero
configuration (Framework Preset: Vite, Root Directory: `app`).
