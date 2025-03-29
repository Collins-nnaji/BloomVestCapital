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

const TeamSection = styled.div`
  margin-bottom: 100px;
`;

const TeamHeading = styled.h3`
  font-size: 2.5rem;
  color: #1a365d;
  margin-bottom: 2.5rem;
  font-weight: 800;
  text-align: center;
  position: relative;
  line-height: 1.2;
  
  &::after {
    content: '';
    position: absolute;
    height: 4px;
    width: 80px;
    background: linear-gradient(to right, #22c55e, rgba(34, 197, 94, 0.2));
    bottom: -12px;
    left: 50%;
    transform: translateX(-50%);
  }
`;

const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2.5rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const TeamMember = styled.div`
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
  }
`;

const MemberImage = styled.div`
  height: 300px;
  position: relative;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s ease;
  }
  
  &:hover img {
    transform: scale(1.1);
  }
`;

const MemberInfo = styled.div`
  padding: 2rem;
`;

const MemberName = styled.h4`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a365d;
  margin-bottom: 0.5rem;
`;

const MemberRole = styled.p`
  font-size: 1.1rem;
  color: #22c55e;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const MemberBio = styled.p`
  font-size: 1rem;
  color: #475569;
  line-height: 1.7;
  margin-bottom: 1.5rem;
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
  
  return (
    <Section id="about">
      <Container>
        <SectionHeader>
          <Preheading>Our Mission</Preheading>
          <Title>Empowering Financial Success</Title>
          <Subtitle>
            At <strong>BloomVest Finance</strong>, we believe that financial excellence comes from the perfect blend of
            expert human guidance and cutting-edge technology.
          </Subtitle>
        </SectionHeader>
        
        <StorySection>
          <StoryContent>
            <StoryTitle>Our Story and Vision</StoryTitle>
            <StoryText>
              <p>
                Founded in 2018, <strong>BloomVest Finance</strong> emerged from a vision to transform how 
                Nigerians approach financial management and investment. Our team of finance veterans and data 
                scientists came together with a shared mission: to democratize access to sophisticated financial 
                insights that were previously available only to elite institutions.
              </p>
              <p>
                Today, we serve hundreds of clients across Nigeria, from individuals planning for significant life 
                milestones to businesses navigating complex financial landscapes. Our approach combines <strong>deep 
                financial expertise</strong> with <strong>proprietary data analytics</strong> to deliver solutions 
                that are both innovative and grounded in sound financial principles.
              </p>
              <p>
                What sets us apart is our commitment to leveraging the power of advanced data science while maintaining 
                the crucial human element that understands the unique cultural and economic context of Nigeria. We believe 
                that the future of finance is <strong>both digital and human</strong>.
              </p>
            </StoryText>
          </StoryContent>
          
          <StoryImage>
            <img 
              src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1742&q=80" 
              alt="BloomVest Finance Team" 
            />
          </StoryImage>
        </StorySection>
        
        <TeamSection>
          <TeamHeading>Meet Our Leadership Team</TeamHeading>
          <TeamGrid>
            <TeamMember>
              <MemberImage>
                <img 
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1287&q=80" 
                  alt="Oluwaseun Adeyemi" 
                />
              </MemberImage>
              <MemberInfo>
                <MemberName>Oluwaseun Adeyemi</MemberName>
                <MemberRole>Chief Executive Officer</MemberRole>
                <MemberBio>
                  With over 15 years of experience in investment banking and financial advisory, Oluwaseun previously led the corporate finance division at a major Nigerian bank. He holds an MBA from London Business School and is a Chartered Financial Analyst (CFA).
                </MemberBio>
              </MemberInfo>
            </TeamMember>
            
            <TeamMember>
              <MemberImage>
                <img 
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1287&q=80" 
                  alt="Amina Ibrahim" 
                />
              </MemberImage>
              <MemberInfo>
                <MemberName>Amina Ibrahim</MemberName>
                <MemberRole>Chief Data Officer</MemberRole>
                <MemberBio>
                  Amina leads our data science team, bringing 12 years of experience in quantitative analysis and AI application in financial markets. She earned her Ph.D. in Applied Mathematics from Imperial College London and previously worked at a global asset management firm.
                </MemberBio>
              </MemberInfo>
            </TeamMember>
            
            <TeamMember>
              <MemberImage>
                <img 
                  src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1287&q=80" 
                  alt="Chukwudi Okonkwo" 
                />
              </MemberImage>
              <MemberInfo>
                <MemberName>Chukwudi Okonkwo</MemberName>
                <MemberRole>Chief Investment Strategist</MemberRole>
                <MemberBio>
                  Chukwudi oversees our investment strategies with 18 years of experience across African financial markets. He previously managed a $500M portfolio at a pan-African investment firm and holds an MSc in Financial Economics from the University of Cape Town.
                </MemberBio>
              </MemberInfo>
            </TeamMember>
          </TeamGrid>
        </TeamSection>
        
        <ValuesSection>
          <SectionHeader>
            <Preheading>Our Core Values</Preheading>
            <Title>What Drives Us</Title>
            <Subtitle>
              At <strong>BloomVest Finance</strong>, our values shape everything we do, from how we develop our services to how we interact with clients.
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
            <Title>Where Data Meets Financial Wisdom</Title>
            <Subtitle>
              Our team combines decades of traditional financial experience with cutting-edge data science capabilities.
            </Subtitle>
          </SectionHeader>
          
          <ExpertiseGrid>
            <ExpertiseItem>
              <ExpertiseIcon bg="#ecfdf5" color="#15803d">
                <FaRegLightbulb />
              </ExpertiseIcon>
              <ExpertiseContent>
                <ExpertiseTitle>Deep Market Knowledge</ExpertiseTitle>
                <ExpertiseText>
                  Our team has a combined 75+ years of experience in African financial markets, with particular expertise in Nigerian equities, fixed income, and alternative investments. This on-the-ground experience provides invaluable context for our data-driven insights.
                </ExpertiseText>
              </ExpertiseContent>
            </ExpertiseItem>
            
            <ExpertiseItem>
              <ExpertiseIcon bg="#eff6ff" color="#3b82f6">
                <FaRobot />
              </ExpertiseIcon>
              <ExpertiseContent>
                <ExpertiseTitle>Advanced Data Analytics</ExpertiseTitle>
                <ExpertiseText>
                  Our data science team includes PhDs in mathematics, computer science, and economics who develop proprietary algorithms that analyze thousands of data points to identify market patterns and investment opportunities before they become obvious to the wider market.
                </ExpertiseText>
              </ExpertiseContent>
            </ExpertiseItem>
            
            <ExpertiseItem>
              <ExpertiseIcon bg="#fef2f2" color="#dc2626">
                <FaGraduationCap />
              </ExpertiseIcon>
              <ExpertiseContent>
                <ExpertiseTitle>Industry-Leading Certifications</ExpertiseTitle>
                <ExpertiseText>
                  Our advisory team holds prestigious certifications including CFA, CFP, FRM, and advanced degrees from top global institutions. We invest heavily in ongoing education to ensure our team remains at the cutting edge of financial knowledge.
                </ExpertiseText>
              </ExpertiseContent>
            </ExpertiseItem>
            
            <ExpertiseItem>
              <ExpertiseIcon bg="#eef2ff" color="#4f46e5">
                <FaUsers />
              </ExpertiseIcon>
              <ExpertiseContent>
                <ExpertiseTitle>Client-Centric Approach</ExpertiseTitle>
                <ExpertiseText>
                  Beyond technical expertise, our team excels in translating complex financial concepts into clear, actionable advice. We pride ourselves on building long-term relationships with clients through transparent communication and exceptional service.
                </ExpertiseText>
              </ExpertiseContent>
            </ExpertiseItem>
          </ExpertiseGrid>
        </div>
      </Container>
    </Section>
  );
};

export default About;