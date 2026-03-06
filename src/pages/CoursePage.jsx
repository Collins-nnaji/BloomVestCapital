import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, AreaChart, Area, CartesianGrid } from 'recharts';
import { FaArrowLeft, FaBookOpen, FaCheckCircle, FaClock, FaChevronDown, FaChevronRight, FaLock, FaPlay } from 'react-icons/fa';
import { api } from '../api';
import { useAuth } from '../AuthContext';
import { getStaticCourseById, parseDurationToMinutes } from '../utils/courseData';

const Page = styled.div`
  min-height: 100vh;
  background: linear-gradient(180deg, #334155 0%, #475569 100%);
  color: white;
`;

const Wrap = styled.div`
  max-width: 1260px;
  margin: 0 auto;
  padding: 1.5rem 1.5rem 3rem;
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  color: rgba(255, 255, 255, 0.68);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 0.5rem 0.8rem;
  text-decoration: none;
  font-weight: 700;
  font-size: 0.8rem;
`;

const Hero = styled.section`
  margin-top: 0.9rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 18px;
  background: linear-gradient(130deg, rgba(34, 197, 94, 0.12), rgba(30, 41, 59, 0.86));
  padding: 1.25rem;
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 1rem;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

const CourseHead = styled.div`
  display: flex;
  gap: 0.9rem;
`;

const CourseIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 16px;
  background: ${(p) => `${p.$accent || '#22c55e'}25`};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.9rem;
  flex-shrink: 0;
`;

const CourseTitle = styled.h1`
  margin: 0;
  font-size: 2rem;
  letter-spacing: -0.02em;
`;

const CourseDesc = styled.p`
  margin: 0.45rem 0 0;
  color: rgba(255, 255, 255, 0.68);
  line-height: 1.7;
`;

const MetaRow = styled.div`
  margin-top: 0.75rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
`;

const MetaChip = styled.div`
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 999px;
  padding: 0.32rem 0.7rem;
  font-size: 0.74rem;
  color: rgba(255, 255, 255, 0.8);
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-weight: 700;
`;

const CtaRow = styled.div`
  margin-top: 1rem;
  display: flex;
  gap: 0.55rem;
  flex-wrap: wrap;
`;

const Primary = styled(Link)`
  text-decoration: none;
  border-radius: 10px;
  padding: 0.58rem 0.85rem;
  background: linear-gradient(130deg, #22c55e, #16a34a);
  color: white;
  border: none;
  font-size: 0.8rem;
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
`;

const Secondary = styled.button`
  border-radius: 10px;
  padding: 0.58rem 0.85rem;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.04);
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.8rem;
  font-weight: 800;
  cursor: pointer;
`;

const ProgressStack = styled.div`
  display: grid;
  gap: 0.55rem;
`;

const ProgressCard = styled.div`
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
  padding: 0.75rem 0.8rem;
`;

const ProgressLabel = styled.div`
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(255, 255, 255, 0.52);
  margin-bottom: 0.25rem;
  font-weight: 700;
`;

const ProgressVal = styled.div`
  font-size: 1.3rem;
  font-weight: 800;
  color: ${(p) => p.$color || '#22c55e'};
`;

const Dash = styled.div`
  margin-top: 1rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

const ChartPanel = styled.div`
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.03);
  padding: 1rem;
  min-height: 280px;
`;

const ChartTitle = styled.h3`
  margin: 0 0 0.75rem;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: rgba(255, 255, 255, 0.65);
`;

const ModuleSection = styled.section`
  margin-top: 1rem;
`;

const ModuleCard = styled(motion.div)`
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.03);
  overflow: hidden;
  margin-bottom: 0.8rem;
`;

const ModuleHead = styled.button`
  width: 100%;
  border: none;
  background: transparent;
  color: white;
  text-align: left;
  padding: 0.85rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  cursor: pointer;
`;

const ModuleMeta = styled.div`
  margin-left: auto;
  color: rgba(255, 255, 255, 0.55);
  font-size: 0.76rem;
  font-weight: 700;
`;

const LessonList = styled(motion.div)`
  overflow: hidden;
`;

const LessonRow = styled(Link)`
  text-decoration: none;
  color: white;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding: 0.72rem 1rem 0.72rem 2rem;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  transition: background 0.2s ease;
  &:hover {
    background: rgba(255, 255, 255, 0.04);
  }
`;

const LessonTitle = styled.div`
  font-weight: 700;
  font-size: 0.86rem;
`;

const LessonSub = styled.div`
  color: rgba(255, 255, 255, 0.52);
  font-size: 0.74rem;
