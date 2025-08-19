

import React, { useEffect } from 'react';
import { ResumeData, DesignOptions, Experience, TemplateProps } from '../types';
import { Mail, Phone, Linkedin, Globe } from './Icons';
import Editable from './Editable';

const StyleInjector: React.FC<{ design: DesignOptions }> = ({ design }) => (
  <style>{`
    .resume-classic {
      --primary-color: ${design.primaryColor};
      --heading-font: '${design.headingFont}', serif;
      --body-font: '${design.bodyFont}', sans-serif;
    }
  `}</style>
);

const Page: React.FC<{children: React.ReactNode}> = ({ children }) => (
    <div 
        className="bg-white shadow-2xl mb-8 mx-auto p-12 text-gray-800 resume-classic resume-page"
        style={{ 
            width: '100%', 
            maxWidth: '8.27in', 
            height: '11.69in', 
            overflow: 'hidden',
            boxSizing: 'border-box',
            fontFamily: 'var(--body-font)',
        }}
    >
        {children}
    </div>
);

const Section: React.FC<{ title: string; children: React.ReactNode; id: string }> = ({ title, children, id }) => (
  <section id={id} data-section-id={id} className="mb-6 scroll-mt-24">
    <h3 style={{fontFamily: 'var(--heading-font)'}} className="text-xl font-bold text-neutral tracking-widest uppercase pb-2 mb-4 text-center border-b-2 border-gray-700">{title}</h3>
    {children}
  </section>
);

// Heuristic function to estimate space taken by a job experience
const getJobWeight = (job: Experience): number => {
    const BASE_WEIGHT = 20; // For metadata
    const CHAR_WEIGHT = 0.1; // Weight per character in description
    const BULLET_WEIGHT = 5; // Weight per bullet point
    
    const descriptionLength = job.description.join(' ').length;
    const bulletCount = job.description.length;

    return BASE_WEIGHT + (descriptionLength * CHAR_WEIGHT) + (bulletCount * BULLET_WEIGHT);
};


