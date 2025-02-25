import React from 'react';
import styled from 'styled-components';
import { 
  FaPhone, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaWhatsapp, 
  FaLinkedin, 
  FaTwitter, 
  FaInstagram, 
  FaFacebook, 
  FaArrowRight 
} from 'react-icons/fa';

const Section = styled.section`
  padding: 120px 0;
  background: var(--background);
  position: relative;
  overflow: hidden;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const SectionHeader = styled.div`
  text-align: center;
  max-width: 800px;
  margin: 0 auto 80px;
`;

const Preheading = styled.div`
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--accent-color);
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const Title = styled.h2`
  font-size: 3rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  color: var(--text-secondary);
  line-height: 1.7;
`;

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  
  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
`;

const ContactInfo = styled.div``;

const InfoText = styled.p`
  font-size: 1.1rem;
  color: var(--text-secondary);
  line-height: 1.7;
  margin-bottom: 2.5rem;
`;

const ContactMethods = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 3rem;
`;

const ContactMethod = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
`;

const IconContainer = styled.div`
  width: 45px;
  height: 45px;
  background: var(--accent-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.1rem;
  flex-shrink: 0;
`;

const MethodDetails = styled.div``;

const MethodTitle = styled.h4`
  font-size: 1.1rem;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
  font-weight: 600;
`;

const MethodLink = styled.a`
  color: var(--text-secondary);
  font-size: 1rem;
  text-decoration: none;
  transition: color 0.3s ease;
  
  &:hover {
    color: var(--accent-color);
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2.5rem;
`;

const SocialLink = styled.a`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: all 0.3s ease;
  
  &:hover {
    background: var(--accent-color);
    transform: translateY(-3px);
  }
`;

const FormContainer = styled.div`
  background: ${props => props.theme.colors.cardBg};
  border-radius: 20px;
  padding: 3rem;
  box-shadow: ${props => props.theme.shadows.md};
  
  @media (max-width: 768px) {
    padding: 2rem;
  }
`;

const FormTitle = styled.h3`
  font-size: 1.75rem;
  color: var(--primary-color);
  margin-bottom: 2rem;
  font-weight: 600;
`;

const Form = styled.form``;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const FormLabel = styled.label`
  display: block;
  font-size: 0.95rem;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 1rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 1rem;
  color: var(--text-primary);
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: var(--accent-color);
  }
`;

const FormSelect = styled.select`
  width: 100%;
  padding: 1rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 1rem;
  color: var(--text-primary);
  transition: all 0.3s ease;
  background: white;
  
  &:focus {
    outline: none;
    border-color: var(--accent-color);
  }
`;

const FormTextarea = styled.textarea`
  width: 100%;
  padding: 1rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 1rem;
  color: var(--text-primary);
  transition: all 0.3s ease;
  min-height: 150px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: var(--accent-color);
  }
`;

const SubmitButton = styled.button`
  background: var(--accent-color);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 1rem 2rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: #1a945e;
    transform: translateY(-3px);
  }
`;

const MapSection = styled.div`
  margin-top: 80px;
  position: relative;
  height: 450px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: ${props => props.theme.shadows.md};
  
  iframe {
    width: 100%;
    height: 100%;
    border: none;
  }
