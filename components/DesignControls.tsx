import React from 'react';
import { DesignOptions, ResumeData } from '../types';

interface DesignControlsProps {
    resumeData: ResumeData;
    designOptions: DesignOptions;
    onDesignChange: (option: keyof DesignOptions, value: string) => void;
    t: (key: string) => string;
    onProfilePictureChange: (file: File | null) => void;
    isLiveEditingEnabled: boolean;
    onLiveEditingChange: (enabled: boolean) => void;
}

const ControlSection: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">{title}</h4>
        {children}
    </div>
);

const FontOption: React.FC<{ font: string }> = ({ font }) => (
    <option value={font} style={{ fontFamily: font }}>{font}</option>
);


const DesignControls: React.FC<DesignControlsProps> = ({ resumeData, designOptions, onDesignChange, t, onProfilePictureChange, isLiveEditingEnabled, onLiveEditingChange }) => {

    const handlePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onProfilePictureChange(e.target.files[0]);
        }
    };
    
    return (
        <div className="p-4 h-full flex flex-col">
            <header className="pb-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                <h3 className="font-bold text-lg text-neutral dark:text-white">{t('designHeader')}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('designSubtitle')}</p>
            </header>

            <div className="mt-4 flex-grow overflow-y-auto pr-2 -mr-2">
                <ControlSection title={t('liveEditorTitle')}>
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-300 max-w-[200px]">{t('liveEditorBody')}</p>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={isLiveEditingEnabled} onChange={(e) => onLiveEditingChange(e.target.checked)} className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                        </label>
                    </div>
                </ControlSection>

                <ControlSection title={t('profilePicture')}>
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-lg bg-gray-200 dark:bg-gray-700 flex-shrink-0 overflow-hidden">
                           {resumeData.profilePicture && <img src={resumeData.profilePicture} alt="Profile preview" className="w-full h-full object-cover" />}
                        </div>
                        <div className="flex-grow space-y-2">
                            <label htmlFor="picture-upload" className="w-full text-center cursor-pointer bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                                {t('uploadImage')}
                            </label>
                             <input id="picture-upload" type="file" className="hidden" accept="image/png, image/jpeg" onChange={handlePictureUpload} />

                            <button onClick={() => onProfilePictureChange(null)} className="w-full text-center bg-transparent border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                               {t('removeImage')}
                            </button>
                        </div>
                    </div>
                     <div className="mt-4">
                        <h5 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">{t('pictureShape')}</h5>
                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 text-sm cursor-pointer">
                                <input type="radio" name="pic-shape" value="circle" checked={designOptions.profilePictureShape === 'circle'} onChange={(e) => onDesignChange('profilePictureShape', e.target.value)} className="w-4 h-4 accent-primary"/>
                                {t('circle')}
                            </label>
                             <label className="flex items-center gap-2 text-sm cursor-pointer">
                                <input type="radio" name="pic-shape" value="square" checked={designOptions.profilePictureShape === 'square'} onChange={(e) => onDesignChange('profilePictureShape', e.target.value)} className="w-4 h-4 accent-primary"/>
                                {t('square')}
                            </label>
                        </div>
                    </div>
                </ControlSection>

                <ControlSection title={t('accentColor')}>
                    <input
                        type="color"
                        value={designOptions.primaryColor}
                        onChange={(e) => onDesignChange('primaryColor', e.target.value)}
                        className="w-full h-10 p-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer"
                    />
                </ControlSection>
                <ControlSection title={t('typography')}>
                    <div className="space-y-3">
                        <div>
                            <label htmlFor="heading-font" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('headingFont')}</label>
                            <select
                                id="heading-font"
                                value={designOptions.headingFont}
                                onChange={(e) => onDesignChange('headingFont', e.target.value)}
                                className="w-full p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                            >
                                <FontOption font="Montserrat" />
                                <FontOption font="Lato" />
                                <FontOption font="Roboto" />
                                <FontOption font="Open Sans" />
                                <FontOption font="Merriweather" />
                            </select>
                        </div>
                        <div>
                            <label htmlFor="body-font" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('bodyFont')}</label>
                            <select
                                id="body-font"
                                value={designOptions.bodyFont}
                                onChange={(e) => onDesignChange('bodyFont', e.target.value)}
                                className="w-full p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                            >
                                <FontOption font="Lato" />
                                <FontOption font="Roboto" />
                                <FontOption font="Open Sans" />
                                <FontOption font="Merriweather" />
                                <FontOption font="Montserrat" />
                            </select>
                        </div>
                    </div>
                </ControlSection>
            </div>
        </div>
    );
};

export default DesignControls;
