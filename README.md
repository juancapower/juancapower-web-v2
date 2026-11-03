# JuanCa Power 2.0

Astro estático, identidad Stage Presence y publicación independiente en GitHub Pages. Producción y DNS permanecen en la web anterior.

## Revisión integral

PR #8, rama `feature/platform-mega-sprint`. No fusionar automáticamente. Informe del producto, pruebas y bloqueos: [docs/MEGA-SPRINT.md](docs/MEGA-SPRINT.md). Evidencia: [docs/EVIDENCE.md](docs/EVIDENCE.md).

Node 24 LTS:

```sh
npm ci
npm run check
npm run build
npm run check:static
npm test
npm run preview:concepts
```

Preview local completo: http://127.0.0.1:4322/juancapower-web-v2/ . El comando de preview conserva su nombre histórico y sirve todas las rutas. Los artifacts de CI incluyen preview estático y capturas reales.

`BASE_PATH=/` permite verificar raíz; por defecto `/juancapower-web-v2`. `SITE_URL` fija el origen. No apuntar al dominio de producción durante revisión. Mantener noindex, robots restrictivo y ausencia de CNAME.

## Contenido y privacidad

Sistema visual en `design-system/MASTER.md`; catálogo en `src/data/resources.ts`; precios propuestos ocultos en `src/data/coaching.ts`; preguntas literales del test en `src/data/power4.json`. Test sin persistencia ni transmisión. Sin trackers, formularios de recepción simulada o testimonios públicos. `.private/` excluido de Git y build.

## Publicación

Los PR validan sin desplegar. Solo main puede publicar en el staging existente. Migración futura necesita aprobación expresa; checklist en el informe. Para revertir staging, hacer un PR de reversión y verificar deployment; no modificar el repositorio anterior.
