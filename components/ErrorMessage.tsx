import React from 'react';
import { AlertTriangle } from './Icons';

interface ErrorMessageProps {
  message: string;
  onRetry: () => void;
  t: (key: string) => string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry, t }) => {
  return (
    <div className="bg-red-500/10 border border-red-500/20 text-red-300 p-6 rounded-lg shadow-sm w-full max-w-2xl text-center flex flex-col items-center">
      <AlertTriangle className="w-10 h-10 text-red-500 mb-4"/>
      <p className="font-semibold text-lg mb-2 text-red-200">{t('errorTitle')}</p>
      <p className="mb-6 text-sm">{message}</p>
      <button
        onClick={onRetry}
        className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-md transition-colors"
      >
        {t('errorTryAgain')}
      </button>
    </div>
  );
};

export default ErrorMessage;