# Cloudflare · conexión verificada

Estado al 6 de noviembre de 2026: dos Workers publicados exclusivamente en workers.dev y desactivados. Informe verificable, versiones, pruebas y rollback: [WORKERS-DEPLOYMENT.md](WORKERS-DEPLOYMENT.md).

- main remoto: f1804c6229e48339db05a4e5e4f46ae8bf61b1e9, incluye PR #10 y #11.
- D1 power4-capture: 9e11e5db-ecb4-49ad-b68a-993a1618c262.
- D1 juancapower-complaints: c57526de-9de9-4f6c-9b0f-bde8a0c89d19.
- Esquemas versionados aplicados en la fase D1 anterior, tras verificar bases vacías. No reaplicados durante el despliegue.
- Bindings DB reales desplegados; todas las banderas false y sin secretos reales.
- Widgets Managed, sin pre-clearance; hostnames verificados: juancapower.github.io, juancapower.com, www.juancapower.com. Site Keys públicas en backend/turnstile-public.json. Actions: power4 y complaints.
- Secret Keys no leídas. Origen backend permitido exclusivamente https://juancapower.github.io.
- OAuth temporal por Device Authorization con permisos revisados, almacenamiento cifrado con clave en Windows Credential Manager. Logout y revocación explícita completados. No sesión CLI activa.

Los intentos anteriores cancelados/rechazados no se reutilizaron. El despliegue se realizó después de autorización específica del propietario, sin ampliar permisos y sin activar tratamiento o envíos.

Pendiente para activación: aprobación de privacidad/condiciones, configuración de secretos exclusivamente en Cloudflare, Brevo separado y prueba real controlada autorizada. Los recursos publicados no equivalen a un Libro de Reclamaciones operativo ni a captación activa. No cambiar DNS, CNAME, producción ni noindex.
