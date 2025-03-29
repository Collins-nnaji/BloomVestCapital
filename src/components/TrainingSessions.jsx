import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  FaGraduationCap, 
  FaUserTie, 
  FaBuilding, 
  FaCalendarAlt, 
  FaClock,

  FaCheckCircle,
  FaArrowRight,
  FaStar,
  FaRegStar,
  FaSearch,
  FaRobot,
  FaUserFriends,
  FaTimes,
  FaUserGraduate,
  FaClipboardList,
  FaMoneyBillWave,
  FaLaptop
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Section = styled.section`
  padding: 100px 0;
  background: linear-gradient(170deg, #f8fafc 0%, #eff6ff 100%);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(to right, #22c55e, #15803d);
  }
  
  @media (max-width: 768px) {
    padding: 70px 0;
  }
`;

const BackgroundPattern = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  background-image: radial-gradient(rgba(34, 197, 94, 0.05) 2px, transparent 2px);
  background-size: 30px 30px;
  z-index: 0;
  opacity: 0.8;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 1;
  
  @media (max-width: 768px) {
    padding: 0 1.5rem;
  }
`;

const SectionHeader = styled.div`
  text-align: center;
  max-width: 800px;
  margin: 0 auto 60px;
`;

const Preheading = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: #22c55e;
  margin-bottom: 1.5rem;
  text-transform: uppercase;
  letter-spacing: 3px;
  position: relative;
  display: inline-block;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background: #22c55e;
  }
`;

const Title = styled.h2`
  font-size: 3.25rem;
  font-weight: 900;
  margin-bottom: 1.75rem;
  color: #1a365d;
  background: linear-gradient(to right, #1a365d, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -1px;
  line-height: 1.2;
  
  @media (max-width: 768px) {
    font-size: 2.75rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.35rem;
  color: #475569;
  line-height: 1.8;
  font-weight: 400;
  
  strong {
    color: #1a365d;
    font-weight: 600;
  }
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const FilterSection = styled.div`
  margin-bottom: 50px;
`;

const SearchContainer = styled.div`
  max-width: 700px;
  margin: 0 auto 30px;
  position: relative;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 1.25rem 1.5rem 1.25rem 3.5rem;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: white;
  font-size: 1.1rem;
  color: #1a365d;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #22c55e;
    box-shadow: 0 15px 35px rgba(34, 197, 94, 0.1);
  }
  
  &::placeholder {
    color: #94a3b8;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 1.25rem;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  font-size: 1.25rem;
`;

const SegmentedControl = styled.div`
  display: flex;
  max-width: 600px;
  margin: 0 auto 30px;
  background: rgba(241, 245, 249, 0.8);
  border-radius: 16px;
  padding: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

const SegmentButton = styled.button`
  flex: 1;
  background: ${props => props.active ? 'white' : 'transparent'};
  color: ${props => props.active ? '#1a365d' : '#64748b'};
  border: none;
  padding: 1.15rem 1rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  box-shadow: ${props => props.active ? '0 10px 25px rgba(0, 0, 0, 0.05)' : 'none'};
  
  &:hover {
    background: ${props => props.active ? 'white' : 'rgba(255, 255, 255, 0.7)'};
  }
  
  svg {
    color: ${props => props.active ? '#22c55e' : '#64748b'};
    font-size: 1.15rem;
  }
`;

const TrainingsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2.5rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const TrainingCard = styled.div`
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  transition: all 0.4s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(241, 245, 249, 0.8);
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    border-color: rgba(34, 197, 94, 0.2);
  }
`;

const CardHeader = styled.div`
  background: ${props => 
    props.hybrid 
      ? 'linear-gradient(135deg, #1a365d 0%, #22c55e 100%)' 
      : (props.corporate 
         ? 'linear-gradient(135deg, #1a365d 0%, #3b82f6 100%)' 
         : 'linear-gradient(135deg, #22c55e 0%, #4ade80 100%)')
  };
  padding: 2rem;
  color: white;
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    top: -50px;
    right: -50px;
    width: 150px;
    height: 150px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%);
    border-radius: 50%;
  }
  
  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: rgba(255, 255, 255, 0.2);
  }
`;

const CardContent = styled.div`
  padding: 2rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const CardType = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.95rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const CardTitle = styled.h3`
  font-size: 1.6rem;
  font-weight: 800;
  margin-bottom: 1rem;
  line-height: 1.3;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    font-size: 1.4rem;
  }
