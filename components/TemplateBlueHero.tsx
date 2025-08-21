import React, { useMemo } from 'react';
import { ResumeData, DesignOptions, Experience, TemplateProps } from '../types';
import Editable from './Editable';

const StyleInjector: React.FC<{ design: DesignOptions }> = ({ design }) => (
  <style>{`
    .resume-blue-hero {
      --blue: ${design.primaryColor};
      --ink: #0e172a;
      --muted: #58627a;
      --line: #e7edf7;
      --bg: #f6f9ff;
      --body-font: '${design.bodyFont}', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      --heading-font: '${design.headingFont}', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      --font-size: ${design.fontSize}px;
      --line-height: ${design.lineHeight};
    }
    .resume-blue-hero.sheet {
        font-family: var(--body-font);
        font-size: var(--font-size);
        line-height: var(--line-height);
        color: var(--ink);
        width: 210mm;
        height: 297mm;
        min-height: 297mm;
        max-height: 297mm;
        background: white;
        position: relative;
        box-shadow: 0 10px 30px rgba(24,40,100,.12);
        overflow: hidden;
    }
    ${design.underlineLinks ? `.resume-blue-hero a { text-decoration: underline; }` : ''}

    /* ===== Cover Page ===== */
    .resume-blue-hero .cover{ position:absolute; inset:0; display:grid; grid-template-rows: 1fr auto; }
    .resume-blue-hero .hero{
      background:var(--blue); color:white; padding: 24mm 20mm 22mm;
      display:grid; align-content:center; gap:10px;
    }
    .resume-blue-hero .hero small{ opacity:.9; font-weight:700; letter-spacing:.14em; text-transform:uppercase; }
    .resume-blue-hero .hero .name{ font-family: var(--heading-font); font-size:42px; font-weight:900; letter-spacing:.2px; margin-top:2px; }
    .resume-blue-hero .hero .tag{ font-family: var(--heading-font); font-size:16px; font-weight:700; opacity:.95; }
    .resume-blue-hero .hero p{ max-width:560px; margin:2px 0 0; opacity:.95; }
    .resume-blue-hero .hero .highlights{ display:flex; gap:8px; flex-wrap:wrap; margin-top:8px; }
    .resume-blue-hero .badge{ display:inline-block; background:rgba(255,255,255,.16); padding:5px 9px; border-radius:999px; font-weight:600; font-size:13px; }
    .resume-blue-hero .footer-band{
      background:white; border-top:1px solid var(--line);
      padding: 8mm 20mm; display:flex; justify-content:space-between; gap:18px; flex-wrap:wrap;
      color:var(--muted); font-size:13.5px;
    }

    /* ===== Content Pages ===== */
    .resume-blue-hero .page{ display:grid; grid-template-columns:1fr; gap:0; padding: 16mm 18mm; }
    .resume-blue-hero .page h2{ margin:0 0 5mm; font-size:17px; text-transform:uppercase; letter-spacing:1.5px; font-family: var(--heading-font); }
    .resume-blue-hero .rule{ height:2px; background:var(--line); position:relative; margin: 2mm 0 6mm; }
    .resume-blue-hero .rule::after{ content:""; position:absolute; left:0; top:0; width:110px; height:2px; background:var(--blue); }

    .resume-blue-hero .sec{ margin-bottom: 8mm; break-inside:avoid; }
    .resume-blue-hero .sec h3{ margin:0 0 2mm; font-size:13px; text-transform:uppercase; letter-spacing:1.2px; font-family: var(--heading-font); }

    /* Experience list */
    .resume-blue-hero .job{ margin-bottom: 6.5mm; break-inside:avoid; }
    .resume-blue-hero .job .head{ display:flex; justify-content:space-between; gap:10px; flex-wrap:wrap; }
    .resume-blue-hero .job .role{ font-weight:800; }
    .resume-blue-hero .job .org{ color:var(--muted); font-weight:600; }
    .resume-blue-hero .job .meta{ color:var(--muted); font-size:12.5px; }
    .resume-blue-hero .job ul{ margin:3px 0 0 16px; padding:0; list-style-type: disc; }
    .resume-blue-hero .job li{ margin:1.8px 0; }
    
    /* 2-column grids */
    .resume-blue-hero .grid2{ display:grid; grid-template-columns:1fr 1fr; gap: 10mm; }
    .resume-blue-hero .kv{ display:grid; gap:5px; }
    .resume-blue-hero .badge-line{ display:flex; flex-wrap:wrap; gap:6px; }
    .resume-blue-hero .pill{ padding:5px 9px; background:#eef2ff; border:1px solid var(--line); border-radius:999px; font-size:13px; }

    .resume-blue-hero .squiggle{ position:absolute; right:12mm; bottom:12mm; width:120px; height:50px; opacity:.45; }
  `}</style>
);

