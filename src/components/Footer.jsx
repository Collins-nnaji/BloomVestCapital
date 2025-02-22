import styled from 'styled-components';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const FooterWrapper = styled.footer`
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  padding: 4rem 0 2rem;
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const FooterSection = styled.div`
  h4 {
    margin-bottom: 1.5rem;
    font-size: 1.1rem;
    font-weight: 600;
  }

  p {
    opacity: 0.9;
    line-height: 1.8;
    margin: 0.5rem 0;
  }

  a {
    color: ${({ theme }) => theme.colors.white};
    text-decoration: none;
    display: block;
    margin: 0.5rem 0;
    opacity: 0.8;
    transition: opacity ${({ theme }) => theme.transitions.default};

    &:hover {
      opacity: 1;
    }
  }
`;

const PaymentMethods = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin: 1rem 0;

  span {
    background: ${({ theme }) => theme.colors.white}15;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    font-size: 0.9rem;
  }
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-top: 1.5rem;

  svg {
    font-size: 1.5rem;
    opacity: 0.8;
    transition: opacity ${({ theme }) => theme.transitions.default};
    cursor: pointer;

    &:hover {
      opacity: 1;
    }
  }
`;

const FooterBottom = styled.div`
  text-align: center;
  padding-top: 2rem;
  margin-top: 3rem;
  border-top: 1px solid ${({ theme }) => theme.colors.white}20;
`;

const Footer = () => {
  return (
    <FooterWrapper>
      <div className="container">
        <FooterGrid>
          <FooterSection>
            <h4>BloomVest Capital</h4>
            <p>Lagos Headquarters:</p>
            <p>123 Adeola Odeku Street, VI</p>
            <p>contact@bloomvest.ng</p>
          </FooterSection>

          <FooterSection>
            <h4>Quick Links</h4>
            <a href="#services">Services</a>
            <a href="#pricing">Pricing</a>
            <a href="#why">Why Us</a>
          </FooterSection>

          <FooterSection>
            <h4>Payment Methods</h4>
            <PaymentMethods>
              <span>Opay</span>
              <span>PalmPay</span>
              <span>GTBank</span>
            </PaymentMethods>
            <SocialIcons>
              <FaFacebook />
              <FaTwitter />
              <FaInstagram />
            </SocialIcons>
          </FooterSection>
        </FooterGrid>
        <FooterBottom>
          <p>© 2023 BloomVest Capital. All rights reserved</p>
        </FooterBottom>
      </div>
    </FooterWrapper>
  );
};

export default Footer;