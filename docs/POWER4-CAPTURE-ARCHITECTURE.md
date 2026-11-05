# JUA-61 · Captación POWER 4 · diseño técnico sin activar

## Estado y límite de este PR

Se auditó el test existente: cuatro pasos, 16 reactivos, resultados locales de 4–20, validación, retorno y reinicio; no hay endpoint, persistencia, registro ni comunicación con Brevo. Su código y preguntas permanecen intactos. Este documento propone la siguiente integración, no la implementa ni conecta cuentas. No se crea lista, atributo, contacto, correo o secreto en Brevo.

El ticket señala cuenta «Juanca Power», remitente y listas existentes; son contexto aportado por Linear, no autorización de destino. El propietario debe confirmar cuenta/organización, lista exclusiva y remitente antes de cualquier escritura. Los precios no cambian en este sprint aunque el ticket los mencione: siguen sujetos al control comercial de la web.

## UX propuesta

1. Introducción antes del cuestionario: «Continuar sin registro» igualmente visible junto a «Solicitar acompañamiento». No pedir datos para mostrar resultados. No anunciar duración no medida.
2. Modo registrado: nombre (no exigir apellidos), correo y teléfono/WhatsApp opcional con país; explicar finalidad y destinatario. Consentimiento de contacto para responder a la solicitud, versión de aviso y enlace de privacidad. Checkbox no premarcado, independiente: «Quiero recibir contenidos y novedades por correo». Negarse al marketing no bloquea la solicitud, test o reserva.
3. Cuatro pasos y puntajes existentes, sin cambios ni pérdida al regresar. Datos de contacto solo en memoria mientras no se autorice envío. El prefacio no registra un lead ni envía correo automáticamente: se envía al confirmar la solicitud al final.
4. Resultados inmediatos para ambos modos. Acción separada, no premarcada: «Autorizo compartir estos cuatro puntajes y mis datos de contacto con JuanCa Power para conversar sobre mi proceso». Mostrar exactamente el resumen antes de enviar. Sin esa autorización se puede enviar solo consulta/contacto, nunca puntajes. El envío opcional del resumen al participante necesita selección propia y correo confirmado.
5. Confirmación veraz: recibido por servicio vs sincronizado con CRM vs notificado son estados distintos. Error o indisponibilidad conserva resultado y ofrece Calendar sin exigir registro; permite reintento sin pérdida. No mostrar «enviado» por pulsar un botón.
6. CTA Calendar siempre disponible sin datos, registro, consentimiento de marketing ni resultado.

No implementar UI de captación desactivada que invite a introducir PII sin servicio listo. Activación posterior con flag false por defecto. Ni las comunidades ni su ingreso provocan alta en CRM.

## Servicio propuesto y despliegue separado

GitHub Pages continúa estático. Propuesta: Cloudflare Worker externo HTTPS en subdominio workers.dev, sin cambio DNS/CNAME. Proyecto/backend aislado para una futura revisión y despliegue autorizado. D1 para idempotencia/consentimiento y outbox, Queue para operaciones asíncronas; cifrado de payload sensible a nivel aplicación con clave de servidor. Evaluar región/proveedores, transferencias y retención antes de contratar/desplegar. No se provisiona nada en este PR.

Flujo: navegador → challenge/nonce → Worker → validación/consentimiento → transacción D1 (solicitud + outbox) → consumidor → Brevo y notificación. El modo anónimo nunca llama al servicio. Sin PII en query strings, redirects, localStorage, GitHub, artifacts o analytics. No enviar respuestas individuales.

Endpoints propuestos:
- `POST /v1/power4/challenge`: nonce de un uso, propósito/versión de aviso y expiración corta; token opaco en memoria. No datos de contacto.
- `POST /v1/power4/requests`: JSON, máximo 8 KB, idempotency key aleatoria, nonce y token antispam. Recibe datos mínimos, consentimientos y cuatro puntajes solo si autorizados.
- `GET /v1/power4/requests/status`: identificador opaco en header y token de acceso corto, sin PII o enumeración. Devuelve estado técnico, no datos del contacto. No usar correo como URL.
- Endpoint de retirada/eliminación con prueba de control del correo y revisión del responsable; no borrado por simple conocimiento del email.

