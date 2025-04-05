'use client';

import { useState, ChangeEvent } from 'react';
import { VideoFormData } from '@/types/upload';
import { useVideoUpload } from './useVideoUpload';

export const useVideoUploadForm = (initialData?: Partial<VideoFormData>) => {
  const [formData, setFormData] = useState<VideoFormData>({
    title: '',
    description: '',
    categories: [],
    tags: '',
    releaseDate: '',
    videoFile: null,
    thumbnail: null,
    status: 'draft',
    isPublic: true,
    ...initialData
  });

  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  // Use our React Query-powered hook for uploads
  const { 
    uploadVideo, 
    uploadProgress, 
    isUploading,
    isSuccess,
    isError,
    reset: resetUploadState 
  } = useVideoUpload();

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleCategoryChange = (category: string) => {
    setFormData(prev => {
      if (prev.categories.includes(category)) {
        return {
          ...prev,
          categories: prev.categories.filter(c => c !== category)
        };
      } else {
        return {
          ...prev,
          categories: [...prev.categories, category]
        };
      }
    });
  };

  const handleFileSelect = (name: 'videoFile' | 'thumbnail', file: File | null) => {
    setFormData(prev => ({ ...prev, [name]: file }));
    
    // Create and set thumbnail preview if it's a thumbnail file
    if (name === 'thumbnail' && file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnailPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      categories: [],
      tags: '',
      releaseDate: '',
      videoFile: null,
      thumbnail: null,
      status: 'draft',
      isPublic: true
    });
    setThumbnailPreview(null);
    resetUploadState();
  };

  const submitForm = async () => {
    try {
      // Use the real upload implementation from React Query
      const success = await uploadVideo(formData);
      
      if (success && isSuccess) {
        // Only reset the form on success
        setTimeout(() => {
          resetForm();
          alert('Upload successful!');
        }, 1000);
      } else if (isError) {
        alert('Upload failed. Please try again.');
      }
      
      return success;
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
      return false;
    }
  };

  return {
    formData,
    uploadProgress,
    isUploading,
    thumbnailPreview,
    handleChange,
    handleCheckboxChange,
    handleCategoryChange,
    handleFileSelect,
    submitForm,
    resetForm
  };
};
