# Índice de evidencias SQA

Corte del 27 de octubre de 2026. Revisión del grupo pendiente en QA04.

## Ejecución final local

- node/unit.log: ocho pruebas de reglas aprobadas.
- node/api.log: seis grupos de integración aprobados, incluidos concurrencia, aislamiento y cancelación.
- cypress/results.json: seis casos aprobados sin omisiones. Capturas en cypress/screenshots.
- selenium/results.json: cuatro casos aprobados. SE04 verifica vista de 390 por 844.
- comprobantes: archivo de demostración descargado y leído por CY03.
- verification.json: métricas y estado de la validación remota.

## Ejecución final remota válida

- ci/run-40579881691: artefacto descargado y reportes JSON comprobados. Cypress 6/6; Selenium 4/4; API 6/6 grupos; unitarias 8/8.
- Flujo corregido con pipefail y comprobación explícita de conteos.
- https://github.com/JosuePadillaUnivalle/Hotel-Andes/actions/runs/40579881691
- ci/github-actions.png: captura de la ejecución final.

## Seguimiento

- trello/tablero.json y trello/tablero.png: exportación y captura de las 14 tarjetas.
- docs/sqa en el repositorio: plan, auditoría, matriz y exportación legible del tablero.

## Historial de hallazgos

- history: intentos locales iniciales con errores, conservados como historial.
- ci/run-40578393966: primera ejecución remota. El estado verde del trabajo era incorrecto como evidencia de aprobación: los reportes mostraban Cypress 5/6 y Selenium 2/4. Leer su LEEME.md y A07/A08 de la auditoría.
- Los registros históricos no se utilizan como resultados finales aprobados.
