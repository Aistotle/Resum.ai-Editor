


import React, { useRef, useEffect, useCallback, useState } from 'react';
import { ResumeData, ConversationMessage, TemplateIdentifier, DesignOptions, TemplateConfig, Language, SelectionTooltipState, SectionId, EditorView, CoverLetterData } from '../types';
import ResumeTemplate from './ResumeTemplate';
import TemplateClassic from './TemplateClassic';
import TemplateBlueHero from './TemplateBlueHero';
import TemplateModernSplit from './TemplateModernSplit';
import TemplateProfessional from './TemplateProfessional';
import TemplateStructured from './TemplateStructured';
import TemplateMinimalist from './TemplateMinimalist';
import TemplateDynamic from './TemplateDynamic';
import ControlPanel from './ControlPanel';
import SelectionTooltip from './SelectionTooltip';
import ZoomControls from './ZoomControls';
import EditorSidebar from './EditorSidebar';
import CoverLetterEditor from './CoverLetterEditor';


interface ResumeEditorProps {
    resumeData: ResumeData;
    onSendMessage: (message: string) => void;
    conversation: ConversationMessage[];
    isChatProcessing: boolean;
    selectedTemplate: TemplateIdentifier | TemplateConfig;
    onTemplateChange: (template: TemplateIdentifier | TemplateConfig) => void;
    designOptions: DesignOptions;
    onDesignChange: (option: keyof DesignOptions, value: string) => void;
    onResumeUpdate: (path: string, value: any) => void;
    onOpenModal: (path: keyof ResumeData, index?: number) => void;
    onRemoveItem: (path: keyof ResumeData, index: number) => void;
    onReorderItem: (path: keyof ResumeData, oldIndex: number, newIndex: number) => void;
    customTemplates: TemplateConfig[];
    onAnalyzeTemplate: (file: File) => void;
    isAnalyzingTemplate: boolean;
    analysisError: string | null;
    t: (key: string) => string;
    language: Language;
    selectionTooltip: SelectionTooltipState;
    onSelectionTooltipChange: (state: SelectionTooltipState) => void;
    onAITooltipOpen: (path: string, selectedText: string, element: HTMLElement) => void;
    onSelectionEdit: (instruction: string) => void;
    editingPath: string | null;
    onProfilePictureChange: (file: File | null) => void;
    zoomLevel: number;
    onZoomChange: (zoom: number) => void;
    isSidebarOpen: boolean;
    isControlPanelOpen: boolean;
    isLiveEditingEnabled: boolean;
    onLiveEditingChange: (enabled: boolean) => void;
    onActivePathChange: (path: string | null) => void;
    layout: { sidebar: SectionId[], main: SectionId[] };
    onLayoutChange: (draggedId: SectionId, targetId: SectionId | null, targetColumn: 'sidebar' | 'main') => void;
    // New props
    editorView: EditorView;
    onEditorViewChange: (view: EditorView) => void;
    coverLetter: CoverLetterData | null;
    onUpdateCoverLetter: (path: string, value: any) => void;
    onGenerateCoverLetter: (jobDescription: string) => void;
    isGeneratingCoverLetter: boolean;
    coverLetterError: string | null;
    // New props for consultant
    consultantConversation: ConversationMessage[];
    isConsultantChatProcessing: boolean;
    onConsultantMessage: (message: string) => void;
}

