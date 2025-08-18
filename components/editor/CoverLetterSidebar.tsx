import React from 'react';
import { Bold, Italic, Underline, List, ListOrdered, AlignLeft, AlignCenter, AlignRight } from '../Icons';

interface CoverLetterSidebarProps {
    t: (key: string) => string;
}

const SectionWrapper: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <section>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">{title}</h2>
        <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-lg p-4">
            {children}
        </div>
    </section>
);

const RTEToolbarButton: React.FC<{ onClick: () => void, children: React.ReactNode, 'aria-label': string }> = ({ onClick, children, 'aria-label': ariaLabel }) => (
    <button
      onClick={onClick}
      onMouseDown={e => e.preventDefault()} // Prevent editor from losing focus
      className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300"
      aria-label={ariaLabel}
      type="button"
    >
      {children}
    </button>
);

const CoverLetterSidebar: React.FC<CoverLetterSidebarProps> = ({ t }) => {
    
    const handleFormat = (command: string, value?: string) => {
        document.execCommand(command, false, value);
    };

    return (
        <div className="p-6 space-y-8">
            <SectionWrapper title={t('textFormatting')}>
                <div className="flex flex-wrap items-center gap-1 p-1 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                    <RTEToolbarButton onClick={() => handleFormat('bold')} aria-label="Bold"><Bold className="w-5 h-5" /></RTEToolbarButton>
                    <RTEToolbarButton onClick={() => handleFormat('italic')} aria-label="Italic"><Italic className="w-5 h-5" /></RTEToolbarButton>
                    <RTEToolbarButton onClick={() => handleFormat('underline')} aria-label="Underline"><Underline className="w-5 h-5" /></RTEToolbarButton>
                    <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>
                    <RTEToolbarButton onClick={() => handleFormat('insertUnorderedList')} aria-label="Bulleted List"><List className="w-5 h-5" /></RTEToolbarButton>
                    <RTEToolbarButton onClick={() => handleFormat('insertOrderedList')} aria-label="Numbered List"><ListOrdered className="w-5 h-5" /></RTEToolbarButton>
                    <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>
                    <RTEToolbarButton onClick={() => handleFormat('justifyLeft')} aria-label="Align Left"><AlignLeft className="w-5 h-5" /></RTEToolbarButton>
                    <RTEToolbarButton onClick={() => handleFormat('justifyCenter')} aria-label="Align Center"><AlignCenter className="w-5 h-5" /></RTEToolbarButton>
                    <RTEToolbarButton onClick={() => handleFormat('justifyRight')} aria-label="Align Right"><AlignRight className="w-5 h-5" /></RTEToolbarButton>
                </div>
            </SectionWrapper>
        </div>
    );
};

export default CoverLetterSidebar;
