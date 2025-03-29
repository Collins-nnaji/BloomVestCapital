import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const HeaderContainer = styled.div`
  padding: 100px 5%;
  background: linear-gradient(170deg, #f8fafc 0%, #eff6ff 100%);
  text-align: center;
  position: relative;
  overflow: hidden;
  margin-bottom: 50px;
  
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
    background: radial-gradient(circle, rgba(26, 54, 93, 0.03) 0%, transparent 70%);
    top: -150px;
    right: -150px;
    border-radius: 50%;
    z-index: 0;
  }
  
  @media (max-width: 768px) {
    padding: 70px 5%;
  }
`;

const Content = styled.div`
  max-width: 900px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
  
  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const PageIndicator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
`;

const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 0.95rem;
  margin-bottom: 15px;
  color: #64748b;
  
  a {
    color: #64748b;
    text-decoration: none;
    transition: all 0.3s ease;
    
    &:hover {
      color: #22c55e;
    }
  }
  
  span {
    color: #22c55e;
    font-weight: 600;
  }
`;

const BreadcrumbSeparator = styled.div`
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: #cbd5e1;
`;

const Title = styled(motion.h1)`
  font-size: 3.5rem;
  font-weight: 900;
  margin-bottom: 1.75rem;
  background: linear-gradient(to right, #1a365d, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -1px;
  line-height: 1.2;
  position: relative;
  display: inline-block;

  &::after {
    content: '';
    position: absolute;
    width: 80px;
    height: 4px;
    background: linear-gradient(to right, #22c55e, #15803d);
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 4px;
  }
  
  @media (max-width: 768px) {
    font-size: 2.75rem;
  }
  
  @media (max-width: 480px) {
    font-size: 2.25rem;
  }
`;

const Subtitle = styled(motion.p)`
  font-size: 1.35rem;
  color: #475569;
  line-height: 1.8;
  margin-bottom: 1.5rem;
  font-weight: 400;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  
  strong {
    color: #1a365d;
    font-weight: 600;
  }
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const PageDot = styled.span`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin: 0 4px;
  background-color: ${props => props.active ? '#22c55e' : '#e2e8f0'};
  transition: all 0.3s ease;
`;

// Animation variants
const titleVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" }
  }
};

const subtitleVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.7, delay: 0.3, ease: "easeOut" }
  }
};

const PageHeader = ({ title, subtitle, children }) => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(segment => segment);
  
  // Page indicators based on available routes
  const pages = [
    { path: '/', name: 'Home' },
    { path: '/about', name: 'About Us' },
    { path: '/services', name: 'Services' },
    { path: '/education', name: 'Education' }
  ];

  // Generate page indicators
  const pathName = location.pathname === '/' ? '/' : `/${pathSegments[0]}`;
  const currentPage = pages.find(page => page.path === pathName);

  return (
    <HeaderContainer>
      <Content>
        <PageIndicator>
          {pages.map((page) => (
            <PageDot 
              key={page.path} 
              active={page.path === pathName} 
            />
          ))}
        </PageIndicator>
        
        <Breadcrumb>
          <a href="/">Home</a>
          <BreadcrumbSeparator />
          {currentPage && <span>{currentPage.name}</span>}
        </Breadcrumb>
        
        <Title
          initial="hidden"
          animate="visible"
          variants={titleVariants}
        >
          {title}
        </Title>
        
        {subtitle && (
          <Subtitle
            initial="hidden"
            animate="visible"
            variants={subtitleVariants}
          >
            {subtitle}
          </Subtitle>
        )}
        
        {children}
      </Content>
    </HeaderContainer>
  );
};

export default PageHeader; 