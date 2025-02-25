import React from 'react';
import styled from 'styled-components';
import { 
  FaQuoteLeft, 
  FaLinkedin, 
  FaTwitter, 
  FaAward, 
  FaUserShield, 
  FaBalanceScale, 
  FaHandshake, 
  FaArrowRight 
} from 'react-icons/fa';

const Section = styled.section`
  padding: 120px 0;
  background: var(--background);
  position: relative;
  overflow: hidden;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
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
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
  
  &:hover img {
    transform: scale(1.03);
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
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: ${props => props.theme.shadows.lg};
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

const TeamSection = styled.div`
  margin-bottom: 100px;
`;

const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2.5rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const TeamCard = styled.div`
  background: ${props => props.theme.colors.cardBg};
  border-radius: 16px;
  overflow: hidden;
  box-shadow: ${props => props.theme.shadows.md};
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: ${props => props.theme.shadows.lg};
  }
`;

const TeamImage = styled.div`
  height: 300px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
  
  ${TeamCard}:hover & img {
    transform: scale(1.05);
  }
`;

const TeamInfo = styled.div`
  padding: 1.5rem;
`;

const TeamName = styled.h4`
  font-size: 1.25rem;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
  font-weight: 600;
`;

const TeamRole = styled.p`
  font-size: 0.95rem;
  color: var(--accent-color);
  font-weight: 500;
  margin-bottom: 1rem;
`;

const TeamBio = styled.p`
  font-size: 0.95rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 1.25rem;
`;

const TeamSocial = styled.div`
  display: flex;
  gap: 1rem;
  
  a {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: rgba(26, 54, 93, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--primary-color);
    transition: all 0.3s ease;
    
    &:hover {
      background: var(--primary-color);
      color: white;
      transform: translateY(-3px);
    }
  }
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
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${props => props.theme.shadows.lg};
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

const CTASection = styled.div`
  background: linear-gradient(135deg, var(--primary-color), #2d4e71);
  border-radius: 20px;
  padding: 4rem;
  text-align: center;
  color: white;
  box-shadow: ${props => props.theme.shadows.lg};
  
  @media (max-width: 768px) {
    padding: 3rem 2rem;
  }
`;

const CTATitle = styled.h3`
  font-size: 2.25rem;
  margin-bottom: 1.5rem;
  font-weight: 700;
  
  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`;

const CTAText = styled.p`
  font-size: 1.1rem;
  opacity: 0.9;
  max-width: 800px;
  margin: 0 auto 2rem;
  line-height: 1.7;
`;

