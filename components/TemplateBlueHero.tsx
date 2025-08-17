import React, { useEffect } from 'react';
import { ResumeData, DesignOptions, Experience } from '../types';
import Editable from './Editable';

const StyleInjector: React.FC<{ design: DesignOptions }> = ({ design }) => (
  <style>{`
    .resume-blue-hero {
      --blue: ${design.primaryColor};
      --ink: #0e172a;
      --muted: #58627a;
      --line: #e7edf7;
    }
    .resume-blue-hero .sheet {
        width: 8.5in;
        height: 11in;
        background: white;
        position: relative;
        box-shadow: 0 10px 30px rgba(24, 40, 100, .12);
        overflow: hidden;
        padding: 0.5in;
        box-sizing: border-box;
        font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
        font-size: 10.5pt;
        line-height: 1.45;
        color: var(--ink);
    }
    .resume-blue-hero .cover { position: absolute; inset: 0; display: grid; grid-template-rows: 1fr auto; }
    .resume-blue-hero .hero {
        background: var(--blue);
        color: white;
        padding: 1in 0.8in 0.9in;
        display: grid;
        align-content: center;
        gap: 10px;
    }
    .resume-blue-hero .hero small { opacity: .9; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; }
    .resume-blue-hero .hero .name { font-size: 32pt; font-weight: 900; letter-spacing: .2px; margin-top: 2px; }
    .resume-blue-hero .hero .tag { font-size: 12pt; font-weight: 700; opacity: .95; }
    .resume-blue-hero .hero p { max-width: 560px; margin: 2px 0 0; opacity: .95; }
    .resume-blue-hero .hero .highlights { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 8px; }
    .resume-blue-hero .badge { display: inline-block; background: rgba(255, 255, 255, .16); padding: 5px 9px; border-radius: 999px; font-weight: 600; font-size: 9.5pt; }
    .resume-blue-hero .footer-band {
        background: white;
        border-top: 1px solid var(--line);
        padding: 0.3in 0.8in;
        display: flex;
        justify-content: space-between;
        gap: 18px;
        flex-wrap: wrap;
        color: var(--muted);
        font-size: 10pt;
    }
    .resume-blue-hero .page { display: grid; grid-template-columns: 1fr; gap: 0; padding: 0; }
    .resume-blue-hero .page h2 { margin: 0 0 0.2in; font-size: 13pt; text-transform: uppercase; letter-spacing: 1.5px; }
    .resume-blue-hero .rule { height: 2px; background: var(--line); position: relative; margin: 0.1in 0 0.25in; }
    .resume-blue-hero .rule::after { content: ""; position: absolute; left: 0; top: 0; width: 110px; height: 2px; background: var(--blue); }
    .resume-blue-hero .sec { margin-bottom: 0.3in; }
    .resume-blue-hero .sec h3 { margin: 0 0 0.1in; font-size: 10pt; text-transform: uppercase; letter-spacing: 1.2px; }
    .resume-blue-hero .job { margin-bottom: 0.25in; }
    .resume-blue-hero .job .head { display: flex; justify-content: space-between; gap: 10px; flex-wrap: wrap; }
    .resume-blue-hero .job .role { font-weight: 800; }
    .resume-blue-hero .job .org { color: var(--muted); font-weight: 600; }
    .resume-blue-hero .job .meta { color: var(--muted); font-size: 9.5pt; }
    .resume-blue-hero .job ul { margin: 3px 0 0 16px; padding: 0; }
    .resume-blue-hero .job li { margin: 1.8px 0; }
    .resume-blue-hero .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 0.4in; }
    .resume-blue-hero .kv { display: grid; gap: 5px; }
    .resume-blue-hero .pill { display: inline-block; padding: 5px 9px; background: #eef5ff; border: 1px solid var(--line); border-radius: 999px; font-size: 9.5pt; margin: 2px; }
  `}</style>
);

interface TemplateBlueHeroProps {
  data: ResumeData;
  design: DesignOptions;
  onOverflowChange: (overflow: boolean) => void;
  t: (key: string) => string;
  editMode: boolean;
  onUpdate: (path: string, value: any) => void;
  onFocus: (path: string | null) => void;
  editingPath: string | null;
  onAITooltipOpen: (path: string, selectedText: string, element: HTMLElement) => void;
}

