# Mega sprint · entrega integral para revisión

PR #8 · rama `feature/platform-mega-sprint`. Retoma `ed7bb0f`; cierre funcional en `83d367c`, validación en `05a62ce`, pulido en `6b2a4fb`. El PR no se fusiona automáticamente. Staging público mantiene únicamente la versión aprobada de main; producción/DNS/CNAME/repositorio anterior sin cambios.

## Producto implementado

- Header, navegación de escritorio/móvil y footer compartidos en Home, Coaching, Speaker, Test, Comunidad, Recursos, Sobre mí, Contacto, avisos y 404. Hero Stage Presence conservado.
- Test POWER 4 en cuatro pasos: 16 afirmaciones originales, escala 1–5, progreso, anterior/siguiente, validación, respuestas en memoria, resultados 4–20, interpretación orientativa, reserva opcional y reinicio. Sin correo, almacenamiento, transmisión o backend; fallback sin JavaScript no envía respuestas.
- Speaker: temáticas propuestas verificables desde el brief, conferencia/taller/experiencia corporativa, fotos propias, preguntas para organizadores y WhatsApp con evento, fecha, lugar, audiencia y objetivo. Sin formulario ficticio ni avales de terceros.
- Comunidad: dos propuestas y mensajes distintos de consulta, sin inventar invitaciones. Recursos: catálogo `src/data/resources.ts`, Mapa POWER 4 y Kit real con portada original optimizada a 20.236 bytes; enlace del kit HTTP 200.
- Sobre mí: ingeniería, gestión, tecnología y desarrollo personal según datos del propietario, sin estadísticas/credenciales inventadas. Contacto: Calendar y contratación claramente separados.
- SEO: title/description por ruta, canonical, OG, tarjetas sociales, WebPage sin ratings inventados, sitemap, robots restrictivo y noindex. Avisos describen el funcionamiento real y explicitan datos legales pendientes.

## Revisión local

Node 24 · Astro estático. `npm ci`, `npm run check`, `npm run build`, `npm run check:static`, `npm test`. Para preview: `npm run preview:concepts`, abrir http://127.0.0.1:4322/juancapower-web-v2/ . El nombre histórico del comando no limita el preview: sirve toda la plataforma. Usar el artifact `power-presence-static-preview` del CI del PR para revisar exactamente el commit remoto.

## Validación y evidencia

Comprobación de tipos Astro/TypeScript sin errores, advertencias o hints. No hay un linter independiente configurado: `git diff --check`, compilador, typecheck y validación estática cubren los checks de código aplicables. Suite ampliada a 122 pruebas en Chromium: 360/390/768/1024/1440, navegación, enlaces, axe, foco/teclado, reduced motion, zoom, footer único, 404, escenarios del test y dos embudos. CI repite builds con base raíz y subdirectorio.

El test verifica mínimos/máximos, respuestas mixtas 9/10/14/15, validación incompleta, retorno conservando respuestas, foco, reinicio, borrado al recargar y ausencia de envío con JavaScript desactivado. Capturas completas 390/1440 de rutas principales y resultado en `browser-evidence`; no se añaden capturas pesadas a Git. Ver [EVIDENCE.md](EVIDENCE.md).

Auditoría automatizada y revisión visual no equivalen a certificación WCAG ni prueba física de todos los dispositivos/lectores. Se verificó teclado en navegador y semántica nativa; queda recomendada validación asistiva con usuarios antes de lanzamiento general.

## Embudos y canales

1. Home → Coaching → Calendar: dos acciones; también existe reserva directa desde el hero. Calendar devuelve HTTP 200 y título «Citas Power». No se realizó una reserva ni se acredita disponibilidad específica.
2. Home → Speaker → WhatsApp: dos acciones. Número y texto corresponden al canal existente, con contexto de organizador. No se envió mensaje ni se afirma recepción comercial.
3. Comunidad abre consultas propias de cada espacio. Kit: https://juancapower.github.io/recursos/kit-marca/ responde HTTP 200; no se modificó el repositorio de recursos.

## Rendimiento y seguridad

Sin dependencias nuevas de UI, GSAP, rastreadores, embeds o vídeos en carga. Únicamente se agregaron herramientas de comprobación como dependencias de desarrollo. JS de cliente limitado al test y presupuesto total <50 KB; imágenes locales WebP con dimensiones, hero conservado y secundarias lazy. npm audit de producción: cero vulnerabilidades conocidas en la consulta realizada.

14 mediciones sintéticas de carga fría en 390/1440, red 1,6 Mbps/150 ms y CPU ×4. Se registran LCP, CLS, tiempos de navegación, transferencia y peticiones externas en `metrics.json` de cada test. No son datos de campo ni una garantía de Core Web Vitals; INP de usuarios reales no se ha medido. Presupuesto de transferencia inicial <2 MB y cero recursos externos en carga. Ver [AUDIT-FINAL.md](AUDIT-FINAL.md).

## Bloqueos de lanzamiento

- Aprobación visual/comercial final del PR y definición de precios, materiales, cuotas, sesiones y seguimiento; precios siguen ocultos.
- Datos del responsable legal, condiciones de contratación/cancelación, procedimiento de derechos, tratamiento en canales externos y revisión legal final. Matriz y fuentes oficiales en [LEGAL-REVIEW.md](LEGAL-REVIEW.md).
- Permisos de uso comercial de fotografías existentes con participantes/logos antes del dominio final. Testimonios y trayectoria de terceros permanecen excluidos; no bloquean la revisión del resto del producto.
- Validación operativa del propietario de una reserva y una recepción de consulta reales; no se simularon durante QA.

Invitaciones directas de comunidades, nuevas guías, formularios/CRM y analítica son ampliaciones pendientes, no elementos simulados: se mantienen consultas y recursos reales. No marcar como terminados tickets con aceptación comercial, permisos o integraciones pendientes.

## Migración futura · no ejecutar en este sprint

1. Aprobar producto, condiciones y datos legales; completar permisos y QA operativo.
2. Respaldar ambas webs y registrar configuración actual, rutas, redirecciones y rollback.
3. Aprobar expresamente dominio/DNS/CNAME/HTTPS y ventana de cambio.
4. Ajustar SITE_URL/BASE_PATH, canonical/OG/sitemap, retirar noindex/robots restrictivo solo al publicar dominio aprobado y excluir archivos de revisión según plan de rutas.
5. Validar rutas antiguas, reservas, contactos, accesibilidad, HTTPS y medición con consentimiento si se incorpora.
6. Mantener reversión verificada y observar errores después de migrar. El repositorio anterior permanece intacto hasta esa autorización.
