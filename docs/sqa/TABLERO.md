# Seguimiento del sprint en Trello

https://trello.com/b/VOKoZIGB/hotel-andes-scrum-y-plan-sqa

Exportación del 27/10/2026. Verificado indica evidencia técnica; QA04 mantiene la revisión grupal pendiente.

## Backlog

### MEJ01 Accesibilidad y rendimiento

Mejora propuesta: auditoría WCAG completa, navegación con lector de pantalla y mediciones de rendimiento en condiciones definidas.
La prueba de menú móvil y Escape cubre solo aspectos puntuales. No hay resultados Lighthouse ni cumplimiento WCAG declarados.

https://trello.com/c/pjRHldBo/11-mej01-accesibilidad-y-rendimiento

### MEJ02 Seguimiento de velocidad y cobertura de código

Medir puntos terminados por sprint tras una planificación acordada y añadir cobertura de código instrumentada.
No hay histórico válido para velocidad o densidad de defectos por KLOC. La cobertura de criterios de aceptación se calcula separadamente.

https://trello.com/c/RQS3HbJC/12-mej02-seguimiento-de-velocidad-y-cobertura-de-c%C3%B3digo

## Sprint actual

Sin tarjetas en este corte.

## En pruebas

Sin tarjetas en este corte.

## Revisión del equipo

### QA04 Revisión final del equipo y acceso del docente

Pendiente: que los tres integrantes revisen el plan y resultados, confirmen roles, y concedan al docente acceso al tablero privado si lo requiere.
No invitar cuentas sin conocer los usuarios correctos.
Cierre: enlaces accesibles, archivos revisados y sin defectos críticos abiertos.

https://trello.com/c/YVZEgrRP/10-qa04-revisi%C3%B3n-final-del-equipo-y-acceso-del-docente

### QA01 Plan y trazabilidad del sprint

Preparar plan de pruebas ágil con las ocho secciones exigidas, matriz HU-CA-prueba y criterios DoR y DoD.
Participantes: Josue Padilla, Santiago Roca y Karen Caral.
Distribución de roles propuesta sujeta a revisión del equipo.
No se simulan reuniones ni firmas.
https://github.com/JosuePadillaUnivalle/Hotel-Andes/blob/main/docs/sqa/PLAN.md

https://trello.com/c/Z8Ecy0vd/7-qa01-plan-y-trazabilidad-del-sprint

### QA03 Auditoría y acciones correctivas

Revisar trazabilidad, automatización, criterios de salida y evidencias. Registrar hallazgos con estado, responsable propuesto y verificación.
Informe: https://github.com/JosuePadillaUnivalle/Hotel-Andes/blob/main/docs/sqa/AUDITORIA.md
No se atribuyen auditorías a compañeros sin su revisión.

https://trello.com/c/6hJxRTtH/9-qa03-auditor%C3%ADa-y-acciones-correctivas

## Verificado

### HU06 Consultar la web desde móvil

Como visitante quiero navegar desde una pantalla pequeña.
CA11 sin desborde horizontal a 390 px y menú que abre y cierra.
Pruebas SE01 a SE04; Selenium Chrome headless. SE04 emula 390 x 844.
Resultado local: 4 de 4 comprobaciones aprobadas el 27/10/2026. No equivale a certificación de accesibilidad.
Referente propuesto: Santiago Roca.
https://github.com/JosuePadillaUnivalle/Hotel-Andes/blob/main/evidence/selenium/results.json

https://trello.com/c/yqMm62Zl/6-hu06-consultar-la-web-desde-m%C3%B3vil

### HU01 Consultar disponibilidad

Como visitante quiero consultar fechas y huéspedes para elegir una habitación disponible.
Criterios CA01 búsqueda válida; CA02 fechas inválidas se rechazan; CA05 capacidad de 1 a 4.
Pruebas: CY01, CY02, CY06 y unitarias.
Prioridad alta. Referente propuesto: Josue Padilla.
Evidencia: https://github.com/JosuePadillaUnivalle/Hotel-Andes/blob/main/evidence/cypress/results.json

https://trello.com/c/sNWfnLwR/1-hu01-consultar-disponibilidad

### HU02 Confirmar reserva sin duplicados

Como visitante quiero obtener código e importe al reservar.
CA01 confirmación; CA06 precio calculado por servidor; CA07 idempotencia sin duplicados.
Pruebas CY03 y API grupo 2.
Prioridad alta. Referente propuesto: Josue Padilla.
https://github.com/JosuePadillaUnivalle/Hotel-Andes/blob/main/tests/api.test.mjs

https://trello.com/c/70gB2i1i/2-hu02-confirmar-reserva-sin-duplicados

### HU03 Evitar sobreventa

