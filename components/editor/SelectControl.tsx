import React from 'react';

interface SelectControlProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    children: React.ReactNode;
    icon?: React.FC<React.SVGProps<SVGSVGElement>>;
    label?: string;
    id?: string;
}

const SelectControl: React.FC<SelectControlProps> = ({ value, onChange, children, icon: Icon, label, id }) => (
    <div>
        {label && <label htmlFor={id} className="block text-sm font-medium text-muted-foreground mb-1">{label}</label>}
        <div className="relative flex items-center w-full">
            {Icon && <Icon className="w-4 h-4 absolute left-3 text-muted-foreground pointer-events-none" />}
            <select
                id={id}
                value={value}
                onChange={onChange}
                onMouseDown={e => e.preventDefault()}
                className={`w-full appearance-none p-2 pr-8 border border-border rounded-md bg-foreground focus:ring-2 focus:ring-ring focus:outline-none text-sm ${Icon ? 'pl-9' : 'pl-3'}`}
            >
                {children}
            </select>
            <svg className="w-4 h-4 absolute right-3 text-muted-foreground pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        </div>
    </div>
);

export default SelectControl;
