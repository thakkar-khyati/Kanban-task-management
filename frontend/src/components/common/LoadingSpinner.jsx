import React from 'react';

const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className={`spinner ${sizeClasses[size]} mx-auto mb-4`}></div>
        <p className="text-gray-600 dark:text-gray-400">{text}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
