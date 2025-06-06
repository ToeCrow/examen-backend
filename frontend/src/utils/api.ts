// src/utils/api.ts

export const API_BASE = 'http://localhost:3000/api';

export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const loginUser = async (username: string, password: string) => {
  const res = await fetch(`${API_BASE}/user/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error?.error || 'Fel vid inloggning');
  }

  return await res.json(); // { token }
};

export const fetchNotes = async () => {
  const res = await fetch(`${API_BASE}/notes`, {
    headers: {
      'Content-Type': 'application/json',
      ...(getAuthHeaders() as Record<string, string>),
    },
  });

  if (!res.ok) throw new Error('Kunde inte hämta anteckningar');
  return await res.json();
};

export const createNote = async (title: string, text: string) => {
  const res = await fetch(`${API_BASE}/notes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(getAuthHeaders() as Record<string, string>),
    },
    body: JSON.stringify({ title, text }),
  });

  if (!res.ok) throw new Error('Kunde inte skapa anteckning');
  return await res.json();
};

export const updateNote = async (id: string, title: string, text: string) => {
  const res = await fetch(`${API_BASE}/notes/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(getAuthHeaders() as Record<string, string>),
    },
    body: JSON.stringify({ title, text }),
  });

  if (!res.ok) throw new Error('Kunde inte uppdatera anteckning');
  return await res.json();
};

export const deleteNote = async (id: string) => {
  const res = await fetch(`${API_BASE}/notes/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...(getAuthHeaders() as Record<string, string>),
    },
  });

  if (!res.ok) throw new Error('Kunde inte ta bort anteckning');
};

export const searchNotes = async (query: string) => {
  const res = await fetch(`${API_BASE}/notes/search?q=${encodeURIComponent(query)}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(getAuthHeaders() as Record<string, string>),
    },
  });

  if (!res.ok) throw new Error('Kunde inte söka anteckningar');
  return await res.json();
};