Como responsable del hotel quiero respetar el inventario ante solicitudes simultáneas.
CA03 sin disponibilidad devuelve 409; CA04 dos reservas familiares como máximo por intervalo.
Prueba API: con una unidad familiar ocupada, 12 solicitudes compiten por la última: 1 éxito y 11 conflictos.
Prioridad crítica. Referente propuesto: Santiago Roca.
https://github.com/JosuePadillaUnivalle/Hotel-Andes/blob/main/evidence/node/api.log

https://trello.com/c/XyTzHUbr/3-hu03-evitar-sobreventa

### HU04 Consultar y cancelar reservas propias

Como visitante quiero consultar y cancelar únicamente mis reservas.
CA08 aislamiento entre visitantes; CA09 cancelar libera disponibilidad y cambia estado.
Pruebas API grupos 4 y 6; CY04.
Prioridad alta. Referente propuesto: Karen Caral.
https://github.com/JosuePadillaUnivalle/Hotel-Andes/blob/main/tests/cypress/reservas.cy.cjs

https://trello.com/c/kAI45STw/4-hu04-consultar-y-cancelar-reservas-propias

### HU05 Descargar comprobante

Como visitante quiero conservar mi código y detalles de la reserva en un archivo.
CA10 comprobante TXT contiene código y aviso de demostración.
Prueba CY03: descarga y verificación del contenido del archivo.
Prioridad media. Referente propuesto: Karen Caral.
https://github.com/JosuePadillaUnivalle/Hotel-Andes/blob/main/tests/cypress/reservas.cy.cjs

https://trello.com/c/6W5uhBlf/5-hu05-descargar-comprobante

### QA02 Automatización y ejecución continua

Herramientas: Cypress 16.2.0 y Selenium WebDriver 4.51.0; complemento Node test.
Verificación local y remota del 27/10/2026: unitarias 8/8, API 6/6 grupos, Cypress 6/6 y Selenium 4/4. Reportes JSON finales comprobados.
CI con Bash pipefail y verificación explícita de los conteos. Un fallo detiene el flujo.
Las ejecuciones iniciales revelaron códigos de salida ocultos por tee y diferencias de portabilidad; se documentan en A07 y A08. El primer estado verde no constituye aprobación de las suites.
Ejecución final válida: https://github.com/JosuePadillaUnivalle/Hotel-Andes/actions/runs/40579881691
Configuración: https://github.com/JosuePadillaUnivalle/Hotel-Andes/blob/main/.github/workflows/sqa.yml
El flujo valida código y no despliega el sitio.

https://trello.com/c/cSiCRQz8/8-qa02-automatizaci%C3%B3n-y-ejecuci%C3%B3n-continua

### DEF01 Corregir fallos del entorno Wrangler

Hallazgo A03 de auditoría, detectado el 27/10/2026.
Pasos: ejecutar API con rechazo por origen y luego reserva válida, o ejecutar repetidas visitas de Cypress en Wrangler 4.92.
Esperado: respuesta coherente de API y servidor disponible.
Observado: 503 y cierre de la vista previa en intentos iniciales.
Acción: Wrangler 4.154.0, tipos compatibles y eliminación reproducible de legacy_env en configuración generada.
Verificación: API 6/6 grupos, Cypress 6/6 casos, Selenium 4/4 y GitHub Actions aprobados.
Historial: https://github.com/JosuePadillaUnivalle/Hotel-Andes/tree/main/evidence/history
CI: https://github.com/JosuePadillaUnivalle/Hotel-Andes/actions/runs/40578393966
Responsable de seguimiento propuesto: Santiago Roca.

https://trello.com/c/z70NXEYV/13-def01-corregir-fallos-del-entorno-wrangler

### DEF02 Corregir propagación de errores y pruebas en CI

Hallazgos A07 y A08, 27/10/2026.
Esperado: CI falla cuando falla cualquier prueba y todos los casos se ejecutan en Chrome Linux.
Observado en intento inicial 40578393966: GitHub mostraba éxito; reportes reales Cypress 5/6 y Selenium 2/4. tee ocultaba el código de salida.
Corrección: Bash con pipefail, scripts/verify-ci-results.mjs, espera de identidad inicial, cancelación por interfaz y desplazamiento a elemento visible en Selenium.
Verificación final: https://github.com/JosuePadillaUnivalle/Hotel-Andes/actions/runs/40579881691
Se descargó el artefacto y se verificaron los JSON: Cypress 6/6, Selenium 4/4, sin omisiones. API 6/6 y unitarias 8/8.
Historial preservado: evidence/ci/run-40578393966/LEEME.md.
Responsable de seguimiento propuesto: Santiago Roca.

https://trello.com/c/oCjbC1uA/14-def02-corregir-propagaci%C3%B3n-de-errores-y-pruebas-en-ci
