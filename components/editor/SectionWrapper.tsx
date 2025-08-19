import React from 'react';
import { SectionId } from '../../types';

interface SectionWrapperProps {
    id: SectionId;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    title: string;
    children: React.ReactNode;
}

const SectionWrapper: React.FC<SectionWrapperProps> = ({ id, icon: Icon, title, children }) => {
    return (
        <section data-section-id={id} className="scroll-mt-20">
            <div className="flex items-center gap-3 mb-4">
                <Icon className="w-5 h-5 text-muted-foreground" />
                <h2 className="text-xl font-semibold text-secondary-foreground">{title}</h2>
            </div>
            <div className="space-y-4">
                {children}
            </div>
        </section>
    );
};

export default SectionWrapper;