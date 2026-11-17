import services from './services.json';
const preview=import.meta.env.POWER4_CAPTURE_PREVIEW==='1';
const sitekey=import.meta.env.PUBLIC_TURNSTILE_SITE_KEY||services.power4.sitekey;
export const captureConfig={enabled:preview,preview,endpoint:preview?'/v1/power4':'',sitekey,version:'TEST_ONLY_2026_11'};
