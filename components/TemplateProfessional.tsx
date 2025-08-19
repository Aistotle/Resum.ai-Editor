

import React, { useEffect } from 'react';
import { ResumeData, DesignOptions, Experience, TemplateProps } from '../types';
import { Mail, Phone, Linkedin, Globe, MapPin } from './Icons';
import Editable from './Editable';

const StyleInjector: React.FC<{ design: DesignOptions }> = ({ design }) => (
  <style>{`
    .resume-professional {
      --primary-color: ${design.primaryColor};
      --heading-font: '${design.headingFont}', sans-serif;
      --body-font: '${design.bodyFont}', sans-serif;
      --sidebar-bg: #1f2937;
      --sidebar-text: #d1d5db;
      --sidebar-heading: #ffffff;
      --font-size: ${design.fontSize}px;
      --line-height: ${design.lineHeight};
    }
    .resume-professional {
        font-size: var(--font-size);
        line-height: var(--line-height);
    }
    ${design.underlineLinks ? `.resume-professional a { text-decoration: underline; }` : ''}
  `}</style>
);

const Page: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div 
        className="bg-white shadow-2xl mb-8 mx-auto resume-professional resume-page"
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

const getJobWeight = (job: Experience): number => {
    const BASE_WEIGHT = 20;
    const CHAR_WEIGHT = 0.1;
    const BULLET_WEIGHT = 5;
    const descriptionLength = job.description.join(' ').length;
    const bulletCount = job.description.length;
    return BASE_WEIGHT + (descriptionLength * CHAR_WEIGHT) + (bulletCount * BULLET_WEIGHT);
};

