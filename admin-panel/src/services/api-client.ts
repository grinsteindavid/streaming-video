/**
 * Base API client that can be used with real endpoints later
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export const apiClient = {
  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`);
    
    if (!response.ok) {
      throw new ApiError(response.status, `API Error: ${response.statusText}`);
    }
    
    return response.json() as Promise<T>;
  },
  
  async post<T, U>(endpoint: string, data: T): Promise<U> {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new ApiError(response.status, `API Error: ${response.statusText}`);
    }
    
    return response.json() as Promise<U>;
  },
  
  async put<T, U>(endpoint: string, data: T): Promise<U> {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new ApiError(response.status, `API Error: ${response.statusText}`);
    }
    
    return response.json() as Promise<U>;
  },
  
  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new ApiError(response.status, `API Error: ${response.statusText}`);
    }
    
    return response.json() as Promise<T>;
  },

  // Special method for file uploads
  async uploadFile<T>(endpoint: string, formData: FormData, onProgress?: (progress: number) => void): Promise<T> {
    // Using XMLHttpRequest to track progress
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      xhr.open('POST', `${API_URL}${endpoint}`);
      
      if (onProgress) {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const percentComplete = Math.round((event.loaded / event.total) * 100);
            onProgress(percentComplete);
          }
        });
      }
      
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch (error) {
            reject(new Error('Failed to parse response'));
          }
        } else {
          reject(new ApiError(xhr.status, `API Error: ${xhr.statusText}`));
        }
      };
      
      xhr.onerror = () => {
        reject(new Error('Network error occurred'));
      };
      
      xhr.send(formData);
    });
  }
};
