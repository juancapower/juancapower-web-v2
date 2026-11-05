import {defineConfig} from '@playwright/test';
export default defineConfig({testDir:'./capture-tests',workers:1,timeout:30000,outputDir:'capture-results',reporter:[['list']],use:{baseURL:'http://127.0.0.1:4323',browserName:'chromium'},webServer:{command:'node backend/preview-server.mjs',url:'http://127.0.0.1:4323/juancapower-web-v2/test-power4/',reuseExistingServer:false}});
