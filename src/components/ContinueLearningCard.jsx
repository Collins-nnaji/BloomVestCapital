import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaPlay, FaBookOpen, FaFire } from 'react-icons/fa';

const Card = styled(motion.div)`
  padding: 1.1rem 1.2rem;
  border-radius: 16px;
  background: linear-gradient(135deg, #0f172a 0%, #14532d 55%, #0f766e 100%);
  color: #fff;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.85rem;
  position: relative;
  overflow: hidden;
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.18);

  &::before {
    content: '';
    position: absolute;
    top: -40%;
    right: -10%;
    width: 180px;
    height: 180px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.06);
    pointer-events: none;
  }
`;

const Content = styled.div`
  position: relative;
  z-index: 1;
  min-width: 0;
  flex: 1;
`;

const Label = styled.div`
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 0.3rem;
`;

const Title = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 800;
  font-size: 1.08rem;
  line-height: 1.25;
  margin-bottom: 0.35rem;
`;

const Meta = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.72);
`;

const StreakPill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  background: rgba(249, 115, 22, 0.25);
  color: #fed7aa;
  font-weight: 700;
  font-size: 0.72rem;
`;

const TypePill = styled.span`
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.12);
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;

const Actions = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
`;

const PrimaryBtn = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.6rem 1.05rem;
  border-radius: 10px;
  font-size: 0.84rem;
  font-weight: 700;
  text-decoration: none;
  background: #fff;
  color: #0f172a;
  transition: transform 0.15s, box-shadow 0.15s;
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  }
`;

const PrimaryAction = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.6rem 1.05rem;
  border-radius: 10px;
  font-size: 0.84rem;
  font-weight: 700;
  border: none;
  background: #fff;
  color: #0f172a;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  }
`;

export default function ContinueLearningCard({ continueItem, onOpenLesson, streak }) {
  if (!continueItem) return null;

  const isLesson = continueItem.type === 'lesson';
  const href = continueItem.href || '/academy';

  return (
    <Card
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <Content>
        <Label>Continue where you left off</Label>
        <Title>{continueItem.label || continueItem.lessonTitle || 'Your learning'}</Title>
        <Meta>
          <TypePill>{isLesson ? 'Lesson' : 'Practice'}</TypePill>
          {continueItem.courseTitle && <span>{continueItem.courseTitle}</span>}
          {streak?.count > 0 && (
            <StreakPill>
              <FaFire /> {streak.count} day{streak.count !== 1 ? 's' : ''}
            </StreakPill>
          )}
        </Meta>
      </Content>
      <Actions>
        {isLesson && continueItem.lessonId && onOpenLesson ? (
          <PrimaryAction type="button" onClick={() => onOpenLesson(continueItem.lessonId)}>
            <FaBookOpen /> Resume
          </PrimaryAction>
        ) : (
          <PrimaryBtn to={href}>
            <FaPlay /> Continue
          </PrimaryBtn>
        )}
      </Actions>
    </Card>
  );
}
