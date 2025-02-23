import React from 'react';
import styled from 'styled-components';
import { FaArrowRight } from 'react-icons/fa';

const CTASection = styled.section`
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  padding: 5rem 0;
`;

const CTAContent = styled.div`
  max-width: 700px;
  margin: 0 auto;
  text-align: center;
`;

const CTATitle = styled.h2`
  font-size: 2.5rem;
  color: ${({ theme }) => theme.colors.white};
  margin-bottom: 1.5rem;
  
  &::after {
    display: none;
  }
`;

const CTAText = styled.p`
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
`;

const CTAButton = styled.button`
  background: ${({ theme }) => theme.colors.accent};
  color: ${({ theme }) => theme.colors.white};
  padding: 1rem 2rem;
  border-radius: 4px;
  border: none;
  font-size: 1.125rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    background: ${({ theme }) => theme.colors.secondary};
  }
`;

const CTA = () => {
  return (
    <CTASection>
      <div className="container">
        <CTAContent>
          <CTATitle>Ready to Start Your Financial Journey?</CTATitle>
          <CTAText>
            Schedule a free consultation with our expert advisors today.
          </CTAText>
          <CTAButton>
            Get Started <FaArrowRight />
          </CTAButton>
        </CTAContent>
      </div>
    </CTASection>
  );
};

export default CTA;