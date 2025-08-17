import { ResumeData } from "../types";

export const getNewItem = (path: keyof ResumeData) => {
    switch(path) {
        case 'experience':
            return { role: '', company: '', period: '', location: '', description: [''] };
        case 'education':
            return { degree: '', institution: '', period: '', location: '' };
        case 'profiles':
            return { network: '', username: '', url: '' };
        case 'skills':
            return '';
        case 'projects':
            return { name: '', description: '' };
        case 'certifications':
            return { name: '', issuer: '', date: '' };
        case 'languages':
            return { name: '', level: '' };
        case 'interests':
            return '';
        default:
            return {};
    }
};
