import React from 'react';
import { AlertTriangle } from './Icons';

interface PaginationWarningProps {
    t: (key: string) => string;
}

const PaginationWarning: React.FC<PaginationWarningProps> = ({ t }) => {
    return (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 text-yellow-800 dark:text-yellow-200 p-4 rounded-r-lg mb-6 shadow-md flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 mt-0.5 text-yellow-500 flex-shrink-0" />
            <div>
                <p className="font-bold">{t('paginationWarningTitle')}</p>
                <p className="text-sm">
                    {t('paginationWarningBody')}
                </p>
            </div>
        </div>
    );
};

export default PaginationWarning;