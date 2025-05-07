import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaQuoteLeft, FaStar, FaArrowLeft, FaArrowRight, FaUserCircle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Section = styled.section`
  padding: 120px 0;
  background: linear-gradient(170deg, #f8fafc, #ffffff);
  position: relative;
  overflow: hidden;
  
  @media (max-width: 768px) {
    padding: 80px 0;
  }
`;

const BackgroundDecoration = styled.div`
  position: absolute;
  z-index: 0;
  
  &.top-left {
    top: -100px;
    left: -100px;
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(34, 197, 94, 0.05) 0%, rgba(255, 255, 255, 0) 70%);
    border-radius: 50%;
    filter: blur(60px);
  }
  
  &.bottom-right {
    bottom: -100px;
    right: -100px;
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(26, 54, 93, 0.05) 0%, rgba(255, 255, 255, 0) 70%);
    border-radius: 50%;
    filter: blur(60px);
  }
`;

const FloatingShape = styled.div`
  position: absolute;
  z-index: 0;
  opacity: 0.5;
  
  &.shape1 {
    width: 120px;
    height: 120px;
    top: 15%;
    right: 10%;
    border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
    background: linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(59, 130, 246, 0.1));
    animation: float1 15s infinite ease-in-out;
  }
  
  &.shape2 {
    width: 80px;
    height: 80px;
    bottom: 20%;
    left: 10%;
    border-radius: 30% 70% 50% 50% / 50% 50% 70% 30%;
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1));
    animation: float2 18s infinite ease-in-out;
  }
  
  @keyframes float1 {
    0% { transform: translate(0, 0) rotate(0deg); }
    50% { transform: translate(15px, -15px) rotate(10deg); }
    100% { transform: translate(0, 0) rotate(0deg); }
  }
  
  @keyframes float2 {
    0% { transform: translate(0, 0) rotate(0deg); }
    50% { transform: translate(-15px, 10px) rotate(-10deg); }
    100% { transform: translate(0, 0) rotate(0deg); }
  }
`;

const BackgroundPattern = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(rgba(34, 197, 94, 0.03) 1px, transparent 1px),
    radial-gradient(rgba(26, 54, 93, 0.03) 1px, transparent 1px);
  background-size: 40px 40px, 30px 30px;
  background-position: 0 0, 20px 20px;
  opacity: 0.6;
  z-index: 0;
`;

const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 1;
  
  @media (max-width: 768px) {
    padding: 0 1.5rem;
  }
`;

const SectionHeader = styled.div`
  text-align: center;
  max-width: 800px;
  margin: 0 auto 70px;
`;

const Preheading = styled.div`
  font-size: 1.15rem;
  font-weight: 700;
  color: #22c55e;
  margin-bottom: 1.25rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  position: relative;
  display: inline-block;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 50px;
    height: 3px;
    background: linear-gradient(to right, #22c55e, #4ade80);
    border-radius: 3px;
  }
`;

const Title = styled.h2`
  font-size: 3rem;
  font-weight: 800;
  color: #1a365d;
  margin-bottom: 1.5rem;
  position: relative;
  display: inline-block;
  
  span {
    color: #22c55e;
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      bottom: 5px;
      left: 0;
      width: 100%;
      height: 8px;
      background: rgba(34, 197, 94, 0.2);
      z-index: -1;
      border-radius: 4px;
    }
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -15px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 4px;
    background: linear-gradient(to right, #22c55e, rgba(34, 197, 94, 0.2));
    border-radius: 4px;
  }
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 2.25rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #475569;
  line-height: 1.8;
  margin-top: 2rem;
  
  strong {
    color: #1a365d;
    font-weight: 600;
  }
`;

const TestimonialsWrapper = styled.div`
  position: relative;
  margin: 0 auto;
  max-width: 1200px;
`;

const SliderControls = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 3rem;
`;

const SliderButton = styled.button`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: white;
  border: 1px solid rgba(226, 232, 240, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1a365d;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  font-size: 1.1rem;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
    color: #22c55e;
    border-color: rgba(34, 197, 94, 0.3);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    
    &:hover {
      transform: none;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      color: #1a365d;
      border-color: #e2e8f0;
    }
  }
  
  svg {
    transition: transform 0.3s ease;
  }
  
  &:hover svg:first-child {
    transform: translateX(-3px);
  }
  
  &:hover svg:last-child {
    transform: translateX(3px);
  }
