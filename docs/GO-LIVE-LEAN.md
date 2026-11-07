# JuanCa Power 2.0 · Checklist GO/NO-GO

**NO-GO hasta cerrar 2, 3 y 5.** Publicación lean de marca personal, con consulta y reserva externas, test anónimo y sin checkout. Brevo, captación POWER 4, rastreadores, PDF y galerías adicionales quedan fuera del lanzamiento.

1. **PASS · Accesos comerciales.** Calendar respondió 200 sin inicio de sesión y mostró «Citas Power». Abrir la agenda no crea una reserva. WhatsApp redirigió a `api.whatsapp.com/send` con `phone=51963335717`; no se envió mensaje. La versión nueva añade acceso flotante e iconos locales de TikTok e Instagram. **Propietario:** confirma disponibilidad real, zona horaria de Lima, avisos de citas y operación del canal durante el lanzamiento.

2. **NO-GO · Libro funcional, sin Brevo. Propietario:** elige y autoriza un Libro virtual administrado que funcione por enlace HTTPS directo, sin cuentas para el consumidor ni integración CRM. Entrega el enlace al formulario y al aviso de privacidad del Libro. Como candidato para evaluar, [Reclamo Virtual](https://reclamovirtual.pe/como-funciona/) documenta enlace propio, constancia, avisos y exportación. Revisa su contrato, proveedores y transferencias, y valida el correo con copia conforme a la norma. No hay servicio contratado. El generador oficial de Indecopi sirve para obtener formatos y aviso, no acredita por sí solo recepción o custodia digital. El footer de producción enlaza directamente al formulario. La página informativa del Libro se conserva. Valida también el aviso visible de acuerdo con el Anexo II. El correo queda como consulta. Antes de aprobar, prueba desde móvil y escritorio con una hoja de prueba acordada en el entorno del proveedor: reclamo y queja, datos del prestador y campos del Anexo I, fecha y correlativo único, copia inmediata descargable o imprimible y copia por correo, bandeja del responsable y exportación. Verifica archivo por dos años desde el registro, respaldo durante indisponibilidad, acceso restringido, respuesta por escrito en hasta 15 días hábiles improrrogables y evidencia de entrega. Define titular y suplente de atención y escalamiento. El Worker actual de reclamaciones queda desactivado. [Libro y formatos de Indecopi](https://consumidor.gob.pe/libro-de-reclamaciones/) · [Reglamento del Libro, art. 12](https://www.gob.pe/institucion/indecopi/normas-legales/3462732-decreto-supremo-n-011-2011-pcm)

3. **NO-GO · Aprobación legal y operativa. Propietario:** valida los textos del build raíz para JC ESTRATEGIA Y DISEÑO INTEGRAL E.I.R.L., RUC 20615315525 y `hola@juancapower.com`. El domicilio confirmado está en Privacidad y Libro. Define conservación o criterio de eliminación para Calendar, WhatsApp, correo y contratación. Identifica banco(s) y registro aplicable, destinatarios, encargados, países y garantías de transferencia de hosting, agenda, mensajería, correo y Libro. Define quién atiende derechos y cómo registra solicitudes y respuestas. Suministra el texto público aprobado para las variables `LEAN_PRIVACY_DISCLOSURE` y `LEAN_CONTACT_RETENTION`. Usa propuestas individuales que indiquen alcance, entregables, duración, modalidad, precio total y tributos, pago, cancelación, reprogramación y devoluciones antes de aceptar o pagar. Confirma derechos de uso público de las fotos existentes. [Reglamento peruano de protección de datos](https://www.gob.pe/institucion/anpd/normas-legales/6554453-16-2024-jus) · [Código de Protección y Defensa del Consumidor](https://www.sat.gob.pe/TransparenciaV3/Portals/0/Docs/NormasOtrasEntidades/LEY_29571_v9.pdf)

4. **PASS técnico · Ensayo de raíz y rutas.** La identidad canónica sigue siendo `https://www.juancapower.com`. El apex redirige actualmente a `www`. El build raíz habilita indexación solo con origen exacto, base `/` y modo lean explícito. Staging mantiene `noindex,nofollow`; conceptos y 404 quedan fuera de indexación también en producción. Se conservan `/libera-tu-proposito[/]`, `/libera-tu-proposito.html`, `/ltp-2026.html` y `/powerprompts[/]` mediante páginas estáticas con salto inmediato y enlace de respaldo. GitHub Pages entrega estos alias como HTML, por lo que no equivalen a un 301/302 HTTP. El sitemap anterior listaba únicamente Home. Para ensayar el build raíz, ejecuta en PowerShell desde el checkout de revisión:

   ```powershell
   npm ci
   $env:BASE_PATH = '/'
   $env:SITE_URL = 'https://www.juancapower.com'
   $env:GO_LIVE_LEAN = '1'
   $env:LEAN_REHEARSAL = '1'
   $env:LEAN_COMPLAINTS_URL = 'https://libro.example.com/reclamos/'
   $env:LEAN_COMPLAINTS_PRIVACY_URL = 'https://libro.example.com/privacidad/'
   $env:LEAN_PRIVACY_DISCLOSURE = 'Texto sintético de revisión.'
   $env:LEAN_CONTACT_RETENTION = 'Texto sintético de revisión.'
   npm run build
   npm run check:static
   ```

   El artefacto sintético es para revisión local. Cierra esa terminal al terminar. El workflow normal publica únicamente staging con base `/juancapower-web-v2`.

5. **NO-GO · Dominio protegido y hosting aprobado. Propietario:** verifica en GitHub → Settings de la cuenta → Pages si `juancapower.com` está verificado. La API devolvió `protected_domain_state: null`; si no figura verificado, crea en Squarespace únicamente el TXT exacto que GitHub genere, valida y consérvalo. Confirma que el uso como sitio de presentación con contratación externa encaja en las condiciones de Pages antes de mover el dominio. GitHub limita Pages como alojamiento de negocios o facilitación principal de transacciones. Si el alcance comercial no encaja, conserva este build estático y cambia el destino de producción antes de autorizar el corte. Verifica además si se necesita un staging alojado independiente después del traspaso: GitHub puede redirigir la URL `github.io` del repositorio vinculado hacia su dominio. El artefacto de CI sigue disponible para revisión no indexable. [Verificar dominio](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages) · [Condiciones de GitHub Pages](https://docs.github.com/en/site-policy/github-terms/github-terms-for-additional-products-and-features)

   **Inventario público actual.** Nameservers `ns-cloud-c1` a `ns-cloud-c4.googledomains.com`; no transferir DNS. Apex A `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` (TTL observado 1800); sin AAAA ni CAA en consulta pública. `www` CNAME `juancapower.github.io` (1800). Correo apex MX prioridad 1 `smtp.google.com` (3600); SPF TXT `v=spf1 include:_spf.google.com ~all` (3600); `google._domainkey` TXT DKIM publicado (3600); `_dmarc` TXT `v=DMARC1; p=none; rua=mailto:hola@juancapower.com` (1800). **Propietario:** conserva un respaldo del panel DNS completo, incluidas verificaciones y selectores adicionales que no aparecen por consulta pública. Mantén A, CNAME de www, NS, MX, SPF, DKIM y DMARC; la asignación del dominio se cambia en GitHub. [DNS de Squarespace](https://support.squarespace.com/hc/en-us/articles/31119879125645-DNS-records-for-web-hosting) · [Dominio y HTTPS en GitHub Pages](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)

6. **PENDIENTE · Traspaso controlado. Propietario:** autoriza la ventana y el SHA exacto tras aprobar 2, 3 y 5. Integra primero el PR de preparación y exige CI verde del SHA en `main`. Detén otros despliegues y guarda copia del último artefacto estable de cada repositorio. Las órdenes siguientes son para esa ventana; requieren GitHub CLI autenticado con administración y Pages. Completa los cuatro valores con información aprobada. El SHA bloquea temporalmente la publicación automática de staging y habilita solo ese commit en el workflow manual.

   ```powershell
   $old = 'juancapower/soy.juancapower'
   $new = 'juancapower/juancapower-web-v2'
   $sha = gh api "repos/$new/commits/main" --jq '.sha'
   gh run list -R $new --branch main --commit $sha --status success --limit 5
   gh api "repos/$old/pages" | Set-Content pages-anterior.json -Encoding utf8
   gh api "repos/$new/pages" | Set-Content pages-nuevo.json -Encoding utf8
   gh variable set LEAN_COMPLAINTS_URL -R $new --body (Read-Host 'URL HTTPS del formulario aprobado')
   gh variable set LEAN_COMPLAINTS_PRIVACY_URL -R $new --body (Read-Host 'URL HTTPS de su privacidad')
   gh variable set LEAN_PRIVACY_DISCLOSURE -R $new --body (Read-Host 'Texto público aprobado de bancos, proveedores y transferencias')
   gh variable set LEAN_CONTACT_RETENTION -R $new --body (Read-Host 'Texto público aprobado de conservación')
   gh variable set LEAN_RELEASE_APPROVED_SHA -R $new --body $sha
   gh run list -R $new --branch main --status in_progress
   ```

   Cuando no queden ejecuciones activas y la verificación de dominio esté aprobada, traspasa el dominio. Si algún comando falla, detén el corte y aplica el paso 8 si ya quitaste la asignación anterior.

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

8. **PREPARADO · Rollback.** Ante fallo crítico, espera a que el despliegue en curso termine o detenlo desde Actions con autorización del propietario. Deshabilita Pages en el repositorio nuevo si ya sirvió el artefacto indexable, para evitar exponerlo bajo `github.io`, y devuelve el dominio al anterior. Si el nuevo nunca publicó y solo se cambió su asignación, basta con retirar esa asignación en Settings → Pages. El DNS y el correo conservan los mismos registros. El repositorio anterior conserva su código y artefacto.

   ```powershell
   gh api --method DELETE "repos/$new/pages"
   '{"cname":"www.juancapower.com"}' | gh api --method PUT "repos/$old/pages" --input -
   gh api "repos/$old/pages" --jq '{cname,html_url,https_enforced,certificate:.https_certificate.state}'
   curl.exe -IL --max-time 20 https://juancapower.com/
   gh variable delete LEAN_RELEASE_APPROVED_SHA -R $new
   ```

   Si el anterior no vuelve a servir su artefacto, ejecuta su último workflow estable desde Actions. Cuando el certificado esté disponible, restablece HTTPS con `'{"https_enforced":true}' | gh api --method PUT "repos/$old/pages" --input -` si quedó desactivado. Tras recuperar producción y TLS, reactiva Pages del repo nuevo con origen **GitHub Actions**, sin dominio personalizado, y ejecuta `gh workflow run pages.yml -R $new --ref main`. Comprueba que el staging vuelve con `noindex`. Conserva el historial y las constancias del Libro aunque la web revierta.
