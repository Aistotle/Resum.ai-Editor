

import React, { useEffect, useState } from 'react';
import { ResumeData, DesignOptions, Experience, SectionId, TemplateProps } from '../types';
import { Mail, Phone, Linkedin, Globe, MapPin, Menu } from './Icons';
import Editable from './Editable';

const StyleInjector: React.FC<{ design: DesignOptions }> = ({ design }) => (
  <style>{`
    .resume-modern {
      --primary-color: ${design.primaryColor};
      --heading-font: '${design.headingFont}', sans-serif;
      --body-font: '${design.bodyFont}', sans-serif;
    }
  `}</style>
);

const Section: React.FC<{ title: string; children: React.ReactNode; id: string }> = ({ title, children, id }) => (
  <section id={id} data-section-id={id} className="mb-8 scroll-mt-24">
    <h3 style={{fontFamily: 'var(--heading-font)', color: 'var(--primary-color)'}} className="text-sm font-bold tracking-widest uppercase mb-4 border-b border-gray-200 pb-2">{title}</h3>
    {children}
  </section>
);

const Page: React.FC<{children: React.ReactNode}> = ({ children }) => (
    <div 
        className="bg-white shadow-2xl mb-8 mx-auto p-12 text-gray-800 resume-modern transition-all duration-300 resume-page"
        style={{ 
            width: '100%', 
            maxWidth: '8.27in', 
            height: '11.69in', 
            overflow: 'hidden',
            boxSizing: 'border-box',
            fontFamily: 'var(--body-font)'
        }}
    >
        {children}
    </div>
);

// Heuristic function to estimate space taken by a job experience
const getJobWeight = (job: Experience): number => {
    const BASE_WEIGHT = 20; // For metadata like role, company, etc.
    const CHAR_WEIGHT = 0.1; // Weight per character in description
    const BULLET_WEIGHT = 5; // Weight per bullet point
    
    const descriptionLength = job.description.join(' ').length;
    const bulletCount = job.description.length;

    return BASE_WEIGHT + (descriptionLength * CHAR_WEIGHT) + (bulletCount * BULLET_WEIGHT);
};

