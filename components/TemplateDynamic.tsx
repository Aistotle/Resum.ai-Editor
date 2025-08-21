



import React, { useMemo } from 'react';
import { ResumeData, Experience, TemplateConfig, LayoutType, SectionName, DesignOptions, TemplateProps } from '../types';
import { Mail, Phone, Linkedin, Globe } from './Icons';
import Editable from './Editable';

// The pagination heuristic is now dynamic based on the AI's density analysis.
const getDynamicJobWeight = (job: Experience, density: TemplateConfig['density']): number => {
    const BASE_WEIGHT = 20;
    const CHAR_WEIGHT = 0.1;
    const BULLET_WEIGHT = 5;
    const descriptionLength = job.description.join(' ').length;
    const bulletCount = job.description.length;
    const rawWeight = BASE_WEIGHT + (descriptionLength * CHAR_WEIGHT) + (bulletCount * BULLET_WEIGHT);

    switch (density) {
        case 'compact': return rawWeight * 0.9;
        case 'spacious': return rawWeight * 1.15;
        case 'comfortable':
        default: return rawWeight;
    }
};

interface DynamicTemplateWithConfig extends TemplateProps {
    config: TemplateConfig;
}

const TemplateDynamic: React.FC<DynamicTemplateWithConfig> = (props) => {
    const { data, design, config, t, editMode, onUpdate, onFocus, editingPath, onAITooltipOpen } = props;
    const { layout, colors, typography, sectionStyles, density } = config;
    const editableProps = { editMode, onUpdate, onFocus, editingPath, onAITooltipOpen };
    const getOriginalIndex = (jobToFind: Experience) => data.experience.findIndex(job => job === jobToFind);

    // --- Pagination Logic ---
    const experiencePages = useMemo(() => {
        const jobs = data.experience || [];
        if (!jobs.length) return [];

        const CN = density === 'compact' ? 620 : (density === 'spacious' ? 460 : 520);
        const jobWeights = jobs.map(job => getDynamicJobWeight(job, density));
        
        const pages: Experience[][] = [];
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

        return pages.length > 0 ? pages : [[]];
    }, [data.experience, density]);


    const ProfilePicture = () => data.profilePicture ? (
        <div className="mb-6 flex justify-center">
            <img 
                src={data.profilePicture}
                alt={data.name}
                className={`w-32 h-32 object-cover shadow-lg ${design.profilePictureShape === 'circle' ? 'rounded-full' : 'rounded-lg'}`}
            />
        </div>
    ) : null;

    const renderExperienceChunk = (chunk: Experience[], isFirstChunk: boolean) => (
        <section id={isFirstChunk ? "experience" : undefined} data-section-id="experience" style={{ marginTop: sectionStyles.marginTop }} className="scroll-mt-24">
             <h3 style={{...typography.sectionHeading, color: typography.sectionHeading.color || colors.heading, paddingBottom: sectionStyles.paddingBottom, borderBottom: sectionStyles.borderBottom, marginBottom: sectionStyles.marginTop}}>
                {t('sectionExperience')} {isFirstChunk ? '' : `(${t('experienceContinued')})`}
             </h3>
             {chunk.map(job => {
                 const globalJobIndex = getOriginalIndex(job);
                 return (
                    <div key={globalJobIndex} className="mb-6 last:mb-0">
                        <div className="flex justify-between items-start">
                            <div>
                                <Editable as="h4" value={job.role} path={`experience[${globalJobIndex}].role`} {...editableProps} style={{ ...typography.jobRole, color: typography.jobRole.color || colors.heading }} />
                                <Editable value={job.company} path={`experience[${globalJobIndex}].company`} {...editableProps} style={{ ...typography.jobCompany, color: typography.jobCompany.color || colors.primary }} />
                            </div>
                            <div style={{...typography.dateAndLocation, color: typography.dateAndLocation.color || colors.text}}>
                                <Editable value={job.period} path={`experience[${globalJobIndex}].period`} {...editableProps} />
                                <Editable value={job.location} path={`experience[${globalJobIndex}].location`} {...editableProps} />
                            </div>
                        </div>
                         <ul className="list-disc list-inside space-y-1.5 pl-2 mt-2" style={{...typography.body, color: typography.body.color || colors.text}}>
                            {job.description.map((desc, i) => <li key={i}><Editable value={desc} path={`experience[${globalJobIndex}].description[${i}]`} {...editableProps} /></li>)}
                         </ul>
                    </div>
                 )
             })}
        </section>
    );

    const Section: React.FC<{name: SectionName}> = ({name}) => {
      const sectionMap: {[key in SectionName]: React.ReactNode} = {
          summary: <Editable value={data.summary} path="summary" {...editableProps} isHtml={true} className="prose prose-sm max-w-none dark:prose-invert" style={{ ...typography.body, color: typography.body.color || colors.text }} />,
          skills: (
              <ul className="flex flex-wrap gap-2">
                  {(data.skills.slice(0, 15)).map((skill, index) => (
                      <li key={index} className="text-xs font-semibold px-3 py-1 rounded" style={{backgroundColor: `${colors.primary}20`, color: colors.primary}}>
                          <Editable value={skill} path={`skills[${index}]`} {...editableProps} />
                      </li>
                  ))}
              </ul>
          ),
          education: (
               data.education.map((edu, index) => (
                  <div key={index} className="mb-4 last:mb-0">
                      <Editable as="h4" value={edu.degree} path={`education[${index}].degree`} {...editableProps} style={{ ...typography.jobRole, color: typography.jobRole.color || colors.heading}} />
                      <Editable value={edu.institution} path={`education[${index}].institution`} {...editableProps} style={{ ...typography.body, color: typography.body.color || colors.text }}/>
                  </div>
              ))
          ),
          experience: <></>, // Handled separately
      };
      
      const sectionTitleKey = `section${name.charAt(0).toUpperCase() + name.slice(1)}`;
      const sectionTitle = t(sectionTitleKey.replace('Experience', 'Experience').replace('Summary', 'Summary').replace('Skills', 'Skills').replace('Education', 'Education'));

      return (
        <section id={name} data-section-id={name} style={{ marginTop: sectionStyles.marginTop }} className="scroll-mt-24">
          <h3 style={{...typography.sectionHeading, color: typography.sectionHeading.color || colors.heading, paddingBottom: sectionStyles.paddingBottom, borderBottom: sectionStyles.borderBottom, marginBottom: sectionStyles.marginTop}}>
            {sectionTitle}
          </h3>
          {sectionMap[name]}
        </section>
      );
    };

    const mainColumnSections = (['summary', 'skills', 'education', 'experience'] as SectionName[]).filter(s => !layout.sidebarSections.includes(s));
    
    const Page: React.FC<{children: React.ReactNode}> = ({ children }) => (
        <div 
            className="bg-white shadow-2xl mb-8 mx-auto resume-page resume-dynamic-root"
            style={{ 
                width: '100%', 
                maxWidth: '8.27in', 
                height: '11.69in', 
                overflow: 'hidden',
                boxSizing: 'border-box',
                padding: layout.padding,
                backgroundColor: colors.background,
                color: colors.text,
                fontFamily: design.bodyFont,
                fontSize: `${design.fontSize}px`,
                lineHeight: design.lineHeight,
            }}
        >
            {children}
        </div>
    );
  
  return (
    <div className="transition-all duration-300">
        <style>{`${design.underlineLinks ? `.resume-dynamic-root a { text-decoration: underline; }` : ''}`}</style>
        <Page>
            <header id="basics" data-section-id="basics" style={{ marginBottom: layout.header.spacing }} className={`flex scroll-mt-24 ${layout.header.alignment === 'center' ? 'flex-col items-center text-center' : `justify-${layout.header.alignment} items-start`}`}>
                {layout.type === LayoutType.SINGLE_COLUMN && layout.header.alignment === 'center' && <ProfilePicture />}
                 <div>
                    <Editable as="h1" value={data.name} path="name" {...editableProps} style={{ ...typography.name, color: typography.name.color || colors.heading, fontFamily: design.headingFont }} />
                    <Editable as="h2" value={data.title} path="title" {...editableProps} style={{ ...typography.title, color: typography.title.color || colors.primary, fontFamily: design.headingFont }} />
                 </div>
                 <div className={`flex flex-wrap gap-x-4 gap-y-1 mt-2 ${layout.header.alignment === 'spaceBetween' ? 'text-right' : ''}`} style={{...typography.contact, color: typography.contact.color || colors.text}}>
                    {data.contact.email && <div className="flex items-center gap-1.5">{!design.hideIcons && <Mail className="w-4 h-4"/>}<Editable value={data.contact.email} path="contact.email" {...editableProps} /></div>}
                    {data.contact.phone && <div className="flex items-center gap-1.5">{!design.hideIcons && <Phone className="w-4 h-4"/>}<Editable value={data.contact.phone} path="contact.phone" {...editableProps} /></div>}
                    {data.contact.linkedin && <div className="flex items-center gap-1.5">{!design.hideIcons && <Linkedin className="w-4 h-4"/>}<Editable value={data.contact.linkedin} path="contact.linkedin" {...editableProps} /></div>}
                    {data.contact.website && <div className="flex items-center gap-1.5">{!design.hideIcons && <Globe className="w-4 h-4"/>}<Editable value={data.contact.website} path="contact.website" {...editableProps} /></div>}
                </div>
            </header>
            
            <main className={layout.type === LayoutType.TWO_COLUMN ? 'grid' : ''} style={{gap: layout.gap, gridTemplateColumns: layout.ratio === 'ONE_THIRD_TWO_THIRDS' ? '1fr 2fr' : '2fr 1fr'}}>
                {layout.type === LayoutType.TWO_COLUMN ? (
                    <>
                        <aside className={layout.ratio === 'TWO_THIRDS_ONE_THIRD' ? 'order-last' : ''}>
                           <ProfilePicture />
                           {layout.sidebarSections.map(name => <Section key={name} name={name} />)}
                        </aside>
                        <div>
                           {mainColumnSections.map(name => name !== 'experience' && <Section key={name} name={name} />)}
                           {experiencePages[0] && renderExperienceChunk(experiencePages[0], true)}
                        </div>
                    </>
                ) : (
                    <div>
                        {mainColumnSections.map(name => name !== 'experience' && <Section key={name} name={name} />)}
                        {experiencePages[0] && renderExperienceChunk(experiencePages[0], true)}
                    </div>
                )}
            </main>
        </Page>
        {experiencePages.slice(1).map((chunk, pageIndex) => (
            <Page key={`page-${pageIndex+1}`}>
                {renderExperienceChunk(chunk, false)}
            </Page>
        ))}
    </div>
  );
};

export default TemplateDynamic;