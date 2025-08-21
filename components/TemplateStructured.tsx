import React, { useMemo } from 'react';
import { ResumeData, DesignOptions, Experience, TemplateProps } from '../types';
import { Mail, Phone, Linkedin, Globe, MapPin } from './Icons';
import Editable from './Editable';

// Style Injector for dynamic colors and fonts
const StyleInjector: React.FC<{ design: DesignOptions }> = ({ design }) => (
  <style>{`
    .resume-structured-v2 {
      --primary-color: ${design.primaryColor};
      --heading-font: '${design.headingFont}', sans-serif;
      --body-font: '${design.bodyFont}', sans-serif;
      --sidebar-bg: #f3f4f6; /* gray-100 */
      --sidebar-text: #4b5563; /* gray-600 */
      --main-text: #1f2937; /* gray-800 */
      --main-heading: #111827; /* gray-900 */
      --font-size: ${design.fontSize}px;
      --line-height: ${design.lineHeight};
    }
    .dark .resume-structured-v2 {
      --sidebar-bg: #1f2937; /* gray-800 */
      --sidebar-text: #d1d5db; /* gray-300 */
      --main-text: #d1d5db; /* gray-300 */
      --main-heading: #f9fafb; /* gray-50 */
    }
    .resume-structured-v2 {
        font-size: var(--font-size);
        line-height: var(--line-height);
    }
     ${design.underlineLinks ? `.resume-structured-v2 a { text-decoration: underline; }` : ''}
  `}</style>
);

// A4 Page wrapper
const Page: React.FC<{children: React.ReactNode}> = ({ children }) => (
    <div 
        className="bg-white dark:bg-gray-900 shadow-2xl mb-8 mx-auto resume-structured-v2 resume-page text-[10pt] leading-normal"
        style={{ 
            width: '100%', 
            maxWidth: '8.27in', 
            height: '11.69in', 
            overflow: 'hidden',
            boxSizing: 'border-box',
        }}
    >
        {children}
    </div>
);

// --- Content Weight Calculation ---
const getWeight = {
    job: (job: Experience): number => {
        const descriptionLength = job.description.join(' ').length;
        return 40 + (descriptionLength * 0.18) + (job.description.length * 8);
    },
    summary: (text: string) => text ? 50 + text.length * 0.25 : 0,
    sidebarSection: (items: any[]) => items ? 40 + items.length * 20 : 0,
    skills: (items: string[]) => items ? 40 + items.join('').length * 0.8 : 0,
};

