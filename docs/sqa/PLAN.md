# Plan SQA y pruebas ágiles de Hotel Andes

Este plan define cómo comprobamos la calidad del prototipo web de reservas de Hotel Andes. La prioridad es que una reserva respete las fechas, la capacidad, el inventario y el importe, y que cada visitante consulte únicamente sus propios datos.

| Control del documento | Dato |
| --- | --- |
| Código y versión | SQA HA 1.1 |
| Fecha de corte | 27 de octubre de 2026 |
| Equipo | Josue Padilla · Santiago Roca · Karen Caral |
| Marco de trabajo | Scrum académico |
| Iteración | Sprint SQA 01 de consolidación y pruebas |
| Estado | Revisión técnica por roles simulados documentada |

## 1 Introducción

Integramos SQA, o aseguramiento de la calidad del software, al trabajo del sprint mediante criterios claros, revisiones, pruebas repetibles y seguimiento de defectos. El control de calidad se concreta en ejecutar las pruebas y comprobar sus resultados. La mejora continua usa los hallazgos para ajustar el siguiente ciclo.

Esta versión formaliza la estrategia de calidad del avance implementado. El README y las pruebas existentes constituyen la referencia técnica del punto de partida. La comparación siguiente describe la actualización de las prácticas del proyecto.

| Práctica de partida | Actualización incorporada |
| --- | --- |
| Reglas y API con pruebas locales | Añadir aceptación con Cypress y Selenium en Chrome. |
| Comprobaciones descritas en README | Vincular historias, criterios, pruebas y evidencias. |
| Ejecución desde el equipo local | Configurar integración continua en GitHub Actions. |
| Seguimiento sin tablero del proyecto | Crear tablero Scrum con pruebas y revisión del equipo. |
| Resultados dispersos | Conservar métricas, capturas y auditoría en el repositorio. |

## 2 Alcance del sprint

El sprint de calidad cubre el recorrido de búsqueda, confirmación, consulta y cancelación de reservas. El incremento es un prototipo académico funcional; el objetivo de aceptación es demostrar sus reglas y su trazabilidad.

| Historia | Funcionalidad y valor | Criterios | Prioridad |
| --- | --- | --- | --- |
| HU01 | Consultar fechas y huéspedes para elegir habitación disponible | CA01 CA02 CA05 | Alta |
| HU02 | Confirmar la reserva con código y precio correcto sin duplicados | CA01 CA06 CA07 | Alta |
| HU03 | Respetar el inventario ante reservas simultáneas | CA03 CA04 | Crítica |
| HU04 | Consultar y cancelar únicamente las reservas propias | CA08 CA09 | Alta |
| HU05 | Descargar un comprobante de demostración | CA10 | Media |
| HU06 | Consultar catálogo y navegar desde móvil | CA11 | Media |

## Inventario y reglas del dominio

| Tipo | Unidades | Capacidad | Tarifa por noche |
| --- | --- | --- | --- |
| Andina | 3 | 2 huéspedes | Bs 520 |
| Panorámica | 2 | 2 huéspedes | Bs 680 |
| Familiar | 2 | 4 huéspedes | Bs 840 |

La estancia incluye la llegada y excluye la salida, por lo que una reserva puede comenzar el día de salida de otra. Se admiten de 1 a 4 huéspedes, hasta 30 noches y hasta 365 días de anticipación. El total corresponde a tarifa por noche multiplicada por noches y se calcula en el servidor.

## Artefactos sometidos a pruebas

- Interfaz React y CSS adaptable: catálogo, buscador, diálogos y menú móvil.
- API de disponibilidad y reservas, reglas de fechas y operaciones de cancelación.
- Esquema D1 y consultas de asignación de habitaciones, junto con las pruebas y el flujo de CI.

## Fuera del alcance de esta entrega

Pagos, envío de correos, cuentas comerciales, administración hotelera y operación con clientes reales. La revisión cubre controles básicos de privacidad y navegación; una auditoría completa de seguridad, accesibilidad y carga queda como mejora.

