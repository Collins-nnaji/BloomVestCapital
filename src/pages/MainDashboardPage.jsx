import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import HomeContent from '../components/Homepage';
import WhyChooseUs from '../components/WhyChooseUs';


import MarketInsights from '../components/MarketInsights';
import TestimonialsSlider from '../components/TestimonialsSlider';
import CallToAction from '../components/CallToAction';

const PageWrapper = styled(motion.div)`
  overflow: hidden;
`;

const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const MainDashboardPage = () => (
  <PageWrapper
    initial="hidden"
    animate="visible"
    variants={fadeInVariants}
  >
    <motion.div variants={fadeInVariants}>
      <HomeContent />
    </motion.div>
    <motion.div variants={fadeInVariants}>
      <WhyChooseUs />
    </motion.div>
    <motion.div variants={fadeInVariants}>
      <MarketInsights />
    </motion.div>
    <motion.div variants={fadeInVariants}>

      <TestimonialsSlider />
    </motion.div>
    <motion.div variants={fadeInVariants}>
     
      <CallToAction />
    </motion.div>
  </PageWrapper>
);

export default MainDashboardPage;