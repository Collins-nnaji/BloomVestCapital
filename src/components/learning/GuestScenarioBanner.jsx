import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaPlay, FaLock } from 'react-icons/fa';

const Banner = styled.div`
  padding: 1rem 1.15rem;
  margin-bottom: 0.85rem;
  border-radius: 14px;
  background: linear-gradient(135deg, rgba(14, 165, 233, 0.1), rgba(34, 197, 94, 0.08));
  border: 1px solid rgba(14, 165, 233, 0.22);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
`;

const Title = styled.div`
  font-weight: 800;
  font-size: 0.9rem;
  color: #0f172a;
  margin-bottom: 0.2rem;
`;

const Desc = styled.div`
  font-size: 0.82rem;
  color: #64748b;
  line-height: 1.45;
  max-width: 36em;
`;

const TryLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.55rem 1rem;
  border-radius: 10px;
  background: linear-gradient(135deg, #0ea5e9, #0284c7);
  color: #fff;
  font-size: 0.82rem;
  font-weight: 700;
  text-decoration: none;
  white-space: nowrap;
  transition: transform 0.15s, box-shadow 0.15s;
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(14, 165, 233, 0.35);
  }
`;

const LockNote = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.72rem;
  color: #94a3b8;
  margin-top: 0.35rem;
`;

export default function GuestScenarioBanner({ signedIn }) {
  if (signedIn) return null;

  return (
    <Banner>
      <div>
        <Title>Try before you sign in</Title>
        <Desc>
          Run <strong>Your First $10k</strong> with virtual money — no account needed. Other scenarios and custom builder require a free sign-in.
        </Desc>
        <LockNote>
          <FaLock style={{ fontSize: '0.65rem' }} /> More scenarios unlock after sign-in
        </LockNote>
      </div>
      <TryLink to="/academy?tab=scenarios&scenario=first-investment">
        <FaPlay /> Try free scenario
      </TryLink>
    </Banner>
  );
}
