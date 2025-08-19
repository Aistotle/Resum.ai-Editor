import { Language } from './types';

export const translations: Record<Language, any> = {
  da: {
    // Header
    startOver: "Start Forfra",
    downloadPDF: "Download PDF",
    downloading: "Downloader...",
    edit: "Rediger",
    preview: "Forhåndsvisning",

    // Hero
    heroTitle1: "Skab et CV, der",
    heroTitle2: "sikrer dig jobbet.",
    heroSubtitle: "Upload dit gamle CV. Vores AI vil øjeblikkeligt omskrive og omformatere det til en professionel, moderne skabelon, der garanteret vil imponere arbejdigivere.",

    // File Upload
    fileUploadCTA: "Klik for at uploade",
    fileUploadDrag: "eller træk og slip",
    fileUploadHint: "Kun PDF (MAKS. 5MB)",
    beautifyButton: "Forskøn Mit CV",
    readyToTransform: "Klar til at omdanne",
    tailorResumeToggle: "Skræddersy til job (genererer også ansøgning)?",

    // Loading
    loadingReading: "Læser dit CV...",
    loadingBeautifying: "Forskønner med AI-magi...",
    loadingWritingCoverLetter: "Skriver din ansøgning...",
    loadingMoment: "Dette kan tage et øjeblik...",

    // Errors
    errorTitle: "Ups! Noget gik galt.",
    errorTryAgain: "Prøv Igen",
    errorProcessing: "Der opstod en fejl under behandlingen.",
    errorTryDifferentFile: "Prøv en anden fil.",
    errorNetwork: "Der opstod en netværksfejl. Tjek venligst din internetforbindelse og prøv igen.",
    errorAPI: "Der opstod en uventet fejl hos AI-tjenesten. Prøv venligst igen senere.",


    // Editor
    paginationWarningTitle: "Advarsel om CV-længde",
    paginationWarningBody: "Dit indhold overstiger den anbefalede grænse på to sider. For de bedste resultater, brug AI-editoren til at forkorte et afsnit.",
    zoomIn: "Zoom Ind",
    zoomOut: "Zoom Ud",
    switchToPreviewToDownload: "Skift venligst til Forhåndsvisning for at downloade som PDF.",
    resume: "CV",
    coverLetter: "Ansøgning",
    
    // Cover Letter
    coverLetterTitle: "Skræddersy din jobansøgning",
    coverLetterSubtitle: "Indsæt jobbeskrivelsen nedenfor, og AI'en vil skrive en ansøgning, der er perfekt tilpasset dit CV.",
    jobDescriptionLabel: "Jobbeskrivelse",
    jobDescriptionPlaceholder: "Indsæt hele jobbeskrivelsen her...",
    coverLetterGenerateButton: "Generer Ansøgning",
    coverLetterGenerating: "Skriver din skræddersyede ansøgning...",
    coverLetterError: "Kunne ikke generere ansøgning: {message}",
    textFormatting: "Tekstformatering",
    fontStyle: "Skrifttype",
    paragraph: "Afsnit",
    alignment: "Justering",
    lists: "Lister",
    
    // Selection Tooltip
    tooltipPlaceholder: "Spørg AI... (f.eks. 'gør dette mere professionelt')",
    tooltipSubmit: "Forbedre",
    tooltipError: "Kunne ikke forbedre teksten. Prøv venligst igen.",

    // Edit Mode & Modals
    addNewItem: "Tilføj nyt element",
    add: "Tilføj",
    editItem: "Rediger Element",
    saveChanges: "Gem Ændringer",
    moveUp: "Flyt op",
    moveDown: "Flyt ned",
    dragHandle: "Træk for at genbestille",
    // Field labels
    picture: "Billede",
    fullName: "Fulde navn",
    headline: "Overskrift",
    email: "Email",
    website: "Hjemmeside",
    phone: "Telefon",
    location: "Lokation",
    role: "Stilling",
    company: "Virksomhed",
    period: "Periode",
    degree: "Uddannelse",
    institution: "Institution",
    network: "Netværk",
    username: "Brugernavn",
    url: "URL",
    skill: "Færdighed",
    projectName: "Projekttitel",
    projectDescription: "Beskrivelse",
    certificationName: "Certifikatnavn",
    issuer: "Udsteder",
    date: "Dato",
    languageName: "Sprog",
    level: "Niveau",
    interest: "Interesse",

    // Control Panel
    panelChat: "AI Chat",
    panelDesign: "Design",
    panelTemplates: "Skabeloner",
    
    // Chatbot
    chatHeader: "AI Editor Chat",
    chatSubtitle: "Fortæl mig, hvad jeg skal ændre.",
    chatPlaceholder: "f.eks., Gør mit resumé kortere",
    chatWelcome: "Her er det første udkast til dit nye CV. Du kan bruge kontrolpanelet til at redigere det med AI, ændre designet eller skifte skabelon.",
    chatWelcomeTailored: "Jeg har skræddersyet dit CV og skrevet et udkast til en ansøgning. Du kan skifte mellem dem med knapperne ovenfor. Sig til, hvis du vil have ændringer!",
    chatUpdate: "Jeg har opdateret dit CV. Hvad er det næste?",
    chatUpdateCoverLetter: "Jeg har opdateret din ansøgning. Andre ændringer?",
    chatError: "Beklager, jeg kunne ikke foretage den ændring. Kan du prøve at omformulere?",

    // Design Controls
    designHeader: "Design & Rediger",
    designSubtitle: "Tilpas dit CV's udseende.",
    liveEditorTitle: "Live Editor",
    liveEditorBody: "Slå dette til for at ændre tekst direkte på CV-forhåndsvisningen.",
    enableLiveEditing: "Aktiver Live Redigering",
    accentColor: "Accentfarve",
    typography: "Typografi",
    headingFont: "Overskrift Skrifttype",
    bodyFont: "Brødtekst Skrifttype",
    profilePicture: "Profilbillede",
    uploadImage: "Upload Billede",
    removeImage: "Fjern",
    pictureShape: "Billedform",
    circle: "Cirkel",
    square: "Firkant",

    // Template Switcher
    templatesHeader: "Skabeloner",
    templatesSubtitle: "Vælg et layout eller opret et med AI.",
    modern: "Moderne",
    classic: "Klassisk",
    blueHero: "Blå Helt",
    modernSplit: "Moderne Opdelt",
    professional: "Professionel",
    structured: "Struktureret",
    aiTemplates: "Dine AI-skabeloner",
    createWithAI: "Opret med AI",
    beta: "Beta",

    // Template Upload Modal
    modalHeader: "Opret skabelon med AI (Beta)",
    modalSubtitle: "Upload et billede af et CV for at klone dets stil.",
    modalUploadCTA: "Klik for at uploade",
    modalUploadHint: "PNG eller JPG anbefales",
    modalAnalyzingTitle: "AI dekonstruerer layoutet...",
    modalAnalyzingBody: "Perfektionerer typografi og farver. Dette kan tage et øjeblik.",
    modalError: "AI-skabelonoprettelse mislykkedes: {message}",
    modalErrorSuggestion: "AI havde muligvis svært ved dette design. Prøv et tydeligere billede.",
    cancel: "Annuller",
    
    // Resume Sections
    sectionBasics: "Grundlæggende",
    sectionSummary: "Resumé",
    sectionProfiles: "Profiler",
    sectionExperience: "Erhvervserfaring",
    sectionEducation: "Uddannelse",
    sectionSkills: "Færdigheder",
    sectionProjects: "Projekter",
    sectionCertifications: "Certificeringer",
    sectionLanguages: "Sprog",
    sectionInterests: "Interesser",
    experienceContinued: "Erhvervserfaring (fortsat)",
    // Blue Hero Specific
    coverHello: "Hej",
    educationAndOther: "Uddannelse & Andet",
    personal: "Personligt",
    // Modern Split Specific
    labelResume: "CV",
    labelContinued: "Fortsat",
    // Professional Specific
    contact: "Kontakt",
  },
  en: {
    // Header
    startOver: "Start Over",
    downloadPDF: "Download PDF",
    downloading: "Downloading...",
    edit: "Edit",
    preview: "Preview",

    // Hero
    heroTitle1: "Craft a resume that",
    heroTitle2: "gets you hired.",
    heroSubtitle: "Just upload your old resume. Our AI will instantly rewrite and reformat it into a professional, modern template guaranteed to impress recruiters.",
    
    // File Upload
    fileUploadCTA: "Click to upload",
    fileUploadDrag: "or drag and drop",
    fileUploadHint: "PDF only (MAX. 5MB)",
    beautifyButton: "Beautify My Resume",
    readyToTransform: "Ready to transform",
    tailorResumeToggle: "Tailor for job (also generates cover letter)?",

    // Loading
    loadingReading: "Reading your resume...",
    loadingBeautifying: "Beautifying with AI magic...",
    loadingWritingCoverLetter: "Writing your cover letter...",
    loadingMoment: "This may take a moment...",

    // Errors
    errorTitle: "Oops! Something went wrong.",
    errorTryAgain: "Try Again",
    errorProcessing: "An error occurred during processing.",
    errorTryDifferentFile: "Please try a different file.",
    errorNetwork: "A network error occurred. Please check your internet connection and try again.",
    errorAPI: "An unexpected error occurred with the AI service. Please try again later.",

    // Editor
    paginationWarningTitle: "Resume Length Warning",
    paginationWarningBody: "Your content has exceeded the recommended two-page limit. For best results, use the AI Editor to shorten a section.",
    zoomIn: "Zoom In",
    zoomOut: "Zoom Out",
    switchToPreviewToDownload: "Please switch to Preview mode to download as a PDF.",
    resume: "Resume",
    coverLetter: "Cover Letter",

    // Cover Letter
    coverLetterTitle: "Tailor Your Job Application",
    coverLetterSubtitle: "Paste the job description below, and the AI will write a cover letter perfectly tailored to your resume.",
    jobDescriptionLabel: "Job Description",
    jobDescriptionPlaceholder: "Paste the entire job description here...",
    coverLetterGenerateButton: "Generate Cover Letter",
    coverLetterGenerating: "Writing your tailored cover letter...",
    coverLetterError: "Could not generate cover letter: {message}",
    textFormatting: "Text Formatting",
    fontStyle: "Font Style",
    paragraph: "Paragraph",
    alignment: "Alignment",
    lists: "Lists",

    // Selection Tooltip
    tooltipPlaceholder: "Ask AI... (e.g. 'make this more professional')",
    tooltipSubmit: "Improve",
    tooltipError: "Could not improve the text. Please try again.",

    // Edit Mode & Modals
    addNewItem: "Add a new item",
    add: "Add",
    editItem: "Edit Item",
    saveChanges: "Save Changes",
    moveUp: "Move up",
    moveDown: "Move down",
    dragHandle: "Drag to reorder",
    // Field labels
    picture: "Picture",
    fullName: "Full Name",
    headline: "Headline",
    email: "Email",
    website: "Website",
    phone: "Phone",
    location: "Location",
    role: "Role",
    company: "Company",
    period: "Period",
    degree: "Degree",
    institution: "Institution",
    network: "Network",
    username: "Username",
    url: "URL",
    skill: "Skill",
    projectName: "Project Name",
    projectDescription: "Description",
    certificationName: "Certification Name",
    issuer: "Issuer",
    date: "Date",
    languageName: "Language",
    level: "Level",
    interest: "Interest",

    // Control Panel
    panelChat: "AI Chat",
    panelDesign: "Design",
    panelTemplates: "Templates",

    // Chatbot
    chatHeader: "AI Editor Chat",
    chatSubtitle: "Tell me what to change.",
    chatPlaceholder: "e.g., Make my summary shorter",
    chatWelcome: "Here is the first draft of your new resume. You can use the control panel to edit it with AI, change the design, or switch templates.",
    chatWelcomeTailored: "I've tailored your resume and drafted a cover letter for you. You can switch between them using the buttons above. Let me know if you want any changes!",
    chatUpdate: "I've updated your resume. What's next?",
    chatUpdateCoverLetter: "I've updated your cover letter. Any other changes?",
    chatError: "I'm sorry, I couldn't make that change. Could you try rephrasing?",

    // Design Controls
    designHeader: "Design & Edit",
    designSubtitle: "Customize your resume's look and feel.",
    liveEditorTitle: "Live Editor",
    liveEditorBody: "Toggle this on to change text directly on the resume preview.",
    enableLiveEditing: "Enable Live Editing",
    accentColor: "Accent Color",
    typography: "Typography",
    headingFont: "Heading Font",
    bodyFont: "Body Font",
    profilePicture: "Profile Picture",
    uploadImage: "Upload Image",
    removeImage: "Remove",
    pictureShape: "Picture Shape",
    circle: "Circle",
    square: "Square",

    // Template Switcher
    templatesHeader: "Templates",
    templatesSubtitle: "Choose a layout or create one with AI.",
    modern: "Modern",
    classic: "Classic",
    blueHero: "Blue Hero",
    modernSplit: "Modern Split",
    professional: "Professional",
    structured: "Structured",
    aiTemplates: "Your AI Templates",
    createWithAI: "Create with AI",
    beta: "Beta",
    
    // Template Upload Modal
    modalHeader: "Create Template with AI (Beta)",
    modalSubtitle: "Upload an image of a resume to clone its style.",
    modalUploadCTA: "Click to upload",
    modalUploadHint: "PNG or JPG recommended",
    modalAnalyzingTitle: "AI is deconstructing the layout...",
    modalAnalyzingBody: "Perfecting typography and colors. This may take a minute.",
    modalError: "AI template creation failed: {message}",
    modalErrorSuggestion: "The AI may have struggled with this design. Try a clearer image.",
    cancel: "Cancel",
    
    // Resume Sections
    sectionBasics: "Basics",
    sectionSummary: "Summary",
    sectionProfiles: "Profiles",
    sectionExperience: "Experience",
    sectionEducation: "Education",
    sectionSkills: "Skills",
    sectionProjects: "Projects",
    sectionCertifications: "Certifications",
    sectionLanguages: "Languages",
    sectionInterests: "Interests",
    experienceContinued: "Professional Experience (Continued)",
    // Blue Hero Specific
    coverHello: "Hello",
    educationAndOther: "Education & Other",
    personal: "Personal",
    // Modern Split Specific
    labelResume: "RESUME",
    labelContinued: "Continued",
    // Professional Specific
    contact: "Contact",
  }
};