import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  FaUserShield, 
  FaGraduationCap, 
  FaHandshake, 
  FaGlobeAfrica,
  FaRobot,
  FaLock,
  FaChartLine,
  FaRegLightbulb,
  FaArrowRight,
  FaTimes,
  FaCheckCircle,
  FaInfoCircle,
  FaBook,
  FaCalendarAlt
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Section = styled.section`
  padding: 6rem 0;
  position: relative;
  overflow: hidden;
  background: linear-gradient(170deg, #f8fafc 0%, #eff6ff 100%);
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 6px;
    background: linear-gradient(to right, #22c55e, #15803d);
  }
`;

const BackgroundAccent = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 800px;
  height: 800px;
  background: radial-gradient(circle, rgba(34, 197, 94, 0.04) 0%, rgba(255, 255, 255, 0) 70%);
  border-radius: 50%;
  z-index: 0;
`;

const BackgroundAccent2 = styled.div`
  position: absolute;
  top: -150px;
  left: -150px;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(26, 54, 93, 0.03) 0%, rgba(255, 255, 255, 0) 70%);
  border-radius: 50%;
  z-index: 0;
`;

const BackgroundPattern = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    linear-gradient(rgba(255, 255, 255, 0.8) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.8) 1px, transparent 1px), 
    radial-gradient(rgba(26, 54, 93, 0.03) 1.5px, transparent 1.5px);
  background-size: 50px 50px, 50px 50px, 30px 30px;
  background-position: 0 0, 0 0, 15px 15px;
  opacity: 0.4;
  z-index: 0;
  pointer-events: none;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const Heading = styled.h2`
  text-align: center;
  font-size: 3.25rem;
  font-weight: 900;
  margin-bottom: 1.5rem;
  color: #1a365d;
  background: linear-gradient(to right, #1a365d, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -1px;
  
  @media (max-width: 768px) {
    font-size: 2.75rem;
  }
`;

const Description = styled.p`
  text-align: center;
  font-size: 1.35rem;
  line-height: 1.8;
  color: #475569;
  max-width: 800px;
  margin: 0 auto 4rem;
  
  strong {
    font-weight: 600;
    color: #1a365d;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const Card = styled(motion.div)`
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
  }
`;

const CardHeader = styled.div`
  padding: 2rem 2rem 1rem;
  display: flex;
  align-items: center;
`;

const IconContainer = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1.25rem;
  background: ${props => `rgba(${props.color}, 0.15)`};
  
  svg {
    font-size: 2rem;
    color: ${props => `rgb(${props.color})`};
  }
`;

const CardTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  color: #1a365d;
`;

const CardContent = styled.div`
  padding: 0 2rem 2rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const CardDescription = styled.p`
  font-size: 1.125rem;
  line-height: 1.7;
  color: #475569;
  margin-bottom: 1.5rem;
`;

const Button = styled.button`
  margin-top: auto;
  background: transparent;
  color: #22c55e;
  border: 2px solid #22c55e;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover {
    background: #22c55e;
    color: white;
  }
  
  svg {
    transition: transform 0.3s ease;
  }
  
  &:hover svg {
    transform: translateX(3px);
  }
`;

// Modal components
const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 2rem;
  backdrop-filter: blur(5px);
`;

const ModalContent = styled(motion.div)`
  background: white;
  border-radius: 1rem;
  width: 90%;
  max-width: 800px;
  max-height: 85vh;
  overflow-y: auto;
  position: relative;
  padding: 0;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
`;

const ModalHeader = styled.div`
  padding: 2.5rem 2.5rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  position: relative;
`;

const ModalTitle = styled.h2`
  font-size: 2.25rem;
  font-weight: 800;
  color: #1a365d;
  margin: 0 0 0.75rem;
  line-height: 1.2;
`;

const ModalTagline = styled.p`
  font-size: 1.25rem;
  font-weight: 600;
  color: #22c55e;
  margin: 0 0 1rem;
`;

const ModalDescription = styled.p`
  font-size: 1.125rem;
  line-height: 1.8;
  color: #475569;
  margin: 0;
  
  strong {
    color: #1a365d;
    font-weight: 600;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: rotate(90deg);
  }
`;

const ModalSection = styled.div`
  padding: 2.5rem;
  border-bottom: 1px solid #e2e8f0;
  
  &:last-child {
    border-bottom: none;
  }
`;

const ModalSectionTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a365d;
  margin: 0 0 1.5rem;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.75rem;
    color: #22c55e;
  }
`;

const DetailsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 2rem;
`;

const DetailItem = styled.div``;

const DetailTitle = styled.h4`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a365d;
  margin: 0 0 0.75rem;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.75rem;
    color: #22c55e;
    font-size: 1.125rem;
  }
