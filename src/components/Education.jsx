import React from 'react';
import styled from 'styled-components';
import { 
  FaGraduationCap, 
  FaUserFriends, 
  FaLaptop, 
  FaBookOpen, 
  FaChalkboardTeacher,
  FaCalendarAlt,
  FaPlay,
  FaFileDownload,
  FaArrowRight,
  FaMapMarkerAlt
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

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
  margin-bottom: 6rem;
  
  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  &:nth-child(even) {
    direction: rtl;
    
    @media (max-width: 968px) {
      direction: ltr;
    }
  }
  
  &:nth-child(even) > * {
    direction: ltr;
  }
`;

const ImageContainer = styled.div`
  border-radius: 20px;
  overflow: hidden;
  box-shadow: ${props => props.theme.shadows.lg};
  
  img {
    width: 100%;
    height: auto;
    display: block;
    transition: transform 0.5s ease;
  }
  
  &:hover img {
    transform: scale(1.03);
  }
`;

const ContentContainer = styled.div`
  padding: 2rem;
  
  @media (max-width: 968px) {
    padding: 0;
  }
`;

const ContentTitle = styled.h3`
  font-size: 2rem;
  color: var(--primary-color);
  margin-bottom: 1.5rem;
  font-weight: 700;
`;

const ContentText = styled.p`
  font-size: 1.1rem;
  color: var(--text-secondary);
  line-height: 1.7;
  margin-bottom: 1.5rem;
`;

const FeaturesList = styled.ul`
  list-style: none;
  padding: 0;
  margin-bottom: 2rem;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: flex-start;
  margin-bottom: 1rem;
  font-size: 1.05rem;
  color: var(--text-primary);
  
  svg {
    color: var(--accent-color);
    margin-right: 0.75rem;
    min-width: 20px;
    margin-top: 0.25rem;
  }
`;

const Button = styled.button`
  background: var(--accent-color);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 1rem 1.5rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: #1a945e;
    transform: translateY(-3px);
  }
`;

const CoursesSection = styled.div`
  margin-top: 6rem;
`;

const CourseGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CourseCard = styled.div`
  background: ${props => props.theme.colors.cardBg};
  border-radius: 16px;
  overflow: hidden;
  box-shadow: ${props => props.theme.shadows.md};
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: ${props => props.theme.shadows.lg};
  }
`;

const CourseImage = styled.div`
  height: 200px;
  position: relative;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
  
  ${CourseCard}:hover & img {
    transform: scale(1.05);
  }
`;

const CourseLevel = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: var(--accent-color);
  color: white;
  padding: 0.35rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
`;

const CourseContent = styled.div`
  padding: 1.5rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const CourseTitle = styled.h4`
  font-size: 1.25rem;
  color: var(--primary-color);
  margin-bottom: 0.75rem;
  font-weight: 600;
`;

const CourseDescription = styled.p`
  color: var(--text-secondary);
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  flex-grow: 1;
`;

const CourseDetails = styled.div`
  display: flex;
  justify-content: space-between;
  padding-top: 1rem;
  border-top: 1px solid ${props => props.theme.colors.border};
  color: var(--text-primary);
  font-size: 0.9rem;
`;

const UpcomingSection = styled.div`
  margin-top: 6rem;
`;

const EventCard = styled.div`
  background: ${props => props.theme.colors.cardBg};
  border-radius: 16px;
  padding: 2rem;
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  box-shadow: ${props => props.theme.shadows.md};
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateX(5px);
    box-shadow: ${props => props.theme.shadows.lg};
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
  }
`;

const EventDate = styled.div`
  min-width: 100px;
  padding: 1.5rem;
  background: var(--primary-color);
  color: white;
  border-radius: 12px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  
  .day {
    font-size: 2rem;
    font-weight: 700;
    line-height: 1;
    margin-bottom: 0.5rem;
  }
  
  .month {
    font-size: 1rem;
    text-transform: uppercase;
    font-weight: 500;
  }
`;

const EventContent = styled.div`
  flex-grow: 1;
`;

const EventTitle = styled.h4`
  font-size: 1.5rem;
  color: var(--primary-color);
  margin-bottom: 0.75rem;
  font-weight: 600;
