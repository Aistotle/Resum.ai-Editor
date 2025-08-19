import React from 'react';
import { DesignOptions, ResumeData } from '../types';
import SelectControl from './editor/SelectControl';

interface DesignControlsProps {
    resumeData: ResumeData;
    designOptions: DesignOptions;
    onDesignChange: (option: keyof DesignOptions, value: any) => void;
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

const SliderControl: React.FC<{
    label: string;
    value: number;
    min: number;
    max: number;
    step: number;
    onChange: (value: number) => void;
}> = ({ label, value, min, max, step, onChange }) => {
    return (
        <div>
            <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-secondary-foreground">{label}</label>
                <span className="text-sm font-mono text-muted-foreground bg-secondary px-2 py-0.5 rounded-md">{value.toFixed(label === 'Line Height' ? 1 : 0)}</span>
            </div>
             <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(parseFloat(e.target.value))}
                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
            />
        </div>
    );
};

const ToggleControl: React.FC<{
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}> = ({ label, checked, onChange }) => {
    return (
        <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
            <label className="text-sm font-medium text-secondary-foreground">{label}</label>
            <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only peer" />
                <div className="w-11 h-6 bg-background peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
        </div>
    );
};

const fonts = [
    { name: 'Arial', family: 'Arial, sans-serif' },
    { name: 'Cambria', family: 'Cambria, serif' },
    { name: 'Garamond', family: '"EB Garamond", serif' },
    { name: 'IBM Plex Sans', family: '"IBM Plex Sans", sans-serif' },
    { name: 'IBM Plex Serif', family: '"IBM Plex Serif", serif' },
    { name: 'Lato', family: 'Lato, sans-serif' },
    { name: 'Lora', family: 'Lora, serif' },
    { name: 'Merriweather', family: 'Merriweather, serif' },
    { name: 'Open Sans', family: '"Open Sans", sans-serif' },
    { name: 'Playfair Display', family: '"Playfair Display", serif' },
    { name: 'PT Sans', family: '"PT Sans", sans-serif' },
    { name: 'PT Serif', family: '"PT Serif", serif' },
    { name: 'Roboto Condensed', family: '"Roboto Condensed", sans-serif' },
    { name: 'Times New Roman', family: '"Times New Roman", serif' },
];


const DesignControls: React.FC<DesignControlsProps> = ({ resumeData, designOptions, onDesignChange, t, onProfilePictureChange, isLiveEditingEnabled, onLiveEditingChange }) => {

    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handlePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onProfilePictureChange(e.target.files[0]);
        }
    };

    const handleFontChange = (fontFamily: string) => {
        onDesignChange('bodyFont', fontFamily);
        onDesignChange('headingFont', fontFamily); // Sync heading and body for simplicity
    };
    
    return (
        <div className="p-4 h-full flex flex-col">
            <header className="pb-4 border-b border-border flex-shrink-0">
                <h3 className="font-bold text-lg text-secondary-foreground">{t('designHeader')}</h3>
                <p className="text-sm text-muted-foreground">{t('designSubtitle')}</p>
            </header>

            <div className="mt-4 flex-grow overflow-y-auto pr-2 -mr-2 space-y-6">
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
                            <button
                                type="button"
                                onClick={handleUploadClick}
                                className="w-full text-center cursor-pointer bg-background border border-border rounded-md px-3 py-2 text-sm font-semibold text-secondary-foreground hover:bg-secondary"
                            >
                                {t('uploadImage')}
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                className="hidden"
                                accept="image/png, image/jpeg"
                                onChange={handlePictureUpload}
                            />
                            <button onClick={() => onProfilePictureChange(null)} className="w-full text-center bg-background border border-border rounded-md px-3 py-2 text-sm font-semibold text-secondary-foreground hover:bg-secondary">
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

                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 flex items-center justify-center rounded-md">
                            <span className="font-serif text-2xl font-bold text-muted-foreground">T</span>
                        </div>
                        <h3 className="font-bold text-lg text-secondary-foreground">{t('typography')}</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-4">
                        {fonts.map(font => (
                            <button key={font.name} onClick={() => handleFontChange(font.family)}
                                className={`p-3 border rounded-md text-center text-sm transition-colors ${designOptions.bodyFont === font.family ? 'border-primary bg-primary/5 text-primary font-semibold ring-2 ring-primary' : 'bg-secondary border-border hover:border-muted-foreground/50'}`}
                                style={{ fontFamily: font.family }}
                            >
                                {font.name}
                            </button>
                        ))}
                    </div>

                    <div className="space-y-3 mb-6">
                        <SelectControl label="Font Family" value={designOptions.bodyFont} onChange={(e) => handleFontChange(e.target.value)}>
                            {fonts.map(font => <option key={font.name} value={font.family} style={{ fontFamily: font.family }}>{font.name}</option>)}
                        </SelectControl>
                        <div className="grid grid-cols-2 gap-3">
                            <SelectControl label="Font Subset" value="latin" onChange={() => {}}>
                                <option value="latin">latin</option>
                            </SelectControl>
                            <SelectControl label="Font Variants" value="regular" onChange={() => {}}>
                                <option value="regular">regular, italic, 600</option>
                            </SelectControl>
                        </div>
                    </div>

                    <div className="space-y-4 mb-6">
                         <SliderControl label="Font Size" value={designOptions.fontSize} min={10} max={18} step={1} onChange={(v) => onDesignChange('fontSize', v)} />
                         <SliderControl label="Line Height" value={designOptions.lineHeight} min={1.2} max={2.0} step={0.1} onChange={(v) => onDesignChange('lineHeight', v)} />
                    </div>

                    <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-muted-foreground">Options</h4>
                        <ToggleControl label="Hide Icons" checked={designOptions.hideIcons} onChange={(c) => onDesignChange('hideIcons', c)} />
                        <ToggleControl label="Underline Links" checked={designOptions.underlineLinks} onChange={(c) => onDesignChange('underlineLinks', c)} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DesignControls;