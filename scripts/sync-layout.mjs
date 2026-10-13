import fs from 'node:fs';
import path from 'node:path';

// Static shared navigation stays available without JavaScript.
const root = path.resolve('src');
const header = fs.readFileSync(path.join(root, 'components/header.template'), 'utf8').trim();
const footer = fs.readFileSync(path.join(root, 'components/footer.template'), 'utf8').trim();
for (const name of fs.readdirSync(root).filter(name => name.endsWith('.html'))) {
  const file = path.join(root, name);
  const original = fs.readFileSync(file, 'utf8');
  const section = original.match(/<body[^>]*data-section="([^"]+)"/)?.[1];
  if (!section) throw new Error(`Missing navigation section: ${name}`);
  const render = template => template
    .replace(/\{\{current:([^}]+)\}\}/g, (_, target) => target === section ? 'current' : '')
    .replace(/\{\{active:([^}]+)\}\}/g, (_, target) => target === section ? 'aria-current="page"' : '')
    .replaceAll(`href="${name}"`, `href="${name}" aria-current="page"`)
    .replaceAll('aria-current="page" aria-current="page"', 'aria-current="page"');
  let result = original;
  for (const [marker, template] of [['header', header], ['footer', footer]]) {
    const pattern = new RegExp(`<!-- shared:${marker} -->[\\s\\S]*?<!-- /shared:${marker} -->`);
    if (!pattern.test(result)) throw new Error(`Missing shared ${marker} markers: ${name}`);
    result = result.replace(pattern, `<!-- shared:${marker} -->${render(template)}<!-- /shared:${marker} -->`);
  }
  if (result !== original) fs.writeFileSync(file, result);
}