const ResumeTemplate: React.FC<TemplateProps> = (props) => {
  const { data, design, onOverflowChange, t, editMode, onUpdate, onFocus, editingPath, onAITooltipOpen, layout, onLayoutChange } = props;
  
  const [draggedItem, setDraggedItem] = useState<SectionId | null>(null);
  const [dropTarget, setDropTarget] = useState<{ column: 'sidebar' | 'main'; targetId: SectionId | null } | null>(null);

  // Constants for pagination logic. Tuned for this template's layout.
  const PAGE_1_MAX_WEIGHT = 150; 
  const SUBSEQUENT_PAGE_MAX_WEIGHT = 550;

  const page1Experience: Experience[] = [];
  const remainingExperience: Experience[] = [];

  if (data.experience.length > 0) {
      let currentWeight = 0;
      const pageLimit = PAGE_1_MAX_WEIGHT;
      let page1Done = false;

      data.experience.forEach(job => {
          if (page1Done) {
              remainingExperience.push(job);
              return;
          }
          const jobWeight = getJobWeight(job);
          if (currentWeight + jobWeight > pageLimit && page1Experience.length > 0) {
              page1Done = true;
              remainingExperience.push(job);
          } else {
              page1Experience.push(job);
              currentWeight += jobWeight;
          }
      });
  }
  
  const subsequentPages: Experience[][] = [];

  if (remainingExperience.length > 0) {
      let currentPage: Experience[] = [];
      let currentWeight = 0;
      remainingExperience.forEach(job => {
        const jobWeight = getJobWeight(job);
        if (currentWeight + jobWeight > SUBSEQUENT_PAGE_MAX_WEIGHT && currentPage.length > 0) {
            subsequentPages.push(currentPage);
            currentPage = [];
            currentWeight = 0;
        }
        currentPage.push(job);
        currentWeight += jobWeight;
      });
      subsequentPages.push(currentPage);
  }

  useEffect(() => {
    onOverflowChange(subsequentPages.length > 1);
  }, [subsequentPages.length, onOverflowChange]);
  
  // Helper to get the original index of a job
  const getOriginalIndex = (jobToFind: Experience) => data.experience.findIndex(job => job === jobToFind);

  const editableProps = { editMode, onUpdate, onFocus, editingPath, onAITooltipOpen };
  
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, sectionId: SectionId) => {
    if (editMode) {
        e.preventDefault();
        return;
    }
    e.dataTransfer.setData('sectionId', sectionId);
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => setDraggedItem(sectionId), 0); // Use timeout to allow DOM to update
  };

  const getDragAfterElement = (container: HTMLElement, y: number): { element: HTMLElement | null, isFirst: boolean } => {
    const draggableElements = Array.from(container.querySelectorAll('.draggable-section:not(.dragging)')) as HTMLElement[];

    if (draggableElements.length === 0) {
        return { element: null, isFirst: true };
    }
    
    const firstElementBox = draggableElements[0].getBoundingClientRect();
    if (y < firstElementBox.top) {
        return { element: draggableElements[0], isFirst: true };
    }

    return { element: draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > (closest.offset || Number.NEGATIVE_INFINITY)) {
            return { offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY, element: null as HTMLElement | null }).element, isFirst: false };
  }

  const handleDragOver = (e: React.DragEvent<HTMLElement>, column: 'sidebar' | 'main') => {
      if (editMode) return;
      e.preventDefault();
      const container = e.currentTarget;
      const { element: afterElement, isFirst } = getDragAfterElement(container, e.clientY);
      
      const targetId = afterElement ? afterElement.dataset.sectionId as SectionId : null;
      setDropTarget({ column, targetId });
  };
  
  const handleDrop = (e: React.DragEvent<HTMLElement>, column: 'sidebar' | 'main') => {
      if (editMode) return;
      e.preventDefault();
      const draggedId = e.dataTransfer.getData('sectionId') as SectionId;
      if (draggedId && dropTarget) {
          onLayoutChange(draggedId, dropTarget.targetId, column);
      }
      setDraggedItem(null);
      setDropTarget(null);
  };

  const DraggableSectionWrapper: React.FC<{ sectionId: SectionId, children: React.ReactNode }> = ({ sectionId, children }) => (
      <div
          draggable={!editMode}
          onDragStart={(e) => handleDragStart(e, sectionId)}
          onDragEnd={() => { setDraggedItem(null); setDropTarget(null); }}
          data-section-id={sectionId}
          className={`draggable-section ${draggedItem === sectionId ? 'dragging' : ''}`}
      >
          {!editMode && <Menu className="absolute top-2 right-2 w-5 h-5 text-gray-400 opacity-20 group-hover:opacity-100 transition-opacity" />}
          {children}
      </div>
  );
  
  const renderSection = (sectionId: SectionId) => {
      const sectionMap: Record<SectionId, React.ReactNode> = {
        basics: null, // Rendered in header
        summary: data.summary ? <Section id="summary" title={t('sectionSummary')}><Editable value={data.summary} path="summary" {...editableProps} isHtml={true} className="text-gray-700 leading-relaxed prose prose-sm max-w-none dark:prose-invert" /></Section> : null,
        profiles: data.profiles && data.profiles.length > 0 ? <Section id="profiles" title={t('sectionProfiles')}>...</Section> : null, // placeholder
        experience: page1Experience.length > 0 ? <Section id="experience" title={t('sectionExperience')}>
            {page1Experience.map((job) => {
                const globalJobIndex = getOriginalIndex(job);
                return (
                <div key={globalJobIndex} className="mb-7 last:mb-0">
                    <div className="flex justify-between items-baseline mb-1">
                    <Editable as="h4" value={job.role} path={`experience[${globalJobIndex}].role`} {...editableProps} className="text-lg font-bold text-neutral" />
                    </div>
                    <div className="flex justify-between items-baseline mb-2">
                        <Editable value={job.company} path={`experience[${globalJobIndex}].company`} {...editableProps} className="text-md font-semibold" style={{color: 'var(--primary-color)'}} />
                        <div className="text-sm text-gray-500 flex items-center gap-1"><MapPin className="w-3 h-3"/><Editable value={job.location} path={`experience[${globalJobIndex}].location`} {...editableProps} /></div>
                    </div>
                    <Editable value={job.period} path={`experience[${globalJobIndex}].period`} {...editableProps} className="text-xs font-medium text-gray-600 mb-2" />
                    <ul className="list-disc list-inside text-gray-700 space-y-1.5 pl-2 leading-normal">
                    {job.description.map((desc, i) => <li key={i}><Editable value={desc} path={`experience[${globalJobIndex}].description[${i}]`} {...editableProps} /></li>)}
                    </ul>
                </div>
                )
            })}
            </Section> : null,
        education: data.education && data.education.length > 0 ? <Section id="education" title={t('sectionEducation')}>
            {data.education.map((edu, index) => (
                <div key={index} className="mb-4 last:mb-0">
                <Editable as="h4" value={edu.degree} path={`education[${index}].degree`} {...editableProps} className="font-bold text-neutral text-md" />
                <Editable value={edu.institution} path={`education[${index}].institution`} {...editableProps} className="text-gray-700 text-sm" />
                <div className="flex text-xs text-gray-500 mt-1">
                    <Editable value={edu.period} path={`education[${index}].period`} {...editableProps} />
                    <span className="mx-1">&bull;</span>
                    <Editable value={edu.location} path={`education[${index}].location`} {...editableProps} />
                </div>
                </div>
            ))}
            </Section> : null,
        skills: data.skills && data.skills.length > 0 ? <Section id="skills" title={t('sectionSkills')}>
            <ul className="flex flex-wrap gap-2">
                {data.skills.map((skill, index) => (
                <li key={index} className="bg-secondary text-xs font-semibold px-3 py-1 rounded" style={{color: 'var(--primary-color)'}}>
                    <Editable value={skill} path={`skills[${index}]`} {...editableProps} />
                </li>
                ))}
            </ul>
        </Section> : null,
        projects: null,
        certifications: null,
        languages: null,
        interests: null
      };
      return sectionMap[sectionId] ? <DraggableSectionWrapper sectionId={sectionId}>{sectionMap[sectionId]}</DraggableSectionWrapper> : null;
  }

  return (
    <div className="transition-all duration-300">
      <StyleInjector design={design} />
      <Page>
        <header id="basics" data-section-id="basics" className="flex justify-between items-start mb-10 scroll-mt-24">
          <div>
            <Editable as="h1" value={data.name} path="name" {...editableProps} className="text-5xl font-bold text-neutral tracking-tight" style={{fontFamily: 'var(--heading-font)'}} />
            <Editable as="h2" value={data.title} path="title" {...editableProps} className="text-2xl font-light mt-1" style={{color: 'var(--primary-color)'}}/>
          </div>
          <div className="text-right text-sm space-y-1 text-gray-600">
            {data.contact.email && <div className="flex items-center justify-end gap-2 hover:text-primary"><Editable value={data.contact.email} path="contact.email" {...editableProps} /><Mail className="w-4 h-4" /></div>}
            {data.contact.phone && <div className="flex items-center justify-end gap-2"><Editable value={data.contact.phone} path="contact.phone" {...editableProps} /><Phone className="w-4 h-4" /></div>}
            {data.contact.linkedin && <div className="flex items-center justify-end gap-2 hover:text-primary"><Editable value={data.contact.linkedin} path="contact.linkedin" {...editableProps} /><Linkedin className="w-4 h-4" /></div>}
            {data.contact.website && <div className="flex items-center justify-end gap-2 hover:text-primary"><Editable value={data.contact.website} path="contact.website" {...editableProps} /><Globe className="w-4 h-4" /></div>}
          </div>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <aside 
            className="md:col-span-1"
            onDragOver={(e) => handleDragOver(e, 'sidebar')}
            onDrop={(e) => handleDrop(e, 'sidebar')}
            onDragLeave={() => setDropTarget(null)}
          >
            {data.profilePicture && (
                <div className="mb-8">
                    <img 
                        src={data.profilePicture} 
                        alt={data.name} 
                        className={`w-40 h-40 object-cover mx-auto shadow-lg ${design.profilePictureShape === 'circle' ? 'rounded-full' : 'rounded-lg'}`}
                    />
                </div>
            )}
            {layout.sidebar.map((sectionId, index) => (
                <React.Fragment key={sectionId}>
                    {dropTarget?.column === 'sidebar' && dropTarget?.targetId === sectionId && <div className="drop-indicator" />}
                    {renderSection(sectionId)}
                </React.Fragment>
            ))}
             {dropTarget?.column === 'sidebar' && dropTarget?.targetId === null && <div className="drop-indicator" />}
          </aside>
          <div 
            className="md:col-span-2"
            onDragOver={(e) => handleDragOver(e, 'main')}
            onDrop={(e) => handleDrop(e, 'main')}
            onDragLeave={() => setDropTarget(null)}
          >
            {layout.main.map((sectionId, index) => (
                 <React.Fragment key={sectionId}>
                    {dropTarget?.column === 'main' && dropTarget?.targetId === sectionId && <div className="drop-indicator" />}
                    {renderSection(sectionId)}
                </React.Fragment>
            ))}
            {dropTarget?.column === 'main' && dropTarget?.targetId === null && <div className="drop-indicator" />}
          </div>
        </main>
      </Page>
      
      {subsequentPages.map((chunk, pageIndex) => (
        <Page key={`exp-page-${pageIndex}`}>
            <section data-section-id="experience" className="scroll-mt-24">
                <h3 style={{fontFamily: 'var(--heading-font)', color: 'var(--primary-color)'}} className="text-sm font-bold tracking-widest uppercase mb-4 border-b border-gray-200 pb-2">{`${t('sectionExperience')} (${t('experienceContinued')})`}</h3>
                {chunk.map((job) => {
                    const globalJobIndex = getOriginalIndex(job);
                    return (
                    <div key={globalJobIndex} className="mb-7 last:mb-0">
                        <div className="flex justify-between items-baseline mb-1">
                        <Editable as="h4" value={job.role} path={`experience[${globalJobIndex}].role`} {...editableProps} className="text-lg font-bold text-neutral" />
                        <Editable value={job.period} path={`experience[${globalJobIndex}].period`} {...editableProps} className="text-sm font-medium text-gray-600" />
                        </div>
                        <div className="flex justify-between items-baseline mb-2">
                        <Editable value={job.company} path={`experience[${globalJobIndex}].company`} {...editableProps} className="text-md font-semibold" style={{color: 'var(--primary-color)'}} />
                        <div className="text-sm text-gray-500 flex items-center gap-1"><MapPin className="w-3 h-3"/><Editable value={job.location} path={`experience[${globalJobIndex}].location`} {...editableProps} /></div>
                        </div>
                        <ul className="list-disc list-inside text-gray-700 space-y-1.5 pl-2 leading-normal">
                        {job.description.map((desc, i) => <li key={i}><Editable value={desc} path={`experience[${globalJobIndex}].description[${i}]`} {...editableProps} /></li>)}
                        </ul>
                    </div>
                    )
                })}
            </section>
        </Page>
      ))}
    </div>
  );
};

export default ResumeTemplate;