import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaCheck, FaLock, FaRobot, FaChartLine, FaBookOpen, FaCrown, FaArrowRight } from 'react-icons/fa';
import { useAuth } from '../AuthContext';

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(180deg, #060910 0%, #0f1420 100%);
  padding: 2rem 1.5rem 4rem;
`;

const Content = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.75rem;
  span { color: #22c55e; }
`;

const Subtitle = styled.p`
  color: rgba(255,255,255,0.5);
  font-size: 1.05rem;
  max-width: 500px;
  margin: 0 auto;
`;

const CurrencyToggle = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 2.5rem;
`;

const CurrencyBtn = styled.button`
  padding: 0.5rem 1.25rem;
  border-radius: 8px;
  border: 1px solid ${p => p.$active ? 'rgba(34,197,94,0.4)' : 'rgba(255,255,255,0.08)'};
  background: ${p => p.$active ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.03)'};
  color: ${p => p.$active ? '#4ade80' : 'rgba(255,255,255,0.4)'};
  font-family: 'DM Sans', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover { border-color: rgba(34,197,94,0.3); }
`;

const PlansGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  @media (max-width: 768px) { grid-template-columns: 1fr; }
`;

const PlanCard = styled(motion.div)`
  background: rgba(255,255,255,0.03);
  border: ${p => p.$featured ? '2px solid rgba(34,197,94,0.3)' : '1px solid rgba(255,255,255,0.06)'};
  border-radius: 16px;
  padding: 2rem;
  position: relative;
  overflow: hidden;

  ${p => p.$featured && `
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, #22c55e, #4ade80);
    }
  `}
`;

const PlanBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
  font-size: 0.7rem;
  font-weight: 600;
  background: rgba(34,197,94,0.15);
  color: #4ade80;
  margin-bottom: 1rem;
`;

const PlanName = styled.h2`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
`;

const PlanPrice = styled.div`
  margin-bottom: 1.5rem;
`;

const PriceAmount = styled.span`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
`;

const PricePeriod = styled.span`
  color: rgba(255,255,255,0.35);
  font-size: 0.9rem;
`;

const FeaturesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 2rem 0;
`;

const Feature = styled.li`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.5rem 0;
  color: rgba(255,255,255,0.7);
  font-size: 0.9rem;

  svg {
    color: ${p => p.$locked ? 'rgba(255,255,255,0.15)' : '#4ade80'};
    flex-shrink: 0;
    font-size: 0.8rem;
  }

  ${p => p.$locked && `color: rgba(255,255,255,0.25); text-decoration: line-through;`}
`;

