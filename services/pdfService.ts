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

export const exportToPdf = (printProps: PrintProps, onComplete: () => void): void => {
    // 1. Open a new window immediately to retain the user-initiated action context.
    const printWindow = window.open('', '_blank', 'width=816,height=1056');
    if (!printWindow) {
        alert("Could not open print window. Please disable your pop-up blocker for this site.");
        onComplete();
        return;
    }

    const printDoc = printWindow.document;
    printDoc.write('<!DOCTYPE html><html><head><title>Preparing Document...</title></head><body></body></html>');
    
    // 2. Clone all stylesheets from the main document to the new window.
    document.head.querySelectorAll('style, link[rel="stylesheet"]').forEach(node => {
        printDoc.head.appendChild(node.cloneNode(true));
    });

    // 3. Inject print-specific CSS.
    const printStyles = printDoc.createElement('style');
    printStyles.textContent = `
        @page { size: A4; margin: 0; }
        body { margin: 0; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        .resume-page {
            page-break-after: always;
            margin: 0 auto !important;
            box-shadow: none !important;
            border: none !important;
            overflow: hidden;
        }
        .resume-page:last-child { page-break-after: avoid; }
    `;
    printDoc.head.appendChild(printStyles);
    
    // 4. Set theme for consistency.
    printDoc.documentElement.lang = document.documentElement.lang;
    if (document.documentElement.classList.contains('dark')) {
        printDoc.documentElement.classList.add('dark');
    }

    // 5. Render the React component into the new window's body.
    const mountPoint = printDoc.body;
    const root = createRoot(mountPoint);
    flushSync(() => {
        root.render(React.createElement(PrintableDocument, printProps));
    });
    
    // 6. Set up a robust cleanup mechanism.
    let printed = false;
    const cleanup = () => {
        if (!printed) {
            printed = true;
            root.unmount();
            printWindow.close();
            onComplete();
        }
    };
    printWindow.onafterprint = cleanup;
    printWindow.onbeforeunload = cleanup; // Handle if the user closes the window manually.

    // 7. Wait for all assets (fonts, images) to load before printing.
    const waitForAssetsAndPrint = async () => {
        try {
            await (printDoc as any).fonts.ready;
            
            const imagePromises = Array.from(printDoc.images)
                .filter(img => !img.complete)
                .map(img => new Promise<void>(resolve => {
                    img.onload = img.onerror = () => resolve();
                }));

            await Promise.all(imagePromises);

            // All assets are loaded, now we can finalize the document and print.
            printDoc.close(); // Finalizes the document stream. Important.
            
            setTimeout(() => {
                printWindow.focus();
                // Attempt execCommand first, fallback to print()
                const printedSuccessfully = printWindow.document.execCommand('print', true, undefined);
                if (!printedSuccessfully) {
                   printWindow.print();
                }
                
                // If the user cancels the print dialog, `onafterprint` will still fire and call cleanup.
            }, 300); // A generous delay for the final render pass.

        } catch (err) {
            console.error("Error preparing document for printing:", err);
            alert("An error occurred preparing the PDF. Some assets may not have loaded correctly.");
            cleanup();
        }
    };
    
    waitForAssetsAndPrint();
};
