

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { EditorView, ResumeData, CoverLetterData, TemplateIdentifier, TemplateConfig, DesignOptions, SectionId } from '../types';

interface PrintProps {
    editorView: EditorView;
    resumeData: ResumeData;
    coverLetterData: CoverLetterData | null;
    selectedTemplate: TemplateIdentifier | TemplateConfig;
    designOptions: DesignOptions;
    t: (key: string) => string;
    layout: { sidebar: SectionId[], main: SectionId[] };
}

export const exportToPdf = async (printProps: PrintProps): Promise<void> => {
    // Find all elements with the 'resume-page' class from the live editor.
    const pageElements = document.querySelectorAll<HTMLElement>('.resume-page');
    if (pageElements.length === 0) {
        throw new Error("Could not find any content to export. Please ensure the resume is visible.");
    }

    // Create a temporary, off-screen container to render clones for capturing.
    // This isolates the capture from any transforms (like zoom) or styles in the live editor.
    const printContainer = document.createElement('div');
    printContainer.style.position = 'absolute';
    printContainer.style.left = '-9999px'; // Move it far off-screen
    printContainer.style.top = '-9999px';
    // The container needs a defined width to constrain the cloned pages correctly.
    printContainer.style.width = '8.27in';
    document.body.appendChild(printContainer);

    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'in',
        format: 'a4'
    });

    const a4WidthInches = 8.27;
    const a4HeightInches = 11.69;

    try {
        // Process each page element one by one
        for (let i = 0; i < pageElements.length; i++) {
            const originalPage = pageElements[i];
            
            // 1. Clone the page to render it in our clean, off-screen environment
            const clonedPage = originalPage.cloneNode(true) as HTMLElement;
            clonedPage.style.transform = 'none'; // Ensure no scaling is applied
            printContainer.appendChild(clonedPage);

            // Give the browser a moment to render the cloned content and apply fonts
            await new Promise(resolve => setTimeout(resolve, 100));

            // 2. Capture the CLONED page, not the original live one
            const canvas = await html2canvas(clonedPage, {
                scale: 3, // Use a higher scale for better resolution.
                useCORS: true,
                logging: false,
            });

            const imageData = canvas.toDataURL('image/jpeg', 0.95); // High quality JPEG

            // Add a new page for all but the first element
            if (i > 0) {
                pdf.addPage();
            }

            // 3. Add the captured image to the PDF
            pdf.addImage(imageData, 'JPEG', 0, 0, a4WidthInches, a4HeightInches);
            
            // 4. Clean up the cloned node to free up memory
            printContainer.removeChild(clonedPage);
        }
    } finally {
        // 5. IMPORTANT: Always remove the temporary container from the DOM
        document.body.removeChild(printContainer);
    }

    // Generate a filename from the user's name or a default
    const fileName = printProps.resumeData?.name 
        ? `${printProps.resumeData.name.replace(/\s+/g, '_')}_${printProps.editorView === 'RESUME' ? 'Resume' : 'Cover_Letter'}.pdf`
        : 'document.pdf';

    // Trigger the download
    pdf.save(fileName);
};