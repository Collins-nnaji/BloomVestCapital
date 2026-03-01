import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  :root {
    /* Primary Colors - White/Black/Green theme */
    --color-primary: #22c55e;
    --color-primary-dark: #15803d;
    --color-primary-light: #4ade80;
    --color-primary-lighter: rgba(34, 197, 94, 0.1);
    
    /* Secondary Colors */
    --color-secondary: #111111;
    --color-secondary-dark: #000000;
    --color-secondary-light: #22c55e;
    
    /* Accent Colors */
    --color-accent-1: #0891b2; /* Teal */
    --color-accent-2: #22c55e; /* Green */
    --color-accent-3: #f59e0b; /* Amber */
    --color-accent-4: #ec4899; /* Pink */
    
    /* Neutral Colors - Black text on white */
    --color-text: #111111;
    --color-text-light: #333333;
    --color-text-lighter: #555555;
    --color-border: #e5e7eb;
    --color-background: #ffffff;
    --color-background-alt: #fafafa;
    
    /* Gradients */
    --gradient-primary: linear-gradient(to right, #22c55e, #15803d);
    --gradient-secondary: linear-gradient(135deg, #1a365d, #3b82f6);
    
    /* Shadows */
    --shadow-sm: 0 4px 6px rgba(0, 0, 0, 0.05);
    --shadow-md: 0 10px 25px rgba(0, 0, 0, 0.08);
    --shadow-lg: 0 20px 40px rgba(0, 0, 0, 0.12);
    
    /* Sizes */
    --header-height: 70px;
    --container-max-width: 1280px;
    
    /* Border Radius */
    --border-radius-sm: 8px;
    --border-radius-md: 16px;
    --border-radius-lg: 24px;
    --border-radius-xl: 32px;
    --border-radius-round: 50px;
    
    /* Transitions */
    --transition-fast: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    --transition-medium: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    --transition-slow: 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  html, body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: var(--color-text);
    line-height: 1.7;
    scroll-behavior: smooth;
    overflow-x: hidden;
  }
  
  h1, h2, h3, h4, h5, h6 {
    font-weight: 700;
    line-height: 1.2;
    color: var(--color-secondary);
    margin-bottom: 1rem;
  }
  
  a {
    text-decoration: none;
    color: var(--color-primary);
    transition: var(--transition-medium);
  }
  
  img {
    max-width: 100%;
    height: auto;
  }
  
  /* Common Button Styles */
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.75rem 1.5rem;
    border-radius: var(--border-radius-round);
    font-weight: 600;
    font-size: 1rem;
    transition: var(--transition-medium);
    cursor: pointer;
    gap: 0.5rem;
    text-decoration: none;
    white-space: nowrap;
    
    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }
  
  .btn-primary {
    background: var(--gradient-primary);
    color: white;
    border: none;
    box-shadow: 0 8px 20px rgba(34, 197, 94, 0.3);
    
    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 12px 25px rgba(34, 197, 94, 0.4);
    }
    
    svg {
      transition: transform var(--transition-medium);
    }
    
    &:hover svg {
      transform: translateX(3px);
    }
  }
  
  .btn-secondary {
    background: transparent;
    color: var(--color-secondary);
    border: 2px solid var(--color-secondary);
    
    &:hover {
      background: rgba(26, 54, 93, 0.05);
      transform: translateY(-3px);
    }
  }
  
  .btn-light {
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(10px);
    
    &:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-3px);
      border-color: rgba(255, 255, 255, 0.5);
    }
  }
  
  .btn-outline {
    background: transparent;
    color: var(--color-primary);
    border: 2px solid var(--color-primary);
    
    &:hover {
      background: var(--color-primary);
      color: white;
      transform: translateY(-3px);
    }
  }
  
  .btn-lg {
    padding: 1rem 2rem;
    font-size: 1.125rem;
  }
  
  .btn-sm {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }
  
  /* Section Styles */
  .section {
    padding: 100px 0;
    position: relative;
    
    @media (max-width: 768px) {
      padding: 70px 0;
    }
  }
  
  .container {
    max-width: var(--container-max-width);
    margin: 0 auto;
    padding: 0 2rem;
    
    @media (max-width: 768px) {
      padding: 0 1.5rem;
    }
  }
  
  /* Text Helpers */
  .text-primary {
    color: var(--color-primary);
  }
  
  .text-secondary {
    color: var(--color-secondary);
  }
  
  .text-white {
    color: white;
  }
  
  .text-center {
    text-align: center;
  }
  
  /* Typography */
  .heading-xl {
    font-size: 3.5rem;
    font-weight: 800;
    
    @media (max-width: 768px) {
      font-size: 2.5rem;
    }
  }
  
  .heading-lg {
    font-size: 2.75rem;
    font-weight: 800;
    
    @media (max-width: 768px) {
      font-size: 2.25rem;
    }
  }
  
  .heading-md {
    font-size: 2rem;
    font-weight: 700;
    
    @media (max-width: 768px) {
      font-size: 1.75rem;
    }
  }
  
  .heading-sm {
    font-size: 1.5rem;
    font-weight: 700;
    
    @media (max-width: 768px) {
      font-size: 1.25rem;
    }
  }
  
  /* Spacing Utilities */
  .mt-1 { margin-top: 0.5rem; }
  .mt-2 { margin-top: 1rem; }
  .mt-3 { margin-top: 1.5rem; }
  .mt-4 { margin-top: 2rem; }
  .mt-5 { margin-top: 2.5rem; }
  
  .mb-1 { margin-bottom: 0.5rem; }
  .mb-2 { margin-bottom: 1rem; }
  .mb-3 { margin-bottom: 1.5rem; }
  .mb-4 { margin-bottom: 2rem; }
  .mb-5 { margin-bottom: 2.5rem; }
  
  .mx-auto { 
    margin-left: auto;
    margin-right: auto;
  }
  
  /* Animations */
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  
  @keyframes slideInRight {
    from { transform: translateX(20px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes scaleIn {
    from { transform: scale(0.95); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.8; transform: scale(1.02); }
  }
  
  .fade-in {
    animation: fadeIn 0.6s ease forwards;
  }
  
  .slide-up {
    animation: slideUp 0.6s ease forwards;
  }
  
  .slide-in-right {
    animation: slideInRight 0.4s ease forwards;
  }
  
  .scale-in {
    animation: scaleIn 0.35s ease forwards;
  }
  
  .animate-pulse {
    animation: pulse 2s ease-in-out infinite;
  }
`;

export default GlobalStyles;

 