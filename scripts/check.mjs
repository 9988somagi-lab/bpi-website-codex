import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('src');
const pages = new Map();
const errors = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith('.html')) {
      const html = fs.readFileSync(full, 'utf8');
      pages.set(full, {
        html,
        ids: new Set([...html.matchAll(/\bid=["']([^"']+)["']/gi)].map(match => match[1])),
        links: new Set()
      });
    }
  }
}
walk(root);
if (!pages.size) errors.push('No HTML pages were found.');
let internalLinks = 0;

for (const [file, page] of pages) {
  const label = path.relative(root, file);
  if (!/<html[\s>]/i.test(page.html)) errors.push(`${label}: missing <html>`);
  if (!/<title>.+<\/title>/is.test(page.html)) errors.push(`${label}: missing title`);
  if (!/name=["']viewport["']/i.test(page.html)) errors.push(`${label}: missing viewport meta`);
  if ([...page.html.matchAll(/<h1[\s>]/gi)].length !== 1) errors.push(`${label}: expected one <h1>`);

  for (const match of page.html.matchAll(/\b(src|href|poster)=["']([^"']*)["']/gi)) {
    const [, attr, ref] = match;
    if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(ref)) continue;
    if (!ref) { errors.push(`${label}: empty ${attr}`); continue; }
    const [withoutHash, fragment] = ref.split('#');
    const clean = withoutHash.split('?')[0];
    const target = clean ? path.resolve(path.dirname(file), clean) : file;
    if (target !== root && !target.startsWith(root + path.sep)) {
      errors.push(`${label}: reference leaves source directory: ${ref}`);
      continue;
    }
    if (!fs.existsSync(target)) {
      errors.push(`${label}: missing local reference ${ref}`);
      continue;
    }
    if (attr === 'href' && pages.has(target)) {
      page.links.add(target);
      internalLinks++;
      if (fragment && !pages.get(target).ids.has(fragment)) errors.push(`${label}: missing anchor ${ref}`);
    }
  }
}

const home = path.join(root, 'index.html');
if (!pages.has(home)) errors.push('Missing homepage index.html.');
else {
  const reachable = new Set();
  const visit = file => {
    if (reachable.has(file)) return;
    reachable.add(file);
    pages.get(file).links.forEach(visit);
  };
  visit(home);
  for (const file of pages.keys()) {
    if (!reachable.has(file)) errors.push(`${path.relative(root, file)}: unreachable from homepage`);
    // Each page must provide a way back into the site.
    const seen = new Set();
    const canReturnHome = current => {
      if (current === home) return true;
      if (seen.has(current)) return false;
      seen.add(current);
      return [...pages.get(current).links].some(canReturnHome);
    };
    if (!canReturnHome(file)) errors.push(`${path.relative(root, file)}: no navigation path to homepage`);
  }
}

if (errors.length) {
  console.error('Check failed:');
  errors.forEach(error => console.error(`- ${error}`));
  process.exit(1);
}
console.log(`Check passed: ${pages.size} HTML pages, ${internalLinks} internal links; local assets, anchors and site navigation are valid.`);
