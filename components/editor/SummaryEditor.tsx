import React from 'react';
import { ResumeData, SectionId } from '../../types';
import SectionWrapper from './SectionWrapper';
import { FileText, Bold, Italic, Underline, List, ListOrdered } from '../Icons';

interface SummaryEditorProps {
    data: ResumeData;
    onUpdate: (path: string, value: string) => void;
    t: (key: string) => string;
    onReorderSection: (sectionId: SectionId, direction: 'up' | 'down') => void;
    isFirst: boolean;
    isLast: boolean;
}

const RTEToolbarButton: React.FC<{ onClick: () => void, children: React.ReactNode, 'aria-label': string }> = ({ onClick, children, 'aria-label': ariaLabel }) => (
    <button
      onClick={onClick}
      onMouseDown={e => e.preventDefault()} // Prevent editor from losing focus
      className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300"
      aria-label={ariaLabel}
    >
      {children}
    </button>
);

const SummaryEditor: React.FC<SummaryEditorProps> = ({ data, onUpdate, t, onReorderSection, isFirst, isLast }) => {
    
    const handleFormat = (command: string) => {
        document.execCommand(command, false, undefined);
    };
    
    return (
        <SectionWrapper 
            id="summary" 
            icon={FileText} 
            title={t('sectionSummary')}
            onReorderSection={onReorderSection}
            isFirst={isFirst}
            isLast={isLast}
        >
            <div className="border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
                <div className="flex flex-wrap items-center gap-1 p-1 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                    <RTEToolbarButton onClick={() => handleFormat('bold')} aria-label="Bold"><Bold className="w-4 h-4" /></RTEToolbarButton>
                    <RTEToolbarButton onClick={() => handleFormat('italic')} aria-label="Italic"><Italic className="w-4 h-4" /></RTEToolbarButton>
                    <RTEToolbarButton onClick={() => handleFormat('underline')} aria-label="Underline"><Underline className="w-4 h-4" /></RTEToolbarButton>
                    <div className="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-1"></div>
                    <RTEToolbarButton onClick={() => handleFormat('insertUnorderedList')} aria-label="Bulleted List"><List className="w-4 h-4" /></RTEToolbarButton>
                    <RTEToolbarButton onClick={() => handleFormat('insertOrderedList')} aria-label="Numbered List"><ListOrdered className="w-4 h-4" /></RTEToolbarButton>
                </div>
                <div
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => onUpdate('summary', e.currentTarget.innerHTML)}
                    className="p-3 min-h-[150px] focus:outline-none prose dark:prose-invert prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: data.summary }}
                />
            </div>
        </SectionWrapper>
    );
};

export default SummaryEditor;