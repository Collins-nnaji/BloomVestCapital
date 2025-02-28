import React from 'react';
import styled from 'styled-components';
import { 
  FaQuoteLeft, 
  FaUserShield, 
  FaBalanceScale, 
  FaAward, 
  FaHandshake,
  FaRegLightbulb,
  FaUsers,
  FaRobot,
  FaGraduationCap
} from 'react-icons/fa';

const Section = styled.section`
  padding: 120px 0;
  background: var(--background);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(34, 197, 94, 0.05) 0%, transparent 70%);
    top: -200px;
    right: -200px;
    border-radius: 50%;
    z-index: 0;
  }
  
  &::after {
    content: '';
    position: absolute;
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(26, 54, 93, 0.05) 0%, transparent 70%);
    bottom: -150px;
    left: -150px;
    border-radius: 50%;
    z-index: 0;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 1;
`;

const SectionHeader = styled.div`
  text-align: center;
  max-width: 800px;
  margin: 0 auto 80px;
`;

const Preheading = styled.div`
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--accent-color);
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  display: inline-block;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    height: 2px;
    width: 60px;
    background: var(--accent-color);
    bottom: -5px;
    left: 50%;
    transform: translateX(-50%);
  }
`;

const Title = styled.h2`
  font-size: 3rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  color: var(--text-secondary);
  line-height: 1.7;
`;

const StorySection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  margin-bottom: 100px;
  
  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
`;

const StoryContent = styled.div``;

const StoryTitle = styled.h3`
  font-size: 2.25rem;
  color: var(--primary-color);
  margin-bottom: 1.5rem;
  font-weight: 700;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    height: 3px;
    width: 80px;
    background: linear-gradient(to right, var(--accent-color), transparent);
    bottom: -10px;
    left: 0;
  }
`;

const StoryText = styled.div`
  font-size: 1.1rem;
  color: var(--text-secondary);
  line-height: 1.8;
  
  p {
    margin-bottom: 1.5rem;
  }
  
  strong {
    color: var(--primary-color);
    font-weight: 600;
  }
`;

const StoryImage = styled.div`
  border-radius: 20px;
  overflow: hidden;
  box-shadow: ${props => props.theme.shadows.lg};
  height: 500px;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to top, rgba(26, 54, 93, 0.4), transparent);
    z-index: 1;
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.8s ease;
  }
  
  &:hover img {
    transform: scale(1.05);
  }
  
  @media (max-width: 768px) {
    height: 350px;
  }
`;

const ValuesSection = styled.div`
  margin-bottom: 100px;
`;

const ValuesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ValueCard = styled.div`
  background: ${props => props.theme.colors.cardBg};
  border-radius: 16px;
  padding: 2.5rem;
  box-shadow: ${props => props.theme.shadows.md};
  transition: all 0.3s ease;
  height: 100%;
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 3px;
    background: var(--accent-color);
    transition: width 0.4s ease;
  }
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: ${props => props.theme.shadows.lg};
    
    &::after {
      width: 100%;
    }
  }
`;

const ValueIcon = styled.div`
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, var(--accent-color), #4ade80);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  color: white;
  font-size: 1.75rem;
  box-shadow: 0 8px 20px rgba(34, 197, 94, 0.2);
`;

const ValueTitle = styled.h4`
  font-size: 1.25rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
  font-weight: 600;
`;

const ValueText = styled.p`
  font-size: 1rem;
  color: var(--text-secondary);
  line-height: 1.7;
`;

const TeamOverviewSection = styled.div`
  margin-bottom: 100px;
  background: linear-gradient(145deg, rgba(26, 54, 93, 0.05), rgba(34, 197, 94, 0.05));
  border-radius: 20px;
  padding: 4rem;
  position: relative;
  overflow: hidden;
  
  @media (max-width: 768px) {
    padding: 3rem 2rem;
  }
  
  &::before {
    content: '';
    position: absolute;
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(34, 197, 94, 0.1) 0%, transparent 70%);
    top: -150px;
    right: -100px;
    border-radius: 50%;
  }
`;

const TeamTitle = styled.h3`
  font-size: 2.25rem;
  color: var(--primary-color);
  margin-bottom: 2rem;
  font-weight: 700;
  text-align: center;
`;

const TeamDescription = styled.p`
  font-size: 1.1rem;
  color: var(--text-secondary);
  line-height: 1.8;
  margin-bottom: 3rem;
  text-align: center;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
`;

const TeamGridLayout = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const TeamCategory = styled.div`
  background: ${props => props.theme.colors.cardBg};
  border-radius: 16px;
  padding: 2rem;
  box-shadow: ${props => props.theme.shadows.md};
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${props => props.theme.shadows.lg};
  }
