import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaPaperPlane, FaRobot, FaTrash, FaLightbulb, FaNewspaper, FaTimes } from 'react-icons/fa';
import { useSearchParams } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../AuthContext';
import {
  getMentorContext,
  buildMentorContextPayload,
  getHeadlinesDecodedCount,
  getStreak,
} from '../utils/learningState';

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
`;

const Page = styled.div`
  flex: 1;
  min-height: 0;
  height: ${(p) => (p.$embedded ? '100%' : 'calc(100vh - 64px)')};
  margin-top: ${(p) => (p.$embedded ? '0' : '64px')};
  display: flex;
  flex-direction: column;
  background: ${(p) => (p.$embedded ? 'transparent' : '#f8fafc')};
  font-family: 'Inter', system-ui, sans-serif;
  overflow: hidden;
`;

const Shell = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: ${(p) => (p.$embedded ? 'none' : '960px')};
  width: 100%;
  margin: 0 auto;
  padding: ${(p) => (p.$embedded ? '0' : '0.85rem 1rem 1rem')};
  min-height: 0;
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: ${(p) => (p.$embedded ? '0' : '0.65rem')};
  flex-shrink: 0;
  padding: ${(p) => (p.$embedded ? '0.65rem clamp(1rem, 5vw, 3rem) 0.5rem' : '0')};
  border-bottom: ${(p) => (p.$embedded ? '1px solid #f1f5f9' : 'none')};
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 0.55rem;
`;

const BrandIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, #15803d, #0f766e);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
`;

const BrandText = styled.div``;

const BrandTitle = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 800;
  font-size: 0.95rem;
  color: #0f172a;
  line-height: 1.2;
`;

const BrandSub = styled.div`
  font-size: 0.72rem;
  color: #64748b;
`;

const ClearBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.45rem 0.75rem;
  border-radius: 8px;
  border: 1px solid rgba(15, 23, 42, 0.1);
  background: #fff;
  font-size: 0.75rem;
  font-weight: 700;
  color: #64748b;
  cursor: pointer;
  &:hover:not(:disabled) {
    border-color: rgba(239, 68, 68, 0.35);
    color: #dc2626;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ContextBanner = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  padding: 0.65rem 0.85rem;
  border-radius: 10px;
  background: rgba(34, 197, 94, 0.08);
  border: 1px solid rgba(34, 197, 94, 0.22);
  margin-bottom: 0.55rem;
  flex-shrink: 0;
`;

const ContextBody = styled.div`
  flex: 1;
  min-width: 0;
  font-size: 0.8rem;
  color: #475569;
  line-height: 1.4;
`;

const DismissBtn = styled.button`
  border: none;
  background: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 0.15rem;
  flex-shrink: 0;
  &:hover {
    color: #64748b;
  }
`;

const ChatCard = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: ${(p) => (p.$embedded ? 'transparent' : '#fff')};
  border: ${(p) => (p.$embedded ? 'none' : '1px solid rgba(15, 23, 42, 0.08)')};
  border-radius: ${(p) => (p.$embedded ? '0' : '14px')};
  box-shadow: ${(p) =>
    p.$embedded ? 'none' : '0 4px 24px rgba(15, 23, 42, 0.05)'};
  overflow: hidden;
  min-height: 0;
`;

const Messages = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  overscroll-behavior: contain;
  padding: ${(p) => (p.$embedded ? '1rem clamp(1rem, 5vw, 3rem)' : '0.85rem 1rem')};
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
  }
`;

const Bubble = styled.div`
  max-width: ${(p) =>
    p.$embedded
      ? p.$isUser
        ? 'min(520px, 72%)'
        : 'min(820px, 100%)'
      : '85%'};
  align-self: ${(p) => (p.$isUser ? 'flex-end' : 'flex-start')};
  padding: 0.85rem 1rem;
  border-radius: ${(p) => (p.$isUser ? '14px 14px 4px 14px' : '14px 14px 14px 4px')};
  background: ${(p) =>
    p.$isUser ? 'linear-gradient(135deg, #0f172a, #14532d)' : '#f8fafc'};
  color: ${(p) => (p.$isUser ? '#fff' : '#0f172a')};
  font-size: 0.9rem;
  line-height: 1.65;
  word-break: break-word;

  /* markdown elements */
  p { margin: 0 0 0.6rem; &:last-child { margin-bottom: 0; } }
  strong { font-weight: 700; color: ${(p) => (p.$isUser ? '#86efac' : '#15803d')}; }
  ul, ol { margin: 0.4rem 0 0.6rem 1.15rem; padding: 0; }
  li { margin-bottom: 0.3rem; }
  code {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 0.82rem;
    background: ${(p) => (p.$isUser ? 'rgba(255,255,255,.12)' : 'rgba(15,23,42,.07)')};
    padding: 0.1em 0.35em;
    border-radius: 4px;
  }
  h1, h2, h3, h4 {
    font-size: 0.9rem;
    font-weight: 700;
    margin: 0.45rem 0 0.3rem;
  }
