# JUA-61 · Brevo / Cloudflare y prueba controlada

**Preparación, sin activar ni contratar.** Cuenta confirmada por propietario: JuanCa Power, hola@juancapower.com. No copiar credenciales a chat/Git/frontend/logs. Ver backend/README.md para variables y comandos del Worker POWER 4. Este documento no autoriza pruebas reales.

## Inspección Brevo · 05/11/2026

El conector devolvió error interno (-32603) al consultar guía y cuenta; no se usaron claves ni API alternativas. Se pudo revisar la sesión del navegador en cuenta «Juanca Power» **solo lectura**:

- Automatizaciones https://app.brevo.com/automation/automations : Todo 1, Activo 1, En pausa 0, Inactivo 0.
- «Mensaje de bienvenida», escenario ID 1 https://app.brevo.com/automation/edit/1 , activo.
- Disparador visible: contacto añadido a «Recursos Gratuitos - Ikigai» **lista #4** → esperar 1 minuto → enviar email de bienvenida/ebook.
- No se modificó, probó, pausó o activó nada. No se añadió contacto/lista/atributo. Estado observado no garantiza ausencia de campañas programadas ni futuras automatizaciones. Volver a revisar antes de la prueba.

**No usar lista #4 para POWER 4.** No reutilizar sus consentimientos ni incluir contactos de eventos. La creación de las listas nuevas NO se ejecutó; los IDs deben obtenerse de la cuenta, nunca usar fixtures 42/43/7 de tests.

## Separación de acciones

| Paso | Codex prepara/puede ejecutar después de autorización | Propietario realiza/autoriza personalmente |
|---|---|---|
| Legal | Reflejar datos/textos aprobados en páginas, manifest de consentimiento y versiones, probar gates | Responsable/RUC y correo ya confirmados; domicilio confirmado y limitado a Privacidad/Hoja, finalidades/retención/derechos, asesoría y formato del Libro |
| Brevo | Plan de lista/atributos/DOI, comprobar config y pruebas sintéticas; configuración solo con autorización de cambio y acceso disponible | Confirmar remitente/verificación y plan/cuotas; aprobar plantilla DOI y lista marketing, revisar/autorizar automatizaciones y canales |
| Cloudflare | Worker/D1/Turnstile preparados sin deploy; configurar bindings/variables tras permiso | Elegir cuenta/plan/región, aprobar costes/contratos/permisos y crear o introducir secretos en gestor del servidor; no pegarlos en chat |
| Seguridad | Validación, mocks, rate limits, cifrado, idempotencia, CORS y prueba de fallo | Aprobar retención, acceso de operadores, recuperación/rotación de claves, incidentes y backups |
| Prueba real | Ejecutar checklist en entorno controlado únicamente tras autorización expresa | Designar buzón de prueba propio y autorizar envíos, comprobar recepción y DOI/retirada |
| Lanzamiento | Informe PASS/FAIL/BLOCKED y rollback sin tocar DNS | Aprobar GO-LIVE y realizar personalmente DNS si corresponde en otra fase |

## Configuración Brevo preparada (no creada)

1. Lista separada **POWER 4 · Leads web**, exclusivamente contacto solicitado. Otra lista **POWER 4 · Marketing confirmado** para DOI, sin campaña automática al añadir leads. No mezclar lista #4/eventos. Guardar IDs reales solo en variables servidor.
2. Atributos personalizados: POWER4_NAME texto, POWER4_PHONE texto opcional E.164 (NO SMS/WhatsApp opt-in), POWER4_SOURCE texto POWER4_WEB, POWER4_REQUEST_ID texto, POWER4_CONTACT_CONSENT booleano, POWER4_PRIVACY_VERSION texto y POWER4_CONTACT_AT texto ISO. No guardar cuatro scores ni respuestas en atributos.
3. Plantilla DOI aprobada, remitente activo hola@juancapower.com, enlace de confirmación válido y baja efectiva. El adapter usa includeListIds únicamente para marketing DOI. No marcar como confirmado por solicitud inicial ni quitar bajas globales; comprobar comportamiento de contactos ya dados de baja.
4. Revisar TODOS los escenarios activos, filtros por atributos/listas, campañas programadas y formularios. En particular, #1 debe seguir limitado a #4; ninguna alta POWER4 puede dispararlo. No modificar automatizaciones ajenas de manera preventiva.
5. Verificar permiso transaccional y cuota, aceptación del remitente y recepción de notificación fija al propietario. No habilitar tracking de aperturas/clics en mensajes con información POWER4 sin análisis específico. No campañas ni marketing a quien no confirmó DOI.

