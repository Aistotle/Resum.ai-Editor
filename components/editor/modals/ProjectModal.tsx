import React, { useState, useEffect } from 'react';
import { Project } from '../../../types';
import Modal from '../../Modal';
import FormInput from '../FormInput';

interface ProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (project: Project) => void;
    item: Project;
    t: (key: string) => string;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ isOpen, onClose, onSave, item, t }) => {
    const [currentItem, setCurrentItem] = useState<Project>(item);

    useEffect(() => {
        setCurrentItem(item);
    }, [item]);

    const handleUpdate = (field: keyof Project, value: any) => {
        setCurrentItem(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        onSave(currentItem);
    };

    const isNew = !item.name;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={isNew ? `${t('add')} ${t('sectionProjects')}` : `${t('editItem')}`}>
            <div className="space-y-4">
                <FormInput label={t('projectName')} path="name" value={currentItem.name} onUpdate={(p, v) => handleUpdate('name', v)} />
                <FormInput as="textarea" label={t('projectDescription')} path="description" value={currentItem.description} onUpdate={(p, v) => handleUpdate('description', v)} />
                <div className="flex justify-end pt-4">
                    <button
                        onClick={handleSave}
                        className="bg-primary text-primary-foreground font-semibold hover:bg-primary/90 py-2 px-6 rounded-md shadow-sm transition-colors"
                    >
                        {t('saveChanges')}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ProjectModal;