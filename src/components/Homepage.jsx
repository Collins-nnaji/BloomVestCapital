import React from 'react';
import styled from 'styled-components';
import { FaArrowRight, FaChartLine, FaFileAlt, FaRegLightbulb } from 'react-icons/fa';
import { motion } from 'framer-motion';

const HeroSection = styled.section`
  padding: 80px 5%;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  min-height: 80vh;
  
  @media (max-width: 768px) {
    flex-direction: column;
    padding: 60px 5% 40px;
    gap: 3rem;
    min-height: auto;
  }
`;

const HeroContent = styled.div`
  flex: 1;
  max-width: 600px;
  z-index: 2;
  
  @media (max-width: 768px) {
    max-width: 100%;
    text-align: center;
  }
`;

const BackgroundDecoration = styled.div`
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(16, 185, 129, 0.05));
  filter: blur(50px);
  z-index: 1;
  
  &.top-left {
    top: -100px;
    left: -150px;
  }
  
  &.bottom-right {
    bottom: -150px;
    right: -100px;
    width: 350px;
    height: 350px;
    background: linear-gradient(135deg, rgba(34, 197, 94, 0.05), rgba(59, 130, 246, 0.15));
  }
`;

const HeroImage = styled.div`
  flex: 1;
  background: linear-gradient(135deg, #2d4e71 0%, #1a365d 100%);
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  min-height: 400px;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 30% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 70%),
               radial-gradient(circle at 70% 30%, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  }
  
  @media (max-width: 1024px) {
    display: none;
  }
`;

const SubHeading = styled(motion.p)`
  font-size: 1.25rem;
  font-weight: 600;
  color: #22c55e;
  margin-bottom: 1.5rem;
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const MainHeading = styled(motion.h1)`
  font-size: 3.5rem;
  font-weight: 800;
  color: #1a365d;
  line-height: 1.2;
  margin-bottom: 1.5rem;
  
  @media (max-width: 1024px) {
    font-size: 3rem;
  }
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

const Description = styled(motion.p)`
  font-size: 1.25rem;
  color: #64748b;
  margin-bottom: 2.5rem;
  line-height: 1.7;
`;

const CTAButton = styled(motion.button)`
  background: #22c55e;
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 50px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 2rem;
  
  @media (max-width: 768px) {
    margin: 2rem auto 0;
    padding: 0.9rem 1.8rem;
    font-size: 1rem;
  }
`;

const FeaturesSection = styled.section`
  padding: 120px 5%;
  background: #ffffff;
  position: relative;
  
  @media (max-width: 768px) {
    padding: 80px 5%;
  }
`;

const TestimonialsSection = styled.section`
  padding: 100px 5%;
  background: #f8fafc;
  position: relative;
`;

const TestimonialContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const TestimonialGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  margin-top: 4rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
  
  @media (max-width: 480px) {
    gap: 1.5rem;
  }
`;

const TestimonialCard = styled(motion.div)`
  background: white;
  border-radius: 16px;
  padding: 2.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.06);
  position: relative;
  
  &::before {
    content: '"';
    position: absolute;
    top: 1.5rem;
    left: 2rem;
    font-size: 4rem;
    color: rgba(34, 197, 94, 0.2);
    font-family: serif;
    line-height: 1;
  }
`;

const TestimonialQuote = styled.p`
  font-size: 1.15rem;
  color: #475569;
  line-height: 1.8;
  margin-bottom: 1.5rem;
  padding-left: 1.5rem;
  font-style: italic;
`;

const TestimonialAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const AuthorAvatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1a365d;
  font-weight: 600;
  font-size: 1.25rem;
`;

const AuthorInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const AuthorName = styled.span`
  font-weight: 600;
  color: #1a365d;
  margin-bottom: 0.25rem;
`;

const AuthorRole = styled.span`
  font-size: 0.9rem;
  color: #64748b;
`;

const StatisticsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  max-width: 1200px;
  margin: 4rem auto 0;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const StatItem = styled(motion.div)`
  text-align: center;
  padding: 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(0, 0, 0, 0.04);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  }
`;

const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a365d;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #1a365d 0%, #22c55e 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const StatLabel = styled.div`
  font-size: 1rem;
  color: #64748b;
  font-weight: 500;
`;

const SectionHeader = styled.div`
  text-align: center;
  max-width: 700px;
  margin: 0 auto 70px;
`;

const SectionTitle = styled.h2`
  font-size: 2.75rem;
  font-weight: 700;
  color: #1a365d;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    font-size: 2.25rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.75rem;
  }
`;

const SectionDescription = styled.p`
  font-size: 1.2rem;
  color: #64748b;
  line-height: 1.7;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2.5rem;
  margin-top: 4rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
  }
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const FeatureCard = styled(motion.div)`
  background: #ffffff;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
    border-color: rgba(0, 0, 0, 0.12);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props => props.bgColor || '#22c55e'};
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.4s ease;
  }
  
  &:hover::before {
    transform: scaleX(1);
  }
`;

