import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaCheck } from 'react-icons/fa';
import { LEARNING_PATHS } from '../config/learningPaths';
import { completeOnboarding } from '../utils/learningState';

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  z-index: 2000;
  background: rgba(15, 23, 42, 0.62);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.25rem;
`;

const Modal = styled(motion.div)`
  background: #fff;
  border-radius: 22px;
  max-width: 540px;
  width: 100%;
  overflow: hidden;
  box-shadow: 0 32px 80px rgba(15, 23, 42, 0.28);
`;

const TopBar = styled.div`
  height: 4px;
  background: linear-gradient(90deg, #22c55e, #0ea5e9, #15803d);
`;

const Body = styled.div`
  padding: 1.65rem 1.75rem 1.5rem;
`;

const Title = styled.h2`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.55rem;
  font-weight: 800;
  margin: 0 0 0.4rem;
  color: #0a0f1e;
  letter-spacing: -0.02em;
`;

const Lead = styled.p`
  margin: 0 0 1.15rem;
  font-size: 0.9rem;
  color: rgba(15, 23, 42, 0.58);
  line-height: 1.55;
`;

const Grid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  margin-bottom: 1rem;
  max-height: min(42vh, 320px);
  overflow-y: auto;
  padding-right: 0.15rem;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 4px;
  }
`;

const PathBtn = styled.button`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  text-align: left;
  padding: 0.8rem 0.95rem;
  border-radius: 12px;
  border: 2px solid ${(p) => (p.$active ? '#22c55e' : 'rgba(15,23,42,0.07)')};
  background: ${(p) => (p.$active ? 'rgba(34,197,94,0.07)' : '#fafbfc')};
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s, transform 0.15s;
  &:hover {
    border-color: rgba(34, 197, 94, 0.4);
    transform: translateX(2px);
  }
`;

const PathEmoji = styled.span`
  font-size: 1.45rem;
  line-height: 1;
`;

const PathLabel = styled.div`
  font-weight: 800;
  font-size: 0.92rem;
  color: #0f172a;
`;

const PathDesc = styled.div`
  font-size: 0.78rem;
  color: #64748b;
  margin-top: 0.12rem;
  line-height: 1.4;
`;

const Preview = styled.div`
  margin-bottom: 1.1rem;
  padding: 0.75rem 0.9rem;
  border-radius: 11px;
  background: #f8fafc;
  border: 1px solid #f1f5f9;
`;

const PreviewLabel = styled.div`
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #94a3b8;
  margin-bottom: 0.5rem;
`;

const StepPill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  margin: 0 0.35rem 0.35rem 0;
  padding: 0.28rem 0.55rem;
  border-radius: 6px;
  font-size: 0.72rem;
  font-weight: 600;
  color: #475569;
  background: #fff;
  border: 1px solid #e2e8f0;
`;

const Footer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const StartBtn = styled.button`
  width: 100%;
  padding: 0.9rem;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #15803d, #0f766e);
  color: #fff;
  font-weight: 800;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(21, 128, 61, 0.35);
  }
`;

const SkipBtn = styled.button`
  width: 100%;
  padding: 0.5rem;
  border: none;
  background: transparent;
  font-size: 0.82rem;
  font-weight: 600;
  color: #94a3b8;
  cursor: pointer;
  &:hover {
    color: #64748b;
  }
`;

export default function OnboardingModal({ onClose }) {
  const navigate = useNavigate();
  const [selected, setSelected] = useState('aspiring-investor');
  const selectedPath = LEARNING_PATHS.find((p) => p.id === selected);

  const finish = (pathId) => {
    completeOnboarding(pathId);
    onClose?.();
    navigate('/academy');
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <Overlay
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboard-title"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <Modal
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
      >
        <TopBar />
        <Body>
          <Title id="onboard-title">Pick your learning path</Title>
          <Lead>
            We&apos;ll tailor courses, practice scenarios, and IQ exercises. You can switch paths anytime from Academy.
          </Lead>

          <Grid>
            {LEARNING_PATHS.map((path) => (
              <PathBtn
                key={path.id}
                type="button"
                $active={selected === path.id}
                onClick={() => setSelected(path.id)}
              >
                <PathEmoji>{path.emoji}</PathEmoji>
                <div>
                  <PathLabel>{path.label}</PathLabel>
                  <PathDesc>{path.description}</PathDesc>
                </div>
              </PathBtn>
            ))}
          </Grid>

          <AnimatePresence mode="wait">
            {selectedPath && (
              <Preview
                key={selectedPath.id}
                as={motion.div}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <PreviewLabel>Your path includes</PreviewLabel>
                {selectedPath.steps.map((step, i) => (
                  <StepPill key={i}>
                    <FaCheck style={{ fontSize: '0.55rem', color: '#22c55e' }} />
                    {step.stepLabel}
                  </StepPill>
                ))}
              </Preview>
            )}
          </AnimatePresence>

          <Footer>
            <StartBtn type="button" onClick={() => finish(selected)}>
              Start {selectedPath?.label || 'learning'} →
            </StartBtn>
            <SkipBtn type="button" onClick={() => finish('aspiring-investor')}>
              Skip for now
            </SkipBtn>
          </Footer>
        </Body>
      </Modal>
    </Overlay>
  );
}
