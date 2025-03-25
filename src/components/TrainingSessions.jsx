import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  FaGraduationCap, 
  FaUserTie, 
  FaBuilding, 
  FaCalendarAlt, 
  FaClock,

  FaCheckCircle,
  FaArrowRight,
  FaStar,
  FaRegStar,
  FaSearch,
  FaRobot,
  FaUserFriends
} from 'react-icons/fa';

const Section = styled.section`
  padding: 120px 0;
  background: var(--background);
  position: relative;
  overflow: hidden;
  
  @media (max-width: 768px) {
    padding: 80px 0;
  }
`;

const BackgroundPattern = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  background-image: radial-gradient(rgba(34, 197, 94, 0.03) 2px, transparent 2px);
  background-size: 30px 30px;
  z-index: 0;
  opacity: 0.8;
`;

const Container = styled.div`
  max-width: 1200px;
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
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const FilterSection = styled.div`
  margin-bottom: 50px;
`;

const SearchContainer = styled.div`
  max-width: 700px;
  margin: 0 auto 30px;
  position: relative;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 1.25rem 1.5rem 1.25rem 3.5rem;
  border-radius: 12px;
  border: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.cardBg};
  font-size: 1.1rem;
  color: var(--text-primary);
  box-shadow: ${props => props.theme.shadows.sm};
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: var(--accent-color);
    box-shadow: ${props => props.theme.shadows.md};
  }
  
  &::placeholder {
    color: var(--text-secondary);
    opacity: 0.7;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 1.25rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
  font-size: 1.2rem;
`;

const SegmentedControl = styled.div`
  display: flex;
  max-width: 600px;
  margin: 0 auto 20px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  padding: 0.5rem;
`;

const SegmentButton = styled.button`
  flex: 1;
  background: ${props => props.active ? 'white' : 'transparent'};
  color: ${props => props.active ? 'var(--primary-color)' : 'var(--text-secondary)'};
  border: none;
  padding: 1rem;
  font-size: 0.95rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: ${props => props.active ? props.theme.shadows.sm : 'none'};
  
  &:hover {
    background: ${props => props.active ? 'white' : 'rgba(255, 255, 255, 0.5)'};
  }
`;

const TrainingsGrid = styled.div`
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

const TrainingCard = styled.div`
  background: ${props => props.theme.colors.cardBg};
  border-radius: 20px;
  overflow: hidden;
  box-shadow: ${props => props.theme.shadows.md};
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid transparent;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: ${props => props.theme.shadows.lg};
    border-color: rgba(34, 197, 94, 0.2);
  }
`;

const CardHeader = styled.div`
  background: ${props => props.hybrid ? 'linear-gradient(135deg, #1a365d, #22c55e)' : (props.corporate ? 'linear-gradient(135deg, #1a365d, #3b82f6)' : 'linear-gradient(135deg, #22c55e, #4ade80)')};
  padding: 1.5rem;
  color: white;
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 100px;
    height: 100px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%);
    border-radius: 50%;
  }
`;

const CardType = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const CardTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  line-height: 1.3;
  
  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
`;

const CardMeta = styled.div`
  display: flex;
  gap: 1.5rem;
  font-size: 0.9rem;
  opacity: 0.9;
`;

const CardMetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CardBody = styled.div`
  padding: 1.5rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const CardDescription = styled.p`
  color: var(--text-secondary);
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  flex-grow: 1;
`;

const FeaturesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 1.5rem;
`;

const Feature = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  color: var(--text-primary);
  font-size: 0.95rem;
  
  svg {
    color: var(--accent-color);
    flex-shrink: 0;
    margin-top: 0.2rem;
  }
`;

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  
  .stars {
    display: flex;
    color: #f59e0b;
    font-size: 1rem;
  }
  
  .rating-text {
    color: var(--text-secondary);
    font-size: 0.9rem;
  }
`;

const PriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1.25rem;
  border-top: 1px solid ${props => props.theme.colors.border};
  margin-top: auto;
`;

const Price = styled.div`
  .amount {
    font-size: 1.3rem;
    font-weight: 700;
    color: var(--primary-color);
  }
  
  .period {
    font-size: 0.85rem;
    color: var(--text-secondary);
  }
`;

const BookButton = styled.button`
  background: var(--accent-color);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.25rem;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: #1a945e;
    transform: translateY(-2px);
  }
`;

const CategorySection = styled.div`
  margin-top: 80px;
`;

const CategoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const CategoryTitle = styled.h3`
  font-size: 1.75rem;
  color: var(--primary-color);
  font-weight: 700;
