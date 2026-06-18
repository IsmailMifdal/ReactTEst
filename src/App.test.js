import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import { getUsers } from './api';

// L'app fait des appels réseau (page d'accueil) -> on simule le service API.
jest.mock('./api');

/**
 * Tests d'intégration du composant App (navigation + page d'accueil).
 */
describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    // BrowserRouter partage l'historique jsdom entre les tests -> on remet à '/'
    window.history.pushState({}, '', '/');
    getUsers.mockResolvedValue([
      { id: 1, nom: 'Martin', prenom: 'Alice', ville: 'Paris' },
    ]);
  });

  test("affiche la page d'accueil avec le nombre d'utilisateurs", async () => {
    render(<App />);
    expect(
      await screen.findByText(/1 user\(s\) already registered/i)
    ).toBeInTheDocument();
  });

  test('affiche la navigation (visiteur : lien connexion admin)', () => {
    render(<App />);
    expect(screen.getByTestId('nav-home')).toBeInTheDocument();
    expect(screen.getByTestId('nav-register')).toBeInTheDocument();
    expect(screen.getByTestId('nav-login')).toBeInTheDocument();
  });

  test("navigue vers le formulaire d'inscription", async () => {
    render(<App />);
    await screen.findByText(/already registered/i);

    fireEvent.click(screen.getByTestId('nav-register'));

    expect(
      screen.getByRole('heading', { name: /inscription/i })
    ).toBeInTheDocument();
  });

  test('navigue vers la page de connexion admin', async () => {
    render(<App />);
    await screen.findByText(/already registered/i);

    fireEvent.click(screen.getByTestId('nav-login'));

    expect(
      screen.getByRole('heading', { name: /connexion administrateur/i })
    ).toBeInTheDocument();
  });

  test('affiche le bouton déconnexion si admin connecté', async () => {
    localStorage.setItem('adminToken', 'ynov-admin-token');
    render(<App />);
    await screen.findByText(/already registered/i);
    expect(screen.getByTestId('nav-logout')).toBeInTheDocument();
  });

  test('la déconnexion supprime le token et réaffiche le lien connexion', async () => {
    localStorage.setItem('adminToken', 'ynov-admin-token');
    render(<App />);
    await screen.findByText(/already registered/i);

    fireEvent.click(screen.getByTestId('nav-logout'));

    expect(localStorage.getItem('adminToken')).toBeNull();
    expect(screen.getByTestId('nav-login')).toBeInTheDocument();
  });
});