`;

const CardMeta = styled.div`
  display: flex;
  gap: 1.5rem;
  font-size: 0.95rem;
  margin-top: auto;
  
  @media (max-width: 375px) {
    flex-direction: column;
    gap: 0.75rem;
  }
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.9);
  
  svg {
    color: rgba(255, 255, 255, 0.7);
  }
`;

const CardFeatures = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 1.5rem 0;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 1rem;
  color: #475569;
  font-size: 1.05rem;
  line-height: 1.5;
  
  svg {
    color: #22c55e;
    margin-top: 0.25rem;
    flex-shrink: 0;
  }
  
  strong {
    color: #1a365d;
    font-weight: 600;
  }
`;

const CardDescription = styled.p`
  font-size: 1.05rem;
  color: #475569;
  line-height: 1.7;
  margin-bottom: 1.5rem;
`;

const RatingSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const RatingCount = styled.div`
  color: #1a365d;
  font-weight: 700;
  font-size: 1rem;
`;

const RatingText = styled.div`
  color: #64748b;
  font-size: 0.95rem;
`;

const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
`;

const Price = styled.div`
  font-size: 1.4rem;
  font-weight: 800;
  color: #22c55e;
  display: flex;
  flex-direction: column;
  
  span {
    font-size: 0.9rem;
    font-weight: 400;
    color: #64748b;
  }
`;

const DetailsButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: #f8fafc;
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  color: #1a365d;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: #1a365d;
    color: white;
    
    svg {
      transform: translateX(3px);
    }
  }
  
  svg {
    transition: transform 0.3s ease;
  }
`;

const CategorySection = styled.div`
  margin-top: 80px;
`;

const CategoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const CategoryTitle = styled.h3`
  font-size: 1.75rem;
  color: var(--primary-color);
  font-weight: 700;
`;

const ViewAllLink = styled.a`
  color: var(--accent-color);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    color: #1a945e;
    
    svg {
      transform: translateX(3px);
    }
  }
  
  svg {
    transition: transform 0.3s ease;
  }
`;

const CustomTrainingSection = styled.div`
  margin-top: 100px;
  background: linear-gradient(135deg, var(--primary-color), #2d4e71);
  border-radius: 20px;
  padding: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  overflow: hidden;
  box-shadow: ${props => props.theme.shadows.lg};
  
  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const CustomTrainingImage = styled.div`
  height: 100%;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  @media (max-width: 968px) {
    height: 250px;
  }
`;

const CustomTrainingContent = styled.div`
  padding: 3.5rem;
  color: white;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(34, 197, 94, 0.15) 0%, transparent 70%);
    top: -150px;
    right: -100px;
    border-radius: 50%;
  }
  
  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
  }
`;

const CustomTrainingTitle = styled.h3`
  font-size: 2.25rem;
  margin-bottom: 1.5rem;
  font-weight: 700;
  position: relative;
  z-index: 1;
  
  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`;

const CustomTrainingText = styled.p`
  font-size: 1.1rem;
  opacity: 0.9;
  line-height: 1.7;
  margin-bottom: 2rem;
  position: relative;
  z-index: 1;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 2rem;
  position: relative;
  z-index: 1;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CustomTrainingButton = styled.button`
  background: var(--accent-color);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 1rem 2rem;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  position: relative;
  z-index: 1;
  
  &:hover {
    background: #1a945e;
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
`;

const EmptyState = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 3rem;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 16px;
  border: 1px dashed rgba(0, 0, 0, 0.1);
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const EmptyTitle = styled.h3`
  font-size: 1.5rem;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
  font-weight: 600;
`;

