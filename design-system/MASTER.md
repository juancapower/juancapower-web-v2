# JuanCa Power 2.0 · Sistema maestro

## Función y evidencia
Audiencia: personas que buscan coaching personal y responsables de conferencias/talleres. Trabajo principal: llevar a orientación; secundario: contratación speaker. CTA dominante: «Agenda una sesión de orientación». Brief del Sprint 0 prevalece sobre identidades previas: Plus Jakarta Sans única familia y dorado #F1E5AC. No precios definitivos, garantías, estadísticas ni testimonios sin verificar.

## Dirección
Cinematic contenido: fotografía real de JuanCa en un escenario, composición editorial en dos planos y titular dominante. La firma es la relación entre la acción real en la foto y «Crea el resultado» en dorado. Sin fondos generados, rostros sintéticos, glows, partículas, bento o parallax. Diales: varianza 6/10, movimiento 2/10, densidad 3/10. Se descartó superponer todo el texto en la foto: dificulta contrastes y recorte móvil; se mantiene panel de texto sólido.

## Tokens
- `--bg`: #0B0D17; `--surface`: #121622; `--text`: #F8F9FA.
- `--primary`: #4361EE; `--primary-hover`: #3854DA; `--gold`: #F1E5AC.
- `--muted`: #B7BDCE; `--line`: #343B50; `--focus`: #F1E5AC.
- Pares: texto, muted y gold sobre bg/surface; blanco sobre primary. Verificación numérica en test, AA normal >=4.5:1. Primary no se usa como texto pequeño sobre bg.

## Tipo y geometría
Plus Jakarta Sans variable, local (paquete Fontsource), font-display swap. Pesos 400–800. Display clamp(2.5rem, 4.9vw, 4.75rem), línea 1.08, tracking -0.055em. H2 clamp(2rem,3.5vw,3.25rem), cuerpo 1rem/1.7, intro 1.125rem/1.7, etiqueta .75rem con tracking .14em. Ancho 1280px; gutters 24px móvil / 48px desktop. Espaciado 8,16,24,32,48,64,96px. Dos columnas hero 1.1fr/1fr. Radios 4px botones, 0 fotografía, 8px paneles; sin sombras ornamentales.

## Componentes y estados
Header con isotipo real y texto de marca; navegación reducida, `aria-current`. En móvil menú nativo details/summary operable sin JS, CTA compacto visible. Botones/enlaces >=44px, primario azul, secundario borde, enlaces de texto subrayados. Hover cambia color/borde, active leve presión, foco contorno 3px separado. No botones deshabilitados decorativos. Tarjetas solo cuando agrupan opciones; sin tarjetas para cada frase. Footer ofrece contacto y aviso de privacidad del preview. No formularios en Sprint 0: no se simula recepción ni éxito.

## Fotografía y marca
Activos reales recuperados de componentes públicos del repo antiguo: escenario_naywym y CajaArequipa_Piura2. Descargados y optimizados WebP; dimensiones reservadas, hero eager/high, secundaria lazy. Isotipo oficial sin redibujar. No usar el antiguo hero de biblioteca por falta de evidencia suficiente de procedencia fotográfica. Inventario en docs/AUDIT.md. No se interpreta la imagen de un evento como aval corporativo.

## Movimiento
Scroll nativo; feedback de botones 160ms ease-out, una entrada opcional de imagen 600ms opacidad. Texto y CTA visibles desde el HTML. Reduced motion elimina animaciones/transiciones y smooth scroll; sin librería de animación. Nada permanente.

## Responsive
360/375px: texto/CTA primero, fotografía después, menú compacto. 768px: navegación amplia según espacio; hero sigue apilado hasta 1024px. >=1024px: hero en dos columnas. >=1440px: contenedor máximo. La imagen no oculta texto, no se fuerza altura de viewport. Revisar paisaje, zoom 200%, títulos largos y footer.

## Calidad y presupuesto
HTML semántico, lang es-PE, un h1 por ruta, skip link, encabezados ordenados, alt significativo, nombres accesibles y foco visible. No trackers, embeds, cookies propias ni almacenamiento. Fuente local, sin peticiones de terceros al cargar. Hero objetivo <=250KB; secundaria <=180KB. Ningún runtime de UI enviado. Noindex en preview, canonical y OG propios del staging. Build + enlaces/deep links + navegador en 360,375,768,1024,1440 + axe + teclado + capturas. Cada estado de publicación se informa por separado.
