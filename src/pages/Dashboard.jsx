import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FaBolt,
  FaChartLine,
  FaEnvelope,
  FaNewspaper,
  FaRobot,
  FaSyncAlt,
  FaExclamationTriangle,
  FaEye,
  FaSeedling,
  FaRegLightbulb,
  FaArrowRight,
  FaExternalLinkAlt,
} from 'react-icons/fa';
import { marketIndices } from '../data/stockData';
import { api } from '../api';

const slide = keyframes`
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
`;

const shimmer = keyframes`
  0% { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
`;

const Page = styled.div`
  min-height: calc(100vh - 80px);
  font-family: 'DM Sans', system-ui, -apple-system, 'Segoe UI', sans-serif;
  font-size: 1.02rem;
  -webkit-font-smoothing: antialiased;
  background: #f0f4f8;
  background-image:
    radial-gradient(ellipse 80% 50% at 50% -20%, rgba(34, 197, 94, 0.08), transparent),
    radial-gradient(ellipse 60% 40% at 100% 0%, rgba(59, 130, 246, 0.05), transparent);
`;

const TopBar = styled.header`
  position: relative;
  color: white;
  padding: 1.5rem 1.5rem 1.25rem;
  overflow: hidden;
  background: linear-gradient(155deg, #020617 0%, #0f172a 42%, #111827 100%);
  border-bottom: 1px solid rgba(148, 163, 184, 0.12);

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: linear-gradient(
        rgba(148, 163, 184, 0.04) 1px,
        transparent 1px
      ),
      linear-gradient(90deg, rgba(148, 163, 184, 0.04) 1px, transparent 1px);
    background-size: 48px 48px;
    mask-image: linear-gradient(180deg, black 40%, transparent 95%);
    pointer-events: none;
  }
`;

const TopBarGlow = styled(motion.div)`
  position: absolute;
  right: -8%;
  top: -60%;
  width: min(520px, 70vw);
  height: 140%;
  background: radial-gradient(circle, rgba(34, 197, 94, 0.18) 0%, transparent 62%);
  pointer-events: none;
`;

const TopBarInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1.25rem;
`;

const TitleBlock = styled.div`
  max-width: min(640px, 100%);
`;

const Kicker = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #86efac;
  margin-bottom: 0.65rem;

  span {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #22c55e;
    box-shadow: 0 0 12px rgba(34, 197, 94, 0.8);
  }
`;

const PageTitle = styled(motion.h1)`
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(2.05rem, 4.8vw, 3rem);
  font-weight: 800;
  letter-spacing: -0.045em;
  margin: 0 0 0.55rem;
  line-height: 1.06;
  color: #f8fafc;

  .gradient {
    background: linear-gradient(120deg, #4ade80 0%, #22c55e 45%, #86efac 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: ${shimmer} 5s ease infinite;
  }
`;

const PageSub = styled(motion.p)`
  margin: 0;
  font-size: clamp(1rem, 1.35vw, 1.12rem);
  color: #cbd5e1;
  line-height: 1.62;
  font-weight: 480;
  max-width: min(520px, 100%);
`;

const TopActions = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
`;

const RefreshBtn = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.07);
  color: #f1f5f9;
  font-size: 0.92rem;
  font-weight: 700;
  padding: 0.72rem 1.15rem;
  cursor: pointer;
  backdrop-filter: blur(8px);
  transition: border-color 0.2s, background 0.2s, transform 0.2s;

  &:hover:not(:disabled) {
    background: rgba(34, 197, 94, 0.15);
    border-color: rgba(34, 197, 94, 0.45);
    transform: translateY(-1px);
  }
  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  svg.spin {
    animation: spin 0.85s linear infinite;
  }
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const MetaPill = styled.div`
  font-size: 0.8rem;
  font-weight: 600;
  color: #94a3b8;
  padding: 0.4rem 0.72rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
`;

const NEWSLETTER_MAILTO =
  'mailto:intelligence@bloomvest.capital?subject=Weekly%20insights&body=Hi%20BloomVest%2C%0A%0APlease%20add%20me%20to%20the%20weekly%20insights%20list.%0A%0AMy%20email%3A%20';

const BrandStrip = styled(motion.section)`
  background: linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%);
  border-bottom: 1px solid rgba(15, 23, 42, 0.08);
  padding: 2rem 0 2.5rem;
`;

const BrandOuter = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.25rem;

  @media (min-width: 768px) {
    padding: 0 1.5rem;
  }
`;

const BrandGrid = styled.div`
  display: grid;
  gap: 1.75rem;
  align-items: stretch;

  @media (min-width: 900px) {
    grid-template-columns: 1.12fr 0.88fr;
    gap: 2rem;
    align-items: start;
  }
`;

