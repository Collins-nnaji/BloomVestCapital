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
  background: linear-gradient(170deg, #f8fafc 0%, #eff6ff 100%);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(to right, #22c55e, #15803d);
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
  font-size: 1.25rem;
  font-weight: 700;
  color: #22c55e;
  margin-bottom: 1.5rem;
  text-transform: uppercase;
  letter-spacing: 3px;
  position: relative;
  display: inline-block;
  
  &::after {
    content: '';
    position: absolute;
    height: 3px;
    width: 60px;
    background: #22c55e;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
  }
`;

const Title = styled.h2`
  font-size: 3.25rem;
  font-weight: 900;
  color: #1a365d;
  margin-bottom: 1.75rem;
  background: linear-gradient(to right, #1a365d, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -1px;
  line-height: 1.2;
  
  @media (max-width: 768px) {
    font-size: 2.75rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.35rem;
  color: #475569;
  line-height: 1.8;
  font-weight: 400;
  
  strong {
    color: #1a365d;
    font-weight: 600;
  }
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
  font-size: 2.5rem;
  color: #1a365d;
  margin-bottom: 2rem;
  font-weight: 800;
  position: relative;
  line-height: 1.2;
  
  &::after {
    content: '';
    position: absolute;
    height: 4px;
    width: 80px;
    background: linear-gradient(to right, #22c55e, rgba(34, 197, 94, 0.2));
    bottom: -12px;
    left: 0;
  }
`;

const StoryText = styled.div`
  font-size: 1.15rem;
  color: #475569;
  line-height: 1.8;
  
  p {
    margin-bottom: 1.75rem;
  }
  
  strong {
    color: #1a365d;
    font-weight: 600;
  }
`;

const StoryImage = styled.div`
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.1);
  height: 500px;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to top, rgba(26, 54, 93, 0.3), transparent);
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
    height: 400px;
  }
`;

const ValuesSection = styled.div`
  margin-bottom: 100px;
`;

const ValuesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2.5rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const ValueCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  transition: all 0.4s ease;
  height: 100%;
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 4px;
    background: #22c55e;
    transition: width 0.4s ease;
  }
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    
    &::after {
      width: 100%;
    }
  }
`;

const ValueIcon = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #22c55e, #4ade80);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
  color: white;
  font-size: 2rem;
  box-shadow: 0 10px 25px rgba(34, 197, 94, 0.2);
  transform: rotate(-5deg);
  transition: all 0.3s ease;
  
  ${ValueCard}:hover & {
    transform: rotate(0deg) scale(1.05);
    box-shadow: 0 15px 35px rgba(34, 197, 94, 0.3);
  }
`;

const ValueTitle = styled.h4`
  font-size: 1.5rem;
  color: #1a365d;
  margin-bottom: 1rem;
  font-weight: 700;
`;

const ValueDescription = styled.p`
  color: #475569;
  font-size: 1.1rem;
  line-height: 1.7;
`;

const ExpertiseGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  margin-top: 3rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ExpertiseItem = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.06);
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  }
  
  transition: all 0.3s ease;
`;

const ExpertiseIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 12px;
  background: ${props => props.bg || '#eef2ff'};
  color: ${props => props.color || '#4f46e5'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  flex-shrink: 0;
`;

const ExpertiseContent = styled.div``;

const ExpertiseTitle = styled.h5`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a365d;
  margin-bottom: 0.75rem;
`;

const ExpertiseText = styled.p`
  font-size: 1rem;
  color: #475569;
  line-height: 1.7;
`;

const About = () => {
  const values = [
    {
      icon: <FaUserShield />,
      title: "Trust & Fiduciary Duty",
      text: "We act as fiduciaries, always putting your interests first with unwavering integrity and transparency in every recommendation and decision."
    },
    {
      icon: <FaBalanceScale />,
      title: "Holistic Approach",
      text: "We consider all aspects of your financial life—investments, tax planning, estate strategies, and risk management—for truly comprehensive wealth management."
    },
    {
      icon: <FaAward />,
      title: "Evidence-Based Strategy",
      text: "Our investment philosophy is grounded in academic research and empirical evidence rather than speculation or market timing."
    },
    {
      icon: <FaHandshake />,
      title: "Relationship-Focused",
      text: "We build deep, long-term relationships that evolve as your life changes, providing continuity and personalized care for generations."
    }
  ];
  
  const teamCategories = [
    {
      icon: <FaRegLightbulb />,
      title: "Wealth Strategists",
      text: "Certified financial planners and wealth advisors who develop comprehensive, tailored strategies to preserve and grow your wealth over generations.",
      gradient: "var(--primary-color), #2d4e71"
    },
    {
      icon: <FaRobot />,
      title: "Investment Specialists",
      text: "Portfolio managers and analysts who construct diversified investment solutions based on your risk tolerance, time horizon, and financial goals.",
      gradient: "var(--accent-color), #4ade80"
    },
    {
      icon: <FaGraduationCap />,
      title: "Legacy Planning Experts",
      text: "Estate planning professionals who help you create meaningful legacies and efficient wealth transfer strategies for future generations.",
      gradient: "#6366F1, #A855F7"
    },
    {
      icon: <FaUsers />,
      title: "Client Experience Team",
      text: "Dedicated professionals who provide concierge-level service, anticipating your needs and ensuring your experience exceeds expectations.",
      gradient: "#F59E0B, #EF4444"
    }
  ];
  
  return (
    <Section id="about">
      <Container>
        <SectionHeader>
          <Preheading>Our Mission</Preheading>
          <Title>Preserving & Growing Your Wealth</Title>
          <Subtitle>
            At <strong>BloomVest Capital</strong>, we combine sophisticated wealth management strategies with personalized service to help you achieve your most important financial goals.
          </Subtitle>
        </SectionHeader>
        
        <StorySection>
          <StoryContent>
            <StoryTitle>Our Wealth Management Philosophy</StoryTitle>
            <StoryText>
              <p>
                Founded with a clear vision, <strong>BloomVest Capital</strong> was established to provide truly personalized wealth management solutions that go beyond typical financial planning. We recognized that high-net-worth individuals and families have unique needs that require specialized expertise and extraordinary attention to detail.
              </p>
              <p>
                Our approach integrates <strong>advanced investment strategies</strong> with <strong>comprehensive financial planning</strong> to create a holistic wealth management experience. We consider all aspects of your financial life—from investment management and tax efficiency to estate planning and philanthropic goals—creating strategies that work in harmony to optimize your overall financial position.
              </p>
              <p>
                What truly sets BloomVest Capital apart is our commitment to providing institutional-quality investment solutions with boutique-level service. We maintain low client-to-advisor ratios to ensure you receive the dedicated attention your wealth deserves, while leveraging sophisticated investment capabilities typically available only to large institutional investors. This combination of <strong>personalized attention</strong> and <strong>investment expertise</strong> creates a wealth management experience that addresses both the technical and emotional aspects of managing significant wealth.
              </p>
            </StoryText>
          </StoryContent>
          
          <StoryImage>
            <img 
              src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1742&q=80" 
              alt="BloomVest Capital Wealth Management" 
            />
          </StoryImage>
        </StorySection>
        
        <ValuesSection>
          <SectionHeader>
            <Preheading>Our Core Values</Preheading>
            <Title>The Principles That Guide Us</Title>
            <Subtitle>
              At <strong>BloomVest Capital</strong>, these fundamental values shape our client relationships and influence every recommendation we make.
            </Subtitle>
          </SectionHeader>
          
          <ValuesGrid>
            {values.map((value, index) => (
              <ValueCard key={index}>
                <ValueIcon>
                  {value.icon}
                </ValueIcon>
                <ValueTitle>{value.title}</ValueTitle>
                <ValueDescription>{value.text}</ValueDescription>
              </ValueCard>
            ))}
          </ValuesGrid>
        </ValuesSection>
        
        <div>
          <SectionHeader>
            <Preheading>Our Expertise</Preheading>
            <Title>Comprehensive Wealth Management</Title>
            <Subtitle>
              Our team of specialists works collaboratively to address every dimension of your financial life, providing truly integrated wealth management.
            </Subtitle>
          </SectionHeader>
          
          <ExpertiseGrid>
            {teamCategories.map((category, index) => (
              <ExpertiseItem key={index}>
                <ExpertiseIcon 
                  style={{ 
                    background: `linear-gradient(135deg, ${category.gradient})` 
                  }}
                >
                  {category.icon}
                </ExpertiseIcon>
                <ExpertiseContent>
                  <ExpertiseTitle>{category.title}</ExpertiseTitle>
                  <ExpertiseText>{category.text}</ExpertiseText>
                </ExpertiseContent>
              </ExpertiseItem>
            ))}
          </ExpertiseGrid>
        </div>
      </Container>
    </Section>
  );
};

export default About;