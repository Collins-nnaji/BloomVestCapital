import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChartLine, FaHandHoldingUsd, FaRegLightbulb, FaFileInvoiceDollar, FaHome, FaShieldAlt, FaUsers, FaRegChartBar, FaArrowRight, FaCheckCircle, FaTimes, FaInfoCircle, FaCalendarAlt, FaBook, FaAngleDown, FaAngleUp, FaLongArrowAltRight } from 'react-icons/fa';

const ServicesSection = styled.section`
  padding: 120px 0;
  background: linear-gradient(to bottom, #ffffff, #f8fafc);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: 
      radial-gradient(rgba(34, 197, 94, 0.03) 1px, transparent 1px),
      radial-gradient(rgba(26, 54, 93, 0.03) 1px, transparent 1px);
    background-size: 40px 40px, 30px 30px;
    background-position: 0 0, 20px 20px;
    opacity: 0.6;
    z-index: 0;
    
    @media (max-width: 768px) {
      background-size: 60px 60px;
      opacity: 0.4;
    }
  }
  
  @media (max-width: 768px) {
    padding: 80px 0;
  }
`;

const BackgroundDecoration = styled.div`
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  z-index: 0;
  will-change: transform, opacity;
  
  @media (max-width: 768px) {
    filter: blur(40px);
  }

  &.top-left {
    top: -150px;
    left: -150px;
    width: 500px;
    height: 500px;
    background: linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(16, 185, 129, 0.05));
    opacity: 0.5;
  }
  
  &.bottom-right {
    bottom: -200px;
    right: -150px;
    width: 600px;
    height: 600px;
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(34, 197, 94, 0.05));
    opacity: 0.5;
  }
`;

const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 1;
`;

const SectionHeader = styled.div`
  text-align: center;
  max-width: 800px;
  margin: 0 auto 70px;
`;

const SectionTitle = styled.h2`
  font-size: 3.25rem;
  font-weight: 800;
  color: #1a365d;
  margin-bottom: 1.5rem;
  position: relative;
  display: inline-block;
  
  span {
    color: #22c55e;
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      bottom: 5px;
      left: 0;
      width: 100%;
      height: 8px;
      background: rgba(34, 197, 94, 0.2);
      z-index: -1;
      border-radius: 4px;
    }
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -15px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 4px;
    background: linear-gradient(to right, #22c55e, rgba(34, 197, 94, 0.2));
    border-radius: 4px;
  }
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 2.25rem;
  }
`;

const SectionDescription = styled.p`
  font-size: 1.25rem;
  color: #475569;
  line-height: 1.8;
  margin-top: 2rem;
  
  strong {
    color: #1a365d;
    font-weight: 600;
  }
`;

// New service card grid with modern layout
const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2.5rem;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

// Modern service card with hover effects
const ServiceCard = styled(motion.div)`
  background: white;
  border-radius: 24px;
  box-shadow: 0 5px 30px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  position: relative;
  z-index: 1;
  border: 1px solid rgba(226, 232, 240, 0.8);
  transform: translateZ(0);
  transition: all 0.4s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.12);
  }
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 24px;
    padding: 2px;
    background: linear-gradient(to bottom right, 
      ${props => props.accent ? props.accent : '#22c55e'}, 
      transparent);
    -webkit-mask: 
      linear-gradient(#fff 0 0) content-box, 
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0;
    transition: opacity 0.4s ease;
    z-index: -1;
  }
  
  &:hover::before {
    opacity: 1;
  }
`;

const ServiceHeader = styled.div`
  padding: 2.5rem;
  background: ${props => props.bg || 'white'};
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  transition: all 0.4s ease;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: ${props => props.accent || '#22c55e'};
    transform: scaleX(0.3);
    transform-origin: left;
    transition: transform 0.4s ease;
  }
  
  ${ServiceCard}:hover &::after {
    transform: scaleX(1);
  }
`;

const ServiceIconWrapper = styled.div`
  margin-bottom: 1.5rem;
  position: relative;
  display: inline-block;
`;

const ServiceIcon = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 18px;
  background: ${props => props.bg || 'rgba(34, 197, 94, 0.1)'};
  color: ${props => props.color || '#22c55e'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  transition: all 0.4s ease;
  transform: rotate(-5deg);
  box-shadow: 0 10px 15px ${props => props.shadowColor || 'rgba(34, 197, 94, 0.15)'};
  
  ${ServiceCard}:hover & {
    transform: rotate(0deg) scale(1.05);
    box-shadow: 0 15px 25px ${props => props.shadowColor || 'rgba(34, 197, 94, 0.25)'};
  }
`;

