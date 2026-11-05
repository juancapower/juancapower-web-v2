# Servicio POWER 4 · implementación desactivada

Cuenta confirmada: **JuanCa Power, hola@juancapower.com**. Este PR no crea listas/contactos, no despliega Worker y no envía correos reales. `wrangler.jsonc` mantiene CAPTURE_ENABLED, PRIVACY_APPROVED y LIVE_SENDS_ENABLED en false. Sin las tres autorizaciones y configuración válida, responde 503 antes de registrar datos.

## Qué funciona

Worker con puertos D1 y HTTP, adaptador Brevo, nonce de un uso (5 min), Turnstile Siteverify con hostname/action, rate limit por IP pseudonimizada y correo, validación/allowlist, AES-GCM del payload, ledger de consentimiento con texto/hash/versión/timestamp, idempotencia y estados de procesamiento. Ninguna respuesta individual sale del navegador; se pueden enviar cuatro enteros solo con consentimiento de puntajes. Contacto sin marketing es válido. Marketing solicita DOI, no campaña ni confirmación automática del opt-in.

D1 guarda la solicitud antes de llamar al proveedor y reclama su procesamiento atómicamente. No se añaden Queues ni reintentos automáticos de proveedor en esta entrega: un timeout incierto pasa a `review_required`, conserva payload cifrado hasta su TTL y NO reenvía. Es una adaptación deliberada del plan para evitar duplicados. No se promete exactamente una entrega; 201 de Brevo es aceptación, no recepción de buzón. Reconciliar en Brevo por POWER4_REQUEST_ID antes de permitir cualquier reenvío manual. Estado `processing` tras un fallo abrupto también requiere revisión. El endpoint de estado usa bearer opaco firmado en header, nunca email/puntajes en URL.

## Ejecutar pruebas y demo sin cuentas externas

Node 24 desde raíz:

```sh
npm ci
npm run test:backend
npm run build:capture-preview
npm run test:capture
npm run preview:capture
```

Abrir http://127.0.0.1:4323/juancapower-web-v2/test-power4/ . La demo usa SQLite en memoria y un adaptador HTTP simulado que rechaza URLs inesperadas; no requiere claves. Usar exclusivamente fixtures `example.invalid`. Incluye banner «Demostración local». TEST_MODE no basta para saltar la protección: la inyección sintética requiere código de testing, fetch simulado y host local. El Worker exportado de producción no habilita ese bypass.

Para regresar al build de publicación: `npm run build`. El preview de captación NO se publica como artifact de Pages ni reemplaza el build de producción. El frontend de demo se desactiva fuera de localhost/127.0.0.1. CI usa un job aislado para las pruebas sintéticas y otro para la web normal.

## Contrato

- POST /v1/power4/challenge → nonce y versión/hash del texto.
- POST /v1/power4/requests → requestId UUID, nonce, botToken, website vacío, contact {name,email,phone?}, consent {contact:true, shareScores:boolean, marketing:boolean, version, textHash}, scores opcional {spirit,mind,body,emotion}.
- GET /v1/power4/status con Authorization bearer devuelto → solo estado.

Payload máximo 8 KB; rechaza claves desconocidas, consentimiento ausente, versión/hash distintos, puntuaciones fuera de 4–20, scores sin permiso, bots, replays y datos mal formados. Sin logging de body/PII. El objeto resultado del cliente es autopercepción editable, no prueba clínica ni dato de integridad certificada. CORS no sustituye antispam; github.io comparte origen entre repositorios del propietario.

## Configuración futura · NO ejecutada

