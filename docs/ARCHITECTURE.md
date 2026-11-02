# Arquitectura y alcance

Astro SSG + CSS nativo + Plus Jakarta Sans local. HTML por ruta ofrece SEO estático y deep links reales en GitHub Pages sin fallback SPA ni backend. Sin React, Tailwind, GSAP ni Gemini en este sprint.

## Recorridos Sprint 0
- Home → agenda Google Calendar existente (navegación externa explícita, sin embed).
- Home → /speaker/ → WhatsApp existente para solicitar propuesta; no se envía automáticamente.
- Home → POWER 4 (#power4) → agenda, sin test obligatorio.
- /contacto/ ofrece agenda y contacto directo. No formularios ni base de datos.

## Mapa futuro, reservado en documentación
| Ruta | Trabajo | Estado |
| --- | --- | --- |
| / | Orientación + speaker | Base Sprint 0 |
| /speaker | Entrada de contratación | Base mínima, ampliar en JUA-29 |
| /contacto | Elegir canal real | Base mínima |
| /coaching | Método, proceso, oferta | Pendiente |
| /test-power4 | Autopercepción opcional, nunca diagnóstico | Pendiente; sin persistencia pública |
| /comunidad | Acceso y propuesta de comunidad | Pendiente |
| /recursos | Biblioteca y enlaces preservados | Pendiente |
| /sobre-mi | Historia y credenciales verificadas | Pendiente |
| /privacidad, /cookies, /terminos | Según tratamiento y actividad reales | Revisión de aplicabilidad pendiente |

No publicar enlaces internos a páginas inexistentes. /powerprompts y /libera-tu-proposito se inventariaron como legado; no se migran ni redirigen ahora. Pages estático no aporta redirecciones HTTP 301/302 configurables: diseñar esa transición en el sprint de migración.

POWER 4: bases Espíritu y Mente; columnas Cuerpo y Emoción; techo Plenitud y Abundancia. Las especialidades profesionales tecnología, coaching e IA no son estos pilares.

## Seguridad y privacidad
Cero secretos, API, píxeles, widgets incrustados o analítica. Agenda/WhatsApp se abren solo tras clic; informar proveedor. No importar .env, CNAME ni scripts del repo antiguo. Antes de producción: verificar identidad del responsable, ARCO, proveedores, cookies reales, condiciones comerciales y aplicabilidad del Libro de Reclamaciones con evidencia y revisión correspondiente. El aviso de preview describe solo esta base y no declara cumplimiento legal completo.

## Referencias técnicas consultadas
- https://docs.astro.build/en/guides/deploy/github/
- https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages
