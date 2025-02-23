import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :root {
    --primary-color: #1a365d;
    --secondary-color: #2563eb;
    --accent-color: #22c55e;
    --text-primary: #1a365d;
    --text-secondary: #64748b;
    --background: #f8fafc;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    line-height: 1.5;
    color: var(--text-primary);
    background: var(--background);
  }

  .container {
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 2rem;

    @media (max-width: 768px) {
      padding: 0 1rem;
    }
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: 'Inter', sans-serif;
    font-weight: 700;
    line-height: 1.2;
    color: var(--primary-color);
  }

  h1 {
    font-size: 3.5rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    
    @media (max-width: 768px) {
      font-size: 2.5rem;
    }
  }

  h2 {
    font-size: 2.75rem;
    letter-spacing: -0.01em;
    
    @media (max-width: 768px) {
      font-size: 2rem;
    }
  }

  h3 {
    font-size: 1.5rem;
    font-weight: 600;
  }

  p {
    font-size: 1.125rem;
    line-height: 1.7;
    color: var(--text-secondary);
  }

  button {
    font-family: 'Inter', sans-serif;
    font-weight: 600;
  }

  section {
    padding: 80px 0;
  }

  a {
    text-decoration: none;
    color: inherit;
    transition: all 0.3s ease;
  }

  /* Smooth Scrolling */
  html {
    scroll-behavior: smooth;
  }

  /* Selection Color */
  ::selection {
    background: var(--accent-color);
    color: white;
  }
`;