/**
 * @fileoverview Tests d'intégration pour le composant RegisterForm.
 *
 * Ces tests vérifient le comportement complet du formulaire :
 *  - Rendu initial
 *  - Mise à jour des champs (handleChange)
 *  - Affichage des erreurs sur soumission invalide
 *  - Sauvegarde localStorage et affichage du succès sur soumission valide
 */

import { render, screen, fireEvent } from '@testing-library/react';
import RegisterForm from './RegisterForm';

// ─── Mock localStorage ────────────────────────────────────────────────────────
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] ?? null,
    setItem: (key, value) => {
      store[key] = String(value);
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });


const VALID_DATA = {
  nom: 'Dupont',
  prenom: 'Jean',
  email: 'jean.dupont@example.com',
  dateDeNaissance: '1995-06-15',  
  ville: 'Paris',
  codePostal: '75001',
};


const fillForm = (overrides = {}) => {
  const data = { ...VALID_DATA, ...overrides };

  fireEvent.change(screen.getByLabelText('Nom'), {
    target: { name: 'nom', value: data.nom },
  });
  fireEvent.change(screen.getByLabelText('Prénom'), {
    target: { name: 'prenom', value: data.prenom },
  });
  fireEvent.change(screen.getByLabelText('Email'), {
    target: { name: 'email', value: data.email },
  });
  fireEvent.change(screen.getByLabelText('Date de naissance'), {
    target: { name: 'dateDeNaissance', value: data.dateDeNaissance },
  });
  fireEvent.change(screen.getByLabelText('Ville'), {
    target: { name: 'ville', value: data.ville },
  });
  fireEvent.change(screen.getByLabelText('Code postal'), {
    target: { name: 'codePostal', value: data.codePostal },
  });
};