`;

const CategoryIcon = styled.div`
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, ${props => props.gradient || 'var(--primary-color), #2d4e71'});
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  color: white;
  font-size: 1.5rem;
`;

const CategoryTitle = styled.h4`
  font-size: 1.2rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
  font-weight: 600;
`;

const CategoryText = styled.p`
  font-size: 0.95rem;
  color: var(--text-secondary);
  line-height: 1.6;
`;

const TestimonialSection = styled.div`
  margin-bottom: 100px;
`;

const TestimonialGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2.5rem;
  
  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const TestimonialCard = styled.div`
  background: ${props => props.theme.colors.cardBg};
  border-radius: 16px;
  padding: 2.5rem;
  box-shadow: ${props => props.theme.shadows.md};
  position: relative;
  transition: all 0.3s ease;
  border: 1px solid rgba(34, 197, 94, 0.05);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${props => props.theme.shadows.lg};
    border-color: rgba(34, 197, 94, 0.2);
  }
`;

const QuoteIcon = styled.div`
  position: absolute;
  top: 1.5rem;
  left: 1.5rem;
  color: rgba(34, 197, 94, 0.15);
  font-size: 2.5rem;
`;

const TestimonialText = styled.blockquote`
  font-size: 1.1rem;
  color: var(--text-primary);
  line-height: 1.7;
  margin-bottom: 1.5rem;
  padding-top: 1.5rem;
  font-style: italic;
`;

const TestimonialAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const AuthorImage = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid rgba(34, 197, 94, 0.2);
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const AuthorInfo = styled.div``;

const AuthorName = styled.h5`
  font-size: 1.1rem;
  color: var(--primary-color);
  margin-bottom: 0.25rem;
  font-weight: 600;
`;

const AuthorRole = styled.p`
  font-size: 0.9rem;
  color: var(--text-secondary);