const EmptyText = styled.p`
  color: var(--text-secondary);
  font-size: 1rem;
`;

// Add these new styled components for the modal
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  overflow-y: auto;
`;

const ModalContent = styled(motion.div)`
  background: white;
  border-radius: 1.5rem;
  width: 90%;
  max-width: 800px;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
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

const ModalHeader = styled.div`
  padding: 2.5rem 2.5rem 1.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  position: relative;
`;

const ModalTitle = styled.h2`
  font-size: 2rem;
  font-weight: 800;
  color: #1a365d;
  margin-bottom: 1rem;
`;

const ModalTagline = styled.p`
  font-size: 1.25rem;
  font-weight: 600;
  color: #22c55e;
  margin-bottom: 1rem;
`;

const ModalDescription = styled.p`
  font-size: 1.1rem;
  line-height: 1.8;
  color: #475569;
  margin-bottom: 0;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: transparent;
  border: none;
  font-size: 1.25rem;
  color: #64748b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f1f5f9;
    color: #1a365d;
  }
`;

const ModalBody = styled.div`
  padding: 0;
`;

const ModalMainContent = styled.div`
  width: 100%;
`;

const ModalSection = styled.div`
  padding: 2.5rem;
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
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a365d;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  
  svg {
    color: #22c55e;
    margin-right: 0.75rem;
    font-size: 1.25rem;
  }
`;

