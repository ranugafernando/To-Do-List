const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const TOKEN_KEY = 'todoapp_auth_token';

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function storeToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

async function apiFetch(path, { token, headers, ...options } = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers
    }
  });

  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json')
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      typeof payload === 'object' && payload && payload.error
        ? payload.error
        : 'Request failed';
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return payload;
}

export function registerUser(credentials) {
  return apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify(credentials)
  });
}

export function loginUser(credentials) {
  return apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  });
}

export function getCurrentUser(token) {
  return apiFetch('/auth/me', { token });
}

export function getLists(token) {
  return apiFetch('/lists', { token });
}

export function createList(token, name) {
  return apiFetch('/lists', {
    method: 'POST',
    token,
    body: JSON.stringify({ name })
  });
}

export function renameList(token, id, name) {
  return apiFetch(`/lists/${id}`, {
    method: 'PUT',
    token,
    body: JSON.stringify({ name })
  });
}

export function deleteList(token, id) {
  return apiFetch(`/lists/${id}`, {
    method: 'DELETE',
    token
  });
}

export function getTasks(token, listId) {
  return apiFetch(`/tasks/${listId}/tasks`, { token });
}

export function createTask(token, listId, fields) {
  return apiFetch(`/tasks/${listId}/tasks`, {
    method: 'POST',
    token,
    body: JSON.stringify(fields)
  });
}

export function updateTask(token, id, fields) {
  return apiFetch(`/tasks/${id}`, {
    method: 'PUT',
    token,
    body: JSON.stringify(fields)
  });
}

export function deleteTask(token, id) {
  return apiFetch(`/tasks/${id}`, {
    method: 'DELETE',
    token
  });
}
