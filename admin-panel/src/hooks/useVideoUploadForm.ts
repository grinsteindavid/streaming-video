'use client';

import { useState, ChangeEvent } from 'react';
import { VideoFormData } from '@/types/upload';

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

  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

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
    setUploadProgress(0);
  };

  const submitForm = async () => {
    try {
      setIsUploading(true);
      
      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 5;
        if (progress > 100) {
          clearInterval(interval);
          setIsUploading(false);
          setUploadProgress(100);
          setTimeout(() => {
            resetForm();
            alert('Upload successful!');
          }, 1000);
        } else {
          setUploadProgress(progress);
        }
      }, 200);
      
      // In real implementation:
      // const formData = new FormData();
      // for (const [key, value] of Object.entries(formData)) {
      //   if (value instanceof File) {
      //     formData.append(key, value);
      //   } else if (Array.isArray(value)) {
      //     formData.append(key, JSON.stringify(value));
      //   } else if (value !== null && value !== undefined) {
      //     formData.append(key, String(value));
      //   }
      // }
      // const response = await fetch('/api/videos/upload', {
      //   method: 'POST',
      //   body: formData,
      //   onUploadProgress: (progressEvent) => {
      //     const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      //     setUploadProgress(percentCompleted);
      //   }
      // });
      // const data = await response.json();
      
      return true;
    } catch (error) {
      console.error('Upload failed:', error);
      setIsUploading(false);
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