const FeatureIcon = styled.div`
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.bgColor || '#e6f7ff'};
  color: ${props => props.iconColor || '#0284c7'};
  border-radius: 12px;
  margin-bottom: 1.5rem;
  font-size: 1.75rem;
  transition: all 0.3s ease;
  
  ${FeatureCard}:hover & {
    transform: scale(1.1) rotate(10deg);
  }
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a365d;
  margin-bottom: 1rem;
`;

const FeatureDescription = styled.p`
  color: #64748b;
  line-height: 1.7;
`;

const HomeContent = () => {
  const features = [
    {
      icon: <FaChartLine />,
      title: "Financial Analysis",
      description: "Gain deeper insights into your financial performance through comprehensive analytics that transform complex data into actionable intelligence.",
      bgColor: "#e6ffec",
      iconColor: "#22c55e"
    },
    {
      icon: <FaRegLightbulb />,
      title: "Strategic Planning",
      description: "Develop forward-looking financial strategies using expert guidance and proven methodologies to achieve your long-term objectives.",
      bgColor: "#fff7e6",
      iconColor: "#f59e0b"
    },
    {
      icon: <FaFileAlt />,
      title: "Financial Reporting",
      description: "Access comprehensive, visually clear financial reports tailored to your business needs for better decision-making and stakeholder communication.",
      bgColor: "#e6f7ff",
      iconColor: "#0284c7"
    }
  ];

  const testimonials = [
    {
      quote: "BloomVest Finance transformed our financial strategy completely. Their expertise helped us identify key growth opportunities and optimize our financial processes.",
      name: "Sarah Johnson",
      role: "CFO, TechGrowth Inc."
    },
    {
      quote: "As a small business owner, I needed guidance on financial planning. BloomVest provided personalized solutions that helped me increase profitability by 35%.",
      name: "Michael Okonkwo",
      role: "Owner, Lighthouse Ventures"
    },
    {
      quote: "The team at BloomVest Finance delivered exceptional results. Their financial reporting systems gave us unprecedented clarity on our business performance.",
      name: "Amina Ibrahim",
      role: "Director of Finance, EcoSolutions Ltd"
    },
    {
      quote: "Working with BloomVest has been a game-changer for our investment strategy. Their expertise and personalized approach exceeded our expectations.",
      name: "David Chen",
      role: "Investment Manager, Global Partners"
    }
  ];

  const statistics = [
    { value: "95%", label: "Client Retention Rate" },
    { value: "₦850M+", label: "Managed Assets" },
    { value: "250+", label: "Satisfied Clients" },
    { value: "35%", label: "Average ROI" }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <>
      <HeroSection>
        <BackgroundDecoration className="top-left" />
        <BackgroundDecoration className="bottom-right" />
        <HeroContent>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <SubHeading variants={itemVariants}>Financial Excellence</SubHeading>
            <MainHeading variants={itemVariants}>Strategic Financial Solutions</MainHeading>
            <Description variants={itemVariants}>
              BloomVest Finance combines proven financial expertise with innovative methodologies to help
              businesses and individuals make informed decisions and achieve strategic growth.
            </Description>
            <CTAButton 
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started <FaArrowRight />
            </CTAButton>
          </motion.div>
        </HeroContent>
        <HeroImage />
      </HeroSection>
      
      <FeaturesSection>
        <SectionHeader>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <SectionTitle>How We Transform Your Finances</SectionTitle>
            <SectionDescription>
              We provide comprehensive financial services that help you optimize performance 
              and make informed decisions for long-term success.
            </SectionDescription>
          </motion.div>
        </SectionHeader>
        
        <FeatureGrid>
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              bgColor={feature.bgColor}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
            >
              <FeatureIcon bgColor={feature.bgColor} iconColor={feature.iconColor}>
                {feature.icon}
              </FeatureIcon>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDescription>{feature.description}</FeatureDescription>
            </FeatureCard>
          ))}
        </FeatureGrid>
        
        <StatisticsSection>
          {statistics.map((stat, index) => (
            <StatItem 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <StatValue>{stat.value}</StatValue>
              <StatLabel>{stat.label}</StatLabel>
            </StatItem>
          ))}
        </StatisticsSection>
      </FeaturesSection>
      
      <TestimonialsSection>
        <SectionHeader>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <SectionTitle>What Our Clients Say</SectionTitle>
            <SectionDescription>
              Discover how our financial expertise has helped businesses and individuals 
              achieve their financial goals and drive growth.
            </SectionDescription>
          </motion.div>
        </SectionHeader>
        
        <TestimonialContainer>
          <TestimonialGrid>
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <TestimonialQuote>{testimonial.quote}</TestimonialQuote>
                <TestimonialAuthor>
                  <AuthorAvatar>{testimonial.name.charAt(0)}</AuthorAvatar>
                  <AuthorInfo>
                    <AuthorName>{testimonial.name}</AuthorName>
                    <AuthorRole>{testimonial.role}</AuthorRole>
                  </AuthorInfo>
                </TestimonialAuthor>
              </TestimonialCard>
            ))}
          </TestimonialGrid>
        </TestimonialContainer>
      </TestimonialsSection>
    </>
  );
};

export default HomeContent; 