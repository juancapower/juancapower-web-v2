# JuanCa Power 2.0

Base independiente de la nueva web de coaching POWER 4 y contratación de conferencias.

Repositorio exclusivo: https://github.com/juancapower/juancapower-web-v2

Sprint 0 / JUA-41. Producción y DNS no se modifican. No CNAME, claves API ni rastreadores.

## Desarrollo

Node 24 LTS. `npm ci`, `npm run dev`, `npm run build`, `npm test`.

Astro genera HTML estático por ruta. `BASE_PATH` permite probar el subdirectorio Pages (por defecto `/juancapower-web-v2`) o raíz (`BASE_PATH=/`). `SITE_URL` es el origen de staging. No cambiarlo al dominio de producción durante este sprint.

Consultar `design-system/MASTER.md`, `docs/AUDIT.md`, `docs/ARCHITECTURE.md` y `docs/SPRINT-0.md`.

## Publicación

GitHub Actions valida pull requests; solo main publica en el entorno `github-pages`. Revisar el workflow y su URL efectiva antes de declarar publicación. Preview con `noindex,nofollow` en todas las páginas: no es un control de acceso.

## Alcance

Home, entrada comercial speaker y contacto mínimo. Las rutas futuras están documentadas, sin páginas vacías publicadas. El test y los precios no se implementan en Sprint 0. Los enlaces comerciales recuperados de la web anterior requieren validación operativa del propietario (disponibilidad, reserva y recepción reales).

## Migración y recuperación

Este sprint no autoriza migrar producción. Un sprint futuro debe inventariar rutas legadas, validar reservas, privacidad y textos legales; aprobar dominio, HTTPS y plan de retorno antes de cambiar Pages/DNS. Para recuperar staging, revertir el commit defectuoso en main mediante PR y comprobar un nuevo deployment. La web anterior conserva su repositorio y configuración.
