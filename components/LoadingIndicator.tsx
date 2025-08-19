import React from 'react';

interface LoadingIndicatorProps {
  message: string;
  t: (key: string) => string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ message, t }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8">
      <div className="flex items-center justify-center space-x-2">
        <div className="w-3 h-3 rounded-full bg-muted-foreground animate-pulse [animation-delay:-0.3s]"></div>
        <div className="w-3 h-3 rounded-full bg-muted-foreground animate-pulse [animation-delay:-0.15s]"></div>
        <div className="w-3 h-3 rounded-full bg-muted-foreground animate-pulse"></div>
      </div>
      <p className="mt-6 text-lg font-medium text-secondary-foreground">{message}</p>
      <p className="mt-2 text-muted-foreground">{t('loadingMoment')}</p>
    </div>
  );
};

export default LoadingIndicator;