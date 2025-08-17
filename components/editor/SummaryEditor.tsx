import React from 'react';
import { ResumeData, SectionId } from '../../types';
import SectionWrapper from './SectionWrapper';
import { FileText } from '../Icons';

interface SummaryEditorProps {
    data: ResumeData;
    onUpdate: (path: string, value: string) => void;
    t: (key: string) => string;
    onReorderSection: (sectionId: SectionId, direction: 'up' | 'down') => void;
    isFirst: boolean;
    isLast: boolean;
}

// A mock RTE toolbar for visual purposes as requested.
const MiniRTEToolbar = () => {
    const buttons = ['B', 'I', 'S', 'A', '@', 'link', '</>', 'H1', 'H2', 'H3', 'list-ol', 'list-ul'];
    return (
        <div className="flex flex-wrap items-center gap-2 p-2 border-b border-gray-200 dark:border-gray-700">
            {buttons.map(b => <div key={b} className="w-6 h-6 bg-gray-200 dark:bg-gray-600 rounded text-xs flex items-center justify-center text-gray-500 dark:text-gray-400">{b[0]}</div>)}
        </div>
    )
};

const SummaryEditor: React.FC<SummaryEditorProps> = ({ data, onUpdate, t, onReorderSection, isFirst, isLast }) => {
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
                <MiniRTEToolbar />
                <div
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => onUpdate('summary', e.currentTarget.innerHTML)}
                    className="p-3 min-h-[150px] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
                    dangerouslySetInnerHTML={{ __html: data.summary }}
                />
            </div>
        </SectionWrapper>
    );
};

export default SummaryEditor;