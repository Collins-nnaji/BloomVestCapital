import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  FaSearch, 
  FaFileAlt, 
  FaVideo, 
  FaCalculator, 
  FaNewspaper, 

  FaPlay, 
  FaArrowRight,
  FaChartLine,
  FaHome,
  FaPiggyBank,
  FaMoneyBillWave,
  FaBriefcase
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

const SearchContainer = styled.div`
  max-width: 700px;
  margin: 0 auto 50px;
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

const FilterTabs = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 50px;
  gap: 1rem;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`;

const FilterTab = styled.button`
  padding: 0.75rem 1.5rem;
  background: ${props => props.active ? 'var(--accent-color)' : 'transparent'};
  color: ${props => props.active ? 'white' : 'var(--text-primary)'};
  border: 2px solid ${props => props.active ? 'var(--accent-color)' : props.theme.colors.border};
  border-radius: 30px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.active ? 'var(--accent-color)' : 'rgba(34, 197, 94, 0.1)'};
    border-color: ${props => props.active ? 'var(--accent-color)' : 'var(--accent-color)'};
  }
  
  @media (max-width: 768px) {
    padding: 0.6rem 1.25rem;
    font-size: 0.9rem;
  }
`;

const ResourcesGrid = styled.div`
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

const ResourceCard = styled.div`
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

const ResourceImage = styled.div`
  height: 200px;
  position: relative;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
  
  ${ResourceCard}:hover & img {
    transform: scale(1.05);
  }
`;

const ResourceType = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: var(--primary-color);
  color: white;
  padding: 0.5rem;
  border-radius: 8px;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PlayButton = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  background: var(--accent-color);
  border-radius: 50%;
  display: ${props => props.show ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translate(-50%, -50%) scale(1.1);
    background: #1a945e;
  }
`;

const ResourceContent = styled.div`
  padding: 1.5rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const ResourceCategory = styled.div`
  color: var(--accent-color);
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  svg {
    font-size: 1rem;
  }
`;

const ResourceTitle = styled.h3`
  font-size: 1.25rem;
  color: var(--primary-color);
  margin-bottom: 0.75rem;
  font-weight: 600;
  line-height: 1.4;
`;

const ResourceDescription = styled.p`
  color: var(--text-secondary);
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  flex-grow: 1;
`;

const ResourceFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
`;

const ResourceDate = styled.div`
  font-size: 0.85rem;
  color: var(--text-secondary);
`;

const ResourceButton = styled.button`
  background: none;
  border: none;
  color: var(--accent-color);
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  svg {
    transition: transform 0.3s ease;
  }
  
  &:hover {
    color: #1a945e;
    
    svg {
      transform: translateX(3px);
    }
  }
`;

const LoadMoreButton = styled.button`
  background: transparent;
  color: var(--primary-color);
  border: 2px solid var(--primary-color);
  border-radius: 8px;
  padding: 1rem 2rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 50px auto 0;
  
  &:hover {
    background: var(--primary-color);
    color: white;
  }
