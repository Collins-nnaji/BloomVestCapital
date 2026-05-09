import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Page = styled.div`
  background: #f5f5f0;
  min-height: calc(100vh - 64px);
  padding-top: 64px;
  font-family: 'Inter', sans-serif;
  display: flex;
  flex-direction: column;
`;

const Inner = styled.div`
  flex: 1;
  max-width: 920px;
  margin: 0 auto;
  padding: clamp(2.5rem, 8vw, 5rem) 1.5rem clamp(3rem, 10vw, 5.5rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const Eyebrow = styled.p`
  margin: 0 0 1rem;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(15, 23, 42, 0.45);
  animation: ${fadeUp} 0.55s ease both;
`;

const Title = styled.h1`
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(2.15rem, 5vw, 3.35rem);
  font-weight: 800;
  line-height: 1.08;
  letter-spacing: -0.03em;
  color: #0a0f1e;
  margin: 0 0 1.25rem;
  max-width: 18ch;
  animation: ${fadeUp} 0.55s ease 0.06s both;

  em {
    font-style: italic;
    color: #15803d;
  }
`;

const Lead = styled.p`
  margin: 0 0 2.5rem;
  font-size: clamp(1rem, 2.2vw, 1.15rem);
  line-height: 1.75;
  color: rgba(15, 23, 42, 0.62);
  max-width: 38rem;
  animation: ${fadeUp} 0.55s ease 0.12s both;
`;

const Cards = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  width: 100%;
  max-width: 840px;
  animation: ${fadeUp} 0.55s ease 0.18s both;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    max-width: 420px;
  }
`;

const Card = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  padding: 1.35rem 1.35rem 1.25rem;
  background: #fff;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 14px;
  text-decoration: none;
  color: inherit;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;

  &:hover {
    border-color: rgba(34, 197, 94, 0.35);
    box-shadow: 0 12px 36px rgba(15, 23, 42, 0.08);
    transform: translateY(-2px);
  }
`;

const CardLabel = styled.span`
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #15803d;
  margin-bottom: 0.45rem;
`;

const CardTitle = styled.span`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.05rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.35rem;
`;

const CardDesc = styled.span`
  font-size: 0.84rem;
  line-height: 1.55;
  color: rgba(15, 23, 42, 0.55);
`;

const Footnote = styled.p`
  margin: 2.25rem 0 0;
  font-size: 0.8rem;
  line-height: 1.6;
  color: rgba(15, 23, 42, 0.42);
  max-width: 32rem;
  animation: ${fadeUp} 0.55s ease 0.24s both;
`;

const LandingPage = () => (
  <Page>
    <Inner>
      <Eyebrow>BloomVest Finance</Eyebrow>
      <Title>
        Learn markets, explore scenarios, and use <em>AI-backed intelligence</em> in one place.
      </Title>
      <Lead>
        This app is for building financial literacy and experimenting with ideas—not for personalized
        investment advice. Sign in to save progress, open BloomVest Intelligence for signals and
        tools, and use Learn for lessons and practice.
      </Lead>

      <Cards>
        <Card to="/signals">
          <CardLabel>Signals & tools</CardLabel>
          <CardTitle>BloomVest Intelligence</CardTitle>
          <CardDesc>Portfolio-style workspace and AI chat grounded in how you explore markets.</CardDesc>
        </Card>
        <Card to="/learn">
          <CardLabel>Academy</CardLabel>
          <CardTitle>Learn</CardTitle>
          <CardDesc>Courses, scenarios, and structured practice to grow confidence step by step.</CardDesc>
        </Card>
        <Card to="/auth">
          <CardLabel>Your account</CardLabel>
          <CardTitle>Sign in</CardTitle>
          <CardDesc>Create or access your account to sync progress across BloomVest.</CardDesc>
        </Card>
      </Cards>

      <Footnote>
        Educational content only; not personalized financial advice. Always do your own research before
        making financial decisions.
      </Footnote>
    </Inner>
  </Page>
);

export default LandingPage;
