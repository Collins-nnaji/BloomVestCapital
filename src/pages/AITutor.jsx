import React, { useState, useRef, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPaperPlane, FaRobot, FaUser, FaLightbulb, FaBookOpen, FaChartLine, FaShieldAlt, FaCoins, FaBrain, FaTrash } from 'react-icons/fa';
import { api } from '../api';

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0f1c 0%, #111827 100%);
  display: flex;
  flex-direction: column;
`;

const Header = styled.section`
  background: linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(139,92,246,0.05) 100%);
  border-bottom: 1px solid rgba(139,92,246,0.15);
  padding: 2rem 1.5rem 1.5rem;
`;

const HeaderContent = styled.div`
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HeaderLeft = styled.div``;

const HeaderTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 800;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 0.25rem;
  span { color: #a78bfa; }
  svg { color: #a78bfa; font-size: 1.3rem; }
`;

const HeaderSubtitle = styled.p`
  color: rgba(255,255,255,0.5);
  font-size: 0.85rem;
`;

const ClearButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1rem;
  background: rgba(239,68,68,0.1);
  border: 1px solid rgba(239,68,68,0.2);
  border-radius: 10px;
  color: #f87171;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  &:hover { background: rgba(239,68,68,0.2); }
`;

const ChatArea = styled.div`
  flex: 1;
  max-width: 900px;
  width: 100%;
  margin: 0 auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-bottom: 1rem;
  min-height: 400px;
`;

const MessageGroup = styled(motion.div)`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
  align-items: flex-start;
  flex-direction: ${props => props.$isUser ? 'row-reverse' : 'row'};
`;

const Avatar = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 0.9rem;
  background: ${props => props.$isUser ? 'linear-gradient(135deg, #1e293b, #334155)' : 'linear-gradient(135deg, #7c3aed, #a78bfa)'};
  color: white;
  border: 1px solid ${props => props.$isUser ? 'rgba(255,255,255,0.1)' : 'rgba(167,139,250,0.3)'};
`;

const MessageBubble = styled.div`
  max-width: 78%;
  padding: 1rem 1.15rem;
  border-radius: ${props => props.$isUser ? '14px 14px 4px 14px' : '14px 14px 14px 4px'};
  background: ${props => props.$isUser ? 'linear-gradient(135deg, #1e293b, #1e293b)' : 'rgba(255,255,255,0.05)'};
  color: ${props => props.$isUser ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.85)'};
  border: 1px solid ${props => props.$isUser ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.06)'};
  font-size: 0.9rem;
  line-height: 1.7;
  white-space: pre-wrap;
  strong { font-weight: 700; color: #a78bfa; }
  @media (max-width: 768px) { max-width: 88%; }
`;

const InputArea = styled.div`
  background: rgba(255,255,255,0.04);
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,0.08);
  padding: 0.6rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: border-color 0.3s;
  &:focus-within { border-color: rgba(139,92,246,0.4); }
`;

const ChatInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  font-size: 0.95rem;
  color: white;
  padding: 0.5rem 0.75rem;
  background: transparent;
  &::placeholder { color: rgba(255,255,255,0.3); }
`;

const SendButton = styled.button`
  width: 42px;
  height: 42px;
  border-radius: 10px;
  background: linear-gradient(135deg, #7c3aed, #8b5cf6);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  flex-shrink: 0;
  &:hover:not(:disabled) { transform: scale(1.05); box-shadow: 0 4px 15px rgba(124,58,237,0.4); }
  &:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
`;

const SuggestionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 0.6rem;
  margin-bottom: 1.5rem;
`;

const SuggestionCard = styled(motion.button)`
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 12px;
  padding: 0.9rem;
  text-align: left;
  cursor: pointer;
  transition: all 0.3s;
  &:hover { border-color: rgba(139,92,246,0.3); background: rgba(139,92,246,0.05); transform: translateY(-1px); }
`;

const SuggestionIcon = styled.div`
  font-size: 1.1rem;
  margin-bottom: 0.4rem;
  color: #a78bfa;
`;

const SuggestionText = styled.div`
  font-weight: 600;
  font-size: 0.8rem;
  color: rgba(255,255,255,0.7);
  line-height: 1.3;
`;

const TypingIndicator = styled(motion.div)`
  display: flex;
  gap: 0.3rem;
  padding: 0.5rem 0;
`;

const TypingDot = styled(motion.div)`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #a78bfa;
`;

const PoweredBy = styled.div`
  text-align: center;
  padding: 0.75rem;
  color: rgba(255,255,255,0.25);
  font-size: 0.7rem;
  font-weight: 500;
`;

const suggestedQuestions = [
  { icon: <FaLightbulb />, text: 'What is investing and how do I start?' },
  { icon: <FaChartLine />, text: 'How does the stock market work?' },
  { icon: <FaShieldAlt />, text: 'How do I manage investment risk?' },
  { icon: <FaCoins />, text: 'What are ETFs and index funds?' },
  { icon: <FaBookOpen />, text: 'How do I build my first portfolio?' },
  { icon: <FaBrain />, text: 'Tell me about compound interest' },
];

const formatMessage = (text) => {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>');
};

const AITutor = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! 👋 I'm **BloomVest AI**, your personal investment tutor powered by GPT-4. Ask me anything about investing — from the basics to advanced strategies. I remember our conversation, so feel free to build on previous questions!"
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => { scrollToBottom(); }, [messages, isTyping]);

  const loadHistory = useCallback(async () => {
    try {
      const data = await api.getChatHistory();
      if (data.messages && data.messages.length > 0) {
        setMessages(data.messages.map(m => ({ role: m.role, content: m.content })));
      }
    } catch (e) {
      console.log('Could not load chat history');
    }
    setLoaded(true);
  }, []);

  useEffect(() => { loadHistory(); }, [loadHistory]);

  const sendMessage = async (text) => {
    if (!text.trim() || isTyping) return;

    const userMessage = { role: 'user', content: text.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const data = await api.chat(text.trim());
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm having trouble connecting right now. Please try again in a moment." }]);
    }
    setIsTyping(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const clearHistory = async () => {
    try {
      await api.clearChatHistory();
      setMessages([{
        role: 'assistant',
        content: "Chat cleared! 🧹 I'm ready for a fresh start. What would you like to learn about investing?"
      }]);
    } catch (e) {
      console.error('Failed to clear history');
    }
  };

  const showSuggestions = messages.length <= 1;

  return (
    <PageContainer>
      <Header>
        <HeaderContent>
          <HeaderLeft>
            <HeaderTitle><FaRobot /> BloomVest <span>AI</span></HeaderTitle>
            <HeaderSubtitle>Powered by GPT-4 — Ask anything about investing</HeaderSubtitle>
          </HeaderLeft>
          <ClearButton onClick={clearHistory}>
            <FaTrash /> Clear Chat
          </ClearButton>
        </HeaderContent>
      </Header>

      <ChatArea>
        <MessagesContainer>
          {messages.map((msg, index) => (
            <MessageGroup
              key={index}
              $isUser={msg.role === 'user'}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <Avatar $isUser={msg.role === 'user'}>
                {msg.role === 'user' ? <FaUser /> : <FaRobot />}
              </Avatar>
              <MessageBubble
                $isUser={msg.role === 'user'}
                dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
              />
            </MessageGroup>
          ))}

          {isTyping && (
            <MessageGroup $isUser={false}>
              <Avatar $isUser={false}><FaRobot /></Avatar>
              <MessageBubble $isUser={false}>
                <TypingIndicator>
                  <TypingDot animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} />
                  <TypingDot animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.15 }} />
                  <TypingDot animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.3 }} />
                </TypingIndicator>
              </MessageBubble>
            </MessageGroup>
          )}
          <div ref={messagesEndRef} />
        </MessagesContainer>

        {showSuggestions && (
          <SuggestionsGrid>
            {suggestedQuestions.map((q, i) => (
              <SuggestionCard key={i} onClick={() => sendMessage(q.text)}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <SuggestionIcon>{q.icon}</SuggestionIcon>
                <SuggestionText>{q.text}</SuggestionText>
              </SuggestionCard>
            ))}
          </SuggestionsGrid>
        )}

        <form onSubmit={handleSubmit}>
          <InputArea>
            <ChatInput
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask me anything about investing..."
              disabled={isTyping}
            />
            <SendButton type="submit" disabled={!input.trim() || isTyping}>
              <FaPaperPlane />
            </SendButton>
          </InputArea>
        </form>
        <PoweredBy>Powered by OpenAI GPT-4 — For educational purposes only</PoweredBy>
      </ChatArea>
    </PageContainer>
  );
};

export default AITutor;
