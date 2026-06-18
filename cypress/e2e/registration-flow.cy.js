/**
 * @fileoverview Tests e2e du parcours complet (navigation accueil <-> formulaire).
 *
 * Ces scénarios suivent l'expérience utilisateur de bout en bout :
 * navigation entre les pages, ajout d'un utilisateur, et vérification du
 * compteur sur la page d'accueil. On utilise cy.intercept (mode "offline")
 * pour rendre les réponses déterministes sans dépendre du vrai backend.
 */

describe('Parcours complet d\'inscription (e2e)', () => {
  // ── Scénario 1 : ajout SANS erreur -> le compteur passe de 0 à 1 ───────────────
  it('Aucun utilisateur -> ajout sans erreur -> 1 utilisateur', () => {
    // Accueil : aucun utilisateur
    cy.intercept('GET', '**/users', { statusCode: 200, body: [] }).as('getUsers0');
    cy.visit('/');
    cy.wait('@getUsers0');
    cy.get('[data-testid="user-count-home"]').should(
      'contain',
      '0 user(s) already registered'
    );

    // Navigation vers le formulaire
    cy.get('[data-testid="nav-register"]').click();

    // L'inscription réussit ; ensuite il y a 1 utilisateur
    cy.intercept('POST', '**/users', {
      statusCode: 201,
      body: { id: 1, nom: 'Dupont' },
    }).as('register');
    cy.intercept('GET', '**/users', {
      statusCode: 200,
      body: [{ id: 1 }],
    }).as('getUsers1');

    cy.fillRegisterForm();
    cy.contains('button', "S'inscrire").click();
    cy.wait('@register');

    cy.get('[data-testid="success-message"]').should('be.visible');

    // Retour à l'accueil : 1 utilisateur inscrit
    cy.get('[data-testid="nav-home"]').click();
    cy.wait('@getUsers1');
    cy.get('[data-testid="user-count-home"]').should(
      'contain',
      '1 user(s) already registered'
    );
  });

  // ── Scénario 2 : ajout AVEC erreur -> le compteur reste à 1 ────────────────────
  it('1 utilisateur -> ajout avec erreur -> toujours 1 utilisateur', () => {
    // Accueil : 1 utilisateur déjà inscrit
    cy.intercept('GET', '**/users', {
      statusCode: 200,
      body: [{ id: 1 }],
    }).as('getUsers1');
    cy.visit('/');
    cy.wait('@getUsers1');
    cy.get('[data-testid="user-count-home"]').should(
      'contain',
      '1 user(s) already registered'
    );

    // Navigation vers le formulaire
    cy.get('[data-testid="nav-register"]').click();

    // L'inscription échoue (erreur serveur) -> aucun utilisateur ajouté
    cy.intercept('POST', '**/users', {
      statusCode: 500,
      body: { message: 'Internal Server Error' },
    }).as('registerFail');

    cy.fillRegisterForm();
    cy.contains('button', "S'inscrire").click();
    cy.wait('@registerFail');

    cy.get('[data-testid="api-error"]').should('be.visible');
    cy.get('[data-testid="success-message"]').should('not.exist');

    // Retour à l'accueil : toujours 1 utilisateur
    cy.get('[data-testid="nav-home"]').click();
    cy.wait('@getUsers1');
    cy.get('[data-testid="user-count-home"]').should(
      'contain',
      '1 user(s) already registered'
    );
  });
});
