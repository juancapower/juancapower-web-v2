import services from './services.json';
const preview=import.meta.env.POWER4_CAPTURE_PREVIEW==='1';
const version=import.meta.env.PUBLIC_POWER4_PRIVACY_VERSION||'PENDING_APPROVAL';
const sitekey=import.meta.env.PUBLIC_TURNSTILE_SITE_KEY||services.power4.sitekey;
const live=import.meta.env.POWER4_CAPTURE_ENABLED==='1'&&import.meta.env.POWER4_PRIVACY_APPROVED==='1'&&import.meta.env.POWER4_SENDS_APPROVED==='1'&&!/^(PENDING|DRAFT|TEST)/i.test(version)&&!!sitekey;
const endpoint=import.meta.env.PUBLIC_POWER4_CAPTURE_API||services.power4.api;
export const captureConfig={enabled:preview||(live&&/^https:\/\//.test(endpoint)),preview,endpoint:preview?'/v1/power4':endpoint,sitekey,version:preview?'TEST_ONLY_2026_11':version};
