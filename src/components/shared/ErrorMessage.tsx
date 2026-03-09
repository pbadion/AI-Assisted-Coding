import React from 'react';

interface ErrorMessageProps {
  title?: string;
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = 'Something went wrong',
  message,
}) => (
  <div className="error-container">
    <h2>{title}</h2>
    <p>{message}</p>
  </div>
);

export default ErrorMessage;
