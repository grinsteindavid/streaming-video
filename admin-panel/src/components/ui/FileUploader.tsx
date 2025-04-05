'use client';

import { useState, useRef, ChangeEvent } from 'react';

interface FileUploaderProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
  accept: string;
  label: string;
  description?: string;
  allowDragDrop?: boolean;
}

export const FileUploader = ({
  onFileSelect,
  selectedFile,
  accept,
  label,
  description,
  allowDragDrop = true
}: FileUploaderProps) => {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (allowDragDrop) setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (allowDragDrop && e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      // Check if file type matches accepted types
      const acceptTypes = accept.split(',').map(type => type.trim());
      const fileType = file.type;
      
      if (acceptTypes.some(type => {
        if (type.includes('*')) {
          // Handle wildcards like 'video/*'
          return fileType.startsWith(type.replace('*', ''));
        }
        return type === fileType;
      })) {
        onFileSelect(file);
      }
    }
  };

  return (
    <div
      className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md ${dragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600'}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="space-y-1 text-center">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          stroke="currentColor"
          fill="none"
          viewBox="0 0 48 48"
          aria-hidden="true"
        >
          <path
            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4h-12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div className="flex text-sm text-gray-600 dark:text-gray-400">
          <label
            htmlFor={`file-upload-${label.replace(/\s+/g, '-').toLowerCase()}`}
            className="relative cursor-pointer bg-white dark:bg-gray-700 rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
          >
            <span>{selectedFile ? 'Replace' : 'Upload a'} {label.toLowerCase()}</span>
            <input
              id={`file-upload-${label.replace(/\s+/g, '-').toLowerCase()}`}
              name={`file-upload-${label.replace(/\s+/g, '-').toLowerCase()}`}
              type="file"
              className="sr-only"
              accept={accept}
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          </label>
          {allowDragDrop && <p className="pl-1">or drag and drop</p>}
        </div>
        {description && (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {description}
          </p>
        )}
        {selectedFile && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Current file: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
          </p>
        )}
      </div>
    </div>
  );
};
