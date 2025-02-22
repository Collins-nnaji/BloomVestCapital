import styled from 'styled-components';
import { MdSecurity, MdTrendingUp, MdPeople } from 'react-icons/md';

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

const FeatureCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  padding: 2rem;
  border-radius: 16px;
  text-align: center;
  transition: transform ${({ theme }) => theme.transitions.default};
  box-shadow: ${({ theme }) => theme.shadows.md};

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }

  h3 {
    margin: 1rem 0;
    font-size: 1.5rem;
  }

  p {
    color: ${({ theme }) => theme.colors.text}90;
  }
`;

const IconWrapper = styled.div`
  width: 80px;
  height: 80px;
  background: ${({ theme }) => theme.colors.primary}15;
  border-radius: 50%;
  display: grid;
  place-items: center;
  margin: 0 auto 1.5rem;
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.primary};
`;

const WhyChooseUs = () => {
  const reasons = [
    { icon: <MdSecurity />, title: "SEC Registered", desc: "Fully compliant with Nigerian regulations" },
    { icon: <MdTrendingUp />, title: "10% Average Returns", desc: "Consistent growth across portfolios" },
    { icon: <MdPeople />, title: "15,000+ Investors", desc: "Largest Naija investment community" }
  ];

  return (
    <section id="why">
      <div className="container">
        <h2>Why BloomVest?</h2>
        <CardGrid>
          {reasons.map((reason, index) => (
            <FeatureCard key={index}>
              <IconWrapper>{reason.icon}</IconWrapper>
              <h3>{reason.title}</h3>
              <p>{reason.desc}</p>
            </FeatureCard>
          ))}
        </CardGrid>
      </div>
    </section>
  );
};

export default WhyChooseUs;