describe('RegisterForm', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  
  describe('Rendu initial', () => {
    test('affiche le titre "Inscription"', () => {
      render(<RegisterForm />);
      expect(screen.getByRole('heading', { name: /inscription/i })).toBeInTheDocument();
    });

    test('affiche les 6 champs du formulaire', () => {
      render(<RegisterForm />);
      expect(screen.getByLabelText('Nom')).toBeInTheDocument();
      expect(screen.getByLabelText('Prénom')).toBeInTheDocument();
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Date de naissance')).toBeInTheDocument();
      expect(screen.getByLabelText('Ville')).toBeInTheDocument();
      expect(screen.getByLabelText('Code postal')).toBeInTheDocument();
    });

    test("affiche le bouton S'inscrire", () => {
      render(<RegisterForm />);
      expect(
        screen.getByRole('button', { name: /s'inscrire/i })
      ).toBeInTheDocument();
    });

    test('ne présente aucun message d\'erreur au départ', () => {
      render(<RegisterForm />);
      expect(screen.queryAllByRole('alert')).toHaveLength(0);
    });
  });

  
  describe('handleChange', () => {
    test('met à jour le champ nom', () => {
      render(<RegisterForm />);
      fireEvent.change(screen.getByLabelText('Nom'), {
        target: { name: 'nom', value: 'Martin' },
      });
      expect(screen.getByLabelText('Nom')).toHaveValue('Martin');
    });

    test('met à jour le champ prénom', () => {
      render(<RegisterForm />);
      fireEvent.change(screen.getByLabelText('Prénom'), {
        target: { name: 'prenom', value: 'Sophie' },
      });
      expect(screen.getByLabelText('Prénom')).toHaveValue('Sophie');
    });

    test('met à jour le champ email', () => {
      render(<RegisterForm />);
      fireEvent.change(screen.getByLabelText('Email'), {
        target: { name: 'email', value: 'sophie@test.fr' },
      });
      expect(screen.getByLabelText('Email')).toHaveValue('sophie@test.fr');
    });

    test('met à jour le champ date de naissance', () => {
      render(<RegisterForm />);
      fireEvent.change(screen.getByLabelText('Date de naissance'), {
        target: { name: 'dateDeNaissance', value: '1990-03-20' },
      });
      expect(screen.getByLabelText('Date de naissance')).toHaveValue('1990-03-20');
    });

    test('met à jour le champ ville', () => {
      render(<RegisterForm />);
      fireEvent.change(screen.getByLabelText('Ville'), {
        target: { name: 'ville', value: 'Lyon' },
      });
      expect(screen.getByLabelText('Ville')).toHaveValue('Lyon');
    });

    test('met à jour le champ code postal', () => {
      render(<RegisterForm />);
      fireEvent.change(screen.getByLabelText('Code postal'), {
        target: { name: 'codePostal', value: '69001' },
      });
      expect(screen.getByLabelText('Code postal')).toHaveValue('69001');
    });
  });


  describe('Soumission avec données invalides', () => {
    test('affiche 6 messages d\'erreur si tous les champs sont vides', () => {
      render(<RegisterForm />);
      fireEvent.click(screen.getByRole('button', { name: /s'inscrire/i }));
      expect(screen.getAllByRole('alert')).toHaveLength(6);
    });

    test('affiche aria-describedby sur chaque champ en erreur', () => {
      render(<RegisterForm />);
      fireEvent.click(screen.getByRole('button', { name: /s'inscrire/i }));
      expect(screen.getByLabelText('Nom')).toHaveAttribute('aria-describedby', 'nom-error');
      expect(screen.getByLabelText('Prénom')).toHaveAttribute('aria-describedby', 'prenom-error');
      expect(screen.getByLabelText('Email')).toHaveAttribute('aria-describedby', 'email-error');
      expect(screen.getByLabelText('Date de naissance')).toHaveAttribute(
        'aria-describedby',
        'dateDeNaissance-error'
      );
      expect(screen.getByLabelText('Ville')).toHaveAttribute('aria-describedby', 'ville-error');
      expect(screen.getByLabelText('Code postal')).toHaveAttribute(
        'aria-describedby',
        'codePostal-error'
      );
    });

    test('ne sauvegarde pas dans le localStorage si le formulaire est invalide', () => {
      render(<RegisterForm />);
      fireEvent.click(screen.getByRole('button', { name: /s'inscrire/i }));
      expect(localStorageMock.getItem('registeredUser')).toBeNull();
    });

    test('ne passe pas en vue de succès si le formulaire est invalide', () => {
      render(<RegisterForm />);
      fireEvent.click(screen.getByRole('button', { name: /s'inscrire/i }));
      expect(screen.queryByTestId('success-message')).not.toBeInTheDocument();
    });
  });

  // ── Soumission valide ────────────────────────────────────────────────────────
  describe('Soumission avec données valides', () => {
    test('sauvegarde les données dans le localStorage', () => {
      render(<RegisterForm />);
      fillForm();
      fireEvent.click(screen.getByRole('button', { name: /s'inscrire/i }));

      const saved = JSON.parse(localStorageMock.getItem('registeredUser'));
      expect(saved).not.toBeNull();
      expect(saved.nom).toBe('Dupont');
      expect(saved.prenom).toBe('Jean');
      expect(saved.email).toBe('jean.dupont@example.com');
    });

    test('affiche le message de succès', () => {
      render(<RegisterForm />);
      fillForm();
      fireEvent.click(screen.getByRole('button', { name: /s'inscrire/i }));

      expect(screen.getByTestId('success-message')).toBeInTheDocument();
      expect(screen.getByText(/inscription réussie/i)).toBeInTheDocument();
    });

    test('affiche le prénom et le nom dans le message de succès', () => {
      render(<RegisterForm />);
      fillForm();
      fireEvent.click(screen.getByRole('button', { name: /s'inscrire/i }));

      expect(screen.getByText(/Jean Dupont/)).toBeInTheDocument();
    });

    test('affiche l\'email dans le message de succès', () => {
      render(<RegisterForm />);
      fillForm();
      fireEvent.click(screen.getByRole('button', { name: /s'inscrire/i }));

      expect(screen.getByText(/jean\.dupont@example\.com/)).toBeInTheDocument();
    });

    test('masque le formulaire après une soumission réussie', () => {
      render(<RegisterForm />);
      fillForm();
      fireEvent.click(screen.getByRole('button', { name: /s'inscrire/i }));

      expect(
        screen.queryByRole('button', { name: /s'inscrire/i })
      ).not.toBeInTheDocument();
    });
  });
});