La matriz adjunta matriz_trazabilidad.csv detalla los once criterios CA01 a CA11, sus pasos, resultados esperados y pruebas asociadas.

## 3 Estrategia de pruebas

Priorizamos los riesgos de pérdida de disponibilidad, sobreventa, acceso ajeno y precios incorrectos. Ejecutamos primero reglas y API; después comprobamos los recorridos visibles. La regresión se repite cuando cambia código relacionado o se corrige un defecto.

| Nivel | Herramienta y alcance | Evidencia |
| --- | --- | --- |
| Unitarias | Node test verifica fechas, límites y cálculo de noches. | 8 pruebas; unit.log |
| Integración | Node y fetch verifican API, D1, idempotencia y concurrencia. | 6 grupos; api.log |
| Aceptación BDD | Cypress 16.2.0 ejecuta búsqueda, reserva, descarga, cancelación y rechazos. | 6 casos; results.json y capturas |
| Interfaz y adaptación | Selenium WebDriver 4.51.0 verifica catálogo, detalle con Escape, filtro y menú móvil. | 4 casos; results.json y capturas |
| Exploratorias y revisión | Revisión técnica centralizada y comprobación de evidencia por roles simulados. | Registro en QA04 y REVISION_ROLES.md |

## Criterios expresados como comportamiento

BDD utiliza ejemplos de comportamiento para acordar qué debe hacer el producto. Los casos Cypress se nombran con Dado, Cuando y Entonces y se enlazan a las historias. No se declara un ciclo TDD histórico; las pruebas unitarias existentes se amplían con aceptación ejecutable.

- Dada una habitación disponible y fechas válidas, cuando confirmo con datos correctos, entonces recibo un código AND y el total calculado por el servidor.
- Dada una única unidad familiar restante, cuando llegan doce solicitudes simultáneas, entonces solo una se confirma y once se rechazan por falta de disponibilidad.

## Integración continua y entrega

GitHub Actions instala dependencias desde el lockfile, comprueba tipos, ejecuta unitarias, compila, crea una base D1 local efímera y ejecuta API, Cypress y Selenium. Bash con pipefail transmite los errores aunque se guarden logs con tee; además se comprueban los conteos JSON. Los artefactos se conservan 30 días. El flujo se activa en cambios de código en main, en pull requests o manualmente.

La publicación del sitio privado se gestiona por separado. Este flujo incorpora CI; no publica automáticamente ni modifica la base del sitio alojado. La entrega registra la ejecución correcta y una revisión por roles simulados, con su alcance declarado.

## 4 Roles y responsabilidades

La ejecución y administración del trabajo están centralizadas en Josue Padilla. Para el ejercicio se representan los roles de Santiago Roca y Karen Caral como una simulación. Los tres figuran como integrantes; esta distribución no acredita revisiones personales realizadas por Santiago o Karen.

| Integrante | Modalidad y función | Responsabilidad en el ejercicio |
| --- | --- | --- |
| Josue Padilla | Ejecución real y rol Product Owner | Centralizar el trabajo, mantener código y tablero y comprobar el alcance de la entrega. |
| Santiago Roca | Rol simulado de Scrum Master | Representar el seguimiento, la concurrencia y la revisión de integración continua. |
| Karen Caral | Rol simulado de QA Champion | Representar la revisión de casos, métricas, auditoría y evidencias. |

La revisión se organiza en tres perspectivas: producto, calidad y seguimiento. Josue centraliza la ejecución; el rol QA, representado como Karen, comprueba los casos y resultados; el rol Scrum Master, representado como Santiago, comprueba el seguimiento y CI. El registro detalla la evidencia de cada perspectiva. No constituye una revisión independiente de tres personas.

## 5 Ciclo de vida de las pruebas

| Momento del sprint | Actividad y resultado esperado |
| --- | --- |
| Planificación | Seleccionar historias y riesgos. Acordar criterios y casos antes de comenzar cambios. |
| Trabajo diario | Revisar bloqueos y actualizar la tarjeta. Ejecutar pruebas del componente modificado. |
| Integración | Enviar cambios al repositorio y revisar el resultado de GitHub Actions. |
| Revisión del sprint | Demostrar búsqueda, reserva y cancelación con datos ficticios. Revisar criterios y evidencias. |
| Retrospectiva | Analizar fallos, elegir una mejora y llevarla al backlog con seguimiento. |

