/** Learning paths — course matching uses title substrings (stable across DB reseeds) */

export const GUEST_SCENARIO_IDS = ['first-investment'];

export const LEARNING_PATHS = [
  {
    id: 'student',
    label: 'Student',
    emoji: '🎓',
    description: 'Build money basics, then practice with virtual cash.',
    steps: [
      { type: 'course', courseMatch: 'Personal Finance', stepLabel: 'Personal finance foundations' },
      { type: 'course', courseMatch: 'Investing Fundamentals', stepLabel: 'Why investing matters' },
      { type: 'scenario', scenarioId: 'first-investment', stepLabel: 'Your first $10k practice portfolio' },
      { type: 'iq', stepLabel: 'Decode 3 headlines in Bloomvest IQ' },
    ],
  },
  {
    id: 'young-professional',
    label: 'Young professional',
    emoji: '💼',
    description: 'From payday habits to diversified practice.',
    steps: [
      { type: 'course', courseMatch: 'Personal Finance', stepLabel: 'Budget & emergency fund' },
      { type: 'course', courseMatch: 'ETFs & Index', stepLabel: 'Index investing basics' },
      { type: 'scenario', scenarioId: 'first-investment', stepLabel: 'Build a starter portfolio' },
      { type: 'scenario', scenarioId: 'market-crash', stepLabel: 'Practice staying calm in a crash' },
    ],
  },
  {
    id: 'founder',
    label: 'Founder',
    emoji: '🚀',
    description: 'Cash flow, growth, and macro literacy.',
    steps: [
      { type: 'course', courseMatch: 'Personal Finance', stepLabel: 'Cash flow vs profit' },
      { type: 'course', courseMatch: 'Advanced Investment', stepLabel: 'Growth & valuation lens' },
      { type: 'scenario', scenarioId: 'tech-growth', stepLabel: 'Tech growth scenario' },
      { type: 'iq', stepLabel: 'Decode news that moves your sector' },
    ],
  },
  {
    id: 'aspiring-investor',
    label: 'Aspiring investor',
    emoji: '📈',
    description: 'Core markets skills + guided simulations.',
    steps: [
      { type: 'course', courseMatch: 'Investing Fundamentals', stepLabel: 'Investing fundamentals' },
      { type: 'course', courseMatch: 'Stock Market', stepLabel: 'How stocks work' },
      { type: 'scenario', scenarioId: 'first-investment', stepLabel: 'First portfolio sim' },
      { type: 'scenario', scenarioId: 'dividend-income', stepLabel: 'Dividend income sim' },
    ],
  },
];

/** Map headline text → learning resources */
export const HEADLINE_TOPIC_MAP = [
  {
    id: 'rates',
    keywords: [/interest rate|fed |federal reserve|cpi|inflation|treasury yield|rate hike|rate cut/i],
    label: 'Inflation & interest rates',
    courseMatch: 'Personal Finance',
    scenarioId: 'market-crash',
    quizQuestion: 'Why do rising rates often hurt high-growth stocks?',
  },
  {
    id: 'earnings',
    keywords: [/earnings|revenue|profit|guidance|quarterly results|eps|beat estimates|miss estimates/i],
    label: 'Earnings & company results',
    courseMatch: 'Stock Market',
    scenarioId: 'first-investment',
    quizQuestion: 'What is the difference between revenue and profit?',
  },
  {
    id: 'tech',
    keywords: [/nvidia|ai |artificial intelligence|semiconductor|tech stock|nasdaq|mega-cap/i],
    label: 'Technology & AI',
    courseMatch: 'Stock Market',
    scenarioId: 'tech-growth',
    quizQuestion: 'Why can great companies still be risky investments?',
  },
  {
    id: 'crypto',
    keywords: [/bitcoin|crypto|ethereum|blockchain|digital asset/i],
    label: 'Crypto basics',
    courseMatch: 'Crypto',
    scenarioId: 'crypto-venture',
    quizQuestion: 'Why is crypto often more volatile than large-cap stocks?',
  },
  {
    id: 'dividend',
    keywords: [/dividend|yield|income investor|payout/i],
    label: 'Dividends & income',
    courseMatch: 'ETFs & Index',
    scenarioId: 'dividend-income',
    quizQuestion: 'What does dividend yield tell you — and what does it not tell you?',
  },
];

