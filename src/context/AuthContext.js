import React, { createContext, useContext, useState } from 'react';

/**
 * Contexte d'authentification administrateur.
 * Le token est conservé dans le localStorage pour survivre aux rechargements.
 */
const AuthContext = createContext(null);

const STORAGE_KEY = 'adminToken';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_KEY));

  const login = (newToken) => {
    localStorage.setItem(STORAGE_KEY, newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, isAdmin: Boolean(token), login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
