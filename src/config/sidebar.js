import {
  FaBrain, FaNewspaper, FaMagic, FaFire, FaChartPie, FaBookOpen, FaRobot,
  FaSignal, FaBook, FaUser,
} from 'react-icons/fa';

/** Routes that render inside the app workspace shell (left sidebar). */
export const APP_PREFIXES = ['/iq', '/signals', '/glossary', '/profile'];

export function isAppRoute(pathname) {
  return APP_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

/**
 * Workspace navigation. The Intelligence section expands to its six tools,
 * which stay query-param driven (/iq?tab=X) so the Dashboard remains a single
 * component with shared state. Labels/icons mirror the old in-page tab strip.
 */
export const SIDEBAR_SECTIONS = [
  {
    label: 'Intelligence',
    to: '/iq',
    icon: FaBrain,
    match: ['/iq', '/market', '/trade-ideas', '/mentor', '/ai-tutor'],
    children: [
      { label: 'Headline Decoder',   to: '/iq',                tab: 'news',       icon: FaNewspaper },
      { label: 'Market Lab',         to: '/iq?tab=picks',      tab: 'picks',      icon: FaMagic },
      { label: 'Movers Scanner',     to: '/iq?tab=movers',     tab: 'movers',     icon: FaFire },
      { label: 'Fund Allocation',    to: '/iq?tab=allocation', tab: 'allocation', icon: FaChartPie },
      { label: 'Reflection Journal', to: '/iq?tab=journal',    tab: 'journal',    icon: FaBookOpen },
      { label: 'Copilot',            to: '/iq?tab=copilot',    tab: 'copilot',    icon: FaRobot },
    ],
  },
  { label: 'Signals',    to: '/signals',  icon: FaSignal, match: ['/signals'] },
  { label: 'AI Tutor',   to: '/glossary', icon: FaBook,   match: ['/glossary'] },
  { label: 'My Profile', to: '/profile',  icon: FaUser,   match: ['/profile'] },
];
