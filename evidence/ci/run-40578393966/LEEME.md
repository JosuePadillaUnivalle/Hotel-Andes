# Ejecución inicial con hallazgos

Este registro es histórico y no acredita aprobación de las suites remotas.
GitHub mostró éxito porque la salida de `tee` ocultó los códigos de error de los comandos.
Los reportes originales registran Cypress 5 de 6 y Selenium 2 de 4 aprobados.

La corrección incorpora Bash con `pipefail` y una comprobación explícita de los resultados JSON.
También se corrigen la preparación de identidad en Cypress y el desplazamiento visible en Selenium.
La evidencia final válida se identifica en `evidence/verification.json` y en el informe de auditoría.
