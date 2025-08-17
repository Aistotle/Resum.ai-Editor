import React from 'react';

interface HeroProps {
    t: (key: string) => string;
}

const Hero: React.FC<HeroProps> = ({ t }) => {
    return (
        <div className="mb-8">
            <h2 className="text-4xl sm:text-6xl font-extrabold text-neutral dark:text-white tracking-tight leading-tight font-montserrat">
                {t('heroTitle1')}
                <br />
                <span className="bg-gradient-to-r from-blue-500 to-teal-400 text-transparent bg-clip-text">
                    {t('heroTitle2')}
                </span>
            </h2>
            <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                {t('heroSubtitle')}
            </p>
        </div>
    );
};

export default Hero;