`;

const NewsletterSection = styled.div`
  margin-top: 100px;
  background: linear-gradient(135deg, var(--primary-color), #2d4e71);
  border-radius: 20px;
  padding: 3.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  
  @media (max-width: 968px) {
    flex-direction: column;
    text-align: center;
    gap: 2rem;
  }
`;

const NewsletterContent = styled.div`
  max-width: 500px;
  
  @media (max-width: 968px) {
    max-width: 100%;
  }
`;

const NewsletterTitle = styled.h3`
  font-size: 2rem;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`;

const NewsletterText = styled.p`
  font-size: 1.1rem;
  opacity: 0.9;
  line-height: 1.7;
`;

const NewsletterForm = styled.form`
  display: flex;
  min-width: 450px;
  
  @media (max-width: 1024px) {
    min-width: auto;
    width: 100%;
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const NewsletterInput = styled.input`
  flex-grow: 1;
  padding: 1rem 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
  border-radius: 8px 0 0 8px;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }
  
  &:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.15);
  }
  
  @media (max-width: 768px) {
    border-radius: 8px;
  }
`;

const NewsletterButton = styled.button`
  background: var(--accent-color);
  color: white;
  border: none;
  border-radius: 0 8px 8px 0;
  padding: 1rem 1.5rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #1a945e;
  }
  
  @media (max-width: 768px) {
    border-radius: 8px;
  }
`;

const Resources = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const resourceCategories = [
    { id: 'all', name: 'All Resources' },
    { id: 'guides', name: 'Guides & E-books' },
    { id: 'videos', name: 'Video Tutorials' },
    { id: 'tools', name: 'Calculators & Tools' },
    { id: 'articles', name: 'Articles & Insights' }
  ];
  
  const resources = [
    {
      id: 1,
      title: "Beginner's Guide to Investing in Nigeria",
      description: "Learn the fundamentals of investing in the Nigerian market with this comprehensive guide for beginners.",
      category: "guides",
      type: <FaFileAlt />,
      icon: <FaChartLine />,
      categoryName: "Investment",
      image: "/images/resource-beginners-guide.jpg",
      date: "February 15, 2025",
      buttonText: "Download PDF"
    },
    {
      id: 2,
      title: "Understanding the Nigerian Stock Exchange",
      description: "A video tutorial explaining how the Nigerian Stock Exchange works and how to start investing in stocks.",
      category: "videos",
      type: <FaVideo />,
      icon: <FaChartLine />,
      categoryName: "Investment",
      image: "/images/resource-nse.jpg",
      date: "February 10, 2025",
      buttonText: "Watch Video",
      isVideo: true
    },
    {
      id: 3,
      title: "Retirement Calculator",
      description: "Plan your retirement effectively with our interactive calculator designed specifically for the Nigerian context.",
      category: "tools",
      type: <FaCalculator />,
      icon: <FaPiggyBank />,
      categoryName: "Retirement",
      image: "/images/resource-calculator.jpg",
      date: "February 5, 2025",
      buttonText: "Use Calculator"
    },
    {
      id: 4,
      title: "Impact of Inflation on Your Investments",
      description: "Understand how inflation affects your investment portfolio and strategies to protect your wealth.",
      category: "articles",
      type: <FaNewspaper />,
      icon: <FaMoneyBillWave />,
      categoryName: "Economy",
      image: "/images/resource-inflation.jpg",
      date: "January 28, 2025",
      buttonText: "Read Article"
    },
    {
      id: 5,
      title: "Property Investment Masterclass",
      description: "Learn how to analyze property investments, evaluate locations, and maximize returns in Nigeria's real estate market.",
      category: "videos",
      type: <FaVideo />,
      icon: <FaHome />,
      categoryName: "Real Estate",
      image: "/images/resource-property.jpg",
      date: "January 20, 2025",
      buttonText: "Watch Video",
      isVideo: true
    },
    {
      id: 6,
      title: "Tax-Efficient Investing in Nigeria",
      description: "Strategies to minimize your tax liability and maximize returns across different investment vehicles.",
      category: "guides",
      type: <FaFileAlt />,
      icon: <FaMoneyBillWave />,
      categoryName: "Tax Planning",
      image: "/images/resource-tax.jpg",
      date: "January 15, 2025",
      buttonText: "Download PDF"
    },
    {
      id: 7,
      title: "Investment Returns Calculator",
      description: "Project potential returns from different investment types with our interactive calculator.",
      category: "tools",
      type: <FaCalculator />,
      icon: <FaChartLine />,
      categoryName: "Investment",
      image: "/images/resource-returns.jpg",
      date: "January 10, 2025",
      buttonText: "Use Calculator"
    },
    {
      id: 8,
      title: "Creating a Financial Emergency Fund",
      description: "Why every Nigerian needs an emergency fund and how to build one efficiently.",
      category: "articles",
      type: <FaNewspaper />,
      icon: <FaPiggyBank />,
      categoryName: "Personal Finance",
      image: "/images/resource-emergency.jpg",
      date: "January 5, 2025",
      buttonText: "Read Article"
    },
    {
      id: 9,
      title: "Investment Opportunities in Nigerian Agriculture",
      description: "Explore the growing potential in Nigeria's agricultural sector and how to invest effectively.",
      category: "videos",
      type: <FaVideo />,
      icon: <FaBriefcase />,
      categoryName: "Sector Analysis",
      image: "/images/resource-agriculture.jpg",
      date: "December 28, 2024",
      buttonText: "Watch Video",
      isVideo: true
    }
  ];
  
  const filteredResources = resources.filter(resource => {
    // Apply category filter
    const categoryMatch = activeFilter === 'all' || resource.category === activeFilter;
    
    // Apply search filter
    const searchMatch = searchQuery === '' || 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.categoryName.toLowerCase().includes(searchQuery.toLowerCase());
    
    return categoryMatch && searchMatch;
  });
  
  return (
    <Section id="resources">
      <Container>
        <SectionHeader>
          <Preheading>Knowledge Center</Preheading>
          <Title>Financial Resources</Title>
          <Subtitle>
            Access free guides, calculators, videos, and articles to enhance your 
            financial knowledge and make better investment decisions.
          </Subtitle>
        </SectionHeader>
        
        <SearchContainer>
          <SearchIcon>
            <FaSearch />
          </SearchIcon>
          <SearchInput 
            type="text" 
            placeholder="Search for resources..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SearchContainer>
        
        <FilterTabs>
          {resourceCategories.map(category => (
            <FilterTab 
              key={category.id} 
              active={activeFilter === category.id}
              onClick={() => setActiveFilter(category.id)}
            >
              {category.name}
            </FilterTab>
          ))}
        </FilterTabs>
        
        <ResourcesGrid>
          {filteredResources.map(resource => (
            <ResourceCard key={resource.id}>
              <ResourceImage>
                <img src={resource.image || "/images/resource-placeholder.jpg"} alt={resource.title} />
                <ResourceType>{resource.type}</ResourceType>
                {resource.isVideo && (
                  <PlayButton show={true}>
                    <FaPlay />
                  </PlayButton>
                )}
              </ResourceImage>
              <ResourceContent>
                <ResourceCategory>
                  {resource.icon} {resource.categoryName}
                </ResourceCategory>
                <ResourceTitle>{resource.title}</ResourceTitle>
                <ResourceDescription>{resource.description}</ResourceDescription>
                <ResourceFooter>
                  <ResourceDate>{resource.date}</ResourceDate>
                  <ResourceButton>
                    {resource.buttonText} <FaArrowRight />
                  </ResourceButton>
                </ResourceFooter>
              </ResourceContent>
            </ResourceCard>
          ))}
        </ResourcesGrid>
        
        <LoadMoreButton>
          Load More Resources
        </LoadMoreButton>
        
        <NewsletterSection>
          <NewsletterContent>
            <NewsletterTitle>Subscribe to Our Financial Insights</NewsletterTitle>
            <NewsletterText>
              Get weekly updates on market trends, investment opportunities, and educational content 
              delivered directly to your inbox.
            </NewsletterText>
          </NewsletterContent>
          
          <NewsletterForm>
            <NewsletterInput 
              type="email" 
              placeholder="Your email address" 
            />
            <NewsletterButton type="submit">
              Subscribe
            </NewsletterButton>
          </NewsletterForm>
        </NewsletterSection>
      </Container>
    </Section>
  );
};

export default Resources;