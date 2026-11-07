import { defineConfig } from 'astro/config';

const site = process.env.SITE_URL || 'https://juancapower.github.io';
const base = process.env.BASE_PATH ?? '/juancapower-web-v2';

if (process.env.GO_LIVE_LEAN === '1') {
  if (site !== 'https://www.juancapower.com' || base !== '/') {
    throw new Error('GO_LIVE_LEAN requires the exact production origin and BASE_PATH=/.');
  }
  for (const key of ['LEAN_COMPLAINTS_URL', 'LEAN_COMPLAINTS_PRIVACY_URL']) {
    const value = URL.parse(process.env[key] || '');
    const synthetic = value && /(^|\.)(example\.(com|net|org)|invalid|test|localhost)$/i.test(value.hostname);
    if (!value || (synthetic && process.env.LEAN_REHEARSAL !== '1') || value.protocol !== 'https:' || value.username || value.password || value.hash ||
        ['www.juancapower.com', 'juancapower.com', 'juancapower.github.io'].includes(value.hostname)) {
      throw new Error(`GO_LIVE_LEAN requires an external HTTPS URL in ${key}.`);
    }
  }
  for (const key of ['LEAN_CONTACT_RETENTION', 'LEAN_PRIVACY_DISCLOSURE']) {
    if (!process.env[key]?.trim()) throw new Error(`GO_LIVE_LEAN requires ${key}.`);
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
