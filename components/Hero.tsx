import React from 'react';

interface HeroProps {
    t: (key: string) => string;
}

const Hero: React.FC<HeroProps> = ({ t }) => {
    return (
        <div className="mb-10 text-center">
            <h2 className="text-4xl sm:text-5xl font-bold text-primary dark:text-primary tracking-tighter leading-tight">
                {t('heroTitle1')}
                <br />
                <span className="animated-text-gradient">
                    {t('heroTitle2')}
                </span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
                {t('heroSubtitle')}
            </p>
        </div>
    );
};

export default Hero;