`;

const DetailDescription = styled.p`
  font-size: 1.125rem;
  line-height: 1.7;
  color: #475569;
  margin: 0;
`;

const UpcomingEventList = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const EventItem = styled.div`
  background: ${props => props.bg || '#f8fafc'};
  border-radius: 12px;
  padding: 1.25rem;
  border: 1px solid rgba(0, 0, 0, 0.06);
  
  &:hover {
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  }
`;

const EventTitle = styled.h5`
  font-size: 1.1rem;
  color: #1a365d;
  margin-bottom: 0.5rem;
`;

const EventDate = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #64748b;
  font-size: 0.9rem;
  margin-bottom: 0.75rem;
`;

const EventDescription = styled.p`
  color: #64748b;
  font-size: 0.95rem;
  line-height: 1.5;
`;

const ResourceList = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

const ResourceItem = styled.a`
  display: flex;
  flex-direction: column;
  background: ${props => props.bg || '#f8fafc'};
  border-radius: 12px;
  padding: 1.25rem;
  border: 1px solid rgba(0, 0, 0, 0.06);
  text-decoration: none;
  transition: all 0.3s ease;
  height: 100%;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  }
`;

const ResourceTitle = styled.h5`
  font-size: 1rem;
  color: #1a365d;
  margin-bottom: 0.5rem;
`;

const ResourceType = styled.div`
  font-size: 0.8rem;
  color: ${props => props.color || '#22c55e'};
  background: ${props => props.bg || 'rgba(34, 197, 94, 0.1)'};
  border-radius: 20px;
  padding: 0.25rem 0.75rem;
  display: inline-flex;
  align-items: center;
  margin-bottom: 0.75rem;
  align-self: flex-start;
  
  svg {
    margin-right: 0.25rem;
  }
`;

const CtaContainer = styled.div`
  text-align: center;
  margin-top: 1rem;
`;

const CtaButton = styled.button`
  background: ${props => props.gradient || 'linear-gradient(to right, #22c55e, #16a34a)'};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.875rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0 auto;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(34, 197, 94, 0.2);
  }
  
  svg {
    transition: transform 0.3s ease;
  }
  
  &:hover svg {
    transform: translateX(5px);
  }
`;

