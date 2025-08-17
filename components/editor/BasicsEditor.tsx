import React from 'react';
import { ResumeData } from '../../types';
import SectionWrapper from './SectionWrapper';
import FormInput from './FormInput';
import { User } from '../Icons';

interface BasicsEditorProps {
    data: ResumeData;
    onUpdate: (path: string, value: string) => void;
    t: (key: string) => string;
}

const BasicsEditor: React.FC<BasicsEditorProps> = ({ data, onUpdate, t }) => {
    return (
        <SectionWrapper id="basics" icon={User} title={t('sectionBasics')}>
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-1">
                         <FormInput label={t('picture')} path="profilePicture" value={data.profilePicture || ''} onUpdate={onUpdate} placeholder="https://..." />
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
