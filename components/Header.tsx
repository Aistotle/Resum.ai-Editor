import React from 'react';
import { Sun, Moon, Download, RefreshCcw, PanelLeft, PanelRight } from './Icons';
import { Language } from '../types';

interface HeaderProps {
    onReset: () => void;
    isEditorView: boolean;
    theme: 'light' | 'dark';
    onThemeChange: (theme: 'light' | 'dark') => void;
    onDownload: () => void;
    isDownloading: boolean;
    language: Language;
    onLanguageChange: (lang: Language) => void;
    t: (key: string) => string;
    onToggleSidebar?: () => void;
    onToggleControlPanel?: () => void;
}

const LanguageButton: React.FC<{
    lang: Language;
    currentLang: Language;
    onClick: (lang: Language) => void;
    children: React.ReactNode;
}> = ({ lang, currentLang, onClick, children }) => (
    <button
        onClick={() => onClick(lang)}
        className={`px-3 py-1 text-sm font-bold rounded-md transition-colors ${
            currentLang === lang ? 'bg-primary text-white' : 'bg-transparent text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
    >
        {children}
    </button>
);


const Header: React.FC<HeaderProps> = ({ onReset, isEditorView, theme, onThemeChange, onDownload, isDownloading, language, onLanguageChange, t, onToggleSidebar, onToggleControlPanel }) => {
    const toggleTheme = () => {
        onThemeChange(theme === 'light' ? 'dark' : 'light');
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50 transition-colors duration-300">
            <div className="w-full max-w-full mx-auto h-full flex items-center justify-between px-4 sm:px-6">
                <div className="flex items-center space-x-3">
                    {isEditorView && onToggleSidebar && (
                         <button
                            onClick={onToggleSidebar}
                            className="w-10 h-10 flex items-center justify-center rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary dark:hover:text-primary transition-all"
                            aria-label="Toggle navigation"
                        >
                            <PanelLeft className="w-5 h-5" />
                        </button>
                    )}
                    <img src="/owl-icon-png.png" alt="Obedai Logo" className="w-8 h-8" />
                    <h1 className="text-xl sm:text-2xl font-bold text-neutral dark:text-white tracking-tight hidden sm:block">
                        Obedai
                    </h1>
                </div>
                
                <div className="flex items-center gap-2 sm:gap-4">
                    {isEditorView && (
                         <>
                            <button
                                onClick={onReset}
                                className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                                <RefreshCcw className="w-4 h-4" />
                                <span className="hidden sm:inline">{t('startOver')}</span>
                            </button>

                            <button
                                onClick={onDownload}
                                disabled={isDownloading}
                                className="flex items-center justify-center gap-2 text-sm font-semibold bg-primary text-white py-2 px-4 rounded-full shadow-md hover:bg-blue-600 transition-all transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 min-w-[150px]"
                                title={t('downloadPDF')}
                            >
                                {isDownloading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span className="hidden sm:inline">{t('downloading')}</span>
                                    </>
                                ) : (
                                    <>
                                        <Download className="w-4 h-4" />
                                        <span className="hidden sm:inline">{t('downloadPDF')}</span>
                                    </>
                                )}
                            </button>
                         </>
                    )}
                     <div className="flex items-center bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                        <LanguageButton lang="da" currentLang={language} onClick={onLanguageChange}>DA</LanguageButton>
                        <LanguageButton lang="en" currentLang={language} onClick={onLanguageChange}>EN</LanguageButton>
                    </div>
                    <button
                        onClick={toggleTheme}
                        className="w-10 h-10 flex items-center justify-center rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary dark:hover:text-primary transition-all"
                        aria-label="Toggle theme"
                    >
                        {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                    </button>
                     {isEditorView && onToggleControlPanel && (
                         <button
                            onClick={onToggleControlPanel}
                            className="w-10 h-10 flex items-center justify-center rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary dark:hover:text-primary transition-all"
                            aria-label="Toggle controls"
                        >
                            <PanelRight className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;