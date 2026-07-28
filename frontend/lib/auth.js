import { cookies } from 'next/headers';

export const TOKEN_COOKIE = 'hr_token';

/**
 * Reads the JWT from the httpOnly cookie (server-side only).
 */
export function getToken() {
  return cookies().get(TOKEN_COOKIE)?.value || null;
}

/**
 * Decodes the JWT payload WITHOUT verifying the signature. This is used purely
 * to drive UI (e.g. show the Approve button to admins). All real authorization
 * is enforced by the backend on every request -- never trust this client-side.
 */
export function getSession() {
  const token = getToken();
  if (!token) return null;
  try {
    const payload = token.split('.')[1];
    const json = Buffer.from(payload, 'base64').toString('utf8');
    const { userId, role, exp } = JSON.parse(json);
    if (exp && Date.now() >= exp * 1000) return null; // expired
    return { userId, role };
  } catch {
    return null;
  }
}
