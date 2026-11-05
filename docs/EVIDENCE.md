# Evidencia visual y de pruebas

Fuente de verdad: último run aprobado del PR #8 (Actions → artifact `browser-evidence`). El artifact `power-presence-static-preview` contiene el build completo del mismo SHA; ninguno se publica automáticamente en Pages. Descargar la evidencia para ver PNG originales a tamaño real. No añadir los PNG pesados al repositorio.

| Página | Archivo móvil dentro de browser-evidence | Archivo escritorio |
|---|---|---|
| Home | `gallery-Approved-Stage-Presence-gallery-at-390/home-full-390.png` | `gallery-Approved-Stage-Presence-gallery-at-1440/home-full-1440.png` |
| Coaching | `coaching-coaching-390/coaching-full-390.png` | `coaching-coaching-1440/coaching-full-1440.png` |
| Speaker | `platform-speaker-390/speaker-390.png` | `platform-speaker-1440/speaker-1440.png` |
| Test, paso inicial | `platform-test-power4-390/test-power4-390.png` | `platform-test-power4-1440/test-power4-1440.png` |
| Comunidad | `platform-comunidad-390/comunidad-390.png` | `platform-comunidad-1440/comunidad-1440.png` |
| Recursos | `platform-recursos-390/recursos-390.png` | `platform-recursos-1440/recursos-1440.png` |
| Sobre mí | `platform-sobre-mi-390/sobre-mi-390.png` | `platform-sobre-mi-1440/sobre-mi-1440.png` |
| Contacto | `platform-contacto-390/contacto-390.png` | `platform-contacto-1440/contacto-1440.png` |

Además: capturas de privacidad, cookies, condiciones y 404; resultado mixto del test en el caso `mixed answers, incomplete validation, back, keyboard and reset`; galería a cinco anchos. Los nombres de directorios de pruebas largas pueden ser abreviados con hash por Playwright: buscar el nombre del PNG.

Cada escenario de rendimiento aporta `metrics.json` con configuración, LCP, CLS, load, transferencia y orígenes externos. La tabla en AUDIT-FINAL.md registra las muestras locales; los valores del runner CI pueden diferir.

Preview local: Node 24, `npm ci && npm run build`, luego `npm run preview:concepts` y abrir http://127.0.0.1:4322/juancapower-web-v2/ . El comando histórico ahora anuncia Platform y sirve todas las rutas. Para revisar raíz: `BASE_PATH=/ npm run build` y un servidor estático adecuado; CI valida esa variante sin cambiar el dominio.

Criterios revisables: un footer único, hero original, dos acciones hasta el canal comercial, mensajes acordes con la intención, cuatro pasos del test con respuestas preservadas al regresar, validación anunciada, escala de cinco opciones en una fila móvil, resultado comprensible sin color y ausencia de publicación de materiales pendientes.
