import React from 'react';

// Common base for the preview SVGs
const PreviewContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <svg viewBox="0 0 80 100" className="w-full h-auto rounded-md bg-white dark:bg-gray-700 shadow-inner">
        {children}
    </svg>
);

export const ModernPreview = () => (
    <PreviewContainer>
        <rect x="10" y="10" width="60" height="12" fill="currentColor" opacity="0.1" />
        <rect x="10" y="27" width="22" height="63" fill="currentColor" opacity="0.1" />
        <rect x="37" y="27" width="33" height="8" fill="currentColor" opacity="0.2" />
        <rect x="37" y="40" width="33" height="50" fill="currentColor" opacity="0.15" />
    </PreviewContainer>
);

export const ClassicPreview = () => (
    <PreviewContainer>
        <rect x="25" y="15" width="30" height="10" fill="currentColor" opacity="0.2" />
        <rect x="10" y="30" width="60" height="2" fill="currentColor" opacity="0.1" />
        <rect x="10" y="37" width="60" height="15" fill="currentColor" opacity="0.15" />
        <rect x="10" y="57" width="60" height="2" fill="currentColor" opacity="0.1" />
        <rect x="10" y="64" width="60" height="15" fill="currentColor" opacity="0.15" />
        <rect x="10" y="84" width="60" height="2" fill="currentColor" opacity="0.1" />
    </PreviewContainer>
);

export const BlueHeroPreview = () => (
    <PreviewContainer>
        <rect x="0" y="0" width="80" height="100" fill="currentColor" opacity="0.3" />
        <rect x="0" y="85" width="80" height="15" fill="white" opacity="1" />
         <rect x="10" y="90" width="60" height="2" fill="currentColor" opacity="0.1" />
    </PreviewContainer>
);

export const ModernSplitPreview = () => (
    <PreviewContainer>
        <rect x="10" y="10" width="45" height="12" fill="currentColor" opacity="0.1" />
        <rect x="58" y="10" width="12" height="12" rx="6" fill="currentColor" opacity="0.2" />
        <rect x="10" y="27" width="45" height="63" fill="currentColor" opacity="0.15" />
        <rect x="58" y="27" width="12" height="30" fill="currentColor" opacity="0.1" />
        <rect x="5" y="5" width="15" height="5" fill="currentColor" opacity="0.3" rx="2" />
    </PreviewContainer>
);

export const DynamicPreview = () => (
    <PreviewContainer>
        <path d="M20 20 L60 20 L60 80 L20 80 Z" stroke="currentColor" strokeWidth="2" strokeDasharray="4" fill="none" opacity="0.5"/>
        <text x="40" y="55" textAnchor="middle" fontSize="10" fill="currentColor" opacity="0.7">AI</text>
    </PreviewContainer>
);