import styled from 'styled-components';
import { FiDollarSign, FiPieChart, FiUsers } from 'react-icons/fi';

const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-top: 3rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const ServiceCard = styled.div`
  padding: 2rem;
  background: ${({ theme }) => theme.colors.white};
  border-radius: 16px;
  text-align: center;
  transition: transform ${({ theme }) => theme.transitions.default};
  border: 2px solid ${({ theme }) => theme.colors.secondary}20;

  &:hover {
    transform: translateY(-5px);
  }

  h3 {
    margin: 1rem 0;
  }

  p {
    color: ${({ theme }) => theme.colors.text}90;
  }
`;

const ServiceIcon = styled.div`
  font-size: 2.5rem;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 1rem;
`;

const Services = () => {
  const services = [
    { icon: <FiDollarSign />, title: "Naira & Dollar Options", desc: "Invest in multiple currencies" },
    { icon: <FiPieChart />, title: "Diversified Portfolios", desc: "Stocks, Real Estate, Agri" },
    { icon: <FiUsers />, title: "Community Support", desc: "24/7 WhatsApp access" },
  ];

  return (
    <section id="services">
      <div className="container">
        <h2>Our Services</h2>
        <ServicesGrid>
          {services.map((service, index) => (
            <ServiceCard key={index}>
              <ServiceIcon>{service.icon}</ServiceIcon>
              <h3>{service.title}</h3>
              <p>{service.desc}</p>
            </ServiceCard>
          ))}
        </ServicesGrid>
      </div>
    </section>
  );
};

export default Services;