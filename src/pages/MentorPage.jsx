import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaPaperPlane, FaRobot, FaTrash, FaLightbulb } from 'react-icons/fa';
import { useSearchParams } from 'react-router-dom';
import { api } from '../api';
import { PRODUCT_MISSION } from '../config/platform';
import { useAuth } from '../AuthContext';
import {
  getMentorContext,
  buildMentorContextPayload,
  getHeadlinesDecodedCount,
  getLearningPathId,
} from '../utils/learningState';
import { getPathProgress } from '../config/learningPaths';

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
`;

const Page = styled.div`
  min-height: calc(100vh - 64px);
  padding: 1.25rem 1.5rem 2rem;
  margin-top: 64px;
  background: linear-gradient(180deg, #f8fafc 0%, #f0fdf4 40%, #fafbfc 100%);
  font-family: 'Inter', system-ui, sans-serif;
`;

const Shell = styled.div`
  max-width: 920px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: calc(100vh - 64px - 3rem);
  min-height: 520px;
`;

const Header = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
`;

const TitleBlock = styled.div``;

const Eyebrow = styled.div`
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #15803d;
  margin-bottom: 0.35rem;
`;

const Title = styled.h1`
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 800;
  color: #0a0f1e;
  margin: 0 0 0.35rem;
  letter-spacing: -0.03em;
`;

const Sub = styled.p`
  margin: 0;
  font-size: 0.92rem;
  color: rgba(15, 23, 42, 0.55);
  max-width: 36em;
  line-height: 1.5;
`;

const ClearBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 0.85rem;
  border-radius: 8px;
  border: 1px solid rgba(15, 23, 42, 0.1);
  background: #fff;
  font-size: 0.78rem;
  font-weight: 700;
  color: #64748b;
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s;
  &:hover:not(:disabled) {
    border-color: rgba(239, 68, 68, 0.35);
    color: #dc2626;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ChatCard = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(15, 23, 42, 0.06);
  overflow: hidden;
  min-height: 0;
`;

const Messages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
`;

const Bubble = styled.div`
  max-width: 88%;
  align-self: ${(p) => (p.$isUser ? 'flex-end' : 'flex-start')};
  padding: 0.85rem 1rem;
  border-radius: ${(p) => (p.$isUser ? '14px 14px 4px 14px' : '14px 14px 14px 4px')};
  background: ${(p) =>
    p.$isUser
      ? 'linear-gradient(135deg, #0f172a, #14532d)'
      : 'rgba(15, 23, 42, 0.04)'};
  color: ${(p) => (p.$isUser ? '#fff' : '#0f172a')};
  font-size: 0.9rem;
  line-height: 1.55;
  white-space: pre-wrap;
`;

const Typing = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.82rem;
  color: #64748b;
  padding: 0.5rem 0;
  span {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #22c55e;
    animation: ${pulse} 1.2s ease infinite;
    &:nth-child(2) {
      animation-delay: 0.15s;
    }
    &:nth-child(3) {
      animation-delay: 0.3s;
    }
  }
`;

const Prompts = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  padding: 0 1.25rem 0.75rem;
`;

const PromptChip = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.45rem 0.75rem;
  border-radius: 999px;
  border: 1px solid rgba(34, 197, 94, 0.25);
  background: rgba(34, 197, 94, 0.06);
  font-size: 0.75rem;
  font-weight: 600;
  color: #15803d;
  cursor: pointer;
  transition: background 0.15s, transform 0.15s;
  &:hover:not(:disabled) {
    background: rgba(34, 197, 94, 0.12);
    transform: translateY(-1px);
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const InputRow = styled.form`
  display: flex;
  gap: 0.5rem;
  padding: 0.85rem 1rem;
  border-top: 1px solid rgba(15, 23, 42, 0.06);
  background: #fff;
`;

const Input = styled.textarea`
  flex: 1;
  resize: none;
  min-height: 44px;
  max-height: 120px;
  padding: 0.65rem 0.85rem;
  border-radius: 10px;
  border: 1px solid rgba(15, 23, 42, 0.12);
  font-family: inherit;
  font-size: 0.9rem;
  line-height: 1.4;
  &:focus {
    outline: none;
    border-color: rgba(34, 197, 94, 0.45);
    box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
  }
`;

const SendBtn = styled.button`
  width: 44px;
  height: 44px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(135deg, #15803d, #0f766e);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: opacity 0.15s, transform 0.15s;
  &:hover:not(:disabled) {
    transform: scale(1.04);
  }
  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

const EmptyState = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
  color: rgba(15, 23, 42, 0.5);
  gap: 0.75rem;
`;

const ContextBanner = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.65rem;
  padding: 0.85rem 1rem;
  border-radius: 12px;
  background: linear-gradient(90deg, rgba(34, 197, 94, 0.1), rgba(139, 92, 246, 0.06));
  border: 1px solid rgba(34, 197, 94, 0.22);
  margin-bottom: 0.25rem;
`;

const ContextIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: #15803d;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 0.95rem;
`;

const ContextTitle = styled.div`
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #15803d;
  margin-bottom: 0.15rem;
`;

const ContextText = styled.div`
  font-size: 0.85rem;
  color: #475569;
  line-height: 1.45;
`;

const EmptyIcon = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 14px;
  background: rgba(34, 197, 94, 0.12);
  color: #15803d;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
`;

const SUGGESTED = [
  'Explain options simply — like I\'m new to investing.',
  'Why do interest rates matter for my savings?',
  'What is diversification and why does it matter?',
  'How do I read a company earnings report?',
  'What mistakes do beginners make when they start investing?',
];

const WELCOME =
  `Hi — I'm your BloomVest AI Mentor. ${PRODUCT_MISSION}\n\n` +
  'Ask me anything about money, markets, or investing concepts. I teach and explain — I do not tell you what to buy or sell.\n\n' +
  'Try a prompt below or type your own question.';

function formatTime(iso) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleTimeString(undefined, { timeStyle: 'short' });
  } catch {
    return '';
  }
}

function contextualPrompts(ctx) {
  if (ctx?.source === 'headline-decoder' && ctx.headline) {
    const h = ctx.headline.slice(0, 100);
    return [
      `Explain this headline in plain English: "${h}"`,
      'What should a beginner study before reacting to news like this?',
      'What are common mistakes people make when headlines like this go viral?',
      ctx.topicLabel ? `How does "${ctx.topicLabel}" connect to long-term investing?` : 'How does this tie to diversification?',
    ];
  }
  if (ctx?.source === 'market-lab') {
    return [
      'How should I use case studies from Market Lab without treating them as stock picks?',
      'What is a good checklist before researching a company deeper?',
      'Explain risk vs reward using a simple example.',
      'What does “study focus” mean vs buying a stock?',
    ];
  }
  if (ctx?.lessonTitle) {
    return [
      `Quiz me on concepts from: ${ctx.lessonTitle}`,
      'Give me a real-world example of what I just learned.',
      'What should I practice next after this lesson?',
    ];
  }
  return SUGGESTED;
}

export default function MentorPage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [courseProgress, setCourseProgress] = useState(null);
  const bottomRef = useRef(null);
  const initialQuerySent = useRef(false);
  const mentorCtx = getMentorContext();

  const pathProgress = useMemo(
    () => getPathProgress(
      getLearningPathId(),
      courseProgress?.courses || [],
      courseProgress?.completedIds || [],
      getHeadlinesDecodedCount()
    ),
    [courseProgress]
  );

  const prompts = useMemo(() => contextualPrompts(mentorCtx), [mentorCtx?.source, mentorCtx?.headline, mentorCtx?.topicLabel, mentorCtx?.lessonTitle]);

  useEffect(() => {
    if (!user) {
      setCourseProgress(null);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const [coursesRes, progressRes] = await Promise.all([
          api.getCourses(),
          api.getCourseProgress(),
        ]);
        if (!cancelled) {
          setCourseProgress({
            courses: coursesRes.courses || [],
            completedIds: progressRes.completedIds || [],
            completedLessons: progressRes.completedLessons,
            totalLessons: progressRes.totalLessons,
          });
        }
      } catch {
        if (!cancelled) setCourseProgress(null);
      }
    })();
    return () => { cancelled = true; };
  }, [user]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { messages: hist } = await api.getChatHistory();
        if (cancelled) return;
        if (hist?.length) {
          setMessages(
            hist.map((m) => ({
              role: m.role === 'user' ? 'user' : 'assistant',
              content: m.content,
              time: m.created_at,
            }))
          );
        } else {
          setMessages([{ role: 'assistant', content: WELCOME, time: null }]);
        }
      } catch {
        if (!cancelled) {
          setMessages([{ role: 'assistant', content: WELCOME, time: null }]);
        }
      } finally {
        if (!cancelled) setHistoryLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = useCallback(
    async (text) => {
      const trimmed = (text || '').trim();
      if (!trimmed || loading) return;

      const userMsg = { role: 'user', content: trimmed, time: new Date().toISOString() };
      setMessages((prev) => [...prev, userMsg]);
      setInput('');
      setLoading(true);

      try {
        const contextPayload = buildMentorContextPayload({
          user,
          progress: courseProgress,
          pathProgress,
        });
        const { reply } = await api.chat(trimmed, contextPayload);
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: reply || 'I could not generate a response. Please try again.', time: new Date().toISOString() },
        ]);
      } catch (e) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: `Sorry — I couldn't reach the server (${e.message || 'network error'}). Make sure the backend is running.`,
            time: new Date().toISOString(),
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [loading, user, courseProgress, pathProgress]
  );

  useEffect(() => {
    const q = searchParams.get('q');
    if (!q || !historyLoaded || initialQuerySent.current) return;
    initialQuerySent.current = true;
    sendMessage(q);
  }, [historyLoaded, searchParams, sendMessage]);

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleClear = async () => {
    try {
      await api.clearChatHistory();
    } catch {
      /* ignore */
    }
    setMessages([{ role: 'assistant', content: WELCOME, time: null }]);
  };

  return (
    <Page>
      <Shell>
        <Header>
          <TitleBlock>
            <Eyebrow>Layer 5 · AI Mentor</Eyebrow>
            <Title>Your investing tutor, on demand</Title>
            <Sub>
              Concepts, macro, portfolio thinking, and habit coaching — educational only, never personalized buy/sell advice.
            </Sub>
          </TitleBlock>
          <ClearBtn type="button" onClick={handleClear} disabled={loading || !historyLoaded}>
            <FaTrash /> Clear chat
          </ClearBtn>
        </Header>

        {mentorCtx?.headline && (
          <ContextBanner>
            <ContextIcon>
              <FaNewspaper />
            </ContextIcon>
            <div>
              <ContextTitle>
                {mentorCtx.source === 'market-lab' ? 'From Market Lab' : 'Continuing from Bloomvest IQ'}
              </ContextTitle>
              <ContextText>
                {mentorCtx.topicLabel && (
                  <strong style={{ color: '#0f172a' }}>{mentorCtx.topicLabel}</strong>
                )}
                {mentorCtx.topicLabel && ' — '}
                {mentorCtx.headline.length > 140
                  ? `${mentorCtx.headline.slice(0, 140)}…`
                  : mentorCtx.headline}
              </ContextText>
            </div>
          </ContextBanner>
        )}

        <ChatCard>
          <Messages>
            {!historyLoaded ? (
              <Typing>
                <span />
                <span />
                <span />
                Loading conversation…
              </Typing>
            ) : messages.length === 0 ? (
              <EmptyState>
                <EmptyIcon>
                  <FaRobot />
                </EmptyIcon>
                <div>Start a conversation with your mentor.</div>
              </EmptyState>
            ) : (
              messages.map((m, i) => (
                <Bubble key={`${i}-${m.role}`} $isUser={m.role === 'user'}>
                  {m.content}
                </Bubble>
              ))
            )}
            {loading && (
              <Typing>
                <span />
                <span />
                <span />
                Mentor is thinking…
              </Typing>
            )}
            <div ref={bottomRef} />
          </Messages>

          <Prompts>
            {prompts.map((q) => (
              <PromptChip key={q} type="button" disabled={loading} onClick={() => sendMessage(q)}>
                <FaLightbulb /> {q.length > 48 ? `${q.slice(0, 48)}…` : q}
              </PromptChip>
            ))}
          </Prompts>

          <InputRow onSubmit={handleSubmit}>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Ask anything about money, markets, or investing…"
              rows={1}
              disabled={loading}
            />
            <SendBtn type="submit" disabled={loading || !input.trim()} aria-label="Send">
              <FaPaperPlane />
            </SendBtn>
          </InputRow>
        </ChatCard>
      </Shell>
    </Page>
  );
}
