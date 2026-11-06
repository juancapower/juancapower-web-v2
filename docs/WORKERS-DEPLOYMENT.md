# Workers · despliegue controlado y desactivado

Fecha: 6 de noviembre de 2026. Código desplegado: ef71e038198c6dabf3ade448b362082333e710ab, rama chore/cloudflare-bindings. main permanece f1804c6229e48339db05a4e5e4f46ae8bf61b1e9. La documentación posterior no altera los bundles publicados.

## Recursos publicados

| Servicio | URL real | Versión desplegada | Binding D1 |
|---|---|---|---|
| POWER 4 | https://power4-capture.juan-cabrera-1db.workers.dev | 9e2ba3d1-097a-4217-b6ee-b714ad346b44 | 9e11e5db-ecb4-49ad-b68a-993a1618c262 |
| Reclamaciones | https://juancapower-complaints.juan-cabrera-1db.workers.dev | 75f99092-e550-4661-9a0d-df773a1641c1 | c57526de-9de9-4f6c-9b0f-bde8a0c89d19 |

Wrangler 4.158.0. Despliegues con salida 0, sin rutas de dominio, cron ni secretos reales. Configuraciones: backend/wrangler.jsonc y backend/wrangler.complaints.jsonc. Sin observabilidad de payload habilitada. No se contrataron servicios de pago.

## Controles

- POWER 4: CAPTURE_ENABLED=false, PRIVACY_APPROVED=false, LIVE_SENDS_ENABLED=false.
- Reclamaciones: COMPLAINTS_ENABLED=false, LEGAL_APPROVED=false, LIVE_SENDS_ENABLED=false.
- Frontend sin cambios: captación y reclamaciones reales desactivadas; test anónimo disponible; rastreadores apagados; noindex conservado.
- No se incorporó ninguna API key ni Secret Key. No se habilitó Brevo, listas, marketing, notificaciones ni recepción de información personal.
- 17 pruebas backend aprobadas: cada bandera individualmente apagada impide acceso a DB y fetch, incluso con las restantes encendidas. Ver backend/disabled-predeploy.test.mjs.
- Bundle revisado y configuraciones comprobadas antes de publicar. Advertencia local de resolución astro/tsconfigs/base en checkout sin node_modules: no impidió bundle ni deploy; frontend se valida separadamente en entorno con dependencias.

## HTTP remoto y D1

Solicitudes POST con cuerpo vacío {}, sin información personal:

| Ruta | Origin | Resultado |
|---|---|---|
| /v1/power4/requests | https://juancapower.github.io | 503, {"error":"DISABLED"} |
| /v1/complaints | https://juancapower.github.io | 503, {"error":"DISABLED"} |
| Ambas rutas | https://example.invalid | 403 |

La respuesta apagada ocurre antes de leer el cuerpo, DB o llamar proveedores. Las pruebas no efectuaron envíos de aplicación a Brevo. Esto acredita el recorrido probado y el código, no una auditoría global de tráfico de proveedores.

Conteos consultados desde el panel autorizado después de probar HTTP, mediante SELECT de solo lectura (sin ampliar OAuth a D1):

| Base | Tabla | Filas |
|---|---|---|
| power4-capture | nonces | 0 |
| power4-capture | limits | 0 |
| power4-capture | requests | 0 |
| juancapower-complaints | complaint_limits | 0 |
| juancapower-complaints | complaints | 0 |

Sin registros nuevos frente al estado cero anterior. No se repitieron esquemas ni escrituras D1.

## OAuth y cierre

Device Authorization oficial, sin callback localhost. Permisos verificados exactamente: account:read, user:read, workers_scripts:write y offline_access. Sin scopes adicionales. Almacenamiento cifrado de Wrangler con clave en Windows Credential Manager; ningún token en Git, frontend o documentación.

Al finalizar: wrangler logout exitoso; whoami informa no autenticado; default.enc ya no existe. Revocación explícita de Wrangler en Connected Applications de Cloudflare: estado final "No connected applications found". La sesión web preexistente del propietario se conserva; la autorización temporal de Wrangler fue revocada. No se extraen ni inspeccionan valores de credenciales.

## Rollback y reproducción

Primera publicación, sin versión anterior recuperable: ante incidencia, deshabilitar workers.dev y las URLs de preview de ambos servicios desde Cloudflare, con autorización operativa. No borrar las D1 ni cambiar DNS.

Si una activación futura necesita volver al estado seguro, las versiones conocidas apagadas son las registradas arriba. Tras autorización y OAuth mínimo revisado, restaurar cada versión con `wrangler rollback ID_VERSION -c CONFIG_CORRESPONDIENTE`; comprobar sintaxis de la versión instalada. Mantener frontend apagado, repetir POST vacío y SELECT de conteos. No ejecutar ahora.

Reproducir pruebas locales: `npm run test:backend`. Reproducir verificación HTTP: POST {} con Origin permitido a las dos rutas exactas de arriba; esperar 503 DISABLED. No usar datos personales ni hacer reintentos de operaciones reales.

## Siguiente paso autorizado pendiente

Revisar este cambio mediante PR, sin fusión automática. La activación necesita aprobación aparte: privacidad y conservación, secretos en Cloudflare, lista/atributos/doble confirmación Brevo y prueba controlada explícitamente autorizada. No bloquea esta publicación apagada la ausencia de secretos: es una barrera adicional deliberada. No se ejecuta migración de dominio ni se retira noindex.