const ResumeEditor: React.FC<ResumeEditorProps> = (props) => {
    const resumeContainerRef = useRef<HTMLDivElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const controlPanelRef = useRef<HTMLElement>(null);

    const { 
        selectedTemplate, t, 
        selectionTooltip, onSelectionTooltipChange, onSelectionEdit,
        zoomLevel, isControlPanelOpen, editorView, onEditorViewChange
    } = props;
    
    // --- Resizable Panel Logic ---
    const [controlPanelWidth, setControlPanelWidth] = useState(384);
    const isResizing = useRef(false);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isResizing.current) return;
        // Calculate new width from the right edge of the screen
        const newWidth = window.innerWidth - e.clientX;
        
        // Clamp the width between min and max values
        const minWidth = 320; // Corresponds to Tailwind's `w-80`
        const maxWidth = 640; // Corresponds to Tailwind's `w-[40rem]`
        const clampedWidth = Math.max(minWidth, Math.min(newWidth, maxWidth));
        
        setControlPanelWidth(clampedWidth);
    }, []);
    
    const handleMouseUp = useCallback(() => {
        isResizing.current = false;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = 'default';
        document.body.style.userSelect = 'auto';
    }, [handleMouseMove]);

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        isResizing.current = true;
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
    };

    useEffect(() => {
        // Cleanup function to remove event listeners if the component unmounts
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [handleMouseMove, handleMouseUp]);
    // --- End Resizable Panel Logic ---


    const handleMouseDownOutside = useCallback((event: MouseEvent) => {
        if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
             onSelectionTooltipChange({ visible: false });
        }
    }, [onSelectionTooltipChange]);

    useEffect(() => {
        // This listener closes the tooltip if you click anywhere outside of it.
        document.addEventListener('mousedown', handleMouseDownOutside);
        return () => {
            document.removeEventListener('mousedown', handleMouseDownOutside);
        };
    }, [handleMouseDownOutside]);

    const renderPreview = () => {
        const templateProps = {
            data: props.resumeData,
            design: props.designOptions,
            t: props.t,
            editMode: props.isLiveEditingEnabled,
            onUpdate: props.onResumeUpdate,
            onFocus: props.onActivePathChange,
            editingPath: props.editingPath,
            onAITooltipOpen: props.onAITooltipOpen,
            layout: props.layout,
            onLayoutChange: props.onLayoutChange,
        };
        
        const currentTemplateId = typeof selectedTemplate === 'string' ? selectedTemplate : selectedTemplate.id;

        if (typeof selectedTemplate === 'object') {
            return <TemplateDynamic {...templateProps} config={selectedTemplate} />;
        }
        
        switch (currentTemplateId) {
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
            case TemplateIdentifier.STRUCTURED:
                return <TemplateStructured {...templateProps} />;
            case TemplateIdentifier.MINIMALIST:
                return <TemplateMinimalist {...templateProps} />;
            default:
                return <p>Unknown template selected.</p>;
        }
    };

    const ViewSwitcher = () => (
        <div className="w-full flex justify-center mb-6">
            <div className="bg-secondary p-1 rounded-lg flex items-center gap-1">
                <button 
                    onClick={() => onEditorViewChange(EditorView.RESUME)}
                    className={`px-6 py-1.5 text-sm font-semibold rounded-md transition-all ${editorView === EditorView.RESUME ? 'bg-background shadow-md text-primary dark:text-primary' : 'text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5'}`}
                >
                    {t('resume')}
                </button>
                 <button 
                    onClick={() => onEditorViewChange(EditorView.COVER_LETTER)}
                    className={`px-6 py-1.5 text-sm font-semibold rounded-md transition-all ${editorView === EditorView.COVER_LETTER ? 'bg-background shadow-md text-primary dark:text-primary' : 'text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5'}`}
                >
                    {t('coverLetter')}
                </button>
            </div>
        </div>
    );
    
    return (
        <div className="w-full h-full flex overflow-hidden">
             {selectionTooltip.visible && (
                <SelectionTooltip
                    ref={tooltipRef}
                    top={selectionTooltip.top!}
                    left={selectionTooltip.left!}
                    onClose={() => onSelectionTooltipChange({ visible: false })}
                    onSubmit={onSelectionEdit}
                    t={t}
                />
            )}
            
            <EditorSidebar 
                isOpen={props.isSidebarOpen}
                editorView={props.editorView}
                resumeData={props.resumeData}
                onUpdate={props.onResumeUpdate}
                onOpenModal={props.onOpenModal}
                onRemoveItem={props.onRemoveItem}
                onReorderItem={props.onReorderItem}
                t={props.t}
                onProfilePictureChange={props.onProfilePictureChange}
            />

            {/* Main Content Area */}
            <div className="relative flex-grow h-full overflow-y-auto px-4 sm:px-6 md:px-8 py-8 sm:py-10 bg-background">
                <ViewSwitcher />
                <div 
                    ref={resumeContainerRef}
                    style={{
                        transform: `scale(${zoomLevel / 100})`,
                        transformOrigin: 'top center',
                        transition: 'transform 0.2s ease-out'
                    }}
                >
                    {editorView === EditorView.RESUME ? (
                        <div className={`max-w-4xl mx-auto ${!props.isLiveEditingEnabled ? 'layout-mode' : ''}`}>
                            <div>
                                {renderPreview()}
                            </div>
                        </div>
                    ) : (
                         <CoverLetterEditor
                            coverLetterData={props.coverLetter}
                            onGenerate={props.onGenerateCoverLetter}
                            onUpdate={props.onUpdateCoverLetter}
                            isGenerating={props.isGeneratingCoverLetter}
                            t={t}
                            error={props.coverLetterError}
                            onAITooltipOpen={props.onAITooltipOpen}
                            editingPath={props.editingPath}
                            onActivePathChange={props.onActivePathChange}
                        />
                    )}
                </div>
                <ZoomControls 
                    zoomLevel={props.zoomLevel} 
                    onZoomChange={props.onZoomChange} 
                    t={t} 
                    isControlPanelOpen={isControlPanelOpen} 
                    controlPanelWidth={controlPanelWidth}
                />
            </div>
            
            {/* Resizable Control Panel Wrapper */}
            <div 
                className={`relative flex-shrink-0 bg-foreground border-l border-border transition-all duration-75 ease-out ${!isControlPanelOpen ? 'w-0 !border-l-0' : ''}`}
                style={isControlPanelOpen ? { width: `${controlPanelWidth}px` } : {}}
            >
                 {isControlPanelOpen && (
                    <div 
                        onMouseDown={handleMouseDown}
                        className="absolute top-0 left-0 -translate-x-1/2 w-2 h-full cursor-col-resize z-20 group"
                    >
                         <div className="w-0.5 h-full bg-transparent group-hover:bg-primary/50 transition-colors duration-200 ml-auto"></div>
                    </div>
                 )}
                 <aside ref={controlPanelRef} className="w-full h-full">
                     <div className={`h-full overflow-hidden transition-opacity duration-200 ${isControlPanelOpen ? 'opacity-100' : 'p-0 opacity-0'}`}>
                        <ControlPanel 
                            {...props}
                            availablePanels={editorView === EditorView.RESUME ? ['AI Chat', 'AI Consultant', 'Design', 'Templates'] : ['AI Chat']}
                        />
                     </div>
                 </aside>
            </div>
        </div>
    );
};

export default ResumeEditor;