# Formulaire d'Inscription React

Application React permettant à un utilisateur de s'inscrire via un formulaire avec validation complète côté client et sauvegarde dans le `localStorage`.

---

## Fonctionnalités

- Saisie de 6 champs : **Nom**, **Prénom**, **Email**, **Date de naissance**, **Ville**, **Code postal**
- Validation à la soumission :
  - Blocage des utilisateurs de moins de **18 ans**
  - Code postal au **format français** (5 chiffres)
  - Nom, prénom et ville : lettres, espaces, tirets et apostrophes uniquement (min. 2 caractères)
  - Email : format valide (`xxx@yyy.zzz`)
- Sauvegarde des données dans le **localStorage** (`registeredUser`)
- Affichage d'un **message de succès** personnalisé après inscription
- Messages d'erreur accessibles (`role="alert"`, `aria-describedby`)

---

## Technologies

| Outil | Version |
|---|---|
| React | 19.x |
| react-scripts | 5.0.1 |
| @testing-library/react | 16.x |
| @testing-library/jest-dom | 6.x |
| Jest (embarqué) | 27.x |

---

## Installation

```bash
npm install
```

---

## Démarrage

```bash
npm start
```

Ouvre l'application sur [http://localhost:3000](http://localhost:3000).

---

## Tests

### Lancer tous les tests avec couverture

```bash
npm run test -- --watchAll=false
```

### Résultat attendu

```
Test Suites: 3 passed, 3 total
```

Couverture **100 %** sur :

| Fichier | Stmts | Branch | Funcs | Lines |
|---|---|---|---|---|
| `src/App.js` | 100 | 100 | 100 | 100 |
| `src/utils/validators.js` | 100 | 100 | 100 | 100 |
| `src/components/RegisterForm.js` | 100 | 100 | 100 | 100 |

> `src/index.js`, `src/reportWebVitals.js` et `src/module.js` sont exclus de la couverture.

---

## Structure du projet

```
src/
├── App.js                          # Composant racine
├── App.test.js                     # Tests d'intégration App
├── index.js                        # Point d'entrée (exclu de la couverture)
├── reportWebVitals.js              # Web vitals (exclu de la couverture)
├── utils/
│   ├── validators.js               # Fonctions de validation
│   └── validators.test.js          # Tests unitaires des validateurs
└── components/
    ├── RegisterForm.js             # Composant formulaire
    ├── RegisterForm.css            # Styles du formulaire
    └── RegisterForm.test.js        # Tests d'intégration du formulaire
```

---

## Règles de validation

### Nom / Prénom / Ville

| Règle | Détail |
|---|---|
| Longueur minimale | 2 caractères (après trim) |
| Caractères autorisés | Lettres (a-z, A-Z, accents français), espaces, tirets `-`, apostrophes `'` |

### Email

| Règle | Détail |
|---|---|
| Format | Doit respecter `xxx@yyy.zzz` |
| Valeur vide | Refusée |

### Date de naissance

| Règle | Détail |
|---|---|
| Âge minimum | 18 ans révolus à la date de soumission |
| Calcul | Tient compte du mois et du jour exact (pas seulement l'année) |

### Code postal

| Règle | Détail |
|---|---|
| Format | Exactement **5 chiffres** |
| Exemples valides | `75001`, `13000`, `69001` |

---

## API — Fonctions de validation (`src/utils/validators.js`)

```js
validateNom(value: string): string | null
validatePrenom(value: string): string | null
validateEmail(value: string): string | null
validateDateDeNaissance(value: string): string | null  // format YYYY-MM-DD
validateVille(value: string): string | null
validateCodePostal(value: string): string | null
validateForm(formData: object): object   // retourne { nom, prenom, email, dateDeNaissance, ville, codePostal }
isFormValid(errors: object): boolean
```

Chaque fonction retourne `null` si la valeur est valide, ou un `string` contenant le message d'erreur.

---

## localStorage

À la soumission réussie, les données sont sérialisées en JSON sous la clé `registeredUser` :

```json
{
  "nom": "Dupont",
  "prenom": "Jean",
  "email": "jean.dupont@example.com",
  "dateDeNaissance": "1995-06-15",
  "ville": "Paris",
  "codePostal": "75001"
}
```

---

## Accessibilité

- Chaque champ possède un `<label>` associé via `htmlFor` / `id`
- Les messages d'erreur utilisent `role="alert"` pour être annoncés par les lecteurs d'écran
- L'attribut `aria-describedby` pointe vers le message d'erreur du champ concerné lorsqu'une erreur est présente

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
