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
      const res = await authFetch('/api/auth/get-session');
      if (!res.ok) return null;
      const data = await res.json();
      return data.session ? data : null;
    } catch {
      return null;
    }
  },

  async signInWithGoogle() {
    window.location.href = `${NEON_AUTH_URL}/api/auth/sign-in/social?provider=google&callbackURL=${encodeURIComponent(window.location.origin + '/auth/callback')}`;
  },

  async signOut() {
    try {
      await authFetch('/api/auth/sign-out', { method: 'POST' });
    } catch {}
    window.location.href = '/';
  },

  getAuthUrl() {
    return NEON_AUTH_URL;
  }
};
