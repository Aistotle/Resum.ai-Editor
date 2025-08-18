export enum AppState {
  INITIAL = 'INITIAL',
  FILE_SELECTED = 'FILE_SELECTED',
  PROCESSING = 'PROCESSING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR',
}

export enum EditorView {
  RESUME = 'RESUME',
  COVER_LETTER = 'COVER_LETTER',
}

export enum TemplateIdentifier {
  MODERN = 'MODERN',
  CLASSIC = 'CLASSIC',
  BLUE_HERO = 'BLUE_HERO',
  MODERN_SPLIT = 'MODERN_SPLIT',
  PROFESSIONAL = 'PROFESSIONAL',
  DYNAMIC = 'DYNAMIC', // Represents a dynamically generated template
}

export type Language = 'da' | 'en';

export interface ConversationMessage {
  role: 'user' | 'ai';
  text: string;
}

export interface DesignOptions {
  primaryColor: string;
  headingFont: string;
  bodyFont: string;
  profilePictureShape: 'circle' | 'square';
}

export interface ContactInfo {
  email: string;
  phone: string;
  linkedin: string;
  website: string;
  location?: string;
}

export interface Experience {
  role: string;
  company: string;
  period: string;
  location:string;
  description: string[];
}

export interface Education {
  degree: string;
  institution: string;
  period: string;
  location: string;
}

export interface Project {
    name: string;
    description: string;
}

export interface Certification {
    name: string;
    issuer: string;
    date: string;
}

export interface LanguageSkill {
    name: string;
    level: string;
}

export interface Profile {
    network: string;
    username: string;
    url: string;
}

export interface ResumeData {
  name: string;
  title: string;
  summary: string;
  contact: ContactInfo;
  skills: string[];
  experience: Experience[];
  education: Education[];
  profilePicture?: string; // base64 string
  footer?: string;
  profiles?: Profile[];
  projects?: Project[];
  certifications?: Certification[];
  languages?: LanguageSkill[];
  interests?: string[];
}

export interface CoverLetterData {
  recipientName?: string;
  recipientTitle?: string;
  companyName?: string;
  companyAddress?: string;
  date?: string;
  subject?: string;
  body: string; // The main content, will be HTML
  senderName?: string;
  senderContactInfo?: string[];
}


export type SectionId = 'basics' | 'summary' | 'profiles' | 'experience' | 'education' | 'skills' | 'projects' | 'certifications' | 'languages' | 'interests';


export interface SelectionTooltipState {
  visible: boolean;
  top?: number;
  left?: number;
  selectedText?: string;
  contextPath?: string;
}

export interface ModalState {
    path: keyof ResumeData;
    index?: number;
    item: any;
}

// Types for Dynamic Template Generation
export enum LayoutType {
  SINGLE_COLUMN = 'SINGLE_COLUMN',
  TWO_COLUMN = 'TWO_COLUMN',
}

export enum TwoColumnLayoutRatio {
  ONE_THIRD_TWO_THIRDS = 'ONE_THIRD_TWO_THIRDS', // sidebar left
  TWO_THIRDS_ONE_THIRD = 'TWO_THIRDS_ONE_THIRD', // sidebar right
}

export type SectionName = 'summary' | 'skills' | 'education' | 'experience';

export interface TypographyConfig {
  fontFamily: string;
  fontSize: string;
  fontWeight: number;
  textTransform: 'uppercase' | 'capitalize' | 'lowercase' | 'none';
  textAlign: 'left' | 'center' | 'right';
  color?: string; // Optional override color
}

export interface TemplateConfig {
  id: string;
  name: string;
  density: 'compact' | 'comfortable' | 'spacious';
  layout: {
    type: LayoutType;
    ratio?: TwoColumnLayoutRatio;
    gap: string; // e.g., '2rem'
    padding: string; // e.g., '3.5rem'
    sidebarSections: SectionName[];
    header: {
      alignment: 'left' | 'center' | 'spaceBetween';
      spacing: string; // Margin bottom for the header
    };
  };
  colors: {
    primary: string;
    background: string;
    text: string;
    heading: string;
  };
  typography: {
    body: TypographyConfig;
    name: TypographyConfig;
    title: TypographyConfig;
    sectionHeading: TypographyConfig;
    jobRole: TypographyConfig;
    jobCompany: TypographyConfig;
    dateAndLocation: TypographyConfig;
    contact: TypographyConfig;
  };
  sectionStyles: {
    marginTop: string;
    paddingBottom: string;
    borderBottom: string; // e.g., '1px solid #e5e7eb' or 'none'
  };
}