'use client';

import { VideoFormData } from '@/types/upload';
import { FileUploader } from '@/components/ui/FileUploader';
import { ThumbnailUploader } from '@/components/ui/ThumbnailUploader';
import { CategorySelector } from '@/components/ui/CategorySelector';
import { ChangeEvent } from 'react';

interface FormSectionProps {
  formData: VideoFormData;
  onInputChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onCheckboxChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onCategoryChange: (category: string) => void;
  onFileSelect: (name: 'videoFile' | 'thumbnail', file: File | null) => void;
  thumbnailPreview: string | null;
}

export const VideoUploadSection = ({ 
  formData, 
  onFileSelect 
}: Pick<FormSectionProps, 'formData' | 'onFileSelect'>) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Video File</label>
      <FileUploader
        onFileSelect={(file) => onFileSelect('videoFile', file)}
        selectedFile={formData.videoFile}
        accept="video/*"
        label="Video file"
        description="MP4, WebM, Ogg up to 2GB"
        allowDragDrop={true}
      />
      {formData.videoFile && (
        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Selected file: <span className="font-medium">{formData.videoFile.name}</span> ({Math.round(formData.videoFile.size / 1024 / 1024 * 10) / 10} MB)
        </div>
      )}
    </div>
  );
};

export const BasicInfoSection = ({ 
  formData, 
  onInputChange 
}: Pick<FormSectionProps, 'formData' | 'onInputChange'>) => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Title *
        </label>
        <input
          type="text"
          name="title"
          id="title"
          required
          value={formData.title}
          onChange={onInputChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>
      
      <div>
        <label htmlFor="releaseDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Release Date
        </label>
        <input
          type="date"
          name="releaseDate"
          id="releaseDate"
          value={formData.releaseDate}
          onChange={onInputChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>
    </div>
  );
};

export const DescriptionSection = ({ 
  formData, 
  onInputChange 
}: Pick<FormSectionProps, 'formData' | 'onInputChange'>) => {
  return (
    <div>
      <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Description
      </label>
      <textarea
        id="description"
        name="description"
        rows={4}
        value={formData.description}
        onChange={onInputChange}
        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
      />
    </div>
  );
};

export const CategoriesSection = ({ 
  formData, 
  onCategoryChange 
}: Pick<FormSectionProps, 'formData' | 'onCategoryChange'>) => {
  return (
    <div>
      <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Categories
      </span>
      <CategorySelector 
        selectedCategories={formData.categories}
        onCategoryChange={onCategoryChange}
      />
    </div>
  );
};

export const TagsSection = ({ 
  formData, 
  onInputChange 
}: Pick<FormSectionProps, 'formData' | 'onInputChange'>) => {
  return (
    <div>
      <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Tags (comma separated)
      </label>
      <input
        type="text"
        name="tags"
        id="tags"
        value={formData.tags}
        onChange={onInputChange}
        placeholder="e.g. javascript, programming, tutorial"
        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
      />
    </div>
  );
};

export const ThumbnailSection = ({ 
  thumbnailPreview, 
  onFileSelect 
}: Pick<FormSectionProps, 'thumbnailPreview' | 'onFileSelect'>) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Thumbnail Image
      </label>
      <ThumbnailUploader 
        thumbnailPreview={thumbnailPreview}
        onThumbnailSelect={(file) => onFileSelect('thumbnail', file)}
      />
    </div>
  );
};

export const PublishingOptionsSection = ({ 
  formData, 
  onInputChange,
  onCheckboxChange 
}: Pick<FormSectionProps, 'formData' | 'onInputChange' | 'onCheckboxChange'>) => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Status
        </label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={onInputChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>
      
      <div className="flex items-center h-full pt-6">
        <input
          id="isPublic"
          name="isPublic"
          type="checkbox"
          checked={formData.isPublic}
          onChange={onCheckboxChange}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700"
        />
        <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
          Make this content publicly accessible
        </label>
      </div>
    </div>
  );
};
