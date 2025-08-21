import React, { useMemo } from 'react';
import { ResumeData, DesignOptions, Experience, TemplateProps } from '../types';
import { Mail, Phone, Linkedin, Globe } from './Icons';
import Editable from './Editable';

const StyleInjector: React.FC<{ design: DesignOptions }> = ({ design }) => (
  <style>{`
    .resume-classic {
      --primary-color: ${design.primaryColor};
      --heading-font: '${design.headingFont}', serif;
      --body-font: '${design.bodyFont}', sans-serif;
      --font-size: ${design.fontSize}px;
      --line-height: ${design.lineHeight};
    }
    .resume-classic {
      font-size: var(--font-size);
      line-height: var(--line-height);
    }
    ${design.underlineLinks ? `.resume-classic a { text-decoration: underline; }` : ''}
  `}</style>
);

const Page: React.FC<{children: React.ReactNode}> = ({ children }) => (
    <div 
        className="bg-white shadow-2xl mb-8 mx-auto p-12 text-gray-800 resume-classic resume-page"
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

const Section: React.FC<{ title: string; children: React.ReactNode; id: string }> = ({ title, children, id }) => (
  <section id={id} data-section-id={id} className="mb-6 scroll-mt-24">
    <h3 style={{fontFamily: 'var(--heading-font)'}} className="text-xl font-bold text-neutral tracking-widest uppercase pb-2 mb-4 text-center border-b-2 border-gray-700">{title}</h3>
    {children}
  </section>
);

// --- Content Weight Calculation ---
const getWeight = {
    job: (job: Experience): number => {
        const descriptionLength = job.description.join(' ').length;
        return 40 + (descriptionLength * 0.18) + (job.description.length * 8);
    },
    summary: (text: string) => text ? 50 + text.length * 0.25 : 0,
    skills: (items: string[]) => items && items.length > 0 ? 50 + items.join('').length * 0.8 : 0,
    education: (items: any[]) => items && items.length > 0 ? 50 + items.length * 40 : 0,
};

const TemplateClassic: React.FC<TemplateProps> = (props) => {
  const { data, design, t, editMode, onUpdate, onFocus, editingPath, onAITooltipOpen } = props;
  
  const experiencePages = useMemo(() => {
    const jobs = data.experience || [];
    if (!jobs.length) return [[]];

    const PAGE_CAPACITY = 1000;
    const HEADER_COST = 200;
    let C1 = PAGE_CAPACITY - HEADER_COST;
    C1 -= getWeight.summary(data.summary);
    C1 -= getWeight.skills(data.skills);
    C1 -= getWeight.education(data.education);
    const CN = PAGE_CAPACITY - 100;
    
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

  const renderExperienceChunk = (chunk: Experience[]) => chunk.map((job) => {
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
            <ul className="list-disc list-outside text-gray-700 space-y-1.5 pl-5 leading-normal">
            {job.description.map((desc, i) => <li key={i}><Editable value={desc} path={`experience[${globalJobIndex}].description[${i}]`} {...editableProps} /></li>)}
            </ul>
        </div>
    );
  });

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
                {data.contact.email && <div className="hover:underline flex items-center gap-1.5">{!design.hideIcons && <Mail className="w-4 h-4"/>}<Editable value={data.contact.email} path="contact.email" {...editableProps} /></div>}
                {data.contact.phone && <div className="flex items-center gap-1.5">{!design.hideIcons && <Phone className="w-4 h-4"/>}<Editable value={data.contact.phone} path="contact.phone" {...editableProps} /></div>}
                {data.contact.linkedin && <div className="hover:underline flex items-center gap-1.5">{!design.hideIcons && <Linkedin className="w-4 h-4"/>}<Editable value={data.contact.linkedin} path="contact.linkedin" {...editableProps} /></div>}
                {data.contact.website && <div className="hover:underline flex items-center gap-1.5">{!design.hideIcons && <Globe className="w-4 h-4"/>}<Editable value={data.contact.website} path="contact.website" {...editableProps} /></div>}
            </div>
        </header>

        <main>
            {data.summary && <Section id="summary" title={t('sectionSummary')}>
                <Editable value={data.summary} path="summary" {...editableProps} isHtml={true} className="text-center leading-relaxed prose prose-sm max-w-none dark:prose-invert" />
            </Section>}

            {data.skills?.length > 0 && <Section id="skills" title={t('sectionSkills')}>
                 <ul className="flex flex-wrap gap-x-4 gap-y-2 justify-center">
                    {(data.skills.slice(0, 15)).map((skill, index) => (
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

            {firstPageExperience.length > 0 && <Section id="experience" title={t('sectionExperience')}>
                {renderExperienceChunk(firstPageExperience)}
            </Section>}
        </main>
      </Page>
      
      {subsequentPages.map((chunk, pageIndex) => (
        <Page key={`exp-page-${pageIndex}`}>
            <Section data-section-id="experience" id={`experience-p${pageIndex}`} title={`${t('sectionExperience')} (${t('experienceContinued')})`}>
              {renderExperienceChunk(chunk)}
            </Section>
        </Page>
      ))}
    </div>
  );
};

export default TemplateClassic;