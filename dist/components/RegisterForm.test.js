"use strict";

var _react = require("@testing-library/react");
var _RegisterForm = _interopRequireDefault(require("./RegisterForm"));
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * @fileoverview Tests d'intégration pour le composant RegisterForm.
 *
 * Ces tests vérifient le comportement complet du formulaire :
 *  - Rendu initial
 *  - Mise à jour des champs (handleChange)
 *  - Affichage des erreurs sur soumission invalide
 *  - Sauvegarde localStorage et affichage du succès sur soumission valide
 */ // ─── Mock localStorage ────────────────────────────────────────────────────────
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: key => {
      var _store$key;
      return (_store$key = store[key]) !== null && _store$key !== void 0 ? _store$key : null;
    },
    setItem: (key, value) => {
      store[key] = String(value);
    },
    removeItem: key => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});
const VALID_DATA = {
  nom: 'Dupont',
  prenom: 'Jean',
  email: 'jean.dupont@example.com',
  dateDeNaissance: '1995-06-15',
  ville: 'Paris',
  codePostal: '75001'
};
const fillForm = function () {
  let overrides = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  const data = _objectSpread(_objectSpread({}, VALID_DATA), overrides);
  _react.fireEvent.change(_react.screen.getByLabelText('Nom'), {
    target: {
      name: 'nom',
      value: data.nom
    }
  });
  _react.fireEvent.change(_react.screen.getByLabelText('Prénom'), {
    target: {
      name: 'prenom',
      value: data.prenom
    }
  });
  _react.fireEvent.change(_react.screen.getByLabelText('Email'), {
    target: {
      name: 'email',
      value: data.email
    }
  });
  _react.fireEvent.change(_react.screen.getByLabelText('Date de naissance'), {
    target: {
      name: 'dateDeNaissance',
      value: data.dateDeNaissance
    }
  });
  _react.fireEvent.change(_react.screen.getByLabelText('Ville'), {
    target: {
      name: 'ville',
      value: data.ville
    }
  });
  _react.fireEvent.change(_react.screen.getByLabelText('Code postal'), {
    target: {
      name: 'codePostal',
      value: data.codePostal
    }
  });
};
describe('RegisterForm', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });
  describe('Rendu initial', () => {
    test('affiche le titre "Inscription"', () => {
      (0, _react.render)(/*#__PURE__*/(0, _jsxRuntime.jsx)(_RegisterForm.default, {}));
      expect(_react.screen.getByRole('heading', {
        name: /inscription/i
      })).toBeInTheDocument();
    });
    test('affiche les 6 champs du formulaire', () => {
      (0, _react.render)(/*#__PURE__*/(0, _jsxRuntime.jsx)(_RegisterForm.default, {}));
      expect(_react.screen.getByLabelText('Nom')).toBeInTheDocument();
      expect(_react.screen.getByLabelText('Prénom')).toBeInTheDocument();
      expect(_react.screen.getByLabelText('Email')).toBeInTheDocument();
      expect(_react.screen.getByLabelText('Date de naissance')).toBeInTheDocument();
      expect(_react.screen.getByLabelText('Ville')).toBeInTheDocument();
      expect(_react.screen.getByLabelText('Code postal')).toBeInTheDocument();
    });
    test("affiche le bouton S'inscrire", () => {
      (0, _react.render)(/*#__PURE__*/(0, _jsxRuntime.jsx)(_RegisterForm.default, {}));
      expect(_react.screen.getByRole('button', {
        name: /s'inscrire/i
      })).toBeInTheDocument();
    });
    test('ne présente aucun message d\'erreur au départ', () => {
      (0, _react.render)(/*#__PURE__*/(0, _jsxRuntime.jsx)(_RegisterForm.default, {}));
      expect(_react.screen.queryAllByRole('alert')).toHaveLength(0);
    });
  });
  describe('handleChange', () => {
    test('met à jour le champ nom', () => {
      (0, _react.render)(/*#__PURE__*/(0, _jsxRuntime.jsx)(_RegisterForm.default, {}));
      _react.fireEvent.change(_react.screen.getByLabelText('Nom'), {
        target: {
          name: 'nom',
          value: 'Martin'
        }
      });
      expect(_react.screen.getByLabelText('Nom')).toHaveValue('Martin');
    });
    test('met à jour le champ prénom', () => {
      (0, _react.render)(/*#__PURE__*/(0, _jsxRuntime.jsx)(_RegisterForm.default, {}));
      _react.fireEvent.change(_react.screen.getByLabelText('Prénom'), {
        target: {
          name: 'prenom',
          value: 'Sophie'
        }
      });
      expect(_react.screen.getByLabelText('Prénom')).toHaveValue('Sophie');
    });
    test('met à jour le champ email', () => {
      (0, _react.render)(/*#__PURE__*/(0, _jsxRuntime.jsx)(_RegisterForm.default, {}));
      _react.fireEvent.change(_react.screen.getByLabelText('Email'), {
        target: {
          name: 'email',
          value: 'sophie@test.fr'
        }
      });
      expect(_react.screen.getByLabelText('Email')).toHaveValue('sophie@test.fr');
    });
    test('met à jour le champ date de naissance', () => {
      (0, _react.render)(/*#__PURE__*/(0, _jsxRuntime.jsx)(_RegisterForm.default, {}));
      _react.fireEvent.change(_react.screen.getByLabelText('Date de naissance'), {
        target: {
          name: 'dateDeNaissance',
          value: '1990-03-20'
        }
      });
      expect(_react.screen.getByLabelText('Date de naissance')).toHaveValue('1990-03-20');
    });
    test('met à jour le champ ville', () => {
      (0, _react.render)(/*#__PURE__*/(0, _jsxRuntime.jsx)(_RegisterForm.default, {}));
      _react.fireEvent.change(_react.screen.getByLabelText('Ville'), {
        target: {
          name: 'ville',
          value: 'Lyon'
        }
      });
      expect(_react.screen.getByLabelText('Ville')).toHaveValue('Lyon');
    });
    test('met à jour le champ code postal', () => {
      (0, _react.render)(/*#__PURE__*/(0, _jsxRuntime.jsx)(_RegisterForm.default, {}));
      _react.fireEvent.change(_react.screen.getByLabelText('Code postal'), {
        target: {
          name: 'codePostal',
          value: '69001'
        }
      });
      expect(_react.screen.getByLabelText('Code postal')).toHaveValue('69001');
    });
  });
  describe('Soumission avec données invalides', () => {
    test('affiche 6 messages d\'erreur si tous les champs sont vides', () => {
      (0, _react.render)(/*#__PURE__*/(0, _jsxRuntime.jsx)(_RegisterForm.default, {}));
      _react.fireEvent.click(_react.screen.getByRole('button', {
        name: /s'inscrire/i
      }));
      expect(_react.screen.getAllByRole('alert')).toHaveLength(6);
    });
    test('affiche aria-describedby sur chaque champ en erreur', () => {
      (0, _react.render)(/*#__PURE__*/(0, _jsxRuntime.jsx)(_RegisterForm.default, {}));
      _react.fireEvent.click(_react.screen.getByRole('button', {
        name: /s'inscrire/i
      }));
      expect(_react.screen.getByLabelText('Nom')).toHaveAttribute('aria-describedby', 'nom-error');
      expect(_react.screen.getByLabelText('Prénom')).toHaveAttribute('aria-describedby', 'prenom-error');
      expect(_react.screen.getByLabelText('Email')).toHaveAttribute('aria-describedby', 'email-error');
      expect(_react.screen.getByLabelText('Date de naissance')).toHaveAttribute('aria-describedby', 'dateDeNaissance-error');
      expect(_react.screen.getByLabelText('Ville')).toHaveAttribute('aria-describedby', 'ville-error');
      expect(_react.screen.getByLabelText('Code postal')).toHaveAttribute('aria-describedby', 'codePostal-error');
    });
    test('ne sauvegarde pas dans le localStorage si le formulaire est invalide', () => {
      (0, _react.render)(/*#__PURE__*/(0, _jsxRuntime.jsx)(_RegisterForm.default, {}));
      _react.fireEvent.click(_react.screen.getByRole('button', {
        name: /s'inscrire/i
      }));
      expect(localStorageMock.getItem('registeredUser')).toBeNull();
    });
    test('ne passe pas en vue de succès si le formulaire est invalide', () => {
      (0, _react.render)(/*#__PURE__*/(0, _jsxRuntime.jsx)(_RegisterForm.default, {}));
      _react.fireEvent.click(_react.screen.getByRole('button', {
        name: /s'inscrire/i
      }));
      expect(_react.screen.queryByTestId('success-message')).not.toBeInTheDocument();
    });
  });

  // ── Soumission valide ────────────────────────────────────────────────────────
  describe('Soumission avec données valides', () => {
    test('sauvegarde les données dans le localStorage', () => {
      (0, _react.render)(/*#__PURE__*/(0, _jsxRuntime.jsx)(_RegisterForm.default, {}));
      fillForm();
      _react.fireEvent.click(_react.screen.getByRole('button', {
        name: /s'inscrire/i
      }));
      const saved = JSON.parse(localStorageMock.getItem('registeredUser'));
      expect(saved).not.toBeNull();
      expect(saved.nom).toBe('Dupont');
      expect(saved.prenom).toBe('Jean');
      expect(saved.email).toBe('jean.dupont@example.com');
    });
    test('affiche le message de succès', () => {
      (0, _react.render)(/*#__PURE__*/(0, _jsxRuntime.jsx)(_RegisterForm.default, {}));
      fillForm();
      _react.fireEvent.click(_react.screen.getByRole('button', {
        name: /s'inscrire/i
      }));
      expect(_react.screen.getByTestId('success-message')).toBeInTheDocument();
      expect(_react.screen.getByText(/inscription réussie/i)).toBeInTheDocument();
    });
    test('affiche le prénom et le nom dans le message de succès', () => {
      (0, _react.render)(/*#__PURE__*/(0, _jsxRuntime.jsx)(_RegisterForm.default, {}));
      fillForm();
      _react.fireEvent.click(_react.screen.getByRole('button', {
        name: /s'inscrire/i
      }));
      expect(_react.screen.getByText(/Jean Dupont/)).toBeInTheDocument();
    });
    test('affiche l\'email dans le message de succès', () => {
      (0, _react.render)(/*#__PURE__*/(0, _jsxRuntime.jsx)(_RegisterForm.default, {}));
      fillForm();
      _react.fireEvent.click(_react.screen.getByRole('button', {
        name: /s'inscrire/i
      }));
      expect(_react.screen.getByText(/jean\.dupont@example\.com/)).toBeInTheDocument();
    });
    test('masque le formulaire après une soumission réussie', () => {
      (0, _react.render)(/*#__PURE__*/(0, _jsxRuntime.jsx)(_RegisterForm.default, {}));
      fillForm();
      _react.fireEvent.click(_react.screen.getByRole('button', {
        name: /s'inscrire/i
      }));
      expect(_react.screen.queryByRole('button', {
        name: /s'inscrire/i
      })).not.toBeInTheDocument();
    });
  });
});