import React, { useState } from 'react';
import { TemplateIdentifier, ConversationMessage, DesignOptions, TemplateConfig, Language, ResumeData } from '../types';
import TemplateSwitcher from './TemplateSwitcher';
import DesignControls from './DesignControls';
import Chatbot from './Chatbot';
import { MessageSquare, Palette, LayoutGrid } from './Icons';

interface ControlPanelProps {
    resumeData: ResumeData;
    onSendMessage: (message: string) => void;
    conversation: ConversationMessage[];
    isChatProcessing: boolean;
    selectedTemplate: TemplateIdentifier | TemplateConfig;
    onTemplateChange: (template: TemplateIdentifier | TemplateConfig) => void;
    designOptions: DesignOptions;
    onDesignChange: (option: keyof DesignOptions, value: string) => void;
    customTemplates: TemplateConfig[];
    onAnalyzeTemplate: (file: File) => void;
    isAnalyzingTemplate: boolean;
    analysisError: string | null;
    t: (key: string) => string;
    language: Language;
    onProfilePictureChange: (file: File | null) => void;
    isLiveEditingEnabled: boolean;
    onLiveEditingChange: (enabled: boolean) => void;
}

type Panel = 'AI Chat' | 'Design' | 'Templates';

const ControlPanel: React.FC<ControlPanelProps> = (props) => {
    const { t } = props;
    const [activePanel, setActivePanel] = useState<Panel>('AI Chat');

    const panelConfig: { id: Panel; icon: React.FC<React.SVGProps<SVGSVGElement>>, labelKey: string }[] = [
        { id: 'AI Chat', icon: MessageSquare, labelKey: 'panelChat' },
        { id: 'Design', icon: Palette, labelKey: 'panelDesign' },
        { id: 'Templates', icon: LayoutGrid, labelKey: 'panelTemplates' },
    ];

    const renderPanelContent = () => {
        switch (activePanel) {
            case 'Templates':
                return (
                    <TemplateSwitcher
                        selectedTemplate={props.selectedTemplate}
                        onTemplateChange={props.onTemplateChange}
                        customTemplates={props.customTemplates}
                        onAnalyzeTemplate={props.onAnalyzeTemplate}
                        isAnalyzing={props.isAnalyzingTemplate}
                        error={props.analysisError}
                        t={t}
                    />
                );
            case 'Design':
                return (
                    <DesignControls 
                        designOptions={props.designOptions}
                        onDesignChange={props.onDesignChange}
                        t={t}
                        resumeData={props.resumeData}
                        onProfilePictureChange={props.onProfilePictureChange}
                        isLiveEditingEnabled={props.isLiveEditingEnabled}
                        onLiveEditingChange={props.onLiveEditingChange}
                    />
                );
            case 'AI Chat':
                return (
                    <Chatbot
                        conversation={props.conversation}
                        isProcessing={props.isChatProcessing}
                        onSendMessage={props.onSendMessage}
                        t={t}
                    />
                );
            default:
                return null;
        }
    };
    
    return (
        <div className="relative w-full h-full flex bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Vertical Icon Navigation */}
            <nav className="w-16 h-full bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center gap-4 py-4 border-r border-gray-200 dark:border-gray-700">
                {panelConfig.map(({ id, icon: Icon, labelKey }) => (
                     <button
                        key={id}
                        onClick={() => setActivePanel(id)}
                        className={`w-12 h-12 flex items-center justify-center rounded-lg transition-all duration-200 ${
                            activePanel === id 
                                ? 'bg-primary text-white scale-110 shadow-lg' 
                                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-primary'
                        }`}
                        aria-label={t(labelKey)}
                        aria-selected={activePanel === id}
                    >
                        <Icon className="w-6 h-6" />
                    </button>
                ))}
            </nav>
            {/* Panel Content */}
            <div className="flex-1 min-w-0 h-full">
                {renderPanelContent()}
            </div>
        </div>
    );
};

export default ControlPanel;
