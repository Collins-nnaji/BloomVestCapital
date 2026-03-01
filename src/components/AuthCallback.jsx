import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import Loader from './Loader';
import Dashboard from '../pages/Dashboard';

/**
 * Handles OAuth callback (e.g. Google sign-in). Redirects to stored return path
 * (e.g. /billing/success?session_id=xxx) so subscription is recognized after redirect.
 */
export default function AuthCallback() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    const returnPath = sessionStorage.getItem('auth_return_path');
    if (returnPath) {
      sessionStorage.removeItem('auth_return_path');
      navigate(returnPath, { replace: true });
      return;
    }
  }, [loading, navigate]);

  if (loading) return <Loader />;
  const returnPath = sessionStorage.getItem('auth_return_path');
  if (returnPath) return <Loader />;
  return <Dashboard />;
}