const ServiceTitle = styled.h3`
  font-size: 1.8rem;
  font-weight: 800;
  color: ${props => props.color || '#1a365d'};
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const ServiceDescription = styled.p`
  font-size: 1.1rem;
  line-height: 1.7;
  color: ${props => props.color || '#475569'};
  margin-bottom: 1.5rem;
`;

const ServiceFeaturesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 1.5rem;
`;

const ServiceFeature = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
  color: ${props => props.color || '#475569'};
  font-size: 1rem;
  
  svg {
    color: ${props => props.accentColor || '#22c55e'};
    margin-right: 0.75rem;
    flex-shrink: 0;
  }
`;

const ExpandButton = styled.button`
  display: inline-flex;
  align-items: center;
  color: ${props => props.color || '#22c55e'};
  background: ${props => props.bg || 'rgba(34, 197, 94, 0.1)'};
  border: none;
  border-radius: 50px;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: auto;
  align-self: flex-start;
  
  svg {
    margin-left: 0.5rem;
    transition: transform 0.3s ease;
  }
  
  &:hover {
    background: ${props => props.hoverBg || 'rgba(34, 197, 94, 0.2)'};
    
    svg {
      transform: translateX(3px);
    }
  }
`;

// Content for expanded service
const ServiceExpandedContent = styled(motion.div)`
  overflow: hidden;
`;

const ServiceSection = styled.div`
  padding: 2.5rem;
  border-bottom: 1px solid #e2e8f0;
  
  &:last-child {
    border-bottom: none;
  }
  
  @media (max-width: 768px) {
    padding: 2rem;
  }
`;

const ServiceSectionTitle = styled.h4`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a365d;
  margin: 0 0 1.5rem;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.75rem;
    color: ${props => props.iconColor || '#22c55e'};
  }
  
  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const FeatureItem = styled.div`
  background: #f8fafc;
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
    border-color: ${props => props.borderColor || 'rgba(34, 197, 94, 0.5)'};
  }
`;

const FeatureTitle = styled.h5`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a365d;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.75rem;
    color: ${props => props.iconColor || '#22c55e'};
    flex-shrink: 0;
  }
`;

const FeatureDescription = styled.p`
  font-size: 1rem;
  line-height: 1.7;
  color: #475569;
  margin: 0;
`;

// Events section with new design
const EventsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const EventCard = styled.div`
  background: #f8fafc;
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 5px;
    height: 100%;
    background: ${props => props.borderColor || '#22c55e'};
    transition: all 0.3s ease;
  }
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
    
    &::before {
      width: 7px;
    }
  }
`;

const EventTitle = styled.h5`
  font-size: 1.2rem;
  font-weight: 700;
  color: #1a365d;
  margin-bottom: 0.75rem;
`;

const EventDate = styled.div`
  display: flex;
  align-items: center;
  color: ${props => props.color || '#22c55e'};
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 0.75rem;
  gap: 0.5rem;
  
  svg {
    color: ${props => props.color || '#22c55e'};
  }
`;

const EventDescription = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: #475569;
`;

// Improved CTA section
const ServiceCTA = styled.div`
  background: linear-gradient(135deg, #f0fdf4, #ecfdf5);
  padding: 2.5rem;
  border-radius: 16px;
  margin-top: 2rem;
  text-align: center;
  border: 1px solid rgba(34, 197, 94, 0.2);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(34, 197, 94, 0.05) 0%, transparent 70%);
    opacity: 0.8;
    z-index: 0;
  }
`;

const CTATitle = styled.h4`
  font-size: 1.6rem;
  font-weight: 700;
  color: #1a365d;
  margin-bottom: 1rem;
  position: relative;
  z-index: 1;
`;

const CTADescription = styled.p`
  font-size: 1.1rem;
  line-height: 1.8;
  color: #475569;
  margin-bottom: 2rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  position: relative;
  z-index: 1;
`;

const CTAButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.bg || 'linear-gradient(to right, #22c55e, #15803d)'};
  color: white;
  border-radius: 50px;
  padding: 1rem 2.5rem;
  font-weight: 600;
  font-size: 1.1rem;
  text-decoration: none;
  transition: all 0.3s ease;
  gap: 0.75rem;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
  }
  
  svg {
    transition: transform 0.3s ease;
  }
  
  &:hover svg {
    transform: translateX(3px);
  }
`;

// Animated service details modal
const ServiceDetailsModal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.7);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(8px);
  padding: 2rem;
