import type { APIContext } from 'astro';
import { leanRelease } from '../data/release';

export function GET({ site }: APIContext) {
  const body = leanRelease
    ? `User-agent: *\nAllow: /\nSitemap: ${new URL('/sitemap.xml', site).href}\n`
    : 'User-agent: *\nDisallow: /\n';
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
