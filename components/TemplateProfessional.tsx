import React, { useMemo } from 'react';
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
            minHeight: '11.69in',
            maxHeight: '11.69in',
            overflow: 'hidden',
            boxSizing: 'border-box',
            fontFamily: 'var(--body-font)',
        }}
    >
        {children}
    </div>
);

const getWeight = {
    job: (job: Experience): number => {
        const descriptionLength = job.description.join(' ').length;
        return 40 + (descriptionLength * 0.18) + (job.description.length * 8);
    },
    summary: (text: string) => text ? 50 + text.length * 0.25 : 0,
};


const TemplateProfessional: React.FC<TemplateProps> = (props) => {
  const { data, design, t, editMode, onUpdate, onFocus, editingPath, onAITooltipOpen } = props;

  const experiencePages = useMemo(() => {
    const jobs = data.experience || [];
    if (!jobs.length) return [];

    const PAGE_CAPACITY = 980;
    const HEADER_COST = 180;
    const CN = 1000;
    const C1 = PAGE_CAPACITY - (HEADER_COST + getWeight.summary(data.summary));
    
    const jobWeights = jobs.map(job => getWeight.job(job));
    const W_total = jobWeights.reduce((sum, weight) => sum + weight, 0);

    if (W_total <= C1) {
        return [jobs];
    }
    
    let splitIndex = -1;

    if (W_total <= C1 + CN) {
        let greedyWeight = 0;
        let greedySplitIndex = -1;
        let cumulativeWeight = 0;
        for (let i = 0; i < jobs.length; i++) {
            if (cumulativeWeight + jobWeights[i] <= C1) {
                cumulativeWeight += jobWeights[i];
                greedySplitIndex = i;
                greedyWeight = cumulativeWeight;
            } else {
                break;
            }
        }
        
        let balancedWeight = 0;
        let balancedSplitIndex = -1;
        let minDiff = Infinity;
        cumulativeWeight = 0;
        for (let i = 0; i < jobs.length - 1; i++) {
             cumulativeWeight += jobWeights[i];
             const diff = Math.abs(cumulativeWeight - W_total / 2);
             if (diff < minDiff && cumulativeWeight <= C1) {
                 minDiff = diff;
                 balancedSplitIndex = i;
                 balancedWeight = cumulativeWeight;
             }
        }

        const targetWeight = (balancedWeight + greedyWeight) / 2;

        let bestFitIndex = -1;
        let bestFitDifference = Infinity;
        cumulativeWeight = 0;
        for (let i = 0; i < jobs.length; i++) {
            cumulativeWeight += jobWeights[i];
            if (cumulativeWeight <= C1) {
                const diff = Math.abs(cumulativeWeight - targetWeight);
                if (diff < bestFitDifference) {
                    bestFitDifference = diff;
                    bestFitIndex = i;
                }
            } else {
                break;
            }
        }
        splitIndex = bestFitIndex;
    } else {
        let page1Weight = 0;
        for (let i = 0; i < jobs.length; i++) {
            if (page1Weight + jobWeights[i] <= C1) {
                page1Weight += jobWeights[i];
                splitIndex = i;
            } else {
                break;
            }
        }
    }
    
    if (splitIndex === -1 && jobs.length > 0) {
        splitIndex = jobWeights[0] <= C1 ? 0 : -1;
    }

    const pages = [];
    const pageOneJobs = jobs.slice(0, splitIndex + 1);
    if(pageOneJobs.length > 0) pages.push(pageOneJobs);

    const remainingJobs = jobs.slice(splitIndex + 1);
    if (remainingJobs.length > 0) {
        let currentPageJobs: Experience[] = [];
        let currentWeight = 0;
        const remainingJobWeights = jobWeights.slice(splitIndex + 1);

        remainingJobs.forEach((job, index) => {
            const weight = remainingJobWeights[index];
            if (currentWeight + weight > CN && currentPageJobs.length > 0) {
                pages.push(currentPageJobs);
                currentPageJobs = [];
                currentWeight = 0;
            }
            currentPageJobs.push(job);
            currentWeight += weight;
        });
        if (currentPageJobs.length > 0) pages.push(currentPageJobs);
    }

    return pages.length > 0 ? pages : [[]];
  }, [data]);

  const getOriginalIndex = (jobToFind: Experience) => data.experience.findIndex(job => job === jobToFind);
  const editableProps = { editMode, onUpdate, onFocus, editingPath, onAITooltipOpen };
  
  const firstPageExperience = experiencePages[0] || [];
  const subsequentPages = experiencePages.slice(1);

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
            <ul className="list-disc list-outside text-gray-700 space-y-1.5 pl-5 leading-normal">
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
        <div className="grid grid-cols-12 h-full">
          <aside className="col-span-4 p-6 h-full" style={{ backgroundColor: 'var(--sidebar-bg)', color: 'var(--sidebar-text)' }}>
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
                        {(data.skills.slice(0, 15)).map((skill, index) => (
                        <li key={index} className="bg-gray-600 text-gray-100 text-xs font-semibold px-3 py-1 rounded-full">
                            <Editable value={skill} path={`skills[${index}]`} {...editableProps} />
                        </li>
                        ))}
                    </ul>
                </SidebarSection>
            )}
          </aside>

          <main className="col-span-8 py-8 pr-8 pl-6 h-full overflow-hidden">
            <header data-section-id="basics" className="mb-10 scroll-mt-24">
              <Editable as="h1" value={data.name} path="name" {...editableProps} className="text-5xl font-extrabold text-gray-900 tracking-tight" style={{fontFamily: 'var(--heading-font)'}} />
              <Editable as="h2" value={data.title} path="title" {...editableProps} className="text-2xl font-light mt-1" style={{color: 'var(--primary-color)'}}/>
            </header>
            
            {data.summary && <MainSection id="summary" title={t('sectionSummary')}>
              <Editable value={data.summary} path="summary" {...editableProps} isHtml={true} className="text-gray-700 leading-relaxed prose prose-sm max-w-none dark:prose-invert" />
            </MainSection>}

            {firstPageExperience.length > 0 && (
              <MainSection id="experience" title={t('sectionExperience')}>
                {renderExperienceChunk(firstPageExperience)}
              </MainSection>
            )}
          </main>
        </div>
      </Page>

      {subsequentPages.map((chunk, pageIndex) => (
          <Page key={`page-${pageIndex+2}`}>
              <div className="py-10 px-10 h-full overflow-hidden">
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