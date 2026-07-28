'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { apiFetch } from '../lib/api';
import { TOKEN_COOKIE, getToken } from '../lib/auth';

/**
 * Server action: authenticate against the backend and store the JWT in an
 * httpOnly, SameSite cookie. Because the cookie is httpOnly it is not readable
 * by client JS, which mitigates token theft via XSS.
 *
 * Returns a plain object on failure (so the client form can render the error);
 * redirects on success.
 */
export async function loginAction(_prevState, formData) {
  const email = formData.get('email');
  const password = formData.get('password');

  let token;
  try {
    const data = await apiFetch('/api/login', {
      method: 'POST',
      body: { email, password },
    });
    token = data.token;
  } catch (err) {
    return { error: err.message || 'Login failed.' };
  }

  cookies().set(TOKEN_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60, // 1h, matches backend token lifetime
  });

  redirect('/dashboard');
}

export async function logoutAction() {
  cookies().delete(TOKEN_COOKIE);
  redirect('/login');
}

/**
 * Server action: approve a leave request. Reads the token from the cookie and
 * forwards it as a Bearer token; the backend enforces admin authorization.
 */
export async function approveLeaveAction(formData) {
  const id = formData.get('id');
  const token = getToken();
  if (!token) redirect('/login');

  await apiFetch(`/api/leave/${id}/approve`, {
    method: 'PUT',
    token,
  });

  revalidatePath('/dashboard');
}