## Organización en Scrum

Se propone una cadencia de una semana para las siguientes iteraciones. El corte técnico de este sprint corresponde al 27 de octubre de 2026; la revisión de este corte se documenta como ejercicio de roles, sin actas de reuniones grupales. El tablero tiene Backlog, Sprint actual, En pruebas, Revisión del equipo y Verificado.

Cada tarjeta incluye historia o tarea, prioridad, criterios y enlace al código o resultado. Verificado significa que existe evidencia técnica. QA04 registra el ejercicio de revisión por roles simulados y distingue los resultados técnicos de una aprobación personal de los integrantes.

Un defecto debe registrar pasos, entorno, resultado esperado y observado, gravedad, evidencia y acción correctiva. Tras corregirlo se repite la prueba afectada y la regresión relacionada.

## 6 Criterios de entrada y salida

## Definition of Ready

Una historia está preparada cuando su necesidad y prioridad son claras, tiene criterios comprobables, datos de ejemplo, dependencias identificadas y una prueba prevista. Debe poder ejecutarse en el entorno local sin usar información de huéspedes reales.

- El código y las dependencias pueden instalarse y la base local está creada.
- La consulta de reservas responde correctamente antes de iniciar la suite.
- El criterio dispone de identificador, resultado esperado y relación con una historia.

## Definition of Done

- Tipos y compilación correctos; pruebas del cambio y regresión aplicable aprobadas.
- Todos los criterios de alta prioridad y críticos cubiertos y aprobados.
- Sin defectos críticos o altos abiertos dentro del alcance probado.
- Resultados, capturas y acciones correctivas disponibles en el repositorio y vinculados al tablero.
- Registro de revisión desde producto, QA y seguimiento, identificado como simulación de roles.

En este corte, las pruebas automatizadas están aprobadas y QA04 documenta la revisión por roles simulados. La colaboración efectiva de tres personas y una revisión independiente no forman parte de la evidencia acreditada.

## Suspensión y reanudación

Suspendemos la suite si el servidor o D1 no responden, si falta el esquema o si una falla de infraestructura invalida los resultados. Conservamos el log, corregimos el entorno y repetimos desde un estado conocido. Un fallo de producto se registra como defecto; no se cambia el resultado esperado para aprobarlo.

## Ambiente y datos

Windows, Node.js 24.22.1 y Chrome 155.0.8059.86 para las ejecuciones locales; API en http://127.0.0.1:5173 y base SQLite D1 local. CI utiliza Ubuntu y su propio entorno aislado. Las fechas de API y Cypress son futuras y se calculan al ejecutar. Las unitarias fijan el reloj para ser repetibles.

Se usan nombres de prueba y correos del dominio example.test. Las suites de API y Cypress cancelan los registros que crean. Nunca se ejecutan sobre la base del sitio privado. El estado local .wrangler, las credenciales y node_modules se excluyen del repositorio.

## 7 Métricas y control de calidad

El corte local del 27 de octubre se basa en los archivos de resultados conservados en evidence. Los grupos de API contienen varias aserciones; se reportan aparte para evitar confundirlos con casos individuales.

| Indicador | Cálculo o criterio | Resultado del corte |
| --- | --- | --- |
| Unitarias | Aprobadas / ejecutadas | 8 / 8 = 100 % |
| Integración API | Grupos aprobados / ejecutados | 6 / 6 = 100 % |
| Aceptación Cypress | Casos aprobados / ejecutados | 6 / 6 = 100 % |
| Interfaz Selenium | Casos aprobados / ejecutados | 4 / 4 = 100 % |
| Cobertura de aceptación | Criterios con prueba aprobada / definidos | 11 / 11 = 100 % |
| Sobreventa en caso de concurrencia | 12 solicitudes por 1 unidad restante | 1 confirma y 11 rechazos 409 |
| Tipos y compilación | Procesos finalizados sin error | Aprobados en local |
| Integración continua remota | Estado confirmado en GitHub Actions | Aprobada |

