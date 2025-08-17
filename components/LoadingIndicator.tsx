import React from 'react';

interface LoadingIndicatorProps {
  message: string;
  t: (key: string) => string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ message, t }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8">
      <div className="flex items-center justify-center space-x-2">
        <div className="w-4 h-4 rounded-full bg-primary animate-pulse [animation-delay:-0.3s]"></div>
        <div className="w-4 h-4 rounded-full bg-primary animate-pulse [animation-delay:-0.15s]"></div>
        <div className="w-4 h-4 rounded-full bg-primary animate-pulse"></div>
      </div>
      <p className="mt-6 text-xl font-semibold text-neutral dark:text-gray-200">{message}</p>
      <p className="mt-2 text-gray-500 dark:text-gray-400">{t('loadingMoment')}</p>
    </div>
  );
};

export default LoadingIndicator;