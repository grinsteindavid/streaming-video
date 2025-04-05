'use client';

import { FormEvent } from 'react';
import { useVideoUploadForm } from '@/hooks/useVideoUploadForm';
import { ProgressBar } from '@/components/ui/ProgressBar';
import {
  VideoUploadSection,
  BasicInfoSection,
  DescriptionSection,
  CategoriesSection,
  TagsSection,
  ThumbnailSection,
  PublishingOptionsSection
} from './FormSections';

export default function UploadForm() {
  const {
    formData,
    uploadProgress,
    isUploading,
    thumbnailPreview,
    handleChange,
    handleCheckboxChange,
    handleCategoryChange,
    handleFileSelect,
    submitForm
  } = useVideoUploadForm();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await submitForm();
  };

  const handleSaveAsDraft = () => {
    // In a real app, this would save the form data as a draft
    alert('Saved as draft! (This is just a placeholder)');
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Video Upload */}
          <VideoUploadSection 
            formData={formData}
            onFileSelect={handleFileSelect}
          />

          {/* Basic Information */}
          <BasicInfoSection
            formData={formData}
            onInputChange={handleChange}
          />

          {/* Description */}
          <DescriptionSection
            formData={formData}
            onInputChange={handleChange}
          />

          {/* Categories */}
          <CategoriesSection
            formData={formData}
            onCategoryChange={handleCategoryChange}
          />

          {/* Tags */}
          <TagsSection
            formData={formData}
            onInputChange={handleChange}
          />

          {/* Thumbnail */}
          <ThumbnailSection
            thumbnailPreview={thumbnailPreview}
            onFileSelect={handleFileSelect}
          />

          {/* Publishing Options */}
          <PublishingOptionsSection
            formData={formData}
            onInputChange={handleChange}
            onCheckboxChange={handleCheckboxChange}
          />

          {/* Submit Button */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleSaveAsDraft}
              className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
            >
              Save as Draft
            </button>
            <button
              type="submit"
              disabled={isUploading || !formData.videoFile || !formData.title}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed dark:bg-blue-700 dark:hover:bg-blue-800"
            >
              {isUploading ? 'Uploading...' : 'Upload Video'}
            </button>
          </div>
          
          {/* Upload Progress Bar */}
          {isUploading && (
            <ProgressBar 
              progress={uploadProgress} 
              label="Uploading"
            />
          )}
        </form>
      </div>
    </div>
  );
}
