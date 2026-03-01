import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import { scenarios } from '../data/scenarios';
import { lessons } from '../data/lessons';
import { marketIndices, assetClasses, stocks } from '../data/stockData';
import { api } from '../api';

const orbFloat = keyframes`
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -20px) scale(1.05); }
  66% { transform: translate(-20px, 15px) scale(0.97); }
`;

const PageContainer = styled.div`
  min-height: 100vh;
  background: #ffffff;
`;

const HeroSection = styled.section`
  position: relative;
  padding: 7rem 1.5rem 4rem;
  overflow: hidden;
  background-image:
    linear-gradient(rgba(34,197,94,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(34,197,94,0.03) 1px, transparent 1px);
  background-size: 60px 60px;

  @media (max-width: 768px) {
    padding: 5rem 1rem 3rem;
  }
`;

const Orb = styled.div`
  position: absolute;
  top: -10%;
  right: -5%;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(34,197,94,0.08) 0%, rgba(34,197,94,0.02) 40%, transparent 70%);
  animation: ${orbFloat} 15s ease-in-out infinite;
  pointer-events: none;

  @media (max-width: 768px) {
    width: 350px;
    height: 350px;
  }
`;

const HeroContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const Badge = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: rgba(34,197,94,0.1);
  border: 1px solid rgba(34,197,94,0.25);
  padding: 0.35rem 0.9rem;
  border-radius: 50px;
  color: #22c55e;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 1.75rem;
  box-shadow: 0 0 20px rgba(34,197,94,0.1);
`;

const HeroTitle = styled(motion.h1)`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 3.5rem;
  font-weight: 700;
  color: #111;
  line-height: 1.12;
  margin-bottom: 1.25rem;
  letter-spacing: -0.03em;
  max-width: 700px;

  span {
    color: #22c55e;
  }

  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
`;

const HeroSubtitle = styled(motion.p)`
  font-family: 'DM Sans', sans-serif;
  font-size: 1.15rem;
  color: #333;
  max-width: 580px;
  line-height: 1.7;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const HeroActions = styled(motion.div)`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
`;

const PrimaryBtn = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.75rem 1.5rem;
  background: #22c55e;
  color: white;
  border-radius: 10px;
  font-family: 'DM Sans', sans-serif;
  font-weight: 600;
  font-size: 0.95rem;
  text-decoration: none;
  transition: all 0.25s ease;
  box-shadow: 0 4px 14px rgba(34,197,94,0.3);

  &:hover {
    background: #16a34a;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(34,197,94,0.4);
  }
`;

const OutlineBtn = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.75rem 1.5rem;
  background: transparent;
  color: #111;
  border: 2px solid #111;
  border-radius: 10px;
  font-family: 'DM Sans', sans-serif;
  font-weight: 600;
  font-size: 0.95rem;
  text-decoration: none;
  transition: all 0.25s ease;

  &:hover {
    border-color: #22c55e;
    color: #22c55e;
    transform: translateY(-2px);
  }
`;

const StatsLine = styled(motion.div)`
  font-family: 'DM Sans', sans-serif;
  color: #555;
  font-size: 0.82rem;
  margin-bottom: 2.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;

  span {
    display: inline-flex;
    align-items: center;
  }

  .dot {
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: #bbb;
    display: inline-block;
  }
`;

const TickerRow = styled(motion.div)`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const TickerCard = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.6rem 1rem;
  background: #fafafa;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.06);
  }
`;

const TickerName = styled.span`
  font-family: 'DM Sans', sans-serif;
  color: #555;
  font-size: 0.78rem;
  font-weight: 500;
`;

const TickerValue = styled.span`
  font-family: 'JetBrains Mono', monospace;
  color: #111;
  font-weight: 500;
  font-size: 0.85rem;
`;

const TickerChange = styled.span`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  font-weight: 500;
  color: ${props => props.$positive ? '#22c55e' : '#dc2626'};
`;

