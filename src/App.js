import './App.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RegisterForm from './components/RegisterForm';
import AdminLoginPage from './pages/AdminLoginPage';
import { AuthProvider, useAuth } from './context/AuthContext';

/**
 * Barre de navigation : liens principaux + connexion/déconnexion admin.
 */
function Nav() {
  const { isAdmin, logout } = useAuth();
  return (
    <nav className="main-nav">
      <Link to="/" data-testid="nav-home">
        Accueil
      </Link>
      <Link to="/register" data-testid="nav-register">
        Inscription
      </Link>
      {isAdmin ? (
        <button type="button" onClick={logout} data-testid="nav-logout">
          Déconnexion
        </button>
      ) : (
        <Link to="/login" data-testid="nav-login">
          Connexion admin
        </Link>
      )}
    </nav>
  );
}

/**
 * Composant racine : navigation + routes.
 * basename = PUBLIC_URL pour rester compatible avec le déploiement GitHub Pages.
 */
function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <div className="App">
          <Nav />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/login" element={<AdminLoginPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
