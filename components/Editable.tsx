import React, { useRef, useEffect } from 'react';
import { SparklesIcon } from './Icons';

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
  onAITooltipOpen: (path: string, selectedText: string, element: HTMLElement) => void;
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
  editingPath,
  onAITooltipOpen
}) => {
  const elementRef = useRef<HTMLElement>(null);
  const isFocused = editingPath === path;
  const isEditingByAI = isFocused && !document.hasFocus(); // A heuristic to guess if AI is editing
  const isArrayValue = Array.isArray(value);
  const Component = as || 'div';

  const displayValue = isArrayValue ? value.join('\n') : (value || '');

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
      if (newText !== displayValue) {
        const newValue = isArrayValue ? newText.split('\n').filter(line => line.trim() !== '') : newText;
        onUpdate(path, newValue);
      }
    }
    // A small delay allows the AI button click to register before we lose focus state
    setTimeout(() => onFocus(null), 100); 
  };

  const handleFocus = () => {
    if (editMode) {
      onFocus(path);
    }
  };

  const handleAIButtonClick = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const element = elementRef.current;
      if (element) {
          onAITooltipOpen(path, element.innerText, element);
      }
  };

  return (
    <div className="relative group">
        <Component
            ref={elementRef as any}
            className={`${className || ''} ${isEditingByAI ? 'animate-pulse bg-blue-100 dark:bg-blue-900/50 rounded-sm' : ''} ${editMode ? 'focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-text' : ''}`}
            style={style}
            data-path={path}
            contentEditable={editMode}
            suppressContentEditableWarning={true}
            onFocus={handleFocus}
            onBlur={handleBlur}
            key={path + displayValue}
        >
            {children}
        </Component>
        {editMode && isFocused && (
             <button 
                onClick={handleAIButtonClick}
                onMouseDown={(e) => e.preventDefault()} // Prevent this button from stealing focus on click
                className="absolute top-1/2 -right-1 -translate-y-1/2 translate-x-full p-1 bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 text-primary transition-all opacity-0 group-focus-within:opacity-100"
                aria-label="Ask AI to improve this text"
            >
                <SparklesIcon className="w-4 h-4" />
            </button>
        )}
    </div>
  );
};

export default Editable;