import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from 'recharts';
import { FaBookOpen, FaClock, FaCheckCircle, FaArrowRight, FaLock, FaChartLine } from 'react-icons/fa';
import { useAuth } from '../AuthContext';
import { api } from '../api';
import { buildStaticCourses, parseDurationToMinutes } from '../utils/courseData';

const Page = styled.div`
  min-height: 100vh;
  background: linear-gradient(180deg, #334155 0%, #475569 100%);
  color: white;
`;

const Wrap = styled.div`
  max-width: 1260px;
  margin: 0 auto;
  padding: 2rem 1.5rem 3rem;
`;

const Hero = styled.section`
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.12), rgba(17, 24, 39, 0.92));
  padding: 1.5rem;
  margin-bottom: 1.25rem;
  display: grid;
  grid-template-columns: 1.3fr 0.7fr;
  gap: 1rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const HeroTitle = styled.h1`
  font-size: 2.15rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  margin: 0 0 0.4rem;
  span {
    color: #22c55e;
  }
`;

const HeroSub = styled.p`
  color: rgba(255, 255, 255, 0.66);
  line-height: 1.7;
  margin: 0;
  max-width: 720px;
`;

const StatRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.6rem;
`;

const Stat = styled.div`
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  padding: 0.75rem 0.85rem;
`;

const StatNumber = styled.div`
  font-size: 1.45rem;
  font-weight: 800;
  color: ${(p) => p.$color || '#22c55e'};
`;

const StatLabel = styled.div`
  margin-top: 0.2rem;
  font-size: 0.72rem;
  color: rgba(255, 255, 255, 0.45);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 700;
`;

const ProgressCard = styled.div`
  margin-bottom: 1.25rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 0.95rem 1rem;
  background: rgba(255, 255, 255, 0.03);
`;

const ProgressTop = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 0.8rem;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const ProgressLabel = styled.div`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.52);
  font-weight: 700;
`;

const ProgressValue = styled.div`
  font-size: 0.86rem;
  font-weight: 700;
`;

const Track = styled.div`
  height: 10px;
  border-radius: 999px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.08);
`;

const Fill = styled(motion.div)`
  height: 100%;
  background: linear-gradient(90deg, #22c55e, #16a34a);
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
  margin-bottom: 1.25rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

const Panel = styled.div`
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.03);
  padding: 1rem;
  min-height: 250px;
`;

const PanelTitle = styled.h3`
  margin: 0 0 0.7rem;
  font-size: 0.92rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: rgba(255, 255, 255, 0.68);
`;

const RollerChartWrap = styled(motion.div)`
  height: 210px;
  position: relative;
`;

const RollerLabel = styled.div`
  margin-top: 0.6rem;
  display: flex;
  justify-content: space-between;
  font-size: 0.76rem;
  color: rgba(255, 255, 255, 0.62);
`;

const SectionTitle = styled.h2`
  margin: 0 0 1rem;
  font-size: 1.35rem;
  letter-spacing: -0.02em;
`;

const CoursesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1rem;
`;

const CourseCard = styled(motion.div)`
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.03);
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${(p) => p.$accent || '#22c55e'};
  }
`;

const CourseBody = styled.div`
  padding: 1.1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex: 1;
`;

const CourseHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.6rem;
`;

const CourseIcon = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: ${(p) => `${p.$accent || '#22c55e'}20`};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
`;

const Badge = styled.span`
  padding: 0.24rem 0.62rem;
  border-radius: 999px;
  font-size: 0.68rem;
  text-transform: uppercase;
  font-weight: 800;
  letter-spacing: 0.05em;
  color: ${(p) => p.$color || '#22c55e'};
  background: ${(p) => `${p.$color || '#22c55e'}20`};
`;

const CourseTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  letter-spacing: -0.01em;
`;

const CourseDesc = styled.p`
  margin: 0;
  color: rgba(255, 255, 255, 0.58);
  font-size: 0.86rem;
  line-height: 1.55;
`;

const Meta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.52);
`;

const MetaItem = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
`;

const InlineTrack = styled.div`
  height: 7px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 999px;
  overflow: hidden;
`;

const InlineFill = styled.div`
  height: 100%;
  width: ${(p) => p.$percent}%;
  background: ${(p) => p.$color || '#22c55e'};
`;

const CardAction = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  margin-top: 0.2rem;
  text-decoration: none;
  border: 1px solid rgba(34, 197, 94, 0.28);
  color: #86efac;
  background: rgba(34, 197, 94, 0.12);
  border-radius: 10px;
  padding: 0.56rem 0.8rem;
  font-size: 0.8rem;
  font-weight: 800;
`;

