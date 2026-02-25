const express = require('express');
const { pool, getOrCreateUser } = require('../db');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { sessionId } = req.query;

    const coursesResult = await pool.query(
      'SELECT id, title, description, level, icon, color FROM courses ORDER BY sort_order'
    );
    const courses = coursesResult.rows;

    if (courses.length === 0) {
      return res.json({ courses: [] });
    }

    const courseIds = courses.map(c => c.id);

    const modulesResult = await pool.query(
      'SELECT id, course_id, title, description FROM modules WHERE course_id = ANY($1) ORDER BY sort_order',
      [courseIds]
    );

    const moduleIds = modulesResult.rows.map(m => m.id);

    let lessonsResult = { rows: [] };
    if (moduleIds.length > 0) {
      lessonsResult = await pool.query(
        'SELECT id, module_id, title, duration, icon FROM lessons WHERE module_id = ANY($1) ORDER BY sort_order',
        [moduleIds]
      );
    }

    let completedSet = new Set();
    if (sessionId) {
      try {
        const user = await getOrCreateUser(sessionId);
        const progressResult = await pool.query(
          'SELECT lesson_id FROM lesson_progress WHERE user_id = $1 AND completed = true',
          [user.id]
        );
        completedSet = new Set(progressResult.rows.map(r => r.lesson_id));
      } catch (err) {
        console.error('Error fetching user progress:', err);
      }
    }

    const lessonsByModule = {};
    for (const lesson of lessonsResult.rows) {
      if (!lessonsByModule[lesson.module_id]) {
        lessonsByModule[lesson.module_id] = [];
      }
      lessonsByModule[lesson.module_id].push({
        id: lesson.id,
        title: lesson.title,
        duration: lesson.duration,
        icon: lesson.icon,
        completed: completedSet.has(lesson.id),
      });
    }

    const modulesByCourse = {};
    for (const mod of modulesResult.rows) {
      if (!modulesByCourse[mod.course_id]) {
        modulesByCourse[mod.course_id] = [];
      }
      modulesByCourse[mod.course_id].push({
        id: mod.id,
        title: mod.title,
        description: mod.description,
        lessons: lessonsByModule[mod.id] || [],
      });
    }

    const result = courses.map(course => {
      const modules = modulesByCourse[course.id] || [];
      const allLessons = modules.flatMap(m => m.lessons);
      return {
        id: course.id,
        title: course.title,
        description: course.description,
        level: course.level,
        icon: course.icon,
        color: course.color,
        totalLessons: allLessons.length,
        completedLessons: allLessons.filter(l => l.completed).length,
        modules,
      };
    });

    res.json({ courses: result });
  } catch (err) {
    console.error('Get courses error:', err);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

router.get('/progress', async (req, res) => {
  try {
    const { sessionId } = req.query;
    if (!sessionId) return res.status(400).json({ error: 'sessionId required' });

    const user = await getOrCreateUser(sessionId);

    const totalResult = await pool.query('SELECT COUNT(*) AS count FROM lessons');
    const totalLessons = parseInt(totalResult.rows[0].count, 10);

    const completedResult = await pool.query(
      'SELECT lesson_id FROM lesson_progress WHERE user_id = $1 AND completed = true',
      [user.id]
    );
    const completedIds = completedResult.rows.map(r => r.lesson_id);

    const courseProgressResult = await pool.query(
      `SELECT c.id AS course_id,
              COUNT(l.id) AS total,
              COUNT(lp.lesson_id) AS completed
       FROM courses c
       LEFT JOIN modules m ON m.course_id = c.id
       LEFT JOIN lessons l ON l.module_id = m.id
       LEFT JOIN lesson_progress lp ON lp.lesson_id = l.id AND lp.user_id = $1 AND lp.completed = true
       GROUP BY c.id
       ORDER BY c.sort_order`,
      [user.id]
    );

    res.json({
      totalLessons,
      completedLessons: completedIds.length,
      completedIds,
      courseProgress: courseProgressResult.rows.map(r => ({
        courseId: r.course_id,
        total: parseInt(r.total, 10),
        completed: parseInt(r.completed, 10),
      })),
    });
  } catch (err) {
    console.error('Get course progress error:', err);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

router.get('/lessons/:lessonId', async (req, res) => {
  try {
    const { lessonId } = req.params;
    const { sessionId } = req.query;

    const lessonResult = await pool.query(
      `SELECT l.id, l.title, l.description, l.duration, l.icon,
              l.content, l.key_takeaways, l.quiz,
              m.title AS module_title, m.course_id,
              c.title AS course_title
       FROM lessons l
       JOIN modules m ON m.id = l.module_id
       JOIN courses c ON c.id = m.course_id
       WHERE l.id = $1`,
      [lessonId]
    );

    if (lessonResult.rows.length === 0) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    const lesson = lessonResult.rows[0];

    const allLessonsResult = await pool.query(
      `SELECT l.id
       FROM lessons l
       JOIN modules m ON m.id = l.module_id
       WHERE m.course_id = $1
       ORDER BY m.sort_order, l.sort_order`,
      [lesson.course_id]
    );

    const allLessonIds = allLessonsResult.rows.map(r => r.id);
    const currentIndex = allLessonIds.indexOf(lesson.id);
    const prevLessonId = currentIndex > 0 ? allLessonIds[currentIndex - 1] : null;
    const nextLessonId = currentIndex < allLessonIds.length - 1 ? allLessonIds[currentIndex + 1] : null;

    let completed = false;
    let quizScore = null;
    if (sessionId) {
      try {
        const user = await getOrCreateUser(sessionId);
        const progressResult = await pool.query(
          'SELECT completed, quiz_score FROM lesson_progress WHERE user_id = $1 AND lesson_id = $2',
          [user.id, lessonId]
        );
        if (progressResult.rows.length > 0) {
          completed = progressResult.rows[0].completed;
          quizScore = progressResult.rows[0].quiz_score;
        }
      } catch (err) {
        console.error('Error fetching lesson progress:', err);
      }
    }

    res.json({
      lesson: {
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        duration: lesson.duration,
        icon: lesson.icon,
        content: lesson.content,
        keyTakeaways: lesson.key_takeaways,
        quiz: lesson.quiz,
        completed,
        quizScore,
        courseTitle: lesson.course_title,
        moduleTitle: lesson.module_title,
        nextLessonId,
        prevLessonId,
      },
    });
  } catch (err) {
    console.error('Get lesson error:', err);
    res.status(500).json({ error: 'Failed to fetch lesson' });
  }
});

router.post('/lessons/:lessonId/complete', async (req, res) => {
  try {
    const { lessonId } = req.params;
    const { sessionId, quizScore } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: 'sessionId required' });
    }

    const user = await getOrCreateUser(sessionId);

    await pool.query(
      `INSERT INTO lesson_progress (user_id, lesson_id, completed, quiz_score)
       VALUES ($1, $2, true, $3)
       ON CONFLICT (user_id, lesson_id)
       DO UPDATE SET completed = true, quiz_score = $3, completed_at = NOW()`,
      [user.id, lessonId, quizScore || 0]
    );

    const completedResult = await pool.query(
      'SELECT lesson_id FROM lesson_progress WHERE user_id = $1 AND completed = true',
      [user.id]
    );

    res.json({
      success: true,
      completedLessons: completedResult.rows.map(r => r.lesson_id),
    });
  } catch (err) {
    console.error('Complete lesson error:', err);
    res.status(500).json({ error: 'Failed to complete lesson' });
  }
});

router.get('/:courseId', async (req, res) => {
  try {
    const { courseId } = req.params;

    const courseResult = await pool.query(
      'SELECT id, title, description, level, icon, color FROM courses WHERE id = $1',
      [courseId]
    );

    if (courseResult.rows.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const course = courseResult.rows[0];

    const modulesResult = await pool.query(
      'SELECT id, title, description FROM modules WHERE course_id = $1 ORDER BY sort_order',
      [courseId]
    );

    const moduleIds = modulesResult.rows.map(m => m.id);
    let lessonsResult = { rows: [] };
    if (moduleIds.length > 0) {
      lessonsResult = await pool.query(
        'SELECT id, module_id, title, description, duration, icon FROM lessons WHERE module_id = ANY($1) ORDER BY sort_order',
        [moduleIds]
      );
    }

    const lessonsByModule = {};
    for (const lesson of lessonsResult.rows) {
      if (!lessonsByModule[lesson.module_id]) {
        lessonsByModule[lesson.module_id] = [];
      }
      lessonsByModule[lesson.module_id].push({
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        duration: lesson.duration,
        icon: lesson.icon,
      });
    }

    const modules = modulesResult.rows.map(mod => ({
      id: mod.id,
      title: mod.title,
      description: mod.description,
      lessons: lessonsByModule[mod.id] || [],
    }));

    res.json({
      course: {
        id: course.id,
        title: course.title,
        description: course.description,
        level: course.level,
        icon: course.icon,
        color: course.color,
        modules,
      },
    });
  } catch (err) {
    console.error('Get course error:', err);
    res.status(500).json({ error: 'Failed to fetch course' });
  }
});

module.exports = router;
