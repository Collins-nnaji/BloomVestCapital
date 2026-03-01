import { createAuthClient } from '@neondatabase/neon-js/auth';

// Use backend proxy for ALL auth - avoids 403 from Neon (origin/trusted domains)
const getAuthBaseUrl = () => {
  if (typeof window === 'undefined') return '';
  const api = process.env.REACT_APP_API_URL || '';
  return api ? `${api.replace(/\/$/, '')}/api/auth` : `${window.location.origin}/api/auth`;
};
const authBaseUrl = getAuthBaseUrl();
const authClient = typeof window !== 'undefined' && authBaseUrl ? createAuthClient(authBaseUrl) : null;

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
    const callbackURL = typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : '/auth/callback';
    const { data, error } = await authClient.signIn.social({
      provider: 'google',
      callbackURL,
    });
    if (error) throw new Error(error.message || 'Google sign-in failed');
    if (data?.url) window.location.href = data.url;
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
