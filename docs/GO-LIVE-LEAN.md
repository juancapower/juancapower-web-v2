# JuanCa Power 2.0 · Checklist GO/NO-GO

**NO-GO hasta cerrar 2, 3 y 5.** El Libro propio utiliza Cloudflare D1 y Turnstile. Brevo tramita los correos sin condicionar el registro. Captación POWER 4, rastreadores, PDF y galerías adicionales quedan fuera del lanzamiento.

1. **PASS · Accesos y estado técnico.** Calendar y WhatsApp se verificaron en la preparación del PR #17. El test POWER 4 conserva su modalidad anónima. La cuenta Brevo de JuanCa Power y el remitente activo `hola@juancapower.com` se verificaron en lectura. Los dos Workers existentes respondieron `503 DISABLED` a un POST vacío con el Origin permitido. El despliegue del código nuevo, la validación de D1 remota y la entrega real de correos siguen pendientes.

2. **NO-GO · Libro propio. Propietario:** reutiliza `juancapower-complaints` y su D1 `c57526de-9de9-4f6c-9b0f-bde8a0c89d19`. No hay cambios de esquema. Revisa el paquete con `npx wrangler deploy --dry-run --config backend/wrangler.complaints.jsonc` y despliega la versión revisada solo en estado apagado, desde la sesión autorizada del propietario. Comprueba en Cloudflare que `DB` apunta a la D1 existente y que la versión publicada sigue con `COMPLAINTS_ENABLED=false`, `LEGAL_APPROVED=false` y `LIVE_SENDS_ENABLED=false`. En Settings → Variables and Secrets, confirma `TURNSTILE_SECRET`, `HMAC_SECRET`, `ENCRYPTION_KEY` y `BREVO_API_KEY` como secretos. Guarda respaldo de la clave de cifrado en el gestor privado y evita rotarla sin un plan de recuperación de hojas previas. Configura `PROVIDER_LEGAL_NAME`, `PROVIDER_RUC`, `PROVIDER_ADDRESS` con los valores confirmados de `src/data/legal.ts`. Marca `COMPLAINTS_RETENTION_APPROVED=true` solo al aprobar el archivo. Valida el hostname `www.juancapower.com` en el widget del Libro y conserva la acción `complaints`. En Brevo, confirma capacidad transaccional del remitente y revisa entregas, bloqueos o rebotes en el panel. El Libro no agrega contactos a listas.

   **Registro y continuidad.** D1 confirma el correlativo y la hoja cifrada antes de los correos. El navegador entrega el mismo contenido que la copia al consumidor. El aviso al responsable lleva solo el correlativo. Cada destinatario se intenta de forma independiente; no hay reenvío automático ante un resultado incierto. `notified` significa que Brevo aceptó ambas solicitudes, y no acredita entrega. Revisa los estados `registered`, `notifying`, `notification_pending`, `notification_review`, `owner_review` y `consumer_review` en la cola operativa. Ante incidente, revisa los eventos transaccionales antes de reenviar. Descarga e impresión siguen disponibles al registrarse aunque el correo falle. Conserva el Libro de respaldo, define titular y suplente y atiende en hasta 15 días hábiles. Comprueba que el aviso del Anexo II sea visible. [Libro y formatos de Indecopi](https://consumidor.gob.pe/libro-de-reclamaciones/) · [Reglamento del Libro](https://www.gob.pe/institucion/indecopi/normas-legales/3462732-decreto-supremo-n-011-2011-pcm)

   **Conservación y recuperación.** Mantén las hojas al menos dos años desde el registro, con el procedimiento aplicable de eliminación y bloqueo por obligaciones vigentes. Configura archivo cifrado, acceso limitado, registro de atención, exportación periódica y ensayo de recuperación. Los backups del proveedor no sustituyen el archivo de dos años. Para revisar la cola sin mostrar PII, ejecuta `SELECT id, created, state FROM complaints WHERE state <> 'notified' ORDER BY id;`. Para recuperar una sola hoja, una persona autorizada puede copiar en un archivo privado la celda de `SELECT json_object('id',id,'created',created,'payload',payload) AS recovery FROM complaints WHERE id=123;`, sustituyendo 123 por el correlativo confirmado. En un directorio privado fuera de Git, prepara `prestador.json` con `name`, `ruc` y `address` correspondientes a la emisión y ejecuta en PowerShell 7:

   ```powershell
   Read-Host -MaskInput 'Clave de cifrado de la versión original' |
     node backend/recover-complaint.mjs 'C:\ruta-privada\hoja-cifrada.json' 'C:\ruta-privada\constancia.txt' 'C:\ruta-privada\prestador.json'
   ```

   Guarda la constancia con permisos restringidos y elimina copias de trabajo conforme al procedimiento aprobado. Anota en el registro privado cuándo se atendió, la respuesta y su constancia de entrega. Cualquier restauración de D1 requiere preservar las filas más nuevas y la secuencia de correlativos. [Recuperación D1](https://developers.cloudflare.com/d1/reference/time-travel/)

3. **NO-GO · Texto legal y prueba real. Propietario:** aprueba el aviso para JC ESTRATEGIA Y DISEÑO INTEGRAL E.I.R.L., RUC 20615315525, correo `hola@juancapower.com`. El texto ya describe registro cifrado, antispam, copia, aviso y dos años de archivo del Libro. Confirma la identidad y registro aplicable de cada banco, encargados, ubicaciones y garantías de transferencias de hosting, agenda, mensajería, Libro y correo. Aprueba además los plazos de conservación de consultas, reservas y contratación y quién atenderá derechos. No se fija un plazo comercial sin aprobación. Las propuestas individuales deben confirmar alcance, duración, precio total, impuestos, cancelación, reprogramación y devoluciones. [Reglamento de protección de datos](https://www.gob.pe/institucion/anpd/normas-legales/6554453-n-016-2024-jus)

   **Prueba real propuesta, pendiente de autorización de destinatarios.** Acordar un alias propio distinto de `hola@juancapower.com`, texto sintético y ventana UTC máxima de una hora. Mantén Pages apagado para este flujo. Añade temporalmente `localhost` al widget y `http://localhost:4321` a los orígenes autorizados. Configura `CONTROLLED_TEST_ONLY=true`, `CONTROLLED_TEST_FROM`, `CONTROLLED_TEST_UNTIL`, `CONTROLLED_TEST_EMAILS` como secreto y solo después habilita las banderas necesarias de la prueba. Construye y abre en localhost:

   ```powershell
   $env:COMPLAINTS_ENABLED = '1'
   $env:COMPLAINTS_SENDS_APPROVED = '1'
   $env:COMPLAINTS_LEGAL_APPROVED = '1'
   npm run build
   npm run preview -- --port 4321
   # http://localhost:4321/juancapower-web-v2/libro-de-reclamaciones/
   ```

   Registra una queja o un reclamo sintético. Confirma token real de Turnstile, una fila D1, correlativo, impresión y descarga, copia íntegra recibida por el alias y aviso recibido por el responsable. Fuerza un segundo caso controlado con `LIVE_SENDS_ENABLED=false`: debe registrar y entregar constancia con correo pendiente. Reintenta el mismo POST con token nuevo y mismos datos e ID, sin otro correlativo. Verifica rechazo de origen y destinatario ajenos. Recupera de forma privada la hoja de prueba y concilia los estados. Apaga las flags y retira origen, hostname, ventana y allowlist temporales. Confirma de nuevo 503 en el origen autorizado. Conserva evidencia privada sin PII pública. Acordar el tratamiento de las filas de prueba antes de ejecutarlas.

   **POWER 4 permanece anónimo.** Las listas 15 (Leads web) y 16 (Marketing confirmado) existen. Los siete atributos `POWER4_*` definidos en `backend/README.md` siguen ausentes en la consulta de Brevo. Configúralos en esa cuenta, junto con una plantilla DOI propia y URL de confirmación aprobadas. Revisa automatizaciones asociadas, bajas y permisos separados. En `power4-capture`, usa su propio widget y sus secretos, `PRIVACY_VERSION` y `LEDGER_RETENTION_DAYS` aprobados. Realiza una prueba controlada separada antes de abrir captación. El Libro y Pages pueden lanzarse con POWER 4 anónimo.

4. **PASS técnico · Build raíz.** El canónico se mantiene en `https://www.juancapower.com`. Staging mantiene `noindex,nofollow` y el Libro apagado. En el build raíz el footer apunta a `/libro-de-reclamaciones/`. Se conservan los alias históricos con salto HTML y enlace de respaldo. La comprobación de producción exige `READY` versión 2 del Worker desde el Origin canónico, con lectura de D1 y banderas, sin escribir ni enviar. Este control no sustituye la prueba real de Turnstile y correo.

5. **NO-GO · Verificación del dominio. Propietario:** verifica en GitHub → Settings de la cuenta → Pages si `juancapower.com` está verificado. La API devolvió `protected_domain_state: null`; si no figura verificado, crea en Squarespace únicamente el TXT exacto que GitHub genere, valida y consérvalo. El propietario confirmó mantener GitHub Pages para la web de presentación y contratación externa. Verifica además si se necesita un staging alojado independiente después del traspaso: GitHub puede redirigir la URL `github.io` del repositorio vinculado hacia su dominio. El artefacto de CI sigue disponible para revisión no indexable. [Verificar dominio](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages) · [Condiciones de GitHub Pages](https://docs.github.com/en/site-policy/github-terms/github-terms-for-additional-products-and-features)

   **Inventario público actual.** Nameservers `ns-cloud-c1` a `ns-cloud-c4.googledomains.com`; no transferir DNS. Apex A `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` (TTL observado 1800); sin AAAA ni CAA en consulta pública. `www` CNAME `juancapower.github.io` (1800). Correo apex MX prioridad 1 `smtp.google.com` (3600); SPF TXT `v=spf1 include:_spf.google.com ~all` (3600); `google._domainkey` TXT DKIM publicado (3600); `_dmarc` TXT `v=DMARC1; p=none; rua=mailto:hola@juancapower.com` (1800). **Propietario:** conserva un respaldo del panel DNS completo, incluidas verificaciones y selectores adicionales que no aparecen por consulta pública. Mantén A, CNAME de www, NS, MX, SPF, DKIM y DMARC; la asignación del dominio se cambia en GitHub. [DNS de Squarespace](https://support.squarespace.com/hc/en-us/articles/31119879125645-DNS-records-for-web-hosting) · [Dominio y HTTPS en GitHub Pages](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)

6. **PENDIENTE · Traspaso controlado. Propietario:** autoriza la ventana y el SHA exacto tras aprobar 2, 3 y 5. Integra primero el PR de preparación y exige CI verde del SHA en `main`. Detén otros despliegues y guarda copia del último artefacto estable de cada repositorio. Las órdenes siguientes son para esa ventana; requieren GitHub CLI autenticado con administración y Pages. Completa los cuatro valores con información aprobada. El SHA bloquea temporalmente la publicación automática de staging y habilita solo ese commit en el workflow manual.

   ```powershell
   $old = 'juancapower/soy.juancapower'
   $new = 'juancapower/juancapower-web-v2'
   $sha = gh api "repos/$new/commits/main" --jq '.sha'
   gh run list -R $new --branch main --commit $sha --status success --limit 5
   gh api "repos/$old/pages" | Set-Content pages-anterior.json -Encoding utf8
   gh api "repos/$new/pages" | Set-Content pages-nuevo.json -Encoding utf8
   gh variable set PUBLIC_COMPLAINTS_API -R $new --body 'https://juancapower-complaints.juan-cabrera-1db.workers.dev/v1/complaints'
   gh variable set PUBLIC_TURNSTILE_COMPLAINTS_KEY -R $new --body '0x4AAAAAAF1rXQNGtCgN_DjH'
   gh variable set LEAN_PRIVACY_DISCLOSURE -R $new --body (Read-Host 'Texto público aprobado de bancos, proveedores y transferencias')
   gh variable set LEAN_CONTACT_RETENTION -R $new --body (Read-Host 'Texto público aprobado de conservación')
   gh variable set LEAN_RELEASE_APPROVED_SHA -R $new --body $sha
   gh run list -R $new --branch main --status in_progress
   ```

   El SHA `67db41efb3cbd72553c509af2b47e68056075323` pertenece a la versión anterior. Aprueba el nuevo SHA de `main` tras integrar este PR. Solo en la ventana autorizada, tras aprobar las pruebas reales y los textos, configura en el Worker del Libro `ALLOWED_ORIGINS=https://www.juancapower.com`, `CONTROLLED_TEST_ONLY=false`, `COMPLAINTS_ENABLED=true`, `LEGAL_APPROVED=true`, `COMPLAINTS_RETENTION_APPROVED=true` y `LIVE_SENDS_ENABLED=true`. Confirma `curl.exe -fSs -H 'Origin: https://www.juancapower.com' 'https://juancapower-complaints.juan-cabrera-1db.workers.dev/v1/complaints/health'` → `READY` versión 2. Cuando no queden ejecuciones activas y la verificación de dominio esté aprobada, traspasa el dominio. Si algún comando falla, detén el corte y aplica el paso 8 si ya quitaste la asignación anterior.

   ```powershell
   '{"cname":null}' | gh api --method PUT "repos/$old/pages" --input -
   '{"cname":"www.juancapower.com"}' | gh api --method PUT "repos/$new/pages" --input -
   gh api "repos/$new/pages" --jq '{cname,html_url,https_enforced,certificate:.https_certificate.state}'
   gh workflow run production.yml -R $new --ref main
   gh run list -R $new --workflow production.yml --commit $sha --limit 1
   ```

   Vigila la ejecución por ID con `gh run watch <ID> -R $new --exit-status`. Cuando el certificado esté disponible, activa **Enforce HTTPS** en Settings → Pages o ejecuta `'{"https_enforced":true}' | gh api --method PUT "repos/$new/pages" --input -`. El certificado puede tardar; el sitio puede servir una versión intermedia durante el traspaso. Si falla TLS, el despliegue o la Home en la ventana acordada, vuelve al sitio anterior. [API de Pages](https://docs.github.com/en/rest/pages/pages#update-information-about-a-github-pages-site)

7. **PENDIENTE · Verificación después del corte.** Comprueba HTTP → HTTPS, apex → www, certificado válido, canonical de cada ruta, sitemap y ausencia de `noindex` en rutas públicas. Recorre Home, Coaching, Speaker, test anónimo, Comunidad, Recursos, Contacto, privacidad, condiciones, Libro y alias. Prueba Calendar, WhatsApp, redes y Libro sin enviar datos fuera de la prueba autorizada. **Propietario:** prueba recepción y envío de correo corporativo desde una cuenta externa y confirma continuidad. Envía el sitemap a Search Console cuando todo pase.

   ```powershell
   curl.exe -IL --max-time 20 http://juancapower.com/
   curl.exe -fSs https://www.juancapower.com/robots.txt
   curl.exe -fSs https://www.juancapower.com/sitemap.xml
   curl.exe -fSs https://www.juancapower.com/ | Select-String -Pattern 'canonical|noindex'
   Resolve-DnsName juancapower.com -Type MX -Server 1.1.1.1
   Resolve-DnsName juancapower.com -Type TXT -Server 1.1.1.1
   Resolve-DnsName google._domainkey.juancapower.com -Type TXT -Server 1.1.1.1
   Resolve-DnsName _dmarc.juancapower.com -Type TXT -Server 1.1.1.1
   ```

8. **PREPARADO · Rollback.** Ante fallo crítico, apaga primero `COMPLAINTS_ENABLED` y `LIVE_SENDS_ENABLED`, activa el Libro de respaldo y conserva D1. Después espera a que el despliegue en curso termine o detenlo desde Actions con autorización del propietario. Deshabilita Pages en el repositorio nuevo si ya sirvió el artefacto indexable, para evitar exponerlo bajo `github.io`, y devuelve el dominio al anterior. Si el nuevo nunca publicó y solo se cambió su asignación, basta con retirar esa asignación en Settings → Pages. El DNS y el correo conservan los mismos registros. El repositorio anterior conserva su código y artefacto.

   ```powershell
   gh api --method DELETE "repos/$new/pages"
   '{"cname":"www.juancapower.com"}' | gh api --method PUT "repos/$old/pages" --input -
   gh api "repos/$old/pages" --jq '{cname,html_url,https_enforced,certificate:.https_certificate.state}'
   curl.exe -IL --max-time 20 https://juancapower.com/
   gh variable delete LEAN_RELEASE_APPROVED_SHA -R $new
   ```

   Si el anterior no vuelve a servir su artefacto, ejecuta su último workflow estable desde Actions. Cuando el certificado esté disponible, restablece HTTPS con `'{"https_enforced":true}' | gh api --method PUT "repos/$old/pages" --input -` si quedó desactivado. Tras recuperar producción y TLS, reactiva Pages del repo nuevo con origen **GitHub Actions**, sin dominio personalizado, y ejecuta `gh workflow run pages.yml -R $new --ref main`. Comprueba que el staging vuelve con `noindex`. Conserva el historial y las constancias del Libro aunque la web revierta.
