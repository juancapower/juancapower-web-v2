import { defineConfig } from 'astro/config';
export default defineConfig({
  site: process.env.SITE_URL || 'https://juancapower.github.io',
  base: process.env.BASE_PATH ?? '/juancapower-web-v2',
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
});
