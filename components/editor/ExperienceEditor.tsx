import React from 'react';
import { ResumeData } from '../../types';
import SectionWrapper from './SectionWrapper';
import { Briefcase, Plus, Trash2, Pencil } from '../Icons';

interface ExperienceEditorProps {
    data: ResumeData;
    onOpenModal: (path: 'experience', index?: number) => void;
    onRemoveItem: (path: 'experience', index: number) => void;
    t: (key: string) => string;
}

const ExperienceEditor: React.FC<ExperienceEditorProps> = ({ data, onOpenModal, onRemoveItem, t }) => {
    const experience = data.experience || [];
    return (
        <SectionWrapper id="experience" icon={Briefcase} title={t('sectionExperience')}>
            <div className="space-y-4">
                {experience.map((job, index) => (
                    <div key={index} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-between hover:shadow-md transition-shadow">
                        <div>
                            <p className="font-semibold text-gray-800 dark:text-gray-200">{job.role || `(${t('role')})`}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{job.company || `(${t('company')})`} &bull; {job.period || `(${t('period')})`}</p>
                        </div>
                        <div className="flex items-center gap-2">
                             <button onClick={() => onOpenModal('experience', index)} className="p-2 text-gray-500 hover:text-primary hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-full">
                                <Pencil className="w-4 h-4" />
                            </button>
                            <button onClick={() => onRemoveItem('experience', index)} className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
                <button onClick={() => onOpenModal('experience')} className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:border-solid hover:text-primary">
                    <Plus className="w-5 h-5" />
                    {t('addNewItem')}
                </button>
            </div>
        </SectionWrapper>
    );
};

export default ExperienceEditor;