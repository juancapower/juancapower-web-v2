import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import assert from 'node:assert/strict';
const base = (process.env.BASE_PATH ?? '/juancapower-web-v2').replace(/\/$/, '');
const pages = ['index.html','404.html', ...['coaching','speaker','contacto','test-power4','comunidad','recursos','sobre-mi','privacidad','cookies','terminos'].map(x=>`${x}/index.html`)];
assert(!existsSync('dist/CNAME'), 'Production CNAME is forbidden');
assert(!existsSync('.env'), 'No .env in staging project');
const walk = dir => readdirSync(dir).flatMap(x => statSync(join(dir,x)).isDirectory() ? walk(join(dir,x)) : [join(dir,x)]);
for (const file of pages) {
  const html = readFileSync(`dist/${file}`, 'utf8');
  assert.match(html, /name="robots" content="noindex,nofollow"/);
  assert(!/[ÃÂ�]/.test(html), `Text encoding corruption in ${file}`);
  assert.match(html, /<html lang="es-PE"/);
  assert.equal((html.match(/<h1[ >]/g)||[]).length,1, file);
  assert.equal((html.match(/<footer[ >]/g)||[]).length,1, `One shared footer: ${file}`);
  assert.match(html, /property="og:description"/);
  assert.match(html, /name="twitter:card"/);
  const schema=html.match(/type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/);
  assert(schema, `WebPage schema: ${file}`);assert.equal(JSON.parse(schema[1])['@type'],'WebPage');
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
assert(assets.filter(x=>x.endsWith('.js')).reduce((n,x)=>n+statSync(x).size,0)<50000, 'Client JS budget 50KB');
assert(statSync('dist/images/juanca-escenario.webp').size < 250000);
assert(statSync('dist/images/juanca-taller.webp').size < 180000);
console.log(`PASS: ${pages.length} static pages, base ${base || '/'}, internal links, noindex, client JS budget, image budgets, no CNAME/trackers/storage.`);
