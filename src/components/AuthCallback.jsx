import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import Loader from './Loader';

export default function AuthCallback() {
  const navigate = useNavigate();
  const { loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    const returnPath = sessionStorage.getItem('auth_return_path');
    sessionStorage.removeItem('auth_return_path');
    navigate(returnPath || '/signals', { replace: true });
  }, [loading, navigate]);

  return <Loader />;
}
