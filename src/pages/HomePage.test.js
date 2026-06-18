/**
 * @fileoverview Tests d'intégration de la page d'accueil.
 * Couvre l'affichage de la liste/compteur, la gestion d'erreur,
 * et les fonctionnalités admin (consultation privée + suppression).
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HomePage from './HomePage';
import { AuthProvider } from '../context/AuthContext';
import { getUsers, getUserDetail, deleteUser } from '../api';

jest.mock('../api');

const USERS = [
  { id: 1, nom: 'Martin', prenom: 'Alice', ville: 'Paris' },
  { id: 2, nom: 'Durand', prenom: 'Bob', ville: 'Lyon' },
];

const renderHome = ({ admin = false } = {}) => {
  if (admin) localStorage.setItem('adminToken', 'ynov-admin-token');
  return render(
    <AuthProvider>
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    </AuthProvider>
  );
};

describe('HomePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    getUsers.mockResolvedValue(USERS);
  });

  test('affiche le nombre d\'utilisateurs et la liste', async () => {
    renderHome();
    expect(
      await screen.findByText(/2 user\(s\) already registered/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Alice Martin — Paris/)).toBeInTheDocument();
  });

  test('affiche un message d\'erreur si l\'API échoue', async () => {
    getUsers.mockRejectedValue(new Error('Network Error'));
    renderHome();
    expect(await screen.findByTestId('home-error')).toBeInTheDocument();
  });

  test('contient un lien vers le formulaire d\'inscription', async () => {
    renderHome();
    await screen.findByText(/already registered/i);
    expect(screen.getByTestId('go-to-register')).toHaveAttribute(
      'href',
      '/register'
    );
  });

  test('ne montre pas les actions admin pour un visiteur', async () => {
    renderHome();
    await screen.findByText(/already registered/i);
    expect(screen.queryByTestId('delete-1')).not.toBeInTheDocument();
  });

  // ── Mode admin ───────────────────────────────────────────────────────────────
  describe('mode admin', () => {
    test('affiche les infos privées au clic sur Détails', async () => {
      getUserDetail.mockResolvedValue({
        id: 1,
        nom: 'Martin',
        prenom: 'Alice',
        email: 'alice@example.com',
        date_naissance: '1995-04-12',
        ville: 'Paris',
        code_postal: '75001',
      });
      renderHome({ admin: true });

      fireEvent.click(await screen.findByTestId('detail-1'));

      expect(await screen.findByTestId('user-detail')).toBeInTheDocument();
      expect(screen.getByText(/alice@example.com/)).toBeInTheDocument();
      expect(getUserDetail).toHaveBeenCalledWith(1, 'ynov-admin-token');
    });

    test('supprime un utilisateur et recharge la liste', async () => {
      deleteUser.mockResolvedValue({ deleted: 2 });
      // après suppression, la liste ne contient plus l'utilisateur 2
      getUsers
        .mockResolvedValueOnce(USERS)
        .mockResolvedValueOnce([USERS[0]]);

      renderHome({ admin: true });

      fireEvent.click(await screen.findByTestId('delete-2'));

      await waitFor(() =>
        expect(deleteUser).toHaveBeenCalledWith(2, 'ynov-admin-token')
      );
      expect(
        await screen.findByText(/1 user\(s\) already registered/i)
      ).toBeInTheDocument();
    });

    test('ferme le panneau de détails', async () => {
      getUserDetail.mockResolvedValue({ id: 1, nom: 'Martin', email: 'a@b.c' });
      renderHome({ admin: true });

      fireEvent.click(await screen.findByTestId('detail-1'));
      await screen.findByTestId('user-detail');

      fireEvent.click(screen.getByTestId('close-detail'));
      expect(screen.queryByTestId('user-detail')).not.toBeInTheDocument();
    });

    test('affiche une erreur si la consultation des détails échoue', async () => {
      getUserDetail.mockRejectedValue(new Error('401'));
      renderHome({ admin: true });

      fireEvent.click(await screen.findByTestId('detail-1'));
      expect(await screen.findByTestId('home-error')).toBeInTheDocument();
    });

    test('affiche une erreur si la suppression échoue', async () => {
      deleteUser.mockRejectedValue(new Error('401'));
      renderHome({ admin: true });

      fireEvent.click(await screen.findByTestId('delete-1'));
      expect(await screen.findByTestId('home-error')).toBeInTheDocument();
    });
  });
});