const TrainingSessions = () => {
  const [segmentType, setSegmentType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTraining, setActiveTraining] = useState(null);
  
  // Expanded training data with more details
  const trainings = [
    {
      id: 1,
      title: "Personal Financial Planning",
      type: "individual",
      isHybrid: false,
      duration: "2 weeks",
      sessions: "4 sessions",
      description: "Build a comprehensive personal financial plan covering budgeting, debt management, savings, and basic investment strategies.",
      features: [
        "Personal budget creation",
        "Debt reduction strategies",
        "Emergency fund planning",
        "Basic investment principles"
      ],
      rating: 4.8,
      reviews: 124,
      price: "₦30,000",
      category: "planning",
      details: {
        fullDescription: "This foundational course teaches you how to take control of your personal finances through systematic planning and smart financial decisions. You'll learn practical budgeting techniques, effective debt management strategies, and how to build a strong financial foundation.",
        curriculum: [
          "Understanding your current financial position",
          "Creating a personalized budget that works",
          "Strategies for debt reduction and elimination",
          "Building and maintaining an emergency fund",
          "Fundamentals of saving and investing",
          "Setting SMART financial goals",
          "Insurance and risk management basics"
        ],
        ideal_for: "Individuals looking to take control of their personal finances and create a roadmap for financial stability and growth.",
        learning_format: "2 in-person workshops and 2 virtual sessions with practical exercises, spreadsheet templates, and personalized feedback.",
        instructor: "Oluwaseun Adeyemi, CFP with 12+ years of personal financial planning experience"
      }
    },
    {
      id: 2,
      title: "Corporate Financial Management",
      type: "corporate",
      isHybrid: false,
      duration: "4 weeks",
      sessions: "8 sessions",
      description: "Practical training for financial teams on optimizing capital management, cash flow, and financial reporting.",
      features: [
        "Cash flow optimization",
        "Financial statement analysis",
        "Working capital management",
        "Budgeting and forecasting"
      ],
      rating: 4.7,
      reviews: 42,
      price: "Custom",
      category: "corporate",
      details: {
        fullDescription: "This comprehensive program helps corporate finance teams develop robust financial management practices to drive business performance. From cash flow management to strategic financial planning, this course provides practical tools and frameworks that can be immediately applied to your business operations.",
        curriculum: [
          "Strategic cash flow management in volatile markets",
          "Advanced financial statement analysis and interpretation",
          "Working capital optimization techniques",
          "Effective budgeting and forecasting methodologies",
          "Financial risk assessment and mitigation strategies",
          "Capital allocation decision frameworks",
          "Financial performance metrics and KPIs"
        ],
        ideal_for: "Financial managers, controllers, CFOs, and finance team members looking to enhance their financial management capabilities.",
        learning_format: "Customized on-site workshops and practical case studies tailored to your industry and specific business challenges.",
        instructor: "Chukwudi Okonkwo, MBA, CFA with extensive experience as CFO in manufacturing and service sectors"
      }
    },
    {
      id: 3,
      title: "Investment Fundamentals",
      type: "individual",
      isHybrid: false,
      duration: "3 weeks",
      sessions: "6 sessions",
      description: "Learn essential investment principles, asset classes, risk management, and building a balanced portfolio.",
      features: [
        "Understanding asset classes",
        "Risk and return principles",
        "Portfolio construction basics",
        "Investment goals alignment"
      ],
      rating: 4.9,
      reviews: 86,
      price: "₦40,000",
      category: "investment",
      details: {
        fullDescription: "This course demystifies the world of investments for beginners and intermediate investors. You'll learn how to evaluate different investment opportunities, understand the risk-return relationship, and build a diversified portfolio aligned with your financial goals.",
        curriculum: [
          "Introduction to major asset classes (stocks, bonds, real estate, alternatives)",
          "Understanding investment risk and return",
          "Fundamentals of portfolio construction and asset allocation",
          "Nigerian capital markets overview",
          "Investment options in the Nigerian context",
          "Evaluating investment opportunities",
          "Long-term investment strategies and approaches"
        ],
        ideal_for: "Individuals who want to start investing or improve their existing investment approach with solid fundamental knowledge.",
        learning_format: "Interactive workshops with practical exercises, investment simulations, and case studies in both in-person and virtual formats.",
        instructor: "Amina Ibrahim, Investment Advisor with expertise in Nigerian capital markets"
      }
    },
    {
      id: 4,
      title: "Financial Reporting Workshop",
      type: "corporate",
      isHybrid: false,
      duration: "2 weeks",
      sessions: "4 sessions",
      description: "Practical training on creating effective financial reports, analysis, and using reports for business decisions.",
      features: [
        "Financial statement preparation",
        "Key performance indicators",
        "Variance analysis",
        "Management reporting"
      ],
      rating: 4.8,
      reviews: 35,
      price: "Custom",
      category: "reporting",
      details: {
        fullDescription: "This workshop focuses on developing effective financial reporting systems that provide meaningful insights for business decision-making. From technical preparation to analysis and interpretation, participants will learn how to transform financial data into actionable business intelligence.",
        curriculum: [
          "Financial statement preparation best practices",
          "Designing meaningful management reports",
          "Selecting and tracking relevant KPIs",
          "Effective variance analysis and interpretation",
          "Data visualization techniques for financial information",
          "Communicating financial information to non-financial stakeholders",
          "Compliance with Nigerian reporting standards"
        ],
        ideal_for: "Financial analysts, accountants, controllers, and finance managers responsible for financial reporting in their organizations.",
        learning_format: "Hands-on workshops using your actual company data and reporting requirements to develop customized reporting solutions.",
        instructor: "Folake Adekunle, CPA with extensive experience in financial reporting for multinational corporations"
      }
    },
    {
      id: 5,
      title: "Retirement Planning Essentials",
      type: "individual",
      isHybrid: false,
      duration: "2 weeks",
      sessions: "4 sessions",
      description: "Create a sustainable retirement plan with strategies for savings, investments, and building retirement income.",
      features: [
        "Retirement needs assessment",
        "Savings rate strategies",
        "Pension optimization",
        "Tax-efficient planning"
      ],
      rating: 4.6,
      reviews: 48,
      price: "₦25,000",
      category: "retirement",
      details: {
        fullDescription: "This specialized program helps you prepare for a financially secure retirement through strategic planning, appropriate investment approaches, and understanding retirement income sources in the Nigerian context.",
        curriculum: [
          "Retirement needs assessment and financial goal setting",
          "Understanding the Nigerian pension system",
          "Calculating your retirement number",
          "Optimal savings rate strategies",
          "Investment approaches for different retirement phases",
          "Tax considerations in retirement planning",
          "Estate planning and wealth transfer basics"
        ],
        ideal_for: "Individuals at any career stage who want to plan for a financially secure retirement, with special focus on mid-career and pre-retirement planning.",
        learning_format: "Interactive workshops with personalized retirement calculators, planning templates, and individual consultation sessions.",
        instructor: "Dr. Babatunde Oyelade, Retirement Planning Specialist with experience in pension management"
      }
    }
  ];
  
  // Filter trainings based on segment type and search query
  const filteredTrainings = trainings.filter(training => {
    // Apply segment filter
    const typeMatch = segmentType === 'all' || 
                      (segmentType === 'individual' && training.type === 'individual') ||
                      (segmentType === 'corporate' && training.type === 'corporate') ||
                      (segmentType === 'hybrid' && training.isHybrid);
    
    // Apply search filter
    const searchMatch = searchQuery === '' || 
                        training.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        training.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return typeMatch && searchMatch;
  });
  
  // Render stars for ratings
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} />);
    }
    
    if (hasHalfStar) {
      stars.push(<FaRegStar key="half" />);
    }
    
    const remainingStars = 5 - stars.length;
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} />);
    }
    
    return stars;
  };
  
  const openModal = (training) => {
    setActiveTraining(training);
    document.body.style.overflow = 'hidden'; // Prevent scrolling while modal is open
  };
  
  const closeModal = () => {
    setActiveTraining(null);
    document.body.style.overflow = 'auto'; // Re-enable scrolling
  };

  return (
    <Section id="training">
      <BackgroundPattern />
      <Container>
        <SectionHeader>
          <Preheading>BloomVest Finance</Preheading>
          <Title>Financial Education Programs</Title>
          <Subtitle>
            Practical financial training programs designed for both individuals and corporate clients,
            focused on building essential financial knowledge and skills for better decision-making.
          </Subtitle>
        </SectionHeader>
        
        <FilterSection>
          <SearchContainer>
            <SearchIcon>
              <FaSearch />
            </SearchIcon>
            <SearchInput 
              type="text" 
              placeholder="Search programs..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchContainer>
          
          <SegmentedControl>
            <SegmentButton 
              active={segmentType === 'all'} 
              onClick={() => setSegmentType('all')}
            >
              All Programs
            </SegmentButton>
            <SegmentButton 
              active={segmentType === 'individual'} 
              onClick={() => setSegmentType('individual')}
            >
              <FaUserTie /> Individual
            </SegmentButton>
            <SegmentButton 
              active={segmentType === 'corporate'} 
              onClick={() => setSegmentType('corporate')}
            >
              <FaBuilding /> Corporate
            </SegmentButton>
          </SegmentedControl>
        </FilterSection>
        
        <TrainingsGrid>
          {filteredTrainings.length > 0 ? (
            filteredTrainings.map(training => (
              <TrainingCard key={training.id}>
                <CardHeader corporate={training.type === 'corporate'} hybrid={training.isHybrid}>
                  <CardType>{training.type === 'corporate' ? 'Corporate' : 'Individual'}</CardType>
                  <CardTitle>{training.title}</CardTitle>
                  <CardMeta>
                    <MetaItem>
                      <FaCalendarAlt /> {training.duration}
                    </MetaItem>
                    <MetaItem>
                      <FaClock /> {training.sessions}
                    </MetaItem>
                  </CardMeta>
                </CardHeader>
                
                <CardContent>
                  <CardDescription>{training.description}</CardDescription>
                  
                  <CardFeatures>
                    {training.features.map((feature, index) => (
                      <FeatureItem key={index}><FaCheckCircle /> {feature}</FeatureItem>
                    ))}
                  </CardFeatures>
                </CardContent>
                
                <CardFooter>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', color: '#f59e0b', fontSize: '1rem' }}>
                        {renderStars(training.rating)}
                      </div>
                      <RatingText>
                        {training.rating} ({training.reviews} reviews)
                      </RatingText>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <Price>
                      {training.price}
                    </Price>
                    <DetailsButton onClick={() => openModal(training)}>
                      Details <FaArrowRight />
                    </DetailsButton>
                  </div>
                </CardFooter>
              </TrainingCard>
            ))
          ) : (
            <EmptyState>
              <EmptyIcon>🔍</EmptyIcon>
              <EmptyTitle>No programs found</EmptyTitle>
              <EmptyText>Try adjusting your search or filters to find what you're looking for.</EmptyText>
            </EmptyState>
          )}
        </TrainingsGrid>
      </Container>
      
      <AnimatePresence>
        {activeTraining && (
          <Overlay onClick={closeModal}>
            <ModalContent
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ModalHeader>
                <ModalTagline>
                  {activeTraining.type === 'corporate' ? 'Corporate' : 'Individual'} Program
                </ModalTagline>
                <ModalTitle>{activeTraining.title}</ModalTitle>
                <ModalDescription>{activeTraining.details.fullDescription}</ModalDescription>
                <CloseButton onClick={closeModal}>
                  <FaTimes />
                </CloseButton>
              </ModalHeader>
              
              <ModalBody>
                <ModalMainContent>
                  <ModalSection>
                    <ModalSectionTitle>
                      <FaClipboardList /> Program Curriculum
                    </ModalSectionTitle>
                    <ul style={{ paddingLeft: '1.5rem', color: '#334155', lineHeight: '1.7' }}>
                      {activeTraining.details.curriculum.map((item, index) => (
                        <li key={index} style={{ marginBottom: '0.75rem' }}>{item}</li>
                      ))}
                    </ul>
                  </ModalSection>
                  
                  <ModalSection>
                    <ModalSectionTitle>
                      <FaUserGraduate /> Who This Program Is For
                    </ModalSectionTitle>
                    <p style={{ color: '#475569', lineHeight: '1.7' }}>
                      {activeTraining.details.ideal_for}
                    </p>
                  </ModalSection>
                  
                  <ModalSection>
                    <ModalSectionTitle>
                      <FaLaptop /> Learning Format
                    </ModalSectionTitle>
                    <p style={{ color: '#475569', lineHeight: '1.7' }}>
                      {activeTraining.details.learning_format}
                    </p>
                  </ModalSection>
                  
                  <ModalSection>
                    <ModalSectionTitle>
                      <FaUserTie /> Program Instructor
                    </ModalSectionTitle>
                    <p style={{ color: '#475569', lineHeight: '1.7' }}>
                      {activeTraining.details.instructor}
                    </p>
                  </ModalSection>
                  
                  <ModalSection>
                    <ModalSectionTitle>
                      <FaMoneyBillWave /> Program Investment
                    </ModalSectionTitle>
                    <div style={{ 
                      background: '#f1f9ff', 
                      padding: '1.5rem', 
                      borderRadius: '1rem',
                      border: '1px solid rgba(59, 130, 246, 0.2)' 
                    }}>
                      <h4 style={{ color: '#1a365d', fontSize: '1.5rem', marginBottom: '0.5rem', fontWeight: '700' }}>
                        {activeTraining.price}
                      </h4>
                      <p style={{ color: '#475569', lineHeight: '1.7', marginBottom: '1.5rem' }}>
                        Includes all training materials, access to online resources, and post-program support.
                      </p>
                      <button style={{
                        background: activeTraining.type === 'corporate' ? '#1a365d' : '#22c55e',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.5rem',
                        padding: '1rem 1.5rem',
                        fontSize: '1rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        Enroll Now <FaArrowRight />
                      </button>
                    </div>
                  </ModalSection>
                </ModalMainContent>
              </ModalBody>
            </ModalContent>
          </Overlay>
        )}
      </AnimatePresence>
    </Section>
  );
};

export default TrainingSessions;