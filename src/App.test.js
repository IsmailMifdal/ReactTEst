import { render, screen } from '@testing-library/react';
import App from './App';

/**
 * Tests d'intégration du composant App.
 */
describe('App', () => {
  test("affiche le formulaire d'inscription", () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /inscription/i })).toBeInTheDocument();
  });

  test("affiche le bouton S'inscrire", () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /s'inscrire/i })).toBeInTheDocument();
  });
});

