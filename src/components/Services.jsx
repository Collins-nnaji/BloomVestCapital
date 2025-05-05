import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChartLine, FaHandHoldingUsd, FaRegLightbulb, FaFileInvoiceDollar, FaHome, FaShieldAlt, FaUsers, FaRegChartBar, FaArrowRight, FaCheckCircle, FaTimes, FaInfoCircle, FaCalendarAlt, FaBook, FaAngleDown, FaAngleUp } from 'react-icons/fa';

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
  font-size: 3rem;
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
  font-size: 1.2rem;
  color: #475569;
  line-height: 1.8;
  margin-top: 2rem;
  
  strong {
    color: #1a365d;
    font-weight: 600;
  }
`;

const ServicesGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3rem;
  max-width: 1000px;
  margin: 0 auto;
`;

// Enhanced service card
const ServiceCard = styled(motion.div)`
  background: white;
  border-radius: 24px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  position: relative;
  z-index: 1;
  border: 1px solid rgba(226, 232, 240, 0.8);
  transform: translateZ(0);
`;

const ServiceHeader = styled.div`
  padding: 2.5rem;
  position: relative;
  background: ${props => props.expanded ? props.bg : 'white'};
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.expanded ? props.bg : '#f8fafc'};
  }
`;

const ServiceIconContainer = styled.div`
  margin-right: 1.5rem;
`;

const ServiceIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 16px;
  background: ${props => props.expanded ? 'rgba(255, 255, 255, 0.15)' : props.bg || 'rgba(34, 197, 94, 0.1)'};
  color: ${props => props.expanded ? 'white' : props.color || '#22c55e'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.25rem;
  transition: all 0.4s ease;
  
  @media (max-width: 768px) {
    width: 60px;
    height: 60px;
    font-size: 1.75rem;
  }
`;

const ServiceHeaderContent = styled.div`
  flex: 1;
`;

const ServiceTitle = styled.h3`
  font-size: 1.8rem;
  font-weight: 700;
  color: ${props => props.expanded ? 'white' : '#1a365d'};
  margin-bottom: 0.75rem;
  transition: color 0.3s ease;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const ServiceDescription = styled.p`
  font-size: 1.1rem;
  line-height: 1.7;
  color: ${props => props.expanded ? 'rgba(255, 255, 255, 0.9)' : '#475569'};
  margin: 0;
  transition: color 0.3s ease;
`;

const ToggleButton = styled.button`
  background: ${props => props.expanded ? 'rgba(255, 255, 255, 0.2)' : 'rgba(226, 232, 240, 0.8)'};
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.expanded ? 'white' : '#1a365d'};
  font-size: 1.25rem;
  cursor: pointer;
  margin-left: 1.5rem;
  transition: all 0.3s ease;
  flex-shrink: 0;
  
  &:hover {
    background: ${props => props.expanded ? 'rgba(255, 255, 255, 0.3)' : 'rgba(226, 232, 240, 1)'};
    transform: scale(1.05);
  }
`;

// Service content sections
const ServiceContent = styled(motion.div)`
  overflow: hidden;
`;

const ServiceSection = styled.div`
  padding: 3rem;
  border-bottom: 1px solid #e2e8f0;
  
  &:last-child {
    border-bottom: none;
  }
  
  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
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
  border-radius: 12px;
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

// Events section
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
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
    border-color: ${props => props.borderColor || 'rgba(34, 197, 94, 0.5)'};
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
`;

const EventDescription = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: #475569;
`;

// CTA section
const ServiceCTA = styled.div`
  background: #f0fdf4;
  padding: 2.5rem;
  border-radius: 12px;
  margin-top: 2rem;
  text-align: center;
`;

const CTATitle = styled.h4`
  font-size: 1.6rem;
  font-weight: 700;
  color: #1a365d;
  margin-bottom: 1rem;
`;

const CTADescription = styled.p`
  font-size: 1.1rem;
  line-height: 1.8;
  color: #475569;
  margin-bottom: 2rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
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
      icon: <FaChartLine />,
      title: "Investment Management",
      description: "Personalized investment strategies designed to help you reach your financial goals with an optimal balance of growth and risk management.",
      features: [
        "Custom portfolio construction",
        "Risk-adjusted return optimization",
        "Regular portfolio rebalancing",
        "Ongoing performance monitoring"
      ],
      iconBg: "rgba(34, 197, 94, 0.1)",
      iconColor: "#22c55e",
      iconHoverBg: "#22c55e",
      headerBg: "linear-gradient(135deg, #22c55e, #15803d)",
      detailContent: {
        description: "Our investment management services create tailored portfolio strategies aligned with your risk tolerance, time horizon, and financial objectives. We leverage both traditional and innovative investment approaches to optimize performance while managing risk.",
        features: [
          {
            title: "Custom Portfolio Construction",
            description: "We build personalized portfolios using a diverse range of asset classes selected specifically to align with your financial goals, risk tolerance, and time horizon.",
            icon: <FaCheckCircle />
          },
          {
            title: "Risk-Adjusted Return Optimization",
            description: "Our approach focuses on maximizing returns relative to the level of risk taken, ensuring your investments work efficiently toward your objectives.",
            icon: <FaCheckCircle />
          },
          {
            title: "Regular Portfolio Rebalancing",
            description: "We systematically adjust your portfolio to maintain your target asset allocation and risk profile as market conditions change.",
            icon: <FaCheckCircle />
          },
          {
            title: "Ongoing Performance Monitoring",
            description: "Continuous assessment of your investments against relevant benchmarks and your personal goals, with regular reporting and reviews.",
            icon: <FaCheckCircle />
          }
        ],
        events: [
          {
            title: "Quarterly Market Outlook",
            date: "September 15, 2023",
            description: "Join our investment team for insights on market trends and positioning strategies."
          },
          {
            title: "Investment Strategy Workshop",
            date: "October 20, 2023",
            description: "Interactive session on portfolio construction and management approaches."
          }
        ]
      }
    },
    {
      icon: <FaRegLightbulb />,
      title: "Financial Planning",
      description: "Comprehensive planning that addresses your entire financial picture and builds a roadmap to achieve your short and long-term objectives.",
      features: [
        "Retirement planning",
        "Education funding strategies",
        "Cash flow & budgeting analysis",
        "Insurance & risk management"
      ],
      iconBg: "rgba(59, 130, 246, 0.1)",
      iconColor: "#3b82f6",
      iconHoverBg: "#3b82f6",
      headerBg: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
      detailContent: {
        description: "Our comprehensive financial planning process examines your entire financial picture to create an integrated strategy aligned with your life goals. We address both immediate needs and long-term objectives while adapting to life's changes and transitions.",
        features: [
          {
            title: "Retirement Planning",
            description: "Develop a clear roadmap for retirement with strategies for accumulation, distribution, and preservation of wealth to support your desired lifestyle.",
            icon: <FaCheckCircle />
          },
          {
            title: "Education Funding Strategies",
            description: "Create effective plans to fund education expenses for children or grandchildren using tax-advantaged savings vehicles and other approaches.",
            icon: <FaCheckCircle />
          },
          {
            title: "Cash Flow & Budgeting Analysis",
            description: "Optimize your income and expenses with structured planning to support your lifestyle goals while building wealth for the future.",
            icon: <FaCheckCircle />
          },
          {
            title: "Insurance & Risk Management",
            description: "Comprehensive assessment of potential financial risks and implementation of appropriate insurance and mitigation strategies.",
            icon: <FaCheckCircle />
          }
        ],
        events: [
          {
            title: "Retirement Planning Seminar",
            date: "September 25, 2023",
            description: "In-depth workshop on building and executing an effective retirement strategy."
          },
          {
            title: "Financial Planning for Business Owners",
            date: "October 12, 2023",
            description: "Specialized planning considerations for entrepreneurs and business owners."
          }
        ]
      }
    },
    {
      icon: <FaFileInvoiceDollar />,
      title: "Tax Optimization",
      description: "Strategic approaches to minimize tax impact on your investments and overall financial strategy while remaining fully compliant.",
      features: [
        "Tax-efficient investment strategies",
        "Capital gains management",
        "Strategic income timing",
        "Tax-loss harvesting"
      ],
      iconBg: "rgba(245, 158, 11, 0.1)",
      iconColor: "#f59e0b",
      iconHoverBg: "#f59e0b",
      headerBg: "linear-gradient(135deg, #f59e0b, #d97706)",
      detailContent: {
        description: "Our tax optimization services help you keep more of what you earn through legal, ethical strategies designed to reduce tax liabilities. We integrate tax planning with your overall financial strategy to enhance after-tax returns and wealth accumulation.",
        features: [
          {
            title: "Tax-Efficient Investment Strategies",
            description: "Strategic placement of investments across taxable and tax-advantaged accounts to minimize tax drag and maximize after-tax returns.",
            icon: <FaCheckCircle />
          },
          {
            title: "Capital Gains Management",
            description: "Proactive planning to control the timing and character of capital gains to minimize their tax impact on your portfolio.",
            icon: <FaCheckCircle />
          },
          {
            title: "Strategic Income Timing",
            description: "Coordinating income sources and timing of distributions to optimize your tax situation across different life phases.",
            icon: <FaCheckCircle />
          },
          {
            title: "Tax-Loss Harvesting",
            description: "Systematic capture of investment losses to offset gains and potentially reduce taxable income, enhancing overall returns.",
            icon: <FaCheckCircle />
          }
        ],
        events: [
          {
            title: "Year-End Tax Planning Workshop",
            date: "November 10, 2023",
            description: "Strategies to implement before year-end to optimize your tax situation."
          },
          {
            title: "Tax-Efficient Retirement Income",
            date: "October 15, 2023",
            description: "How to structure retirement withdrawals to minimize tax impact."
          }
        ]
      }
    },
    {
      icon: <FaHome />,
      title: "Estate Planning",
      description: "Preserve your legacy and ensure your assets are transferred according to your wishes while minimizing complications for your heirs.",
      features: [
        "Wealth transfer strategies",
        "Trust establishment & management",
        "Family legacy planning",
        "Charitable giving strategies"
      ],
      iconBg: "rgba(139, 92, 246, 0.1)",
      iconColor: "#8b5cf6",
      iconHoverBg: "#8b5cf6",
      headerBg: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
      detailContent: {
        description: "Our estate planning services help preserve and efficiently transfer your wealth according to your wishes. We create comprehensive strategies to protect your assets, minimize taxes and fees, and ensure your legacy goals are achieved.",
        features: [
          {
            title: "Wealth Transfer Strategies",
            description: "Sophisticated approaches to efficiently transfer assets to heirs while minimizing taxes and potential complications.",
            icon: <FaCheckCircle />
          },
          {
            title: "Trust Establishment & Management",
            description: "Creation and administration of appropriate trust structures to protect assets and achieve specific estate planning objectives.",
            icon: <FaCheckCircle />
          },
          {
            title: "Family Legacy Planning",
            description: "Development of frameworks to preserve family values and prepare heirs for wealth responsibility across generations.",
            icon: <FaCheckCircle />
          },
          {
            title: "Charitable Giving Strategies",
            description: "Structured approaches to philanthropy that maximize impact while providing potential tax benefits.",
            icon: <FaCheckCircle />
          }
        ],
        events: [
          {
            title: "Estate Planning Fundamentals",
            date: "September 18, 2023",
            description: "Essential workshop on protecting your assets and providing for loved ones."
          },
          {
            title: "Advanced Wealth Transfer Strategies",
            date: "November 5, 2023",
            description: "Sophisticated approaches to minimizing taxes and maximizing legacy impact."
          }
        ]
      }
    },
    {
      icon: <FaHandHoldingUsd />,
      title: "Retirement Planning",
      description: "Develop a clear path to retirement with strategies that balance your current lifestyle needs with future financial security.",
      features: [
        "Retirement income modeling",
        "Social security optimization",
        "Pension & benefits analysis",
        "Sustainable withdrawal strategies"
      ],
      iconBg: "rgba(236, 72, 153, 0.1)",
      iconColor: "#ec4899",
      iconHoverBg: "#ec4899",
      headerBg: "linear-gradient(135deg, #ec4899, #db2777)",
      detailContent: {
        description: "Our retirement planning services create a roadmap for financial independence, helping you transition confidently from the accumulation phase to the distribution phase of life. We develop comprehensive strategies that address both your lifestyle goals and longevity risks.",
        features: [
          {
            title: "Retirement Income Modeling",
            description: "Detailed projections of retirement income needs and sources to ensure financial security throughout retirement.",
            icon: <FaCheckCircle />
          },
          {
            title: "Social Security Optimization",
            description: "Strategic planning to maximize Social Security benefits based on your specific situation and other income sources.",
            icon: <FaCheckCircle />
          },
          {
            title: "Pension & Benefits Analysis",
            description: "Evaluation of pension options and employer benefits to make optimal elections that align with your retirement goals.",
            icon: <FaCheckCircle />
          },
          {
            title: "Sustainable Withdrawal Strategies",
            description: "Development of tax-efficient withdrawal approaches designed to provide reliable income while preserving assets throughout retirement.",
            icon: <FaCheckCircle />
          }
        ],
        events: [
          {
            title: "Pre-Retirement Planning Workshop",
            date: "October 5, 2023",
            description: "Critical steps to take in the five years before retirement."
          },
          {
            title: "Retirement Income Strategies",
            date: "November 15, 2023",
            description: "How to create reliable, tax-efficient income streams in retirement."
          }
        ]
      }
    },
    {
      icon: <FaShieldAlt />,
      title: "Risk Management",
      description: "Protect your wealth and financial future with appropriate insurance strategies and risk mitigation techniques.",
      features: [
        "Insurance needs analysis",
        "Liability protection review",
        "Long-term care planning",
        "Business risk assessment"
      ],
      iconBg: "rgba(20, 184, 166, 0.1)",
      iconColor: "#14b8a6",
      iconHoverBg: "#14b8a6",
      headerBg: "linear-gradient(135deg, #14b8a6, #0f766e)",
      detailContent: {
        description: "Our risk management services help identify and address potential threats to your financial security. We develop comprehensive protection strategies that safeguard your assets and income while providing peace of mind for you and your family.",
        features: [
          {
            title: "Insurance Needs Analysis",
            description: "Thorough evaluation of your insurance requirements across life, disability, health, property and casualty to ensure appropriate coverage.",
            icon: <FaCheckCircle />
          },
          {
            title: "Liability Protection Review",
            description: "Assessment of potential liability exposures and implementation of strategies to protect your assets from claims and litigation.",
            icon: <FaCheckCircle />
          },
          {
            title: "Long-term Care Planning",
            description: "Development of strategies to address potential long-term care needs while protecting family resources.",
            icon: <FaCheckCircle />
          },
          {
            title: "Business Risk Assessment",
            description: "Identification and mitigation of risks specific to business owners, including succession planning and key person protection.",
            icon: <FaCheckCircle />
          }
        ],
        events: [
          {
            title: "Wealth Protection Strategies",
            date: "September 28, 2023",
            description: "Comprehensive approach to protecting your assets from various risks."
          },
          {
            title: "Long-term Care Planning Workshop",
            date: "October 25, 2023",
            description: "Options and strategies for addressing potential long-term care needs."
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
            <SectionTitle>Our <span>Wealth Management</span> Services</SectionTitle>
            <SectionDescription>
              We offer a comprehensive suite of wealth management services tailored to your unique financial situation, goals, and values. Our approach integrates <strong>sophisticated strategies</strong> with <strong>personalized guidance</strong> to optimize your financial life.
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
            >
              <ServiceHeader 
                onClick={() => toggleService(index)}
                expanded={expandedService === index}
                bg={service.headerBg}
              >
                <ServiceIconContainer>
                  <ServiceIcon 
                    bg={service.iconBg} 
                    color={service.iconColor}
                    expanded={expandedService === index}
                  >
                    {service.icon}
                  </ServiceIcon>
                </ServiceIconContainer>
                
                <ServiceHeaderContent>
                  <ServiceTitle expanded={expandedService === index}>
                    {service.title}
                  </ServiceTitle>
                  <ServiceDescription expanded={expandedService === index}>
                    {service.description}
                  </ServiceDescription>
                </ServiceHeaderContent>
                
                <ToggleButton expanded={expandedService === index}>
                  {expandedService === index ? <FaAngleUp /> : <FaAngleDown />}
                </ToggleButton>
              </ServiceHeader>
              
              {/* Expandable content */}
              <AnimatePresence>
                {expandedService === index && (
                  <ServiceContent
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    {/* Features Section */}
                    <ServiceSection>
                      <ServiceSectionTitle iconColor={service.iconColor}>
                        <FaInfoCircle /> Our Approach
                      </ServiceSectionTitle>
                      <FeaturesGrid>
                        {service.detailContent.features.map((feature, featureIndex) => (
                          <FeatureItem 
                            key={featureIndex} 
                            borderColor={service.iconColor}
                          >
                            <FeatureTitle iconColor={service.iconColor}>
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
                      <ServiceSectionTitle iconColor={service.iconColor}>
                        <FaCalendarAlt /> Upcoming Events & Workshops
                      </ServiceSectionTitle>
                      <EventsGrid>
                        {service.detailContent.events.map((event, eventIndex) => (
                          <EventCard 
                            key={eventIndex}
                            borderColor={service.iconColor}
                          >
                            <EventTitle>{event.title}</EventTitle>
                            <EventDate color={service.iconColor}>
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
                          Our experts are ready to provide personalized guidance for your specific financial situation. 
                          Schedule a no-obligation consultation to discuss how our {service.title.toLowerCase()} 
                          services can help you achieve your financial goals.
                        </CTADescription>
                        <CTAButton 
                          href="/consultation" 
                          bg={service.headerBg}
                        >
                          Schedule a Consultation <FaArrowRight />
                        </CTAButton>
                      </ServiceCTA>
                    </ServiceSection>
                  </ServiceContent>
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