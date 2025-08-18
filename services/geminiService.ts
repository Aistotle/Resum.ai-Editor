import { GoogleGenAI, Type } from "@google/genai";
import { ResumeData, CoverLetterData, TemplateConfig, LayoutType, TwoColumnLayoutRatio, SectionName, Language } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const resumeSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING, description: "Full name of the candidate." },
        title: { type: Type.STRING, description: "Candidate's professional title or headline (e.g., 'Senior Software Engineer')." },
        summary: { type: Type.STRING, description: "A rewritten, professional summary of 2-4 sentences highlighting key skills and experience." },
        contact: {
            type: Type.OBJECT,
            properties: {
                email: { type: Type.STRING, description: "Email address." },
                phone: { type: Type.STRING, description: "Phone number." },
                linkedin: { type: Type.STRING, description: "Full LinkedIn profile URL." },
                website: { type: Type.STRING, description: "Personal website or portfolio URL." },
                location: { type: Type.STRING, description: "The candidate's city and country (e.g., 'Copenhagen, Denmark')." }
            },
        },
        skills: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of key technical and soft skills."
        },
        experience: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    role: { type: Type.STRING, description: "Job title/role." },
                    company: { type: Type.STRING, description: "Company name." },
                    period: { type: Type.STRING, description: "Employment period (e.g., 'Jan 2020 - Present')." },
                    location: { type: Type.STRING, description: "Company location (e.g., 'San Francisco, CA')." },
                    description: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                        description: "3-5 rewritten, impactful bullet points starting with action verbs, quantifying achievements where possible."
                    }
                },
                required: ["role", "company", "period", "location", "description"]
            }
        },
        education: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    degree: { type: Type.STRING, description: "Degree obtained (e.g., 'B.S. in Computer Science')." },
                    institution: { type: Type.STRING, description: "Name of the university or institution." },
                    period: { type: Type.STRING, description: "Period of study." },
                    location: { type: Type.STRING, description: "Location of the institution." }
                },
                required: ["degree", "institution", "period", "location"]
            }
        },
        footer: { type: Type.STRING, description: "A short footer text, often a personal website or portfolio link." },
        projects: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    description: { type: Type.STRING }
                }
            }
        },
        certifications: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    issuer: { type: Type.STRING },
                    date: { type: Type.STRING }
                }
            }
        },
        languages: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    level: { type: Type.STRING }
                }
            }
        },
        interests: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
        }
    },
    required: ["name", "title", "summary", "contact", "skills", "experience", "education"]
};

const coverLetterSchema = {
    type: Type.OBJECT,
    properties: {
        recipientName: { type: Type.STRING, description: "Hiring Manager's name, if available in the job description. Otherwise, a generic title like 'Hiring Manager' or 'Recruiting Team'." },
        recipientTitle: { type: Type.STRING, description: "Hiring Manager's title, if available." },
        companyName: { type: Type.STRING, description: "The name of the company." },
        companyAddress: { type: Type.STRING, description: "The company's address, if available." },
        date: { type: Type.STRING, description: "Today's date in a 'Month Day, Year' format." },
        subject: { type: Type.STRING, description: "A compelling subject line, typically 'Application for the [Job Title] Position'." },
        body: { type: Type.STRING, description: "The main body of the cover letter as a single string with HTML line breaks (<br />). It should start with a salutation, have 3-4 paragraphs highlighting relevant skills, and end with a professional closing and the candidate's name." },
    },
    required: ["companyName", "date", "subject", "body"]
};


const typographyConfigSchema = {
    type: Type.OBJECT,
    properties: {
        fontFamily: { type: Type.STRING, description: "A common, web-safe font name (e.g., 'Georgia', 'Helvetica')." },
        fontSize: { type: Type.STRING, description: "CSS font size (e.g., '11pt', '16px')." },
        fontWeight: { type: Type.INTEGER, description: "CSS font weight (e.g., 400 for normal, 700 for bold)." },
        textTransform: { type: Type.STRING, enum: ['uppercase', 'capitalize', 'lowercase', 'none'], description: "CSS text transform." },
        textAlign: { type: Type.STRING, enum: ['left', 'center', 'right'], description: "CSS text align." },
        color: { type: Type.STRING, description: "Optional override hex color code (e.g., '#333333')." },
    },
    required: ["fontFamily", "fontSize", "fontWeight", "textTransform", "textAlign"],
};

