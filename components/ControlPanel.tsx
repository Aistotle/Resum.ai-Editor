import React, { useState, useEffect } from 'react';
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
    availablePanels?: Panel[];
}

type Panel = 'AI Chat' | 'Design' | 'Templates';

const ControlPanel: React.FC<ControlPanelProps> = (props) => {
    const { t, availablePanels = ['AI Chat', 'Design', 'Templates'] } = props;
    const [activePanel, setActivePanel] = useState<Panel>(availablePanels[0]);

    useEffect(() => {
        if (!availablePanels.includes(activePanel)) {
            setActivePanel(availablePanels[0] || 'AI Chat');
        }
    }, [availablePanels, activePanel]);

    const panelConfig: { id: Panel; icon: React.FC<React.SVGProps<SVGSVGElement>>, labelKey: string }[] = [
        { id: 'AI Chat', icon: MessageSquare, labelKey: 'panelChat' },
        { id: 'Design', icon: Palette, labelKey: 'panelDesign' },
        { id: 'Templates', icon: LayoutGrid, labelKey: 'panelTemplates' },
    ];
    
    const visiblePanels = panelConfig.filter(p => availablePanels.includes(p.id));

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
            default:
                return (
                    <Chatbot
                        conversation={props.conversation}
                        isProcessing={props.isChatProcessing}
                        onSendMessage={props.onSendMessage}
                        t={t}
                    />
                );
        }
    };
    
    return (
        <div className="relative w-full h-full flex bg-foreground">
            {/* Vertical Icon Navigation */}
            <nav className="w-16 h-full flex flex-col items-center justify-start gap-2 py-4 border-r border-border">
                {visiblePanels.map(({ id, icon: Icon, labelKey }) => (
                     <button
                        key={id}
                        onClick={() => setActivePanel(id)}
                        className={`w-12 h-12 flex items-center justify-center rounded-lg transition-colors duration-200 relative ${
                            activePanel === id 
                                ? 'bg-secondary text-primary dark:text-primary' 
                                : 'text-muted-foreground hover:bg-secondary'
                        }`}
                        aria-label={t(labelKey)}
                        aria-selected={activePanel === id}
                    >
                        <Icon className="w-6 h-6" />
                         {activePanel === id && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-primary rounded-r-full" />}
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