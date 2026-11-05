# JUA-37 / JUA-39 · matriz de preparación Perú

Fecha: 05/11/2026. PR posterior al merge #10. **No es GO-LIVE ni dictamen jurídico.** Responsable efectivo todavía sin identificar. Los textos visibles son borradores señalados; captación, Libro y seguimiento real OFF. No se cambia dominio/DNS/CNAME/noindex. No precios ni testimonios.

## Fuentes y alcance de verificación

- Ley 29733 y DS 016-2024-JUS, referencias ANPD de JUA-37: https://www.gob.pe/institucion/anpd/normas-legales/6554453-n-016-2024-jus y registro RNPD https://www.gob.pe/8060-inscribir-banco-de-datos-en-el-registro-nacional-de-proteccion-de-datos-personales . El acceso directo en esta ejecución devolvió 418 y el PDF 403; **no se declara revisión íntegra del articulado**. Debe completarla asesoría peruana. No se reutiliza como vigente el reglamento anterior.
- [Indecopi, Libro de Reclamaciones](https://consumidor.gob.pe/libro-de-reclamaciones/): consultado, registro/numeración, información del proveedor/consumidor, detalle y pedido, copia imprimible/enviable y respuesta máxima de 15 días hábiles improrrogables. No se condiciona a marketing ni pago.
- [Ley 32495](https://busquedas.elperuano.pe/dispositivo/NL/2457203-1), publicada 11/11/2025: consultada, incluye plataformas digitales de comercio electrónico y enlace permanente visible. Aplicabilidad a este flujo de oferta/contratación externa por confirmar, no presumir exención por usar WhatsApp/Calendar.
- [RM 244-2026-PCM](https://www.gob.pe/institucion/pcm/normas-legales/8406634-244-2026-pcm): búsqueda oficial identifica publicación de **proyecto** de modificación del reglamento el 17/07/2026; no se trata ese proyecto como norma aprobada. Revalidar adecuaciones vigentes al momento del lanzamiento.
- [Metricool, uso de cookies](https://help.metricool.com/use-of-cookies-in-metricool-v5dg7): consultado; tracker sin cookies según proveedor, sí conexión de medición. Se exige consentimiento analítico por decisión expresa del propietario; no confundir sin cookies con ausencia de tratamiento.
- [Meta, consentimiento](https://developers.facebook.com/docs/meta-pixel/implementation/gdpr) y [cookies](https://www.facebook.com/privacy/policies/cookies/): acceso de documentación técnica limitado 429 en esta ejecución; deben confirmarse inventario real, configuración de eventos automáticos y comportamiento de revocación en prueba autorizada. Los tests de este PR usan scripts simulados, no prueban el comportamiento interno actual del proveedor.

## Matriz de obligaciones / puerta de lanzamiento

| ID | Requisito / aplicabilidad | Severidad | Estado | Evidencia / acción pendiente | Responsable |
|---|---|---|---|---|---|
| L01 | Identidad del prestador y responsable, RUC/domicilio/canal | Alta | BLOCKED | No inferidos; completar aviso legal y políticas antes de activar | Propietario + asesoría |
| L02 | Privacidad, información por finalidad y derechos ARCO/retiro | Alta | BLOCKED | Borrador implementado; faltan identidad, bases, plazos normativos/procedimiento operativo y revisión | Propietario + asesoría |
| L03 | Contacto, marketing y cuatro puntajes separados | Alta | PASS técnico / BLOCKED activación | PR #10 integra casillas específicas; revisión de potencial perfil sensible, versión/texto/hash y prueba real pendientes | Asesoría + Codex |
| L04 | Bancos de datos, registro RNPD, encargados y transferencias | Alta | BLOCKED | Definir bancos/finalidades/titular, contratos, países/subencargados y garantías | Propietario + asesoría |
| L05 | CMP, no scripts antes de permiso, retirada | Alta | PASS sintético / BLOCKED proveedor real | Tests de red con mocks, configuración de publicación OFF; verificar proveedores reales antes de activar | Codex + propietario |
| L06 | Exclusión de test/captación/PII del tracking | Alta | PASS técnico | Allowlist de rutas sin formularios; ninguna URL con query/hash; Meta autoConfig false sin advanced matching; test y reclamaciones siempre excluidos | Codex |
| L07 | Condiciones comerciales y derechos del consumidor | Alta | BLOCKED | Duración/entregables/precio total/tributos/cuotas/modalidad/cancelación/reprogramación/devoluciones no definidos definitivamente | Propietario + asesoría |
| L08 | Libro aplicable a operación comercial | Alta | BLOCKED real / PASS sintético | Formato, correlativo, persistencia cifrada, copia y notificación implementados; faltan identidad, aplicabilidad, proveedor real, retención, atención y prueba real | Propietario + Codex |
| L09 | Atención en 15 días hábiles improrrogables cuando aplica | Alta | BLOCKED | Operador, suplente, calendario de feriados y control de vencimientos/respuesta aún sin asignar; no lo automatiza este PR | Propietario |
| L10 | Infraestructura, incidentes, eliminación/backups y trazabilidad | Alta | BLOCKED | Backend no desplegado; permisos, claves, retención, runbook y pruebas reales por aprobar | Propietario + Codex |
| L11 | Staging seguro | Alta | PASS | noindex, sin CNAME, proveedores OFF en build normal; pruebas y workflow en PR | Codex |
| L12 | Cambio de dominio / GO-LIVE | Crítica | BLOCKED | JUA-39 requiere aprobaciones legales/comerciales/operativas y permiso de fotos; no se autoriza en este sprint | Propietario |

## Datos que debe confirmar el propietario

| Dato | Falta decidir / confirmar |
|---|---|
| Identidad | Persona natural o empresa que contrata/factura; nombre legal completo, RUC, domicilio y establecimiento aplicable |
| Derechos y reclamos | Confirmar hola@juancapower.com como canal, persona titular/suplente, acceso al buzón, procedimiento y control de plazos |
| Datos | Retención por finalidad (leads, consentimientos, CRM, correo, reclamaciones, backups); bancos e inscripción; menores y representación |
| Proveedores | Cuenta y región Cloudflare, contratos/transferencias/subencargados Brevo/Cloudflare/GitHub/Meta/Metricool/Calendar/WhatsApp |
| Comercio | Alcance y entregables ACTIVA/EXPANDE, precio total y tributos, cuotas, pago, modalidad/lugar, disponibilidad, cancelación, reprogramación y devoluciones |
| Consentimiento | Textos/versiones aprobados; duración de preferencias (180 días es propuesta técnica, no obligación legal); tratamiento de puntajes vinculados y DOI |
| Libro | Aplicabilidad/formatos vigentes, atención efectiva, conservación, respuesta y constancia; no basta un enlace al formulario |

## Estado real del Libro

Código funcional probado con SQLite/D1 simulado y correo mock. Recepción real OFF, sin infraestructura. Campos: correlativo/fecha/proveedor; nombre/documento/domicilio/correo/teléfono y representante si menor; servicio/monto; reclamo o queja/detalle/pedido. Copia imprimible/descargable al confirmar persistencia, no tras un mero clic. No adjuntos ni marketing. Notificación incierta conserva registro y requiere conciliación, sin reenvío automático. Falta confirmar formato/aviso oficial, operación de respuesta, archivo y acceso de fiscalización; no se afirma Libro legal operativo ni recepción en buzón.
