'use client';

interface ProgressBarProps {
  progress: number;
  label?: string;
}

export const ProgressBar = ({ progress, label }: ProgressBarProps) => {
  return (
    <div className="mt-2">
      {label && (
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
          {label}: {progress}%
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div 
          className="bg-blue-600 h-2.5 rounded-full dark:bg-blue-500" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};
