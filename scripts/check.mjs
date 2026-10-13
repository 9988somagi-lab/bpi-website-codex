import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('src');
const htmlFiles = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith('.html')) htmlFiles.push(full);
  }
}

walk(root);
const errors = [];

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  if (!/<html[\s>]/i.test(html)) errors.push(`${file}: missing <html>`);
  if (!/<title>.*<\/title>/is.test(html)) errors.push(`${file}: missing <title>`);
  if (!/name=["']viewport["']/i.test(html)) errors.push(`${file}: missing viewport meta`);
  if (!/<h1[\s>]/i.test(html)) errors.push(`${file}: missing <h1>`);

  const refs = [...html.matchAll(/(?:src|href)=["']([^"'#][^"']*)["']/gi)].map((m) => m[1]);
  for (const ref of refs) {
    if (/^(?:https?:|mailto:|tel:|data:|javascript:)/i.test(ref)) continue;
    const clean = ref.split('?')[0].split('#')[0];
    if (!clean) continue;
    const target = path.resolve(path.dirname(file), clean);
    if (!target.startsWith(root)) continue;
    if (!fs.existsSync(target)) errors.push(`${path.relative(root, file)}: missing local reference ${ref}`);
  }
}

if (errors.length) {
  console.error('Check failed:');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Check passed: ${htmlFiles.length} HTML file(s), no obvious broken local references.`);
