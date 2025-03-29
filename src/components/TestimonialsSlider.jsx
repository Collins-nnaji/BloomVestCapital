import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaQuoteLeft, FaStar, FaArrowLeft, FaArrowRight, FaUserCircle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Section = styled.section`
  padding: 120px 0;
  background: #f8fafc;
  position: relative;
  overflow: hidden;
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 1;
`;

const SectionHeader = styled.div`
  text-align: center;
  max-width: 700px;
  margin: 0 auto 70px;
`;

const Preheading = styled.div`
  font-size: 1.125rem;
  font-weight: 600;
  color: #22c55e;
  margin-bottom: 1rem;
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
    width: 40px;
    height: 3px;
    background: linear-gradient(to right, #22c55e, #4ade80);
    border-radius: 3px;
  }
`;

const Title = styled.h2`
  font-size: 2.75rem;
  font-weight: 800;
  color: #1a365d;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    font-size: 2.25rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #64748b;
  line-height: 1.7;
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
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: white;
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1a365d;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    color: #22c55e;
    border-color: #22c55e;
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
`;

const SliderDots = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  margin-top: 2rem;
`;

const Dot = styled.button`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.active ? '#22c55e' : '#cbd5e1'};
  border: none;
  padding: 0;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.active ? '#22c55e' : '#94a3b8'};
  }
`;

const SlideWrapper = styled(motion.div)`
  display: flex;
  gap: 1.5rem;
  
  @media (max-width: 1024px) {
    flex-direction: column;
  }
`;

const TestimonialContainer = styled(motion.div)`
  flex: 1;
  background: #ffffff;
  border-radius: 16px;
  padding: 3rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 6px;
    background: linear-gradient(to right, #22c55e, #4ade80);
    opacity: 0.8;
  }
  
  @media (max-width: 768px) {
    padding: 2rem;
  }
`;

const QuoteIcon = styled.div`
  color: rgba(34, 197, 94, 0.15);
  font-size: 4rem;
  line-height: 1;
  margin-bottom: 1.5rem;
`;

const TestimonialText = styled.div`
  font-size: 1.25rem;
  color: #334155;
  line-height: 1.7;
  margin-bottom: 2rem;
  font-style: italic;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const RatingContainer = styled.div`
  display: flex;
  gap: 0.25rem;
  margin-bottom: 1.5rem;
  color: #f59e0b;
  font-size: 1.25rem;
`;

const TestimonialFooter = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-top: auto;
`;

const Avatar = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  overflow: hidden;
  background: ${props => props.bgColor || '#e2e8f0'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1a365d;
  font-size: 2.5rem;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const ClientInfo = styled.div``;

const ClientName = styled.div`
  font-weight: 700;
  font-size: 1.25rem;
  color: #1a365d;
  margin-bottom: 0.25rem;
`;

const ClientRole = styled.div`
  color: #64748b;
  font-size: 0.95rem;
`;

const ClientCompany = styled.div`
  font-weight: 500;
  color: #22c55e;
  font-size: 0.95rem;
  margin-top: 0.25rem;
`;

const BackgroundPattern = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  background-image: radial-gradient(#e2e8f0 1px, transparent 1px);
  background-size: 20px 20px;
  opacity: 0.5;
  z-index: 0;
`;

const TestimonialsSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  
  const testimonials = [
    {
      slide: [
        {
          text: "Working with Bloomvest Capital transformed our financial strategy. Their personalized approach and expert guidance helped us navigate complex market conditions with confidence.",
          rating: 5,
          name: "Jennifer Richards",
          role: "CFO",
          company: "Nexus Technologies",
          avatarBg: "linear-gradient(135deg, #667eea, #764ba2)"
        },
        {
          text: "The combination of AI-powered insights and human expertise made all the difference. Their team identified opportunities we would have never found on our own.",
          rating: 5,
          name: "Robert Chen",
          role: "Investment Director",
          company: "Global Ventures Ltd",
          avatarBg: "linear-gradient(135deg, #667eea, #764ba2)"
        }
      ]
    },
    {
      slide: [
        {
          text: "Bloomvest Capital's educational resources and workshops have empowered our team to make better financial decisions across the board. Their commitment to client success is evident in everything they do.",
          rating: 5,
          name: "Sarah Johnson",
          role: "CEO",
          company: "Innovate Partners",
          avatarBg: "linear-gradient(135deg, #22c55e, #4ade80)"
        },
        {
          text: "The market insights provided by Bloomvest have been invaluable for our long-term investment strategy. Their team has a remarkable ability to explain complex concepts in simple terms.",
          rating: 4,
          name: "Michael Thompson",
          role: "Portfolio Manager",
          company: "Equity First",
          avatarBg: "linear-gradient(135deg, #22c55e, #4ade80)"
        }
      ]
    },
    {
      slide: [
        {
          text: "As a startup founder, navigating financial strategies was overwhelming until we partnered with Bloomvest. Their tailored approach and patience with our questions made all the difference.",
          rating: 5,
          name: "David Rodriguez",
          role: "Founder & CEO",
          company: "Futurewave Tech",
          avatarBg: "linear-gradient(135deg, #f97316, #fb923c)"
        },
        {
          text: "The strategic financial planning services from Bloomvest helped us identify inefficiencies and optimize our capital allocation. Our ROI has improved significantly since implementing their recommendations.",
          rating: 5,
          name: "Aisha Patel",
          role: "Financial Director",
          company: "Horizon Group",
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
  
  return (
    <Section>
      <BackgroundPattern />
      <Container>
        <SectionHeader>
          <Preheading>Client Success Stories</Preheading>
          <Title>What Our Clients Say</Title>
          <Subtitle>Hear from business leaders and entrepreneurs who have transformed their financial strategies with our guidance.</Subtitle>
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
                <TestimonialContainer key={index}>
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