const TemplateBlueHero: React.FC<TemplateBlueHeroProps> = (props) => {
  const { data, design, onOverflowChange, t, editMode, onUpdate, onFocus, editingPath, onAITooltipOpen } = props;
  
  useEffect(() => {
    // This template is designed to be 3 pages, so we never report an overflow.
    onOverflowChange(false);
  }, [onOverflowChange]);

  const getJobWeight = (job: Experience): number => {
    const BASE_WEIGHT = 20;
    const CHAR_WEIGHT = 0.1;
    const BULLET_WEIGHT = 5;
    const descriptionLength = job.description.join(' ').length;
    const bulletCount = job.description.length;
    return BASE_WEIGHT + (descriptionLength * CHAR_WEIGHT) + (bulletCount * BULLET_WEIGHT);
  };
  
  // Pagination logic: determine how many experience items fit on page 2.
  const PAGE_2_MAX_WEIGHT = 500;
  let page2Experience: Experience[] = [];
  let page3Experience: Experience[] = [];

  let currentWeight = 0;
  data.experience.forEach(job => {
    const jobWeight = getJobWeight(job);
    if (currentWeight + jobWeight <= PAGE_2_MAX_WEIGHT) {
        page2Experience.push(job);
        currentWeight += jobWeight;
    } else {
        page3Experience.push(job);
    }
  });

  const getOriginalIndex = (jobToFind: Experience) => data.experience.findIndex(job => job === jobToFind);

  const highlights = data.skills.slice(0, 4);
  const otherSkills = data.skills.slice(4);
  const editableProps = { editMode, onUpdate, onFocus, editingPath, onAITooltipOpen };

  return (
    <div className="resume-blue-hero transition-all duration-300">
      <StyleInjector design={design} />

      {/* Page 1: Cover */}
      <section className="sheet resume-page">
        <div id="basics" data-section-id="basics" className="cover scroll-mt-24">
          <div className="hero">
            <Editable as="small" value={t('coverHello')} path=" " {...editableProps} className="opacity-90 font-bold tracking-widest uppercase" />
            <Editable as="div" value={data.name} path="name" {...editableProps} className="name" />
            <Editable as="div" value={data.title} path="title" {...editableProps} className="tag" />
            <div id="summary" data-section-id="summary" className="scroll-mt-24">
                <Editable as="p" value={data.summary} path="summary" {...editableProps} className="max-w-xl mt-1 opacity-95" />
            </div>
            <div className="highlights">
              {highlights.map((skill, index) => (
                <span className="badge" key={index}>
                    <Editable value={skill} path={`skills[${index}]`} {...editableProps} />
                </span>
              ))}
            </div>
          </div>
          <div className="footer-band">
            <Editable value={data.contact.phone || ''} path="contact.phone" {...editableProps} />
            <Editable value={data.contact.email || ''} path="contact.email" {...editableProps} />
            <Editable value={data.contact.linkedin || ''} path="contact.linkedin" {...editableProps} />
            <Editable value={data.contact.website || ''} path="contact.website" {...editableProps} />
          </div>
        </div>
      </section>

      {/* Page 2: Work Experience */}
      <section className="sheet resume-page">
        <div id="experience" data-section-id="experience" className="page scroll-mt-24">
          <h2>{t('sectionExperience')}</h2>
          <div className="rule"></div>

          {page2Experience.map(job => {
             const globalJobIndex = getOriginalIndex(job);
             return (
              <div className="job" key={globalJobIndex}>
                <div className="head">
                  <Editable as="div" value={job.role} path={`experience[${globalJobIndex}].role`} {...editableProps} className="role" />
                  <Editable as="div" value={job.period} path={`experience[${globalJobIndex}].period`} {...editableProps} className="meta" />
                </div>
                <Editable as="div" value={job.company} path={`experience[${globalJobIndex}].company`} {...editableProps} className="org" />
                <ul>
                  {job.description.map((desc, i) => (
                    <li key={i}><Editable value={desc} path={`experience[${globalJobIndex}].description[${i}]`} {...editableProps} /></li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </section>

      {/* Page 3: Education & Other */}
      <section className="sheet resume-page">
        <div className="page">
          <h2>{t('educationAndOther')}</h2>
          <div className="rule"></div>
          
          {page3Experience.length > 0 && <div className="sec">
            <h3>{t('experienceContinued')}</h3>
            {page3Experience.map(job => {
                const globalJobIndex = getOriginalIndex(job);
                return (
                    <div className="job" key={globalJobIndex} data-section-id="experience">
                        <div className="head">
                        <Editable as="div" value={job.role} path={`experience[${globalJobIndex}].role`} {...editableProps} className="role" />
                        <Editable as="div" value={job.period} path={`experience[${globalJobIndex}].period`} {...editableProps} className="meta" />
                        </div>
                        <Editable as="div" value={job.company} path={`experience[${globalJobIndex}].company`} {...editableProps} className="org" />
                        <ul>
                        {job.description.map((desc, i) => (
                            <li key={i}><Editable value={desc} path={`experience[${globalJobIndex}].description[${i}]`} {...editableProps} /></li>
                        ))}
                        </ul>
                    </div>
                )
            })}
          </div>}

          <div className="grid2">
            <div>
              <div id="education" data-section-id="education" className="sec scroll-mt-24">
                <h3>{t('sectionEducation')}</h3>
                {data.education.map((edu, index) => (
                    <div className="job" key={index}>
                        <div className="head">
                            <Editable as="div" value={edu.degree} path={`education[${index}].degree`} {...editableProps} className="role"/>
                            <Editable as="div" value={edu.period} path={`education[${index}].period`} {...editableProps} className="meta"/>
                        </div>
                        <Editable as="div" value={edu.institution} path={`education[${index}].institution`} {...editableProps} />
                    </div>
                ))}
              </div>
            </div>
            <div>
              {data.profilePicture && (
                 <div className="sec">
                    <h3>{t('personal')}</h3>
                    <img 
                        src={data.profilePicture} 
                        alt={data.name} 
                        className={`w-32 h-32 object-cover shadow-md ${design.profilePictureShape === 'circle' ? 'rounded-full' : 'rounded-lg'}`}
                    />
                 </div>
              )}
              <div id="skills" data-section-id="skills" className="sec scroll-mt-24">
                <h3>{t('sectionSkills')}</h3>
                <div className="kv">
                    {otherSkills.map((skill, index) => (
                        <span className="pill" key={index}><Editable value={skill} path={`skills[${index + 4}]`} {...editableProps} /></span>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TemplateBlueHero;