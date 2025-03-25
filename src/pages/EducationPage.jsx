import React from 'react';
import styled from 'styled-components';
import TrainingSessions from '../components/TrainingSessions';
import Events from '../components/Events';

const IntroSection = styled.section`
  padding: 80px 5%;
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  text-align: center;
  
  @media (max-width: 768px) {
    padding: 60px 5%;
  }
`;

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const Title = styled.h1`
  font-size: 2.75rem;
  color: #1a365d;
  margin-bottom: 1.5rem;
  font-weight: 700;
  
  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.8rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  color: #475569;
  line-height: 1.7;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const EducationPage = () => (
  <>
    <IntroSection>
      <Container>
        <Title>Financial Education That Makes a Difference</Title>
        <Subtitle>
          At BloomVest Finance, we believe in practical financial education that delivers real results. 
          Our focused training programs and events are designed to build essential financial knowledge 
          and skills that you can immediately apply to your personal finances or business operations.
        </Subtitle>
      </Container>
    </IntroSection>
    <TrainingSessions />
    <Events />
  </>
);

export default EducationPage; 