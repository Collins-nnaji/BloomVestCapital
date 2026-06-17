import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FaSignOutAlt } from 'react-icons/fa';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../AuthContext';

/* ── Avatar dropdown ─────────────────────────────────────────────── */
const AvatarWrap = styled.div`
  position: relative;
`;

const AvatarBtn = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0f172a 0%, #1e3a2f 100%);
  border: 2px solid rgba(34, 197, 94, 0.35);
  color: #fff;
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.01em;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    border-color: rgba(34, 197, 94, 0.7);
    box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.12);
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  background: #fff;
  border: 1px solid rgba(15, 23, 42, 0.09);
  border-radius: 14px;
  box-shadow: 0 8px 32px rgba(15, 23, 42, 0.12);
  min-width: 210px;
  padding: 0.5rem;
  z-index: 2000;
  opacity: ${p => p.$open ? 1 : 0};
  pointer-events: ${p => p.$open ? 'all' : 'none'};
  transform: ${p => p.$open ? 'translateY(0)' : 'translateY(-6px)'};
  transition: opacity 0.18s ease, transform 0.18s ease;
`;

const DropdownProfile = styled.div`
  padding: 0.65rem 0.85rem 0.75rem;
  border-bottom: 1px solid #f1f5f9;
  margin-bottom: 0.4rem;
`;

const DropdownName = styled.div`
  font-family: 'Inter', sans-serif;
  font-size: 0.88rem;
  font-weight: 600;
  letter-spacing: -0.011em;
  color: #0f172a;
  margin-bottom: 0.15rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const DropdownEmail = styled.div`
  font-size: 0.72rem;
  color: #94a3b8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const DropdownSignOut = styled.button`
  display: flex;
  align-items: center;
  gap: 0.55rem;
  width: 100%;
  padding: 0.6rem 0.85rem;
  border: none;
  border-radius: 9px;
  background: transparent;
  color: #64748b;
  font-size: 0.83rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    background: rgba(239, 68, 68, 0.07);
    color: #dc2626;
  }

  svg { font-size: 0.8rem; }
`;

const SignInLink = styled(RouterLink)`
  padding: 0.55rem 1.15rem;
  border-radius: 10px;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 0.86rem;
  letter-spacing: -0.011em;
  color: #0f172a;
  border: 1px solid rgba(15, 23, 42, 0.14);
  background: white;
  text-decoration: none;
  transition: all 0.2s ease;
  white-space: nowrap;
  -webkit-font-smoothing: antialiased;

  &:hover {
    border-color: rgba(34, 197, 94, 0.45);
    color: #15803d;
    background: rgba(34, 197, 94, 0.06);
  }
`;

/* ── Inline variant (mobile drawers) ─────────────────────────────── */
const InlineLabel = styled.div`
  font-size: 0.65rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(15, 23, 42, 0.35);
  padding: 0 0.5rem;
  margin-bottom: 0.35rem;
`;

const InlineName = styled.div`
  font-size: 0.85rem;
  font-weight: 700;
  color: #0f172a;
  padding: 0 0.5rem 0.75rem;
  word-break: break-word;

  span {
    display: block;
    font-size: 0.72rem;
    color: #94a3b8;
    font-weight: 500;
    margin-top: 0.1rem;
  }
`;

const InlineSignOut = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem;
  border-radius: 12px;
  border: 1px solid rgba(15, 23, 42, 0.12);
  background: white;
  color: #64748b;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  margin-bottom: 0.5rem;

  &:hover { border-color: rgba(185, 28, 28, 0.3); color: #b91c1c; }
`;

const InlineAuthBtn = styled(RouterLink)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0.85rem;
  background: #0f172a;
  color: white;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 0.95rem;
  letter-spacing: -0.011em;
  text-decoration: none;
  border-radius: 12px;
  margin-bottom: 0.65rem;
  transition: all 0.25s;

  &:hover { background: #22c55e; color: #0f172a; }
`;

export function useAccountIdentity() {
  const { user } = useAuth();
  const displayName = user?.name || user?.email?.split('@')[0] || '';
  const initials = displayName
    ? displayName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '?';
  return { user, displayName, initials };
}

/**
 * Shared account UI.
 *  - default variant: avatar button + dropdown (desktop nav / top bar)
 *  - inline variant: "signed in as" block + sign out (mobile drawers)
 * onAction fires after a navigation/sign-out so callers can close drawers.
 */
const AccountMenu = ({ variant = 'default', onAction }) => {
  const { user, signOut } = useAuth();
  const { displayName, initials } = useAccountIdentity();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (variant !== 'default') return undefined;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [variant]);

  if (variant === 'inline') {
    if (user) {
      return (
        <>
          <InlineLabel>Signed in as</InlineLabel>
          <InlineName>
            {displayName}
            {user.email && displayName !== user.email && <span>{user.email}</span>}
          </InlineName>
          <InlineSignOut type="button" onClick={() => { signOut(); onAction?.(); }}>
            <FaSignOutAlt /> Sign out
          </InlineSignOut>
        </>
      );
    }
    return (
      <InlineAuthBtn to="/auth" onClick={() => onAction?.()}>
        Sign in
      </InlineAuthBtn>
    );
  }

  if (!user) {
    return <SignInLink to="/auth">Sign in</SignInLink>;
  }

  return (
    <AvatarWrap ref={ref}>
      <AvatarBtn type="button" onClick={() => setOpen(o => !o)} aria-label="Account menu">
        {initials}
      </AvatarBtn>
      <DropdownMenu $open={open}>
        <DropdownProfile>
          <DropdownName>{displayName}</DropdownName>
          {user.email && <DropdownEmail>{user.email}</DropdownEmail>}
        </DropdownProfile>
        <DropdownSignOut
          type="button"
          onClick={() => { setOpen(false); signOut(); onAction?.(); }}
        >
          <FaSignOutAlt /> Sign out
        </DropdownSignOut>
      </DropdownMenu>
    </AvatarWrap>
  );
};

export default AccountMenu;
