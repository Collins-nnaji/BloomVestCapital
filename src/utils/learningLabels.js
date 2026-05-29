/** Maps legacy buy/sell language to BloomVest learning labels */

const LEGACY_TO_STUDY = {
  'Strong Buy': 'Deep Dive',
  Buy: 'Study',
  Watch: 'Discuss',
  Hold: 'Discuss',
  Reduce: 'Caution',
  Avoid: 'Skip',
  Sell: 'Skip',
  'Strong Sell': 'Skip',
};

const STUDY_STYLES = {
  'Deep Dive': { color: '#065f46', bg: 'rgba(16,185,129,0.12)', barColor: '#10b981', barPct: 100 },
  Study: { color: '#166534', bg: 'rgba(34,197,94,0.1)', barColor: '#22c55e', barPct: 75 },
  Discuss: { color: '#92400e', bg: 'rgba(245,158,11,0.1)', barColor: '#f59e0b', barPct: 50 },
  Caution: { color: '#9a3412', bg: 'rgba(249,115,22,0.1)', barColor: '#f97316', barPct: 25 },
  Skip: { color: '#7f1d1d', bg: 'rgba(220,38,38,0.1)', barColor: '#ef4444', barPct: 0 },
};

const DOC_LEGACY = {
  Buy: 'Worth studying',
  Hold: 'Needs more research',
  Sell: 'High complexity — caution',
  Watch: 'Monitor & learn',
};

const DOC_STYLES = {
  'Worth studying': { color: '#15803d', bg: '#f0fdf4', border: '#bbf7d0' },
  'Needs more research': { color: '#b45309', bg: '#fefce8', border: '#fde68a' },
  'High complexity — caution': { color: '#dc2626', bg: '#fef2f2', border: '#fecaca' },
  'Monitor & learn': { color: '#0f766e', bg: '#f0fdfa', border: '#99f6e4' },
};

export function toStudyLevel(value) {
  if (!value) return 'Discuss';
  const v = String(value).trim();
  if (Object.prototype.hasOwnProperty.call(STUDY_STYLES, v)) return v;
  return LEGACY_TO_STUDY[v] || 'Discuss';
}

export function studyLevelStyle(level) {
  return STUDY_STYLES[toStudyLevel(level)] || STUDY_STYLES.Discuss;
}

export function isDeepDiveLevel(level) {
  const s = toStudyLevel(level);
  return s === 'Deep Dive' || s === 'Study';
}

export function isCautionLevel(level) {
  const s = toStudyLevel(level);
  return s === 'Caution' || s === 'Skip';
}

export function toDocLearningStance(stance) {
  if (!stance) return 'Needs more research';
  const v = String(stance).trim();
  if (Object.prototype.hasOwnProperty.call(DOC_STYLES, v)) return v;
  return DOC_LEGACY[v] || 'Needs more research';
}

export function docStanceStyle(stance) {
  const label = toDocLearningStance(stance);
  return { label, ...DOC_STYLES[label] };
}

export function normalizePick(pick) {
  if (!pick || typeof pick !== 'object') return pick;
  const studyLevel = toStudyLevel(pick.studyLevel || pick.action);
  return {
    ...pick,
    studyLevel,
    action: studyLevel,
    researchFocus: pick.researchFocus || pick.entrySignal || '',
    learnerQuestion: pick.learnerQuestion || '',
  };
}

export const EDUCATION_DISCLAIMER =
  'Educational market commentary only — not personalized investment advice.';
