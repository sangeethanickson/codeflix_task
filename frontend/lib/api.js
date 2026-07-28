const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5001';

/**
 * Thin server-side client for the HR backend API.
 *
 * - Injects the Bearer token when provided.
 * - Normalizes error handling so callers get a thrown Error with the API's
 *   message.
 * - Caching is opt-in per call via `next` (defaults to no caching for
 *   authenticated, user-specific data).
 */
export async function apiFetch(path, { token, method = 'GET', body, next, cache } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BACKEND_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    ...(next ? { next } : {}),
    ...(cache ? { cache } : {}),
  });

  const isJson = res.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await res.json() : null;

  if (!res.ok) {
    const message = data?.message || `Request failed (${res.status})`;
    const error = new Error(message);
    error.status = res.status;
    throw error;
  }

  return data;
}
