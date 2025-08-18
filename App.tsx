import React, { useState, useCallback, useEffect } from 'react';
import { AppState, ResumeData, ConversationMessage, TemplateIdentifier, DesignOptions, TemplateConfig, Language, SelectionTooltipState, ModalState, SectionId, EditorView, CoverLetterData } from './types';
import { improveResumeWithAI, editResumeWithAI, analyzeResumeTemplate, editSelectedTextWithAI, generateCoverLetterWithAI, editCoverLetterWithAI, NetworkError, APIError, ContentError } from './services/geminiService';
import { exportToPdf } from './services/pdfService';
import FileUpload from './components/FileUpload';
import LoadingIndicator from './components/LoadingIndicator';
import ErrorMessage from './components/ErrorMessage';
import Header from './components/Header';
import Hero from './components/Hero';
import ResumeEditor from './components/ResumeEditor';
import { translations } from './translations';
import { getNewItem } from './utils/getNewItem';
import ExperienceModal from './components/editor/modals/ExperienceModal';
import EducationModal from './components/editor/modals/EducationModal';
import ProfileModal from './components/editor/modals/ProfileModal';
import ProjectModal from './components/editor/modals/ProjectModal';
import CertificationModal from './components/editor/modals/CertificationModal';
import LanguageModal from './components/editor/modals/LanguageModal';
import SimpleTextModal from './components/editor/modals/SimpleTextModal';


const defaultDesignOptions: DesignOptions = {
  primaryColor: '#3B82F6', // A brighter blue
  headingFont: 'Montserrat',
  bodyFont: 'Lato',
  profilePictureShape: 'circle',
};

