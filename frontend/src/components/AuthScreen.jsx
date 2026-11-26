import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';

const initialForm = {
  name: '',
  email: '',
  password: ''
};

export default function AuthScreen() {
  const { error, login, register, loadingAuth, setError } = useApp();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState(initialForm);

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function switchMode(nextMode) {
    setMode(nextMode);
    setError('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    const payload =
      mode === 'login'
        ? { email: form.email, password: form.password }
        : form;

    try {
      if (mode === 'login') {
        await login(payload);
      } else {
        await register(payload);
      }
      setForm(initialForm);
    } catch (err) {
      return;
    }
  }

  return (
    <div className="screen-shell">
      <div className="auth-scene">
        <section className="auth-hero">
          <p className="eyebrow">Focused planning for real work</p>
          <h1>Keep every list, deadline, and priority in one sharp-looking workspace.</h1>
          <p className="hero-copy">
            Secure sign-in, separate user data, overdue visibility, and a calmer daily workflow.
          </p>
          <div className="hero-metrics">
            <div className="metric-card">
              <strong>Protected</strong>
              <span>JWT auth with user-scoped lists and tasks</span>
            </div>
            <div className="metric-card">
              <strong>Organized</strong>
              <span>Smart filters for pending, completed, and overdue work</span>
            </div>
            <div className="metric-card">
              <strong>Responsive</strong>
              <span>Polished layout built to work on desktop and mobile</span>
            </div>
          </div>
        </section>

        <section className="auth-panel">
          <div className="auth-toggle">
            <button
              type="button"
              className={mode === 'login' ? 'toggle-active' : ''}
              onClick={() => switchMode('login')}
            >
              Sign in
            </button>
            <button
              type="button"
              className={mode === 'register' ? 'toggle-active' : ''}
              onClick={() => switchMode('register')}
            >
              Create account
            </button>
          </div>

          <div className="auth-copy">
            <h2>{mode === 'login' ? 'Welcome back' : 'Create your workspace'}</h2>
            <p>
              {mode === 'login'
                ? 'Sign in to continue managing your lists.'
                : 'Register once and your lists become private to your account.'}
            </p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {mode === 'register' && (
              <label>
                <span>Name</span>
                <input
                  type="text"
                  value={form.name}
                  onChange={(event) => updateField('name', event.target.value)}
                  placeholder="Alex Morgan"
                  autoComplete="name"
                  required
                />
              </label>
            )}

            <label>
              <span>Email</span>
              <input
                type="email"
                value={form.email}
                onChange={(event) => updateField('email', event.target.value)}
                placeholder="alex@example.com"
                autoComplete="email"
                required
              />
            </label>

            <label>
              <span>Password</span>
              <input
                type="password"
                value={form.password}
                onChange={(event) => updateField('password', event.target.value)}
                placeholder="At least 6 characters"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                required
              />
            </label>

            {error && <p className="form-error">{error}</p>}

            <button type="submit" className="btn-primary btn-block" disabled={loadingAuth}>
              {loadingAuth
                ? 'Please wait...'
                : mode === 'login'
                  ? 'Sign in'
                  : 'Create account'}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
