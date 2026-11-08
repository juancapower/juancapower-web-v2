# Servicio POWER 4 · integrado y desactivado

Cuenta confirmada **JuanCa Power · hola@juancapower.com**. Recursos remotos ya creados: no volver a crear D1, widgets ni Workers. URLs/versiones publicadas y revocación OAuth en [WORKERS-DEPLOYMENT.md](../docs/WORKERS-DEPLOYMENT.md). Estado vivo del sprint, checklist manual único y prueba real propuesta en [MEGA-INTEGRATION.md](../docs/MEGA-INTEGRATION.md).

## Estado operativo

Captación, privacidad y envíos permanecen false en backend/wrangler.jsonc. Libro: COMPLAINTS_ENABLED, LEGAL_APPROVED y LIVE_SENDS_ENABLED false. Frontend por defecto no renderiza formularios reales ni carga Turnstile o rastreadores. El test anónimo conserva sus cuatro pasos y reserva directa. Las URLs/Site Keys públicas están integradas en src/data/services.json, no son secretos ni activan nada.

La protección adicional de este sprint (release-gate.mjs) está en el código versionado; **las versiones remotas descritas en WORKERS-DEPLOYMENT.md son anteriores**. No se redesplegaron Workers en este sprint. Al preparar la prueba, actualizar el código existente manteniendo flags false antes de introducir secretos o activar una ventana.

## Arquitectura y garantías comprobadas con mocks

Worker/D1/Turnstile, nonce de un uso, rate limit, validación allowlist, AES-GCM del payload, ledger de consentimiento con versión/hash/texto/fecha, idempotencia y estado firmado opaco. Contacto, compartir cuatro puntajes y marketing son permisos distintos. No respuestas individuales fuera del navegador ni puntajes en atributos Brevo. El resultado permanece accesible si falla la integración.

BrevoAdapter crea/actualiza únicamente el contacto solicitado en Leads #15, sin forzar fusiones ni quitar bajas globales. DOI solicita inclusión en Marketing #16 solo tras confirmación gestionada por Brevo. No campañas. Verificar comportamiento con contactos preexistentes/dados de baja en la prueba real. La lista marketing debe diferir de Leads: configuración coincidente falla cerrada.

Una respuesta 201/2xx de Brevo no acredita recepción de buzón. Fallos inciertos pasan a review_required; no hay reintento ciego. Reconciliar por POWER4_REQUEST_ID antes de reenviar manualmente. Estado processing tras fallo abrupto también requiere revisión. Payload de solicitud máximo 24 horas (propuesta técnica aún pendiente de aprobación por finalidad); ledger requiere LEDGER_RETENTION_DAYS aprobado y limpieza operativa. La función scheduled existe, pero no hay cron desplegado: configurar su ejecución o procedimiento equivalente antes de recepción real. El Libro conserva su archivo y no elimina reclamaciones automáticamente.

## Contratos

- POST /v1/power4/challenge: nonce, versión y hash del consentimiento.
- POST /v1/power4/requests: requestId, nonce, botToken, website vacío, contact {name,email,phone?}, consent {contact:true,shareScores,marketing,version,textHash}, scores opcionales {spirit,mind,body,emotion} enteros 4–20.
- GET /v1/power4/status: token opaco en Authorization, solo estado; nunca datos en URL.
- POST /v1/complaints: formulario allowlist; correlativo durable, payload cifrado, copia imprimible/descargable y dos notificaciones (operador/solicitante), sin alta CRM ni marketing.

Origin exacto obligatorio. CORS no sustituye antispam. Siteverify exige hostname autorizado y action power4/complaints respectivamente. El modo sintético solo funciona con código de testing, fetch simulado y host local; el handler de producción no admite el bypass.

## Variables y secretos (sin valores privados)

Ambos Workers: TURNSTILE_SECRET propio, HMAC_SECRET aleatorio >=32 bytes, ENCRYPTION_KEY de 32 bytes en 64 hex y BREVO_API_KEY para correos. En el Libro, la credencial Brevo y LIVE_SENDS_ENABLED controlan solo el correo. D1 conserva el registro y la constancia aunque el envío no esté disponible. Introducir exclusivamente como Secret en el panel Cloudflare, nunca Git/frontend/chat/logs. Cada Worker debe tener claves de HMAC/cifrado independientes; conservar acceso seguro para recuperación y rotación.

