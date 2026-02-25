import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaGraduationCap, FaChartLine, FaRobot, FaArrowRight, FaPlay, FaTrophy, FaBookOpen, FaLightbulb, FaCheckCircle } from 'react-icons/fa';
import { scenarios } from '../data/scenarios';
import { lessons } from '../data/lessons';
import { marketIndices } from '../data/stockData';
import { api } from '../api';

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(180deg, #0a0f1c 0%, #111827 100%);
`;

const HeroSection = styled.section`
  background: linear-gradient(135deg, #0a0f1c 0%, #111827 50%, #0a0f1c 100%);
  padding: 5rem 1.5rem 4rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -20%;
    width: 600px;
    height: 600px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(34,197,94,0.12) 0%, transparent 70%);
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -30%;
    left: -10%;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%);
  }
`;

const HeroContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const HeroBadge = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(34,197,94,0.15);
  border: 1px solid rgba(34,197,94,0.3);
  padding: 0.4rem 1rem;
  border-radius: 50px;
  color: #4ade80;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
`;

const HeroTitle = styled(motion.h1)`
  font-size: 3.2rem;
  font-weight: 800;
  color: white;
  line-height: 1.15;
  margin-bottom: 1.25rem;
  letter-spacing: -0.02em;

  span { color: #22c55e; }

  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
`;

const HeroSubtitle = styled(motion.p)`
  font-size: 1.2rem;
  color: rgba(255,255,255,0.5);
  max-width: 600px;
  line-height: 1.7;
  margin-bottom: 2rem;
`;

const HeroActions = styled(motion.div)`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const PrimaryButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.85rem 1.75rem;
  background: #22c55e;
  color: white;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1rem;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(34,197,94,0.3);

  &:hover {
    background: #16a34a;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(34,197,94,0.4);
  }

  svg { transition: transform 0.3s ease; }
  &:hover svg { transform: translateX(3px); }
`;

const SecondaryButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.85rem 1.75rem;
  background: rgba(255,255,255,0.06);
  color: white;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  text-decoration: none;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255,255,255,0.1);
    transform: translateY(-2px);
  }
`;

const MarketTicker = styled(motion.div)`
  display: flex;
  gap: 2rem;
  margin-top: 3rem;
  flex-wrap: wrap;
`;

const TickerItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.25rem;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 12px;
`;

const TickerName = styled.span`
  color: rgba(255,255,255,0.4);
  font-size: 0.85rem;
  font-weight: 500;
`;

const TickerValue = styled.span`
  color: white;
  font-weight: 700;
  font-size: 0.95rem;
`;

const TickerChange = styled.span`
  font-size: 0.8rem;
  font-weight: 600;
  color: ${props => props.$positive ? '#4ade80' : '#f87171'};
`;

const SectionContainer = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 1.5rem;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 800;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  svg { color: #22c55e; font-size: 1.5rem; }
`;

const SectionLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: #22c55e;
  font-weight: 600;
  font-size: 0.95rem;
  text-decoration: none;
  transition: all 0.3s;

  &:hover { gap: 0.7rem; }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 4rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled(motion(Link))`
  background: rgba(255,255,255,0.03);
  border-radius: 16px;
  padding: 2rem;
  text-decoration: none;
  border: 1px solid rgba(255,255,255,0.06);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(0,0,0,0.3);
    border-color: ${props => props.$accent || 'rgba(34,197,94,0.3)'};
  }
`;

const FeatureIcon = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 14px;
  background: ${props => props.$bg || 'rgba(34,197,94,0.1)'};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.25rem;
  font-size: 1.5rem;
  color: ${props => props.$color || '#22c55e'};
`;

const FeatureTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
`;

const FeatureDesc = styled.p`
  color: rgba(255,255,255,0.4);
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const FeatureTag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  color: #22c55e;
  font-weight: 600;
  font-size: 0.85rem;

  svg { font-size: 0.75rem; }
`;

const ScenariosGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ScenarioCard = styled(motion(Link))`
  background: rgba(255,255,255,0.03);
  border-radius: 16px;
  padding: 1.75rem;
  text-decoration: none;
  border: 1px solid rgba(255,255,255,0.06);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 25px rgba(0,0,0,0.3);
    border-color: rgba(255,255,255,0.1);
  }
`;

const ScenarioHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const ScenarioIcon = styled.span`
  font-size: 2rem;
`;

const DifficultyBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${props => props.$color + '18'};
  color: ${props => props.$color};
`;

const ScenarioTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
`;

const ScenarioDesc = styled.p`
  color: rgba(255,255,255,0.4);
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 1rem;
`;

const ScenarioMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Duration = styled.span`
  color: rgba(255,255,255,0.25);
  font-size: 0.85rem;
`;

const StartButton = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: #22c55e;
  font-weight: 600;
  font-size: 0.9rem;

  svg { font-size: 0.7rem; }
`;

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;
  margin-bottom: 4rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const StatCard = styled(motion.div)`
  background: rgba(255,255,255,0.03);
  border-radius: 14px;
  padding: 1.5rem;
  border: 1px solid rgba(255,255,255,0.06);
  text-align: center;
`;

const StatIcon = styled.div`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
`;

const StatValue = styled.div`
  font-size: 1.75rem;
  font-weight: 800;
  color: white;
`;

const StatLabel = styled.div`
  color: rgba(255,255,255,0.35);
  font-size: 0.85rem;
  font-weight: 500;
  margin-top: 0.25rem;
`;

const difficultyColors = {
  'Beginner': '#22c55e',
  'Intermediate': '#f59e0b',
  'Advanced': '#ef4444'
};