## Cloudflare / secretos (NO desplegado)

- POWER4: backend/wrangler.jsonc, D1 backend/schema.sql, Turnstile action power4. Variables y comandos en backend/README.md. Defaults de captura/privacidad/envíos false.
- Libro independiente: backend/wrangler.complaints.jsonc, otra D1 y backend/complaints-schema.sql. Preparar `npx wrangler d1 create juancapower-complaints`, añadir binding DB y ID devuelto; `npx wrangler d1 execute juancapower-complaints --remote --file complaints-schema.sql`. NO ejecutados.
- Secretos del Libro: BREVO_API_KEY, HMAC_SECRET, ENCRYPTION_KEY, TURNSTILE_SECRET (widget action complaints). Identidad servidor PROVIDER_LEGAL_NAME, PROVIDER_RUC y PROVIDER_ADDRESS; COMPLAINTS_RETENTION_APPROVED solo tras plan de archivo aprobado. Flags COMPLAINTS_ENABLED, LEGAL_APPROVED, LIVE_SENDS_ENABLED todas false hasta prueba autorizada. ALLOWED_ORIGINS exactos. Requiere cron de limpieza de complaint_limits; no se elimina archivo de reclamos automáticamente sin política aprobada.
- Variables públicas del Libro: COMPLAINTS_LEGAL_APPROVED=1, PUBLIC_COMPLAINTS_API HTTPS, PUBLIC_TURNSTILE_COMPLAINTS_KEY, PUBLIC_PROVIDER_LEGAL_NAME/RUC/ADDRESS; coherentes con servidor y textos. No habilitarlas mientras páginas sean borradores.
- Aplicar separación staging/producción, CORS exacto, controles de acceso D1/secretos, región y backups aprobados, observabilidad sin payload/PII. Usar workers.dev, sin DNS. Tokens limitados a Workers/D1/Turnstile; no dar permisos de zona ni compartir claves en chat.
- Costes: verificar el día de contratar. Referencias oficiales https://developers.cloudflare.com/workers/platform/pricing/ y https://developers.cloudflare.com/turnstile/plans/ ; Workers Free con cuotas, Paid desde US$5/mes + consumo según consulta previa; D1 y Brevo tienen límites propios. No se presupone coste cero ni capacidad suficiente sin medir CPU/almacenamiento. No se creó ni contrató recurso.

## Procedimiento reproducible de prueba real (PENDIENTE de permiso)

