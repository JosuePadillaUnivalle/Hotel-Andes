# Seguimiento del sprint en Trello

https://trello.com/b/VOKoZIGB/hotel-andes-scrum-y-plan-sqa

Exportación del 27/10/2026. Las tarjetas Verificado tienen evidencia técnica; la revisión grupal se mantiene en QA04.

## Backlog

### MEJ01 Accesibilidad y rendimiento

Mejora propuesta: auditorÃ­a WCAG completa, navegaciÃ³n con lector de pantalla y mediciones de rendimiento en condiciones definidas.
La prueba de menÃº mÃ³vil y Escape cubre solo aspectos puntuales. No hay resultados Lighthouse ni cumplimiento WCAG declarados.

https://trello.com/c/pjRHldBo/11-mej01-accesibilidad-y-rendimiento

### MEJ02 Seguimiento de velocidad y cobertura de cÃ³digo

Medir puntos terminados por sprint tras una planificaciÃ³n acordada y aÃ±adir cobertura de cÃ³digo instrumentada.
No hay histÃ³rico vÃ¡lido para velocidad o densidad de defectos por KLOC. La cobertura de criterios de aceptaciÃ³n se calcula separadamente.

https://trello.com/c/RQS3HbJC/12-mej02-seguimiento-de-velocidad-y-cobertura-de-c%C3%B3digo

## Sprint actual

Sin tarjetas en este corte.

## En pruebas

Sin tarjetas en este corte.

## RevisiÃ³n del equipo

### QA04 RevisiÃ³n final del equipo y acceso del docente

Pendiente: que los tres integrantes revisen el plan y resultados, confirmen roles, y concedan al docente acceso al tablero privado si lo requiere.
No invitar cuentas sin conocer los usuarios correctos.
Cierre: enlaces accesibles, archivos revisados y sin defectos crÃ­ticos abiertos.

https://trello.com/c/YVZEgrRP/10-qa04-revisi%C3%B3n-final-del-equipo-y-acceso-del-docente

### QA01 Plan y trazabilidad del sprint

Preparar plan de pruebas Ã¡gil con las ocho secciones exigidas, matriz HU-CA-prueba y criterios DoR y DoD.
Participantes: Josue Padilla, Santiago Roca y Karen Caral.
DistribuciÃ³n de roles propuesta sujeta a revisiÃ³n del equipo.
No se simulan reuniones ni firmas.
https://github.com/JosuePadillaUnivalle/Hotel-Andes/blob/main/docs/sqa/PLAN.md

https://trello.com/c/Z8Ecy0vd/7-qa01-plan-y-trazabilidad-del-sprint

### QA03 AuditorÃ­a y acciones correctivas

Revisar trazabilidad, automatizaciÃ³n, criterios de salida y evidencias. Registrar hallazgos con estado, responsable propuesto y verificaciÃ³n.
Informe: https://github.com/JosuePadillaUnivalle/Hotel-Andes/blob/main/docs/sqa/AUDITORIA.md
No se atribuyen auditorÃ­as a compaÃ±eros sin su revisiÃ³n.

https://trello.com/c/6hJxRTtH/9-qa03-auditor%C3%ADa-y-acciones-correctivas

## Verificado

### HU06 Consultar la web desde mÃ³vil

Como visitante quiero navegar desde una pantalla pequeÃ±a.
CA11 sin desborde horizontal a 390 px y menÃº que abre y cierra.
Pruebas SE01 a SE04; Selenium Chrome headless. SE04 emula 390 x 844.
Resultado local: 4 de 4 comprobaciones aprobadas el 27/10/2026. No equivale a certificaciÃ³n de accesibilidad.
Referente propuesto: Santiago Roca.
https://github.com/JosuePadillaUnivalle/Hotel-Andes/blob/main/evidence/selenium/results.json

https://trello.com/c/yqMm62Zl/6-hu06-consultar-la-web-desde-m%C3%B3vil

### HU01 Consultar disponibilidad

Como visitante quiero consultar fechas y huÃ©spedes para elegir una habitaciÃ³n disponible.
Criterios CA01 bÃºsqueda vÃ¡lida; CA02 fechas invÃ¡lidas se rechazan; CA05 capacidad de 1 a 4.
Pruebas: CY01, CY02, CY06 y unitarias.
Prioridad alta. Referente propuesto: Josue Padilla.
Evidencia: https://github.com/JosuePadillaUnivalle/Hotel-Andes/blob/main/evidence/cypress/results.json

