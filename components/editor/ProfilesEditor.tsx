import React, { useState } from 'react';
import { ResumeData, SectionId } from '../../types';
import SectionWrapper from './SectionWrapper';
import { Share, Plus, Trash2, Pencil, Menu } from '../Icons';

interface ProfilesEditorProps {
    data: ResumeData;
    onOpenModal: (path: 'profiles', index?: number) => void;
    onRemoveItem: (path: 'profiles', index: number) => void;
    onReorderItem: (path: 'profiles', oldIndex: number, newIndex: number) => void;
    t: (key: string) => string;
    onReorderSection: (sectionId: SectionId, direction: 'up' | 'down') => void;
    isFirst: boolean;
    isLast: boolean;
}

const ProfilesEditor: React.FC<ProfilesEditorProps> = (props) => {
    const { data, onOpenModal, onRemoveItem, onReorderItem, t, onReorderSection, isFirst, isLast } = props;
    const profiles = data.profiles || [];
    
    const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        setDraggingIndex(index);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        e.preventDefault();
        if (draggingIndex === null || draggingIndex === index) return;
        setDragOverIndex(index);
    };

    const handleDragLeave = () => {
        setDragOverIndex(null);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        e.preventDefault();
        if (draggingIndex === null) return;
        onReorderItem('profiles', draggingIndex, index);
        setDraggingIndex(null);
        setDragOverIndex(null);
    };

    const handleDragEnd = () => {
        setDraggingIndex(null);
        setDragOverIndex(null);
    };

    return (
        <SectionWrapper 
            id="profiles" 
            icon={Share} 
            title={t('sectionProfiles')}
            onReorderSection={onReorderSection}
            isFirst={isFirst}
            isLast={isLast}
        >
            <div className="space-y-4">
                {profiles.map((profile, index) => (
                    <div 
                        key={index}
                        draggable
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, index)}
                        onDragEnd={handleDragEnd}
                        className={`p-3 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-between transition-all duration-200
                            ${draggingIndex === index ? 'opacity-50 scale-105 shadow-2xl' : 'hover:shadow-md'}
                            ${dragOverIndex === index ? 'border-primary border-dashed bg-blue-50 dark:bg-blue-900/20' : ''}
                        `}
                    >
                        <div className="flex items-center gap-2">
                             <button 
                                className="cursor-move p-1 text-gray-400 hover:text-gray-700"
                                aria-label={t('dragHandle')}
                            >
                                <Menu className="w-5 h-5" />
                            </button>
                            <div>
                                <p className="font-semibold text-gray-800 dark:text-gray-200">{profile.network || `(${t('network')})`}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{profile.username || `(${t('username')})`}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                             <button onClick={() => onOpenModal('profiles', index)} className="p-2 text-gray-500 hover:text-primary hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-full">
                                <Pencil className="w-4 h-4" />
                            </button>
                            <button onClick={() => onRemoveItem('profiles', index)} className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
                <button onClick={() => onOpenModal('profiles')} className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:border-solid hover:text-primary">
                    <Plus className="w-5 h-5" />
                    {t('addNewItem')}
                </button>
            </div>
        </SectionWrapper>
    );
};

export default ProfilesEditor;