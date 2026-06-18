const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    // Le serveur de dev CRA tourne sur le port 3000.
    // L'app est servie sous /ReactTEst (homepage du package.json -> PUBLIC_URL).
    baseUrl: 'http://localhost:3000/ReactTEst',
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: 'cypress/support/e2e.js',
    video: false,
  },
});
