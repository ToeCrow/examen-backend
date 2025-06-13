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
const REFRESH_INTERVAL = 14 * 60 * 1000 + 59 * 1000; // refresh efter 14:59

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

  // Inaktivitets-logout (valfritt)
  useEffect(() => {
    if (!token) return;

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

  // --- Automatisk refresh av token ---
  useEffect(() => {
    if (!token) return;

    const interval = setInterval(async () => {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        logout();
        return;
      }

      try {
        const res = await fetch('http://localhost:3000/api/user/refresh-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });

        if (!res.ok) {
          logout();
          return;
        }

        const data = await res.json();
        updateToken(data.accessToken);
        console.log('[🔁] Access-token förnyad automatiskt');
      } catch {
        logout();
      }
    }, REFRESH_INTERVAL); // Förnya var 9:e sekund (innan 10s access-token går ut)

    return () => clearInterval(interval);
  }, [token, logout]);

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, login, logout, updateToken }}>
      {children}
    </AuthContext.Provider>
  );
};
