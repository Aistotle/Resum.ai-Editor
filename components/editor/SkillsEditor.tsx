import React from 'react';
import { ResumeData } from '../../types';
import SectionWrapper from './SectionWrapper';
import { Star, Plus, Trash2, Pencil } from '../Icons';

interface SkillsEditorProps {
    data: ResumeData;
    onOpenModal: (path: 'skills', index?: number) => void;
    onRemoveItem: (path: 'skills', index: number) => void;
    t: (key: string) => string;
}

const SkillsEditor: React.FC<SkillsEditorProps> = ({ data, onOpenModal, onRemoveItem, t }) => {
    const skills = data.skills || [];
    return (
        <SectionWrapper id="skills" icon={Star} title={t('sectionSkills')}>
            <div className="space-y-4">
                 <div className="flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                        <div key={index} className="group relative bg-blue-50 dark:bg-blue-900/30 text-primary font-medium px-3 py-1 rounded-full flex items-center gap-2">
                           <span>{skill || `(${t('skill')})`}</span>
                           <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                <button onClick={() => onOpenModal('skills', index)} className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-full">
                                    <Pencil className="w-3 h-3"/>
                                </button>
                                <button onClick={() => onRemoveItem('skills', index)} className="p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full">
                                    <Trash2 className="w-3 h-3" />
                                </button>
                           </div>
                        </div>
                    ))}
                </div>
                <button onClick={() => onOpenModal('skills')} className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:border-solid hover:text-primary">
                    <Plus className="w-5 h-5" />
                    {t('addNewItem')}
                </button>
            </div>
        </SectionWrapper>
    );
};

export default SkillsEditor;