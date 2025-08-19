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
        <h4 className="text-sm font-semibold text-muted-foreground mb-3">{title}</h4>
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
            <header className="pb-4 border-b border-border flex-shrink-0">
                <h3 className="font-bold text-lg text-secondary-foreground">{t('designHeader')}</h3>
                <p className="text-sm text-muted-foreground">{t('designSubtitle')}</p>
            </header>

            <div className="mt-4 flex-grow overflow-y-auto pr-2 -mr-2">
                <ControlSection title={t('liveEditorTitle')}>
                    <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                        <p className="text-sm text-secondary-foreground max-w-[200px]">{t('liveEditorBody')}</p>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={isLiveEditingEnabled} onChange={(e) => onLiveEditingChange(e.target.checked)} className="sr-only peer" />
                            <div className="w-11 h-6 bg-background peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                    </div>
                </ControlSection>

                <ControlSection title={t('profilePicture')}>
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-lg bg-secondary flex-shrink-0 overflow-hidden">
                           {resumeData.profilePicture && <img src={resumeData.profilePicture} alt="Profile preview" className="w-full h-full object-cover" />}
                        </div>
                        <div className="flex-grow space-y-2">
                            <label htmlFor="picture-upload" className="w-full text-center cursor-pointer bg-foreground border border-border rounded-md px-3 py-2 text-sm font-semibold text-secondary-foreground hover:bg-secondary">
                                {t('uploadImage')}
                            </label>
                             <input id="picture-upload" type="file" className="hidden" accept="image/png, image/jpeg" onChange={handlePictureUpload} />

                            <button onClick={() => onProfilePictureChange(null)} className="w-full text-center bg-transparent border border-border rounded-md px-3 py-2 text-sm font-semibold text-secondary-foreground hover:bg-secondary">
                               {t('removeImage')}
                            </button>
                        </div>
                    </div>
                     <div className="mt-4">
                        <h5 className="text-xs font-semibold text-muted-foreground mb-2">{t('pictureShape')}</h5>
                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 text-sm cursor-pointer">
                                <input type="radio" name="pic-shape" value="circle" checked={designOptions.profilePictureShape === 'circle'} onChange={(e) => onDesignChange('profilePictureShape', e.target.value)} className="w-4 h-4 text-primary bg-secondary border-border focus:ring-ring"/>
                                {t('circle')}
                            </label>
                             <label className="flex items-center gap-2 text-sm cursor-pointer">
                                <input type="radio" name="pic-shape" value="square" checked={designOptions.profilePictureShape === 'square'} onChange={(e) => onDesignChange('profilePictureShape', e.target.value)} className="w-4 h-4 text-primary bg-secondary border-border focus:ring-ring"/>
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
                        className="w-full h-10 p-1 bg-foreground border border-border rounded-lg cursor-pointer"
                    />
                </ControlSection>
                <ControlSection title={t('typography')}>
                    <div className="space-y-3">
                        <div>
                            <label htmlFor="heading-font" className="block text-sm font-medium text-muted-foreground mb-1">{t('headingFont')}</label>
                            <select
                                id="heading-font"
                                value={designOptions.headingFont}
                                onChange={(e) => onDesignChange('headingFont', e.target.value)}
                                className="w-full p-2 bg-foreground border border-border rounded-lg focus:ring-2 focus:ring-ring focus:outline-none"
                            >
                                <FontOption font="Inter" />
                            </select>
                        </div>
                        <div>
                            <label htmlFor="body-font" className="block text-sm font-medium text-muted-foreground mb-1">{t('bodyFont')}</label>
                            <select
                                id="body-font"
                                value={designOptions.bodyFont}
                                onChange={(e) => onDesignChange('bodyFont', e.target.value)}
                                className="w-full p-2 bg-foreground border border-border rounded-lg focus:ring-2 focus:ring-ring focus:outline-none"
                            >
                                <FontOption font="Inter" />
                            </select>
                        </div>
                    </div>
                </ControlSection>
            </div>
        </div>
    );
};

export default DesignControls;