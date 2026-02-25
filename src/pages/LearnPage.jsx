import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaCheckCircle, FaBookOpen, FaLock, FaChevronRight, FaTrophy, FaCheck, FaTimes } from 'react-icons/fa';
import { lessons, levelInfo } from '../data/lessons';
import { api } from '../api';

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(180deg, #0a0f1c 0%, #111827 100%);
`;

const Header = styled.section`
  background: linear-gradient(135deg, rgba(34,197,94,0.12) 0%, rgba(59,130,246,0.06) 100%);
  border-bottom: 1px solid rgba(255,255,255,0.06);
  padding: 4rem 1.5rem 3rem;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const HeaderTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  color: white;
  margin-bottom: 0.75rem;
  span { color: #22c55e; }
  @media (max-width: 768px) { font-size: 2rem; }
`;

const HeaderDesc = styled.p`
  color: rgba(255,255,255,0.5);
  font-size: 1.1rem;
  max-width: 600px;
`;

const ProgressBar = styled.div`
  max-width: 1200px;
  margin: -1.5rem auto 0;
  padding: 0 1.5rem;
  position: relative;
  z-index: 2;
`;

const ProgressCard = styled.div`
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 16px;
  padding: 1.5rem 2rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
`;

const ProgressInfo = styled.div`
  flex: 1;
  min-width: 200px;
`;

const ProgressLabel = styled.div`
  font-size: 0.85rem;
  color: rgba(255,255,255,0.4);
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const ProgressTrack = styled.div`
  height: 10px;
  background: rgba(255,255,255,0.06);
  border-radius: 10px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #22c55e, #4ade80);
  border-radius: 10px;
  width: ${props => props.$percent}%;
  transition: width 0.5s ease;
`;

const ProgressText = styled.span`
  font-size: 1rem;
  font-weight: 700;
  color: white;
  white-space: nowrap;
`;

const ContentArea = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 1.5rem;
`;

const LevelTabs = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const LevelTab = styled.button`
  padding: 0.6rem 1.25rem;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid ${props => props.$active ? props.$color : 'rgba(255,255,255,0.08)'};
  background: ${props => props.$active ? props.$color + '18' : 'rgba(255,255,255,0.03)'};
  color: ${props => props.$active ? props.$color : 'rgba(255,255,255,0.5)'};

  &:hover {
    border-color: ${props => props.$color};
    color: ${props => props.$color};
  }
`;

const LessonsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 1.5rem;

  @media (max-width: 768px) { grid-template-columns: 1fr; }
`;

const LessonCard = styled(motion.div)`
  background: rgba(255,255,255,0.03);
  border-radius: 16px;
  padding: 1.75rem;
  border: 1px solid ${props => props.$completed ? 'rgba(34,197,94,0.25)' : 'rgba(255,255,255,0.06)'};
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  ${props => props.$completed && `
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, #22c55e, #4ade80);
    }
  `}

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
    border-color: rgba(255,255,255,0.1);
  }
`;

const LessonCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const LessonIcon = styled.span`
  font-size: 2rem;
`;

const LessonMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LevelBadge = styled.span`
  padding: 0.2rem 0.6rem;
  border-radius: 50px;
  font-size: 0.7rem;
  font-weight: 600;
  background: ${props => props.$color + '18'};
  color: ${props => props.$color};
`;

const CompletedIcon = styled(FaCheckCircle)`
  color: #22c55e;
  font-size: 1.1rem;
`;

const LessonTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
`;

const LessonDesc = styled.p`
  color: rgba(255,255,255,0.4);
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 1rem;
`;

const LessonFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LessonDuration = styled.span`
  color: rgba(255,255,255,0.25);
  font-size: 0.85rem;
`;

const StartLesson = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  color: #22c55e;
  font-weight: 600;
  font-size: 0.9rem;
`;

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.75);
  backdrop-filter: blur(6px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const ModalContent = styled(motion.div)`
  background: #111827;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 20px;
  max-width: 720px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
`;

const ModalHeader = styled.div`
  padding: 2rem 2rem 1.5rem;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  position: sticky;
  top: 0;
  background: #111827;
  border-radius: 20px 20px 0 0;
  z-index: 1;
`;

const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: rgba(255,255,255,0.4);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  margin-bottom: 1rem;
  padding: 0;
  transition: color 0.3s;

  &:hover { color: #22c55e; }
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 800;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const ModalBody = styled.div`
  padding: 2rem;
`;

const ContentBlock = styled.div`
  margin-bottom: 2rem;
`;

const ContentHeading = styled.h3`
  font-size: 1.15rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.75rem;
`;

const ContentText = styled.p`
  color: rgba(255,255,255,0.6);
  font-size: 0.95rem;
  line-height: 1.8;
`;

const TakeawaysBox = styled.div`
  background: rgba(34,197,94,0.06);
  border: 1px solid rgba(34,197,94,0.15);
  border-radius: 14px;
  padding: 1.5rem;
  margin: 2rem 0;
`;

const TakeawaysTitle = styled.h4`
  font-size: 1rem;
  font-weight: 700;
  color: white;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg { color: #22c55e; }
`;

const TakeawayItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  margin-bottom: 0.6rem;
  color: rgba(255,255,255,0.6);
  font-size: 0.9rem;
  line-height: 1.5;

  svg { color: #22c55e; flex-shrink: 0; margin-top: 0.2rem; font-size: 0.8rem; }
`;

const QuizSection = styled.div`
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255,255,255,0.06);
`;

const QuizTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 700;
  color: white;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg { color: #f59e0b; }
`;

const QuizQuestion = styled.div`
  margin-bottom: 1.5rem;
`;

const QuestionText = styled.p`
  font-weight: 600;
  color: white;
  margin-bottom: 0.75rem;
  font-size: 0.95rem;
`;

const OptionsGrid = styled.div`
  display: grid;
  gap: 0.5rem;
`;

const OptionButton = styled.button`
  text-align: left;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  border: 2px solid ${props =>
    props.$selected && props.$correct ? '#22c55e' :
    props.$selected && !props.$correct ? '#ef4444' :
    props.$showCorrect ? '#22c55e' :
    'rgba(255,255,255,0.08)'};
  background: ${props =>
    props.$selected && props.$correct ? 'rgba(34,197,94,0.1)' :
    props.$selected && !props.$correct ? 'rgba(239,68,68,0.1)' :
    props.$showCorrect ? 'rgba(34,197,94,0.1)' :
    'rgba(255,255,255,0.03)'};
  color: rgba(255,255,255,0.8);
  font-size: 0.9rem;
  cursor: ${props => props.disabled ? 'default' : 'pointer'};
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover:not(:disabled) {
    border-color: ${props => !props.$selected ? '#22c55e' : undefined};
  }
`;

const CompleteButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 1rem;
  background: #22c55e;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  margin-top: 2rem;
  transition: all 0.3s ease;

  &:hover { background: #16a34a; }

  &:disabled {
    background: rgba(255,255,255,0.1);
    color: rgba(255,255,255,0.3);
    cursor: not-allowed;
  }
`;

const ScoreDisplay = styled.div`
  text-align: center;
  padding: 1.5rem;
  background: ${props => props.$passed ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)'};
  border: 1px solid ${props => props.$passed ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)'};
  border-radius: 14px;
  margin-top: 1.5rem;
`;

const ScoreText = styled.div`
  font-size: 1.5rem;
  font-weight: 800;
  color: ${props => props.$passed ? '#22c55e' : '#ef4444'};
`;

const ScoreLabel = styled.p`
  color: rgba(255,255,255,0.5);
  font-size: 0.9rem;
  margin-top: 0.5rem;
`;

const LearnPage = () => {
  const [activeLevel, setActiveLevel] = useState('all');
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const data = await api.getProgress();
        if (data.progress) {
          setCompletedLessons(data.progress.filter(p => p.completed).map(p => p.lessonId));
        }
      } catch (e) {
        console.log('Could not load progress from server');
        const saved = localStorage.getItem('bloomvest_completed_lessons');
        if (saved) setCompletedLessons(JSON.parse(saved));
      }
    };
    loadProgress();
  }, []);

  const filteredLessons = activeLevel === 'all'
    ? lessons
    : lessons.filter(l => l.level === activeLevel);

  const completedCount = completedLessons.length;
  const progressPercent = Math.round((completedCount / lessons.length) * 100);

  const openLesson = (lesson) => {
    setSelectedLesson(lesson);
    setQuizAnswers({});
    setQuizSubmitted(false);
  };

  const closeLesson = () => {
    setSelectedLesson(null);
    setQuizAnswers({});
    setQuizSubmitted(false);
  };

  const handleQuizAnswer = (qIndex, optIndex) => {
    if (quizSubmitted) return;
    setQuizAnswers(prev => ({ ...prev, [qIndex]: optIndex }));
  };

  const submitQuiz = () => {
    setQuizSubmitted(true);
  };

  const completeLesson = async () => {
    if (!selectedLesson) return;
    const score = getQuizScore();
    try {
      const data = await api.completeLesson(selectedLesson.id, score);
      if (data.completedLessons) {
        setCompletedLessons(data.completedLessons);
      }
    } catch (e) {
      console.log('Could not save progress to server, saving locally');
      const updated = [...new Set([...completedLessons, selectedLesson.id])];
      setCompletedLessons(updated);
      localStorage.setItem('bloomvest_completed_lessons', JSON.stringify(updated));
    }
    closeLesson();
  };

  const getQuizScore = () => {
    if (!selectedLesson) return 0;
    let correct = 0;
    selectedLesson.quiz.forEach((q, i) => {
      if (quizAnswers[i] === q.answer) correct++;
    });
    return correct;
  };

  const allQuestionsAnswered = selectedLesson
    ? Object.keys(quizAnswers).length === selectedLesson.quiz.length
    : false;

  return (
    <PageContainer>
      <Header>
        <HeaderContent>
          <HeaderTitle>Investment <span>Lessons</span></HeaderTitle>
          <HeaderDesc>
            Structured courses from beginner to advanced. Learn at your own pace with interactive quizzes.
          </HeaderDesc>
        </HeaderContent>
      </Header>

      <ProgressBar>
        <ProgressCard>
          <ProgressInfo>
            <ProgressLabel>Your Learning Progress</ProgressLabel>
            <ProgressTrack>
              <ProgressFill $percent={progressPercent} />
            </ProgressTrack>
          </ProgressInfo>
          <ProgressText>{completedCount}/{lessons.length} Lessons Completed</ProgressText>
        </ProgressCard>
      </ProgressBar>

      <ContentArea>
        <LevelTabs>
          <LevelTab
            $active={activeLevel === 'all'}
            $color="#3b82f6"
            onClick={() => setActiveLevel('all')}
          >
            All Lessons
          </LevelTab>
          {Object.entries(levelInfo).map(([key, info]) => (
            <LevelTab
              key={key}
              $active={activeLevel === key}
              $color={info.color}
              onClick={() => setActiveLevel(key)}
            >
              {info.label}
            </LevelTab>
          ))}
        </LevelTabs>

        <LessonsGrid>
          {filteredLessons.map((lesson, index) => (
            <LessonCard
              key={lesson.id}
              $completed={completedLessons.includes(lesson.id)}
              onClick={() => openLesson(lesson)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <LessonCardHeader>
                <LessonIcon>{lesson.icon}</LessonIcon>
                <LessonMeta>
                  <LevelBadge $color={levelInfo[lesson.level].color}>
                    {levelInfo[lesson.level].label}
                  </LevelBadge>
                  {completedLessons.includes(lesson.id) && <CompletedIcon />}
                </LessonMeta>
              </LessonCardHeader>
              <LessonTitle>{lesson.title}</LessonTitle>
              <LessonDesc>{lesson.description}</LessonDesc>
              <LessonFooter>
                <LessonDuration>{lesson.duration} read</LessonDuration>
                <StartLesson>
                  {completedLessons.includes(lesson.id) ? 'Review' : 'Start'} <FaChevronRight />
                </StartLesson>
              </LessonFooter>
            </LessonCard>
          ))}
        </LessonsGrid>
      </ContentArea>

      <AnimatePresence>
        {selectedLesson && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLesson}
          >
            <ModalContent
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              onClick={e => e.stopPropagation()}
            >
              <ModalHeader>
                <BackButton onClick={closeLesson}>
                  <FaArrowLeft /> Back to Lessons
                </BackButton>
                <ModalTitle>
                  <span>{selectedLesson.icon}</span>
                  {selectedLesson.title}
                </ModalTitle>
              </ModalHeader>

              <ModalBody>
                {selectedLesson.content.map((block, index) => (
                  <ContentBlock key={index}>
                    <ContentHeading>{block.heading}</ContentHeading>
                    <ContentText>{block.text}</ContentText>
                  </ContentBlock>
                ))}

                <TakeawaysBox>
                  <TakeawaysTitle>
                    <FaCheckCircle /> Key Takeaways
                  </TakeawaysTitle>
                  {selectedLesson.keyTakeaways.map((takeaway, i) => (
                    <TakeawayItem key={i}>
                      <FaCheck /> {takeaway}
                    </TakeawayItem>
                  ))}
                </TakeawaysBox>

                <QuizSection>
                  <QuizTitle>
                    <FaTrophy /> Test Your Knowledge
                  </QuizTitle>
                  {selectedLesson.quiz.map((q, qIndex) => (
                    <QuizQuestion key={qIndex}>
                      <QuestionText>{qIndex + 1}. {q.question}</QuestionText>
                      <OptionsGrid>
                        {q.options.map((opt, oIndex) => (
                          <OptionButton
                            key={oIndex}
                            $selected={quizAnswers[qIndex] === oIndex}
                            $correct={oIndex === q.answer}
                            $showCorrect={quizSubmitted && oIndex === q.answer}
                            disabled={quizSubmitted}
                            onClick={() => handleQuizAnswer(qIndex, oIndex)}
                          >
                            {quizSubmitted && oIndex === q.answer && <FaCheck style={{color: '#22c55e'}} />}
                            {quizSubmitted && quizAnswers[qIndex] === oIndex && oIndex !== q.answer && <FaTimes style={{color: '#ef4444'}} />}
                            {opt}
                          </OptionButton>
                        ))}
                      </OptionsGrid>
                    </QuizQuestion>
                  ))}

                  {!quizSubmitted ? (
                    <CompleteButton
                      onClick={submitQuiz}
                      disabled={!allQuestionsAnswered}
                    >
                      Submit Quiz
                    </CompleteButton>
                  ) : (
                    <>
                      <ScoreDisplay $passed={getQuizScore() >= 2}>
                        <ScoreText $passed={getQuizScore() >= 2}>
                          {getQuizScore()}/{selectedLesson.quiz.length} Correct
                        </ScoreText>
                        <ScoreLabel>
                          {getQuizScore() >= 2
                            ? 'Great job! You can mark this lesson as complete.'
                            : 'Review the lesson and try again!'
                          }
                        </ScoreLabel>
                      </ScoreDisplay>
                      <CompleteButton onClick={completeLesson}>
                        <FaCheckCircle /> Mark Lesson as Complete
                      </CompleteButton>
                    </>
                  )}
                </QuizSection>
              </ModalBody>
            </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </PageContainer>
  );
};

export default LearnPage;
