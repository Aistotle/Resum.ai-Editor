import React from 'react';
import { ResumeData, SectionId } from '../../types';
import SectionWrapper from './SectionWrapper';
import FormInput from './FormInput';
import { User } from '../Icons';

interface BasicsEditorProps {
    data: ResumeData;
    onUpdate: (path: string, value: string) => void;
    t: (key: string) => string;
    onReorderSection: (sectionId: SectionId, direction: 'up' | 'down') => void;
    isFirst: boolean;
    isLast: boolean;
    onProfilePictureChange: (file: File | null) => void;
}

const BasicsEditor: React.FC<BasicsEditorProps> = ({ data, onUpdate, t, onReorderSection, isFirst, isLast, onProfilePictureChange }) => {
    
    const handlePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onProfilePictureChange(e.target.files[0]);
        }
    };
    
    return (
        <SectionWrapper 
            id="basics" 
            icon={User} 
            title={t('sectionBasics')}
            onReorderSection={onReorderSection}
            isFirst={isFirst}
            isLast={isLast}
        >
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-1">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                            {t('picture')}
                        </label>
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-lg bg-gray-200 dark:bg-gray-700 flex-shrink-0 overflow-hidden">
                               {data.profilePicture && <img src={data.profilePicture} alt="Profile preview" className="w-full h-full object-cover" />}
                            </div>
                        </div>
                         <div className="flex-grow space-y-2 mt-2">
                            <label htmlFor="sidebar-picture-upload" className="w-full text-center cursor-pointer bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                                {t('uploadImage')}
                            </label>
                             <input id="sidebar-picture-upload" type="file" className="hidden" accept="image/png, image/jpeg" onChange={handlePictureUpload} />

                            <button onClick={() => onProfilePictureChange(null)} className="w-full text-center bg-transparent border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                               {t('removeImage')}
                            </button>
                        </div>
                    </div>
                     <div className="md:col-span-2">
                         <FormInput label={t('fullName')} path="name" value={data.name} onUpdate={onUpdate} />
                    </div>
                </div>
                 <FormInput label={t('headline')} path="title" value={data.title} onUpdate={onUpdate} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <FormInput label={t('email')} path="contact.email" value={data.contact.email} onUpdate={onUpdate} />
                     <FormInput label={t('website')} path="contact.website" value={data.contact.website} onUpdate={onUpdate} />
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <FormInput label={t('phone')} path="contact.phone" value={data.contact.phone} onUpdate={onUpdate} />
                     <FormInput label={t('location')} path="contact.location" value={data.contact.location || ''} onUpdate={onUpdate} />
                </div>
            </div>
        </SectionWrapper>
    );
};

export default BasicsEditor;