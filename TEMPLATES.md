# Guide: Creating New Resume Templates

This guide provides a step-by-step process for creating and integrating new resume templates into the Obedai application. To ensure full compatibility with features like live editing, dynamic styling, drag-and-drop layouts, and smart pagination, new templates **must** adhere to the structure and responsibilities outlined below.

## 1. File Structure

1.  Create a new `.tsx` file for your template in the `src/components/` directory (e.g., `TemplateMinimalist.tsx`).
2.  The component should be a `React.FC` that accepts `TemplateProps`, which should be imported from `../types`.

```typescript
// src/components/TemplateMinimalist.tsx
import React from 'react';
import { TemplateProps, Experience } from '../types'; // Import TemplateProps
import Editable from './Editable';

const TemplateMinimalist: React.FC<TemplateProps> = (props) => {
  const { 
    data, 
    design, 
    editMode, 
    onUpdate, 
    onOverflowChange, 
    t, 
    editingPath, 
    onFocus, 
    onAITooltipOpen, 
    layout, 
    onLayoutChange 
  } = props;
  
  // ... Template logic and JSX ...
};

export default TemplateMinimalist;
```

## 2. Core Responsibilities of a Template

Your template component is responsible for rendering the resume data and handling several key interactive features.

### A. Live Text Editing

Every piece of text that comes from the `ResumeData` object **must** be rendered using the `<Editable />` component. This is critical for both the "Enable Live Editing" toggle and the contextual "Ask AI" tooltip.

-   **`value`**: The text content to display.
-   **`path`**: A string representing the location of the data in the `ResumeData` object (e.g., `"name"`, `"experience[0].role"`). This is **essential** for updates to work.
-   **`editMode`**: Pass the `editMode` prop directly.
-   **`onUpdate`**: Pass the `onUpdate` prop directly.
-   **`onFocus`**: Pass this prop to track which element is currently being edited.
-   **`editingPath`**: Pass this prop to enable the AI "thinking" animation.
-   **`onAITooltipOpen`**: Pass this prop to allow the AI tooltip to be triggered for this element.

**Example:**
```tsx
const editableProps = { editMode, onUpdate, onFocus, editingPath, onAITooltipOpen };

<Editable
  as="h1"
  value={data.name}
  path="name"
  {...editableProps}
  className="some-tailwind-classes"
/>

// For a nested value like a job description bullet point:
<Editable
  value={desc}
  path={`experience[${globalJobIndex}].description[${i}]`}
  {...editableProps}
/>
```

### B. Dynamic Styling

Your template should be customizable via the "Design" panel. Use the `design` prop to apply colors and fonts. A common way to do this is with a `<style>` tag and CSS variables.

-   `design.primaryColor`: The main accent color.
-   `design.headingFont`: The font for major headings (like the person's name).
-   `design.bodyFont`: The font for body text.

**Example using CSS Variables:**
```tsx
const StyleInjector: React.FC<{ design: DesignOptions }> = ({ design }) => (
  <style>{`
    .my-template-class {
      --primary-color: ${design.primaryColor};
      --heading-font: '${design.headingFont}', sans-serif;
      --body-font: '${design.bodyFont}', sans-serif;
    }
  `}</style>
);

// In your main component...
return (
  <div className="my-template-class">
    <StyleInjector design={design} />
    {/* ... rest of the template ... */}
    <h1 style={{ fontFamily: 'var(--heading-font)', color: 'var(--primary-color)' }}>
      {/* ... */}
    </h1>
  </div>
);
```

### C. Smart Pagination & Overflow Handling

To ensure resumes adhere to length constraints, your template must calculate how content fits onto virtual pages and report if it overflows.

1.  **Page Structure**: Wrap each virtual A4 page in a `div` with the class name `resume-page`. This is required for the PDF download feature. **Crucially**, this `div` must have a fixed A4 height to prevent content from stretching the page.

    ```css
    .resume-page {
        width: 8.27in;
        height: 11.69in; /* Not min-height! */
        overflow: hidden;
        box-sizing: border-box;
    }
    ```

2.  **Weight-Based Heuristic**: Implement a function to estimate the "weight" (i.e., the vertical space) of content, especially for variable-length items like job descriptions.

    ```typescript
    const getJobWeight = (job: Experience): number => {
        const BASE_WEIGHT = 20;
        const CHAR_WEIGHT = 0.1;
        const BULLET_WEIGHT = 5;
        const descriptionLength = job.description.join(' ').length;
        return BASE_WEIGHT + (descriptionLength * CHAR_WEIGHT) + (job.description.length * BULLET_WEIGHT);
    };
    ```

3.  **Calculate Pages**: Loop through your `data.experience` array, summing the weights. When the weight exceeds a `MAX_WEIGHT` constant (which you must tune for your specific design), start a new page.

4.  **Report Overflow**: Use the `useEffect` hook to call `onOverflowChange(true)` if the calculated number of pages exceeds your template's intended limit (usually 2, unless it's a special multi-page design).

    ```typescript
    useEffect(() => {
      // Assuming 'experiencePages' is an array of arrays, where each inner array is a page.
      const isOverflowing = experiencePages.length > 2; // Or > 1 for single-page templates
      onOverflowChange(isOverflowing);
    }, [experiencePages.length, onOverflowChange]);
    ```

