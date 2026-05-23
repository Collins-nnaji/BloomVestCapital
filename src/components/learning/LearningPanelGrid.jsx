import React from 'react';
import styled from 'styled-components';

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.85rem;
  margin-bottom: 1rem;

  @media (min-width: 900px) {
    grid-template-columns: ${(p) => (p.$single ? '1fr' : '1.15fr 1fr')};
    align-items: stretch;
  }
`;

/** Side-by-side layout for Continue + Path cards on wide screens */
export default function LearningPanelGrid({ children, single = false }) {
  const items = React.Children.toArray(children).filter(Boolean);
  if (!items.length) return null;
  return <Grid $single={single || items.length === 1}>{items}</Grid>;
};
