/** Server-side learning label normalization (mirrors src/utils/learningLabels.js) */

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

function toStudyLevel(value) {
  if (!value) return 'Discuss';
  const v = String(value).trim();
  if (LEGACY_TO_STUDY[v] === undefined && ['Deep Dive', 'Study', 'Discuss', 'Caution', 'Skip'].includes(v)) {
    return v;
  }
  return LEGACY_TO_STUDY[v] || 'Discuss';
}

function toDocStance(value) {
  const map = {
    Buy: 'Worth studying',
    Hold: 'Needs more research',
    Sell: 'High complexity — caution',
    Watch: 'Monitor & learn',
  };
  if (!value) return 'Needs more research';
  const v = String(value).trim();
  if (['Worth studying', 'Needs more research', 'High complexity — caution', 'Monitor & learn'].includes(v)) {
    return v;
  }
  return map[v] || 'Needs more research';
}

function normalizePick(p) {
  const studyLevel = toStudyLevel(p.studyLevel || p.action);
  return {
    ...p,
    studyLevel,
    action: studyLevel,
    researchFocus: String(p.researchFocus || p.entrySignal || '').slice(0, 280),
    learnerQuestion: String(p.learnerQuestion || '').slice(0, 200),
    entrySignal: String(p.researchFocus || p.entrySignal || '').slice(0, 280),
  };
}

module.exports = { toStudyLevel, toDocStance, normalizePick };