const TemplateClassic: React.FC<TemplateProps> = (props) => {
  const { data, design, onOverflowChange, t, editMode, onUpdate, onFocus, editingPath, onAITooltipOpen } = props;
  // Constants for pagination logic. Tuned for this single-column template.
  const SUBSEQUENT_PAGE_MAX_WEIGHT = 520;

  const experiencePages: Experience[][] = [];
  if (data.experience.length > 0) {
      let currentPage: Experience[] = [];
      let currentWeight = 0;
      
      // This template puts all non-experience content on page 1.
      // So we just need to paginate the experience section across subsequent pages.
      
      data.experience.forEach(job => {
          const jobWeight = getJobWeight(job);
          if (currentWeight + jobWeight > SUBSEQUENT_PAGE_MAX_WEIGHT && currentPage.length > 0) {
              experiencePages.push(currentPage);
              currentPage = [];
              currentWeight = 0;
          }
          currentPage.push(job);
          currentWeight += jobWeight;
      });
      experiencePages.push(currentPage);
  }
  
  useEffect(() => {
    // For this template, overflow happens if there's more than ONE page of experience.
    onOverflowChange(experiencePages.length > 1);
  }, [experiencePages.length, onOverflowChange]);

  const getOriginalIndex = (jobToFind: Experience) => data.experience.findIndex(job => job === jobToFind);
  const editableProps = { editMode, onUpdate, onFocus, editingPath, onAITooltipOpen };

  return (
    <div className="transition-all duration-300">
      <StyleInjector design={design} />
      <Page>
        <header id="basics" data-section-id="basics" className="text-center mb-8 scroll-mt-24">
            {data.profilePicture && (
                <div className="mb-6 flex justify-center">
                    <img 
                        src={data.profilePicture} 
                        alt={data.name} 
                        className={`w-32 h-32 object-cover shadow-lg ${design.profilePictureShape === 'circle' ? 'rounded-full' : 'rounded-lg'}`}
                    />
                </div>
            )}
            <Editable as="h1" value={data.name} path="name" {...editableProps} className="text-5xl font-bold text-neutral tracking-tight" style={{fontFamily: 'var(--heading-font)'}} />
            <Editable as="h2" value={data.title} path="title" {...editableProps} className="text-2xl text-gray-600 font-light mt-2 mb-4" />
            
            <div className="flex justify-center items-center flex-wrap gap-x-4 gap-y-1 text-sm" style={{color: 'var(--primary-color)'}}>
                {data.contact.email && <div className="hover:underline flex items-center gap-1.5"><Mail className="w-4 h-4"/><Editable value={data.contact.email} path="contact.email" {...editableProps} /></div>}
                {data.contact.phone && <div className="flex items-center gap-1.5"><Phone className="w-4 h-4"/><Editable value={data.contact.phone} path="contact.phone" {...editableProps} /></div>}
                {data.contact.linkedin && <div className="hover:underline flex items-center gap-1.5"><Linkedin className="w-4 h-4"/><Editable value={data.contact.linkedin} path="contact.linkedin" {...editableProps} /></div>}
                {data.contact.website && <div className="hover:underline flex items-center gap-1.5"><Globe className="w-4 h-4"/><Editable value={data.contact.website} path="contact.website" {...editableProps} /></div>}
            </div>
        </header>

        <main>
            {data.summary && <Section id="summary" title={t('sectionSummary')}>
                <Editable value={data.summary} path="summary" {...editableProps} isHtml={true} className="text-center leading-relaxed prose prose-sm max-w-none dark:prose-invert" />
            </Section>}

            {data.skills?.length > 0 && <Section id="skills" title={t('sectionSkills')}>
                 <ul className="flex flex-wrap gap-x-4 gap-y-2 justify-center">
                    {data.skills.map((skill, index) => (
                      <li key={index} className="text-neutral text-md"><Editable value={skill} path={`skills[${index}]`} {...editableProps} /></li>
                    ))}
                </ul>
            </Section>}
            
            {data.education?.length > 0 && <Section id="education" title={t('sectionEducation')}>
              {data.education.map((edu, index) => (
                <div key={index} className="mb-4 last:mb-0 text-center">
                  <Editable as="h4" value={edu.degree} path={`education[${index}].degree`} {...editableProps} className="font-bold text-neutral text-lg" />
                  <Editable value={edu.institution} path={`education[${index}].institution`} {...editableProps} className="text-md" />
                  <div className="flex justify-center text-sm text-gray-500 mt-1">
                    <Editable value={edu.period} path={`education[${index}].period`} {...editableProps} />
                    <span className="mx-1">&bull;</span>
                    <Editable value={edu.location} path={`education[${index}].location`} {...editableProps} />
                  </div>
                </div>
              ))}
            </Section>}
        </main>
      </Page>
      
      {experiencePages.map((chunk, pageIndex) => (
        <Page key={`exp-page-${pageIndex}`}>
            <Section data-section-id="experience" id={pageIndex === 0 ? "experience" : `experience-p${pageIndex}`} title={pageIndex === 0 ? t('sectionExperience') : `${t('sectionExperience')} (${t('experienceContinued')})`}>
              {chunk.map((job) => {
                const globalJobIndex = getOriginalIndex(job);
                return (
                <div key={globalJobIndex} className="mb-7 last:mb-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="text-lg font-bold text-neutral">
                        <Editable value={job.role} path={`experience[${globalJobIndex}].role`} as="span" {...editableProps} />
                        <span className="font-normal"> at </span>
                        <Editable value={job.company} path={`experience[${globalJobIndex}].company`} as="span" {...editableProps} />
                    </h4>
                    <Editable value={job.period} path={`experience[${globalJobIndex}].period`} {...editableProps} className="text-sm font-medium text-gray-600" />
                  </div>
                  <Editable value={job.location} path={`experience[${globalJobIndex}].location`} {...editableProps} className="text-sm text-gray-500 mb-2" />
                  <ul className="list-disc list-inside text-gray-700 space-y-1.5 pl-2 leading-normal">
                    {job.description.map((desc, i) => <li key={i}><Editable value={desc} path={`experience[${globalJobIndex}].description[${i}]`} {...editableProps} /></li>)}
                  </ul>
                </div>
                )
              })}
            </Section>
        </Page>
      ))}
    </div>
  );
};

export default TemplateClassic;