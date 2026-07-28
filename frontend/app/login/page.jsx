'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { loginAction } from '../actions';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn-primary" disabled={pending} style={{ width: '100%' }}>
      {pending ? 'Signing in…' : 'Sign in'}
    </button>
  );
}

export default function LoginPage() {
  const [state, formAction] = useFormState(loginAction, {});

  return (
    <div className="container">
      <div className="card login-wrap">
        <h1>HR Leave Portal</h1>
        <p className="muted" style={{ marginBottom: 24 }}>Sign in to continue</p>

        {state?.error && <div className="error">{state.error}</div>}

        <form action={formAction}>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required autoComplete="email" />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" required autoComplete="current-password" />
          </div>
          <SubmitButton />
        </form>

        <p className="muted" style={{ marginTop: 20 }}>
          Demo: <code>admin@codeflix.test / Admin@123</code> or{' '}
          <code>employee@codeflix.test / Employee@123</code>
        </p>
      </div>
    </div>
  );
}