`;

const SliderDots = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  margin-top: 2.5rem;
`;

const Dot = styled.button`
  width: ${props => props.active ? '28px' : '8px'};
  height: 8px;
  border-radius: 50px;
  background: ${props => props.active ? 
    'linear-gradient(to right, #22c55e, #4ade80)' : 
    'rgba(203, 213, 225, 0.5)'
  };
  border: none;
  padding: 0;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    background: ${props => props.active ? 
      'linear-gradient(to right, #22c55e, #4ade80)' : 
      'rgba(148, 163, 184, 0.5)'
    };
  }
`;

const SlideWrapper = styled(motion.div)`
  display: flex;
  gap: 2rem;
  
  @media (max-width: 1024px) {
    flex-direction: column;
  }
`;

const TestimonialContainer = styled(motion.div)`
  flex: 1;
  background: #ffffff;
  border-radius: 24px;
  padding: 3.5rem;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(226, 232, 240, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: center;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 24px;
    padding: 2px;
    background: linear-gradient(135deg, rgba(34, 197, 94, 0.5), rgba(26, 54, 93, 0.3));
    -webkit-mask: 
      linear-gradient(#fff 0 0) content-box, 
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0;
    transition: opacity 0.4s ease;
    z-index: -1;
  }
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.08);
    
    &::before {
      opacity: 1;
    }
  }
  
  @media (max-width: 768px) {
    padding: 2.5rem;
  }
`;

const QuoteIcon = styled.div`
  color: rgba(34, 197, 94, 0.15);
  font-size: 4rem;
  line-height: 1;
  margin-bottom: 2rem;
`;

const TestimonialText = styled.div`
  font-size: 1.25rem;
  color: #334155;
  line-height: 1.8;
  margin-bottom: 2rem;
  font-style: italic;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const RatingContainer = styled.div`
  display: flex;
  gap: 0.35rem;
  margin-bottom: 1.5rem;
  color: #f59e0b;
  font-size: 1.25rem;
`;

const TestimonialFooter = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-top: auto;
  padding-top: 2rem;
  border-top: 1px solid rgba(226, 232, 240, 0.5);
`;

const Avatar = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 18px;
  overflow: hidden;
  background: ${props => props.bgColor || '#e2e8f0'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 2.5rem;
  flex-shrink: 0;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, transparent 60%, rgba(0, 0, 0, 0.2));
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }
`;

const ClientInfo = styled.div``;

const ClientName = styled.div`
  font-weight: 700;
  font-size: 1.25rem;
  color: #1a365d;
  margin-bottom: 0.25rem;
`;

const ClientRole = styled.div`
  color: #475569;
  font-size: 0.95rem;
`;

const ClientCompany = styled.div`
  font-weight: 500;
  color: #22c55e;
  font-size: 0.95rem;
  margin-top: 0.25rem;
