import React, { useState, useCallback } from 'react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  disabled: boolean;
  t: (key: string) => string;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, disabled, t }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (!disabled && e.dataTransfer.files && e.dataTransfer.files[0]) {
       if (e.dataTransfer.files[0].type === 'application/pdf') {
         onFileSelect(e.dataTransfer.files[0]);
       } else {
         alert("Please upload a PDF file.");
       }
    }
  }, [disabled, onFileSelect]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  return (
    <div className="w-full max-w-lg mx-auto mt-8">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        className={`relative flex flex-col items-center justify-center w-full h-64 border rounded-xl cursor-pointer transition-colors
        ${disabled ? 'bg-secondary border-border cursor-not-allowed' :
        isDragging ? 'border-primary bg-secondary' : 'border-border bg-foreground hover:border-muted-foreground/50'}`}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
            <svg className={`w-12 h-12 mb-4 transition-colors ${isDragging ? 'text-primary dark:text-primary' : 'text-muted-foreground/50'}`} aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
            <p className="mb-2 text-md text-muted-foreground">
                <span className="font-semibold text-primary dark:text-primary">{t('fileUploadCTA')}</span> {t('fileUploadDrag')}
            </p>
            <p className="text-xs text-muted-foreground/80">{t('fileUploadHint')}</p>
        </div>
        <input 
            id="dropzone-file" 
            type="file" 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleFileChange}
            accept=".pdf"
            disabled={disabled}
        />
      </div>
    </div>
  );
};

export default FileUpload;