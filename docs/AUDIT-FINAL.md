# Auditoría final · plataforma para revisión

## Funcionamiento y accesibilidad

122 casos en CI: suite existente, test de cuatro pasos, respuestas 1/3/5 y mixtas 9/10/14/15, errores, teclado, retorno, reinicio, no-JavaScript, cinco anchos y capturas completas. Typecheck Astro: 0 errores/advertencias/hints. Compilación y enlaces estáticos en base raíz y Pages; footer único, un h1, lang es-PE, canonical, OG, tarjetas sociales y WebPage. No linter separado: git diff --check pasa. Axe A/AA y teclado en Chromium; no es certificación ni ensayo con todos los lectores de pantalla.

Revisión visual real: hero Home conservado, narrativa Speaker, escala móvil en una fila, portada auténtica y diagrama sin recortes descontrolados. Formularios/contactos no muestran confirmaciones de éxito ficticias.

## Rendimiento de laboratorio

Preview local, no medición del CDN público. Caché fría, red 1,6 Mbps/150 ms y CPU ×4, Chromium, una muestra por ruta/ancho. LCP/CLS son mediciones sintéticas, no percentiles de usuarios reales; INP de campo no disponible. No activar trackers para simular una medición real. Primera carga medida antes de scroll, sin incluir todas las imágenes lazy. Registros crudos en artifacts, metrics.json por caso; CI puede variar según el runner.

| Ruta | Ancho | LCP ms | CLS | Load ms | Transferencia recursos bytes |
|---|---:|---:|---:|---:|---:|
| / | 390 | 992 | 0.0004 | 1002 | 89582 |
| / | 1440 | 1080 | 0.0033 | 1304 | 164780 |
| /coaching/ | 390 | 992 | 0.0088 | 1029 | 92420 |
| /coaching/ | 1440 | 1024 | 0.0031 | 1028 | 92420 |
| /comunidad/ | 390 | 1212 | 0.0560 | 877 | 119226 |
| /comunidad/ | 1440 | 764 | 0.0083 | 869 | 119226 |
| /recursos/ | 390 | 800 | 0.0007 | 880 | 86128 |
| /recursos/ | 1440 | 796 | 0.0014 | 869 | 86128 |
| /sobre-mi/ | 390 | 1280 | 0.0006 | 1253 | 164780 |
| /sobre-mi/ | 1440 | 968 | 0.0018 | 1250 | 164780 |
| /speaker/ | 390 | 984 | 0.0008 | 1028 | 104282 |
| /speaker/ | 1440 | 956 | 0.0023 | 1037 | 104282 |
| /test-power4/ | 390 | 812 | 0.0493 | 868 | 65592 |
| /test-power4/ | 1440 | 788 | 0.0134 | 904 | 65592 |

JS de cliente del test: 1921 bytes, en módulo inline; cero archivos JS externos (<50 KB). Recursos iniciales <2 MB en todas las muestras; cero peticiones a orígenes externos. La galería verifica además su presupuesto móvil/escritorio. No vídeos en carga.

## Seguridad y privacidad

npm audit de dependencias de producción: cero vulnerabilidades conocidas en la consulta. No claves, CNAME, trackers, iframes o almacenamiento en páginas del producto. Test method=dialog y submit desactivado sin JS: sin respuestas en URL o red; cálculo local. No se incorporaron vídeos, nombres, retratos o citas pendientes de terceros. Revisión de normativa y límites en LEGAL-REVIEW.md, usando publicación oficial del DS 016-2024-JUS y campaña ANPD (vigente desde 31/03/2025). No se afirma cumplimiento legal final.

## Embudos

- Coaching: Home → /coaching/ → Calendar, 2 acciones. Apertura Calendar HTTP 200, título Citas Power. No reserva realizada.
- Organizador: Home → /speaker/ → WhatsApp, 2 acciones. Texto con evento/organización, fecha, lugar/modalidad, audiencia y objetivo. No mensaje enviado ni recepción acreditada.
- Comunidad: consultas específicas y diferentes de contratación. Kit de Marca Personal: HTTP 200 en enlace real; se conserva biblioteca original.

## Límites de publicación

Producto preparado para aprobación integral en PR #8; no fusionar sin autorización. Datos legales, condiciones comerciales, derechos de fotos y validación operativa de canales siguen siendo puertas de lanzamiento. Invitaciones, formularios/CRM y testimonios no se simulan. Main y dominio principal intactos.
