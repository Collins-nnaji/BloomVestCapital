import styled from 'styled-components';
import { FaTelegram, FaChartLine, FaHandshake } from 'react-icons/fa';

const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

const ServiceCard = styled.div`
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
`;

const ServiceIcon = styled.div`
  width: 60px;
  height: 60px;
  background: ${({ theme }) => theme.colors.primary}15;
  border-radius: 12px;
  display: grid;
  place-items: center;
  margin: 0 auto 1rem;
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.primary};
`;

const ServicePrice = styled.div`
  color: ${({ theme }) => theme.colors.accent};
  font-weight: 700;
  margin: 1rem 0;
`;

const ServiceButton = styled.button`
  background: transparent;
  color: ${({ theme }) => theme.colors.primary};
  border: 2px solid ${({ theme }) => theme.colors.primary};
  padding: 0.8rem 1.5rem;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.default};

  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.white};
  }
`;

const AdditionalServices = () => {
  const services = [
    {
      icon: <FaTelegram />,
      title: "Naija-Bloom Community",
      price: "₦10,000/mo",
      desc: "Real-time alerts & investor mixers"
    },
    {
      icon: <FaChartLine />,
      title: "SME Investment Prep",
      price: "₦150,000",
      desc: "Pitch deck design & financial modeling"
    },
    {
      icon: <FaHandshake />,
      title: "Real Estate Crowdfunding",
      price: "From ₦50,000",
      desc: "Fractional property ownership"
    }
  ];

  return (
    <section className="additional-services">
      <div className="container">
        <h2>More Opportunities</h2>
        <ServicesGrid>
          {services.map((service, index) => (
            <ServiceCard key={index}>
              <ServiceIcon>{service.icon}</ServiceIcon>
              <h3>{service.title}</h3>
              <ServicePrice>{service.price}</ServicePrice>
              <p>{service.desc}</p>
              <ServiceButton>Learn More</ServiceButton>
            </ServiceCard>
          ))}
        </ServicesGrid>
      </div>
    </section>
  );
};

export default AdditionalServices;