`;

const Typing = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: #64748b;
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

const CategoryRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  padding: ${(p) => (p.$embedded ? '0.55rem clamp(1rem, 5vw, 3rem) 0.5rem' : '0.55rem 0.85rem 0.5rem')};
  border-top: 1px solid #f1f5f9;
  flex-shrink: 0;
  max-height: 88px;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const CatLabel = styled.span`
  font-size: 0.65rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #94a3b8;
  width: 100%;
  margin-bottom: 0.15rem;
`;

const PromptChip = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.4rem 0.7rem;
  border-radius: 999px;
  border: 1px solid rgba(34, 197, 94, 0.22);
  background: rgba(34, 197, 94, 0.06);
  font-size: 0.74rem;
  font-weight: 600;
  color: #15803d;
  cursor: pointer;
  transition: background 0.15s;
  &:hover:not(:disabled) {
    background: rgba(34, 197, 94, 0.12);
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const InputRow = styled.form`
  display: flex;
  gap: 0.5rem;
  padding: ${(p) => (p.$embedded ? '0.85rem clamp(1rem, 5vw, 3rem)' : '0.75rem 0.85rem')};
  border-top: 1px solid rgba(15, 23, 42, 0.06);
  background: #fff;
  flex-shrink: 0;
`;

const Input = styled.textarea`
  flex: 1;
  resize: none;
  min-height: 44px;
  max-height: 100px;
  padding: 0.6rem 0.85rem;
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
  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

function cleanReply(text) {
  if (!text) return '';
  return text
    .replace(/<\/?[a-zA-Z][^>]*>/g, '')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^\s*[-*_]{3,}\s*$/gm, '')
    .replace(/^>\s+/gm, '')
    .replace(/^\s*[\r\n]+/, '')
    .replace(/[\r\n]{3,}/g, '\n\n')
    .trim();
}

// Lightweight inline markdown → React elements (no external deps)
function MdLine({ text }) {
  // Split on **bold** spans
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**')
          ? <strong key={i}>{part.slice(2, -2)}</strong>
          : part
      )}
    </>
  );
}

function MentorMarkdown({ children }) {
  if (!children) return null;
  const lines = children.split('\n');
  const elements = [];
  let listBuf = [];
  let olBuf = [];
  let key = 0;

  const flushUl = () => {
    if (listBuf.length) {
      elements.push(
        <ul key={key++}>
          {listBuf.map((item, i) => <li key={i}><MdLine text={item} /></li>)}
        </ul>
      );
      listBuf = [];
    }
  };
  const flushOl = () => {
    if (olBuf.length) {
      elements.push(
        <ol key={key++}>
          {olBuf.map((item, i) => <li key={i}><MdLine text={item} /></li>)}
        </ol>
      );
      olBuf = [];
    }
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line) {
      flushUl(); flushOl();
      continue;
    }
    const ulMatch = line.match(/^[-*•]\s+(.+)/);
    const olMatch = line.match(/^\d+\.\s+(.+)/);
    if (ulMatch) {
      flushOl();
      listBuf.push(ulMatch[1]);
    } else if (olMatch) {
      flushUl();
      olBuf.push(olMatch[1]);
    } else {
      flushUl(); flushOl();
      elements.push(<p key={key++}><MdLine text={line} /></p>);
    }
  }
  flushUl(); flushOl();
  return <>{elements}</>;
}

const WELCOME =
  "Hi — I'm your BloomVest Copilot.\n\n" +
  'Ask me anything about money, markets, or investing — from first principles to advanced topics. I teach and explain; I never tell you what to buy or sell.\n\n' +
  'Pick a topic below or type your question.';

const TOPICS = [
  {
    label: 'Basics',
    prompts: [
      'Explain investing like I\'m completely new.',
      'What is diversification and why does it matter?',
      'How much should I keep in an emergency fund?',
    ],
  },
  {
    label: 'Markets',
    prompts: [
      'Why do interest rates affect stock prices?',
      'How do I read a company earnings report?',
      'What does inflation mean for my savings?',
    ],
  },
  {
    label: 'Portfolio',
    prompts: [
      'Explain index funds vs individual stocks.',
      'What mistakes do beginners make?',
      'How should I think about risk tolerance?',
    ],
  },
];

function contextualPrompts(ctx) {
  if (ctx?.source === 'headline-decoder' && ctx.headline) {
    const h = ctx.headline.slice(0, 90);
    return [
      `Explain this headline: "${h}"`,
      'What should I study before reacting to news like this?',
      ctx.topicLabel ? `How does "${ctx.topicLabel}" affect long-term investors?` : 'How does this tie to diversification?',
    ];
  }
  if (ctx?.source === 'market-lab') {
    return [
      'How do I use Market Lab without treating it as stock picks?',
      'What checklist should I use before researching a company?',
      'Explain risk vs reward with a simple example.',
    ];
  }
  return TOPICS.flatMap((t) => t.prompts.slice(0, 1));
}

