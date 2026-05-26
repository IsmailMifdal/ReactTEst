"use strict";

var _validators = require("./validators");
/**
 * @fileoverview Tests unitaires pour les fonctions de validation.
 * Couverture cible : 100 % (statements, branches, fonctions, lignes).
 *
 * Les tests de validateDateDeNaissance utilisent des fausses horloges
 * (jest.useFakeTimers) fixées au 2026-05-05 pour des résultats déterministes
 * quelle que soit la date d'exécution.
 */

// ─── validateNom ──────────────────────────────────────────────────────────────
describe('validateNom', () => {
  test('retourne une erreur si la valeur est vide (chaîne vide)', () => {
    expect((0, _validators.validateNom)('')).toBe("Le nom doit contenir au moins 2 caractères.");
  });
  test('retourne une erreur si la valeur est null', () => {
    expect((0, _validators.validateNom)(null)).toBe("Le nom doit contenir au moins 2 caractères.");
  });
  test('retourne une erreur si la valeur contient moins de 2 caractères', () => {
    expect((0, _validators.validateNom)('A')).toBe("Le nom doit contenir au moins 2 caractères.");
  });
  test('retourne une erreur si la valeur contient des chiffres', () => {
    expect((0, _validators.validateNom)('A1')).toBe("Le nom ne doit contenir que des lettres, espaces, tirets ou apostrophes.");
  });
  test('retourne null pour un nom simple valide', () => {
    expect((0, _validators.validateNom)('Dupont')).toBeNull();
  });
  test('retourne null pour un nom avec tiret (Jean-Pierre)', () => {
    expect((0, _validators.validateNom)('Jean-Pierre')).toBeNull();
  });
  test("retourne null pour un nom avec apostrophe (O'Brien)", () => {
    expect((0, _validators.validateNom)("O'Brien")).toBeNull();
  });
  test('retourne null pour un nom avec accent (Ève)', () => {
    expect((0, _validators.validateNom)('Ève')).toBeNull();
  });
});

// ─── validatePrenom ───────────────────────────────────────────────────────────
describe('validatePrenom', () => {
  test('retourne une erreur si la valeur est vide', () => {
    expect((0, _validators.validatePrenom)('')).toBe("Le prénom doit contenir au moins 2 caractères.");
  });
  test('retourne une erreur si la valeur est null', () => {
    expect((0, _validators.validatePrenom)(null)).toBe("Le prénom doit contenir au moins 2 caractères.");
  });
  test('retourne une erreur si la valeur contient moins de 2 caractères', () => {
    expect((0, _validators.validatePrenom)('J')).toBe("Le prénom doit contenir au moins 2 caractères.");
  });
  test('retourne une erreur si la valeur contient des caractères invalides', () => {
    expect((0, _validators.validatePrenom)('J0')).toBe("Le prénom ne doit contenir que des lettres, espaces, tirets ou apostrophes.");
  });
  test('retourne null pour un prénom valide', () => {
    expect((0, _validators.validatePrenom)('Jean')).toBeNull();
  });
  test('retourne null pour un prénom composé avec espace', () => {
    expect((0, _validators.validatePrenom)('Marie Claire')).toBeNull();
  });
});

// ─── validateEmail ────────────────────────────────────────────────────────────
describe('validateEmail', () => {
  test("retourne une erreur si la valeur est vide", () => {
    expect((0, _validators.validateEmail)('')).toBe("L'email est requis.");
  });
  test('retourne une erreur si la valeur est null', () => {
    expect((0, _validators.validateEmail)(null)).toBe("L'email est requis.");
  });
  test('retourne une erreur si la valeur ne contient que des espaces', () => {
    expect((0, _validators.validateEmail)('   ')).toBe("L'email est requis.");
  });
  test("retourne une erreur si l'email est mal formaté (sans @)", () => {
    expect((0, _validators.validateEmail)('notanemail')).toBe("L'adresse email n'est pas valide.");
  });
  test("retourne une erreur si l'email est mal formaté (sans domaine)", () => {
    expect((0, _validators.validateEmail)('test@')).toBe("L'adresse email n'est pas valide.");
  });
  test('retourne null pour un email valide', () => {
    expect((0, _validators.validateEmail)('jean.dupont@example.com')).toBeNull();
  });
  test('retourne null pour un email avec sous-domaine', () => {
    expect((0, _validators.validateEmail)('user@mail.example.co.uk')).toBeNull();
  });
});