const initialSectionOrder: SectionId[] = [
    'basics', 'summary', 'profiles', 'experience', 'education', 
    'skills', 'projects', 'certifications', 'languages', 'interests'
];

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.INITIAL);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [improvedResume, setImprovedResume] = useState<ResumeData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [isChatProcessing, setIsChatProcessing] = useState<boolean>(false);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateIdentifier | TemplateConfig>(TemplateIdentifier.MODERN);
  const [designOptions, setDesignOptions] = useState<DesignOptions>(defaultDesignOptions);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [hasOverflow, setHasOverflow] = useState<boolean>(false);
  const [customTemplates, setCustomTemplates] = useState<TemplateConfig[]>([]);
  const [isAnalyzingTemplate, setIsAnalyzingTemplate] = useState<boolean>(false);
  const [language, setLanguage] = useState<Language>('da');
  const [selectionTooltip, setSelectionTooltip] = useState<SelectionTooltipState>({ visible: false });
  const [editingPath, setEditingPath] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isControlPanelOpen, setIsControlPanelOpen] = useState(true);
  const [isLiveEditingEnabled, setIsLiveEditingEnabled] = useState<boolean>(true);
  const [modalState, setModalState] = useState<ModalState | null>(null);
  const [sectionOrder, setSectionOrder] = useState<SectionId[]>(initialSectionOrder);
  
  // New state for cover letter feature
  const [editorView, setEditorView] = useState<EditorView>(EditorView.RESUME);
  const [coverLetter, setCoverLetter] = useState<CoverLetterData | null>(null);
  const [isGeneratingCoverLetter, setIsGeneratingCoverLetter] = useState<boolean>(false);
  
  // New state for job description tailoring
  const [jobDescription, setJobDescription] = useState<string>('');
  const [isTailoringEnabled, setIsTailoringEnabled] = useState<boolean>(false);


  const t = useCallback((key: string, replacements?: Record<string, string>): string => {
    const keys = key.split('.');
    let result: any = translations[language];
    for (const k of keys) {
      result = result?.[k];
      if (result === undefined) {
        let fallbackResult: any = translations['en'];
        for (const fk of keys) {
          fallbackResult = fallbackResult?.[fk];
        }
        result = fallbackResult || key;
        break;
      }
    }
    let strResult = String(result);
    if (replacements) {
        Object.keys(replacements).forEach(rKey => {
            strResult = strResult.replace(`{${rKey}}`, replacements[rKey]);
        });
    }
    return strResult;
  }, [language]);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme, language]);

  const resetState = () => {
    setAppState(AppState.INITIAL);
    setPdfFile(null);
    setImprovedResume(null);
    setError(null);
    setLoadingMessage('');
    setConversation([]);
    setIsChatProcessing(false);
    setSelectedTemplate(TemplateIdentifier.MODERN);
    setDesignOptions(defaultDesignOptions);
    setHasOverflow(false);
    setSelectionTooltip({ visible: false });
    setEditingPath(null);
    setZoomLevel(100);
    setIsLiveEditingEnabled(true);
    setSectionOrder(initialSectionOrder);
    setEditorView(EditorView.RESUME);
    setCoverLetter(null);
    setIsGeneratingCoverLetter(false);
    setJobDescription('');
    setIsTailoringEnabled(false);
    // Keep custom templates and language
  };

  const handleFileSelect = (file: File) => {
    setPdfFile(file);
    setAppState(AppState.FILE_SELECTED);
    setError(null);
  };

  const processResume = useCallback(async () => {
    if (!pdfFile) return;

    setAppState(AppState.PROCESSING);
    setError(null);
    
    try {
      setLoadingMessage(t('loadingReading'));
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(pdfFile);
      
      fileReader.onload = async (event) => {
        if (event.target?.result) {
          try {
            const typedarray = new Uint8Array(event.target.result as ArrayBuffer);
            const pdf = await (window as any).pdfjsLib.getDocument(typedarray).promise;
            let originalText = '';
            for (let i = 1; i <= pdf.numPages; i++) {
              const page = await pdf.getPage(i);
              const textContent = await page.getTextContent();
              originalText += textContent.items.map((item: any) => item.str).join(' ');
            }
            
            setLoadingMessage(t('loadingBeautifying'));
            const tailoredJobDescription = isTailoringEnabled ? jobDescription : undefined;
            const improvedData = await improveResumeWithAI(originalText, language, tailoredJobDescription);
            setImprovedResume(improvedData);
            
            let welcomeMessage = t('chatWelcome');
            if (isTailoringEnabled && jobDescription) {
                setLoadingMessage(t('loadingWritingCoverLetter'));
                const aiGeneratedPart = await generateCoverLetterWithAI(improvedData, jobDescription, language);
                const finalCoverLetter: CoverLetterData = {
                    ...aiGeneratedPart,
                    senderName: improvedData.name,
                    senderContactInfo: [
                        improvedData.contact.location || '',
                        improvedData.contact.phone,
                        improvedData.contact.email,
                        improvedData.contact.website,
                    ].filter(Boolean)
                };
                setCoverLetter(finalCoverLetter);
                welcomeMessage = t('chatWelcomeTailored');
            }
            
            setConversation([{ role: 'ai', text: welcomeMessage }]);
            setAppState(AppState.COMPLETE);
          } catch (e: any) {
            console.error('Error during processing:', e);
            let userMessage;
            if (e instanceof NetworkError) {
                userMessage = t('errorNetwork');
            } else if (e instanceof APIError) {
                userMessage = t('errorAPI');
            } else {
                userMessage = t('errorProcessing');
            }
            setError(`${userMessage} ${t('errorTryAgain')}`);
            setAppState(AppState.ERROR);
          }
        }
      };

      fileReader.onerror = () => {
        throw new Error('Failed to read the file.');
      };

    } catch (e: any) {
      console.error('Error processing resume:', e);
      setError(`${t('errorProcessing')} ${t('errorTryDifferentFile')}.`);
      setAppState(AppState.ERROR);
    }
  }, [pdfFile, language, t, isTailoringEnabled, jobDescription]);

  const handleChatMessage = useCallback(async (message: string) => {
    if (!improvedResume) return;

    const newConversation: ConversationMessage[] = [...conversation, { role: 'user', text: message }];
    setConversation(newConversation);
    setIsChatProcessing(true);
    setError(null);

    try {
        if (editorView === EditorView.RESUME) {
            const updatedResume = await editResumeWithAI(improvedResume, message, language);
            setImprovedResume(updatedResume);
            setConversation([...newConversation, { role: 'ai', text: t('chatUpdate') }]);
        } else if (editorView === EditorView.COVER_LETTER && coverLetter) {
            const updatedCoverLetter = await editCoverLetterWithAI(coverLetter, message, language);
            setCoverLetter(updatedCoverLetter);
            setConversation([...newConversation, { role: 'ai', text: t('chatUpdateCoverLetter') }]);
        } else {
             setConversation([...newConversation, { role: 'ai', text: t('chatError') }]);
        }
    } catch (e: any) {
        console.error('Error editing content:', e);
        let errorMessage = t('chatError');
        if (e instanceof NetworkError) {
            errorMessage = t('errorNetwork');
        } else if (e instanceof APIError) {
            errorMessage = t('errorAPI');
        }
        setConversation([...newConversation, { role: 'ai', text: errorMessage }]);
    } finally {
        setIsChatProcessing(false);
    }

  }, [improvedResume, conversation, language, t, editorView, coverLetter]);
  
  const handleResumeUpdate = useCallback((path: string, value: any) => {
    setImprovedResume(prev => {
        if (!prev) return null;
        
        const newResume = JSON.parse(JSON.stringify(prev)); // Deep clone
        const keys = path.split(/[\.\[\]]/).filter(Boolean); // Split by . or []
        
        let current: any = newResume;
        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];
            // If a key doesn't exist, create it. This is for adding new sections.
            if (current[key] === undefined) {
                // Check if the next key is a number, to create an array if needed
                const nextKey = keys[i+1];
                current[key] = /^\d+$/.test(nextKey) ? [] : {};
            }
            current = current[key];
        }
        
        const lastKey = keys[keys.length - 1];
        current[lastKey] = value;

        return newResume;
    });
  }, []);

  const handleCoverLetterUpdate = useCallback((path: string, value: any) => {
    setCoverLetter(prev => {
        if (!prev) return null;
        const newCoverLetter = { ...prev };
        const key = path.split('.')[1] as keyof CoverLetterData;
        if (key) {
            (newCoverLetter[key] as any) = value;
        }
        return newCoverLetter;
    });
  }, []);

  
  const handleOpenModal = useCallback((path: keyof ResumeData, index?: number) => {
     if (!improvedResume) return;
     const list = (improvedResume[path] as any[]) || [];
     const item = index !== undefined ? list[index] : getNewItem(path);
     setModalState({ path, index, item });
  }, [improvedResume]);

  const handleCloseModal = () => {
    setModalState(null);
  };

  const handleSaveItem = useCallback((path: keyof ResumeData, item: any, index?: number) => {
    setImprovedResume(prev => {
      if (!prev) return null;
      const newResume = JSON.parse(JSON.stringify(prev));
      let list = (newResume[path] as any[]) || [];

      if (index !== undefined) {
        // Editing existing item
        list[index] = item;
      } else {
        // Adding new item
        list.push(item);
      }
      newResume[path] = list;
      return newResume;
    });
    handleCloseModal();
  }, []);

  const handleRemoveItem = useCallback((path: keyof ResumeData, index: number) => {
    setImprovedResume(prev => {
      if (!prev) return null;
      const newResume = JSON.parse(JSON.stringify(prev));
      const list = newResume[path] as any[];

      if (Array.isArray(list)) {
        list.splice(index, 1);
      }
      return newResume;
    });
  }, []);
  
  const handleReorderSection = useCallback((sectionId: SectionId, direction: 'up' | 'down') => {
      setSectionOrder(prevOrder => {
          const index = prevOrder.indexOf(sectionId);
          if (index === -1) return prevOrder;

          const newIndex = direction === 'up' ? index - 1 : index + 1;
          if (newIndex < 0 || newIndex >= prevOrder.length) return prevOrder;

          const newOrder = [...prevOrder];
          const [movedItem] = newOrder.splice(index, 1);
          newOrder.splice(newIndex, 0, movedItem);
          return newOrder;
      });
  }, []);

  const handleReorderItem = useCallback((path: keyof ResumeData, oldIndex: number, newIndex: number) => {
      setImprovedResume(prev => {
          if (!prev) return null;
          const newResume = JSON.parse(JSON.stringify(prev));
          const list = newResume[path] as any[];
          if (!Array.isArray(list)) return newResume;
          
          const [movedItem] = list.splice(oldIndex, 1);
          list.splice(newIndex, 0, movedItem);

          return newResume;
      });
  }, []);
  
  const handleAITooltipOpen = (path: string, selectedText: string, element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    setSelectionTooltip({
      visible: true,
      top: rect.top + window.scrollY,
      left: rect.right + window.scrollX + 10,
      selectedText,
      contextPath: path,
    });
  };

  const handleSelectionEdit = useCallback(async (instruction: string) => {
    if (!selectionTooltip.visible || !selectionTooltip.contextPath) return;
    
    setEditingPath(selectionTooltip.contextPath);
    try {
        const newText = await editSelectedTextWithAI(instruction, selectionTooltip.selectedText!, language);
        if (editorView === EditorView.RESUME && improvedResume) {
             handleResumeUpdate(selectionTooltip.contextPath, newText);
        } else if (editorView === EditorView.COVER_LETTER && selectionTooltip.contextPath.startsWith('coverLetter')) {
             handleCoverLetterUpdate(selectionTooltip.contextPath, newText);
        }
    } catch (e: any) {
      console.error("Error editing selected text:", e);
      let errorMessage = t('tooltipError');
      if (e instanceof NetworkError) {
          errorMessage = t('errorNetwork');
      } else if (e instanceof APIError) {
          errorMessage = t('errorAPI');
      }
      alert(errorMessage);
    } finally {
      setSelectionTooltip({ visible: false }); // Hide tooltip after operation
      setEditingPath(null);
    }
  }, [improvedResume, selectionTooltip, language, t, handleResumeUpdate, editorView, coverLetter, handleCoverLetterUpdate]);

  const handleDesignChange = (option: keyof DesignOptions, value: string) => {
    setDesignOptions(prev => ({ ...prev, [option]: value }));
  };

  const handleProfilePictureChange = (file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        setImprovedResume(prev => prev ? ({ ...prev, profilePicture: base64 }) : null);
      };
      reader.readAsDataURL(file);
    } else {
      // Remove picture
      setImprovedResume(prev => {
        if (!prev) return null;
        const { profilePicture, ...rest } = prev;
        return rest;
      });
    }
  };
  
  const handleAnalyzeTemplate = async (file: File) => {
      setIsAnalyzingTemplate(true);
      setError(null);
      try {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async (e) => {
            const imageDataUrl = e.target?.result as string;
            if (!imageDataUrl) {
                throw new Error("Could not read the image file.");
            }
            const newTemplateConfig = await analyzeResumeTemplate(imageDataUrl, file.name);
            setCustomTemplates(prev => [...prev, newTemplateConfig]);
            setSelectedTemplate(newTemplateConfig);
        };
        reader.onerror = () => {
            throw new Error("Failed to read the file for analysis.");
        };
      } catch(e: any) {
          console.error("Template analysis error:", e);
          let errorMessage;
          if (e instanceof ContentError) {
              errorMessage = t('modalErrorSuggestion');
          } else if (e instanceof NetworkError) {
              errorMessage = t('errorNetwork');
          } else if (e instanceof APIError) {
              errorMessage = t('errorAPI');
          } else {
              errorMessage = t('modalError', { message: e.message });
          }
          setError(errorMessage);
      } finally {
          setIsAnalyzingTemplate(false);
      }
  };

  const handleDownload = () => {
    if (!improvedResume) return;

    setIsDownloading(true);
    
    exportToPdf({
        editorView,
        resumeData: improvedResume,
        coverLetterData: coverLetter,
        selectedTemplate,
        designOptions,
        t,
    });

    // The print dialog is blocking, so this will run after it's closed.
    // A timeout helps prevent UI jank.
    setTimeout(() => setIsDownloading(false), 500);
  };

  const handleZoomChange = (newZoom: number) => {
    setZoomLevel(newZoom);
  };

  const handleGenerateCoverLetter = useCallback(async (jobDescription: string) => {
    if (!improvedResume) return;
    setIsGeneratingCoverLetter(true);
    setError(null);
    try {
        const aiGeneratedPart = await generateCoverLetterWithAI(improvedResume, jobDescription, language);
        const finalCoverLetter: CoverLetterData = {
            ...aiGeneratedPart,
            senderName: improvedResume.name,
            senderContactInfo: [
                improvedResume.contact.location || '',
                improvedResume.contact.phone,
                improvedResume.contact.email,
                improvedResume.contact.website,
            ].filter(Boolean)
        };
        setCoverLetter(finalCoverLetter);
    } catch (e: any) {
        console.error("Cover letter generation error:", e);
        let errorMessage;
        if (e instanceof NetworkError) {
            errorMessage = t('errorNetwork');
        } else if (e instanceof APIError) {
            errorMessage = t('errorAPI');
        } else {
            errorMessage = t('coverLetterError', { message: e.message });
        }
        setError(errorMessage);
    } finally {
        setIsGeneratingCoverLetter(false);
    }
  }, [improvedResume, language, t]);

  const renderInitialView = () => (
    <div className="w-full max-w-2xl text-center flex flex-col items-center">
        <Hero t={t} />
        <FileUpload onFileSelect={handleFileSelect} disabled={appState !== AppState.INITIAL} t={t} />
        {appState === AppState.FILE_SELECTED && pdfFile && (
          <div className="mt-8 w-full text-center">
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-6 text-left">
              <div className="flex items-center justify-between">
                <label htmlFor="tailor-toggle" className="font-semibold text-gray-700 dark:text-gray-200 cursor-pointer">
                  {t('tailorResumeToggle')}
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" id="tailor-toggle" checked={isTailoringEnabled} onChange={(e) => setIsTailoringEnabled(e.target.checked)} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-primary/50 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                </label>
              </div>
              <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isTailoringEnabled ? 'max-h-96 mt-4' : 'max-h-0'}`}>
                <label htmlFor="job-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('jobDescriptionLabel')}
                </label>
                <textarea
                  id="job-description"
                  rows={8}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder={t('jobDescriptionPlaceholder')}
                  className="w-full p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary focus:outline-none transition"
                />
              </div>
            </div>
            
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
              {t('readyToTransform')} <span className="font-semibold text-primary">{pdfFile.name}</span>?
            </p>
            <button
              onClick={processResume}
              className="bg-primary hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all transform hover:scale-105 hover:shadow-primary/50"
            >
              {t('beautifyButton')}
            </button>
          </div>
        )}
    </div>
  );

  const renderContent = () => {
    switch (appState) {
      case AppState.INITIAL:
      case AppState.FILE_SELECTED:
        return renderInitialView();
      case AppState.PROCESSING:
        return <LoadingIndicator message={loadingMessage} t={t} />;
      case AppState.COMPLETE:
        return improvedResume ? (
          <ResumeEditor
            resumeData={improvedResume}
            onSendMessage={handleChatMessage}
            conversation={conversation}
            isChatProcessing={isChatProcessing}
            selectedTemplate={selectedTemplate}
            onTemplateChange={setSelectedTemplate}
            designOptions={designOptions}
            onDesignChange={handleDesignChange}
            onResumeUpdate={handleResumeUpdate}
            onOpenModal={handleOpenModal}
            onRemoveItem={handleRemoveItem}
            onReorderItem={handleReorderItem}
            hasOverflow={hasOverflow}
            onOverflowChange={setHasOverflow}
            customTemplates={customTemplates}
            onAnalyzeTemplate={handleAnalyzeTemplate}
            isAnalyzingTemplate={isAnalyzingTemplate}
            analysisError={error}
            t={t}
            language={language}
            selectionTooltip={selectionTooltip}
            onSelectionTooltipChange={setSelectionTooltip}
            onAITooltipOpen={handleAITooltipOpen}
            onSelectionEdit={handleSelectionEdit}
            editingPath={editingPath}
            onProfilePictureChange={handleProfilePictureChange}
            zoomLevel={zoomLevel}
            onZoomChange={handleZoomChange}
            isSidebarOpen={isSidebarOpen}
            isControlPanelOpen={isControlPanelOpen}
            isLiveEditingEnabled={isLiveEditingEnabled}
            onLiveEditingChange={setIsLiveEditingEnabled}
            onActivePathChange={setEditingPath}
            sectionOrder={sectionOrder}
            onReorderSection={handleReorderSection}
            
            // New props for cover letter
            editorView={editorView}
            onEditorViewChange={setEditorView}
            coverLetter={coverLetter}
            onUpdateCoverLetter={handleCoverLetterUpdate}
            onGenerateCoverLetter={handleGenerateCoverLetter}
            isGeneratingCoverLetter={isGeneratingCoverLetter}
            coverLetterError={error}
          />
        ) : (
          <ErrorMessage message="Something went wrong displaying the resume." onRetry={resetState} t={t} />
        );
      case AppState.ERROR:
        return <ErrorMessage message={error || 'An unknown error occurred.'} onRetry={resetState} t={t} />;
    }
  };
  
  const renderModal = () => {
    if (!modalState) return null;

    const commonProps = {
        isOpen: true,
        onClose: handleCloseModal,
        onSave: (item: any) => handleSaveItem(modalState.path, item, modalState.index),
        item: modalState.item,
        t,
    };

    switch (modalState.path) {
        case 'experience':
            return <ExperienceModal {...commonProps} />;
        case 'education':
            return <EducationModal {...commonProps} />;
        case 'profiles':
            return <ProfileModal {...commonProps} />;
        case 'projects':
            return <ProjectModal {...commonProps} />;
        case 'certifications':
            return <CertificationModal {...commonProps} />;
        case 'languages':
            return <LanguageModal {...commonProps} />;
        case 'skills':
             return <SimpleTextModal {...commonProps} title={t('skill')} onSave={(item: any) => handleSaveItem('skills', item, modalState.index)} />;
        case 'interests':
             return <SimpleTextModal {...commonProps} title={t('interest')} onSave={(item: any) => handleSaveItem('interests', item, modalState.index)} />;
        default:
            return null;
    }
  };

  const isEditorView = appState === AppState.COMPLETE && !!improvedResume;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans transition-colors duration-300">
      <Header 
        onReset={resetState} 
        isEditorView={isEditorView} 
        theme={theme} 
        onThemeChange={setTheme}
        onDownload={handleDownload}
        isDownloading={isDownloading}
        language={language}
        onLanguageChange={setLanguage}
        t={t}
        onToggleSidebar={isEditorView ? () => setIsSidebarOpen(o => !o) : undefined}
        onToggleControlPanel={() => setIsControlPanelOpen(o => !o)}
      />
      <main className={`w-full transition-all duration-500 ${isEditorView ? 'pt-16' : 'pt-16 sm:pt-20'}`}>
        { isEditorView ? renderContent() : (
           <div className="w-full flex items-center justify-center px-4">
             {renderContent()}
           </div>
        )}
      </main>
      {renderModal()}
    </div>
  );
};

export default App;