const BrandCopyCol = styled.div`
  text-align: center;

  @media (min-width: 900px) {
    text-align: left;
    padding-top: 0.15rem;
  }
`;

const BrandCtaCard = styled.div`
  background: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 16px;
  padding: 1.35rem 1.4rem 1.45rem;
  box-shadow:
    0 1px 3px rgba(15, 23, 42, 0.04),
    0 12px 36px rgba(15, 23, 42, 0.06);

  @media (min-width: 900px) {
    position: sticky;
    top: 88px;
  }
`;

const BrandCTAInner = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
`;

const BrandHeadline = styled.h2`
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(1.8rem, 4.2vw, 2.55rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  color: #0f172a;
  margin: 0 0 0.75rem;
  line-height: 1.12;
`;

const BrandSub = styled.p`
  margin: 0 auto 1rem;
  font-size: clamp(1.08rem, 1.5vw, 1.2rem);
  color: #334155;
  line-height: 1.68;
  font-weight: 480;
  max-width: 36em;

  @media (min-width: 900px) {
    margin-left: 0;
    margin-right: 0;
  }
`;

const BrandSupporting = styled.p`
  margin: 0 auto 0;
  font-size: clamp(0.98rem, 1.1vw, 1.05rem);
  color: #475569;
  line-height: 1.62;
  max-width: 36em;

  @media (min-width: 900px) {
    margin-left: 0;
    margin-right: 0;
  }
`;

const BrandCTARow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
  justify-content: center;
  align-items: center;

  @media (min-width: 900px) {
    justify-content: flex-start;
  }

  ${BrandCtaCard} & {
    justify-content: flex-start;
  }
`;

const BrandPrimaryBtn = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.9rem 1.5rem;
  border-radius: 14px;
  font-weight: 800;
  font-size: 0.98rem;
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  color: #052e16;
  text-decoration: none;
  box-shadow: 0 6px 24px rgba(34, 197, 94, 0.35);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 32px rgba(34, 197, 94, 0.42);
    color: #052e16;
  }
`;

const BrandSecondaryBtn = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.88rem 1.3rem;
  border-radius: 14px;
  font-weight: 700;
  font-size: 0.95rem;
  color: #0f172a;
  border: 1px solid rgba(15, 23, 42, 0.12);
  background: #ffffff;
  text-decoration: none;
  transition: border-color 0.2s ease, background 0.2s ease;

  &:hover {
    border-color: rgba(34, 197, 94, 0.45);
    background: rgba(34, 197, 94, 0.06);
    color: #0f172a;
  }
`;

const BrandSocialProof = styled.p`
  margin: 0;
  font-size: 0.82rem;
  font-weight: 700;
  color: #15803d;
  letter-spacing: 0.02em;
`;

const BrandDisclaimerMini = styled.p`
  margin: 0;
  font-size: 0.72rem;
  line-height: 1.55;
  color: #94a3b8;
`;

const TickerBar = styled.div`
  position: relative;
  z-index: 1;
  background: rgba(2, 6, 23, 0.85);
  border-top: 1px solid rgba(51, 65, 85, 0.5);
  padding: 0.55rem 0;
  overflow: hidden;
`;

const TickerTrack = styled.div`
  display: flex;
  gap: 2.5rem;
  width: max-content;
  animation: ${slide} 38s linear infinite;
`;

const TItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.84rem;
  white-space: nowrap;
`;

const TSym = styled.span`
  font-family: 'JetBrains Mono', monospace;
  color: #64748b;
  font-weight: 700;
`;

const TVal = styled.span`
  font-family: 'JetBrains Mono', monospace;
  font-weight: 600;
  color: #e2e8f0;
`;

const TChg = styled.span`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.76rem;
  color: ${(p) => (p.$pos ? '#4ade80' : '#f87171')};
`;

const Shell = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.35rem 1.25rem 3.25rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;

  @media (min-width: 768px) {
    padding: 1.6rem 1.5rem 3.75rem;
    gap: 2.25rem;
  }
`;

