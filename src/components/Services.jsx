import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  FaChartLine, 
  FaPiggyBank, 
  FaBriefcase, 
  FaRegHandshake, 
  FaCalculator, 
  FaMobileAlt,
  FaTimes,
  FaCheckCircle,
  FaRegCreditCard,
  FaUserTie,
  FaRegFileAlt,
  FaRegLightbulb,
  FaArrowRight,
  FaDatabase,
  FaChartBar,
  FaRobot,
  FaServer
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const ServicesSection = styled.section`
  padding: 120px 0;
  position: relative;
  background-image: url('/white back.webp');
  background-size: cover;
  background-position: center;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(248, 250, 252, 0.9) 0%, rgba(241, 245, 249, 0.85) 100%);
    z-index: 0;
  }
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
    radial-gradient(rgba(26, 54, 93, 0.02) 1.5px, transparent 1.5px);
  background-size: 50px 50px, 50px 50px, 30px 30px;
  background-position: 0 0, 0 0, 15px 15px;
  opacity: 0.5;
  z-index: 0;
  pointer-events: none;
`;

const CircleAccent = styled.div`
  position: absolute;
  border-radius: 50%;
  z-index: 0;

  &:nth-child(1) {
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(34, 197, 94, 0.05) 0%, rgba(255, 255, 255, 0) 70%);
    top: -200px;
    right: -200px;
  }

  &:nth-child(2) {
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(26, 54, 93, 0.04) 0%, rgba(255, 255, 255, 0) 70%);
    bottom: -100px;
    left: -100px;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 1;
`;

const ServiceTabs = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 3rem;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.8);
  padding: 0.75rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  
  @media (max-width: 768px) {
    flex-direction: column;
    padding: 0.5rem;
    max-width: 400px;
    gap: 0.5rem;
  }
`;

const ServiceTab = styled.div`
  padding: 0.9rem 1.75rem;
  background: ${props => props.active ? '#22c55e' : 'rgba(255, 255, 255, 0.9)'};
  color: ${props => props.active ? '#ffffff' : '#64748b'};
  border: ${props => props.active ? 'none' : '1px solid #e2e8f0'};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  flex: 1;
  font-weight: ${props => props.active ? '600' : '500'};
  box-shadow: ${props => props.active ? '0 8px 20px rgba(34, 197, 94, 0.25)' : 'none'};
  
  &:hover {
    background: ${props => props.active ? '#22c55e' : '#f8fafc'};
    color: ${props => props.active ? '#ffffff' : '#1a365d'};
    transform: translateY(-2px);
  }
  
  svg {
    font-size: 1.1rem;
  }
  
  @media (max-width: 768px) {
    padding: 0.8rem 1.5rem;
  }
`;

const ServiceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2.5rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CardContent = styled.div`
  padding: 3rem;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const ServiceCard = styled(motion.div)`
  background: #ffffff;
  border-radius: 20px;
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  height: 100%;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 6px;
    background: ${props => props.color || '#22c55e'};
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.5s ease;
  }
  
  &:hover::before {
    transform: scaleX(1);
  }
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  }
`;

const IconWrapper = styled.div`
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.color || '#22c55e'};
  color: white;
  border-radius: 16px;
  margin-bottom: 1.5rem;
  font-size: 1.75rem;
  transition: all 0.4s ease;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.08);
  
  ${ServiceCard}:hover & {
    transform: translateY(-5px) rotate(10deg);
    box-shadow: 0 15px 25px rgba(0, 0, 0, 0.12);
  }
`;

const ServiceTitle = styled.h3`
  font-size: 1.75rem;
  font-weight: 800;
  color: #1a365d;
  margin-bottom: 1.25rem;
  letter-spacing: -0.5px;
  position: relative;
  padding-bottom: 0.75rem;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 40px;
    height: 2px;
    background: ${props => props.color || '#22c55e'};
  }
`;

const ServiceDescription = styled.p`
  color: #475569;
  line-height: 1.8;
  margin-bottom: 1.75rem;
  font-size: 1.1rem;
  flex-grow: 1;
`;

