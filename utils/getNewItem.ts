import { ResumeData } from "../types";

export const getNewItem = (path: keyof ResumeData) => {
    switch(path) {
        case 'experience':
            return { role: '', company: '', period: '', location: '', description: [''] };
        case 'education':
            return { degree: '', institution: '', period: '', location: '' };
        case 'profiles':
            return { network: '', username: '', url: '' };
        case 'skills':
            return '';
        case 'projects':
            return { name: '', description: '' };
        case 'certifications':
            return { name: '', issuer: '', date: '' };
        case 'languages':
            return { name: '', level: '' };
        case 'interests':
            return '';
        default:
            return {};
    }
};

export const cleanupHtml = (dirtyHtml: string): string => {
  if (!dirtyHtml) return '';

  const parser = new DOMParser();
  const doc = parser.parseFromString(dirtyHtml, 'text/html');
  const body = doc.body;

  const walker = doc.createTreeWalker(body, NodeFilter.SHOW_ELEMENT);
  const nodesToModify: (() => void)[] = [];

  while (walker.nextNode()) {
    const node = walker.currentNode as HTMLElement;

    // Plan modifications to avoid altering the list while iterating
    if (node.tagName === 'B') {
      nodesToModify.push(() => {
        const strong = doc.createElement('strong');
        while (node.firstChild) {
            strong.appendChild(node.firstChild);
        }
        node.parentNode?.replaceChild(strong, node);
      });
    } else if (node.tagName === 'I') {
      nodesToModify.push(() => {
        const em = doc.createElement('em');
         while (node.firstChild) {
            em.appendChild(node.firstChild);
        }
        node.parentNode?.replaceChild(em, node);
      });
    } else if (node.tagName === 'FONT') {
       nodesToModify.push(() => {
          const span = doc.createElement('span');
          let style = '';
          const color = node.getAttribute('color');
          if (color) style += `color: ${color}; `;

          if (style) {
            span.setAttribute('style', style.trim());
          }
          
          while (node.firstChild) {
              span.appendChild(node.firstChild);
          }
          
          // Replace the font tag with the new span, or just its contents if no styling was applied
          if (span.hasAttributes()) {
             node.parentNode?.replaceChild(span, node);
          } else {
             const fragment = doc.createDocumentFragment();
             while (span.firstChild) {
                 fragment.appendChild(span.firstChild);
             }
             node.parentNode?.replaceChild(fragment, node);
          }
       });
    }
  }

  // Execute modifications in reverse to avoid issues with node list changes
  nodesToModify.reverse().forEach(fn => fn());

  return body.innerHTML;
};
