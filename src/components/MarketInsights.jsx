import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  FaChartLine, 
  FaArrowUp, 
  FaArrowDown, 
  FaExchangeAlt, 
  FaGlobe, 
  FaNewspaper,
  FaInfoCircle,
  FaArrowRight
} from 'react-icons/fa';
import { motion } from 'framer-motion';

// Styled Components
const Section = styled.section`
  padding: 100px 0;
  background: linear-gradient(to bottom, #f8fafc, #ffffff);
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

const BackgroundDecoration = styled.div`
  position: absolute;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(26, 54, 93, 0.03), rgba(59, 130, 246, 0.05));
  filter: blur(80px);
  z-index: 0;
  
  &.top-right {
    top: -200px;
    right: -200px;
  }
  
  &.bottom-left {
    bottom: -300px;
    left: -200px;
    background: linear-gradient(135deg, rgba(34, 197, 94, 0.03), rgba(16, 185, 129, 0.05));
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
    width: 50px;
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

const TabsContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 3rem;
  gap: 1rem;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`;

const Tab = styled.button`
  padding: 0.75rem 1.5rem;
  background: ${props => props.active ? '#1a365d' : 'white'};
  color: ${props => props.active ? 'white' : '#64748b'};
  border: 1px solid ${props => props.active ? '#1a365d' : '#e2e8f0'};
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: ${props => props.active ? '#1a365d' : '#f8fafc'};
    transform: translateY(-2px);
  }
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 0.6rem 1rem;
  }
`;

const ContentContainer = styled.div`
  margin-bottom: 3rem;
`;

const MarketGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 3rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const MarketCard = styled(motion.div)`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const AssetName = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a365d;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const AssetSymbol = styled.span`
  background: ${props => props.bgColor || '#e6f7ff'};
  color: ${props => props.textColor || '#0284c7'};
  font-size: 0.8rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-weight: 700;
`;

const PriceInfo = styled.div`
  margin-bottom: 1.5rem;
`;

const CurrentPrice = styled.div`
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a365d;
  margin-bottom: 0.5rem;
`;

const PriceChange = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  font-size: 1rem;
  color: ${props => props.isPositive ? '#22c55e' : '#ef4444'};
`;

const HistoryChart = styled.div`
  height: 80px;
  margin-bottom: 1rem;
  background: ${props => props.gradient || 'linear-gradient(to right, #e2e8f0 0%, #bfdbfe 50%, #e2e8f0 100%)'};
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: ${props => props.chartPath || 'linear-gradient(45deg, transparent 49.5%, #1a365d 49.5%, #1a365d 50.5%, transparent 50.5%)'};
    background-size: 15px 15px;
    opacity: 0.2;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 40px;
    background: linear-gradient(to top, rgba(255, 255, 255, 0.9), transparent);
  }
`;

const NewsContainer = styled.div`
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

const NewsCard = styled(motion.div)`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  }
`;

const NewsImage = styled.div`
  height: 180px;
  background: ${props => props.bg || '#e2e8f0'};
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.6));
  }
`;

const NewsContent = styled.div`
  padding: 1.5rem;
`;

const NewsSource = styled.div`
  font-size: 0.85rem;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 0.5rem;
`;

const NewsTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a365d;
  margin-bottom: 0.75rem;
  line-height: 1.4;
