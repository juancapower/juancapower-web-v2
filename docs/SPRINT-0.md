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
Pages habilitado en repo nuevo con build_type=workflow, cname=null y HTTPS. Pendiente registrar commit definitivo, ejecución de Actions, deployment y comprobación HTTP/navegador de la URL efectiva. La URL prevista no cuenta como publicación hasta entonces.

## Pendientes y siguiente fase
- JUA-29: aprobar arquitectura/wireframes, selección fotográfica, recortes y copy.
- Confirmar disponibilidad real de la agenda y realizar reserva/recepción end-to-end con autorización; no se enviaron mensajes ni reservas.
- Completar páginas secundarias por sprint; cuestionario de autopercepción opcional y sin datos sensibles públicos.
- Validar condiciones/precios y textos legales aplicables antes de producción.
- Medir rendimiento de campo y probar Safari/iOS/Android reales. No se prometen puntuaciones Lighthouse ni conversiones.
- Producción permanece fuera de alcance; no cambiar DNS ni CNAME. Web anterior SHA inicial 927f34416ac4d552c30d250f7784a7675f446749; volver a comprobar al cerrar.

## Incidencias resueltas
La instalación npm en la unidad compartida produjo TAR_ENTRY_ERROR/EBADF. Se ejecutaron build y pruebas en una copia local del mismo proyecto; se sincronizan código, lockfile y evidencia a la carpeta compartida. Un import de fuente inicialmente incompatible se corrigió al entrypoint real del paquete antes de aprobar build.
