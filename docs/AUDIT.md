# Auditoría de referencia · 01/11/2026 (America/Lima)

Fuente leída: juancapower/soy.juancapower, main SHA 927f34416ac4d552c30d250f7784a7675f446749. Solo lectura mediante GitHub API de archivos públicos seleccionados. No checkout editable, push, settings ni DNS del antiguo sitio. Sitio: https://www.juancapower.com/ (la lectura HTML del sitio por sí sola no muestra su interfaz React).

## Arquitectura observada
React 19 + Vite, Tailwind 4, motion/react; App.tsx usa pathname, history.pushState y efectos de metadatos. El workflow copia index.html como entradas SPA; postbuild y enlaces legados requieren revisión posterior. Canonical fijado al dominio actual. No se hereda el mecanismo SPA.

## Hallazgos no trasladados
- index.html carga Meta, TikTok y Metricool sin condición previa de consentimiento visible en ese archivo.
- vite.config.ts define process.env.GEMINI_API_KEY para el cliente. Esto prueba una configuración de riesgo, NO que haya un secreto publicado. No se consultó .env ni se recuperaron credenciales.
- HeroSection contiene +300 y +50 sin evidencia adjunta en los archivos revisados. Se omiten.
- Conviven formulaciones históricas de método y especialidades. Para la web nueva prevalece el brief POWER 4.

## Activos reutilizados
| Local | Origen público real | Uso |
| --- | --- | --- |
| public/images/juanca-escenario.webp | Cloudinary ddn6qh7ve / v1775514826/escenario_naywym.png, TrabajaConmigoSection/SpeakerSection | Hero; JuanCa con micrófono y asistentes |
| public/images/juanca-taller.webp | Cloudinary ddn6qh7ve / v1776364279/CajaArequipa_Piura2_hw7due.jpg, SpeakerSection | Entrada speaker |
| public/images/isotipo.png | Cloudinary ddn6qh7ve / v1783016428/Favicon_JuanCaPower_w4zc3b.png, HomeNavbar | Identidad oficial |

Copias optimizadas servidas localmente, sin enlace de imagen externo. Son fotografías ya utilizadas por el propietario; no se infiere aval de organizaciones ni licencia de terceros. Revisar aprobación final de selección/recorte. No se utiliza JuanCaPower_Hero por no poder demostrar que es una fotografía sin generación.

## Contacto recuperado
Agenda Google Calendar: AcZssZ3Cfa-gmREBDeKuFMB1kPZ1APs09ssHUnVAYXU1hEqtj62KyE6vQZtEok2A7YgWbNdkMDbb1suK. WhatsApp 51963335717. Email hola@juancapower.com. Fuente: TrabajaConmigoSection, MentoriaEditorialSection, SpeakerSection. Su presencia en código no prueba cupos, recepción ni reserva; verificar operativamente sin enviar mensajes de prueba sin autorización. No publicar duración, gratuidad ni modalidad de la orientación como confirmadas.

## Acceso
Primer intento CLI en conexión restringida: `error connecting to api.github.com` y auth reportó token inválido. Repetición con red autorizada: autenticación juancapower válida y creación exitosa del repositorio nuevo. No fue necesario cambiar credenciales.
