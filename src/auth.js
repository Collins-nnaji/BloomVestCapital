import { createAuthClient } from '@neondatabase/neon-js/auth';
import { ensureApiBase } from './api';

let authClient = null;
let authClientBase = null;

async function getAuthClient() {
  if (typeof window === 'undefined') return null;
  const base = await ensureApiBase();
  if (!authClient || authClientBase !== base) {
    authClient = createAuthClient(`${base}/auth`);
    authClientBase = base;
  }
  return authClient;
}

export const auth = {
  async getSession() {
    const client = await getAuthClient();
    if (!client) return null;
    try {
      const { data } = await client.getSession();
      if (!data?.session) return null;
      return { session: { ...data.session, user: data.user }, user: data.user };
    } catch {
      return null;
    }
  },

  async signUpWithEmail(email, password, name) {
    const client = await getAuthClient();
    if (!client) throw new Error('Auth not configured');
    const { data, error } = await client.signUp.email({ email, password, name });
    if (error) throw new Error(error.message || 'Sign up failed');
    return data;
  },

  async signInWithEmail(email, password) {
    const client = await getAuthClient();
    if (!client) throw new Error('Auth not configured');
    const { data, error } = await client.signIn.email({ email, password });
    if (error) throw new Error(error.message || 'Sign in failed');
    return data;
  },

  async signInWithGoogle() {
    const client = await getAuthClient();
    if (!client) throw new Error('Auth not configured');
    const callbackURL = typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : '/auth/callback';
    const { data, error } = await client.signIn.social({
      provider: 'google',
      callbackURL,
    });
    if (error) throw new Error(error.message || 'Google sign-in failed');
    if (data?.url) window.location.href = data.url;
  },

  async signOut() {
    const client = await getAuthClient();
    if (client) {
      try {
        await client.signOut();
      } catch {}
    }
    window.location.href = '/';
  },
};
