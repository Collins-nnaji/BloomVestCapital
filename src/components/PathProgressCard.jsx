import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaCheck, FaChevronDown, FaChevronUp, FaExchangeAlt } from 'react-icons/fa';
import { LEARNING_PATHS } from '../config/learningPaths';
import { setLearningPathId, getLearningPathId } from '../utils/learningState';

const Card = styled.div`
  padding: 1rem 1.1rem;
  border-radius: 16px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  background: #fff;
  box-shadow: 0 2px 12px rgba(15, 23, 42, 0.04);
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Head = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.5rem;
  margin-bottom: 0.65rem;
`;

const Title = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 800;
  font-size: 0.98rem;
  color: #0f172a;
`;

const Pct = styled.span`
  font-size: 0.8rem;
  font-weight: 800;
  color: #15803d;
  white-space: nowrap;
`;

const Bar = styled.div`
  height: 8px;
  background: #f1f5f9;
  border-radius: 99px;
  overflow: hidden;
  margin-bottom: 0.85rem;
`;

const Fill = styled(motion.div)`
  height: 100%;
  background: linear-gradient(90deg, #22c55e, #0ea5e9);
  border-radius: 99px;
`;

const StepList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  flex: 1;
`;

const Step = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.55rem;
  padding: 0.4rem 0.35rem;
  border-radius: 8px;
  font-size: 0.8rem;
  color: ${(p) => (p.$done ? '#15803d' : p.$next ? '#0f172a' : '#64748b')};
  background: ${(p) => (p.$next ? 'rgba(34, 197, 94, 0.08)' : 'transparent')};
  font-weight: ${(p) => (p.$next ? 700 : 500)};
`;

const Check = styled.span`
  width: 18px;
  height: 18px;
  border-radius: 50%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.55rem;
  background: ${(p) => (p.$done ? '#22c55e' : p.$next ? '#fff' : '#f1f5f9')};
  color: ${(p) => (p.$done ? '#fff' : '#94a3b8')};
  border: 2px solid ${(p) => (p.$done ? '#22c55e' : p.$next ? '#22c55e' : '#e2e8f0')};
  margin-top: 1px;
`;

const StepLink = styled(Link)`
  color: inherit;
  text-decoration: none;
  line-height: 1.35;
  &:hover {
    text-decoration: underline;
  }
`;

const StepText = styled.span`
  line-height: 1.35;
`;

const Detail = styled.span`
  display: block;
  font-size: 0.72rem;
  font-weight: 500;
  color: #94a3b8;
  margin-top: 0.1rem;
`;

const ToggleBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  width: 100%;
  margin-top: 0.5rem;
  padding: 0.4rem;
  border: none;
  background: #f8fafc;
  border-radius: 8px;
  font-size: 0.72rem;
  font-weight: 700;
  color: #64748b;
  cursor: pointer;
  @media (min-width: 900px) {
    display: none;
  }
`;

const ChangeRow = styled.div`
  margin-top: 0.65rem;
  padding-top: 0.65rem;
  border-top: 1px solid #f1f5f9;
`;

const ChangeBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0;
  border: none;
  background: none;
  font-size: 0.75rem;
  font-weight: 700;
  color: #0ea5e9;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const PathPicker = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin-top: 0.5rem;
`;

const PathChip = styled.button`
  padding: 0.3rem 0.55rem;
  border-radius: 8px;
  border: 1px solid ${(p) => (p.$active ? '#22c55e' : '#e2e8f0')};
  background: ${(p) => (p.$active ? 'rgba(34,197,94,0.1)' : '#fff')};
  font-size: 0.72rem;
  font-weight: 600;
  cursor: pointer;
  color: #0f172a;
`;

export default function PathProgressCard({ pathProgress, onPathChange }) {
  const [expanded, setExpanded] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  if (!pathProgress?.path) return null;

  const { path, steps, percent, completedCount, total } = pathProgress;
  const nextIndex = steps.findIndex((s) => !s.done);
  const displaySteps = expanded || steps.length <= 3 ? steps : steps.slice(0, 3);

  const handlePathPick = (id) => {
    setLearningPathId(id);
    setShowPicker(false);
    onPathChange?.(id);
  };

  return (
    <Card>
      <Head>
        <Title>
          {path.emoji} {path.label}
        </Title>
        <Pct>{percent}%</Pct>
      </Head>
      <Bar>
        <Fill
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </Bar>
      <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: '0.5rem', fontWeight: 600 }}>
        {completedCount} of {total} milestones
      </div>

      <StepList>
        {displaySteps.map((step, i) => {
          const stepIndex = steps.indexOf(step);
          const isNext = !step.done && stepIndex === nextIndex;

          return (
            <Step key={`${step.label}-${i}`} $done={step.done} $next={isNext}>
              <Check $done={step.done} $next={isNext}>
                {step.done ? <FaCheck /> : stepIndex + 1}
              </Check>
              <div style={{ minWidth: 0 }}>
                {step.href && !step.done ? (
                  <StepLink to={step.href}>{step.label}</StepLink>
                ) : (
                  <StepText>{step.label}</StepText>
                )}
                {step.detail && !step.done && <Detail>{step.detail}</Detail>}
              </div>
            </Step>
          );
        })}
      </StepList>

      {steps.length > 3 && (
        <ToggleBtn type="button" onClick={() => setExpanded((e) => !e)}>
          {expanded ? <><FaChevronUp /> Show less</> : <><FaChevronDown /> {steps.length - 3} more steps</>}
        </ToggleBtn>
      )}

      <ChangeRow>
        <ChangeBtn type="button" onClick={() => setShowPicker((p) => !p)}>
          <FaExchangeAlt /> Change path
        </ChangeBtn>
        <AnimatePresence>
          {showPicker && (
            <PathPicker
              as={motion.div}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              {LEARNING_PATHS.map((p) => (
                <PathChip
                  key={p.id}
                  type="button"
                  $active={p.id === getLearningPathId()}
                  onClick={() => handlePathPick(p.id)}
                >
                  {p.emoji} {p.label}
                </PathChip>
              ))}
            </PathPicker>
          )}
        </AnimatePresence>
      </ChangeRow>
    </Card>
  );
}
