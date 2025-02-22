import styled from 'styled-components';
import { FaWhatsapp } from 'react-icons/fa';

const HeroSection = styled.section`
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary}15,
    ${({ theme }) => theme.colors.secondary}15
  );
  padding: 160px 0 80px;
  position: relative;
  overflow: hidden;
`;

const HeroContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
`;

const HeroHeading = styled.h1`
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
  font-weight: 800;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 2rem;
  opacity: 0.9;
`;

const CTAButton = styled.button`
  background: ${({ theme }) => theme.colors.accent};
  color: ${({ theme }) => theme.colors.white};
  padding: 1rem 2.5rem;
  border-radius: 50px;
  border: none;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: transform ${({ theme }) => theme.transitions.default};
  box-shadow: ${({ theme }) => theme.shadows.md};

  &:hover {
    transform: translateY(-3px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`;

const Hero = () => (
  <HeroSection>
    <div className="container">
      <HeroContent>
        <HeroHeading>Grow Your Wealth Naija Style!</HeroHeading>
        <HeroSubtitle>
          Smart investment solutions for Nigerians - From ₦25k/month
        </HeroSubtitle>
        <CTAButton>
          Start Now <FaWhatsapp size={20} />
        </CTAButton>
      </HeroContent>
    </div>
  </HeroSection>
);

export default Hero;