# Test Plan móvil · Hotel Andes

Equipo: Josue Padilla, Santiago Roca y Karen Caral. Sprint de aseguramiento de calidad iniciado el 6 de noviembre de 2026. Actualización de evidencias del 10 de noviembre de 2026.

## 1. Introducción

El plan anterior documentó pruebas de dominio, API, Cypress y Selenium. Esta actualización incorpora casos de aceptación móvil en Playwright, su ejecución en cada PR y un flujo de revisión con evidencia vinculada en GitHub. La referencia anterior se conserva en [PLAN.md](PLAN.md).

## 2. Alcance

- Menú móvil: abrir, navegar a Habitaciones y cerrar el menú. Verificar que la página no desborde horizontalmente.
- Filtro familiar: mostrar solo Refugio Familiar y recuperar el catálogo al elegir Todas.
- Regresión: conservar las suites de dominio, API, Cypress y Selenium del repositorio. Los casos nuevos no crean reservas.

## 3. Estrategia

| Caso | Criterio comprobado | Método | Seguimiento |
| --- | --- | --- | --- |
| PW01 | Abrir menú, mostrar Habitaciones, cerrar al navegar y evitar desborde | Playwright, Chromium a 390 × 844 | [#3](https://github.com/JosuePadillaUnivalle/Hotel-Andes/issues/3) |
| PW02 | Filtrar a Refugio Familiar y restablecer las tres habitaciones | Playwright, Chromium a 390 × 844 | [#3](https://github.com/JosuePadillaUnivalle/Hotel-Andes/issues/3) |
| MF01 | Navegar al catálogo desde el menú en un celular real | Manual, Infinix Zero 30 con navegador Hola | [#4](https://github.com/JosuePadillaUnivalle/Hotel-Andes/issues/4) |
| MF02 | Aplicar y quitar el filtro familiar en el celular | Manual, Infinix Zero 30 con navegador Hola | [#4](https://github.com/JosuePadillaUnivalle/Hotel-Andes/issues/4) |

Usar las pruebas de aceptación para detectar regresiones desde el navegador. Priorizar los fallos que impidan llegar al catálogo o cambien el resultado del filtro.

## 4. Roles

- Josue implementa la automatización, gestiona las ramas y reúne los resultados.
- Santiago ejecuta MF01 y MF02 en un teléfono y registra la evidencia desde su cuenta.
- Karen revisa el PR frente a los criterios de aceptación y documenta los hallazgos desde su cuenta.

## 5. Ciclo de pruebas

1. Vincular el issue y sus criterios al PR de `test/playwright-movil` hacia `develop`.
2. Ejecutar las suites con GitHub Actions y revisar el informe Playwright adjunto a la ejecución.
3. Registrar revisión y prueba en teléfono en los issues correspondientes. Corregir y repetir los casos afectados.
4. Tras verificar `develop`, abrir el PR de entrega hacia `main`.

El sprint se sigue en [los issues del repositorio](https://github.com/JosuePadillaUnivalle/Hotel-Andes/issues). Las tareas y el PR están en el [tablero de GitHub Projects](https://github.com/users/JosuePadillaUnivalle/projects/2/views/1).

### Demostración reproducible

Con las dependencias, la compilación y la base local preparadas según el [README](../../README.md), arrancar la web con `npm start -- --port 5173`. En otra terminal:

```sh
npx playwright install chromium
npm run test:playwright -- --headed
```

Para mostrar cada paso con el inspector, ejecutar `npm run test:playwright -- --debug`. El informe HTML y el JSON quedan en `evidence/playwright/`. La ejecución local que respalda este documento se realizó en modo sin ventana. El [flujo de CI verificado](https://github.com/JosuePadillaUnivalle/Hotel-Andes/actions/runs/42403119176) conserva el informe como artefacto.

## 6. Entrada y salida

**Ready.** Criterio verificable, datos de prueba disponibles y entorno que abre el catálogo.

**Done.** Casos ejecutados y resultados publicados, revisión funcional registrada, fallos bloqueantes resueltos y trazabilidad desde el issue hasta el PR. La prueba en teléfono se registra por separado de la emulación.

## 7. Métricas y auditoría breve

| Indicador | Resultado de referencia |
| --- | --- |
| Ejecución local Playwright | 2 de 2 aprobados, 100 %, el 6 de noviembre de 2026. |
| Cobertura funcional del alcance automatizado | 2 de 2 criterios del sprint representados por PW01 y PW02. Se distingue de cobertura de código. |
| Prueba en teléfono | MF01 y MF02 aprobados según el registro de SantiagoRoca23 del 9 de noviembre de 2026. Versión cb5477e. [Resultados y captura](https://github.com/JosuePadillaUnivalle/Hotel-Andes/issues/4#issuecomment-6742584097). |
| CI del commit probado | Playwright 2 de 2 aprobados, 0 fallidos y 0 omitidos. Ejecución del 7 de noviembre de 2026. |
| Revisión del PR | Karen (Pinkcayy) revisó PW01 y PW02 el 10 de noviembre. [Comentario y sugerencias](https://github.com/JosuePadillaUnivalle/Hotel-Andes/pull/7#issuecomment-6776328709). Ambas sugerencias se implementaron y los 2 casos aprobaron contra la demo. |
| Densidad de defectos y velocidad | Pendientes de calcular con un tamaño de código, defectos confirmados y estimaciones de sprint acordadas. |

**Hallazgo de auditoría local.** PW01 falló en la primera ejecución porque el localizador buscaba «Abrir menú» después de que el nombre cambiara a «Cerrar menú». Se corrigió el localizador, se verificó el nombre accesible en el estado abierto y se repitió la suite con 2 de 2 aprobados. Fue un fallo de la prueba. Karen registró su revisión en [el PR #7](https://github.com/JosuePadillaUnivalle/Hotel-Andes/pull/7#issuecomment-6776328709). Se incorporaron sus sugerencias: PW01 comprueba que el enlace del menú quede oculto tras navegar y PW02 verifica los nombres de las tres habitaciones al restablecer Todas. La ejecución posterior aprobó 2 de 2 casos contra Cloudflare. El seguimiento de revisión corresponde a [#5](https://github.com/JosuePadillaUnivalle/Hotel-Andes/issues/5).


**Evidencia manual incorporada.** SantiagoRoca23 informó que la portada abrió sin pedir acceso, el menú cerró al navegar a Habitaciones, En familia mostró Refugio Familiar y Todas restauró el catálogo. Dejó [su registro con captura](https://github.com/JosuePadillaUnivalle/Hotel-Andes/issues/4#issuecomment-6742584097) y [el resumen en el PR](https://github.com/JosuePadillaUnivalle/Hotel-Andes/pull/7#issuecomment-6742799789). La evidencia identifica el commit cb5477e. No se reportaron fallos en esos recorridos.

La versión de navegador y del sistema operativo no están especificadas en el registro. Conservar ese dato como mejora de la plantilla de pruebas del siguiente sprint.

## 8. Riesgos y mejora

- MF01 y MF02 ya tienen evidencia en Infinix Zero 30 con navegador Hola. Ampliar la matriz de dispositivos y navegadores en un siguiente sprint.
- Los casos pueden fallar si cambian las etiquetas de la interfaz. Revisar los localizadores junto con los criterios y conservar la traza de fallos.
- Si la demo pública no está disponible, preparar un entorno accesible al teléfono y registrar qué versión se probó.
- Usar los resultados del PR y los hallazgos de auditoría para priorizar el siguiente sprint. Seguir el cierre en [#6](https://github.com/JosuePadillaUnivalle/Hotel-Andes/issues/6).
