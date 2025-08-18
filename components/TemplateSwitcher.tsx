import React, { useState } from 'react';
import { TemplateIdentifier, TemplateConfig } from '../types';
import { LayoutGrid } from './Icons';
import TemplateUploadModal from './TemplateUploadModal';
import { ModernPreview, ClassicPreview, BlueHeroPreview, ModernSplitPreview, ProfessionalPreview, DynamicPreview } from './TemplatePreviews';

interface TemplateSwitcherProps {
    selectedTemplate: TemplateIdentifier | TemplateConfig;
    onTemplateChange: (template: TemplateIdentifier | TemplateConfig) => void;
    customTemplates: TemplateConfig[];
    onAnalyzeTemplate: (file: File) => void;
    isAnalyzing: boolean;
    error: string | null;
    t: (key: string) => string;
}

const TemplateOption: React.FC<{
    label: string;
    preview: React.ReactNode;
    isSelected: boolean;
    onClick: () => void;
}> = ({ label, preview, isSelected, onClick }) => (
     <button 
        onClick={onClick}
        className={`relative group rounded-xl transition-all duration-200 flex flex-col gap-2 text-center w-full focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-primary`}
        aria-pressed={isSelected}
    >
        <div className={`w-full aspect-[3/4] overflow-hidden rounded-lg border-2 transition-all duration-200 text-gray-300 dark:text-gray-500 ${isSelected ? 'border-primary shadow-lg' : 'border-gray-200 dark:border-gray-700 group-hover:border-primary/50'}`}>
             {preview}
        </div>
        <span className={`font-semibold text-sm leading-tight transition-colors ${isSelected ? 'text-primary' : 'text-gray-600 dark:text-gray-300'}`}>{label}</span>
    </button>
);

const TemplateSwitcher: React.FC<TemplateSwitcherProps> = ({ selectedTemplate, onTemplateChange, customTemplates, onAnalyzeTemplate, isAnalyzing, error, t }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const getIsSelected = (id: TemplateIdentifier | string): boolean => {
        if (typeof selectedTemplate === 'string') {
            return selectedTemplate === id;
        }
        return selectedTemplate.id === id;
    };

    const handleFileSelect = (file: File) => {
        onAnalyzeTemplate(file);
        // Keep modal open to show loading/error state, it will be closed by parent on success if needed
    };

    return (
        <div className="p-4 h-full flex flex-col">
            <header className="pb-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                <h3 className="font-bold text-lg text-neutral dark:text-white">{t('templatesHeader')}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('templatesSubtitle')}</p>
            </header>
            
            <div className="mt-4 flex-grow overflow-y-auto pr-2 -mr-2 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <TemplateOption 
                        label={t('modern')}
                        preview={<ModernPreview />}
                        isSelected={getIsSelected(TemplateIdentifier.MODERN)}
                        onClick={() => onTemplateChange(TemplateIdentifier.MODERN)}
                    />
                    <TemplateOption 
                        label={t('classic')}
                        preview={<ClassicPreview />}
                        isSelected={getIsSelected(TemplateIdentifier.CLASSIC)}
                        onClick={() => onTemplateChange(TemplateIdentifier.CLASSIC)}
                    />
                     <TemplateOption 
                        label={t('blueHero')}
                        preview={<BlueHeroPreview />}
                        isSelected={getIsSelected(TemplateIdentifier.BLUE_HERO)}
                        onClick={() => onTemplateChange(TemplateIdentifier.BLUE_HERO)}
                    />
                    <TemplateOption 
                        label={t('modernSplit')}
                        preview={<ModernSplitPreview />}
                        isSelected={getIsSelected(TemplateIdentifier.MODERN_SPLIT)}
                        onClick={() => onTemplateChange(TemplateIdentifier.MODERN_SPLIT)}
                    />
                    <TemplateOption 
                        label={t('professional')}
                        preview={<ProfessionalPreview />}
                        isSelected={getIsSelected(TemplateIdentifier.PROFESSIONAL)}
                        onClick={() => onTemplateChange(TemplateIdentifier.PROFESSIONAL)}
                    />
                </div>
                
                {customTemplates.length > 0 && (
                    <div>
                        <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 pt-4 mb-4 border-t border-gray-200 dark:border-gray-700">{t('aiTemplates')}</h4>
                        <div className="grid grid-cols-2 gap-4">
                             {customTemplates.map(template => (
                                <TemplateOption 
                                    key={template.id}
                                    label={template.name}
                                    preview={<DynamicPreview />}
                                    isSelected={getIsSelected(template.id)}
                                    onClick={() => onTemplateChange(template)}
                                />
                             ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="pt-4 mt-auto border-t border-gray-200 dark:border-gray-700">
                 <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-400 to-blue-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                 >
                    {t('createWithAI')}
                    <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2.5 py-0.5 rounded-full">{t('beta')}</span>
                 </button>
            </div>
            
            {isModalOpen && (
                <TemplateUploadModal 
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onFileSelect={handleFileSelect}
                    isAnalyzing={isAnalyzing}
                    error={error}
                    t={t}
                />
            )}
        </div>
    );
};

export default TemplateSwitcher;