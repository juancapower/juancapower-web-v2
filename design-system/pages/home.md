# Home · Stage Presence aprobada

La aprobación del usuario del 02/11/2026 fija A como dirección oficial. Conservar el hero, paleta #0B0D17 / #4361EE / #F1E5AC, Plus Jakarta Sans, jerarquía y capítulos oscuros/claros. No trasladar B a la Home.

Hero reutilizado como StageHero.astro, con el mismo markup, fotografía, medidas y CSS de A; solo se adaptan los destinos para Home. En la rama del PR se prepara la ruta raíz. La publicación permanece pendiente de la revisión y fusión que solicite el usuario.

## Excepción localizada: galería editorial
- Ocho imágenes documentales: auditorio protagonista, escenario, trabajo corporativo, dinámica, grupo, pizarra, encuentro de evento y grupo al aire libre.
- Desktop: sistema de doce columnas con una protagonista vertical que abarca dos niveles; secundarias de anchos y alturas diferentes, desplazadas y separadas por espacio negativo. No carrusel ni cuadrícula de tarjetas repetidas.
- Móvil: secuencia de lectura única; las fotos de contexto ocupan el ancho y tres retratos cambian de escala y alineación. Sin reordenamiento visual que contradiga el DOM.
- Todas las fotografías conservan su proporción natural. Sin recorte adicional, deformación, relleno o reconstrucción facial. width/height reservan espacio, WebP, tres variantes srcset y carga lazy.
- Caption 12px/1.7, gris #535B6C sobre #F4F3EE. Alt concreto y pies neutrales; no avales, nombres de terceros o resultados inferidos.
- Solo se usan las ocho imágenes registradas en src/data/gallery.json. Los testimonios no forman parte del código ni del build.
- Presupuesto orientativo: <=1.2MB para las ocho imágenes seleccionadas a 1x en escritorio, sin contar fuente y hero; medir candidatos realmente cargados en cada ancho. La galería está bajo el primer viewport y no aumenta la imagen LCP del hero.
- Validar 360/390/768/1024/1440, proporción natural, rostros completos según la fuente, lazy-load, teclado, contraste, ausencia de terceros y movimiento reducido.
