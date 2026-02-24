import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPaperPlane, FaRobot, FaUser, FaLightbulb, FaBookOpen, FaChartLine, FaShieldAlt, FaCoins, FaBrain } from 'react-icons/fa';
import { getAIResponse } from '../data/aiResponses';

const PageContainer = styled.div`
  min-height: 100vh;
  background: #f8fafc;
  display: flex;
  flex-direction: column;
`;

const Header = styled.section`
  background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%);
  padding: 3.5rem 1.5rem 2.5rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -30%;
    right: -10%;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%);
  }
`;

const HeaderContent = styled.div`
  max-width: 900px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const HeaderTitle = styled.h1`
  font-size: 2.2rem;
  font-weight: 800;
  color: white;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  span { color: #a78bfa; }
  svg { color: #a78bfa; }
  @media (max-width: 768px) { font-size: 1.8rem; }
`;

const HeaderSubtitle = styled.p`
  color: rgba(255,255,255,0.6);
  font-size: 1rem;
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
  margin-bottom: 1.5rem;
  align-items: flex-start;
  flex-direction: ${props => props.isUser ? 'row-reverse' : 'row'};
`;

const Avatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 1rem;
  background: ${props => props.isUser ? '#0f172a' : 'linear-gradient(135deg, #7c3aed, #a78bfa)'};
  color: white;
`;

const MessageBubble = styled.div`
  max-width: 80%;
  padding: 1rem 1.25rem;
  border-radius: ${props => props.isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px'};
  background: ${props => props.isUser ? '#0f172a' : 'white'};
  color: ${props => props.isUser ? 'white' : '#334155'};
  box-shadow: ${props => props.isUser ? 'none' : '0 2px 8px rgba(0,0,0,0.06)'};
  border: ${props => props.isUser ? 'none' : '1px solid #e2e8f0'};
  font-size: 0.95rem;
  line-height: 1.7;
  white-space: pre-wrap;

  strong { font-weight: 700; }

  @media (max-width: 768px) { max-width: 90%; }
`;

const InputArea = styled.div`
  background: white;
  border-radius: 16px;
  border: 2px solid #e2e8f0;
  padding: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: border-color 0.3s;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);

  &:focus-within { border-color: #8b5cf6; }
`;

const ChatInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  font-size: 1rem;
  color: #334155;
  padding: 0.5rem;

  &::placeholder { color: #94a3b8; }
`;

const SendButton = styled.button`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, #7c3aed, #8b5cf6);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  flex-shrink: 0;

  &:hover { transform: scale(1.05); box-shadow: 0 4px 12px rgba(124,58,237,0.3); }
  &:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
`;

const SuggestionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`;

const SuggestionCard = styled(motion.button)`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1rem;
  text-align: left;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    border-color: #8b5cf6;
    box-shadow: 0 4px 12px rgba(139,92,246,0.1);
    transform: translateY(-2px);
  }
`;

const SuggestionIcon = styled.div`
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: #8b5cf6;
`;

const SuggestionText = styled.div`
  font-weight: 600;
  font-size: 0.85rem;
  color: #334155;
  line-height: 1.3;
`;

const TypingIndicator = styled(motion.div)`
  display: flex;
  gap: 0.3rem;
  padding: 0.5rem 0;
`;

const TypingDot = styled(motion.div)`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #8b5cf6;
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
      content: "Hello! 👋 I'm your **AI Investment Tutor**. I'm here to help you learn about investing in a clear, easy-to-understand way.\n\nAsk me anything about stocks, bonds, ETFs, portfolio building, risk management, or any investing topic. No question is too basic!\n\nYou can also try the suggested topics below to get started."
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    const userMessage = { role: 'user', content: text.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));

    const response = getAIResponse(text);
    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    setIsTyping(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleSuggestion = (text) => {
    sendMessage(text);
  };

  const showSuggestions = messages.length <= 1;

  return (
    <PageContainer>
      <Header>
        <HeaderContent>
          <HeaderTitle>
            <FaRobot /> AI Investment <span>Tutor</span>
          </HeaderTitle>
          <HeaderSubtitle>
            Ask any investment question and get instant, clear explanations.
          </HeaderSubtitle>
        </HeaderContent>
      </Header>

      <ChatArea>
        <MessagesContainer>
          {messages.map((msg, index) => (
            <MessageGroup
              key={index}
              isUser={msg.role === 'user'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Avatar isUser={msg.role === 'user'}>
                {msg.role === 'user' ? <FaUser /> : <FaRobot />}
              </Avatar>
              <MessageBubble
                isUser={msg.role === 'user'}
                dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
              />
            </MessageGroup>
          ))}

          {isTyping && (
            <MessageGroup isUser={false}>
              <Avatar isUser={false}><FaRobot /></Avatar>
              <MessageBubble isUser={false}>
                <TypingIndicator>
                  <TypingDot animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} />
                  <TypingDot animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} />
                  <TypingDot animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} />
                </TypingIndicator>
              </MessageBubble>
            </MessageGroup>
          )}

          <div ref={messagesEndRef} />
        </MessagesContainer>

        {showSuggestions && (
          <SuggestionsGrid>
            {suggestedQuestions.map((q, i) => (
              <SuggestionCard
                key={i}
                onClick={() => handleSuggestion(q.text)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
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
              ref={inputRef}
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
      </ChatArea>
    </PageContainer>
  );
};

export default AITutor;
