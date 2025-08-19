import React, { useState, useEffect } from 'react';
import { Education } from '../../../types';
import Modal from '../../Modal';
import FormInput from '../FormInput';

interface EducationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (education: Education) => void;
    item: Education;
    t: (key: string) => string;
}

const EducationModal: React.FC<EducationModalProps> = ({ isOpen, onClose, onSave, item, t }) => {
    const [currentItem, setCurrentItem] = useState<Education>(item);

    useEffect(() => {
        setCurrentItem(item);
    }, [item]);

    const handleUpdate = (field: keyof Education, value: any) => {
        setCurrentItem(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        onSave(currentItem);
    };

    const isNew = !item.degree && !item.institution;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={isNew ? `${t('add')} ${t('sectionEducation')}` : `${t('editItem')}`}>
            <div className="space-y-4">
                <FormInput label={t('degree')} path="degree" value={currentItem.degree} onUpdate={(p, v) => handleUpdate('degree', v)} />
                <FormInput label={t('institution')} path="institution" value={currentItem.institution} onUpdate={(p, v) => handleUpdate('institution', v)} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput label={t('period')} path="period" value={currentItem.period} onUpdate={(p, v) => handleUpdate('period', v)} />
                    <FormInput label={t('location')} path="location" value={currentItem.location} onUpdate={(p, v) => handleUpdate('location', v)} />
                </div>
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

export default EducationModal;