const LockedAction = styled(Link)`
  text-decoration: none;
  border-radius: 10px;
  padding: 0.56rem 0.8rem;
  font-size: 0.8rem;
  font-weight: 800;
  border: 1px solid rgba(251, 191, 36, 0.35);
  color: #fbbf24;
  background: rgba(251, 191, 36, 0.1);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
`;

const Empty = styled.div`
  color: rgba(255, 255, 255, 0.55);
  text-align: center;
  padding: 4rem 1rem;
`;

const Loading = styled.div`
  color: rgba(255, 255, 255, 0.55);
  text-align: center;
  padding: 4rem 1rem;
`;

function normalizeCourse(course, completedIds) {
  const completedSet = new Set(completedIds || []);
  const modules = Array.isArray(course.modules) ? course.modules : [];
  const allLessons = modules.flatMap((m) => m.lessons || []);
  const totalLessons = allLessons.length;
  const completedLessons = allLessons.filter((lesson) => completedSet.has(lesson.id) || lesson.completed).length;
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

const LearnPage = () => {
  const { isPro } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [courses, setCourses] = useState([]);
  const [progress, setProgress] = useState({ totalLessons: 0, completedLessons: 0 });

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [coursesRes, progressRes] = await Promise.all([api.getCourses(), api.getCourseProgress()]);
      const ids = progressRes.completedIds || [];
      const normalizedCourses = (coursesRes.courses || []).map((course) => normalizeCourse(course, ids));
      setCourses(normalizedCourses);
      setProgress({
        totalLessons: progressRes.totalLessons || normalizedCourses.reduce((sum, c) => sum + c.totalLessons, 0),
        completedLessons: progressRes.completedLessons || ids.length,
      });
    } catch (err) {
      const saved = JSON.parse(localStorage.getItem('bloomvest_completed_lessons') || '[]');
      const fallbackCourses = buildStaticCourses(saved);
      setCourses(fallbackCourses);
      setProgress({
        totalLessons: fallbackCourses.reduce((sum, c) => sum + c.totalLessons, 0),
        completedLessons: saved.length,
      });
      setError('Showing offline course data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const overallPercent = progress.totalLessons > 0
    ? Math.round((progress.completedLessons / progress.totalLessons) * 100)
    : 0;

  const levelDistribution = useMemo(() => {
    const counts = { beginner: 0, intermediate: 0, advanced: 0 };
    courses.forEach((course) => {
      counts[course.level] = (counts[course.level] || 0) + 1;
    });
    return [
      { name: 'Beginner', value: counts.beginner, color: '#22c55e' },
      { name: 'Intermediate', value: counts.intermediate, color: '#3b82f6' },
      { name: 'Advanced', value: counts.advanced, color: '#16a34a' },
    ];
  }, [courses]);

  const completionBars = useMemo(() => {
    return courses.map((course) => ({
      name: course.title.length > 16 ? `${course.title.slice(0, 16)}…` : course.title,
      completed: course.completedLessons,
      remaining: Math.max(course.totalLessons - course.completedLessons, 0),
    }));
  }, [courses]);

  const rollerData = useMemo(() => {
    const activeRate = Math.min(Math.round((courses.filter((course) => course.progressPercent > 0).length / Math.max(courses.length, 1)) * 100), 100);
    return [
      { name: 'Completion', value: overallPercent, fill: '#22c55e' },
      { name: 'Active Courses', value: activeRate, fill: '#3b82f6' },
    ];
  }, [courses, overallPercent]);

  const totalMinutes = courses.reduce((sum, course) => sum + (course.estimatedMinutes || 0), 0);

  return (
    <Page>
      <Wrap>
        <Hero>
          <div>
            <HeroTitle>Investment <span>Academy</span></HeroTitle>
            <HeroSub>
              Courses are now route-based and designed for deeper learning paths — each course opens in its own page,
              each lesson has full-screen content, and analytics help you track mastery across modules.
            </HeroSub>
          </div>
          <StatRow>
            <Stat>
              <StatNumber $color="#3b82f6">{courses.length}</StatNumber>
              <StatLabel>Courses</StatLabel>
            </Stat>
            <Stat>
              <StatNumber>{progress.totalLessons}</StatNumber>
              <StatLabel>Lessons</StatLabel>
            </Stat>
            <Stat>
              <StatNumber>{Math.round(totalMinutes / 60)}h</StatNumber>
              <StatLabel>Est. Study Time</StatLabel>
            </Stat>
          </StatRow>
        </Hero>

        <ProgressCard>
          <ProgressTop>
            <ProgressLabel>Overall Completion</ProgressLabel>
            <ProgressValue>{progress.completedLessons}/{progress.totalLessons} lessons ({overallPercent}%)</ProgressValue>
          </ProgressTop>
          <Track>
            <Fill
              initial={{ width: 0 }}
              animate={{ width: `${overallPercent}%` }}
              transition={{ duration: 0.7 }}
            />
          </Track>
          {error && <div style={{ marginTop: '0.6rem', fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)' }}>{error}</div>}
        </ProgressCard>

        {!loading && courses.length > 0 && (
          <DashboardGrid>
            <Panel>
              <PanelTitle><FaChartLine style={{ marginRight: '0.45rem' }} /> Course Level Mix</PanelTitle>
              <ResponsiveContainer width="100%" height={210}>
                <PieChart>
                  <Pie
                    data={levelDistribution}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={4}
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {levelDistribution.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: '#1e293b',
                      border: '1px solid rgba(255,255,255,0.14)',
                      borderRadius: 8,
                      color: 'white',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Panel>

            <Panel>
              <PanelTitle><FaCheckCircle style={{ marginRight: '0.45rem' }} /> Lessons Completed by Course</PanelTitle>
              <ResponsiveContainer width="100%" height={210}>
                <BarChart data={completionBars}>
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.45)" fontSize={11} />
                  <YAxis stroke="rgba(255,255,255,0.45)" allowDecimals={false} fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      background: '#1e293b',
                      border: '1px solid rgba(255,255,255,0.14)',
                      borderRadius: 8,
                      color: 'white',
                    }}
                  />
                  <Bar dataKey="completed" stackId="a" fill="#22c55e" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="remaining" stackId="a" fill="rgba(255,255,255,0.2)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Panel>

            <Panel>
              <PanelTitle><FaChartLine style={{ marginRight: '0.45rem' }} /> Roller Circle Progress</PanelTitle>
              <RollerChartWrap
                animate={{ rotate: [0, 2, 0, -2, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart
                    cx="50%"
                    cy="50%"
                    innerRadius="24%"
                    outerRadius="88%"
                    barSize={14}
                    data={rollerData}
                    startAngle={90}
                    endAngle={-270}
                  >
                    <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                    <RadialBar background dataKey="value" cornerRadius={8} />
                    <Tooltip
                      formatter={(value) => [`${value}%`, 'Progress']}
                      contentStyle={{
                        background: '#1e293b',
                        border: '1px solid rgba(255,255,255,0.14)',
                        borderRadius: 8,
                        color: 'white',
                      }}
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
              </RollerChartWrap>
              <RollerLabel>
                <span>Completion: {overallPercent}%</span>
                <span>Active courses: {rollerData[1]?.value || 0}%</span>
              </RollerLabel>
            </Panel>
          </DashboardGrid>
        )}

        <SectionTitle>Your Courses</SectionTitle>

        {loading ? (
          <Loading>Loading courses…</Loading>
        ) : courses.length === 0 ? (
          <Empty>No courses available yet.</Empty>
        ) : (
          <CoursesGrid>
            {courses.map((course, index) => (
              <CourseCard
                key={course.id}
                $accent={course.color}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <CourseBody>
                  <CourseHeader>
                    <CourseIcon $accent={course.color}>{course.icon}</CourseIcon>
                    <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                      <Badge $color={course.level === 'intermediate' ? '#3b82f6' : '#22c55e'}>{course.level}</Badge>
                      {course.is_pro && <Badge $color="#f59e0b">pro</Badge>}
                    </div>
                  </CourseHeader>

                  <CourseTitle>{course.title}</CourseTitle>
                  <CourseDesc>{course.description}</CourseDesc>

                  <Meta>
                    <MetaItem><FaBookOpen /> {course.totalLessons} lessons</MetaItem>
                    <MetaItem><FaClock /> {course.estimatedMinutes} min</MetaItem>
                    <MetaItem><FaCheckCircle style={{ color: '#22c55e' }} /> {course.progressPercent}% done</MetaItem>
                  </Meta>

                  <InlineTrack>
                    <InlineFill $percent={course.progressPercent} $color={course.color} />
                  </InlineTrack>

                  {course.is_pro && !isPro ? (
                    <LockedAction to="/pricing"><FaLock /> Unlock Pro Course</LockedAction>
                  ) : (
                    <CardAction to={`/learn/course/${course.id}`}>
                      Open Course <FaArrowRight />
                    </CardAction>
                  )}
                </CourseBody>
              </CourseCard>
            ))}
          </CoursesGrid>
        )}
      </Wrap>
    </Page>
  );
};

export default LearnPage;
