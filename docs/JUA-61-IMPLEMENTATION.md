# JUA-61 · implementación para revisión

PR independiente posterior a la integración de PR #9 (merge 8e7a461, workflow 41980387776 y verificación pública de landing/comunidades/noindex correctos). Cuenta Brevo confirmada JuanCa Power/hola@juancapower.com; configuración real y envíos siguen sin activar.

Implementado: prefacio opcional, nombre/correo/teléfono opcional, consentimiento de contacto, marketing independiente, test anónimo y cuatro pasos intactos, confirmación de compartir cuatro scores, resultado inmediato y reserva incluso si falla servicio. No envía al empezar, solo por confirmación final. Reinicio borra datos de memoria y cancela la petición pendiente del navegador (no deshace un envío ya autorizado al servidor).

Servicio Worker, SQL D1 y adaptador HTTP Brevo completos para pruebas. Default fail closed; sin credenciales, DB real o despliegue. Captura normal de publicación desactivada. Demo localhost inyecta proveedor simulado y usa SQLite en memoria. No equivale a recepción en Brevo o inbox real.

Validación: tests backend de contrato, seguridad, cifrado, consentimientos, concurrencia/idempotencia y fallo incierto; E2E sintético captura→test→resultado→adaptador CRM→notificación, cinco anchos, axe, modo anónimo, marketing, no scores sin permiso, indisponibilidad y reintento. Capturas en artifact capture-synthetic-evidence, archivos capture-input-390/1440.png y capture-result-390/1440.png. Texto visible indica simulación local. Job de web normal conserva pruebas regresivas y artifact de publicación sin captura activa.

Instrucciones, campos CRM, costes, permisos y checklist de activación: [backend/README.md](../backend/README.md). El plan anterior en POWER4-CAPTURE-ARCHITECTURE.md permanece como arquitectura; el README identifica la adaptación: sin Queue/reintentos ciegos, revisión de estados inciertos para impedir duplicación.

Pendiente real: configuración y aprobación de privacidad, infraestructura, credenciales, lista/atributos/DOI y prueba controlada autorizada. No se han enviado datos o correos reales ni creado suscripciones. No fusionar automáticamente ni cambiar DNS/CNAME/dominio principal.

Resultados locales: 11 pruebas backend y 10 E2E sintéticas aprobadas; revisión visual de captura/resultados a 390 y 1440 px. Build normal y check estático conservan noindex y ausencia de CNAME/rastreadores/almacenamiento; captación desactivada por defecto. Regresión normal: 127 casos. CI remoto se informa en el PR tras ejecutar ambos jobs.
