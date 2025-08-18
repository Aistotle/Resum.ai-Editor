import React from 'react';
import { ResumeData, SectionId, EditorView } from '../types';
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
import CoverLetterSidebar from './editor/CoverLetterSidebar';

interface EditorSidebarProps {
    isOpen: boolean;
    editorView: EditorView;
    resumeData: ResumeData;
    onUpdate: (path: string, value: any) => void;
    onOpenModal: (path: keyof ResumeData, index?: number) => void;
    onRemoveItem: (path: keyof ResumeData, index: number) => void;
    onReorderItem: (path: keyof ResumeData, oldIndex: number, newIndex: number) => void;
    t: (key: string) => string;
    sectionOrder: SectionId[];
    onReorderSection: (sectionId: SectionId, direction: 'up' | 'down') => void;
    onProfilePictureChange: (file: File | null) => void;
}

const EditorSidebar: React.FC<EditorSidebarProps> = (props) => {
    const { isOpen, editorView, resumeData, onUpdate, onOpenModal, onRemoveItem, onReorderItem, t, sectionOrder, onReorderSection, onProfilePictureChange } = props;

    const renderResumeEditors = () => {
        const sectionComponents: Record<SectionId, React.ReactNode> = {
            basics: <BasicsEditor data={resumeData} onUpdate={onUpdate} t={t} onReorderSection={onReorderSection} isFirst={sectionOrder[0] === 'basics'} isLast={sectionOrder[sectionOrder.length-1] === 'basics'} onProfilePictureChange={onProfilePictureChange} />,
            summary: <SummaryEditor data={resumeData} onUpdate={onUpdate} t={t} onReorderSection={onReorderSection} isFirst={sectionOrder[0] === 'summary'} isLast={sectionOrder[sectionOrder.length-1] === 'summary'} />,
            profiles: <ProfilesEditor data={resumeData} onOpenModal={onOpenModal} onRemoveItem={onRemoveItem} onReorderItem={onReorderItem} t={t} onReorderSection={onReorderSection} isFirst={sectionOrder[0] === 'profiles'} isLast={sectionOrder[sectionOrder.length-1] === 'profiles'} />,
            experience: <ExperienceEditor data={resumeData} onOpenModal={onOpenModal} onRemoveItem={onRemoveItem} onReorderItem={onReorderItem} t={t} onReorderSection={onReorderSection} isFirst={sectionOrder[0] === 'experience'} isLast={sectionOrder[sectionOrder.length-1] === 'experience'}/>,
            education: <EducationEditor data={resumeData} onOpenModal={onOpenModal} onRemoveItem={onRemoveItem} onReorderItem={onReorderItem} t={t} onReorderSection={onReorderSection} isFirst={sectionOrder[0] === 'education'} isLast={sectionOrder[sectionOrder.length-1] === 'education'}/>,
            skills: <SkillsEditor data={resumeData} onOpenModal={onOpenModal} onRemoveItem={onRemoveItem} onReorderItem={onReorderItem} t={t} onReorderSection={onReorderSection} isFirst={sectionOrder[0] === 'skills'} isLast={sectionOrder[sectionOrder.length-1] === 'skills'} />,
            projects: <ProjectsEditor data={resumeData} onOpenModal={onOpenModal} onRemoveItem={onRemoveItem} onReorderItem={onReorderItem} t={t} onReorderSection={onReorderSection} isFirst={sectionOrder[0] === 'projects'} isLast={sectionOrder[sectionOrder.length-1] === 'projects'} />,
            certifications: <CertificationsEditor data={resumeData} onOpenModal={onOpenModal} onRemoveItem={onRemoveItem} onReorderItem={onReorderItem} t={t} onReorderSection={onReorderSection} isFirst={sectionOrder[0] === 'certifications'} isLast={sectionOrder[sectionOrder.length-1] === 'certifications'} />,
            languages: <LanguagesEditor data={resumeData} onOpenModal={onOpenModal} onRemoveItem={onRemoveItem} onReorderItem={onReorderItem} t={t} onReorderSection={onReorderSection} isFirst={sectionOrder[0] === 'languages'} isLast={sectionOrder[sectionOrder.length-1] === 'languages'} />,
            interests: <GenericListEditor section="interests" data={resumeData.interests} onOpenModal={onOpenModal} onRemoveItem={onRemoveItem} onReorderItem={onReorderItem} t={t} onReorderSection={onReorderSection} isFirst={sectionOrder[0] === 'interests'} isLast={sectionOrder[sectionOrder.length-1] === 'interests'} />,
        };
        return (
            <div className="p-6 space-y-8">
                {sectionOrder.map(sectionId => (
                    <div key={sectionId}>
                        {sectionComponents[sectionId]}
                    </div>
                ))}
            </div>
        );
    };

    const renderCoverLetterEditor = () => {
        return <CoverLetterSidebar t={t} />;
    };

    return (
        <aside className={`flex-shrink-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out ${isOpen ? 'w-full max-w-md' : 'w-0'}`}>
            <div className={`h-full overflow-y-auto transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
                {editorView === EditorView.RESUME ? renderResumeEditors() : renderCoverLetterEditor()}
            </div>
        </aside>
    );
};

export default EditorSidebar;