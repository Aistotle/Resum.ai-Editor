import React, { useCallback } from 'react';

interface FormInputProps {
    label: string;
    path: string;
    value: string;
    onUpdate: (path: string, value: string) => void;
    placeholder?: string;
    as?: 'input' | 'textarea';
}

const FormInput: React.FC<FormInputProps> = ({ label, path, value, onUpdate, placeholder, as = 'input' }) => {
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        onUpdate(path, e.target.value);
    }, [path, onUpdate]);

    const commonProps = {
        id: path,
        value: value || '',
        onChange: handleChange,
        placeholder: placeholder || `Enter ${label.toLowerCase()}...`,
        className: "w-full p-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary focus:outline-none transition"
    };

    return (
        <div>
            <label htmlFor={path} className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                {label}
            </label>
            {as === 'textarea' ? (
                <textarea {...commonProps} rows={3} />
            ) : (
                <input type="text" {...commonProps} />
            )}
        </div>
    );
};

export default FormInput;
