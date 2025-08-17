import React from 'react';
import { ResumeData } from '../types';
import BasicsEditor from './editor/BasicsEditor';
import SummaryEditor from './editor/SummaryEditor';
import ExperienceEditor from './editor/ExperienceEditor';
import EducationEditor from './editor/EducationEditor';
import SkillsEditor from './editor/SkillsEditor';
import ProfilesEditor from './editor/ProfilesEditor';
import ProjectsEditor from './editor/ProjectsEditor';
import CertificationsEditor from './editor/CertificationsEditor';
import LanguagesEditor from './editor/LanguagesEditor';
import GenericListEditor from './editor/GenericListEditor';

interface EditorSidebarProps {
    isOpen: boolean;
    resumeData: ResumeData;
    onUpdate: (path: string, value: any) => void;
    onOpenModal: (path: keyof ResumeData, index?: number) => void;
    onRemoveItem: (path: keyof ResumeData, index: number) => void;
    t: (key: string) => string;
}

const EditorSidebar: React.FC<EditorSidebarProps> = (props) => {
    const { isOpen, resumeData, onUpdate, onOpenModal, onRemoveItem, t } = props;

    return (
        <aside className={`flex-shrink-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out ${isOpen ? 'w-full max-w-md' : 'w-0'}`}>
            <div className={`h-full overflow-y-auto transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
                 <div className="p-6 space-y-8">
                    <BasicsEditor data={resumeData} onUpdate={onUpdate} t={t} />
                    <SummaryEditor data={resumeData} onUpdate={onUpdate} t={t} />
                    <ProfilesEditor data={resumeData} onOpenModal={onOpenModal} onRemoveItem={onRemoveItem} t={t}/>
                    <ExperienceEditor data={resumeData} onOpenModal={onOpenModal} onRemoveItem={onRemoveItem} t={t}/>
                    <EducationEditor data={resumeData} onOpenModal={onOpenModal} onRemoveItem={onRemoveItem} t={t}/>
                    <SkillsEditor data={resumeData} onOpenModal={onOpenModal} onRemoveItem={onRemoveItem} t={t}/>
                    <ProjectsEditor data={resumeData} onOpenModal={onOpenModal} onRemoveItem={onRemoveItem} t={t} />
                    <CertificationsEditor data={resumeData} onOpenModal={onOpenModal} onRemoveItem={onRemoveItem} t={t} />
                    <LanguagesEditor data={resumeData} onOpenModal={onOpenModal} onRemoveItem={onRemoveItem} t={t} />
                    <GenericListEditor section="interests" data={resumeData.interests} onOpenModal={onOpenModal} onRemoveItem={onRemoveItem} t={t} />
                 </div>
            </div>
        </aside>
    );
};

export default EditorSidebar;