const LearnMore = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  font-weight: 700;
  color: ${props => props.color || '#22c55e'};
  gap: 0.5rem;
  transition: all 0.3s ease;
  text-decoration: none;
  background: transparent;
  border: none;
  padding: 0.75rem 0;
  cursor: pointer;
  font-size: 1rem;
  margin-top: auto;
  
  &:hover {
    color: ${props => props.hoverColor || '#15803d'};
    
    svg {
      transform: translateX(6px);
    }
  }
  
  svg {
    transition: transform 0.3s ease;
  }
`;

// Modal components
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  overflow-y: auto;
  backdrop-filter: blur(5px);
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 1.5rem;
  width: 90%;
  max-width: 900px;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
  position: relative;
  
  /* Custom scrollbar for better UX */
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #94a3b8;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #64748b;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  font-size: 1.25rem;
  color: #64748b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem;
  border-radius: 50%;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  z-index: 10;
  
  &:hover {
    background: #f1f5f9;
    color: #1a365d;
    transform: rotate(90deg);
  }
`;

const ModalHeader = styled.div`
  padding: 4rem 3rem 2rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  position: relative;
  background: ${props => `linear-gradient(135deg, rgba(${props.colorStart || '34, 197, 94'}, 0.1), rgba(${props.colorEnd || '26, 54, 93'}, 0.05))`};
`;

const ModalTagline = styled.p`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${props => props.color || '#22c55e'};
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const ModalTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 900;
  color: #1a365d;
  margin-bottom: 1.5rem;
  background: linear-gradient(to right, #1a365d, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.5px;
`;

const ModalDescription = styled.p`
  font-size: 1.2rem;
  line-height: 1.8;
  color: #475569;
  margin-bottom: 1.5rem;
  max-width: 800px;
  
  strong {
    color: #1a365d;
    font-weight: 600;
  }
`;

const ModalBody = styled.div`
  padding: 0;
`;

const ModalMainContent = styled.div`
  width: 100%;
`;

const ModalSection = styled.div`
  padding: 3rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  background: white;
  
  &:nth-child(odd) {
    background: #f8fafc;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const ModalSectionTitle = styled.h3`
  font-size: 1.75rem;
  font-weight: 800;
  color: #1a365d;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  position: relative;
  padding-bottom: 1rem;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 60px;
    height: 3px;
    background: ${props => props.color || '#22c55e'};
    border-radius: 3px;
  }
  
  svg {
    color: ${props => props.color || '#22c55e'};
    margin-right: 1rem;
    font-size: 1.5rem;
  }
`;

const BenefitsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const BenefitItem = styled.div`
  display: flex;
  margin-bottom: 1.5rem;
  align-items: flex-start;
  transition: all 0.3s ease;
  padding: 1.5rem;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  border-left: 4px solid ${props => props.color || '#22c55e'};
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }
  
  svg {
    color: ${props => props.color || '#22c55e'};
    margin-right: 1.5rem;
    font-size: 1.5rem;
    flex-shrink: 0;
    margin-top: 0.25rem;
  }
  
  @media (max-width: 768px) {
    padding: 1.25rem;
  }
`;

const BenefitContent = styled.div`
  flex: 1;
`;

const BenefitTitle = styled.h4`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a365d;
  margin-bottom: 0.75rem;
`;

const BenefitDescription = styled.p`
  color: #475569;
  font-size: 1.1rem;
  line-height: 1.7;
