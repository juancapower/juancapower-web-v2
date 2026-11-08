import { defineConfig } from 'astro/config';
import { readFileSync } from 'node:fs';

const site = process.env.SITE_URL || 'https://juancapower.github.io';
const base = process.env.BASE_PATH ?? '/juancapower-web-v2';

if (process.env.GO_LIVE_LEAN === '1') {
  if (site !== 'https://www.juancapower.com' || base !== '/') {
    throw new Error('GO_LIVE_LEAN requires the exact production origin and BASE_PATH=/.');
  }
  const { complaints } = JSON.parse(readFileSync(new URL('./src/data/services.json', import.meta.url), 'utf8'));
  for (const [key, expected] of [['PUBLIC_COMPLAINTS_API', complaints.api], ['PUBLIC_TURNSTILE_COMPLAINTS_KEY', complaints.sitekey]]) {
    if (process.env[key] !== expected) throw new Error(`GO_LIVE_LEAN requires the configured Libro value in ${key}.`);
  }
  for (const key of ['LEAN_CONTACT_RETENTION', 'LEAN_PRIVACY_DISCLOSURE']) {
    const value = process.env[key]?.trim();
    const draft = value && /^(borrador|pendiente|ensayo|test|configuración sintética)\b/i.test(value);
    if (!value || (draft && process.env.LEAN_REHEARSAL !== '1')) throw new Error(`GO_LIVE_LEAN requires approved text in ${key}.`);
  }
  for (const key of ['CONSENT_PREVIEW', 'POWER4_CAPTURE_PREVIEW', 'TRACKING_LEGAL_APPROVED', 'POWER4_CAPTURE_ENABLED', 'COMPLAINTS_ENABLED']) {
    if (process.env[key] === '1') throw new Error(`GO_LIVE_LEAN cannot use ${key}.`);
  }
}

export default defineConfig({
  site,
  base,
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
});
