import React, { useState, useEffect } from 'react';
import Modal from '../../Modal';
import FormInput from '../FormInput';

interface SimpleTextModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (value: string) => void;
    item: string;
    title: string;
    t: (key: string) => string;
}

const SimpleTextModal: React.FC<SimpleTextModalProps> = ({ isOpen, onClose, onSave, item, title, t }) => {
    const [value, setValue] = useState<string>(item);

    useEffect(() => {
        setValue(item);
    }, [item]);
    
    const handleSave = () => {
        onSave(value);
    };

    const isNew = item === '';

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={isNew ? `${t('add')} ${title}` : `${t('editItem')}`}>
            <div className="space-y-4">
                <FormInput label={title} path="item" value={value} onUpdate={(p, v) => setValue(v)} />
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

export default SimpleTextModal;