1. Actualizar el aviso público para describir captación/Brevo/Cloudflare/Turnstile al habilitarlo. Aprobar privacidad, responsable, finalidades, textos exactos en `consent-texts.json`, retención, encargados/transferencias y prueba controlada. Asignar versión aprobada (no PENDING/DRAFT/TEST). Los plazos son decisiones del responsable; no hay retención legal inventada.
2. En Brevo de la cuenta confirmada crear lista propia «POWER 4 · Leads web», lista separada para marketing confirmado y atributos abajo. Revisar que ninguna automatización/campaña se active por añadir un contacto a Leads. Confirmar remitente hola@juancapower.com y destinatario fijo de notificación; validar plantilla DOI y URL de retorno. No modificar listas de eventos, bajas globales o contactos ajenos.
3. Elegir cuenta Cloudflare con aprobación del propietario. Accesos necesarios: gestión de Workers/scripts y secretos, creación/edición de D1 en esa cuenta y administración del widget Turnstile. No se requieren permisos DNS ni zona. Autenticar Wrangler mediante OAuth del propietario o token limitado a esos recursos; nunca copiar secretos en chat.
4. Desde `backend/`, comandos preparados para ejecutar SOLO tras autorización de proveedor y costes: `npx wrangler login`, `npx wrangler d1 create power4-capture`, añadir binding DB y database_id real devuelto a wrangler.jsonc, `npx wrangler d1 execute power4-capture --remote --file schema.sql`. No hay ID ficticio operativo en el archivo.
5. Configurar en gestor de secretos o `npx wrangler secret put NOMBRE`: BREVO_API_KEY, HMAC_SECRET (aleatorio >=32 bytes), ENCRYPTION_KEY (32 bytes aleatorios codificados en 64 hex), TURNSTILE_SECRET. Generarlos localmente con gestor seguro; no usar claves de tests. `.dev.vars` y `.wrangler` están ignorados. El backend no lee secretos del frontend ni de GitHub Pages.
6. Variables no secretas servidor: BREVO_LIST_ID, BREVO_MARKETING_LIST_ID, BREVO_DOI_TEMPLATE_ID, DOI_REDIRECT_URL HTTPS, PRIVACY_VERSION, LEDGER_RETENTION_DAYS aprobado, ALLOWED_ORIGINS exactos y RATE_MAX/EMAIL_RATE_MAX. Propuesta de límites: 30 llamadas/10 min por IP y 3 solicitudes nuevas/día por email. Ajustar después de pruebas de falsos positivos. No se aceptan listas/destinatarios del cliente.
7. Crear widget Turnstile con hosts exactos, action power4. Definir cron de limpieza (`*/15 * * * *`) para scheduled, revisar residencia, backups y acceso a D1. Payload cifrado se elimina al procesar; si falla expira lógicamente en 24 h y scheduled lo purga. La supresión física de backups depende del proveedor y debe validarse; no se garantiza borrado de snapshots por un DELETE.
8. Desplegar inicialmente desactivado con `npx wrangler deploy`, únicamente tras autorizar el proveedor. Usar hostname workers.dev, sin modificar DNS. Probar 503 y ausencia de escrituras/envíos. No activar flags de envíos hasta autorización expresa de prueba controlada.
9. Para la prueba aprobada: configurar destinatarios controlados y cuenta/listas correctas, aprobar texto y versión, habilitar las tres variables servidor y frontend solo en entorno controlado. Variables frontend: POWER4_CAPTURE_ENABLED=1, POWER4_PRIVACY_APPROVED=1, POWER4_SENDS_APPROVED=1; PUBLIC_POWER4_CAPTURE_API HTTPS terminado en /v1/power4, PUBLIC_POWER4_PRIVACY_VERSION y PUBLIC_TURNSTILE_SITE_KEY. Solo URL/site key son públicas; ninguna credencial Brevo.
10. Validar registro una vez, cuatro scores solo autorizados, correo al buzón, DOI, opt-out, supresión, rate limits, fallos y conciliación. Capturas/logs con datos sintéticos; nunca PII en artifacts. Aprobación adicional antes de abrir captación pública.

## Atributos y semántica CRM

| Atributo | Tipo en Brevo |
|---|---|
| POWER4_NAME | Texto |
| POWER4_PHONE | Texto opcional E.164; no alta SMS/WhatsApp |
| POWER4_SOURCE | Texto POWER4_WEB |
| POWER4_REQUEST_ID | Texto |
| POWER4_CONTACT_CONSENT | Booleano |
| POWER4_PRIVACY_VERSION | Texto |
| POWER4_CONTACT_AT | Texto ISO con hora |

Email estándar identifica contacto. Puntajes NO se guardan en atributos CRM. Estado de marketing se determina por lista DOI de Brevo; no hay webhook de confirmación propio ni estado CONFIRMED decidido por el cliente. El adaptador no establece flags globales emailBlacklisted/smsBlacklisted; el comportamiento de DOI y bajas existentes debe verificarse en la prueba real. El ledger D1 guarda los tres consentimientos, versión/hash/textos exactos y fecha servidor. Actualización por email con updateEnabled, forceMerge=false; conservar campos ajenos. Brevo puede ignorar atributos no creados: verificar tipos antes de activar.

## Costes y permisos económicos

Consulta oficial 05/11/2026: Workers dispone de nivel Free (100.000 solicitudes/día, 10 ms CPU por invocación); Paid parte de US$5/mes más consumo. D1 tiene cuotas Free propias; Turnstile ofrece plan Free. No se garantiza coste cero ni que el trabajo cifrado encaje en el límite CPU sin medirlo en el proveedor. Plan/cuota Brevo y condiciones de envío requieren comprobar la cuenta confirmada. No se contrató ni desplegó ningún servicio, gratuito o de pago.

Fuentes: https://developers.cloudflare.com/workers/platform/pricing/ , https://developers.cloudflare.com/turnstile/plans/ , https://developers.cloudflare.com/turnstile/get-started/server-side-validation/ , https://developers.brevo.com/reference/create-contact , https://developers.brevo.com/reference/send-transac-email . Revisar precios y cuotas de nuevo al contratar.

## Checklist corto de activación

- [ ] Privacidad, versión/textos, retención y permisos aprobados.
- [ ] Lista Leads y marketing DOI, atributos y remitente configurados en JuanCa Power.
- [ ] Cuenta/proveedor/coste autorizado, DB/schema/cron, secretos y Turnstile verificados.
- [ ] Prueba controlada explícitamente autorizada, con recepción y bajas/supresión confirmadas.
- [ ] Solo entonces activar flags; rollback: apagar frontend y las tres flags servidor, revisar solicitudes inciertas y limpiar conforme a retención. No rotar la clave de cifrado sin plan para payloads pendientes.
