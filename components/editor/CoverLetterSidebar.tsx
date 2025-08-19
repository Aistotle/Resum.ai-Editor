import React, { useState, useEffect, useCallback } from 'react';
import { Bold, Italic, Underline, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, Type } from '../Icons';
import SelectControl from './SelectControl';

interface CoverLetterSidebarProps {
    t: (key: string) => string;
}

const fonts = ['serif', 'sans-serif', 'monospace', 'cursive', 'fantasy', 'Georgia', 'Times New Roman', 'Arial', 'Verdana'];
const fontSizes: { [key: string]: string } = {
    '1': '8pt',
    '2': '10pt',
    '3': '12pt',
    '4': '14pt',
    '5': '18pt',
    '6': '24pt',
    '7': '36pt',
};
const blockFormats: { [key: string]: string } = {
    'p': 'Paragraph',
    'h1': 'Heading 1',
    'h2': 'Heading 2',
};

const rgbToHex = (rgb: string) => {
    if (!rgb || !rgb.startsWith('rgb')) return '#000000';
    const match = rgb.match(/(\d+),\s*(\d+),\s*(\d+)/);
    if (!match) return '#000000';
    const [, r, g, b] = match.map(Number);
    const hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
    return hex.length < 7 ? `${hex}0` : hex; // Basic padding if needed
};

const ToolbarButton: React.FC<{ onClick: () => void, children: React.ReactNode, 'aria-label': string, isActive?: boolean }> = ({ onClick, children, 'aria-label': ariaLabel, isActive }) => (
    <button
      type="button"
      onClick={onClick}
      onMouseDown={e => e.preventDefault()}
      className={`p-2.5 rounded-md transition-colors ${isActive ? 'bg-blue-100 dark:bg-blue-800 text-primary' : 'hover:bg-secondary text-secondary-foreground'}`}
      aria-label={ariaLabel}
      aria-pressed={isActive}
    >
      {children}
    </button>
);


