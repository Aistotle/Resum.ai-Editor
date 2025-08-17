import React, { useEffect, useMemo } from 'react';
import { ResumeData, DesignOptions, Experience } from '../types';
import Editable from './Editable';

// =====================
// Template Props
// =====================
interface TemplateProps {
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

// =====================
// Style Injector — color + fonts + page sizing
// =====================
const StyleInjector: React.FC<{ design: DesignOptions }> = ({ design }) => (
  <style>{`
    .modern-split {
      --primary: ${design.primaryColor};
      --heading-font: '${design.headingFont}', system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
      --body-font: '${design.bodyFont}', system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
      --ink: #0f172a; /* slate-900 */
      --muted: #475569; /* slate-600 */
      --line: #e2e8f0; /* slate-200 */
      --chip: #eef2ff; /* indigo-50 */
    }

    .modern-split { font-family: var(--body-font); color: var(--ink); font-size: 10pt; line-height: 1.5; }
    .modern-split h1, .modern-split h2, .modern-split h3 { font-family: var(--heading-font); }

    .resume-page { width: 8.5in; min-height: 11in; box-sizing: border-box; }
    .pg { display: grid; grid-template-columns: 1fr 32%; gap: 1.25rem; }

    .avoid-break { break-inside: avoid; }

    .photo { width: 100%; aspect-ratio: 1/1; object-fit: cover; background: #cbd5e1; }

    .quote { position: relative; padding: 16px 16px 16px 28px; background: #f8fafc; border-left: 4px solid var(--primary); border-radius: 8px; color: var(--muted); }

    .ribbon { height: 22px; background: var(--primary); color: #fff; letter-spacing: .08em; font-weight: 700; display: inline-flex; align-items: center; padding: 0 12px; border-radius: 0 0 4px 4px; }

    .hr { height: 1px; background: var(--line); width: 100%; }

    @media print {
      .resume-page { box-shadow: none !important; }
      .no-print-shadow { box-shadow: none !important; }
    }
  `}</style>
);

// =====================
// Pagination heuristic
// =====================
const JOB_BASE = 28;
const CHAR_W = 0.09;
const BULLET_W = 6;
const HEADER_COST = 120;
const RIGHT_RAIL_COST = 260;
const PAGE1_MAX = 560;
const PAGE_N_MAX = 660;

const jobWeight = (job: Experience) => {
  const textLen = (job.description ?? []).join(' ').length;
  return JOB_BASE + textLen * CHAR_W + (job.description?.length ?? 0) * BULLET_W;
};

const buildExperiencePages = (data: ResumeData) => {
  const pages: { items: Experience[] }[] = [];
  pages.push({ items: [] });

  let page = pages[0];
  let used = HEADER_COST + RIGHT_RAIL_COST;
  let cap = PAGE1_MAX;

  (data.experience ?? []).forEach((job) => {
    const w = jobWeight(job);
    if (used + w > cap) {
      pages.push({ items: [] });
      page = pages[pages.length - 1];
      used = 0;
      cap = PAGE_N_MAX;
    }
    page.items.push(job);
    used += w;
  });

  return pages;
};

// =====================
// Template Component
// =====================
const TemplateModernSplit: React.FC<TemplateProps> = (props) => {
  const { data, design, onOverflowChange, t, editMode, onUpdate, onFocus, editingPath, onAITooltipOpen } = props;
  const pages = useMemo(() => buildExperiencePages(data), [data]);
  const getOriginalIndex = (jobToFind: Experience) => data.experience.findIndex(job => job === jobToFind);
  const editableProps = { editMode, onUpdate, onFocus, editingPath, onAITooltipOpen };

  useEffect(() => {
    onOverflowChange(pages.length > 2);
  }, [pages, onOverflowChange]);

  const contactChip = (icon: string, value: string | undefined, path: string) => value ? (
    <div className="avoid-break" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ fontSize: 12, color: 'var(--muted)' }}>{icon}</span>
      <Editable value={value} path={path} {...editableProps} className="text-[11px]" />
    </div>
  ) : null;

  const roleLine = (idx: number, role?: string, company?: string, range?: string) => (
    <div className="avoid-break" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <Editable as="strong" value={role ?? ''} path={`experience[${idx}].role`} {...editableProps} />
      <span>•</span>
      <Editable value={company ?? ''} path={`experience[${idx}].company`} {...editableProps} className="text-slate-600" />
      <span>•</span>
      <Editable value={range ?? ''} path={`experience[${idx}].period`} {...editableProps} className="text-slate-600" />
    </div>
  );

  return (
    <div className="modern-split transition-all duration-300">
      <StyleInjector design={design} />

      {pages.map((page, pageIndex) => (
        <div key={pageIndex} className="resume-page bg-white no-print-shadow shadow-xl p-10 mb-8">
            {pageIndex === 0 ? (
                 <>
                    <div className="ribbon">{t('labelResume')}</div>
                    <div className="pg mt-5">
                      {/* LEFT — MAIN */}
                      <div>
                        <div id="basics" data-section-id="basics" className="avoid-break scroll-mt-24">
                          <Editable as="h1" value={data.name} path="name" {...editableProps} style={{ fontSize: 36, lineHeight: 1.1 }} />
                          <Editable as="div" value={data.title ?? ''} path="title" {...editableProps} className="text-slate-600 mt-1" />
                        </div>

                        <div className="hr my-4" />
                        <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
                          {contactChip('📍', data.contact?.location, 'contact.location')}
                          {contactChip('📞', data.contact?.phone, 'contact.phone')}
                          {contactChip('✉️', data.contact?.email, 'contact.email')}
                          {contactChip('🔗', data.contact?.website, 'contact.website')}
                        </div>

                        <div id="experience" data-section-id="experience" className="mt-8 scroll-mt-24">
                          <h2 style={{ color: 'var(--ink)', fontWeight: 700, letterSpacing: '.02em' }}>{t('sectionExperience')}</h2>
                          <div className="mt-3 flex flex-col gap-6">
                            {page.items.map((job) => {
                                const idx = getOriginalIndex(job);
                                return(
                                <article key={idx} className="avoid-break">
                                {roleLine(idx, job.role, job.company, job.period)}
                                <ul className="mt-2 list-disc pl-5">
                                    {(job.description ?? []).map((d, j) => (
                                    <li key={j} className="mb-1">
                                        <Editable value={d} path={`experience[${idx}].description[${j}]`} {...editableProps} />
                                    </li>
                                    ))}
                                </ul>
                                </article>
                            )})}
                          </div>
                        </div>

                        {(data.skills ?? []).length > 0 && (
                            <div id="skills" data-section-id="skills" className="mt-8 scroll-mt-24">
                                <h2 style={{ color: 'var(--ink)', fontWeight: 700 }}>{t('sectionSkills')}</h2>
                                <div className="flex flex-wrap gap-2 mt-3">
                                {(data.skills ?? []).map((skill: string, i: number) => (
                                    <div key={i} className="avoid-break bg-[color:var(--chip)] text-slate-700 text-[12px] px-3 py-1 rounded-full">
                                    <Editable value={skill} path={`skills[${i}]`} {...editableProps} />
                                    </div>
                                ))}
                                </div>
                            </div>
                        )}
                      </div>

                      {/* RIGHT — RAIL */}
                      <aside>
                        <div className="avoid-break">
                          {data.profilePicture ? (
                            <img src={data.profilePicture} alt="profile" className={`photo ${design.profilePictureShape === 'circle' ? 'rounded-full' : 'rounded-lg'}`} />
                          ) : (
                            <div className="photo rounded-lg" />
                          )}
                        </div>

                        <div id="summary" data-section-id="summary" className="quote mt-4 scroll-mt-24">
                          <Editable value={data.summary ?? ''} path="summary" {...editableProps} />
                        </div>

                        <div id="education" data-section-id="education" className="mt-6 scroll-mt-24">
                          <h2 style={{ color: 'var(--ink)', fontWeight: 700 }}>{t('sectionEducation')}</h2>
                          <div className="mt-3 flex flex-col gap-4">
                            {(data.education ?? []).map((ed, i) => (
                              <div key={i} className="avoid-break">
                                <Editable as="strong" value={ed.degree ?? ''} path={`education[${i}].degree`} {...editableProps} />
                                <div className="text-slate-600">
                                  <Editable value={ed.institution ?? ''} path={`education[${i}].institution`} {...editableProps} />
                                </div>
                                <div className="text-slate-500 text-[12px]">
                                  <Editable value={ed.period ?? ''} path={`education[${i}].period`} {...editableProps} />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </aside>
                    </div>
                 </>
            ) : (
                <div className="pg">
                    <div data-section-id="experience">
                        <h2 style={{ color: 'var(--ink)', fontWeight: 700 }}>{t('sectionExperience')} — {t('labelContinued')}</h2>
                        <div className="mt-3 flex flex-col gap-6">
                            {page.items.map((job) => {
                                const idx = getOriginalIndex(job);
                                return (
                                <article key={idx} className="avoid-break">
                                {roleLine(idx, job.role, job.company, job.period)}
                                <ul className="mt-2 list-disc pl-5">
                                    {(job.description ?? []).map((d, j) => (
                                    <li key={j} className="mb-1">
                                        <Editable value={d} path={`experience[${idx}].description[${j}]`} {...editableProps} />
                                    </li>
                                    ))}
                                </ul>
                                </article>
                            )})}
                        </div>
                        {(data.projects?.length ?? 0) > 0 && (
                            <div id="projects" data-section-id="projects" className="mt-8 scroll-mt-24">
                                <h2 style={{ color: 'var(--ink)', fontWeight: 700 }}>{t('sectionProjects')}</h2>
                                <div className="mt-3 flex flex-col gap-4">
                                {data.projects!.map((p, i) => (
                                    <div key={i} className="avoid-break">
                                    <Editable as="strong" value={p.name ?? ''} path={`projects[${i}].name`} {...editableProps} />
                                    <div className="text-slate-600">
                                        <Editable value={p.description ?? ''} path={`projects[${i}].description`} {...editableProps} />
                                    </div>
                                    </div>
                                ))}
                                </div>
                            </div>
                        )}
                    </div>
                     <aside>
                        {(data.certifications?.length ?? 0) > 0 && (
                        <div id="certifications" data-section-id="certifications" className="mt-0 scroll-mt-24">
                            <h2 style={{ color: 'var(--ink)', fontWeight: 700 }}>{t('sectionCertifications')}</h2>
                            <div className="mt-3 flex flex-col gap-3">
                            {data.certifications!.map((c, i) => (
                                <div key={i} className="avoid-break">
                                <Editable as="strong" value={c.name ?? ''} path={`certifications[${i}].name`} {...editableProps} />
                                <div className="text-slate-600">
                                    <Editable value={c.issuer ?? ''} path={`certifications[${i}].issuer`} {...editableProps} />
                                </div>
                                <div className="text-slate-500 text-[12px]">
                                    <Editable value={c.date ?? ''} path={`certifications[${i}].date`} {...editableProps} />
                                </div>
                                </div>
                            ))}
                            </div>
                        </div>
                        )}
                        {(data.languages?.length ?? 0) > 0 && (
                        <div id="languages" data-section-id="languages" className="mt-8 scroll-mt-24">
                            <h2 style={{ color: 'var(--ink)', fontWeight: 700 }}>{t('sectionLanguages')}</h2>
                            <div className="mt-3 flex flex-col gap-2">
                            {data.languages!.map((l, i) => (
                                <div key={i} className="avoid-break" style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                                <Editable value={l.name ?? ''} path={`languages[${i}].name`} {...editableProps} />
                                <Editable value={l.level ?? ''} path={`languages[${i}].level`} {...editableProps} className="text-slate-600" />
                                </div>
                            ))}
                            </div>
                        </div>
                        )}
                        {(data.interests?.length ?? 0) > 0 && (
                        <div id="interests" data-section-id="interests" className="mt-8 scroll-mt-24">
                            <h2 style={{ color: 'var(--ink)', fontWeight: 700 }}>{t('sectionInterests')}</h2>
                            <div className="mt-2 flex flex-wrap gap-2 text-[12px] text-slate-700">
                            {data.interests!.map((it: string, i: number) => (
                                <div key={i} className="px-2 py-1 rounded-full bg-[color:var(--chip)]">
                                <Editable value={it} path={`interests[${i}]`} {...editableProps} />
                                </div>
                            ))}
                            </div>
                        </div>
                        )}
                    </aside>
                </div>
            )}

            {pageIndex === 0 && (
                <div className="absolute bottom-10 left-10 text-[11px] text-slate-500">
                    <Editable value={data.footer ?? ''} path="footer" {...editableProps} />
                </div>
            )}
        </div>
      ))}
    </div>
  );
};

export default TemplateModernSplit;