const templateConfigSchema = {
    type: Type.OBJECT,
    properties: {
        id: { type: Type.STRING, description: "A unique identifier for the template, generated via UUID v4." },
        name: { type: Type.STRING, description: "A descriptive name for the template, derived from the original file name." },
        density: { type: Type.STRING, enum: ['compact', 'comfortable', 'spacious'], description: "The overall visual density of the template. 'compact' fits more content, 'spacious' uses more whitespace." },
        layout: {
            type: Type.OBJECT,
            properties: {
                type: { type: Type.STRING, enum: Object.values(LayoutType) },
                ratio: { type: Type.STRING, enum: Object.values(TwoColumnLayoutRatio) },
                gap: { type: Type.STRING, description: "CSS gap value for columns (e.g., '2rem')." },
                padding: { type: Type.STRING, description: "CSS padding value for the page (e.g., '3.5rem')." },
                sidebarSections: { type: Type.ARRAY, items: { type: Type.STRING, enum: ['summary', 'skills', 'education', 'experience'] } },
                header: {
                    type: Type.OBJECT,
                    properties: {
                        alignment: { type: Type.STRING, enum: ['left', 'center', 'spaceBetween'], description: "Alignment of header content." },
                        spacing: { type: Type.STRING, description: "CSS margin-bottom for the header (e.g., '2rem')." },
                    },
                    required: ["alignment", "spacing"],
                },
            },
            required: ["type", "gap", "padding", "sidebarSections", "header"],
        },
        colors: {
            type: Type.OBJECT,
            properties: {
                primary: { type: Type.STRING, description: "The main accent hex color code." },
                background: { type: Type.STRING, description: "The page background hex color code." },
                text: { type: Type.STRING, description: "The main body text hex color code." },
                heading: { type: Type.STRING, description: "The main heading (name) hex color code." },
            },
            required: ["primary", "background", "text", "heading"],
        },
        typography: {
            type: Type.OBJECT,
            properties: {
                body: typographyConfigSchema,
                name: typographyConfigSchema,
                title: typographyConfigSchema,
                sectionHeading: typographyConfigSchema,
                jobRole: typographyConfigSchema,
                jobCompany: typographyConfigSchema,
                dateAndLocation: typographyConfigSchema,
                contact: typographyConfigSchema,
            },
            required: ["body", "name", "title", "sectionHeading", "jobRole", "jobCompany", "dateAndLocation", "contact"],
        },
        sectionStyles: {
            type: Type.OBJECT,
            properties: {
                marginTop: { type: Type.STRING, description: "CSS margin-top for each section." },
                paddingBottom: { type: Type.STRING, description: "CSS padding-bottom for each section heading." },
                borderBottom: { type: Type.STRING, description: "CSS border-bottom for each section heading (e.g., '1px solid #cccccc' or 'none')." },
            },
            required: ["marginTop", "paddingBottom", "borderBottom"],
        },
    },
    required: ["id", "name", "density", "layout", "colors", "typography", "sectionStyles"],
};


