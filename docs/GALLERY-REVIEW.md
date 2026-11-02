# Galería editorial · Stage Presence aprobada

La dirección A está aprobada. Esta iteración integra su hero en la Home de la rama y perfecciona únicamente la experiencia fotográfica. Conserva paleta, tipografía, jerarquía, método POWER 4 y alternancia de capítulos claros/oscuros. B se conserva como archivo de exploración.

## Composición y decisión visual

Ocho fotografías auténticas, seleccionadas del cloud `ddn6qh7ve`. El auditorio vertical abre como protagonista; escenario y trabajo con equipos construyen contexto; un grupo amplio contrasta con una dinámica vertical; pizarra y encuentro aportan cercanía; el grupo al aire libre cierra la secuencia. No hay cuadrícula repetitiva, carrusel ni animación añadida.

En escritorio, columnas desiguales y desplazamientos verticales generan ritmo editorial. En móvil, el orden de lectura es lineal, con tres fotografías secundarias más estrechas y alineaciones alternadas. Se conserva el encuadre completo de cada original: `height:auto`, proporciones declaradas y `object-fit:contain`. No se reconstruyen rostros, no hay ampliación generativa ni fotografías artificiales.

## Evidencia visual

| Ancho | Hero | Galería |
| --- | --- | --- |
| 360 px | [Captura](gallery-review/home-360-hero.png) | [Captura](gallery-review/gallery-360.png) |
| 390 px | [Captura](gallery-review/home-390-hero.png) | [Captura](gallery-review/gallery-390.png) |
| 768 px | [Captura](gallery-review/home-768-hero.png) | [Captura](gallery-review/gallery-768.png) |
| 1024 px | [Captura](gallery-review/home-1024-hero.png) | [Captura](gallery-review/gallery-1024.png) |
| 1440 px | [Captura](gallery-review/home-1440-hero.png) | [Captura](gallery-review/gallery-1440.png) |

Home completa: [desktop](gallery-review/home-1440-full.png), [móvil](gallery-review/home-390-full.png). Estas son capturas de la implementación local real, no renders conceptuales.

## Rendimiento y accesibilidad

WebP local, tres tamaños por fotografía y selección con `srcset`/`sizes`. Las ocho imágenes se cargan de forma diferida, con dimensiones y texto alternativo; el hero aprobado mantiene sus propios recursos. Sin nuevas dependencias, rastreadores, vídeo automático, JavaScript de galería o cambios de movimiento. `prefers-reduced-motion` continúa respetado.

Peso conjunto de los archivos seleccionados por navegador en las capturas, DPR 1; no equivale al peso de la primera pantalla ni a una medición de Core Web Vitals:

| Viewport | Imágenes de galería | Proporciones |
| --- | --- | --- |
| 360 px | 191,108 bytes | 8/8 completas |
| 390 px | 196,910 bytes | 8/8 completas |
| 768 px | 266,918 bytes | 8/8 completas |
| 1024 px | 351,568 bytes | 8/8 completas |
| 1440 px | 829,470 bytes | 8/8 completas |

Presupuesto probado: menos de 350 KB en móvil DPR 1 y 1,2 MB en los otros anchos. En pantallas de alta densidad el navegador puede seleccionar versiones mayores; la suma de las ocho versiones máximas queda por debajo de 1,2 MB. [Pesos por archivo](gallery-review/image-budget.json), [geometría y recursos seleccionados](gallery-review/responsive-evidence.json).

Resultado local: **50 pruebas aprobadas**. Pruebas: build estático, rutas en raíz y subdirectorio, navegación y teclado, menú móvil, ausencia de desbordamiento horizontal, ocho imágenes con carga correcta, proporciones, enlaces comerciales y axe WCAG A/AA. Las verificaciones automáticas no sustituyen la revisión visual: se inspeccionaron las capturas desktop/móvil y las geometrías de cinco anchos. No se realizó una reserva real ni se afirma recepción comercial o aprobación legal.

## Inventarios y límites

- [Selección fotográfica](GALLERY-PHOTO-INVENTORY.md): ocho recursos, usos y calidad.
- [Testimonios](TESTIMONIAL-INVENTORY.md): cinco vídeos y cinco imágenes. Contenido, atribución y permisos pendientes. No hay testimonios en la web; los enlaces completos permanecen fuera de Git en `.private/`.
- La foto de encuentro no implica recomendación, alianza ni testimonio de la otra persona. Los rótulos son descriptivos y no añaden cifras o resultados.

## Revisión y publicación

PR #3, rama `design/sprint-1-power-presence`. Sin fusionar ni publicar esta versión. El workflow del PR entrega un build de revisión y evidencia de navegador, y omite despliegue. Main, el staging público previo y la configuración de producción permanecen intactos.

Preview local: después de `npm run build` y `npm run preview:concepts`, abrir `http://127.0.0.1:4322/juancapower-web-v2/#experiencia`.

Pendiente: revisión de la selección y composición por JuanCa antes de fusionar; validación individual de testimonios antes de cualquier publicación; validación operativa de reservas y recepción comercial. No se autoriza migrar dominio ni DNS.
