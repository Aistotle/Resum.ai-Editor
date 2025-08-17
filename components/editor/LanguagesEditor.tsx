import React from 'react';
import { ResumeData } from '../../types';
import SectionWrapper from './SectionWrapper';
import { Languages, Plus, Trash2, Pencil } from '../Icons';

interface LanguagesEditorProps {
    data: ResumeData;
    onOpenModal: (path: 'languages', index?: number) => void;
    onRemoveItem: (path: 'languages', index: number) => void;
    t: (key: string) => string;
}

const LanguagesEditor: React.FC<LanguagesEditorProps> = ({ data, onOpenModal, onRemoveItem, t }) => {
    const languages = data.languages || [];
    return (
        <SectionWrapper id="languages" icon={Languages} title={t('sectionLanguages')}>
            <div className="space-y-4">
                {languages.map((lang, index) => (
                     <div key={index} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-between hover:shadow-md transition-shadow">
                        <div>
                            <p className="font-semibold text-gray-800 dark:text-gray-200">{lang.name || `(${t('languageName')})`}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{lang.level || `(${t('level')})`}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => onOpenModal('languages', index)} className="p-2 text-gray-500 hover:text-primary hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-full">
                                <Pencil className="w-4 h-4" />
                            </button>
                            <button onClick={() => onRemoveItem('languages', index)} className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
                <button onClick={() => onOpenModal('languages')} className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:border-solid hover:text-primary">
                    <Plus className="w-5 h-5" />
                    {t('addNewItem')}
                </button>
            </div>
        </SectionWrapper>
    );
};

export default LanguagesEditor;