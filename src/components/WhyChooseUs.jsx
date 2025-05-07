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
  padding: 8rem 0;
  position: relative;
  overflow: hidden;
  background: linear-gradient(170deg, #f8fafc 0%, #eff6ff 100%);
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 8px;
    background: linear-gradient(to right, #22c55e, #15803d);
  }
  
  @media (max-width: 768px) {
    padding: 6rem 0;
  }
`;

const BackgroundAccent = styled.div`
  position: absolute;
  bottom: -200px;
  right: -200px;
  width: 1000px;
  height: 1000px;
  background: radial-gradient(circle, rgba(34, 197, 94, 0.05) 0%, rgba(255, 255, 255, 0) 70%);
  border-radius: 50%;
  z-index: 0;
  opacity: 0.8;
  filter: blur(40px);
  transform: rotate(-15deg);
`;

const BackgroundAccent2 = styled.div`
  position: absolute;
  top: -200px;
  left: -200px;
  width: 800px;
  height: 800px;
  background: radial-gradient(circle, rgba(26, 54, 93, 0.05) 0%, rgba(255, 255, 255, 0) 70%);
  border-radius: 50%;
  z-index: 0;
  opacity: 0.8;
  filter: blur(40px);
  transform: rotate(15deg);
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
  opacity: 0.3;
  z-index: 0;
  pointer-events: none;
  transform: perspective(1000px) rotateX(2deg);
`;

const FloatingShape = styled.div`
  position: absolute;
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(59, 130, 246, 0.1));
  border-radius: ${props => props.round ? '50%' : '0'};
  z-index: 0;
  opacity: 0.6;
  
  &.shape1 {
    width: 120px;
    height: 120px;
    top: 15%;
    right: 10%;
    border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
    background: linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(59, 130, 246, 0.1));
    animation: float1 15s infinite ease-in-out;
  }
  
  &.shape2 {
    width: 80px;
    height: 80px;
    bottom: 20%;
    left: 10%;
    border-radius: 30% 70% 50% 50% / 50% 50% 70% 30%;
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1));
    animation: float2 18s infinite ease-in-out;
  }
  
  @keyframes float1 {
    0% { transform: translate(0, 0) rotate(0deg); }
    50% { transform: translate(15px, -15px) rotate(10deg); }
    100% { transform: translate(0, 0) rotate(0deg); }
  }
  
  @keyframes float2 {
    0% { transform: translate(0, 0) rotate(0deg); }
    50% { transform: translate(-15px, 10px) rotate(-10deg); }
    100% { transform: translate(0, 0) rotate(0deg); }
  }
`;

const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 2.5rem;
  position: relative;
  z-index: 1;
  
  @media (max-width: 768px) {
    padding: 0 1.5rem;
  }
`;

const Heading = styled.h2`
  text-align: center;
  font-size: 3.5rem;
  font-weight: 900;
  margin-bottom: 1.5rem;
  color: #1a365d;
  background: linear-gradient(to right, #1a365d, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -1px;
  line-height: 1.1;
  position: relative;
  display: inline-block;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -15px;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 5px;
    background: linear-gradient(to right, #22c55e, rgba(34, 197, 94, 0.2));
    border-radius: 5px;
  }
  
  @media (max-width: 768px) {
    font-size: 2.8rem;
  }
  
  @media (max-width: 480px) {
    font-size: 2.5rem;
  }
`;

