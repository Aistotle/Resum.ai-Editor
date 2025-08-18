import React from 'react';
import { ResumeData, DesignOptions, TemplateIdentifier, TemplateConfig, EditorView, CoverLetterData } from '../types';

// Import all templates
import ResumeTemplate from './ResumeTemplate';
import TemplateClassic from './TemplateClassic';
import TemplateBlueHero from './TemplateBlueHero';
import TemplateModernSplit from './TemplateModernSplit';
import TemplateProfessional from './TemplateProfessional';
import TemplateDynamic from './TemplateDynamic';


const CoverLetterViewer: React.FC<{ data: CoverLetterData }> = ({ data }) => {
    // This is a non-editable version for printing
    return (
        <div 
            className="bg-white p-16 text-gray-800 resume-page font-serif text-base"
            style={{ 
                width: '100%', 
                maxWidth: '8.5in', 
                minHeight: '11in', 
                boxSizing: 'border-box',
            }}
        >
            <div className="flex justify-between items-start">
                <div className="text-left text-sm">
                    <h2 className="font-bold text-lg">{data.senderName || ''}</h2>
                    {(data.senderContactInfo || []).map((line, index) => (
                         <div key={index}>{line}</div>
                    ))}
                </div>
                <div className="text-right text-sm">
                    <div>{data.date || ''}</div>
                </div>
            </div>
            <div className="mt-12 mb-8 text-sm">
                 <div className="font-bold">{data.recipientName || ''}</div>
                 <div>{data.recipientTitle || ''}</div>
                 <div>{data.companyName || ''}</div>
                 <div>{data.companyAddress || ''}</div>
            </div>
            <div className="mb-8">
                 <h3 className="font-bold text-lg">{data.subject || ''}</h3>
            </div>
            <div
                className="prose prose-base max-w-none font-serif leading-relaxed"
                dangerouslySetInnerHTML={{ __html: data.body || '' }}
            />
        </div>
    );
};


interface PrintableDocumentProps {
    editorView: EditorView;
    resumeData: ResumeData;
    coverLetterData: CoverLetterData | null;
    selectedTemplate: TemplateIdentifier | TemplateConfig;
    designOptions: DesignOptions;
    t: (key: string) => string;
}

const PrintableDocument: React.FC<PrintableDocumentProps> = (props) => {
    const { editorView, resumeData, coverLetterData, selectedTemplate, designOptions, t } = props;

    if (editorView === EditorView.COVER_LETTER && coverLetterData) {
        return <CoverLetterViewer data={coverLetterData} />;
    }

    // For resume view, these props are for the non-editable print version
    const templateProps = {
        data: resumeData,
        design: designOptions,
        onOverflowChange: () => {}, // No-op in print mode
        t: t,
        // Disable all editing features for print
        editMode: false,
        onUpdate: () => {},
        onFocus: () => {},
        editingPath: null,
        onAITooltipOpen: () => {},
    };

    if (typeof selectedTemplate === 'object') {
        return <TemplateDynamic {...templateProps} config={selectedTemplate} />;
    }
    
    switch (selectedTemplate) {
        case TemplateIdentifier.MODERN:
            return <ResumeTemplate {...templateProps} />;
        case TemplateIdentifier.CLASSIC:
            return <TemplateClassic {...templateProps} />;
        case TemplateIdentifier.BLUE_HERO:
            return <TemplateBlueHero {...templateProps} />;
        case TemplateIdentifier.MODERN_SPLIT:
            return <TemplateModernSplit {...templateProps} />;
        case TemplateIdentifier.PROFESSIONAL:
            return <TemplateProfessional {...templateProps} />;
        default:
            // Fallback for safety
            return <ResumeTemplate {...templateProps} />;
    }
};

export default PrintableDocument;
