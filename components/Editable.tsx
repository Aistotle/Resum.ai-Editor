import React, { useRef, useEffect } from 'react';

type EditableProps = {
  value: any; // Can be string or string[]
  path: string;
  className?: string;
  as?: React.ElementType;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  editMode: boolean;
  onUpdate: (path: string, value: any) => void;
  onFocus: (path: string | null) => void;
  editingPath: string | null;
};

const Editable: React.FC<EditableProps> = ({
  value,
  path,
  className,
  as,
  style,
  children,
  editMode,
  onUpdate,
  onFocus,
  editingPath
}) => {
  const elementRef = useRef<HTMLElement>(null);
  const isEditingByAI = editingPath === path;
  const isArrayValue = Array.isArray(value);
  const Component = as || 'div';

  // Convert array to string with newlines for editing, or use the plain string value
  const displayValue = isArrayValue ? value.join('\n') : (value || '');

  // This effect ensures the element's content is updated if the prop changes from outside (e.g., sidebar edit)
  // without causing the cursor to jump during direct editing.
  useEffect(() => {
    const element = elementRef.current;
    if (element && displayValue !== element.innerText) {
      element.innerText = displayValue;
    }
  }, [displayValue]);

  const handleBlur = () => {
    const element = elementRef.current;
    if (element) {
      const newText = element.innerText;
      // Only trigger update if the text has actually changed
      if (newText !== displayValue) {
        // If original value was an array, split the text back into an array
        const newValue = isArrayValue ? newText.split('\n').filter(line => line.trim() !== '') : newText;
        onUpdate(path, newValue);
      }
    }
    onFocus(null); // Clear the active editing path
  };

  const handleFocus = () => {
    if (editMode) {
      onFocus(path);
    }
  };

  return (
    <Component
      ref={elementRef as any}
      className={`${className || ''} ${isEditingByAI ? 'animate-pulse bg-blue-100 dark:bg-blue-900/50 rounded-sm' : ''} ${editMode ? 'focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-text' : ''}`}
      style={style}
      data-path={path}
      contentEditable={editMode}
      suppressContentEditableWarning={true}
      onFocus={handleFocus}
      onBlur={handleBlur}
      // Use a key to ensure React re-renders the component if the data is updated externally
      // This is crucial for keeping the contentEditable in sync.
      key={path + displayValue}
    >
      {children}
    </Component>
  );
};

export default Editable;