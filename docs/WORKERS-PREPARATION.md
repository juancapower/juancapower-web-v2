# Workers · alcance preparado, sin autorización remota

Estado: preparación local. OAuth anterior revocado; no iniciar nuevo login ni deploy. Sin escrituras Cloudflare en esta fase. D1 y esquemas previamente verificados; no se vuelven a ejecutar.

## Permisos OAuth propuestos para revisión previa

- account:read: identificar la cuenta autorizada.
- user:read: identificar usuario.
- workers_scripts:write: subir versiones/scripts y gestionar secretos de Workers; permite desplegar técnicamente, pero NO autoriza hacerlo.
- offline_access: Wrangler lo añade automáticamente para renovar sesión. Solo temporal, gestor seguro Windows y revocación explícita al terminar.

No se solicitan todavía. Excluidos workers:write (más amplio), d1:write, zone:read/write, routes, Pages, KV, AI, secrets_store:write y Turnstile write. Si la operación futura exige alguno adicional, detenerse y presentar el permiso exacto antes de consentir. Verificar pantalla OAuth y whoami; no basta con el comando. No usar login con scopes por defecto. Ningún token/clave en chat, código o logs. El backend keyring de Wrangler usa archivo cifrado con clave en Windows Credential Manager; confirmar aceptación de este mecanismo antes de autenticar.

## Recursos y Turnstile validados

Cuenta 1db247860dbe1ecf3409497ba24e6c9f.

| Worker previsto | Binding | D1 ID | Site Key pública | action |
|---|---|---|---|---|
| power4-capture | DB | 9e11e5db-ecb4-49ad-b68a-993a1618c262 | 0x4AAAAAAF1rPJkAdac63E7W | power4 |
| juancapower-complaints | DB | c57526de-9de9-4f6c-9b0f-bde8a0c89d19 | 0x4AAAAAAF1rXQNGtCgN_DjH | complaints |

Ambos widgets: Managed, sin pre-clearance. Hostnames inspeccionados individualmente sin guardar cambios: juancapower.github.io, juancapower.com, www.juancapower.com. Secret Keys no leídas. action se define al renderizar y se exige en Siteverify servidor, no como hostname del widget. CORS actual solo permite https://juancapower.github.io; apex/www NO se habilitan en backend sin la fase de lanzamiento. Localhost no está autorizado por los widgets reales: mocks para pruebas locales.

## Secretos: solo gestor seguro Cloudflare

Por Worker: TURNSTILE_SECRET del widget correspondiente, HMAC_SECRET aleatorio >=32 bytes y ENCRYPTION_KEY de 32 bytes codificada en 64 hex. BREVO_API_KEY se incorporará únicamente cuando se autorice configurar ese acceso; no habilitar listas/envíos. No compartir ni transportar secretos entre chat, clipboard automatizado, archivos temporales o repositorio. Propietario introduce valores directamente en campos Secret del dashboard, sin mostrar sus valores al agente. Confirmar solo nombres/tipo/existencia.

No se guardaron secretos ahora. No usar wrangler secret put si intenta crear/publicar Worker inexistente; tampoco pulsar Save and deploy. Primero comprobar existencia y distinguir versiones no publicadas de despliegues. Si el recurso exige crearse mediante publicación, queda BLOCKED hasta aprobación de despliegue. No crear otro Secrets Store ni pedir su permiso de escritura por conveniencia. No sustituir Secret por variable de texto.

## Evidencia de servicio apagado

17 pruebas backend aprobadas, incluidas dos de predespliegue: cada flag false individualmente retorna 503 {error:DISABLED} antes de acceder DB o fetch. Proxies de DB/red fallan si se tocan. Origen no permitido produce 403, OPTIONS permitido 204; no prometer 503 para todos los métodos/orígenes. CAPTURE_ENABLED/PRIVACY_APPROVED/LIVE_SENDS_ENABLED y COMPLAINTS_ENABLED/LEGAL_APPROVED/LIVE_SENDS_ENABLED siguen false en configuración. No prueba una URL remota, porque no hubo despliegue.

## Despliegue futuro: requiere autorización separada

Alcance a aprobar: exclusivamente los dos nombres, cuenta e IDs de arriba, workers.dev, código y SHA revisados, todos los flags false, observabilidad de payload apagada, sin cron, rutas, dominios o frontend nuevo. Sin Brevo real ni contactos. Mantener planes Free; si exige pago, detenerse.

Antes: confirmar branch/SHA/config, tests, diff y bundle local (deploy --dry-run NO equivale a publicación), comprobar recursos existentes y registrar versión previa si existe. No agregar PUBLIC_POWER4_CAPTURE_API ni activar formulario/trackers. Autorizar OAuth exacto y comprobarlo. Solo tras autorización expresa de despliegue: deploy -c backend/wrangler.jsonc y deploy -c backend/wrangler.complaints.jsonc desde raíz. No ejecutar estos comandos en preparación.

Después del despliegue autorizado: usar las URLs workers.dev realmente devueltas, POST vacío con Origin permitido → 503 DISABLED; origen ajeno → 403; comparar conteos D1 antes/después y ausencia de notificaciones/contactos. No introducir datos personales ni hacer test real. Apagar/revertir ante divergencia. Registrar IDs de versión/deployment y revocar OAuth al finalizar.

Rollback: si hay versión previa, restaurar únicamente esa versión revisada (comando rollback --version-id ID_REAL con config respectiva, tras confirmar sintaxis de Wrangler usado); nunca inventar ID. En primera publicación sin versión previa, deshabilitar acceso público workers.dev/rutas desde Cloudflare, bajo aprobación de rollback, en lugar de asumir rollback disponible. No borrar D1, secretos ni datos. No alterar DNS. Mantener flags false y frontend apagado; comprobar estado remoto nuevamente. Cada operación remota de rollback tiene su alcance y debe estar aprobada.

Pendiente manual indispensable: revisar/aprobar scopes; introducir secretos directamente en Cloudflare cuando el recurso lo permita sin publicar; autorizar aparte el despliegue apagado. Sin esta última autorización, la prueba HTTP real y la configuración remota de Workers siguen pendientes.
