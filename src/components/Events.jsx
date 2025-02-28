import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUsers,
  FaBuilding,
  FaUserTie,
  FaArrowRight,
  FaFilter,

  FaLaptop
} from 'react-icons/fa';

const Section = styled.section`
  padding: 120px 0;
  background: var(--background);
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(to right, transparent, rgba(34, 197, 94, 0.2), transparent);
  }
`;

const BackgroundAccent = styled.div`
  position: absolute;
  bottom: -200px;
  right: -200px;
  width: 700px;
  height: 700px;
  background: radial-gradient(circle, rgba(34, 197, 94, 0.04) 0%, rgba(255, 255, 255, 0) 70%);
  border-radius: 50%;
  z-index: 0;
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
  margin: 0 auto 60px;
`;

const Preheading = styled.div`
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--accent-color);
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
    width: 60px;
    height: 2px;
    background: var(--accent-color);
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

const FilterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  flex-wrap: wrap;
  gap: 1rem;
`;

const FilterTabs = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 768px) {
    width: 100%;
    overflow-x: auto;
    padding-bottom: 0.5rem;
    gap: 0.5rem;
  }
`;

const FilterTab = styled.button`
  padding: 0.75rem 1.5rem;
  background: ${props => props.active ? 'var(--accent-color)' : 'transparent'};
  color: ${props => props.active ? 'white' : 'var(--text-primary)'};
  border: 2px solid ${props => props.active ? 'var(--accent-color)' : 'rgba(0, 0, 0, 0.1)'};
  border-radius: 30px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  
  &:hover {
    background: ${props => props.active ? 'var(--accent-color)' : 'rgba(34, 197, 94, 0.1)'};
    border-color: var(--accent-color);
  }
  
  @media (max-width: 768px) {
    padding: 0.6rem 1rem;
    font-size: 0.9rem;
  }
`;

const SortDropdown = styled.div`
  position: relative;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const SortButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: white;
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  font-size: 0.95rem;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: var(--accent-color);
  }
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
  }
`;

const EventsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2.5rem;
  
  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const EventCard = styled.div`
  background: ${props => props.theme.colors.cardBg};
  border-radius: 20px;
  overflow: hidden;
  box-shadow: ${props => props.theme.shadows.md};
  transition: all 0.3s ease;
  border: 1px solid transparent;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: ${props => props.theme.shadows.lg};
    border-color: rgba(34, 197, 94, 0.2);
  }
`;

const EventImage = styled.div`
  height: 200px;
  position: relative;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
  
  ${EventCard}:hover & img {
    transform: scale(1.05);
  }
`;

const EventBadge = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: ${props => props.type === 'corporate' ? '#1a365d' : 'var(--accent-color)'};
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 30px;
  font-size: 0.85rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const DateBadge = styled.div`
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: white;
  border-radius: 12px;
  padding: 0.5rem;
  text-align: center;
  min-width: 70px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  
  .month {
    font-size: 0.8rem;
    color: var(--accent-color);
    font-weight: 600;
    text-transform: uppercase;
  }
  
  .day {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--primary-color);
    line-height: 1.2;
  }
`;

const EventContent = styled.div`
  padding: 1.75rem;
`;

const EventTitle = styled.h3`
  font-size: 1.4rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
  font-weight: 600;
  line-height: 1.4;
`;

const EventDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`;

const EventDetail = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  color: var(--text-secondary);
  font-size: 0.95rem;
  
  svg {
    color: var(--accent-color);
    margin-top: 0.25rem;
    flex-shrink: 0;
  }
`;

const EventDescription = styled.p`
  color: var(--text-secondary);
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const PrimaryButton = styled.button`
  background: var(--accent-color);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.9rem 1.5rem;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover {
    background: #1a945e;
    transform: translateY(-2px);
  }
`;

const SecondaryButton = styled.button`
  background: transparent;
  color: var(--primary-color);
  border: 2px solid var(--primary-color);
  border-radius: 8px;
  padding: 0.9rem 1.5rem;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: rgba(26, 54, 93, 0.05);
    transform: translateY(-2px);
  }
`;