const WhyChooseUs = () => {
  const [activeModal, setActiveModal] = useState(null);
  
  const openModal = (reason) => {
    setActiveModal(reason);
    document.body.style.overflow = 'hidden'; // Prevent scrolling while modal is open
  };
  
  const closeModal = () => {
    setActiveModal(null);
    document.body.style.overflow = 'auto'; // Re-enable scrolling
  };

  const reasons = [
    {
      icon: <FaUserShield />,
      gradient: 'linear-gradient(135deg, #1a365d, #3b82f6)',
      title: "Independent Expertise",
      tagline: "Unbiased human guidance",
      description: "Our advisors provide objective guidance with no hidden agendas or platform-specific incentives. We focus solely on what's best for your financial growth and long-term success.",
      features: [
        "Objective analysis free from conflicts of interest",
        "Transparent fee structure with no hidden costs",
        "Advisors who serve as fiduciaries, putting your interests first",
        "Personalized recommendations based on your unique situation"
      ],
      stats: [
        { number: "15+", label: "Years Experience" },
        { number: "100%", label: "Independent Advice" }
      ],
      details: {
        content: [
          {
            title: "Our Fiduciary Commitment",
            description: "As fiduciaries, our advisors are legally obligated to act in your best interest. This means providing transparent advice without hidden agendas or conflicting incentives that could compromise the quality of our recommendations."
          },
          {
            title: "Objective Research Methodology",
            description: "Our research team conducts thorough, unbiased analysis of financial products and services. We maintain independence from product providers, allowing us to recommend only what truly serves your financial goals."
          },
          {
            title: "Transparent Fee Structure",
            description: "We believe you should know exactly what you're paying for. Our fee structure is clear and straightforward, with no hidden costs or surprise charges. We disclose all fees upfront and explain the value you receive."
          }
        ],
        events: [
          {
            title: "Financial Independence Workshop",
            date: "May 15, 2025",
            description: "A comprehensive workshop on building financial independence without conflicting advice."
          },
          {
            title: "Understanding Fiduciary Responsibility",
            date: "June 3, 2025",
            description: "Learn what it means to work with a fiduciary advisor and why it matters for your finances."
          }
        ],
        resources: [
          {
            title: "The Fiduciary Difference Guide",
            type: "PDF Guide",
            color: "#1a365d",
            bg: "rgba(59, 130, 246, 0.1)"
          },
          {
            title: "Conflicts of Interest in Financial Advice",
            type: "Whitepaper",
            color: "#1a365d",
            bg: "rgba(59, 130, 246, 0.1)"
          },
          {
            title: "Evaluating Financial Advisor Independence",
            type: "Checklist",
            color: "#1a365d",
            bg: "rgba(59, 130, 246, 0.1)"
          }
        ]
      }
    },
    {
      icon: <FaRobot />,
      gradient: 'linear-gradient(135deg, #22c55e, #4ade80)',
      title: "AI-Powered Insights",
      tagline: "Data-driven intelligence",
      description: "Our proprietary AI systems analyze vast amounts of market data to identify patterns and opportunities that human analysis alone might miss, giving you a competitive advantage.",
      features: [
        "Real-time market analysis across global markets",
        "Pattern recognition that identifies emerging opportunities",
        "Risk assessment algorithms that predict market volatility",
        "Continuous learning systems that improve over time"
      ],
      stats: [
        { number: "24/7", label: "Market Monitoring" },
        { number: "10M+", label: "Data Points Analyzed Daily" }
      ],
      details: {
        content: [
          {
            title: "Proprietary AI Technology",
            description: "Our advanced AI algorithms continuously scan global markets, processing millions of data points to identify opportunities and risks. These systems analyze price movements, economic indicators, company fundamentals, and market sentiment in real-time."
          },
          {
            title: "Pattern Recognition Engine",
            description: "Our pattern recognition technology detects market trends before they become obvious to the average investor. This enables our clients to position themselves advantageously ahead of market movements."
          },
          {
            title: "Predictive Analytics Framework",
            description: "Using machine learning models trained on decades of financial data, our systems forecast potential market scenarios and assess their probability, helping you prepare for various outcomes."
          }
        ],
        events: [
          {
            title: "AI in Investment Decision-Making",
            date: "May 22, 2025",
            description: "Discover how artificial intelligence is transforming investment strategies and decision processes."
          },
          {
            title: "Data-Driven Portfolio Construction",
            date: "June 18, 2025",
            description: "Learn how our AI tools help construct optimized portfolios based on your risk profile."
          }
        ],
        resources: [
          {
            title: "Understanding AI in Finance",
            type: "E-Book",
            color: "#22c55e",
            bg: "rgba(34, 197, 94, 0.1)"
          },
          {
            title: "Market Anomaly Detection Systems",
            type: "Case Study",
            color: "#22c55e",
            bg: "rgba(34, 197, 94, 0.1)"
          },
          {
            title: "BloomVest AI Dashboard Tutorial",
            type: "Video",
            color: "#22c55e",
            bg: "rgba(34, 197, 94, 0.1)"
          }
        ]
      }
    },
    {
      icon: <FaGraduationCap />,
      gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
      title: "Financial Education",
      tagline: "Empowering your decisions",
      description: "We believe in empowering our clients through education. Our comprehensive resources help you understand the 'why' behind our recommendations and build financial literacy.",
      features: [
        "Personalized learning plans tailored to your knowledge level",
        "Regular workshops and webinars on timely financial topics",
        "Clear explanations of complex financial concepts",
        "Investment simulation tools to practice without risk"
      ],
      stats: [
        { number: "500+", label: "Educational Resources" },
        { number: "92%", label: "Client Knowledge Growth" }
      ],
      details: {
        content: [
          {
            title: "Personalized Learning Paths",
            description: "Our education platform adapts to your knowledge level and learning pace. We create customized learning paths that progressively build your financial literacy while addressing your specific financial situation and goals."
          },
          {
            title: "Multi-Format Learning Resources",
            description: "We provide diverse learning formats including interactive modules, video courses, written guides, and live workshops. This multi-channel approach ensures you can learn in the way that works best for you."
          },
          {
            title: "Real-World Application Support",
            description: "Our advisors help bridge the gap between theory and practice, working with you to apply what you've learned to your actual financial decisions and strategies."
          }
        ],
        events: [
          {
            title: "Investment Fundamentals Bootcamp",
            date: "May 8-9, 2025",
            description: "A two-day intensive course covering essential investment principles and strategies."
          },
          {
            title: "Retirement Planning Workshop Series",
            date: "June 5, 12, 19, 2025",
            description: "Three-part workshop series on building and executing an effective retirement strategy."
          }
        ],
        resources: [
          {
            title: "Financial Literacy Fundamentals",
            type: "Course",
            color: "#f59e0b",
            bg: "rgba(245, 158, 11, 0.1)"
          },
          {
            title: "Investment Term Glossary",
            type: "Reference Guide",
            color: "#f59e0b",
            bg: "rgba(245, 158, 11, 0.1)"
          },
          {
            title: "Market Simulation Platform",
            type: "Interactive Tool",
            color: "#f59e0b",
            bg: "rgba(245, 158, 11, 0.1)"
          }
        ]
      }
    },
    {
      icon: <FaGlobeAfrica />,
      gradient: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
      title: "Global Perspective",
      tagline: "Worldwide market access",
      description: "From developed to emerging markets, our global perspective helps diversify your portfolio and capitalize on international growth opportunities beyond your local economy.",
      features: [
        "Access to opportunities across six continents",
        "Local market insights from regional specialists",
        "Currency risk management strategies",
        "International tax optimization guidance"
      ],
      stats: [
        { number: "40+", label: "Countries Covered" },
        { number: "24/5", label: "Global Trading Support" }
      ],
      details: {
        content: [
          {
            title: "Global Market Access",
            description: "We provide access to investment opportunities across developed, emerging, and frontier markets worldwide. Our global network enables you to diversify geographically and benefit from growth in various economic regions."
          },
          {
            title: "Local Market Expertise",
            description: "Our team includes specialists with deep knowledge of regional markets and economies. They provide insights on local business practices, regulations, and market dynamics that affect investment performance."
          },
          {
            title: "Currency Risk Management",
            description: "We help you navigate the complexities of currency exposure when investing internationally. Our strategies can help protect your investments from adverse currency movements while capitalizing on favorable trends."
          }
        ],
        events: [
          {
            title: "Emerging Markets Investment Forum",
            date: "May 26, 2025",
            description: "Explore growth opportunities in fast-developing economies around the world."
          },
          {
            title: "Global Diversification Strategies",
            date: "June 29, 2025",
            description: "Learn effective approaches to building a globally diversified investment portfolio."
          }
        ],
        resources: [
          {
            title: "Global Market Quarterly Outlook",
            type: "Report",
            color: "#8b5cf6",
            bg: "rgba(139, 92, 246, 0.1)"
          },
          {
            title: "International Investing Essentials",
            type: "Guide",
            color: "#8b5cf6",
            bg: "rgba(139, 92, 246, 0.1)"
          },
          {
            title: "Currency Hedging Strategies",
            type: "Whitepaper",
            color: "#8b5cf6",
            bg: "rgba(139, 92, 246, 0.1)"
          }
        ]
      }
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2 
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 100 
      }
    }
  };

  return (
    <Section>
      <BackgroundAccent />
      <BackgroundAccent2 />
      <BackgroundPattern />
      <Container>
        <Heading data-aos="fade-up">Why Choose BloomVest</Heading>
        <Description data-aos="fade-up" data-aos-delay="100">
          We combine <strong>advanced technology</strong> with <strong>deep financial expertise</strong> to deliver exceptional value and results for our clients
        </Description>
        
        <Grid>
          {reasons.map((reason, index) => (
            <Card 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <CardHeader>
                <IconContainer color={reason.gradient.split(',')[1].trim().slice(0, -1)}>
                  {reason.icon}
                </IconContainer>
                <CardTitle>{reason.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{reason.description}</CardDescription>
                <Button onClick={() => openModal(index)}>
                  Learn More <FaArrowRight />
                </Button>
              </CardContent>
            </Card>
          ))}
        </Grid>
      </Container>
      
      <AnimatePresence>
        {activeModal !== null && (
          <Overlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <ModalContent
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.4 }}
            >
              <CloseButton onClick={closeModal}>
                <FaTimes />
              </CloseButton>
              
              <ModalHeader>
                <ModalTitle>{reasons[activeModal].title}</ModalTitle>
                <ModalTagline>{reasons[activeModal].tagline}</ModalTagline>
                <ModalDescription>
                  {reasons[activeModal].details.content.map((item, index) => (
                    <div key={index}>
                      <strong>{item.title}:</strong> {item.description}
                    </div>
                  ))}
                </ModalDescription>
              </ModalHeader>
              
              <ModalSection>
                <ModalSectionTitle>
                  <FaCheckCircle /> Key Features
                </ModalSectionTitle>
                <DetailsList>
                  {reasons[activeModal].features.map((feature, index) => (
                    <DetailItem key={index}>
                      <DetailTitle>
                        <FaCheckCircle /> {feature}
                      </DetailTitle>
                      <DetailDescription>
                        {reasons[activeModal].details.content.find(item => item.title === feature)?.description || ''}
                      </DetailDescription>
                    </DetailItem>
                  ))}
                </DetailsList>
              </ModalSection>
              
              <ModalSection>
                <ModalSectionTitle>
                  <FaBook /> Educational Resources
                </ModalSectionTitle>
                <ResourceList>
                  {reasons[activeModal].details.resources.map((resource, index) => (
                    <ResourceItem 
                      key={index} 
                      href="#" 
                      bg={`linear-gradient(to bottom right, white, ${reasons[activeModal].gradient.split(',')[1].trim().slice(0, -1)}05)`}
                    >
                      <ResourceType color={resource.color} bg={resource.bg}>
                        <FaBook /> {resource.type}
                      </ResourceType>
                      <ResourceTitle>{resource.title}</ResourceTitle>
                    </ResourceItem>
                  ))}
                </ResourceList>
              </ModalSection>
              
              <CtaContainer>
                <CtaButton gradient={reasons[activeModal].gradient}>
                  Schedule a Consultation <FaArrowRight />
                </CtaButton>
              </CtaContainer>
            </ModalContent>
          </Overlay>
        )}
      </AnimatePresence>
    </Section>
  );
};

export default WhyChooseUs;