import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const cy=JSON.parse(await readFile('evidence/cypress/results.json','utf8'));
const se=JSON.parse(await readFile('evidence/selenium/results.json','utf8'));
assert.equal(cy.totalTests,6); assert.equal(cy.totalPassed,6);
assert.equal(cy.totalFailed,0); assert.equal(cy.totalSkipped,0);
assert.equal(se.results.length,4);
assert(se.results.every(r=>r.status==='passed'));
console.log('Reportes comprobados: Cypress 6/6 y Selenium 4/4, sin omisiones.');
