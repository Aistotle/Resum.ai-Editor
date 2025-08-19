import React, { useState, useEffect } from 'react';
import { Experience } from '../../../types';
import Modal from '../../Modal';
import FormInput from '../FormInput';

interface ExperienceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (experience: Experience) => void;
    item: Experience;
    t: (key: string) => string;
}

const ExperienceModal: React.FC<ExperienceModalProps> = ({ isOpen, onClose, onSave, item, t }) => {
    const [currentItem, setCurrentItem] = useState<Experience>(item);

    useEffect(() => {
        setCurrentItem(item);
    }, [item]);

    const handleUpdate = (field: keyof Experience, value: any) => {
        setCurrentItem(prev => ({ ...prev, [field]: value }));
    };

    const handleDescriptionChange = (value: string) => {
        setCurrentItem(prev => ({...prev, description: value.split('\n')}))
    }
    
    const handleSave = () => {
        onSave(currentItem);
    };

    const isNew = !item.role && !item.company;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={isNew ? `${t('add')} ${t('sectionExperience')}` : `${t('editItem')}`}>
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput label={t('role')} path="role" value={currentItem.role} onUpdate={(p, v) => handleUpdate('role', v)} />
                    <FormInput label={t('company')} path="company" value={currentItem.company} onUpdate={(p, v) => handleUpdate('company', v)} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput label={t('period')} path="period" value={currentItem.period} onUpdate={(p, v) => handleUpdate('period', v)} />
                    <FormInput label={t('location')} path="location" value={currentItem.location} onUpdate={(p, v) => handleUpdate('location', v)} />
                </div>
                <FormInput 
                    as="textarea" 
                    label={t('projectDescription')} 
                    path="description" 
                    value={currentItem.description.join('\n')} 
                    onUpdate={(p, v) => handleDescriptionChange(v)} 
                />
                <div className="flex justify-end pt-4">
                    <button
                        onClick={handleSave}
                        className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold py-2 px-6 rounded-md shadow-md transition-transform transform hover:scale-105 hover:shadow-lg"
                    >
                        {t('saveChanges')}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ExperienceModal;