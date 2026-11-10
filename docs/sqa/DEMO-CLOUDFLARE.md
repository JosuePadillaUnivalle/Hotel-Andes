# Demo móvil en Cloudflare

El despliegue usa Cloudflare Workers y la base D1 hotel-andes-demo para datos de prueba. La interfaz conserva el mismo catálogo, menú y filtro del PR. Las sesiones de reserva se identifican con una cookie del navegador. El punto de entrada público elimina los encabezados de identidad reservados a Sites.

## Preparación y actualización

Con las dependencias instaladas y una cuenta Cloudflare autorizada, ejecutar desde la raíz:

```sh
npm run build
node scripts/prepare-cloudflare-demo.mjs
npx wrangler deploy --config dist/server/wrangler.demo.json
```

La primera instalación requiere crear el esquema en la base D1 nueva:

```sh
npx wrangler d1 execute DB --remote --config dist/server/wrangler.demo.json --file drizzle/0000_unknown_landau.sql
```

La URL del despliegue verificado se registra en el issue #2, junto con el commit publicado. Santiago registra sus pruebas en el issue #4.
