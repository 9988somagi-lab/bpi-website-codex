import fs from 'node:fs';
import path from 'node:path';

const src = path.resolve('src');
const dist = path.resolve('dist');

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });
fs.cpSync(src, dist, { recursive: true });

console.log(`Built ${src} -> ${dist}`);