const Sheet: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
    <div className={`sheet resume-blue-hero resume-page mb-8 mx-auto ${className || ''}`}>
        {children}
    </div>
);

const Squiggle: React.FC = () => (
    <svg className="squiggle" viewBox="0 0 200 80">
      <path d="M5 60c30-40 60 40 90 0s60-40 100-10" fill="none" stroke="var(--blue)" strokeWidth="3"/>
    </svg>
);


// --- Pagination Heuristics ---
const getJobWeight = (job: Experience) => 15 + job.description.join(' ').length * 0.1 + job.description.length * 5;

const TemplateBlueHero: React.FC<TemplateProps> = (props) => {
    const { data, design, t, editMode, onUpdate, onFocus, editingPath, onAITooltipOpen } = props;
    const editableProps = { editMode, onUpdate, onFocus, editingPath, onAITooltipOpen };
    const getOriginalIndex = (jobToFind: Experience) => data.experience.findIndex(job => job === jobToFind);

    const experiencePages = useMemo(() => {
        const jobs = data.experience || [];
        if (!jobs.length) return [];

        const CN = 750; // Capacity of a normal experience page
        const jobWeights = jobs.map(job => getJobWeight(job));

        const pages = [];
        let currentPageJobs: Experience[] = [];
        let currentWeight = 0;

        jobs.forEach((job, index) => {
            const weight = jobWeights[index];
            if (currentWeight + weight > CN && currentPageJobs.length > 0) {
                pages.push(currentPageJobs);
                currentPageJobs = [];
                currentWeight = 0;
            }
            currentPageJobs.push(job);
            currentWeight += weight;
        });
        
        if (currentPageJobs.length > 0) {
            pages.push(currentPageJobs);
        }

        return pages;
    }, [data.experience]);

    const skillHighlights = data.skills?.slice(0, 4) || [];
    
    const hasOtherInfo = 
        (data.education && data.education.length > 0) ||
        (data.certifications && data.certifications.length > 0) ||
        (data.skills && data.skills.length > 0) ||
        (data.languages && data.languages.length > 0) ||
        (data.contact.location);

    return (
        <div className="transition-all duration-300">
            <StyleInjector design={design} />

            {/* --- Page 1: Cover --- */}
            <Sheet className="p-0">
                <div id="basics" data-section-id="basics" className="cover scroll-mt-24">
                    <div className="hero">
                        <Editable as="small" value={t('coverHello')} path="footer" {...editableProps} />
                        <Editable as="div" value={data.name} path="name" {...editableProps} className="name" />
                        <Editable as="div" value={data.title} path="title" {...editableProps} className="tag" />
                        <Editable as="p" value={data.summary} path="summary" {...editableProps} isHtml />
                        <div className="highlights">
                            {skillHighlights.map((skill, i) => (
                                <Editable as="span" key={i} value={skill} path={`skills[${i}]`} {...editableProps} className="badge" />
                            ))}
                        </div>
                    </div>
                    <div className="footer-band">
                        <Editable value={data.contact.phone} path="contact.phone" {...editableProps} />
                        <Editable value={data.contact.email} path="contact.email" {...editableProps} />
                        <Editable value={data.contact.linkedin} path="contact.linkedin" {...editableProps} />
                        <Editable value={data.contact.location || ''} path="contact.location" {...editableProps} />
                    </div>
                </div>
            </Sheet>

            {/* --- Page 2..N: Work Experience --- */}
            {experiencePages.map((chunk, pageIndex) => (
                <Sheet key={`exp-page-${pageIndex}`}>
                    <div className="page">
                        <h2 id="experience" data-section-id="experience" className="scroll-mt-24">{t('sectionExperience')}</h2>
                        <div className="rule"></div>
                        {chunk.map((job) => {
                            const globalIndex = getOriginalIndex(job);
                            return (
                                <div key={globalIndex} className="job">
                                    <div className="head">
                                        <Editable as="div" value={job.role} path={`experience[${globalIndex}].role`} {...editableProps} className="role"/>
                                        <Editable as="div" value={job.period} path={`experience[${globalIndex}].period`} {...editableProps} className="meta"/>
                                    </div>
                                    <Editable as="div" value={job.company} path={`experience[${globalIndex}].company`} {...editableProps} className="org"/>
                                    <ul>
                                        {job.description.map((desc, i) => (
                                            <li key={i}>
                                                <Editable value={desc} path={`experience[${globalIndex}].description[${i}]`} {...editableProps} />
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            );
                        })}
                    </div>
                </Sheet>
            ))}

            {/* --- Final Page: Education & Other --- */}
            {hasOtherInfo && (
             <Sheet>
                <div className="page">
                    <h2>{t('educationAndOther')}</h2>
                    <div className="rule"></div>
                    <div className="grid2">
                        {/* Left Column */}
                        <div>
                             {data.education && data.education.length > 0 && (
                                <div id="education" data-section-id="education" className="sec scroll-mt-24">
                                    <h3>{t('sectionEducation')}</h3>
                                    {data.education.map((edu, i) => (
                                        <div key={i} className="job">
                                            <div className="head">
                                                <Editable as="div" value={edu.degree} path={`education[${i}].degree`} {...editableProps} className="role"/>
                                                <Editable as="div" value={edu.period} path={`education[${i}].period`} {...editableProps} className="meta"/>
                                            </div>
                                             <Editable as="div" value={edu.institution} path={`education[${i}].institution`} {...editableProps} className="org"/>
                                        </div>
                                    ))}
                                </div>
                             )}
                        </div>
                        {/* Right Column */}
                        <div>
                             {data.certifications && data.certifications.length > 0 && (
                                <div id="certifications" data-section-id="certifications" className="sec scroll-mt-24">
                                    <h3>{t('sectionCertifications')}</h3>
                                    <div className="kv">
                                        {data.certifications.map((cert, i) => (
                                            <Editable key={i} as="div" value={`${cert.name} - ${cert.issuer}`} path={`certifications[${i}].name`} {...editableProps} className="pill" />
                                        ))}
                                    </div>
                                </div>
                             )}
                              {data.skills && data.skills.length > 0 && (
                                <div id="skills" data-section-id="skills" className="sec scroll-mt-24">
                                    <h3>{t('sectionSkills')}</h3>
                                    <div className="badge-line">
                                        {(data.skills.slice(0, 15)).map((skill, i) => (
                                            <Editable key={i} as="span" value={skill} path={`skills[${i}]`} {...editableProps} className="pill" />
                                        ))}
                                    </div>
                                </div>
                             )}
                             {data.languages && data.languages.length > 0 && (
                                <div id="languages" data-section-id="languages" className="sec scroll-mt-24">
                                    <h3>{t('sectionLanguages')}</h3>
                                    <div className="kv">
                                        {data.languages.map((lang, i) => (
                                            <Editable key={i} as="div" value={`${lang.name} — ${lang.level}`} path={`languages[${i}].name`} {...editableProps} />
                                        ))}
                                    </div>
                                </div>
                            )}
                             <div id="interests" data-section-id="interests" className="sec scroll-mt-24">
                                <h3>{t('personal')}</h3>
                                <div className="kv">
                                    <Editable as="div" value={data.contact.location || ''} path="contact.location" {...editableProps} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Squiggle />
             </Sheet>
            )}
        </div>
    );
};

export default TemplateBlueHero;