import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import assert from 'node:assert/strict';
const base = (process.env.BASE_PATH ?? '/juancapower-web-v2').replace(/\/$/, '');
const pages = ['index.html', 'speaker/index.html', 'contacto/index.html', '404.html'];
assert(!existsSync('dist/CNAME'), 'Production CNAME is forbidden');
assert(!existsSync('.env'), 'No .env in staging project');
const walk = dir => readdirSync(dir).flatMap(x => statSync(join(dir,x)).isDirectory() ? walk(join(dir,x)) : [join(dir,x)]);
for (const file of pages) {
  const html = readFileSync(`dist/${file}`, 'utf8');
  assert.match(html, /name="robots" content="noindex,nofollow"/);
  assert.match(html, /<html lang="es-PE"/);
  assert.equal((html.match(/<h1[ >]/g)||[]).length,1, file);
  assert(!/fbq\(|ttq\.|metricool|GEMINI_API_KEY|localStorage|sessionStorage|<iframe/i.test(html));
  for (const match of html.matchAll(/(?:href|src)="([^"#]+)"/g)) {
    const url = match[1].split('#')[0].split('?')[0];
    if (/^https?:|^mailto:|^data:/.test(url)) continue;
    assert(url.startsWith(`${base}/`), `Bad base: ${url}`);
    const relative = url.slice(base.length + 1);
    const target = relative.endsWith('/') || !relative ? `${relative}index.html` : relative;
    assert(existsSync(`dist/${target}`), `Broken local link ${url} in ${file}`);
  }
}
const assets=walk('dist');
assert(assets.every(x=>!x.endsWith('.js')), 'No client JS required for Sprint 0');
assert(statSync('dist/images/juanca-escenario.webp').size < 250000);
assert(statSync('dist/images/juanca-taller.webp').size < 180000);
console.log(`PASS: ${pages.length} static pages, base ${base || '/'}, internal links, noindex, zero client JS, image budgets, no CNAME/trackers/storage.`);
