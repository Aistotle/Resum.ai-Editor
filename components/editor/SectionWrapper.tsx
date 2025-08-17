import React from 'react';
import { Menu, MoreHorizontal } from '../Icons';

interface SectionWrapperProps {
    id: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    title: string;
    children: React.ReactNode;
}

const SectionWrapper: React.FC<SectionWrapperProps> = ({ id, icon: Icon, title, children }) => {
    return (
        <section id={id} data-section-id={id} className="scroll-mt-20">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                    <Icon className="w-6 h-6 text-gray-500" />
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">{title}</h2>
                </div>
                <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
                        <Menu className="w-5 h-5"/>
                    </button>
                </div>
            </div>
            <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-lg p-6">
                {children}
            </div>
        </section>
    );
};

export default SectionWrapper;
