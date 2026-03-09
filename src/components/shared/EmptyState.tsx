import React from 'react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  heading: string;
  title?: string;
  description?: string;
  linkTo?: string;
  linkLabel?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  heading,
  title = 'Your cart is empty',
  description = 'Add some delicious pies to get started!',
  linkTo = '/',
  linkLabel = 'Continue Shopping',
}) => (
  <main className="container">
    <div className="empty-state-page">
      <h1>{heading}</h1>
      <div className="empty-state-content">
        <h2>{title}</h2>
        <p>{description}</p>
        <Link to={linkTo} className="btn-primary">
          {linkLabel}
        </Link>
      </div>
    </div>
  </main>
);

export default EmptyState;
