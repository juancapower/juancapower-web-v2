# Sprint 1 · POWER PRESENCE

## Estado y aprobación
Exploración visual en la rama `design/sprint-1-power-presence`. No fusionar ni desplegar sobre Pages. Home de Sprint 0, producción, DNS y dominio se conservan. El usuario elegirá una dirección después de ver sus versiones de escritorio y móvil. Compilar y pasar pruebas no equivale a aprobar calidad visual.

## Dos hipótesis visuales
**A · STAGE PRESENCE.** Plano de escenario auténtico, oscuro e inmersivo. Jerarquía inmediata: JuanCa / coaching y speaker / decisión de actuar. La imagen ocupa un plano dominante; dorado concentrado en el resultado. Busca autoridad y proximidad con el escenario. La composición no dibuja ni extiende una audiencia.

**B · POWER EDITORIAL.** Apertura clara con tinta oscura, acento azul y retrato documental en un marco desplazado. El título cambia de escala y cruza el eje de la fotografía por debajo del rostro. Busca una personalidad más editorial y una pausa visual dentro de una marca predominantemente oscura. El neutral claro es una superficie de contraste propuesta, no un cambio a la paleta principal.

Ambas mantienen Plus Jakarta Sans, el mismo titular y las mismas acciones para comparar dirección, no argumentos comerciales diferentes. No se cambian los rostros ni se usan retratos de procedencia dudosa.

## Ritmo propuesto de Home
1. **Presencia:** hero A o B; identidad, oferta y CTA primario visibles, secundario speaker.
2. **Elección:** pausa clara con dos caminos comerciales; coaching personal y speaker/talleres. Espacio editorial y enlaces amplios, sin rejilla de tarjetas repetida.
3. **Comprensión:** arquitectura POWER 4 como plano de construcción: cimiento doble, dos elementos verticales y cubierta. Etiquetas HTML accesibles alrededor de una estructura SVG; no cuatro tarjetas.
4. **Evidencia:** escenas reales de participación y trabajo corporativo. Contexto antes que cifras; sin inferir recomendaciones.
5. **Decisión:** cierre breve con orientación directa y contacto speaker. Comunidad y recursos quedan en segundo plano para futuros sprints.

El contraste oscuro/claro, las proporciones fotográficas y la densidad cambian entre capítulos. Se conserva el mismo lenguaje de enlaces y botones. No repetir una tarjeta para cada idea.

## Wireframes funcionales
`/conceptos/wireframes/home/`, `/conceptos/wireframes/coaching/`, `/conceptos/wireframes/speaker/`. Layouts de baja fidelidad, responsivos y anotados. No representan servicios o condiciones comerciales aprobadas.

**Home:** identidad → elección → arquitectura → experiencia → orientación. Test opcional, nunca antes de agenda.
**Coaching:** necesidad → método → proceso propuesto → programas por definir → preguntas → reserva. Sin precios, promesas clínicas ni obligación de hacer test.
**Speaker:** promesa del encuentro → contexto fotográfico → temas/formato por acordar → trayectoria verificable → brief mínimo → contacto. No publicar un formulario que simule recepción.

## Conversión y prueba de comprensión
Validar con usuarios: ¿quién es JuanCa?, ¿qué dos servicios ofrece?, ¿dónde se reserva?, ¿cómo se contrata una charla? La hipótesis es reducir la distancia entre reconocimiento y acción. No se promete aumento de conversión. En pruebas internas: CTA dentro del viewport, cara sin solapes, legibilidad a 360px, rutas activas y teclado.

## Movimiento
CSS basta para esta exploración: una entrada de imagen de 600ms (transform/opacity), línea editorial de 450ms y feedback de 160ms. Sin scroll bloqueado, autoplay, loops ni revelados que escondan información. Reduced motion cancela los movimientos y conserva el estado final. No instalar GSAP: no hay una secuencia compleja que lo justifique.

## Referencias revisadas
Skill powerdigital-diseno-web y referencias design-system, frontend-design, web-quality, ai-studio-github, web-environment-integration, motion-principles, accessibility y microinteractions. Las reglas del brief y accesibilidad prevalecen sobre ejemplos que sugieren efectos automáticos.