### D. Internationalization (i18n)

All static text in your template (e.g., section titles like "Skills", "Education") **must** use the `t()` function prop to support language switching.

**Example:**
```tsx
// Correct
<Section title={t('sectionExperience')}>
  {/* ... */}
</Section>

// Incorrect
<Section title="Experience">
  {/* ... */}
</Section>
```

## 3. Boilerplate Snippet

Copy and paste this code into your new template file to get started quickly.

```tsx
import React, { useEffect } from 'react';
import { TemplateProps, Experience, DesignOptions } from '../types';
import Editable from './Editable';

const StyleInjector: React.FC<{ design: DesignOptions }> = ({ design }) => (
  <style>{`
    .my-new-template-class {
      --primary-color: ${design.primaryColor};
      --heading-font: '${design.headingFont}', sans-serif;
      --body-font: '${design.bodyFont}', sans-serif;
    }
  `}</style>
);

const Page: React.FC<{children: React.ReactNode}> = ({ children }) => (
    <div 
        className="bg-white shadow-2xl mb-8 mx-auto resume-page"
        style={{ width: '8.27in', height: '11.69in', overflow: 'hidden' }}
    >
        {children}
    </div>
);

const getJobWeight = (job: Experience): number => {
    const descriptionLength = job.description.join(' ').length;
    return 20 + (descriptionLength * 0.1) + (job.description.length * 5);
};

const YourNewTemplate: React.FC<TemplateProps> = (props) => {
  const { data, design, onOverflowChange, t, ...editableProps } = props;
  
  // PAGINATION LOGIC GOES HERE...
  const experiencePages: Experience[][] = [data.experience]; // Simplified for boilerplate

  useEffect(() => {
    onOverflowChange(experiencePages.length > 2);
  }, [experiencePages.length, onOverflowChange]);
  
  const getOriginalIndex = (jobToFind: Experience) => data.experience.findIndex(job => job === jobToFind);

  return (
    <div className="my-new-template-class transition-all duration-300">
      <StyleInjector design={design} />

      <Page>
        <div className="p-12">
            <header>
            <Editable
                as="h1"
                value={data.name}
                path="name"
                {...editableProps}
                style={{ fontFamily: 'var(--heading-font)' }}
            />
            </header>
            <main>
            <h2 style={{ fontFamily: 'var(--heading-font)' }}>{t('sectionExperience')}</h2>
            {/* Map through a page of experiences and use Editable for everything */}
            </main>
        </div>
      </Page>
    </div>
  );
};

export default YourNewTemplate;
```

## 4. App Integration Checklist

After creating your component, follow these steps to make it available to users:

1.  **`types.ts`**: Add a new identifier to the `TemplateIdentifier` enum.
    ```typescript
    export enum TemplateIdentifier {
      // ... existing templates
      MINIMALIST = 'MINIMALIST',
    }
    ```
2.  **`components/TemplatePreviews.tsx`**: Create a new SVG preview component (e.g., `MinimalistPreview`) for your template's layout.
3.  **`components/TemplateSwitcher.tsx`**: Import your new preview component and add a new `<TemplateOption />` to the switcher UI.
4.  **`components/ResumeEditor.tsx`**: Import your new template component and add a `case` for it in the `renderPreview` function.
5.  **`translations.ts`**: Add a new key for your template's name (e.g., `minimalist: "Minimalist"`) under both `da` and `en`.