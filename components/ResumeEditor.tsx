import React, { useRef, useEffect, useCallback } from 'react';
import { ResumeData, ConversationMessage, TemplateIdentifier, DesignOptions, TemplateConfig, Language, SelectionTooltipState, SectionId, EditorView, CoverLetterData } from '../types';
import ResumeTemplate from './ResumeTemplate';
import TemplateClassic from './TemplateClassic';
import TemplateBlueHero from './TemplateBlueHero';
import TemplateModernSplit from './TemplateModernSplit';
import TemplateProfessional from './TemplateProfessional';
import TemplateDynamic from './TemplateDynamic';
import ControlPanel from './ControlPanel';
import PaginationWarning from './PaginationWarning';
import SelectionTooltip from './SelectionTooltip';
import ZoomControls from './ZoomControls';
import EditorSidebar from './EditorSidebar';
import CoverLetterEditor from './CoverLetterEditor';
import { exportToPdf } from '../services/pdfService';


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
    isDownloading: boolean;
    onDownloadComplete: () => void;
    hasOverflow: boolean;
    onOverflowChange: (overflow: boolean) => void;
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
    sectionOrder: SectionId[];
    onReorderSection: (sectionId: SectionId, direction: 'up' | 'down') => void;
    // New props
    editorView: EditorView;
    onEditorViewChange: (view: EditorView) => void;
    coverLetter: CoverLetterData | null;
    onUpdateCoverLetter: (path: string, value: any) => void;
    onGenerateCoverLetter: (jobDescription: string) => void;
    isGeneratingCoverLetter: boolean;
    coverLetterError: string | null;
}

const ResumeEditor: React.FC<ResumeEditorProps> = (props) => {
    const resumeContainerRef = useRef<HTMLDivElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const controlPanelRef = useRef<HTMLElement>(null);

    const { 
        isDownloading, onDownloadComplete, resumeData, hasOverflow, selectedTemplate, t, 
        selectionTooltip, onSelectionTooltipChange, onSelectionEdit,
        zoomLevel, isControlPanelOpen, editorView, onEditorViewChange
    } = props;
    
    const handleMouseDown = useCallback((event: MouseEvent) => {
        if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
             onSelectionTooltipChange({ visible: false });
        }
    }, [onSelectionTooltipChange]);

    useEffect(() => {
        // This listener closes the tooltip if you click anywhere outside of it.
        document.addEventListener('mousedown', handleMouseDown);
        return () => {
            document.removeEventListener('mousedown', handleMouseDown);
        };
    }, [handleMouseDown]);


    useEffect(() => {
        const doGeneratePdf = async () => {
            try {
                await exportToPdf(
                    editorView,
                    resumeContainerRef,
                    resumeData
                );
            } catch (error) {
                console.error("Failed to generate PDF:", error);
                alert("Sorry, there was an error creating the PDF. Please try again.");
            } finally {
                onDownloadComplete();
            }
        };

        if (isDownloading) {
            // Small delay to allow UI to update to "Downloading..."
            setTimeout(doGeneratePdf, 100);
        }
    }, [isDownloading, onDownloadComplete, resumeData, editorView]);

    const renderPreview = () => {
        const templateProps = {
            data: props.resumeData,
            design: props.designOptions,
            onOverflowChange: props.onOverflowChange,
            t: props.t,
            editMode: props.isLiveEditingEnabled,
            onUpdate: props.onResumeUpdate,
            onFocus: props.onActivePathChange,
            editingPath: props.editingPath,
            onAITooltipOpen: props.onAITooltipOpen,
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
            default:
                return <p>Unknown template selected.</p>;
        }
    };

    const ViewSwitcher = () => (
        <div className="w-full flex justify-center mb-8">
            <div className="bg-gray-200 dark:bg-gray-700 p-1 rounded-full flex items-center gap-1">
                <button 
                    onClick={() => onEditorViewChange(EditorView.RESUME)}
                    className={`px-6 py-2 text-sm font-bold rounded-full transition-colors ${editorView === EditorView.RESUME ? 'bg-white dark:bg-gray-800 text-primary shadow' : 'text-gray-600 dark:text-gray-300'}`}
                >
                    {t('resume')}
                </button>
                 <button 
                    onClick={() => onEditorViewChange(EditorView.COVER_LETTER)}
                    className={`px-6 py-2 text-sm font-bold rounded-full transition-colors ${editorView === EditorView.COVER_LETTER ? 'bg-white dark:bg-gray-800 text-primary shadow' : 'text-gray-600 dark:text-gray-300'}`}
                >
                    {t('coverLetter')}
                </button>
            </div>
        </div>
    );
    
    const showOverflowWarning = hasOverflow && selectedTemplate !== TemplateIdentifier.BLUE_HERO && editorView === EditorView.RESUME;

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
                sectionOrder={props.sectionOrder}
                onReorderSection={props.onReorderSection}
                onProfilePictureChange={props.onProfilePictureChange}
            />

            {/* Main Content Area */}
            <div className="relative flex-grow h-full overflow-y-auto px-4 sm:px-6 md:px-8 py-8 sm:py-10 bg-gray-100 dark:bg-gray-800">
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
                        <div className="max-w-4xl mx-auto">
                            {showOverflowWarning && <PaginationWarning t={t} />}
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
                <ZoomControls zoomLevel={props.zoomLevel} onZoomChange={props.onZoomChange} t={t} isControlPanelOpen={isControlPanelOpen} />
            </div>
            
            {/* Control Panel */}
            <aside ref={controlPanelRef} className={`flex-shrink-0 transition-all duration-300 ease-in-out bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 ${isControlPanelOpen ? 'w-full max-w-md' : 'w-0'}`}>
                 <div className={`h-full overflow-hidden transition-opacity duration-200 ${isControlPanelOpen ? 'p-4 opacity-100' : 'p-0 opacity-0'}`}>
                    <ControlPanel 
                        {...props}
                        availablePanels={editorView === EditorView.RESUME ? ['AI Chat', 'Design', 'Templates'] : ['AI Chat']}
                    />
                 </div>
            </aside>
        </div>
    );
};

export default ResumeEditor;