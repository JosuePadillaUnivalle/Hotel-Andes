const { defineConfig } = require('cypress');
module.exports = defineConfig({
  video: false,
  screenshotOnRunFailure: true,
  screenshotsFolder: 'evidence/cypress/screenshots',
  downloadsFolder: 'evidence/cypress/downloads',
  viewportWidth: 1440,
  viewportHeight: 1000,
  e2e: {
    baseUrl: 'http://127.0.0.1:5173',
    supportFile: false,
    specPattern: 'tests/cypress/**/*.cy.cjs',
    setupNodeEvents(on) {
      on('after:run', (results) => {
        const fs = require('node:fs');
        fs.mkdirSync('evidence/cypress', { recursive: true });
        fs.writeFileSync('evidence/cypress/results.json', JSON.stringify(results, null, 2));
      });
    },
  },
});
