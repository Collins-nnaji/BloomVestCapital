import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBrain, FaRobot, FaArrowRight, FaChartLine } from 'react-icons/fa';
import { useAuth } from '../AuthContext';
import { PRODUCT_MISSION } from '../config/platform';

const SECTIONS = [
  {
    to: '/mentor',
    icon: FaRobot,
    color: '#059669',
    bg: '#f0fdf4',
    border: '#bbf7d0',
    label: 'AI Mentor',
    tag: 'Ask anything',
    desc: 'Your on-demand tutor for concepts, macro, and portfolio thinking.',
  },
  {
    to: '/iq',
    icon: FaBrain,
    color: '#7c3aed',
    bg: '#faf5ff',
    border: '#ddd6fe',
    label: 'Bloomvest IQ',
    tag: 'Understand markets',
    desc: 'Decode headlines, run case studies, and analyse documents.',
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
  font-size: clamp(1.8rem, 5vw, 2.75rem);
  font-weight: 800;
  color: #0f172a;
  text-align: center;
  line-height: 1.15;
  letter-spacing: -0.03em;
  margin: 0 0 0.75rem;
  max-width: 560px;
`;

const Sub = styled.p`
  font-size: 1rem;
  color: #64748b;
  text-align: center;
  max-width: 480px;
  line-height: 1.6;
  margin: 0 0 2.5rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1rem;
  width: 100%;
  max-width: 640px;
  margin-bottom: 1.5rem;
`;

const Card = styled(motion.button)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  padding: 1.35rem;
  border-radius: 16px;
  border: 1px solid ${(p) => p.$border};
  background: ${(p) => p.$bg};
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 32px rgba(15, 23, 42, 0.08);
  }
`;

const IconWrap = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: #fff;
  color: ${(p) => p.$color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.15rem;
  margin-bottom: 0.85rem;
`;

const CardLabel = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 800;
  font-size: 1.05rem;
  color: #0f172a;
  margin-bottom: 0.15rem;
`;

const CardTag = styled.div`
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #94a3b8;
  margin-bottom: 0.5rem;
`;

const CardDesc = styled.p`
  margin: 0 0 0.75rem;
  font-size: 0.85rem;
  color: #64748b;
  line-height: 1.5;
  flex: 1;
`;

const CardLink = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.8rem;
  font-weight: 700;
  color: ${(p) => p.$color};
`;

const JourneyNote = styled.p`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.82rem;
  color: #64748b;
  text-align: center;
  max-width: 420px;

  svg {
    color: #22c55e;
    flex-shrink: 0;
  }
`;

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <Page>
      <Eyebrow>{user ? `Welcome back${user.email ? `, ${user.email.split('@')[0]}` : ''}` : 'BloomVest Platform'}</Eyebrow>
      <Headline>Your guided investing journey continues here</Headline>
      <Sub>{PRODUCT_MISSION} Use our tools below to learn, ask, and understand markets.</Sub>
      <Grid>
        {SECTIONS.map((s, i) => {
          const Icon = s.icon;
          return (
            <Card
              key={s.to}
              $bg={s.bg}
              $border={s.border}
              onClick={() => navigate(s.to)}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <IconWrap $color={s.color}>
                <Icon />
              </IconWrap>
              <CardLabel>{s.label}</CardLabel>
              <CardTag>{s.tag}</CardTag>
              <CardDesc>{s.desc}</CardDesc>
              <CardLink $color={s.color}>
                Open <FaArrowRight />
              </CardLink>
            </Card>
          );
        })}
      </Grid>
      <JourneyNote>
        <FaChartLine /> Beginner → intermediate → advanced — educational only, never buy/sell advice.
      </JourneyNote>
    </Page>
  );
}
