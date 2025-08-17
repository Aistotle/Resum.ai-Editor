import React, { useState, useEffect, useRef, forwardRef } from 'react';
import { SparklesIcon } from './Icons';

interface SelectionTooltipProps {
    top: number;
    left: number;
    onClose: () => void;
    onSubmit: (instruction: string) => void;
    t: (key: string) => string;
}

const SelectionTooltip = forwardRef<HTMLDivElement, SelectionTooltipProps>(({ top, left, onClose, onSubmit, t }, ref) => {
    const [instruction, setInstruction] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Auto-focus the input when the tooltip appears
        inputRef.current?.focus();
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (instruction.trim()) {
            onSubmit(instruction);
        }
    };

    return (
        <div
            ref={ref}
            className="fixed z-50 transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 p-2 flex items-center gap-2"
            style={{ top: `${top}px`, left: `${left}px` }}
            onClick={(e) => e.stopPropagation()} // Prevent clicks inside from closing it
        >
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <SparklesIcon className="w-5 h-5 text-primary flex-shrink-0" />
                <input
                    ref={inputRef}
                    type="text"
                    value={instruction}
                    onChange={(e) => setInstruction(e.target.value)}
                    placeholder={t('tooltipPlaceholder')}
                    className="bg-transparent text-sm text-neutral dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none w-64"
                />
                <button
                    type="submit"
                    disabled={!instruction.trim()}
                    className="text-sm font-semibold bg-primary text-white py-1 px-3 rounded-md hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {t('tooltipSubmit')}
                </button>
            </form>
        </div>
    );
});

export default SelectionTooltip;