`;

const NewsExcerpt = styled.p`
  font-size: 0.95rem;
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const ReadMore = styled.a`
  color: #22c55e;
  font-weight: 600;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const MarketInsights = () => {
  const [activeTab, setActiveTab] = useState('markets');
  
  // Mock market data
  const marketData = [
    {
      name: 'Bitcoin',
      symbol: 'BTC',
      price: '$37,582.44',
      change: '+2.34%',
      isPositive: true,
      symbolColor: '#f7931a',
      symbolBg: '#fff9e6'
    },
    {
      name: 'Ethereum',
      symbol: 'ETH',
      price: '$1,958.32',
      change: '+1.57%',
      isPositive: true,
      symbolColor: '#627eea',
      symbolBg: '#eef2ff'
    },
    {
      name: 'S&P 500',
      symbol: 'SPX',
      price: '4,783.52',
      change: '-0.28%',
      isPositive: false,
      symbolColor: '#1a365d',
      symbolBg: '#e6f7ff'
    },
    {
      name: 'Tesla Inc.',
      symbol: 'TSLA',
      price: '$267.82',
      change: '+3.45%',
      isPositive: true,
      symbolColor: '#cc0000',
      symbolBg: '#fee2e2'
    }
  ];
  
  // Mock news data
  const newsData = [
    {
      source: 'Financial Times',
      title: 'Global markets rally on central bank policy shift expectations',
      excerpt: 'Investors anticipate potential easing of monetary policies as inflation shows signs of cooling across major economies.',
      background: 'linear-gradient(135deg, #1a365d, #3b82f6)'
    },
    {
      source: 'Bloomberg',
      title: 'Tech stocks surge as AI developments accelerate industry growth',
      excerpt: 'Companies investing in artificial intelligence technologies see significant market gains as adoption rates increase.',
      background: 'linear-gradient(135deg, #22c55e, #10b981)'
    },
    {
      source: 'CNBC',
      title: 'Cryptocurrency market stabilizes following regulatory clarity',
      excerpt: 'New regulatory frameworks provide clearer guidelines for digital asset operations, reducing market uncertainty.',
      background: 'linear-gradient(135deg, #f97316, #fb923c)'
    }
  ];
  
  return (
    <Section>
      <BackgroundDecoration className="top-right" />
      <BackgroundDecoration className="bottom-left" />
      <Container>
        <SectionHeader>
          <Preheading>Live Market Insights</Preheading>
          <Title>Real-Time Financial Intelligence</Title>
          <Subtitle>Stay informed with up-to-the-minute market data, trends, and financial news to make better investment decisions.</Subtitle>
        </SectionHeader>
        
        <TabsContainer>
          <Tab active={activeTab === 'markets'} onClick={() => setActiveTab('markets')}>
            <FaChartLine /> Markets
          </Tab>
          <Tab active={activeTab === 'forex'} onClick={() => setActiveTab('forex')}>
            <FaExchangeAlt /> Forex
          </Tab>
          <Tab active={activeTab === 'global'} onClick={() => setActiveTab('global')}>
            <FaGlobe /> Global Indices
          </Tab>
          <Tab active={activeTab === 'news'} onClick={() => setActiveTab('news')}>
            <FaNewspaper /> Latest News
          </Tab>
        </TabsContainer>
        
        <ContentContainer>
          {activeTab === 'markets' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <MarketGrid>
                {marketData.map((asset, index) => (
                  <MarketCard 
                    key={index}
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <CardHeader>
                      <AssetName>{asset.name}</AssetName>
                      <AssetSymbol 
                        bgColor={asset.symbolBg} 
                        textColor={asset.symbolColor}
                      >
                        {asset.symbol}
                      </AssetSymbol>
                    </CardHeader>
                    <PriceInfo>
                      <CurrentPrice>{asset.price}</CurrentPrice>
                      <PriceChange isPositive={asset.isPositive}>
                        {asset.isPositive ? <FaArrowUp /> : <FaArrowDown />}
                        {asset.change}
                      </PriceChange>
                    </PriceInfo>
                    <HistoryChart 
                      gradient={asset.isPositive ? 
                        'linear-gradient(to right, rgba(34, 197, 94, 0.1), rgba(34, 197, 94, 0.2))' : 
                        'linear-gradient(to right, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.2))'
                      }
                    />
                  </MarketCard>
                ))}
              </MarketGrid>
              
              <NewsContainer>
                {newsData.map((news, index) => (
                  <NewsCard 
                    key={index}
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <NewsImage bg={news.background} />
                    <NewsContent>
                      <NewsSource>{news.source}</NewsSource>
                      <NewsTitle>{news.title}</NewsTitle>
                      <NewsExcerpt>{news.excerpt}</NewsExcerpt>
                      <ReadMore href="#">
                        Read full story <FaArrowRight />
                      </ReadMore>
                    </NewsContent>
                  </NewsCard>
                ))}
              </NewsContainer>
            </motion.div>
          )}
          
          {activeTab === 'forex' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <MarketGrid>
                <MarketCard>
                  <CardHeader>
                    <AssetName>EUR/USD</AssetName>
                    <AssetSymbol bgColor="#e6f7ff" textColor="#0284c7">FOREX</AssetSymbol>
                  </CardHeader>
                  <PriceInfo>
                    <CurrentPrice>1.0892</CurrentPrice>
                    <PriceChange isPositive={true}>
                      <FaArrowUp />
                      +0.0015 (0.14%)
                    </PriceChange>
                  </PriceInfo>
                  <HistoryChart gradient="linear-gradient(to right, rgba(34, 197, 94, 0.1), rgba(34, 197, 94, 0.2))" />
                </MarketCard>
                
                <MarketCard>
                  <CardHeader>
                    <AssetName>GBP/USD</AssetName>
                    <AssetSymbol bgColor="#e6f7ff" textColor="#0284c7">FOREX</AssetSymbol>
                  </CardHeader>
                  <PriceInfo>
                    <CurrentPrice>1.2641</CurrentPrice>
                    <PriceChange isPositive={false}>
                      <FaArrowDown />
                      -0.0024 (0.19%)
                    </PriceChange>
                  </PriceInfo>
                  <HistoryChart gradient="linear-gradient(to right, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.2))" />
                </MarketCard>
                
                <MarketCard>
                  <CardHeader>
                    <AssetName>USD/JPY</AssetName>
                    <AssetSymbol bgColor="#e6f7ff" textColor="#0284c7">FOREX</AssetSymbol>
                  </CardHeader>
                  <PriceInfo>
                    <CurrentPrice>146.82</CurrentPrice>
                    <PriceChange isPositive={true}>
                      <FaArrowUp />
                      +0.32 (0.22%)
                    </PriceChange>
                  </PriceInfo>
                  <HistoryChart gradient="linear-gradient(to right, rgba(34, 197, 94, 0.1), rgba(34, 197, 94, 0.2))" />
                </MarketCard>
                
                <MarketCard>
                  <CardHeader>
                    <AssetName>USD/CHF</AssetName>
                    <AssetSymbol bgColor="#e6f7ff" textColor="#0284c7">FOREX</AssetSymbol>
                  </CardHeader>
                  <PriceInfo>
                    <CurrentPrice>0.8725</CurrentPrice>
                    <PriceChange isPositive={false}>
                      <FaArrowDown />
                      -0.0018 (0.21%)
                    </PriceChange>
                  </PriceInfo>
                  <HistoryChart gradient="linear-gradient(to right, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.2))" />
                </MarketCard>
              </MarketGrid>
            </motion.div>
          )}
          
          {(activeTab === 'global' || activeTab === 'news') && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{ textAlign: 'center', padding: '3rem 0' }}
            >
              <FaInfoCircle style={{ fontSize: '3rem', color: '#64748b', marginBottom: '1.5rem' }} />
              <h3 style={{ fontSize: '1.5rem', color: '#1a365d', marginBottom: '1rem' }}>
                {activeTab === 'global' ? 'Global Indices data loading...' : 'Additional news loading...'}
              </h3>
              <p style={{ color: '#64748b', maxWidth: '500px', margin: '0 auto' }}>
                This content is currently being updated with the latest information. Please check back soon.
              </p>
            </motion.div>
          )}
        </ContentContainer>
      </Container>
    </Section>
  );
};

export default MarketInsights; 