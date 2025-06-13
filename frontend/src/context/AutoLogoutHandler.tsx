import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useAuth } from './AuthContext';
import { setLogoutMessage } from '../store/notificationSlice';

const INACTIVITY_TIMEOUT = 5 * 60 * 1000; // 5 min
const REFRESH_INTERVAL   = 14 * 60 * 1000 + 59 * 1000; // 14 min 59 s

const AutoLogoutHandler = () => {
  const { token, logout, updateToken } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  /* ───────────── Inaktivitets-logout ───────────── */
  useEffect(() => {
    if (!token) return;

    let timeout: ReturnType<typeof setTimeout>;

    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        logout();
        dispatch(setLogoutMessage('Du loggades ut på grund av inaktivitet.'));
        navigate('/login');
      }, INACTIVITY_TIMEOUT);
    };

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    window.addEventListener('click', resetTimer);

    resetTimer();

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      window.removeEventListener('click', resetTimer);
    };
  }, [token, logout, navigate, dispatch]);

  /* ───────────── Automatisk token-refresh ───────────── */
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
          credentials: 'omit',
        });

        if (!res.ok) {
          logout();
          return;
        }

        const { accessToken } = await res.json();
        updateToken(accessToken);
        console.log('[🔁] Access-token förnyad automatiskt');
      } catch {
        logout();
      }
    }, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [token, logout, updateToken]);

  return null;
};

export default AutoLogoutHandler;
