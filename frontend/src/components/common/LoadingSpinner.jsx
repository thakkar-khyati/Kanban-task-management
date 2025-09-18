import React from 'react';

const LoadingSpinner = ({ size = 'md', text = 'Loading...', fullScreen = true }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const containerClasses = fullScreen 
    ? "min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900"
    : "flex items-center justify-center p-8";

  return (
    <div className={containerClasses}>
      <div className="text-center">
        <div className="relative">
          <div className={`spinner ${sizeClasses[size]} mx-auto mb-4`}></div>
          <div className={`absolute inset-0 spinner ${sizeClasses[size]} mx-auto mb-4 opacity-20 animate-pulse`}></div>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base max-w-xs px-4">
          {text}
        </p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
