import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaPlay, FaCheckCircle, FaArrowRight } from 'react-icons/fa';

const Banner = styled(motion.div)`
  margin-bottom: 1rem;
  padding: 1.1rem 1.15rem;
  border-radius: 14px;
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.14) 0%, rgba(14, 165, 233, 0.08) 100%);
  border: 1px solid rgba(34, 197, 94, 0.28);
  box-shadow: 0 4px 20px rgba(34, 197, 94, 0.08);
`;

const Row = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
`;

const IconWrap = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 11px;
  background: #15803d;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 1.1rem;
`;

const Title = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 800;
  font-size: 1rem;
  color: #15803d;
  margin-bottom: 0.25rem;
`;

const Desc = styled.p`
  margin: 0 0 0.85rem;
  font-size: 0.88rem;
  color: #475569;
  line-height: 1.5;
`;

const Actions = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const Primary = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.6rem 1.05rem;
  border-radius: 10px;
  background: linear-gradient(135deg, #15803d, #0f766e);
  color: #fff;
  font-weight: 700;
  font-size: 0.85rem;
  text-decoration: none;
  transition: transform 0.15s, box-shadow 0.15s;
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(21, 128, 61, 0.35);
  }
`;

const Secondary = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.6rem 1rem;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: #fff;
  font-weight: 600;
  font-size: 0.85rem;
  color: #475569;
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s;
  &:hover {
    border-color: #cbd5e1;
    color: #0f172a;
  }
`;

export default function LessonPracticeBanner({ scenarioId, onDismiss }) {
  if (!scenarioId) return null;

  return (
    <Banner
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Row>
        <IconWrap>
          <FaCheckCircle />
        </IconWrap>
        <div style={{ flex: 1, minWidth: 0 }}>
          <Title>Lesson complete — ready to practice?</Title>
          <Desc>
            Reinforce what you learned in a virtual-money scenario. Your AI tutor will explain every move — no real trades.
          </Desc>
          <Actions>
            <Primary to={`/academy?tab=scenarios&scenario=${scenarioId}`}>
              <FaPlay /> Start practice scenario <FaArrowRight style={{ fontSize: '0.7rem', opacity: 0.85 }} />
            </Primary>
            <Secondary type="button" onClick={onDismiss}>
              Back to courses
            </Secondary>
          </Actions>
        </div>
      </Row>
    </Banner>
  );
}
