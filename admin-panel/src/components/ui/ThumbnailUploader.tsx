'use client';

import { useRef } from 'react';
import Image from 'next/image';

interface ThumbnailUploaderProps {
  thumbnailPreview: string | null;
  onThumbnailSelect: (file: File | null) => void;
}

export const ThumbnailUploader = ({ thumbnailPreview, onThumbnailSelect }: ThumbnailUploaderProps) => {
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="mt-1 flex items-center space-x-4">
      <div className="flex-shrink-0 h-24 w-40 rounded overflow-hidden bg-gray-100 dark:bg-gray-700 relative">
        {thumbnailPreview ? (
          <Image
            src={thumbnailPreview}
            alt="Thumbnail preview"
            fill
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400">
            No image
          </div>
        )}
      </div>
      <button
        type="button"
        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
        onClick={() => thumbnailInputRef.current?.click()}
      >
        Upload
      </button>
      <input
        type="file"
        className="sr-only"
        ref={thumbnailInputRef}
        accept="image/*"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            onThumbnailSelect(e.target.files[0]);
          }
        }}
      />
    </div>
  );
};