`;

const ModalContent = styled(motion.div)`
  background: white;
  border-radius: 24px;
  max-width: 900px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #c5c5c5;
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 110;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: rotate(90deg);
  }
`;

const Services = () => {
  // Keep track of which service is expanded
  const [expandedService, setExpandedService] = useState(null);
  
  // Function to toggle expansion
  const toggleService = (index) => {
    if (expandedService === index) {
      // Close if already open
      setExpandedService(null);
    } else {
      // Open the clicked service
      setExpandedService(index);
    }
  };

  const servicesList = [
    {
      icon: <FaUsers />,
      title: "Investor Matching",
      description: "Our proprietary algorithm connects startups with investors whose investment thesis and portfolio strategy align with your sector, stage, and vision.",
      features: [
        "Personalized investor matching",
        "Industry-specific connections",
        "Investment size compatibility",
        "Strategic fit assessment"
      ],
      iconBg: "rgba(34, 197, 94, 0.1)",
      iconColor: "#22c55e",
      iconShadow: "rgba(34, 197, 94, 0.15)",
      accentColor: "#22c55e",
      buttonBg: "rgba(34, 197, 94, 0.1)",
      buttonHoverBg: "rgba(34, 197, 94, 0.2)",
      headerBg: "linear-gradient(135deg, #22c55e, #15803d)",
      detailContent: {
        description: "Our investor matching service uses advanced algorithms and personal expertise to find the perfect investor matches for your startup. We consider industry expertise, investment history, strategic value-add, and personal chemistry to create meaningful connections.",
        features: [
          {
            title: "Personalized Investor Matching",
            description: "Custom matching based on your startup's unique value proposition, growth stage, and capital needs to identify investors with complementary investment theses.",
            icon: <FaCheckCircle />
          },
          {
            title: "Industry-Specific Connections",
            description: "Access to our network of investors organized by sector expertise, allowing you to connect with backers who understand your industry's nuances and challenges.",
            icon: <FaCheckCircle />
          },
          {
            title: "Investment Size Compatibility",
            description: "Strategic matching that considers your funding requirements and typical investment amounts to ensure alignment with investor capabilities.",
            icon: <FaCheckCircle />
          },
          {
            title: "Strategic Fit Assessment",
            description: "Evaluation of potential value-add beyond capital, including network access, operational expertise, and strategic guidance relevant to your growth needs.",
            icon: <FaCheckCircle />
          }
        ],
        events: [
          {
            title: "Monthly Investor Meetups",
            date: "Monthly",
            description: "Curated small-group meetings with pre-qualified investors interested in your sector."
          },
          {
            title: "Startup-Investor Matchmaking Forum",
            date: "Quarterly",
            description: "Structured networking events connecting founders with compatible investors."
          }
        ]
      }
    },
    {
      icon: <FaRegLightbulb />,
      title: "Pitch Optimization",
      description: "Comprehensive refinement of your pitch materials and presentation skills to effectively communicate your value proposition to potential investors.",
      features: [
        "Pitch deck enhancement",
        "Narrative development",
        "Presentation coaching",
        "Investor Q&A preparation"
      ],
      iconBg: "rgba(59, 130, 246, 0.1)",
      iconColor: "#3b82f6",
      iconShadow: "rgba(59, 130, 246, 0.15)",
      accentColor: "#3b82f6",
      buttonBg: "rgba(59, 130, 246, 0.1)",
      buttonHoverBg: "rgba(59, 130, 246, 0.2)",
      headerBg: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
      detailContent: {
        description: "Our pitch optimization service helps you craft a compelling investment story that resonates with your target investors. We fine-tune your pitch materials and presentation approach to maximize your chances of securing funding.",
        features: [
          {
            title: "Pitch Deck Enhancement",
            description: "Expert refinement of your pitch deck's structure, visual design, and content to effectively communicate your value proposition, market opportunity, and growth potential.",
            icon: <FaCheckCircle />
          },
          {
            title: "Narrative Development",
            description: "Crafting a compelling story around your startup that highlights your unique insights, momentum indicators, and competitive advantages in a memorable way.",
            icon: <FaCheckCircle />
          },
          {
            title: "Presentation Coaching",
            description: "One-on-one sessions to refine your verbal pitch, body language, pace, and overall delivery to convey confidence and credibility to investors.",
            icon: <FaCheckCircle />
          },
          {
            title: "Investor Q&A Preparation",
            description: "Anticipating potential investor questions and concerns, with structured preparation for addressing challenging topics around market size, competition, and financial projections.",
            icon: <FaCheckCircle />
          }
        ],
        events: [
          {
            title: "Pitch Deck Masterclass",
            date: "Monthly",
            description: "Workshop covering the essential elements of a compelling investor pitch deck."
          },
          {
            title: "Pitch Practice Sessions",
            date: "Bi-Weekly",
            description: "Opportunities to present to experienced investors and receive constructive feedback."
          }
        ]
      }
    },
    {
      icon: <FaFileInvoiceDollar />,
      title: "Due Diligence Support",
      description: "Preparation assistance for investor scrutiny, helping you organize financial data, market analysis, and operational information to facilitate investment decisions.",
      features: [
        "Financial review preparation",
        "Market validation support",
        "Operational assessment",
        "Documentation organization"
      ],
      iconBg: "rgba(245, 158, 11, 0.1)",
      iconColor: "#f59e0b",
      iconShadow: "rgba(245, 158, 11, 0.15)",
      accentColor: "#f59e0b",
      buttonBg: "rgba(245, 158, 11, 0.1)",
      buttonHoverBg: "rgba(245, 158, 11, 0.2)",
      headerBg: "linear-gradient(135deg, #f59e0b, #d97706)",
      detailContent: {
        description: "Our due diligence support service prepares you to successfully navigate investor scrutiny. We help you organize, validate, and present your business data in a way that builds investor confidence and accelerates the funding process.",
        features: [
          {
            title: "Financial Review Preparation",
            description: "Comprehensive organization and review of your financial statements, projections, and models to ensure accuracy, defensibility, and alignment with industry benchmarks.",
            icon: <FaCheckCircle />
          },
          {
            title: "Market Validation Support",
            description: "Assistance gathering and presenting market research, customer testimonials, and usage metrics that validate your market opportunity and product-market fit.",
            icon: <FaCheckCircle />
          },
          {
            title: "Operational Assessment",
            description: "Review of your operational processes, team structure, and technology infrastructure to identify and address potential investor concerns proactively.",
            icon: <FaCheckCircle />
          },
          {
            title: "Documentation Organization",
            description: "Creation of a structured virtual data room containing all necessary legal, financial, and operational documents required for thorough investor due diligence.",
            icon: <FaCheckCircle />
          }
        ],
        events: [
          {
            title: "Due Diligence Preparation Workshop",
            date: "Monthly",
            description: "Step-by-step guidance on preparing for investor scrutiny and information requests."
          },
          {
            title: "Financial Modeling Workshop",
            date: "Quarterly",
            description: "Hands-on support for creating robust financial projections that withstand investor scrutiny."
          }
        ]
      }
    },
    {
      icon: <FaHandHoldingUsd />,
      title: "Funding Strategy",
      description: "Expert guidance on optimal funding approaches, investment structures, and negotiation strategies to secure favorable terms and maintain founder control.",
      features: [
        "Funding route optimization",
        "Term sheet guidance",
        "Valuation strategy",
        "Negotiation support"
      ],
      iconBg: "rgba(139, 92, 246, 0.1)",
      iconColor: "#8b5cf6",
      iconShadow: "rgba(139, 92, 246, 0.15)",
      accentColor: "#8b5cf6",
      buttonBg: "rgba(139, 92, 246, 0.1)",
      buttonHoverBg: "rgba(139, 92, 246, 0.2)",
      headerBg: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
      detailContent: {
        description: "Our funding strategy service helps you navigate the complexities of startup financing. We provide guidance on funding approaches, investment structures, and negotiation strategies tailored to your specific growth stage and business needs.",
        features: [
          {
            title: "Funding Route Optimization",
            description: "Strategic advice on choosing between equity financing, convertible notes, SAFE agreements, or alternative funding sources based on your capital needs and growth objectives.",
            icon: <FaCheckCircle />
          },
          {
            title: "Term Sheet Guidance",
            description: "Expert review and explanation of term sheet provisions, highlighting potential impacts on control, future rounds, and exit scenarios to help you make informed decisions.",
            icon: <FaCheckCircle />
          },
          {
            title: "Valuation Strategy",
            description: "Data-driven approaches to determining appropriate valuation ranges based on your market, traction, team, and comparable transactions.",
            icon: <FaCheckCircle />
          },
          {
            title: "Negotiation Support",
            description: "Behind-the-scenes guidance throughout investor negotiations, helping you balance favorable terms with relationship building for successful long-term partnerships.",
            icon: <FaCheckCircle />
          }
        ],
        events: [
          {
            title: "Term Sheet Masterclass",
            date: "Monthly",
            description: "Detailed walkthrough of investment terms and their implications for founders."
          },
          {
            title: "Negotiation Strategy Workshop",
            date: "Quarterly",
            description: "Effective approaches to investor negotiations that preserve equity and control."
          }
        ]
      }
    }
  ];

  return (
    <ServicesSection>
      <BackgroundDecoration className="top-left" />
      <BackgroundDecoration className="bottom-right" />
      
      <Container>
        <SectionHeader>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, type: "spring" }}
            viewport={{ once: true }}
          >
            <SectionTitle>Our <span>Connection</span> Services</SectionTitle>
            <SectionDescription>
              BloomVest offers a comprehensive suite of services designed to <strong>bridge the gap between startups and investors</strong>—from personalized investor matching and pitch optimization to due diligence support and funding strategy guidance.
            </SectionDescription>
          </motion.div>
        </SectionHeader>
        
        <ServicesGrid>
          {servicesList.map((service, index) => (
            <ServiceCard 
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.1, 
                type: "spring",
                stiffness: 50
              }}
              viewport={{ once: true }}
              accent={service.accentColor}
              onClick={() => toggleService(index)}
            >
              <ServiceHeader accent={service.accentColor}>
                <ServiceIconWrapper>
                  <ServiceIcon 
                    bg={service.iconBg} 
                    color={service.iconColor}
                    shadowColor={service.iconShadow}
                  >
                    {service.icon}
                  </ServiceIcon>
                </ServiceIconWrapper>
                
                <ServiceTitle>
                  {service.title}
                </ServiceTitle>
                
                <ServiceDescription>
                  {service.description}
                </ServiceDescription>
                
                <ServiceFeaturesList>
                  {service.features.map((feature, featureIndex) => (
                    <ServiceFeature 
                      key={featureIndex}
                      accentColor={service.accentColor}
                    >
                      <FaCheckCircle /> {feature}
                    </ServiceFeature>
                  ))}
                </ServiceFeaturesList>
              </ServiceHeader>
              
              {/* Expandable content */}
              <AnimatePresence>
                {expandedService === index && (
                  <ServiceExpandedContent
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    {/* Features Section */}
                    <ServiceSection>
                      <ServiceSectionTitle iconColor={service.accentColor}>
                        <FaInfoCircle /> Our Approach
                      </ServiceSectionTitle>
                      <FeaturesGrid>
                        {service.detailContent.features.map((feature, featureIndex) => (
                          <FeatureItem 
                            key={featureIndex} 
                            borderColor={service.accentColor}
                          >
                            <FeatureTitle iconColor={service.accentColor}>
                              {feature.icon} {feature.title}
                            </FeatureTitle>
                            <FeatureDescription>
                              {feature.description}
                            </FeatureDescription>
                          </FeatureItem>
                        ))}
                      </FeaturesGrid>
                    </ServiceSection>
                    
                    {/* Events Section */}
                    <ServiceSection>
                      <ServiceSectionTitle iconColor={service.accentColor}>
                        <FaCalendarAlt /> Upcoming Events & Workshops
                      </ServiceSectionTitle>
                      <EventsGrid>
                        {service.detailContent.events.map((event, eventIndex) => (
                          <EventCard 
                            key={eventIndex}
                            borderColor={service.accentColor}
                          >
                            <EventTitle>{event.title}</EventTitle>
                            <EventDate color={service.accentColor}>
                              <FaCalendarAlt /> {event.date}
                            </EventDate>
                            <EventDescription>{event.description}</EventDescription>
                          </EventCard>
                        ))}
                      </EventsGrid>
                    </ServiceSection>
                    
                    {/* CTA Section */}
                    <ServiceSection>
                      <ServiceCTA>
                        <CTATitle>Ready to take the next step?</CTATitle>
                        <CTADescription>
                          Our team is ready to provide personalized guidance for your startup's specific needs. 
                          Schedule a consultation to discuss how our {service.title.toLowerCase()} 
                          services can accelerate your growth journey.
                        </CTADescription>
                        <CTAButton 
                          href="/consultation" 
                          bg={service.headerBg}
                        >
                          Schedule a Consultation <FaArrowRight />
                        </CTAButton>
                      </ServiceCTA>
                    </ServiceSection>
                  </ServiceExpandedContent>
                )}
              </AnimatePresence>
            </ServiceCard>
          ))}
        </ServicesGrid>
      </Container>
    </ServicesSection>
  );
};

export default Services;