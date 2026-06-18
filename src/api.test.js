/**
 * @fileoverview Tests d'intégration du service API (src/api.js).
 *
 * On simule la librairie axios avec jest.mock afin de tester que NOTRE code
 * gère correctement les retours de l'API : aussi bien les cas de succès que
 * les cas d'erreur. Le but n'est pas de tester axios ni l'API elle-même.
 */

import axios from 'axios';
import {
  getUsers,
  countUsers,
  registerUser,
  login,
  getUserDetail,
  deleteUser,
  BASE_URL,
} from './api';

jest.mock('axios');

describe('Service API (intégration axios)', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // ── Cas de succès ───────────────────────────────────────────────────────────
  describe('Succès', () => {
    test('getUsers appelle le bon endpoint et renvoie les données', async () => {
      const fakeUsers = [{ id: 1 }, { id: 2 }, { id: 3 }];
      axios.get.mockImplementationOnce(() => Promise.resolve({ data: fakeUsers }));

      const users = await getUsers();

      expect(axios.get).toHaveBeenCalledWith(`${BASE_URL}/users`);
      expect(users).toEqual(fakeUsers);
    });

    test('countUsers renvoie le nombre d\'utilisateurs', async () => {
      axios.get.mockImplementationOnce(() =>
        Promise.resolve({ data: [{ id: 1 }, { id: 2 }] })
      );

      const count = await countUsers();

      expect(count).toBe(2);
    });

    test('registerUser POST les données et renvoie l\'utilisateur créé', async () => {
      const newUser = { nom: 'Dupont', email: 'jean@example.com' };
      axios.post.mockImplementationOnce(() =>
        Promise.resolve({ data: { id: 11, ...newUser } })
      );

      const created = await registerUser(newUser);

      expect(axios.post).toHaveBeenCalledWith(`${BASE_URL}/users`, newUser);
      expect(created).toEqual({ id: 11, ...newUser });
    });

    test('login renvoie le token', async () => {
      axios.post.mockImplementationOnce(() =>
        Promise.resolve({ data: { token: 'abc-123' } })
      );

      const token = await login('admin@ynov.com', 'secret');

      expect(axios.post).toHaveBeenCalledWith(`${BASE_URL}/login`, {
        email: 'admin@ynov.com',
        password: 'secret',
      });
      expect(token).toBe('abc-123');
    });

    test('getUserDetail envoie le token et renvoie les infos privées', async () => {
      const detail = { id: 5, email: 'priv@example.com' };
      axios.get.mockImplementationOnce(() => Promise.resolve({ data: detail }));

      const result = await getUserDetail(5, 'my-token');

      expect(axios.get).toHaveBeenCalledWith(`${BASE_URL}/users/5`, {
        headers: { Authorization: 'Bearer my-token' },
      });
      expect(result).toEqual(detail);
    });

    test('deleteUser envoie le token et supprime', async () => {
      axios.delete.mockImplementationOnce(() =>
        Promise.resolve({ data: { deleted: 5 } })
      );

      const result = await deleteUser(5, 'my-token');

      expect(axios.delete).toHaveBeenCalledWith(`${BASE_URL}/users/5`, {
        headers: { Authorization: 'Bearer my-token' },
      });
      expect(result).toEqual({ deleted: 5 });
    });
  });

  // ── Cas d'erreur ────────────────────────────────────────────────────────────
  describe('Erreur', () => {
    test('getUsers propage l\'erreur réseau', async () => {
      axios.get.mockImplementationOnce(() =>
        Promise.reject(new Error('Network Error'))
      );

      await expect(getUsers()).rejects.toThrow('Network Error');
    });

    test('registerUser propage une erreur 500', async () => {
      axios.post.mockImplementationOnce(() =>
        Promise.reject(new Error('Request failed with status code 500'))
      );

      await expect(registerUser({ nom: 'Dupont' })).rejects.toThrow('500');
    });

    test('login propage une erreur 401', async () => {
      axios.post.mockImplementationOnce(() =>
        Promise.reject(new Error('Request failed with status code 401'))
      );

      await expect(login('bad@ynov.com', 'wrong')).rejects.toThrow('401');
    });

    test('deleteUser propage une erreur 401', async () => {
      axios.delete.mockImplementationOnce(() =>
        Promise.reject(new Error('Request failed with status code 401'))
      );

      await expect(deleteUser(1, 'bad-token')).rejects.toThrow('401');
    });
  });
});
