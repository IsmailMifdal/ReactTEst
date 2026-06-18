/**
 * @fileoverview Service d'accès à l'API backend.
 *
 * On isole ici tous les appels réseau (axios) afin de pouvoir les tester
 * en isolation (tests d'intégration avec mock d'axios) et de garder les
 * composants découplés de l'implémentation HTTP.
 */

import axios from 'axios';

/** URL de base de l'API (surchargée par l'environnement / les tests). */
export const BASE_URL =
  process.env.REACT_APP_API_URL || 'http://localhost:8000';

/** En-tête d'autorisation admin à partir d'un token. */
const authHeader = (token) => ({ headers: { Authorization: `Bearer ${token}` } });

/**
 * Récupère la liste publique des utilisateurs (informations réduites).
 * @returns {Promise<Array>}
 */
export const getUsers = async () => {
  const response = await axios.get(`${BASE_URL}/users`);
  return response.data;
};

/**
 * Compte le nombre d'utilisateurs inscrits.
 * @returns {Promise<number>}
 */
export const countUsers = async () => {
  const users = await getUsers();
  return users.length;
};

/**
 * Inscrit un nouvel utilisateur.
 * @param {Object} user - Données du formulaire d'inscription.
 * @returns {Promise<Object>} L'utilisateur créé.
 */
export const registerUser = async (user) => {
  const response = await axios.post(`${BASE_URL}/users`, user);
  return response.data;
};

/**
 * Connexion administrateur.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<string>} Le token d'administration.
 */
export const login = async (email, password) => {
  const response = await axios.post(`${BASE_URL}/login`, { email, password });
  return response.data.token;
};

/**
 * Récupère les informations privées complètes d'un utilisateur (admin).
 * @param {number} id
 * @param {string} token
 * @returns {Promise<Object>}
 */
export const getUserDetail = async (id, token) => {
  const response = await axios.get(`${BASE_URL}/users/${id}`, authHeader(token));
  return response.data;
};

/**
 * Supprime un utilisateur (admin).
 * @param {number} id
 * @param {string} token
 * @returns {Promise<Object>}
 */
export const deleteUser = async (id, token) => {
  const response = await axios.delete(`${BASE_URL}/users/${id}`, authHeader(token));
  return response.data;
};
