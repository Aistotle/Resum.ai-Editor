import React, { useState, useCallback, useEffect } from 'react';
import { AppState, ResumeData, ConversationMessage, TemplateIdentifier, DesignOptions, TemplateConfig, Language, SelectionTooltipState, ModalState } from './types';
import { improveResumeWithAI, editResumeWithAI, analyzeResumeTemplate, editSelectedTextWithAI } from './services/geminiService';
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
    // Keep custom templates and language
  };

  const handleFileSelect = (file: File) => {
    setPdfFile(file);
    setAppState(AppState.FILE_SELECTED);
    setError(null);
  };

  const processResume = useCallback(async () => {
    if (!pdfFile) return;

    try {
      setAppState(AppState.PROCESSING);
      
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
            const improvedData = await improveResumeWithAI(originalText, language);
            setImprovedResume(improvedData);
            setConversation([{ role: 'ai', text: t('chatWelcome') }]);
            setAppState(AppState.COMPLETE);
          } catch (e: any) {
            console.error('Error during processing:', e);
            setError(`${t('errorProcessing')}: ${e.message}. ${t('errorTryAgain')}.`);
            setAppState(AppState.ERROR);
          }
        }
      };

      fileReader.onerror = () => {
        throw new Error('Failed to read the file.');
      };

    } catch (e: any)
    {
      console.error('Error processing resume:', e);
      setError(`${t('errorProcessing')}: ${e.message}. ${t('errorTryDifferentFile')}.`);
      setAppState(AppState.ERROR);
    }
  }, [pdfFile, language, t]);

  const handleChatMessage = useCallback(async (message: string) => {
    if (!improvedResume) return;

    const newConversation: ConversationMessage[] = [...conversation, { role: 'user', text: message }];
    setConversation(newConversation);
    setIsChatProcessing(true);

    try {
        const updatedResume = await editResumeWithAI(improvedResume, message, language);
        setImprovedResume(updatedResume);
        setConversation([...newConversation, { role: 'ai', text: t('chatUpdate') }]);
    } catch (e: any) {
        console.error('Error editing resume:', e);
        setConversation([...newConversation, { role: 'ai', text: t('chatError') }]);
    } finally {
        setIsChatProcessing(false);
    }

  }, [improvedResume, conversation, language, t]);
  
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

  const handleSelectionEdit = useCallback(async (instruction: string) => {
    if (!improvedResume || !selectionTooltip.visible || !selectionTooltip.contextPath) return;

    setEditingPath(selectionTooltip.contextPath);
    try {
      const newText = await editSelectedTextWithAI(
        instruction,
        selectionTooltip.selectedText!,
        language
      );
      handleResumeUpdate(selectionTooltip.contextPath, newText);
    } catch (e: any) {
      console.error("Error editing selected text:", e);
      alert(t('tooltipError'));
    } finally {
      setSelectionTooltip({ visible: false }); // Hide tooltip after operation
      setEditingPath(null);
    }
  }, [improvedResume, selectionTooltip, language, t, handleResumeUpdate]);

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
          setError(t('modalError', { message: e.message }));
          console.error("Template analysis error:", e);
      } finally {
          setIsAnalyzingTemplate(false);
      }
  };

  const handleDownload = () => {
    setIsDownloading(true);
  };

  const handleZoomChange = (newZoom: number) => {
    setZoomLevel(newZoom);
  };

  const renderInitialView = () => (
    <div className="w-full max-w-2xl text-center flex flex-col items-center">
        <Hero t={t} />
        <FileUpload onFileSelect={handleFileSelect} disabled={appState !== AppState.INITIAL} t={t} />
        {appState === AppState.FILE_SELECTED && pdfFile && (
          <div className="mt-8 text-center">
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
            isDownloading={isDownloading}
            onDownloadComplete={() => setIsDownloading(false)}
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
        onToggleSidebar={() => setIsSidebarOpen(o => !o)}
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