const Description = styled.p`
  text-align: center;
  font-size: 1.35rem;
  line-height: 1.8;
  color: #475569;
  max-width: 850px;
  margin: 2.5rem auto 5rem;
  
  strong {
    font-weight: 600;
    color: #1a365d;
    position: relative;
    display: inline-block;
    z-index: 1;
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 6px;
      background: rgba(34, 197, 94, 0.15);
      z-index: -1;
      border-radius: 2px;
    }
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
      title: "Rigorous Due Diligence",
      tagline: "Methodical evaluation framework",
      description: "Our comprehensive startup evaluation process goes beyond financials to assess market potential, founding team dynamics, technology validation, and sustainable competitive advantages.",
      features: [
        "Proprietary startup evaluation framework",
        "Domain expert consultation for technology validation",
        "Customer discovery interviews for market validation",
        "Financial model stress-testing and analysis"
      ],
      stats: [
        { number: "300+", label: "Startups Evaluated Annually" },
        { number: "9%", label: "Investment Selection Rate" }
      ],
      details: {
        content: [
          {
            title: "Market Opportunity Assessment",
            description: "We analyze total addressable market size, growth trajectory, competitive landscape, and market entry barriers to validate the startup's growth potential and long-term sustainability."
          },
          {
            title: "Founder & Team Evaluation",
            description: "We assess founders' domain expertise, leadership capabilities, resilience, and team dynamics—critical factors that often determine a startup's ability to navigate challenges during early growth stages."
          },
          {
            title: "Technology & Product Validation",
            description: "Our network of industry experts conducts thorough technical due diligence to validate the technology's feasibility, scalability, and defensibility against potential competitors."
          }
        ],
        events: [
          {
            title: "Due Diligence Workshop for Startups",
            date: "Monthly",
            description: "Helping entrepreneurs prepare for investor scrutiny and strengthen their business fundamentals."
          },
          {
            title: "Deal Evaluation Masterclass",
            date: "Quarterly",
            description: "Investment methodology insights for angel investors and venture capital partners."
          }
        ],
        resources: [
          {
            title: "Startup Investment Evaluation Framework",
            type: "PDF Guide",
            color: "#1a365d",
            bg: "rgba(59, 130, 246, 0.1)"
          },
          {
            title: "Red Flags in Early-Stage Investments",
            type: "Whitepaper",
            color: "#1a365d",
            bg: "rgba(59, 130, 246, 0.1)"
          },
          {
            title: "Pre-Investment Checklist for Founders",
            type: "Interactive Tool",
            color: "#1a365d",
            bg: "rgba(59, 130, 246, 0.1)"
          }
        ]
      }
    },
    {
      icon: <FaRegLightbulb />,
      gradient: 'linear-gradient(135deg, #22c55e, #4ade80)',
      title: "Strategic Growth Support",
      tagline: "Beyond financial capital",
      description: "We provide extensive post-investment support to accelerate our portfolio companies' growth through strategic partnerships, operational guidance, and exclusive access to our extensive business network.",
      features: [
        "Executive mentorship from industry veterans",
        "Network access to potential clients and partners",
        "Go-to-market strategy optimization",
        "Talent acquisition support for key positions"
      ],
      stats: [
        { number: "3.5x", label: "Average Revenue Acceleration" },
        { number: "500+", label: "Strategic Introductions Annually" }
      ],
      details: {
        content: [
          {
            title: "Expert Advisory Network",
            description: "Our portfolio companies gain access to our network of over 200 industry executives, technical experts, and successful entrepreneurs who provide targeted advice and strategic introductions."
          },
          {
            title: "Operational Growth Framework",
            description: "We implement a structured methodology for operational excellence, focusing on key metrics, growth levers, and process optimization to help startups scale efficiently without common pitfalls."
          },
          {
            title: "Partnership Acceleration",
            description: "Our strategic relationship with enterprise companies across industries enables portfolio startups to access potential customers, distribution channels, and partnership opportunities otherwise inaccessible to early-stage companies."
          }
        ],
        events: [
          {
            title: "Portfolio Synergy Summit",
            date: "Semi-annually",
            description: "Bringing together our portfolio companies to identify collaboration opportunities and share best practices."
          },
          {
            title: "Scaling Excellence Workshop Series",
            date: "Monthly",
            description: "Tactical sessions on growth marketing, sales excellence, and operational scaling."
          }
        ],
        resources: [
          {
            title: "Early-Stage Scaling Playbook",
            type: "Interactive Guide",
            color: "#22c55e",
            bg: "rgba(34, 197, 94, 0.1)"
          },
          {
            title: "Go-to-Market Strategy Templates",
            type: "Toolkit",
            color: "#22c55e",
            bg: "rgba(34, 197, 94, 0.1)"
          },
          {
            title: "Key Metrics Dashboard Framework",
            type: "Software Template",
            color: "#22c55e",
            bg: "rgba(34, 197, 94, 0.1)"
          }
        ]
      }
    },
    {
      icon: <FaGraduationCap />,
      gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
      title: "Investment Structuring",
      tagline: "Optimized deal architecture",
      description: "We structure investment deals that balance founder incentives with investor protection, creating alignment between all stakeholders while preserving the operational flexibility startups need to thrive.",
      features: [
        "Term sheet development and negotiation",
        "Equity stake optimization",
        "Investor protection provisions",
        "Exit strategy planning"
      ],
      stats: [
        { number: "150+", label: "Transactions Structured" },
        { number: "95%", label: "Founder Satisfaction" }
      ],
      details: {
        content: [
          {
            title: "Balanced Term Sheet Development",
            description: "We create transparent term sheets that protect investor interests while maintaining founder motivation and operational control—ensuring all stakeholders remain aligned through multiple growth stages."
          },
          {
            title: "Valuation Methodology",
            description: "Our systematic approach to startup valuation combines market comparables, growth potential, technology value, and team assessment to establish fair valuations that attract follow-on investment."
          },
          {
            title: "Future Funding Optimization",
            description: "We structure initial investments with future funding rounds in mind, creating clean capitalization tables and clear governance structures that facilitate smoother follow-on investment processes."
          }
        ],
        events: [
          {
            title: "Term Sheet Masterclass",
            date: "Quarterly",
            description: "A comprehensive overview of investment terms and their implications for founders and investors."
          },
          {
            title: "Valuation Workshop",
            date: "Monthly",
            description: "Practical sessions on startup valuation methodologies and negotiation strategies."
          }
        ],
        resources: [
          {
            title: "Startup Valuation Guide",
            type: "E-Book",
            color: "#f59e0b",
            bg: "rgba(245, 158, 11, 0.1)"
          },
          {
            title: "Term Sheet Template Library",
            type: "Document Templates",
            color: "#f59e0b",
            bg: "rgba(245, 158, 11, 0.1)"
          },
          {
            title: "Cap Table Management Tool",
            type: "Software",
            color: "#f59e0b",
            bg: "rgba(245, 158, 11, 0.1)"
          }
        ]
      }
    },
    {
      icon: <FaRobot />,
      gradient: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
      title: "Investor Experience",
      tagline: "Curated investment opportunities",
      description: "We provide our investor network with exclusive access to vetted, high-potential startup opportunities, comprehensive investment analysis, and transparent portfolio performance reporting.",
      features: [
        "Curated deal flow for qualified investors",
        "Detailed investment memoranda",
        "Regular portfolio performance updates",
        "Co-investment opportunities with leading VCs"
      ],
      stats: [
        { number: "28%", label: "Average IRR" },
        { number: "Quarterly", label: "Performance Reporting" }
      ],
      details: {
        content: [
          {
            title: "Opportunity Access Platform",
            description: "Our digital platform provides investors with secure access to curated investment opportunities, complete with comprehensive due diligence materials, financial projections, and founder presentations."
          },
          {
            title: "Portfolio Analytics Dashboard",
            description: "Investors receive access to our real-time portfolio performance dashboard, enabling transparent tracking of investment performance, key milestones, and growth metrics across portfolio companies."
          },
          {
            title: "Investor Education Resources",
            description: "We provide comprehensive educational resources on early-stage investing, risk management strategies, portfolio construction principles, and market trend analysis to help investors make informed decisions."
          }
        ],
        events: [
          {
            title: "Exclusive Startup Pitch Events",
            date: "Monthly",
            description: "Curated showcases featuring our most promising investment candidates."
          },
          {
            title: "Investor Network Roundtables",
            date: "Quarterly",
            description: "Facilitated discussions on investment strategies, market trends, and portfolio company updates."
          }
        ],
        resources: [
          {
            title: "Early-Stage Portfolio Construction Guide",
            type: "Strategic Framework",
            color: "#8b5cf6",
            bg: "rgba(139, 92, 246, 0.1)"
          },
          {
            title: "Investment Memorandum Samples",
            type: "Reference Documents",
            color: "#8b5cf6",
            bg: "rgba(139, 92, 246, 0.1)"
          },
          {
            title: "Startup Investment Risk Assessment",
            type: "Analytical Tool",
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
      <BackgroundPattern />
      <BackgroundAccent />
      <BackgroundAccent2 />
      <FloatingShape className="shape1" />
      <FloatingShape className="shape2" />
      
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <Heading>Why Choose BloomVest</Heading>
          <Description>
            BloomVest delivers exceptional value to both <strong>promising startups and strategic investors</strong>. Our comprehensive approach combines rigorous investment selection, operational expertise, and extensive industry connections to maximize growth potential and investment returns in the early-stage ecosystem.
          </Description>
        </motion.div>
        
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