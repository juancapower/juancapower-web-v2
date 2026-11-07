import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import assert from 'node:assert/strict';
const base = (process.env.BASE_PATH ?? '/juancapower-web-v2').replace(/\/$/, '');
const lean = process.env.GO_LIVE_LEAN === '1';
const site = process.env.SITE_URL || 'https://juancapower.github.io';
const pages = ['index.html','404.html', ...['coaching','speaker','contacto','test-power4','comunidad','conversaciones-que-despiertan','recursos','sobre-mi','privacidad','cookies','terminos','aviso-legal','libro-de-reclamaciones'].map(x=>`${x}/index.html`)];
assert(!existsSync('dist/CNAME'), 'Production CNAME is forbidden');
assert(!existsSync('.env'), 'No .env in staging project');
const walk = dir => readdirSync(dir).flatMap(x => statSync(join(dir,x)).isDirectory() ? walk(join(dir,x)) : [join(dir,x)]);
const inlineScripts = new Set();
for (const file of pages) {
  const html = readFileSync(`dist/${file}`, 'utf8');
  for (const match of html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)) if (!match[1].includes('application/ld+json') && !match[1].includes('src=')) inlineScripts.add(match[2]);
  if (lean && file !== '404.html') {
    assert.doesNotMatch(html, /name="robots" content="noindex,nofollow"/, file);
    const route = '/' + file.replace(/index\.html$/, '');
    assert(html.includes(`rel="canonical" href="${site}${route}"`), `Canonical ${file}`);
    assert.doesNotMatch(html, /id="consent-root"|id="complaints-form"|data-capture-panel|class="footer-note"/, file);
  } else {
    assert.match(html, /name="robots" content="noindex,nofollow"/, file);
  }
  assert(!/[ÃÂ�]/.test(html), `Text encoding corruption in ${file}`);
  assert.match(html, /<html lang="es-PE"/);
  assert.equal((html.match(/<h1[ >]/g)||[]).length,1, file);
  assert.equal((html.match(/<footer[ >]/g)||[]).length,1, `One shared footer: ${file}`);
  assert.match(html, /property="og:description"/);
  assert.match(html, /name="twitter:card"/);
  const schema=html.match(/type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/);
  assert(schema, `WebPage schema: ${file}`);assert.equal(JSON.parse(schema[1])['@type'],'WebPage');
  assert(!/<script[^>]+src=["\']https?:|<noscript[^>]*>[\s\S]*?<img|GEMINI_API_KEY|<iframe/i.test(html));
  for (const match of html.matchAll(/(?:href|src)="([^"#]+)"/g)) {
    const url = match[1].split('#')[0].split('?')[0];
    if (/^https?:|^mailto:|^data:/.test(url)) continue;
    assert(url.startsWith(`${base}/`), `Bad base: ${url}`);
    const relative = url.slice(base.length + 1);
    const target = relative.endsWith('/') || !relative ? `${relative}index.html` : relative;
    assert(existsSync(`dist/${target}`), `Broken local link ${url} in ${file}`);
  }
}
const robots = readFileSync('dist/robots.txt', 'utf8');
const sitemap = readFileSync('dist/sitemap.xml', 'utf8');
if (lean) {
  assert.equal(base, '');
  assert.match(robots, /^User-agent: \*\nAllow: \/\nSitemap: https:\/\/www\.juancapower\.com\/sitemap\.xml\n$/);
  assert(!sitemap.includes('github.io') && !sitemap.includes('/conceptos'));
  const book = readFileSync('dist/libro-de-reclamaciones/index.html', 'utf8');
  assert(book.includes('Abrir el Libro de Reclamaciones virtual'));
  const bookUrl = process.env.LEAN_COMPLAINTS_URL.replaceAll('&', '&amp;');
  assert(book.includes(bookUrl));
  const home = readFileSync('dist/index.html', 'utf8');
  assert(home.includes(`href="${bookUrl}"`), 'Direct Book access from Home');
} else {
  assert.match(robots, /Disallow: \//);
}
for (const file of ['libera-tu-proposito/index.html', 'libera-tu-proposito.html', 'ltp-2026.html', 'powerprompts/index.html']) {
  const html = readFileSync(`dist/${file}`, 'utf8');
  const target = file.startsWith('powerprompts') ? 'https://app.notion.com/p/POWER-PROMPTS-01-Rompepatrones-con-ChatGPT-3cef574ee8138135b65ffb558ed09fe5' : `${base}/`;
  assert(html.includes(target) && /http-equiv="refresh"/i.test(html), `Legacy redirect ${file}`);
}
const assets=walk('dist');
const clientBytes=assets.filter(x=>x.endsWith('.js')).reduce((n,x)=>n+statSync(x).size,0)+[...inlineScripts].reduce((n,x)=>n+Buffer.byteLength(x),0);
assert(clientBytes<50000, 'Client JS budget 50KB including inline modules');
console.log(`Client script budget: ${clientBytes} bytes including inline modules.`);
assert(statSync('dist/images/juanca-escenario.webp').size < 250000);
assert(statSync('dist/images/juanca-taller.webp').size < 180000);
console.log(`PASS: ${pages.length} static pages, base ${base || '/'}, internal links, indexing policy, legacy redirects, client JS budget, image budgets, no CNAME/direct vendor scripts or beacons; gated consent module tested separately.`);
