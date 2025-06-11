// src/utils/api.ts

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

  return await res.json(); // { token, refreshToken }
};

export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) throw new Error('Ingen refresh-token');

  const res = await fetch(`${API_BASE}/user/refresh-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),  // <-- Skicka i body!
  });

  if (!res.ok) throw new Error('Kunde inte förnya token');

  const data = await res.json(); // { token }
  localStorage.setItem('token', data.token); // <-- använd data.token
  return data.token;
};


export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  let token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  let res = await fetch(url, { ...options, headers });

  if (res.status === 401) {
    // Försök förnya token
    try {
      token = await refreshAccessToken();
    } catch {
      // Refresh token fungerade inte, kasta error så frontend kan logga ut
      throw new Error('Sessionen har gått ut');
    }

    // Försök igen med ny token
    const newHeaders = {
      ...headers,
      Authorization: `Bearer ${token}`,
    };

    res = await fetch(url, { ...options, headers: newHeaders });
  }

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData?.error || 'Något gick fel');
  }

  return res.json();
};

// Nu omdefiniera dina API-anrop så de använder fetchWithAuth:

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
