'use client';

import { availableCategories } from '@/types/upload';

interface CategorySelectorProps {
  selectedCategories: string[];
  onCategoryChange: (category: string) => void;
}

export const CategorySelector = ({ selectedCategories, onCategoryChange }: CategorySelectorProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
      {availableCategories.map((category) => (
        <div key={category} className="flex items-center">
          <input
            id={`category-${category}`}
            name={`category-${category}`}
            type="checkbox"
            checked={selectedCategories.includes(category)}
            onChange={() => onCategoryChange(category)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700"
          />
          <label
            htmlFor={`category-${category}`}
            className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
          >
            {category}
          </label>
        </div>
      ))}
    </div>
  );
};
