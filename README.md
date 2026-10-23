# Hotel Andes

Prototipo académico de una web de reservas hoteleras, basado en el caso del trabajo de Agile Testing.

Integrantes: Josue Padilla, Santiago Roca y Karen Caral.

## Tecnología

- React 19 y TypeScript para la interfaz.
- Vinext y Vite para el servidor y la compilación.
- CSS adaptable, sin plantilla visual externa.
- Cloudflare D1 (SQLite) para guardar reservas.
- Drizzle para definir el esquema y generar migraciones.
- Lucide para iconos. Imágenes ilustrativas generadas para el proyecto.

## Avance implementado

1. Portada, catálogo de tres tipos de habitación, servicios, ubicación referencial y preguntas frecuentes.
2. Búsqueda por llegada, salida y entre 1 y 4 huéspedes.
3. Consulta real de disponibilidad en la base de datos.
4. Detalles, capacidad y precio por habitación.
5. Reserva con validación de datos en cliente y servidor.
6. Precio total calculado por el servidor, sin confiar en un precio enviado por el navegador.
7. Confirmación con código y comprobante descargable en texto.
8. Consulta y cancelación de las reservas del visitante.
9. Cancelación que libera la habitación.
10. Protección frente a sobreventa con una inserción SQL atómica e idempotencia para reintentos.

El inventario de demostración incluye 3 habitaciones Andinas, 2 Suites Panorámicas y 2 Refugios Familiares. Las tarifas de ejemplo son Bs 520, Bs 680 y Bs 840 por noche, respectivamente.

No hay pagos, envío de correos, cuentas propias ni panel de administración. Es un avance funcional, no un servicio hotelero real. El sitio publicado es privado por defecto. La base local y la base publicada son independientes.

## Demostración en clase (3 a 5 minutos)

1. Mostrar la portada y las tres habitaciones.
2. Seleccionar fechas futuras y dos huéspedes. Pulsar «Ver disponibilidad».
3. Abrir los detalles de una habitación y completar una reserva con datos de ejemplo.
4. Mostrar el código, el importe y «Mis reservas».
5. Cancelar la reserva y repetir la búsqueda para mostrar que se libera la habitación.
6. Cambiar a cuatro huéspedes y observar que solo se ofrece la habitación familiar.

Para relacionarlo con SQA: las fechas y reglas se validan antes de guardar, el código de confirmación permite comprobar el resultado, y las pruebas automatizadas verifican casos de error y concurrencia.

## Ejecutar en otro equipo

Requisitos: Node.js 22.13 o posterior, npm y Git. Se recomienda Node.js 24.

```sh
npm ci
npm run build
```

Aplicar una sola vez la migración inicial a la base local:

```sh
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_unknown_landau.sql
```

Iniciar:

```sh
npm run dev
```

Abrir la dirección Local que muestra la consola, normalmente http://localhost:5173. La base local permanece en .wrangler/state y se conserva al reiniciar. No se incluye en el ZIP ni en Git.

En el sitio privado publicado, las reservas se asocian a la identidad del acceso a Sites. En local se utiliza una cookie HttpOnly de visitante. No se ofrece acceso público ni autenticación comercial propia en este avance.

## Pruebas

```sh
npx tsc --noEmit
node --test tests/domain.test.mjs
node tests/api.test.mjs
```

Las pruebas de API requieren el servidor local en http://127.0.0.1:5173. Para otro puerto, definir TEST_BASE_URL. El script solo admite localhost y limpia sus reservas mediante cancelación al finalizar.

Comprobado: 8 pruebas de reglas y fechas, validaciones de API, cálculo seguro de importes, reintentos sin duplicados, 12 solicitudes concurrentes, aislamiento entre visitantes, estancias contiguas y liberación de disponibilidad al cancelar.

## Estructura

- app/Hotel.tsx: interfaz y flujo de reserva.
- app/styles.css: diseño y adaptación a pantallas pequeñas.
- app/api/: consulta de disponibilidad, creación, consulta y cancelación.
- lib/rooms.ts: catálogo y reglas compartidas.
- lib/server.ts: identidad del visitante y utilidades del servidor.
- db/schema.ts y drizzle/: esquema y migración de la base de datos.
- public/images/: imágenes WebP optimizadas.
- tests/: pruebas de reglas e integración de la API.

## Referencias funcionales

- CA01: fechas válidas y disponibilidad producen una reserva con código.
- CA02: una salida igual o anterior a la llegada se rechaza.
- CA03: no se confirma cuando no hay disponibilidad.
- CA04: las solicitudes concurrentes no superan el inventario.

La estancia usa intervalos de llegada incluida y salida excluida. Por ello, otra reserva puede empezar el día de salida. Se admiten hasta 30 noches y un año de anticipación.
