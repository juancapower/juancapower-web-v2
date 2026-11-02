# Sprint 0 · JUA-41

Fecha de revisión: 01/11/2026 (America/Lima).

## Entrega
Repositorio público nuevo: https://github.com/juancapower/juancapower-web-v2
Astro 7.4.4, HTML estático por ruta, CSS nativo y Plus Jakarta Sans local.
Home de conversión, método POWER 4 correcto, entrada mínima speaker y contacto. No test, precios, testimonios ni estadísticas. Arquitectura futura documentada en ARCHITECTURE.md; no desarrollada íntegramente.

## Control de calidad
Build estático y comprobación de enlaces/base/noindex/CNAME: PASS. Navegador Chromium: 17 pruebas en 360/375/768/1024/1440px; axe WCAG 2 A/AA, 2.1 A/AA y 2.2 AA sin infracciones detectadas; teclado/skip link/menú, zoom textual 200%, landscape, reduced motion, recursos cargados y ausencia de errores. No implica auditoría manual exhaustiva WCAG ni métricas de campo.

Capturas de las tres rutas, móvil y escritorio, inspeccionadas visualmente. Fotografías auténticas e isotipo oficial, sin generación. Los textos críticos y CTA son HTML visible sin JavaScript. Hero de 45,882 bytes y secundaria de 109,722 bytes; no runtime JS en el build.

No se encontraron solicitudes a terceros al cargar, cookies, localStorage ni sessionStorage en pruebas de la app. No se afirma ausencia de registros técnicos del hosting.

## Publicación
**Publicación confirmada.**

- Repo público: https://github.com/juancapower/juancapower-web-v2
- PR integrado: https://github.com/juancapower/juancapower-web-v2/pull/1
- SHA de implementación publicado: `ebf3ff73c4051d72e867ce1b9d28177216bd9cc4`.
- CI de PR corregido: https://github.com/juancapower/juancapower-web-v2/actions/runs/41383968182 — success.
- Build + deployment main: https://github.com/juancapower/juancapower-web-v2/actions/runs/41384053217 — success.
- Deployment GitHub ID: 7483664129, entorno github-pages, SHA coincidente.
- URL efectiva: https://juancapower.github.io/juancapower-web-v2/
- Pages: build_type=workflow, cname=null, https_enforced=true.
- Home, /speaker/ y /contacto/: HTTP 200, sin redirección a producción; HTML idéntico byte a byte al build local (SHA-256 en release-evidence.json).
- **17/17 pruebas también pasan contra la URL pública**. Capturas de staging en docs/evidence.
- Este informe registra la primera publicación verificada. Los commits posteriores de documentación no cambian el contenido de la web. Se incorporan mediante PR y CI, según la protección de main.

| Estado | Resultado |
| --- | --- |
| Código y sistema maestro creados | PASS |
| Build y enlaces en Pages y raíz | PASS (local + CI) |
| Navegación, móvil y accesibilidad automática | PASS (17/17 local + CI + staging) |
| Revisión visual de las 3 rutas, móvil/escritorio | PASS |
| Commit, push y PR integrado | PASS |
| Deployment y versión pública esperada | PASS |
| Producción anterior intacta | PASS, SHA y CNAME reconsultados |
| Reserva y recepción end-to-end | PENDIENTE de validación operativa |
| Auditoría legal completa y rendimiento de campo | PENDIENTE, fuera de Sprint 0 |
| Google AI Studio | N/A, no participa en este proyecto |

Google Calendar existente respondió HTTP 200 y resolvió a su página de appointments. Esto no confirma cupos, duración, gratuidad ni una reserva efectiva.

Los runners emitieron un aviso informativo sobre Actions de terceros que usan runtime Node 20 y se ejecutan forzadas en Node 24. No causó fallos en build/deploy; revisar versiones oficiales al mantener el workflow.

## Pendientes y siguiente fase
- JUA-29: aprobar arquitectura/wireframes, selección fotográfica, recortes y copy.
- Confirmar disponibilidad real de la agenda y realizar reserva/recepción end-to-end con autorización; no se enviaron mensajes ni reservas.
- Completar páginas secundarias por sprint; cuestionario de autopercepción opcional y sin datos sensibles públicos.
- Validar condiciones/precios y textos legales aplicables antes de producción.
- Medir rendimiento de campo y probar Safari/iOS/Android reales. No se prometen puntuaciones Lighthouse ni conversiones.
- Producción permanece fuera de alcance; no cambiar DNS ni CNAME. Web anterior SHA inicial 927f34416ac4d552c30d250f7784a7675f446749; reconsultado al cerrar y coincidente. CNAME anterior sigue siendo www.juancapower.com.

## Incidencias resueltas
La instalación npm en la unidad compartida produjo TAR_ENTRY_ERROR/EBADF. Se ejecutaron build y pruebas en una copia local del mismo proyecto; se sincronizan código, lockfile y evidencia a la carpeta compartida. Un import de fuente inicialmente incompatible se corrigió al entrypoint real del paquete antes de aprobar build.

La última pasada detectó corrupción de tildes por una lectura con codificación incorrecta durante un ajuste. Se corrigió en el PR y ahora el checker estático rechaza texto corrupto y el navegador comprueba literalmente el titular.

## Protección del repositorio nuevo
Main exige PR y check `build` aprobado, con ramas actualizadas; protección activa para administradores y force-push/eliminación deshabilitados. El cierre documental sigue ese mismo flujo.
