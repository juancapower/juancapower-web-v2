# CI legal · diagnóstico y límite de instalación

06/11/2026. El job legal del PR #13, SHA acc955ff59752bf798f09e8b4d134e8b31fcef60, finalizó correctamente sin cancelación ni reintento. [Run 42261080328](https://github.com/juancapower/juancapower-web-v2/actions/runs/42261080328), job 128040856020.

## Causa demostrada

Instalación entre 17:22:57 y 17:33:14 UTC: 10 minutos 17 segundos. apt descargó 21,1 MB de fuentes Ubuntu a 35,4 kB/s, tardando 9 minutos 55 segundos. No estaba congelado: seguía descargando fonts-freefont, unifont y fuentes asiáticas. Después, Chromium/FFmpeg/headless shell descargaron en unos ocho segundos; 23 pruebas legales PASS en 15,7 segundos. No hubo error del código, Turnstile ni Brevo. No se utilizó el reintento autorizado.

## Ajuste exclusivamente CI

Solo job legal-synthetic: timeout total 20 minutos; instalación máximo 12; operación de caché máximo 2. Caché de ~/.cache/ms-playwright con SO, arquitectura y hash exacto del package-lock. Action oficial cache v6.1.0, commit fijado y runtime node24 verificados en GitHub.

Se mantiene install --with-deps: Playwright reutiliza binarios presentes/caché y conserva la comprobación de dependencias del sistema. La caché no comparte los paquetes de apt ni evita por sí sola una descarga lenta de fuentes en un runner nuevo. PLAYWRIGHT_DOWNLOAD_CONNECTION_TIMEOUT=60000 limita conexiones del descargador de Playwright; el timeout del step limita también la instalación apt completa. No se eliminan dependencias, tests ni controles de consentimiento.

Cache y jobs del PR no publican Pages. No hay código funcional, secretos, Workers, DNS, servicios de pago ni datos personales en este cambio.

## Si vuelve a fallar

No crear ciclo de reintentos. Leer el log y distinguir apt/mirror, CDN, descompresión o librería ausente. Para apt persistentemente lento, proponer una imagen oficial Playwright con dependencias preinstaladas, fijada a versión compatible/digest verificado, o un mirror oficial validado; comparar tiempo/compatibilidad antes de cambiar. No desactivar pruebas ni declarar CI aprobado sin ejecución completa. La caché acelera corridas posteriores; no acredita un cache hit hasta observarlo en logs.
