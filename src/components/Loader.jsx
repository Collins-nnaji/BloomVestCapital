import React from 'react';
import styled, { keyframes } from 'styled-components';

// Spin animation
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// Pulse animation
const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
`;

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f4f4f4;
`;

const LoaderSpinner = styled.div`
  width: 60px;
  height: 60px;
  border: 6px solid #1a365d;
  border-top: 6px solid #22c55e;
  border-radius: 50%;
  animation: 
    ${spin} 1s linear infinite,
    ${pulse} 1.5s ease-in-out infinite;
`;

const Loader = () => {
  return (
    <LoaderContainer>
      <LoaderSpinner />
    </LoaderContainer>
  );
};

export default Loader;