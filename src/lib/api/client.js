const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

let accessToken = null;

export function setAccessToken(token) {
  accessToken = token;
}

export function clearAccessToken() {
  accessToken = null;
}

export function getAccessToken() {
  return accessToken;
}

export async function fetchToken() {
  const res = await fetch(`${API_URL}/api/v1/auth/token`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error('Failed to exchange session for token');
  }

  const json = await res.json();
  setAccessToken(json.data.accessToken);
  return json.data;
}

export async function apiFetch(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  let res = await fetch(`${API_URL}/api/v1${path}`, {
    ...options,
    credentials: 'include',
    headers,
  });

  if (res.status === 401 && accessToken) {
    await fetchToken();
    headers.Authorization = `Bearer ${accessToken}`;
    res = await fetch(`${API_URL}/api/v1${path}`, {
      ...options,
      credentials: 'include',
      headers,
    });
  }

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.error?.message || 'Request failed');
  }

  return json.data;
}