const BookingCTA = styled.div`
  margin-top: 80px;
  background: linear-gradient(135deg, var(--primary-color), #2d4e71);
  border-radius: 20px;
  padding: 3.5rem;
  color: white;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
    top: -150px;
    right: -100px;
    border-radius: 50%;
  }
  
  &::after {
    content: '';
    position: absolute;
    width: 200px;
    height: 200px;
    background: radial-gradient(circle, rgba(34, 197, 94, 0.15) 0%, transparent 70%);
    bottom: -100px;
    left: 50px;
    border-radius: 50%;
  }
  
  @media (max-width: 768px) {
    padding: 2.5rem 1.5rem;
  }
`;

const BookingContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
  text-align: center;
`;

const BookingTitle = styled.h3`
  font-size: 2.25rem;
  margin-bottom: 1.5rem;
  font-weight: 700;
  
  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`;

const BookingText = styled.p`
  font-size: 1.1rem;
  opacity: 0.9;
  line-height: 1.7;
  margin-bottom: 2rem;
`;

const BookingButtons = styled.div`
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const BookingButton = styled.button`
  padding: 1.2rem 2.5rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  
  &.primary {
    background: var(--accent-color);
    color: white;
    border: none;
    
    &:hover {
      background: #1a945e;
      transform: translateY(-3px);
      box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
    }
  }
  
  &.secondary {
    background: transparent;
    color: white;
    border: 2px solid white;
    
    &:hover {
      background: rgba(255, 255, 255, 0.1);
      transform: translateY(-3px);
    }
  }
`;