`;

const services = [
  {
    icon: <FaDatabase />,
    title: "BloomVest Analytics™",
    description: "Our proprietary data analytics system provides real-time market insights and personalized recommendations through advanced AI algorithms and predictive modeling.",
    color: "#4338ca", // Indigo color for data/AI service
    details: {
      fullDescription: "BloomVest Analytics™ is our exclusive proprietary system that combines advanced data mining, machine learning algorithms, and financial expertise to transform complex market data into actionable insights. Our platform continuously monitors global markets, economic indicators, and industry trends to identify opportunities and threats before they become mainstream.",
      benefits: [
        {
          title: "Real-time Data Analysis",
          description: "Access insights from over 150 global financial sources, updated in real-time to provide the most current market information available."
        },
        {
          title: "AI-driven Predictive Modeling",
          description: "Our proprietary algorithms achieve 87% accuracy in forecasting major market movements, helping you anticipate changes before they occur."
        },
        {
          title: "Personalized Investment Insights",
          description: "Receive recommendations tailored to your specific investment profile, risk tolerance, and financial goals."
        },
        {
          title: "Early Trend Identification",
          description: "Our pattern recognition algorithms detect emerging market trends weeks before they become apparent to most investors."
        },
        {
          title: "Comprehensive Risk Assessment",
          description: "Understand potential portfolio risks through sophisticated modeling based on historical volatility patterns and current market conditions."
        }
      ],
      idealFor: "Investment professionals, portfolio managers, business strategists, and individual investors seeking data-driven insights to gain a competitive edge in today's rapidly changing markets.",
      process: [
        "Initial data integration and profile creation",
        "Comprehensive market analysis and opportunity mapping",
        "Strategic recommendation development with clear action steps",
        "Ongoing monitoring and real-time alerts",
        "Regular performance reviews and strategy refinement"
      ],
      technology: {
        name: "FIBER Framework",
        description: "Financial Intelligence for Business Enrichment & Results",
        features: [
          "Machine learning algorithms trained on 15+ years of Nigerian and global market data",
          "Neural network pattern recognition systems that identify emerging trends",
          "Real-time data processing with sub-second latency for timely insights",
          "Natural language processing to analyze news and sentiment impact",
          "Comprehensive backtesting against multiple market scenarios"
        ],
        performance: "Our system processes over 1.2 million data points daily and has demonstrated an 87% accuracy rate in predicting major market movements when tested against historical data. Clients using BloomVest Analytics™ have reported an average 28% improvement in decision-making efficiency."
      },
      pricing: [
        {
          tier: "Premium Analytics",
          price: "₦950,000 Annually",
          description: "Complete access to our proprietary BloomVest Analytics™ platform with personalized insights and real-time data.",
          features: [
            "Full access to the BloomVest Analytics™ dashboard",
            "Customized alert system for market opportunities",
            "Monthly strategy sessions with our data scientists",
            "Quarterly predictive modeling reports",
            "API access for integration with your existing systems",
            "Priority support from our analytics team"
          ]
        }
      ]
    }
  },
  {
    icon: <FaChartLine />,
    title: "Investment Advisory",
    description: "Strategic investment guidance tailored to your financial goals and risk tolerance. Our advisors help you navigate diverse investment opportunities.",
    color: "#22c55e",
    details: {
      fullDescription: "Comprehensive investment advisory services that analyze market trends, assess risk tolerance, and develop tailored strategies aligned with your financial goals.",
      benefits: [
        "Personalized investment strategies based on your financial goals",
        "Regular portfolio reviews and rebalancing",
        "Access to diverse investment opportunities across asset classes",
        "Risk management guidance and wealth preservation strategies"
      ],
      idealFor: "Individuals and businesses seeking to optimize their investment portfolios and achieve long-term growth while managing risk effectively.",
      pricing: [
        {
          tier: "Essential",
          price: "₦250,000 Annually",
          description: "Core investment advisory services for individuals starting their investment journey.",
          features: [
            "Personalized investment strategy",
            "Quarterly portfolio review",
            "Email and phone support",
            "Basic investment education resources"
          ]
        }
      ]
    }
  },
  {
    icon: <FaPiggyBank />,
    title: "Financial Planning",
    description: "Comprehensive planning for individuals and families to achieve life goals through proper financial management and strategic resource allocation.",
    color: "#0891b2",
    details: {
      fullDescription: "Holistic financial planning services that analyze your entire financial situation and develop comprehensive strategies to achieve your short and long-term goals.",
      benefits: [
        "Comprehensive assessment of your current financial position",
        "Customized roadmap for achieving financial independence",
        "Goal-based planning for major life milestones",
        "Tax-efficient wealth building strategies"
      ],
      idealFor: "Individuals and families looking to create a structured approach to achieving financial goals like retirement, education funding, or major purchases.",
      pricing: [
        {
          tier: "Comprehensive",
          price: "₦350,000 Annually",
          description: "Complete financial planning services covering all aspects of your financial life.",
          features: [
            "Detailed financial analysis",
            "Comprehensive financial plan document",
            "Semi-annual review meetings",
            "Unlimited email and phone support",
            "Access to financial planning tools"
          ]
        }
      ]
    }
  },
  {
    icon: <FaBriefcase />,
    title: "Retirement Solutions",
    description: "Forward-thinking retirement planning strategies to help you build, protect, and distribute retirement wealth for a secure financial future.",
    color: "#f59e0b",
    details: {
      fullDescription: "Specialized retirement planning services designed to help you accumulate sufficient assets for retirement and develop strategies for sustainable income during retirement years.",
      benefits: [
        "Retirement needs analysis and goal setting",
        "Pension optimization strategies",
        "Investment portfolio design for retirement",
        "Distribution and withdrawal planning"
      ],
      idealFor: "Individuals planning for retirement or already in retirement who need strategies to ensure financial security and lifestyle maintenance.",
      pricing: [
        {
          tier: "Retirement Readiness",
          price: "₦300,000 Annually",
          description: "Comprehensive retirement planning services to prepare for and navigate retirement.",
          features: [
            "Retirement needs analysis",
            "Social security optimization",
            "Pension distribution strategies",
            "Healthcare cost planning",
            "Estate planning integration"
          ]
        }
      ]
    }
  },
  {
    icon: <FaRegHandshake />,
    title: "Corporate Advisory",
    description: "Strategic financial consulting for businesses of all sizes, focusing on capital management, business valuations, and growth strategies.",
    color: "#7c3aed",
    details: {
      fullDescription: "Expert financial advisory services for businesses facing complex financial decisions, capital requirements, or strategic transformations.",
      benefits: [
        "Strategic financial planning for business growth",
        "Capital structure optimization",
        "Cash flow management and forecasting",
        "Financial due diligence and risk assessment"
      ],
      idealFor: "Businesses seeking expert guidance on financial strategy, fundraising, acquisitions, or preparing for significant growth or transition phases.",
      pricing: [
        {
          tier: "Business Growth",
          price: "Customized Pricing",
          description: "Tailored financial advisory services for businesses with specific needs and objectives.",
          features: [
            "Financial strategy development",
            "Capital raising support",
            "Financial modeling and projections",
            "Executive team advisory sessions",
            "Quarterly business performance review"
          ]
        }
      ]
    }
  },
  {
    icon: <FaCalculator />,
    title: "Tax Optimization",
    description: "Strategic tax planning services to help minimize tax liability through legal and ethical approaches tailored to your specific situation.",
    color: "#db2777",
    details: {
      fullDescription: "Proactive tax planning strategies designed to legally minimize your tax liability while ensuring compliance with all relevant tax regulations.",
      benefits: [
        "Comprehensive tax strategy development",
        "Year-round tax planning, not just tax season assistance",
        "Identification of applicable deductions and credits",
        "Coordination with other financial strategies"
      ],
      idealFor: "Individuals with complex financial situations and businesses looking to optimize their tax position while maintaining full compliance with tax laws.",
      pricing: [
        {
          tier: "Tax Strategy",
          price: "₦200,000 Annually",
          description: "Comprehensive tax planning services to legally minimize tax liability.",
          features: [
            "Annual tax strategy session",
            "Mid-year tax review",
            "Tax projection analysis",
            "Tax-efficient investment guidance",
            "Year-end tax planning"
          ]
        }
      ]
    }
  },
  {
    icon: <FaMobileAlt />,
    title: "Digital Finance Consulting",
    description: "Innovative digital finance solutions including fintech integration, blockchain strategy, and digital transformation for traditional financial systems.",
    color: "#4f46e5",
    details: {
      fullDescription: "Cutting-edge financial technology consulting to help businesses leverage digital innovations for improved financial operations, customer experience, and competitive advantage.",
      benefits: [
        "Digital financial transformation roadmap",
        "Fintech solution selection and integration guidance",
        "Blockchain strategy development",
        "Digital payment systems optimization"
      ],
      idealFor: "Forward-thinking businesses looking to leverage financial technology to improve operations, enhance customer experience, or develop new business models.",
      pricing: [
        {
          tier: "Digital Transformation",
          price: "Customized Pricing",
          description: "Tailored consulting services for businesses embracing digital finance solutions.",
          features: [
            "Digital finance assessment",
            "Technology solution recommendation",
            "Implementation planning",
            "Staff training guidance",
            "Ongoing optimization support"
          ]
        }
      ]
    }
  },
  {
    icon: <FaChartBar />,
    title: "Data Visualization Suite",
    description: "Transform complex financial data into intuitive visual displays that help you understand market trends and make informed decisions with confidence.",
    color: "#8b5cf6", // Purple
    details: {
      fullDescription: "Our Data Visualization Suite translates intricate financial information into clear, interactive visualizations that reveal patterns and insights otherwise hidden in raw data. This tool makes complex market analysis accessible to everyone, regardless of technical expertise.",
      benefits: [
        "Interactive dashboard with customizable views and metrics",
        "Real-time visual tracking of portfolio performance",
        "Comparative analysis tools for benchmarking",
        "Scenario testing with visual impact assessment",
        "Export capabilities for reports and presentations"
      ],
      idealFor: "Executives, financial advisors, and investors who need to quickly understand complex financial information and communicate insights effectively to stakeholders.",
      pricing: [
        {
          tier: "Visualization Premium",
          price: "₦450,000 Annually",
          description: "Full access to our comprehensive data visualization tools with customization options.",
          features: [
            "Full access to all visualization templates and tools",
            "Custom dashboard creation",
            "Integration with BloomVest Analytics™",
            "Unlimited data exports and reporting",
            "Presentation-ready chart generation",
            "Team sharing capabilities"
          ]
        }
      ]
    }
  }
];

const Services = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [activeService, setActiveService] = useState(null);
  
  // Map services to categories
  const serviceCategories = {
    all: services.map(service => service.title),
    personal: ['Financial Planning', 'Investment Advisory', 'Retirement Solutions', 'Tax Optimization'],
    business: ['Corporate Advisory', 'BloomVest Analytics™', 'Tax Optimization'],
    digital: ['Digital Finance Consulting', 'Data Visualization Suite', 'BloomVest Analytics™']
  };
  
  // Filter services based on active tab
  const filteredServices = services.filter(service => 
    serviceCategories[activeTab].includes(service.title)
  );
  
  const openModal = (service) => {
    setActiveService(service);
    document.body.style.overflow = 'hidden'; // Prevent scrolling while modal is open
  };
  
  const closeModal = () => {
    setActiveService(null);
    document.body.style.overflow = 'auto'; // Re-enable scrolling
  };

  return (
    <ServicesSection>
      <BackgroundPattern />
      <CircleAccent />
      <CircleAccent />
      <Container>
        <ServiceTabs>
          <ServiceTab 
            active={activeTab === 'all'} 
            onClick={() => setActiveTab('all')}
          >
            <FaRegLightbulb />
            <span>All Services</span>
          </ServiceTab>
          
          <ServiceTab 
            active={activeTab === 'personal'} 
            onClick={() => setActiveTab('personal')}
          >
            <FaRegHandshake />
            <span>Personal Finance</span>
          </ServiceTab>
          
          <ServiceTab 
            active={activeTab === 'business'} 
            onClick={() => setActiveTab('business')}
          >
            <FaBriefcase />
            <span>Business Solutions</span>
          </ServiceTab>
          
          <ServiceTab 
            active={activeTab === 'digital'} 
            onClick={() => setActiveTab('digital')}
          >
            <FaMobileAlt />
            <span>Digital Services</span>
          </ServiceTab>
        </ServiceTabs>
        
        <ServiceGrid>
          {filteredServices.map((service, index) => (
            <ServiceCard 
              key={index}
              color={service.color}
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <CardContent>
                <IconWrapper color={service.color}>
                  {service.icon}
                </IconWrapper>
                <ServiceTitle color={service.color}>{service.title}</ServiceTitle>
                <ServiceDescription>{service.description}</ServiceDescription>
                <LearnMore 
                  color={service.color}
                  onClick={() => openModal(service)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Learn More <FaArrowRight />
                </LearnMore>
              </CardContent>
            </ServiceCard>
          ))}
        </ServiceGrid>
      </Container>
      
      <AnimatePresence>
        {activeService && (
          <Overlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <ModalContent
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ModalHeader colorStart={activeService.color === '#4338ca' ? '67, 56, 202' : '34, 197, 94'} colorEnd="26, 54, 93">
                <ModalTagline color={activeService.color}>
                  {activeService.title}
                </ModalTagline>
                <ModalTitle>
                  {activeService.title === "BloomVest Analytics™" ? "Data-Driven Market Intelligence" : "Financial Excellence"}
                </ModalTitle>
                <ModalDescription>
                  {activeService.details.fullDescription}
                </ModalDescription>
                <CloseButton onClick={closeModal}>
                  <FaTimes />
                </CloseButton>
              </ModalHeader>
              
              <ModalBody>
                <ModalMainContent>
                  <ModalSection>
                    <ModalSectionTitle color={activeService.color}>
                      <FaRegLightbulb /> Key Benefits
                    </ModalSectionTitle>
                    <BenefitsList>
                      {activeService.details.benefits.map((benefit, index) => (
                        <BenefitItem key={index} color={activeService.color}>
                          <FaCheckCircle />
                          <BenefitContent>
                            <BenefitTitle>{benefit.title || benefit}</BenefitTitle>
                            <BenefitDescription>
                              {benefit.description || benefit}
                            </BenefitDescription>
                          </BenefitContent>
                        </BenefitItem>
                      ))}
                    </BenefitsList>
                  </ModalSection>
                  
                  <ModalSection>
                    <ModalSectionTitle color={activeService.color}>
                      <FaUserTie /> Who This Service Is For
                    </ModalSectionTitle>
                    <p style={{ 
                      color: '#475569', 
                      lineHeight: '1.8', 
                      fontSize: '1.1rem',
                      padding: '1rem',
                      background: 'rgba(241, 245, 249, 0.7)',
                      borderRadius: '0.75rem',
                      border: '1px solid rgba(226, 232, 240, 1)'
                    }}>
                      {activeService.details.idealFor || 'This service is designed for individuals and businesses seeking professional guidance in optimizing their financial strategy and achieving long-term goals.'}
                    </p>
                  </ModalSection>
                  
                  <ModalSection>
                    <ModalSectionTitle color={activeService.color}>
                      <FaRegFileAlt /> Our Process
                    </ModalSectionTitle>
                    <div style={{ 
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1rem',
                      marginTop: '1rem'
                    }}>
                      {(activeService.details.process || [
                        "Initial consultation to understand your current situation",
                        "Comprehensive analysis of your financial position",
                        "Strategic plan development with clear action steps",
                        "Implementation support and guidance",
                        "Regular reviews and plan adjustments as needed"
                      ]).map((step, index) => (
                        <div key={index} style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '1rem',
                          padding: '1.25rem',
                          background: 'white',
                          borderRadius: '0.75rem',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                          border: '1px solid rgba(226, 232, 240, 0.8)'
                        }}>
                          <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            background: activeService.color,
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '700',
                            flexShrink: 0
                          }}>
                            {index + 1}
                          </div>
                          <div style={{
                            fontSize: '1.1rem',
                            color: '#334155',
                            lineHeight: '1.7'
                          }}>
                            {step}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ModalSection>
                  
                  {activeService.title === "BloomVest Analytics™" && activeService.details.technology && (
                    <ModalSection>
                      <ModalSectionTitle color={activeService.color}>
                        <FaRobot /> Our Proprietary Technology
                      </ModalSectionTitle>
                      <div style={{ marginBottom: '2rem' }}>
                        <div style={{
                          background: 'rgba(67, 56, 202, 0.05)',
                          padding: '1.5rem 2rem',
                          borderRadius: '1rem',
                          marginBottom: '2rem',
                          border: `1px solid rgba(${activeService.color === '#4338ca' ? '67, 56, 202' : '34, 197, 94'}, 0.15)`
                        }}>
                          <h4 style={{ 
                            fontSize: '1.35rem', 
                            fontWeight: '700', 
                            color: '#1a365d', 
                            marginBottom: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem'
                          }}>
                            <FaServer style={{ color: activeService.color }} />
                            {activeService.details.technology.name} 
                            <span style={{ 
                              fontSize: '0.95rem', 
                              fontWeight: '500',
                              color: '#64748b',
                              marginLeft: '0.5rem'
                            }}>
                              ({activeService.details.technology.description})
                            </span>
                          </h4>
                          <p style={{ color: '#475569', lineHeight: '1.8', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
                            The BloomVest Analytics™ platform combines the following technologies:
                          </p>
                        </div>
                        
                        <div style={{ 
                          display: 'grid', 
                          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                          gap: '1.5rem',
                          marginBottom: '2rem'
                        }}>
                          {activeService.details.technology.features.map((feature, idx) => (
                            <div key={idx} style={{
                              padding: '1.5rem',
                              background: 'white',
                              borderRadius: '0.75rem',
                              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
                              border: '1px solid rgba(226, 232, 240, 1)',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '0.75rem'
                            }}>
                              <div style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                background: `${activeService.color}15`,
                                color: activeService.color,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1rem'
                              }}>
                                <FaCheckCircle />
                              </div>
                              <div style={{
                                fontSize: '1rem',
                                color: '#334155',
                                lineHeight: '1.6'
                              }}>
                                {feature}
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div style={{ 
                          padding: '1.5rem', 
                          backgroundColor: 'rgba(67, 56, 202, 0.05)', 
                          borderRadius: '12px',
                          borderLeft: `4px solid ${activeService.color}`,
                          marginTop: '2rem'
                        }}>
                          <h5 style={{ color: '#1a365d', marginBottom: '0.75rem', fontSize: '1.1rem', fontWeight: '600' }}>
                            <FaServer style={{ marginRight: '0.75rem', color: activeService.color }} />
                            System Performance
                          </h5>
                          <p style={{ color: '#334155', lineHeight: '1.7' }}>
                            {activeService.details.technology.performance}
                          </p>
                        </div>
                      </div>
                    </ModalSection>
                  )}
                  
                  <ModalSection>
                    <ModalSectionTitle color={activeService.color}>
                      <FaRegCreditCard /> Pricing & Investment
                    </ModalSectionTitle>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                      gap: '2rem',
                      margin: '2rem 0'
                    }}>
                      {activeService.details.pricing.map((tier, index) => (
                        <div 
                          key={index}
                          style={{
                            padding: '2.5rem',
                            backgroundColor: 'white',
                            borderRadius: '1rem',
                            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)',
                            border: `1px solid ${activeService.color}25`,
                            transition: 'all 0.3s ease',
                            position: 'relative',
                            overflow: 'hidden'
                          }}
                        >
                          <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '6px',
                            background: activeService.color
                          }} />
                          
                          <h4 style={{ fontSize: '1.4rem', color: '#1a365d', marginBottom: '0.5rem', fontWeight: '700' }}>
                            {tier.tier}
                          </h4>
                          <div style={{ fontSize: '2rem', fontWeight: '800', color: activeService.color, marginBottom: '1.5rem' }}>
                            {tier.price}
                          </div>
                          <p style={{ fontSize: '1.1rem', color: '#475569', marginBottom: '1.75rem', lineHeight: '1.6' }}>
                            {tier.description}
                          </p>
                          <div style={{ marginBottom: '2rem' }}>
                            <h5 style={{ 
                              fontSize: '1.1rem', 
                              color: '#1a365d', 
                              marginBottom: '1rem', 
                              fontWeight: '600',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem'
                            }}>
                              <span style={{
                                width: '24px',
                                height: '24px',
                                borderRadius: '50%',
                                background: `${activeService.color}15`,
                                color: activeService.color,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.8rem'
                              }}>
                                <FaCheckCircle />
                              </span>
                              What's included:
                            </h5>
                            <ul style={{ listStyle: 'none', padding: 0, margin: '0' }}>
                              {tier.features.map((feature, featureIndex) => (
                                <li 
                                  key={featureIndex} 
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    fontSize: '1rem',
                                    color: '#334155',
                                    marginBottom: '0.75rem',
                                    gap: '0.75rem'
                                  }}
                                >
                                  <span style={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    background: `${activeService.color}15`,
                                    color: activeService.color,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.7rem',
                                    flexShrink: 0
                                  }}>
                                    <FaCheckCircle />
                                  </span>
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <button
                            style={{
                              width: '100%',
                              padding: '1rem',
                              border: 'none',
                              borderRadius: '0.75rem',
                              background: activeService.color,
                              color: 'white',
                              fontWeight: '700',
                              fontSize: '1.1rem',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              boxShadow: `0 8px 15px ${activeService.color}40`
                            }}
                          >
                            Get Started
                          </button>
                        </div>
                      ))}
                    </div>
                  </ModalSection>
                </ModalMainContent>
              </ModalBody>
            </ModalContent>
          </Overlay>
        )}
      </AnimatePresence>
    </ServicesSection>
  );
};

export default Services;