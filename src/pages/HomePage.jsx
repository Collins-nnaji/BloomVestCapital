import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaGraduationCap, FaBrain, FaRobot, FaArrowRight } from 'react-icons/fa';
import { useAuth } from '../AuthContext';

const SECTIONS = [
  {
    to: '/academy',
    icon: FaGraduationCap,
    color: '#15803d',
    bg: '#f0fdf4',
    border: '#bbf7d0',
    label: 'Academy',
    desc: 'Learn investing through AI-guided lessons, quizzes, and real-money simulations.',
  },
  {
    to: '/iq',
    icon: FaBrain,
    color: '#7c3aed',
    bg: '#faf5ff',
    border: '#ddd6fe',
    label: 'IQ',
    desc: 'Decode market headlines, study cases, and analyse documents in plain English.',
  },
  {
    to: '/mentor',
    icon: FaRobot,
    color: '#0284c7',
    bg: '#f0f9ff',
    border: '#bae6fd',
    label: 'AI Mentor',
    desc: 'Ask anything about investing concepts — your always-on financial tutor.',
  },
];

const fade = keyframes`from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}`;

const Page = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 4rem 2rem 3rem;
  font-family: 'Inter', system-ui, sans-serif;
  background: #f8fafc;
  animation: ${fade} 0.4s ease both;
`;

const Eyebrow = styled.p`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #15803d;
  margin: 0 0 1rem;
`;

const Headline = styled.h1`
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(1.8rem, 5vw, 3rem);
  font-weight: 800;
  color: #0f172a;
  text-align: center;
  line-height: 1.15;
  letter-spacing: -0.03em;
  margin: 0 0 0.75rem;
  max-width: 600px;
`;

const Sub = styled.p`
  font-size: 1rem;
  color: #64748b;
  text-align: center;
  max-width: 440px;
  line-height: 1.6;
  margin: 0 0 3rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  width: 100%;
  max-width: 820px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled(motion.button)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1.5rem;
  border-radius: 14px;
  border: 1.5px solid ${p => p.$border};
  background: ${p => p.$bg};
  cursor: pointer;
  text-align: left;
  transition: box-shadow 0.2s, transform 0.15s;

  &:hover {
    box-shadow: 0 8px 28px rgba(0,0,0,0.09);
    transform: translateY(-2px);
  }
`;

const IconWrap = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: ${p => p.$color}18;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${p => p.$color};
  font-size: 1.1rem;
`;

const CardLabel = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  width: 100%;

  svg { margin-left: auto; color: #94a3b8; font-size: 0.75rem; }
`;

const CardDesc = styled.p`
  font-size: 0.8rem;
  color: #64748b;
  line-height: 1.5;
  margin: 0;
`;

const Greeting = styled.span`
  color: #15803d;
`;

export default function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || null;

  return (
    <Page>
      <Eyebrow>Bloomvest Console</Eyebrow>
      <Headline>
        {firstName
          ? <>Welcome back, <Greeting>{firstName}</Greeting>.</>
          : 'Your financial intelligence platform.'}
      </Headline>
      <Sub>
        Learn, understand markets, and ask an AI mentor — all in one place.
      </Sub>

      <Grid>
        {SECTIONS.map(({ to, icon: Icon, color, bg, border, label, desc }, i) => (
          <Card
            key={to}
            $bg={bg}
            $border={border}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 + 0.1 }}
            onClick={() => navigate(to)}
          >
            <IconWrap $color={color}><Icon /></IconWrap>
            <CardLabel>{label} <FaArrowRight /></CardLabel>
            <CardDesc>{desc}</CardDesc>
          </Card>
        ))}
      </Grid>
    </Page>
  );
}
