import { lessons } from '../data/lessons';

const COURSE_BLUEPRINT = [
  {
    id: 1,
    level: 'beginner',
    title: 'Investing Fundamentals',
    description: 'Build a strong base in investing principles, portfolio setup, and long-term mindset.',
    icon: '📚',
    color: '#22c55e',
  },
  {
    id: 2,
    level: 'intermediate',
    title: 'Intermediate Concepts',
    description: 'Advance into market analysis, ETFs, risk frameworks, and financial statement interpretation.',
    icon: '📊',
    color: '#3b82f6',
  },
  {
    id: 3,
    level: 'advanced',
    title: 'Advanced Strategies',
    description: 'Master factor strategies, behavioral finance, and decision systems for complex markets.',
    icon: '🎓',
    color: '#16a34a',
  },
];

function parseDurationToMinutes(duration) {
  const match = String(duration || '').match(/(\d+)/);
  return match ? Number(match[1]) : 10;
}

function splitIntoModules(courseId, levelLessons) {
  if (levelLessons.length <= 2) {
    return [
      {
        id: Number(`${courseId}1`),
        title: 'Core Lessons',
        description: 'Start with the core ideas and practical examples.',
        lessons: levelLessons,
      },
    ];
  }

  const midpoint = Math.ceil(levelLessons.length / 2);
  return [
    {
      id: Number(`${courseId}1`),
      title: 'Foundations',
      description: 'Core theory, principles, and frameworks.',
      lessons: levelLessons.slice(0, midpoint),
    },
    {
      id: Number(`${courseId}2`),
      title: 'Applied Strategy',
      description: 'Hands-on decision-making and advanced scenarios.',
      lessons: levelLessons.slice(midpoint),
    },
  ];
}

export function buildStaticCourses(completedIds = []) {
  const completedSet = new Set(completedIds);
  return COURSE_BLUEPRINT.map((course) => {
    const levelLessons = lessons.filter((lesson) => lesson.level === course.level);
    const modules = splitIntoModules(course.id, levelLessons).map((module) => ({
      ...module,
      lessons: module.lessons.map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        duration: lesson.duration,
        icon: lesson.icon,
        completed: completedSet.has(lesson.id),
      })),
    }));

    const flattened = modules.flatMap((module) => module.lessons);
    const totalLessons = flattened.length;
    const completedLessons = flattened.filter((lesson) => lesson.completed).length;
    const estimatedMinutes = flattened.reduce((sum, lesson) => sum + parseDurationToMinutes(lesson.duration), 0);

    return {
      ...course,
      modules,
      totalLessons,
      completedLessons,
      estimatedMinutes,
      is_pro: false,
    };
  });
}

export function getStaticCourseById(courseId, completedIds = []) {
  return buildStaticCourses(completedIds).find((course) => String(course.id) === String(courseId)) || null;
}

export function getStaticLessonById(courseId, lessonId, completedIds = []) {
  const course = getStaticCourseById(courseId, completedIds);
  if (!course) return null;

  const flatLessons = course.modules.flatMap((module) =>
    module.lessons.map((lesson) => ({ ...lesson, moduleId: module.id, moduleTitle: module.title }))
  );
  const index = flatLessons.findIndex((lesson) => String(lesson.id) === String(lessonId));
  if (index === -1) return null;

  const raw = lessons.find((lesson) => String(lesson.id) === String(lessonId));
  if (!raw) return null;

  return {
    id: raw.id,
    title: raw.title,
    description: raw.description,
    duration: raw.duration,
    icon: raw.icon,
    content: raw.content,
    keyTakeaways: raw.keyTakeaways || raw.key_takeaways || [],
    quiz: raw.quiz || [],
    completed: completedIds.includes(raw.id),
    quizScore: null,
    courseId: course.id,
    courseTitle: course.title,
    moduleTitle: flatLessons[index].moduleTitle,
    moduleId: flatLessons[index].moduleId,
    prevLessonId: index > 0 ? flatLessons[index - 1].id : null,
    nextLessonId: index < flatLessons.length - 1 ? flatLessons[index + 1].id : null,
  };
}

export { parseDurationToMinutes };
