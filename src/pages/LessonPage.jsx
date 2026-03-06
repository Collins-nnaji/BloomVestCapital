import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, CartesianGrid } from 'recharts';
import { FaArrowLeft, FaArrowRight, FaCheck, FaCheckCircle, FaClock, FaGraduationCap, FaTrophy, FaGripVertical } from 'react-icons/fa';
import { api } from '../api';
import { getStaticCourseById, getStaticLessonById } from '../utils/courseData';

const Page = styled.div`
  min-height: 100vh;
  background: linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%);
  color: #0f172a;
`;

const Wrap = styled.div`
  max-width: 1020px;
  margin: 0 auto;
  padding: 1.5rem 1.5rem 3rem;
`;

const TopNav = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.8rem;
  flex-wrap: wrap;
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  text-decoration: none;
  color: rgba(15, 23, 42, 0.75);
  border: 1px solid rgba(15, 23, 42, 0.14);
  border-radius: 10px;
  padding: 0.5rem 0.8rem;
  font-size: 0.8rem;
  font-weight: 700;
`;

const Breadcrumb = styled.div`
  color: rgba(15, 23, 42, 0.62);
  font-size: 0.76rem;
  font-weight: 700;
`;

const Hero = styled.section`
  margin-top: 0.9rem;
  border: 1px solid rgba(15, 23, 42, 0.14);
  border-radius: 16px;
  background: linear-gradient(130deg, rgba(34, 197, 94, 0.14), #ffffff);
  padding: 1.15rem;
`;

const HeroTitle = styled.h1`
  margin: 0;
  font-size: 1.85rem;
  letter-spacing: -0.02em;
`;

const HeroSub = styled.p`
  margin: 0.45rem 0 0;
  color: rgba(15, 23, 42, 0.76);
  line-height: 1.7;
`;

const MetaRow = styled.div`
  margin-top: 0.75rem;
  display: flex;
  gap: 0.55rem;
  flex-wrap: wrap;
`;

const MetaChip = styled.div`
  border: 1px solid rgba(15, 23, 42, 0.14);
  border-radius: 999px;
  padding: 0.26rem 0.72rem;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: rgba(15, 23, 42, 0.86);
`;

const Grid = styled.div`
  margin-top: 1rem;
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 1rem;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

const Main = styled.div`
  border: 1px solid rgba(15, 23, 42, 0.12);
  border-radius: 14px;
  background: #ffffff;
  padding: 1rem;
`;

const Side = styled.div`
  display: grid;
  gap: 1rem;
  align-content: start;
`;

const Card = styled.div`
  border: 1px solid rgba(15, 23, 42, 0.12);
  border-radius: 14px;
  background: #ffffff;
  padding: 0.95rem;
`;

const Heading = styled.h3`
  margin: 0 0 0.7rem;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: rgba(15, 23, 42, 0.72);
`;

const Section = styled.div`
  margin-bottom: 1.1rem;
`;

const SectionTitle = styled.h2`
  margin: 0 0 0.35rem;
  font-size: 1.2rem;
  letter-spacing: -0.01em;
`;

const SectionText = styled.p`
  margin: 0;
  color: rgba(15, 23, 42, 0.78);
  line-height: 1.75;
`;

const Takeaway = styled.div`
  border-left: 3px solid #22c55e;
  padding: 0.45rem 0.6rem;
  margin-bottom: 0.45rem;
  color: rgba(15, 23, 42, 0.82);
  font-size: 0.86rem;
  display: flex;
  align-items: flex-start;
  gap: 0.45rem;
`;

const QuestionCard = styled.div`
  border: 1px solid rgba(15, 23, 42, 0.12);
  border-radius: 12px;
  padding: 0.85rem;
  margin-bottom: 0.7rem;
  background: rgba(15, 23, 42, 0.03);
`;

const Question = styled.p`
  margin: 0 0 0.55rem;
  font-weight: 700;
  font-size: 0.92rem;
`;

const Option = styled.button`
  width: 100%;
  text-align: left;
  border-radius: 9px;
  margin-top: 0.35rem;
  padding: 0.58rem 0.65rem;
  border: 1px solid ${(p) => {
    if (p.$submitted && p.$correct) return 'rgba(34,197,94,0.8)';
    if (p.$submitted && p.$selected && !p.$correct) return 'rgba(239,68,68,0.7)';
    if (p.$selected) return 'rgba(59,130,246,0.75)';
    return 'rgba(15,23,42,0.18)';
  }};
  background: ${(p) => {
    if (p.$submitted && p.$correct) return 'rgba(34,197,94,0.14)';
    if (p.$submitted && p.$selected && !p.$correct) return 'rgba(239,68,68,0.12)';
    if (p.$selected) return 'rgba(59,130,246,0.12)';
    return 'rgba(15,23,42,0.04)';
  }};
  color: rgba(15, 23, 42, 0.9);
  cursor: ${(p) => (p.disabled ? 'default' : 'pointer')};
  font-size: 0.84rem;
`;

const Row = styled.div`
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
`;

const Action = styled.button`
  border-radius: 10px;
  padding: 0.56rem 0.82rem;
  border: none;
  background: ${(p) => (p.$secondary ? 'rgba(15,23,42,0.08)' : 'linear-gradient(130deg, #22c55e, #16a34a)')};
  color: ${(p) => (p.$secondary ? '#0f172a' : 'white')};
  font-size: 0.8rem;
  font-weight: 800;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
`;

const Score = styled.div`
  margin-top: 0.6rem;
  border-radius: 10px;
  padding: 0.75rem;
  font-size: 0.84rem;
  background: ${(p) => (p.$pass ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)')};
  border: 1px solid ${(p) => (p.$pass ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)')};
  color: rgba(15, 23, 42, 0.9);
`;

const DndHint = styled.p`
  margin: 0 0 0.6rem;
  font-size: 0.82rem;
  color: rgba(15, 23, 42, 0.7);
`;

const DndList = styled.div`
  display: grid;
  gap: 0.45rem;
`;

const DndItem = styled.div`
  border-radius: 10px;
  border: 1px solid ${(p) => (p.$active ? 'rgba(34,197,94,0.65)' : 'rgba(15,23,42,0.16)')};
  background: ${(p) => (p.$active ? 'rgba(34,197,94,0.12)' : 'rgba(15,23,42,0.03)')};
  padding: 0.58rem 0.65rem;
  display: flex;
  align-items: center;
  gap: 0.55rem;
  font-size: 0.85rem;
  color: rgba(15, 23, 42, 0.9);
  cursor: ${(p) => (p.$locked ? 'default' : 'grab')};
  user-select: none;
`;

const Center = styled.div`
  text-align: center;
  color: rgba(15, 23, 42, 0.66);
  padding: 4rem 1rem;
`;

function normalizeLesson(lesson) {
  const normalizedContent = Array.isArray(lesson.content) ? lesson.content : [];
  const providedTask = lesson.interactiveTask && Array.isArray(lesson.interactiveTask.items)
    ? lesson.interactiveTask
    : null;
  const derivedItems = normalizedContent
    .map((block, idx) => ({
      id: `section-${idx + 1}`,
      label: block.heading || `Section ${idx + 1}`,
    }))
    .slice(0, 5);

  const generatedTask = derivedItems.length >= 3
    ? {
      type: 'sequence_order',
      title: 'Drag & Drop Sequence Builder',
      instructions: 'Arrange the lesson sections into their ideal learning sequence.',
      items: derivedItems,
      correctOrder: derivedItems.map((item) => item.id),
    }
    : null;

  const normalizedTask = providedTask || generatedTask;
  return {
    ...lesson,
    content: normalizedContent,
    keyTakeaways: Array.isArray(lesson.keyTakeaways) ? lesson.keyTakeaways : [],
    quiz: Array.isArray(lesson.quiz) ? lesson.quiz : [],
    interactiveTask: normalizedTask,
  };
}

function shuffleItems(items) {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const LessonPage = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [activityOrder, setActivityOrder] = useState([]);
  const [draggingId, setDraggingId] = useState(null);
  const [activitySubmitted, setActivitySubmitted] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setQuizAnswers({});
    setQuizSubmitted(false);
    try {
      const [courseRes, lessonRes] = await Promise.all([api.getCourse(courseId), api.getLesson(lessonId)]);
      setCourse(courseRes.course);
      setLesson(normalizeLesson({ ...lessonRes.lesson, courseId: Number(courseId) }));
    } catch (err) {
      const saved = JSON.parse(localStorage.getItem('bloomvest_completed_lessons') || '[]');
      const fallbackCourse = getStaticCourseById(courseId, saved);
      const fallbackLesson = getStaticLessonById(courseId, lessonId, saved);
      setCourse(fallbackCourse);
      setLesson(fallbackLesson ? normalizeLesson(fallbackLesson) : null);
    } finally {
      setLoading(false);
    }
  }, [courseId, lessonId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (!lesson?.interactiveTask?.items?.length) {
      setActivityOrder([]);
      setActivitySubmitted(false);
      setDraggingId(null);
      return;
    }
    setActivityOrder(shuffleItems(lesson.interactiveTask.items));
    setActivitySubmitted(false);
    setDraggingId(null);
  }, [lesson?.id, lesson?.interactiveTask]);

  const lessonOrder = useMemo(() => {
    if (!course) return [];
    return (course.modules || []).flatMap((module) => module.lessons || []);
  }, [course]);

  const currentIndex = useMemo(() => {
    if (!lessonOrder.length) return -1;
    return lessonOrder.findIndex((item) => String(item.id) === String(lessonId));
  }, [lessonOrder, lessonId]);

  const completionBars = useMemo(() => {
    if (!lesson) return [];
    return lesson.content.map((block, index) => ({
      section: `S${index + 1}`,
      depth: Math.min(Math.round((block.text || '').length / 20), 100),
    }));
  }, [lesson]);

  const retentionCurve = useMemo(() => {
    const base = [25, 52, 68, 78, 88];
    return base.map((value, index) => ({
      checkpoint: `C${index + 1}`,
      retention: lesson?.completed ? Math.min(value + 7, 97) : value,
    }));
  }, [lesson]);

  const allAnswered = lesson && lesson.quiz.length > 0
    ? Object.keys(quizAnswers).length === lesson.quiz.length
    : false;

  const score = useMemo(() => {
    if (!lesson || lesson.quiz.length === 0) return 0;
    return lesson.quiz.reduce((sum, question, idx) => sum + (quizAnswers[idx] === question.answer ? 1 : 0), 0);
  }, [lesson, quizAnswers]);

  const passed = lesson && lesson.quiz.length > 0
    ? score >= Math.ceil(lesson.quiz.length / 2)
    : true;

  const activityCorrect = useMemo(() => {
    if (!lesson?.interactiveTask?.correctOrder || !activityOrder.length) return false;
    return activityOrder.every((item, idx) => item.id === lesson.interactiveTask.correctOrder[idx]);
  }, [lesson, activityOrder]);

  const onDropItem = useCallback((targetId) => {
    if (!draggingId || draggingId === targetId || activitySubmitted) return;
    setActivityOrder((prev) => {
      const fromIndex = prev.findIndex((item) => item.id === draggingId);
      const toIndex = prev.findIndex((item) => item.id === targetId);
      if (fromIndex === -1 || toIndex === -1) return prev;
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
    setDraggingId(null);
  }, [draggingId, activitySubmitted]);

  const completeLesson = useCallback(async () => {
    if (!lesson || completing) return;
    setCompleting(true);
    try {
      await api.completeLessonV2(lesson.id, score);
    } catch (err) {
      const saved = JSON.parse(localStorage.getItem('bloomvest_completed_lessons') || '[]');
      if (!saved.includes(lesson.id)) {
        saved.push(lesson.id);
        localStorage.setItem('bloomvest_completed_lessons', JSON.stringify(saved));
      }
    } finally {
      setCompleting(false);
      setLesson((prev) => (prev ? { ...prev, completed: true } : prev));
    }
  }, [lesson, score, completing]);

  if (loading) {
    return (
      <Page>
        <Wrap><Center>Loading lesson…</Center></Wrap>
      </Page>
    );
  }

  if (!lesson || !course) {
    return (
      <Page>
        <Wrap>
          <BackLink to={`/learn/course/${courseId}`}><FaArrowLeft /> Back to Course</BackLink>
          <Center>Lesson not found.</Center>
        </Wrap>
      </Page>
    );
  }

  return (
    <Page>
      <Wrap>
        <TopNav>
          <BackLink to={`/learn/course/${courseId}`}><FaArrowLeft /> Back to Course</BackLink>
          <Breadcrumb>{course.title} / {lesson.moduleTitle}</Breadcrumb>
        </TopNav>

        <Hero>
          <HeroTitle>{lesson.icon} {lesson.title}</HeroTitle>
          <HeroSub>{lesson.description}</HeroSub>
          <MetaRow>
            <MetaChip><FaClock /> {lesson.duration}</MetaChip>
            <MetaChip><FaGraduationCap /> Lesson {currentIndex + 1} of {lessonOrder.length}</MetaChip>
            <MetaChip><FaCheckCircle style={{ color: '#22c55e' }} /> {lesson.completed ? 'Completed' : 'In progress'}</MetaChip>
          </MetaRow>
        </Hero>

        <Grid>
          <Main>
            {lesson.content.map((block, index) => (
              <Section key={`${block.heading}-${index}`}>
                <SectionTitle>{block.heading}</SectionTitle>
                <SectionText>{block.text}</SectionText>
              </Section>
            ))}

            <Card style={{ marginTop: '1rem' }}>
              <Heading>Key Takeaways</Heading>
              {lesson.keyTakeaways.map((takeaway, index) => (
                <Takeaway key={`${takeaway}-${index}`}>
                  <FaCheck style={{ color: '#22c55e', marginTop: '0.15rem' }} />
                  <span>{takeaway}</span>
                </Takeaway>
              ))}
            </Card>

            {lesson.interactiveTask?.type === 'sequence_order' && activityOrder.length > 0 && (
              <Card style={{ marginTop: '1rem' }}>
                <Heading>{lesson.interactiveTask.title || 'Drag & Drop Activity'}</Heading>
                <DndHint>{lesson.interactiveTask.instructions || 'Arrange the cards to complete this checkpoint.'}</DndHint>
                <DndList>
                  {activityOrder.map((item) => (
                    <DndItem
                      key={item.id}
                      $active={draggingId === item.id}
                      $locked={activitySubmitted}
                      draggable={!activitySubmitted}
                      onDragStart={() => setDraggingId(item.id)}
                      onDragOver={(event) => event.preventDefault()}
                      onDrop={() => onDropItem(item.id)}
                      onDragEnd={() => setDraggingId(null)}
                    >
                      <FaGripVertical style={{ color: 'rgba(15,23,42,0.45)' }} />
                      <span>{item.label}</span>
                    </DndItem>
                  ))}
                </DndList>
                <Row style={{ marginTop: '0.7rem' }}>
                  {!activitySubmitted ? (
                    <Action onClick={() => setActivitySubmitted(true)}>
                      Submit Arrangement
                    </Action>
                  ) : (
                    <Action
                      $secondary
                      onClick={() => {
                        setActivityOrder(shuffleItems(lesson.interactiveTask.items));
                        setActivitySubmitted(false);
                      }}
                    >
                      Shuffle & Retry
                    </Action>
                  )}
                </Row>
                {activitySubmitted && (
                  <Score $pass={activityCorrect} style={{ marginTop: '0.7rem' }}>
                    {activityCorrect ? 'Excellent sequence. You mapped the concept flow correctly.' : 'Close — reorder and try again for full mastery.'}
                  </Score>
                )}
              </Card>
            )}

            {lesson.quiz.length > 0 && (
              <Card style={{ marginTop: '1rem' }}>
                <Heading><FaTrophy style={{ marginRight: '0.4rem', color: '#f59e0b' }} /> Knowledge Check</Heading>
                {lesson.quiz.map((question, qIdx) => (
                  <QuestionCard key={`${question.question}-${qIdx}`}>
                    <Question>{qIdx + 1}. {question.question}</Question>
                    {question.options.map((option, optIdx) => (
                      <Option
                        key={`${option}-${optIdx}`}
                        $selected={quizAnswers[qIdx] === optIdx}
                        $correct={optIdx === question.answer}
                        $submitted={quizSubmitted}
                        disabled={quizSubmitted}
                        onClick={() => setQuizAnswers((prev) => ({ ...prev, [qIdx]: optIdx }))}
                      >
                        {option}
                      </Option>
                    ))}
                  </QuestionCard>
                ))}

                {!quizSubmitted ? (
                  <Action disabled={!allAnswered} onClick={() => setQuizSubmitted(true)}>
                    Submit Quiz
                  </Action>
                ) : (
                  <>
                    <Score $pass={passed}>
                      Score: {score}/{lesson.quiz.length} — {passed ? 'Great work. Ready to complete this lesson.' : 'Review and retry to improve mastery.'}
                    </Score>
                    <Row style={{ marginTop: '0.65rem' }}>
                      <Action onClick={completeLesson} disabled={completing}>
                        <FaCheckCircle /> {completing ? 'Saving…' : lesson.completed ? 'Lesson Completed' : 'Mark as Complete'}
                      </Action>
                      <Action $secondary onClick={() => { setQuizAnswers({}); setQuizSubmitted(false); }}>
                        Try Again
                      </Action>
                    </Row>
                  </>
                )}
              </Card>
            )}

            <Row style={{ marginTop: '1rem' }}>
              <Action
                $secondary
                disabled={!lesson.prevLessonId}
                onClick={() => lesson.prevLessonId && navigate(`/learn/course/${courseId}/lesson/${lesson.prevLessonId}`)}
              >
                <FaArrowLeft /> Previous
              </Action>
              <Action
                disabled={!lesson.nextLessonId}
                onClick={() => lesson.nextLessonId && navigate(`/learn/course/${courseId}/lesson/${lesson.nextLessonId}`)}
              >
                Next <FaArrowRight />
              </Action>
            </Row>
          </Main>

          <Side>
            <Card>
              <Heading>Concept Depth by Section</Heading>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={completionBars}>
                  <CartesianGrid stroke="rgba(15,23,42,0.08)" vertical={false} />
                  <XAxis dataKey="section" stroke="rgba(15,23,42,0.58)" fontSize={11} />
                  <YAxis stroke="rgba(15,23,42,0.58)" fontSize={11} />
                  <Tooltip
                    contentStyle={{ background: '#ffffff', border: '1px solid rgba(15,23,42,0.12)', borderRadius: 8 }}
                  />
                  <Bar dataKey="depth" fill="#22c55e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card>
              <Heading>Retention Checkpoints</Heading>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={retentionCurve}>
                  <CartesianGrid stroke="rgba(15,23,42,0.08)" vertical={false} />
                  <XAxis dataKey="checkpoint" stroke="rgba(15,23,42,0.58)" fontSize={11} />
                  <YAxis domain={[0, 100]} stroke="rgba(15,23,42,0.58)" fontSize={11} />
                  <Tooltip
                    formatter={(value) => [`${value}%`, 'Retention']}
                    contentStyle={{ background: '#ffffff', border: '1px solid rgba(15,23,42,0.12)', borderRadius: 8 }}
                  />
                  <Line type="monotone" dataKey="retention" stroke="#3b82f6" strokeWidth={3} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </Side>
        </Grid>
      </Wrap>
    </Page>
  );
};

export default LessonPage;
