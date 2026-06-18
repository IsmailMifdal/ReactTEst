/**
 * @fileoverview Tests e2e du parcours d'inscription.
 *
 * Plutôt que de taper sur la vraie API (lente et fragile), on utilise
 * cy.intercept pour simuler les réponses du backend. Cela nous permet de
 * tester de façon déterministe aussi bien les cas de succès que les cas
 * d'erreur — y compris un "mode offline" (panne réseau).
 *
 * On intercepte par glob (**\/users) pour matcher quelle que soit l'URL
 * de base configurée (JSONPlaceholder, backend interne, etc.).
 */

describe('Parcours d\'inscription (e2e)', () => {
  beforeEach(() => {
    // La racine '/' est désormais la page d'accueil : on va directement au formulaire
    cy.visit('/register');
  });

  // ── Cas de succès ───────────────────────────────────────────────────────────
  it('inscrit l\'utilisateur et affiche le nombre d\'utilisateurs', () => {
    // L'app fait un POST /users puis un GET /users (countUsers)
    cy.intercept('POST', '**/users', {
      statusCode: 201,
      body: { id: 11, nom: 'Dupont' },
    }).as('register');

    cy.intercept('GET', '**/users', {
      statusCode: 200,
      body: Array.from({ length: 10 }, (_, i) => ({ id: i + 1 })),
    }).as('getUsers');

    cy.fillRegisterForm();
    cy.contains("button", "S'inscrire").click();

    cy.wait('@register');
    cy.wait('@getUsers');

    cy.get('[data-testid="success-message"]').should('be.visible');
    cy.get('[data-testid="user-count"]').should('contain', '10');
  });

  // ── Cas d'erreur serveur (500) ────────────────────────────────────────────────
  it('affiche une erreur si l\'API renvoie une 500', () => {
    cy.intercept('POST', '**/users', {
      statusCode: 500,
      body: { message: 'Internal Server Error' },
    }).as('registerFail');

    cy.fillRegisterForm();
    cy.contains("button", "S'inscrire").click();

    cy.wait('@registerFail');

    cy.get('[data-testid="api-error"]').should('be.visible');
    cy.get('[data-testid="success-message"]').should('not.exist');
  });

  // ── Mode offline (panne réseau) ───────────────────────────────────────────────
  it('gère le mode offline (erreur réseau)', () => {
    cy.intercept('POST', '**/users', { forceNetworkError: true }).as('offline');

    cy.fillRegisterForm();
    cy.contains("button", "S'inscrire").click();

    cy.get('[data-testid="api-error"]').should('be.visible');
    cy.get('[data-testid="success-message"]').should('not.exist');
  });

  // ── Validation côté client (aucun appel réseau) ───────────────────────────────
  it('ne contacte pas l\'API si le formulaire est invalide', () => {
    cy.intercept('POST', '**/users', cy.spy().as('postSpy'));

    cy.contains("button", "S'inscrire").click();

    cy.get('[role="alert"]').should('have.length.greaterThan', 0);
    cy.get('@postSpy').should('not.have.been.called');
  });
});
