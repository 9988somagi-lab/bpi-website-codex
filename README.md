# Codex Website Workspace

A ready-to-use, zero-dependency website environment for creating or modifying websites with Codex.

## Start locally

```bash
npm run dev
```

Open: `http://localhost:5173`

## Validate

```bash
npm run check
```

## Build production files

```bash
npm run build
npm run preview
```

Production output is written to `dist/`.

## Use with Codex
Open this folder as the repository/workspace and tell Codex what you want changed. Codex should read `AGENTS.md` automatically. Examples:

- “Redesign the homepage for an overseas B2B manufacturer. Keep it light, clean, and premium.”
- “Add a Products page and link it from the header.”
- “Replace the hero with my new copy and make the CTA stronger.”
- “Make the mobile layout more compact without changing desktop.”
- “Use the assets I placed in `src/assets/` and do not invent product specifications.”

## Main files
- `src/index.html`: page structure/content
- `src/styles.css`: visual system and responsive layout
- `src/app.js`: light interactions
- `src/site.config.js`: basic site settings/content variables

No npm dependencies are required.
