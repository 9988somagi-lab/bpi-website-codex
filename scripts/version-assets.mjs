import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = path.resolve('src');
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex').slice(0, 10);
// Font preload and @font-face must request the exact same versioned resource.
const cssPath = path.join(root, 'styles.css');
const originalCss = fs.readFileSync(cssPath, 'utf8');
const updatedCss = originalCss.replace(/url\((['"])(\.\/assets\/fonts\/[^'"?)]+\.woff2)(?:\?[^'")]+)?\1\)/g, (_, quote, file) =>
  `url(${quote}${file}?v=${hash(path.join(root, file))}${quote})`
);
if (updatedCss !== originalCss) fs.writeFileSync(cssPath, updatedCss);

const templates = ['header.template', 'footer.template'].map(name => path.join(root, 'components', name));
const pages = fs.readdirSync(root).filter(name => name.endsWith('.html')).map(name => path.join(root, name));
for (const file of [...templates, ...pages]) {
  const original = fs.readFileSync(file, 'utf8');
  const updated = original.replace(/\b(src|href|poster)="([^"\n]+)"/g, (match, attribute, url) => {
    if (/^(?:[a-z]+:|\/\/|#)/i.test(url)) return match;
    const clean = url.split(/[?#]/)[0];
    if (!/\.(?:css|js|woff2|webp|png|svg|jpg|jpeg|mp4)$/.test(clean)) return match;
    // Shared templates are embedded at the site root, like the generated pages.
    const target = path.resolve(root, clean);
    if (!target.startsWith(root + path.sep) || !fs.existsSync(target)) return match;
    return `${attribute}="${clean}?v=${hash(target)}"`;
  });
  if (updated !== original) fs.writeFileSync(file, updated);
}