`;

const Contact = () => {
  return (
    <Section id="contact">
      <Container>
        <SectionHeader>
          <Preheading>Get In Touch</Preheading>
          <Title>Contact Us</Title>
          <Subtitle>
            Have questions or ready to start your financial journey? Reach out to our team 
            for personalized assistance and guidance.
          </Subtitle>
        </SectionHeader>
        
        <ContactGrid>
          <ContactInfo>
            <InfoText>
              We're here to help you navigate your financial path. Contact us for questions about 
              our services, to schedule a consultation, or to learn more about how we can assist 
              with your specific financial needs.
            </InfoText>
            
            <ContactMethods>
              <ContactMethod>
                <IconContainer>
                  <FaPhone />
                </IconContainer>
                <MethodDetails>
                  <MethodTitle>Phone Number</MethodTitle>
                  <MethodLink href="tel:+2341234567890">+234 123 456 7890</MethodLink>
                </MethodDetails>
              </ContactMethod>
              
              <ContactMethod>
                <IconContainer>
                  <FaWhatsapp />
                </IconContainer>
                <MethodDetails>
                  <MethodTitle>WhatsApp</MethodTitle>
                  <MethodLink href="https://wa.me/2341234567890">+234 123 456 7890</MethodLink>
                </MethodDetails>
              </ContactMethod>
              
              <ContactMethod>
                <IconContainer>
                  <FaEnvelope />
                </IconContainer>
                <MethodDetails>
                  <MethodTitle>Email Address</MethodTitle>
                  <MethodLink href="mailto:hello@bloomvest.ng">hello@bloomvest.ng</MethodLink>
                </MethodDetails>
              </ContactMethod>
              
              <ContactMethod>
                <IconContainer>
                  <FaMapMarkerAlt />
                </IconContainer>
                <MethodDetails>
                  <MethodTitle>Office Location</MethodTitle>
                  <MethodLink href="https://maps.google.com" target="_blank">
                    123 Victoria Island, Lagos, Nigeria
                  </MethodLink>
                </MethodDetails>
              </ContactMethod>
            </ContactMethods>
            
            <div>
              <h4 style={{ marginBottom: '1rem', color: 'var(--primary-color)' }}>Follow Us</h4>
              <SocialLinks>
                <SocialLink href="https://linkedin.com" target="_blank" aria-label="LinkedIn">
                  <FaLinkedin />
                </SocialLink>
                <SocialLink href="https://twitter.com" target="_blank" aria-label="Twitter">
                  <FaTwitter />
                </SocialLink>
                <SocialLink href="https://instagram.com" target="_blank" aria-label="Instagram">
                  <FaInstagram />
                </SocialLink>
                <SocialLink href="https://facebook.com" target="_blank" aria-label="Facebook">
                  <FaFacebook />
                </SocialLink>
              </SocialLinks>
            </div>
          </ContactInfo>
          
          <FormContainer>
            <FormTitle>Send Us a Message</FormTitle>
            <Form>
              <FormGrid>
                <FormGroup>
                  <FormLabel>Full Name</FormLabel>
                  <FormInput type="text" placeholder="Your name" />
                </FormGroup>
                <FormGroup>
                  <FormLabel>Email Address</FormLabel>
                  <FormInput type="email" placeholder="Your email" />
                </FormGroup>
              </FormGrid>
              
              <FormGrid>
                <FormGroup>
                  <FormLabel>Phone Number</FormLabel>
                  <FormInput type="tel" placeholder="Your phone number" />
                </FormGroup>
                <FormGroup>
                  <FormLabel>Subject</FormLabel>
                  <FormSelect>
                    <option value="">Select a subject</option>
                    <option value="advisory">Financial Advisory</option>
                    <option value="education">Financial Education</option>
                    <option value="property">Property Investment</option>
                    <option value="career">Career Opportunities</option>
                    <option value="other">Other</option>
                  </FormSelect>
                </FormGroup>
              </FormGrid>
              
              <FormGroup>
                <FormLabel>Message</FormLabel>
                <FormTextarea placeholder="How can we help you?"></FormTextarea>
              </FormGroup>
              
              <SubmitButton type="submit">
                Send Message <FaArrowRight />
              </SubmitButton>
            </Form>
          </FormContainer>
        </ContactGrid>
        
        <MapSection>
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.7225281457883!2d3.4191359!3d6.4280556!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103bf53280e7648d%3A0x4d01e5de6b847fe6!2sVictoria%20Island%2C%20Lagos!5e0!3m2!1sen!2sng!4v1645554488797!5m2!1sen!2sng" 
            allowFullScreen="" 
            loading="lazy"
            title="Office Location"
          ></iframe>
        </MapSection>
      </Container>
    </Section>
  );
};

export default Contact;