// ─── validateDateDeNaissance ──────────────────────────────────────────────────
// Horloge fixée au 2026-05-05 pour que tous les résultats soient déterministes.
describe('validateDateDeNaissance', () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-05-05'));
  });
  afterAll(() => {
    jest.useRealTimers();
  });
  test('retourne une erreur si la valeur est vide', () => {
    expect((0, _validators.validateDateDeNaissance)('')).toBe("La date de naissance est requise.");
  });
  test('retourne une erreur si la valeur est null', () => {
    expect((0, _validators.validateDateDeNaissance)(null)).toBe("La date de naissance est requise.");
  });

  // ── Branche : même mois, même jour → exactement 18 ans → valide ─────────────
  test('retourne null pour une personne ayant exactement 18 ans aujourd\'hui (2008-05-05)', () => {
    expect((0, _validators.validateDateDeNaissance)('2008-05-05')).toBeNull();
  });

  // ── Branche : même mois, jour antérieur → 18 ans révolus → valide ───────────
  test('retourne null : même mois, anniversaire déjà passé ce mois (2008-05-01)', () => {
    expect((0, _validators.validateDateDeNaissance)('2008-05-01')).toBeNull();
  });

  // ── Branche : même mois, jour futur → monthDiff=0 ET today.getDate() < birthDate.getDate() → age-- → mineur ──
  test('retourne une erreur : même mois, anniversaire pas encore passé (2008-05-10)', () => {
    expect((0, _validators.validateDateDeNaissance)('2008-05-10')).toBe("Vous devez avoir au moins 18 ans pour vous inscrire.");
  });

  // ── Branche : monthDiff > 0 (mois de naissance avant le mois courant) → valide ──
  test('retourne null : mois de naissance avant le mois courant, 18 ans révolus (2008-01-01)', () => {
    expect((0, _validators.validateDateDeNaissance)('2008-01-01')).toBeNull();
  });

  // ── Branche : monthDiff < 0 (mois de naissance après le mois courant) ET valide ──
  // 2026-2007=19 ans, monthDiff=5-12=-7 → age-- → 18 → valide
  test('retourne null : mois de naissance après le mois courant, 18 ans révolus (2007-12-01)', () => {
    expect((0, _validators.validateDateDeNaissance)('2007-12-01')).toBeNull();
  });

  // ── Branche : monthDiff < 0 ET mineur après décrémentation ──────────────────
  // 2026-2008=18 ans, monthDiff=5-12=-7 → age-- → 17 → invalide
  test('retourne une erreur : monthDiff < 0, anniversaire non atteint (2008-12-01)', () => {
    expect((0, _validators.validateDateDeNaissance)('2008-12-01')).toBe("Vous devez avoir au moins 18 ans pour vous inscrire.");
  });

  // ── Cas général : clairement majeur ─────────────────────────────────────────
  test('retourne null pour une personne de 30 ans (1996-01-01)', () => {
    expect((0, _validators.validateDateDeNaissance)('1996-01-01')).toBeNull();
  });

  // ── Cas général : clairement mineur ─────────────────────────────────────────
  test('retourne une erreur pour une personne de 17 ans (2009-05-05)', () => {
    expect((0, _validators.validateDateDeNaissance)('2009-05-05')).toBe("Vous devez avoir au moins 18 ans pour vous inscrire.");
  });
});