const Events = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  
  const filters = [
    { id: 'all', name: 'All Events' },
    { id: 'individual', name: 'Individual Events', icon: <FaUsers /> },
    { id: 'corporate', name: 'Corporate Events', icon: <FaBuilding /> },
    { id: 'upcoming', name: 'Upcoming' }
  ];
  
  const events = [
    {
      id: 1,
      title: "Investment Strategy Masterclass",
      date: { month: "Mar", day: "15" },
      time: "10:00 AM - 4:00 PM",
      location: "BloomVest Finance HQ, Victoria Island, Lagos",
      format: "In-person workshop",
      type: "individual",
      image: "/images/event-investment-strategy.jpg",
      description: "A comprehensive full-day workshop on building an investment strategy tailored to your personal financial goals and risk tolerance.",
      capacity: "Limited to 20 participants",
      price: "₦25,000 per person"
    },
    {
      id: 2,
      title: "Corporate Financial Wellness Program",
      date: { month: "Mar", day: "22" },
      time: "9:00 AM - 5:00 PM",
      location: "Client's Office or BloomVest Finance HQ",
      format: "On-site training",
      type: "corporate",
      image: "/images/event-corporate-wellness.jpg",
      description: "A customizable financial wellness program for your employees covering retirement planning, investment basics, and personal financial management.",
      capacity: "Up to 50 employees per session",
      price: "Custom pricing based on company size"
    },
    {
      id: 3,
      title: "Real Estate Investment Opportunities",
      date: { month: "Apr", day: "05" },
      time: "2:00 PM - 5:00 PM",
      location: "Radisson Blu, Ikeja GRA, Lagos",
      format: "Seminar & Networking",
      type: "individual",
      image: "/images/event-real-estate.jpg",
      description: "Discover viable property investment opportunities in emerging Nigerian markets with guidance on evaluation metrics and financing options.",
      capacity: "Limited to 30 participants",
      price: "₦15,000 per person"
    },
    {
      id: 4,
      title: "Executive Financial Leadership Summit",
      date: { month: "Apr", day: "12" },
      time: "9:00 AM - 3:00 PM",
      location: "Eko Hotel & Suites, Victoria Island",
      format: "Executive retreat",
      type: "corporate",
      image: "/images/event-executive-summit.jpg",
      description: "Designed for C-suite executives and board members, this summit focuses on strategic financial decision-making and wealth preservation strategies.",
      capacity: "Limited to 15 executives",
      price: "Custom pricing available"
    },
    {
      id: 5,
      title: "Personal Financial Planning Workshop",
      date: { month: "Apr", day: "18" },
      time: "10:00 AM - 1:00 PM",
      location: "Virtual Event (Zoom)",
      format: "Interactive webinar",
      type: "individual",
      image: "/images/event-financial-planning.jpg",
      description: "A hands-on workshop where you'll create your personalized financial plan with guidance from our expert advisors, covering budgeting to investment.",
      capacity: "Limited to 50 participants",
      price: "₦10,000 per person"
    },
    {
      id: 6,
      title: "Treasury Management Masterclass",
      date: { month: "Apr", day: "25" },
      time: "9:00 AM - 4:00 PM",
      location: "BloomVest Finance HQ or Client Location",
      format: "Corporate training",
      type: "corporate",
      image: "/images/event-treasury-management.jpg",
      description: "Specialized training for finance teams on optimizing cash management, investment strategies, and risk mitigation for corporate treasuries.",
      capacity: "Up to 20 finance professionals",
      price: "Custom pricing based on training scope"
    }
  ];
  
  const filteredEvents = events.filter(event => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'upcoming') return true; // In a real app, you'd check dates here
    return event.type === activeFilter;
  });

  return (
    <Section id="events">
      <BackgroundAccent />
      <Container>
        <SectionHeader>
          <Preheading>BloomVest Finance</Preheading>
          <Title>Financial Events & Workshops</Title>
          <Subtitle>
            Join our expert-led events designed to enhance your financial knowledge and help you 
            make better decisions, whether you're an individual investor or representing a corporation.
          </Subtitle>
        </SectionHeader>
        
        <FilterContainer>
          <FilterTabs>
            {filters.map(filter => (
              <FilterTab 
                key={filter.id} 
                active={activeFilter === filter.id}
                onClick={() => setActiveFilter(filter.id)}
              >
                {filter.icon && filter.icon} {filter.name}
              </FilterTab>
            ))}
          </FilterTabs>
          
          <SortDropdown>
            <SortButton>
              <FaFilter /> Sort by Date
            </SortButton>
          </SortDropdown>
        </FilterContainer>
        
        <EventsGrid>
          {filteredEvents.map(event => (
            <EventCard key={event.id}>
              <EventImage>
                <img src={event.image || "/images/event-placeholder.jpg"} alt={event.title} />
                <DateBadge>
                  <div className="month">{event.date.month}</div>
                  <div className="day">{event.date.day}</div>
                </DateBadge>
                <EventBadge type={event.type}>
                  {event.type === 'individual' ? <FaUserTie /> : <FaBuilding />}
                  {event.type === 'individual' ? 'Individual' : 'Corporate'}
                </EventBadge>
              </EventImage>
              <EventContent>
                <EventTitle>{event.title}</EventTitle>
                <EventDetails>
                  <EventDetail>
                    <FaCalendarAlt />
                    <span>{event.time}</span>
                  </EventDetail>
                  <EventDetail>
                    <FaMapMarkerAlt />
                    <span>{event.location}</span>
                  </EventDetail>
                  <EventDetail>
                    <FaLaptop />
                    <span>{event.format}</span>
                  </EventDetail>
                </EventDetails>
                <EventDescription>{event.description}</EventDescription>
                <ButtonsContainer>
                  <PrimaryButton>
                    Book Now <FaArrowRight />
                  </PrimaryButton>
                  <SecondaryButton>Details</SecondaryButton>
                </ButtonsContainer>
              </EventContent>
            </EventCard>
          ))}
        </EventsGrid>
        
        <BookingCTA>
          <BookingContent>
            <BookingTitle>Need a Customized Financial Event?</BookingTitle>
            <BookingText>
              We can design tailored financial training sessions and workshops for your specific needs, 
              whether you're looking for personal guidance or corporate financial education.
            </BookingText>
            <BookingButtons>
              <BookingButton className="primary">
                <FaUsers /> Book for Individuals
              </BookingButton>
              <BookingButton className="secondary">
                <FaBuilding /> Corporate Booking
              </BookingButton>
            </BookingButtons>
          </BookingContent>
        </BookingCTA>
      </Container>
    </Section>
  );
};

export default Events;