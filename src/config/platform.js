import { FaGraduationCap, FaBrain, FaRobot } from 'react-icons/fa';

/** Product layers — Academy includes courses + practice simulations */
export const PLATFORM_LAYERS = [
  {
    id: 'academy',
    layer: 1,
    name: 'Bloomvest Academy',
    tagline: 'Learn & practice',
    path: '/academy',
    icon: FaGraduationCap,
    color: '#15803d',
    bg: 'rgba(34,197,94,0.1)',
    description:
      'Courses, quizzes, and virtual-money scenarios in one place — Duolingo meets investing.',
    features: [
      'AI-guided lessons & quizzes',
      'Practice simulations with a tutor',
      'Custom scenario builder',
    ],
  },
  {
    id: 'iq',
    layer: 2,
    name: 'Bloomvest IQ',
    tagline: 'Understand',
    path: '/iq',
    icon: FaBrain,
    color: '#7c3aed',
    bg: 'rgba(124,58,237,0.1)',
    description:
      'Plain-English market literacy — headline decoder, case studies, and document workshops.',
    features: [
      'Headline Decoder from live news',
      'Market Lab case studies',
      'Document workshop & reflection journal',
    ],
  },
  {
    id: 'mentor',
    layer: 3,
    name: 'AI Mentor',
    tagline: 'Ask',
    path: '/mentor',
    icon: FaRobot,
    color: '#059669',
    bg: 'rgba(16,185,129,0.12)',
    description:
      'An always-on tutor for concepts and practice debriefs — educational only, never buy/sell advice.',
    features: [
      '"Explain options simply"',
      'Macro & portfolio thinking',
      'Links back to Academy lessons',
    ],
  },
];

export const AUDIENCES = [
  'Students',
  'Young professionals',
  'Founders',
  'Freelancers',
  'Creators',
  'Aspiring investors',
];

export const NAV_ITEMS = [
  { to: '/academy', label: 'Academy', match: ['/academy', '/learn', '/paper-wealth', '/scenario'] },
  { to: '/iq', label: 'IQ', match: ['/iq', '/signals', '/market', '/trade-ideas'] },
  { to: '/mentor', label: 'Mentor', match: ['/mentor', '/ai-tutor'] },
];

export const PRODUCT_TAGLINE =
  'AI-Powered Wealth Learning & Market Intelligence Platform';

export const PRODUCT_MISSION =
  'The operating system for financially ambitious people.';
