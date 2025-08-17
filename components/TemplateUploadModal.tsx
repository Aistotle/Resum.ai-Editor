import React, { useState, useCallback } from 'react';
import { Logo, AlertTriangle } from './Icons';

interface TemplateUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onFileSelect: (file: File) => void;
    isAnalyzing: boolean;
    error: string | null;
    t: (key: string) => string;
}

const TemplateUploadModal: React.FC<TemplateUploadModalProps> = ({ isOpen, onClose, onFileSelect, isAnalyzing, error, t }) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onFileSelect(e.target.files[0]);
        }
    };

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.type.startsWith('image/')) {
                onFileSelect(file);
            } else {
                alert("Please upload an image file (PNG, JPG).");
            }
        }
    }, [onFileSelect]);
    
    const handleDragEvents = (e: React.DragEvent<HTMLDivElement>, enter: boolean) => {
        e.preventDefault();
        e.stopPropagation();
        if(!isAnalyzing) setIsDragging(enter);
    };

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div 
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg transform transition-all"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-neutral dark:text-white">{t('modalHeader')}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('modalSubtitle')}</p>
                </div>
                
                <div className="p-6">
                    {isAnalyzing ? (
                        <div className="flex flex-col items-center justify-center text-center p-8 h-64">
                            <Logo className="w-12 h-12 text-primary animate-pulse"/>
                            <p className="mt-4 text-lg font-semibold text-neutral dark:text-gray-200">{t('modalAnalyzingTitle')}</p>
                            <p className="mt-1 text-gray-500 dark:text-gray-400">{t('modalAnalyzingBody')}</p>
                        </div>
                    ) : (
                        <div
                            onDrop={handleDrop}
                            onDragOver={(e) => handleDragEvents(e, true)}
                            onDragEnter={(e) => handleDragEvents(e, true)}
                            onDragLeave={(e) => handleDragEvents(e, false)}
                            className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl cursor-pointer transition-all ${isDragging ? 'border-primary bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600'}`}
                        >
                            <div className="text-center p-4">
                                <svg className={`w-12 h-12 mx-auto mb-4 transition-colors ${isDragging ? 'text-primary' : 'text-gray-400 dark:text-gray-500'}`} aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                                <p className="mb-2 text-md text-gray-500 dark:text-gray-400">
                                    <span className="font-semibold text-primary">{t('modalUploadCTA')}</span> {t('fileUploadDrag')}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{t('modalUploadHint')}</p>
                            </div>
                            <input 
                                id="template-upload" 
                                type="file" 
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={handleFileChange}
                                accept="image/png, image/jpeg"
                            />
                        </div>
                    )}

                    {error && (
                         <div className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-300 p-3 rounded-lg flex items-center gap-3">
                            <AlertTriangle className="w-5 h-5 flex-shrink-0"/>
                            <p className="text-sm">{error.includes('Try a clearer image') ? t('modalErrorSuggestion') : error}</p>
                         </div>
                    )}
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 text-right">
                    <button
                        onClick={onClose}
                        className="bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200 font-bold py-2 px-4 rounded-lg transition-colors"
                    >
                        {t('cancel')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TemplateUploadModal;