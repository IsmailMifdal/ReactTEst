/**
 * @fileoverview Tests e2e des fonctionnalités administrateur.
 *
 * Parcours : connexion admin -> consultation des infos privées -> suppression.
 * Les appels backend sont simulés avec cy.intercept (déterministe, hors-ligne).
 */

describe('Espace administrateur (e2e)', () => {
  const USERS = [
    { id: 1, nom: 'Martin', prenom: 'Alice', ville: 'Paris' },
    { id: 2, nom: 'Durand', prenom: 'Bob', ville: 'Lyon' },
  ];

  const loginAsAdmin = () => {
    cy.intercept('POST', '**/login', {
      statusCode: 200,
      body: { token: 'ynov-admin-token' },
    }).as('login');

    cy.visit('/login');
    cy.get('#admin-email').type('loise.fenoll@ynov.com');
    cy.get('#admin-password').type('PvdrTAzTeR247sDnAZBr');
    cy.contains('button', 'Se connecter').click();
    cy.wait('@login');
  };

  it('connecte l\'admin puis affiche les actions sur la liste', () => {
    cy.intercept('GET', '**/users', { statusCode: 200, body: USERS }).as('getUsers');
    loginAsAdmin();

    cy.wait('@getUsers');
    cy.get('[data-testid="nav-logout"]').should('be.visible');
    cy.get('[data-testid="delete-1"]').should('exist');
    cy.get('[data-testid="detail-1"]').should('exist');
  });

  it('consulte les informations privées d\'un utilisateur', () => {
    cy.intercept('GET', '**/users', { statusCode: 200, body: USERS }).as('getUsers');
    loginAsAdmin();
    cy.wait('@getUsers');

    cy.intercept('GET', '**/users/1', {
      statusCode: 200,
      body: {
        id: 1,
        nom: 'Martin',
        prenom: 'Alice',
        email: 'alice.martin@example.com',
        date_naissance: '1995-04-12',
        ville: 'Paris',
        code_postal: '75001',
      },
    }).as('detail');

    cy.get('[data-testid="detail-1"]').click();
    cy.wait('@detail');
    cy.get('[data-testid="user-detail"]').should('contain', 'alice.martin@example.com');
  });

  it('supprime un utilisateur', () => {
    cy.intercept('GET', '**/users', { statusCode: 200, body: USERS }).as('getUsers');
    loginAsAdmin();
    cy.wait('@getUsers');

    cy.intercept('DELETE', '**/users/2', { statusCode: 200, body: { deleted: 2 } }).as('del');
    // Après suppression, le rechargement renvoie un seul utilisateur
    cy.intercept('GET', '**/users', { statusCode: 200, body: [USERS[0]] }).as('getUsersAfter');

    cy.get('[data-testid="delete-2"]').click();
    cy.wait('@del');
    cy.wait('@getUsersAfter');

    cy.get('[data-testid="user-count-home"]').should('contain', '1 user(s) already registered');
    cy.get('[data-testid="user-2"]').should('not.exist');
  });
});