`;

const TestimonialsSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  
  const testimonials = [
    {
      slide: [
        {
          text: "BloomVest's deep due diligence process and founder-friendly approach made them the ideal partner for our Series A. Beyond capital, their strategic introductions accelerated our enterprise sales by 215% within six months.",
          rating: 5,
          name: "Sophia Martinez",
          role: "Founder & CEO",
          company: "Quantum ML",
          avatarBg: "linear-gradient(135deg, #667eea, #764ba2)"
        },
        {
          text: "As a first-time founder, navigating term sheets was overwhelming until BloomVest stepped in. They structured fair terms that protected both our team's upside and their investment, creating perfect alignment.",
          rating: 5,
          name: "James Chen",
          role: "Co-founder",
          company: "Cirrus Logistics",
          avatarBg: "linear-gradient(135deg, #667eea, #764ba2)"
        }
      ]
    },
    {
      slide: [
        {
          text: "BloomVest's portfolio companies benefit from an incredible network effect. Their team connected us with three enterprise clients and our perfect VP of Sales, accelerating our growth trajectory dramatically.",
          rating: 5,
          name: "Alex Johnson",
          role: "Founder & CTO",
          company: "EdgeAI Systems",
          avatarBg: "linear-gradient(135deg, #22c55e, #4ade80)"
        },
        {
          text: "The strategic growth support from BloomVest has been invaluable. Their operational framework helped us optimize our unit economics and prepare for scale, which was crucial for our successful Series B.",
          rating: 5,
          name: "Priya Sharma",
          role: "CEO",
          company: "FinanceFlow",
          avatarBg: "linear-gradient(135deg, #22c55e, #4ade80)"
        }
      ]
    },
    {
      slide: [
        {
          text: "BloomVest's curated deal flow has consistently outperformed market benchmarks. Their rigorous screening and due diligence process gives me confidence to invest in promising startups I would otherwise never discover.",
          rating: 5,
          name: "Michael Rodriguez",
          role: "Angel Investor",
          company: "Highland Angels",
          avatarBg: "linear-gradient(135deg, #f97316, #fb923c)"
        },
        {
          text: "After a decade of angel investing, partnering with BloomVest has transformed my early-stage portfolio. Their sector expertise and founder evaluation framework has increased my successful exits from 10% to over 30%.",
          rating: 5,
          name: "Sarah Goldstein",
          role: "Limited Partner",
          company: "Sequoia Ventures",
          avatarBg: "linear-gradient(135deg, #f97316, #fb923c)"
        }
      ]
    }
  ];
  
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 8000);
    
    return () => clearInterval(interval);
  }, [currentSlide]);
  
  const nextSlide = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };
  
  const prevSlide = () => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };
  
  const goToSlide = (index) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  };
  
  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };
  
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };
  
  return (
    <Section>
      <BackgroundDecoration className="top-left" />
      <BackgroundDecoration className="bottom-right" />
      <FloatingShape className="shape1" />
      <FloatingShape className="shape2" />
      <BackgroundPattern />
      
      <Container>
        <SectionHeader>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, type: "spring" }}
            viewport={{ once: true }}
          >
            <Preheading>Success Stories</Preheading>
            <Title>From <span>Founders</span> & Investors</Title>
            <Subtitle>
              Hear from innovative founders and strategic investors who have partnered with BloomVest to achieve <strong>exceptional growth</strong> and <strong>investment returns</strong> in the early-stage ecosystem.
            </Subtitle>
          </motion.div>
        </SectionHeader>
        
        <TestimonialsWrapper>
          <AnimatePresence custom={direction} mode="wait">
            <SlideWrapper
              key={currentSlide}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: 'spring', stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
            >
              {testimonials[currentSlide].slide.map((item, index) => (
                <TestimonialContainer 
                  key={index}
                  custom={index}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ scale: 1.02 }}
                >
                  <div>
                    <QuoteIcon>
                      <FaQuoteLeft />
                    </QuoteIcon>
                    <RatingContainer>
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} color={i < item.rating ? "#f59e0b" : "#e2e8f0"} />
                      ))}
                    </RatingContainer>
                    <TestimonialText>"{item.text}"</TestimonialText>
                  </div>
                  <TestimonialFooter>
                    <Avatar bgColor={item.avatarBg}>
                      <FaUserCircle />
                    </Avatar>
                    <ClientInfo>
                      <ClientName>{item.name}</ClientName>
                      <ClientRole>{item.role}</ClientRole>
                      <ClientCompany>{item.company}</ClientCompany>
                    </ClientInfo>
                  </TestimonialFooter>
                </TestimonialContainer>
              ))}
            </SlideWrapper>
          </AnimatePresence>
          
          <SliderDots>
            {testimonials.map((_, index) => (
              <Dot 
                key={index} 
                active={currentSlide === index} 
                onClick={() => goToSlide(index)}
              />
            ))}
          </SliderDots>
          
          <SliderControls>
            <SliderButton onClick={prevSlide}>
              <FaArrowLeft />
            </SliderButton>
            <SliderButton onClick={nextSlide}>
              <FaArrowRight />
            </SliderButton>
          </SliderControls>
        </TestimonialsWrapper>
      </Container>
    </Section>
  );
};

export default TestimonialsSlider; 