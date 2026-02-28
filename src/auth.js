import { createAuthClient } from '@neondatabase/neon-js/auth';

const NEON_AUTH_URL = process.env.REACT_APP_NEON_AUTH_URL || '';

// Neon Auth service exposes Better Auth at /api/auth under the base URL
const authBaseUrl = NEON_AUTH_URL.endsWith('/api/auth')
  ? NEON_AUTH_URL
  : `${NEON_AUTH_URL.replace(/\/$/, '')}/api/auth`;

const authClient = NEON_AUTH_URL ? createAuthClient(authBaseUrl) : null;

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
    if (!authClient) throw new Error('Auth not configured');
    await authClient.signIn.social({
      provider: 'google',
      callbackURL: `${window.location.origin}/auth/callback`,
    });
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