const Section = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 1.5rem;

  @media (max-width: 768px) {
    padding: 3rem 1rem;
  }
`;

const SectionTitle = styled(motion.h2)`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.6rem;
  font-weight: 700;
  color: #111;
  margin-bottom: 2rem;
  letter-spacing: -0.02em;

  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled(motion(Link))`
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 1.75rem;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);

  &:hover {
    transform: translateY(-4px);
    border-color: rgba(34,197,94,0.3);
    box-shadow: 0 12px 32px rgba(34,197,94,0.12);
  }
`;

const FeatureIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${props => props.$bg || 'rgba(34,197,94,0.1)'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  margin-bottom: 1rem;
`;

const FeatureTitle = styled.h3`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.1rem;
  font-weight: 700;
  color: #111;
  margin-bottom: 0.4rem;
`;

const FeatureDesc = styled.p`
  font-family: 'DM Sans', sans-serif;
  color: #555;
  font-size: 0.88rem;
  line-height: 1.6;
  margin-bottom: 1rem;
  flex: 1;
`;

const FeatureArrow = styled.span`
  color: #999;
  font-size: 0.85rem;
  transition: all 0.3s ease;

  ${FeatureCard}:hover & {
    color: #22c55e;
    transform: translateX(4px);
  }
`;

const AssetChipsRow = styled.div`
  display: flex;
  gap: 0.6rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;

  &::-webkit-scrollbar { display: none; }
`;

const AssetChip = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1rem;
  background: #fafafa;
  border: 1px solid #e5e7eb;
  border-radius: 50px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.82rem;
  color: #333;
  white-space: nowrap;
  flex-shrink: 0;
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(34,197,94,0.4);
    transform: translateY(-2px);
  }
`;

const ChipCount = styled.span`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.72rem;
  color: #666;
  background: rgba(0,0,0,0.04);
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
`;

const TrustRow = styled(motion.div)`
  text-align: center;
  padding: 3rem 1.5rem;
  font-family: 'DM Sans', sans-serif;
  color: #666;
  font-size: 0.85rem;
  border-top: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
  max-width: 1200px;
  margin: 0 auto;
`;

const CTASection = styled.section`
  text-align: center;
  padding: 5rem 1.5rem;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 3.5rem 1rem;
  }
`;

const CTAHeadline = styled(motion.h2)`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.8rem;
  font-weight: 700;
  color: #111;
  margin-bottom: 1.5rem;
  letter-spacing: -0.02em;

  @media (max-width: 768px) {
    font-size: 1.4rem;
  }
`;

const CTASubtext = styled.p`
  font-family: 'DM Sans', sans-serif;
  color: #666;
  font-size: 0.82rem;
  margin-top: 1rem;
`;

const features = [
  {
    icon: '📚',
    title: 'Investment Academy',
    desc: `${lessons.length} lessons from beginner to advanced with interactive quizzes`,
    to: '/learn',
    bg: 'rgba(59,130,246,0.1)',
  },
  {
    icon: '🎯',
    title: 'AI-Guided Scenarios',
    desc: `${scenarios.length} interactive simulations with real-time GPT-4 coaching`,
    to: '/scenario',
    bg: 'rgba(249,115,22,0.1)',
  },
  {
    icon: '📊',
    title: 'Practice Trading',
    desc: 'Trade stocks, crypto, commodities, bonds & forex with $100K virtual cash',
    to: '/demo',
    bg: 'rgba(34,197,94,0.1)',
  },
  {
    icon: '🤖',
    title: 'AI Investment Tutor',
    desc: 'Ask any question — get instant expert explanations powered by GPT-4',
    to: '/ai-tutor',
    bg: 'rgba(139,92,246,0.1)',
  },
];

const Dashboard = () => {
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const data = await api.getProgress();
        if (data.progress) {
          setCompletedCount(data.progress.filter(p => p.completed).length);
        }
      } catch {
        const saved = localStorage.getItem('bloomvest_completed_lessons');
        if (saved) {
          try { setCompletedCount(JSON.parse(saved).length); } catch {}
        }
      }
    };
    loadProgress();
  }, []);

  const assetChips = assetClasses
    .filter(ac => ac.id !== 'all')
    .map(ac => ({
      ...ac,
      count: stocks.filter(s => ac.sectors && ac.sectors.includes(s.sector)).length,
    }));

  return (
    <PageContainer>
      {/* ─── Hero ─── */}
      <HeroSection>
        <Orb />
        <HeroContent>
          <Badge
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            🟢 Live Platform
          </Badge>

          <HeroTitle
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
          >
            Learn to <span>Invest</span>
            <br />
            With AI-Powered
            <br />
            <span>Simulations</span>
          </HeroTitle>

          <HeroSubtitle
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16 }}
          >
            Master stocks, bonds, crypto, and commodities through hands-on
            practice with virtual money and a personal AI tutor.
          </HeroSubtitle>

          <HeroActions
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24 }}
          >
            <PrimaryBtn to="/learn">Start Learning →</PrimaryBtn>
            <OutlineBtn to="/demo">Try Demo Trading</OutlineBtn>
          </HeroActions>

          <StatsLine
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.32 }}
          >
            <span>{lessons.length} Lessons</span>
            <span className="dot" />
            <span>{scenarios.length} Scenarios</span>
            <span className="dot" />
            <span>GPT-4 AI Tutor</span>
          </StatsLine>

          <TickerRow
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {marketIndices.map(idx => (
              <TickerCard key={idx.name}>
                <TickerName>{idx.name}</TickerName>
                <TickerValue>{idx.value.toLocaleString()}</TickerValue>
                <TickerChange $positive={idx.changePercent >= 0}>
                  {idx.changePercent >= 0 ? '+' : ''}{idx.changePercent}%
                </TickerChange>
              </TickerCard>
            ))}
          </TickerRow>
        </HeroContent>
      </HeroSection>

      {/* ─── Features ─── */}
      <Section>
        <SectionTitle
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Everything you need to master investing
        </SectionTitle>

        <FeaturesGrid>
          {features.map((f, i) => (
            <FeatureCard
              key={f.title}
              to={f.to}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <FeatureIcon $bg={f.bg}>{f.icon}</FeatureIcon>
              <FeatureTitle>{f.title}</FeatureTitle>
              <FeatureDesc>{f.desc}</FeatureDesc>
              <FeatureArrow>→</FeatureArrow>
            </FeatureCard>
          ))}
        </FeaturesGrid>
      </Section>

      {/* ─── Asset Classes ─── */}
      <Section style={{ paddingTop: 0 }}>
        <SectionTitle
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Trade Every Asset Class
        </SectionTitle>

        <AssetChipsRow>
          {assetChips.map(ac => (
            <AssetChip key={ac.id}>
              {ac.icon} {ac.label} <ChipCount>{ac.count}</ChipCount>
            </AssetChip>
          ))}
        </AssetChipsRow>
      </Section>

      {/* ─── Trust ─── */}
      <TrustRow
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        Trusted by learners &nbsp;·&nbsp; Powered by GPT-4 &nbsp;·&nbsp; Free to use &nbsp;·&nbsp; No real money required
      </TrustRow>

      {/* ─── CTA ─── */}
      <CTASection>
        <CTAHeadline
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Ready to start your investment journey?
        </CTAHeadline>

        <PrimaryBtn to="/learn" style={{ fontSize: '1rem', padding: '0.85rem 2rem' }}>
          Get Started Free →
        </PrimaryBtn>

        <CTASubtext>
          No credit card required &nbsp;·&nbsp; 100% free &nbsp;·&nbsp; Virtual money only
        </CTASubtext>
      </CTASection>
    </PageContainer>
  );
};

export default Dashboard;
