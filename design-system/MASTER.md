# JuanCa Power 2.0 Â· Sistema maestro

## FunciÃ³n y evidencia
Audiencia: personas que buscan coaching personal y responsables de conferencias/talleres. Trabajo principal: llevar a orientaciÃ³n; secundario: contrataciÃ³n speaker. CTA dominante: Â«Agenda una sesiÃ³n de orientaciÃ³nÂ». Brief del Sprint 0 prevalece sobre identidades previas: Plus Jakarta Sans Ãºnica familia y dorado #F1E5AC. No precios definitivos, garantÃ­as, estadÃ­sticas ni testimonios sin verificar.

## DirecciÃ³n
Cinematic contenido: fotografÃ­a real de JuanCa en un escenario, composiciÃ³n editorial en dos planos y titular dominante. La firma es la relaciÃ³n entre la acciÃ³n real en la foto y Â«Crea el resultadoÂ» en dorado. Sin fondos generados, rostros sintÃ©ticos, glows, partÃ­culas, bento o parallax. Diales: varianza 6/10, movimiento 2/10, densidad 3/10. Se descartÃ³ superponer todo el texto en la foto: dificulta contrastes y recorte mÃ³vil; se mantiene panel de texto sÃ³lido.

## Tokens
- `--bg`: #0B0D17; `--surface`: #121622; `--text`: #F8F9FA.
- `--primary`: #4361EE; `--primary-hover`: #3854DA; `--gold`: #F1E5AC.
- `--muted`: #B7BDCE; `--line`: #343B50; `--focus`: #F1E5AC.
- Pares: texto, muted y gold sobre bg/surface; blanco sobre primary. VerificaciÃ³n numÃ©rica en test, AA normal >=4.5:1. Primary no se usa como texto pequeÃ±o sobre bg.

## Tipo y geometrÃ­a
Plus Jakarta Sans variable, local (paquete Fontsource), font-display swap. Pesos 400â€“800. Display clamp(2.5rem, 4.9vw, 4.75rem), lÃ­nea 1.08, tracking -0.055em. H2 clamp(2rem,3.5vw,3.25rem), cuerpo 1rem/1.7, intro 1.125rem/1.7, etiqueta .75rem con tracking .14em. Ancho 1280px; gutters 24px mÃ³vil / 48px desktop. Espaciado 8,16,24,32,48,64,96px. Dos columnas hero 1.1fr/1fr. Radios 4px botones, 0 fotografÃ­a, 8px paneles; sin sombras ornamentales.

## Componentes y estados
Header con isotipo real y texto de marca; navegaciÃ³n reducida, `aria-current`. En mÃ³vil menÃº nativo details/summary operable sin JS, CTA compacto visible. Botones/enlaces >=44px, primario azul, secundario borde, enlaces de texto subrayados. Hover cambia color/borde, active leve presiÃ³n, foco contorno 3px separado. No botones deshabilitados decorativos. Tarjetas solo cuando agrupan opciones; sin tarjetas para cada frase. Footer ofrece contacto y aviso de privacidad del preview. No formularios en Sprint 0: no se simula recepciÃ³n ni Ã©xito.

## FotografÃ­a y marca
Activos reales recuperados de componentes pÃºblicos del repo antiguo: escenario_naywym y CajaArequipa_Piura2. Descargados y optimizados WebP; dimensiones reservadas, hero eager/high, secundaria lazy. Isotipo oficial sin redibujar. No usar el antiguo hero de biblioteca por falta de evidencia suficiente de procedencia fotogrÃ¡fica. Inventario en docs/AUDIT.md. No se interpreta la imagen de un evento como aval corporativo.

## Movimiento
Scroll nativo; feedback de botones 160ms ease-out, una entrada opcional de imagen 600ms opacidad. Texto y CTA visibles desde el HTML. Reduced motion elimina animaciones/transiciones y smooth scroll; sin librerÃ­a de animaciÃ³n. Nada permanente.

## Responsive
360/375px: texto/CTA primero, fotografÃ­a despuÃ©s, menÃº compacto. 768px: navegaciÃ³n amplia segÃºn espacio; hero sigue apilado hasta 1024px. >=1024px: hero en dos columnas. >=1440px: contenedor mÃ¡ximo. La imagen no oculta texto, no se fuerza altura de viewport. Revisar paisaje, zoom 200%, tÃ­tulos largos y footer.

## Calidad y presupuesto
HTML semÃ¡ntico, lang es-PE, un h1 por ruta, skip link, encabezados ordenados, alt significativo, nombres accesibles y foco visible. No trackers, embeds, cookies propias ni almacenamiento. Fuente local, sin peticiones de terceros al cargar. Hero objetivo <=250KB; secundaria <=180KB. NingÃºn runtime de UI enviado. Noindex en preview, canonical y OG propios del staging. Build + enlaces/deep links + navegador en 360,375,768,1024,1440 + axe + teclado + capturas. Cada estado de publicaciÃ³n se informa por separado.
