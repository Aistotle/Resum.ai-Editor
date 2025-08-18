import React, { useState, useRef } from 'react';
import { CoverLetterData } from '../types';
import LoadingIndicator from './LoadingIndicator';
import Editable from './Editable';

interface CoverLetterEditorProps {
    coverLetterData: CoverLetterData | null;
    onGenerate: (jobDescription: string) => void;
    onUpdate: (path: string, newText: string) => void;
    isGenerating: boolean;
    t: (key: string) => string;
    error: string | null;
    onAITooltipOpen: (path: string, selectedText: string, element: HTMLElement) => void;
    editingPath: string | null;
    onActivePathChange: (path: string | null) => void;
}

const CoverLetterViewer: React.FC<{
    data: CoverLetterData, 
    onUpdate: (path: string, newText: string) => void,
    onAITooltipOpen: (path: string, selectedText: string, element: HTMLElement) => void,
    editingPath: string | null;
    onActivePathChange: (path: string | null) => void;
}> = ({ data, onUpdate, onAITooltipOpen, editingPath, onActivePathChange }) => {
    
    const editableProps = (path: string) => ({
        path: `coverLetter.${path}`,
        onUpdate: onUpdate,
        editMode: true,
        onFocus: onActivePathChange,
        editingPath: editingPath,
        onAITooltipOpen: onAITooltipOpen,
    });

    return (
        <div 
            className="bg-white dark:bg-gray-800 shadow-2xl mb-8 mx-auto p-16 text-gray-800 dark:text-gray-200 resume-page font-serif text-base"
            style={{ 
                width: '100%', 
                maxWidth: '8.5in', 
                minHeight: '11in', 
                boxSizing: 'border-box',
            }}
        >
            <div className="flex justify-between items-start">
                {/* Sender Info */}
                <div className="text-left text-sm">
                    <Editable as="h2" value={data.senderName || ''} {...editableProps('senderName')} className="font-bold text-lg"/>
                    {(data.senderContactInfo || []).map((line, index) => (
                         <Editable key={index} value={line} {...editableProps(`senderContactInfo[${index}]`)} className="block" />
                    ))}
                </div>
                {/* Date */}
                <div className="text-right text-sm">
                    <Editable value={data.date || ''} {...editableProps('date')} />
                </div>
            </div>

            {/* Recipient Info */}
            <div className="mt-12 mb-8 text-sm">
                 <Editable value={data.recipientName || ''} {...editableProps('recipientName')} className="font-bold" />
                 <Editable value={data.recipientTitle || ''} {...editableProps('recipientTitle')} />
                 <Editable value={data.companyName || ''} {...editableProps('companyName')} />
                 <Editable value={data.companyAddress || ''} {...editableProps('companyAddress')} />
            </div>

            {/* Subject */}
            <div className="mb-8">
                 <Editable as="h3" value={data.subject || ''} {...editableProps('subject')} className="font-bold text-lg" />
            </div>
            
            {/* Body */}
            <div className="prose prose-base max-w-none dark:prose-invert font-serif leading-relaxed">
                 <Editable
                    id="cover-letter-body-editor"
                    value={data.body || ''}
                    {...editableProps('body')}
                    isHtml={true}
                 />
            </div>
        </div>
    );
};

const CoverLetterEditor: React.FC<CoverLetterEditorProps> = (props) => {
    const { coverLetterData, onGenerate, onUpdate, isGenerating, t, error, onAITooltipOpen, editingPath, onActivePathChange } = props;
    const [jobDescription, setJobDescription] = useState('');
    
    if (isGenerating) {
        return <LoadingIndicator message={t('coverLetterGenerating')} t={t} />;
    }

    if (coverLetterData) {
        return <CoverLetterViewer 
                    data={coverLetterData} 
                    onUpdate={onUpdate} 
                    onAITooltipOpen={onAITooltipOpen}
                    editingPath={editingPath}
                    onActivePathChange={onActivePathChange}
                />;
    }

    return (
        <div className="max-w-4xl mx-auto p-0 sm:p-2 md:p-4">
            <div className="bg-white dark:bg-gray-800/50 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700/50">
                <h2 className="text-2xl font-bold text-neutral dark:text-white mb-2">{t('coverLetterTitle')}</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-6">{t('coverLetterSubtitle')}</p>
                
                {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert"><p>{error}</p></div>}

                <div className="space-y-4">
                    <div>
                        <label htmlFor="job-description" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                            {t('jobDescriptionLabel')}
                        </label>
                        <textarea
                            id="job-description"
                            rows={10}
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            placeholder={t('jobDescriptionPlaceholder')}
                            className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary focus:outline-none transition"
                        />
                    </div>
                    <button
                        onClick={() => onGenerate(jobDescription)}
                        disabled={!jobDescription.trim()}
                        className="w-full bg-primary hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {t('coverLetterGenerateButton')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CoverLetterEditor;