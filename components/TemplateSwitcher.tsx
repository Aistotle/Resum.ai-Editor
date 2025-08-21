import React, { useState } from 'react';
import { TemplateIdentifier, TemplateConfig } from '../types';
import { LayoutGrid } from './Icons';
import TemplateUploadModal from './TemplateUploadModal';
import { ModernPreview, ClassicPreview, BlueHeroPreview, ModernSplitPreview, ProfessionalPreview, StructuredPreview, MinimalistPreview, DynamicPreview } from './TemplatePreviews';

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
        className={`relative group rounded-xl transition-all duration-200 flex flex-col gap-2 text-center w-full focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-foreground focus:ring-primary`}
        aria-pressed={isSelected}
    >
        <div className={`w-full aspect-[3/4] overflow-hidden rounded-lg border-2 transition-all duration-200 text-muted-foreground/30 ${isSelected ? 'border-primary dark:border-primary' : 'border-border group-hover:border-border'}`}>
             {preview}
        </div>
        <span className={`font-semibold text-sm leading-tight transition-colors ${isSelected ? 'text-primary dark:text-primary' : 'text-muted-foreground'}`}>{label}</span>
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
            <header className="pb-4 border-b border-border flex-shrink-0">
                <h3 className="font-bold text-lg text-secondary-foreground">{t('templatesHeader')}</h3>
                <p className="text-sm text-muted-foreground">{t('templatesSubtitle')}</p>
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
                    <TemplateOption 
                        label={t('structured')}
                        preview={<StructuredPreview />}
                        isSelected={getIsSelected(TemplateIdentifier.STRUCTURED)}
                        onClick={() => onTemplateChange(TemplateIdentifier.STRUCTURED)}
                    />
                     <TemplateOption 
                        label={t('minimalist')}
                        preview={<MinimalistPreview />}
                        isSelected={getIsSelected(TemplateIdentifier.MINIMALIST)}
                        onClick={() => onTemplateChange(TemplateIdentifier.MINIMALIST)}
                    />
                </div>
                
                {customTemplates.length > 0 && (
                    <div>
                        <h4 className="text-sm font-semibold text-muted-foreground pt-4 mb-4 border-t border-border">{t('aiTemplates')}</h4>
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

            <div className="pt-4 mt-auto border-t border-border">
                 <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold py-2.5 px-4 rounded-md shadow-sm hover:bg-primary/90 transition-colors"
                 >
                    {t('createWithAI')}
                    <span className="bg-yellow-400/20 text-yellow-500 text-xs font-bold px-2.5 py-0.5 rounded-full">{t('beta')}</span>
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