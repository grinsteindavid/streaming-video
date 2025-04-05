export interface VideoFormData {
  title: string;
  description: string;
  categories: string[];
  tags: string;
  releaseDate: string;
  videoFile: File | null;
  thumbnail: File | null;
  status: 'published' | 'draft';
  isPublic: boolean;
}

export const availableCategories = [
  'Programming',
  'Web Development',
  'Mobile Development',
  'Data Science',
  'Machine Learning',
  'DevOps',
  'Design',
  'Business',
  'Marketing',
  'Productivity'
];
