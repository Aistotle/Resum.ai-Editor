import React from 'react';
import { AlertTriangle } from './Icons';

interface ErrorMessageProps {
  message: string;
  onRetry: () => void;
  t: (key: string) => string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry, t }) => {
  return (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-300 p-6 rounded-2xl shadow-lg w-full max-w-2xl text-center flex flex-col items-center">
      <AlertTriangle className="w-12 h-12 text-red-400 mb-4"/>
      <p className="font-bold text-xl mb-2 text-red-800 dark:text-red-200">{t('errorTitle')}</p>
      <p className="mb-6">{message}</p>
      <button
        onClick={onRetry}
        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-full transition-all transform hover:scale-105"
      >
        {t('errorTryAgain')}
      </button>
    </div>
  );
};

export default ErrorMessage;