## Interpretación y límites

La tasa de fallo local es 0 % en las ejecuciones finales de cada suite. Los intentos iniciales revelaron problemas de entorno, sincronización y propagación de errores en CI; se documentan en la auditoría. El 100 % se refiere exclusivamente a los criterios definidos y al alcance probado. La aprobación remota exige tanto éxito del flujo como resultados correctos en sus archivos JSON.

La cobertura de aceptación no es cobertura de líneas de código. La cobertura de código y la densidad de defectos por KLOC requieren instrumentación y un conteo estable; se incorporan como mejora. No se calcula velocidad del equipo porque aún falta un histórico de puntos planificados y aceptados por sprint.

## Seguimiento y acciones

La meta propuesta es mantener 100 % de criterios críticos y altos aprobados, cero defectos críticos abiertos y evidencia para cada historia incluida. Si un indicador incumple la meta, la tarjeta vuelve a En pruebas y se registra una acción correctiva. El rol QA, representado como Karen en la simulación, comprueba los conteos; Josue centraliza su registro.

La duración total no se compara entre suites ejecutadas en momentos distintos. Los tiempos de Cypress y Selenium están en sus JSON originales. La prueba concurrente comprueba inventario, no representa una medición de capacidad de carga del sistema.

## 8 Riesgos y mitigación

Escala propuesta de probabilidad e impacto: 1 bajo, 2 medio, 3 alto. El producto P × I permite ordenar riesgos; es una estimación para planificar, no una frecuencia medida. Los referentes de Karen y Santiago en la matriz corresponden a roles simulados.

| ID | Riesgo | P × I | Tratamiento | Referente propuesto |
| --- | --- | --- | --- | --- |
| R01 | Sobreventa por solicitudes simultáneas | 2 × 3 = 6 | Inserción atómica, prueba de 12 solicitudes y regresión API | Santiago |
| R02 | Fechas o capacidad inválidas | 3 × 2 = 6 | Validación en cliente y servidor; límites y fechas imposibles | Karen |
| R03 | Importe alterado o duplicación por reintento | 2 × 3 = 6 | Cálculo en servidor e idempotencia comprobada | Josue |
| R04 | Consulta de datos de otro visitante | 2 × 3 = 6 | Filtro por identidad, cookie HttpOnly y prueba de aislamiento | Karen |
| R05 | Fallo del entorno de prueba o de CI | 2 × 2 = 4 | Versiones fijadas, base aislada, espera de disponibilidad y logs | Santiago |
| R06 | Evidencias o tablero inaccesibles al docente | 2 × 2 = 4 | Enlaces, exportación del tablero y capturas; revisar acceso | Josue |

## Mejoras para la siguiente iteración

- Añadir cobertura de código y ampliar las pruebas de accesibilidad y rendimiento con condiciones documentadas.
- Registrar puntos y aceptación al cerrar cada sprint para calcular velocidad con datos reales.
- Comprobar el acceso del docente al tablero privado y realizar una revisión independiente en una próxima iteración.

## Acceso a la evidencia

Repositorio: https://github.com/JosuePadillaUnivalle/Hotel-Andes

Tablero privado: https://trello.com/b/VOKoZIGB/hotel-andes-scrum-y-plan-sqa

Ejecución de CI: https://github.com/JosuePadillaUnivalle/Hotel-Andes/actions/runs/40579881691

## Referencias

Consigna docente Plan SQA web, páginas 2 a 4. README, lib/rooms.ts, API y pruebas de Hotel Andes, corte del 27/10/2026. Matriz de trazabilidad y auditoría adjuntas.

Cypress Documentation: docs.cypress.io/app/references/command-line y app/guides/screenshots-and-videos. Selenium WebDriver JavaScript API: selenium.dev/selenium/docs/api/javascript/. Cloudflare Wrangler: developers.cloudflare.com/workers/wrangler/install-and-update/. Consulta técnica: 27/10/2026.
