import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { auth } from './auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPro, setIsPro] = useState(false);

  const checkSession = useCallback(async () => {
    try {
      const session = await auth.getSession();
      if (session && session.user) {
        setUser(session.user);
        const subRes = await fetch(`/api/billing/status?email=${encodeURIComponent(session.user.email)}`);
        if (subRes.ok) {
          const subData = await subRes.json();
          setIsPro(subData.isPro || false);
        }
      } else {
        setUser(null);
        setIsPro(false);
      }
    } catch {
      setUser(null);
      setIsPro(false);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const signInWithGoogle = async () => {
    await auth.signInWithGoogle();
  };
  const signOut = () => auth.signOut();

  const signUpWithEmail = async (email, password, name) => {
    const data = await auth.signUpWithEmail(email, password, name);
    await checkSession();
    return data;
  };

  const signInWithEmail = async (email, password) => {
    const data = await auth.signInWithEmail(email, password);
    await checkSession();
    return data;
  };

  return (
    <AuthContext.Provider value={{ user, loading, isPro, signInWithGoogle, signInWithEmail, signUpWithEmail, signOut, refreshAuth: checkSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
