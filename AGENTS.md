# Codex Website Workspace Instructions

## Goal
This repository is a self-contained website workspace designed for Codex to create, redesign, and maintain a production-ready static website without external dependencies.

## Working rules
1. Work primarily inside `src/`.
2. Keep the website responsive at desktop, tablet, and mobile widths.
3. Reuse the design tokens in `src/styles.css` instead of scattering new values.
4. Keep HTML semantic and accessible: headings in order, labels for controls, useful alt text, keyboard-friendly navigation.
5. Do not invent business claims, certifications, customer names, statistics, or product specifications. Use clearly marked placeholders when facts are missing.
6. Preserve existing user content unless the instruction explicitly asks to rewrite or remove it.
7. Before finishing a change, run:
   - `npm run check`
   - `npm run build`
8. If visual layout changes, inspect the resulting page at both mobile and desktop widths.
9. Put all local images/fonts/files in `src/assets/`; avoid hotlinking critical production assets.
10. Keep JavaScript progressive: core content must remain readable if JS fails.

## Project structure
- `src/index.html` — main page markup
- `src/styles.css` — all styling and responsive rules
- `src/app.js` — navigation and lightweight interaction
- `src/site.config.js` — editable site text/settings
- `src/components/` — reusable HTML snippets or future component notes
- `src/assets/` — images, icons, downloadable files
- `scripts/serve.mjs` — dependency-free local server
- `scripts/build.mjs` — production build into `dist/`
- `scripts/check.mjs` — lightweight validation

## Editing approach
For a redesign, first update tokens and layout primitives in `styles.css`, then update sections in `index.html`. For content-only changes, prefer `site.config.js` where possible. For a new page, add another `.html` file under `src/` and keep shared styling in `styles.css`.

## Definition of done
A change is done when the page is coherent, responsive, has no obvious broken internal links/assets, `npm run check` passes, and `npm run build` succeeds.
