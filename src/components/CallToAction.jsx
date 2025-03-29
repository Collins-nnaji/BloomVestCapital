import React from 'react';
import styled from 'styled-components';
import { FaArrowRight, FaLock, FaChartLine, FaRegLightbulb } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Section = styled.section`
  background: linear-gradient(135deg, #1a365d 0%, #0f172a 100%);
  padding: 120px 0;
  position: relative;
  overflow: hidden;
  color: white;
`;

const BackgroundAnimation = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    width: 300%;
    height: 300%;
    top: -100%;
    left: -100%;
    background: radial-gradient(rgba(59, 130, 246, 0.15) 2px, transparent 2px);
    background-size: 50px 50px;
    animation: moveGridBackground 60s linear infinite;
  }
  
  @keyframes moveGridBackground {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const BackgroundGlow = styled.div`
  position: absolute;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.2;
  
  &.green {
    background: rgba(34, 197, 94, 0.5);
    top: -100px;
    right: -100px;
  }
  
  &.blue {
    background: rgba(59, 130, 246, 0.5);
    bottom: -100px;
    left: -100px;
  }
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4rem;
  
  @media (max-width: 1024px) {
    flex-direction: column;
    text-align: center;
  }
`;

const ContentColumn = styled.div`
  flex: 1;
  max-width: 600px;
  
  @media (max-width: 1024px) {
    max-width: 100%;
  }
`;

const Heading = styled(motion.h2)`
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  line-height: 1.2;
  background: linear-gradient(to right, #ffffff, #22c55e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subheading = styled(motion.p)`
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 2.5rem;
  line-height: 1.7;
`;

const Benefits = styled(motion.div)`
  margin-bottom: 3rem;
`;

const BenefitItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.25rem;
  
  @media (max-width: 1024px) {
    justify-content: center;
  }
`;

const BenefitIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(34, 197, 94, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: #22c55e;
  flex-shrink: 0;
`;

const BenefitText = styled.div`
  font-weight: 500;
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.9);
`;

const CTAButtons = styled(motion.div)`
  display: flex;
  gap: 1.5rem;
  
  @media (max-width: 1024px) {
    justify-content: center;
  }
  
  @media (max-width: 640px) {
    flex-direction: column;
    align-items: center;
  }
`;

const PrimaryButton = styled.a`
  background: #22c55e;
  color: white;
  font-weight: 600;
  padding: 1.25rem 2.5rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.3s ease;
  cursor: pointer;
  text-decoration: none;
  font-size: 1.125rem;
  box-shadow: 0 10px 25px rgba(34, 197, 94, 0.4);
  
  &:hover {
    transform: translateY(-5px);
    background: #16a34a;
    box-shadow: 0 15px 30px rgba(34, 197, 94, 0.5);
  }
  
  @media (max-width: 640px) {
    width: 100%;
    justify-content: center;
  }
`;

const SecondaryButton = styled.a`
  background: transparent;
  color: white;
  font-weight: 600;
  padding: 1.25rem 2.5rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.3s ease;
  cursor: pointer;
  text-decoration: none;
  font-size: 1.125rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  
  &:hover {
    transform: translateY(-5px);
    border-color: white;
    background: rgba(255, 255, 255, 0.1);
  }
  
  @media (max-width: 640px) {
    width: 100%;
    justify-content: center;
  }
`;

const FormColumn = styled.div`
  flex: 1;
  max-width: 550px;
  
  @media (max-width: 1024px) {
    max-width: 600px;
    width: 100%;
  }
`;

const ContactForm = styled(motion.div)`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 3rem;
  backdrop-filter: blur(10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  
  @media (max-width: 768px) {
    padding: 2rem;
  }
`;

const FormTitle = styled.h3`
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: white;
`;

const FormDescription = styled.p`
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 2rem;
  font-size: 1.1rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #22c55e;
    background: rgba(255, 255, 255, 0.1);
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
`;

const FormSelect = styled.select`
  width: 100%;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
  font-size: 1rem;
  transition: all 0.3s ease;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1em;
  
  &:focus {
    outline: none;
    border-color: #22c55e;
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  option {
    background: #1a365d;
    color: white;
  }
`;

const FormSubmitButton = styled.button`
  width: 100%;
  padding: 1.25rem;
  background: linear-gradient(to right, #22c55e, #16a34a);
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.75rem;
  margin-top: 1rem;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 25px rgba(34, 197, 94, 0.3);
  }
`;

const SecurityNote = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 1.5rem;
  justify-content: center;
`;

const CallToAction = () => {
  return (
    <Section>
      <BackgroundAnimation />
      <BackgroundGlow className="green" />
      <BackgroundGlow className="blue" />
      
      <Container>
        <ContentColumn>
          <Heading
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Transform Your Financial Future Today
          </Heading>
          
          <Subheading
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Take the first step toward financial growth and stability with a personalized consultation. Our experts are ready to help you navigate your financial journey.
          </Subheading>
          
          <Benefits
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <BenefitItem>
              <BenefitIcon>
                <FaRegLightbulb />
              </BenefitIcon>
              <BenefitText>Personalized financial strategies tailored to your goals</BenefitText>
            </BenefitItem>
            
            <BenefitItem>
              <BenefitIcon>
                <FaChartLine />
              </BenefitIcon>
              <BenefitText>AI-powered market insights and opportunity alerts</BenefitText>
            </BenefitItem>
            
            <BenefitItem>
              <BenefitIcon>
                <FaLock />
              </BenefitIcon>
              <BenefitText>Secure, confidential handling of your financial information</BenefitText>
            </BenefitItem>
          </Benefits>
          
          <CTAButtons
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <PrimaryButton href="#">
              Schedule Consultation <FaArrowRight />
            </PrimaryButton>
            <SecondaryButton href="#">
              View Service Plans
            </SecondaryButton>
          </CTAButtons>
        </ContentColumn>
        
        <FormColumn>
          <ContactForm
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <FormTitle>Request More Information</FormTitle>
            <FormDescription>Fill out the form below and one of our financial advisors will contact you shortly.</FormDescription>
            
            <form>
              <FormGroup>
                <FormLabel>Full Name</FormLabel>
                <FormInput type="text" placeholder="Your name" />
              </FormGroup>
              
              <FormGroup>
                <FormLabel>Email Address</FormLabel>
                <FormInput type="email" placeholder="email@example.com" />
              </FormGroup>
              
              <FormGroup>
                <FormLabel>Phone Number</FormLabel>
                <FormInput type="tel" placeholder="(123) 456-7890" />
              </FormGroup>
              
              <FormGroup>
                <FormLabel>I'm interested in</FormLabel>
                <FormSelect>
                  <option value="" disabled selected>Select a service</option>
                  <option value="investment">Investment Planning</option>
                  <option value="retirement">Retirement Planning</option>
                  <option value="tax">Tax Optimization</option>
                  <option value="wealth">Wealth Management</option>
                  <option value="business">Business Financial Services</option>
                </FormSelect>
              </FormGroup>
              
              <FormSubmitButton type="submit">
                Submit Request <FaArrowRight />
              </FormSubmitButton>
              
              <SecurityNote>
                <FaLock /> Your information is secure and will never be shared with third parties.
              </SecurityNote>
            </form>
          </ContactForm>
        </FormColumn>
      </Container>
    </Section>
  );
};

export default CallToAction; 