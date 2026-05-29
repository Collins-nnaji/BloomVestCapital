import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaFire, FaNewspaper, FaRobot } from 'react-icons/fa';
import { getStreak, getHeadlinesDecodedCount } from '../../utils/learningState';

const Strip = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.65rem 1rem;
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
  border-radius: 12px;
  background: linear-gradient(90deg, rgba(15, 23, 42, 0.03), rgba(34, 197, 94, 0.06));
  border: 1px solid rgba(15, 23, 42, 0.06);
`;

const Stat = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: #475569;

  svg {
    color: ${(p) => p.$accent || '#22c55e'};
  }

  strong {
    color: #0f172a;
    font-weight: 800;
  }
`;

const LinkBtn = styled(Link)`
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.45rem 0.8rem;
  border-radius: 8px;
  font-size: 0.78rem;
  font-weight: 700;
  color: #15803d;
  text-decoration: none;
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.22);
  transition: background 0.15s;
  &:hover {
    background: rgba(34, 197, 94, 0.16);
  }
`;

export default function IqLearningStrip() {
  const streak = getStreak();
  const decoded = getHeadlinesDecodedCount();

  return (
    <Strip>
      {streak.count > 0 && (
        <Stat $accent="#f97316">
          <FaFire />
          <span>
            <strong>{streak.count}</strong> day streak
          </span>
        </Stat>
      )}
      <Stat $accent="#0ea5e9">
        <FaNewspaper />
        <span>
          <strong>{decoded}</strong> headlines decoded
        </span>
      </Stat>
      <LinkBtn to="/mentor">
        <FaRobot /> Ask Mentor
      </LinkBtn>
    </Strip>
  );
}