export default function MentorPage({ embedded = false }) {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [ctxDismissed, setCtxDismissed] = useState(false);
  const bottomRef = useRef(null);
  const initialQuerySent = useRef(false);
  const storedCtx = getMentorContext();
  const showCtx = storedCtx?.headline && !ctxDismissed;

  const flatPrompts = useMemo(() => contextualPrompts(storedCtx), [storedCtx?.source, storedCtx?.headline, storedCtx?.topicLabel]);
  const showTopics = historyLoaded && messages.length <= 1 && !loading;

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
            }))
          );
        } else {
          setMessages([{ role: 'assistant', content: WELCOME }]);
        }
      } catch {
        if (!cancelled) setMessages([{ role: 'assistant', content: WELCOME }]);
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

      setMessages((prev) => [...prev, { role: 'user', content: trimmed }]);
      setInput('');
      setLoading(true);

      try {
        const contextPayload = buildMentorContextPayload({
          user,
          progress: { headlinesDecoded: getHeadlinesDecodedCount() },
          streak: getStreak(),
        });
        const { reply } = await api.chat(trimmed, contextPayload);
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: reply || 'I could not generate a response. Please try again.' },
        ]);
      } catch (e) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: `Sorry — I couldn't reach the server (${e.message || 'network error'}). Make sure the backend is running.`,
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [loading, user]
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
    setMessages([{ role: 'assistant', content: WELCOME }]);
  };

  return (
    <Page $embedded={embedded}>
      <Shell $embedded={embedded}>
        <TopBar $embedded={embedded}>
          <Brand>
            <BrandIcon>
              <FaRobot />
            </BrandIcon>
            <BrandText>
              <BrandTitle>{embedded ? 'Copilot' : 'AI Mentor'}</BrandTitle>
              <BrandSub>Educational only · never buy/sell advice</BrandSub>
            </BrandText>
          </Brand>
          <ClearBtn type="button" onClick={handleClear} disabled={loading || !historyLoaded}>
            <FaTrash /> Clear
          </ClearBtn>
        </TopBar>

        {showCtx && (
          <ContextBanner style={embedded ? { margin: '0 clamp(1rem, 5vw, 3rem) 0.55rem' } : undefined}>
            <FaNewspaper style={{ color: '#15803d', marginTop: 2, flexShrink: 0 }} />
            <ContextBody>
              <strong style={{ color: '#0f172a' }}>
                {storedCtx.source === 'market-lab' ? 'From Market Lab' : 'From Bloomvest IQ'}
              </strong>
              {storedCtx.topicLabel && ` · ${storedCtx.topicLabel}`}
              {' — '}
              {storedCtx.headline.length > 120
                ? `${storedCtx.headline.slice(0, 120)}…`
                : storedCtx.headline}
            </ContextBody>
            <DismissBtn type="button" onClick={() => setCtxDismissed(true)} aria-label="Dismiss">
              <FaTimes />
            </DismissBtn>
          </ContextBanner>
        )}

        <ChatCard $embedded={embedded}>
          <Messages $embedded={embedded}>
            {!historyLoaded ? (
              <Typing>
                <span />
                <span />
                <span />
                Loading…
              </Typing>
            ) : (
              messages.map((m, i) => (
                <Bubble key={`${i}-${m.role}`} $isUser={m.role === 'user'} $embedded={embedded}>
                  {m.role === 'user' ? (
                    m.content
                  ) : (
                    <MentorMarkdown>{cleanReply(m.content)}</MentorMarkdown>
                  )}
                </Bubble>
              ))
            )}
            {loading && (
              <Typing>
                <span />
                <span />
                <span />
                Thinking…
              </Typing>
            )}
            <div ref={bottomRef} />
          </Messages>

          {showTopics && (
            <CategoryRow $embedded={embedded}>
              <CatLabel>Suggested topics</CatLabel>
              {TOPICS.map((topic) =>
                topic.prompts.slice(0, 2).map((q) => (
                  <PromptChip key={q} type="button" disabled={loading} onClick={() => sendMessage(q)}>
                    <FaLightbulb /> {q.length > 42 ? `${q.slice(0, 42)}…` : q}
                  </PromptChip>
                ))
              )}
              {flatPrompts.slice(0, 2).map((q) => (
                <PromptChip key={`ctx-${q}`} type="button" disabled={loading} onClick={() => sendMessage(q)}>
                  <FaLightbulb /> {q.length > 42 ? `${q.slice(0, 42)}…` : q}
                </PromptChip>
              ))}
            </CategoryRow>
          )}

          <InputRow onSubmit={handleSubmit} $embedded={embedded}>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Ask about money, markets, investing…"
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