const StatsRow = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;

  @media (min-width: 720px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const StatCard = styled(motion.div)`
  position: relative;
  background: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.06);
  border-radius: 16px;
  padding: 1.15rem 1.2rem;
  box-shadow:
    0 1px 2px rgba(15, 23, 42, 0.04),
    0 8px 24px rgba(15, 23, 42, 0.06);
  overflow: hidden;
  cursor: default;
  transition:
    box-shadow 0.35s ease,
    transform 0.35s ease;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #22c55e, #4ade80);
    opacity: 0.85;
    transform: scaleX(0.35);
    transform-origin: left;
    transition: transform 0.4s ease;
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow:
      0 4px 12px rgba(15, 23, 42, 0.06),
      0 16px 40px rgba(34, 197, 94, 0.09);

    &::after {
      transform: scaleX(1);
    }
  }
`;

const StatIconWrap = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(145deg, rgba(34, 197, 94, 0.12), rgba(34, 197, 94, 0.04));
  color: #15803d;
  font-size: 1rem;
  margin-bottom: 0.75rem;
`;

const StatLabel = styled.div`
  font-size: 0.86rem;
  font-weight: 700;
  color: #64748b;
  margin-bottom: 0.35rem;
  letter-spacing: -0.01em;
`;

const StatValue = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.2rem;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.35;
  letter-spacing: -0.03em;
`;

const StatHint = styled.div`
  font-size: 0.82rem;
  color: #64748b;
  margin-top: 0.45rem;
  font-weight: 500;
`;

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;

  @media (min-width: 960px) {
    grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
    align-items: stretch;
  }
`;

const Widget = styled(motion.div)`
  position: relative;
  background: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.06);
  border-radius: 16px;
  padding: 0;
  box-shadow:
    0 1px 2px rgba(15, 23, 42, 0.04),
    0 8px 24px rgba(15, 23, 42, 0.05);
  overflow: hidden;
`;

const WidgetAccent = styled.div`
  height: 4px;
  background: linear-gradient(90deg, #22c55e, #3b82f6);
  opacity: 0.9;
`;

const WidgetBody = styled.div`
  padding: 1.35rem 1.4rem 1.45rem;
`;

const WidgetHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const WidgetTitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.65rem;
`;

const WidgetIcon = styled.div`
  width: 38px;
  height: 38px;
  border-radius: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f1f5f9;
  color: #0f172a;
  font-size: 1rem;
`;

const WidgetTitle = styled.h2`
  margin: 0;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.28rem;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.03em;
  line-height: 1.2;
`;

const WidgetSubtitle = styled.span`
  display: block;
  font-size: 0.82rem;
  font-weight: 600;
  color: #64748b;
  margin-top: 0.18rem;
  letter-spacing: 0.01em;
`;

const WidgetBadge = styled.span`
  font-size: 0.68rem;
  font-weight: 800;
  padding: 0.3rem 0.6rem;
  border-radius: 999px;
  background: rgba(34, 197, 94, 0.12);
  color: #15803d;
  letter-spacing: 0.04em;
`;

/** Serif pull-quote for AI market narrative - large quote marks + Source Serif body. */
const NarrativeQuoteBox = styled.blockquote`
  margin: 0;
  padding: 1.45rem 1.35rem 1.55rem 3.15rem;
  position: relative;
  font-family: 'Source Serif 4', Georgia, 'Times New Roman', serif;
  font-size: clamp(1.08rem, 2.1vw, 1.22rem);
  line-height: 1.78;
  color: ${(p) => (p.$muted ? '#94a3b8' : '#1e293b')};
  font-weight: 500;
  background: ${(p) =>
    p.$muted
      ? 'linear-gradient(145deg, #f8fafc 0%, #f1f5f9 100%)'
      : 'linear-gradient(135deg, rgba(34, 197, 94, 0.09) 0%, rgba(248, 250, 252, 0.98) 48%, #f8fafc 100%)'};
  border-radius: 14px;
  border-left: 4px solid ${(p) => (p.$muted ? 'rgba(148, 163, 184, 0.5)' : 'rgba(34, 197, 94, 0.82)')};
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.65);
  white-space: pre-wrap;
`;

const NarrativeQuoteMarkOpen = styled.span`
  position: absolute;
  left: 0.75rem;
  top: 0.42rem;
  font-size: clamp(2.4rem, 5vw, 3.1rem);
  line-height: 0.92;
  font-family: 'Source Serif 4', Georgia, serif;
  font-weight: 700;
  pointer-events: none;
  color: ${(p) => (p.$muted ? 'rgba(148, 163, 184, 0.45)' : 'rgba(34, 197, 94, 0.32)')};
`;

const NarrativeQuoteMarkClose = styled.span`
  position: absolute;
  right: 1rem;
  bottom: 0.4rem;
  font-size: clamp(1.85rem, 3.5vw, 2.4rem);
  line-height: 1;
  font-family: 'Source Serif 4', Georgia, serif;
  font-weight: 700;
  pointer-events: none;
  color: ${(p) => (p.$muted ? 'rgba(148, 163, 184, 0.3)' : 'rgba(34, 197, 94, 0.22)')};
`;

const Disclaimer = styled.div`
  margin-top: 1.1rem;
  padding: 0.95rem 1.05rem;
  border-radius: 12px;
  background: #f8fafc;
  border: 1px solid rgba(15, 23, 42, 0.06);
  font-size: 0.84rem;
  line-height: 1.58;
  color: #475569;
`;

const IdxRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.55rem 0;
  border-bottom: 1px solid rgba(15, 23, 42, 0.06);
  transition: background 0.2s;
  margin: 0 -0.25rem;
  padding-left: 0.25rem;
  padding-right: 0.25rem;
  border-radius: 8px;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: rgba(241, 245, 249, 0.8);
  }