const PlanButton = styled.button`
  width: 100%;
  padding: 0.85rem;
  border-radius: 10px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  ${p => p.$primary ? `
    background: #22c55e;
    color: white;
    border: none;
    box-shadow: 0 4px 15px rgba(34,197,94,0.3);
    &:hover { background: #16a34a; transform: translateY(-2px); }
  ` : `
    background: rgba(255,255,255,0.05);
    color: rgba(255,255,255,0.6);
    border: 1px solid rgba(255,255,255,0.08);
    &:hover { border-color: rgba(255,255,255,0.15); }
  `}

  &:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
`;

const SignInPrompt = styled.div`
  text-align: center;
  margin-top: 2rem;
  padding: 1.5rem;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 12px;
  color: rgba(255,255,255,0.5);
  font-size: 0.9rem;

  button {
    color: #4ade80;
    background: none;
    border: none;
    font-weight: 600;
    cursor: pointer;
    text-decoration: underline;
  }
`;

const PricingPage = () => {
  const { user, isPro, signInWithGoogle } = useAuth();
  const [currency, setCurrency] = useState('USD');
  const [loading, setLoading] = useState(false);

  const prices = {
    USD: { symbol: '$', amount: '9.99', period: '/month' },
    NGN: { symbol: '₦', amount: '7,500', period: '/month' },
  };

  const currentPrice = prices[currency];

  const handleUpgrade = async () => {
    if (!user) {
      signInWithGoogle();
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/billing/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, currency }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert(data.error || 'Could not start checkout');
    } catch {
      alert('Failed to connect to billing');
    }
    setLoading(false);
  };

  const handleManage = async () => {
    try {
      const res = await fetch('/api/billing/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {}
  };

  return (
    <PageContainer>
      <Content>
        <Header>
          <Title>Choose Your <span>Plan</span></Title>
          <Subtitle>
            Free to start learning. Upgrade to Pro for AI-guided scenarios and advanced features.
          </Subtitle>
        </Header>

        <CurrencyToggle>
          <CurrencyBtn $active={currency === 'USD'} onClick={() => setCurrency('USD')}>
            🇺🇸 USD ($)
          </CurrencyBtn>
          <CurrencyBtn $active={currency === 'NGN'} onClick={() => setCurrency('NGN')}>
            🇳🇬 NGN (₦)
          </CurrencyBtn>
        </CurrencyToggle>

        <PlansGrid>
          <PlanCard initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
            <PlanName>Free</PlanName>
            <PlanPrice>
              <PriceAmount>$0</PriceAmount>
              <PricePeriod> forever</PricePeriod>
            </PlanPrice>
            <FeaturesList>
              <Feature><FaCheck /> <span>7 investment courses (43 lessons)</span></Feature>
              <Feature><FaCheck /> <span>Interactive quizzes & progress tracking</span></Feature>
              <Feature><FaCheck /> <span>Practice trading with $100K virtual cash</span></Feature>
              <Feature><FaCheck /> <span>26 assets: stocks, crypto, bonds, forex</span></Feature>
              <Feature><FaCheck /> <span>Portfolio health scoring & decision ratings</span></Feature>
              <Feature><FaCheck /> <span>AI Investment Tutor (GPT-4)</span></Feature>
              <Feature $locked><FaLock /> <span>AI-guided scenario simulations</span></Feature>
              <Feature $locked><FaLock /> <span>Commodities & multi-asset scenarios</span></Feature>
              <Feature $locked><FaLock /> <span>Real-time AI coaching per trade</span></Feature>
            </FeaturesList>
            <PlanButton disabled>Current Plan</PlanButton>
          </PlanCard>

          <PlanCard $featured initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <PlanBadge><FaCrown /> Most Popular</PlanBadge>
            <PlanName>Pro</PlanName>
            <PlanPrice>
              <PriceAmount>{currentPrice.symbol}{currentPrice.amount}</PriceAmount>
              <PricePeriod>{currentPrice.period}</PricePeriod>
            </PlanPrice>
            <FeaturesList>
              <Feature><FaCheck /> <span>Everything in Free</span></Feature>
              <Feature><FaCheck /> <span><strong>11 AI-guided scenario simulations</strong></span></Feature>
              <Feature><FaCheck /> <span><strong>Real-time GPT-4 coaching per trade</strong></span></Feature>
              <Feature><FaCheck /> <span><strong>Commodities, crypto, forex scenarios</strong></span></Feature>
              <Feature><FaCheck /> <span><strong>Multi-asset portfolio challenges</strong></span></Feature>
              <Feature><FaCheck /> <span><strong>AI performance review on completion</strong></span></Feature>
              <Feature><FaCheck /> <span>Priority AI tutor responses</span></Feature>
              <Feature><FaCheck /> <span>Cancel anytime</span></Feature>
            </FeaturesList>
            {isPro ? (
              <PlanButton onClick={handleManage}>
                <FaCrown /> Manage Subscription
              </PlanButton>
            ) : (
              <PlanButton $primary onClick={handleUpgrade} disabled={loading}>
                {loading ? 'Loading...' : <>Upgrade to Pro <FaArrowRight /></>}
              </PlanButton>
            )}
          </PlanCard>
        </PlansGrid>

        {!user && (
          <SignInPrompt>
            <button onClick={signInWithGoogle}>Sign in with Google</button> to get started or upgrade to Pro.
          </SignInPrompt>
        )}
      </Content>
    </PageContainer>
  );
};

export default PricingPage;