export const LESSON_SCENARIO_MAP = [
  { courseMatch: 'Investing Fundamentals', scenarioId: 'first-investment' },
  { courseMatch: 'Personal Finance', scenarioId: 'first-investment' },
  { courseMatch: 'Stock Market', scenarioId: 'tech-growth' },
  { courseMatch: 'ETFs & Index', scenarioId: 'dividend-income' },
  { courseMatch: 'Advanced Investment', scenarioId: 'market-crash' },
  { courseMatch: 'Crypto', scenarioId: 'crypto-venture' },
  { courseMatch: 'Behavioral Finance', scenarioId: 'market-crash' },
];

export function findCourseByMatch(courses, courseMatch) {
  if (!courses?.length || !courseMatch) return null;
  const m = courseMatch.toLowerCase();
  return courses.find((c) => (c.title || '').toLowerCase().includes(m)) || null;
}

export function findNextLessonInCourse(course, completedIds = []) {
  if (!course?.modules) return null;
  const done = new Set(completedIds);
  for (const mod of course.modules) {
    for (const lesson of mod.lessons || []) {
      if (!done.has(lesson.id)) return { lesson, course };
    }
  }
  const first = course.modules[0]?.lessons?.[0];
  return first ? { lesson: first, course } : null;
}

export function resolvePathStep(step, courses, completedIds = [], iqHeadlinesDecoded = 0) {
  if (step.type === 'course') {
    const course = findCourseByMatch(courses, step.courseMatch);
    if (!course) return { done: false, href: '/academy', label: step.stepLabel, detail: 'Course loading…' };
    const next = findNextLessonInCourse(course, completedIds);
    const allDone = (course.modules || []).every((m) =>
      (m.lessons || []).every((l) => completedIds.includes(l.id))
    );
    if (allDone) return { done: true, href: '/academy', label: step.stepLabel, detail: 'Course track complete' };
    if (next) {
      return {
        done: false,
        href: '/academy',
        label: step.stepLabel,
        detail: next.lesson.title,
        lessonId: next.lesson.id,
        courseTitle: course.title,
        action: 'openLesson',
      };
    }
    return { done: false, href: '/academy', label: step.stepLabel };
  }
  if (step.type === 'scenario') {
    return {
      done: false,
      href: `/academy?tab=scenarios&scenario=${step.scenarioId}`,
      label: step.stepLabel,
      scenarioId: step.scenarioId,
      action: 'startScenario',
    };
  }
  if (step.type === 'iq') {
    const done = iqHeadlinesDecoded >= 3;
    return {
      done,
      href: '/iq?tab=news',
      label: step.stepLabel,
      detail: done ? '3+ headlines decoded' : `${iqHeadlinesDecoded}/3 decoded`,
    };
  }
  return { href: '/academy', label: step.stepLabel };
}

export function getPathProgress(pathId, courses, completedIds, iqHeadlinesDecoded = 0) {
  const path = LEARNING_PATHS.find((p) => p.id === pathId);
  if (!path) return null;
  const steps = path.steps.map((step) => {
    const resolved = resolvePathStep(step, courses, completedIds, iqHeadlinesDecoded);
    let done = resolved.done;
    if (step.type === 'course') {
      const course = findCourseByMatch(courses, step.courseMatch);
      if (course) {
        const lessons = (course.modules || []).flatMap((m) => m.lessons || []);
        done = lessons.length > 0 && lessons.every((l) => completedIds.includes(l.id));
      }
    }
    if (step.type === 'scenario') done = false;
    if (step.type === 'iq') done = iqHeadlinesDecoded >= 3;
    return { ...step, ...resolved, done };
  });
  const completedCount = steps.filter((s) => s.done).length;
  return {
    path,
    steps,
    completedCount,
    total: steps.length,
    percent: steps.length ? Math.round((completedCount / steps.length) * 100) : 0,
  };
}

export function matchHeadlineTopic(title) {
  const t = String(title || '');
  for (const topic of HEADLINE_TOPIC_MAP) {
    if (topic.keywords.some((re) => re.test(t))) return topic;
  }
  return {
    id: 'general',
    label: 'Markets today',
    courseMatch: 'Investing Fundamentals',
    scenarioId: 'first-investment',
    quizQuestion: 'What is one question you should ask before acting on this headline?',
  };
}

export function getScenarioForLesson(courseTitle) {
  const m = LESSON_SCENARIO_MAP.find((x) =>
    (courseTitle || '').toLowerCase().includes(x.courseMatch.toLowerCase())
  );
  return m?.scenarioId || 'first-investment';
}

export function getScenarioForCourseTitle(courseTitle) {
  return getScenarioForLesson(courseTitle);
}
