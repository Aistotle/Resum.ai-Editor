import React, { useState, useEffect } from 'react';
import { Profile } from '../../../types';
import Modal from '../../Modal';
import FormInput from '../FormInput';

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (profile: Profile) => void;
    item: Profile;
    t: (key: string) => string;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, onSave, item, t }) => {
    const [currentItem, setCurrentItem] = useState<Profile>(item);

    useEffect(() => {
        setCurrentItem(item);
    }, [item]);

    const handleUpdate = (field: keyof Profile, value: any) => {
        setCurrentItem(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        onSave(currentItem);
    };

    const isNew = !item.network;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={isNew ? `${t('add')} ${t('sectionProfiles')}` : `${t('editItem')}`}>
            <div className="space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput label={t('network')} path="network" value={currentItem.network} onUpdate={(p, v) => handleUpdate('network', v)} />
                    <FormInput label={t('username')} path="username" value={currentItem.username} onUpdate={(p, v) => handleUpdate('username', v)} />
                </div>
                <FormInput label={t('url')} path="url" value={currentItem.url} onUpdate={(p, v) => handleUpdate('url', v)} />
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

export default ProfileModal;