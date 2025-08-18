import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { ResumeData, EditorView } from '../types';

/**
 * Generates a PDF from the DOM elements with the class '.resume-page'.
 * This method uses html2canvas to render each page as a high-quality image
 * and then compiles them into a single PDF document. This approach was chosen
 * for its reliability and ability to perfectly preserve the on-screen layout,
 * styling, and fonts, avoiding the complexities and inconsistencies of direct
 * PDF drawing commands.
 *
 * @param container The parent DOM element containing the .resume-page elements.
 * @param resumeName The name of the person on the resume, used for the filename.
 * @param view The current editor view (Resume or Cover Letter), used for the filename.
 */
const generatePdfFromDom = async (container: HTMLElement, resumeName: string, view: EditorView) => {
    const pages = container.querySelectorAll('.resume-page');
    if (pages.length === 0) {
        console.error("No pages found to generate PDF.");
        return;
    }

    const pdf = new jsPDF('p', 'in', 'letter');
    const pdfWidth = 8.5;
    const pdfHeight = 11;

    for (let i = 0; i < pages.length; i++) {
        const page = pages[i] as HTMLElement;
        
        // Using a high scale factor (3x) and PNG format ensures crisp text and graphics.
        const canvas = await html2canvas(page, { scale: 3, useCORS: true });
        const imgData = canvas.toDataURL('image/png', 1.0);
        
        if (i > 0) {
            pdf.addPage();
        }
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    }
    
    const docName = view === EditorView.RESUME ? "Resume" : "Cover_Letter";
    pdf.save(`${resumeName.replace(/\s/g, '_')}_${docName}.pdf`);
};

/**
 * The primary PDF export function for the application.
 * It uses a consistent and reliable DOM-to-image rendering strategy for all templates and views
 * to ensure high visual fidelity and prevent layout issues.
 */
export const exportToPdf = async (
    view: EditorView,
    containerRef: React.RefObject<HTMLDivElement>,
    resumeData: ResumeData
) => {
    const container = containerRef.current;
    if (!container) {
        throw new Error("PDF generation failed: container element not found.");
    }

    await generatePdfFromDom(container, resumeData.name, view);
};