Respuesta 202 significa solicitud registrada en outbox, no correo entregado. 400 entrada inválida; 403 challenge/consentimiento inválido; 409 clave reutilizada con distinto contenido; 413 payload grande; 429 límite; 503 proveedor/servicio no disponible. Error genérico sin confirmar si un email ya existe.

## Controles

Secretos solo Worker: credencial Brevo, claves de firma/HMAC/cifrado y antispam. Nunca PUBLIC_*, código, chat, workflow logs o artifacts. Secretos por entorno, privilegios mínimos, rotación y retirada; variables públicas solo URL y site key no secreta del captcha.

CORS con orígenes permitidos explícitos (staging y futuro dominio autorizado), sin wildcard. CORS no es autenticación; el dominio github.io comparte origen entre repositorios del mismo usuario. Añadir nonce firmado de un uso, caducidad, Turnstile verificado por servidor con hostname/action esperados, honeypot y comprobación temporal. No confiar en Origin/Referer como única barrera. Sin cookies de sesión de terceros: token de vida corta en memoria. CSP/connect-src limitada al servicio solo al activar; no cargar antispam para modo anónimo.

Límites propuestos iniciales: 5 intentos/10 min por IP pseudonimizada y 3 solicitudes/día por HMAC de email, ajustables tras pruebas de falsos positivos. No guardar IP cruda indefinidamente; TTL corto. Bloquear replays de nonce atómicamente. Nunca permitir destinatario o lista enviados por el cliente.

Validación servidor: claves permitidas, tipos estrictos, longitudes, correo normalizado sin alterar el local-part por reglas específicas de proveedor, teléfono internacional E.164 validado (no implica titularidad ni cuenta WhatsApp), nombre Unicode sin HTML/control characters, booleanos estrictos. Puntajes: exactamente cuatro enteros 4–20 o campo ausente; rechazar si compartir=false. La agregación procede del cliente y no tiene integridad clínica; no enviar las 16 respuestas para recalcular. SQL parametrizado, escape de contenido en correo y límites de tamaño. Prohibir adjuntos/URLs arbitrarias y prevenir header injection.

Logs: request ID aleatorio, estado, código de error, duración y contador de reintentos. Nunca bodies, nombres, correos, teléfonos, puntajes o tokens. Evitar PII también en logs de proveedor, tracing y excepciones.

## Modelo CRM propuesto

| Campo | Tipo | Uso/regla |
|---|---|---|
| email | Email estándar Brevo | Consulta registrada; no implica marketing |
| POWER4_NAME | Texto | Nombre solicitado, validado |
| POWER4_PHONE | Texto E.164 opcional | Solo canal autorizado; no suscripción SMS/WhatsApp automática |
| POWER4_SOURCE | Texto | POWER4_WEB |
| POWER4_REQUEST_ID | Texto | Identificador idempotente sin PII |
| POWER4_CONTACT_CONSENT | Booleano | Solicitud de respuesta autorizada |
| POWER4_PRIVACY_VERSION | Texto | Versión exacta aprobada |
| POWER4_CONTACT_AT | Fecha/hora normalizada | Timestamp servidor; confirmar tipo de atributo Brevo, usar texto ISO si no soporta hora |
| POWER4_MARKETING_STATUS | Texto | NOT_REQUESTED / DOI_PENDING / CONFIRMED / WITHDRAWN |
| POWER4_MARKETING_VERSION | Texto opcional | Texto/versionado del opt-in separado |

Lista «POWER 4 · Leads web» solo tras aprobación, identificador configurado en servidor. No reutilizar listas de eventos. Marketing en lista/segmento propio tras DOI, sin campaña automática. No usar emailBlacklisted global como sustituto del consentimiento de este flujo: preservar bajas y preferencias globales existentes. No forzar merge ni sobrescribir atributos ajenos. Atributos personalizados deben crearse con tipos correctos en la cuenta confirmada; no son operativos aún.

