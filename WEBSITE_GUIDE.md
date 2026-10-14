# BPI website development

A monochrome English B2B battery website with real BPI photography, built as static HTML for GitHub Pages. The core content and navigation work without JavaScript.

## Site structure

- `src/index.html`: homepage with an interactive featured-product selector
- `src/products.html`: product finder, search, family filters and comparison table
- Five product-family pages: `nimh.html`, `lithium-polymer.html`, `lifepo4.html`, `battery-packs.html`, `portable-power.html`
- Fifteen `*-product-*.html` pages: individual catalog range and series details, with relevant enquiry context
- `src/applications.html` and six `application-*.html` pages: industry needs connected to products and customization
- `src/solutions.html` and three customization pages: cell, BMS and structure services
- `src/about.html`, `manufacturing.html`: company and real manufacturing gallery
- `src/resources.html`: a technical briefing checklist and documentation requests
- `src/contact.html`: context-aware enquiry builder and verified contact details
- `src/privacy.html`, `sitemap.html`: enquiry information and complete navigation

## Shared components

`src/components/header.template` and `footer.template` are the shared static navigation components. `scripts/sync-layout.mjs` replaces only the marked shared blocks in every HTML page, preserving the individual page body. Both `npm run check` and `npm run build` synchronize the components, so global navigation cannot drift between pages. A page’s `data-section` attribute controls its active navigation state.

Use `src/styles.css` for the shared design tokens, layouts and responsive rules. The locally hosted Manrope variable font and license are in `src/assets/fonts/`. Brand identity is retained in the official BPI logo; black, white and neutral gray form the editorial design palette. Body text uses stronger contrast and larger sizing. Application images use grayscale presentation while actual product photographs retain their original colour. Low-resolution sources have display limits for common 2x screens; application banners use larger official sources.

`src/page-index.js` supplies the browser-only global search. Update it when adding, renaming or removing a page. `src/content/site.json` records the product, application and service content for reference; edits to this reference data do not automatically regenerate page bodies.

## Customer journeys

- Homepage → product family → individual product → enquiry with `product` and `interest` context
- Application → relevant product families or customization → enquiry with `application` context
- Customization → product or manufacturing information → enquiry with `service` context
- Resources → product selection or model-specific documentation request

Internal links are relative `.html` paths, supporting the GitHub Pages repository subpath. New pages should use the common shared-layout markers and appear in the page index and sitemap.

## Enquiries

The form validates required fields and prepares a reviewable email draft. It does not send a message to a backend. The customer sends from their own email app or copies the prepared text. Direct email, phone and WhatsApp provide alternatives, including without JavaScript.

Changes invalidate a previous prepared draft so outdated information cannot be sent accidentally. Do not add a false success notification. Automated submission requires a separately configured backend.

## Content and images

Official photography is stored in `src/assets/photos/`. The company, product and image sources are recorded in `src/assets/SOURCES.md`. Product photographs may show specifications applicable to one pictured configuration; do not generalize those values across the family. Request current model-specific documentation from BPI. Application content guides a discussion, rather than guaranteeing compatibility.

## Validation and deployment

```sh
npm run dev
npm run check
npm run build
```

Checks validate headings, assets, page links, cross-page anchors and navigation reachability. Inspect desktop and mobile layouts, global search, menus, product filters and end-to-end enquiry journeys when changing UI. The build synchronizes shared components and copies `src/` to `dist/`.

The existing GitHub Actions workflow deploys `dist/` on pushes to `main`. Check the workflow outcome and live content before claiming an online update has completed.

## Asset refresh

`scripts/version-assets.mjs` adds content-hash query versions to stylesheets, scripts, local images and fonts during check/build. The hero’s image URLs use the corresponding versions from the public site configuration. This prevents a fresh page from displaying a stale stylesheet or image after deployment. Photo selectors use substring matching so their source-resolution limits remain effective with versioned URLs.