export const improveResumeWithAI = async (resumeText: string, language: Language): Promise<ResumeData> => {
    const languageInstruction = language === 'da'
        ? "The entire output, including summary, job descriptions, skills, etc., MUST be in professional, fluent Danish."
        : "The entire output, including summary, job descriptions, skills, etc., MUST be in professional, fluent English.";

    try {
        const prompt = `
            You are an expert resume writer and editor. Your task is to transform raw resume text into a professional, high-quality data structure.

            **PRIMARY GOAL: Create concise and impactful content suitable for a 1-2 page resume.**
            - **LANGUAGE REQUIREMENT: ${languageInstruction}**
            - Focus on clarity, strong action verbs, and quantifiable achievements.
            - Summarize lengthy paragraphs into crisp, effective bullet points or summaries.
            - Do NOT worry about the final layout or page count; your focus is purely on generating the best possible content. The application will handle the final formatting.
            - If information like a website or LinkedIn is missing, return an empty string for that field.
            - Return a single, valid JSON object adhering to the provided schema. Do not include any text or markdown outside the JSON.

            Raw Resume Text:
            ---
            ${resumeText}
            ---
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: resumeSchema
            }
        });

        const jsonText = response.text.trim();
        const parsedData: ResumeData = JSON.parse(jsonText);
        return parsedData;

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to improve resume with AI. The model may have returned an unexpected format.");
    }
};

export const editResumeWithAI = async (currentResume: ResumeData, instruction: string, language: Language): Promise<ResumeData> => {
     const languageInstruction = language === 'da'
        ? "You MUST conduct this conversation and make all resume edits in professional, fluent Danish."
        : "You MUST conduct this conversation and make all resume edits in professional, fluent English.";

    try {
        const prompt = `
            You are a resume editing assistant. Your task is to apply the user's requested change to their resume content.

            **PRIMARY GOAL: Intelligently apply the user's edit while maintaining overall conciseness.**
            - **LANGUAGE REQUIREMENT: ${languageInstruction}**
            - If the user asks to add content, do so, but ensure it is well-written and professional.
            - If the user asks to shorten or change something, focus on making that specific edit effectively.
            - Do not worry about the final layout or page count. The application's layout engine will handle fitting the content.
            - You MUST return the **complete, updated resume** as a single, valid JSON object that adheres to the provided schema.
            - Do not include any text or markdown formatting outside of the JSON object.

            User's Instruction:
            ---
            ${instruction}
            ---

            Current Resume JSON:
            ---
            ${JSON.stringify(currentResume, null, 2)}
            ---
        `;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: resumeSchema
            }
        });

        const jsonText = response.text.trim();
        const parsedData: ResumeData = JSON.parse(jsonText);
        return parsedData;
    } catch (error) {
        console.error("Error editing with Gemini API:", error);
        throw new Error("Failed to edit resume with AI. The model may have returned an unexpected format.");
    }
};

export const editSelectedTextWithAI = async (
    instruction: string,
    selectedText: string,
    language: Language
): Promise<string> => {
    const languageInstruction = language === 'da'
        ? "The final output MUST be a single string written in professional, fluent Danish."
        : "The final output MUST be a single string written in professional, fluent English.";

    try {
        const prompt = `
            You are an expert resume editor. A user has selected a piece of text from their resume and wants you to improve it based on their instruction.

            **PRIMARY DIRECTIVE: Rewrite the text as requested and return ONLY the new text.**
            - **LANGUAGE REQUIREMENT: ${languageInstruction}**
            - Do not add any extra explanations, formatting, markdown, or quotation marks around the text.
            - Your entire response should be just the rewritten string.

            **User's Instruction:**
            "${instruction}"

            **Original Text to Improve:**
            "${selectedText}"
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        const newText = response.text.trim();
        if (!newText) {
          // If the AI returns nothing, return the original text to avoid blanking out fields.
          return selectedText;
        }
        return newText;

    } catch (error) {
        console.error("Error editing selected text with Gemini API:", error);
        throw new Error("Failed to edit selected text with AI.");
    }
};


export const analyzeResumeTemplate = async (imageDataUrl: string, fileName: string): Promise<TemplateConfig> => {
    const mimeType = imageDataUrl.substring(imageDataUrl.indexOf(":") + 1, imageDataUrl.indexOf(";"));
    const base64Data = imageDataUrl.split(',')[1];
    
    if (!base64Data) {
        throw new Error("Invalid image data URL.");
    }

    const imagePart = {
        inlineData: { mimeType, data: base64Data }
    };

    const prompt = `
        You are a world-class UI/UX and graphic design expert with the skills of a senior frontend developer. Your task is to meticulously analyze the provided resume image and deconstruct its complete design into a structured JSON object. You have creative freedom to make intelligent inferences to produce the most faithful look-alike template possible.

        **PRIMARY DIRECTIVE: Be extremely precise and act like you are reverse-engineering a design spec.**
        1.  **Overall Density**: Analyze the whitespace. Is it 'compact' (dense with info), 'comfortable' (standard), or 'spacious' (lots of breathing room)? This is crucial for layout.
        2.  **Layout**: 
            - Determine if it's 'SINGLE_COLUMN' or 'TWO_COLUMN'.
            - For two-column, what is the 'ratio' and which sections ('skills', 'education', 'summary') are in the smaller sidebar?
            - Accurately estimate CSS 'padding' for the page and 'gap' between columns.
            - Analyze the header: Is the content 'left' aligned, 'center' aligned, or is there 'spaceBetween' the name/title and contact info? How much 'spacing' (margin-bottom) is there after the header?
        3.  **Colors**: Use an eyedropper tool metaphorically. Identify the hex codes for: 'primary' accent, page 'background', main 'text', and the main 'heading' (name) color.
        4.  **Typography**: This is critical. For EACH typography element ('body', 'name', 'title', 'sectionHeading', 'jobRole', 'jobCompany', 'dateAndLocation', 'contact'), determine:
            - 'fontFamily': Guess a common web-safe font (e.g., 'Helvetica Neue', 'Garamond', 'Lato', 'Merriweather').
            - 'fontSize': Estimate in 'pt' (points).
            - 'fontWeight': 400 for normal, 700 for bold, etc.
            - 'textTransform': e.g., 'uppercase'.
            - 'textAlign'.
        5.  **Section Styles**: Analyze the vertical rhythm.
            - 'marginTop': How much space is between major sections?
            - 'paddingBottom': How much space is under a section heading?
            - 'borderBottom': What is the style of the line under a heading? e.g., '1px solid #e0e0e0' or 'none'.
        6.  **Naming & ID**: Generate a unique UUID v4 for 'id'. For 'name', use the provided filename, remove extension, and make it title case (e.g., 'Resume_Design.jpg' becomes 'Resume Design').
        7.  **Output**: Return ONLY the valid JSON object adhering to the schema. No extra text, markdown, or apologies. Your output must be perfect.

        **Filename for naming**: ${fileName}
    `;

    try {
         const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, {text: prompt}] },
            config: {
                responseMimeType: 'application/json',
                responseSchema: templateConfigSchema
            }
        });
        
        const jsonText = response.text.trim();
        const parsedData: TemplateConfig = JSON.parse(jsonText);

        // Sanity check and fallback for AI-generated data
        if (!parsedData.id) {
            parsedData.id = crypto.randomUUID();
        }
        if (!parsedData.name) {
            parsedData.name = fileName.split('.')[0].replace(/_/g, ' ');
        }
        
        return parsedData;

    } catch (error) {
        console.error("Error analyzing template with Gemini API:", error);
        throw new Error("Failed to analyze resume template. The AI may have struggled with this design. Try a clearer image.");
    }
};

