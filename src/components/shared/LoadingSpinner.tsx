import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = 'Loading...' }) => (
  <div className="loading-container">
    <div className="loading-spinner">{message}</div>
  </div>
);

export default LoadingSpinner;