POWER 4 no secretas: BREVO_LIST_ID=15, BREVO_MARKETING_LIST_ID=16, BREVO_DOI_TEMPLATE_ID pendiente, DOI_REDIRECT_URL HTTPS aprobado, PRIVACY_VERSION aprobado (no PENDING/DRAFT/TEST), LEDGER_RETENTION_DAYS aprobado, ALLOWED_ORIGINS, RATE_MAX/EMAIL_RATE_MAX. Todas las flags reales false. La configuración de conservación del Libro requiere COMPLAINTS_RETENTION_APPROVED exactamente true; la cadena false ya no cuenta como aprobación. Identidad: PROVIDER_LEGAL_NAME, PROVIDER_RUC y PROVIDER_ADDRESS, coincidentes con src/data/legal.ts; dirección solo en Privacidad y Libro.

Prueba controlada: CONTROLLED_TEST_ONLY=true, CONTROLLED_TEST_FROM / CONTROLLED_TEST_UNTIL ISO UTC a futuro máximo una hora y CONTROLLED_TEST_EMAILS como Secret con los únicos buzones del propietario autorizados. Falta/expiración de ventana detiene antes de DB/red. Correos ajenos se rechazan antes de Siteverify/CRM/registro. Las flags principales también deben estar autorizadas; esta configuración no las sustituye. Apertura pública futura requiere decisión explícita CONTROLLED_TEST_ONLY=false y aprobación aparte.

Frontend POWER 4: POWER4_CAPTURE_ENABLED, POWER4_PRIVACY_APPROVED y POWER4_SENDS_APPROVED todas 1, más PUBLIC_POWER4_PRIVACY_VERSION aprobado. URLs/Site Keys verificadas por defecto; overrides PUBLIC_POWER4_CAPTURE_API/PUBLIC_TURNSTILE_SITE_KEY para entorno controlado. Libro: COMPLAINTS_ENABLED, COMPLAINTS_SENDS_APPROVED y COMPLAINTS_LEGAL_APPROVED todas 1. Esas tres banderas permiten el ensayo local controlado del Libro. El build raíz de producción usa el formulario propio, las variables públicas y el control de salud del Worker descritos en [GO-LIVE LEAN](../docs/GO-LIVE-LEAN.md). Staging sigue apagado. Los previews sintéticos nunca se publican en Pages.

## CRM · tipos requeridos

Configuración verificada de listas y esquema preparado en backend/brevo-setup.json. El conector no ofrece creación de atributos: aún faltan en la cuenta.

| Atributo | Tipo |
|---|---|
| POWER4_NAME | Texto |
| POWER4_PHONE | Texto opcional E.164; no alta SMS/WhatsApp |
| POWER4_SOURCE | Texto POWER4_WEB |
| POWER4_REQUEST_ID | Texto |
| POWER4_CONTACT_CONSENT | Booleano |
| POWER4_PRIVACY_VERSION | Texto |
| POWER4_CONTACT_AT | Texto ISO con hora |

Email estándar identifica contacto. No crear atributos de puntajes ni reutilizar consentimientos/eventos. DOI requiere plantilla específica revisada; no asumir que la plantilla predeterminada #1 sea válida para POWER 4.

## Pruebas reproducibles (sin proveedores)

Node 24: npm ci; npm run test:backend. Luego npm run build:capture-preview y npm run test:capture; después npm run build:legal-preview y npm run test:legal. Finalmente npm run check, npm run build, npm run check:static y npm test para restaurar/verificar el build normal. No paralelizar builds distintos en el mismo dist. Los previews utilizan SQLite en memoria, fixtures example.invalid y mocks de proveedores; nunca equivalen a integración Brevo real aprobada.

Fuentes oficiales: [DOI Brevo](https://developers.brevo.com/reference/create-doi-contact), [Cloudflare Siteverify](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/). No se contrataron servicios ni se amplió OAuth en este sprint.
