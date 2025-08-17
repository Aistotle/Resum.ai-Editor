import React, { useRef, useEffect, useCallback } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { ResumeData, ConversationMessage, TemplateIdentifier, DesignOptions, TemplateConfig, Language, SelectionTooltipState, SectionId } from '../types';
import ResumeTemplate from './ResumeTemplate';
import TemplateClassic from './TemplateClassic';
import TemplateBlueHero from './TemplateBlueHero';
import TemplateModernSplit from './TemplateModernSplit';
import TemplateDynamic from './TemplateDynamic';
import ControlPanel from './ControlPanel';
import PaginationWarning from './PaginationWarning';
import SelectionTooltip from './SelectionTooltip';
import ZoomControls from './ZoomControls';
import EditorSidebar from './EditorSidebar';


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
}

const ResumeEditor: React.FC<ResumeEditorProps> = (props) => {
    const resumeContainerRef = useRef<HTMLDivElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const controlPanelRef = useRef<HTMLElement>(null);

    const { 
        isDownloading, onDownloadComplete, resumeData, hasOverflow, selectedTemplate, t, 
        selectionTooltip, onSelectionTooltipChange, onSelectionEdit,
        zoomLevel, isControlPanelOpen
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
        const generatePdf = async () => {
            if (!resumeContainerRef.current) {
                 onDownloadComplete();
                 return;
            }

            const pages = resumeContainerRef.current.querySelectorAll('.resume-page');
            if (pages.length === 0) {
                onDownloadComplete();
                return;
            }

            try {
                const pdf = new jsPDF('p', 'in', 'letter');
                for (let i = 0; i < pages.length; i++) {
                    const page = pages[i] as HTMLElement;
                    const canvas = await html2canvas(page, { scale: 2, useCORS: true, logging: false });
                    const imgData = canvas.toDataURL('image/png');
                    if (i > 0) pdf.addPage();
                    pdf.addImage(imgData, 'PNG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());
                }
                pdf.save(`${resumeData.name.replace(/\s/g, '_')}_Resume.pdf`);
            } catch (error) {
                console.error("Failed to generate PDF:", error);
                alert("Sorry, there was an error creating the PDF. Please try again.");
            } finally {
                onDownloadComplete();
            }
        };

        if (isDownloading) {
            generatePdf();
        }
    }, [isDownloading, onDownloadComplete, resumeData]);

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
            default:
                return <p>Unknown template selected.</p>;
        }
    };
    
    const showOverflowWarning = hasOverflow && selectedTemplate !== TemplateIdentifier.BLUE_HERO;

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
                resumeData={props.resumeData}
                onUpdate={props.onResumeUpdate}
                onOpenModal={props.onOpenModal}
                onRemoveItem={props.onRemoveItem}
                onReorderItem={props.onReorderItem}
                t={props.t}
                sectionOrder={props.sectionOrder}
                onReorderSection={props.onReorderSection}
            />

            {/* Main Content Area */}
            <div className="relative flex-grow h-full overflow-y-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20 bg-gray-100 dark:bg-gray-800">
                <div ref={resumeContainerRef}>
                    <div className="max-w-4xl mx-auto">
                        {showOverflowWarning && <PaginationWarning t={t} />}
                        <div 
                            style={{
                                transform: `scale(${zoomLevel / 100})`,
                                transformOrigin: 'top center',
                                transition: 'transform 0.2s ease-out'
                            }}
                        >
                            {renderPreview()}
                        </div>
                    </div>
                    <ZoomControls zoomLevel={props.zoomLevel} onZoomChange={props.onZoomChange} t={t} isControlPanelOpen={isControlPanelOpen} />
                </div>
            </div>
            
            {/* Control Panel */}
            <aside ref={controlPanelRef} className={`flex-shrink-0 transition-all duration-300 ease-in-out bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 ${isControlPanelOpen ? 'w-full max-w-md' : 'w-0'}`}>
                 <div className={`h-full overflow-hidden transition-opacity duration-200 ${isControlPanelOpen ? 'p-4 opacity-100' : 'p-0 opacity-0'}`}>
                    <ControlPanel {...props} />
                 </div>
            </aside>
        </div>
    );
};

export default ResumeEditor;