1. Registrar autorización: entorno y versiones/SHA exactos, cuenta y IDs reales, dirección de prueba controlada por propietario, destinatario hola@juancapower.com, finalidades y número limitado de envíos. **.invalid solo sirve para mocks; la prueba de recepción usa un alias de un buzón real del propietario**, con nombre/datos sintéticos. No usar datos de terceros.
2. Verificar flags OFF → 503 sin escritura/envíos; snapshot de listas/escenarios, ausencia de campañas y remitente. Preparar rollback, acceso al buzón y registro de referencia sin PII pública.
3. Habilitar SOLO entorno controlado autorizado. Completar los cuatro pasos con respuestas sintéticas conocidas (valor 3 en 16 ítems → 12/20 en cada dimensión). Primero probar anónimo: cero contacto/correo; luego solicitud con contacto y compartir scores marcado, marketing desmarcado.
4. Confirmar una sola alta en Leads web por correo, fuente/request ID/versión y fecha; sin lista #4 ni marketing; notificación real recibida en hola@juancapower.com con cuatro 12/20 y sin respuestas individuales. API 2xx o accepted NO demuestra llegada al buzón. No fotografiar PII en artifacts públicos.
5. Repetir misma solicitud/id: no segunda notificación ni alta duplicada. Probar error antes del proveedor y error incierto después: resultados y reserva disponibles; review_required requiere conciliación por request ID antes de reenvío manual. Fallo abrupto en processing también exige revisión.
6. En caso separado autorizado, marcar marketing: comprobar DOI al alias, que antes de confirmar NO pertenezca a marketing confirmado y que no se envíe campaña. Confirmar por el propietario y revisar ingreso a lista; probar baja y que una nueva orientación no revierta una baja previa. Sin scores autorizados, no aparecen scores en correo/CRM.
7. Retiro/supresión: solicitar desde alias controlado, verificar identidad de forma proporcional, retirar marketing sin bloquear contacto solicitado, atender eliminación por finalidad en CRM/D1/buzón y política de backups; distinguir evidencia de consentimiento y archivo legal que deba conservarse. Registrar decisión y plazos legales validados. No borrar contactos de eventos ni registros ajenos.
8. Libro, si aplica: prueba separada autorizada y marcada, correlativo único, persistencia cifrada y copia íntegra/impresión, notificación real al operador y copia al alias; simular fallo y conciliar sin duplicación. Designar operador/suplente y alarma de 15 días hábiles con calendario peruano aprobado. Registrar respuesta y su recepción; el código no genera una respuesta de fondo automáticamente.
9. Apagar flags al terminar; informe con fecha, SHA, entorno y PASS/FAIL/BLOCKED. Autorización adicional para apertura pública. No cambiar DNS ni retirar noindex.

## CMP y rastreadores

Publicación normal: TRACKING_LEGAL_APPROVED ausente/false; sin banner inicial de permiso ficticio, preferencias accesibles en footer. Ningún script de Metricool/Meta se solicita. Demo CI/localhost CONSENT_PREVIEW=1 usa proveedores simulados y no cuenta como tráfico real. Para activación futura, revisar textos e inventario real, aprobar versión PUBLIC_CONSENT_VERSION (no DRAFT/PENDING) y duración PUBLIC_CONSENT_MAX_DAYS, positivo y aprobado (sin valor por defecto operativo), después TRACKING_LEGAL_APPROVED=1. Aun con esa variable, hace falta opt-in por categoría.

Retirada: guardar elección, Meta consent revoke y limpieza accesible _fbp/_fbc, recarga completa que elimina contexto de scripts. No se garantiza deshacer datos ni peticiones ya iniciadas; verificar comportamiento real/on-unload y cookies externas antes de aprobar. No hay mecanismos de evasión de consentimiento. PageView sin eventos/PII; autoConfig false, no advanced matching ni Event Setup Tool en captación. Test/contacto/Libro/legal y URLs con query/hash están fuera de allowlist. No se integra CAPI.

Si el navegador impide guardar el retiro, se intenta borrar la preferencia y se recarga con ?privacy=off para bloquear cargas en ese documento incluso si quedó una preferencia anterior. Borrar/permitir preferencias en el navegador antes de abandonar esa URL si el almacenamiento está completamente bloqueado. No se transmite ese parámetro a rastreadores.

Actualización del propietario: JC ESTRATEGIA Y DISEÑO INTEGRAL E.I.R.L. / RUC 20615315525 / marca JuanCa Power; canal oficial de privacidad, derechos y reclamos hola@juancapower.com. Usar estos datos reales en la configuración futura del Libro, nunca fixtures. Domicilio fiscal confirmado y publicado únicamente en Privacidad/Libro; no añadir al footer o páginas comerciales. Revisión mínima indispensable con textos breves.

Preferencias en build normal de staging: sessionStorage, solo sesión de pestaña. No se fija un plazo persistente sin aprobación. La demo sintética usa 180 días exclusivamente como fixture para probar caducidad; no configura la política de producción. Para tracking real se exige duración positiva aprobada además de versión/gate legal y opt-in.