const CTAButton = styled.button`
  background: var(--accent-color);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 1.25rem 2.5rem;
  font-weight: 600;
  font-size: 1.125rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  
  &:hover {
    background: #1a945e;
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
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
      text: "Your goals and needs are at the center of everything we do, guiding our personalized advisory approach."
    }
  ];
  
  const team = [
    {
      name: "Oluwaseun Adebayo",
      role: "Founder & CEO",
      bio: "With over 15 years in financial services and a passion for technology, Oluwaseun founded BloomVest to democratize access to quality financial advice in Nigeria.",
      image: "/images/team-founder.jpg",
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com"
    },
    {
      name: "Amina Ibrahim",
      role: "Chief Investment Officer",
      bio: "A veteran investment strategist with expertise in Nigerian and West African markets, Amina leads our investment research and advisory strategies.",
      image: "/images/team-cio.jpg",
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com"
    },
    {
      name: "Chukwudi Okonkwo",
      role: "Head of Financial Education",
      bio: "Former university professor with a gift for making complex financial concepts accessible, Chukwudi designs our educational programs and workshops.",
      image: "/images/team-education.jpg",
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com"
    },
    {
      name: "Funke Adeyemi",
      role: "Chief Technology Officer",
      bio: "AI and fintech expert who leads our technology initiatives, ensuring our AI advisory tools deliver valuable insights while maintaining user privacy.",
      image: "/images/team-cto.jpg",
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com"
    },
    {
      name: "David Nwachukwu",
      role: "Real Estate Advisory Lead",
      bio: "With a background in property development and market analysis, David specializes in helping clients navigate Nigeria's complex real estate landscape.",
      image: "/images/team-realestate.jpg",
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com"
    },
    {
      name: "Zainab Mohammed",
      role: "Client Success Manager",
      bio: "Dedicated to ensuring exceptional client experiences, Zainab works closely with our advisory team to deliver personalized service and support.",
      image: "/images/team-success.jpg",
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com"
    }
  ];
  
  const testimonials = [
    {
      text: "BloomVest's AI assessment gave me insights I'd never considered before, and their human advisors helped me implement a financial strategy that's perfectly aligned with my goals.",
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
          <Title>About BloomVest Capital</Title>
          <Subtitle>
            We're on a mission to transform financial advisory in Nigeria through a blend of 
            human expertise and cutting-edge technology.
          </Subtitle>
        </SectionHeader>
        
        <StorySection>
          <StoryContent>
            <StoryTitle>Our Journey</StoryTitle>
            <StoryText>
              <p>
                BloomVest Capital was founded in 2020 with a clear vision: to make high-quality 
                financial guidance accessible to all Nigerians, regardless of their wealth level or 
                investment experience.
              </p>
              <p>
                Our founder, Oluwaseun Adebayo, recognized a significant gap in the Nigerian financial 
                advisory landscape. Traditional wealth management services were typically reserved for 
                the ultra-wealthy, while the average Nigerian had limited access to unbiased, 
                personalized financial guidance.
              </p>
              <p>
                By combining <strong>human expertise</strong> with <strong>AI-powered analysis</strong>, 
                we've created a new model for financial advisory that's more accessible, affordable, 
                and effective than traditional approaches.
              </p>
              <p>
                Today, BloomVest serves thousands of clients across Nigeria, helping them navigate 
                complex financial decisions with confidence and clarity. Our team of experienced 
                advisors and cutting-edge technology work together to deliver guidance that's both 
                deeply personal and data-driven.
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
              These foundational values guide everything we do, from the advice we provide 
              to how we interact with our clients and community.
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
        
        <TeamSection>
          <SectionHeader>
            <Preheading>Our Experts</Preheading>
            <Title>Meet the Team</Title>
            <Subtitle>
              Our diverse team of financial experts, technologists, and educators combine their 
              expertise to deliver exceptional advisory services.
            </Subtitle>
          </SectionHeader>
          
          <TeamGrid>
            {team.map((member, index) => (
              <TeamCard key={index}>
                <TeamImage>
                  <img src={member.image || "/images/team-placeholder.jpg"} alt={member.name} />
                </TeamImage>
                <TeamInfo>
                  <TeamName>{member.name}</TeamName>
                  <TeamRole>{member.role}</TeamRole>
                  <TeamBio>{member.bio}</TeamBio>
                  <TeamSocial>
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                      <FaLinkedin />
                    </a>
                    <a href={member.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                      <FaTwitter />
                    </a>
                  </TeamSocial>
                </TeamInfo>
              </TeamCard>
            ))}
          </TeamGrid>
        </TeamSection>
        
        <TestimonialSection>
          <SectionHeader>
            <Preheading>Client Stories</Preheading>
            <Title>What Our Clients Say</Title>
            <Subtitle>
              Hear from people who have transformed their financial futures with 
              BloomVest Capital's guidance.
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
        
        <CTASection>
          <CTATitle>Ready to Start Your Financial Journey?</CTATitle>
          <CTAText>
            Take the first step toward financial confidence with our free AI assessment 
            or schedule a consultation with one of our expert advisors.
          </CTAText>
          <CTAButton>
            Get Started Today <FaArrowRight />
          </CTAButton>
        </CTASection>
      </Container>
    </Section>
  );
};

export default About;