export const generateCoverLetterWithAI = async (
    resumeData: ResumeData,
    jobDescription: string,
    language: Language
): Promise<Omit<CoverLetterData, 'senderName' | 'senderContactInfo'>> => {
    const languageInstruction = language === 'da'
        ? "The entire output MUST be in professional, fluent Danish."
        : "The entire output MUST be in professional, fluent English.";

    try {
        const prompt = `
            You are a professional career coach and expert cover letter writer. Your task is to generate the content for a cover letter based on a candidate's resume and a job description.

            **PRIMARY GOAL: Create a tailored and impactful cover letter and return it as a structured JSON object.**
            - **LANGUAGE REQUIREMENT: ${languageInstruction}**
            - Analyze the job description to find the company's name, address, and potentially a hiring manager's name and title. If not available, use professional placeholders.
            - Generate today's date in a 'Month Day, Year' format.
            - Create a compelling subject line for the application.
            - Write the main body of the letter. It must be a single string containing HTML line breaks (<br />). The body must be structured with a salutation (e.g., "Dear Hiring Manager,"), 3-4 paragraphs highlighting the most relevant skills from the resume that match the job description, and a strong concluding paragraph with a professional sign-off (e.g., "Sincerely,").
            - Do not include the sender's name or contact info in the body's sign-off; that will be handled separately by the application. Just end with the closing like "Sincerely,".
            - Return ONLY the valid JSON object.

            **Candidate's Resume (for context):**
            ---
            ${JSON.stringify(resumeData, null, 2)}
            ---

            **Job Description:**
            ---
            ${jobDescription}
            ---
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: coverLetterSchema,
            }
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText);

    } catch (error) {
        console.error("Error generating cover letter with Gemini API:", error);
        throw new Error("Failed to generate cover letter with AI. Please try again.");
    }
};

export const editCoverLetterWithAI = async (
    currentCoverLetter: CoverLetterData,
    instruction: string,
    language: Language
): Promise<CoverLetterData> => {
    const languageInstruction = language === 'da'
        ? "You MUST apply all edits and return the final text in professional, fluent Danish."
        : "You MUST apply all edits and return the final text in professional,fluent English.";

    try {
        const prompt = `
            You are a text editing assistant. Your task is to apply the user's requested change to the provided cover letter JSON data.

            **PRIMARY GOAL: Intelligently apply the user's edit while maintaining a professional and consistent tone.**
            - **LANGUAGE REQUIREMENT: ${languageInstruction}**
            - The user's instruction will typically apply to the 'body' of the letter, but you should be prepared to edit any field if requested (e.g., "Change the subject line to...").
            - You MUST return the **complete, updated cover letter** as a single, valid JSON object that adheres to the provided schema.
            - Ensure the 'body' string maintains its HTML line breaks (<br />).

            **User's Instruction:**
            ---
            ${instruction}
            ---

            **Current Cover Letter JSON:**
            ---
            ${JSON.stringify(currentCoverLetter, null, 2)}
            ---
        `;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: coverLetterSchema,
            }
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error editing cover letter with Gemini API:", error);
        throw new Error("Failed to edit cover letter with AI.");
    }
};