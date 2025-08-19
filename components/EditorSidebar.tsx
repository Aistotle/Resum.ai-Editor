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
    layout: { sidebar: SectionId[], main: SectionId[] };
    onUpdate: (path: string, value: any) => void;
    onOpenModal: (path: keyof ResumeData, index?: number) => void;
    onRemoveItem: (path: keyof ResumeData, index: number) => void;
    onReorderItem: (path: keyof ResumeData, oldIndex: number, newIndex: number) => void;
    t: (key: string) => string;
    onProfilePictureChange: (file: File | null) => void;
}

const EditorSidebar: React.FC<EditorSidebarProps> = (props) => {
    const { isOpen, editorView, resumeData, layout, onUpdate, onOpenModal, onRemoveItem, onReorderItem, t, onProfilePictureChange } = props;
    const allSections = ['basics', ...layout.sidebar, ...layout.main];

    const renderResumeEditors = () => {
        const sectionComponents: Record<SectionId, React.ReactNode> = {
            basics: <BasicsEditor data={resumeData} onUpdate={onUpdate} t={t} onProfilePictureChange={onProfilePictureChange} />,
            summary: <SummaryEditor data={resumeData} onUpdate={onUpdate} t={t} />,
            profiles: <ProfilesEditor data={resumeData} onOpenModal={onOpenModal} onRemoveItem={onRemoveItem} onReorderItem={onReorderItem} t={t} />,
            experience: <ExperienceEditor data={resumeData} onOpenModal={onOpenModal} onRemoveItem={onRemoveItem} onReorderItem={onReorderItem} t={t} />,
            education: <EducationEditor data={resumeData} onOpenModal={onOpenModal} onRemoveItem={onRemoveItem} onReorderItem={onReorderItem} t={t} />,
            skills: <SkillsEditor data={resumeData} onOpenModal={onOpenModal} onRemoveItem={onRemoveItem} onReorderItem={onReorderItem} t={t}  />,
            projects: <ProjectsEditor data={resumeData} onOpenModal={onOpenModal} onRemoveItem={onRemoveItem} onReorderItem={onReorderItem} t={t} />,
            certifications: <CertificationsEditor data={resumeData} onOpenModal={onOpenModal} onRemoveItem={onRemoveItem} onReorderItem={onReorderItem} t={t} />,
            languages: <LanguagesEditor data={resumeData} onOpenModal={onOpenModal} onRemoveItem={onRemoveItem} onReorderItem={onReorderItem} t={t} />,
            interests: <GenericListEditor section="interests" data={resumeData.interests} onOpenModal={onOpenModal} onRemoveItem={onRemoveItem} onReorderItem={onReorderItem} t={t} />,
        };
        return (
            <>
                {allSections.map(sectionId => (
                    <div key={sectionId}>
                        {sectionComponents[sectionId]}
                    </div>
                ))}
            </>
        );
    };

    const renderCoverLetterEditor = () => {
        return <CoverLetterSidebar t={t} />;
    };

    return (
        <aside className={`flex-shrink-0 bg-foreground border-r border-border transition-all duration-300 ease-in-out ${isOpen ? 'w-full max-w-md' : 'w-0'}`}>
            <div className={`h-full overflow-y-auto transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
                <div className="p-6 space-y-8">
                    {editorView === EditorView.RESUME ? renderResumeEditors() : renderCoverLetterEditor()}
                </div>
            </div>
        </aside>
    );
};

export default EditorSidebar;