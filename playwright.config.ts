import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests', timeout: 30000, fullyParallel: true, workers: 2,
  reporter: [['list']],
  use: { baseURL: process.env.TEST_ORIGIN || 'http://127.0.0.1:4321', browserName: 'chromium' },
  webServer: process.env.TEST_ORIGIN ? undefined : { command: 'node scripts/serve.mjs', url: 'http://127.0.0.1:4321/juancapower-web-v2/', reuseExistingServer: !process.env.CI },
});
