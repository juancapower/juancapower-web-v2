import type { APIContext } from 'astro';
import { path } from '../data/site';

export function getStaticPaths() {
  return ['libera-tu-proposito', 'ltp-2026'].map(legacy => ({ params: { legacy } }));
}

export function GET(_context: APIContext) {
  const home = path();
  return new Response(`<!doctype html><html lang="es-PE"><meta charset="UTF-8"><meta name="robots" content="noindex,nofollow"><meta http-equiv="refresh" content="0;url=${home}"><title>JuanCa Power</title><a href="${home}">Ir al inicio</a></html>`, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
