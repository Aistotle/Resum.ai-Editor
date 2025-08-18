import React from 'react';
import { flushSync } from 'react-dom';
import { createRoot } from 'react-dom/client';
import PrintableDocument from '../components/PrintableDocument';
import { EditorView, ResumeData, CoverLetterData, TemplateIdentifier, TemplateConfig, DesignOptions } from '../types';

interface PrintProps {
    editorView: EditorView;
    resumeData: ResumeData;
    coverLetterData: CoverLetterData | null;
    selectedTemplate: TemplateIdentifier | TemplateConfig;
    designOptions: DesignOptions;
    t: (key: string) => string;
}

export const exportToPdf = (printProps: PrintProps): void => {
    // 1. Create a hidden iframe
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';
    iframe.title = 'Print Content';

    document.body.appendChild(iframe);

    try {
        const printDoc = iframe.contentDocument;
        if (!printDoc || !iframe.contentWindow) {
            throw new Error("Could not access iframe document.");
        }
        
        // 2. Copy essential styles and scripts from main document
        const headNodes = document.head.querySelectorAll('link, style, script');
        headNodes.forEach(node => {
            if ( (node.nodeName === 'LINK' && (node as HTMLLinkElement).href.includes('fonts.googleapis.com')) || 
                 (node.nodeName === 'SCRIPT' && (node as HTMLScriptElement).src.includes('tailwindcss')) ||
                 (node.nodeName === 'SCRIPT' && node.textContent?.includes('tailwind.config'))
            ) {
                 printDoc.head.appendChild(node.cloneNode(true));
            }
        });
        
        // 3. Inject print-specific CSS
        const printStyles = printDoc.createElement('style');
        printStyles.textContent = `
            @page {
                size: A4;
                margin: 0; 
            }
            html, body {
                background-color: #fff !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                width: 210mm;
                height: 297mm;
                margin: 0;
                padding: 0;
            }
            .resume-page {
                break-after: page;
                margin: 0 !important;
                box-shadow: none !important;
                border: none !important;
                width: 100% !important;
                height: 100% !important;
                max-width: none !important;
                min-height: 0 !important;
            }
        `;
        printDoc.head.appendChild(printStyles);

        // 4. Create a mount point and render the document synchronously
        const mountPoint = printDoc.createElement('div');
        printDoc.body.appendChild(mountPoint);
        const root = createRoot(mountPoint);
        
        flushSync(() => {
            root.render(React.createElement(PrintableDocument, printProps));
        });

        // 5. Trigger print dialog
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
        
    } catch(e) {
      console.error("PDF generation failed:", e);
      alert("Sorry, there was an error preparing the document for printing. Please check the console for details and try again.");
    } finally {
        // 6. Cleanup after a delay. The print dialog is blocking. 
        // Removing the iframe too quickly can cause issues with the browser's print preview.
        setTimeout(() => {
            if (document.body.contains(iframe)) {
                document.body.removeChild(iframe);
            }
        }, 500);
    }
};