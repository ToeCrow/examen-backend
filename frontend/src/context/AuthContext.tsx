// src/context/AuthContext.tsx

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  login: (token: string, refreshToken: string) => void;
  logout: () => void;
  updateToken: (token: string) => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  token: null,
  login: () => {},
  logout: () => {},
  updateToken: () => {},
});

export const useAuth = () => useContext(AuthContext);

const INACTIVITY_TIMEOUT = 5 * 60 * 1000; // 5 minuter inaktivitet

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setToken(null);
  }, []);

  const login = (newToken: string, refreshToken: string) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('refreshToken', refreshToken);
    setToken(newToken);
  };

  const updateToken = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  useEffect(() => {
    if (!token) return; // Om ej inloggad, gör inget

    let timeout: ReturnType<typeof setTimeout>;

    const resetTimer = () => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        logout();
        alert('Du har loggats ut på grund av inaktivitet.');
      }, INACTIVITY_TIMEOUT);
    };

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    window.addEventListener('click', resetTimer);

    resetTimer();

    return () => {
      if (timeout) clearTimeout(timeout);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      window.removeEventListener('click', resetTimer);
    };
  }, [token, logout]);

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, login, logout, updateToken }}>
      {children}
    </AuthContext.Provider>
  );
};