Por defecto no guardar puntajes en CRM. Con permiso específico, enviar resumen a JuanCa mediante plantilla transaccional servidor: nombre, correo, teléfono opcional, cuatro puntajes, fecha y constancia de autorización. Destino fijo `hola@juancapower.com`, pendiente confirmar. Nada de diagnósticos o garantías. Copia al participante solo si solicitada y verificada. Si se decide guardar scores en CRM, requiere aprobación legal adicional y esquema separado.

## Trazabilidad, retención e idempotencia

Ledger separado con request ID, finalidad, versiones de aviso y checkbox, timestamp servidor, estado de marketing/DOI/retirada y referencia de contacto. Conservar el texto de cada versión. HMAC de correo sigue siendo dato pseudonimizado, no anonimización. No almacenar respuestas individuales. Propuesta a aprobar: payload cifrado de outbox TTL 24 h, sin scores en backups tras expiración; ledger y datos de contacto con plazos definidos por responsable antes de activar (no inventar retención legal).

Clave única por solicitud en D1 y outbox transaccional. Contacto identificado por email normalizado; política de actualización deliberada y no forceMerge. Reintentos con backoff y cola de fallos. Duplicados no envían otra notificación. Timeout con resultado incierto requiere conciliación de estado con proveedor antes de reenviar. No prometer exactamente-una-entrega sin soporte verificado del proveedor; registrar reconciliación y probar ese caso. Verificar firma y replay de webhooks con el mecanismo documentado del proveedor antes de habilitarlos.

## Pruebas antes de activar

1. Unitarias con adaptador Brevo simulado y datos sintéticos: límites, campos desconocidos, correo/teléfono, cuatro scores, consentimiento falso/ausente, marketing independiente, share=false con scores, nonce repetido, input malicioso, 413/429.
2. Integración local: solicitudes concurrentes iguales, distinta carga con misma clave, 429/5xx de proveedor, caída entre upsert/notificación, expiración, outbox y reconciliación. Afirmar cero llamadas de marketing sin DOI y cero scores sin permiso.
3. Navegador cinco anchos: anónimo íntegro, registro opcional, teclado/errores, recuperación, resultados inmediatos con servicio caído, reserva y reinicio. Interceptar red: ninguna PII en URL/logs; no capturar screenshots con datos reales.
4. Cuenta sandbox/de pruebas confirmada y autorizada: lista/atributos aislados, bandeja controlada, destinatarios de prueba del propietario. Probar alta una vez, opt-out, DOI, resumen consentido y eliminación; no usar contactos ajenos.
5. Autorización expresa para una prueba controlada de extremo a extremo; verificar recepción y conciliación. Revisión legal del aviso y transferencias, responsable/retención y cuenta/remitente. Después PR independiente de implementación y habilitación explícita, con rollback del flag y vaciado seguro de cola. Esta fase no autoriza ninguno de esos envíos.

## Dependencias y aceptación

Pendientes: confirmación de cuenta Brevo, proveedor externo y su contrato, lista/atributos/remitente, textos/retención/derechos, destinatario de resúmenes, DOI y prueba operativa aprobada. Secretos se configuran en el gestor del proveedor, no se piden por chat. Aceptación: sin interrupción del modo anónimo, no marketing implícito, no scores sin autorización y sin duplicados observados bajo reintento. Ninguna de estas condiciones se considera verificada en backend por este documento.

Fuentes primarias consultadas 05/11/2026: [Brevo contacto](https://developers.brevo.com/reference/create-contact), [Cloudflare secretos](https://developers.cloudflare.com/workers/configuration/secrets/). La API Brevo exige atributos preexistentes y sus tipos; Worker separa secretos de variables públicas. El resto son decisiones propuestas de arquitectura, por validar con pruebas y privacidad.
