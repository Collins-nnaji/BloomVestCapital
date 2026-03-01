import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaGoogle, FaEnvelope, FaLock, FaUser, FaArrowRight, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '../AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #060910 0%, #0f1420 50%, #060910 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 1rem 2rem;
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;

  &::before {
    content: '';
    position: absolute;
    top: 20%;
    left: 50%;
    transform: translateX(-50%);
    width: 600px;
    height: 600px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(34,197,94,0.06) 0%, transparent 70%);
  }
`;

const AuthCard = styled(motion.div)`
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 20px;
  padding: 1.5rem 1.25rem 2rem;
  width: 100%;
  max-width: 420px;
  position: relative;
  z-index: 1;

  @media (min-width: 400px) {
    padding: 2.5rem;
  }
`;

const LogoText = styled.div`
  text-align: center;
  margin-bottom: 2rem;

  h1 {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1.6rem;
    font-weight: 700;
    color: white;
    margin-bottom: 0.5rem;
    span { color: #22c55e; }
  }

  p {
    color: rgba(255,255,255,0.4);
    font-size: 0.85rem;
  }
`;

const TabRow = styled.div`
  display: flex;
  gap: 0;
  margin-bottom: 1.75rem;
  border-radius: 10px;
  background: rgba(255,255,255,0.04);
  padding: 4px;
`;

const Tab = styled.button`
  flex: 1;
  padding: 0.6rem;
  border: none;
  border-radius: 8px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  background: ${p => p.$active ? 'rgba(34,197,94,0.15)' : 'transparent'};
  color: ${p => p.$active ? '#4ade80' : 'rgba(255,255,255,0.35)'};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InputGroup = styled.div`
  position: relative;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255,255,255,0.2);
  font-size: 0.85rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.85rem 1rem 0.85rem 2.75rem;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 10px;
  color: white;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.9rem;
  outline: none;
  transition: border 0.2s;

  &::placeholder { color: rgba(255,255,255,0.2); }
  &:focus { border-color: rgba(34,197,94,0.4); }
`;

const TogglePassword = styled.button`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: rgba(255,255,255,0.2);
  cursor: pointer;
  font-size: 0.9rem;
  &:hover { color: rgba(255,255,255,0.4); }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.85rem;
  background: #22c55e;
  color: white;
  border: none;
  border-radius: 10px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s;
  margin-top: 0.5rem;

  &:hover { background: #16a34a; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1.25rem 0;
  color: rgba(255,255,255,0.15);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 1px;

  &::before, &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(255,255,255,0.06);
  }
`;

const GoogleButton = styled.button`
  width: 100%;
  padding: 0.8rem;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 10px;
  color: rgba(255,255,255,0.7);
  font-family: 'DM Sans', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  transition: all 0.2s;

  &:hover {
    background: rgba(255,255,255,0.08);
    border-color: rgba(255,255,255,0.15);
    color: white;
  }

  svg { color: #4285f4; }
`;

const ErrorMsg = styled.div`
  padding: 0.6rem 1rem;
  background: rgba(239,68,68,0.1);
  border: 1px solid rgba(239,68,68,0.2);
  border-radius: 8px;
  color: #f87171;
  font-size: 0.8rem;
`;

const BottomText = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  color: rgba(255,255,255,0.3);
  font-size: 0.8rem;

  a {
    color: #4ade80;
    text-decoration: none;
    font-weight: 600;
    &:hover { text-decoration: underline; }
  }
`;

const AuthPage = () => {
  const [mode, setMode] = useState('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const fromLocation = location.state?.from;
  const from = fromLocation ? (fromLocation.pathname + (fromLocation.search || '')) : '/';

  useEffect(() => {
    if (user) navigate(from, { replace: true });
  }, [user, from, navigate]);

  if (user) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (!name.trim()) { setError('Name is required'); setLoading(false); return; }
        if (password.length < 8) { setError('Password must be at least 8 characters'); setLoading(false); return; }
        await signUpWithEmail(email, password, name);
      } else {
        await signInWithEmail(email, password);
      }
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  return (
    <PageContainer>
      <AuthCard
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <LogoText>
          <h1>Bloom<span>Vest</span></h1>
          <p>{mode === 'signup' ? 'Create your free account' : 'Welcome back'}</p>
        </LogoText>

        <TabRow>
          <Tab $active={mode === 'signin'} onClick={() => { setMode('signin'); setError(''); }}>
            Sign In
          </Tab>
          <Tab $active={mode === 'signup'} onClick={() => { setMode('signup'); setError(''); }}>
            Sign Up
          </Tab>
        </TabRow>

        <GoogleButton
          type="button"
          onClick={async () => {
            setError('');
            setLoading(true);
            try {
              if (from && from !== '/') {
                sessionStorage.setItem('auth_return_path', from);
              }
              await signInWithGoogle();
            } catch (err) {
              setError(err.message || 'Google sign-in failed. Please try again.');
              sessionStorage.removeItem('auth_return_path');
            }
            setLoading(false);
          }}
        >
          <FaGoogle /> Continue with Google
        </GoogleButton>

        <Divider>or</Divider>

        <Form onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <InputGroup>
              <InputIcon><FaUser /></InputIcon>
              <Input
                type="text"
                placeholder="Full name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </InputGroup>
          )}

          <InputGroup>
            <InputIcon><FaEnvelope /></InputIcon>
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </InputGroup>

          <InputGroup>
            <InputIcon><FaLock /></InputIcon>
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder={mode === 'signup' ? 'Create password (8+ chars)' : 'Password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={mode === 'signup' ? 8 : 1}
            />
            <TogglePassword type="button" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </TogglePassword>
          </InputGroup>

          {error && <ErrorMsg>{error}</ErrorMsg>}

          <SubmitButton type="submit" disabled={loading}>
            {loading ? 'Please wait...' : (
              <>{mode === 'signup' ? 'Create Account' : 'Sign In'} <FaArrowRight /></>
            )}
          </SubmitButton>
        </Form>

        <BottomText>
          {mode === 'signin' ? (
            <>Don't have an account? <a href="#signup" onClick={(e) => { e.preventDefault(); setMode('signup'); setError(''); }}>Sign up free</a></>
          ) : (
            <>Already have an account? <a href="#signin" onClick={(e) => { e.preventDefault(); setMode('signin'); setError(''); }}>Sign in</a></>
          )}
        </BottomText>
      </AuthCard>
    </PageContainer>
  );
};

export default AuthPage;
