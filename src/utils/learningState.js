const KEYS = {
  path: 'bloomvest_learning_path_v1',
  continue: 'bloomvest_continue_v1',
  streak: 'bloomvest_streak_v1',
  onboarding: 'bloomvest_onboarding_done_v1',
  iqDecoded: 'bloomvest_iq_decoded_count_v1',
  mentorCtx: 'bloomvest_mentor_context_v1',
  notes: 'bv_notes_v2',
};

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* private mode */
  }
}

export function needsOnboarding() {
  try {
    return localStorage.getItem(KEYS.onboarding) !== '1';
  } catch {
    return true;
  }
}

export function completeOnboarding(pathId) {
  try {
    localStorage.setItem(KEYS.onboarding, '1');
    if (pathId) localStorage.setItem(KEYS.path, pathId);
  } catch {
    /* ignore */
  }
}

export function getLearningPathId() {
  try {
    return localStorage.getItem(KEYS.path) || 'aspiring-investor';
  } catch {
    return 'aspiring-investor';
  }
}

export function setLearningPathId(pathId) {
  try {
    localStorage.setItem(KEYS.path, pathId);
  } catch {
    /* ignore */
  }
}

export function getContinueLearning() {
  return read(KEYS.continue, null);
}

export function setContinueLearning(entry) {
  write(KEYS.continue, { ...entry, updatedAt: new Date().toISOString() });
}

export function clearContinueIfLesson(lessonId) {
  const c = getContinueLearning();
  if (c?.type === 'lesson' && c.lessonId === lessonId) {
    try {
      localStorage.removeItem(KEYS.continue);
    } catch {
      /* ignore */
    }
  }
}

export function recordLearningActivity(kind) {
  const today = new Date().toISOString().slice(0, 10);
  const streak = read(KEYS.streak, { lastDay: null, count: 0, days: [] });
  let { lastDay, count, days } = streak;
  if (lastDay === today) {
    if (!days.includes(today)) days = [...days, today];
    write(KEYS.streak, { lastDay, count, days, lastKind: kind });
    return { lastDay, count, days };
  }
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yStr = yesterday.toISOString().slice(0, 10);
  if (lastDay === yStr) {
    count += 1;
  } else {
    count = 1;
  }
  days = [...new Set([...days, today])].slice(-30);
  write(KEYS.streak, { lastDay: today, count, days, lastKind: kind });
  return { lastDay: today, count, days };
}

export function getStreak() {
  return read(KEYS.streak, { lastDay: null, count: 0, days: [] });
}

export function incrementHeadlinesDecoded() {
  try {
    const n = parseInt(localStorage.getItem(KEYS.iqDecoded) || '0', 10) + 1;
    localStorage.setItem(KEYS.iqDecoded, String(n));
    recordLearningActivity('headline');
    return n;
  } catch {
    return 0;
  }
}

export function getHeadlinesDecodedCount() {
  try {
    return parseInt(localStorage.getItem(KEYS.iqDecoded) || '0', 10);
  } catch {
    return 0;
  }
}

export function addJournalNote({ title, text, tag = 'learning' }) {
  const notes = read(KEYS.notes, []);
  const note = {
    id: Date.now(),
    title: title || 'Learning note',
    text: text || '',
    tag,
    date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
  };
  write(KEYS.notes, [note, ...notes]);
  recordLearningActivity('journal');
  return note;
}

export function setMentorContext(ctx) {
  write(KEYS.mentorCtx, { ...ctx, at: new Date().toISOString() });
}

export function getMentorContext() {
  return read(KEYS.mentorCtx, null);
}

export function buildMentorContextPayload({ user, progress, pathProgress }) {
  const ctx = getMentorContext();
  const streak = getStreak();
  const cont = getContinueLearning();
  const lines = [];
  if (ctx?.source) lines.push(`Current focus: ${ctx.source}`);
  if (ctx?.headline) lines.push(`Recent headline: ${ctx.headline}`);
  if (ctx?.lessonTitle) lines.push(`Recent lesson: ${ctx.lessonTitle}`);
  if (ctx?.scenarioTitle) lines.push(`Recent scenario: ${ctx.scenarioTitle}`);
  if (cont?.label) lines.push(`Continue suggestion: ${cont.label}`);
  if (pathProgress?.path?.label) {
    lines.push(`Learning path: ${pathProgress.path.label} (${pathProgress.completedCount}/${pathProgress.total} steps)`);
  }
  if (progress?.completedLessons != null) {
    lines.push(`Lessons completed: ${progress.completedLessons}/${progress.totalLessons || '?'}`);
  }
  if (streak.count) lines.push(`Learning streak: ${streak.count} day(s)`);
  if (user?.email) lines.push(`Signed in as: ${user.email}`);
  return lines.length ? lines.join('\n') : null;
}
