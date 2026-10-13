# BPI website editing guide

This is a zero-dependency, static English B2B website. Each page is a real HTML document, so product and company content remains available without JavaScript and works on GitHub Pages under the repository subpath.

## Site structure

- `src/index.html`: homepage
- `src/products.html`: product catalog with progressive search and filtering
- `src/nimh.html`, `lithium-polymer.html`, `lifepo4.html`, `battery-packs.html`, `portable-power.html`: product-family details, ranges, selection guides and related applications
- `src/applications.html` and `src/application-*.html`: application overview and six application detail pages
- `src/solutions.html`, `cell-customization.html`, `bms-customization.html`, `structure-customization.html`: customization services
- `src/about.html`, `manufacturing.html`: company and manufacturing
- `src/contact.html`: enquiry builder and public contact details
- `src/privacy.html`, `sitemap.html`: enquiry information and full site navigation
- `src/styles.css`: shared design tokens, layouts and responsive rules
- `src/app.js`: progressive navigation, catalog search and browser-based enquiry preparation
- `src/site.config.js`: verified public contact configuration
- `src/assets/photos/`: locally stored official photography
- `src/assets/SOURCES.md`: source records and content limitations

All pages have the same static header and footer. Keep those blocks consistent when changing global navigation. Internal links are relative `.html` paths for GitHub Pages compatibility. Contact links may pass `product`, `interest`, `application` or `service` query parameters to prefill the enquiry.

## Enquiry behavior

The form validates required fields, prepares a reviewable enquiry, and opens a `mailto:` draft only when the customer chooses it. It does not send data to a backend. Customers can copy the text and email BPI directly if their device has no configured email app. Direct email, phone and WhatsApp links provide alternatives; the email fallback works without JavaScript.

A server-based enquiry submission service would require a separately configured endpoint and credentials. Do not add a fake success message or hardcode a secret.

## Content standards

Use the official source records for company and product facts. Do not generalize specifications visible on one photographed product across its whole family. Confirm model-specific parameters, test reports and certification requirements with BPI. Application suggestions are discussion starting points, not guarantees of compatibility.

## Development and publication

```sh
npm run dev
npm run check
npm run build
```

The build copies `src/` to `dist/`. The existing GitHub Actions workflow publishes `dist/` when `main` is pushed. Verify desktop/mobile navigation, images, product filtering and enquiry preparation when editing the corresponding UI. Publishing in GitHub Pages settings must be enabled by the repository owner; a push alone is not proof that deployment completed.
