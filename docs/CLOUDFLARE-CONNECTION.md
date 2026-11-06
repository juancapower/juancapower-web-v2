# Conexión Cloudflare · preparación sin desplegar

main remoto confirmado f1804c6: contiene merges #10 y #11. Cuenta observada 1db247860dbe1ecf3409497ba24e6c9f.

D1 reales: power4-capture 9e11e5db-ecb4-49ad-b68a-993a1618c262; juancapower-complaints c57526de-9de9-4f6c-9b0f-bde8a0c89d19. Panel mostró cero tablas/cero consultas en ambas. Antes de ejecutar SQL debe repetirse comprobación por sqlite_master mediante Wrangler; no se aplicaron schemas.

Site Keys públicas verificadas en listado Turnstile y guardadas en backend/turnstile-public.json. Ambos Managed, tres hostnames, sin pre-clearance. Lista exacta de hostnames pendiente de inspección. Actions del código: power4 y complaints, verificadas en servidor y render del widget. No se leyeron Secret Keys.

Wrangler 4.158.0 no autenticado. OAuth inicial cancelado sin conceder acceso. Intento reducido con account:read user:read d1:write workers_scripts:write workers:write offline_access y keyring rechazado por auto-review: permisos persistentes de escritura requieren autorización explícita adicional. No eludir con UI/API alternativa. Pendiente aprobación de permisos y confirmación OAuth por propietario; no implica autorización de deploy.

Preparados bindings DB en ambos wrangler.jsonc con IDs reales. Todos los flags de captura/privacidad/legal/envíos continúan false. No desplegados, no vinculados en un servicio remoto todavía.

Tras autorizar OAuth: comprobar cuenta y listar D1; ejecutar SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_cf_%'; si aparecen tablas ajenas, detenerse. Aplicar schema.sql a power4-capture y complaints-schema.sql a juancapower-complaints usando --remote y config respectiva; comprobar tablas y filas cero. No DROP/DELETE ni reset.

Secretos que debe introducir propietario mediante gestor seguro: TURNSTILE_SECRET de cada widget, BREVO_API_KEY del remitente confirmado, HMAC_SECRET aleatorio y ENCRYPTION_KEY AES-256. Nunca chat/Git/frontend. Confirmar hostnames exactos github.io/apex/www en cada widget. Los bindings y secrets de Workers requieren recursos remotos existentes; si aún no existen, no crearlos mediante deploy sin autorización expresa.

Pruebas locales: npm run test:backend; ambos handlers con flags false deben devolver 503 para origen permitido antes de cualquier uso de DB/fetch. La comprobación HTTP workers.dev está BLOCKED hasta autorizar despliegue. No afirmar servicio publicado ni OAuth logrado. No configurar listas ni enviar datos reales.

Pendientes manuales imprescindibles: aprobar alcance OAuth para configuración; aceptar consentimiento OAuth; introducir secretos en gestor sin compartirlos; autorizar aparte cualquier despliegue. DNS/CNAME/producción y formularios/rastreadores intactos.