https://trello.com/c/sNWfnLwR/1-hu01-consultar-disponibilidad

### HU02 Confirmar reserva sin duplicados

Como visitante quiero obtener cÃ³digo e importe al reservar.
CA01 confirmaciÃ³n; CA06 precio calculado por servidor; CA07 idempotencia sin duplicados.
Pruebas CY03 y API grupo 2.
Prioridad alta. Referente propuesto: Josue Padilla.
https://github.com/JosuePadillaUnivalle/Hotel-Andes/blob/main/tests/api.test.mjs

https://trello.com/c/70gB2i1i/2-hu02-confirmar-reserva-sin-duplicados

### HU03 Evitar sobreventa

Como responsable del hotel quiero respetar el inventario ante solicitudes simultÃ¡neas.
CA03 sin disponibilidad devuelve 409; CA04 dos reservas familiares como mÃ¡ximo por intervalo.
Prueba API: con una unidad familiar ocupada, 12 solicitudes compiten por la Ãºltima: 1 Ã©xito y 11 conflictos.
Prioridad crÃ­tica. Referente propuesto: Santiago Roca.
https://github.com/JosuePadillaUnivalle/Hotel-Andes/blob/main/evidence/node/api.log

https://trello.com/c/XyTzHUbr/3-hu03-evitar-sobreventa

### HU04 Consultar y cancelar reservas propias

Como visitante quiero consultar y cancelar Ãºnicamente mis reservas.
CA08 aislamiento entre visitantes; CA09 cancelar libera disponibilidad y cambia estado.
Pruebas API grupos 4 y 6; CY04.
Prioridad alta. Referente propuesto: Karen Caral.
https://github.com/JosuePadillaUnivalle/Hotel-Andes/blob/main/tests/cypress/reservas.cy.cjs

https://trello.com/c/kAI45STw/4-hu04-consultar-y-cancelar-reservas-propias

### HU05 Descargar comprobante

Como visitante quiero conservar mi cÃ³digo y detalles de la reserva en un archivo.
CA10 comprobante TXT contiene cÃ³digo y aviso de demostraciÃ³n.
Prueba CY03: descarga y verificaciÃ³n del contenido del archivo.
Prioridad media. Referente propuesto: Karen Caral.
https://github.com/JosuePadillaUnivalle/Hotel-Andes/blob/main/tests/cypress/reservas.cy.cjs

https://trello.com/c/6W5uhBlf/5-hu05-descargar-comprobante

### QA02 AutomatizaciÃ³n y ejecuciÃ³n continua

Herramientas exigidas: Cypress 16.2.0 y Selenium WebDriver 4.51.0. Complemento Node test para reglas y API.
Ejecutar en local y en GitHub Actions con base de prueba local. Conservar reportes y capturas.
CI/CD: integraciÃ³n continua automÃ¡tica; publicaciÃ³n privada existente fuera de este flujo. No se automatiza el despliegue.
https://github.com/JosuePadillaUnivalle/Hotel-Andes/blob/main/.github/workflows/sqa.yml

VerificaciÃ³n remota: GitHub Actions aprobada el 27/10/2026, con unitarias, API, Cypress y Selenium. Registro y artefacto:
https://github.com/JosuePadillaUnivalle/Hotel-Andes/actions/runs/40578393966

https://trello.com/c/cSiCRQz8/8-qa02-automatizaci%C3%B3n-y-ejecuci%C3%B3n-continua

### DEF01 Corregir fallos del entorno Wrangler

Hallazgo A03 de auditorÃ­a, detectado el 27/10/2026.
Pasos: ejecutar API con rechazo por origen y luego reserva vÃ¡lida, o ejecutar repetidas visitas de Cypress en Wrangler 4.92.
Esperado: respuesta coherente de API y servidor disponible.
Observado: 503 y cierre de la vista previa en intentos iniciales.
AcciÃ³n: Wrangler 4.154.0, tipos compatibles y eliminaciÃ³n reproducible de legacy_env en configuraciÃ³n generada.
VerificaciÃ³n: API 6/6 grupos, Cypress 6/6 casos, Selenium 4/4 y GitHub Actions aprobados.
Historial: https://github.com/JosuePadillaUnivalle/Hotel-Andes/tree/main/evidence/history
CI: https://github.com/JosuePadillaUnivalle/Hotel-Andes/actions/runs/40578393966
Responsable de seguimiento propuesto: Santiago Roca.

https://trello.com/c/z70NXEYV/13-def01-corregir-fallos-del-entorno-wrangler