`;

const IdxName = styled.span`
  font-size: 0.9rem;
  color: #334155;
  font-weight: 600;
`;

const IdxRight = styled.div`
  text-align: right;
`;

const IdxVal = styled.div`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9rem;
  font-weight: 700;
  color: #0f172a;
`;

const IdxChg = styled.div`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.78rem;
  font-weight: 600;
  color: ${(p) => (p.$pos ? '#16a34a' : '#dc2626')};
`;

const SectionHeader = styled(motion.div)`
  margin-bottom: 1rem;
`;

const SectionEyebrow = styled.span`
  display: block;
  font-size: 0.76rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: #22c55e;
  margin-bottom: 0.35rem;
`;

const SectionTitle = styled.h3`
  margin: 0;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.42rem;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.035em;
  line-height: 1.2;
`;

const SectionDesc = styled.p`
  margin: 0.35rem 0 0;
  font-size: 0.95rem;
  color: #475569;
  line-height: 1.55;
  max-width: 520px;
`;

const SplitPanel = styled(motion.div)`
  display: grid;
  gap: 1.25rem;
  align-items: stretch;

  @media (min-width: 1024px) {
    grid-template-columns: minmax(0, 1.15fr) minmax(300px, 0.92fr);
    gap: 1.5rem;
  }
`;

const LiveFeedCard = styled.div`
  background: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.06);
  border-radius: 16px;
  box-shadow:
    0 1px 2px rgba(15, 23, 42, 0.04),
    0 8px 24px rgba(15, 23, 42, 0.05);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 0;
`;

const LiveFeedHead = styled.div`
  padding: 1.15rem 1.25rem 1rem;
  border-bottom: 1px solid rgba(15, 23, 42, 0.06);
  background: linear-gradient(180deg, #fafbfc 0%, #ffffff 100%);
`;

const LiveFeedTitle = styled.h3`
  margin: 0;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.24rem;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.03em;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LiveFeedMeta = styled.div`
  margin-top: 0.35rem;
  font-size: 0.86rem;
  color: #475569;
  font-weight: 600;
`;

const FeedList = styled.div`
  flex: 1;
  min-height: 280px;
  max-height: min(72vh, 780px);
  overflow-y: auto;
  padding: 0.75rem 0.85rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
  }
`;

const SOURCE_COLORS = {
  yahoo: '#7c3aed',
  bbc: '#b91c1c',
  marketwatch: '#0369a1',
  cnbc: '#ca8a04',
  google: '#15803d',
};

const FeedRow = styled(motion.a)`
  display: block;
  padding: 0.8rem 0.95rem;
  border-radius: 12px;
  background: #f8fafc;
  border: 1px solid rgba(15, 23, 42, 0.06);
  text-decoration: none;
  color: inherit;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;

  &:hover {
    border-color: rgba(34, 197, 94, 0.28);
    background: #ffffff;
    box-shadow: 0 4px 16px rgba(15, 23, 42, 0.06);
  }
`;

const FeedRowTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.45rem;
`;

const SourcePill = styled.span`
  font-size: 0.62rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 0.22rem 0.5rem;
  border-radius: 999px;
  background: ${(p) => p.$bg || 'rgba(15,23,42,0.08)'};
  color: ${(p) => p.$fg || '#475569'};
  flex-shrink: 0;
`;

const FeedRowTitle = styled.div`
  font-size: 0.93rem;
  font-weight: 650;
  color: #1e293b;
  line-height: 1.48;
  letter-spacing: -0.015em;
`;

const FeedRowLinkHint = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  margin-top: 0.45rem;
  font-size: 0.68rem;
  font-weight: 700;
  color: #22c55e;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const InsightsColumn = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-height: 0;
  background: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.06);
  border-radius: 16px;
  padding: 1.15rem 1.2rem 1.35rem;
  box-shadow:
    0 1px 2px rgba(15, 23, 42, 0.04),
    0 8px 24px rgba(15, 23, 42, 0.05);

  @media (min-width: 1024px) {
    position: sticky;
    top: 88px;
    align-self: start;
    max-height: calc(100vh - 96px);
    overflow-y: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;

    &::-webkit-scrollbar {
      display: none;
      width: 0;
      height: 0;
    }
  }
`;

const InsightsStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
`;

const stanceMeta = {
  watch: {
    accent: '#3b82f6',
    label: 'Watch',
    Icon: FaEye,
    chipBg: 'rgba(59, 130, 246, 0.12)',
    chipColor: '#1d4ed8',
  },
  caution: {
    accent: '#ef4444',
    label: 'Caution',
    Icon: FaExclamationTriangle,
    chipBg: 'rgba(239, 68, 68, 0.12)',
    chipColor: '#b91c1c',
  },
  opportunity: {
    accent: '#22c55e',
    label: 'Opportunity',
    Icon: FaSeedling,
    chipBg: 'rgba(34, 197, 94, 0.14)',
    chipColor: '#15803d',
  },
};

const InsightCard = styled(motion.article)`
  position: relative;
  background: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.07);
  border-radius: 16px;
  padding: 1.2rem 1.25rem 1.3rem;
  box-shadow:
    0 1px 2px rgba(15, 23, 42, 0.04),
    0 10px 28px rgba(15, 23, 42, 0.05);
  border-left: 4px solid ${(p) => (stanceMeta[p.$stance] || stanceMeta.watch).accent};
  overflow: hidden;
  transition:
    transform 0.35s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.35s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow:
      0 8px 16px rgba(15, 23, 42, 0.06),
      0 20px 48px rgba(15, 23, 42, 0.08);
  }
