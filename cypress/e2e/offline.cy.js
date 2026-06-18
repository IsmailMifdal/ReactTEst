/**
 * @fileoverview Tests en mode Offline (toggle via variable d'environnement).
 *
 * Le mode est piloté par Cypress.env('offline') :
 *  - online  (offline absent/false) : on vérifie le comportement réseau normal
 *  - offline (offline=true)         : on simule une coupure réseau
 *
 * En CI, on déclenche le mode offline en passant CYPRESS_offline=true
 * (Cypress retire le préfixe CYPRESS_ et expose la clé "offline").
 *
 * Le "bouton de synchronisation" de l'exemple correspond ici au bouton
 * "S'inscrire" qui déclenche l'appel POST /users.
 */

describe('Tests en mode Offline', () => {
  beforeEach(() => {
    cy.visit('/register');
  });

  it('devrait se comporter correctement en ligne', function () {
    if (Cypress.env('offline')) {
      this.skip();
    }

    cy.intercept('POST', '**/users', {
      statusCode: 201,
      body: { id: 1, nom: 'Dupont' },
    }).as('syncRequest');
    cy.intercept('GET', '**/users', { statusCode: 200, body: [{ id: 1 }] });

    cy.fillRegisterForm();
    cy.contains('button', "S'inscrire").click();

    cy.wait('@syncRequest').then((interception) => {
      expect(interception.response.statusCode).to.equal(201);
    });

    cy.get('[data-testid="success-message"]').should('be.visible');
  });

  it('devrait afficher un message d\'erreur quand le réseau est coupé', function () {
    if (!Cypress.env('offline')) {
      this.skip(); // Évite un faux positif en mode online
    }

    cy.log('Mode offline activé !');

    cy.intercept('POST', '**/users', { forceNetworkError: true }).as('syncRequest');

    cy.fillRegisterForm();
    cy.contains('button', "S'inscrire").click();

    cy.get('[data-testid="api-error"]').should('be.visible');
    cy.get('[data-testid="success-message"]').should('not.exist');
  });
});
