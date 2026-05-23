import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowRight, FaLock, FaPlus, FaTrash } from 'react-icons/fa';
import { PLATFORM_LAYERS } from '../config/platform';

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Page = styled.div`
  min-height: calc(100vh - 64px);
  margin-top: 64px;
  padding: 2rem 1.5rem 4rem;
  background: linear-gradient(180deg, #fafbfc 0%, #f0fdf4 50%, #fafbfc 100%);
  font-family: 'Inter', system-ui, sans-serif;
`;

const Inner = styled.div`
  max-width: 1100px;
  margin: 0 auto;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 2.5rem;
  animation: ${fadeUp} 0.5s ease both;
`;

const Eyebrow = styled.p`
  margin: 0 0 0.5rem;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #15803d;
`;

const Title = styled.h1`
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(1.75rem, 4vw, 2.75rem);
  font-weight: 800;
  color: #0a0f1e;
  margin: 0 0 0.75rem;
  letter-spacing: -0.03em;
`;

const Lead = styled.p`
  margin: 0 auto;
  max-width: 40rem;
  font-size: 1.05rem;
  line-height: 1.65;
  color: rgba(15, 23, 42, 0.58);
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const Card = styled(motion.div)`
  background: #fff;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 16px;
  padding: 1.35rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const CardIcon = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  background: ${(p) => p.$bg};
  color: ${(p) => p.$color};
`;

const CardTitle = styled.h3`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.05rem;
  font-weight: 800;
  margin: 0;
  color: #0f172a;
`;

const CardDesc = styled.p`
  margin: 0;
  font-size: 0.86rem;
  line-height: 1.55;
  color: rgba(15, 23, 42, 0.55);
  flex: 1;
`;

const FeatureList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 0.8rem;
  color: rgba(15, 23, 42, 0.62);
  li {
    padding: 0.2rem 0;
    &:before {
      content: '✓ ';
      color: #22c55e;
      font-weight: 700;
    }
  }
`;

const Panel = styled.section`
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 20px;
  padding: 1.75rem;
  margin-bottom: 1.5rem;
`;

const PanelTitle = styled.h2`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.25rem;
  font-weight: 800;
  margin: 0 0 1rem;
  color: #0f172a;
`;

const GoalForm = styled.form`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
`;

const GoalInput = styled.input`
  flex: 1;
  min-width: 180px;
  padding: 0.65rem 0.85rem;
  border-radius: 10px;
  border: 1px solid rgba(15, 23, 42, 0.12);
  font-size: 0.9rem;
`;

const AddBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.65rem 1rem;
  border-radius: 10px;
  border: none;
  background: linear-gradient(135deg, #15803d, #0f766e);
  color: #fff;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
`;

const GoalRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(15, 23, 42, 0.06);
  &:last-child {
    border-bottom: none;
  }
`;

const GoalName = styled.span`
  font-weight: 600;
  color: #0f172a;
`;

const GoalMeta = styled.span`
  font-size: 0.8rem;
  color: #64748b;
`;

const IconBtn = styled.button`
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 0.25rem;
  &:hover {
    color: #ef4444;
  }
`;

const CtaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1rem;
`;

const PrimaryLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.75rem 1.25rem;
  border-radius: 10px;
  background: linear-gradient(135deg, #0f172a, #14532d);
  color: #fff;
  font-weight: 700;
  font-size: 0.9rem;
  text-decoration: none;
  &:hover {
    opacity: 0.95;
  }
`;

const GhostLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.75rem 1.25rem;
  border-radius: 10px;
  border: 1px solid rgba(15, 23, 42, 0.12);
  color: #0f172a;
  font-weight: 700;
  font-size: 0.9rem;
  text-decoration: none;
  background: #fff;
`;

const Badge = styled.span`
  display: inline-block;
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  background: rgba(245, 158, 11, 0.15);
  color: #b45309;
  margin-left: 0.35rem;
  vertical-align: middle;
`;

const Leaderboard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const LbRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.65rem 0.85rem;
  background: rgba(15, 23, 42, 0.03);
  border-radius: 10px;
`;

const Rank = styled.span`
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: ${(p) => (p.$rank === 1 ? 'linear-gradient(135deg,#fbbf24,#f59e0b)' : p.$rank === 2 ? '#94a3b8' : p.$rank === 3 ? '#d97706' : 'rgba(15,23,42,0.08)')};
  color: ${(p) => (p.$rank <= 3 ? '#fff' : '#64748b')};
  font-weight: 800;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MOCK_LEADERBOARD = [
  { name: 'Ada O.', streak: 14, xp: 2840 },
  { name: 'James K.', streak: 11, xp: 2650 },
  { name: 'Priya M.', streak: 9, xp: 2410 },
  { name: 'You (preview)', streak: 0, xp: 0 },
];

const STORAGE_KEY = 'bloomvest_wealth_goals_v1';

function WealthPreview() {
  const [goals, setGoals] = useState([]);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setGoals(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
    } catch {
      /* ignore */
    }
  }, [goals]);

  const addGoal = (e) => {
    e.preventDefault();
    const n = name.trim();
    const a = parseFloat(amount);
    if (!n || Number.isNaN(a) || a <= 0) return;
    setGoals((g) => [...g, { id: Date.now(), name: n, target: a, saved: 0 }]);
    setName('');
    setAmount('');
  };

  const removeGoal = (id) => setGoals((g) => g.filter((x) => x.id !== id));

  const layer = PLATFORM_LAYERS.find((l) => l.id === 'wealth');

  return (
    <Page>
      <Inner>
        <Header>
          <Eyebrow>Layer 4 · Wealth OS</Eyebrow>
          <Title>
            {layer?.name}
            <Badge>Preview</Badge>
          </Title>
          <Lead>
            Track net worth, savings goals, and habits — then let AI forecast growth and nudge better behavior. Full sync
            and bank connections are coming soon; try the goal planner below.
          </Lead>
        </Header>

        <Grid>
          {layer?.features.map((f) => (
            <Card key={f} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <CardIcon $bg={layer.bg} $color={layer.color}>
                <FaLock style={{ fontSize: '0.9rem' }} />
              </CardIcon>
              <CardTitle>{f}</CardTitle>
              <CardDesc>Building now — your data will stay private and exportable.</CardDesc>
            </Card>
          ))}
        </Grid>

        <Panel>
          <PanelTitle>Goal planner (local preview)</PanelTitle>
          <GoalForm onSubmit={addGoal}>
            <GoalInput placeholder="Goal name (e.g. Emergency fund)" value={name} onChange={(e) => setName(e.target.value)} />
            <GoalInput
              type="number"
              placeholder="Target ($)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <AddBtn type="submit">
              <FaPlus /> Add goal
            </AddBtn>
          </GoalForm>
          {goals.length === 0 ? (
            <CardDesc>Add a savings goal to see how Wealth OS will track progress.</CardDesc>
          ) : (
            goals.map((g) => (
              <GoalRow key={g.id}>
                <div>
                  <GoalName>{g.name}</GoalName>
                  <GoalMeta>
                    ${g.saved.toLocaleString()} / ${g.target.toLocaleString()} target
                  </GoalMeta>
                </div>
                <IconBtn type="button" onClick={() => removeGoal(g.id)} aria-label="Remove goal">
                  <FaTrash />
                </IconBtn>
              </GoalRow>
            ))
          )}
          <Panel style={{ marginTop: 0 }}>
            <PanelTitle>Learning prompts for your goals</PanelTitle>
            <FeatureList>
              <li>Emergency fund → study liquidity and 3–6 months of expenses</li>
              <li>Investing goal → start with Academy index-fund lessons</li>
              <li>Debt payoff → learn avalanche vs snowball methods</li>
            </FeatureList>
          </Panel>
          <CtaRow>
            <PrimaryLink to="/mentor">
              Ask Mentor about my goals <FaArrowRight />
            </PrimaryLink>
            <GhostLink to="/academy">Learn saving fundamentals</GhostLink>
          </CtaRow>
        </Panel>
      </Inner>
    </Page>
  );
}

function CommunityPreview() {
  const layer = PLATFORM_LAYERS.find((l) => l.id === 'community');

  return (
    <Page>
      <Inner>
        <Header>
          <Eyebrow>Layer 6 · Community</Eyebrow>
          <Title>
            {layer?.name}
            <Badge>Preview</Badge>
          </Title>
          <Lead>
            Compete on Paper Wealth challenges, keep learning streaks alive, and join squads — without turning finance
            into toxic advice threads.
          </Lead>
        </Header>

        <Grid>
          {layer?.features.map((f) => (
            <Card key={f} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <CardIcon $bg={layer.bg} $color={layer.color}>
                <layer.icon />
              </CardIcon>
              <CardTitle>{f}</CardTitle>
              <CardDesc>Launching with Paper Wealth challenges and Academy streaks.</CardDesc>
            </Card>
          ))}
        </Grid>

        <Panel>
          <PanelTitle>This week&apos;s learning challenge</PanelTitle>
          <CardDesc style={{ marginBottom: '1rem' }}>
            Complete any Paper Wealth scenario and score 80%+ on one Academy quiz to earn demo XP when Community launches.
          </CardDesc>
          <PanelTitle style={{ fontSize: '1rem' }}>Challenge leaderboard (demo)</PanelTitle>
          <Leaderboard>
            {MOCK_LEADERBOARD.map((row, i) => (
              <LbRow key={row.name}>
                <Rank $rank={i + 1}>{i + 1}</Rank>
                <div style={{ flex: 1 }}>
                  <GoalName>{row.name}</GoalName>
                  <GoalMeta>
                    {row.streak} day streak · {row.xp} XP
                  </GoalMeta>
                </div>
              </LbRow>
            ))}
          </Leaderboard>
          <CtaRow>
            <PrimaryLink to="/paper-wealth">
              Start a simulation <FaArrowRight />
            </PrimaryLink>
            <GhostLink to="/academy">Earn XP in Academy</GhostLink>
          </CtaRow>
        </Panel>
      </Inner>
    </Page>
  );
}

export function WealthPage() {
  return <WealthPreview />;
}

export function CommunityPage() {
  return <CommunityPreview />;
}
