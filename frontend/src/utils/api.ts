export const API_BASE = 'http://localhost:3000/api';

export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const loginUser = async (username: string, password: string) => {
  const res = await fetch(`${API_BASE}/user/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error?.error || 'Fel vid inloggning');
  }

  return await res.json(); // { accessToken, refreshToken }
};

export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) throw new Error('Ingen refresh-token');

  const res = await fetch(`${API_BASE}/user/refresh-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),  // Skickas i body
  });

  if (!res.ok) throw new Error('Kunde inte förnya token');

  const data = await res.json(); // { token }
  localStorage.setItem('token', data.token);
  return data.token;
};

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const res = await fetch(url, { ...options, headers });

  if (res.status === 401 || res.status === 403) {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      const refreshRes = await fetch(`${API_BASE}/user/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (refreshRes.ok) {
        const { token: newToken } = await refreshRes.json();
        localStorage.setItem('token', newToken);

        const retryRes = await fetch(url, {
          ...options,
          headers: {
            ...headers,
            Authorization: `Bearer ${newToken}`,
          },
        });

        if (!retryRes.ok) {
          throw new Error('Misslyckades att hämta data efter token-uppdatering');
        }

        return await retryRes.json();
      } else {
        throw new Error('Kunde inte uppdatera token');
      }
    }
  }

  if (!res.ok) {
    throw new Error(`Fetch misslyckades: ${res.status}`);
  }

  return await res.json();
}

// API-anrop som använder fetchWithAuth:

export const fetchNotes = async () => {
  return await fetchWithAuth(`${API_BASE}/notes`);
};

export const createNote = async (title: string, text: string) => {
  return await fetchWithAuth(`${API_BASE}/notes`, {
    method: 'POST',
    body: JSON.stringify({ title, text }),
  });
};

export const updateNote = async (id: string, title: string, text: string) => {
  return await fetchWithAuth(`${API_BASE}/notes/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ title, text }),
  });
};

export const deleteNote = async (id: string) => {
  await fetchWithAuth(`${API_BASE}/notes/${id}`, {
    method: 'DELETE',
  });
};

export const searchNotes = async (query: string) => {
  return await fetchWithAuth(`${API_BASE}/notes/search?q=${encodeURIComponent(query)}`);
};

export const getMe = async () => {
  return await fetchWithAuth(`${API_BASE}/user/me`);
};
