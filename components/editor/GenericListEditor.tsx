import React, { useState } from 'react';
import { ResumeData, SectionId } from '../../types';
import SectionWrapper from './SectionWrapper';
import { Gamepad2, Plus, Trash2, Pencil } from '../Icons';

type SectionKey = keyof ResumeData & ('interests');

interface GenericListEditorProps {
    section: SectionKey;
    data: string[] | undefined;
    onOpenModal: (path: SectionKey, index?: number) => void;
    onRemoveItem: (path: SectionKey, index: number) => void;
    onReorderItem: (path: SectionKey, oldIndex: number, newIndex: number) => void;
    t: (key: string) => string;
    onReorderSection: (sectionId: SectionId, direction: 'up' | 'down') => void;
    isFirst: boolean;
    isLast: boolean;
}

const sectionConfig = {
    interests: { icon: Gamepad2, titleKey: 'sectionInterests', itemKey: 'interest' },
};

const GenericListEditor: React.FC<GenericListEditorProps> = (props) => {
    const { section, data, onOpenModal, onRemoveItem, onReorderItem, t, onReorderSection, isFirst, isLast } = props;
    const items = data || [];
    const config = sectionConfig[section];

    const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        setDraggingIndex(index);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        e.preventDefault();
        if (draggingIndex === null) return;
        onReorderItem(section, draggingIndex, index);
        setDraggingIndex(null);
    };

    const handleDragEnd = () => {
        setDraggingIndex(null);
    };

    return (
        <SectionWrapper 
            id={section} 
            icon={config.icon} 
            title={t(config.titleKey)}
            onReorderSection={onReorderSection}
            isFirst={isFirst}
            isLast={isLast}
        >
            <div className="space-y-4">
                 <div className="flex flex-wrap gap-2">
                    {items.map((item, index) => (
                        <div 
                            key={index} 
                            draggable
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, index)}
                            onDragEnd={handleDragEnd}
                            className={`group relative bg-blue-50 dark:bg-blue-900/30 text-primary font-medium px-3 py-1 rounded-full flex items-center gap-2 cursor-move transition-opacity
                                ${draggingIndex === index ? 'opacity-50' : ''}
                            `}
                        >
                           <span>{item || `(${t(config.itemKey)})`}</span>
                           <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                <button onClick={() => onOpenModal(section, index)} className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-full cursor-pointer">
                                    <Pencil className="w-3 h-3"/>
                                </button>
                                <button onClick={() => onRemoveItem(section, index)} className="p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full cursor-pointer">
                                    <Trash2 className="w-3 h-3" />
                                </button>
                           </div>
                        </div>
                    ))}
                </div>
                <button onClick={() => onOpenModal(section)} className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:border-solid hover:text-primary">
                    <Plus className="w-5 h-5" />
                    {t('addNewItem')}
                </button>
            </div>
        </SectionWrapper>
    );
};

export default GenericListEditor;