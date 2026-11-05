# Preparación legal y consentimiento · informe de revisión

## Etapa 1 completada

PR #10 revisado de nuevo: SHA exacto baccace35d62e25ce1bfeac4097c9936daaaaa7b, sin commits inesperados; CI 41984775117 success, build y capture-synthetic. main protegido (build estricto, admins incluidos, conversaciones resueltas); integración por squash sin bypass. Merge **28fc09767e6e90147b5ecee65d5f6b237147fc50**. Workflow Pages **42034458938 success** (build, capture-synthetic y deploy).

Prueba pública en https://juancapower.github.io/juancapower-web-v2/test-power4/ : HTTPS, noindex, ausencia de capture-entry y llamadas Brevo/Cloudflare/trackers, 16 respuestas sintéticas a lo largo de cuatro pasos y cuatro resultados visibles. Test anónimo operativo. No despliegue Worker/D1/Turnstile, conexión real CRM o envíos. DNS/CNAME/repositorio anterior intactos.

## Nuevo PR independiente

Privacidad/cookies/condiciones desarrolladas como borradores veraces; Aviso legal y Libro enlazados permanentemente en footer. Gestor con aceptar/rechazar/configurar equivalentes, categorías independientes y desmarcadas, versión/fecha local, caducidad y retirada. Meta y Metricool preparados con los IDs suministrados, pero proveedor real OFF hasta gate legal y opt-in. No noscript beacon, advanced matching o eventos de test. El test/contacto/Libro/legal y URLs con parámetros nunca cargan tags.

Libro: Worker separado, esquema D1, validación/antispam/límites/cifrado, correlativo persistente, idempotencia, copia imprimible/descargable y notificaciones. Default OFF; sin provisión de recursos ni recepción real. Estados inciertos requieren conciliación; no se afirma entrega por API 2xx. Retención/operador/formato/funcionamiento real pendientes. Datos .invalid y RUC de ceros son fixtures marcados, no información fiscal del propietario.

## Evidencia y límites

- Astro check sin errores, build raíz/base, chequeo estático, noindex, enlaces y presupuesto JS.
- Tests backend de POWER4 y Libro: 15 casos; pruebas legales/CMP y Libro sintético: 23; flujo captación sintética: 10; regresión normal ampliada: 138.
- Cinco anchos en Libro (360/390/768/1024/1440), políticas/CMP a 390/1440, axe y foco/teclado. Revisión visual de screenshots completa y de diálogos/viewport. Evidencias en CI, no gráficos pesados añadidos al repositorio.
- Los scripts de proveedores y correos se sustituyen por mocks en E2E. Ningún dato se ha enviado a Brevo/Meta/Metricool para probar. No prueba el comportamiento interno real de los proveedores, la entrega al buzón, ni el cumplimiento normativo final.
- Brevo vía navegador: una automatización activa #1, solo lista Ikigai #4, con envío tras un minuto. Revisada sin cambios; no se presume que los nuevos leads estén libres de otros disparadores futuros.

Ver [matriz y datos pendientes](PERU-COMPLIANCE-MATRIX.md), [acciones de Codex/propietario y prueba controlada](ACTIVATION-RUNBOOK.md), [backend POWER4](../backend/README.md) y [excepción visual](../design-system/pages/legal-consent.md). Mantener JUA-37/JUA-39 abiertos: datos del responsable, revisión legal, permisos y prueba real continúan como BLOCKED antes de lanzamiento.
