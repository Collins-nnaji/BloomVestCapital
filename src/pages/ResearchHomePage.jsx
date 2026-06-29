import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

const Page = styled.div`
  margin-top: 64px;
  min-height: calc(100vh - 64px);
  background: #f8fafc;
`;

const Inner = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 2.5rem 1.25rem 5rem;
`;

const Eyebrow = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #15803d;
  margin: 0 0 0.4rem;
`;

const PageTitle = styled.h1`
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(1.8rem, 5vw, 2.75rem);
  font-weight: 800;
  color: #0f172a;
  margin: 0;
  letter-spacing: -0.04em;
`;

const HeaderSub = styled.p`
  color: #64748b;
  font-size: 0.88rem;
  margin: 0.5rem 0 0;
  font-family: 'Inter', sans-serif;
`;

const SearchInput = styled.input`
  width: 100%;
  margin: 2rem 0 1.5rem;
  padding: 0.85rem 1.1rem;
  border-radius: 12px;
  border: 1.5px solid #e2e8f0;
  background: #fff;
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  color: #0f172a;
  outline: none;
  transition: border-color 0.15s;
  &:focus {
    border-color: #10b981;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 0.9rem;
`;

const Card = styled.button`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.3rem;
  padding: 1.1rem 1.25rem;
  border-radius: 14px;
  border: 1.5px solid #e2e8f0;
  background: #fff;
  cursor: pointer;
  text-align: left;
  transition: border-color 0.15s, transform 0.15s;
  &:hover {
    border-color: #10b981;
    transform: translateY(-2px);
  }
`;

const Ticker = styled.span`
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: 1.05rem;
  color: #0f172a;
`;

const Name = styled.span`
  font-family: 'Inter', sans-serif;
  font-size: 0.82rem;
  color: #64748b;
`;

const SectorPill = styled.span`
  margin-top: 0.4rem;
  display: inline-block;
  padding: 0.2rem 0.6rem;
  border-radius: 100px;
  background: rgba(16,185,129,.1);
  color: #15803d;
  font-size: 0.68rem;
  font-weight: 700;
  font-family: 'Inter', sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const EmptyState = styled.p`
  color: #94a3b8;
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  padding: 2rem 0;
  text-align: center;
`;

export default function ResearchHomePage() {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    api.searchCompanies(query)
      .then(res => {
        if (active) setCompanies(res.companies || []);
      })
      .catch(() => {
        if (active) setCompanies([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [query]);

  return (
    <Page>
      <Inner>
        <Eyebrow>Equity Research</Eyebrow>
        <PageTitle>Company Research</PageTitle>
        <HeaderSub>Real financial statements, computed ratios, and AI-generated analysis for covered companies.</HeaderSub>

        <SearchInput
          placeholder="Search by ticker or company name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {loading ? (
          <EmptyState>Loading companies...</EmptyState>
        ) : companies.length === 0 ? (
          <EmptyState>No companies found.</EmptyState>
        ) : (
          <Grid>
            {companies.map((c) => (
              <Card key={c.ticker} onClick={() => navigate(`/research/${c.ticker}`)}>
                <Ticker>{c.ticker}</Ticker>
                <Name>{c.name}</Name>
                {c.sector && <SectorPill>{c.sector}</SectorPill>}
              </Card>
            ))}
          </Grid>
        )}
      </Inner>
    </Page>
  );
}