`;

const Dot = styled.div`
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid ${(p) => (p.$done ? '#22c55e' : 'rgba(255,255,255,0.24)')};
  background: ${(p) => (p.$done ? 'rgba(34,197,94,0.22)' : 'transparent')};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #22c55e;
  font-size: 0.62rem;
`;

const Center = styled.div`
  text-align: center;
  padding: 4rem 1rem;
  color: rgba(255, 255, 255, 0.6);
`;

function normalizeCourse(course, completedIds) {
  const completedSet = new Set(completedIds || []);
  const modules = (course.modules || []).map((module) => ({
    ...module,
    lessons: (module.lessons || []).map((lesson) => ({
      ...lesson,
      completed: completedSet.has(lesson.id) || lesson.completed,
    })),
  }));
  const allLessons = modules.flatMap((module) => module.lessons);
  const totalLessons = allLessons.length;
  const completedLessons = allLessons.filter((lesson) => lesson.completed).length;
  const estimatedMinutes = allLessons.reduce((sum, lesson) => sum + parseDurationToMinutes(lesson.duration), 0);
  return {
    ...course,
    modules,
    totalLessons,
    completedLessons,
    estimatedMinutes,
    progressPercent: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
  };
}

const CoursePage = () => {
  const { courseId } = useParams();
  const { isPro } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedModules, setExpandedModules] = useState({});

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [courseRes, progressRes] = await Promise.all([api.getCourse(courseId), api.getCourseProgress()]);
      const ids = progressRes.completedIds || [];
      const normalized = normalizeCourse(courseRes.course, ids);
      setCourse(normalized);
      const firstOpen = {};
      if (normalized.modules[0]) firstOpen[normalized.modules[0].id] = true;
      setExpandedModules(firstOpen);
    } catch (err) {
      const saved = JSON.parse(localStorage.getItem('bloomvest_completed_lessons') || '[]');
      const fallback = getStaticCourseById(courseId, saved);
      if (!fallback) {
        setCourse(null);
      } else {
        const normalized = normalizeCourse(fallback, saved);
        setCourse(normalized);
        const firstOpen = {};
        if (normalized.modules[0]) firstOpen[normalized.modules[0].id] = true;
        setExpandedModules(firstOpen);
      }
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const moduleBars = useMemo(() => {
    if (!course) return [];
    return course.modules.map((module) => {
      const completed = module.lessons.filter((lesson) => lesson.completed).length;
      return {
        module: module.title.length > 14 ? `${module.title.slice(0, 14)}…` : module.title,
        completed,
        remaining: Math.max(module.lessons.length - completed, 0),
      };
    });
  }, [course]);

  const learningCurve = useMemo(() => {
    if (!course) return [];
    let cumulative = 0;
    return course.modules.map((module, idx) => {
      const moduleMinutes = module.lessons.reduce((sum, lesson) => sum + parseDurationToMinutes(lesson.duration), 0);
      cumulative += moduleMinutes;
      return {
        stage: `M${idx + 1}`,
        cumulativeMinutes: cumulative,
      };
    });
  }, [course]);

  const firstIncompleteLesson = useMemo(() => {
    if (!course) return null;
    return course.modules
      .flatMap((module) => module.lessons)
      .find((lesson) => !lesson.completed) || null;
  }, [course]);

  if (loading) {
    return (
      <Page>
        <Wrap>
          <Center>Loading course…</Center>
        </Wrap>
      </Page>
    );
  }

  if (!course) {
    return (
      <Page>
        <Wrap>
          <BackLink to="/learn"><FaArrowLeft /> Back to Courses</BackLink>
          <Center>Course not found.</Center>
        </Wrap>
      </Page>
    );
  }

  if (course.is_pro && !isPro) {
    return (
      <Page>
        <Wrap>
          <BackLink to="/learn"><FaArrowLeft /> Back to Courses</BackLink>
          <Center>
            <div style={{ fontSize: '2rem', marginBottom: '0.8rem' }}><FaLock /></div>
            <div style={{ marginBottom: '1rem', fontWeight: 700 }}>This course is available on Pro.</div>
            <Primary to="/pricing">Upgrade to Pro</Primary>
          </Center>
        </Wrap>
      </Page>
    );
  }

  return (
    <Page>
      <Wrap>
        <BackLink to="/learn"><FaArrowLeft /> Back to Courses</BackLink>

        <Hero>
          <div>
            <CourseHead>
              <CourseIcon $accent={course.color}>{course.icon}</CourseIcon>
              <div>
                <CourseTitle>{course.title}</CourseTitle>
                <CourseDesc>{course.description}</CourseDesc>
                <MetaRow>
                  <MetaChip><FaBookOpen /> {course.totalLessons} lessons</MetaChip>
                  <MetaChip><FaClock /> {course.estimatedMinutes} min</MetaChip>
                  <MetaChip><FaCheckCircle style={{ color: '#22c55e' }} /> {course.progressPercent}% complete</MetaChip>
                </MetaRow>
              </div>
            </CourseHead>

            <CtaRow>
              {firstIncompleteLesson ? (
                <Primary to={`/learn/course/${course.id}/lesson/${firstIncompleteLesson.id}`}>
                  <FaPlay /> Continue Learning
                </Primary>
              ) : (
                <Primary to={`/learn/course/${course.id}/lesson/${course.modules[0]?.lessons[0]?.id || ''}`}>
                  <FaPlay /> Start Review
                </Primary>
              )}
              <Secondary onClick={() => navigate('/learn')}>View All Courses</Secondary>
            </CtaRow>
          </div>

          <ProgressStack>
            <ProgressCard>
              <ProgressLabel>Total Lessons</ProgressLabel>
              <ProgressVal $color="#3b82f6">{course.totalLessons}</ProgressVal>
            </ProgressCard>
            <ProgressCard>
              <ProgressLabel>Completed</ProgressLabel>
              <ProgressVal>{course.completedLessons}</ProgressVal>
            </ProgressCard>
            <ProgressCard>
              <ProgressLabel>Study Time</ProgressLabel>
              <ProgressVal>{Math.round(course.estimatedMinutes / 60)}h</ProgressVal>
            </ProgressCard>
          </ProgressStack>
        </Hero>

        <Dash>
          <ChartPanel>
            <ChartTitle>Module Completion Breakdown</ChartTitle>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={moduleBars}>
                <XAxis dataKey="module" stroke="rgba(255,255,255,0.45)" fontSize={11} />
                <YAxis stroke="rgba(255,255,255,0.45)" allowDecimals={false} fontSize={11} />
                <Tooltip
                  contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8 }}
                />
                <Bar dataKey="completed" stackId="a" fill="#22c55e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="remaining" stackId="a" fill="rgba(255,255,255,0.2)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartPanel>

          <ChartPanel>
            <ChartTitle>Learning Time Curve</ChartTitle>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={learningCurve}>
                <defs>
                  <linearGradient id="course_time" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0.04} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                <XAxis dataKey="stage" stroke="rgba(255,255,255,0.45)" fontSize={11} />
                <YAxis stroke="rgba(255,255,255,0.45)" fontSize={11} />
                <Tooltip
                  formatter={(value) => [`${value} min`, 'Cumulative']}
                  contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8 }}
                />
                <Area type="monotone" dataKey="cumulativeMinutes" stroke="#22c55e" fillOpacity={1} fill="url(#course_time)" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartPanel>
        </Dash>

        <ModuleSection>
          {course.modules.map((module) => {
            const doneCount = module.lessons.filter((lesson) => lesson.completed).length;
            const open = !!expandedModules[module.id];
            return (
              <ModuleCard
                key={module.id}
                whileHover={{ y: -2, borderColor: 'rgba(34, 197, 94, 0.35)' }}
                transition={{ duration: 0.18 }}
              >
                <ModuleHead
                  onClick={() => setExpandedModules((prev) => ({ ...prev, [module.id]: !prev[module.id] }))}
                >
                  {open ? <FaChevronDown /> : <FaChevronRight />}
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{module.title}</div>
                    <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.52)', marginTop: '0.12rem' }}>
                      {module.description}
                    </div>
                  </div>
                  <ModuleMeta>{doneCount}/{module.lessons.length} done</ModuleMeta>
                </ModuleHead>
                <AnimatePresence initial={false}>
                  {open && (
                    <LessonList
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {module.lessons.map((lesson) => (
                        <LessonRow
                          key={lesson.id}
                          to={`/learn/course/${course.id}/lesson/${lesson.id}`}
                        >
                          <Dot $done={lesson.completed}>{lesson.completed ? <FaCheckCircle /> : null}</Dot>
                          <div style={{ flex: 1 }}>
                            <LessonTitle>{lesson.icon} {lesson.title}</LessonTitle>
                            <LessonSub>{lesson.duration}</LessonSub>
                          </div>
                          <FaChevronRight style={{ color: 'rgba(255,255,255,0.42)', fontSize: '0.75rem' }} />
                        </LessonRow>
                      ))}
                    </LessonList>
                  )}
                </AnimatePresence>
              </ModuleCard>
            );
          })}
        </ModuleSection>
      </Wrap>
    </Page>
  );
};

export default CoursePage;