`;

const InsightCardTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const StanceChip = styled.span`
  font-size: 0.65rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 0.28rem 0.55rem;
  border-radius: 999px;
  background: ${(p) => p.$bg};
  color: ${(p) => p.$color};
`;

const InsightIconCircle = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.05rem;
  color: ${(p) => p.$color};
  background: ${(p) => p.$bg};
  flex-shrink: 0;
`;

const InsightTitle = styled.h4`
  margin: 0 0 0.65rem;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.12rem;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.03em;
  line-height: 1.3;
`;

const InsightBody = styled.p`
  margin: 0;
  font-size: 0.93rem;
  line-height: 1.68;
  color: #475569;
  font-weight: 480;
`;

const ToolsSection = styled.section`
  padding: 1.35rem 1.15rem 1.5rem;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(15, 23, 42, 0.06);
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);

  @media (min-width: 768px) {
    padding: 1.5rem 1.35rem 1.65rem;
  }
`;

const ToolsRow = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;

  @media (min-width: 720px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const ToolCard = styled(motion(Link))`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 1.35rem 1.4rem;
  border-radius: 16px;
  text-decoration: none;
  border: 1px solid rgba(15, 23, 42, 0.07);
  background: #ffffff;
  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.05);
  position: relative;
  overflow: hidden;
  transition:
    transform 0.35s cubic-bezier(0.22, 1, 0.36, 1),
    border-color 0.25s ease,
    box-shadow 0.35s ease;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(34, 197, 94, 0.06) 0%, transparent 55%);
    opacity: 0;
    transition: opacity 0.35s ease;
  }

  &:hover {
    border-color: rgba(34, 197, 94, 0.35);
    transform: translateY(-3px);
    box-shadow: 0 12px 36px rgba(34, 197, 94, 0.14);

    &::before {
      opacity: 1;
    }
  }
`;

const ToolTitle = styled.div`
  position: relative;
  z-index: 1;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.14rem;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.03em;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 0.5rem;
`;

const ToolDesc = styled.div`
  position: relative;
  z-index: 1;
  font-size: 0.93rem;
  color: #475569;
  line-height: 1.58;
  font-weight: 480;
`;

const ToolArrow = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: rgba(34, 197, 94, 0.12);
  color: #15803d;
  flex-shrink: 0;
`;

const ErrorBanner = styled(motion.div)`
  background: linear-gradient(180deg, #fef2f2 0%, #fff 100%);
  border: 1px solid #fecaca;
  color: #991b1b;
  border-radius: 14px;
  padding: 0.9rem 1.1rem;
  font-size: 0.88rem;
  font-weight: 600;
  margin-bottom: 1.1rem;
`;

const defaultInsights = [
  {
    stance: 'watch',
    title: 'Map headlines to fundamentals',
    detail: 'When a story moves a sector, trace it to earnings drivers and balance-sheet strength before drawing conclusions.',
  },
  {
    stance: 'caution',
    title: 'Correlation breaks',
    detail: 'Assets that moved together can diverge when the narrative shifts. Stress-test your assumptions with simple what-if questions.',
  },
  {
    stance: 'opportunity',
    title: 'Learn one framework today',
    detail: 'Pick a single lens (valuation, quality, macro) and apply it to one headline. Small reps build real judgment.',
  },
];

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.06 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 380, damping: 28 },
  },
};

const heroTitle = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 30, delay: 0.05 } },
};

function getSourcePillStyle(sourceId) {
  const c = SOURCE_COLORS[sourceId] || '#64748b';
  return { bg: `${c}22`, fg: c };
}

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [brief, setBrief] = useState(null);

  const load = useCallback(async (isRefresh) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const data = await api.getDailyBrief({ refresh: !!isRefresh });
      setBrief(data);
    } catch (e) {
      setError(e.message || 'Could not load insights');
      setBrief(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load(false);
  }, [load]);

  const dayTheme = brief?.dayTheme || "Today's market lens";
  const narrative = (brief?.narrative || '').trim();
  const disclaimer = brief?.disclaimer || '';
  const insights = useMemo(() => {
    const raw = brief?.signals;
    if (Array.isArray(raw) && raw.length > 0) {
      const normalized = raw
        .filter((s) => s && (s.title || s.detail))
        .map((s) => ({
          stance: ['watch', 'caution', 'opportunity'].includes(s.stance) ? s.stance : 'watch',
          title: String(s.title || 'Insight').slice(0, 200),
          detail: String(s.detail || '').slice(0, 800),
        }));
      if (normalized.length > 0) return normalized;
    }
    return defaultInsights;
  }, [brief]);
  const headlines = brief?.headlines?.length ? brief.headlines : [];
  const generatedAt = brief?.generatedAt;

  const updatedLabel = generatedAt
    ? new Date(generatedAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
    : null;

  const positiveCount = marketIndices.filter((i) => i.changePercent >= 0).length;

  const sourceCount = useMemo(() => {
    const ids = new Set(headlines.map((h) => h.source).filter(Boolean));
    return ids.size;
  }, [headlines]);

  const narrativeBody =
    narrative ||
    (!loading && brief
      ? 'Summary not available yet. Try Refresh, or check that your server is running with an OpenAI API key configured.'
      : '');

  return (
    <Page>
      <TopBar>
        <TopBarGlow
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
        <TopBarInner>
          <TitleBlock>
            <Kicker
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45 }}
            >
              <span />
              Insights dashboard
            </Kicker>
            <PageTitle variants={heroTitle} initial="hidden" animate="show">
              Daily <span className="gradient">insights</span>
            </PageTitle>
            <PageSub
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 0.45 }}
            >
              Live headlines, AI narrative, and insight tiles—clear context for building wealth, without the noise.
            </PageSub>
          </TitleBlock>
          <TopActions>
            <RefreshBtn
              type="button"
              onClick={() => load(true)}
              disabled={loading || refreshing}
              whileTap={{ scale: 0.97 }}
            >
              <FaSyncAlt className={refreshing ? 'spin' : ''} />
              {refreshing ? 'Refreshing...' : 'Refresh data'}
            </RefreshBtn>
            {updatedLabel && <MetaPill>Updated {updatedLabel}</MetaPill>}
          </TopActions>
        </TopBarInner>
        <TickerBar>
          <TickerTrack>
            {[...marketIndices, ...marketIndices].map((idx, i) => (
              <TItem key={`${idx.name}-${i}`}>
                <TSym>{idx.name}</TSym>
                <TVal>{idx.value.toLocaleString()}</TVal>
                <TChg $pos={idx.changePercent >= 0}>
                  {idx.changePercent >= 0 ? '+' : ''}
                  {idx.changePercent}%
                </TChg>
              </TItem>
            ))}
          </TickerTrack>
        </TickerBar>
      </TopBar>

      <BrandStrip
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.06 }}
      >
        <BrandOuter>
          <BrandGrid>
            <BrandCopyCol>
              <BrandHeadline>Stop guessing. Start investing smarter.</BrandHeadline>
              <BrandSub>
                BloomVest delivers clear, no-fluff investment insights so you can grow your money with confidence—without living in the markets.
              </BrandSub>
              <BrandSupporting>
                The simple, trustworthy voice in a noisy finance world: ideas to watch, weekly context, and tools to practice. Everything here is general
                education—not personalized advice for your situation.
              </BrandSupporting>
            </BrandCopyCol>
            <BrandCtaCard>
              <BrandCTAInner>
                <BrandCTARow>
                  <BrandPrimaryBtn href={NEWSLETTER_MAILTO}>
                    <FaEnvelope aria-hidden />
                    Get weekly insights
                  </BrandPrimaryBtn>
                  <BrandSecondaryBtn href="#live-feed">
                    Today&apos;s feed
                    <FaArrowRight aria-hidden style={{ fontSize: '0.78rem' }} />
                  </BrandSecondaryBtn>
                </BrandCTARow>
                <BrandSocialProof>Join 150+ early readers on the list.</BrandSocialProof>
                <BrandDisclaimerMini>
                  BloomVest shares thematic ideas and learning content only. We do not tell you what to buy or how much to invest. Past performance does not
                  guarantee future results; all investing involves risk.
                </BrandDisclaimerMini>
              </BrandCTAInner>
            </BrandCtaCard>
          </BrandGrid>
        </BrandOuter>
      </BrandStrip>

      <Shell>
        {error && (
          <ErrorBanner initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
            {error}
          </ErrorBanner>
        )}

        <StatsRow variants={staggerContainer} initial="hidden" animate="show">
          <StatCard variants={staggerItem} whileHover={{ y: -3 }}>
            <StatIconWrap>
              <FaRegLightbulb />
            </StatIconWrap>
            <StatLabel>Focus</StatLabel>
            <StatValue>{dayTheme}</StatValue>
          </StatCard>
          <StatCard variants={staggerItem} whileHover={{ y: -3 }}>
            <StatIconWrap>
              <FaNewspaper />
            </StatIconWrap>
            <StatLabel>Stories</StatLabel>
            <StatValue>{loading && !brief ? '...' : `${headlines.length} stories`}</StatValue>
            <StatHint>Live column · multi-source RSS</StatHint>
          </StatCard>
          <StatCard variants={staggerItem} whileHover={{ y: -3 }}>
            <StatIconWrap>
              <FaChartLine />
            </StatIconWrap>
            <StatLabel>Indices (demo)</StatLabel>
            <StatValue>
              {positiveCount}/{marketIndices.length} up
            </StatValue>
            <StatHint>Sample data, not live quotes</StatHint>
          </StatCard>
        </StatsRow>

        <MainGrid>
          <Widget
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
          >
            <WidgetAccent />
            <WidgetBody>
              <WidgetHead>
                <WidgetTitleGroup>
                  <WidgetIcon>
                    <FaRobot />
                  </WidgetIcon>
                  <div>
                    <WidgetTitle>Market narrative</WidgetTitle>
                    <WidgetSubtitle>AI summary from today&apos;s headline flow</WidgetSubtitle>
                  </div>
                </WidgetTitleGroup>
                <WidgetBadge>AI</WidgetBadge>
              </WidgetHead>
              {loading && !brief ? (
                <NarrativeQuoteBox $muted>
                  <NarrativeQuoteMarkOpen $muted aria-hidden>
                    {'\u201C'}
                  </NarrativeQuoteMarkOpen>
                  <NarrativeQuoteMarkClose $muted aria-hidden>
                    {'\u201D'}
                  </NarrativeQuoteMarkClose>
                  Loading narrative and headline context...
                </NarrativeQuoteBox>
              ) : (
                <>
                  <NarrativeQuoteBox>
                    <NarrativeQuoteMarkOpen aria-hidden>{'\u201C'}</NarrativeQuoteMarkOpen>
                    <NarrativeQuoteMarkClose aria-hidden>{'\u201D'}</NarrativeQuoteMarkClose>
                    {narrativeBody}
                  </NarrativeQuoteBox>
                  {disclaimer && <Disclaimer>{disclaimer}</Disclaimer>}
                </>
              )}
            </WidgetBody>
          </Widget>

          <Widget
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30, delay: 0.06 }}
          >
            <WidgetAccent style={{ background: 'linear-gradient(90deg, #3b82f6, #22c55e)' }} />
            <WidgetBody>
              <WidgetHead>
                <WidgetTitleGroup>
                  <WidgetIcon>
                    <FaChartLine />
                  </WidgetIcon>
                  <div>
                    <WidgetTitle>Index snapshot</WidgetTitle>
                    <WidgetSubtitle>Demo benchmark levels</WidgetSubtitle>
                  </div>
                </WidgetTitleGroup>
                <WidgetBadge style={{ background: 'rgba(59, 130, 246, 0.12)', color: '#1d4ed8' }}>
                  Demo
                </WidgetBadge>
              </WidgetHead>
              {marketIndices.map((idx) => (
                <IdxRow key={idx.name}>
                  <IdxName>{idx.name}</IdxName>
                  <IdxRight>
                    <IdxVal>{idx.value.toLocaleString()}</IdxVal>
                    <IdxChg $pos={idx.changePercent >= 0}>
                      {idx.changePercent >= 0 ? '+' : ''}
                      {idx.changePercent}%
                    </IdxChg>
                  </IdxRight>
                </IdxRow>
              ))}
            </WidgetBody>
          </Widget>
        </MainGrid>

        <SplitPanel
          id="live-feed"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 34 }}
        >
          <LiveFeedCard>
            <LiveFeedHead>
              <LiveFeedTitle>
                <FaNewspaper style={{ color: '#22c55e', fontSize: '1.05rem' }} />
                Live story feed
              </LiveFeedTitle>
              <LiveFeedMeta>
                {loading && !brief
                  ? 'Loading headlines...'
                  : `${headlines.length} stories${sourceCount ? ` · ${sourceCount} sources` : ''} · scroll`}
              </LiveFeedMeta>
            </LiveFeedHead>
            {headlines.length === 0 && !loading ? (
              <div style={{ padding: '1.35rem 1.25rem', color: '#64748b', fontSize: '0.9rem', fontWeight: 600 }}>
                No headlines loaded. Try refresh — insight tiles on the right still show a baseline.
              </div>
            ) : (
              <FeedList>
                {headlines.map((h, i) => {
                  const pill = getSourcePillStyle(h.sourceId);
                  return (
                    <FeedRow
                      key={`${h.sourceId || 'x'}-${i}-${h.title.slice(0, 48)}`}
                      href={h.link || '#'}
                      target={h.link ? '_blank' : undefined}
                      rel={h.link ? 'noopener noreferrer' : undefined}
                      onClick={(e) => {
                        if (!h.link) e.preventDefault();
                      }}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: Math.min(i * 0.025, 0.45),
                        type: 'spring',
                        stiffness: 420,
                        damping: 32,
                      }}
                      whileHover={{ x: 3 }}
                    >
                      <FeedRowTop>
                        <SourcePill $bg={pill.bg} $fg={pill.fg}>
                          {h.source || 'News'}
                        </SourcePill>
                        {h.link ? (
                          <FaExternalLinkAlt style={{ fontSize: '0.65rem', color: '#94a3b8' }} aria-hidden />
                        ) : null}
                      </FeedRowTop>
                      <FeedRowTitle>{h.title}</FeedRowTitle>
                      {h.link ? (
                        <FeedRowLinkHint>
                          Open <FaExternalLinkAlt style={{ fontSize: '0.55rem' }} />
                        </FeedRowLinkHint>
                      ) : null}
                    </FeedRow>
                  );
                })}
              </FeedList>
            )}
          </LiveFeedCard>

          <InsightsColumn
            initial={{ opacity: 0, x: 14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring', stiffness: 340, damping: 32, delay: 0.08 }}
          >
            <SectionHeader style={{ marginBottom: '0.65rem' }}>
              <SectionEyebrow>Takeaways</SectionEyebrow>
              <SectionTitle style={{ fontSize: '1.3rem' }}>Insight tiles</SectionTitle>
              <SectionDesc>Lenses to stress-test what you read in the live feed.</SectionDesc>
            </SectionHeader>
            <InsightsStack>
              {insights.map((s, i) => {
                const meta = stanceMeta[s.stance] || stanceMeta.watch;
                const Icon = meta.Icon;
                return (
                  <InsightCard
                    key={`${s.title}-${i}`}
                    $stance={s.stance}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.1 + i * 0.07,
                      type: 'spring',
                      stiffness: 400,
                      damping: 32,
                    }}
                    whileHover={{ y: -3 }}
                  >
                    <InsightCardTop>
                      <InsightIconCircle $color={meta.chipColor} $bg={meta.chipBg}>
                        <Icon />
                      </InsightIconCircle>
                      <StanceChip $bg={meta.chipBg} $color={meta.chipColor}>
                        {meta.label}
                      </StanceChip>
                    </InsightCardTop>
                    <InsightTitle>{s.title}</InsightTitle>
                    <InsightBody>{s.detail}</InsightBody>
                  </InsightCard>
                );
              })}
            </InsightsStack>
          </InsightsColumn>
        </SplitPanel>

        <ToolsSection>
          <SectionHeader
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            style={{ marginBottom: '0.85rem' }}
          >
            <SectionEyebrow>Next step</SectionEyebrow>
            <SectionTitle>Tools</SectionTitle>
            <SectionDesc>Jump into practice or deep Q&amp;A.</SectionDesc>
          </SectionHeader>

          <ToolsRow
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <ToolCard to="/scenario" variants={staggerItem} whileHover={{ y: -3 }} whileTap={{ scale: 0.99 }}>
              <ToolTitle>
                Scenario builder
                <ToolArrow>
                  <FaArrowRight style={{ fontSize: '0.75rem' }} />
                </ToolArrow>
              </ToolTitle>
              <ToolDesc>Build scenarios, AI drafts, and simulator practice.</ToolDesc>
            </ToolCard>
            <ToolCard to="/ai-tutor" variants={staggerItem} whileHover={{ y: -3 }} whileTap={{ scale: 0.99 }}>
              <ToolTitle>
                AI tutor
                <ToolArrow>
                  <FaArrowRight style={{ fontSize: '0.75rem' }} />
                </ToolArrow>
              </ToolTitle>
              <ToolDesc>Dedicated chat for concepts and frameworks.</ToolDesc>
            </ToolCard>
          </ToolsRow>
        </ToolsSection>
      </Shell>
    </Page>
  );
}

export default Dashboard;