const Dashboard = () => {
  const [completedLessons, setCompletedLessons] = useState([]);

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const data = await api.getProgress();
        if (data.progress) {
          setCompletedLessons(data.progress.filter(p => p.completed).map(p => p.lessonId));
        }
      } catch (e) {
        console.log('Could not load progress from server');
        const saved = localStorage.getItem('bloomvest_completed_lessons');
        if (saved) setCompletedLessons(JSON.parse(saved));
      }
    };
    loadProgress();
  }, []);

  return (
    <PageContainer>
      <HeroSection>
        <HeroContent>
          <HeroBadge
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <FaLightbulb /> Learn to Invest — Free Interactive Platform
          </HeroBadge>

          <HeroTitle
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Master Investing with<br />
            <span>Live Demo Scenarios</span> & AI
          </HeroTitle>

          <HeroSubtitle
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Practice with virtual money, learn through real-world scenarios,
            and get instant AI-powered guidance. No risk, all the knowledge.
          </HeroSubtitle>

          <HeroActions
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <PrimaryButton to="/demo">
              <FaPlay /> Start Demo Trading
            </PrimaryButton>
            <SecondaryButton to="/learn">
              <FaBookOpen /> Browse Lessons
            </SecondaryButton>
          </HeroActions>

          <MarketTicker
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {marketIndices.map(index => (
              <TickerItem key={index.name}>
                <TickerName>{index.name}</TickerName>
                <TickerValue>{index.value.toLocaleString()}</TickerValue>
                <TickerChange $positive={index.changePercent >= 0}>
                  {index.changePercent >= 0 ? '+' : ''}{index.changePercent}%
                </TickerChange>
              </TickerItem>
            ))}
          </MarketTicker>
        </HeroContent>
      </HeroSection>

      <SectionContainer>
        <StatsRow>
          <StatCard
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0 }}
          >
            <StatIcon>📚</StatIcon>
            <StatValue>{lessons.length}</StatValue>
            <StatLabel>Interactive Lessons</StatLabel>
          </StatCard>
          <StatCard
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <StatIcon>🎮</StatIcon>
            <StatValue>{scenarios.length}</StatValue>
            <StatLabel>Demo Scenarios</StatLabel>
          </StatCard>
          <StatCard
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <StatIcon>✅</StatIcon>
            <StatValue>{completedLessons.length}</StatValue>
            <StatLabel>Lessons Completed</StatLabel>
          </StatCard>
          <StatCard
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <StatIcon>🤖</StatIcon>
            <StatValue>24/7</StatValue>
            <StatLabel>AI Tutor Available</StatLabel>
          </StatCard>
        </StatsRow>

        <FeaturesGrid>
          <FeatureCard
            to="/learn"
            $accent="rgba(59,130,246,0.3)"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0 }}
          >
            <FeatureIcon $bg="rgba(59,130,246,0.1)" $color="#3b82f6">
              <FaGraduationCap />
            </FeatureIcon>
            <FeatureTitle>Interactive Lessons</FeatureTitle>
            <FeatureDesc>
              Learn investing fundamentals through structured lessons with quizzes and real-world examples.
            </FeatureDesc>
            <FeatureTag><FaArrowRight /> Start Learning</FeatureTag>
          </FeatureCard>

          <FeatureCard
            to="/demo"
            $accent="rgba(34,197,94,0.3)"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <FeatureIcon $bg="rgba(34,197,94,0.1)" $color="#22c55e">
              <FaChartLine />
            </FeatureIcon>
            <FeatureTitle>Demo Trading</FeatureTitle>
            <FeatureDesc>
              Practice buying and selling stocks with $100,000 in virtual money. Zero risk, real experience.
            </FeatureDesc>
            <FeatureTag><FaArrowRight /> Start Trading</FeatureTag>
          </FeatureCard>

          <FeatureCard
            to="/ai-tutor"
            $accent="rgba(139,92,246,0.3)"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <FeatureIcon $bg="rgba(139,92,246,0.1)" $color="#8b5cf6">
              <FaRobot />
            </FeatureIcon>
            <FeatureTitle>AI Investment Tutor</FeatureTitle>
            <FeatureDesc>
              Ask any investment question and get instant, clear explanations from our AI tutor.
            </FeatureDesc>
            <FeatureTag><FaArrowRight /> Ask a Question</FeatureTag>
          </FeatureCard>
        </FeaturesGrid>

        <SectionHeader>
          <SectionTitle><FaTrophy /> Demo Scenarios</SectionTitle>
          <SectionLink to="/scenario">
            View All <FaArrowRight />
          </SectionLink>
        </SectionHeader>

        <ScenariosGrid>
          {scenarios.slice(0, 3).map((scenario, index) => (
            <ScenarioCard
              key={scenario.id}
              to="/scenario"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <ScenarioHeader>
                <ScenarioIcon>{scenario.icon}</ScenarioIcon>
                <DifficultyBadge $color={difficultyColors[scenario.difficulty]}>
                  {scenario.difficulty}
                </DifficultyBadge>
              </ScenarioHeader>
              <ScenarioTitle>{scenario.title}</ScenarioTitle>
              <ScenarioDesc>{scenario.description}</ScenarioDesc>
              <ScenarioMeta>
                <Duration>{scenario.duration}</Duration>
                <StartButton>
                  <FaPlay /> Start Scenario
                </StartButton>
              </ScenarioMeta>
            </ScenarioCard>
          ))}
        </ScenariosGrid>
      </SectionContainer>
    </PageContainer>
  );
};

export default Dashboard;
