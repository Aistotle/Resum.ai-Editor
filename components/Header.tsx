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
        className={`px-3 py-1 text-xs font-semibold rounded-sm transition-colors ${
            currentLang === lang ? 'bg-background dark:bg-background text-primary dark:text-primary-foreground shadow-sm' : 'bg-transparent text-muted-foreground hover:text-primary dark:hover:text-primary'
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
        <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-foreground backdrop-blur-lg border-b border-border transition-colors duration-300">
            <div className="w-full max-w-full mx-auto h-full flex items-center justify-between px-4 sm:px-6">
                <div className="flex items-center space-x-3">
                    {isEditorView && onToggleSidebar && (
                         <button
                            onClick={onToggleSidebar}
                            className="w-9 h-9 flex items-center justify-center rounded-md text-muted-foreground hover:bg-secondary transition-colors"
                            aria-label="Toggle navigation"
                        >
                            <PanelLeft className="w-5 h-5" />
                        </button>
                    )}
                    <svg 
                        className="w-8 h-8 text-primary dark:text-primary" 
                        viewBox="0 0 100 100" 
                        fill="currentColor" 
                        xmlns="http://www.w3.org/2000/svg"
                        aria-label="Obedai Logo"
                    >
                        <path d="M50 10C27.9086 10 10 27.9086 10 50C10 72.0914 27.9086 90 50 90C72.0914 90 90 72.0914 90 50C90 27.9086 72.0914 10 50 10ZM50 75C36.1929 75 25 63.8071 25 50C25 36.1929 36.1929 25 50 25C63.8071 25 75 36.1929 75 50C75 63.8071 63.8071 75 50 75Z" />
                    </svg>
                    <h1 className="text-xl sm:text-2xl font-bold text-primary dark:text-primary tracking-tight hidden sm:block">
                        Obedai
                    </h1>
                </div>
                
                <div className="flex items-center gap-2 sm:gap-2">
                    {isEditorView && (
                         <>
                            <button
                                onClick={onReset}
                                className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary dark:hover:text-primary transition-colors p-2 rounded-md hover:bg-secondary"
                            >
                                <RefreshCcw className="w-4 h-4" />
                                <span className="hidden sm:inline">{t('startOver')}</span>
                            </button>

                            <button
                                onClick={onDownload}
                                disabled={isDownloading}
                                className="flex items-center justify-center gap-2 text-sm font-semibold bg-primary text-primary-foreground py-2 px-4 rounded-md shadow-sm hover:bg-primary/90 transition-colors disabled:cursor-not-allowed disabled:opacity-50 min-w-[150px]"
                                title={t('downloadPDF')}
                            >
                                {isDownloading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
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
                     <div className="flex items-center bg-secondary p-1 rounded-md">
                        <LanguageButton lang="da" currentLang={language} onClick={onLanguageChange}>DA</LanguageButton>
                        <LanguageButton lang="en" currentLang={language} onClick={onLanguageChange}>EN</LanguageButton>
                    </div>
                    <button
                        onClick={toggleTheme}
                        className="w-9 h-9 flex items-center justify-center rounded-md text-muted-foreground hover:bg-secondary transition-colors"
                        aria-label="Toggle theme"
                    >
                        {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                    </button>
                     {isEditorView && onToggleControlPanel && (
                         <button
                            onClick={onToggleControlPanel}
                            className="w-9 h-9 flex items-center justify-center rounded-md text-muted-foreground hover:bg-secondary transition-colors"
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