const TemplateProfessional: React.FC<TemplateProps> = (props) => {
  const { data, design, onOverflowChange, t, editMode, onUpdate, onFocus, editingPath, onAITooltipOpen } = props;
  const PAGE_1_MAX_WEIGHT = 260;
  const SUBSEQUENT_PAGE_MAX_WEIGHT = 550;
  
  const experiencePages: Experience[][] = [];
  if (data.experience.length > 0) {
      let currentPage: Experience[] = [];
      let currentWeight = 0;
      data.experience.forEach(job => {
          const jobWeight = getJobWeight(job);
          const limit = experiencePages.length === 0 ? PAGE_1_MAX_WEIGHT : SUBSEQUENT_PAGE_MAX_WEIGHT;
          if (currentWeight + jobWeight > limit && currentPage.length > 0) {
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
    onOverflowChange(experiencePages.length > 2);
  }, [experiencePages.length, onOverflowChange]);

  const getOriginalIndex = (jobToFind: Experience) => data.experience.findIndex(job => job === jobToFind);
  const editableProps = { editMode, onUpdate, onFocus, editingPath, onAITooltipOpen };

  const SidebarSection: React.FC<{ title: string, children: React.ReactNode, id: string }> = ({ title, children, id }) => (
      <section id={id} data-section-id={id} className="mb-8 scroll-mt-24">
          <h3 style={{fontFamily: 'var(--heading-font)', color: 'var(--sidebar-heading)'}} className="text-sm font-bold tracking-widest uppercase mb-4 border-b border-gray-500 pb-2">{title}</h3>
          {children}
      </section>
  );

  const MainSection: React.FC<{ title: string, children: React.ReactNode, id: string }> = ({ title, children, id }) => (
      <section id={id} data-section-id={id} className="mb-8 scroll-mt-24">
          <h3 style={{fontFamily: 'var(--heading-font)', color: 'var(--primary-color)'}} className="text-lg font-bold tracking-wide uppercase mb-4">{title}</h3>
          {children}
      </section>
  );

  const renderExperienceChunk = (chunk: Experience[]) => (
    chunk.map(job => {
        const globalJobIndex = getOriginalIndex(job);
        return (
          <div key={globalJobIndex} className="mb-6 last:mb-0">
            <Editable as="h4" value={job.role} path={`experience[${globalJobIndex}].role`} {...editableProps} className="text-lg font-bold text-gray-900" style={{fontFamily: 'var(--heading-font)'}} />
            <div className="flex justify-between items-baseline mb-2">
              <Editable value={job.company} path={`experience[${globalJobIndex}].company`} {...editableProps} className="text-md font-semibold" style={{color: 'var(--primary-color)'}} />
              <Editable value={job.period} path={`experience[${globalJobIndex}].period`} {...editableProps} className="text-sm font-medium text-gray-500" />
            </div>
            <ul className="list-disc list-inside text-gray-700 space-y-1.5 pl-2 leading-normal">
              {job.description.map((desc, i) => <li key={i}><Editable value={desc} path={`experience[${globalJobIndex}].description[${i}]`} {...editableProps} /></li>)}
            </ul>
          </div>
        )
    })
  );

  return (
    <div className="transition-all duration-300">
      <StyleInjector design={design} />
      <Page>
        <div className="grid grid-cols-12 min-h-[11.69in]">
          <aside className="col-span-4 p-6" style={{ backgroundColor: 'var(--sidebar-bg)', color: 'var(--sidebar-text)' }}>
            {data.profilePicture && (
              <div className="mb-8 flex justify-center">
                <img src={data.profilePicture} alt={data.name} className={`w-32 h-32 object-cover border-4 border-white/20 shadow-lg ${design.profilePictureShape === 'circle' ? 'rounded-full' : 'rounded-lg'}`} />
              </div>
            )}
            <SidebarSection id="basics" title={t('contact')}>
                <div className="space-y-3 text-sm">
                    {!design.hideIcons && data.contact.phone && <div className="flex items-center gap-2"><Phone className="w-4 h-4"/><Editable value={data.contact.phone} path="contact.phone" {...editableProps} /></div>}
                    {!design.hideIcons && data.contact.email && <div className="flex items-center gap-2"><Mail className="w-4 h-4"/><Editable value={data.contact.email} path="contact.email" {...editableProps} /></div>}
                    {!design.hideIcons && data.contact.location && <div className="flex items-center gap-2"><MapPin className="w-4 h-4"/><Editable value={data.contact.location} path="contact.location" {...editableProps} /></div>}
                    {!design.hideIcons && data.contact.website && <div className="flex items-center gap-2"><Globe className="w-4 h-4"/><Editable value={data.contact.website} path="contact.website" {...editableProps} /></div>}
                    {!design.hideIcons && data.contact.linkedin && <div className="flex items-center gap-2"><Linkedin className="w-4 h-4"/><Editable value={data.contact.linkedin} path="contact.linkedin" {...editableProps} /></div>}
                </div>
            </SidebarSection>
            
            {data.education?.length > 0 && (
              <SidebarSection id="education" title={t('sectionEducation')}>
                {data.education.map((edu, index) => (
                    <div key={index} className="mb-4 last:mb-0">
                        <Editable as="h4" value={edu.degree} path={`education[${index}].degree`} {...editableProps} className="font-bold text-white text-md" />
                        <Editable value={edu.institution} path={`education[${index}].institution`} {...editableProps} className="text-sm" />
                        <Editable value={edu.period} path={`education[${index}].period`} {...editableProps} className="text-xs opacity-75 mt-1" />
                    </div>
                ))}
              </SidebarSection>
            )}

            {data.skills?.length > 0 && (
                <SidebarSection id="skills" title={t('sectionSkills')}>
                    <ul className="flex flex-wrap gap-2">
                        {data.skills.map((skill, index) => (
                        <li key={index} className="bg-gray-600 text-gray-100 text-xs font-semibold px-3 py-1 rounded-full">
                            <Editable value={skill} path={`skills[${index}]`} {...editableProps} />
                        </li>
                        ))}
                    </ul>
                </SidebarSection>
            )}
          </aside>

          <main className="col-span-8 py-8 pr-8 pl-6">
            <header data-section-id="basics" className="mb-10 scroll-mt-24">
              <Editable as="h1" value={data.name} path="name" {...editableProps} className="text-5xl font-extrabold text-gray-900 tracking-tight" style={{fontFamily: 'var(--heading-font)'}} />
              <Editable as="h2" value={data.title} path="title" {...editableProps} className="text-2xl font-light mt-1" style={{color: 'var(--primary-color)'}}/>
            </header>
            
            {data.summary && <MainSection id="summary" title={t('sectionSummary')}>
              <Editable value={data.summary} path="summary" {...editableProps} isHtml={true} className="text-gray-700 leading-relaxed prose prose-sm max-w-none dark:prose-invert" />
            </MainSection>}

            {experiencePages[0] && experiencePages[0].length > 0 && (
              <MainSection id="experience" title={t('sectionExperience')}>
                {renderExperienceChunk(experiencePages[0])}
              </MainSection>
            )}
          </main>
        </div>
      </Page>

      {experiencePages.slice(1).map((chunk, pageIndex) => (
          <Page key={`page-${pageIndex+2}`}>
              <div className="py-10 px-10">
                  <MainSection data-section-id="experience" id={`experience-p${pageIndex+2}`} title={`${t('sectionExperience')} (${t('experienceContinued')})`}>
                      {renderExperienceChunk(chunk)}
                  </MainSection>
              </div>
          </Page>
      ))}
    </div>
  );
};

export default TemplateProfessional;