`;

const ViewAllLink = styled.a`
  color: var(--accent-color);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    color: #1a945e;
    
    svg {
      transform: translateX(3px);
    }
  }
  
  svg {
    transition: transform 0.3s ease;
  }
`;

const CustomTrainingSection = styled.div`
  margin-top: 100px;
  background: linear-gradient(135deg, var(--primary-color), #2d4e71);
  border-radius: 20px;
  padding: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  overflow: hidden;
  box-shadow: ${props => props.theme.shadows.lg};
  
  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const CustomTrainingImage = styled.div`
  height: 100%;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  @media (max-width: 968px) {
    height: 250px;
  }
`;

const CustomTrainingContent = styled.div`
  padding: 3.5rem;
  color: white;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(34, 197, 94, 0.15) 0%, transparent 70%);
    top: -150px;
    right: -100px;
    border-radius: 50%;
  }
  
  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
  }
`;

const CustomTrainingTitle = styled.h3`
  font-size: 2.25rem;
  margin-bottom: 1.5rem;
  font-weight: 700;
  position: relative;
  z-index: 1;
  
  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`;

const CustomTrainingText = styled.p`
  font-size: 1.1rem;
  opacity: 0.9;
  line-height: 1.7;
  margin-bottom: 2rem;
  position: relative;
  z-index: 1;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 2rem;
  position: relative;
  z-index: 1;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1rem;
  
  svg {
    color: var(--accent-color);
  }
`;

const CustomTrainingButton = styled.button`
  background: var(--accent-color);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 1rem 2rem;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  position: relative;
  z-index: 1;
  
  &:hover {
    background: #1a945e;
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
`;

const CardFooter = styled.div`
  padding: 1.5rem;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const CardRating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const RatingStars = styled.div`
  display: flex;
  color: #f59e0b;
  font-size: 1rem;
`;

const RatingText = styled.div`
  color: var(--text-secondary);
  font-size: 0.9rem;
`;

const CardPrice = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CTAButton = styled.button`
  background: var(--accent-color);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.25rem;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: #1a945e;
    transform: translateY(-2px);
  }
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const EmptyState = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 3rem;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 16px;
  border: 1px dashed rgba(0, 0, 0, 0.1);
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const EmptyTitle = styled.h3`
  font-size: 1.5rem;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
  font-weight: 600;
`;

const EmptyText = styled.p`
  color: var(--text-secondary);
  font-size: 1rem;
`;

