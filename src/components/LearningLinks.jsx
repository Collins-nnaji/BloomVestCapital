import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaRobot, FaBrain, FaLightbulb } from 'react-icons/fa';

const Box = styled(motion.div)`
  margin-top: 0.85rem;
  padding: 1rem 1.05rem;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.08), rgba(14, 165, 233, 0.05));
  border: 1px solid rgba(34, 197, 94, 0.22);
`;

const Head = styled.div`
  display: flex;
  align-items: center;
  gap: 0.45rem;
  margin-bottom: 0.65rem;
`;

const Title = styled.div`
  font-size: 0.68rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #15803d;
`;

const Topic = styled.span`
  font-size: 0.78rem;
  font-weight: 700;
  color: #0f172a;
  margin-left: auto;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 0.45rem;
`;

const Chip = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.55rem 0.75rem;
  border-radius: 10px;
  font-size: 0.78rem;
  font-weight: 700;
  text-decoration: none;
  background: #fff;
  color: #0f172a;
  border: 1px solid rgba(15, 23, 42, 0.07);
  transition: border-color 0.15s, transform 0.15s;

  svg {
    font-size: 0.9rem;
    color: ${(p) => p.$iconColor || '#22c55e'};
    flex-shrink: 0;
  }

  &:hover {
    border-color: rgba(34, 197, 94, 0.45);
    transform: translateY(-1px);
  }
`;

const Quiz = styled.div`
  margin-top: 0.65rem;
  padding: 0.55rem 0.7rem;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.7);
  font-size: 0.8rem;
  color: #475569;
  line-height: 1.45;
  display: flex;
  gap: 0.4rem;
  align-items: flex-start;

  svg {
    color: #f59e0b;
    margin-top: 2px;
    flex-shrink: 0;
  }
`;

export default function LearningLinks({ topic, mentorQuery }) {
  if (!topic) return null;

  const mentorHref = mentorQuery
    ? `/mentor?q=${encodeURIComponent(mentorQuery)}`
    : '/mentor';

  return (
    <Box initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
      <Head>
        <Title>Keep learning</Title>
        <Topic>{topic.label}</Topic>
      </Head>
      <Row>
        <Chip to={mentorHref} $iconColor="#059669">
          <FaRobot /> Ask Mentor
        </Chip>
        <Chip to="/iq?tab=picks" $iconColor="#7c3aed">
          <FaBrain /> Market Lab
        </Chip>
      </Row>
      {topic.quizQuestion && (
        <Quiz>
          <FaLightbulb />
          <span>
            <strong>Quiz yourself:</strong> {topic.quizQuestion}
          </span>
        </Quiz>
      )}
    </Box>
  );
}
