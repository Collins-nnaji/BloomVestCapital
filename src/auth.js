const NEON_AUTH_URL = process.env.REACT_APP_NEON_AUTH_URL || '';

async function authFetch(path, options = {}) {
  const res = await fetch(`${NEON_AUTH_URL}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  return res;
}

export const auth = {
  async getSession() {
    try {
      const res = await authFetch('/get-session');
      if (!res.ok) return null;
      const data = await res.json();
      return data.session ? data : null;
    } catch {
      return null;
    }
  },

  async signUpWithEmail(email, password, name) {
    const res = await authFetch('/sign-up/email', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Sign up failed');
    return data;
  },

  async signInWithEmail(email, password) {
    const res = await authFetch('/sign-in/email', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Sign in failed');
    return data;
  },

  async signInWithGoogle() {
    window.location.href = `${NEON_AUTH_URL}/sign-in/social?provider=google&callbackURL=${encodeURIComponent(window.location.origin + '/auth/callback')}`;
  },

  async signOut() {
    try {
      await authFetch('/sign-out', { method: 'POST' });
    } catch {}
    window.location.href = '/';
  },
};
