import React from 'react';
import { SectionId } from '../../types';
import { ArrowUp, ArrowDown } from '../Icons';

interface SectionWrapperProps {
    id: SectionId;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    title: string;
    children: React.ReactNode;
    onReorderSection: (sectionId: SectionId, direction: 'up' | 'down') => void;
    isFirst: boolean;
    isLast: boolean;
}

const SectionWrapper: React.FC<SectionWrapperProps> = ({ id, icon: Icon, title, children, onReorderSection, isFirst, isLast }) => {
    return (
        <section data-section-id={id} className="scroll-mt-20">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                    <Icon className="w-6 h-6 text-gray-500" />
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">{title}</h2>
                </div>
                <div className="flex items-center gap-1">
                    <button 
                        onClick={() => onReorderSection(id, 'up')}
                        disabled={isFirst}
                        className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label="Move section up"
                    >
                        <ArrowUp className="w-5 h-5"/>
                    </button>
                    <button 
                        onClick={() => onReorderSection(id, 'down')}
                        disabled={isLast}
                        className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label="Move section down"
                    >
                        <ArrowDown className="w-5 h-5"/>
                    </button>
                </div>
            </div>
            <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-lg p-6">
                {children}
            </div>
        </section>
    );
};

export default SectionWrapper;