`;

const About = () => {
  const values = [
    {
      icon: <FaUserShield />,
      title: "Integrity",
      text: "We uphold the highest ethical standards in all our interactions, providing transparent and honest financial guidance."
    },
    {
      icon: <FaBalanceScale />,
      title: "Independence",
      text: "Our advice is unbiased and free from external influences, focused solely on what's best for your financial wellbeing."
    },
    {
      icon: <FaAward />,
      title: "Excellence",
      text: "We are committed to delivering exceptional service and continually enhancing our expertise in the financial industry."
    },
    {
      icon: <FaHandshake />,
      title: "Client-Focused",
      text: "Your goals and needs are at the center of everything we do, guiding our personalized hybrid advisory approach."
    }
  ];
  
  const teamCategories = [
    {
      icon: <FaRegLightbulb />,
      title: "Investment Experts",
      text: "Seasoned financial strategists with deep knowledge of Nigerian and West African markets who craft personalized investment strategies.",
      gradient: "var(--primary-color), #2d4e71"
    },
    {
      icon: <FaRobot />,
      title: "Technology Innovators",
      text: "AI specialists and fintech engineers who develop our cutting-edge tools while ensuring data security and analytical precision.",
      gradient: "var(--accent-color), #4ade80"
    },
    {
      icon: <FaGraduationCap />,
      title: "Financial Educators",
      text: "Expert communicators who translate complex financial concepts into accessible knowledge through workshops and resources.",
      gradient: "#6366F1, #A855F7"
    },
    {
      icon: <FaUsers />,
      title: "Client Success Team",
      text: "Dedicated professionals who ensure a seamless experience, guiding you through every step of your financial journey with BloomVest.",
      gradient: "#F59E0B, #EF4444"
    }
  ];
  
  const testimonials = [
    {
      text: "BloomVest Finance's AI assessment gave me insights I'd never considered before, and their human advisors helped me implement a financial strategy that's perfectly aligned with my goals.",
      name: "Tunde Johnson",
      role: "Business Owner, Lagos",
      image: "/images/testimonial1.jpg"
    },
    {
      text: "As someone new to investing, I was intimidated by financial planning. The BloomVest team made it accessible through their educational workshops and personalized guidance.",
      name: "Ngozi Eze",
      role: "Software Engineer, Abuja",
      image: "/images/testimonial2.jpg"
    },
    {
      text: "The combination of AI-powered analysis and expert human advice helped me diversify my investments and better prepare for market volatility. My portfolio is now much more resilient.",
      name: "Ibrahim Yusuf",
      role: "Medical Doctor, Kano",
      image: "/images/testimonial3.jpg"
    },
    {
      text: "BloomVest's property investment advisory saved me from making a costly mistake and instead guided me toward an opportunity that has appreciated significantly.",
      name: "Folake Adeleke",
      role: "Corporate Executive, Port Harcourt",
      image: "/images/testimonial4.jpg"
    }
  ];
  
  return (
    <Section id="about">
      <Container>
        <SectionHeader>
          <Preheading>Our Story</Preheading>
          <Title>About BloomVest Finance</Title>
          <Subtitle>
            We're transforming financial advisory in Nigeria through our unique hybrid model that blends 
            human expertise with cutting-edge AI technology.
          </Subtitle>
        </SectionHeader>
        
        <StorySection>
          <StoryContent>
            <StoryTitle>Our Journey</StoryTitle>
            <StoryText>
              <p>
                BloomVest Finance was founded in 2020 with a clear vision: to make high-quality 
                financial guidance accessible to all Nigerians, regardless of their wealth level or 
                investment experience.
              </p>
              <p>
                Our founder recognized a significant gap in the Nigerian financial 
                advisory landscape. Traditional wealth management services were typically reserved for 
                the ultra-wealthy, while the average Nigerian had limited access to unbiased, 
                personalized financial guidance.
              </p>
              <p>
                By combining <strong>human expertise</strong> with <strong>AI-powered analysis</strong>, 
                we've created a new hybrid model for financial advisory that's more accessible, affordable, 
                and effective than traditional approaches. This innovative blend allows us to provide 
                personalized guidance that's enhanced by data-driven insights.
              </p>
              <p>
                Today, BloomVest serves thousands of clients across Nigeria, helping them navigate 
                complex financial decisions with confidence and clarity. Our commitment to innovation and 
                client success has positioned us as pioneers in hybrid financial advisory.
              </p>
            </StoryText>
          </StoryContent>
          <StoryImage>
            <img src="/images/about-story.jpg" alt="BloomVest team" />
          </StoryImage>
        </StorySection>
        
        <ValuesSection>
          <SectionHeader>
            <Preheading>Our Principles</Preheading>
            <Title>Core Values</Title>
            <Subtitle>
              These foundational values guide every aspect of our work, shaping our hybrid advisory 
              approach and defining our relationships with clients.
            </Subtitle>
          </SectionHeader>
          
          <ValuesGrid>
            {values.map((value, index) => (
              <ValueCard key={index}>
                <ValueIcon>{value.icon}</ValueIcon>
                <ValueTitle>{value.title}</ValueTitle>
                <ValueText>{value.text}</ValueText>
              </ValueCard>
            ))}
          </ValuesGrid>
        </ValuesSection>
        
        <TeamOverviewSection>
          <TeamTitle>Our Multidisciplinary Team</TeamTitle>
          <TeamDescription>
            Behind BloomVest Finance's success is our diverse team of experts working at the intersection 
            of finance, technology, and education. Our collaborative team culture brings together specialists 
            from different backgrounds who share a common passion for transforming financial advisory 
            through our hybrid approach.
          </TeamDescription>
          
          <TeamGridLayout>
            {teamCategories.map((category, index) => (
              <TeamCategory key={index}>
                <CategoryIcon gradient={category.gradient}>{category.icon}</CategoryIcon>
                <CategoryTitle>{category.title}</CategoryTitle>
                <CategoryText>{category.text}</CategoryText>
              </TeamCategory>
            ))}
          </TeamGridLayout>
        </TeamOverviewSection>
        
        <TestimonialSection>
          <SectionHeader>
            <Preheading>Client Success Stories</Preheading>
            <Title>The Impact of Hybrid Advisory</Title>
            <Subtitle>
              Discover how our unique blend of human expertise and AI technology has helped our clients 
              achieve their financial goals and transform their futures.
            </Subtitle>
          </SectionHeader>
          
          <TestimonialGrid>
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index}>
                <QuoteIcon>
                  <FaQuoteLeft />
                </QuoteIcon>
                <TestimonialText>
                  {testimonial.text}
                </TestimonialText>
                <TestimonialAuthor>
                  <AuthorImage>
                    <img src={testimonial.image || "/images/testimonial-placeholder.jpg"} alt={testimonial.name} />
                  </AuthorImage>
                  <AuthorInfo>
                    <AuthorName>{testimonial.name}</AuthorName>
                    <AuthorRole>{testimonial.role}</AuthorRole>
                  </AuthorInfo>
                </TestimonialAuthor>
              </TestimonialCard>
            ))}
          </TestimonialGrid>
        </TestimonialSection>
      </Container>
    </Section>
  );
};

export default About;