const TemplateStructured: React.FC<TemplateProps> = (props) => {
  const { data, design, t, editMode, onUpdate, onFocus, editingPath, onAITooltipOpen } = props;
  const editableProps = { editMode, onUpdate, onFocus, editingPath, onAITooltipOpen };
  const getOriginalIndex = (jobToFind: Experience) => data.experience.findIndex(job => job === jobToFind);

  // --- Dynamic Pagination Logic ---
  const experiencePages = useMemo(() => {
    const jobs = data.experience || [];
    if (!jobs.length) return [];

    const PAGE_CAPACITY = 1000;
    const HEADER_COST = 150;
    const CN = PAGE_CAPACITY - 100;

    const sidebarCost = getWeight.sidebarSection(data.education) + getWeight.skills(data.skills) + 150;
    const mainStaticCost = HEADER_COST + getWeight.summary(data.summary);
    const C1 = PAGE_CAPACITY - Math.max(sidebarCost, mainStaticCost);

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

  const firstPageExperience = experiencePages[0] || [];
  const subsequentPages = experiencePages.slice(1);

  const SidebarSection: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
      <section className="mb-6">
          <h3 style={{fontFamily: 'var(--heading-font)', color: 'var(--primary-color)'}} className="text-sm font-bold tracking-wider uppercase mb-3">{title}</h3>
          {children}
      </section>
  );

  const MainSection: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
      <section className="mb-6">
          <h2 style={{fontFamily: 'var(--heading-font)', color: 'var(--primary-color)'}} className="text-xl font-bold mb-3 pb-2 border-b-2 border-gray-200 dark:border-gray-700">{title}</h2>
          {children}
      </section>
  );

  const renderExperienceChunk = (chunk: Experience[]) => (
    chunk.map(job => {
      const globalJobIndex = getOriginalIndex(job);
      return (
        <div key={globalJobIndex} className="mb-5 last:mb-0">
          <div className="flex justify-between items-baseline mb-1">
            <Editable as="h3" value={job.role} path={`experience[${globalJobIndex}].role`} {...editableProps} className="font-bold text-base" style={{color: 'var(--main-heading)'}} />
            <Editable value={job.period} path={`experience[${globalJobIndex}].period`} {...editableProps} className="text-sm text-gray-500 dark:text-gray-400" />
          </div>
          <Editable value={job.company} path={`experience[${globalJobIndex}].company`} {...editableProps} className="text-md font-semibold mb-2" style={{color: 'var(--primary-color)'}} />
          <ul className="list-disc list-inside space-y-1 pl-2">
            {job.description.map((desc, i) => <li key={i}><Editable value={desc} path={`experience[${globalJobIndex}].description[${i}]`} {...editableProps} /></li>)}
          </ul>
        </div>
      );
    })
  );
  
  const Sidebar = () => (
      <aside className="p-6 h-full" style={{ backgroundColor: 'var(--sidebar-bg)', color: 'var(--sidebar-text)' }}>
        {data.profilePicture && (
            <div className="mb-6">
                <img 
                    src={data.profilePicture} 
                    alt={data.name} 
                    className={`w-32 h-32 object-cover mx-auto shadow-lg border-4 border-white/20 dark:border-gray-900/30 ${design.profilePictureShape === 'circle' ? 'rounded-full' : 'rounded-lg'}`}
                />
            </div>
        )}
        <SidebarSection title={t('contact')}>
            <div className="space-y-2 text-sm break-words">
                {data.contact.location && <div className="flex items-start gap-2">{!design.hideIcons && <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0"/>}<Editable value={data.contact.location} path="contact.location" {...editableProps} /></div>}
                {data.contact.phone && <div className="flex items-start gap-2">{!design.hideIcons && <Phone className="w-4 h-4 mt-0.5 flex-shrink-0"/>}<Editable value={data.contact.phone} path="contact.phone" {...editableProps} /></div>}
                {data.contact.email && <div className="flex items-start gap-2">{!design.hideIcons && <Mail className="w-4 h-4 mt-0.5 flex-shrink-0"/>}<Editable value={data.contact.email} path="contact.email" {...editableProps} /></div>}
                {data.contact.website && <div className="flex items-start gap-2">{!design.hideIcons && <Globe className="w-4 h-4 mt-0.5 flex-shrink-0"/>}<Editable value={data.contact.website} path="contact.website" {...editableProps} /></div>}
                {data.contact.linkedin && <div className="flex items-start gap-2">{!design.hideIcons && <Linkedin className="w-4 h-4 mt-0.5 flex-shrink-0"/>}<Editable value={data.contact.linkedin} path="contact.linkedin" {...editableProps} /></div>}
            </div>
        </SidebarSection>
        {data.skills?.length > 0 && <SidebarSection title={t('sectionSkills')}>
            <ul className="flex flex-wrap gap-2">
                {(data.skills.slice(0, 15)).map((skill, index) => (
                <li key={index} className="bg-gray-500/20 dark:bg-gray-400/20 text-xs font-semibold px-2.5 py-1 rounded-md">
                    <Editable value={skill} path={`skills[${index}]`} {...editableProps} />
                </li>
                ))}
            </ul>
        </SidebarSection>}
         {data.education?.length > 0 && <SidebarSection title={t('sectionEducation')}>
            {data.education.map((edu, index) => (
                <div key={index} className="mb-4 last:mb-0">
                    <Editable as="h4" value={edu.degree} path={`education[${index}].degree`} {...editableProps} className="font-bold text-white text-sm" />
                    <Editable value={edu.institution} path={`education[${index}].institution`} {...editableProps} className="text-sm" />
                    <Editable value={edu.period} path={`education[${index}].period`} {...editableProps} className="text-xs opacity-80 mt-1" />
                </div>
            ))}
        </SidebarSection>}
      </aside>
  );

  return (
    <div className="transition-all duration-300">
      <StyleInjector design={design} />

      {/* --- Page 1 --- */}
      <Page>
        <div className="grid grid-cols-3 h-full">
            <div className="col-span-1 h-full"><Sidebar /></div>
            <main className="col-span-2 p-8 h-full overflow-hidden" style={{ color: 'var(--main-text)', fontFamily: 'var(--body-font)' }}>
                <header id="basics" data-section-id="basics" className="mb-8 scroll-mt-24">
                    <Editable as="h1" value={data.name} path="name" {...editableProps} className="text-5xl font-extrabold tracking-tight" style={{fontFamily: 'var(--heading-font)', color: 'var(--main-heading)'}} />
                    <Editable as="h2" value={data.title} path="title" {...editableProps} className="text-xl font-light mt-1" style={{color: 'var(--primary-color)'}}/>
                </header>
                {data.summary && <MainSection title={t('sectionSummary')}>
                    <Editable value={data.summary} path="summary" {...editableProps} isHtml={true} className="prose prose-sm max-w-none dark:prose-invert" />
                </MainSection>}
                {firstPageExperience.length > 0 && <MainSection title={t('sectionExperience')}>
                    {renderExperienceChunk(firstPageExperience)}
                </MainSection>}
            </main>
        </div>
      </Page>
      
      {/* --- Subsequent Pages --- */}
      {subsequentPages.map((chunk, pageIndex) => (
        <Page key={`exp-page-${pageIndex}`}>
            <div className="p-8 h-full overflow-hidden" style={{fontFamily: 'var(--body-font)'}}>
                <MainSection title={`${t('sectionExperience')} (${t('experienceContinued')})`}>
                    {renderExperienceChunk(chunk)}
                </MainSection>
            </div>
        </Page>
      ))}
    </div>
  );
};

export default TemplateStructured;