const CoverLetterSidebar: React.FC<CoverLetterSidebarProps> = ({ t }) => {
    const [formats, setFormats] = useState({
        bold: false, italic: false, underline: false,
        ol: false, ul: false,
        justifyLeft: true, justifyCenter: false, justifyRight: false,
        fontName: 'serif',
        fontSize: '3',
        formatBlock: 'p',
        foreColor: '#000000',
    });

    const updateToolbarState = useCallback(() => {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;

        let node = selection.anchorNode;
         if (node && node.nodeType !== Node.ELEMENT_NODE) {
            node = node.parentNode;
        }
        if (!node) return;

        const newFormats = {
            bold: false, italic: false, underline: false,
            ol: false, ul: false,
            justifyLeft: document.queryCommandState('justifyLeft'),
            justifyCenter: document.queryCommandState('justifyCenter'),
            justifyRight: document.queryCommandState('justifyRight'),
            fontName: document.queryCommandValue('fontName').replace(/['"]/g, '') || 'serif',
            fontSize: document.queryCommandValue('fontSize') || '3',
            formatBlock: document.queryCommandValue('formatBlock') || 'p',
            foreColor: rgbToHex(document.queryCommandValue('foreColor')),
        };

        let currentNode: Node | null = node;
        while (currentNode && currentNode.nodeName !== 'BODY') {
            const isEditorRoot = currentNode.nodeType === Node.ELEMENT_NODE && (currentNode as HTMLElement).id === 'cover-letter-body-editor';
            if (isEditorRoot) break;

            const nodeName = currentNode.nodeName.toUpperCase();
            if (nodeName === 'B' || nodeName === 'STRONG') newFormats.bold = true;
            if (nodeName === 'I' || nodeName === 'EM') newFormats.italic = true;
            if (nodeName === 'U') newFormats.underline = true;
            if (nodeName === 'OL') newFormats.ol = true;
            if (nodeName === 'UL') newFormats.ul = true;
            currentNode = currentNode.parentNode;
        }

        setFormats(newFormats);
    }, []);

    useEffect(() => {
        const editor = document.getElementById('cover-letter-body-editor');
        if (editor) {
            const listener = () => updateToolbarState();
            document.addEventListener('selectionchange', listener);
            editor.addEventListener('focus', listener);
            editor.addEventListener('keyup', listener);
            editor.addEventListener('mouseup', listener);
            
            updateToolbarState();

            return () => {
                document.removeEventListener('selectionchange', listener);
                editor.removeEventListener('focus', listener);
                editor.removeEventListener('keyup', listener);
                editor.removeEventListener('mouseup', listener);
            };
        }
    }, [updateToolbarState]);
    
    const handleFormat = (command: string, value?: string) => {
        document.execCommand(command, false, value);
        updateToolbarState();
    };

    const ControlSection: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
        <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground">{title}</h3>
            {children}
        </div>
    );

    return (
        <div className="p-6 space-y-8">
            <h2 className="text-xl font-bold text-secondary-foreground">{t('textFormatting')}</h2>
            <div className="space-y-6">
                <ControlSection title={t('fontStyle')}>
                    <div className="space-y-2">
                         <SelectControl value={formats.fontName} onChange={(e) => handleFormat('fontName', e.target.value)} icon={Type}>
                            {fonts.map(font => <option key={font} value={font} style={{fontFamily: font}}>{font}</option>)}
                        </SelectControl>
                        <div className="flex items-center gap-2">
                            <SelectControl value={formats.fontSize} onChange={(e) => handleFormat('fontSize', e.target.value)}>
                                {Object.entries(fontSizes).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                            </SelectControl>
                            <input
                                type="color"
                                value={formats.foreColor}
                                onChange={(e) => handleFormat('foreColor', e.target.value)}
                                onMouseDown={e => e.preventDefault()}
                                className="w-10 h-10 p-1 bg-foreground border border-border rounded-md cursor-pointer"
                                aria-label="Text color"
                            />
                        </div>
                    </div>
                </ControlSection>

                <ControlSection title={t('paragraph')}>
                    <SelectControl value={formats.formatBlock} onChange={(e) => handleFormat('formatBlock', e.target.value)}>
                        {Object.entries(blockFormats).map(([value, label]) => <option key={value} value={value}>{t(label)}</option>)}
                    </SelectControl>
                    <div className="grid grid-cols-3 gap-1 p-1 bg-secondary rounded-lg">
                        <ToolbarButton onClick={() => handleFormat('bold')} aria-label="Bold" isActive={formats.bold}><Bold className="w-5 h-5 mx-auto" /></ToolbarButton>
                        <ToolbarButton onClick={() => handleFormat('italic')} aria-label="Italic" isActive={formats.italic}><Italic className="w-5 h-5 mx-auto" /></ToolbarButton>
                        <ToolbarButton onClick={() => handleFormat('underline')} aria-label="Underline" isActive={formats.underline}><Underline className="w-5 h-5 mx-auto" /></ToolbarButton>
                    </div>
                </ControlSection>

                <ControlSection title={t('alignment')}>
                    <div className="grid grid-cols-3 gap-1 p-1 bg-secondary rounded-lg">
                        <ToolbarButton onClick={() => handleFormat('justifyLeft')} aria-label="Align Left" isActive={formats.justifyLeft}><AlignLeft className="w-5 h-5 mx-auto" /></ToolbarButton>
                        <ToolbarButton onClick={() => handleFormat('justifyCenter')} aria-label="Align Center" isActive={formats.justifyCenter}><AlignCenter className="w-5 h-5 mx-auto" /></ToolbarButton>
                        <ToolbarButton onClick={() => handleFormat('justifyRight')} aria-label="Align Right" isActive={formats.justifyRight}><AlignRight className="w-5 h-5 mx-auto" /></ToolbarButton>
                    </div>
                </ControlSection>
                
                 <ControlSection title={t('lists')}>
                    <div className="grid grid-cols-2 gap-1 p-1 bg-secondary rounded-lg">
                        <ToolbarButton onClick={() => handleFormat('insertUnorderedList')} aria-label="Bulleted List" isActive={formats.ul}><List className="w-5 h-5 mx-auto" /></ToolbarButton>
                        <ToolbarButton onClick={() => handleFormat('insertOrderedList')} aria-label="Numbered List" isActive={formats.ol}><ListOrdered className="w-5 h-5 mx-auto" /></ToolbarButton>
                    </div>
                </ControlSection>
            </div>
        </div>
    );
};

export default CoverLetterSidebar;