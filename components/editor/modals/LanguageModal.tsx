import React, { useState, useEffect } from 'react';
import { LanguageSkill } from '../../../types';
import Modal from '../../Modal';
import FormInput from '../FormInput';

interface LanguageModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (language: LanguageSkill) => void;
    item: LanguageSkill;
    t: (key: string) => string;
}

const LanguageModal: React.FC<LanguageModalProps> = ({ isOpen, onClose, onSave, item, t }) => {
    const [currentItem, setCurrentItem] = useState<LanguageSkill>(item);

    useEffect(() => {
        setCurrentItem(item);
    }, [item]);

    const handleUpdate = (field: keyof LanguageSkill, value: any) => {
        setCurrentItem(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        onSave(currentItem);
    };

    const isNew = !item.name;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={isNew ? `${t('add')} ${t('sectionLanguages')}` : `${t('editItem')}`}>
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput label={t('languageName')} path="name" value={currentItem.name} onUpdate={(p, v) => handleUpdate('name', v)} />
                    <FormInput label={t('level')} path="level" value={currentItem.level} onUpdate={(p, v) => handleUpdate('level', v)} />
                </div>
                <div className="flex justify-end pt-4">
                    <button
                        onClick={handleSave}
                        className="bg-primary hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                    >
                        {t('saveChanges')}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default LanguageModal;
