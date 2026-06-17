import { FaBrain, FaRobot, FaBook } from 'react-icons/fa';

/** Core product tools — supporting the guided investing journey */
export const PLATFORM_LAYERS = [
  {
    id: 'mentor',
    name: 'AI Mentor',
    tagline: 'Ask anything',
    path: '/mentor',
    icon: FaRobot,
    color: '#059669',
    bg: 'rgba(16,185,129,0.12)',
    description:
      'Your always-on tutor for concepts, macro, and portfolio thinking — plain English, on demand.',
    features: ['Explain any concept simply', 'Macro & market context', 'Habit and mindset coaching'],
  },
  {
    id: 'iq',
    name: 'BloomVest Intelligence',
    tagline: 'Learn markets with AI',
    path: '/iq',
    icon: FaBrain,
    color: '#7c3aed',
    bg: 'rgba(124,58,237,0.1)',
    description:
      'Decode headlines, study case studies, and ask Copilot anything — built for learning, not stock picks.',
    features: ['Headline Decoder', 'Market Lab', 'Copilot AI tutor'],
  },
];

export const NAV_ITEMS = [
  { to: '/iq',       label: 'Intelligence', match: ['/iq', '/market', '/trade-ideas', '/mentor', '/ai-tutor'] },
  { to: '/signals',  label: 'Signals',      match: ['/signals'] },
  { to: '/glossary', label: 'AI Tutor',      match: ['/glossary'] },
  { to: '/profile',  label: 'My Profile',    match: ['/profile'] },
];

export const PRODUCT_TAGLINE = 'Guided investing education — beginner to advanced';

export const PRODUCT_MISSION =
  'We guide people through investing — from first principles to advanced markets.';

export const COMPANY_VALUE =
  'BloomVest is an education company. We build financial confidence through structured guidance, not stock picks.';

export const JOURNEY_STAGES = [
  {
    stage: 'Beginner',
    title: 'Build your foundation',
    description:
      'Understand money, saving, risk, and why markets exist. Learn the vocabulary before the volatility.',
    topics: ['Personal finance basics', 'How markets work', 'Risk & reward', 'Building habits'],
  },
  {
    stage: 'Intermediate',
    title: 'Invest with clarity',
    description:
      'Move from theory to practice — stocks, funds, diversification, and reading what companies actually report.',
    topics: ['Stocks & ETFs', 'Portfolio construction', 'Earnings & filings', 'Macro literacy'],
  },
  {
    stage: 'Advanced',
    title: 'Navigate complex markets',
    description:
      'Options, sector rotation, global macro, and behavioural discipline — for investors who want depth.',
    topics: ['Options & derivatives', 'Sector analysis', 'Global markets', 'Behavioural finance'],
  },
];

export const GUIDANCE_PILLARS = [
  { title: 'Structured path', desc: 'A clear progression from basics to advanced — no random YouTube rabbit holes.' },
  { title: 'Plain English', desc: 'Every concept explained without jargon, hype, or hidden sales pitches.' },
  { title: 'Real-world context', desc: 'Live headlines and case studies so you learn how markets actually behave.' },
  { title: 'Education only', desc: 'We teach how to think — never what to buy or sell. Not financial advice.' },
];

export const AUDIENCES = [
  'Students',
  'Young professionals',
  'Founders',
  'Freelancers',
  'First-time investors',
  'Career changers',
];
