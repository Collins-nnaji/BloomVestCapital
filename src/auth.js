import { createAuthClient } from '@neondatabase/neon-js/auth';

const NEON_AUTH_URL = process.env.REACT_APP_NEON_AUTH_URL || '';
const getAuthBaseUrl = () => (typeof window !== 'undefined' ? `${window.location.origin}/api/auth` : '');

// Session/cookies use Neon direct (cookie domain). Google OAuth uses our proxy (avoids CORS, handles redirect).
const neonBase = NEON_AUTH_URL ? NEON_AUTH_URL.replace(/\/$/, '') : '';
const authClient = neonBase ? createAuthClient(neonBase) : null;

export const auth = {
  async getSession() {
    if (!authClient) return null;
    try {
      const { data } = await authClient.getSession();
      if (!data?.session) return null;
      return { session: { ...data.session, user: data.user }, user: data.user };
    } catch {
      return null;
    }
  },

  async signUpWithEmail(email, password, name) {
    if (!authClient) throw new Error('Auth not configured');
    const { data, error } = await authClient.signUp.email({ email, password, name });
    if (error) throw new Error(error.message || 'Sign up failed');
    return data;
  },

  async signInWithEmail(email, password) {
    if (!authClient) throw new Error('Auth not configured');
    const { data, error } = await authClient.signIn.email({ email, password });
    if (error) throw new Error(error.message || 'Sign in failed');
    return data;
  },

  async signInWithGoogle() {
    const callbackURL = typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : '/auth/callback';
    const proxyUrl = getAuthBaseUrl();
    const url = proxyUrl ? `${proxyUrl}/sign-in/social` : `${neonBase}/sign-in/social`;
    if (!url.startsWith('http')) throw new Error('Auth not configured');
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider: 'google', callbackURL }),
      credentials: 'include',
      redirect: 'manual',
    });
    if (res.status >= 300 && res.status < 400 && res.headers.get('location')) {
      window.location.href = res.headers.get('location');
    } else if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || err.error || `Sign-in failed (${res.status}). Check Neon Auth and trusted domains.`);
    }
  },

  async signOut() {
    if (authClient) {
      try {
        await authClient.signOut();
      } catch {}
    }
    window.location.href = '/';
  },
};