const TrainingSessions = () => {
  const [segmentType, setSegmentType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Streamlined training data with fewer, more realistic offerings
  const trainings = [
    {
      id: 1,
      title: "Personal Financial Planning",
      type: "individual",
      isHybrid: false,
      duration: "2 weeks",
      sessions: "4 sessions",
      description: "Build a comprehensive personal financial plan covering budgeting, debt management, savings, and basic investment strategies.",
      features: [
        "Personal budget creation",
        "Debt reduction strategies",
        "Emergency fund planning",
        "Basic investment principles"
      ],
      rating: 4.8,
      reviews: 124,
      price: "₦30,000",
      category: "planning"
    },
    {
      id: 2,
      title: "Corporate Financial Management",
      type: "corporate",
      isHybrid: false,
      duration: "4 weeks",
      sessions: "8 sessions",
      description: "Practical training for financial teams on optimizing capital management, cash flow, and financial reporting.",
      features: [
        "Cash flow optimization",
        "Financial statement analysis",
        "Working capital management",
        "Budgeting and forecasting"
      ],
      rating: 4.7,
      reviews: 42,
      price: "Custom",
      category: "corporate"
    },
    {
      id: 3,
      title: "Investment Fundamentals",
      type: "individual",
      isHybrid: false,
      duration: "3 weeks",
      sessions: "6 sessions",
      description: "Learn essential investment principles, asset classes, risk management, and building a balanced portfolio.",
      features: [
        "Understanding asset classes",
        "Risk and return principles",
        "Portfolio construction basics",
        "Investment goals alignment"
      ],
      rating: 4.9,
      reviews: 86,
      price: "₦40,000",
      category: "investment"
    },
    {
      id: 4,
      title: "Financial Reporting Workshop",
      type: "corporate",
      isHybrid: false,
      duration: "2 weeks",
      sessions: "4 sessions",
      description: "Practical training on creating effective financial reports, analysis, and using reports for business decisions.",
      features: [
        "Financial statement preparation",
        "Key performance indicators",
        "Variance analysis",
        "Management reporting"
      ],
      rating: 4.8,
      reviews: 35,
      price: "Custom",
      category: "reporting"
    },
    {
      id: 5,
      title: "Retirement Planning Essentials",
      type: "individual",
      isHybrid: false,
      duration: "2 weeks",
      sessions: "4 sessions",
      description: "Create a sustainable retirement plan with strategies for savings, investments, and building retirement income.",
      features: [
        "Retirement needs assessment",
        "Savings rate strategies",
        "Pension optimization",
        "Tax-efficient planning"
      ],
      rating: 4.6,
      reviews: 48,
      price: "₦25,000",
      category: "retirement"
    }
  ];
  
  // Filter trainings based on segment type and search query
  const filteredTrainings = trainings.filter(training => {
    // Apply segment filter
    const typeMatch = segmentType === 'all' || 
                      (segmentType === 'individual' && training.type === 'individual') ||
                      (segmentType === 'corporate' && training.type === 'corporate') ||
                      (segmentType === 'hybrid' && training.isHybrid);
    
    // Apply search filter
    const searchMatch = searchQuery === '' || 
                        training.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        training.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return typeMatch && searchMatch;
  });
  
  // Render stars for ratings
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} />);
    }
    
    if (hasHalfStar) {
      stars.push(<FaRegStar key="half" />);
    }
    
    const remainingStars = 5 - stars.length;
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} />);
    }
    
    return stars;
  };

  return (
    <Section id="training">
      <BackgroundPattern />
      <Container>
        <SectionHeader>
          <Preheading>BloomVest Finance</Preheading>
          <Title>Financial Education Programs</Title>
          <Subtitle>
            Practical financial training programs designed for both individuals and corporate clients,
            focused on building essential financial knowledge and skills for better decision-making.
          </Subtitle>
        </SectionHeader>
        
        <FilterSection>
          <SearchContainer>
            <SearchIcon>
              <FaSearch />
            </SearchIcon>
            <SearchInput 
              type="text" 
              placeholder="Search programs..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchContainer>
          
          <SegmentedControl>
            <SegmentButton 
              active={segmentType === 'all'} 
              onClick={() => setSegmentType('all')}
            >
              All Programs
            </SegmentButton>
            <SegmentButton 
              active={segmentType === 'individual'} 
              onClick={() => setSegmentType('individual')}
            >
              <FaUserTie /> Individual
            </SegmentButton>
            <SegmentButton 
              active={segmentType === 'corporate'} 
              onClick={() => setSegmentType('corporate')}
            >
              <FaBuilding /> Corporate
            </SegmentButton>
          </SegmentedControl>
        </FilterSection>
        
        <TrainingsGrid>
          {filteredTrainings.length > 0 ? (
            filteredTrainings.map(training => (
              <TrainingCard key={training.id}>
                <CardHeader corporate={training.type === 'corporate'} hybrid={training.isHybrid}>
                  <CardType>{training.type === 'corporate' ? 'Corporate' : 'Individual'}</CardType>
                  <CardTitle>{training.title}</CardTitle>
                  <CardMeta>
                    <MetaItem>
                      <FaCalendarAlt /> {training.duration}
                    </MetaItem>
                    <MetaItem>
                      <FaClock /> {training.sessions}
                    </MetaItem>
                  </CardMeta>
                </CardHeader>
                
                <CardBody>
                  <CardDescription>{training.description}</CardDescription>
                  
                  <FeaturesList>
                    {training.features.map((feature, index) => (
                      <FeatureItem key={index}><FaCheckCircle /> {feature}</FeatureItem>
                    ))}
                  </FeaturesList>
                </CardBody>
                
                <CardFooter>
                  <CardRating>
                    <RatingStars>{renderStars(training.rating)}</RatingStars>
                    <RatingText>
                      {training.rating} ({training.reviews} reviews)
                    </RatingText>
                  </CardRating>
                  
                  <CardPrice>
                    <Price>{training.price}</Price>
                    <CTAButton>
                      Enroll Now <FaArrowRight />
                    </CTAButton>
                  </CardPrice>
                </CardFooter>
              </TrainingCard>
            ))
          ) : (
            <EmptyState>
              <EmptyIcon>🔍</EmptyIcon>
              <EmptyTitle>No programs found</EmptyTitle>
              <EmptyText>Try adjusting your search or filters to find what you're looking for.</EmptyText>
            </EmptyState>
          )}
        </TrainingsGrid>
      </Container>
    </Section>
  );
};

export default TrainingSessions;