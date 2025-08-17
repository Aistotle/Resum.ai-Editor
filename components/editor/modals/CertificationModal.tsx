import React, { useState, useEffect } from 'react';
import { Certification } from '../../../types';
import Modal from '../../Modal';
import FormInput from '../FormInput';

interface CertificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (certification: Certification) => void;
    item: Certification;
    t: (key: string) => string;
}

const CertificationModal: React.FC<CertificationModalProps> = ({ isOpen, onClose, onSave, item, t }) => {
    const [currentItem, setCurrentItem] = useState<Certification>(item);

    useEffect(() => {
        setCurrentItem(item);
    }, [item]);

    const handleUpdate = (field: keyof Certification, value: any) => {
        setCurrentItem(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        onSave(currentItem);
    };

    const isNew = !item.name;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={isNew ? `${t('add')} ${t('sectionCertifications')}` : `${t('editItem')}`}>
            <div className="space-y-4">
                <FormInput label={t('certificationName')} path="name" value={currentItem.name} onUpdate={(p, v) => handleUpdate('name', v)} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput label={t('issuer')} path="issuer" value={currentItem.issuer} onUpdate={(p, v) => handleUpdate('issuer', v)} />
                    <FormInput label={t('date')} path="date" value={currentItem.date} onUpdate={(p, v) => handleUpdate('date', v)} />
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

export default CertificationModal;