// ─── validateVille ────────────────────────────────────────────────────────────
describe('validateVille', () => {
  test('retourne une erreur si la valeur est vide', () => {
    expect((0, _validators.validateVille)('')).toBe("La ville doit contenir au moins 2 caractères.");
  });
  test('retourne une erreur si la valeur est null', () => {
    expect((0, _validators.validateVille)(null)).toBe("La ville doit contenir au moins 2 caractères.");
  });
  test('retourne une erreur si la valeur est trop courte', () => {
    expect((0, _validators.validateVille)('P')).toBe("La ville doit contenir au moins 2 caractères.");
  });
  test('retourne une erreur si la valeur contient des chiffres', () => {
    expect((0, _validators.validateVille)('P4ris')).toBe("La ville ne doit contenir que des lettres, espaces, tirets ou apostrophes.");
  });
  test('retourne null pour une ville valide', () => {
    expect((0, _validators.validateVille)('Paris')).toBeNull();
  });
  test('retourne null pour une ville avec tiret (Aix-en-Provence)', () => {
    expect((0, _validators.validateVille)('Aix-en-Provence')).toBeNull();
  });
});

// ─── validateCodePostal ───────────────────────────────────────────────────────
describe('validateCodePostal', () => {
  test('retourne une erreur si la valeur est vide', () => {
    expect((0, _validators.validateCodePostal)('')).toBe("Le code postal est requis.");
  });
  test('retourne une erreur si la valeur est null', () => {
    expect((0, _validators.validateCodePostal)(null)).toBe("Le code postal est requis.");
  });
  test('retourne une erreur si le code a moins de 5 chiffres', () => {
    expect((0, _validators.validateCodePostal)('1234')).toBe("Le code postal doit contenir exactement 5 chiffres.");
  });
  test('retourne une erreur si le code contient des lettres', () => {
    expect((0, _validators.validateCodePostal)('ABCDE')).toBe("Le code postal doit contenir exactement 5 chiffres.");
  });
  test('retourne une erreur si le code a plus de 5 chiffres', () => {
    expect((0, _validators.validateCodePostal)('123456')).toBe("Le code postal doit contenir exactement 5 chiffres.");
  });
  test('retourne null pour un code postal valide (75001)', () => {
    expect((0, _validators.validateCodePostal)('75001')).toBeNull();
  });
  test('retourne null pour un code postal valide (13000)', () => {
    expect((0, _validators.validateCodePostal)('13000')).toBeNull();
  });
});

// ─── validateForm ─────────────────────────────────────────────────────────────
describe('validateForm', () => {
  test('retourne un objet avec toutes les erreurs si tous les champs sont vides', () => {
    const errors = (0, _validators.validateForm)({
      nom: '',
      prenom: '',
      email: '',
      dateDeNaissance: '',
      ville: '',
      codePostal: ''
    });
    expect(errors.nom).not.toBeNull();
    expect(errors.prenom).not.toBeNull();
    expect(errors.email).not.toBeNull();
    expect(errors.dateDeNaissance).not.toBeNull();
    expect(errors.ville).not.toBeNull();
    expect(errors.codePostal).not.toBeNull();
  });
  test('retourne un objet avec toutes les erreurs à null si tous les champs sont valides', () => {
    const errors = (0, _validators.validateForm)({
      nom: 'Dupont',
      prenom: 'Jean',
      email: 'jean.dupont@example.com',
      dateDeNaissance: '1990-01-01',
      ville: 'Paris',
      codePostal: '75001'
    });
    expect(errors.nom).toBeNull();
    expect(errors.prenom).toBeNull();
    expect(errors.email).toBeNull();
    expect(errors.dateDeNaissance).toBeNull();
    expect(errors.ville).toBeNull();
    expect(errors.codePostal).toBeNull();
  });
});

// ─── isFormValid ──────────────────────────────────────────────────────────────
describe('isFormValid', () => {
  test('retourne true si toutes les erreurs sont null', () => {
    expect((0, _validators.isFormValid)({
      nom: null,
      prenom: null,
      email: null,
      dateDeNaissance: null,
      ville: null,
      codePostal: null
    })).toBe(true);
  });
  test('retourne false si au moins une erreur est présente', () => {
    expect((0, _validators.isFormValid)({
      nom: "Le nom doit contenir au moins 2 caractères.",
      prenom: null,
      email: null,
      dateDeNaissance: null,
      ville: null,
      codePostal: null
    })).toBe(false);
  });
});