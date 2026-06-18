import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AdminLoginPage from './AdminLoginPage';
import { AuthProvider } from '../context/AuthContext';
import { login as apiLogin } from '../api';

jest.mock('../api');

const renderPage = () =>
  render(
    <AuthProvider>
      <MemoryRouter>
        <AdminLoginPage />
      </MemoryRouter>
    </AuthProvider>
  );

const fillCreds = () => {
  fireEvent.change(screen.getByLabelText('Email'), {
    target: { value: 'loise.fenoll@ynov.com' },
  });
  fireEvent.change(screen.getByLabelText('Mot de passe'), {
    target: { value: 'PvdrTAzTeR247sDnAZBr' },
  });
};

describe('AdminLoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('connecte l\'admin et stocke le token', async () => {
    apiLogin.mockResolvedValue('ynov-admin-token');
    renderPage();

    fillCreds();
    fireEvent.click(screen.getByRole('button', { name: /se connecter/i }));

    await waitFor(() =>
      expect(apiLogin).toHaveBeenCalledWith(
        'loise.fenoll@ynov.com',
        'PvdrTAzTeR247sDnAZBr'
      )
    );
    await waitFor(() =>
      expect(localStorage.getItem('adminToken')).toBe('ynov-admin-token')
    );
  });

  test('affiche une erreur si les identifiants sont invalides', async () => {
    apiLogin.mockRejectedValue(new Error('401'));
    renderPage();

    fillCreds();
    fireEvent.click(screen.getByRole('button', { name: /se connecter/i }));

    expect(await screen.findByTestId('login-error')).toBeInTheDocument();
    expect(localStorage.getItem('adminToken')).toBeNull();
  });
});