`;

const EventInfo = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 1.25rem;
  font-size: 0.95rem;
  color: var(--text-secondary);
  
  @media (max-width: 768px) {
    flex-wrap: wrap;
    gap: 1rem;
  }
  
  div {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    
    svg {
      color: var(--accent-color);
    }
  }
`;

const EventDescription = styled.p`
  color: var(--text-secondary);
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const EventButton = styled.button`
  background: transparent;
  color: var(--primary-color);
  border: 2px solid var(--primary-color);
  border-radius: 8px;
  padding: 0.75rem 1.25rem;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: var(--primary-color);
    color: white;
  }
`;

const Education = () => {
  const courses = [
    {
      title: "Investment Fundamentals",
      description: "Learn the basics of investing, asset classes, risk management, and building your first portfolio in the Nigerian context.",
      image: "/images/course-investment.jpg",
      level: "Beginner",
      duration: "6 weeks",
      lessons: "24 lessons"
    },
    {
      title: "Nigerian Stock Market Mastery",
      description: "Comprehensive guide to understanding and investing in the Nigerian Stock Exchange with practical strategies.",
      image: "/images/course-stock.jpg",
      level: "Intermediate",
      duration: "8 weeks",
      lessons: "32 lessons"
    },
    {
      title: "Real Estate Investment in Nigeria",
      description: "Navigate the property market with confidence, from location analysis to financing and legal considerations.",
      image: "/images/course-realestate.jpg",
      level: "Intermediate",
      duration: "6 weeks",
      lessons: "20 lessons"
    },
    {
      title: "Retirement Planning for Nigerians",
      description: "Build a secure financial future with strategies tailored to the Nigerian pension system and economic realities.",
      image: "/images/course-retirement.jpg",
      level: "All Levels",
      duration: "4 weeks",
      lessons: "16 lessons"
    },
    {
      title: "Advanced Wealth Preservation",
      description: "Protect and grow your assets in volatile markets with advanced strategies for high-net-worth individuals.",
      image: "/images/course-wealth.jpg",
      level: "Advanced",
      duration: "5 weeks",
      lessons: "15 lessons"
    },
    {
      title: "Financial Literacy for Entrepreneurs",
      description: "Essential financial knowledge for business owners in Nigeria, from accounting basics to funding strategies.",
      image: "/images/course-entrepreneur.jpg",
      level: "All Levels",
      duration: "7 weeks",
      lessons: "28 lessons"
    }
  ];
  
  const events = [
    {
      title: "Navigating Inflation: Investment Strategies for 2025",
      date: { day: "15", month: "Mar" },
      time: "10:00 AM - 12:00 PM",
      location: "BloomVest HQ, Victoria Island, Lagos",
      type: "Workshop",
      description: "Join our expert financial advisors for an interactive workshop on protecting and growing your investments during periods of high inflation."
    },
    {
      title: "Financial Planning for Young Professionals",
      date: { day: "22", month: "Mar" },
      time: "2:00 PM - 4:00 PM",
      location: "Virtual Event (Zoom)",
      type: "Webinar",
      description: "Learn how to build a strong financial foundation in your 20s and 30s with practical steps to save, invest, and plan for major life goals."
    },
    {
      title: "Property Investment Masterclass",
      date: { day: "05", month: "Apr" },
      time: "11:00 AM - 4:00 PM",
      location: "Radisson Blu, Ikeja GRA, Lagos",
      type: "Masterclass",
      description: "A comprehensive deep dive into the Nigerian property market with expert insights on location selection, financing options, and legal considerations."
    }
  ];
  
  return (
    <Section id="education">
      <Container>
        <SectionHeader>
          <Preheading>Financial Education</Preheading>
          <Title>Building Financial Intelligence</Title>
          <Subtitle>
            Gain the knowledge and skills to make informed financial decisions through our 
            comprehensive educational programs designed specifically for the Nigerian context.
          </Subtitle>
        </SectionHeader>
        
        <GridContainer>
          <ImageContainer>
            <img src="/images/workshop.jpg" alt="Financial Workshop" />
          </ImageContainer>
          <ContentContainer>
            <ContentTitle>Expert-Led Workshops</ContentTitle>
            <ContentText>
              Our interactive workshops bring financial concepts to life through practical exercises, 
              case studies, and personalized guidance from industry experts.
            </ContentText>
            <FeaturesList>
              <FeatureItem>
                <FaUserFriends /> Small groups for personalized attention
              </FeatureItem>
              <FeatureItem>
                <FaLaptop /> Hands-on activities with real market data
              </FeatureItem>
              <FeatureItem>
                <FaBookOpen /> Comprehensive workbooks and resources
              </FeatureItem>
              <FeatureItem>
                <FaChalkboardTeacher /> Access to instructors for follow-up questions
              </FeatureItem>
            </FeaturesList>
            <Button>
              View Upcoming Workshops <FaArrowRight />
            </Button>
          </ContentContainer>
        </GridContainer>
        
        <GridContainer>
          <ContentContainer>
            <ContentTitle>Online Learning Platform</ContentTitle>
            <ContentText>
              Learn at your own pace with our comprehensive online courses that combine video 
              lessons, interactive quizzes, and practical assignments tailored to Nigerian investors.
            </ContentText>
            <FeaturesList>
              <FeatureItem>
                <FaPlay /> High-quality video lessons from financial experts
              </FeatureItem>
              <FeatureItem>
                <FaFileDownload /> Downloadable resources and templates
              </FeatureItem>
              <FeatureItem>
                <FaUserFriends /> Community forums for peer learning
              </FeatureItem>
              <FeatureItem>
                <FaGraduationCap /> Certificates upon completion
              </FeatureItem>
            </FeaturesList>
            <Button>
              Explore Online Courses <FaArrowRight />
            </Button>
          </ContentContainer>
          <ImageContainer>
            <img src="/images/online-learning.jpg" alt="Online Learning" />
          </ImageContainer>
        </GridContainer>
        
        <CoursesSection>
          <SectionHeader>
            <Preheading>Learning Opportunities</Preheading>
            <Title>Featured Courses</Title>
            <Subtitle>
              Structured educational programs designed to build your financial knowledge 
              from foundational concepts to advanced strategies.
            </Subtitle>
          </SectionHeader>
          
          <CourseGrid>
            {courses.map((course, index) => (
              <CourseCard key={index}>
                <CourseImage>
                  <img src={course.image || "/images/course-placeholder.jpg"} alt={course.title} />
                  <CourseLevel>{course.level}</CourseLevel>
                </CourseImage>
                <CourseContent>
                  <CourseTitle>{course.title}</CourseTitle>
                  <CourseDescription>{course.description}</CourseDescription>
                  <CourseDetails>
                    <span>{course.duration}</span>
                    <span>{course.lessons}</span>
                  </CourseDetails>
                </CourseContent>
              </CourseCard>
            ))}
          </CourseGrid>
        </CoursesSection>
        
        <UpcomingSection>
          <SectionHeader>
            <Preheading>Mark Your Calendar</Preheading>
            <Title>Upcoming Events</Title>
            <Subtitle>
              Join our in-person and virtual events to deepen your financial knowledge 
              and connect with like-minded individuals.
            </Subtitle>
          </SectionHeader>
          
          {events.map((event, index) => (
            <EventCard key={index}>
              <EventDate>
                <div className="day">{event.date.day}</div>
                <div className="month">{event.date.month}</div>
              </EventDate>
              <EventContent>
                <EventTitle>{event.title}</EventTitle>
                <EventInfo>
                  <div>
                    <FaCalendarAlt />
                    <span>{event.time}</span>
                  </div>
                  <div>
                    <FaMapMarkerAlt />
                    <span>{event.location}</span>
                  </div>
                  <div>
                    <FaGraduationCap />
                    <span>{event.type}</span>
                  </div>
                </EventInfo>
                <EventDescription>{event.description}</EventDescription>
                <EventButton>
                  Reserve Your Spot <FaArrowRight />
                </EventButton>
              </EventContent>
            </EventCard>
          ))}
        </UpcomingSection>
        
      </Container>
    </Section>
  );
};

export default Education;