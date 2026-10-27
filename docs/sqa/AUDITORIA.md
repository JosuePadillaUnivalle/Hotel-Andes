# Auditoría interna de calidad de Hotel Andes

Revisión técnica del prototipo y de las evidencias del Sprint SQA 01. El objetivo es comprobar la trazabilidad exigida por la actividad, registrar desviaciones y verificar las correcciones.

| Dato | Detalle |
| --- | --- |
| Fecha | 27 de octubre de 2026 |
| Equipo | Josue Padilla, Santiago Roca y Karen Caral |
| Objeto | Código, pruebas, configuración, repositorio y tablero |
| Referencia | Plan SQA web y Test Plan SQA HA 1.1 |
| Modalidad | Inspección técnica centralizada y revisión por roles simulados |

## Conclusión de la revisión

Las pruebas finales locales aprueban las reglas y los recorridos incluidos en el plan. Se incorporaron las dos herramientas de aceptación requeridas, trazabilidad, tablero y CI. El avance es demostrable como proyecto académico. El cierre se documenta mediante una revisión por roles simulados centralizada en Josue. El acceso del docente al tablero privado debe comprobarse antes de compartir su enlace.

| Hallazgo | Observación y acción | Estado |
| --- | --- | --- |
| A01 Trazabilidad | Formalizar historias, once criterios y su relación con pruebas; incorporar matriz CSV y plan. | Corregido documentalmente |
| A02 Automatización | Existían pruebas Node. Añadir Cypress y Selenium con reportes y capturas. | Verificado en local |
| A03 Entorno local | Con Wrangler 4.92 se reprodujeron respuestas 503 y cierre de la vista previa. Actualizar runtime y adaptar configuración generada. | Verificado tras corrección |
| A04 Sincronización de pruebas | Selenium consultaba texto antes de terminar la apertura del diálogo; el fallo afectaba casos posteriores. Añadir espera explícita y recarga por caso. | 4 de 4 aprobados |
| A05 Seguimiento y CI | Crear tablero con enlaces de evidencia y configurar integración continua en el repositorio. | Tablero creado; CI aprobada |
| A07 Códigos de salida | La primera CI mostró éxito aunque Cypress y Selenium fallaron. Activar pipefail y validar los reportes JSON. | Corregido; CI aprobada |
| A08 Portabilidad | En Linux se detectaron problemas en la preparación de sesión y en clics durante el desplazamiento. Corregir preparación y esperas. | Verificación en ejecución final |
| A06 Modalidad de revisión | Documentar la ejecución centralizada y el ejercicio de roles de producto, QA y Scrum Master. | Registrado en QA04 como simulación |

## Acciones correctivas y comprobación

A03 se atendió con Wrangler 4.154.0 y tipos de Workers compatibles. Vinext emitía legacy_env, campo que la versión nueva ya no admite; scripts/normalize-wrangler.mjs lo elimina del archivo generado sin cambiar la lógica de reservas. Se repitieron tipos, compilación, API y aceptación sobre el entorno corregido.

El error de entorno se registró por su comportamiento observado. La aprobación de las pruebas posteriores acredita que dejó de reproducirse en la ejecución final, sin atribuir una causa interna no demostrada. Los intentos anteriores se conservaron por separado para el seguimiento de la corrección.

A04 se corrigió con espera del texto del diálogo y recarga por caso. A08 añade espera de la consulta inicial de reservas en Cypress, cancelación mediante el flujo visible y desplazamiento instantáneo con comprobación de que el elemento recibe el clic en Selenium. La vista móvil emula 390 por 844 píxeles.

A07 detectó que tee ocultaba el fallo de los comandos en CI. El registro 40578393966 mostraba éxito del trabajo, pero sus archivos contenían Cypress 5/6 y Selenium 2/4 aprobados. Se conserva como intento histórico no válido. El flujo corregido utiliza Bash con pipefail y scripts/verify-ci-results.mjs exige Cypress 6/6 y Selenium 4/4 sin omisiones. Estado final comprobado: Aprobada.

| Verificación final local | Resultado | Registro |
| --- | --- | --- |
| Reglas unitarias | 8 aprobadas, 0 fallidas | evidence/node/unit.log |
| API y D1 | 6 grupos aprobados | evidence/node/api.log |
| Cypress en Chrome | 6 aprobados, 0 omitidos | evidence/cypress/results.json |
| Selenium en Chrome | 4 aprobados | evidence/selenium/results.json |
| Tipos y compilación | Sin error | evidence/verification.json y build.log |
| Criterios de aceptación | 11 de 11 con evidencia | docs/sqa/matriz_trazabilidad.csv |

## Observaciones abiertas y mejora

QA04 registra la revisión por roles simulados. MEJ01 propone accesibilidad y rendimiento; MEJ02 añade cobertura y velocidad. Estas mejoras no se presentan como pruebas ejecutadas. La simulación no acredita revisión independiente ni participación efectiva de tres revisores. El análisis no certifica seguridad completa ni preparación para huéspedes reales.

En el ejercicio, Josue representa producto y entrega; Santiago representa Scrum Master y revisa como rol la concurrencia y CI; Karen representa QA y revisa como rol fechas, aislamiento, cancelación y métricas. La ejecución está centralizada en Josue. El registro REVISION_ROLES.md enlaza los casos y resultados; no se atribuyen firmas ni aprobaciones personales a Karen o Santiago.

## Enlaces verificables

Repositorio: https://github.com/JosuePadillaUnivalle/Hotel-Andes

Tablero: https://trello.com/b/VOKoZIGB/hotel-andes-scrum-y-plan-sqa

GitHub Actions: https://github.com/JosuePadillaUnivalle/Hotel-Andes/actions/runs/40579881691

## Evidencias visuales de aceptación

Capturas originales de la ejecución Cypress en Chrome del 27/10/2026. Los archivos JSON y logs conservan el detalle de cada ejecución. Las capturas complementan las aserciones automáticas.

![ Confirmación con código e importe de una reserva de demostración ](../../evidence/cypress/screenshots/reservas.cy.cjs/CY03-confirmacion.png)

![ Cancelación mostrada al visitante y comprobada por la suite ](../../evidence/cypress/screenshots/reservas.cy.cjs/CY04-cancelacion.png)

La carpeta de evidencia incluye además disponibilidad, catálogo, filtros y vista móvil. El tablero y la ejecución remota se documentan con su exportación y enlaces.
