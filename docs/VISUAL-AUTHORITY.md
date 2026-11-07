# Home · Visual Authority / Stage Presence

Propuesta de mejora localizada, 06/11/2026. Hero, tokens generales, Plus Jakarta Sans, método POWER4, rutas y enlaces comerciales conservados. Cambios únicamente en experiencia y autoridad de Home, para revisión mediante PR; no publicación de producción ni DNS.

## Dirección y recorrido

Firma: una secuencia fotográfica horizontal, con una toma protagonista grande y parte de la siguiente visible. El ritmo pasa de escenario y audiencia a comunicación, participación y equipos. No se apilan diez fotos verticalmente ni se desplazan automáticamente. La selección desemboca directamente en contratación de conferencia/taller.

Controles: flechas, miniaturas numeradas, contador real 01/10, teclado (flechas/Home/End), swipe táctil nativo y scroll-snap. Con JS desactivado permanecen imágenes, captions, scroll horizontal nativo y CTA; se ocultan solo los botones que requieren JS. Movimiento reducido se consulta en cada acción y cancela desplazamiento suave. No hay reproducción automática, intervalos, zooms o parallax.

Inspiración de patrones, sin copiar código ni composición: [Carousel 21st](https://docs.21st.dev/%40wensity/components/carousel) (swipe, navegación y orientación), [Carousel / Aceternity en 21st](https://docs.21st.dev/%40manuarora700/components/carousel) (protagonismo fotográfico y vista parcial contigua). Se conserva Astro y se implementa con CSS y un módulo pequeño propio. No React, GSAP, Motion ni dependencias nuevas.

## Autoridad: formato seleccionado

Lista editorial de siete nombres en dos columnas y fotografía auténtica de JuanCa presentando, sin retratos o logos de terceros. En móvil se omite esa fotografía secundaria para reducir scroll; las diez fotos del carrusel siguen disponibles. El retrato individual de Regina NO se usa como evidencia compartida.

Título: «Con quién he compartido escenario». Nombres según brief actual y declaración autobiográfica del propietario registrada en JUA-32: Orlando Denegri, Stefanny Berdejo, Dr. Bayter, Wilfredo Guevara, Jorge Loza, Regina Carrot y Héctor Raúl González. No se añaden profesiones, biografías, eventos, fechas, lugares, alianzas, mentorías o recomendaciones. Aclaración visible: compartir escenario no implica aval de servicios/método ni alianza comercial.

Fuente contextual: [JUA-32](https://linear.app/soyjuancapower/issue/JUA-32/04-speaker-y-talleres-con-lead-cualificado) e inventario documental del [PR #6](https://github.com/juancapower/juancapower-web-v2/pull/6). La instrucción actual pide expresamente esta sección en Home, superando la preferencia histórica de limitarla a Speaker. Fotos compartidas y testimonios de terceros siguen fuera de esta implementación. No se presenta posesión de un archivo como prueba de permiso individual.

## Curaduría DAM

Cloudinary ddn6qh7ve consultado con su conector en modo lectura. Catálogo devuelve 209 imágenes; se revisaron los primeros 100 registros y se inspeccionaron 27 candidatas pertinentes: 24 nuevas fotografías de conferencia y 3 de talleres ya existentes. Elegidas 10 para experiencia y 1 retrato de actividad para autoridad. Originales y hojas de contacto permanecen fuera de Git; Cloudinary no se modificó. IDs, URLs, tamaños, captions, alt y encuadres en src/data/home-experience.json.

| Orden | Public ID | Uso y razón |
|---|---|---|
| 1 | juanca-power-conferencista-frente-al-publico-desde-escenario_h0dtix | Apertura: JuanCa y audiencia en un mismo encuadre; presencia y contexto reales |
| 2 | juanca-power-conferencista-gesto-mano-en-escenario_xtpjwx | Expresión/gesto y rostro bien expuesto |
| 3 | juanca-power-conferencista-brazo-levantado-en-escenario_djgyjr | Participación; encuadre alto para preservar manos y rostro |
| 4 | CajaArequipa_Piura3_f9pi1u | Trabajo con equipos; plano de sala, sin inferir aval de empresa |
| 5 | juanca-power-conferencia-interaccion-publico-desde-escenario_u6xtqj | Perspectiva de quien presenta y escucha a la sala |
| 6 | juanca-power-conferencia-escenario-brazos-arriba-vista-publico-01_sstccn | Energía de participación; posición lateral para móvil |
| 7 | juanca-power-conferencista-escenario-primer-plano-frontal_bldzsd | Cercanía y expresión del speaker |
| 8 | CajaArequipa_Piura4_jifq7j | Grupo en contexto de trabajo, sin nombres, resultados ni relación comercial atribuida |
| 9 | juanca-power-conferencia-escenario-pantalla-confianza_qwlteb | Plano abierto de presentación, escenario y pantalla |
| 10 | juanca-power-conferencia-auditorio-vista-panoramica_iao8tk | Cierre de secuencia con contexto de auditorio; escenario preservado a la derecha |
| Autoridad | juanca-power-conferencista-sonriendo-en-escenario_go0xsr | Fotografía de JuanCa, no foto conjunta con las personas nombradas |

Descartes: duplicados/ángulos muy similares, toma muy inclinada, escenas excesivamente oscuras y retratos verticales que exigirían recortar demasiado en el carrusel. No se incorporan Dr.Bayter/encuentro Trascendiendo el Duelo ni activos de Power Digital. No reconstrucción de rostros, escenas generadas, retoques cosméticos o ampliación por encima de la fuente. Solo reducción y compresión WebP; recorte visual CSS reversible y posición específica por foto.

## Composición y presupuesto

Móvil 360/390: foto contextual 3:2, tarjeta 90% del contenedor, siguiente encuadre parcialmente visible, captions breves, controles 44px, miniaturas desplazables. Tablet 768/1024 y desktop 1440: composición 86%/vista parcial, foto 16:9, contador y flechas al lado de la introducción. Textos e imágenes con dimensiones reservadas; ninguna imagen del hero se vuelve lazy.

42 variantes de producción (tres tamaños 480/960/1440 más miniatura 160 por foto, dos variantes del retrato): 1.266.086 bytes en total. Las diez versiones 480 suman 141.664 bytes. No son el coste de carga inicial: lazy loading y srcset permiten cargar tamaños adecuados y escenas cercanas. El presupuesto medido de navegador está adjunto en las pruebas; no se promete puntuación Lighthouse o rendimiento de campo sin medición.

## Criterios verificables de aceptación

- Hero y CSS maestro sin diff respecto a main; no cambio de título, fotografía, CTA o jerarquía del hero.
- Diez escenas reales en Home, siete nombres exactos, ningún retrato individual de Regina o testimonio publicado.
- Flechas/miniaturas/teclado/swipe funcionales; límites de primera/última foto y contador sincronizados; no autoplay.
- Sin scroll horizontal de la página; encuadres y rostros revisados a 360/390/768/1024/1440.
- Axe WCAG 2A/AA, 2.1/2.2 AA sin violaciones en Home; incluye etiqueta visible/nombre accesible de miniaturas.
- Fallback sin JS y cambio de prefers-reduced-motion durante sesión comprobados.
- Capturas completas Home y secciones 390/1440 en artifacts de CI. No se agregan evidencias gráficas grandes al repositorio.
- Calendar, speaker/WhatsApp, comunidad y recursos conservados; sin captación real, trackers, precios o testimonios nuevos.
- Build, validación estática y regresión aprobados antes de proponer fusión. No se fusiona ni despliega este PR automáticamente. El bloqueo previo de Pages es independiente y no se intenta resolver alterando DNS.

## Ajustes encontrados en regresión

La autoridad se renderiza solo en Home, no en las rutas de conceptos históricas. El retrato secundario está omitido por CSS en móvil: la prueba general de imágenes comprueba las visibles y la prueba específica afirma que ese retrato está oculto a360/390, visible a768/1024/1440. No se omitieron comprobaciones de imágenes que el visitante pueda ver. El servidor local de revisión declara application/javascript para los módulos: la preview conserva navegación real, no solo un render estático. Los12 casos dirigidos (incluidos los4 fallos de regresión detectados) pasan después del ajuste.
