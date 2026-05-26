"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateVille = exports.validatePrenom = exports.validateNom = exports.validateForm = exports.validateEmail = exports.validateDateDeNaissance = exports.validateCodePostal = exports.isFormValid = void 0;
/**
 * @fileoverview Fonctions de validation pour le formulaire d'inscription.
 * Chaque fonction retourne null si la valeur est valide,
 * ou un message d'erreur (string) si elle est invalide.
 */

/** Regex communes */
const NOM_REGEX = /^[a-zA-ZÀ-ÿ\s\-']+$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CODE_POSTAL_REGEX = /^[0-9]{5}$/;

/**
 * Valide un nom de famille.
 * @param {string} value
 * @returns {string|null} Message d'erreur ou null.
 */
const validateNom = value => {
  if (!value || value.trim().length < 2) {
    return "Le nom doit contenir au moins 2 caractères.";
  }
  if (!NOM_REGEX.test(value.trim())) {
    return "Le nom ne doit contenir que des lettres, espaces, tirets ou apostrophes.";
  }
  return null;
};

/**
 * Valide un prénom.
 * @param {string} value
 * @returns {string|null}
 */
exports.validateNom = validateNom;
const validatePrenom = value => {
  if (!value || value.trim().length < 2) {
    return "Le prénom doit contenir au moins 2 caractères.";
  }
  if (!NOM_REGEX.test(value.trim())) {
    return "Le prénom ne doit contenir que des lettres, espaces, tirets ou apostrophes.";
  }
  return null;
};

/**
 * Valide une adresse email.
 * @param {string} value
 * @returns {string|null}
 */
exports.validatePrenom = validatePrenom;
const validateEmail = value => {
  if (!value || !value.trim()) {
    return "L'email est requis.";
  }
  if (!EMAIL_REGEX.test(value.trim())) {
    return "L'adresse email n'est pas valide.";
  }
  return null;
};

/**
 * Valide une date de naissance.
 * L'utilisateur doit avoir au moins 18 ans.
 * @param {string} value - Date au format YYYY-MM-DD.
 * @returns {string|null}
 */
exports.validateEmail = validateEmail;
const validateDateDeNaissance = value => {
  if (!value) {
    return "La date de naissance est requise.";
  }
  const today = new Date();
  const birthDate = new Date(value);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || monthDiff === 0 && today.getDate() < birthDate.getDate()) {
    age--;
  }
  if (age < 18) {
    return "Vous devez avoir au moins 18 ans pour vous inscrire.";
  }
  return null;
};

/**
 * Valide un nom de ville.
 * @param {string} value
 * @returns {string|null}
 */
exports.validateDateDeNaissance = validateDateDeNaissance;
const validateVille = value => {
  if (!value || value.trim().length < 2) {
    return "La ville doit contenir au moins 2 caractères.";
  }
  if (!NOM_REGEX.test(value.trim())) {
    return "La ville ne doit contenir que des lettres, espaces, tirets ou apostrophes.";
  }
  return null;
};

/**
 * Valide un code postal français (5 chiffres).
 * @param {string} value
 * @returns {string|null}
 */
exports.validateVille = validateVille;
const validateCodePostal = value => {
  if (!value || !value.trim()) {
    return "Le code postal est requis.";
  }
  if (!CODE_POSTAL_REGEX.test(value.trim())) {
    return "Le code postal doit contenir exactement 5 chiffres.";
  }
  return null;
};

/**
 * Valide l'ensemble des champs du formulaire.
 * @param {{ nom: string, prenom: string, email: string, dateDeNaissance: string, ville: string, codePostal: string }} formData
 * @returns {{ nom: string|null, prenom: string|null, email: string|null, dateDeNaissance: string|null, ville: string|null, codePostal: string|null }}
 */
exports.validateCodePostal = validateCodePostal;
const validateForm = formData => ({
  nom: validateNom(formData.nom),
  prenom: validatePrenom(formData.prenom),
  email: validateEmail(formData.email),
  dateDeNaissance: validateDateDeNaissance(formData.dateDeNaissance),
  ville: validateVille(formData.ville),
  codePostal: validateCodePostal(formData.codePostal)
});

/**
 * Vérifie qu'un objet d'erreurs ne contient aucune erreur.
 * @param {Object} errors
 * @returns {boolean}
 */
exports.validateForm = validateForm;
const isFormValid = errors => Object.values(errors).every(e => e === null);
exports.isFormValid = isFormValid;