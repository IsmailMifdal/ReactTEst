// Commandes personnalisées Cypress.

/**
 * Remplit le formulaire d'inscription avec des données valides.
 * @param {Object} overrides - Valeurs à surcharger.
 */
Cypress.Commands.add('fillRegisterForm', (overrides = {}) => {
  const data = {
    nom: 'Dupont',
    prenom: 'Jean',
    email: 'jean.dupont@example.com',
    dateDeNaissance: '1995-06-15',
    ville: 'Paris',
    codePostal: '75001',
    ...overrides,
  };

  cy.get('#nom').clear().type(data.nom);
  cy.get('#prenom').clear().type(data.prenom);
  cy.get('#email').clear().type(data.email);
  cy.get('#dateDeNaissance').type(data.dateDeNaissance);
  cy.get('#ville').clear().type(data.ville);
  cy.get('#codePostal').clear().type(data.codePostal);
});
